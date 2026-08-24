import express from 'express';
import products_controller from '../controllers/products.controller.js';
import auth_middleware from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', products_controller.get_all_products);
router.post('/', auth_middleware.verify_token("ADMIN"), upload.upload_image, products_controller.add_product);
router.patch('/:id', auth_middleware.verify_token("ADMIN"),  upload.upload_image, products_controller.update_product);
router.delete('/:id', auth_middleware.verify_token("ADMIN"), products_controller.delete_product);

export default router;