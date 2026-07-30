import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  uploadResume,
  listResumes,
  getResume,
  scoreResume,
  deleteResume
} from "../controllers/resumeController.js";

const router = Router();

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", listResumes);
router.get("/:id", getResume);
router.post("/:id/score", scoreResume);
router.delete("/:id", deleteResume);

export default router;