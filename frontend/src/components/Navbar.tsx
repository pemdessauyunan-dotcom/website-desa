"use client";
import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, ChevronDown, Home, 
  Info, BarChart3, Landmark, Heart, 
  FileText, Megaphone, Image, LogIn, 
  Phone, Mail, MapPin, Clock,
  Facebook, Instagram, Youtube, Twitter,
  ChevronRight, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Beranda', href: '/', icon: Home },
  {
    name: 'Profil Desa', icon: Info, dropdown: [
      { name: 'Sejarah & Visi Misi', href: '/profil' },
      { name: 'Struktur Organisasi', href: '/profil#struktur' },
      { name: 'Perangkat Desa', href: '/profil#aparatur' },
      { name: 'Wilayah Administratif', href: '/profil#wilayah' },
      { name: 'Peta Desa', href: '/profil#peta' },
    ]
  },
  {
    name: 'Data & Statistik', icon: BarChart3, dropdown: [
      { name: 'Jumlah Penduduk', href: '/statistik' },
      { name: 'Berdasarkan Usia', href: '/statistik#usia' },
      { name: 'Berdasarkan Pendidikan', href: '/statistik#pendidikan' },
      { name: 'Berdasarkan Pekerjaan', href: '/statistik#pekerjaan' },
    ]
  },
  { name: 'PBB', href: '/pbb', icon: Landmark },
  {
    name: 'Bansos', icon: Heart, dropdown: [
      { name: 'Program Aktif', href: '/bansos' },
      { name: 'Cek Status Penerima', href: '/bansos#cek' },
      { name: 'Statistik', href: '/bansos#statistik' },
    ]
  },
  {
    name: 'Layanan', icon: FileText, dropdown: [
      { name: 'Permohonan Surat', href: '/layanan' },
      { name: 'Pengaduan', href: '/pengaduan' },
      { name: 'Unduh Formulir', href: '/layanan#unduh' },
    ]
  },
  { name: 'Berita', href: '/berita', icon: Megaphone },
  { name: 'Pengaduan', href: '/pengaduan', icon: FileText },
  { name: 'Galeri', href: '/galeri', icon: Image },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); setActiveDropdown(null); }, [pathname]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <span className="text-white font-bold text-sm">KK</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Kasomalang Kulon</p>
                <p className="text-xs text-slate-500 -mt-0.5">Kec. Kasomalang, Kab. Subang</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.href ? (
                    <Link href={item.href}
                      className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                        pathname === item.href ? 'text-primary-600 font-medium' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  ) : (
                    <button
                      className={`px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-1 ${
                        activeDropdown === item.name ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                      <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                  
                  {item.dropdown && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 w-56 glass rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                    >
                      {item.dropdown.map((sub) => (
                        <Link key={sub.name} href={sub.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
                        >
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <Link href="/login"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white text-sm rounded-lg hover:shadow-lg hover:from-primary-600 hover:to-primary-800 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>

              <button onClick={() => setOpen(!open)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 bg-white"
            >
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Cari informasi, berita, atau layanan..."
                    className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 z-40 bg-white lg:hidden overflow-y-auto"
          >
            <div className="p-4 space-y-1">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.href ? (
                    <Link href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-all"
                    >
                      <item.icon className="w-5 h-5 text-primary-500" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium">
                        <item.icon className="w-5 h-5 text-primary-500" />
                        <span>{item.name}</span>
                      </div>
                      {item.dropdown?.map((sub) => (
                        <Link key={sub.name} href={sub.href}
                          className="flex items-center gap-3 px-4 py-2.5 ml-9 rounded-lg text-sm text-slate-500 hover:text-primary-600 hover:bg-primary-50"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <hr className="my-4" />
              <Link href="/login"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white font-medium"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}