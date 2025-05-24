import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { uploadAvatar } from "../utils/s3";
import { AppDataSource } from "../index";
import { User } from "../entities/User";

const userRepo = () => AppDataSource.getRepository(User);
const upload = multer(); // in-memory storage

export const uploadAvatarMiddleware = upload.single("avatar");

/**
 * @openapi
 * components:
 *   schemas:
 *     AvatarUploadResponse:
 *       type: object
 *       properties:
 *         avatarUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *
 * /api/users/me/avatar:
 *   post:
 *     summary: Upload or replace the current user's avatar
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: URL of the newly uploaded avatar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AvatarUploadResponse"
 *       "400":
 *         description: Missing file or user context
 *       "401":
 *         description: Unauthorized
 *       "500":
 *         description: Internal server error
 */
export const uploadAvatarHandler = async (
  req: Request & { user?: User; file?: Express.Multer.File },
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file || !req.user) {
      res.status(400).json({ message: "No file or no user" });
      return;
    }

    const url = await uploadAvatar(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );
    req.user.avatarUrl = url;
    await userRepo().save(req.user);
    res.json({ avatarUrl: url });
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Get the current user's profile
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: The authenticated user's profile (no password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: "#/components/schemas/UserEntity"
 *       "401":
 *         description: Unauthorized
 *       "500":
 *         description: Internal server error
 */
export const getProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (!req.user) {
      res.status(401).end();
      return;
    }
    const { password: _pw, ...sanitized } = req.user;
    res.json({ user: sanitized });
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateProfileInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         bio:
 *           type: string
 *         demographics:
 *           type: object
 *         medicalHistory:
 *           type: string
 *         background:
 *           type: string
 *
 * /api/users/me:
 *   put:
 *     summary: Update the current user's profile fields
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateProfileInput"
 *     responses:
 *       "200":
 *         description: The updated user (no password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: "#/components/schemas/UserEntity"
 *       "401":
 *         description: Unauthorized
 *       "500":
 *         description: Internal server error
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).end();
      return;
    }

    const { name, dob, bio, demographics, medicalHistory, background } =
      req.body;

    Object.assign(req.user, {
      name,
      dob,
      bio,
      demographics,
      medicalHistory,
      background,
    });

    await userRepo().save(req.user);
    const { password: _pw, ...sanitized } = req.user;
    res.json({ user: sanitized });
  } catch (err) {
    next(err);
  }
};

/**
 * @openapi
 * /api/users/me/avatar:
 *   delete:
 *     summary: Remove the current user's avatar (reset to default)
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       "200":
 *         description: Avatar cleared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AvatarUploadResponse"
 *       "401":
 *         description: Unauthorized
 *       "500":
 *         description: Internal server error
 */
export const deleteAvatarHandler = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).end();
      return;
    }
    req.user.avatarUrl = null;
    await userRepo().save(req.user);
    res.json({ avatarUrl: null });
  } catch (err) {
    next(err);
  }
};
