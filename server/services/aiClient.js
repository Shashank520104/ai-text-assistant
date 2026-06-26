import ai from "../config/gemini.js";

export const callGemini = async (systemPrompt, chatHistory) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
${systemPrompt}

Conversation History:
${chatHistory}
`,
  });

  return response.text;
};