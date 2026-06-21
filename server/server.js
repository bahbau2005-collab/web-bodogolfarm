import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { corsConfig, securityConfig, limiter, apiLimiter } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route imports
import programRoutes from './routes/programs.js';
import scheduleRoutes from './routes/schedules.js';
import articleRoutes from './routes/articles.js';
import testimonialRoutes from './routes/testimonials.js';
import bookingRoutes from './routes/bookings.js';
import contactRoutes from './routes/contact.js';
import paymentRoutes from './routes/payments.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import cronRoutes from './routes/cron.js';
// Load environment variables
dotenv.config();

// Mulai koneksi database (cached)
connectDB();

// Initialize Express app
const app = express();

// Security middleware
app.use(securityConfig);
app.use(corsConfig);

// Rate limiting
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Pastikan koneksi DB siap sebelum menangani request DB (penting untuk serverless).
// Endpoint /api/health dilewati agar tetap bisa dicek walau DB bermasalah.
app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    // Log detail di server, jangan bocorkan ke client (cegah info disclosure)
    console.error('[DB] Gagal konek:', err.message);
    res.status(503).json({ success: false, error: 'Layanan sedang tidak tersedia, coba lagi.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bodogol Farm API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/programs', apiLimiter, programRoutes);
app.use('/api/schedules', apiLimiter, scheduleRoutes);
app.use('/api/articles', apiLimiter, articleRoutes);
app.use('/api/testimonials', apiLimiter, testimonialRoutes);
app.use('/api/bookings', apiLimiter, bookingRoutes);
app.use('/api/contact', apiLimiter, contactRoutes);
app.use('/api/payments', apiLimiter, paymentRoutes);
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
app.use('/api/cron', cronRoutes);
// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Bodogol Farm API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      programs: 'GET /api/programs',
      bookings: 'POST /api/bookings',
      contact: 'POST /api/contact'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server — HANYA saat dijalankan langsung (lokal/Render).
// Di Vercel (serverless) kita TIDAK listen; app diekspor sebagai handler.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`
🚀 Bodogol Farm Backend Server Started!
📍 Running on: http://localhost:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Health Check: http://localhost:${PORT}/api/health
📚 API Docs: http://localhost:${PORT}/
  `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });
}

export default app;