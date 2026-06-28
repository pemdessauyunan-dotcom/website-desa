"use client";
import { ReactNode, useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

export default function ClientLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    api.hitPengunjung().catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}