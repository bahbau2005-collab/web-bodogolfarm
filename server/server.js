import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { corsConfig, securityConfig, limiter, apiLimiter } from './middleware/security.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route imports
import programRoutes from './routes/programs.js';
import bookingRoutes from './routes/bookings.js';
import contactRoutes from './routes/contact.js';
import paymentRoutes from './routes/payments.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
// Load environment variables
dotenv.config();

// Connect to database
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
app.use('/api/bookings', apiLimiter, bookingRoutes);
app.use('/api/contact', apiLimiter, contactRoutes);
app.use('/api/payments', apiLimiter, paymentRoutes);
app.use('/api/auth', apiLimiter, authRoutes);
app.use('/api/admin', apiLimiter, adminRoutes);
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

// Start server
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
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;