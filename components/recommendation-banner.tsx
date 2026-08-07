"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { getSessions } from "@/lib/storage";
import { recommendNext, type Recommendation } from "@/lib/adaptive";

export default function RecommendationBanner() {
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRec(recommendNext(getSessions()));
    setLoaded(true);
  }, []);

  if (!loaded) return null;
  if (!rec) return null;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-3 rounded-3xl border border-sage-200 bg-gradient-to-br from-sage-100 via-white to-mist-50 p-4 shadow-soft sm:flex-row sm:items-center sm:gap-4 sm:p-5">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-leaf-500 text-forest-800 shadow-soft">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-leaf-700">
              Rekomendasi adaptif
            </p>
            <h2 className="mt-0.5 text-sm font-bold text-forest-800 sm:text-base">
              {rec.courseTitle}{" "}
              <span className="rounded-full bg-white px-2 py-0.5 align-middle text-[10px] font-semibold text-leaf-700">
                Level {rec.level} · {rec.levelLabel}
              </span>
            </h2>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">
              {rec.reason}
            </p>
          </div>
        </div>
        <Link
          href={`/skenario/${rec.courseId}`}
          className="inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-full bg-leaf-500 px-5 py-2.5 text-sm font-bold text-forest-800 shadow-lift transition-all hover:-translate-y-0.5 hover:bg-leaf-600 sm:w-auto"
        >
          Mulai
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
