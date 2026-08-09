# PROPOSAL — RuangCakap
### Platform Latihan Komunikasi Sosial Berbasis AI untuk Remaja & Dewasa Penyandang Autisme (ASD)

---

## 1. Ringkasan Eksekutif

**RuangCakap** adalah platform web yang melatih keterampilan komunikasi sosial bagi remaja dan
dewasa penyandang Autism Spectrum Disorder (ASD) melalui percakapan simulasi yang aman bersama
maskot AI bernama **Wahyu**. Pengguna berlatih percakapan sehari-hari (memesan makanan, bertanya
arah, bicara dengan dokter, wawancara kerja, dll.) secara bergantian (turn-based) — lewat suara
maupun teks — lalu menerima evaluasi suportif dari AI yang menilai 6 aspek komunikasi, tanpa
hukuman, tanpa tekanan, dan tanpa rasa dihakimi.

Seluruh data latihan tersimpan lengkap di perangkat pengguna dan dapat diekspor menjadi laporan
rapi (JSON + laporan HTML) sebagai bukti perkembangan sekaligus bahan evaluasi.

---

## 2. Latar Belakang & Rumusan Masalah

### 2.1 Gangguan Spektrum Autisme (ASD) dan Komunikasi Sosial

Menurut DSM-5 (Diagnostic and Statistical Manual of Mental Disorders, edisi ke-5), ASD ditandai
oleh dua kelompok gejala utama:

1. **Defisit persisten dalam komunikasi dan interaksi sosial** — meliputi defisit dalam
   timbal-balik sosial-emosional (misalnya kesulitan memulai atau merespons percakapan), defisit
   perilaku komunikasi non-verbal, dan kesulitan membangun serta memahami hubungan.
2. **Pola perilaku, minat, atau aktivitas yang repetitif dan terbatas** — termasuk kepekaan
   sensorik yang khas (hiper- atau hipo-reaktivitas terhadap rangsangan sensorik).

Defisit komunikasi sosial ini berdampak nyata pada kehidupan sehari-hari: memesan makanan di
restoran, menanyakan arah, menyampaikan keluhan ke dokter, hingga menghadapi wawancara kerja
menjadi situasi yang menimbulkan kecemasan tinggi.

### 2.2 Masalah: Minimnya Ruang Latihan yang Aman

Pendekatan latihan konvensional (misalnya berlatih langsung dengan orang lain) memiliki hambatan:

- **Takut salah / takut dihakimi** — kesalahan di depan orang nyata berisiko sosial tinggi,
  sehingga pengguna cenderung menghindari latihan.
- **Ketersediaan terbatas** — terapis atau mitra latihan tidak selalu tersedia setiap saat.
- **Biaya** — terapi sosial skills (social skills training) membutuhkan biaya yang tidak
  terjangkau sebagian keluarga.
- **Kurangnya pengulangan** — keterampilan sosial butuh repetisi, tetapi repetisi dengan manusia
  nyata sulit dilakukan tanpa beban sosial.

### 2.3 Rumusan Masalah

> Bagaimana merancang platform digital berbasis AI yang menyediakan **ruang latihan komunikasi
> sosial yang aman, bertahap, adaptif, dan ramah sensorik** bagi remaja dan dewasa penyandang ASD
> — sehingga mereka dapat berlatih berulang kali tanpa rasa dihakimi dan melihat perkembangan
> mereka secara terukur?

---

## 3. Landasan Ilmiah

### 3.1 Social Skills Training (SST) dan Efektivitasnya

*Social Skills Training* adalah intervensi berbasis bukti untuk meningkatkan keterampilan sosial
pada penyandang ASD. Meta-analisis dan tinjauan sistematis menunjukkan bahwa intervensi
keterampilan sosial dapat memperbaiki kompetensi sosial, pengetahuan sosial, dan pengurangan
isolasi sosial. Komponen kunci SST yang diadopsi RuangCakap:

