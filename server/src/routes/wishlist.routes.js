import express from 'express';
import wishlist_controller from '../controllers/wishlist.controller.js';
import auth_middleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', auth_middleware.verify_token(), wishlist_controller.get_wishlist);
router.post('/:id', auth_middleware.verify_token(), wishlist_controller.add_to_wishlist);
router.delete('/:id', auth_middleware.verify_token(), wishlist_controller.remove_from_wishlist);

export default router;