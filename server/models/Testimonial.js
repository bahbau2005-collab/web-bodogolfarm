import mongoose from 'mongoose';

/**
 * Testimonial Model
 * Testimoni peserta yang tampil di Beranda & dikelola lewat admin.
 */
const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi'],
    trim: true,
    maxlength: [100, 'Nama maksimal 100 karakter']
  },
  role: {
    type: String,
    trim: true,
    maxlength: [100, 'Peran maksimal 100 karakter'],
    default: ''
  },
  text: {
    type: String,
    required: [true, 'Isi testimoni wajib diisi'],
    maxlength: [600, 'Testimoni maksimal 600 karakter']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  image: {
    type: String, // URL/path foto avatar (opsional)
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

testimonialSchema.index({ isPublished: 1, createdAt: -1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
