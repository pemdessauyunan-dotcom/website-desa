const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getToken: () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
  setToken: (token: string | null) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  },
  login: (email: string, password: string) =>
    fetchAPI('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => fetchAPI('/api/auth/me'),

  // Publik
  getInfoDesa: () => fetchAPI('/api/publik/info-desa'),
  getBerita: (params?: { limit?: number; page?: number; kategori?: string }) => {
    const search = new URLSearchParams();
    if (params?.limit) search.set('limit', String(params.limit));
    if (params?.page) search.set('page', String(params.page));
    if (params?.kategori) search.set('kategori', params.kategori);
    const qs = search.toString();
    return fetchAPI(`/api/berita${qs ? `?${qs}` : ''}`);
  },
  getBeritaBySlug: (slug: string) => fetchAPI(`/api/berita/${slug}`),
  getStatistikPenduduk: () => fetchAPI('/api/statistik/penduduk'),
  getStatistikPengunjung: () => fetchAPI('/api/publik/statistik-pengunjung'),
  getPBBStats: () => fetchAPI('/api/pbb/stats'),
  getBansosStats: () => fetchAPI('/api/bansos/stats'),
  getProfilSejarah: () => fetchAPI('/api/profil/sejarah'),
  getProfilAparatur: () => fetchAPI('/api/profil/aparatur'),
  getGaleri: (params?: { album?: string }) => {
    const qs = params?.album ? `?album=${params.album}` : '';
    return fetchAPI(`/api/galeri${qs}`);
  },
  postPengaduan: (data: any) =>
    fetchAPI('/api/pengaduan', { method: 'POST', body: JSON.stringify(data) }),
  cekPBB: (nop: string) => fetchAPI(`/api/pbb/cek?nop=${nop}`),
  cekBansos: (nik: string) => fetchAPI(`/api/bansos/cek?nik=${nik}`),
};