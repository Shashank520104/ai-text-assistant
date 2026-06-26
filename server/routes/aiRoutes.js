import express from "express";
import {
  chatController,
  getHistoryController,
  clearHistoryController,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", chatController);
router.get("/history", getHistoryController);
router.delete("/history", clearHistoryController);

export default router;