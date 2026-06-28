const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kasomalangkulon-jwt-secret-2026');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userNama = decoded.nama;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid' });
  }
}

function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Akses ditolak' });
    }
    next();
  };
}

module.exports = { authMiddleware, roleMiddleware };