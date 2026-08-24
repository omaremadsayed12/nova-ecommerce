import express from "express";
import users_controller from "../controllers/users.controller.js";
import auth_middleware from "../middleware/auth.middleware.js";
import upload_middleware from "../middleware/upload.middleware.js";

const router = express.Router();

router.get(
  "/",
  auth_middleware.verify_token("ADMIN"),
  users_controller.get_all_users,
);
router.post(
  "/",
  auth_middleware.verify_token("ADMIN"),
  upload_middleware.upload_image,
  users_controller.add_user,
);
router.patch(
  "/:id",
  auth_middleware.verify_token("ADMIN"),
  upload_middleware.upload_image,
  users_controller.update_user,
);
router.delete(
  "/:id",
  auth_middleware.verify_token("ADMIN"),
  users_controller.delete_user,
);

export default router;
