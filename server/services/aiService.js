import { callGemini } from "./aiClient.js";
import { getSystemPrompt } from "../prompts/prompts.js";
import { generateProjectAdvice } from "./projectService.js";

import {
  getChatHistory,
  saveChatHistory,
} from "../memory/chatMemory.js";

export const generateAIResponse = async (conversation, mode) => {
  const chats = getChatHistory();

  const latestUserMessage = conversation[conversation.length - 1];

  chats.push({
    role: "user",
    text: latestUserMessage.text,
  });

  const chatHistory = conversation
    .map((msg) => `${msg.role}: ${msg.text}`)
    .join("\n");

  if (mode === "project-advisor") {
    const reply = await generateProjectAdvice(chatHistory);

    chats.push({
      role: "ai",
      text: reply,
    });

    saveChatHistory(chats);

    return reply;
  }

  const systemPrompt = getSystemPrompt(mode);

  const reply = await callGemini(systemPrompt, chatHistory);

  chats.push({
    role: "ai",
    text: reply,
  });

  saveChatHistory(chats);

  return reply;
};