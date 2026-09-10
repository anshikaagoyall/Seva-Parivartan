import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found.' });
  }

  res.json({ success: true, user, profile: user.profile || {} });
});

router.put('/', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User profile not found.' });
  }

  if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
  if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
  if (req.body.email !== undefined) user.email = req.body.email;
  if (req.body.mobile !== undefined) user.mobile = req.body.mobile;
  if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
  if (req.body.profile !== undefined) user.profile = req.body.profile;

  await user.save();

  res.json({ success: true, user: await User.findById(req.user.id).select('-password') });
});

export default router;
