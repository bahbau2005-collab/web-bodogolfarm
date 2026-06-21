# 🚀 Panduan Deploy — Bodogol Farm (versi demo)

Arsitektur deploy gratis:
- **Database** → MongoDB Atlas (free tier)
- **Backend** (Express) → Render (free)
- **Frontend** (React/Vite) → Vercel (free)

> Untuk demo/sidang: pakai akun sendiri + Midtrans **sandbox**. Saat serah-terima ke client, ganti kepemilikan (lihat KREDENSIAL.local.md & checklist).

---

## 1. MongoDB Atlas (database online)
1. Daftar di https://www.mongodb.com/atlas → buat **Cluster gratis (M0)**
2. **Database Access** → buat user DB (username + password) → catat
3. **Network Access** → Add IP → `0.0.0.0/0` (allow from anywhere) — biar Render bisa konek
4. **Connect → Drivers** → salin connection string:
   `mongodb+srv://<user>:<password>@cluster.../bodogol-farm`
5. Simpan string ini untuk env backend (`MONGODB_URI`)

## 2. Backend → Render
1. Daftar https://render.com → **New → Web Service** → connect repo GitHub `web-bodogolfarm`
2. Setting:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment Variables** (Settings → Environment):
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<connection string Atlas tadi>
   JWT_SECRET=<string acak panjang, mis. dari KREDENSIAL.local.md>
   JWT_EXPIRE=7d
   CLIENT_URL=<URL Vercel frontend, isi setelah langkah 3>
   MIDTRANS_SERVER_KEY=<sandbox server key>
   MIDTRANS_CLIENT_KEY=<sandbox client key>
   MIDTRANS_IS_PRODUCTION=false
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_USER=bodogolfarm12345@gmail.com
   EMAIL_PASS=<app password>
   EMAIL_FROM=Bodogol Farm <bodogolfarm12345@gmail.com>
   ```
4. Deploy → catat URL backend (mis. `https://bodogol-api.onrender.com`)
5. **Seed data** (sekali): di Render Shell jalankan `npm run seed && npm run seed-schedules && npm run seed-articles && npm run seed-testimonials && npm run seed-admin`

## 3. Frontend → Vercel
1. Daftar https://vercel.com → **Add New → Project** → import repo `web-bodogolfarm`
2. Setting:
   - **Root Directory:** `client`
   - Framework: Vite (auto-detect) · Build: `npm run build` · Output: `dist`
3. **Environment Variables:**
   ```
   VITE_API_URL=<URL backend Render dari langkah 2>
   ```
4. Deploy → catat URL frontend (mis. `https://bodogol-farm.vercel.app`)
5. **Balik ke Render** → update `CLIENT_URL` = URL Vercel ini → redeploy backend (biar CORS & redirect bayar benar)

## 4. Midtrans (webhook)
1. Login https://dashboard.sandbox.midtrans.com
2. **Settings → Configuration → Payment Notification URL:**
   `<URL backend Render>/api/payments/notification`
3. Save. Sekarang status "lunas" & email e-ticket otomatis jalan setelah pembayaran.

## 5. Cek akhir
- [ ] Buka URL Vercel → web kebuka
- [ ] Booking → bayar (kartu sandbox `4811 1111 1111 1114`, CVV 123, OTP 112233)
- [ ] Setelah bayar → balik ke /payment, status benar, email e-ticket masuk
- [ ] Login admin → data muncul

---

## ⚠️ Saat serah-terima ke client (go-live beneran)
- Ganti **Midtrans** ke akun production milik Bodogol Farm + `MIDTRANS_IS_PRODUCTION=true`
- Pindah kepemilikan Atlas/Render/Vercel/domain ke client
- Ganti password admin `admin123` & email pengirim
- Naikkan/tinjau rate limiter untuk traffic publik
- (Opsional) pasang domain custom (mis. bodogolfarm.com) di Vercel
