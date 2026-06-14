import mongoose from 'mongoose';

/**
 * Contact Message Model
 * Represents contact form submissions from website visitors
 */
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['info-program', 'booking', 'partnership', 'other'],
    default: 'other'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isReplied: {
    type: Boolean,
    default: false
  },
  replyMessage: {
    type: String,
    maxlength: [2000, 'Reply cannot exceed 2000 characters']
  },
  repliedAt: {
    type: Date
  },
  repliedBy: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'email', 'phone', 'social_media'],
    default: 'website'
  }
}, {
  timestamps: true
});

// Index for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ isRead: 1 });
contactSchema.index({ subject: 1 });
contactSchema.index({ createdAt: -1 });

// Virtual for subject display name
contactSchema.virtual('subjectDisplay').get(function() {
  const subjects = {
    'info-program': 'Informasi Program',
    'booking': 'Booking Kunjungan',
    'partnership': 'Kerjasama',
    'other': 'Lainnya'
  };
  return subjects[this.subject] || 'Lainnya';
});

// Virtual for priority display
contactSchema.virtual('priorityDisplay').get(function() {
  const priorities = {
    'low': 'Rendah',
    'medium': 'Sedang',
    'high': 'Tinggi'
  };
  return priorities[this.priority] || 'Sedang';
});

// Ensure virtual fields are serialized
contactSchema.set('toJSON', { virtuals: true });
contactSchema.set('toObject', { virtuals: true });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;