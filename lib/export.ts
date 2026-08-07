// ============================================================
// UTILITAS EKSPOR — bahan bukti untuk proposal & penilaian.
// Sesi bisa diekspor sebagai JSON lengkap (data mentah) atau
// laporan HTML (dokumen rapi yang langsung bisa dibuka/diprint).
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

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function averageScore(session: StoredSession): number | null {
  if (!session.feedback || session.feedback.aspects.length === 0) return null;
  const total = session.feedback.aspects.reduce((sum, a) => sum + a.score, 0);
  return Math.round(total / session.feedback.aspects.length);
}

// ------------------------------------------------------------
// LAPORAN HTML — dokumen mandiri, rapi, siap dibuka/diprint.
// ------------------------------------------------------------

const REPORT_STYLE = `
  *{box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;background:#eef4f0;color:#22332a;margin:0;padding:24px 12px;line-height:1.55}
  .page{max-width:760px;margin:0 auto}
  .hero{background:linear-gradient(135deg,#7bd91f,#4ca000);color:#14231c;border-radius:20px;padding:26px 30px;box-shadow:0 18px 38px -16px rgba(31,77,54,.25)}
  .hero .brand{font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:.85}
  .hero h1{margin:6px 0 4px;font-size:26px;line-height:1.2}
  .hero .sub{font-size:14px;font-weight:600;opacity:.9}
  .hero .score-pill{display:inline-block;margin-top:12px;background:#14231c;color:#fff;border-radius:999px;padding:6px 14px;font-size:13px;font-weight:700}
  .card{background:#fff;border:1.5px solid #dce8e0;border-radius:16px;padding:22px 24px;margin-top:16px}
  .card h2{margin:0 0 10px;font-size:17px;color:#1f4d36}
  .meta{display:flex;flex-wrap:wrap;gap:8px}
  .meta span{background:#e5f0e8;color:#3b8a00;border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:700}
  .summary{display:flex;flex-wrap:wrap;gap:12px}
  .stat{flex:1;min-width:130px;background:#f6faf7;border:1.5px solid #dce8e0;border-radius:12px;padding:12px 16px;text-align:center}
  .stat b{display:block;font-size:22px;color:#1f4d36}
  .stat small{font-size:11.5px;color:#6b7f72;font-weight:600}
  .aspect{margin-top:10px}
  .aspect .row{display:flex;align-items:center;gap:10px;margin-top:8px}
  .aspect .label{flex:0 0 190px;font-size:13px;font-weight:700}
  .aspect .bar{flex:1;height:10px;background:#e5f0e8;border-radius:999px;overflow:hidden}
  .aspect .fill{height:100%;background:linear-gradient(90deg,#7bd91f,#58c200);border-radius:999px}
  .aspect .val{flex:0 0 34px;text-align:right;font-size:12.5px;font-weight:800;color:#3b8a00}
  .box{border-radius:12px;padding:14px 16px;margin-top:10px;font-size:13.5px}
  .box ul{margin:6px 0 0;padding-left:20px}
  .box li{margin-top:4px}
  .good{background:#eef7ee;border:1.5px solid #cfe5cf;color:#1f4d36}
  .advice{background:#edf4fb;border:1.5px solid #d3e4f2;color:#244c73}
  .example{border:1.5px solid #dce8e0;background:#fbfdfc}
  .chat{display:flex;flex-direction:column;gap:10px;margin-top:12px}
  .bubble{max-width:82%;padding:11px 15px;border-radius:16px;font-size:13.5px;white-space:pre-wrap}
  .bubble.ai{align-self:flex-start;background:#e8f1f8;border:1.5px solid #c7dbea;border-bottom-left-radius:6px;color:#22332a}
  .bubble.user{align-self:flex-end;background:#e5f0e8;border:1.5px solid #cfe0d4;border-bottom-right-radius:6px;color:#22332a}
  .bubble .who{display:block;font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px;color:#5b8db8}
  .bubble.user .who{color:#3b8a00}
  footer{margin:20px 0 8px;text-align:center;font-size:11.5px;color:#93a79b}
  @media print{.card{break-inside:avoid}.page-break{break-before:page}}
`;

