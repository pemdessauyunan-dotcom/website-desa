"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";
import { ClipboardList, MessageSquare, CheckCircle } from "lucide-react";

export default function PengaduanPage() {
  const [data, setData] = useState<any[]>([]);
  const [replyId, setReplyId] = useState<number | null>(null);
  const [balasan, setBalasan] = useState("");
  const load = () => { api.getPengaduan().then(d => setData(Array.isArray(d) ? d : [])).catch(() => {}); };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await api.updatePengaduanStatus(id, { status, balasan });
    setReplyId(null);
    setBalasan("");
    load();
  };

  const badge = (s: string) => {
    const m: Record<string, string> = { DITERIMA: "bg-blue-100 text-blue-700", DIPROSES: "bg-yellow-100 text-yellow-700", SELESAI: "bg-green-100 text-green-700" };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${m[s] || 'bg-slate-100'}`}>{s}</span>;
  };

  return (
    <DashboardLayout>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><ClipboardList className="w-6 h-6 text-blue-500" /> Pengaduan</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola pengaduan masyarakat</p>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="divide-y divide-slate-50">
          {data.map((p: any) => (
            <div key={p.id} className="p-5 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {badge(p.status)}
                    <span className="text-xs text-slate-400">{new Date(p.createdAt || p.created_at).toLocaleDateString("id-ID")}</span>
                    {p.anonim && <span className="text-xs text-slate-400 italic">(Anonim)</span>}
                  </div>
                  {!p.anonim && <p className="text-sm font-medium text-slate-700">{p.nama_pengirim || "Anonim"}</p>}
                </div>
                <div className="flex gap-1">
                  {p.status === "DITERIMA" && <button onClick={() => updateStatus(p.id, "DIPROSES")} className="px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-xs hover:bg-yellow-200">Proses</button>}
                  {p.status !== "SELESAI" && <button onClick={() => setReplyId(p.id)} className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs hover:bg-blue-200">Balas</button>}
                </div>
              </div>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{p.isi}</p>
              {p.balasan && <div className="mt-2 p-3 bg-green-50 rounded-xl text-sm text-slate-600"><span className="font-medium text-green-700">Balasan: </span>{p.balasan}</div>}
              {p.kontak && <p className="text-xs text-slate-400 mt-1">Kontak: {p.kontak}</p>}
            </div>
          ))}
          {data.length === 0 && <div className="text-center py-12 text-slate-400">Belum ada pengaduan</div>}
        </div>
      </motion.div>

      {replyId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setReplyId(null)}>
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Balas Pengaduan</h3>
            <textarea value={balasan} onChange={e => setBalasan(e.target.value)} rows={4} placeholder="Tulis balasan..." className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-400 text-sm resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setReplyId(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm">Batal</button>
              <button onClick={() => updateStatus(replyId, "SELESAI")} disabled={!balasan.trim()} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm disabled:opacity-50">Kirim Balasan</button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}