import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Website Resmi Desa Kasomalang Kulon",
  description: "Website resmi Pemerintah Desa Kasomalang Kulon, Kecamatan Kasomalang, Kabupaten Subang. Informasi desa, pelayanan publik, PBB, dan bansos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}