"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn, Shield, Users as UsersIcon, UserCheck, X, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSoon, setShowSoon] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const roles = [
    { id: "ADMIN", label: "Admin Desa", icon: Shield, desc: "Akses penuh ke seluruh sistem" },
    { id: "RT", label: "RT", icon: UsersIcon, desc: "Kelola data warga & usulan bansos" },
    { id: "KOLEKTOR", label: "Kolektor", icon: UserCheck, desc: "Input pembayaran PBB" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.error) setError(res.error);
      else router.push("/dashboard");
    } catch { setError("Login gagal, coba lagi"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary-50">
      <div className="w-full max-w-md mx-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Masuk ke Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Pilih role dan masukkan akun Anda</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                className={`p-3 rounded-xl text-center transition-all border ${role === r.id ? 'bg-primary-50 border-primary-300' : 'bg-slate-50 border-slate-200 hover:border-primary-200'}`}
              >
                <r.icon className={`w-5 h-5 mx-auto mb-1 ${role === r.id ? 'text-primary-600' : 'text-slate-400'}`} />
                <p className={`text-xs font-medium ${role === r.id ? 'text-primary-700' : 'text-slate-600'}`}>{r.label}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@kasomalangkulon.id" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >{loading ? "Memproses..." : "Masuk"}</button>
          </form>

          <hr className="my-6" />
          <button onClick={() => setShowSoon(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 text-sm hover:border-primary-300 hover:text-primary-500 transition-all"
          >Login Masyarakat — Segera Hadir</button>
        </motion.div>
      </div>

      {showSoon && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSoon(false)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚧</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Segera Hadir!</h3>
            <p className="text-slate-500 text-sm mb-6">Fitur Login Masyarakat sedang dalam pengembangan. Nantikan kemudahan akses layanan desa secara online.</p>
            <button onClick={() => setShowSoon(false)}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all"
            >Mengerti</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}