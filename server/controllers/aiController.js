import { generateAIResponse } from "../services/aiService.js";

import {
  getChatHistory,
  clearChatHistory,
} from "../memory/chatMemory.js";

export const chatController = async (req, res) => {
  try {
    const { conversation, mode } = req.body;

    if (!conversation || conversation.length === 0) {
      return res.status(400).json({
        error: "Conversation is required",
      });
    }

    const reply = await generateAIResponse(conversation, mode);

    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("Chat Controller Error:", error);

    res.status(500).json({
      error: "Something went wrong processing your AI request",
      details: error.message,
    });
  }
};

export const getHistoryController = (req, res) => {
  const chats = getChatHistory();

  res.status(200).json(chats);
};

export const clearHistoryController = (req, res) => {
  clearChatHistory();

  res.status(200).json({
    message: "History Cleared",
  });
};