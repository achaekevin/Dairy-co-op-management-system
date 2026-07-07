import { Router } from 'express';
import authController from './auth.controller.js';
import { validate } from '@middlewares/validator.js';
import { authenticate } from '@middlewares/auth.js';
import { authLimiter } from '@middlewares/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validation.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);

router.post('/login', authLimiter, validate(loginSchema), authController.login);

router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);

router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);

router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

router.post('/logout', authenticate, authController.logout);

router.post('/logout-all', authenticate, authController.logoutAll);

router.get('/me', authenticate, authController.me);

export default router;
