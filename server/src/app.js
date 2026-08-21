import express from "express";
import cors from "cors";
import helmet from "helmet";
import auth_routes from "./routes/auth.routes.js";
import products_routes from "./routes/products.routes.js";
import fileUpload from "express-fileupload";


const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "../tmp/",
  })
);


app.use("/api/auth", auth_routes);
app.use("/api/products", products_routes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

export default app;