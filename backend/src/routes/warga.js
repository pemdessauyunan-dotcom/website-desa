const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try { const { rt, rw } = req.query; const where = {}; if (rt) where.rt = rt; if (rw) where.rw = rw; const data = await prisma.warga.findMany({ where, orderBy: { nama: 'asc' } }); res.json(data); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/:nik', authMiddleware, async (req, res) => {
  try {
    const data = await prisma.warga.findUnique({ where: { nik: req.params.nik } });
    if (!data) return res.status(404).json({ error: 'Warga tidak ditemukan' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', authMiddleware, roleMiddleware('ADMIN','RT'), async (req, res) => {
  try {
    const { nik, nama, alamat, rt, rw, kelamin, tempat_lahir, tanggal_lahir, pendidikan, pekerjaan, agama, status_kawin, no_kk } = req.body;
    const data = await prisma.warga.create({ data: { nik, nama, alamat, rt, rw, kelamin, tempat_lahir, tanggal_lahir, pendidikan, pekerjaan, agama, status_kawin, no_kk } });
    res.status(201).json(data);
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ error: 'NIK sudah terdaftar' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:nik', authMiddleware, roleMiddleware('ADMIN','RT'), async (req, res) => {
  try { const data = await prisma.warga.update({ where: { nik: req.params.nik }, data: req.body }); res.json(data); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;