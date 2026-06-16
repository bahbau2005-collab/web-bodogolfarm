import express from 'express';
import { body, validationResult } from 'express-validator';
import Schedule from '../models/Schedule.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   GET /api/schedules
 * @desc    List jadwal. Filter opsional: ?program=<id>&upcoming=true
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const { program, upcoming } = req.query;
  const query = {};
  if (program) query.program = program;
  if (upcoming === 'true') query.date = { $gte: new Date() };

  const schedules = await Schedule.find(query)
    .populate('program', 'title type mode price priceUnit')
    .sort({ date: 1, startTime: 1 });

  res.json({ success: true, count: schedules.length, data: schedules });
}));

/**
 * @route   GET /api/schedules/:id
 * @desc    Detail satu jadwal
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id)
    .populate('program', 'title type mode price priceUnit capacity');

  if (!schedule) {
    return res.status(404).json({ success: false, error: 'Schedule not found' });
  }
  res.json({ success: true, data: schedule });
}));

/**
 * @route   POST /api/schedules
 * @desc    Buat jadwal baru (Admin)
 * @access  Private/Admin
 */
router.post('/', [
  body('program').isMongoId().withMessage('Valid program ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Format jam HH:mm'),
  body('endTime').optional().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Format jam HH:mm'),
  body('quota').isInt({ min: 1 }).withMessage('Quota minimal 1')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
  }

  const schedule = await Schedule.create(req.body);
  res.status(201).json({ success: true, data: schedule });
}));

/**
 * @route   PUT /api/schedules/:id
 * @desc    Update jadwal (Admin)
 * @access  Private/Admin
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const schedule = await Schedule.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!schedule) {
    return res.status(404).json({ success: false, error: 'Schedule not found' });
  }
  res.json({ success: true, data: schedule });
}));

/**
 * @route   DELETE /api/schedules/:id
 * @desc    Hapus jadwal (Admin)
 * @access  Private/Admin
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);
  if (!schedule) {
    return res.status(404).json({ success: false, error: 'Schedule not found' });
  }
  await schedule.deleteOne();
  res.json({ success: true, message: 'Schedule deleted successfully' });
}));

export default router;
