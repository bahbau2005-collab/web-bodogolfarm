import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'bodogol_secret_key_2024', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      if (!user.isActive) {
        return res.status(401).json({ success: false, error: 'Account is deactivated' });
      }

      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      const token = signToken(user._id);

      res.json({
        success: true,
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// PUT /api/auth/update-password
router.put(
  '/update-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user._id).select('+password');
      if (!(await user.comparePassword(req.body.currentPassword))) {
        return res.status(401).json({ success: false, error: 'Current password is incorrect' });
      }

      user.password = req.body.newPassword;
      await user.save();

      const token = signToken(user._id);
      res.json({ success: true, token, message: 'Password updated successfully' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// PUT /api/auth/update-profile
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/seed-admin (only for first-time setup)
router.post('/seed-admin', async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'admin' });
    if (count > 0) {
      return res.status(400).json({ success: false, error: 'Admin already exists' });
    }

    const admin = await User.create({
      name: 'Admin Bodogol',
      email: 'admin@bodogolfarm.com',
      password: 'admin123',
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Admin created',
      data: { email: admin.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
