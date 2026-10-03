import express from "express";
import categories_controller from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/",categories_controller.get_all_categories);

export default router;