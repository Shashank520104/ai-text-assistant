import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/check", (req, res) => {
  res.send("Server says Hello..!");
});

app.use("/", aiRoutes);

app.listen(8000, () => {
  console.log("Server Started At Port 8000");
});