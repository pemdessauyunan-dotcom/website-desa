"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { api } from "@/lib/api";

export default function BeritaDetail() {
  const params = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (params?.slug) api.getBeritaBySlug(params.slug as string).then(d => { setItem(d); setLoading(false); }).catch(() => setLoading(false));
  }, [params?.slug]);
  if (loading) return <div className="pt-32 flex justify-center"><div className="spinner"></div></div>;
  if (!item) return <div className="pt-32 text-center text-slate-500">Berita tidak ditemukan</div>;
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/berita" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-6 transition-all"><ArrowLeft className="w-4 h-4" /> Kembali</Link>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium">{item.kategori}</span>
          <span className="text-sm text-slate-400"><Calendar className="w-4 h-4 inline mr-1" />{new Date(item.createdAt || item.created_at).toLocaleDateString("id-ID")}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">{item.judul}</h1>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8"><User className="w-4 h-4" /> {item.penulis}</div>
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">{item.konten}</div>
      </div>
    </div>
  );
}