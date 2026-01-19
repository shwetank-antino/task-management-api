import express from 'express';
import { getAllUsers, getMe, updateUserRole, deleteUser } from './users.controller.js';
import { authenticate, authorize } from '../../../middleware/auth-handler.js';

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin'), getAllUsers);
router.get('/me', getMe);
router.patch('/:id/role', authorize('admin'), updateUserRole);
router.delete('/:id', authorize('admin'), deleteUser)

export default router;