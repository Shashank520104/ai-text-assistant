import { analyzeResume } from "../services/resumeService.js";

export const analyzeResumeController = async (req, res) => {
  try {
    console.log("Uploaded File:", req.file);
    console.log("Body Data:", req.body);

    const { jobRole } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const result = await analyzeResume(req.file.path, jobRole);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};