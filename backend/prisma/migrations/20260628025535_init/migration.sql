-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'WARGA',
    "rt" TEXT,
    "rw" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "feature_flags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "warga" (
    "nik" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" TEXT NOT NULL,
    "rw" TEXT NOT NULL,
    "kelamin" TEXT NOT NULL,
    "tempat_lahir" TEXT,
    "tanggal_lahir" TEXT,
    "pendidikan" TEXT,
    "pekerjaan" TEXT,
    "agama" TEXT,
    "status_kawin" TEXT,
    "no_kk" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pembayaran_pbb" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nop" TEXT NOT NULL,
    "nama_wajib_pajak" TEXT NOT NULL,
    "alamat_objek" TEXT NOT NULL,
    "rt" TEXT NOT NULL,
    "rw" TEXT NOT NULL,
    "luas_tanah" REAL,
    "luas_bangunan" REAL,
    "njop" REAL,
    "jumlah_pajak" REAL,
    "jumlah_dibayar" REAL NOT NULL,
    "tahun_pajak" INTEGER NOT NULL,
    "kolektor_id" INTEGER,
    "bukti_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "catatan" TEXT,
    "approved_by" INTEGER,
    "approved_at" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "program_bansos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "sumber_dana" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "nominal" REAL NOT NULL,
    "kuota" INTEGER NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "penerima_bansos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nik" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "rt" TEXT NOT NULL,
    "rw" TEXT NOT NULL,
    "program_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DIUSULKAN',
    "catatan" TEXT,
    "diusulkan_oleh" INTEGER,
    "diverifikasi_oleh" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "penerima_bansos_nik_fkey" FOREIGN KEY ("nik") REFERENCES "warga" ("nik") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "penerima_bansos_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "program_bansos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "berita" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "kategori" TEXT,
    "gambar" TEXT,
    "penulis" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pengaduan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama_pengirim" TEXT,
    "kontak" TEXT,
    "isi" TEXT NOT NULL,
    "anonim" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DITERIMA',
    "balasan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "galeri" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "file_url" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "album" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "aparatur" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "foto" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "info_desa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alamat" TEXT,
    "kontak" TEXT,
    "jam_kerja" TEXT,
    "sejarah" TEXT,
    "visi_misi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "statistik_penduduk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total" INTEGER NOT NULL DEFAULT 0,
    "laki_laki" INTEGER NOT NULL DEFAULT 0,
    "perempuan" INTEGER NOT NULL DEFAULT 0,
    "kk" INTEGER NOT NULL DEFAULT 0,
    "rw_count" INTEGER NOT NULL DEFAULT 0,
    "rt_count" INTEGER NOT NULL DEFAULT 0,
    "data_per_usia" TEXT,
    "data_per_pendidikan" TEXT,
    "data_per_pekerjaan" TEXT,
    "data_per_kawin" TEXT,
    "data_per_agama" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pengunjung" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tanggal" TEXT NOT NULL,
    "hit" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "log_aktivitas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "aksi" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "log_aktivitas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "berita_slug_key" ON "berita"("slug");
