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
  Star,
  Target,
} from "lucide-react";
import { LEVEL_META, type LevelNumber, type ScenarioLevel } from "@/lib/scenarios";
import { getSessions } from "@/lib/storage";
import { sessionAverage } from "@/lib/stats";

/** Gaya per level — makin tinggi, makin "berani" warnanya. */
const levelStyle: Record<
  LevelNumber,
  { tile: string; tileText: string; icon: typeof Flower2 }
> = {
  1: { tile: "from-leaf-400 to-leaf-600", tileText: "text-forest-800", icon: Flower2 },
  2: { tile: "from-mist-400 to-mist-600", tileText: "text-white", icon: Gauge },
  3: { tile: "from-sun-400 to-leaf-600", tileText: "text-forest-800", icon: Mountain },
};

function starsFor(score: number | null): number {
  if (score === null) return 0;
  if (score >= 85) return 3;
  if (score >= 75) return 2;
  if (score >= 60) return 1;
  return 0;
}

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
  // Skor terbaik per level (untuk bintang & label "Terbaik").
  const [bestScore, setBestScore] = useState<Record<number, number | null>>({});

  useEffect(() => {
    const q: Record<number, boolean> = {};
    const best: Record<number, number | null> = {};
    for (const session of getSessions()) {
      if (session.courseId !== courseId || !session.finished) continue;
      const answers = session.turns.filter((t) => t.role === "user").length;
      if (answers < 1) continue;
      const avg = sessionAverage(session);
      if (avg === null || avg >= 60) {
        q[session.level] = true;
      }
      if (avg !== null) {
        best[session.level] = Math.max(best[session.level] ?? 0, avg);
      }
    }
    setQualified(q);
    setBestScore(best);
  }, [courseId]);

  const isUnlocked = (level: LevelNumber): boolean =>
    level === 1 || qualified[level - 1] === true;

  const current = levels.find((level) => level.level === selected) ?? levels[0];
  const meta = LEVEL_META[current.level];
  const displayChallenges =
    current.challenges.length > 0
      ? current.challenges
      : ["Percakapan mengalir sederhana tanpa kejutan."];

  return (
    <section aria-label="Pilih tingkat kesulitan" className="pb-24 lg:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-forest-800">
            Pilih tingkat kesulitan
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Tantangan naik bertahap — tetap aman dan bisa diulang kapan saja.
          </p>
        </div>
      </div>

      {/* Level select ala game */}
      <div className="mt-5 space-y-3">
        {levels.map((level) => {
          const style = levelStyle[level.level];
          const active = level.level === selected;
          const locked = !isUnlocked(level.level);
          const best = bestScore[level.level] ?? null;
          const stars = starsFor(best);
          const completed = best !== null && best >= 60;
          return (
            <button
              key={level.level}
              type="button"
              onClick={() => {
                if (!locked) setSelected(level.level);
              }}
              disabled={locked}
              aria-pressed={active}
              className={`relative flex w-full items-center gap-3.5 rounded-2xl border p-3.5 pr-4 text-left transition-all sm:gap-4 ${
                locked
                  ? "cursor-not-allowed border-sage-200 bg-sage-100/50 opacity-70"
                  : active
                    ? "border-leaf-500 bg-white shadow-lift ring-2 ring-leaf-500/20"
                    : "border-sage-200 bg-white shadow-soft hover:-translate-y-0.5 hover:border-leaf-400 hover:shadow-lift"
              }`}
            >
              {/* Tile nomor level */}
              <span
                className={`relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br shadow-soft ${style.tile} ${locked ? "opacity-60 saturate-0" : ""}`}
              >
                <span className={`text-2xl font-extrabold leading-none ${style.tileText}`}>
                  {level.level}
                </span>
                {completed && (
                  <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-forest-700 text-white shadow-soft">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                )}
              </span>

              {/* Info level */}
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-leaf-700">
                    Level {level.level}
                  </span>
                  {stars > 0 && (
                    <span
                      className="flex items-center gap-0.5"
                      aria-label={`Bintang ${stars} dari 3`}
                    >
                      {[0, 1, 2].map((i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < stars
                              ? "fill-sun-400 text-sun-400"
                              : "text-sage-300"
                          }`}
                        />
                      ))}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-sm font-bold text-forest-700">
                  {LEVEL_META[level.level].label}
                </span>
                <span className="mt-0.5 block truncate text-xs text-ink-soft">
                  {LEVEL_META[level.level].blurb}
                </span>
                <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {locked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-ink-faint">
                      <Lock className="h-3 w-3" />
                      Selesaikan Level {level.level - 1} dulu
                    </span>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-leaf-700">
                        <Hash className="h-3 w-3" />
                        ±{level.minTurns} giliran
                      </span>
                      {best !== null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-leaf-700">
                          Terbaik {best}
                        </span>
                      )}
                    </>
                  )}
                </span>
              </span>

              {/* Aksi kanan */}
              {locked ? (
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-ink-faint">
                  <Lock className="h-4 w-4" />
                </span>
              ) : (
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
                    active
                      ? "bg-leaf-500 text-forest-800"
                      : "bg-sage-100 text-leaf-700 group-hover:bg-leaf-500 group-hover:text-forest-800"
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Aturan naik level */}
      <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-ink-faint">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Level berikutnya terbuka setelah level sebelumnya selesai dengan skor
        minimal 60 — skor di bawah itu artinya diulang dulu, dan itu normal.
      </p>

      {/* Detail level terpilih */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-3xl border border-sage-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-3">
            <span
              className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br shadow-soft ${levelStyle[current.level].tile} ${levelStyle[current.level].tileText}`}
            >
              {(() => {
                const Icon = levelStyle[current.level].icon;
                return <Icon className="h-5.5 w-5.5" />;
              })()}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-leaf-700">
                Level {current.level} — {meta.label}
              </p>
              <p className="text-lg font-bold text-forest-700">{courseTitle}</p>
            </div>
          </div>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sage-200 bg-page p-4">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
                <Bot className="h-4 w-4 text-mist-400" /> Peran AI · Wahyu
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-relaxed text-ink">
                {current.aiRole}
              </dd>
            </div>
            <div className="rounded-2xl border border-sage-200 bg-page p-4">
              <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
                <Target className="h-4 w-4 text-leaf-700" /> Tujuan latihan
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
            <p className="text-xs font-bold uppercase tracking-widest text-leaf-700">
              Siap mencoba?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Mulai latihan Level {current.level} ({meta.label}). Percakapan
              berjalan bergantian — AI berbicara, kamu menjawab lewat suara
              atau teks.
            </p>
            <Link
              href={`/latihan/${courseId}?level=${current.level}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf-500 px-6 py-3.5 text-sm font-bold text-forest-800 shadow-lift transition-all hover:-translate-y-0.5 hover:bg-leaf-600"
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
                <ShieldCheck className="h-4 w-4 text-leaf-700" /> Tanpa penilaian
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

      {/* CTA bawah sticky — selalu dalam jangkauan jempol di HP */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link
          href={`/latihan/${courseId}?level=${selected}`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-leaf-500 px-6 py-3.5 text-sm font-bold text-forest-800 shadow-lift transition-colors hover:bg-leaf-600"
        >
          Mulai Latihan Level {selected}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
