import express from "express";
import auth_middleware from "../middleware/auth.middleware.js";
import reviews_controller from "../controllers/reviews.controller.js";

const router = express.Router();

router.get("/:productId", reviews_controller.get_product_reviews);
router.post("/:productId", auth_middleware.verify_token(), reviews_controller.add_review);
router.put("/:id", auth_middleware.verify_token(), reviews_controller.update_review);

export default router;