| Komponen SST | Penerapan di RuangCakap |
|---|---|
| Instruksi & pemodelan | Maskot Wahyu memerankan lawan bicara dan menjadi contoh alur percakapan |
| Behavioral rehearsal (latihan perilaku) | Percakapan simulasi turn-based dengan AI |
| Umpan balik | Evaluasi 6 aspek komunikasi setelah sesi |
| Penguatan positif | Apresiasi, badge achievement, tanpa hukuman |
| Generalisasi | 10 skenario mencakup 7 kategori situasi dunia nyata |

### 3.2 Behavioral Rehearsal & Simulasi Peran (Role-Play)

Prinsip *behavioral rehearsal*: keterampilan sosial meningkat ketika individu **berlatih
melakukan perilaku secara aktif** (bukan hanya mempelajari teori). Simulasi peran (role-play)
memberikan lingkungan yang aman untuk mencoba perilaku baru. RuangCakap menerapkan ini lewat
percakapan dua arah dengan AI yang memerankan berbagai peran (kasir, dokter, HRD, dst.) — pengguna
bukan sekadar membaca materi, melainkan **benar-benar berbicara**.

### 3.3 Prompting, Scaffolding, dan Fading

Dalam terapi perilaku, *prompting* (pemberian isyarat/bantuan) diikuti *fading* (pengurangan
bantuan bertahap) efektif membangun keterampilan baru. RuangCakap menerapkan prinsip ini melalui
**3 tingkat kesulitan**:

- **Level 1 — Tenang:** alur sederhana, tanpa komplikasi, AI sangat suportif (bantuan maksimal).
- **Level 2 — Standar:** variasi alur + satu komplikasi kecil (bantuan mulai dikurangi).
- **Level 3 — Menantang:** komplikasi nyata (pesanan salah, salah paham, perlu minta klarifikasi)
  — pengguna harus aktif menyelesaikan masalah (fading hampir penuh).

Penting: kenaikan tingkat **mengubah kondisi situasi, bukan mengubah kepribadian AI menjadi
kasar** — tekanan dinaikkan secara wajar, tetap aman.

### 3.4 Penguatan Positif (Positive Reinforcement)

Prinsip operant conditioning: perilaku yang diikuti konsekuensi menyenangkan cenderung diulang.
RuangCakap menerapkan **reward-only**:

- Skor & apresiasi setelah sesi (hanya memuji, tidak menghukum).
- Badge achievement otomatis (Langkah Pertama, Rajin Berlatih, Konsisten, Penjelajah, Cakap).
- Streak harian **tanpa hukuman**: putus streak tidak ada pesan menyalahkan — cukup "ayo mulai
  lagi hari ini".
- **Tidak ada nyawa (lives)**, tidak ada penalti, tidak ada timer menghitung mundur — kebalikan
  dari model gamifikasi yang menghukum (seperti yang banyak dipakai aplikasi lain).

### 3.5 Pembelajaran Adaptif & Mastery Learning

*Mastery learning*: peserta tidak lanjut ke materi berikutnya sebelum menguasai materi sekarang.
RuangCakap menerapkan:

- **Level gating:** Level 1 selalu terbuka; Level berikutnya terbuka hanya jika level sebelumnya
  "lolos" = sesi selesai + minimal 1 jawaban + skor rata-rata ≥ 60.
- **Rekomendasi adaptif (4 aturan):**
  1. Skor < 60 → sarankan mengulang latihan yang sama (penguatan).
  2. Skor ≥ 80 & masih ada level di atas → sarankan naik level.
  3. Ada aspek terlemah → sarankan skenario yang paling melatih aspek itu (peta aspek→skenario).
  4. Fallback → skenario baru / paling jarang dicoba.

### 3.6 Pertimbangan Sensorik & Desain Ramah ASD

Banyak penyandang ASD memiliki kepekaan sensorik: rangsangan visual yang berlebihan (animasi
menyala, warna kontras tinggi, efek berkedip) dapat menyebabkan ketidaknyamanan hingga overload.
Oleh karena itu RuangCakap menerapkan **kebijakan gerak tiga tingkat**:

