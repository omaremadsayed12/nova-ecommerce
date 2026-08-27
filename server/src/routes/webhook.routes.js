import express from "express";
import webhook_controller from "../controllers/webhook.controller.js";

const router = express.Router();

router.post("/stripe", express.raw({type:'application/json'}),webhook_controller.fetch_stripe_webhook);

export default router;