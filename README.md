# 🌾 Bodogol Farm — Website Edukasi & Booking

Website untuk **Bodogol Farm**: platform edukasi peternakan & pertanian sekaligus
sistem **booking program** dengan pembayaran online (Midtrans). Dibangun dengan
stack **MERN** (MongoDB, Express, React, Node.js).

> Final Project / Capstone.

---

## 🧱 Tech Stack

| Bagian | Teknologi |
|--------|-----------|
| **Frontend** (`client/`) | React 19 + Vite + Tailwind CSS + React Router |
| **Backend** (`server/`) | Express.js + MongoDB (Mongoose) |
| **Auth** | JWT + bcrypt |
| **Pembayaran** | Midtrans |
| **Keamanan** | Helmet, CORS, express-rate-limit, express-validator |

---

## 📁 Struktur Folder

```
WEB SITE BODOGOL FARM/
├── package.json          # script jalanin client + server bareng
├── client/               # FRONTEND (React + Vite)
│   └── src/
│       ├── components/    # komponen UI (Header, Footer, dll) + admin/
│       ├── pages/         # halaman (Home, About, Programs, Booking, dll) + admin/
│       ├── utils/         # api.js, constants.js
│       └── assets/        # gambar & ikon
└── server/               # BACKEND (Express + MongoDB)
    ├── config/           # koneksi database, midtrans
    ├── models/           # User, Booking, Program, Contact
    ├── routes/           # auth, bookings, payments, programs, contact, admin
    ├── middleware/        # auth, security, errorHandler
    ├── data/             # seed data (program & admin)
    └── server.js         # entry point
```

---

## 🚀 Cara Menjalankan (Setup)

### Prasyarat
- [Node.js](https://nodejs.org/) v18+ dan npm
- [MongoDB](https://www.mongodb.com/) — lokal **atau** akun [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Clone repo
```bash
git clone https://github.com/bahbau2005-collab/web-bodogolfarm.git
cd web-bodogolfarm
```

### 2. Install semua dependency (client + server)
```bash
npm run install:all
```

### 3. Siapkan file `.env`
File `.env` **tidak ikut di-commit** (berisi rahasia). Buat sendiri dengan
menyalin dari contoh:

**Backend** — `server/.env` (salin dari `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bodogol-farm
JWT_SECRET=ganti-dengan-kunci-rahasia-sendiri
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
```

**Frontend** — `client/.env` (salin dari `client/.env.example`):
```env
VITE_API_URL=http://localhost:5000
```

### 4. Isi data awal (seed) — opsional
```bash
cd server
npm run seed          # isi data program
npm run seed-admin    # buat akun admin
cd ..
```

### 5. Jalankan (client + server sekaligus)
```bash
npm run dev
```
- Frontend → http://localhost:5173
- Backend  → http://localhost:5000
- Cek API  → http://localhost:5000/api/health

> Mau jalanin terpisah? `npm run dev:client` atau `npm run dev:server`.

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/health` | Cek status server |
| GET | `/api/programs` | Daftar program |
| POST | `/api/bookings` | Buat booking |
| POST | `/api/contact` | Kirim pesan kontak |
| POST | `/api/payments` | Proses pembayaran (Midtrans) |
| POST | `/api/auth` | Login / register |
| * | `/api/admin` | Endpoint admin (perlu auth) |

---

## 👥 Kerja Tim (Git Workflow)

```bash
# Sebelum mulai kerja, tarik perubahan terbaru
git pull

# Setelah selesai
git add -A
git commit -m "deskripsi perubahan"
git push
```

> ⚠️ **Jangan pernah commit file `.env`** — sudah otomatis di-ignore lewat `.gitignore`.

---

## 📦 Script Penting (root `package.json`)

| Perintah | Fungsi |
|----------|--------|
| `npm run install:all` | Install dependency client + server |
| `npm run dev` | Jalankan client + server bersamaan |
| `npm run dev:client` | Jalankan frontend saja |
| `npm run dev:server` | Jalankan backend saja |
| `npm run build` | Build frontend untuk production |

---

_Bodogol Farm Team_
