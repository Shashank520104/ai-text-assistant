import { callGemini } from "./aiClient.js";
import { getSystemPrompt } from "../prompts/prompts.js";

import {
  getChatHistory,
  saveChatHistory,
} from "../memory/chatMemory.js";

export const generateAIResponse = async (conversation, mode) => {
  // Get previous chats
  const chats = getChatHistory();

  // Save latest user message
  const latestUserMessage = conversation[conversation.length - 1];

  chats.push({
    role: "user",
    text: latestUserMessage.text,
  });

  // Get system prompt
  const systemPrompt = getSystemPrompt(mode);

  // Convert conversation into Gemini format
  const chatHistory = conversation
    .map((msg) => `${msg.role}: ${msg.text}`)
    .join("\n");

  // Call Gemini through AI Client
  const reply = await callGemini(systemPrompt, chatHistory);

  // Save AI reply
  chats.push({
    role: "ai",
    text: reply,
  });

  saveChatHistory(chats);

  return reply;
};