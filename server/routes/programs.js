import express from 'express';
import { body, validationResult } from 'express-validator';
import Program from '../models/Program.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   GET /api/programs
 * @desc    Get all active programs
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const programs = await Program.find({ isActive: true })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: programs.length,
    data: programs
  });
}));

/**
 * @route   GET /api/programs/:id
 * @desc    Get single program by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);

  if (!program) {
    return res.status(404).json({
      success: false,
      error: 'Program not found'
    });
  }

  res.json({
    success: true,
    data: program
  });
}));

/**
 * @route   POST /api/programs
 * @desc    Create new program (Admin only - will add auth later)
 * @access  Private/Admin
 */
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and max 100 chars'),
  body('description').trim().isLength({ min: 1, max: 1000 }).withMessage('Description is required and max 1000 chars'),
  body('duration').isIn(['1 hari', '2 hari', '3 hari']).withMessage('Invalid duration'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('capacity').isNumeric().withMessage('Capacity must be a number'),
  body('schedule').trim().isLength({ min: 1 }).withMessage('Schedule is required')
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

  const program = await Program.create(req.body);

  res.status(201).json({
    success: true,
    data: program
  });
}));

/**
 * @route   PUT /api/programs/:id
 * @desc    Update program (Admin only - will add auth later)
 * @access  Private/Admin
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const program = await Program.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!program) {
    return res.status(404).json({
      success: false,
      error: 'Program not found'
    });
  }

  res.json({
    success: true,
    data: program
  });
}));

/**
 * @route   DELETE /api/programs/:id
 * @desc    Delete program (Admin only - will add auth later)
 * @access  Private/Admin
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);

  if (!program) {
    return res.status(404).json({
      success: false,
      error: 'Program not found'
    });
  }

  await program.deleteOne();

  res.json({
    success: true,
    message: 'Program deleted successfully'
  });
}));

export default router;