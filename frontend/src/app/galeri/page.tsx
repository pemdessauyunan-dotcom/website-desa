"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, Camera, ChevronLeft, ChevronRight, X, Layers } from "lucide-react";
import { api } from "@/lib/api";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}

export default function GaleriPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<string[]>([]);
  const [activeAlbum, setActiveAlbum] = useState("Semua");
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  useEffect(() => {
    setLoading(true);
    const params = activeAlbum !== "Semua" ? { album: activeAlbum } : undefined;
    api
      .getGaleri(params)
      .then((res: any) => {
        const data = res.data || res;
        const arr = Array.isArray(data) ? data : [];
        setItems(arr);
        if (activeAlbum === "Semua") {
          const unique = [...new Set(arr.map((g: any) => g.album || g.album_name || "Umum").filter(Boolean))] as string[];
          setAlbums(unique);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [activeAlbum]);

  const filtered = activeAlbum === "Semua" ? items : items.filter(
    (g) => (g.album || g.album_name) === activeAlbum
  );

  const openLightbox = (index: number) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTZ2MkgyNHYtMmgxMnpNMzYgMjJ2MkgyNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-6">
              <Camera className="w-4 h-4" /> Dokumentasi
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Galeri Desa</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Dokumentasi kegiatan dan pembangunan Desa Kasomalang Kulon
            </p>
          </motion.div>
        </div>
      </section>

      {/* Album Tabs */}
      <section className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setActiveAlbum("Semua")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeAlbum === "Semua"
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Semua
            </button>
            {albums.map((album) => (
              <button
                key={album}
                onClick={() => setActiveAlbum(album)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeAlbum === album
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {album}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-10 max-w-6xl mx-auto px-4">
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-500">Belum ada foto untuk album ini</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id || i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  onClick={() => openLightbox(i)}
                  className="aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer group relative shadow-sm hover:shadow-lg transition-all"
                >
                  {item.gambar || item.url || item.foto ? (
                    <img
                      src={item.gambar || item.url || item.foto}
                      alt={item.judul || item.keterangan || "Foto galeri"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {item.judul || item.keterangan || "Foto"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && filtered[lightbox.index] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((l) => ({ ...l, index: Math.max(0, l.index - 1) }));
              }}
              disabled={lightbox.index === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 disabled:opacity-30"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <motion.div
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightbox.index].gambar || filtered[lightbox.index].url || filtered[lightbox.index].foto}
                alt={filtered[lightbox.index].judul || "Foto"}
                className="w-full h-full object-contain rounded-lg"
              />
              {filtered[lightbox.index].judul && (
                <p className="text-white text-center mt-3 text-sm">
                  {filtered[lightbox.index].judul}
                </p>
              )}
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((l) => ({ ...l, index: Math.min(filtered.length - 1, l.index + 1) }));
              }}
              disabled={lightbox.index === filtered.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 disabled:opacity-30"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 text-white/50 text-sm">
              {lightbox.index + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}