// Creating First AI text generator..//

// creating Express Server..//
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai"; // 1. Added the missing SDK import

dotenv.config();

const app = express();   // create express application..//
app.use(cors());    // connects frontend with backend..//
app.use(express.json());    // returns json formate data..//

// 2. Initialized the SDK instance (it automatically reads GEMINI_API_KEY from .env)
const ai = new GoogleGenAI({});

// server checking routes// 
app.get("/check", (req, res) => {
    res.send("Server says Hello..!");
});

// gemini api calling route//..
app.post("/chat", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            // Replaced 500 with 400 (Bad Request) since it's a client user input issue
            return res.status(400).json({
                error: "Please provide a valid Prompt.."
            });
        }

        // 3. Changed 'Ai' to lowercase 'ai' to match our initialized instance
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.status(200).json({
            reply: response.text
        });
    }
    catch (error) {
        console.error("Gemini route error:", error);
        res.status(500).json({
            error: "Something went wrong processing your AI request"
        });
    }
});

//server starts// 
app.listen(8000, () => {
    console.log(`Server Started At port Number ${8000}`);
});