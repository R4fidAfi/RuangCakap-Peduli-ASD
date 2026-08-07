"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, MessageCircleHeart } from "lucide-react";
import {
  AVATAR_IDS,
  getProfile,
  isLoggedIn,
  saveProfile,
  type AvatarId,
} from "@/lib/profile";
import Avatar from "@/components/avatar";
import Mascot from "@/components/mascot";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [avatarId, setAvatarId] = useState<AvatarId>("sage");
  const [error, setError] = useState("");

  // Sudah login -> langsung ke area latihan.
  useEffect(() => {
    if (isLoggedIn()) router.replace("/beranda");
  }, [router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError("Nama panggilan wajib diisi.");
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      setError("PIN harus 4 angka (bebas, contoh: 1234).");
      return;
    }
    saveProfile({ name: trimmed, pin, avatarId });
    router.push("/beranda");
  }

  return (
    <main className="flex min-h-dvh flex-col bg-page">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-leaf-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <span className="flex items-center gap-2 text-sm font-bold text-forest-700">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-leaf-500 text-forest-800">
            <MessageCircleHeart className="h-4 w-4" />
          </span>
          Ruang<span className="text-leaf-700">Cakap</span>
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16 pt-4 sm:px-6">
        <Mascot mood="happy" className="mx-auto h-24 w-24 drop-shadow-md" />
        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-forest-800">
          Masuk ke akunmu
        </h1>
        <p className="mt-1.5 text-center text-sm leading-relaxed text-ink-soft">
          Buat akun lokal untuk mulai berlatih. Data tersimpan aman di browser
          kamu — tanpa perlu email atau kata sandi dari server.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-5">
          {/* Pilih avatar */}
          <div>
            <p className="text-sm font-semibold text-ink">Pilih maskot kamu</p>
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
              htmlFor="login-name"
              className="block text-sm font-semibold text-ink"
            >
              Nama panggilan
            </label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Raka"
              autoComplete="off"
              className="mt-2 w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-leaf-400 focus:outline-none"
            />
          </div>

          {/* PIN */}
          <div>
            <label
              htmlFor="login-pin"
              className="flex items-center gap-1.5 text-sm font-semibold text-ink"
            >
              <Lock className="h-3.5 w-3.5 text-leaf-700" />
              PIN 4 digit
            </label>
            <input
              id="login-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="Bebas, contoh: 1234"
              autoComplete="off"
              className="mt-2 w-full rounded-2xl border border-sage-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-leaf-400 focus:outline-none"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-faint">
              PIN lokal untuk kesan akun — tidak divalidasi server. Ingat saja
              sendiri.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-sun-100 bg-sun-100/50 px-4 py-3 text-sm text-ink"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf-500 px-6 py-3.5 text-sm font-bold text-forest-800 shadow-lift transition-all hover:-translate-y-0.5 hover:bg-leaf-600"
          >
            Masuk ke RuangCakap
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-faint">
          RuangCakap adalah alat latihan komunikasi — bukan diagnosis medis dan
          bukan pengganti terapi profesional.
        </p>
      </div>
    </main>
  );
}
