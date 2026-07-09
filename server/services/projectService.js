import { callGemini } from "./aiClient.js";

export const generateProjectAdvice = async (chatHistory) => {
  const systemPrompt = `
You are a Senior Software Architect and AI Project Mentor.

Recommend projects based on the user's skills and goal.

Return:
CURRENT LEVEL
PROJECT RECOMMENDATIONS
DIFFICULTY
TECH STACK
PLACEMENT VALUE
FINAL RECOMMENDATION
`;

  const reply = await callGemini(systemPrompt, chatHistory);

  return reply;
};