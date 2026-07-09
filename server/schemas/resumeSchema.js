import { z } from "zod";

export const ResumeSchema = z.object({
  ats_score: z.number().min(0).max(100),
  verdict: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  improvement_tip: z.string(),
});