1. **Mode Tenang (default):** tidak ada animasi menyala/berulang, tidak ada confetti/fireworks;
   transisi halaman berupa fade halus; perayaan memakai elemen statis (centang + teks).
2. **Mode Hidup (opt-in):** pengguna yang ingin animasi lebih dapat menyalakannya — keputusan di
   tangan pengguna, bukan dipaksakan sistem.
3. **Hormat prefers-reduced-motion:** jika sistem operasi pengguna mengatur "kurangi gerakan",
   semua animasi dimatikan otomatis (termasuk menghilangkan delay animasi).

Selain itu: font tunggal Plus Jakarta Sans (keterbacaan), kontras warna yang diperhitungkan
(teks gelap di atas hijau terang #58C200 — rasio kontras aman), border yang tegas, dan bahasa
yang sederhana & jelas.

### 3.7 Agen Percakapan (Conversational AI) untuk Pelatihan

Perkembangan *large language models* (LLM) memungkinkan simulasi percakapan yang dinamis dan
alami — lawan bicara AI dapat merespons secara kontekstual, bukan skrip kaku. Ini membuka
pendekatan "conversational agent untuk pelatihan keterampilan sosial": pengguna mendapat lawan
bicara yang selalu tersedia, tidak menghakimi, dan konsisten. Persona tetap (maskot Wahyu) juga
memberikan **prediktabilitas** — wajah dan suara yang sama di setiap sesi menenangkan dan
mengurangi kejutan sosial.

---

## 4. Solusi: RuangCakap

### 4.1 Konsep

> "Ruang latihan komunikasi sosial yang aman, ditemani maskot AI bernama Wahyu, dengan evaluasi
> suportif dan perkembangan bertahap."

Landing page menyampaikan esensi: kenapa aplikasi ini ada, keunggulan (simulasi nyata, feedback
suportif, bertahap & adaptif, aman sensorik), dan cara kerja — lalu mengajak masuk.

### 4.2 Konten Latihan (100% bersumber dari website)

**10 skenario, 7 kategori, 30 level (10 × 3):**

| Kategori | Skenario |
|---|---|
| Tempat Umum | Memesan Makanan (Populer), Bertanya Arah, Mengembalikan Barang |
| Kesehatan | Bicara dengan Dokter (Baru) |
| Dunia Kerja | Wawancara Kerja |
| Pertemanan | Kenalan dengan Orang Baru |
| Pendidikan | Bicara di Rapat Kelas |
| Sehari-hari | Meminta Bantuan, Membuat Janji Temu, Menyapa Tetangga |

Setiap level memiliki: peran AI, situasi, tujuan pengguna, komplikasi yang boleh muncul, dan
target jumlah giliran (L1 ±4-5, L2 ±5-6, L3 ±6-7).

### 4.3 Fitur & Alasan Ilmiahnya

| Fitur | Deskripsi | Alasan ilmiah |
|---|---|---|
| **Maskot Wahyu** | Satu karakter (gelembung + daun) memerankan semua peran; memperkenalkan diri di landing; ekspresi berubah (tenang/senang/berpikir/mendengarkan) | Persona konsisten = prediktabilitas & rasa aman; engagement emosional |
| **Login akun lokal** | Nama panggilan + PIN 4 digit + pilih avatar; data di browser | Privasi; tanpa database pihak ketiga; rasa memiliki akun tanpa biaya backend |
| **Katalog & level select** | Kartu level ala game (warna gradien per tingkat, bintang, gembok) | Gamified choice meningkatkan motivasi; bintang = umpan balik visual |
| **Ruang latihan turn-based** | AI bicara → pengguna menjawab via mikrofon (Web Speech API, id-ID) atau teks; giliran bergantian | Behavioral rehearsal; modalitas ganda = aksesibilitas |
| **Suara AI (TTS)** | AI membacakan pesannya; bisa dimatikan | Model auditory; dukungan membaca |
| **Tombol Selesai manual** | Pengguna bisa mengakhiri sesi kapan saja | Rasa kontrol = mengurangi kecemasan |
| **Evaluasi 6 aspek** | Kesesuaian jawaban, kejelasan isi, kesopanan, membuka percakapan, menutup percakapan, berani bertanya/klarifikasi — format: ringkasan → apresiasi → saran → contoh kalimat | Umpan balik terstruktur & suportif (SST); contoh kalimat = scaffolding |
| **Rekomendasi adaptif** | 4 aturan (ulang/naik level/aspek lemah/fallback) | Mastery learning; personalisasi |
| **Progress** | Ringkasan, skor per aspek/kategori/skenario, level tercapai, 5 badge achievement | Monitoring perkembangan; penguatan positif |
| **Riwayat + ekspor** | Semua sesi tersimpan; ekspor JSON (data mentah) & laporan HTML rapi | Transparansi; bahan bukti evaluasi |
| **Beranda** | Sapaan, target harian (1 sesi/hari, lingkaran progress), rekomendasi, lanjutkan latihan | Rutinitas ringan; habit formation tanpa tekanan |
| **Mode Tenang** | Default: tanpa animasi menyala; reduced-motion dihormati | Ramah sensorik (lihat 3.6) |

---

## 5. Teknologi & Arsitektur

### 5.1 Tech Stack

| Lapisan | Teknologi | Peran |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | SSR/SSG, routing, API routes |
| Bahasa | **TypeScript 5** | Keamanan tipe, maintainability |
| UI | **React 19** + **Tailwind CSS v4** | Komponen UI, design system |
| Ikon | **lucide-react** | Ikon stroke konsisten (anti-emoji-as-icon) |
| Font | **Plus Jakarta Sans** (next/font) | Tipografi tunggal |
| Penyimpanan | **localStorage** (rc_profile, rc_sessions) | Akun & riwayat lokal (tanpa backend) |
| AI | **SumoPod** (OpenAI-compatible) — model **gpt-4o-mini** (default), SSE streaming | Percakapan & evaluasi |
| Suara | **Web Speech API** — SpeechRecognition (id-ID) + speechSynthesis | Input suara & TTS (tanpa library) |
| Deploy | **Vercel** | Hosting serverless |

**Kenapa tidak membangun backend sendiri?** Sesuai ketentuan lomba, arsitektur backend tidak
dinilai; yang dinilai adalah fungsionalitas AI. Karena itu fokus diarahkan ke pengalaman
pengguna, kualitas prompting, dan kelengkapan data — bukan membangun REST API/database/auth
sendiri.

### 5.2 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Klien)                         │
│                                                                 │
│  Landing → Login → Beranda ── Latihan ── Skenario ── Level      │
│                                │              │                 │
│                                └──────────────┼── Practice Room │
│                                               ▼                 │
│                     Web Speech API (mic id-ID / TTS)            │
│                     localStorage (profil + riwayat)             │
└───────────────────────────────┬─────────────────────────────────┘
                                │ fetch() streaming (SSE)
┌───────────────────────────────▼─────────────────────────────────┐
│                   NEXT.JS API ROUTES (Server)                   │
│                                                                 │
│   /api/chat      → bangun prompt → SumoPod → stream balasan     │
│   /api/feedback  → bangun prompt evaluasi → SumoPod → JSON      │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS (SSE / chat completions)
┌───────────────────────────────▼─────────────────────────────────┐
│              SUMOPOD (OpenAI-compatible) — gpt-4o-mini          │
│         (key hanya di server: .env.local / Vercel env)          │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Alur Data Percakapan AI

1. Pengguna memilih skenario + level → halaman latihan membangun **system prompt** dari data
   skenario (peran AI, situasi, tujuan, komplikasi, aturan 10 poin) di server
   (`lib/ai/prompts.ts`).
2. Riwayat percakapan dikirim sebagai messages (role system/assistant/user) — dibatasi 40 giliran
   & 2000 karakter/pesan agar prompt tidak membengkak.
3. Response AI di-streaming via SSE; parser menyaring *reasoning_content* (jika model reasoning
   dipakai) sehingga hanya teks final yang tampil.
4. Protokol `[SELESAI]`: AI menandai akhir percakapan hanya saat pengguna berpamitan → sesi
   disimpan otomatis ke localStorage → pengguna diarahkan ke evaluasi.

### 5.4 Keamanan & Privasi

- **API key AI tidak pernah dikirim ke browser** — hanya ada di server (`.env.local` lokal /
  Environment Variables Vercel), dipanggil lewat API routes.
- **Tanpa database pihak ketiga**: semua data pengguna (profil, riwayat) ada di browser
  masing-masing — tidak ada server yang menyimpan data pribadi.
- Input divalidasi di server (role/panjang pesan) sebelum diteruskan ke AI.

---

## 6. User Flow

### 6.1 Alur Utama (Onboarding → Latihan → Evaluasi)

```
[Landing page]
   │  klik "Mulai Berlatih"
   ▼
[Login] — nama panggilan + PIN 4 digit + pilih avatar
   │  validasi lokal → simpan profil
   ▼
[Beranda] — sapaan "Hai, {nama}!" · target harian · rekomendasi adaptif · lanjutkan latihan
   │  pilih rekomendasi / buka menu Latihan
   ▼
[Katalog Latihan] — cari & filter (7 kategori) → pilih skenario
   ▼
[Halaman Skenario] — banner · deskripsi · PILIH LEVEL (Tenang/Standar/Menantang, bintang,
   gembok level terkunci) → CTA sticky "Mulai Latihan Level N" (HP) / panel samping (desktop)
   ▼
[Ruang Latihan] — briefing → percakapan turn-based (mic/teks) → AI menutup / tombol Selesai
   ▼
[Evaluasi] — ringkasan AI + 6 aspek + apresiasi + saran + contoh kalimat + transkrip
   │  otomatis tersimpan ke riwayat
   ▼
[Beranda/Progress] — status level diperbarui · badge · rekomendasi berikutnya
```

### 6.2 Alur Satu Sesi Latihan (detail)

1. **Briefing:** maskot Wahyu menyapa, menjelaskan peran & situasi (di HP: panel lipat
   "Situasi latihan").
2. **Giliran AI:** Wahyu (dalam peran) membuka percakapan; teks muncul dengan indikator
   mengetik; suara AI otomatis jika diaktifkan.
3. **Giliran pengguna:** tombol mikrofon (mendengarkan → hasil dikonversi ke teks) ATAU ketik →
   kirim.
4. **Loop** hingga: (a) AI mendeteksi pamit → `[SELESAI]`, atau (b) pengguna menekan "Selesai".
5. **Simpan otomatis** sesi (giliran lengkap + feedback bila ada) ke localStorage.
6. **Evaluasi:** panggil `/api/feedback` → 6 aspek (skor 0-100) + ringkasan + saran + contoh.
7. **Sistem update:** status level (lolos ≥60 / perlu ulang), statistik, achievement, dan
   rekomendasi berikutnya.

### 6.3 Alur Progress & Ekspor

```
Riwayat → daftar sesi (badge selesai/manual) → buka Evaluasi & Transkrip
       → ekspor JSON (data mentah) / Laporan HTML (dokumen rapi, siap print)
Progress → ringkasan · skor per aspek (bar) · per kategori (strip warna) · per skenario
        → achievement (5 badge) · rekomendasi adaptif
Profil → ganti avatar/nama · tujuan belajar (dropdown) · keluar (hapus akun lokal)
```

---

## 7. Teknologi yang Dapat Membantu ASD (Perbandingan)

| Teknologi | Potensi untuk ASD | Dipakai di RuangCakap? |
|---|---|---|
| **Speech-to-Text (ASR)** | Melatih berbicara; mengurangi hambatan menulis | ✓ Web Speech API (id-ID) |
| **Text-to-Speech (TTS)** | Dukungan membaca; model auditori | ✓ speechSynthesis |
| **Conversational AI (LLM)** | Lawan bicara dinamis, tanpa menghakimi, selalu tersedia | ✓ SumoPod / gpt-4o-mini |
| **Pembelajaran adaptif** | Konten menyesuaikan kemampuan individu | ✓ rekomendasi & level gating |
| **Gamifikasi positif** | Motivasi & kebiasaan | ✓ reward-only (XP, badge, streak lembut) |
| **Desain ramah sensorik** | Mencegah overstimulasi | ✓ Mode Tenang + reduced-motion |
| **Ekspor data** | Transparansi & evaluasi | ✓ JSON + laporan HTML |
| Virtual Reality (VR) | Imersi tinggi | ✗ tidak dipakai (biaya & kebutuhan perangkat) |
| Robot sosial | Kehadiran fisik | ✗ tidak dipakai (biaya) |

---

## 8. Inovasi & Keunggulan

1. **Maskot sebagai lawan bicara (bukan sekadar dekorasi)** — Wahyu memerankan semua peran;
   konsisten, prediktif, dan menenangkan. Ini membedakan dari chatbot generik.
2. **Evaluasi suportif 6 aspek + contoh kalimat** — bukan skor mental yang mempermalukan.
3. **Sensory-safe by default** — Mode Tenang bawaan + hormat prefers-reduced-motion; "aksesibilitas
   sensorik sebagai fitur inti, bukan tambahan".
4. **Tanpa backend, tetap berdaya** — seluruh sistem (akun, riwayat, rekomendasi) berjalan di
   browser; sesuai ketentuan lomba, fokus pada fungsionalitas AI.
5. **Adaptif berbasis aturan sederhana** — transparan & dapat dijelaskan (tidak kotak hitam).
6. **Bukti lengkap** — riwayat percakapan tersimpan penuh + ekspor laporan rapi untuk penilaian.

---

## 9. Validasi & Bukti

- **Uji fungsional menyeluruh:** build bersih (TypeScript check), semua rute HTTP 200, API
  `/api/chat` & `/api/feedback` teruji dengan skenario nyata (pembuka → lanjutan → penutup →
  evaluasi 6 aspek dengan JSON valid).
- **Prompt engineering terdokumentasi** di `docs/prompts.md` (10 aturan + iterasi + alasan) —
  bukti penilaian prompting.
- **Riwayat lengkap + ekspor** (JSON & laporan HTML) — bahan bukti proposal & penilaian.
- **Desain & aksesibilitas:** audit kontras, border 1.5px, fokus ring keyboard, reduced-motion.

---

## 10. Pengembangan ke Depan

1. **Aset maskot 3D final** (render Blender → Lottie/WebP) menggantikan placeholder SVG.
2. **Mode Hidup** (animasi lebih hidup, opt-in) & pengaturan preferensi sensorik per pengguna.
3. **Spaced repetition terjadwal** — pengingat lembut untuk mengulang aspek lemah.
4. **Sesi multi-peran / percakapan kelompok** (rapat, obrolan 2+ orang).
5. **Laporan kemajuan berkala** (mingguan) yang bisa dibagikan ke orang tua/pendamping.
6. **Dukungan multibahasa** & lebih banyak skenario komunitas.
7. **Autentikasi nyata & sinkronisasi cloud** pasca-lomba (ketika backend diizinkan).

---

## 11. Penutup

RuangCakap memadukan pendekatan ilmiah *social skills training* (behavioral rehearsal,
prompting-fading, penguatan positif, mastery learning) dengan teknologi AI percakapan modern,
dalam desain yang ramah sensorik. Dengan 10 skenario nyata, 30 level bertahap, evaluasi suportif,
dan rekomendasi adaptif — RuangCakap menjadi jembatan bagi remaja dan dewasa penyandang ASD untuk
tumbuh percaya diri, satu percakapan setiap hari.

> *"RuangCakap — ruang latihan komunikasi sosial yang aman, bertahap, dan personal."*
