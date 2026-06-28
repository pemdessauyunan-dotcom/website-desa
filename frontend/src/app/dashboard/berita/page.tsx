"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { Megaphone, Plus, Pencil, Trash2 } from "lucide-react";

export default function BeritaPage() {
  const [berita, setBerita] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ judul: "", konten: "", kategori: "Berita Desa", penulis: "" });

  const load = () => { api.getBerita({ limit: 50 }).then(d => setBerita(d.data || [])).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.judul || !form.konten) return;
    const fd = new FormData();
    fd.append("judul", form.judul);
    fd.append("konten", form.konten);
    fd.append("kategori", form.kategori);
    fd.append("penulis", form.penulis || "Admin Desa");
    await api.createBerita(fd);
    setShowForm(false);
    setForm({ judul: "", konten: "", kategori: "Berita Desa", penulis: "" });
    load();
  };

  return (
    <DashboardLayout>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Megaphone className="w-6 h-6 text-purple-500" /> Berita</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola berita dan artikel desa</p>
          </div>
          <button onClick={()=>setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm">
            <Plus className="w-4 h-4" /> Berita Baru
          </button>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="divide-y divide-slate-50">
          {berita.map((b: any, i: number) => (
            <motion.div key={b.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}
              className="p-4 flex items-start gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-primary-100 flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">{b.kategori}</span>
                  <span className="text-xs text-slate-400">{new Date(b.createdAt || b.created_at).toLocaleDateString("id-ID")}</span>
                </div>
                <h3 className="font-semibold text-slate-700 truncate">{b.judul}</h3>
                <p className="text-sm text-slate-400 line-clamp-1 mt-0.5">{b.konten?.substring(0,100)}</p>
              </div>
              <div className="flex gap-1">
                <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Pencil className="w-4 h-4" /></button>
                <button onClick={async()=>{await api.deleteBerita(b.id);load();}}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4"/></button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setShowForm(false)}>
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[80vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Buat Berita Baru</h3>
            <div className="space-y-3">
              <input value={form.judul} onChange={e=>setForm({...form,judul:e.target.value})} placeholder="Judul Berita" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <select value={form.kategori} onChange={e=>setForm({...form,kategori:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm bg-white">
                {["Berita Desa","Pembangunan","Wisata","Pengumuman"].map(k=><option key={k} value={k}>{k}</option>)}
              </select>
              <input value={form.penulis} onChange={e=>setForm({...form,penulis:e.target.value})} placeholder="Penulis" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/>
              <textarea value={form.konten} onChange={e=>setForm({...form,konten:e.target.value})} rows={8} placeholder="Konten berita..." className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm resize-none"/>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={()=>setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm">Batal</button>
              <button onClick={submit} className="flex-1 py-2.5 rounded-xl bg-primary-600 text-white text-sm hover:bg-primary-700">Publikasikan</button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}