import mongoose from 'mongoose';

/**
 * Booking Model
 * Represents customer bookings for programs
 */
const bookingSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: [true, 'Program reference is required']
  },
  // Sesi/jadwal yang dipesan (opsional; berisi kuota)
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  },
  // Kode tiket unik untuk e-ticket (mis. BF-2026-X7K9A), digenerate otomatis
  ticketCode: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    trim: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },
  participants: {
    type: Number,
    required: [true, 'Number of participants is required'],
    min: [1, 'At least 1 participant required'],
    max: [50, 'Maximum 50 participants allowed']
  },
  // Rincian peserta (dewasa/anak). participants = adults + children
  adults: {
    type: Number,
    default: 1,
    min: [0, 'Adults cannot be negative']
  },
  children: {
    type: Number,
    default: 0,
    min: [0, 'Children cannot be negative']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Booking date cannot be in the past'
    }
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters'],
    default: ''
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'cancelled', 'challenge', 'unknown'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['midtrans', 'bank_transfer', 'cash'],
    default: 'midtrans'
  },
  paymentOrderId: {
    type: String,
    sparse: true
  },
  paymentToken: {
    type: String,
    sparse: true
  },
  paymentUrl: {
    type: String,
    sparse: true
  },
  paymentNotification: {
    type: mongoose.Schema.Types.Mixed, // Store Midtrans notification data
    default: null
  },
  transactionId: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
bookingSchema.index({ customerEmail: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });

// Virtual for formatted booking date
bookingSchema.virtual('formattedBookingDate').get(function() {
  return this.bookingDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Generate ticketCode otomatis saat dokumen baru dibuat.
// Format: BF-<tahun>-<5 char acak>, mis. "BF-2026-X7K9A"
bookingSchema.pre('save', function (next) {
  if (!this.ticketCode) {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // hindari karakter ambigu (0/O, 1/I)
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    this.ticketCode = `BF-${year}-${code}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;