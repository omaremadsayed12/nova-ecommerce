import express from "express";
import auth_controller from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", auth_controller.register_user);
router.post("/login", auth_controller.login_user);
// router.post("/logout", auth_controller.logout_user);
router.get("/me", auth_controller.get_current_user);

export default router;