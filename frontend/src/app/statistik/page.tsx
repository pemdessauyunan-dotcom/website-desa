"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { BarChart3, Users, BookOpen, Briefcase, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function StatistikPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getStatistikPenduduk().then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div className="pt-32 flex justify-center"><div className="spinner"></div></div>;

  const cards = [
    { label: "Total Penduduk", value: data.total, icon: Users, color: "from-primary-400 to-primary-600" },
    { label: "Laki-laki", value: data.laki_laki, icon: Users, color: "from-blue-400 to-blue-600" },
    { label: "Perempuan", value: data.perempuan, icon: Users, color: "from-pink-400 to-pink-600" },
    { label: "Kepala Keluarga", value: data.kk, icon: Users, color: "from-amber-400 to-amber-600" },
  ];

  const usia = typeof data.data_per_usia === 'string' ? JSON.parse(data.data_per_usia) : (data.data_per_usia || []);
  const pendidikan = typeof data.data_per_pendidikan === 'string' ? JSON.parse(data.data_per_pendidikan) : (data.data_per_pendidikan || []);
  const pekerjaan = typeof data.data_per_pekerjaan === 'string' ? JSON.parse(data.data_per_pekerjaan) : (data.data_per_pekerjaan || []);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3"><BarChart3 className="w-8 h-8 text-primary-500" /> Data & Statistik</h1>
          <p className="text-slate-500 mt-2">Data kependudukan Desa Kasomalang Kulon</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {cards.map((c, i) => (
            <motion.div key={c.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
              className={`bg-gradient-to-br ${c.color} rounded-2xl p-6 text-white text-center shadow-lg`}
            >
              <c.icon className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="text-3xl font-bold">{c.value.toLocaleString('id-ID')}</p>
              <p className="text-sm text-white/80 mt-1">{c.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-primary-500" /> Usia</h2>
            <ResponsiveContainer width="100%" height={300}><BarChart data={usia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{fontSize:12}} />
              <YAxis tick={{fontSize:12}} />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" radius={[8,8,0,0]} />
            </BarChart></ResponsiveContainer>
          </motion.div>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-secondary-500" /> Pendidikan</h2>
            <ResponsiveContainer width="100%" height={300}><PieChart>
              <Pie data={pendidikan} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} label={(entry: any) => `${(entry.percent * 100).toFixed(0)}%`}>
                {pendidikan.map((_:any, i:number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart></ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-amber-500" /> Pekerjaan</h2>
          <ResponsiveContainer width="100%" height={350}><BarChart data={pekerjaan} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" tick={{fontSize:12}} />
            <YAxis dataKey="label" type="category" width={120} tick={{fontSize:12}} />
            <Tooltip />
            <Bar dataKey="value" fill="#f59e0b" radius={[0,8,8,0]} />
          </BarChart></ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}