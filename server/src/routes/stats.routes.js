import express from 'express';
import stats_controller from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/",stats_controller.get_stats);

export default router;