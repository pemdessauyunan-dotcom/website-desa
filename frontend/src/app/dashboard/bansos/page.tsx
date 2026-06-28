"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Heart, Plus, CheckCircle, XCircle, Users, Package } from "lucide-react";

export default function BansosPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [penerima, setPenerima] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nik: "", nama: "", alamat: "", rt: "01", rw: "01", program_id: 1 });
  const [showReject, setShowReject] = useState<number | null>(null);
  const [alasan, setAlasan] = useState("");

  const load = async () => {
    const [p, r] = await Promise.all([api.getBansosProgram().catch(() => []), api.getPenerimaBansos().catch(() => [])]);
    setPrograms(Array.isArray(p) ? p : []);
    setPenerima(Array.isArray(r) ? r : []);
  };

  useEffect(() => { load(); }, []);

  const submitPenerima = async () => {
    if (!form.nik || !form.nama) return;
    await api.usulkanBansos(form);
    setShowForm(false);
    setForm({ nik: "", nama: "", alamat: "", rt: "01", rw: "01", program_id: 1 });
    load();
  };

  const handleReject = async (id: number) => {
    if (!alasan.trim()) return;
    await api.rejectBansos(id, alasan);
    setShowReject(null);
    setAlasan("");
    load();
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" /> Data Bansos
        </h1>
        <p className="text-slate-500 text-sm mt-1">Kelola program bantuan sosial dan penerima</p>
      </motion.div>

      {/* Program Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {programs.map((p, i) => (
          <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm card-hover"
          >
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-slate-700 text-sm">{p.nama?.substring(0,20)}</h3>
            </div>
            <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Penerima</span><span className="font-medium">{p.penerima?.length || 0}/{p.kuota}</span></div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div initial={{width:0}} animate={{width: p.kuota > 0 ? ((p.penerima?.length||0)/p.kuota*100)+"%" : "0%"}} 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"/>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Penerima Table + Add Button */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Daftar Penerima Bansos</h2>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all text-sm"
          ><Plus className="w-4 h-4" /> Tambah</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">NIK</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Nama</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Program</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">RT/RW</th>
                <th className="text-center px-4 py-3 font-medium text-slate-500">Status</th>
                <th className="text-center px-4 py-3 font-medium text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {penerima.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-xs font-mono text-slate-600">{p.nik}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{p.nama}</td>
                  <td className="px-4 py-3 text-slate-600">{p.program?.nama?.substring(0,25)}</td>
                  <td className="px-4 py-3 text-slate-600">RT {p.rt}/RW {p.rw}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.status === 'DISETUJUI' ? 'bg-green-100 text-green-700' :
                      p.status === 'DITOLAK' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.status === 'DISETUJUI' ? 'Disetujui' : p.status === 'DITOLAK' ? 'Ditolak' : 'Diusulkan'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.status === 'DIUSULKAN' && (
                      <div className="flex justify-center gap-1">
                        <button onClick={() => api.approveBansos(p.id).then(load)}
                          className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"><CheckCircle className="w-4 h-4"/></button>
                        <button onClick={() => setShowReject(p.id)}
                          className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"><XCircle className="w-4 h-4"/></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Tambah Penerima Bansos</h3>
            <div className="space-y-3">
              <input value={form.nik} onChange={e=>setForm({...form,nik:e.target.value})} placeholder="NIK" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <input value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})} placeholder="Nama Lengkap" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <input value={form.alamat} onChange={e=>setForm({...form,alamat:e.target.value})} placeholder="Alamat" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <div className="flex gap-2">
                <input value={form.rt} onChange={e=>setForm({...form,rt:e.target.value})} placeholder="RT" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
                <input value={form.rw} onChange={e=>setForm({...form,rw:e.target.value})} placeholder="RW" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              </div>
              <select value={form.program_id} onChange={e=>setForm({...form,program_id:parseInt(e.target.value)})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm bg-white">
                {programs.map((p:any) => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm">Batal</button>
              <button onClick={submitPenerima} className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-sm hover:bg-primary-700">Simpan</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Modal */}
      {showReject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowReject(null)}>
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Tolak Penerima</h3>
            <textarea value={alasan} onChange={e=>setAlasan(e.target.value)} rows={3} placeholder="Alasan penolakan..." className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-red-400 text-sm resize-none mb-4"/>
            <div className="flex gap-3">
              <button onClick={()=>setShowReject(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm">Batal</button>
              <button onClick={()=>handleReject(showReject)} disabled={!alasan.trim()} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm disabled:opacity-50">Tolak</button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}