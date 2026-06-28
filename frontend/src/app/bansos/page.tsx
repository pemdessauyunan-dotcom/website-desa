"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Search, CheckCircle, XCircle, UserCheck, Users, Package, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

export default function BansosPage() {
  const [nik, setNik] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [progLoading, setProgLoading] = useState(true);

  useEffect(() => {
    api
      .getBansosStats()
      .then((res: any) => setPrograms(Array.isArray(res) ? res : res.data || []))
      .catch(() => {})
      .finally(() => setProgLoading(false));
  }, []);

  const handleCek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await api.cekBansos(nik.trim());
      setResult(res.data || res);
    } catch (err: any) {
      setError(err.message || "NIK tidak ditemukan atau terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTZ2MkgyNHYtMmgxMnpNMzYgMjJ2MkgyNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-6">
              <Heart className="w-4 h-4" /> Bantuan Sosial
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Cek Status Bansos</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Periksa status penerimaan bantuan sosial untuk warga Desa Kasomalang Kulon
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Programs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-500" /> Program Bansos Aktif
          </h2>
          {progLoading ? (
            <Spinner />
          ) : programs.length === 0 ? (
            <p className="text-slate-400">Belum ada program bansos aktif.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {programs.map((prog, i) => {
                const pct = prog.kuota > 0 ? Math.round((prog.disetujui / prog.kuota) * 100) : 0;
                return (
                  <motion.div
                    key={prog.id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 truncate">{prog.nama}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                          {prog.jenis || prog.tipe || "Bansos"}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Penerima: {prog.disetujui || 0}/{prog.kuota || 0}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Dana: Rp {(prog.dana || prog.nominal || 0).toLocaleString("id-ID")}</span>
                      <span>{prog.periode || prog.tahun || "-"}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Cek Form + Result */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100"
            >
              <h2 className="text-xl font-bold text-slate-800 mb-2">Cek Status Penerima</h2>
              <p className="text-sm text-slate-500 mb-6">
                Masukkan NIK Anda untuk mengecek status penerimaan bansos
              </p>
              <form onSubmit={handleCek} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="Masukkan 16 digit NIK"
                    maxLength={16}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || nik.trim().length < 16}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 justify-center"
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
                className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3 mt-6"
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
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 mt-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  {result.status?.toLowerCase() === "terdaftar" || result.status?.toLowerCase() === "aktif" ? (
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-slate-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {result.nama || "Pencarian Ditemukan"}
                    </h3>
                    <p className="text-sm text-slate-500">NIK: {result.nik || nik}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {result.program && (
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-sm text-slate-500">Program</p>
                      <p className="font-semibold text-slate-800">{result.program}</p>
                    </div>
                  )}
                  {result.status && (
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-sm text-slate-500">Status</p>
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-sm font-medium mt-1 ${
                          result.status?.toLowerCase() === "terdaftar" || result.status?.toLowerCase() === "aktif"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {result.status}
                      </span>
                    </div>
                  )}
                  {result.keterangan && (
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-sm text-slate-500">Keterangan</p>
                      <p className="font-medium text-slate-700">{result.keterangan}</p>
                    </div>
                  )}
                </div>

                {Array.isArray(result.programs) && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-slate-700 mb-3">Program Terdaftar</h4>
                    <div className="space-y-2">
                      {result.programs.map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5">
                          <span className="text-sm text-slate-700">{p.nama_program || p.nama}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              p.status?.toLowerCase() === "aktif"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Info side card */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">Informasi</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  Masukkan 16 digit NIK sesuai KTP
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  Data penerima bansos diperbarui secara berkala
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  Hubungi RT setempat untuk informasi lebih lanjut
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}