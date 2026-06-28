const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/profil/aparatur', async (req, res) => {
  try { const data = await prisma.aparatur.findMany({ orderBy: { urutan: 'asc' } }); res.json(data); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/profil/sejarah', async (req, res) => {
  try { const info = await prisma.infoDesa.findFirst({ where: { id: 1 } }); res.json(info || { sejarah: '', visi_misi: '[]' }); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/statistik/penduduk', async (req, res) => {
  try {
    const data = await prisma.statistikPenduduk.findFirst({ where: { id: 1 } });
    if (data) {
      ['data_per_usia', 'data_per_pendidikan', 'data_per_pekerjaan', 'data_per_kawin', 'data_per_agama'].forEach(k => { data[k] = JSON.parse(data[k]); });
    }
    res.json(data || { total: 0, laki_laki: 0, perempuan: 0, kk: 0, rw_count: 0, rt_count: 0 });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/publik/info-desa', async (req, res) => {
  try { const info = await prisma.infoDesa.findFirst({ where: { id: 1 } }); res.json(info || {}); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/publik/statistik-pengunjung', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const [hariIni, kemarin, total] = await Promise.all([
      prisma.pengunjung.findUnique({ where: { tanggal: today } }),
      prisma.pengunjung.findUnique({ where: { tanggal: yesterday } }),
      prisma.pengunjung.aggregate({ _sum: { hit: true } })
    ]);
    res.json({ hariIni: hariIni?.hit || 0, kemarin: kemarin?.hit || 0, total: total._sum.hit || 0 });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/publik/hitung-pengunjung', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await prisma.pengunjung.upsert({ where: { tanggal: today }, update: { hit: { increment: 1 } }, create: { tanggal: today, hit: 1 } });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const tahun = new Date().getFullYear();
    const [pbbPending, pbbApproved, pengaduanBaru, totalBerita, totalWarga, bansosAktif] = await Promise.all([
      prisma.pembayaranPbb.count({ where: { status: 'PENDING', tahun_pajak: tahun } }),
      prisma.pembayaranPbb.count({ where: { status: 'APPROVED', tahun_pajak: tahun } }),
      prisma.pengaduan.count({ where: { status: 'DITERIMA' } }),
      prisma.berita.count(),
      prisma.warga.count(),
      prisma.programBansos.count({ where: { aktif: true } })
    ]);
    res.json({ pbbPending, pbbApproved, pengaduanBaru, totalBerita, totalWarga, bansosAktif });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;