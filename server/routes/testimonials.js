import express from 'express';
import { body, validationResult } from 'express-validator';
import Testimonial from '../models/Testimonial.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/testimonials
 * @desc    List testimoni. Publik hanya yang published; admin (?all=true) semua.
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isPublished: true };
  const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: testimonials.length, data: testimonials });
}));

/**
 * @route   POST /api/testimonials
 * @desc    Buat testimoni (Admin)
 * @access  Private/Admin
 */
router.post('/', protect, adminOnly, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Nama wajib diisi'),
  body('text').trim().isLength({ min: 1, max: 600 }).withMessage('Isi testimoni wajib diisi'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
  }
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: testimonial });
}));

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update testimoni (Admin)
 * @access  Private/Admin
 */
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!testimonial) {
    return res.status(404).json({ success: false, error: 'Testimoni tidak ditemukan' });
  }
  res.json({ success: true, data: testimonial });
}));

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Hapus testimoni (Admin)
 * @access  Private/Admin
 */
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) {
    return res.status(404).json({ success: false, error: 'Testimoni tidak ditemukan' });
  }
  res.json({ success: true, message: 'Testimoni dihapus' });
}));

export default router;
