import express from 'express';
import { body, validationResult } from 'express-validator';
import Article from '../models/Article.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/articles
 * @desc    List artikel. Publik hanya yang published; admin (?all=true) semua.
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isPublished: true };
  const articles = await Article.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: articles.length, data: articles });
}));

/**
 * @route   GET /api/articles/:id
 * @desc    Detail satu artikel
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ success: false, error: 'Artikel tidak ditemukan' });
  }
  res.json({ success: true, data: article });
}));

/**
 * @route   POST /api/articles
 * @desc    Buat artikel (Admin)
 * @access  Private/Admin
 */
router.post('/', protect, adminOnly, [
  body('title').trim().isLength({ min: 1, max: 150 }).withMessage('Judul wajib diisi'),
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
  }
  const article = await Article.create(req.body);
  res.status(201).json({ success: true, data: article });
}));

/**
 * @route   PUT /api/articles/:id
 * @desc    Update artikel (Admin)
 * @access  Private/Admin
 */
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!article) {
    return res.status(404).json({ success: false, error: 'Artikel tidak ditemukan' });
  }
  res.json({ success: true, data: article });
}));

/**
 * @route   DELETE /api/articles/:id
 * @desc    Hapus artikel (Admin)
 * @access  Private/Admin
 */
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ success: false, error: 'Artikel tidak ditemukan' });
  }
  await article.deleteOne();
  res.json({ success: true, message: 'Artikel dihapus' });
}));

export default router;
