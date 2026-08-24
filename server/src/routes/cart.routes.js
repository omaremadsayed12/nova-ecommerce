import express from "express";
import auth_middleware from "../middleware/auth.middleware.js";
import cart_controller from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/",auth_middleware.verify_token(),cart_controller.get_all_items);
router.post("/",auth_middleware.verify_token(),cart_controller.add_items);
router.patch("/:id",auth_middleware.verify_token(),cart_controller.update_item);
router.delete("/:id",auth_middleware.verify_token(),cart_controller.remove_item);

export default router;