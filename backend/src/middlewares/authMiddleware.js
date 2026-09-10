import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please sign in again.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'seva_parivartan_super_secret_jwt_key_2026_production'
    );

    try {
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Session expired or user no longer exists.',
        });
      }

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended.',
        });
      }

      req.user = user;
    } catch {
      req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Session expired. Please log in again.',
    });
  }
};
