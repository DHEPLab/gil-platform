import { Router } from "express";
import {
  recordResponse,
  listMyResponses,
} from "../controllers/responseController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
router.use(authMiddleware);
router.post("/", recordResponse);
router.get("/me", listMyResponses);

export default router;
