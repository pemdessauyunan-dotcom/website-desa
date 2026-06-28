"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Users, Landmark, Heart, Plus } from "lucide-react";

export default function RtDashboard() {
  const { user } = useAuth();
  const [warga, setWarga] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nik: "", nama: "", alamat: "", rt: user?.rt || "01", rw: user?.rw || "01", kelamin: "Laki-laki", program_id: 1 });

  const load = () => { api.getWarga(`?rt=${user?.rt || ''}`).then(d => setWarga(Array.isArray(d) ? d : [])).catch(() => {}); };
  useEffect(() => { load(); }, [user]);

  const submitUsulan = async () => {
    if (!form.nik || !form.nama) return;
    await api.usulkanBansos(form);
    setShowForm(false);
    setForm({ ...form, nik: "", nama: "", alamat: "" });
  };

  return (
    <DashboardLayout>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard RT {user?.rt || '-'}</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola data warga dan usulan bansos wilayah RT {user?.rt}</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center"><Users className="w-5 h-5 text-white"/></div><h3 className="font-semibold text-slate-700">Total Warga</h3></div>
          <p className="text-3xl font-bold text-slate-800">{warga.length}</p>
          <p className="text-sm text-slate-400">RT {user?.rt}/RW {user?.rw}</p>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center"><Landmark className="w-5 h-5 text-white"/></div><h3 className="font-semibold text-slate-700">PBB RT</h3></div>
          <p className="text-sm text-slate-500 mt-3">Cek status pembayaran PBB warga di dashboard PBB</p>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center"><Heart className="w-5 h-5 text-white"/></div><h3 className="font-semibold text-slate-700">Usulan Bansos</h3></div>
          <button onClick={()=>setShowForm(true)} className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm hover:bg-primary-700"><Plus className="w-4 h-4"/> Usulkan</button>
        </motion.div>
      </div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100"><h2 className="font-semibold text-slate-800">Data Warga RT {user?.rt}</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>{["NIK","Nama","Alamat","Kelamin","Pekerjaan"].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-slate-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {warga.map((w:any)=>(
                <tr key={w.nik} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{w.nik}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{w.nama}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{w.alamat?.substring(0,30)}</td>
                  <td className="px-4 py-3 text-slate-600">{w.kelamin}</td>
                  <td className="px-4 py-3 text-slate-600">{w.pekerjaan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowForm(false)}>
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Usulan Penerima Bansos</h3>
            <div className="space-y-3">
              <input value={form.nik} onChange={e=>setForm({...form,nik:e.target.value})} placeholder="NIK" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <input value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})} placeholder="Nama" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <input value={form.alamat} onChange={e=>setForm({...form,alamat:e.target.value})} placeholder="Alamat" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
            </div>
            <div className="flex gap-3 mt-4"><button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm">Batal</button><button onClick={submitUsulan} className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-sm hover:bg-primary-700">Usulkan</button></div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}