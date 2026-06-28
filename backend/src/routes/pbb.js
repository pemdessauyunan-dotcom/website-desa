const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/cek', async (req, res) => {
  try {
    const { nop } = req.query;
    if (!nop) return res.status(400).json({ error: 'Masukkan NOP' });
    const bayar = await prisma.pembayaranPbb.findFirst({
      where: { nop, tahun_pajak: new Date().getFullYear() }, orderBy: { created_at: 'desc' }
    });
    if (!bayar) return res.json({ status: 'BELUM', nop, message: 'Belum ada pembayaran tahun ini' });
    res.json({ status: bayar.status, nop, tahun_pajak: bayar.tahun_pajak, jumlah_dibayar: bayar.jumlah_dibayar });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/stats', async (req, res) => {
  try {
    const tahun = parseInt(req.query.tahun) || new Date().getFullYear();
    const semua = await prisma.pembayaranPbb.count({ where: { tahun_pajak: tahun } });
    const lunas = await prisma.pembayaranPbb.count({ where: { tahun_pajak: tahun, status: 'APPROVED' } });
    const pending = await prisma.pembayaranPbb.count({ where: { tahun_pajak: tahun, status: 'PENDING' } });
    const ditolak = await prisma.pembayaranPbb.count({ where: { tahun_pajak: tahun, status: 'REJECTED' } });
    const tot = await prisma.pembayaranPbb.aggregate({ where: { tahun_pajak: tahun, status: 'APPROVED' }, _sum: { jumlah_dibayar: true } });
    res.json({ tahun, total: semua, lunas, pending, ditolak, totalTerkumpul: tot._sum.jumlah_dibayar || 0 });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/pembayaran', authMiddleware, roleMiddleware('KOLEKTOR','ADMIN'), upload.single('bukti'), async (req, res) => {
  try {
    const { nop, nama_wajib_pajak, alamat_objek, rt, rw, tahun_pajak, jumlah_dibayar } = req.body;
    if (!nop || !nama_wajib_pajak || !tahun_pajak || !jumlah_dibayar) return res.status(400).json({ error: 'Data tidak lengkap' });
    const bayar = await prisma.pembayaranPbb.create({ data: {
      nop, nama_wajib_pajak, alamat_objek: alamat_objek || '', rt: rt || '', rw: rw || '',
      tahun_pajak: parseInt(tahun_pajak), jumlah_dibayar: parseFloat(jumlah_dibayar),
      kolektor_id: req.userId, bukti_url: req.file ? '/uploads/' + req.file.filename : null, status: 'PENDING'
    }});
    await prisma.logAktivitas.create({ data: { user_id: req.userId, aksi: 'INPUT_PBB', detail: 'Input PBB ' + nop } });
    res.status(201).json(bayar);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.get('/pembayaran', authMiddleware, async (req, res) => {
  try {
    const { status, rt, tahun } = req.query;
    const where = {};
    if (status) where.status = status;
    if (tahun) where.tahun_pajak = parseInt(tahun);
    if (req.userRole === 'KOLEKTOR') where.kolektor_id = req.userId;
    if (rt) where.rt = rt;
    const data = await prisma.pembayaranPbb.findMany({
      where, include: { kolektor: { select: { nama: true } }, approved_by: { select: { nama: true } } }, orderBy: { created_at: 'desc' }
    });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/pembayaran/:id', authMiddleware, async (req, res) => {
  try {
    const data = await prisma.pembayaranPbb.findUnique({
      where: { id: parseInt(req.params.id) }, include: { kolektor: { select: { nama: true } }, approved_by: { select: { nama: true } } }
    });
    if (!data) return res.status(404).json({ error: 'Data tidak ditemukan' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/pembayaran/:id/approve', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const data = await prisma.pembayaranPbb.update({
      where: { id: parseInt(req.params.id) }, data: { status: 'APPROVED', approved_by: req.userId, approved_at: new Date() }
    });
    await prisma.logAktivitas.create({ data: { user_id: req.userId, aksi: 'APPROVE_PBB', detail: 'Approve PBB ' + data.nop } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/pembayaran/:id/reject', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const { alasan } = req.body;
    if (!alasan) return res.status(400).json({ error: 'Alasan penolakan wajib diisi' });
    const data = await prisma.pembayaranPbb.update({
      where: { id: parseInt(req.params.id) }, data: { status: 'REJECTED', catatan: alasan, approved_by: req.userId, approved_at: new Date() }
    });
    await prisma.logAktivitas.create({ data: { user_id: req.userId, aksi: 'REJECT_PBB', detail: 'Reject PBB ' + data.nop + ': ' + alasan } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/laporan', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const { tahun, rt } = req.query;
    const where = {};
    if (tahun) where.tahun_pajak = parseInt(tahun);
    if (rt) where.rt = rt;
    const total = await prisma.pembayaranPbb.count({ where });
    const approved = await prisma.pembayaranPbb.count({ where: { ...where, status: 'APPROVED' } });
    const pending = await prisma.pembayaranPbb.count({ where: { ...where, status: 'PENDING' } });
    const rejected = await prisma.pembayaranPbb.count({ where: { ...where, status: 'REJECTED' } });
    const sum = await prisma.pembayaranPbb.aggregate({ where: { ...where, status: 'APPROVED' }, _sum: { jumlah_dibayar: true } });
    res.json({ total, approved, pending, rejected, totalTerkumpul: sum._sum.jumlah_dibayar || 0 });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;