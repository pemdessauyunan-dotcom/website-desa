"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Megaphone, Calendar } from "lucide-react";
import { api } from "@/lib/api";

export default function BeritaPage() {
  const [berita, setBerita] = useState<any[]>([]);
  const [kategori, setKategori] = useState("Semua");
  const [allKategori, setAllKategori] = useState<string[]>(["Semua"]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 12, page };
    if (kategori !== "Semua") (params as any).kategori = kategori;
    api.getBerita(params).then(d => { setBerita(d.data || []); setLoading(false); }).catch(() => setLoading(false));
    api.getKategoriBerita().then(d => setAllKategori(["Semua", ...d])).catch(() => {});
  }, [kategori, page]);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Berita Desa</h1>
          <p className="text-slate-500 mt-2">Informasi dan perkembangan terbaru Desa Kasomalang Kulon</p>
        </motion.div>
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {allKategori.map(k => (
            <button key={k} onClick={() => { setKategori(k); setPage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${kategori === k ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >{k}</button>
          ))}
        </div>
        {loading ? <div className="flex justify-center py-20"><div className="spinner"></div></div> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {berita.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 card-hover"
              >
                <div className="h-44 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center"><Megaphone className="w-10 h-10 text-primary-300" /></div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">{item.kategori}</span>
                    <span className="text-xs text-slate-400"><Calendar className="w-3 h-3 inline mr-1" />{new Date(item.createdAt || item.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                  <Link href={"/berita/" + item.slug}><h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 hover:text-primary-600">{item.judul}</h3></Link>
                  <p className="text-sm text-slate-500 line-clamp-2">{item.konten?.replace(/<[^>]*>/g,"").substring(0,120)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}