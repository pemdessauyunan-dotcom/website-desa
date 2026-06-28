"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Landmark, Plus, CheckCircle, Clock, XCircle, Upload } from "lucide-react";

export default function KolektorPage() {
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [form, setForm] = useState({ nop: "", nama_wajib_pajak: "", alamat_objek: "", rt: "01", rw: "01", tahun_pajak: 2026, jumlah_dibayar: "" });

  const load = () => {
    api.getPbbPembayaran("?tahun=2026").then(d => {
      const arr = Array.isArray(d) ? d : [];
      setRiwayat(arr);
      setStats({ total: arr.length, approved: arr.filter((x:any) => x.status === 'APPROVED').length, pending: arr.filter((x:any) => x.status === 'PENDING').length, rejected: arr.filter((x:any) => x.status === 'REJECTED').length });
    }).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.nop || !form.nama_wajib_pajak || !form.jumlah_dibayar) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    await api.submitPbb(fd);
    setShowForm(false);
    setForm({ nop: "", nama_wajib_pajak: "", alamat_objek: "", rt: "01", rw: "01", tahun_pajak: 2026, jumlah_dibayar: "" });
    load();
  };

  const badge = (s: string) => {
    const m: Record<string, string> = { PENDING: "bg-yellow-100 text-yellow-700", APPROVED: "bg-green-100 text-green-700", REJECTED: "bg-red-100 text-red-700" };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${m[s] || ''}`}>{s === 'APPROVED' ? 'Lunas' : s === 'PENDING' ? 'Pending' : 'Ditolak'}</span>;
  };

  const statCards = [
    { label: "Total Input", value: stats.total, icon: Landmark, color: "from-blue-400 to-blue-600" },
    { label: "Disetujui", value: stats.approved, icon: CheckCircle, color: "from-green-400 to-green-600" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "from-yellow-400 to-yellow-600" },
    { label: "Ditolak", value: stats.rejected, icon: XCircle, color: "from-red-400 to-red-600" },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Landmark className="w-6 h-6 text-amber-500" /> Dashboard Kolektor</h1><p className="text-slate-500 text-sm mt-1">Input dan kelola pembayaran PBB</p></div>
          <button onClick={()=>setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm"><Plus className="w-4 h-4" /> Input PBB</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2`}><s.icon className="w-5 h-5 text-white"/></div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100"><h2 className="font-semibold text-slate-800">Riwayat Input PBB</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>{["NOP","Wajib Pajak","RT/RW","Tahun","Jumlah","Status"].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-slate-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {riwayat.map((p:any) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.nop}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{p.nama_wajib_pajak}</td>
                  <td className="px-4 py-3 text-slate-600">RT {p.rt}/RW {p.rw}</td>
                  <td className="px-4 py-3 text-slate-600">{p.tahun_pajak}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">Rp {(p.jumlah_dibayar || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">{badge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowForm(false)}>
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Input Pembayaran PBB</h3>
            <div className="space-y-3">
              <input value={form.nop} onChange={e=>setForm({...form,nop:e.target.value})} placeholder="NOP" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <input value={form.nama_wajib_pajak} onChange={e=>setForm({...form,nama_wajib_pajak:e.target.value})} placeholder="Nama Wajib Pajak" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <input value={form.alamat_objek} onChange={e=>setForm({...form,alamat_objek:e.target.value})} placeholder="Alamat Objek Pajak" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <div className="flex gap-2"><input value={form.rt} onChange={e=>setForm({...form,rt:e.target.value})} placeholder="RT" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/><input value={form.rw} onChange={e=>setForm({...form,rw:e.target.value})} placeholder="RW" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/></div>
              <div className="flex gap-2"><input value={form.tahun_pajak} onChange={e=>setForm({...form,tahun_pajak:parseInt(e.target.value) || 2026})} placeholder="Tahun Pajak" type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/><input value={form.jumlah_dibayar} onChange={e=>setForm({...form,jumlah_dibayar:e.target.value})} placeholder="Jumlah Bayar" type="number" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/></div>
              <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-sm cursor-pointer hover:border-primary-300 hover:text-primary-500 transition-all">
                <Upload className="w-5 h-5" /> Upload Bukti Bayar (opsional)
              </div>
            </div>
            <div className="flex gap-3 mt-4"><button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm">Batal</button><button onClick={submit} className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-sm hover:bg-primary-700">Simpan</button></div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}