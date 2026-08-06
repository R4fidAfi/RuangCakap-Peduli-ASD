"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Check,
  Flower2,
  Gauge,
  Hash,
  ListChecks,
  Lock,
  Mountain,
  Repeat,
  ShieldCheck,
  Target,
} from "lucide-react";
import { LEVEL_META, type LevelNumber, type ScenarioLevel } from "@/lib/scenarios";
import { getSessions } from "@/lib/storage";
import { sessionAverage } from "@/lib/stats";

const levelIcons: Record<LevelNumber, typeof Flower2> = {
  1: Flower2,
  2: Gauge,
  3: Mountain,
};

export default function LevelPicker({
  courseId,
  courseTitle,
  levels,
}: {
  courseId: string;
  courseTitle: string;
  levels: ScenarioLevel[];
}) {
  const [selected, setSelected] = useState<LevelNumber>(1);
  // Level yang sudah "lolos": sesi selesai, minimal 1 jawaban user,
  // dan skor rata-rata feedback >= 60 (atau feedback belum dibuka).
  const [qualified, setQualified] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const map: Record<number, boolean> = {};
    for (const session of getSessions()) {
      if (session.courseId !== courseId || !session.finished) continue;
      const answers = session.turns.filter((t) => t.role === "user").length;
      if (answers < 1) continue;
      const avg = sessionAverage(session);
      if (avg === null || avg >= 60) {
        map[session.level] = true;
      }
    }
    setQualified(map);
  }, [courseId]);

  const isUnlocked = (level: LevelNumber): boolean =>
    level === 1 || qualified[level - 1] === true;

  const current =
    levels.find((level) => level.level === selected) ?? levels[0];
  const meta = LEVEL_META[current.level];
  const Icon = levelIcons[current.level];
  const displayChallenges =
    current.challenges.length > 0
      ? current.challenges
      : ["Percakapan mengalir sederhana tanpa kejutan."];

  return (
    <section aria-label="Pilih tingkat kesulitan">
      <h2 className="text-2xl font-bold tracking-tight text-forest-800">
        Pilih tingkat kesulitan
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Setiap level mengubah kondisi latihan — bukan mengubah kepribadian AI
        menjadi kasar. Tantangan naik bertahap dan tetap aman untuk diulang.
      </p>

      {/* Level cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {levels.map((level) => {
          const levelMeta = LEVEL_META[level.level];
          const LevelIcon = levelIcons[level.level];
          const active = level.level === selected;
          const locked = !isUnlocked(level.level);
          return (
            <button
              key={level.level}
              type="button"
              onClick={() => {
                if (!locked) setSelected(level.level);
              }}
              disabled={locked}
              aria-pressed={active}
              className={`relative rounded-3xl border p-6 text-left transition-all ${
                locked
                  ? "cursor-not-allowed border-sage-200 bg-sage-100/50 opacity-75"
                  : active
                    ? "border-leaf-500 bg-sage-100 shadow-lift"
                    : "border-sage-200 bg-white shadow-soft hover:-translate-y-0.5 hover:border-leaf-400"
              }`}
            >
              {active && (
                <span className="absolute right-5 top-5 grid h-6 w-6 place-items-center rounded-full bg-leaf-500 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              <span
                className={`grid h-11 w-11 place-items-center rounded-2xl ${
                  locked
                    ? "bg-white/70 text-ink-faint"
                    : active
                      ? "bg-leaf-500 text-white"
                      : "bg-sage-100 text-leaf-600"
                }`}
              >
                <LevelIcon className="h-5.5 w-5.5" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-leaf-500">
                Level {level.level}
              </p>
              <h3 className="mt-1 text-lg font-bold text-forest-700">
                {levelMeta.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {levelMeta.blurb}
              </p>
              {locked ? (
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-ink-faint">
                  <Lock className="h-3.5 w-3.5" />
                  Selesaikan Level {level.level - 1} dulu
                </p>
              ) : (
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-ink-soft">
                  <Hash className="h-3.5 w-3.5" />
                  ±{level.minTurns} giliran percakapan
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Penjelasan aturan naik level */}
      <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-ink-faint">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Level berikutnya terbuka setelah level sebelumnya selesai dengan skor
        rata-rata minimal 60. Skor di bawah itu artinya latihan yang sama
        diulang dulu — itu normal dan bagian dari proses belajar.
      </p>

      {/* Selected level detail */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-3xl border border-sage-200 bg-white p-6 shadow-soft sm:p-7">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-100 text-leaf-600">
              <Icon className="h-5.5 w-5.5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-leaf-500">
                Level {current.level} — {meta.label}
              </p>
              <p className="text-lg font-bold text-forest-700">{courseTitle}</p>
            </div>
          </div>

          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-sage-200 bg-page p-4">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
                <Bot className="h-4 w-4 text-mist-400" /> Peran AI
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-relaxed text-ink">
                {current.aiRole}
              </dd>
            </div>
            <div className="rounded-2xl border border-sage-200 bg-page p-4">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
                <Target className="h-4 w-4 text-leaf-500" /> Tujuan latihan
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink">
                {current.goal}
              </dd>
            </div>
            <div className="rounded-2xl border border-sage-200 bg-page p-4 sm:col-span-2">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
                <ListChecks className="h-4 w-4 text-mist-400" /> Situasi & hal
                yang mungkin terjadi
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink">
                {current.context}
              </dd>
              <ul className="mt-3 space-y-2">
                {displayChallenges.map((challenge) => (
                  <li
                    key={challenge}
                    className="flex items-start gap-2 text-sm text-ink-soft"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-400" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </dl>
        </div>

        {/* Sticky CTA */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-sage-200 bg-white p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-widest text-leaf-500">
              Siap mencoba?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Mulai latihan Level {current.level} ({meta.label}). Percakapan
              berjalan bergantian — AI berbicara, kamu menjawab lewat suara
              atau teks.
            </p>
            <Link
              href={`/latihan/${courseId}?level=${current.level}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf-500 px-6 py-3.5 text-sm font-bold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-leaf-600"
            >
              Mulai Latihan Level {current.level}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <ul className="mt-5 space-y-2.5 text-xs font-medium text-ink-soft">
              <li className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-mist-400" /> Bisa diulang kapan
                saja
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-leaf-500" /> Tanpa penilaian
                yang menghakimi
              </li>
              <li className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-mist-400" /> Mikrofon opsional —
                bisa ketik
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
