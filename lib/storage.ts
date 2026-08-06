// ============================================================
// PENYIMPANAN LOKAL (localStorage)
// Sesuai aturan lomba: tidak membangun database sendiri.
// Semua sesi latihan & progress disimpan di browser pengguna.
// Client-side only — jangan dipakai di server.
// ============================================================

import type { FeedbackResult } from "@/lib/ai/feedback";

export type StoredTurn = {
  role: "ai" | "user";
  text: string;
};

export type StoredSession = {
  id: string;
  courseId: string;
  courseTitle: string;
  level: number;
  levelLabel: string;
  startedAt: string;
  finishedAt: string;
  /** true = selesai alami (AI menutup), false = dihentikan pengguna. */
  finished: boolean;
  turns: StoredTurn[];
  /** Hasil evaluasi AI (diisi setelah /api/feedback sukses). */
  feedback?: FeedbackResult | null;
};

const SESSIONS_KEY = "rc_sessions";
const MAX_SESSIONS = 50;

function readSessions(): StoredSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredSession[]) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: StoredSession): void {
  if (typeof window === "undefined") return;
  const sessions = readSessions().filter((s) => s.id !== session.id);
  sessions.unshift(session);
  const trimmed = sessions.slice(0, MAX_SESSIONS);
  try {
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
  } catch {
    /* storage penuh / tidak tersedia — abaikan */
  }
}

export function getSessions(): StoredSession[] {
  return readSessions();
}

export function getSession(id: string): StoredSession | undefined {
  return readSessions().find((s) => s.id === id);
}

export function clearSessions(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SESSIONS_KEY);
  } catch {
    /* abaikan */
  }
}
