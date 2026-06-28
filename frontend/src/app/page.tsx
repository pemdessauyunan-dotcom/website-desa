"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, MapPin, Phone, Clock, Users, ArrowRight, ChevronRight, Home, Heart, Landmark, FileText, Image as ImageIcon, Megaphone, BarChart3, ExternalLink, Quote, Eye, Calendar } from "lucide-react";
import { api } from "@/lib/api";

// ===== SECTION 1: HERO =====
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTZ2MkgyNHYtMmgxMnpNMzYgMjJ2MkgyNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-8">
            <MapPin className="w-3.5 h-3.5" /> Kecamatan Kasomalang, Kabupaten Subang
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Selamat Datang di{" "}
            <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">Website Resmi</span>
            <br />Desa Kasomalang Kulon
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Portal informasi dan pelayanan publik desa yang transparan, modern, dan profesional untuk masyarakat Kasomalang Kulon.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input type="text" placeholder="Cari informasi, berita, atau layanan..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              />
            </div>
            <Link href="/berita"
              className="px-6 py-3.5 rounded-xl bg-white text-primary-700 font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              Lihat Berita <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Senin-Jumat 08:00-15:00</div>
            <div className="hidden sm:flex items-center gap-2"><MapPin className="w-4 h-4" /> Kantor Desa</div>
          </div>
        </motion.div>
      </div>
      {/* Floating decoration */}
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30"
      >
        <ChevronRight className="w-6 h-6 rotate-90" />
      </motion.div>
    </section>
  );
}

// ===== SECTION 2: SAMBUTAN =====
function SambutanSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-10 bg-gradient-to-br from-primary-50 to-blue-50 rounded-3xl p-8 md:p-12"
        >
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center flex-shrink-0 shadow-xl">
            <span className="text-5xl font-bold text-primary-700">KD</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Quote className="w-5 h-5 text-primary-500" />
              <span className="text-primary-600 font-medium">Sambutan Kepala Desa</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Drs. H. Diding Wahyudin, M.Si.</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Assalamu&apos;alaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi Desa Kasomalang Kulon. Website ini hadir sebagai wujud komitmen kami dalam mewujudkan pemerintahan desa yang transparan, akuntabel, dan berbasis teknologi. Melalui portal ini, masyarakat dapat mengakses berbagai informasi desa, mengecek status PBB dan bansos, serta menyampaikan aspirasi secara langsung. Semoga bermanfaat.
            </p>
            <Link href="/profil" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all">
              Baca Selengkapnya <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ===== SECTION 3: RUNNING TEXT =====
function InfoTerkini() {
  const info = [
    "Pembayaran PBB 2026 dibuka hingga 30 September - Bayar melalui Kolektor RT masing-masing",
    "Penyaluran BLT Dana Desa Tahap II akan dilaksanakan 15 Juli 2026",
    "Musrenbangdes 2026 telah dilaksanakan - Terima kasih partisipasi warga",
    "Layanan pembuatan KTP dan KK dapat dilakukan di Kantor Desa setiap hari kerja",
  ];
  return (
    <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 py-3 overflow-hidden">
      <div className="flex items-center gap-2 animate-marquee whitespace-nowrap">
        <Megaphone className="w-4 h-4 text-yellow-300 mx-2" />
        {info.map((text, i) => (
          <span key={i} className="text-white/90 text-sm mx-8">{text} •</span>
        ))}
      </div>
    </div>
  );
}

