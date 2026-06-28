"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, Landmark, Heart, FileText, Megaphone, 
  Image, Users, BarChart3, Settings, LogOut, Menu, X,
  ChevronRight, Bell, Search, User, ChevronDown, Home,
  ClipboardList, ArrowLeft
} from "lucide-react";

const adminMenu = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Landmark, label: "Data PBB", href: "/dashboard/pbb" },
  { icon: Heart, label: "Data Bansos", href: "/dashboard/bansos" },
  { icon: Megaphone, label: "Berita", href: "/dashboard/berita" },
  { icon: ClipboardList, label: "Pengaduan", href: "/dashboard/pengaduan" },
  { icon: Image, label: "Galeri", href: "/dashboard/galeri" },
  { icon: Users, label: "Data Warga", href: "/dashboard/warga" },
  { icon: BarChart3, label: "Laporan", href: "/dashboard/laporan" },
  { icon: Settings, label: "Pengaturan", href: "/dashboard/pengaturan" },
];

const rtMenu = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard/rt" },
  { icon: Users, label: "Data Warga", href: "/dashboard/rt#warga" },
  { icon: Landmark, label: "Status PBB", href: "/dashboard/rt#pbb" },
  { icon: Heart, label: "Usulan Bansos", href: "/dashboard/rt#bansos" },
];

const kolektorMenu = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard/kolektor" },
  { icon: Landmark, label: "Input PBB", href: "/dashboard/kolektor#input" },
  { icon: ClipboardList, label: "Riwayat", href: "/dashboard/kolektor#riwayat" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="spinner"></div>
    </div>
  );

  const menuItems = user.role === "ADMIN" ? adminMenu : user.role === "RT" ? rtMenu : kolektorMenu;
  const roleBadge = user.role === "ADMIN" ? "Admin Desa" : user.role === "RT" ? "RT" : "Kolektor";
  const roleColor = user.role === "ADMIN" ? "bg-primary-500" : user.role === "RT" ? "bg-blue-500" : "bg-amber-500";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mountain Landscape Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-800 overflow-hidden">
        {/* SVG Mountains */}
        <svg className="absolute bottom-0 w-full h-32" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,160 C200,120 300,180 400,140 C500,100 600,160 720,120 C840,80 960,140 1080,100 C1200,60 1320,120 1440,80 L1440,200 L0,200 Z" 
            fill="rgba(255,255,255,0.08)" />
          <path d="M0,180 C180,150 320,190 480,160 C640,130 800,170 960,140 C1120,110 1280,150 1440,120 L1440,200 L0,200 Z" 
            fill="rgba(255,255,255,0.05)" />
          <path d="M0,195 C240,170 480,190 720,170 C960,150 1200,180 1440,160 L1440,200 L0,200 Z" 
            fill="rgba(255,255,255,0.03)" />
        </svg>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/80 hover:text-white p-1">
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold hidden sm:block">Dashboard Desa</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white/80">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">3</span>
              </button>
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user.nama.split(' ').map((n:string)=>n[0]).join('').substring(0,2)}</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-white text-sm font-medium leading-tight">{user.nama}</p>
                    <p className="text-white/60 text-xs">{roleBadge}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-800">{user.nama}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <Home className="w-4 h-4" /> Website Publik
                    </Link>
                    <button onClick={() => { logout(); router.push("/login"); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`fixed lg:sticky top-0 left-0 h-full lg:h-auto z-30 w-64 bg-white shadow-lg lg:shadow-none lg:bg-transparent transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} pt-4`}>
            <div className="p-4 space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu</p>
              {menuItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '#');
                return (
                  <Link key={item.label} href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      active ? 'bg-primary-50 text-primary-700 font-medium shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${active ? 'text-primary-500' : 'text-slate-400'}`} />
                    {item.label}
                    {active && <ChevronRight className="w-3 h-3 ml-auto text-primary-400" />}
                  </Link>
                );
              })}
            </div>
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100">
              <p className="text-xs text-primary-700 font-medium mb-1">{user.nama}</p>
              <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium text-white ${roleColor}`}>
                {roleBadge}
              </span>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

          {/* Main Content */}
          <main className="flex-1 min-h-screen pb-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4 pt-4">
              <Link href="/" className="hover:text-primary-600">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-600 font-medium">Dashboard</span>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}