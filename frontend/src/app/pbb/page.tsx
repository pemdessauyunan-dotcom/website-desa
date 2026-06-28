"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Landmark, Search, CheckCircle, XCircle, AlertCircle, Receipt, TrendingUp, Users } from "lucide-react";
import { api } from "@/lib/api";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}

export default function PbbPage() {
  const [nop, setNop] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    api
      .getPBBStats()
      .then((res: any) => setStats(res.data || res))
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const handleCek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nop.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await api.cekPBB(nop.trim());
      setResult(res.data || res);
    } catch (err: any) {
      setError(err.message || "NOP tidak ditemukan atau terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const pbbPct = stats
    ? Math.round((stats.lunas / stats.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTZ2MkgyNHYtMmgxMnpNMzYgMjJ2MkgyNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-6">
              <Landmark className="w-4 h-4" /> Pajak Bumi dan Bangunan
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cek Status PBB</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Periksa status pembayaran Pajak Bumi dan Bangunan Desa Kasomalang Kulon
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form + Result */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cek Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-2">Cek Status Pembayaran</h2>
              <p className="text-sm text-slate-500 mb-6">
                Masukkan Nomor Objek Pajak (NOP) Anda
              </p>
              <form onSubmit={handleCek} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Receipt className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={nop}
                    onChange={(e) => setNop(e.target.value)}
                    placeholder="Masukkan NOP (contoh: 32.14.123.456.789)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder:text-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !nop.trim()}
                  className="px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Cek Sekarang
                </button>
              </form>
            </motion.div>

            {/* Result */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3"
              >
                <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-1">Gagal Mengecek</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  {result.status === "LUNAS" || result.status?.toLowerCase() === "lunas" ? (
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">NOP: {result.nop || nop}</h3>
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-sm font-medium ${
                        result.status === "LUNAS" || result.status?.toLowerCase() === "lunas"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {result.status || "Belum Lunas"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-500">Nama Wajib Pajak</p>
                    <p className="font-semibold text-slate-800">{result.nama_wajib_pajak || result.nama || "-"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-500">Tahun</p>
                    <p className="font-semibold text-slate-800">{result.tahun || new Date().getFullYear()}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-500">Luas Bumi (m²)</p>
                    <p className="font-semibold text-slate-800">{result.luas_bumi || result.luas_tanah || "-"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-slate-500">Luas Bangunan (m²)</p>
                    <p className="font-semibold text-slate-800">{result.luas_bangunan || "-"}</p>
                  </div>
                  {result.pajak && (
                    <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                      <p className="text-slate-500">Pajak Terutang</p>
                      <p className="font-bold text-lg text-slate-800">
                        Rp {Number(result.pajak).toLocaleString("id-ID")}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Stats */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">Realisasi PBB</h3>
              </div>
              {statsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
                </div>
              ) : stats ? (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-semibold text-slate-700">{pbbPct}%</span>
                    </div>
                    <div className="h-3 bg-green-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pbbPct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-green-50 rounded-xl p-3">
                      <p className="text-2xl font-bold text-green-700">{stats.lunas || 0}</p>
                      <p className="text-xs text-green-600">Lunas</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3">
                      <p className="text-2xl font-bold text-amber-700">{stats.pending || 0}</p>
                      <p className="text-xs text-amber-600">Pending</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-2xl font-bold text-slate-700">{stats.total || 0}</p>
                      <p className="text-xs text-slate-500">Total</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-400">Data belum tersedia</p>
              )}
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">Informasi</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  Pembayaran PBB dapat dilakukan melalui Kolektor RT masing-masing
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  Batas pembayaran: 30 September 2026
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  NOP terdiri dari 15 digit angka
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}