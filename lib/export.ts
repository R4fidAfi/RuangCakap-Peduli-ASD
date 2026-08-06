// ============================================================
// UTILITAS EKSPOR — bahan bukti untuk proposal & penilaian.
// Sesi bisa diekspor sebagai JSON lengkap atau Markdown transkrip.
// ============================================================

import type { StoredSession } from "@/lib/storage";

function downloadBlob(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportSessionJson(session: StoredSession): void {
  downloadBlob(
    `latihan-${session.courseId}-level${session.level}-${session.id.slice(0, 8)}.json`,
    JSON.stringify(session, null, 2),
    "application/json",
  );
}

export function exportAllJson(sessions: StoredSession[]): void {
  downloadBlob(
    `riwayat-latihan-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(sessions, null, 2),
    "application/json",
  );
}

export function sessionToMarkdown(session: StoredSession): string {
  const lines: string[] = [
    `# Latihan: ${session.courseTitle} (Level ${session.level})`,
    "",
    `- Tanggal: ${new Date(session.finishedAt).toLocaleString("id-ID")}`,
    `- Jumlah jawaban: ${session.turns.filter((t) => t.role === "user").length}`,
    "",
    "## Percakapan",
    "",
  ];
  for (const turn of session.turns) {
    lines.push(`**${turn.role === "ai" ? "AI" : "Pengguna"}:** ${turn.text}`, "");
  }
  if (session.feedback) {
    lines.push("## Evaluasi AI", "");
    lines.push(session.feedback.summary, "");
    lines.push("### Skor aspek", "");
    for (const aspect of session.feedback.aspects) {
      lines.push(`- ${aspect.label}: ${aspect.score} — ${aspect.note}`);
    }
    lines.push("", "### Apresiasi", "");
    for (const s of session.feedback.strengths) lines.push(`- ${s}`);
    lines.push("", "### Saran", "");
    for (const s of session.feedback.suggestions) lines.push(`- ${s}`);
    if (session.feedback.exampleResponses.length > 0) {
      lines.push("", "### Contoh kalimat", "");
      for (const s of session.feedback.exampleResponses) lines.push(`- ${s}`);
    }
  }
  return lines.join("\n");
}

export function exportSessionMarkdown(session: StoredSession): void {
  downloadBlob(
    `transkrip-${session.courseId}-level${session.level}.md`,
    sessionToMarkdown(session),
    "text/markdown",
  );
}

export function exportAllMarkdown(sessions: StoredSession[]): void {
  const content = sessions
    .map((session) => sessionToMarkdown(session))
    .join("\n\n---\n\n");
  downloadBlob(
    `riwayat-latihan-${new Date().toISOString().slice(0, 10)}.md`,
    content,
    "text/markdown",
  );
}
