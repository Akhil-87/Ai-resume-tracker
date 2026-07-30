import { Router } from "express";
import {
  createApplication,
  listApplications,
  updateApplication,
  updateStatus,
  deleteApplication
} from "../controllers/applicationController.js";

const router = Router();

router.post("/", createApplication);
router.get("/", listApplications);
router.put("/:id", updateApplication);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteApplication);

export default router;