"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpenText,
  CheckCircle2,
  Download,
  FileJson,
  FileText,
  Trash2,
} from "lucide-react";
import RequireAuth from "@/components/require-auth";
import AppShell from "@/components/app-shell";
import Mascot from "@/components/mascot";
import { getSessions, type StoredSession } from "@/lib/storage";
import { sessionAverage } from "@/lib/stats";
import {
  exportAllJson,
  exportAllMarkdown,
  exportSessionJson,
  exportSessionMarkdown,
} from "@/lib/export";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function RiwayatContent() {
  const [sessions, setSessions] = useState<StoredSession[] | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  if (sessions === null) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-sm text-ink-faint">Memuat riwayat…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-leaf-700">
            Riwayat Latihan
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-forest-800">
            Semua sesi latihanmu
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Setiap percakapan dengan AI tercatat lengkap di sini — bahan bukti
            perkembanganmu.
          </p>
        </div>
        {sessions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportAllJson(sessions)}
              className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white px-4 py-2.5 text-xs font-semibold text-leaf-700 transition-colors hover:bg-sage-100"
            >
              <FileJson className="h-4 w-4" /> Ekspor Semua (JSON)
            </button>
            <button
              onClick={() => exportAllMarkdown(sessions)}
              className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white px-4 py-2.5 text-xs font-semibold text-leaf-700 transition-colors hover:bg-sage-100"
            >
              <FileText className="h-4 w-4" /> Ekspor Semua (Markdown)
            </button>
            {confirmClear ? (
              <button
                onClick={() => {
                  window.localStorage.removeItem("rc_sessions");
                  setSessions([]);
                  setConfirmClear(false);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" /> Yakin hapus semua?
              </button>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white px-4 py-2.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-sage-100"
              >
                <Trash2 className="h-4 w-4" /> Hapus Semua
              </button>
            )}
          </div>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-sage-300 bg-white px-6 py-16 text-center">
          <Mascot mood="happy" className="mx-auto h-16 w-16 drop-shadow-md" />
          <h2 className="mt-4 text-lg font-bold text-forest-700">
            Belum ada latihan
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Selesaikan satu latihan percakapan dulu, riwayatnya akan muncul di
            sini lengkap dengan transkripnya.
          </p>
          <Link
            href="/latihan"
            className="mt-6 inline-flex rounded-full bg-leaf-500 px-6 py-3 text-sm font-semibold text-forest-800 transition-colors hover:bg-leaf-600"
          >
            Pilih Latihan Pertama
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {sessions.map((session) => {
            const avg = sessionAverage(session);
            const answers = session.turns.filter((t) => t.role === "user").length;
            return (
              <article
                key={session.id}
                className="rounded-3xl border border-sage-200 bg-white p-5 shadow-soft transition-all hover:shadow-lift"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-forest-700">
                        {session.courseTitle}
                      </h2>
                      <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-[11px] font-semibold text-leaf-700">
                        Level {session.level} · {session.levelLabel}
                      </span>
                      {session.finished && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-mist-50 px-2.5 py-0.5 text-[11px] font-semibold text-mist-600">
                          <CheckCircle2 className="h-3 w-3" /> selesai
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-faint">
                      {formatDate(session.finishedAt)} · {answers} jawaban
                      {avg !== null && (
                        <span className="ml-2 rounded-full bg-sage-100 px-2 py-0.5 font-bold text-leaf-700">
                          skor {avg}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      href={`/feedback/${session.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-leaf-500 px-4 py-2 text-xs font-bold text-forest-800 transition-colors hover:bg-leaf-600"
                    >
                      Evaluasi & Transkrip
                    </Link>
                    <button
                      onClick={() => exportSessionJson(session)}
                      title="Unduh JSON sesi ini"
                      aria-label="Unduh JSON sesi ini"
                      className="grid h-8 w-8 place-items-center rounded-full border border-sage-300 bg-white text-leaf-700 transition-colors hover:bg-sage-100"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => exportSessionMarkdown(session)}
                      title="Unduh transkrip Markdown"
                      aria-label="Unduh transkrip Markdown"
                      className="grid h-8 w-8 place-items-center rounded-full border border-sage-300 bg-white text-leaf-700 transition-colors hover:bg-sage-100"
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default function RiwayatPage() {
  return (
    <RequireAuth>
      <AppShell>
        <RiwayatContent />
      </AppShell>
    </RequireAuth>
  );
}