// ===== SECTION 4: STATISTIK COUNTER =====
function StatistikSection() {
  const [stats, setStats] = useState({ total: 5247, laki_laki: 2650, perempuan: 2597, kk: 1432, rt_count: 12, rw_count: 4 });
  useEffect(() => { api.getStatistikPenduduk().then(setStats).catch(() => {}); }, []);

  const items = [
    { label: "Total Penduduk", value: stats.total, icon: Users, color: "from-primary-400 to-primary-600" },
    { label: "Laki-laki", value: stats.laki_laki, icon: Users, color: "from-blue-400 to-blue-600" },
    { label: "Perempuan", value: stats.perempuan, icon: Users, color: "from-pink-400 to-pink-600" },
    { label: "Kepala Keluarga", value: stats.kk, icon: Home, color: "from-amber-400 to-amber-600" },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Statistik Penduduk</h2>
          <p className="text-slate-500">Data kependudukan Desa Kasomalang Kulon terkini</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100 text-center card-hover"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-slate-800 mb-1"
              >
                {item.value.toLocaleString()}
              </motion.p>
              <p className="text-sm text-slate-500">{item.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-6 text-sm text-slate-400">
          <span>{stats.rw_count} RW</span>
          <span>{stats.rt_count} RT</span>
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 5: PBB & BANSOS =====
function WidgetPbbBansos() {
  const [pbbStats, setPbbStats] = useState({ total: 10, lunas: 6, pending: 3 });
  const [bansosStats, setBansosStats] = useState<any[]>([]);
  useEffect(() => {
    api.getPBBStats().then(setPbbStats).catch(() => {});
    api.getBansosStats().then(setBansosStats).catch(() => {});
  }, []);

  const pbbPct = pbbStats.total > 0 ? Math.round((pbbStats.lunas / pbbStats.total) * 100) : 0;
  const totalBansos = bansosStats.reduce((s: number, p: any) => s + (p.disetujui || 0), 0);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* PBB Card */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 card-hover"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">PBB 2026</h3>
                <p className="text-sm text-slate-500">Realisasi Pembayaran</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600">Progress</span>
                <span className="font-semibold text-slate-700">{pbbPct}%</span>
              </div>
              <div className="h-3 bg-green-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${pbbPct}%` }} viewport={{ once: true }}
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000"
                />
              </div>
            </div>
            <div className="flex justify-between text-sm text-slate-600 mb-4">
              <span>Lunas: <strong>{pbbStats.lunas}</strong></span>
              <span>Pending: <strong>{pbbStats.pending}</strong></span>
              <span>Total: <strong>{pbbStats.total}</strong></span>
            </div>
            <Link href="/pbb"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-all text-sm"
            >
              Cek Status PBB <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Bansos Card */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 card-hover"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Bantuan Sosial</h3>
                <p className="text-sm text-slate-500">Program Aktif</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800 mb-2">{totalBansos} <span className="text-base font-normal text-slate-500">Penerima Aktif</span></p>
            <p className="text-sm text-slate-500 mb-4">{bansosStats.length} Program Bansos Aktif</p>
            <div className="space-y-2 mb-4">
              {bansosStats.slice(0, 3).map((p: any) => (
                <div key={p.id} className="flex justify-between text-sm bg-white/60 rounded-lg px-3 py-1.5">
                  <span className="text-slate-600">{p.nama}</span>
                  <span className="font-medium text-slate-700">{p.disetujui}/{p.kuota}</span>
                </div>
              ))}
            </div>
            <Link href="/bansos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all text-sm"
            >
              Cek Status Bansos <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 6: BERITA =====
function BeritaSection() {
  const [berita, setBerita] = useState<any[]>([]);
  useEffect(() => { api.getBerita({ limit: 3 }).then(d => setBerita(d.data || [])).catch(() => {}); }, []);

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Berita Terkini</h2>
            <p className="text-slate-500 mt-1">Informasi terbaru Desa Kasomalang Kulon</p>
          </div>
          <Link href="/berita" className="hidden sm:flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all">
            Semua Berita <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {berita.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 card-hover"
            >
              <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <Megaphone className="w-12 h-12 text-primary-300" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium">{item.kategori}</span>
                  <span className="text-xs text-slate-400"><Calendar className="w-3 h-3 inline mr-1" />{new Date(item.created_at || item.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
                <Link href={`/berita/${item.slug}`}>
                  <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 hover:text-primary-700 transition-colors">{item.judul}</h3>
                </Link>
                <p className="text-sm text-slate-500 line-clamp-2">{item.konten?.replace(/<[^>]*>/g, '').substring(0, 120)}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link href="/berita" className="inline-flex items-center gap-2 text-primary-600 font-medium">
            Semua Berita <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 7: APARATUR =====
function AparaturSection() {
  const [aparatur, setAparatur] = useState<any[]>([]);
  useEffect(() => { api.getAparatur().then(setAparatur).catch(() => {}); }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800">Perangkat Desa</h2>
          <p className="text-slate-500">Aparatur Pemerintah Desa Kasomalang Kulon</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {aparatur.slice(0, 8).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="text-center group"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 mx-auto mb-3 flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all group-hover:scale-105">
                <span className="text-2xl font-bold text-primary-600">{p.nama.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}</span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">{p.nama}</p>
              <p className="text-xs text-primary-600 font-medium">{p.jabatan}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 8: MAPS =====
function MapsSection() {
  const info = { alamat: 'Jl. Raya Kasomalang No. 123, Kec. Kasomalang, Kab. Subang' };
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Lokasi Kantor Desa</h2>
            <p className="text-slate-500 text-sm mb-4 flex items-center gap-2"><MapPin className="w-4 h-4" />{info.alamat}</p>
          </div>
          <div className="h-72 bg-slate-200 flex items-center justify-center text-slate-400">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126861.44236396234!2d107.67115795000001!3d-6.656068299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e693b1e5b4b5b4b%3A0x401e8f1fc28c820!2sSubang%2C%20Kabupaten%20Subang%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1680000000000"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ===== SECTION 9: VISITOR =====
function VisitorSection() {
  const [visitor, setVisitor] = useState({ hariIni: 0, kemarin: 0, total: 0 });
  useEffect(() => { api.getPengunjung().then(setVisitor).catch(() => {}); }, []);
  return (
    <section className="py-10 bg-primary-900 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-3 gap-8 text-center">
          {[
            { label: 'Hari Ini', value: visitor.hariIni },
            { label: 'Kemarin', value: visitor.kemarin },
            { label: 'Total Pengunjung', value: visitor.total },
          ].map((v, i) => (
            <div key={i}>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold"
              >{v.value.toLocaleString()}</motion.p>
              <p className="text-sm text-white/60 mt-1">{v.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== MAIN PAGE =====
export default function Beranda() {
  return (
    <div>
      <HeroSection />
      <InfoTerkini />
      <SambutanSection />
      <StatistikSection />
      <WidgetPbbBansos />
      <BeritaSection />
      <AparaturSection />
      <MapsSection />
      <VisitorSection />
    </div>
  );
}