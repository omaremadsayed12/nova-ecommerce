import express from "express";
import cors from "cors";
import helmet from "helmet";
import User from "./models/User.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());



app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

export default app;