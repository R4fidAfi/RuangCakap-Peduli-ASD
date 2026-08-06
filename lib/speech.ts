// ============================================================
// UTILITAS SUARA (browser Web Speech API)
// - STT: SpeechRecognition — ubah suara pengguna jadi teks (id-ID)
// - TTS: speechSynthesis — baca respons AI dengan suara (id-ID)
// Client-side only. Kalau browser tidak mendukung, aplikasi
// tetap berfungsi penuh lewat mode teks.
// ============================================================

export function speechSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

type AnyRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

export function createRecognition(): AnyRecognition | null {
  if (!speechSupported()) return null;
  const w = window as unknown as Record<string, unknown>;
  const Ctor = (w.SpeechRecognition ??
    w.webkitSpeechRecognition) as new () => AnyRecognition;
  return new Ctor();
}

/** Baca teks dengan suara (bahasa Indonesia). */
export function speak(text: string, onEnd?: () => void): void {
  if (!ttsSupported() || !text.trim()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 1;
  utterance.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find((v) => v.lang.toLowerCase().startsWith("id"));
  if (idVoice) utterance.voice = idVoice;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (ttsSupported()) window.speechSynthesis.cancel();
}

/** Hangatkan daftar suara (getVoices kadang kosong di awal). */
export function warmupVoices(): void {
  if (!ttsSupported()) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
