"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Landmark, Heart, Megaphone, Users, ClipboardList, 
  Activity, ArrowUp, ArrowDown, Clock, CheckCircle, XCircle,
  TrendingUp, DollarSign
} from "lucide-react";

const statsConfig = [
  { key: "pbbPending", icon: Clock, label: "PBB Pending", color: "from-yellow-400 to-yellow-600", bg: "bg-yellow-50", textColor: "text-yellow-700" },
  { key: "pbbApproved", icon: CheckCircle, label: "PBB Lunas", color: "from-green-400 to-green-600", bg: "bg-green-50", textColor: "text-green-700" },
  { key: "pengaduanBaru", icon: ClipboardList, label: "Pengaduan Baru", color: "from-blue-400 to-blue-600", bg: "bg-blue-50", textColor: "text-blue-700" },
  { key: "totalBerita", icon: Megaphone, label: "Total Berita", color: "from-purple-400 to-purple-600", bg: "bg-purple-50", textColor: "text-purple-700" },
  { key: "totalWarga", icon: Users, label: "Total Warga", color: "from-teal-400 to-teal-600", bg: "bg-teal-50", textColor: "text-teal-700" },
  { key: "bansosAktif", icon: Heart, label: "Bansos Aktif", color: "from-pink-400 to-pink-600", bg: "bg-pink-50", textColor: "text-pink-700" },
];

function StatCard({ item, value, index }: { item: typeof statsConfig[0]; value: number; index: number }) {
  const Icon = item.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
      className={`${item.bg} rounded-2xl p-6 border border-transparent hover:shadow-lg transition-all card-hover`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
          <TrendingUp className="w-3 h-3" /> +12%
        </span>
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl font-bold text-slate-800 mb-1">
        {value.toLocaleString()}
      </motion.p>
      <p className="text-sm text-slate-500">{item.label}</p>
    </motion.div>
  );
}

function OverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({ pbbPending: 0, pbbApproved: 0, pengaduanBaru: 0, totalBerita: 0, totalWarga: 0, bansosAktif: 0 });
  const [greeting, setGreeting] = useState("Selamat Pagi");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Selamat Pagi");
    else if (h < 15) setGreeting("Selamat Siang");
    else if (h < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
    api.getDashboardStats().then(setStats).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          {greeting}, <span className="gradient-text">{user?.nama?.split(" ")[0]}</span>
        </h1>
        <p className="text-slate-500 mt-1">Selamat datang di dashboard manajemen Desa Kasomalang Kulon</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statsConfig.slice(0, 6).map((item, i) => (
          <StatCard key={item.key} item={item} value={stats[item.key] || 0} index={i} />
        ))}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" /> Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            {[
              { action: "Pembayaran PBB diapprove", time: "2 menit lalu", type: "approve" },
              { action: "Pengaduan baru dari warga", time: "15 menit lalu", type: "new" },
              { action: "Usulan bansos dari RT 01", time: "1 jam lalu", type: "pending" },
              { action: "Berita baru dipublikasikan", time: "3 jam lalu", type: "new" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  a.type === 'approve' ? 'bg-green-100 text-green-700' : a.type === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {a.type === 'approve' ? <CheckCircle className="w-4 h-4" /> : a.type === 'pending' ? <Clock className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{a.action}</p>
                  <p className="text-xs text-slate-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary-500" /> Realisasi PBB 2026
          </h2>
          <div className="flex items-center justify-center h-48 text-slate-300 text-sm">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full border-8 border-primary-100 flex items-center justify-center mx-auto mb-3 relative">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">
                    {stats.pbbPending + stats.pbbApproved > 0 
                      ? Math.round((stats.pbbApproved / (stats.pbbPending + stats.pbbApproved)) * 100) 
                      : 0}%
                  </p>
                  <p className="text-xs text-slate-400">realisasi</p>
                </div>
              </div>
              <div className="flex justify-center gap-4 text-xs">
                <span className="text-green-600">{stats.pbbApproved} Lunas</span>
                <span className="text-yellow-600">{stats.pbbPending} Pending</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default OverviewPage;