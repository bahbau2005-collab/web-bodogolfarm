import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Program from '../models/Program.js';
import Schedule from '../models/Schedule.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings (Admin only - will add auth later)
 * @access  Private/Admin
 */
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
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
router.get('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
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
  body('participants').optional().isNumeric().withMessage('Number of participants must be a number'),
  body('adults').optional().isInt({ min: 0 }).withMessage('Adults must be a non-negative integer'),
  body('children').optional().isInt({ min: 0 }).withMessage('Children must be a non-negative integer'),
  body('schedule').optional().isMongoId().withMessage('Valid schedule ID is required'),
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

  const { program: programId, schedule: scheduleId, bookingDate } = req.body;
  const adults = Number(req.body.adults) || 0;
  const children = Number(req.body.children) || 0;

  // Total peserta: pakai adults+children kalau dikirim, kalau tidak pakai participants
  const totalParticipants = (adults + children) || Number(req.body.participants) || 0;
  if (totalParticipants < 1) {
    return res.status(400).json({
      success: false,
      error: 'Jumlah peserta minimal 1'
    });
  }

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

  // Validasi sesi/jadwal + kuota (jika booking pakai sesi)
  let scheduleDoc = null;
  if (scheduleId) {
    scheduleDoc = await Schedule.findById(scheduleId);
    if (!scheduleDoc || scheduleDoc.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: 'Jadwal tidak tersedia atau sudah ditutup'
      });
    }
    if (scheduleDoc.remaining < totalParticipants) {
      return res.status(400).json({
        success: false,
        error: `Kuota tidak cukup. Sisa kuota: ${scheduleDoc.remaining}`
      });
    }
  } else if (totalParticipants > program.capacity) {
    // Tanpa sesi: pakai kapasitas program sebagai batas
    return res.status(400).json({
      success: false,
      error: `Maksimal ${program.capacity} peserta`
    });
  }

  // Calculate total amount (selalu dihitung server, JANGAN percaya nilai dari client)
  const totalAmount = program.price * totalParticipants;

  // Create booking — hanya field yang diizinkan (whitelist).
  // paymentStatus, ticketCode, totalAmount, dll TIDAK diambil dari req.body
  // agar user tidak bisa menandai booking "paid" sendiri.
  const booking = await Booking.create({
    program: programId,
    schedule: scheduleId || undefined,
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail,
    customerPhone: req.body.customerPhone,
    specialRequests: req.body.specialRequests || '',
    bookingDate,
    participants: totalParticipants,
    adults,
    children,
    totalAmount,
    status: 'pending',
    paymentStatus: 'pending'
  });

  // Kurangi kuota sesi setelah booking dibuat
  if (scheduleDoc) {
    scheduleDoc.booked += totalParticipants;
    await scheduleDoc.save();
  }

  // Populate program data in response
  await booking.populate('program', 'title duration price');

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: booking
  });
}));

/**
 * @route   PATCH /api/bookings/:id/cancel
 * @desc    Pembatalan oleh user — hanya untuk booking yang BELUM dibayar.
 *          Mengembalikan kuota sesi. Booking yang sudah lunas tidak bisa
 *          dibatalkan lewat sini (harus hubungi admin).
 * @access  Public
 */
router.patch('/:id/cancel', asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking tidak ditemukan' });
  }
  if (booking.paymentStatus === 'paid') {
    return res.status(400).json({
      success: false,
      error: 'Booking sudah dibayar — silakan hubungi admin untuk pembatalan/refund.'
    });
  }
  if (booking.status === 'cancelled') {
    return res.json({ success: true, message: 'Booking sudah dibatalkan' });
  }

  booking.status = 'cancelled';
  booking.paymentStatus = 'cancelled';
  await booking.save();

  // Kembalikan kuota sesi
  if (booking.schedule) {
    const schedule = await Schedule.findById(booking.schedule);
    if (schedule) {
      schedule.booked = Math.max(schedule.booked - booking.participants, 0);
      await schedule.save();
    }
  }

  res.json({ success: true, message: 'Booking dibatalkan' });
}));

/**
 * @route   PUT /api/bookings/:id
 * @desc    Update booking status (Admin only - will add auth later)
 * @access  Private/Admin
 */
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
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
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found'
    });
  }

  const wasCancelled = booking.status === 'cancelled';

  // Update status to cancelled instead of deleting
  booking.status = 'cancelled';
  await booking.save();

  // Kembalikan kuota sesi kalau sebelumnya belum dibatalkan
  if (!wasCancelled && booking.schedule) {
    const schedule = await Schedule.findById(booking.schedule);
    if (schedule) {
      schedule.booked = Math.max(schedule.booked - booking.participants, 0);
      await schedule.save();
    }
  }

  res.json({
    success: true,
    message: 'Booking cancelled successfully'
  });
}));

export default router;