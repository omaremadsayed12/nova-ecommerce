import express from "express";
import { tmpdir } from "node:os";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import auth_routes from "./routes/auth.routes.js";
import users_routes from "./routes/users.routes.js";
import products_routes from "./routes/products.routes.js";
import categories_routes from "./routes/categories.routes.js";
import order_routes from "./routes/order.routes.js";
import payment_routes from "./routes/payment.routes.js";
import webhook_routes from "./routes/webhook.routes.js";
import settings_routes from "./routes/settings.routes.js";
import stats_routes from "./routes/stats.routes.js";
import wishlist_routes from "./routes/wishlist.routes.js";
import reviews_routes from "./routes/reviews.routes.js";

import fileUpload from "express-fileupload";
import errorHandler from "./middleware/error.middleware.js";
import AppError from "./utils/AppError.js";
import { getAllowedClientOrigins } from "./config/clientUrl.js";
import initialize from "./config/initialize.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    callback(null, !origin || getAllowedClientOrigins().includes(origin));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(async (req, res, next) => {
  try {
    await initialize();
    next();
  } catch {
    console.error("API initialization failed; request unavailable");
    next(new AppError("The API is temporarily unavailable", 503, "API_INITIALIZATION_FAILED"));
  }
});

app.use("/api/webhook", webhook_routes);

app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: process.env.TMPDIR || tmpdir(),
    limits: { fileSize: 5 * 1024 * 1024 },
  })
);

app.use("/api/auth", auth_routes);
app.use("/api/users", users_routes);
app.use("/api/products", products_routes);
app.use("/api/categories", categories_routes);
app.use("/api/order", order_routes);
app.use("/api/payment", payment_routes);
app.use("/api/settings", settings_routes);
app.use("/api/stats",stats_routes);
app.use("/api/wishlist",wishlist_routes);
app.use("/api/reviews",reviews_routes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    data:null,
    error:null,
    meta:null
  });
});

app.use(errorHandler);

export default app;
