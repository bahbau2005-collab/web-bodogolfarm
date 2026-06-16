import mongoose from 'mongoose';

/**
 * Schedule Model
 * Sesi/jadwal pelaksanaan sebuah Program pada tanggal & jam tertentu,
 * lengkap dengan kuota. Satu Program bisa punya banyak sesi.
 */
const scheduleSchema = new mongoose.Schema({
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: [true, 'Program reference is required']
  },
  date: {
    type: Date,
    required: [true, 'Schedule date is required']
  },
  startTime: {
    type: String, // format "HH:mm", mis. "09:00"
    required: [true, 'Start time is required'],
    match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Format jam harus HH:mm']
  },
  endTime: {
    type: String,
    match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Format jam harus HH:mm']
  },
  quota: {
    type: Number,
    required: [true, 'Quota is required'],
    min: [1, 'Quota must be at least 1']
  },
  booked: {
    type: Number,
    default: 0,
    min: [0, 'Booked cannot be negative']
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

scheduleSchema.index({ program: 1, date: 1 });
scheduleSchema.index({ date: 1, status: 1 });

// Sisa kuota
scheduleSchema.virtual('remaining').get(function () {
  return Math.max(this.quota - this.booked, 0);
});

// Apakah sudah penuh
scheduleSchema.virtual('isFull').get(function () {
  return this.booked >= this.quota;
});

scheduleSchema.set('toJSON', { virtuals: true });
scheduleSchema.set('toObject', { virtuals: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
