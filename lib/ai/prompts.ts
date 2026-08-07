// ============================================================
// PROMPT BUILDER
// Semua prompt sistem dibangun dari data skenario + level yang
// sudah dikunci di lib/scenarios.ts — jadi setiap percakapan AI
// otomatis disesuaikan dengan kategori latihan yang dipilih.
// ============================================================

import { categoryLabel, getCourse } from "@/lib/courses";
import { getScenarioLevels, LEVEL_META, type LevelNumber } from "@/lib/scenarios";
import type { ApiMessage, ChatTurn } from "./types";

/** Batas giliran riwayat yang dikirim ke AI (mencegah prompt membengkak). */
const MAX_HISTORY_TURNS = 40;
/** Batas panjang satu pesan pengguna. */
const MAX_TURN_LENGTH = 2000;

export class ScenarioNotFoundError extends Error {
  constructor(courseId: string) {
    super(`Skenario tidak ditemukan: ${courseId}`);
    this.name = "ScenarioNotFoundError";
  }
}

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}

/** Bangun system prompt sesuai skenario + level (kategori otomatis terisi). */
export function buildScenarioSystemPrompt(
  courseId: string,
  level: LevelNumber,
): string {
  const course = getCourse(courseId);
  const levels = getScenarioLevels(courseId);
  const levelData = levels?.find((l) => l.level === level);
  if (!course || !levelData) throw new ScenarioNotFoundError(courseId);

  const meta = LEVEL_META[level];
  const challenges =
    levelData.challenges.length > 0
      ? levelData.challenges
      : ["Tidak ada komplikasi khusus — percakapan mengalir sederhana."];

  return [
    `Kamu adalah Wahyu, maskot ramah dari RuangCakap. Dalam latihan komunikasi sosial untuk remaja dan dewasa penyandang autisme (ASD), kamu MEMERANKAN ${levelData.aiRole}.`,
    ``,
    `SKENARIO: ${course.title} (kategori: ${categoryLabel(course.category)})`,
    `SITUASI: ${levelData.context}`,
    `TUJUAN PENGGUNA: ${levelData.goal}`,
    `TINGKAT: Level ${level} — ${meta.label}. ${meta.blurb}`,
    `KONDISI YANG BOLEH MUNCUL:`,
    ...challenges.map((c) => `- ${c}`),
    ``,
    `ATURAN BERMAIN:`,
    `1. Bicaralah sebagai karakter yang kamu perankan dalam bahasa Indonesia sehari-hari yang sopan, alami, dan hangat. Sebagai Wahyu, kamu tetap ramah dan menenangkan di segala peran.`,
    `2. Mulai percakapan dengan sapaan pembuka yang sesuai situasi, lalu satu pertanyaan pembuka.`,
    `3. Setiap giliran maksimal 2 kalimat pendek, dan hanya satu pertanyaan per giliran.`,
    `4. Tulis HANYA ucapan karaktermu sendiri. DILARANG menulis ucapan pengguna, DILARANG menulis label peran seperti "Kasir:" atau "Dokter:", dan DILARANG menulis tanda kutip. Langsung tulis kalimatmu.`,
    `5. JANGAN menutup percakapan di awal. Tutup secara alami HANYA jika pengguna sudah berpamitan atau mengucapkan terima kasih di akhir; setelah menutup, akhiri pesanmu dengan [SELESAI].`,
    `6. Gunakan kalimat sederhana dan jelas. Hindari idiom, sarkasme, atau kata-kata yang membingungkan.`,
    `7. Patuhi kondisi tingkat di atas: di Level 1 jangan menambah komplikasi; di Level 2-3 terapkan komplikasi secara wajar dan beri kesempatan pengguna merespons.`,
    `8. Jika jawaban pengguna kurang relevan atau terlalu singkat, bantu dengan ramah (beri contoh kalimat singkat) lalu lanjutkan percakapan.`,
    `9. Jangan pernah menghakimi, mengejek, atau membuat pengguna merasa gagal. Selalu suportif.`,
    `10. Jangan keluar dari skenario dan jangan membahas topik di luar situasi ini.`,
  ].join("\n");
}

/** Validasi dan bersihkan riwayat dari klien. */
function sanitizeHistory(history: unknown): ChatTurn[] {
  if (!Array.isArray(history)) return [];
  const clean: ChatTurn[] = [];
  for (const turn of history) {
    if (typeof turn !== "object" || turn === null) continue;
    const t = turn as Record<string, unknown>;
    const role = t.role;
    const text = typeof t.text === "string" ? t.text.trim() : "";
    if ((role === "ai" || role === "user") && text.length > 0) {
      clean.push({ role, text: text.slice(0, MAX_TURN_LENGTH) });
    }
    if (clean.length >= MAX_HISTORY_TURNS) break;
  }
  return clean;
}

/** Bangun daftar pesan lengkap untuk API chat completions. */
export function buildChatMessages(input: {
  courseId: string;
  level: LevelNumber;
  history?: unknown;
}): ApiMessage[] {
  const messages: ApiMessage[] = [
    { role: "system", content: buildScenarioSystemPrompt(input.courseId, input.level) },
  ];
  const history = sanitizeHistory(input.history);
  for (const turn of history) {
    messages.push({
      role: turn.role === "ai" ? "assistant" : "user",
      content: turn.text,
    });
  }
  return messages;
}
