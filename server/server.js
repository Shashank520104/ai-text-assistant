import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/aiRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import connectDb from "./config/db.js";
import authRoutes from "../server/routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/auth",authRoutes);
app.use("/api",profileRoutes);

// Health Check Route
app.get("/check", (req, res) => {
  res.send("Server says Hello..!");
});

// Routes
app.use("/ai", aiRoutes);
app.use("/resume", resumeRoutes);

// Start Server
const PORT = process.env.PORT || 8000;

console.log("MONGO_URI:", process.env.MONGO_URI);

connectDb();

app.listen(PORT, () => {
  console.log(`Server Started At Port ${PORT}`);
});


