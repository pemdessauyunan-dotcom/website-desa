# Website Desa Kasomalang Kulon

Website resmi pemerintahan **Desa Kasomalang Kulon**, Kecamatan Kasomalang, Kabupaten Subang, Jawa Barat.

## Arsitektur

```
website-desa/
├── frontend/       # Next.js 14 + Tailwind CSS → Vercel
├── backend/        # Express.js + Prisma + PostgreSQL → IDCloudHost
├── scripts/        # Migrasi data Excel ke database
└── docs/           # Dokumentasi
```

## Tech Stack

| Layer | Teknologi | Deployment |
|-------|-----------|------------|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion | Vercel |
| Backend | Express.js, Prisma ORM | IDCloudHost VPS |
| Database | PostgreSQL (prod) / SQLite (dev) | IDCloudHost |
| Auth | JWT + RBAC | Backend |
| File Storage | Local disk / Object Storage | IDCloudHost |

## Fitur Utama

- ✅ Website publik desa lengkap (beranda, profil, berita, galeri, dll)
- ✅ Dashboard multi-role: Admin Desa, RT, Kolektor
- ✅ Modul PBB: upload bukti → pending → approve/reject
- ✅ Modul Bansos: usulan RT → verifikasi Admin
- ✅ CMS Berita & Artikel
- ✅ Manajemen Pengaduan
- ✅ Galeri Foto & Video
- ✅ Cek PBB & Bansos publik (by NOP/NIK)
- ✅ Login Masyarakat (disiapkan, belum aktif)

## Cara Jalankan (Local Development)

### Prasyarat
- Node.js 18+
- npm/pnpm

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Backend berjalan di `http://localhost:5000`, frontend di `http://localhost:3000`.

## Akun Demo

| Role | Email | Password |
|------|-------|----------|
| Admin Desa | admin@kasomalangkulon.id | admin123 |
| RT | rt@kasomalangkulon.id | rt123 |
| Kolektor | kolektor@kasomalangkulon.id | kolektor123 |

## Deployment

- **Frontend**: Push ke `main`, Vercel auto-deploy
- **Backend**: Deploy ke VPS IDCloudHost, jalankan dengan PM2