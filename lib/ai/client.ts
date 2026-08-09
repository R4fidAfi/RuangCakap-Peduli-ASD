// ============================================================
// PEMANGGIL SUMOPOD (server-side only — API key TIDAK pernah
// keluar dari server). Endpoint OpenAI-compatible dengan SSE
// streaming. Hasilnya dialirkan ke klien sebagai teks polos
// per potongan (chunk), biar gampang dibaca di halaman latihan.
// ============================================================

import type { ApiMessage } from "./types";

const BASE_URL = process.env.SUMOPOD_BASE_URL ?? "https://ai.sumopod.com/v1";
const API_KEY = process.env.SUMOPOD_API_KEY ?? "";
const MODEL = process.env.AI_MODEL ?? "gpt-4o-mini";

export function isAiConfigured(): boolean {
  return API_KEY.length > 0;
}

function jsonError(message: string, status: number, error: string) {
  return Response.json({ error, message }, { status });
}

/**
 * Panggil chat completions dengan streaming.
 * Mengembalikan Response berisi aliran teks (bukan SSE mentah):
 * tiap chunk = potongan teks yang sudah diekstrak dari delta.
 */
export async function streamChatCompletion(input: {
  messages: ApiMessage[];
  temperature?: number;
  maxTokens?: number;
}): Promise<Response> {
  if (!isAiConfigured()) {
    return jsonError(
      "Konfigurasi AI belum tersedia. Hubungi pengembang.",
      503,
      "AI_NOT_CONFIGURED",
    );
  }

  const upstream = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: input.messages,
      temperature: input.temperature ?? 0.7,
      max_tokens: input.maxTokens ?? 300,
      stream: true,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(45000),
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    console.error("[ai] upstream error", upstream.status, detail.slice(0, 300));
    return jsonError(
      "Layanan AI sedang bermasalah. Silakan coba lagi.",
      502,
      "AI_UPSTREAM_ERROR",
    );
  }

  if (!upstream.body) {
    return jsonError("Layanan AI tidak mengirim data.", 502, "AI_EMPTY_BODY");
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Parse baris-baris SSE dari buffer.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") continue;
            let chunk: unknown;
            try {
              chunk = JSON.parse(data);
            } catch {
              continue;
            }
            const content = (
              chunk as { choices?: Array<{ delta?: { content?: string } }> }
            )?.choices?.[0]?.delta?.content;
            if (typeof content === "string" && content.length > 0) {
              controller.enqueue(encoder.encode(content));
            }
          }
        }
      } catch (err) {
        console.error("[ai] stream parse error", err);
      } finally {
        try {
          controller.close();
        } catch {
          /* stream sudah tertutup */
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Accel-Buffering": "no",
    },
  });
}

/**
 * Panggilan chat completions TANPA streaming (untuk evaluasi).
 * Mengembalikan teks lengkap dari pesan assistant.
 */
export async function completeChatCompletion(input: {
  messages: ApiMessage[];
  temperature?: number;
  maxTokens?: number;
}): Promise<
  | { ok: true; content: string }
  | { ok: false; status: number; message: string }
> {
  if (!isAiConfigured()) {
    return {
      ok: false,
      status: 503,
      message: "Konfigurasi AI belum tersedia. Hubungi pengembang.",
    };
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: input.messages,
        temperature: input.temperature ?? 0.4,
        max_tokens: input.maxTokens ?? 1000,
        stream: false,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30000),
    });
  } catch (err) {
    console.error("[ai] feedback upstream timeout/error:", err);
    return {
      ok: false,
      status: 504,
      message: "Layanan AI tidak merespons tepat waktu.",
    };
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    console.error("[ai] upstream error", upstream.status, detail.slice(0, 300));
    return {
      ok: false,
      status: upstream.status,
      message: "Layanan AI sedang bermasalah. Silakan coba lagi.",
    };
  }

  const data = (await upstream.json().catch(() => null)) as {
    choices?: Array<{ message?: { content?: string } }>;
  } | null;
  const content = data?.choices?.[0]?.message?.content ?? "";
  if (!content) {
    return { ok: false, status: 502, message: "AI tidak mengirim hasil evaluasi." };
  }
  return { ok: true, content };
}
