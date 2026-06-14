import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Program from '../models/Program.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (Admin only - will add auth later)
 * @access  Private/Admin
 */
router.get('/', asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('program', 'title duration price')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
}));

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking by ID
 * @access  Private/Admin
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('program', 'title duration price facilities');

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  res.json({
    success: true,
    data: booking
  });
}));

/**
 * @route   POST /api/bookings
 * @desc    Create new booking
 * @access  Public
 */
router.post('/', [
  body('program').isMongoId().withMessage('Valid program ID is required'),
  body('customerName').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and max 100 chars'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('customerPhone').matches(/^[0-9+\-\s()]+$/).withMessage('Valid phone number is required'),
  body('participants').isNumeric().withMessage('Number of participants must be a number'),
  body('bookingDate').isISO8601().withMessage('Valid booking date is required'),
  body('specialRequests').optional().isLength({ max: 500 }).withMessage('Special requests max 500 chars')
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

  const { program: programId, participants, bookingDate } = req.body;

  // Check if program exists and is active
  const program = await Program.findById(programId);
  if (!program || !program.isActive) {
    return res.status(400).json({
      success: false,
      error: 'Program not found or not available'
    });
  }

  // Check if booking date is in the future
  if (new Date(bookingDate) < new Date()) {
    return res.status(400).json({
      success: false,
      error: 'Booking date cannot be in the past'
    });
  }

  // Check capacity (simplified - in production, check existing bookings for the date)
  if (participants > program.capacity) {
    return res.status(400).json({
      success: false,
      error: `Maximum ${program.capacity} participants allowed`
    });
  }

  // Calculate total amount
  const totalAmount = program.price * participants;

  // Create booking
  const booking = await Booking.create({
    ...req.body,
    totalAmount,
    status: 'pending'
  });

  // Populate program data in response
  await booking.populate('program', 'title duration price');

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking
  });
}));

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking status (Admin only - will add auth later)
 * @access  Private/Admin
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('program', 'title duration price');

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  res.json({
    success: true,
    data: booking
  });
}));

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel booking
 * @access  Private/Admin or Owner
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  // Update status to cancelled instead of deleting
  booking.status = 'cancelled';
  await booking.save();

  res.json({
    success: true,
    message: 'Booking cancelled successfully'
  });
}));

export default router;