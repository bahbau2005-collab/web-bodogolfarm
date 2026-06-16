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
  // Jenis layanan (untuk filter & label di halaman Services)
  type: {
    type: String,
    enum: ['agrotourism', 'edukasi', 'training'],
    default: 'agrotourism'
  },
  // Target peserta
  category: {
    type: String,
    enum: ['family', 'school', 'university', 'umum'],
    default: 'umum'
  },
  // Mode pelaksanaan
  mode: {
    type: String,
    enum: ['offline', 'online'],
    default: 'offline'
  },
  duration: {
    type: String,
    required: [true, 'Program duration is required'],
    trim: true,
    maxlength: [50, 'Duration cannot exceed 50 characters']
  },
  price: {
    type: Number,
    required: [true, 'Program price is required'],
    min: [0, 'Price cannot be negative']
  },
  // Satuan harga: per orang / paket / course / semester
  priceUnit: {
    type: String,
    enum: ['orang', 'paket', 'course', 'semester'],
    default: 'orang'
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