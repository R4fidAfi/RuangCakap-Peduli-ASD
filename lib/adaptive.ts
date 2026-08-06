// ============================================================
// MESIN REKOMENDASI ADAPTIF
// Menentukan latihan berikutnya berdasarkan riwayat + hasil
// evaluasi AI (skor 6 aspek). Logika transparan & bisa
// dijelaskan — tanpa panggilan AI tambahan (hemat & andal).
// ============================================================

import { courses, getCourse } from "@/lib/courses";
import { LEVEL_META } from "@/lib/scenarios";
import { sessionAverage } from "@/lib/stats";
import type { StoredSession } from "@/lib/storage";

export type Recommendation = {
  courseId: string;
  courseTitle: string;
  level: number;
  levelLabel: string;
  reason: string;
  kind: "start" | "repeat" | "next-level" | "related" | "fallback";
};

/** Pemetaan aspek terlemah -> skenario yang paling cocok melatihnya. */
const ASPECT_HINTS: Record<string, string[]> = {
  pembuka: ["kenalan-baru", "sapa-tetangga", "bicara-di-rapat"],
  penutup: ["sapa-tetangga", "buat-janji-temu", "kenalan-baru"],
  klarifikasi: ["bicara-dokter", "retur-barang", "bertanya-arah", "bicara-di-rapat"],
  relevansi: [],
  kejelasan: [],
  kesopanan: [],
};

function weakestAspect(
  sessions: StoredSession[],
): { id: string; label: string } | null {
  const totals = new Map<string, { label: string; total: number; count: number }>();
  for (const session of sessions) {
    for (const aspect of session.feedback?.aspects ?? []) {
      const entry = totals.get(aspect.id) ?? {
        label: aspect.label,
        total: 0,
        count: 0,
      };
      entry.total += aspect.score;
      entry.count += 1;
      totals.set(aspect.id, entry);
    }
  }
  let weakest: { id: string; label: string } | null = null;
  let lowest = Infinity;
  for (const [id, entry] of totals) {
    if (entry.count === 0) continue;
    const avg = entry.total / entry.count;
    if (avg < lowest) {
      lowest = avg;
      weakest = { id, label: entry.label };
    }
  }
  return weakest;
}

function levelLabel(level: number): string {
  const safe: 1 | 2 | 3 =
    level === 1 || level === 2 || level === 3 ? level : 1;
  return LEVEL_META[safe].label;
}

export function recommendNext(sessions: StoredSession[]): Recommendation | null {
  if (sessions.length === 0) {
    const first = courses[0];
    return {
      courseId: first.id,
      courseTitle: first.title,
      level: 1,
      levelLabel: "Tenang",
      reason:
        "Belum ada latihan tercatat. Mulai dari situasi yang paling dekat dengan keseharian: memesan makanan.",
      kind: "start",
    };
  }

  const latest = sessions[0];
  const latestScore = sessionAverage(latest);

  // 1) Skor rendah -> ulangi latihan yang sama dulu.
  if (latestScore !== null && latestScore < 60) {
    return {
      courseId: latest.courseId,
      courseTitle: latest.courseTitle,
      level: latest.level,
      levelLabel: levelLabel(latest.level),
      reason: `Skor latihan terakhir ${latestScore}. Tidak apa-apa — ulangi sekali lagi untuk menguatkan, pelan-pelan pasti naik.`,
      kind: "repeat",
    };
  }

  // 2) Skor bagus & masih ada level di atas -> naik level.
  if (latestScore !== null && latestScore >= 80 && latest.level < 3) {
    return {
      courseId: latest.courseId,
      courseTitle: latest.courseTitle,
      level: latest.level + 1,
      levelLabel: levelLabel(latest.level + 1),
      reason: `Latihan terakhir bagus (skor ${latestScore}). Saatnya mencoba Level ${latest.level + 1} (${levelLabel(latest.level + 1)}) dari skenario yang sama.`,
      kind: "next-level",
    };
  }

  // 3) Aspek terlemah -> skenario yang melatih aspek itu.
  const weakest = weakestAspect(sessions);
  if (weakest) {
    const hints = ASPECT_HINTS[weakest.id] ?? [];
    const notTried = hints.find(
      (id) => !sessions.some((s) => s.courseId === id),
    );
    if (notTried) {
      const course = getCourse(notTried);
      if (course) {
        return {
          courseId: course.id,
          courseTitle: course.title,
          level: 1,
          levelLabel: "Tenang",
          reason: `Aspek terlemahmu saat ini: ${weakest.label}. Skenario ini paling cocok untuk melatihnya.`,
          kind: "related",
        };
      }
    }
    // Sudah pernah dicoba semua -> yang paling jarang.
    const leastDone = hints
      .map((id) => ({ id, count: sessions.filter((s) => s.courseId === id).length }))
      .sort((a, b) => a.count - b.count)[0];
    const course = leastDone ? getCourse(leastDone.id) : null;
    if (course) {
      return {
        courseId: course.id,
        courseTitle: course.title,
        level: 1,
        levelLabel: "Tenang",
        reason: `Latih ${weakest.label} lebih sering — coba ${course.title} lagi dengan tenang.`,
        kind: "related",
      };
    }
  }

  // 4) Fallback: skenario yang belum pernah atau paling jarang dicoba.
  const counts = new Map<string, number>();
  for (const session of sessions) {
    counts.set(session.courseId, (counts.get(session.courseId) ?? 0) + 1);
  }
  const untouched = courses.find((c) => !counts.has(c.id));
  if (untouched) {
    return {
      courseId: untouched.id,
      courseTitle: untouched.title,
      level: 1,
      levelLabel: "Tenang",
      reason: "Jelajahi skenario baru untuk memperluas pengalaman latihanmu.",
      kind: "fallback",
    };
  }
  const leastPracticed = [...counts.entries()].sort((a, b) => a[1] - b[1])[0];
  const course = leastPracticed ? getCourse(leastPracticed[0]) : null;
  if (course) {
    return {
      courseId: course.id,
      courseTitle: course.title,
      level: 1,
      levelLabel: "Tenang",
      reason: "Skenario ini paling jarang kamu latih — coba sekali lagi ya.",
      kind: "fallback",
    };
  }

  return null;
}
