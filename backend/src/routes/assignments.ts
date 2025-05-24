import { Router } from "express";
import {
  assignCases,
  listAssignments,
  listMyAssignments,
} from "../controllers/assignmentController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
router.use(authMiddleware);

router.post("/", assignCases);
router.get("/", listAssignments);
router.get("/me", listMyAssignments);

export default router;
