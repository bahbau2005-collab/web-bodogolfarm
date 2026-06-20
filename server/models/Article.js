import mongoose from 'mongoose';

/**
 * Article Model
 * Artikel edukasi yang tampil di halaman Edukasi & dikelola lewat admin.
 */
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul artikel wajib diisi'],
    trim: true,
    maxlength: [150, 'Judul maksimal 150 karakter']
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [300, 'Ringkasan maksimal 300 karakter'],
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    trim: true,
    default: 'Umum'
  },
  readTime: {
    type: String,
    trim: true,
    default: '5 menit'
  },
  image: {
    type: String, // URL atau path (mis. /images/edukasi/xxx.png)
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

articleSchema.index({ isPublished: 1, createdAt: -1 });
articleSchema.index({ category: 1 });

const Article = mongoose.model('Article', articleSchema);

export default Article;
