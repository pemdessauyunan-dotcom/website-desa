const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Clean existing
  await prisma.logAktivitas.deleteMany();
  await prisma.pengunjung.deleteMany();
  await prisma.penerimaBansos.deleteMany();
  await prisma.programBansos.deleteMany();
  await prisma.pembayaranPbb.deleteMany();
  await prisma.berita.deleteMany();
  await prisma.pengaduan.deleteMany();
  await prisma.galeri.deleteMany();
  await prisma.aparatur.deleteMany();
  await prisma.statistikPenduduk.deleteMany();
  await prisma.infoDesa.deleteMany();
  await prisma.warga.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash('admin123', 10);
  const hashRt = await bcrypt.hash('rt123', 10);
  const hashKolektor = await bcrypt.hash('kolektor123', 10);

  const admin = await prisma.user.create({ data: { email: 'admin@kasomalangkulon.id', password: hash, nama: 'Ahmad Saepulloh', role: 'ADMIN', rt: '', rw: '' } });
  const rtUser = await prisma.user.create({ data: { email: 'rt@kasomalangkulon.id', password: hashRt, nama: 'Dede Kusnadi', role: 'RT', rt: '01', rw: '01' } });
  const kolektor = await prisma.user.create({ data: { email: 'kolektor@kasomalangkulon.id', password: hashKolektor, nama: 'Eep Saepuloh', role: 'KOLEKTOR', rt: '01', rw: '01' } });
  console.log('Users created');

  await prisma.infoDesa.create({
    data: {
      alamat: 'Jl. Raya Kasomalang No. 123, Kec. Kasomalang, Kab. Subang, Jawa Barat 41281',
      kontak: '(0260) 123456 | info@kasomalangkulon.desa.id',
      jam_kerja: 'Senin - Jumat: 08:00 - 15:00 WIB | Sabtu: 08:00 - 12:00 WIB',
      sejarah: 'Desa Kasomalang Kulon berdiri sejak tahun 1850, merupakan salah satu desa tertua di Kecamatan Kasomalang. Desa ini dikenal sebagai daerah pertanian yang subur dengan komoditas utama padi dan palawija. Nama "Kasomalang" berasal dari bahasa Sunda kuno yang berarti "tempat yang aman dan tentram".',
      visi_misi: JSON.stringify([
        'Mewujudkan masyarakat Desa Kasomalang Kulon yang religius, mandiri, sejahtera, dan berbudaya',
        'Meningkatkan kualitas pelayanan publik yang prima dan transparan',
        'Mengembangkan potensi desa di bidang pertanian, wisata, dan UMKM',
        'Memperkuat kelembagaan desa yang partisipatif dan akuntabel'
      ])
    }
  });
  console.log('Info desa created');

  await prisma.statistikPenduduk.create({
    data: {
      total: 5247, laki_laki: 2650, perempuan: 2597, kk: 1432, rw_count: 4, rt_count: 12,
      data_per_usia: JSON.stringify([
        { label: '0-5', value: 412 }, { label: '6-12', value: 587 }, { label: '13-17', value: 503 },
        { label: '18-25', value: 892 }, { label: '26-35', value: 1034 }, { label: '36-50', value: 987 },
        { label: '51-60', value: 512 }, { label: '60+', value: 320 }
      ]),
      data_per_pendidikan: JSON.stringify([
        { label: 'Tidak/Belum Sekolah', value: 423 }, { label: 'SD/Sederajat', value: 1456 },
        { label: 'SMP/Sederajat', value: 1234 }, { label: 'SMA/Sederajat', value: 1567 },
        { label: 'D1-D3', value: 234 }, { label: 'S1', value: 298 }, { label: 'S2/S3', value: 35 }
      ]),
      data_per_pekerjaan: JSON.stringify([
        { label: 'Petani', value: 1432 }, { label: 'Buruh', value: 987 },
        { label: 'PNS', value: 156 }, { label: 'Wiraswasta', value: 678 },
        { label: 'Pedagang', value: 534 }, { label: 'IRT', value: 876 },
        { label: 'Pelajar/Mahasiswa', value: 456 }, { label: 'Lainnya', value: 128 }
      ]),
      data_per_kawin: JSON.stringify([
        { label: 'Kawin', value: 2789 }, { label: 'Belum Kawin', value: 2034 },
        { label: 'Cerai Hidup', value: 234 }, { label: 'Cerai Mati', value: 190 }
      ]),
      data_per_agama: JSON.stringify([
        { label: 'Islam', value: 5210 }, { label: 'Kristen', value: 18 },
        { label: 'Katolik', value: 12 }, { label: 'Hindu', value: 3 }, { label: 'Budha', value: 4 }
      ])
    }
  });
  console.log('Statistik created');

  const warga = [];
  const names = ['Asep Saepuloh', 'Neneng Hasanah', 'Usep Supriatna', 'Ikin Sodikin', 'Euis Suryani',
    'Dede Kusnadi', 'Encep Rustandi', 'Yati Nurhayati', 'Ade Rohmana', 'Tatang Suparman',
    'Siti Patimah', 'Agus Suherman', 'Yayah Rohayah', 'Ujang Kosasih', 'Eem Sumiati',
    'Cucu Suhendar', 'Iis Ismayati', 'Nanang Suryana', 'Mimin Mintarsih', 'Wawan Setiawan'];
  
  for (let i = 0; i < 20; i++) {
    const rt = String(Math.floor(i / 5) + 1).padStart(2, '0');
    warga.push(await prisma.warga.create({
      data: {
        nik: `321234567890${String(i + 1).padStart(4, '0')}`,
        nama: names[i],
        alamat: `Kp. Kasomalang RT ${rt}/RW 01 No. ${i + 1}`,
        rt, rw: '01',
        kelamin: i % 2 === 0 ? 'Laki-laki' : 'Perempuan',
        pendidikan: ['SD', 'SMP', 'SMA', 'S1'][i % 4],
        pekerjaan: ['Petani', 'Wiraswasta', 'Pedagang', 'Buruh'][i % 4],
        agama: 'Islam',
        status_kawin: i % 3 === 0 ? 'Belum Kawin' : 'Kawin',
        no_kk: `321234567890${String(i + 1).padStart(4, '0')}`
      }
    }));
  }
  console.log(`${warga.length} warga created`);

  const statuses = ['APPROVED', 'PENDING', 'REJECTED', 'APPROVED', 'APPROVED', 'PENDING', 'APPROVED', 'APPROVED', 'APPROVED', 'PENDING'];
  for (let i = 0; i < 10; i++) {
    const rt = String(Math.floor(i / 5) + 1).padStart(2, '0');
    await prisma.pembayaranPbb.create({
      data: {
        nop: `3212.3456.7890.${String(i + 1).padStart(4, '0')}`,
        nama_wajib_pajak: names[i],
        alamat_objek: `Kp. Kasomalang RT ${rt}/RW 01 No. ${i + 1}`,
        rt, rw: '01',
        luas_tanah: 120 + i * 10,
        luas_bangunan: 60 + i * 5,
        njop: 500000 + i * 50000,
        jumlah_pajak: 85000 + i * 5000,
        jumlah_dibayar: statuses[i] === 'REJECTED' ? 75000 : 85000 + i * 5000,
        tahun_pajak: 2026,
        kolektor_id: kolektor.id,
        status: statuses[i],
        catatan: statuses[i] === 'REJECTED' ? 'Bukti tidak jelas, mohon upload ulang' : null,
        approved_by: statuses[i] === 'APPROVED' ? admin.id : null,
        approved_at: statuses[i] === 'APPROVED' ? new Date() : null
      }
    });
  }
  console.log('10 PBB payments created');

  const programData = [
    { nama: 'PKH (Program Keluarga Harapan)', sumber_dana: 'APBN', periode: '2026', nominal: 3000000, kuota: 85 },
    { nama: 'BLT Dana Desa', sumber_dana: 'ADD', periode: '2026', nominal: 1800000, kuota: 150 },
    { nama: 'BPNT (Bantuan Pangan Non Tunai)', sumber_dana: 'APBN', periode: '2026', nominal: 1200000, kuota: 200 },
    { nama: 'BST (Bantuan Sosial Tunai)', sumber_dana: 'APBD Provinsi', periode: '2026', nominal: 600000, kuota: 100 }
  ];
  for (const p of programData) {
    await prisma.programBansos.create({ data: p });
  }
  console.log('4 bansos programs created');

  for (let i = 2; i < 7; i++) {
    await prisma.penerimaBansos.create({
      data: {
        nik: warga[i].nik, nama: warga[i].nama, alamat: warga[i].alamat,
        rt: warga[i].rt, rw: warga[i].rw,
        program_id: (i % 4) + 1,
        status: 'DISETUJUI',
        diverifikasi_oleh: admin.id
      }
    });
  }
  for (let i = 7; i < 9; i++) {
    await prisma.penerimaBansos.create({
      data: {
        nik: warga[i].nik, nama: warga[i].nama, alamat: warga[i].alamat,
        rt: warga[i].rt, rw: warga[i].rw,
        program_id: 1,
        status: 'DIUSULKAN',
        diusulkan_oleh: rtUser.id
      }
    });
  }
  console.log('Penerima bansos created');

  const beritaData = [
    { judul: 'Pembukaan Musyawarah Pembangunan Desa 2026', kategori: 'Berita Desa', konten: 'Musyawarah Pembangunan Desa (Musrenbangdes) tahun 2026 resmi dibuka oleh Kepala Desa Kasomalang Kulon. Kegiatan ini dihadiri oleh perangkat desa, BPD, LPM, tokoh masyarakat, dan perwakilan warga dari 4 RW. Musrenbangdes tahun ini fokus pada pembangunan infrastruktur jalan usaha tani, renovasi gedung PAUD, dan pengembangan BUMDes.' },
    { judul: 'Jadwal Pembayaran PBB 2026 Resmi Ditetapkan', kategori: 'Pengumuman', konten: 'Pemerintah Desa Kasomalang Kulon mengumumkan jadwal pembayaran Pajak Bumi dan Bangunan (PBB) tahun 2026. Pembayaran dibuka mulai 1 Februari hingga 30 September 2026. Warga dapat membayar melalui Kolektor di masing-masing RT atau langsung ke Kantor Desa.' },
    { judul: 'Penyaluran BLT Dana Desa Tahap I Tahun 2026', kategori: 'Pengumuman', konten: 'Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa tahap I tahun 2026 telah dilaksanakan pada tanggal 15 Januari 2026. Sebanyak 150 Keluarga Penerima Manfaat (KPM) menerima bantuan sebesar Rp 300.000 per bulan untuk 3 bulan (Januari-Maret).' },
    { judul: 'Potensi Wisata Desa Kasomalang Kulon: Curug Cilangkas', kategori: 'Wisata', konten: 'Desa Kasomalang Kulon memiliki potensi wisata alam yang indah, salah satunya Curug Cilangkas. Air terjun dengan ketinggian sekitar 15 meter ini terletak di Dusun Cilangkas, sekitar 3 km dari pusat desa. Saat ini pemerintah desa sedang mengembangkan kawasan tersebut sebagai destinasi wisata alam dengan fasilitas pendukung seperti area parkir, warung makan, dan spot foto.' },
    { judul: 'Realisasi Pembangunan Jalan Rabat Beton Dusun Cipadung', kategori: 'Pembangunan', konten: 'Proyek pembangunan jalan rabat beton sepanjang 750 meter di Dusun Cipadung telah mencapai 85% dan ditargetkan selesai akhir bulan ini. Jalan ini akan menghubungkan 3 RT di Dusun Cipadung dengan pusat desa, memudahkan akses warga untuk aktivitas ekonomi dan sosial.' }
  ];
  for (const b of beritaData) {
    await prisma.berita.create({
      data: {
        ...b,
        slug: b.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        penulis: 'Admin Desa',
        published: true
      }
    });
  }
  console.log('5 berita created');

  const aparaturData = [
    { nama: 'Drs. H. Diding Wahyudin, M.Si.', jabatan: 'Kepala Desa' },
    { nama: 'Asep Setiawan, S.E.', jabatan: 'Sekretaris Desa' },
    { nama: 'Nina Nurhayati, S.Pd.', jabatan: 'Kaur Keuangan' },
    { nama: 'Dadan Supriatna', jabatan: 'Kaur Perencanaan' },
    { nama: 'Euis Patimah, S.Sos.', jabatan: 'Kasi Kesejahteraan' },
    { nama: 'Agus Rusmana, S.Kom.', jabatan: 'Kasi Pelayanan' },
    { nama: 'Yayan Hendrayana', jabatan: 'Kadus 1 - Cipadung' },
    { nama: 'Rudi Hartono', jabatan: 'Kadus 2 - Cilangkas' }
  ];
  for (let i = 0; i < aparaturData.length; i++) {
    await prisma.aparatur.create({ data: { ...aparaturData[i], urutan: i + 1, foto: null } });
  }
  console.log('8 aparatur created');

  await prisma.galeri.create({ data: { judul: 'Kantor Desa Kasomalang Kulon', tipe: 'FOTO', album: 'Profil Desa', file_url: '' } });
  await prisma.galeri.create({ data: { judul: 'Kegiatan Musrenbangdes 2026', tipe: 'FOTO', album: 'Kegiatan', file_url: '' } });
  await prisma.galeri.create({ data: { judul: 'Penyaluran BLT Dana Desa', tipe: 'FOTO', album: 'Kegiatan', file_url: '' } });
  await prisma.galeri.create({ data: { judul: 'Curug Cilangkas', tipe: 'FOTO', album: 'Wisata', file_url: '' } });
  console.log('4 galeri items created');

  await prisma.pengaduan.create({
    data: { nama_pengirim: 'Warga RT 01', kontak: '08123456789', isi: 'Mohon perbaikan lampu jalan di RT 01 RW 01 yang mati sudah 1 minggu', anonim: false, status: 'DIPROSES', balasan: 'Terima kasih, akan segera ditindaklanjuti.' }
  });
  await prisma.pengaduan.create({
    data: { isi: 'Saluran air di depan rumah saya tersumbat, mohon segera diperbaiki', anonim: true, status: 'DITERIMA' }
  });
  console.log('2 pengaduan created');

  console.log('\n✅ SEED COMPLETE!');
  console.log('📧 admin@kasomalangkulon.id / admin123');
  console.log('📧 rt@kasomalangkulon.id / rt123');
  console.log('📧 kolektor@kasomalangkulon.id / kolektor123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());