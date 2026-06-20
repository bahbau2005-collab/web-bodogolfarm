import express from 'express';
import Booking from '../models/Booking.js';
import Program from '../models/Program.js';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

// GET /api/admin/dashboard - summary stats
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalBookings,
      activeBookings,
      monthlyBookings,
      lastMonthBookings,
      paidBookings,
      totalRevenue,
      monthlyRevenue,
      programs
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Booking.countDocuments({ paymentStatus: 'paid' }),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Program.countDocuments({ isActive: true })
    ]);

    // Monthly booking trend (last 6 months)
    const trendData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        activeBookings,
        monthlyBookings,
        lastMonthBookings,
        paidBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        activePrograms: programs,
        trend: trendData
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/bookings - paginated bookings list
router.get('/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } }
      ];
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('program', 'title price duration')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Booking.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/bookings/:id/status
router.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });

    const wasCancelled = booking.status === 'cancelled';

    booking.status = status;
    if (notes !== undefined) booking.notes = notes;
    await booking.save();

    // Kembalikan kuota sesi kalau booking baru saja dibatalkan
    if (status === 'cancelled' && !wasCancelled && booking.schedule) {
      const schedule = await Schedule.findById(booking.schedule);
      if (schedule) {
        schedule.booked = Math.max(schedule.booked - booking.participants, 0);
        await schedule.save();
      }
    }

    await booking.populate('program', 'title');
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/reports
router.get('/reports', async (req, res) => {
  try {
    const { from, to } = req.query;
    const matchFilter = { paymentStatus: 'paid' };

    if (from || to) {
      matchFilter.createdAt = {};
      if (from) matchFilter.createdAt.$gte = new Date(from);
      if (to) matchFilter.createdAt.$lte = new Date(to);
    }

    const [revenueByProgram, bookingsByStatus, topCustomers, monthlyTrend] = await Promise.all([
      Booking.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$program', totalRevenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        { $lookup: { from: 'programs', localField: '_id', foreignField: '_id', as: 'program' } },
        { $unwind: '$program' },
        { $project: { name: '$program.title', totalRevenue: 1, count: 1 } },
        { $sort: { totalRevenue: -1 } }
      ]),
      Booking.aggregate([
        { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
      ]),
      Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: '$customerEmail', name: { $first: '$customerName' }, totalSpent: { $sum: '$totalAmount' }, bookings: { $sum: 1 } } },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 }
      ]),
      Booking.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$totalAmount' },
            bookings: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ])
    ]);

    res.json({
      success: true,
      data: { revenueByProgram, bookingsByStatus, topCustomers, monthlyTrend }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET/POST/PATCH/DELETE /api/admin/programs
router.get('/programs', async (req, res) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 });
    res.json({ success: true, data: programs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/programs', async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({ success: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/programs/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!program) return res.status(404).json({ success: false, error: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/programs/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ success: false, error: 'Program not found' });
    res.json({ success: true, message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== Manajemen Staf (akun login admin) =====

// GET /api/admin/users — daftar staf
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/users — tambah staf
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Nama, email, dan password wajib diisi' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password minimal 6 karakter' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, error: 'Email sudah terdaftar' });
    }
    const user = await User.create({ name, email, password, role: role || 'admin' });
    const data = user.toObject();
    delete data.password;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/users/:id — edit nama/role/aktif (atau reset password)
router.patch('/users/:id', async (req, res) => {
  try {
    const { name, role, isActive, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'Staf tidak ditemukan' });

    // Tidak boleh menonaktifkan akun sendiri
    if (req.params.id === String(req.user._id) && isActive === false) {
      return res.status(400).json({ success: false, error: 'Tidak bisa menonaktifkan akun sendiri' });
    }

    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) user.password = password; // akan di-hash oleh pre-save
    await user.save();

    const data = user.toObject();
    delete data.password;
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/users/:id — hapus staf
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({ success: false, error: 'Tidak bisa menghapus akun sendiri' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'Staf tidak ditemukan' });
    res.json({ success: true, message: 'Staf dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
