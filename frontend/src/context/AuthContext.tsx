"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: number; nama: string; email: string; role: string; rt?: string; rw?: string;
}

interface AuthContextType {
  user: User | null; token: string | null; loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = api.getToken();
    if (t) {
      setToken(t);
      api.me().then(d => { if (d.user) setUser(d.user); }).catch(() => {}).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    if (res.token) {
      api.setToken(res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    api.setToken(null);
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);