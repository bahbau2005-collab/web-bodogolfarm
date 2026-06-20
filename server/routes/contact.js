import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/contact
 * @desc    Get all contact messages (Admin only - will add auth later)
 * @access  Private/Admin
 */
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isRead, subject } = req.query;

  // Build filter object
  const filter = {};
  if (isRead !== undefined) {
    filter.isRead = isRead === 'true';
  }
  if (subject) {
    filter.subject = subject;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 }
  };

  const contacts = await Contact.find(filter)
    .sort(options.sort)
    .limit(options.limit)
    .skip((options.page - 1) * options.limit);

  const total = await Contact.countDocuments(filter);

  res.json({
    success: true,
    data: contacts,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      pages: Math.ceil(total / options.limit)
    }
  });
}));

/**
 * @route   GET /api/contact/:id
 * @desc    Get single contact message
 * @access  Private/Admin
 */
router.get('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      error: 'Contact message not found'
    });
  }

  res.json({
    success: true,
    data: contact
  });
}));

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/', [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and max 100 chars'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^[0-9+\-\s()]+$/).withMessage('Valid phone number required'),
  body('subject').isIn(['info-program', 'booking', 'partnership', 'other']).withMessage('Invalid subject'),
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message is required and max 2000 chars')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Message sent successfully! We will get back to you soon.',
    data: contact
  });
}));

/**
 * @route   PUT /api/contact/:id/read
 * @desc    Mark message as read
 * @access  Private/Admin
 */
router.put('/:id/read', protect, adminOnly, asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!contact) {
    return res.status(404).json({
      success: false,
      error: 'Contact message not found'
    });
  }

  res.json({
    success: true,
    message: 'Message marked as read',
    data: contact
  });
}));

/**
 * @route   PUT /api/contact/:id/reply
 * @desc    Reply to contact message
 * @access  Private/Admin
 */
router.put('/:id/reply', protect, adminOnly, [
  body('replyMessage').trim().isLength({ min: 1, max: 2000 }).withMessage('Reply message is required'),
  body('repliedBy').trim().isLength({ min: 1 }).withMessage('Replier name is required')
], asyncHandler(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      isReplied: true,
      repliedAt: new Date()
    },
    { new: true }
  );

  if (!contact) {
    return res.status(404).json({
      success: false,
      error: 'Contact message not found'
    });
  }

  res.json({
    success: true,
    message: 'Reply sent successfully',
    data: contact
  });
}));

/**
 * @route   DELETE /api/contact/:id
 * @desc    Delete contact message
 * @access  Private/Admin
 */
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      error: 'Contact message not found'
    });
  }

  await contact.deleteOne();

  res.json({
    success: true,
    message: 'Contact message deleted successfully'
  });
}));

export default router;