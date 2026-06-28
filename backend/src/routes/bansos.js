const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/cek', async (req, res) => {
  try {
    const { nik } = req.query;
    if (!nik) return res.status(400).json({ error: 'Masukkan NIK' });
    const penerima = await prisma.penerimaBansos.findMany({ where: { nik }, include: { program: { select: { nama: true } } } });
    res.json({ terdaftar: penerima.length > 0, data: penerima.map(p => ({ program: p.program.nama, status: p.status })) });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/stats', async (req, res) => {
  try {
    const programs = await prisma.programBansos.findMany({ where: { aktif: true }, include: { penerima: true } });
    res.json(programs.map(p => ({ id: p.id, nama: p.nama, kuota: p.kuota, penerima: p.penerima.length, disetujui: p.penerima.filter(x => x.status === 'DISETUJUI').length })));
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/program', authMiddleware, async (req, res) => {
  try { const data = await prisma.programBansos.findMany({ orderBy: { created_at: 'desc' } }); res.json(data); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/program', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const { nama, sumber_dana, periode, nominal, kuota } = req.body;
    const data = await prisma.programBansos.create({ data: { nama, sumber_dana, periode, nominal: parseFloat(nominal), kuota: parseInt(kuota) } });
    res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/program/:id', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try { const data = await prisma.programBansos.update({ where: { id: parseInt(req.params.id) }, data: req.body }); res.json(data); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/program/:id', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try { await prisma.penerimaBansos.deleteMany({ where: { program_id: parseInt(req.params.id) } }); await prisma.programBansos.delete({ where: { id: parseInt(req.params.id) } }); res.json({ message: 'Dihapus' }); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/penerima', authMiddleware, async (req, res) => {
  try {
    const { program_id, status, rt } = req.query;
    const where = {};
    if (program_id) where.program_id = parseInt(program_id);
    if (status) where.status = status;
    if (rt) where.rt = rt;
    const data = await prisma.penerimaBansos.findMany({
      where, include: { program: { select: { nama: true } }, diusulkan_oleh: { select: { nama: true } } }, orderBy: { created_at: 'desc' }
    });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/penerima', authMiddleware, roleMiddleware('RT','ADMIN'), async (req, res) => {
  try {
    const { nik, nama, alamat, rt, rw, program_id } = req.body;
    const data = await prisma.penerimaBansos.create({
      data: { nik, nama, alamat, rt, rw, program_id: parseInt(program_id), diusulkan_oleh: req.userId, status: 'DIUSULKAN' }
    });
    await prisma.logAktivitas.create({ data: { user_id: req.userId, aksi: 'USUL_BANSOS', detail: 'Usulan bansos ' + nama } });
    res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/penerima/:id/approve', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const data = await prisma.penerimaBansos.update({ where: { id: parseInt(req.params.id) }, data: { status: 'DISETUJUI', diverifikasi_oleh: req.userId } });
    await prisma.logAktivitas.create({ data: { user_id: req.userId, aksi: 'SETUJU_BANSOS', detail: 'Setujui bansos ' + data.nama } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/penerima/:id/reject', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const { alasan } = req.body;
    const data = await prisma.penerimaBansos.update({ where: { id: parseInt(req.params.id) }, data: { status: 'DITOLAK', catatan: alasan || '', diverifikasi_oleh: req.userId } });
    await prisma.logAktivitas.create({ data: { user_id: req.userId, aksi: 'TOLAK_BANSOS', detail: 'Tolak bansos ' + data.nama } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;