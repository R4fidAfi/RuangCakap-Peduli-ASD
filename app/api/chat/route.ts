import { NextRequest } from "next/server";
import { buildChatMessages } from "@/lib/ai/prompts";
import { isAiConfigured, streamChatCompletion } from "@/lib/ai/client";
import type { LevelNumber } from "@/lib/scenarios";

function jsonError(message: string, status: number, error: string) {
  return Response.json({ error, message }, { status });
}

/**
 * POST /api/chat
 * Body: { courseId: string, level: 1|2|3, history?: ChatTurn[] }
 * Response: aliran teks dari AI (peran sesuai skenario & level).
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Body harus berupa JSON.", 400, "INVALID_JSON");
  }

  const { courseId, level, history } = (body ?? {}) as {
    courseId?: unknown;
    level?: unknown;
    history?: unknown;
  };

  if (typeof courseId !== "string" || courseId.trim() === "") {
    return jsonError("Parameter courseId wajib diisi.", 400, "COURSE_REQUIRED");
  }

  const levelNum = Number(level);
  if (![1, 2, 3].includes(levelNum)) {
    return jsonError("Parameter level harus 1, 2, atau 3.", 400, "LEVEL_INVALID");
  }

  let messages;
  try {
    messages = buildChatMessages({
      courseId: courseId.trim(),
      level: levelNum as LevelNumber,
      history,
    });
  } catch {
    return jsonError("Skenario tidak ditemukan.", 404, "SCENARIO_NOT_FOUND");
  }

  return streamChatCompletion({
    messages,
    temperature: 0.7,
    maxTokens: 300,
  });
}

// GET: cek status konfigurasi AI (dipakai halaman latihan untuk
// menampilkan pesan ramah kalau key belum diisi).
export async function GET() {
  return Response.json({
    configured: isAiConfigured(),
    model: process.env.AI_MODEL ?? "gpt-4o-mini",
  });
}
