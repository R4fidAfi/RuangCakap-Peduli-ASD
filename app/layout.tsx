import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RuangCakap — Latihan Komunikasi Sosial",
  description:
    "Platform latihan komunikasi sosial berbasis AI untuk remaja dan dewasa. Latih percakapan sehari-hari dalam ruang yang aman, suportif, dan bertahap.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={plusJakarta.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
