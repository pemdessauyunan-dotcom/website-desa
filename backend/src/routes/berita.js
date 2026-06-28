const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

function slugify(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

router.get('/', async (req, res) => {
  try {
    const { kategori, limit, page } = req.query;
    const take = parseInt(limit) || 10;
    const skip = (parseInt(page) || 0) * take;
    const where = { published: true };
    if (kategori && kategori !== 'Semua') where.kategori = kategori;
    
    const data = await prisma.berita.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip });
    const total = await prisma.berita.count({ where });
    
    res.json({ data, total, page: parseInt(page) || 0, totalPages: Math.ceil(total / take) });
  } catch (err) { 
    const fs = require('fs');
    const logPath = require('path').join(__dirname, '..', '..', 'berita-error-' + Date.now() + '.log');
    const msg = new Date().toISOString() + ' ' + err.message + '\n' + (err.stack || '') + '\n';
    try { fs.writeFileSync(logPath, msg); } catch(e) { /* ignore */ }
    res.status(500).json({ error: 'Server error' }); 
  }
});

router.get('/kategori', async (req, res) => {
  try { const result = await prisma.berita.findMany({ select: { kategori: true }, distinct: ['kategori'] }); res.json(result.map(r => r.kategori)); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
});

router.get('/:id', async (req, res) => {
  try {
    const where = isNaN(req.params.id) ? { slug: req.params.id } : { id: parseInt(req.params.id) };
    const data = await prisma.berita.findUnique({ where });
    if (!data) return res.status(404).json({ error: 'Berita tidak ditemukan' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/', authMiddleware, roleMiddleware('ADMIN'), upload.single('gambar'), async (req, res) => {
  try {
    const { judul, konten, kategori, penulis } = req.body;
    let slug = slugify(judul);
    const existing = await prisma.berita.findUnique({ where: { slug } });
    if (existing) slug += '-' + Date.now();
    const data = await prisma.berita.create({ data: { judul, slug, konten, kategori: kategori || 'Berita Desa', gambar: req.file ? '/uploads/' + req.file.filename : null, penulis: penulis || 'Admin Desa' } });
    res.status(201).json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), upload.single('gambar'), async (req, res) => {
  try {
    const { judul, konten, kategori, penulis, published } = req.body;
    const update = {};
    if (judul) { update.judul = judul; update.slug = slugify(judul) + '-' + Date.now(); }
    if (konten) update.konten = konten;
    if (kategori) update.kategori = kategori;
    if (penulis) update.penulis = penulis;
    if (published !== undefined) update.published = published === 'true' || published === true;
    if (req.file) update.gambar = '/uploads/' + req.file.filename;
    const data = await prisma.berita.update({ where: { id: parseInt(req.params.id) }, data: update });
    res.json(data);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try { await prisma.berita.delete({ where: { id: parseInt(req.params.id) } }); res.json({ message: 'Dihapus' }); }
  catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;