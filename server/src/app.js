import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import auth_routes from "./routes/auth.routes.js";
import users_routes from "./routes/users.routes.js";
import products_routes from "./routes/products.routes.js";
import cart_routes from "./routes/cart.routes.js";
import order_routes from "./routes/order.routes.js";
import settings_routes from "./routes/settings.routes.js";

import fileUpload from "express-fileupload";

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "../tmp/",
  })
);

app.use("/api/auth", auth_routes);
app.use("/api/users", users_routes);
app.use("/api/products", products_routes);
app.use("/api/cart", cart_routes);
app.use("/api/order", order_routes);
app.use("/api/settings", settings_routes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

export default app;