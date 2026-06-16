import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Program from '../models/Program.js';
import Schedule from '../models/Schedule.js';

dotenv.config({ path: './.env' });

// Buat tanggal N hari ke depan (jam 00:00)
const daysFromNow = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};

const seedSchedules = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding schedules');

    const programs = await Program.find();
    if (programs.length === 0) {
      console.log('⚠️  Belum ada program. Jalankan "npm run seed" dulu.');
      process.exit(1);
    }

    await Schedule.deleteMany({});

    const sessions = [];
    // Tiap program dapat 3 sesi: 3, 7, dan 14 hari ke depan
    programs.forEach((program) => {
      [3, 7, 14].forEach((offset, i) => {
        sessions.push({
          program: program._id,
          date: daysFromNow(offset),
          startTime: i === 0 ? '09:00' : '13:00',
          endTime: i === 0 ? '11:30' : '15:30',
          quota: program.capacity,
          booked: 0,
          status: 'open'
        });
      });
    });

    const created = await Schedule.insertMany(sessions);
    console.log(`✅ Seeded ${created.length} schedules untuk ${programs.length} program`);
    process.exit();
  } catch (error) {
    console.error('❌ Seed schedules failed:', error);
    process.exit(1);
  }
};

seedSchedules();
