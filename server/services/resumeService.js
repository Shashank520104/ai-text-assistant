import fs from "fs";
import { createRequire } from "module";
import { ResumeSchema } from "../schemas/resumeSchema.js";
import { callGemini } from "./aiClient.js";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const analyzeResume = async (resumePath, jobRole) => {
  try {
    console.log("1. Resume service started");
    console.log("2. Resume path:", resumePath);

    if (!resumePath) {
      throw new Error("Resume file path is missing");
    }

    const pdfBuffer = fs.readFileSync(resumePath);
    console.log("3. PDF file read successfully");

    const pdfData = await pdf(pdfBuffer);
    console.log("4. PDF parsed successfully");

    const resumeText = pdfData.text;
    console.log("5. Extracted text length:", resumeText.length);

    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error("No text found in PDF");
    }

    const systemPrompt = `
You are an expert ATS Resume Analyzer.

Analyze the candidate resume for the given job role.

Job Role:
${jobRole || "Not provided"}

Candidate Resume:
${resumeText}

Return ONLY valid JSON.

Use this exact format:

{
  "ats_score": 0,
  "verdict": "",
  "strengths": [],
  "weaknesses": [],
  "missing_keywords": [],
  "improvement_tip": ""
}

Rules:
- Return ONLY JSON.
- Do not write explanations.
- Do not use markdown.
- Do not wrap JSON inside code blocks.
- ats_score must be a number between 0 and 100.
- strengths, weaknesses, and missing_keywords must be arrays of strings.
- verdict must be a string.
- improvement_tip must be a string.
`;

    console.log("6. Calling Gemini");

    const result = await callGemini(systemPrompt, "");

    console.log("7. Gemini response received");

    const cleanedResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedResult = JSON.parse(cleanedResult);

    ResumeSchema.parse(parsedResult);

    fs.unlinkSync(resume);

    console.log("8. JSON parsed and validated");

    return parsedResult;
  } catch (error) {
    console.error("Resume Analysis Error:", error.message);
    throw new Error(error.message);
  }
};