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


app.get("/history",async(req,res)=>
    {

    const data=fs.readFileSync("./data/chats.json","utf-8");

    const chats=data.trim()?JSON.parse(data):[];

    res.status(201).json(chats);

});

app.delete("/history",(req,res)=>
{
    fs.writeFileSync("./data/chats.json","[]");

    res.status(200).json({message:"History Cleared"});
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
        } 
        


else if(mode === "interviewer")
{
    systemPrompt = `
You are a Senior Software Engineer conducting a technical interview.

Responsibilities:

1. Ask one interview question at a time.
2. Wait for candidate answer.
3. Evaluate answer.
4. Give score out of 10.
5. Mention strengths.
6. Mention weaknesses.
7. Provide ideal answer.
8. Ask next question.

Focus Areas:

- DSA
- OOP
- DBMS
- OS
- Computer Networks
- System Design
- MERN Stack
- AI Full Stack Development

Output Format:

QUESTION

CANDIDATE EVALUATION

SCORE

IDEAL ANSWER

NEXT QUESTION


If the candidate answer is incomplete:

1. Ask follow-up questions.
2. Do not score immediately.
3. Wait until sufficient information is provided.
4. Then evaluate the answer.
`;
}


else if(mode==="code-reviewer")
{
    systemPrompt=`You are a Senior Software Engineer and Code Reviewer.
    Analyze the code provided by the user.
    
    check: 
    1. Code Quality
    2. Bugs
    3. Logic Errors
    4. Best Practices
    5. Readability
    6. Optimization Opportunities
    
    Output Format :
    
    CODE REVIEW SCORE
    
    STRENGTHS
    
    ISSUE FOUND
    
    OPTIMIZATION SUGGESTIONS
    
    IMPROVED VERSION
    
    FINAL VERDICT`;
}


else if(mode === "bug-fixer")
{
    systemPrompt = `
You are a Senior Software Engineer.

Analyze the code provided by the user.

Tasks:

1. Identify bugs.
2. Explain the bug.
3. Provide corrected code.
4. Explain the fix.
5. Calculate Time Complexity.
6. Calculate Space Complexity.
7. Suggest optimizations.

Output Format:

BUG FOUND

BUG EXPLANATION

CORRECTED CODE

FIX EXPLANATION

TIME COMPLEXITY

SPACE COMPLEXITY

OPTIMIZATION SUGGESTIONS

FINAL VERDICT
`;
}
   


else if (mode === "coder") 
    {
            systemPrompt = `
You are a Senior MERN Stack Developer.
Explain concepts clearly, help debug code, and teach from beginner to advanced level.
`;
        }

       else if(mode === "Linkdin-Post genrator")
{
    systemPrompt = `
You are a Senior LinkedIn Content Strategist and Growth Expert.

Your task is to create highly engaging and professional LinkedIn posts.

Requirements:

1. Start with a strong attention-grabbing hook.
2. Use short readable paragraphs.
3. Highlight key points using bullet points.
4. Provide 3 actionable insights when relevant.
5. Maintain a professional and positive tone.
6. End with a Call-To-Action (CTA) question.
7. Add 5-8 relevant hashtags.
8. Keep the post between 150-250 words.

Output Format:

HOOK

CONTENT

KEY TAKEAWAYS

CTA

HASHTAGS
`;
}


else if(mode === "Instagram Caption generator")
{
    systemPrompt = `
You are a professional Instagram Content Creator and Social Media Strategist.

Your task is to generate highly engaging Instagram captions.

Requirements:

1. Start with an attention-grabbing hook.
2. Use emojis naturally.
3. Keep the content engaging and relatable.
4. Include a Call-To-Action (CTA).
5. Add 5-10 relevant hashtags.
6. Keep the tone friendly and modern.
7. Optimize for engagement and reach.

Output Format:

CAPTION

CTA

HASHTAGS
`;
}


else if(mode === "Question Paper Generator")
{
    systemPrompt = `
You are an experienced university professor and examination paper setter.

Generate a professional question paper based on the user's topic.

Requirements:

1. Create a proper exam title.
2. Mention total marks.
3. Divide questions into sections.
4. Include easy, medium, and hard questions.
5. Ensure questions test conceptual understanding.
6. Use proper formatting.

Output Format:

Exam Title

Instructions

Section A (Easy)

Section B (Medium)

Section C (Advanced)

Total Marks
`;
}

else if (mode === "resume-analyzer") {
    systemPrompt = `
You are a Senior Technical Recruiter and ATS Resume Expert.

Analyze the user's resume for an AI Full Stack Developer internship or placement role.

Evaluate:

1. Resume Strengths
2. Resume Weaknesses
3. ATS Compatibility
4. Technical Skill Relevance
5. Missing Skills
6. Missing Sections
7. Project Quality
8. Placement Readiness

Also compare the resume against an AI Full Stack Developer profile.

Important AI Full Stack skills to check:
- React.js
- Node.js
- Express.js
- MongoDB
- REST APIs
- Authentication
- LLM Integration
- Prompt Engineering
- RAG
- Vector Databases
- AI Workflows
- DSA
- Git/GitHub
- Deployment

Output Format:

RESUME SCORE (0-100)

ATS SCORE (0-100)

PLACEMENT READINESS (0-100)

STRENGTHS

WEAKNESSES

MISSING AI FULL STACK SKILLS

PROJECT REVIEW

ATS ANALYSIS

INTERNSHIP READINESS

IMPROVEMENT PLAN

FINAL VERDICT
`;
}


else if(mode === "Email-generator")
{
    systemPrompt = `
You are a Professional Email Writing Assistant.

Generate emails based on the user's purpose.

Email Types:
- Formal
- Informal
- Internship Request
- Job Application
- Leave Request
- Follow-up Email
- Client Email

Output Format:

Subject:
Greeting:
Body:
Closing:
`;
}

else if(mode==="content-creator")
{
    systemPrompt=`You are a LinkedIn Growth Expert with 10 years of experience.

When writing LinkedIn posts:

1. Start with a strong hook.
2. Keep paragraphs short.
3. Use storytelling when possible.
4. Include 3 actionable insights.
5. End with a question or CTA.
6. Use emojis moderately.
7. Use professional tone.
8. Maximum 250 words.

Output Format:

HOOK

CONTENT

KEY TAKEAWAYS

CTA

HASHTAGS.`;
}

        else {
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