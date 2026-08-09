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
  /** "ai" = evaluasi AI; "fallback" = evaluasi otomatis (AI gagal). */
  source?: "ai" | "fallback";
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

// ============================================================
// FALLBACK EVALUATOR (deterministik)
// Dipakai bila API AI tidak tersedia/gagal — evaluasi TETAP
// muncul dengan 6 aspek yang sama, dinilai dari perilaku
// percakapan nyata pengguna (kata kunci & struktur giliran).
// ============================================================

const OPENING_WORDS = [
  "halo", "hai", "assalamu", "selamat", "permisi", "pagi", "siang",
  "sore", "malam", "hallo", "hy", "hi", "halo pak", "halo bu",
];
const CLOSING_WORDS = [
  "terima kasih", "makasih", "thanks", "sampai jumpa", "sampai ketemu",
  "dadah", "dah", "bye", "selamat tinggal", "duluan", "permisi dulu",
  "sampai bertemu", "goodbye",
];
const POLITE_WORDS = [
  "terima kasih", "makasih", "thanks", "tolong", "permisi", "maaf",
  "mohon", "pak", "bu", "kak", "mbak", "mas", "silakan", "silahkan",
  "minta tolong",
];
const QUESTION_WORDS = [
  "apa", "siapa", "kapan", "di mana", "ke mana", "dari mana", "bagaimana",
  "berapa", "apakah", "bisa", "boleh", "berapakah", "yang mana", "kenapa",
  "mengapa",
];

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Bangun evaluasi otomatis (fallback) dari transkrip percakapan. */
export function buildFallbackFeedback(input: {
  courseId: string;
  level: LevelNumber;
  turns: ChatTurn[];
}): FeedbackResult {
  const course = getCourse(input.courseId);
  const userTurns = input.turns.filter((t) => t.role === "user");
  const texts = userTurns.map((t) => t.text.toLowerCase());

  const avgWords = (() => {
    if (userTurns.length === 0) return 0;
    const total = userTurns.reduce((sum, t) => sum + t.text.trim().split(/\s+/).length, 0);
    return total / userTurns.length;
  })();

  const hasOpening = texts.some((t) => OPENING_WORDS.some((w) => t.includes(w)));
  const openingFirst =
    userTurns.length > 0 &&
    OPENING_WORDS.some((w) => texts[0].includes(w));
  const hasClosing = texts.some((t) => CLOSING_WORDS.some((w) => t.includes(w)));
  const hasPolite = texts.some((t) => POLITE_WORDS.some((w) => t.includes(w)));
  const questionCount = texts.reduce(
    (sum, t) =>
      sum +
      (t.includes("?") ? 1 : 0) +
      QUESTION_WORDS.filter((w) => t.includes(w)).length,
    0,
  );
  const hasClarification = questionCount > 0;

  const score = (id: string): number => {
    switch (id) {
      case "relevansi": {
        let s = 70;
        if (avgWords >= 8) s += 15;
        else if (avgWords >= 5) s += 10;
        else if (avgWords >= 3) s += 5;
        else if (avgWords > 0 && avgWords < 3) s -= 10;
        return clamp(s);
      }
      case "kejelasan": {
        let s = 70;
        if (avgWords >= 10) s += 15;
        else if (avgWords >= 6) s += 10;
        else if (avgWords >= 4) s += 5;
        else if (avgWords > 0 && avgWords < 4) s -= 10;
        return clamp(s);
      }
      case "kesopanan": {
        let s = 60;
        if (hasPolite) s += 25;
        if (hasClosing) s += 10;
        if (hasOpening) s += 5;
        return clamp(s);
      }
      case "pembuka": {
        let s = 45;
        if (openingFirst) s += 45;
        else if (hasOpening) s += 30;
        return clamp(s);
      }
      case "penutup": {
        let s = 45;
        if (hasClosing) s += 45;
        return clamp(s);
      }
      case "klarifikasi": {
        let s = 45;
        if (hasClarification) s += 30;
        if (questionCount >= 2) s += 15;
        return clamp(s);
      }
      default:
        return 70;
    }
  };

  const aspects: FeedbackAspect[] = FEEDBACK_ASPECTS.map((meta) => {
    const s = score(meta.id);
    let note: string;
    if (s >= 85) note = `${meta.label} sudah sangat baik — pertahankan!`;
    else if (s >= 70) note = `${meta.label} sudah cukup baik, tinggal diasah lagi.`;
    else if (s >= 55) note = `${meta.label} mulai terlihat — coba lebih sering lagi.`;
    else note = `${meta.label} bisa ditingkatkan dengan sedikit latihan lagi.`;
    return { id: meta.id, label: meta.label, score: s, note };
  });

  const best = [...aspects].sort((a, b) => b.score - a.score);
  const worst = [...aspects].sort((a, b) => a.score - b.score);
  const strengths = best
    .filter((a) => a.score >= 70)
    .slice(0, 2)
    .map((a) => `Kamu sudah menunjukkan ${a.label.toLowerCase()} dengan cukup baik.`);
  if (strengths.length === 0 && userTurns.length > 0) {
    strengths.push("Kamu sudah berani mencoba berbicara — itu langkah pertama yang penting.");
  }
  const suggestions = worst
    .filter((a) => a.score < 70)
    .slice(0, 2)
    .map((a) =>
      a.id === "pembuka"
        ? "Coba mulai percakapan dengan sapaan seperti \"Halo\" atau \"Permisi\"."
        : a.id === "penutup"
          ? "Coba akhiri percakapan dengan \"Terima kasih\" atau \"Sampai jumpa\"."
          : a.id === "klarifikasi"
            ? "Jangan ragu bertanya dengan kata tanya seperti \"Berapa...?\" atau \"Bisa...?\"."
            : `Latihan kecil untuk ${a.label.toLowerCase()}: jawab dengan kalimat utuh.`,
    );

  const exampleResponses = [
    "Halo, permisi. Saya mau bertanya.",
    "Terima kasih banyak atas bantuannya.",
    "Maaf, bisa diulang? Saya belum terlalu paham.",
  ];

  const avgScore = Math.round(
    aspects.reduce((sum, a) => sum + a.score, 0) / aspects.length,
  );
  const title = course ? course.title : "latihan ini";
  const summary =
    userTurns.length === 0
      ? `Latihan "${title}" belum ada jawaban yang tercatat. Tidak apa-apa — coba lagi, satu kalimat kecil sudah bagus.`
      : avgScore >= 80
        ? `Latihan "${title}" berjalan dengan baik! Kamu sudah membangun percakapan dengan cukup percaya diri.`
        : avgScore >= 60
          ? `Latihan "${title}" sudah berjalan. Kamu berani mencoba — dengan sedikit latihan tambahan, pasti makin lancar.`
          : `Latihan "${title}" adalah langkah awal yang baik. Semakin sering berlatih, semakin nyaman kamu berbicara.`;

  return {
    summary,
    aspects,
    strengths,
    suggestions,
    exampleResponses,
    source: "fallback",
  };
}
