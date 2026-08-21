import express from 'express';
import products_controller from '../controllers/products.controller.js';
import auth_middleware from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', products_controller.get_all_products);
router.post('/', auth_middleware.verify_token, auth_middleware.is_admin, upload.uploadImage, products_controller.add_product);
router.put('/:id', auth_middleware.verify_token, auth_middleware.is_admin, upload.uploadImage, products_controller.update_product);
router.delete('/:id', auth_middleware.verify_token, auth_middleware.is_admin, products_controller.delete_product);

export default router;