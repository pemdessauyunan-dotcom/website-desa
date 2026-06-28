const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const pbbRoutes = require('./routes/pbb');
const bansosRoutes = require('./routes/bansos');
const beritaRoutes = require('./routes/berita');
const pengaduanRoutes = require('./routes/pengaduan');
const galeriRoutes = require('./routes/galeri');
const wargaRoutes = require('./routes/warga');
const variaRoutes = require('./routes/varia');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/pbb', pbbRoutes);
app.use('/api/bansos', bansosRoutes);
app.use('/api/pengaduan', pengaduanRoutes);
app.use('/api/galeri', galeriRoutes);
app.use('/api/warga', wargaRoutes);
app.use('/api', variaRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal error' });
});

app.listen(PORT, () => {
  console.log(`Backend Desa Kasomalang Kulon running on port ${PORT}`);
});