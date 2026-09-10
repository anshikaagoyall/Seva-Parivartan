import express from 'express';
import {
  getDepartments,
  getOfficerDashboard,
  updateRequestStatus,
} from '../controllers/departmentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public district directory
router.get('/', getDepartments);

// Protected Officer & Admin routes
router.get('/officer-dashboard', protect, authorize('officer', 'admin'), getOfficerDashboard);
router.put('/approve-request/:id', protect, authorize('officer', 'admin'), updateRequestStatus);

export default router;
