"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, CalendarCheck, Flag } from "lucide-react";
import RequireAuth from "@/components/require-auth";
import AppShell from "@/components/app-shell";
import RecommendationBanner from "@/components/recommendation-banner";
import Mascot from "@/components/mascot";
import { getProfile } from "@/lib/profile";
import { getSessions } from "@/lib/storage";
import { sessionAverage } from "@/lib/stats";

function todayKey(iso: string): string {
  return iso.slice(0, 10);
}

export default function BerandaPage() {
  const [loaded, setLoaded] = useState(false);
  const [sessions, setSessions] = useState<ReturnType<typeof getSessions>>([]);
  const profile = getProfile();

  useEffect(() => {
    setSessions(getSessions());
    setLoaded(true);
  }, []);

  const latest = sessions.length > 0 ? sessions[0] : null;
  const latestAvg = latest ? sessionAverage(latest) : null;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = sessions.filter((s) => todayKey(s.finishedAt) === today).length;
  const dailyTarget = 1;
  const dailyDone = Math.min(dailyTarget, todayCount);
  const dailyPct = Math.round((dailyDone / dailyTarget) * 100);

  return (
    <RequireAuth>
      <AppShell>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <Mascot mood="happy" className="h-12 w-12 shrink-0 drop-shadow-md" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-leaf-700">
                  Beranda
                </p>
                <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-forest-800 sm:text-3xl">
                  Hai, {profile?.name ?? "Teman"}!
                </h1>
                <p className="mt-0.5 text-sm text-ink-soft">
                  Satu latihan kecil hari ini sudah luar biasa.
                </p>
              </div>
            </div>
          </div>
          {/* Target harian */}
          <div className="flex items-center gap-3 rounded-2xl border border-sage-200 bg-white px-4 py-3 shadow-soft">
            <span className="relative grid h-11 w-11 place-items-center">
              <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="var(--color-sage-200)"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="var(--color-leaf-500)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(dailyPct / 100) * 97.4} 97.4`}
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-leaf-700">
                {dailyDone}/{dailyTarget}
              </span>
            </span>
            <div>
              <p className="text-xs font-bold text-forest-700">Target harian</p>
              <p className="text-[11px] text-ink-soft">
                {todayCount > 0
                  ? "Tercapai — hebat!"
                  : "1 sesi latihan hari ini"}
              </p>
            </div>
          </div>
        </div>

        {!loaded ? (
          <p className="mt-10 text-sm text-ink-faint">Memuat…</p>
        ) : (
          <>
            {/* Rekomendasi adaptif */}
            <div className="mt-6">
              <RecommendationBanner />
            </div>

            {/* Lanjutkan latihan */}
            <section className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-ink-faint">
                {latest ? "Lanjutkan latihan" : "Mulai dari sini"}
              </h2>
              {latest ? (
                <Link
                  href={`/skenario/${latest.courseId}`}
                  className="mt-3 flex items-center gap-4 rounded-3xl border border-sage-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage-100 text-leaf-600">
                    <BookOpenText className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-forest-700">
                      {latest.courseTitle}
                    </p>
                    <p className="text-xs text-ink-soft">
                      Level {latest.level} ({latest.levelLabel}) ·{" "}
                      {latest.turns.filter((t) => t.role === "user").length}{" "}
                      jawaban
                      {latestAvg !== null && (
                        <span className="ml-1.5 font-bold text-leaf-700">
                          · skor {latestAvg}
                        </span>
                      )}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-leaf-700" />
                </Link>
              ) : (
                <Link
                  href="/latihan"
                  className="mt-3 flex items-center gap-4 rounded-3xl border border-sage-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-leaf-500 text-forest-800">
                    <Flag className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-forest-700">
                      Pilih latihan pertamamu
                    </p>
                    <p className="text-xs text-ink-soft">
                      Belum ada sesi latihan. Yuk mulai dari situasi yang paling
                      dekat dengan keseharian.
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-leaf-700" />
                </Link>
              )}
            </section>

            {/* Jadwal pengulangan lembut */}
            {sessions.some((s) => (s.feedback?.aspects ?? []).length > 0) && (
              <section className="mt-6">
                <h2 className="text-sm font-bold uppercase tracking-wide text-ink-faint">
                  Pengingat lembut
                </h2>
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-mist-200 bg-mist-50/60 px-4 py-3 text-xs leading-relaxed text-ink-soft">
                  <CalendarCheck className="h-5 w-5 shrink-0 text-mist-400" />
                  <p>
                    Aspek yang masih perlu dikuatkan bisa diulang kapan saja —
                    tidak ada paksaan, hanya saran. Cek halaman{" "}
                    <Link href="/progress" className="font-semibold text-mist-600 underline underline-offset-2">
                      Progress
                    </Link>{" "}
                    untuk detailnya.
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </AppShell>
    </RequireAuth>
  );
}
