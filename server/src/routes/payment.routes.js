import express from "express";
import auth_middleware from "../middleware/auth.middleware.js";
import payment_controller from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/initiate",auth_middleware.verify_token(),payment_controller.initiate_payment);
router.get("/:id/status",auth_middleware.verify_token(),payment_controller.get_payment_status);

export default router;