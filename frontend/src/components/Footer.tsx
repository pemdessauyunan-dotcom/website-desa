"use client";
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, ChevronRight, ArrowUp } from 'lucide-react';

const quickLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Profil Desa', href: '/profil' },
  { name: 'Berita', href: '/berita' },
  { name: 'PBB', href: '/pbb' },
  { name: 'Bansos', href: '/bansos' },
  { name: 'Galeri', href: '/galeri' },
  { name: 'Pengaduan', href: '/pengaduan' },
  { name: 'Layanan', href: '/layanan' },
];

const programs = [
  { name: 'PKH', href: '/bansos' },
  { name: 'BLT Dana Desa', href: '/bansos' },
  { name: 'BPNT', href: '/bansos' },
  { name: 'Jaminan Kesehatan', href: '/bansos' },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-slate-900 text-slate-300">
      {/* Wave top decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">KK</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg">Kasomalang Kulon</p>
                <p className="text-slate-400 text-xs">Kec. Kasomalang, Kab. Subang</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Website resmi Pemerintah Desa Kasomalang Kulon. Melayani masyarakat dengan transparan, profesional, dan bertanggung jawab.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-all hover:scale-110">
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-primary-400" />
              Link Cepat
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-all flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-primary-400 transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-primary-400" />
              Program
            </h3>
            <ul className="space-y-2.5">
              {programs.map((p) => (
                <li key={p.name}>
                  <Link href={p.href}
                    className="text-sm text-slate-400 hover:text-white transition-all flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-primary-400 transition-all"></span>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-primary-400" />
              Kontak
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-slate-400">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Raya Kasomalang No. 123, Kec. Kasomalang, Kab. Subang, Jawa Barat 41281</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>(0260) 123456</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>info@kasomalangkulon.desa.id</span>
              </li>
              <li className="flex gap-3 text-sm text-slate-400">
                <Clock className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span>Senin-Jumat: 08:00-15:00 WIB</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Pemerintah Desa Kasomalang Kulon. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <Link href="#" className="hover:text-slate-400">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-slate-400">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}