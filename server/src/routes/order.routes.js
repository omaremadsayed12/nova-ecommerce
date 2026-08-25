import express from "express";
import auth_middleware from "../middleware/auth.middleware.js";
import order_controller from "../controllers/order.controller.js";

const router = express.Router();

router.post("/",auth_middleware.verify_token(),order_controller.initiate_order);
// router.patch("/:id",auth_middleware.verify_token("ADMIN"),order_controller.update_order);
router.patch("/:id/cancel",auth_middleware.verify_token(),order_controller.cancel_order);
router.get("/",auth_middleware.verify_token(),order_controller.get_all_orders);
router.get("/:id",auth_middleware.verify_token(),order_controller.get_order_details);

export default router;