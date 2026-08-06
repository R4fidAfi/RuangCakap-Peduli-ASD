"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BookOpenText,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { getSessions } from "@/lib/storage";
import { computeStats } from "@/lib/stats";
import RecommendationBanner from "@/components/recommendation-banner";

export default function ProgressPage() {
  const [sessions, setSessions] = useState<ReturnType<typeof getSessions> | null>(null);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  if (sessions === null) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm text-ink-faint">Memuat progress…</p>
      </main>
    );
  }

  const stats = computeStats(sessions);

  if (stats.totalSessions === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-leaf-500">
          Progress
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-forest-800">
          Perkembanganmu
        </h1>
        <div className="mt-10 rounded-3xl border border-dashed border-sage-300 bg-white px-6 py-16 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sage-100 text-leaf-500">
            <TrendingUp className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-forest-700">
            Belum ada data progress
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Selesaikan latihan pertamamu — progress, skor, dan rekomendasi
            adaptif akan muncul di sini.
          </p>
          <Link
            href="/#latihan"
            className="mt-6 inline-flex rounded-full bg-leaf-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-600"
          >
            Pilih Latihan Pertama
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs font-bold uppercase tracking-widest text-leaf-500">
        Progress
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-forest-800">
        Perkembanganmu
      </h1>

      {/* Rekomendasi adaptif */}
      <div className="mt-8">
        <RecommendationBanner />
      </div>

      {/* Ringkasan */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: BookOpenText,
            label: "Latihan selesai",
            value: String(stats.totalSessions),
          },
          {
            icon: MessageCircle,
            label: "Jawaban diberikan",
            value: String(stats.totalAnswers),
          },
          {
            icon: Award,
            label: "Rata-rata skor",
            value: stats.overallAvg !== null ? String(stats.overallAvg) : "—",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-sage-200 bg-white p-5 shadow-soft"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-100 text-leaf-600">
              <item.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-bold text-forest-800">
              {item.value}
            </p>
            <p className="text-xs font-semibold text-ink-soft">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Per aspek */}
      {stats.aspectAverages.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight text-forest-800">
            Skor per aspek komunikasi
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {stats.aspectAverages.map((aspect) => (
              <div
                key={aspect.id}
                className="rounded-2xl border border-sage-200 bg-white p-4 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink">
                    {aspect.label}
                  </p>
                  <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-bold text-leaf-700">
                    {aspect.avg}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-sage-200">
                  <div
                    className="h-full rounded-full bg-leaf-500 transition-all duration-700"
                    style={{ width: `${aspect.avg}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-ink-faint">
                  dari {aspect.count} latihan
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Per kategori */}
      <section className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-forest-800">
          Per kategori
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.byCategory.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-sage-200 bg-white p-4 shadow-soft"
            >
              <p className="text-sm font-bold text-forest-700">
                {category.label}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {category.sessions} latihan
                {category.avg !== null && (
                  <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 font-bold text-leaf-700">
                    skor {category.avg}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Per skenario */}
      <section className="mt-10">
        <h2 className="text-lg font-bold tracking-tight text-forest-800">
          Per skenario
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stats.byCourse.map((course) => (
            <Link
              key={course.courseId}
              href={`/skenario/${course.courseId}`}
              className="group rounded-2xl border border-sage-200 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-forest-700">
                  {course.courseTitle}
                </p>
                <ArrowUpRight className="h-4 w-4 text-leaf-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-2 flex items-center gap-1" aria-label={`Level tercapai: ${course.highestLevel} dari 3`}>
                {[1, 2, 3].map((lvl) => (
                  <span
                    key={lvl}
                    className={`h-2 w-2 rounded-full ${
                      lvl <= course.highestLevel
                        ? "bg-leaf-500"
                        : "bg-sage-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-[11px] text-ink-faint">
                  {course.highestLevel > 0
                    ? `Level ${course.highestLevel} tercapai`
                    : "Belum dicoba"}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-ink-soft">
                {course.sessions} latihan
                {course.bestScore !== null && (
                  <span className="ml-1.5 font-bold text-leaf-700">
                    · terbaik {course.bestScore}
                  </span>
                )}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
