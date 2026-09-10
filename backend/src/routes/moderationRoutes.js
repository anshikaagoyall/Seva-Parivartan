import express from 'express';
import {
  getModerationDashboard,
  toggleUserSuspension,
  reportProfile,
} from '../controllers/moderationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Protected Moderator / Admin Routes
router.get('/dashboard', protect, authorize('moderator', 'admin'), getModerationDashboard);
router.put('/suspend-user/:id', protect, authorize('moderator', 'admin'), toggleUserSuspension);

// Teacher reporting endpoint
router.post('/report-profile', protect, reportProfile);

export default router;
