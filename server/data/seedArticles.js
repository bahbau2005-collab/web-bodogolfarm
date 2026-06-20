import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Article from '../models/Article.js';

dotenv.config({ path: './.env' });

const articles = [
  { title: 'Panduan Lengkap Beternak Domba Modern', excerpt: 'Langkah praktis memulai peternakan domba dari nol hingga menghasilkan.', content: 'Peternakan domba modern membutuhkan perencanaan yang matang, mulai dari pemilihan bibit, manajemen kandang, hingga strategi pemasaran.', category: 'Panduan', readTime: '5 menit', image: '/images/edukasi/domba-modern.webp', isPublished: true },
  { title: 'Pakan Ternak yang Efektif untuk Pertumbuhan Optimal', excerpt: 'Strategi pemberian pakan yang tepat untuk meningkatkan produktivitas ternak.', content: 'Pakan merupakan 70% dari keberhasilan peternakan. Kombinasi hijauan, konsentrat, dan fermentasi menentukan pertumbuhan ternak.', category: 'Nutrisi', readTime: '4 menit', image: '/images/edukasi/pakan.webp', isPublished: true },
  { title: 'Manajemen Kesehatan Domba di Peternakan', excerpt: 'Cara mencegah dan menangani penyakit umum pada ternak domba.', content: 'Kesehatan ternak adalah prioritas utama. Vaksinasi rutin, sanitasi kandang, dan deteksi dini penyakit sangat penting.', category: 'Kesehatan', readTime: '6 menit', image: '/images/edukasi/kesehatan.webp', isPublished: true },
  { title: 'Bisnis Peternakan Domba: Dari Hobi ke Profit', excerpt: 'Analisis profitabilitas dan strategi bisnis peternakan domba yang sukses.', content: 'Peternakan domba bukan hanya hobi, tapi peluang bisnis menjanjikan dengan manajemen keuangan dan pemasaran yang tepat.', category: 'Bisnis', readTime: '7 menit', image: '/images/edukasi/bisnis.webp', isPublished: true },
  { title: 'Teknologi Modern dalam Peternakan Domba', excerpt: 'Penerapan teknologi untuk efisiensi peternakan modern.', content: 'Teknologi seperti panel surya, sensor, dan pencatatan digital merevolusi cara mengelola peternakan.', category: 'Teknologi', readTime: '5 menit', image: '/images/edukasi/teknologi.webp', isPublished: true },
  { title: 'Keberlanjutan dalam Peternakan Domba', excerpt: 'Praktik peternakan berkelanjutan untuk masa depan yang lebih baik.', content: 'Pengolahan limbah jadi kompos & biogas, serta integrasi pertanian, adalah kunci peternakan ramah lingkungan.', category: 'Keberlanjutan', readTime: '4 menit', image: '/images/edukasi/keberlanjutan.webp', isPublished: true },
];

const seedArticles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding articles');
    await Article.deleteMany({});
    const created = await Article.insertMany(articles);
    console.log(`✅ Seeded ${created.length} articles successfully`);
    process.exit();
  } catch (error) {
    console.error('❌ Seed articles failed:', error);
    process.exit(1);
  }
};

seedArticles();
