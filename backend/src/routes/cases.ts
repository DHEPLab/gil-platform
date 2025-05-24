import { Router } from "express";
import multer from "multer";
import {
  uploadCases,
  listCases,
  exportCases,
} from "../controllers/caseController";
import { authMiddleware } from "../middlewares/auth";

const upload = multer(); // memory
const router = Router();

router.use(authMiddleware);
router.post("/upload", upload.single("file"), uploadCases);
router.get("/", listCases);
router.get("/export", exportCases);

export default router;
