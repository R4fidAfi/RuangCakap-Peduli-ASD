"use client";

import { useEffect, useState } from "react";
import { MessageCircleHeart, X } from "lucide-react";
import { getProfile, saveProfile } from "@/lib/profile";

const GOALS = [
  "Lebih percaya diri berbicara",
  "Situasi di tempat umum",
  "Dunia kerja & wawancara",
  "Kehidupan sehari-hari",
];

export default function OnboardingDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<string>("");

  useEffect(() => {
    if (!getProfile()) setOpen(true);
  }, []);

  if (!open) return null;

  function submit() {
    saveProfile({ name: name.trim() || "Teman", goal: goal || undefined });
    setOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-forest-800/30 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Selamat datang"
    >
      <div className="w-full max-w-md rounded-[2rem] border border-sage-200 bg-white p-8 shadow-lift">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-500 text-white">
            <MessageCircleHeart className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-forest-800">
              Selamat datang
            </h2>
            <p className="text-sm text-ink-soft">Ruang latihan yang aman untukmu.</p>
          </div>
        </div>

        <label
          htmlFor="onboarding-name"
          className="mt-6 block text-sm font-semibold text-ink"
        >
          Siapa nama panggilanmu?{" "}
          <span className="font-normal text-ink-faint">(boleh dikosongkan)</span>
        </label>
        <input
          id="onboarding-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Contoh: Raka"
          className="mt-2 w-full rounded-2xl border border-sage-200 bg-page px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-leaf-400 focus:outline-none"
        />

        <p className="mt-5 text-sm font-semibold text-ink">
          Apa yang ingin kamu latih?
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g === goal ? "" : g)}
              aria-pressed={goal === g}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                goal === g
                  ? "bg-leaf-500 text-white shadow-soft"
                  : "border border-sage-200 bg-white text-ink-soft hover:border-leaf-400"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <button
          onClick={submit}
          className="mt-7 w-full rounded-full bg-leaf-500 px-6 py-3.5 text-sm font-bold text-white shadow-lift transition-all hover:bg-leaf-600"
        >
          Mulai Belajar
        </button>
        <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-faint">
          <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          RuangCakap adalah alat latihan komunikasi — bukan diagnosis medis dan
          bukan pengganti terapi profesional.
        </p>
      </div>
    </div>
  );
}
