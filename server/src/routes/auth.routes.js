import express from "express";
import auth_controller from "../controllers/auth.controller.js";
import auth_middleware from "../middleware/auth.middleware.js";
import image_middleware from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", image_middleware.uploadImage, auth_controller.register_user);
router.post("/login", auth_controller.login_user);
router.post("/refresh", auth_controller.refresh_token)
router.post("/logout", auth_controller.logout_user);
router.get("/me", auth_middleware.verify_token(),auth_controller.get_current_user);

export default router;