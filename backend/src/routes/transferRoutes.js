import express from 'express';
import {
  createOrUpdateProfile,
  findMatches,
  calculateDistanceApi,
  geocodeSearchApi,
  uploadDocument,
  createTransferRequest,
  getMyRequests,
  createOrReplaceRequestPreference,
  getMyActiveRequest,
  editRequestPreference,
  cancelTransferRequest,
  sendContactRequest,
  acceptContactRequest,
  rejectContactRequest,
  getPendingContactRequests,
  getAcceptedConnections,
  getNotifications,
  markNotificationRead,
} from '../controllers/transferController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/calculate-distance', calculateDistanceApi);
router.get('/geocode-search', geocodeSearchApi);

router.post('/profile', protect, createOrUpdateProfile);
router.get('/matches', protect, findMatches);
router.post('/upload-doc', protect, upload.single('document'), uploadDocument);

router.post('/request-preference', protect, createOrReplaceRequestPreference);
router.get('/my-active-request', protect, getMyActiveRequest);
router.put('/request-preference/:id', protect, editRequestPreference);
router.put('/cancel-request/:id', protect, cancelTransferRequest);

router.post('/request', protect, createTransferRequest);
router.post('/contact/send', protect, sendContactRequest);
router.patch('/contact/:connectionId/accept', protect, acceptContactRequest);
router.patch('/contact/:connectionId/reject', protect, rejectContactRequest);
router.get('/contacts/pending', protect, getPendingContactRequests);
router.get('/contacts/accepted', protect, getAcceptedConnections);
router.get('/notifications', protect, getNotifications);
router.patch('/notifications/:notificationId/read', protect, markNotificationRead);
router.get('/my-requests', protect, getMyRequests);

export default router;
