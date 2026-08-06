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
    <section className="mx-auto max-w-6xl px-6">
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-sage-200 bg-gradient-to-br from-sage-100 via-white to-mist-50 p-6 shadow-soft">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-leaf-500 text-white shadow-lift">
          <Sparkles className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-leaf-600">
            Rekomendasi adaptif
          </p>
          <h2 className="mt-0.5 text-lg font-bold text-forest-800">
            {rec.courseTitle}{" "}
            <span className="rounded-full bg-white px-2.5 py-0.5 align-middle text-xs font-semibold text-leaf-700">
              Level {rec.level} · {rec.levelLabel}
            </span>
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            {rec.reason}
          </p>
        </div>
        <Link
          href={`/skenario/${rec.courseId}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-leaf-500 px-6 py-3 text-sm font-bold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-leaf-600"
        >
          Mulai
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
