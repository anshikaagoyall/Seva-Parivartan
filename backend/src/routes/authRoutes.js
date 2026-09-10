import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Validation middleware runner
const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }
    next();
  };
};

router.post(
  '/register',
  validate([
    body('firstName').isLength({ min: 2 }).withMessage('First Name must be at least 2 characters'),
    body('lastName').isLength({ min: 2 }).withMessage('Last Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('mobile').matches(/^\d{10}$/).withMessage('Mobile number must be exactly 10 digits'),
    body('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`]).{8,}$/).withMessage('Password does not meet the required policy'),
  ]),
  registerUser
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  loginUser
);

router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getMe);

export default router;
