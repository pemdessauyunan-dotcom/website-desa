const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options?.body instanceof FormData) delete headers['Content-Type'];
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers: { ...headers, ...(options?.headers as Record<string, string> || {}) } });
  if (res.status === 401 && typeof window !== 'undefined') localStorage.removeItem('token');
  return res.json();
}

export const api = {
  getToken: () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
  setToken: (token: string | null) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  },

  // Auth
  login: (email: string, password: string) => fetchAPI('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => fetchAPI('/api/auth/me'),

  // Public - Berita
  getBerita: (params?: { limit?: number; page?: number; kategori?: string }) => {
    const qs = new URLSearchParams();
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.page) qs.set('page', String(params.page));
    if (params?.kategori) qs.set('kategori', params.kategori);
    const s = qs.toString();
    return fetchAPI(`/api/berita${s ? `?${s}` : ''}`);
  },
  getBeritaBySlug: (slug: string) => fetchAPI(`/api/berita/${slug}`),
  getKategoriBerita: () => fetchAPI('/api/berita/kategori'),
  createBerita: (formData: FormData) => fetchAPI('/api/berita', { method: 'POST', body: formData }),
  deleteBerita: (id: number) => fetchAPI(`/api/berita/${id}`, { method: 'DELETE' }),

  // Public - PBB
  getPBBStats: () => fetchAPI('/api/pbb/stats'),
  cekPBB: (nop: string) => fetchAPI(`/api/pbb/cek?nop=${nop}`),

  // Public - Bansos
  getBansosStats: () => fetchAPI('/api/bansos/stats'),
  cekBansos: (nik: string) => fetchAPI(`/api/bansos/cek?nik=${nik}`),

  // Public - Info
  getStatistikPenduduk: () => fetchAPI('/api/statistik/penduduk'),
  getInfoDesa: () => fetchAPI('/api/publik/info-desa'),
  getAparatur: () => fetchAPI('/api/profil/aparatur'),
  getProfilSejarah: () => fetchAPI('/api/profil/sejarah'),
  getGaleri: (params?: { album?: string }) => {
    const qs = params?.album ? `?album=${params.album}` : '';
    return fetchAPI(`/api/galeri${qs}`);
  },
  getPengunjung: () => fetchAPI('/api/publik/statistik-pengunjung'),
  hitPengunjung: () => fetchAPI('/api/publik/hitung-pengunjung', { method: 'POST' }),
  submitPengaduan: (data: any) => fetchAPI('/api/pengaduan', { method: 'POST', body: JSON.stringify(data) }),

  // Dashboard
  getDashboardStats: () => fetchAPI('/api/dashboard/stats'),
  getPbbPembayaran: (params?: string) => fetchAPI(`/api/pbb/pembayaran${params || ''}`),
  approvePbb: (id: number) => fetchAPI(`/api/pbb/pembayaran/${id}/approve`, { method: 'PUT' }),
  rejectPbb: (id: number, alasan: string) => fetchAPI(`/api/pbb/pembayaran/${id}/reject`, { method: 'PUT', body: JSON.stringify({ alasan }) }),
  submitPbb: (formData: FormData) => fetchAPI('/api/pbb/pembayaran', { method: 'POST', body: formData }),
  getBansosProgram: () => fetchAPI('/api/bansos/program'),
  createProgram: (data: any) => fetchAPI('/api/bansos/program', { method: 'POST', body: JSON.stringify(data) }),
  getPenerimaBansos: (params?: string) => fetchAPI(`/api/bansos/penerima${params || ''}`),
  usulkanBansos: (data: any) => fetchAPI('/api/bansos/penerima', { method: 'POST', body: JSON.stringify(data) }),
  approveBansos: (id: number) => fetchAPI(`/api/bansos/penerima/${id}/approve`, { method: 'PUT' }),
  rejectBansos: (id: number, alasan: string) => fetchAPI(`/api/bansos/penerima/${id}/reject`, { method: 'PUT', body: JSON.stringify({ alasan }) }),
  getWarga: (params?: string) => fetchAPI(`/api/warga${params || ''}`),
  createWarga: (data: any) => fetchAPI('/api/warga', { method: 'POST', body: JSON.stringify(data) }),
  getPengaduan: () => fetchAPI('/api/pengaduan'),
  updatePengaduanStatus: (id: number, data: any) => fetchAPI(`/api/pengaduan/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
};