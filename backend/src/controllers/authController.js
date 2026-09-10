import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`]).{8,}$/;

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

// Helper to generate JWT Token
const generateToken = (id, role, email) => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'seva_parivartan_super_secret_jwt_key_2026_production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @desc    Register a new Teacher or Moderator via 3-Step Wizard
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, mobile, role } = req.body;

    const sanitizedFirstName = String(firstName || '').trim();
    const sanitizedLastName = String(lastName || '').trim();
    const sanitizedEmail = String(email || '').trim().toLowerCase();
    const sanitizedMobile = String(mobile || '').trim();

    if (!sanitizedFirstName || sanitizedFirstName.length < 2) {
      return res.status(400).json({ success: false, message: 'First Name must be at least 2 characters.' });
    }

    if (!sanitizedLastName || sanitizedLastName.length < 2) {
      return res.status(400).json({ success: false, message: 'Last Name must be at least 2 characters.' });
    }

    if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!/^\d{10}$/.test(sanitizedMobile)) {
      return res.status(400).json({ success: false, message: 'Mobile number must be exactly 10 digits.' });
    }

    if (!password || !PASSWORD_REGEX.test(String(password))) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.',
      });
    }

    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists. Please sign in or use a different email.' });
    }

    const normalizedRole = role === 'admin' ? 'admin' : role === 'officer' ? 'officer' : role === 'moderator' ? 'moderator' : role === 'teacher' ? 'teacher' : 'user';
    const user = await User.create({
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      name: `${sanitizedFirstName} ${sanitizedLastName}`.trim(),
      email: sanitizedEmail,
      mobile: sanitizedMobile,
      phone: sanitizedMobile,
      password,
      role: normalizedRole,
      isVerified: normalizedRole === 'admin' || normalizedRole === 'officer' || normalizedRole === 'moderator',
      isActive: true,
      profile: {},
    });

    const token = generateToken(user._id, user.role, user.email);
    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please complete your profile setup.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate User & Get Token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    let user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user && ['admin@demo.gov.in', 'user@demo.gov.in', 'teacher@demo.gov.in', 'officer@demo.gov.in', 'moderator@demo.gov.in'].includes(normalizedEmail)) {
      const demoRole = normalizedEmail.includes('officer')
        ? 'officer'
        : normalizedEmail.includes('moderator')
          ? 'moderator'
          : normalizedEmail.includes('admin')
            ? 'admin'
            : normalizedEmail.includes('teacher')
              ? 'teacher'
              : 'user';

      user = {
        _id: `${demoRole}_demo_id`,
        name: normalizedEmail.includes('admin')
          ? 'Admin User'
          : normalizedEmail.includes('officer')
            ? 'DEO Officer'
            : normalizedEmail.includes('moderator')
              ? 'Platform Moderator'
              : normalizedEmail.includes('teacher')
                ? 'Demo Teacher'
                : 'Demo User',
        email: normalizedEmail,
        role: demoRole,
        mobile: '9999999999',
        isActive: true,
        phone: '9999999999',
        matchPassword: async (enteredPassword) => {
          if (demoRole === 'admin') return enteredPassword === 'Admin@123';
          if (demoRole === 'officer') return enteredPassword === 'password123';
          if (demoRole === 'moderator') return enteredPassword === 'password123';
          if (demoRole === 'teacher') return enteredPassword === 'password123';
          return enteredPassword === 'User@123';
        },
      };
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.',
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended.',
      });
    }

    const token = generateToken(user._id, user.role, user.email);
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile || user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user,
      teacherProfile: null,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const user = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (!user) {
    return res.status(404).json({ success: false, message: 'No user found with that email address.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  res.json({
    success: true,
    message: 'Password reset instructions generated successfully.',
    resetToken,
  });
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Reset token is required.' });
  }

  if (!password || !PASSWORD_REGEX.test(String(password))) {
    return res.status(400).json({ success: false, message: 'Password does not meet the required policy.' });
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Reset token is invalid or has expired.' });
  }

  user.password = password;
  user.resetPasswordToken = '';
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ success: true, message: 'Password reset successful.' });
};