function sessionToHtmlReport(session: StoredSession): string {
  const avg = averageScore(session);
  const userTurns = session.turns.filter((t) => t.role === "user").length;
  const f = session.feedback;

  const chat = session.turns
    .map((turn) => {
      const who = turn.role === "ai" ? "Wahyu" : "Pengguna";
      return `<div class="bubble ${turn.role}"><span class="who">${who}</span>${esc(turn.text)}</div>`;
    })
    .join("\n");

  const aspects = f
    ? f.aspects
        .map(
          (a) => `
    <div class="row">
      <span class="label">${esc(a.label)}</span>
      <span class="bar"><span class="fill" style="width:${Math.min(100, a.score)}%"></span></span>
      <span class="val">${a.score}</span>
    </div>`,
        )
        .join("")
    : "";

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Laporan Latihan — ${esc(session.courseTitle)} (Level ${session.level})</title>
<style>${REPORT_STYLE}</style>
</head>
<body>
<div class="page">
  <div class="hero">
    <div class="brand">RuangCakap · Laporan Latihan</div>
    <h1>${esc(session.courseTitle)}</h1>
    <div class="sub">Level ${session.level} — ${new Date(session.finishedAt).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
    ${avg !== null ? `<span class="score-pill">Skor rata-rata: ${avg}</span>` : ""}
  </div>

  <div class="card">
    <h2>Ringkasan sesi</h2>
    <div class="summary">
      <div class="stat"><b>${session.turns.length}</b><small>Giliran percakapan</small></div>
      <div class="stat"><b>${userTurns}</b><small>Jawaban pengguna</small></div>
      ${avg !== null ? `<div class="stat"><b>${avg}</b><small>Skor rata-rata</small></div>` : ""}
    </div>
    <div class="meta" style="margin-top:14px">
      <span>Dibuat: ${formatDate(session.finishedAt)}</span>
      <span>Level ${session.level}</span>
    </div>
  </div>

  ${f ? `
  <div class="card">
    <h2>Evaluasi AI</h2>
    <p style="margin:0 0 6px;font-size:13.5px">${esc(f.summary)}</p>
    <div class="aspect">${aspects}</div>
  </div>

  <div class="card">
    <h2>Apresiasi</h2>
    <div class="box good"><ul>${f.strengths.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
  </div>

  <div class="card">
    <h2>Saran untuk berkembang</h2>
    <div class="box advice"><ul>${f.suggestions.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
  </div>

  ${f.exampleResponses.length > 0 ? `
  <div class="card">
    <h2>Contoh kalimat</h2>
    <div class="box example"><ul>${f.exampleResponses.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
  </div>` : ""}
  ` : ""}

  <div class="card">
    <h2>Transkrip percakapan</h2>
    <div class="chat">${chat}</div>
  </div>

  <footer>Laporan dibuat oleh RuangCakap — ${formatDate(new Date().toISOString())}</footer>
</div>
</body>
</html>`;
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

export function exportSessionReport(session: StoredSession): void {
  downloadBlob(
    `laporan-latihan-${session.courseId}-level${session.level}.html`,
    sessionToHtmlReport(session),
    "text/html;charset=utf-8",
  );
}

export function exportAllReport(sessions: StoredSession[]): void {
  const content = sessions
    .map(
      (s) =>
        `<div class="page-break">${sessionToHtmlReport(s)
          .replace("<!doctype html>", "")
          .replace(/<html lang="id">[\s\S]*?<body>/, "")
          .replace("</body></html>", "")}</div>`,
    )
    .join("\n");
  const page = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Riwayat Latihan RuangCakap</title>
<style>${REPORT_STYLE}</style>
</head>
<body>
<div class="page">${content}</div>
</body>
</html>`;
  downloadBlob(
    `riwayat-latihan-${new Date().toISOString().slice(0, 10)}.html`,
    page,
    "text/html;charset=utf-8",
  );
}
