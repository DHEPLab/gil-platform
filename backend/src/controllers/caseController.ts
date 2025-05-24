import { Request, Response, NextFunction } from "express";
import csvParser from "csv-parser";
import { AppDataSource } from "../index";
import { Case } from "../entities/Case";
import { sendCsv } from "../utils/csv";
import stream from "stream";

interface RawCaseRow {
  age: string;
  sex: string;
  occupation: string;
  immunizations?: string;
  chronicIllnesses?: string;
  minorIllnesses?: string;
  familySocialHistory: string;
  chiefComplaint: string;
  currentSymptoms: string;
}

const caseRepo = () => AppDataSource.getRepository(Case);

/**
 * @openapi
 * components:
 *   schemas:
 *     CaseInputRow:
 *       type: object
 *       required:
 *         - age
 *         - sex
 *         - occupation
 *         - familySocialHistory
 *         - chiefComplaint
 *         - currentSymptoms
 *       properties:
 *         age:
 *           type: string
 *           description: Patient age as integer string
 *         sex:
 *           type: string
 *         occupation:
 *           type: string
 *         immunizations:
 *           type: string
 *           description: Semicolon-delimited list
 *         chronicIllnesses:
 *           type: string
 *           description: Semicolon-delimited list
 *         minorIllnesses:
 *           type: string
 *           description: Semicolon-delimited list
 *         familySocialHistory:
 *           type: string
 *         chiefComplaint:
 *           type: string
 *         currentSymptoms:
 *           type: string
 *           description: Semicolon-delimited list
 *
 *     CaseEntity:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         age:
 *           type: integer
 *         sex:
 *           type: string
 *         occupation:
 *           type: string
 *         immunizations:
 *           type: array
 *           items:
 *             type: string
 *         chronicIllnesses:
 *           type: array
 *           items:
 *             type: string
 *         minorIllnesses:
 *           type: array
 *           items:
 *             type: string
 *         familySocialHistory:
 *           type: string
 *         chiefComplaint:
 *           type: string
 *         currentSymptoms:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /api/cases/upload:
 *   post:
 *     summary: Upload a CSV of clinical cases
 *     tags:
 *       - Cases
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file matching headers: age,sex,occupation,immunizations,chronicIllnesses,minorIllnesses,familySocialHistory,chiefComplaint,currentSymptoms
 *     responses:
 *       '200':
 *         description: Number of imported cases
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imported:
 *                   type: integer
 *       '400':
 *         description: No file provided
 *       '500':
 *         description: Internal server error
 */
export const uploadCases = (
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction,
): void => {
  if (!req.file) {
    res.status(400).json({ message: "CSV required" });
    return;
  }

  const results: RawCaseRow[] = [];
  const rs = new stream.PassThrough();
  rs.end(req.file.buffer);

  rs.pipe(csvParser())
    .on("data", (row: RawCaseRow) => {
      results.push(row);
    })
    .on("end", async () => {
      try {
        const entities = results.map((r) =>
          caseRepo().create({
            age: parseInt(r.age, 10),
            sex: r.sex,
            occupation: r.occupation,
            immunizations: r.immunizations
              ? r.immunizations.split(";").map((s) => s.trim())
              : [],
            chronicIllnesses: r.chronicIllnesses
              ? r.chronicIllnesses.split(";").map((s) => s.trim())
              : [],
            minorIllnesses: r.minorIllnesses
              ? r.minorIllnesses.split(";").map((s) => s.trim())
              : [],
            familySocialHistory: r.familySocialHistory,
            chiefComplaint: r.chiefComplaint,
            currentSymptoms: r.currentSymptoms.split(";").map((s) => s.trim()),
          }),
        );
        await caseRepo().save(entities);
        res.json({ imported: entities.length });
      } catch (err) {
        next(err);
      }
    })
    .on("error", (err: Error) => {
      next(err);
    });
};

/**
 * @openapi
 * /api/cases:
 *   get:
 *     summary: List all clinical cases
 *     tags:
 *       - Cases
 *     responses:
 *       '200':
 *         description: Array of Case entities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CaseEntity'
 *       '500':
 *         description: Internal server error
 */
export const listCases = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allCases = await caseRepo().find();
    res.json(allCases);
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /api/cases/export:
 *   get:
 *     summary: Export all cases as CSV
 *     tags:
 *       - Cases
 *     responses:
 *       '200':
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       '500':
 *         description: Internal server error
 */
export const exportCases = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allCases = await caseRepo().find();
    sendCsv(res, allCases, "cases_export.csv");
  } catch (err) {
    next(err);
  }
};
