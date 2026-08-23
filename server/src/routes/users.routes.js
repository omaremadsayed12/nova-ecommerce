import express from 'express';
import users_controller from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', users_controller.get_all_users);
router.post('/',users_controller.add_user);
// router.put('/:id',users_controller.update_user);
// router.delete('/:id',users_controller.delete_user);

export default router