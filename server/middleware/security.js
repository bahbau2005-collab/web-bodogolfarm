import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import { RedisStore } from 'rate-limit-redis';

/**
 * Store untuk rate limiter.
 * Kalau REDIS_URL ada (mis. Upstash) → pakai Redis (counter dibagi antar
 * instance serverless, jadi limiter beneran efektif di Vercel).
 * Kalau tidak ada → fallback ke MemoryStore bawaan (cukup untuk lokal).
 * Klien Redis di-cache global agar tidak bikin koneksi baru tiap invocation.
 */
let redisClient = null;
if (process.env.REDIS_URL) {
  try {
    redisClient = globalThis._redisClient;
    if (!redisClient) {
      redisClient = globalThis._redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
      });
      redisClient.on('error', (e) => console.error('[Redis] error:', e.message));
    }
  } catch (e) {
    console.error('[Redis] gagal inisialisasi, fallback ke memory:', e.message);
    redisClient = null;
  }
}

const makeStore = (prefix) =>
  redisClient
    ? new RedisStore({ sendCommand: (...args) => redisClient.call(...args), prefix })
    : undefined;

/**
 * CORS Configuration
 * Allows cross-origin requests from frontend
 */
export const corsConfig = cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

/**
 * Security Headers Configuration
 * Sets various security headers using Helmet
 */
export const securityConfig = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://cdn.tailwindcss.com"]
    }
  }
});

/**
 * Rate Limiting Configuration
 * Prevents abuse by limiting requests per IP
 */
// Saat development limiter dimatikan agar tidak mengganggu (React StrictMode
// fetch 2x, HMR, dsb). Di production tetap aktif untuk keamanan.
const skipInDev = () => process.env.NODE_ENV !== 'production';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDev,
  store: makeStore('rl:')
});

/**
 * API Rate Limiting (stricter for API endpoints)
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 API requests per windowMs
  message: {
    error: 'Too many API requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDev,
  store: makeStore('rl-api:')
});

/**
 * Auth Rate Limiting (stricter for auth endpoints)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth attempts per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipInDev,
  store: makeStore('rl-auth:')
});