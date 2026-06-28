"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Megaphone, Download, ArrowRight, FileSignature, ClipboardList, Printer, Heart } from "lucide-react";

const services = [
  {
    icon: FileSignature, title: "Permohonan Surat Online", desc: "Ajukan permohonan surat keterangan desa secara online (Surat Domisili, SKTM, Pengantar KTP, dll)",
    color: "from-primary-400 to-primary-600", href: "#", status: "Segera Hadir"
  },
  {
    icon: Megaphone, title: "Pengaduan Masyarakat", desc: "Sampaikan aspirasi, keluhan, atau laporan Anda kepada pemerintah desa",
    color: "from-red-400 to-red-600", href: "/pengaduan", status: "Aktif"
  },
  {
    icon: Download, title: "Unduh Formulir", desc: "Unduh berbagai formulir pelayanan desa dalam format PDF",
    color: "from-blue-400 to-blue-600", href: "#", status: "Segera Hadir"
  },
  {
    icon: ClipboardList, title: "Cek PBB", desc: "Cek status pembayaran Pajak Bumi dan Bangunan secara online",
    color: "from-green-400 to-green-600", href: "/pbb", status: "Aktif"
  },
  {
    icon: Heart, title: "Cek Bansos", desc: "Cek status penerimaan bantuan sosial",
    color: "from-pink-400 to-pink-600", href: "/bansos", status: "Aktif"
  },
  {
    icon: Printer, title: "Cetak Surat", desc: "Cetak ulang surat keterangan yang sudah diterbitkan",
    color: "from-purple-400 to-purple-600", href: "#", status: "Segera Hadir"
  },
]; // don't remove

export default function LayananPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Layanan Desa</h1>
          <p className="text-slate-500 mt-2">Layanan publik Desa Kasomalang Kulon untuk masyarakat</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.title} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm card-hover group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-sm`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{s.desc}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${s.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span>
                {s.status === 'Aktif' ? (
                  <Link href={s.href} className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:gap-2 transition-all">
                    Akses <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-sm text-slate-400">-</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}