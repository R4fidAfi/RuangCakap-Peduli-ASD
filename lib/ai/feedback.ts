// ============================================================
// EVALUASI FEEDBACK AI
// Setelah latihan selesai, AI menilai 6 aspek komunikasi dengan
// nada suportif (tanpa menghakimi), lalu menghasilkan apresiasi,
// saran, dan contoh kalimat yang lebih tepat.
// ============================================================

import { categoryLabel, getCourse } from "@/lib/courses";
import { getScenarioLevels, LEVEL_META, type LevelNumber } from "@/lib/scenarios";
import type { ApiMessage, ChatTurn } from "./types";

export type FeedbackAspect = {
  id: string;
  label: string;
  score: number;
  note: string;
};

export type FeedbackResult = {
  summary: string;
  aspects: FeedbackAspect[];
  strengths: string[];
  suggestions: string[];
  exampleResponses: string[];
};

export const FEEDBACK_ASPECTS: Array<{ id: string; label: string }> = [
  { id: "relevansi", label: "Kesesuaian jawaban" },
  { id: "kejelasan", label: "Kejelasan isi jawaban" },
  { id: "kesopanan", label: "Kesopanan" },
  { id: "pembuka", label: "Membuka percakapan" },
  { id: "penutup", label: "Menutup percakapan" },
  { id: "klarifikasi", label: "Berani bertanya / klarifikasi" },
];

export class ScenarioNotFoundError extends Error {
  constructor(courseId: string) {
    super(`Skenario tidak ditemukan: ${courseId}`);
    this.name = "ScenarioNotFoundError";
  }
}

/** Bangun pesan evaluasi: system prompt + transkrip latihan. */
export function buildFeedbackMessages(input: {
  courseId: string;
  level: LevelNumber;
  turns: ChatTurn[];
}): ApiMessage[] {
  const course = getCourse(input.courseId);
  const levels = getScenarioLevels(input.courseId);
  const levelData = levels?.find((l) => l.level === input.level);
  if (!course || !levelData) throw new ScenarioNotFoundError(input.courseId);

  const meta = LEVEL_META[input.level];
  const transcript =
    input.turns.length === 0
      ? "(Tidak ada giliran percakapan yang tercatat.)"
      : input.turns
          .map((turn) => `${turn.role === "ai" ? "AI" : "Pengguna"}: ${turn.text}`)
          .join("\n");

  const aspectLines = FEEDBACK_ASPECTS.map(
    (a) => `${a.id} — ${a.label}`,
  ).join("\n");

  const system = [
    `Kamu adalah Wahyu, maskot RuangCakap yang bertindak sebagai pelatih komunikasi sosial yang suportif untuk remaja dan dewasa penyandang autisme (ASD). Tugasmu mengevaluasi latihan percakapan sosial yang baru saja dilakukan.`,
    ``,
    `SKENARIO LATIHAN: ${course.title} (kategori: ${categoryLabel(course.category)}), Level ${input.level} — ${meta.label}`,
    `TUJUAN LATIHAN: ${levelData.goal}`,
    `TRANSCRIPT LATIHAN:`,
    transcript,
    ``,
    `TUGAS:`,
    `Berikan evaluasi dalam bahasa Indonesia dengan nada SANGAT suportif dan tanpa menghakimi. Jangan pernah menyalahkan pengguna. Fokus pada hal yang sudah baik dan satu hal yang bisa dicoba berikutnya.`,
    `Nilai 6 aspek berikut dengan skor 0-100:`,
    aspectLines,
    ``,
    `CATATAN:`,
    `- Aspek yang tidak sempat muncul (misalnya tidak ada giliran penutup) beri skor netral 70 dengan catatan "Tidak terlihat pada latihan ini — tidak apa-apa.".`,
    `- Jangan menilai kontak mata, gestur, atau nada bicara karena tidak terlihat dari teks.`,
    `- Skor bukan vonis: selalu sertakan catatan yang membangun.`,
    ``,
    `Jawab HANYA dengan JSON valid tanpa teks lain, format:`,
    `{`,
    `  "summary": "ringkasan 2-3 kalimat",`,
    `  "aspects": [`,
    `    {"id":"relevansi","score":85,"note":"..."},`,
    `    {"id":"kejelasan","score":70,"note":"..."},`,
    `    {"id":"kesopanan","score":90,"note":"..."},`,
    `    {"id":"pembuka","score":75,"note":"..."},`,
    `    {"id":"penutup","score":70,"note":"..."},`,
    `    {"id":"klarifikasi","score":65,"note":"..."}`,
    `  ],`,
    `  "strengths": ["2-3 kalimat apresiasi"],`,
    `  "suggestions": ["1-2 saran konkret"],`,
    `  "exampleResponses": ["1-2 contoh kalimat yang lebih tepat"]`,
    `}`,
  ].join("\n");

  return [
    { role: "system", content: system },
    { role: "user", content: "Silakan evaluasi latihan di atas." },
  ];
}

/** Ambil JSON dari respons model dengan toleransi (fence markdown, teks lain). */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("JSON tidak ditemukan dalam respons AI.");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

const fallbackNote = "Tidak terlihat pada latihan ini — tidak apa-apa.";

/** Parsing respons AI menjadi FeedbackResult yang aman. */
export function parseFeedbackResponse(raw: string): FeedbackResult {
  const data = extractJson(raw) as {
    summary?: unknown;
    aspects?: unknown;
    strengths?: unknown;
    suggestions?: unknown;
    exampleResponses?: unknown;
  };

  const asStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const aspects: FeedbackAspect[] = FEEDBACK_ASPECTS.map((meta) => {
    const rawAspect = Array.isArray(data.aspects)
      ? (data.aspects as Array<Record<string, unknown>>).find(
          (a) => a?.id === meta.id,
        )
      : undefined;
    let score = typeof rawAspect?.score === "number" ? rawAspect.score : 70;
    if (!Number.isFinite(score)) score = 70;
    score = Math.max(0, Math.min(100, Math.round(score)));
    const note =
      typeof rawAspect?.note === "string" && rawAspect.note.trim().length > 0
        ? rawAspect.note.trim()
        : fallbackNote;
    return { id: meta.id, label: meta.label, score, note };
  });

  return {
    summary:
      typeof data.summary === "string" && data.summary.trim().length > 0
        ? data.summary.trim()
        : "Latihan selesai — terus berlatih sedikit demi sedikit, ya.",
    aspects,
    strengths: asStringArray(data.strengths),
    suggestions: asStringArray(data.suggestions),
    exampleResponses: asStringArray(data.exampleResponses),
  };
}
