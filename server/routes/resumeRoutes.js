import express from "express";
import { analyzeResumeController } from "../controllers/resumeController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/resume-analysis",
  (req, res, next) => {
    console.log("Resume route hit");
    next();
  },
  upload.single("resume"),
  analyzeResumeController
);

export default router;