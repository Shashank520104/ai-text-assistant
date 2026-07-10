import fs from "fs";
import { PDFParse } from "pdf-parse";

import { ResumeSchema } from "../schemas/resumeSchema.js";
import { callGemini } from "./aiClient.js";

export const analyzeResume = async (resume, jobRole) => {
  let parser;

  try {
    console.log("1. Resume service started");
    console.log("2. Resume path:", resume);

    const pdfBuffer = fs.readFileSync(resume);

    console.log("3. PDF file read successfully");

    parser = new PDFParse({
      data: pdfBuffer,
    });

    const pdfData = await parser.getText();
    const resumeText = pdfData.text;

    console.log("4. PDF parsed successfully");
    console.log("5. Extracted text length:", resumeText.length);

    if (!resumeText.trim()) {
      throw new Error("No readable text found inside the PDF.");
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
`;

    console.log("6. Calling Gemini");

    const result = await callGemini(systemPrompt, "");

    console.log("7. Gemini response received");

    const cleanedResult = result
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsedResult = JSON.parse(cleanedResult);

    ResumeSchema.parse(parsedResult);

    console.log("8. JSON parsed and validated");

    return parsedResult;
  } catch (error) {
    console.error("Resume Analysis Error:", error);

    throw new Error(
      error.message || "Resume analysis failed."
    );
  } finally {
    if (parser) {
      await parser.destroy();
    }

    if (fs.existsSync(resume)) {
      fs.unlinkSync(resume);
    }
  }
};