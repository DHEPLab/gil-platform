import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../index";
import { UserResponse } from "../entities/UserResponse";
import { Case } from "../entities/Case";

const respRepo = () => AppDataSource.getRepository(UserResponse);
const caseRepo = () => AppDataSource.getRepository(Case);

/**
 * @openapi
 * components:
 *   schemas:
 *     RecordResponseInput:
 *       type: object
 *       required:
 *         - caseId
 *         - isReal
 *       properties:
 *         caseId:
 *           type: string
 *           format: uuid
 *           description: ID of the case being responded to
 *         isReal:
 *           type: boolean
 *           description: True if the user marks the case as real, false if synthetic
 *
 *     UserResponseEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         user:
 *           $ref: '#/components/schemas/UserEntity'
 *         case:
 *           $ref: '#/components/schemas/CaseEntity'
 *         isReal:
 *           type: boolean
 *         respondedAt:
 *           type: string
 *           format: date-time
 *
 * /api/responses:
 *   post:
 *     summary: Record a user's classification of a clinical case
 *     tags:
 *       - Responses
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordResponseInput'
 *     responses:
 *       '200':
 *         description: The recorded response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseEntity'
 *       '401':
 *         description: Unauthorized (user not logged in)
 *       '404':
 *         description: Case not found
 *       '500':
 *         description: Internal server error
 */
export const recordResponse = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).end();
      return;
    }
    const { caseId, isReal } = req.body;
    const c = await caseRepo().findOne({ where: { id: caseId } });
    if (!c) {
      res.status(404).json({ message: "Case not found" });
      return;
    }

    const resp = respRepo().create({
      user: req.user,
      case: c,
      isReal: Boolean(isReal),
    });
    await respRepo().save(resp);
    res.json(resp);
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /api/responses/me:
 *   get:
 *     summary: List all responses by the current user
 *     tags:
 *       - Responses
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Array of the user's past responses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponseEntity'
 *       '401':
 *         description: Unauthorized (user not logged in)
 *       '500':
 *         description: Internal server error
 */
export const listMyResponses = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).end();
      return;
    }
    const list = await respRepo().find({
      where: { user: { id: req.user.id } },
      relations: ["case"],
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
};
