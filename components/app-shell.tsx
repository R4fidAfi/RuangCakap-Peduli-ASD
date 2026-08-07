"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  History,
  Home,
  MessageCircleHeart,
  User,
} from "lucide-react";
import { getProfile } from "@/lib/profile";
import Avatar from "./avatar";

const MENUS = [
  { href: "/beranda", label: "Beranda", icon: Home },
  { href: "/latihan", label: "Latihan", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/riwayat", label: "Riwayat", icon: History },
  { href: "/profil", label: "Profil", icon: User },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const profile = getProfile();

  return (
    <div className="min-h-dvh pb-28">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-sage-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/beranda" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-leaf-500 text-forest-800 shadow-soft">
              <MessageCircleHeart className="h-5 w-5" />
            </span>
            <span className="truncate text-base font-bold tracking-tight text-forest-700 sm:text-lg">
              Ruang<span className="text-leaf-700">Cakap</span>
            </span>
          </Link>
          <Link
            href="/profil"
            className="flex min-w-0 items-center gap-2 rounded-full border border-sage-200 bg-white py-1 pl-1 pr-3 shadow-soft transition-colors hover:bg-sage-100"
          >
            <Avatar id={profile?.avatarId} className="h-8 w-8" />
            <span className="max-w-[8rem] truncate text-sm font-semibold text-forest-700">
              {profile?.name ?? "Teman"}
            </span>
          </Link>
        </div>
      </header>

      {/* Konten */}
      <main className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6">
        {children}
      </main>

      {/* Bottom bar navigasi */}
      <nav
        aria-label="Navigasi utama"
        className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2"
      >
        <div className="flex items-center justify-between gap-1 rounded-full border border-sage-200 bg-white/95 p-1.5 shadow-lift backdrop-blur-md">
          {MENUS.map((menu) => {
            const active = pathname === menu.href;
            return (
              <Link
                key={menu.href}
                href={menu.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-full px-1 py-2 text-[10px] font-semibold transition-colors ${
                  active
                    ? "bg-leaf-500 text-forest-800 shadow-soft"
                    : "text-ink-faint hover:text-leaf-600"
                }`}
              >
                <menu.icon className="h-5 w-5" />
                {menu.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
