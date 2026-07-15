import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/aiRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


connectDb();


app.use("/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/ai", aiRoutes);
app.use("/resume", resumeRoutes);


app.get("/check", (req, res) => {
    res.send("Server says Hello..!");
});

export default app;