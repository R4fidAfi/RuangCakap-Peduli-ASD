# RuangCakap — Latihan Komunikasi Sosial Berbasis AI

Platform latihan komunikasi sosial berbasis AI untuk remaja dan dewasa
penyandang Autism Spectrum Disorder (ASD). Pengguna berlatih menghadapi
situasi sosial sehari-hari (memesan makanan, bertanya arah, bicara dengan
dokter, wawancara kerja, dan lainnya) melalui simulasi percakapan bersama AI
— lewat suara maupun teks — dalam ruang yang aman, bertahap, dan suportif.

> RuangCakap adalah alat latihan komunikasi — bukan alat diagnosis medis dan
> bukan pengganti terapi profesional.

## Fitur

- Learning Journey — kategori & jalur latihan bertahap
- Scenario Library — 10 skenario × 3 tingkat kesulitan (Tenang/Standar/Menantang)
- AI Voice Conversation Simulation — AI bicara, pengguna menjawab lewat mikrofon (Web Speech API) atau teks
- AI Feedback — evaluasi 6 aspek komunikasi + saran + contoh kalimat (suportif, tanpa menghakimi)
- Adaptive Learning — rekomendasi latihan berikutnya berdasarkan hasil evaluasi AI
- Progress & Riwayat — statistik, level tercapai, ekspor bukti (JSON/Markdown)

## Teknologi

- Next.js (App Router) + TypeScript + Tailwind CSS
- AI: SumoPod (OpenAI-compatible) — model `gpt-4o-mini` (lihat `docs/prompts.md`)
- Suara: Web Speech API bawaan browser (SpeechRecognition + speechSynthesis)
- Penyimpanan: localStorage (tanpa database — sesuai aturan lomba)
- Deploy: Vercel

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi SUMOPOD_API_KEY
npm run dev
```

Buka http://localhost:3000 — gunakan Chrome/Edge agar mode suara berfungsi.

## Environment Variables

| Variabel | Keterangan |
| --- | --- |
| `SUMOPOD_API_KEY` | API key SumoPod (wajib, rahasia — jangan di-commit) |
| `SUMOPOD_BASE_URL` | Default `https://ai.sumopod.com/v1` |
| `AI_MODEL` | Default `gpt-4o-mini` (bisa `deepseek-v4-flash`, dll) |

## Struktur

- `app/` — halaman & route handler (`/api/chat`, `/api/feedback`)
- `components/` — UI (hero, katalog, ruang latihan, level picker, dst.)
- `lib/` — data skenario, prompt builder, pemanggil AI, storage, stats, adaptive
- `docs/prompts.md` — dokumentasi prompt engineering (bukti penilaian)
- `.env.local` — kredensial (terlindungi .gitignore)
