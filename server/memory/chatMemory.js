import fs from "fs";
import path from "path";

const DATA_DIR = "./data";
const CHAT_FILE = path.join(DATA_DIR, "chats.json");


if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}


if (!fs.existsSync(CHAT_FILE)) {
  fs.writeFileSync(CHAT_FILE, "[]");
}

export const getChatHistory = () => {
  const data = fs.readFileSync(CHAT_FILE, "utf-8");
  return data.trim() ? JSON.parse(data) : [];
};

export const saveChatHistory = (chats) => {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(chats, null, 2));
};

export const clearChatHistory = () => {
  fs.writeFileSync(CHAT_FILE, "[]");
};