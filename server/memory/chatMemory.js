import fs from "fs";

const CHAT_FILE = "./data/chats.json";

export const getChatHistory = () => 
    {
  const data = fs.readFileSync(CHAT_FILE, "utf-8");

  return data.trim() ? JSON.parse(data) : [];
};

export const saveChatHistory = (chats) => 
    {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(chats, null, 2));
};

export const clearChatHistory = () => {
  fs.writeFileSync(CHAT_FILE, "[]");
};