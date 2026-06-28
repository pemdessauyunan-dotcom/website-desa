"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, Plus, Search, Filter } from "lucide-react";

export default function WargaPage() {
  const [warga, setWarga] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nik: "", nama: "", alamat: "", rt: "01", rw: "01", kelamin: "Laki-laki", pendidikan: "", pekerjaan: "", agama: "Islam", status_kawin: "Belum Kawin", no_kk: "", tempat_lahir: "", tanggal_lahir: "" });

  const load = () => { api.getWarga().then(d => setWarga(Array.isArray(d) ? d : [])).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.nik || !form.nama) return;
    await api.createWarga(form);
    setShowForm(false);
    setForm({ ...form, nik: "", nama: "", alamat: "" });
    load();
  };

  const filtered = warga.filter(w => w.nama?.toLowerCase().includes(search.toLowerCase()) || w.nik?.includes(search));

  return (
    <DashboardLayout>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Users className="w-6 h-6 text-teal-500" /> Data Warga</h1><p className="text-slate-500 text-sm mt-1">Database kependudukan Desa Kasomalang Kulon</p></div>
          <button onClick={()=>setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm"><Plus className="w-4 h-4" /> Tambah</button>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-4">
        <div className="relative max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari NIK/Nama..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-400"/></div>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr>{["NIK","Nama","RT/RW","Kelamin","Pendidikan","Pekerjaan","# KK"].map(h=><th key={h} className="text-left px-4 py-3 font-medium text-slate-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((w: any) => (
                <tr key={w.nik} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{w.nik}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{w.nama}</td>
                  <td className="px-4 py-3 text-slate-600">RT {w.rt}/RW {w.rw}</td>
                  <td className="px-4 py-3 text-slate-600">{w.kelamin}</td>
                  <td className="px-4 py-3 text-slate-600">{w.pendidikan || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{w.pekerjaan || '-'}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{w.no_kk || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowForm(false)}>
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[80vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Tambah Warga</h3>
            <div className="space-y-3">
              <input value={form.nik} onChange={e=>setForm({...form,nik:e.target.value})} placeholder="NIK" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <input value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})} placeholder="Nama Lengkap" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <input value={form.alamat} onChange={e=>setForm({...form,alamat:e.target.value})} placeholder="Alamat" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <div className="flex gap-2"><input value={form.rt} onChange={e=>setForm({...form,rt:e.target.value})} placeholder="RT" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/><input value={form.rw} onChange={e=>setForm({...form,rw:e.target.value})} placeholder="RW" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/></div>
              <select value={form.kelamin} onChange={e=>setForm({...form,kelamin:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm bg-white"><option>Laki-laki</option><option>Perempuan</option></select>
              <input value={form.pendidikan} onChange={e=>setForm({...form,pendidikan:e.target.value})} placeholder="Pendidikan" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <input value={form.pekerjaan} onChange={e=>setForm({...form,pekerjaan:e.target.value})} placeholder="Pekerjaan" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
            </div>
            <div className="flex gap-3 mt-4"><button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm">Batal</button><button onClick={submit} className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-sm hover:bg-primary-700">Simpan</button></div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}