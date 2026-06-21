import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database Configuration
 * Koneksi MongoDB via Mongoose, dengan caching agar aman di lingkungan
 * serverless (Vercel) — koneksi dipakai ulang antar invocation, tidak
 * bikin koneksi baru tiap request.
 */
let cached = globalThis._mongooseConn;
if (!cached) cached = globalThis._mongooseConn = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000, // gagal cepat (8s) daripada gantung
      })
      .then((m) => {
        console.log(`✅ MongoDB Connected: ${m.connection.host}`);
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error; // jangan process.exit di serverless — cukup lempar error
  }

  return cached.conn;
};

export default connectDB;
