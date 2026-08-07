"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUp,
  Bot,
  Flag,
  ListChecks,
  Mic,
  RotateCcw,
  Square,
  Target,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { LEVEL_META, type LevelNumber, type ScenarioLevel } from "@/lib/scenarios";
import { saveSession, type StoredTurn } from "@/lib/storage";
import type { ChatTurn } from "@/lib/ai/types";
import Mascot from "./mascot";
import {
  createRecognition,
  speak,
  speechSupported,
  stopSpeaking,
  ttsSupported,
  warmupVoices,
} from "@/lib/speech";

type Status = "idle" | "running" | "done";

const FINISH_MARKER = "[SELESAI]";
const VOICE_PREF_KEY = "rc_voice_enabled";

/** Pisahkan penanda selesai dari teks respons AI. */
function extractFinish(reply: string): { text: string; finished: boolean } {
  if (reply.includes(FINISH_MARKER)) {
    return { text: reply.replace(FINISH_MARKER, "").trim(), finished: true };
  }
  return { text: reply, finished: false };
}

function AiBubble({
  text,
  typing,
  onSpeak,
  speaking,
}: {
  text?: string;
  typing?: boolean;
  onSpeak?: () => void;
  speaking?: boolean;
}) {
  return (
    <div className="group flex items-end gap-2.5">
      <Mascot
        mood={typing ? "thinking" : speaking ? "listening" : "default"}
        className="h-8 w-8 shrink-0"
      />
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-mist-200 bg-mist-50 px-4 py-3 text-sm leading-relaxed text-ink">
        {typing ? (
          <span className="flex items-center gap-1 py-1" aria-label="AI sedang mengetik">
            <span className="h-2 w-2 animate-bounce rounded-full bg-mist-400 [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-mist-400 [animation-delay:120ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-mist-400 [animation-delay:240ms]" />
          </span>
        ) : (
          text
        )}
        {!typing && text && onSpeak && (
          <button
            onClick={onSpeak}
            aria-label="Putar ulang suara AI"
            title="Putar ulang suara"
            className={`ml-2 inline-flex translate-y-0.5 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${
              speaking
                ? "bg-mist-200 text-mist-700"
                : "bg-white/70 text-mist-600 hover:bg-white"
            }`}
          >
            <Volume2 className="h-3.5 w-3.5" />
            {speaking ? "Memutar…" : "Suara"}
          </button>
        )}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-sage-100 px-4 py-3 text-sm leading-relaxed text-ink">
        {text}
      </div>
    </div>
  );
}

