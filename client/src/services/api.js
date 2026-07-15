const BASE_URL =
  import.meta.env.VITE_API_URL || "https://ai-text-assistant-76u1.onrender.com";

export const fetchHistory = async () => {
  const response = await fetch(`${BASE_URL}/ai/history`);

  if (!response.ok) {
    throw new Error("Failed to load chat history.");
  }

  return response.json();
};

export const sendChat = async (conversation, mode) => {
  const response = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      conversation,
      mode,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate AI response.");
  }

  return response.json();
};

export const clearChatHistory = async () => {
  const response = await fetch(`${BASE_URL}/ai/history`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear chat history.");
  }
};

export const analyzeResume = async (resumeFile, jobRole) => {
  const formData = new FormData();

  formData.append("resume", resumeFile);
  formData.append("jobRole", jobRole);

  const response = await fetch(
    `${BASE_URL}/resume/resume-analysis`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Resume analysis failed.");
  }

  return result.data;
};