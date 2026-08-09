import { NextRequest } from "next/server";
import {
  buildFallbackFeedback,
  buildFeedbackMessages,
  parseFeedbackResponse,
} from "@/lib/ai/feedback";
import { completeChatCompletion } from "@/lib/ai/client";
import type { LevelNumber } from "@/lib/scenarios";
import type { ChatTurn } from "@/lib/ai/types";

function jsonError(message: string, status: number, error: string) {
  return Response.json({ error, message }, { status });
}

/**
 * POST /api/feedback
 * Body: { courseId: string, level: 1|2|3, turns: ChatTurn[] }
 * Response: FeedbackResult (JSON evaluasi 6 aspek + saran + contoh).
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Body harus berupa JSON.", 400, "INVALID_JSON");
  }

  const { courseId, level, turns } = (body ?? {}) as {
    courseId?: unknown;
    level?: unknown;
    turns?: unknown;
  };

  if (typeof courseId !== "string" || courseId.trim() === "") {
    return jsonError("Parameter courseId wajib diisi.", 400, "COURSE_REQUIRED");
  }
  const levelNum = Number(level);
  if (![1, 2, 3].includes(levelNum)) {
    return jsonError("Parameter level harus 1, 2, atau 3.", 400, "LEVEL_INVALID");
  }
  if (!Array.isArray(turns)) {
    return jsonError("Parameter turns harus berupa array.", 400, "TURNS_INVALID");
  }

  let messages;
  const cleanTurns: ChatTurn[] = [];
  for (const item of turns) {
    if (typeof item !== "object" || item === null) continue;
    const t = item as Record<string, unknown>;
    const role = t.role;
    const text = typeof t.text === "string" ? t.text.trim() : "";
    if ((role === "ai" || role === "user") && text.length > 0) {
      cleanTurns.push({ role, text: text.slice(0, 2000) });
    }
    if (cleanTurns.length >= 40) break;
  }
  try {
    messages = buildFeedbackMessages({
      courseId: courseId.trim(),
      level: levelNum as LevelNumber,
      turns: cleanTurns,
    });
  } catch {
    return jsonError("Skenario tidak ditemukan.", 404, "SCENARIO_NOT_FOUND");
  }

  // Coba evaluasi AI; bila gagal (AI belum dikonfigurasi / error),
  // gunakan evaluasi otomatis agar evaluasi SELALU muncul.
  try {
    const result = await completeChatCompletion({
      messages,
      temperature: 0.4,
      maxTokens: 1100,
    });
    if (result.ok) {
      try {
        const parsed = parseFeedbackResponse(result.content);
        return Response.json({ ...parsed, source: "ai" });
      } catch (err) {
        console.error("[feedback] parse error, pakai fallback:", err);
      }
    } else {
      console.error("[feedback] AI error, pakai fallback:", result.message);
    }
  } catch (err) {
    console.error("[feedback] AI gagal, pakai fallback:", err);
  }

  const fallback = buildFallbackFeedback({
    courseId: courseId.trim(),
    level: levelNum as LevelNumber,
    turns: cleanTurns,
  });
  return Response.json(fallback);
}
