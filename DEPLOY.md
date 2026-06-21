# 🚀 Panduan Deploy — Bodogol Farm (Vercel, tanpa kartu)

Arsitektur:
- **Database** → MongoDB Atlas (free) — ✅ SUDAH JADI
- **Backend** (Express serverless) → Vercel (free, tanpa kartu)
- **Frontend** (React/Vite) → Vercel (free)

> Dibuat 2 project Vercel terpisah dari 1 repo: `server` (backend) & `client` (frontend).
> Untuk demo: Midtrans **sandbox**. Saat serah-terima ke client, ganti kepemilikan.

---

## ✅ Step 1 — MongoDB Atlas (SELESAI)
Cluster + user + Network Access `0.0.0.0/0` + connection string (ada di `server/.env`) + data sudah di-seed.

## Step 2 — Backend ke Vercel
1. Login https://vercel.com (Sign in with GitHub `bahbau2005-collab`)
2. **Add New → Project** → import repo `web-bodogolfarm`
3. **Root Directory:** pilih **`server`** ⚠️
4. Framework Preset: **Other** (biarkan; sudah ada `server/vercel.json`)
5. **Environment Variables** (copy nilai rahasia dari `server/.env`):
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | *(string Atlas)* |
   | `JWT_SECRET` | *(dari .env)* |
   | `JWT_EXPIRE` | `7d` |
   | `CLIENT_URL` | `http://localhost:5173` *(sementara, diupdate di Step 4)* |
   | `MIDTRANS_SERVER_KEY` | *(dari .env)* |
   | `MIDTRANS_CLIENT_KEY` | *(dari .env)* |
   | `MIDTRANS_IS_PRODUCTION` | `false` |
   | `EMAIL_HOST` | `smtp.gmail.com` |
   | `EMAIL_PORT` | `465` |
   | `EMAIL_USER` | `bodogolfarm12345@gmail.com` |
   | `EMAIL_PASS` | *(app password dari .env)* |
   | `EMAIL_FROM` | `Bodogol Farm <bodogolfarm12345@gmail.com>` |
   > JANGAN set `PORT` (serverless tidak pakai). `VERCEL` otomatis ada.
6. **Deploy** → catat URL backend, mis. `https://bodogol-api.vercel.app`
7. Tes: buka `<URL backend>/api/health` → harus `{"success":true,...}`

## Step 3 — Frontend ke Vercel
1. **Add New → Project** → import repo **yang sama** lagi
2. **Root Directory:** pilih **`client`** ⚠️
3. Framework: **Vite** (auto-detect)
4. **Environment Variables:**
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | *(URL backend dari Step 2)* |
5. **Deploy** → catat URL frontend, mis. `https://bodogol-farm.vercel.app`

## Step 4 — Sambungkan (CORS & redirect bayar)
1. Buka project **backend** di Vercel → Settings → Environment Variables
2. Update `CLIENT_URL` = URL frontend (Step 3)
3. **Redeploy** backend (Deployments → ... → Redeploy)

## Step 5 — Midtrans webhook
1. Login https://dashboard.sandbox.midtrans.com
2. **Settings → Configuration → Payment Notification URL:**
   `<URL backend>/api/payments/notification`
3. Save → status "lunas" & email e-ticket jalan otomatis setelah bayar.

## Step 6 — Cek akhir
- [ ] Buka URL frontend → web tampil + data muncul
- [ ] Booking → bayar (kartu sandbox `4811 1111 1111 1114`, CVV `123`, OTP `112233`)
- [ ] Balik ke `/payment` → status benar + email e-ticket masuk
- [ ] Login admin (`/admin/login`) → data tampil

---

## ⚠️ Catatan serverless (Vercel)
- Cold start: request pertama setelah idle agak lambat — wajar di free tier.
- Rate limiter in-memory kurang efektif di serverless (reset tiap cold start) — cukup untuk demo.

## ⚠️ Saat serah-terima ke client (go-live)
- Midtrans → akun production Bodogol Farm + `MIDTRANS_IS_PRODUCTION=true`
- Pindah kepemilikan Atlas/Vercel/domain ke client
- Ganti password admin `admin123` & email pengirim
- Tinjau rate limiter; pasang domain custom (mis. bodogolfarm.com) di Vercel
