import express from "express";
import auth_middleware from "../middleware/auth.middleware.js";
import settings_controller from "../controllers/settings.controller.js";

const router = express.Router();

router.get("/",auth_middleware("ADMIN"),settings_controller.get_settings);
router.patch("/",auth_middleware("ADMIN"),settings_controller.update_settings);

export default router;