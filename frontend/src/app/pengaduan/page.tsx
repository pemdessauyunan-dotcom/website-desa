"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Send, CheckCircle, User, Mail } from "lucide-react";
import { api } from "@/lib/api";

export default function PengaduanPage() {
  const [form, setForm] = useState({ nama_pengirim: "", kontak: "", isi: "", anonim: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.isi.trim()) return;
    setLoading(true);
    try {
      await api.submitPengaduan(form);
      setSent(true);
      setForm({ nama_pengirim: "", kontak: "", isi: "", anonim: false });
    } catch {}
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-white" /></div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Pengaduan Masyarakat</h1>
          <p className="text-slate-500 mt-2">Sampaikan aspirasi, keluhan, atau laporan Anda kepada pemerintah desa</p>
        </motion.div>

        {sent ? (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-green-50 rounded-2xl p-8 text-center border border-green-200 max-w-md mx-auto">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Pengaduan Terkirim!</h2>
            <p className="text-slate-500 mb-4">Terima kasih, pengaduan Anda akan segera ditindaklanjuti.</p>
            <button onClick={() => setSent(false)} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700">Kirim Lagi</button>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit}
            className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm max-w-lg mx-auto"
          >
            {!form.anonim && (<><div className="mb-4"><label className="text-sm font-medium text-slate-700 mb-1 block"><User className="w-4 h-4 inline mr-1" />Nama</label><input value={form.nama_pengirim} onChange={e=>setForm({...form,nama_pengirim:e.target.value})} placeholder="Nama lengkap" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/></div>
            <div className="mb-4"><label className="text-sm font-medium text-slate-700 mb-1 block"><Mail className="w-4 h-4 inline mr-1" />Kontak</label><input value={form.kontak} onChange={e=>setForm({...form,kontak:e.target.value})} placeholder="No. HP atau Email" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm"/></div></>)}
            <div className="mb-4"><label className="text-sm font-medium text-slate-700 mb-1 block">Isi Pengaduan</label><textarea value={form.isi} onChange={e=>setForm({...form,isi:e.target.value})} placeholder="Tulis pengaduan Anda..." rows={5} required className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary-400 text-sm resize-none"/></div>
            <label className="flex items-center gap-2 text-sm text-slate-600 mb-6 cursor-pointer"><input type="checkbox" checked={form.anonim} onChange={e=>setForm({...form,anonim:e.target.checked})} className="rounded text-primary-600"/>Kirim secara anonim</label>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >{loading ? "Mengirim..." : <><Send className="w-4 h-4" /> Kirim Pengaduan</>}</button>
          </motion.form>
        )}
      </div>
    </div>
  );
}