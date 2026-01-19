import express from 'express';
import { loginUser, registerUser, refreshToken, logoutUser, userProfile } from './auth.controller.js';
import { validate } from '../../../middleware/validate.js';
import { registerSchema, loginSchema } from './auth.validator.js';
import { authenticate } from '../../../middleware/auth-handler.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', refreshToken);
router.post('/logout',authenticate(), logoutUser);

export default router;
