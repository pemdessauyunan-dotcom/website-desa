const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'kasomalangkulon-jwt-secret-2026';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email dan password harus diisi' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) return res.status(401).json({ error: 'Email atau password salah' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email atau password salah' });
    const token = jwt.sign({ id: user.id, role: user.role, nama: user.nama }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, nama: user.nama, email: user.email, role: user.role, rt: user.rt, rw: user.rw } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, nama: true, email: true, role: true, rt: true, rw: true, active: true } });
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json({ user });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;