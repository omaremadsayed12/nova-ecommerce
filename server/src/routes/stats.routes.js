import express from "express";
import stats_controller from "../controllers/stats.controller.js";
import auth_middleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/admin", auth_middleware.verify_token("ADMIN"), stats_controller.get_admin_stats);
router.get("/", stats_controller.get_stats);

export default router;
