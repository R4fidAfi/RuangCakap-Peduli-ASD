"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpenText,
  Bot,
  CheckCircle2,
  Copy,
  Download,
  Lightbulb,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { getSession, saveSession, type StoredSession } from "@/lib/storage";
import type { FeedbackResult } from "@/lib/ai/feedback";

type FeedbackState = "loading" | "ready" | "error";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function AspectBar({ aspect }: { aspect: FeedbackResult["aspects"][number] }) {
  const good = aspect.score >= 75;
  const mid = aspect.score >= 55 && aspect.score < 75;
  return (
    <div className="rounded-2xl border border-sage-200 bg-page p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">{aspect.label}</p>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            good
              ? "bg-sage-100 text-leaf-700"
              : mid
                ? "bg-sun-100 text-forest-700"
                : "bg-mist-100 text-mist-700"
          }`}
        >
          {aspect.score}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-sage-200">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            good
              ? "bg-leaf-500"
              : mid
                ? "bg-sun-400"
                : "bg-mist-400"
          }`}
          style={{ width: `${aspect.score}%` }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-soft">
        {aspect.note}
      </p>
    </div>
  );
}

export default function FeedbackPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params?.sessionId ?? "";

  const [session, setSession] = useState<StoredSession | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<FeedbackState>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const generateFeedback = useCallback(async () => {
    if (!session) return;
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: session.courseId,
          level: session.level,
          turns: session.turns,
        }),
      });
      if (!res.ok) {
        let message = "Evaluasi gagal dibuat. Coba lagi.";
        try {
          const data = (await res.json()) as { message?: string };
          if (data?.message) message = data.message;
        } catch {
          /* body bukan JSON */
        }
        throw new Error(message);
      }
      const feedback = (await res.json()) as FeedbackResult;
      const updated: StoredSession = { ...session, feedback };
      saveSession(updated);
      setSession(updated);
      setState("ready");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Evaluasi gagal dibuat.");
      setState("error");
    }
  }, [session]);

  useEffect(() => {
    if (!sessionId) return;
    const found = getSession(sessionId);
    if (!found) {
      setLoaded(true);
      setState("error");
      setErrorMsg("Sesi latihan tidak ditemukan di browser ini.");
      return;
    }
    setSession(found);
    setLoaded(true);
    if (found.feedback) {
      setState("ready");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    if (loaded && session && !session.feedback && state !== "loading") {
      void generateFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, session?.id]);

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-ink-faint">Memuat…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sage-100 text-leaf-500">
          <BookOpenText className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-forest-800">
          Sesi tidak ditemukan
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          {errorMsg} Riwayat latihan tersimpan di browser — pastikan kamu
          membuka dari perangkat yang sama.
        </p>
        <Link
          href="/riwayat"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-600"
        >
          <ArrowLeft className="h-4 w-4" /> Ke Riwayat Latihan
        </Link>
      </main>
    );
  }

  const feedback = session.feedback;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href="/riwayat"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-leaf-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Riwayat
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-leaf-500">
            Evaluasi Latihan
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-forest-800">
            {session.courseTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-faint">
            Level {session.level} ({session.levelLabel}) · {formatDate(session.finishedAt)} ·{" "}
            {session.turns.filter((t) => t.role === "user").length} jawaban
          </p>
        </div>
        <button
          onClick={() => downloadJson(`latihan-${session.id}.json`, session)}
          className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white px-5 py-2.5 text-sm font-semibold text-leaf-700 transition-colors hover:bg-sage-100"
        >
          <Download className="h-4 w-4" /> Simpan Bukti (JSON)
        </button>
      </div>

      {state === "loading" && (
        <div className="mt-8 rounded-3xl border border-sage-200 bg-white p-10 text-center shadow-soft">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-mist-50 text-mist-600">
            <Sparkles className="h-7 w-7 animate-pulse" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-forest-700">
            AI sedang menyiapkan evaluasi…
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Membaca percakapanmu dan menilai 6 aspek komunikasi. Sebentar ya.
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="mt-8 rounded-3xl border border-sun-100 bg-sun-100/50 p-10 text-center">
          <h2 className="text-lg font-bold text-forest-700">
            Evaluasi belum berhasil dibuat
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{errorMsg}</p>
          <button
            onClick={() => void generateFeedback()}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-600"
          >
            <RefreshCw className="h-4 w-4" /> Coba Lagi
          </button>
        </div>
      )}

      {state === "ready" && feedback && (
        <>
          {/* Ringkasan */}
          <div className="mt-8 rounded-3xl border border-sage-200 bg-gradient-to-br from-sage-100 via-sage-100/60 to-white p-7 shadow-soft">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-leaf-700">
              <Sparkles className="h-4 w-4" /> Ringkasan AI
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink">
              {feedback.summary}
            </p>
          </div>

          {/* 6 aspek */}
          <h2 className="mt-10 text-xl font-bold tracking-tight text-forest-800">
            Aspek yang dinilai
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {feedback.aspects.map((aspect) => (
              <AspectBar key={aspect.id} aspect={aspect} />
            ))}
          </div>

          {/* Apresiasi & saran */}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-sage-200 bg-white p-6 shadow-soft">
              <p className="flex items-center gap-2 text-sm font-bold text-leaf-700">
                <CheckCircle2 className="h-5 w-5" /> Yang sudah baik
              </p>
              <ul className="mt-3 space-y-2">
                {feedback.strengths.length > 0 ? (
                  feedback.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-500" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-ink-faint">
                    Kamu sudah berani mencoba — itu langkah yang hebat.
                  </li>
                )}
              </ul>
            </div>
            <div className="rounded-3xl border border-mist-200 bg-white p-6 shadow-soft">
              <p className="flex items-center gap-2 text-sm font-bold text-mist-600">
                <Lightbulb className="h-5 w-5" /> Bisa dicoba berikutnya
              </p>
              <ul className="mt-3 space-y-2">
                {feedback.suggestions.length > 0 ? (
                  feedback.suggestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-400" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-ink-faint">
                    Tidak ada saran khusus — lanjutkan saja!
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Contoh kalimat */}
          {feedback.exampleResponses.length > 0 && (
            <div className="mt-6 rounded-3xl border border-sage-200 bg-white p-6 shadow-soft">
              <p className="flex items-center gap-2 text-sm font-bold text-forest-700">
                <Bot className="h-5 w-5" /> Contoh cara menjawab
              </p>
              <div className="mt-4 space-y-3">
                {feedback.exampleResponses.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-sage-200 bg-page px-4 py-3 text-sm leading-relaxed text-ink"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transkrip */}
          <details className="mt-10 rounded-3xl border border-sage-200 bg-white shadow-soft">
            <summary className="cursor-pointer list-none p-5 text-sm font-bold text-forest-700">
              Lihat transkrip percakapan
            </summary>
            <div className="space-y-3 px-5 pb-5">
              <button
                onClick={async () => {
                  const text = session.turns
                    .map(
                      (t) =>
                        `${t.role === "ai" ? "AI" : "Kamu"}: ${t.text}`,
                    )
                    .join("\n\n");
                  await navigator.clipboard.writeText(text).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-sage-300 bg-white px-4 py-2 text-xs font-semibold text-leaf-700 transition-colors hover:bg-sage-100"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Tersalin!" : "Salin transkrip"}
              </button>
              <div className="space-y-3 rounded-2xl border border-sage-200 bg-page p-4">
                {session.turns.map((turn, i) => (
                  <div key={i} className={turn.role === "user" ? "text-right" : ""}>
                    <div
                      className={`inline-block max-w-[85%] rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed ${
                        turn.role === "ai"
                          ? "rounded-bl-md border border-mist-200 bg-mist-50 text-ink"
                          : "rounded-br-md bg-sage-100 text-ink"
                      }`}
                    >
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                        {turn.role === "ai" ? "AI" : "Kamu"}
                      </span>
                      {turn.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </>
      )}
    </main>
  );
}
