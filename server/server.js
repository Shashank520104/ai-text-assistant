// Creating First AI Text Generator

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import { text } from "stream/consumers";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());





// Gemini Initialization


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});




// Server Check Route


app.get("/check", (req, res) => {
    res.send("Server says Hello..!");
});



// Preserving the old history of chats..//

app.get("/history",async(req,res)=>{
    const data=fs.readFileSync("./data/chats.json","utf-8");

    const chats=data.trim()?JSON.parse(data):[];

    res.status(201).json(chats);

});




// Chat Route


app.post("/chat", async (req, res) => 

    {
        console.log(process.cwd());

    try 
    
    {

        const { conversation, mode } = req.body;


if (!conversation || conversation.length === 0) 
    {

    return res.status(400).json({
        error: "Conversation is required",
    });
}

const data = fs.readFileSync("./data/chats.json", "utf-8");

const chats = data.trim() ? JSON.parse(data) : [];

const latestUserMessage = conversation[conversation.length - 1];

chats.push({
    role: "user",
    text: latestUserMessage.text,
});

fs.writeFileSync(
    "./data/chats.json",
    JSON.stringify(chats, null, 2)
);

console.log("Saved latest message:", latestUserMessage.text);
console.log("Saved chats count:", chats.length);



        if (!conversation || conversation.length === 0) {
            return res.status(400).json({
                error: "Conversation is required",
            });
        }

        let systemPrompt = "";

        if (mode === "mentor") {
            systemPrompt = `
You are an experienced Placement Mentor.
Guide students about placements, internships, career growth, and resume building.
Give realistic advice.
`;
        } else if (mode === "interviewer") {
            systemPrompt = `
You are a Product Company Interviewer.
Ask technical questions, evaluate answers, and give constructive feedback.
`;
        } else if (mode === "coder") {
            systemPrompt = `
You are a Senior MERN Stack Developer.
Explain concepts clearly, help debug code, and teach from beginner to advanced level.
`;
        } else {
            systemPrompt = `
You are a helpful AI assistant.
Answer clearly and simply.
`;
        }

        const chatHistory = conversation
            .map((msg) => `${msg.role}: ${msg.text}`)
            .join("\n");

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
${systemPrompt}

Conversation History:
${chatHistory}
`,
        });

        // save AI response..//

        const aiMessages={
            role:"ai",
            text:response.text,
        };

        chats.push(aiMessages);

        fs.writeFileSync(
    "./data/chats.json",
    JSON.stringify(chats, null, 2)
);



        res.status(200).json({
            reply: response.text,
        });

    } catch (error) {
        console.error("Gemini route error:", error);

        res.status(500).json({
            error: "Something went wrong processing your AI request",
            details: error.message,
        });
    }
});

// Start Server
app.listen(8000, () => {
    console.log("Server Started At Port 8000");
});