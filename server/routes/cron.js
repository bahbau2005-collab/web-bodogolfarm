import express from 'express';
import Booking from '../models/Booking.js';
import Schedule from '../models/Schedule.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Booking "pending" yang lebih tua dari ini dianggap kedaluwarsa.
const EXPIRE_HOURS = 2;

/**
 * @route   GET /api/cron/expire-pending
 * @desc    Batalkan booking yang masih pending & sudah lewat EXPIRE_HOURS,
 *          lalu kembalikan kuota sesinya. Dipanggil oleh cron (Vercel Cron
 *          atau cron eksternal). Diproteksi dengan CRON_SECRET.
 * @access  Cron only (Bearer CRON_SECRET)
 */
router.get('/expire-pending', asyncHandler(async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const cutoff = new Date(Date.now() - EXPIRE_HOURS * 60 * 60 * 1000);
  const expired = await Booking.find({
    status: 'pending',
    paymentStatus: { $ne: 'paid' },
    createdAt: { $lt: cutoff },
  });

  let count = 0;
  for (const b of expired) {
    b.status = 'cancelled';
    b.paymentStatus = 'cancelled';
    await b.save();
    if (b.schedule) {
      const s = await Schedule.findById(b.schedule);
      if (s) {
        s.booked = Math.max(s.booked - b.participants, 0);
        await s.save();
      }
    }
    count++;
  }

  res.json({ success: true, expired: count, message: `${count} booking pending dibatalkan` });
}));

export default router;
