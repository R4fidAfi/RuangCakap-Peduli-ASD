// ============================================================
// STATISTIK PROGRESS
// Menghitung agregat dari semua sesi latihan tersimpan.
// Dipakai halaman Progress dan mesin rekomendasi adaptif.
// ============================================================

import { categoryLabel, courses } from "@/lib/courses";
import type { StoredSession } from "@/lib/storage";

export type CourseProgress = {
  courseId: string;
  courseTitle: string;
  category: string;
  categoryLabel: string;
  sessions: number;
  bestScore: number | null;
  /** Level tertinggi yang pernah diselesaikan (0 = belum pernah). */
  highestLevel: number;
};

export type Stats = {
  totalSessions: number;
  totalAnswers: number;
  overallAvg: number | null;
  byCourse: CourseProgress[];
  byCategory: Array<{
    id: string;
    label: string;
    sessions: number;
    avg: number | null;
  }>;
  aspectAverages: Array<{
    id: string;
    label: string;
    avg: number | null;
    count: number;
  }>;
};

export function sessionAverage(session: StoredSession): number | null {
  const aspects = session.feedback?.aspects;
  if (!aspects || aspects.length === 0) return null;
  const sum = aspects.reduce((acc, a) => acc + a.score, 0);
  return Math.round(sum / aspects.length);
}

export function computeStats(sessions: StoredSession[]): Stats {
  const answers = sessions.reduce(
    (acc, s) => acc + s.turns.filter((t) => t.role === "user").length,
    0,
  );

  const byCourse: CourseProgress[] = courses.map((course) => {
    const related = sessions.filter((s) => s.courseId === course.id);
    const scores = related
      .map((s) => sessionAverage(s))
      .filter((v): v is number => v !== null);
    return {
      courseId: course.id,
      courseTitle: course.title,
      category: course.category,
      categoryLabel: categoryLabel(course.category),
      sessions: related.length,
      bestScore: scores.length > 0 ? Math.max(...scores) : null,
      highestLevel: related.reduce(
        (acc, s) => Math.max(acc, s.level),
        0,
      ),
    };
  });

  const categoryIds = [...new Set(courses.map((c) => c.category))];
  const byCategory = categoryIds.map((id) => {
    const related = sessions.filter((s) => {
      const course = courses.find((c) => c.id === s.courseId);
      return course?.category === id;
    });
    const scores = related
      .map((s) => sessionAverage(s))
      .filter((v): v is number => v !== null);
    return {
      id,
      label: categoryLabel(id),
      sessions: related.length,
      avg:
        scores.length > 0
          ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length))
          : null,
    };
  });

  const aspectMap = new Map<
    string,
    { label: string; total: number; count: number }
  >();
  for (const session of sessions) {
    for (const aspect of session.feedback?.aspects ?? []) {
      const entry = aspectMap.get(aspect.id) ?? {
        label: aspect.label,
        total: 0,
        count: 0,
      };
      entry.total += aspect.score;
      entry.count += 1;
      aspectMap.set(aspect.id, entry);
    }
  }
  const aspectAverages = [...aspectMap.entries()].map(([id, e]) => ({
    id,
    label: e.label,
    avg: Math.round(e.total / e.count),
    count: e.count,
  }));

  const allScores = sessions
    .map((s) => sessionAverage(s))
    .filter((v): v is number => v !== null);

  return {
    totalSessions: sessions.length,
    totalAnswers: answers,
    overallAvg:
      allScores.length > 0
        ? Math.round(
            allScores.reduce((a, b) => a + b, 0) / allScores.length,
          )
        : null,
    byCourse,
    byCategory,
    aspectAverages,
  };
}
