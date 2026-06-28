const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    const { nama_pengirim, kontak, isi, anonim } = req.body;
    if (!isi) return res.status(400).json({ error: 'Isi pengaduan harus diisi' });
    const data = await prisma.pengaduan.create({ data: { nama_pengirim: anonim ? null : nama_pengirim, kontak: anonim ? null : kontak, isi, anonim: anonim || false } });
    res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try { const data = await prisma.pengaduan.findMany({ where: {}, orderBy: { created_at: 'desc' } }); res.json(data); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id/status', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const { status, balasan } = req.body;
    const data = await prisma.pengaduan.update({ where: { id: parseInt(req.params.id) }, data: { status: status || 'DIPROSES', balasan: balasan || '' } });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;