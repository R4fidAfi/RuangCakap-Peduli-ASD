"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Save } from "lucide-react";
import RequireAuth from "@/components/require-auth";
import AppShell from "@/components/app-shell";
import Avatar from "@/components/avatar";
import {
  AVATAR_IDS,
  clearProfile,
  getProfile,
  saveProfile,
  type AvatarId,
} from "@/lib/profile";

const GOALS = [
  "Lebih percaya diri berbicara",
  "Situasi di tempat umum",
  "Dunia kerja & wawancara",
  "Kehidupan sehari-hari",
];

export default function ProfilPage() {
  const router = useRouter();
  const existing = getProfile();
  const [name, setName] = useState(existing?.name ?? "");
  const [avatarId, setAvatarId] = useState<AvatarId>(
    (existing?.avatarId as AvatarId) ?? "sage",
  );
  const [goal, setGoal] = useState(existing?.goal ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length === 0) return;
    saveProfile({ name: name.trim(), avatarId, goal: goal || undefined });
    setSaved(true);
  }

  function logout() {
    clearProfile();
    router.replace("/");
  }

  return (
    <RequireAuth>
      <AppShell>
        <p className="text-xs font-bold uppercase tracking-widest text-leaf-700">
          Profil
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-forest-800 sm:text-3xl">
          Pengaturan akun
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Akun lokal tersimpan di browser perangkat ini.
        </p>

        <form onSubmit={submit} className="mt-7 max-w-xl space-y-6">
          {/* Avatar */}
          <div>
            <p className="text-sm font-semibold text-ink">Maskot kamu</p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {AVATAR_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAvatarId(id)}
                  aria-pressed={avatarId === id}
                  aria-label={`Maskot ${id}`}
                  className={`rounded-full p-1 transition-all ${
                    avatarId === id
                      ? "bg-leaf-500/15 ring-2 ring-leaf-500"
                      : "hover:bg-sage-100"
                  }`}
                >
                  <Avatar id={id} className="h-12 w-12" />
                </button>
              ))}
            </div>
          </div>

          {/* Nama */}
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-semibold text-ink"
            >
              Nama panggilan
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 text-sm text-ink focus:border-leaf-400 focus:outline-none"
            />
          </div>

          {/* Tujuan */}
          <div>
            <label
              htmlFor="profile-goal"
              className="block text-sm font-semibold text-ink"
            >
              Tujuan belajar
            </label>
            <div className="relative mt-2">
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <select
                id="profile-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-sage-200 bg-white px-4 py-3 pr-11 text-sm text-ink focus:border-leaf-400 focus:outline-none"
              >
                <option value="">Pilih tujuan belajarmu…</option>
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-leaf-500 px-6 py-3 text-sm font-bold text-forest-800 shadow-lift transition-all hover:-translate-y-0.5 hover:bg-leaf-600"
            >
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </button>
            {saved && (
              <span className="text-sm font-semibold text-leaf-700">
                Tersimpan ✓
              </span>
            )}
          </div>
        </form>

        <div className="mt-10 max-w-xl rounded-3xl border border-sage-200 bg-white p-5 shadow-soft">
          <h2 className="text-sm font-bold text-forest-700">Sesi</h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            Keluar akan menghapus akun lokal dari browser ini dan kembali ke
            halaman awal.
          </p>
          <button
            onClick={logout}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-500 px-5 py-2.5 text-sm font-bold text-white shadow-lift transition-colors hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" />
            Keluar dari Akun
          </button>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
