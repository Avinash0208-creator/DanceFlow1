import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "DanceFlow API is running",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in backend/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`DanceFlow API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("DanceFlow API startup failed:", error.message);
    process.exit(1);
  }
}

startServer();