"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Landmark, CheckCircle, XCircle, Clock, Search, Filter, ChevronDown, ExternalLink } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "badge-pending", APPROVED: "badge-approved", REJECTED: "badge-rejected",
  };
  const labels: Record<string, string> = { PENDING: "Pending", APPROVED: "Lunas", REJECTED: "Ditolak" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-slate-100 text-slate-600'}`}>{labels[status] || status}</span>;
}

export default function PbbPage() {
  const [pembayaran, setPembayaran] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, lunas: 0, pending: 0, ditolak: 0 });
  const [showReject, setShowReject] = useState<number | null>(null);
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [d, s] = await Promise.all([api.getPbbPembayaran("?tahun=2026").catch(() => []), api.getPBBStats().catch(() => ({}))]);
    setPembayaran(Array.isArray(d) ? d : []);
    setStats(s as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id: number) => {
    await api.approvePbb(id);
    load();
  };

  const handleReject = async (id: number) => {
    if (!alasan.trim()) return;
    await api.rejectPbb(id, alasan);
    setShowReject(null);
    setAlasan("");
    load();
  };

  const statCards = [
    { label: "Total", value: stats.total, color: "from-slate-400 to-slate-600", bg: "bg-slate-50" },
    { label: "Lunas", value: stats.lunas, color: "from-green-400 to-green-600", bg: "bg-green-50" },
    { label: "Pending", value: stats.pending, color: "from-yellow-400 to-yellow-600", bg: "bg-yellow-50" },
    { label: "Ditolak", value: stats.ditolak, color: "from-red-400 to-red-600", bg: "bg-red-50" },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Landmark className="w-6 h-6 text-primary-500" /> Data PBB
        </h1>
        <p className="text-slate-500 text-sm mt-1">Kelola pembayaran Pajak Bumi dan Bangunan</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`${s.bg} rounded-2xl p-5 text-center border border-transparent`}
          >
            <p className={`text-2xl md:text-3xl font-bold bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Daftar Pembayaran PBB 2026</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Cari NOP/Nama..." className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-primary-400 w-48" />
            </div>
          </div>
        </div>
        {loading ? <div className="flex justify-center py-12"><div className="spinner"></div></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">NOP</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Wajib Pajak</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">RT/RW</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Tahun</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">Jumlah</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pembayaran.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-700 font-mono text-xs">{p.nop}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{p.nama_wajib_pajak}</p>
                      <p className="text-xs text-slate-400">{p.alamat_objek?.substring(0, 30)}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">RT {p.rt}/RW {p.rw}</td>
                    <td className="px-4 py-3 text-slate-600">{p.tahun_pajak}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">Rp {p.jumlah_dibayar?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-center">
                      {p.status === "PENDING" ? (
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleApprove(p.id)}
                            className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => setShowReject(p.id)}
                            className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">{p.approved_by?.nama || '-'}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {pembayaran.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400">Belum ada data pembayaran</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Reject Modal */}
      {showReject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReject(null)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-2">Tolak Pembayaran</h3>
            <p className="text-sm text-slate-500 mb-4">Masukkan alasan penolakan</p>
            <textarea value={alasan} onChange={e => setAlasan(e.target.value)} rows={3} placeholder="Alasan penolakan..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-red-400 text-sm resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowReject(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm">Batal</button>
              <button onClick={() => handleReject(showReject)} disabled={!alasan.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all text-sm disabled:opacity-50"
              >Tolak</button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}