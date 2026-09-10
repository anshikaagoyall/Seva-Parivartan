import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeAdmin } from '../middlewares/roleMiddleware.js';
import { User } from '../models/User.js';

const router = express.Router();

router.use(protect, authorizeAdmin);

router.get('/dashboard', async (req, res) => {
  const [totalUsers, totalAdmins, totalActiveUsers, recentUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ isActive: true }),
    User.find().sort({ createdAt: -1 }).limit(5).select('-password'),
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalAdmins,
      activeUsers: totalActiveUsers,
      pendingVerifications: 0,
      totalCauses: 0,
      totalProblems: 0,
      activeVolunteers: 0,
    },
    recentUsers,
  });
});

router.get('/users', async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('-password');
  res.json({ success: true, users });
});

router.put('/users/:id', async (req, res) => {
  const updates = { ...req.body };
  delete updates.password;

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({ success: true, message: 'User updated successfully.', user });
});

router.delete('/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({ success: true, message: 'User deleted successfully.' });
});

export default router;
