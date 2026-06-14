import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/database.js';

dotenv.config();

async function seedAdmin() {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@bodogolfarm.com' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Admin Bodogol',
    email: 'admin@bodogolfarm.com',
    password: 'admin123',
    role: 'admin'
  });

  console.log('Admin created successfully!');
  console.log('Email:', admin.email);
  console.log('Password: admin123');
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
