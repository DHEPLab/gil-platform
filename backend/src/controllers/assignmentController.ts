import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../index";
import { Assignment } from "../entities/Assignment";
import { Case } from "../entities/Case";
import { User } from "../entities/User";

const assignRepo = () => AppDataSource.getRepository(Assignment);
const userRepo = () => AppDataSource.getRepository(User);
const caseRepo = () => AppDataSource.getRepository(Case);

/**
 * @openapi
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user:
 *           $ref: '#/components/schemas/User'
 *         case:
 *           $ref: '#/components/schemas/Case'
 *         assignedAt:
 *           type: string
 *           format: date-time
 *     AssignCasesRequest:
 *       type: object
 *       required:
 *         - userId
 *         - caseIds
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         caseIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *     AssignCasesResponse:
 *       type: object
 *       properties:
 *         assigned:
 *           type: integer
 *
 * /api/assignments:
 *   post:
 *     summary: Manually assign specific cases to a user
 *     tags:
 *       - Assignments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignCasesRequest'
 *     responses:
 *       '200':
 *         description: Number of cases assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignCasesResponse'
 *       '400':
 *         description: Missing or invalid parameters
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
export const assignCases = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, caseIds } = req.body;
    if (!userId || !Array.isArray(caseIds)) {
      res.status(400).json({ message: "userId and caseIds required" });
      return;
    }

    const user = await userRepo().findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const cases = await caseRepo().findByIds(caseIds);
    const assignments = cases.map((c) =>
      assignRepo().create({ user, case: c }),
    );
    await assignRepo().save(assignments);
    res.json({ assigned: assignments.length });
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /api/assignments:
 *   get:
 *     summary: List all user–case assignments (admin use)
 *     tags:
 *       - Assignments
 *     responses:
 *       '200':
 *         description: Array of all assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       '500':
 *         description: Internal server error
 */
export const listAssignments = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const list = await assignRepo().find({
      relations: ["user", "case"],
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /api/assignments/me:
 *   get:
 *     summary: List cases assigned to the current user
 *     tags:
 *       - Assignments
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Array of assignments for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       '401':
 *         description: Unauthorized (no user in request)
 *       '500':
 *         description: Internal server error
 */
export const listMyAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const list = await assignRepo().find({
      where: { user: { id: req.user.id } },
      relations: ["case"],
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};
