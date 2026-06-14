import mongoose from 'mongoose';

/**
 * Program Model
 * Represents educational programs offered by Bodogol Farm
 */
const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Program title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Program description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  duration: {
    type: String,
    required: [true, 'Program duration is required'],
    enum: ['1 hari', '2 hari', '3 hari']
  },
  price: {
    type: Number,
    required: [true, 'Program price is required'],
    min: [0, 'Price cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Program capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  facilities: [{
    type: String,
    trim: true
  }],
  schedule: {
    type: String,
    required: [true, 'Program schedule is required']
  },
  image: {
    type: String,
    default: '/images/program-default.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
programSchema.index({ isActive: 1, createdAt: -1 });

const Program = mongoose.model('Program', programSchema);

export default Program;