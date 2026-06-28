"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { motion as m } from "framer-motion";
import { Info, Users, MapPin, Award, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";

export default function ProfilPage() {
  const [tab, setTab] = useState("sejarah");
  const [sejarah, setSejarah] = useState<any>({ sejarah: "", visi_misi: "[]" });
  const [aparatur, setAparatur] = useState<any[]>([]);
  useEffect(() => { api.getProfilSejarah().then(setSejarah).catch(() => {}); api.getAparatur().then(setAparatur).catch(() => {}); }, []);
  const visiMisi = typeof sejarah.visi_misi === 'string' ? JSON.parse(sejarah.visi_misi || '[]') : sejarah.visi_misi || [];

  const tabs = [
    { id: "sejarah", label: "Sejarah & Visi Misi", icon: Info },
    { id: "aparatur", label: "Perangkat Desa", icon: Users },
    { id: "wilayah", label: "Wilayah", icon: MapPin },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Profil Desa</h1>
          <p className="text-slate-500 mt-2">Mengenal lebih dekat Desa Kasomalang Kulon</p>
        </motion.div>
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${tab===t.id?'bg-primary-600 text-white shadow-md':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            ><t.icon className="w-4 h-4" />{t.label}</button>
          ))}
        </div>

        {tab === "sejarah" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Sejarah Desa</h2>
            <p className="text-slate-600 leading-relaxed mb-8">{sejarah.sejarah}</p>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Visi & Misi</h3>
            <div className="space-y-4">
              {visiMisi.map((v: string, i: number) => (
                <div key={i} className="flex gap-3 p-4 bg-primary-50 rounded-xl">
                  <Award className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "aparatur" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {aparatur.map((p,i) => (
                <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                  className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-sm card-hover"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <span className="text-xl font-bold text-primary-600">{p.nama.split(' ').map((n:string)=>n[0]).join('').substring(0,2)}</span>
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">{p.nama}</p>
                  <p className="text-xs text-primary-600 font-medium mt-1">{p.jabatan}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === "wilayah" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Wilayah Administratif</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1,2,3,4].map(rw => (
                <div key={rw} className="p-5 bg-slate-50 rounded-xl">
                  <h3 className="font-bold text-slate-700 mb-3">RW {String(rw).padStart(2,'0')}</h3>
                  <div className="flex gap-2">
                    {[1,2,3].map(rt => (
                      <span key={rt} className="px-3 py-1.5 bg-white rounded-lg text-xs text-slate-600 border border-slate-200">RT {String(rt).padStart(2,'0')}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}