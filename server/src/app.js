import express from "express";
import cors from "cors";
import helmet from "helmet";
import auth_routes from "./routes/auth.routes.js";

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use("/api/auth", auth_routes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

export default app;