const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try { const { album } = req.query; const where = {}; if (album) where.album = album; const data = await prisma.galeri.findMany({ where, orderBy: { created_at: 'desc' } }); res.json(data); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', authMiddleware, roleMiddleware('ADMIN'), upload.single('file'), async (req, res) => {
  try {
    const { judul, deskripsi, tipe, album } = req.body;
    const data = await prisma.galeri.create({ data: { judul, deskripsi, tipe: tipe || 'FOTO', file_url: req.file ? '/uploads/' + req.file.filename : '', album: album || 'Umum' } });
    res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try { await prisma.galeri.delete({ where: { id: parseInt(req.params.id) } }); res.json({ message: 'Dihapus' }); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;