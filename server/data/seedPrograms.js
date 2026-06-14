import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Program from '../models/Program.js';

dotenv.config({ path: './.env' });

const programs = [
  {
    title: 'Wisata Edukasi Anak PAUD',
    description: 'Program khusus untuk anak PAUD untuk mengenalkan dunia peternakan sejak dini.',
    duration: '1 hari',
    price: 150000,
    capacity: 20,
    facilities: ['Snack', 'Foto peserta', 'Materi edukasi'],
    schedule: 'Setiap Sabtu & Minggu',
    image: '/images/programs/paud.jpg',
    isActive: true
  },
  {
    title: 'Edukasi Sekolah (SD/SMP/SMA)',
    description: 'Program edukasi komprehensif untuk siswa dari SD hingga SMA.',
    duration: '1 hari',
    price: 200000,
    capacity: 30,
    facilities: ['Snack', 'Makan siang', 'Materi edukasi', 'Sertifikat'],
    schedule: 'Senin - Jumat',
    image: '/images/programs/sekolah.jpg',
    isActive: true
  },
  {
    title: 'Paket Outing Days',
    description: 'Paket wisata edukasi dan team building untuk grup/komunitas.',
    duration: '1 hari',
    price: 350000,
    capacity: 50,
    facilities: ['Breakfast', 'Makan siang', 'Snack', 'Materi edukasi'],
    schedule: 'Setiap akhir pekan',
    image: '/images/programs/outing.jpg',
    isActive: true
  },
  {
    title: 'Program Magang/Training',
    description: 'Program intensif untuk calon peternak yang ingin belajar manajemen peternakan profesional.',
    duration: '3 hari',
    price: 5000000,
    capacity: 10,
    facilities: ['Akomodasi', 'Semua makan', 'Materi training', 'Sertifikat'],
    schedule: 'Jadwal custom sesuai peserta',
    image: '/images/programs/magang.jpg',
    isActive: true
  }
];

const seedPrograms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    await Program.deleteMany({});
    const created = await Program.insertMany(programs);

    console.log(`✅ Seeded ${created.length} programs successfully`);
    process.exit();
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedPrograms();