export default function PracticeRoom({
  courseId,
  courseTitle,
  level,
  levels,
  category,
}: {
  courseId: string;
  courseTitle: string;
  level: LevelNumber;
  levels: ScenarioLevel[];
  category: string;
}) {
  const current = levels.find((l) => l.level === level) ?? levels[0];
  const meta = LEVEL_META[current.level];

  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Mode suara
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [speakingTurn, setSpeakingTurn] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const bootRef = useRef(false);
  const recognitionRef = useRef<ReturnType<typeof createRecognition>>(null);
  const voiceEnabledRef = useRef(voiceEnabled);

  const userTurns = turns.filter((t) => t.role === "user").length;
  const progress = Math.min(
    100,
    Math.round((userTurns / Math.max(1, current.minTurns)) * 100),
  );

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [turns, streamText, scrollToBottom]);

  // Muat preferensi suara + hangatkan daftar suara.
  useEffect(() => {
    warmupVoices();
    try {
      const pref = window.localStorage.getItem(VOICE_PREF_KEY);
      if (pref === "off") setVoiceEnabled(false);
    } catch {
      /* abaikan */
    }
  }, []);

  // Simpan preferensi suara saat berubah.
  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
    try {
      window.localStorage.setItem(VOICE_PREF_KEY, voiceEnabled ? "on" : "off");
    } catch {
      /* abaikan */
    }
  }, [voiceEnabled]);

  // Bersihkan semua saat halaman ditutup.
  useEffect(() => {
    return () => {
      stopSpeaking();
      recognitionRef.current?.abort();
    };
  }, []);

  /** Panggil /api/chat dan alirkan respons AI ke layar. */
  async function streamReply(history: ChatTurn[]): Promise<string> {
    setError(null);
    setStatus("running");
    setStreamText("");
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, level, history }),
        signal: controller.signal,
      });
      if (!res.ok) {
        let message = "Terjadi kesalahan saat menghubungi AI.";
        try {
          const data = (await res.json()) as { message?: string };
          if (data?.message) message = data.message;
        } catch {
          /* body bukan JSON */
        }
        throw new Error(message);
      }
      if (!res.body) throw new Error("AI tidak mengirim respons.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreamText(full);
      }
      return full;
    } catch (err) {
      const message =
        err instanceof Error && err.name === "AbortError"
          ? "Percakapan dihentikan."
          : err instanceof Error
            ? err.message
            : "Terjadi kesalahan yang tidak diketahui.";
      setError(message);
      return "";
    } finally {
      abortRef.current = null;
      setStatus("idle");
      setStreamText("");
    }
  }

  /** Tambahkan giliran AI; baca dengan suara jika aktif. */
  function appendAiTurn(
    history: ChatTurn[],
    replyText: string,
    finished: boolean,
  ) {
    const fullTurns: ChatTurn[] = [...history, { role: "ai", text: replyText }];
    setTurns(fullTurns);
    if (voiceEnabledRef.current && ttsSupported()) {
      setSpeakingTurn(true);
      speak(replyText, () => setSpeakingTurn(false));
    }
    if (finished) {
      finishSession(fullTurns);
    }
  }

  function finishSession(finalTurns: ChatTurn[]) {
    stopSpeaking();
    const now = new Date().toISOString();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const session = {
      id,
      courseId,
      courseTitle,
      level: current.level,
      levelLabel: meta.label,
      startedAt: now,
      finishedAt: now,
      finished: true,
      turns: finalTurns as StoredTurn[],
    };
    saveSession(session);
    setSessionId(id);
    setStatus("done");
  }

  /** Giliran pembuka: AI memulai percakapan sesuai peran. */
  async function startConversation() {
    const reply = await streamReply([]);
    if (!reply.trim()) return;
    const { text, finished } = extractFinish(reply);
    if (text) appendAiTurn([], text, finished);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || status !== "idle") return;
    stopSpeaking();
    setInput("");
    const history: ChatTurn[] = [...turns, { role: "user", text }];
    setTurns(history);
    const reply = await streamReply(history);
    if (!reply.trim()) return;
    const { text: replyText, finished } = extractFinish(reply);
    if (replyText) appendAiTurn(history, replyText, finished);
  }

  function resetSession() {
    abortRef.current?.abort();
    stopSpeaking();
    recognitionRef.current?.abort();
    setTurns([]);
    setError(null);
    setStreamText("");
    setListening(false);
    setInterim("");
    void startConversation();
  }

  // ---------- Mode suara ----------

  function startListening() {
    if (!speechSupported()) {
      setError(
        "Mode suara tidak didukung browser ini (gunakan Chrome atau Edge). Kamu tetap bisa latihan lewat teks.",
      );
      return;
    }
    stopSpeaking();
    const recognition = createRecognition();
    if (!recognition) {
      setError(
        "Mode suara tidak tersedia saat ini. Kamu tetap bisa latihan lewat teks.",
      );
      return;
    }
    setInterim("");
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: unknown) => {
      const e = event as {
        results: ArrayLike<{
          isFinal: boolean;
          0: { transcript: string };
        }>;
      };
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (finalText) {
        setInput((prev) => (prev ? `${prev.trim()} ${finalText.trim()}` : finalText.trim()));
      }
      setInterim(interimText);
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
      recognitionRef.current = null;
    };

    recognition.onerror = (event: { error?: string }) => {
      setListening(false);
      setInterim("");
      recognitionRef.current = null;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError(
          "Izin mikrofon ditolak. Aktifkan akses mikrofon di browser, atau pakai mode teks.",
        );
      }
    };

    recognitionRef.current = recognition;
    setListening(true);
    try {
      recognition.start();
    } catch {
      setListening(false);
      recognitionRef.current = null;
    }
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
    setInterim("");
  }

  function toggleMic() {
    if (listening) stopListening();
    else startListening();
  }

  /** Boot: mulai percakapan begitu halaman terbuka. */
  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;
    void startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busy = status === "running";
  const isDone = status === "done";
  const canSend = !busy && !isDone && !listening && input.trim().length > 0;

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-page">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-sage-200 bg-white/85 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
          <Link
            href={`/skenario/${courseId}`}
            aria-label="Kembali ke detail skenario"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sage-200 bg-white text-ink-soft transition-colors hover:text-leaf-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-forest-700">
              {courseTitle}
            </p>
            <p className="truncate text-xs text-ink-faint">
              {category} · Level {current.level} ({meta.label}) · {current.aiRole}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${
              isDone
                ? "bg-sage-100 text-leaf-700"
                : listening
                  ? "bg-leaf-500 text-forest-800"
                  : busy
                    ? "bg-mist-50 text-mist-600"
                    : "bg-sage-100 text-leaf-700"
            }`}
          >
            {isDone ? (
              "Selesai"
            ) : listening ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                Mendengarkan…
              </>
            ) : busy ? (
              <>
                <span className="h-2 w-2 animate-pulse rounded-full bg-mist-400" />
                AI merespons
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-leaf-500" />
                Giliran kamu
              </>
            )}
          </span>
          <button
            onClick={resetSession}
            disabled={busy}
            className="hidden items-center gap-1.5 rounded-full border border-sage-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-leaf-700 transition-colors hover:bg-sage-100 disabled:opacity-50 sm:inline-flex"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Ulangi
          </button>
          <button
            onClick={() => {
              if (turns.length > 0 && !busy && !isDone) {
                finishSession(turns);
              }
            }}
            disabled={busy || turns.length === 0 || isDone}
            title="Akhiri latihan dan lihat evaluasi"
            className="inline-flex items-center gap-1.5 rounded-full bg-leaf-500 px-3.5 py-1.5 text-xs font-semibold text-forest-800 transition-colors hover:bg-leaf-600 disabled:opacity-50"
          >
            <Flag className="h-3.5 w-3.5" />
            Selesai
          </button>
        </div>
      </header>

      {/* Progress tipis */}
      <div
        className="h-1 bg-sage-200 transition-all duration-500"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-label={`Kemajuan latihan ${progress} persen`}
      />

      <div className="flex min-h-0 flex-1">
        {/* Sidebar konteks (desktop) */}
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-r border-sage-200 bg-white/60 p-5 lg:block">
          <div className="rounded-2xl border border-sage-200 bg-white p-4 shadow-soft">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
              <Bot className="h-4 w-4 text-mist-400" /> Peran AI · Wahyu
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-ink">
              {current.aiRole}
            </p>
          </div>
          <div className="mt-3 rounded-2xl border border-sage-200 bg-white p-4 shadow-soft">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
              <Target className="h-4 w-4 text-leaf-700" /> Tujuan latihan
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              {current.goal}
            </p>
          </div>
          <div className="mt-3 rounded-2xl border border-sage-200 bg-white p-4 shadow-soft">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
              <ListChecks className="h-4 w-4 text-mist-400" /> Situasi & kondisi
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              {current.context}
            </p>
            <ul className="mt-2 space-y-1.5">
              {(current.challenges.length > 0
                ? current.challenges
                : ["Percakapan mengalir sederhana tanpa kejutan."]
              ).map((challenge) => (
                <li
                  key={challenge}
                  className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-400" />
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 px-1 text-xs leading-relaxed text-ink-faint">
            Target ±{current.minTurns} giliran. Bicara lewat mikrofon atau ketik
            — dua-duanya sama-sama valid.
          </p>
        </aside>

        {/* Area percakapan */}
        <section className="flex min-h-0 flex-1 flex-col">
          {/* Konteks ringkas (mobile) */}
          <div className="border-b border-sage-200 bg-white/60 px-4 pt-3 lg:hidden">
            <details className="rounded-2xl border border-sage-200 bg-white px-4 py-2.5 shadow-soft">
              <summary className="cursor-pointer select-none text-xs font-bold text-forest-700">
                Situasi latihan — ketuk untuk lihat
              </summary>
              <div className="mt-2 space-y-1.5 border-t border-sage-200 pt-2 text-xs leading-relaxed text-ink-soft">
                <p>
                  <span className="font-semibold text-ink">Peran AI · Wahyu:</span>{" "}
                  {current.aiRole}
                </p>
                <p>
                  <span className="font-semibold text-ink">Situasi:</span>{" "}
                  {current.context}
                </p>
                <p>
                  <span className="font-semibold text-ink">Tujuan:</span>{" "}
                  {current.goal}
                </p>
              </div>
            </details>
          </div>

          <div
            className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
            aria-live="polite"
          >
            {turns.length === 0 && !busy && !error && (
              <div className="flex h-full items-center justify-center">
                <p className="max-w-sm text-center text-sm leading-relaxed text-ink-faint">
                  AI sedang menyiapkan percakapan…
                </p>
              </div>
            )}

            {turns.map((turn, index) =>
              turn.role === "ai" ? (
                <AiBubble
                  key={index}
                  text={turn.text}
                  speaking={index === turns.length - 1 && speakingTurn}
                  onSpeak={() => {
                    if (!ttsSupported()) return;
                    stopSpeaking();
                    setSpeakingTurn(true);
                    speak(turn.text, () => setSpeakingTurn(false));
                  }}
                />
              ) : (
                <UserBubble key={index} text={turn.text} />
              ),
            )}

            {streamText.length > 0 && <AiBubble text={streamText} />}
            {busy && streamText.length === 0 && <AiBubble typing />}

            {error && (
              <div className="flex items-start justify-between gap-3 rounded-2xl border border-sun-100 bg-sun-100/50 px-4 py-3 text-sm text-ink">
                <p>{error}</p>
                <span className="flex shrink-0 items-center gap-2">
                  {turns.length === 0 && (
                    <button
                      onClick={() => {
                        setError(null);
                        void startConversation();
                      }}
                      className="font-semibold text-leaf-700 underline underline-offset-2"
                    >
                      Coba lagi
                    </button>
                  )}
                  <button
                    onClick={() => setError(null)}
                    aria-label="Tutup pesan"
                    className="text-ink-faint transition-colors hover:text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Panel selesai */}
          {isDone && (
            <div className="border-t border-sage-200 bg-white px-4 py-4 sm:px-6">
              <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-2xl border border-sage-200 bg-sage-100/60 p-4 sm:flex-row sm:items-center">
                <Mascot mood="happy" className="h-12 w-12 shrink-0 drop-shadow-md" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-forest-700">
                    Latihan selesai — hebat sudah mencoba!
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                    {userTurns} giliran jawaban tercatat. Hasil latihan sudah
                    tersimpan — buka evaluasi AI untuk melihat penilaian 6
                    aspek, saran, dan contoh kalimat.
                  </p>
                </div>
                <div className="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto">
                  {sessionId && (
                    <Link
                      href={`/feedback/${sessionId}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-leaf-500 px-4 py-2 text-xs font-bold text-forest-800 transition-colors hover:bg-leaf-600 sm:flex-none"
                    >
                      Lihat Evaluasi
                    </Link>
                  )}
                  <button
                    onClick={resetSession}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-sage-300 bg-white px-4 py-2 text-xs font-bold text-leaf-700 transition-colors hover:bg-sage-100 sm:flex-none"
                  >
                    Latihan Lagi
                  </button>
                  <Link
                    href={`/skenario/${courseId}`}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-sage-300 bg-white px-4 py-2 text-xs font-bold text-leaf-700 transition-colors hover:bg-sage-100 sm:flex-none"
                  >
                    Kembali
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Input + kontrol suara */}
          {!isDone && (
            <div className="border-t border-sage-200 bg-white px-4 py-3 sm:px-6">
              <div className="mx-auto flex max-w-3xl items-center gap-2">
                <button
                  onClick={toggleMic}
                  disabled={busy}
                  title={
                    listening
                      ? "Berhenti mendengarkan"
                      : speechSupported()
                        ? "Bicara lewat mikrofon"
                        : "Mode suara tidak didukung browser ini"
                  }
                  aria-label={listening ? "Berhenti mendengarkan" : "Bicara lewat mikrofon"}
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all disabled:opacity-50 ${
                    listening
                      ? "animate-pulse bg-leaf-600 text-forest-800 shadow-lift"
                      : "border border-sage-200 bg-page text-leaf-600 hover:border-leaf-400"
                  }`}
                >
                  <Mic className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void sendMessage();
                  }}
                  disabled={busy || listening}
                  placeholder={
                    listening
                      ? "Mendengarkan…"
                      : "Ketik atau bicara jawabanmu…"
                  }
                  aria-label="Ketik jawabanmu"
                  className="min-w-0 flex-1 rounded-full border border-sage-200 bg-page px-5 py-3 text-sm text-ink shadow-soft placeholder:text-ink-faint focus:border-leaf-400 focus:outline-none disabled:opacity-60"
                />
                <button
                  onClick={() => void sendMessage()}
                  disabled={!canSend}
                  aria-label="Kirim jawaban"
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-all ${
                    canSend
                      ? "bg-leaf-500 text-forest-800 shadow-lift hover:bg-leaf-600"
                      : "bg-sage-100 text-ink-faint"
                  }`}
                >
                  {busy ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <ArrowUp className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Baris status suara */}
              <div className="mx-auto mt-2 flex max-w-3xl flex-col items-center gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                <p className="w-full truncate text-center text-[11px] text-ink-faint sm:w-auto sm:text-left">
                  {listening ? (
                    <>
                      {interim || "Bicara sekarang…"} — klik mikrofon lagi untuk
                      berhenti
                    </>
                  ) : (
                    <>
                      Tekan mikrofon untuk bicara, atau ketik jawabanmu.
                      {!speechSupported() && " (browser ini tidak mendukung mic)"}
                    </>
                  )}
                </p>
                <button
                  onClick={() => setVoiceEnabled((v) => !v)}
                  disabled={!ttsSupported()}
                  aria-pressed={voiceEnabled}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
                    voiceEnabled
                      ? "bg-mist-50 text-mist-600"
                      : "bg-sage-100 text-ink-faint"
                  }`}
                >
                  {voiceEnabled ? (
                    <>
                      <Volume2 className="h-3.5 w-3.5" /> Suara AI: nyala
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-3.5 w-3.5" /> Suara AI: mati
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
