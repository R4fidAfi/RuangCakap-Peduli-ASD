import {
  Mic,
  Repeat,
  ShieldCheck,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import Mascot from "./mascot";

function AiBubble({ text }: { text: string }) {
  return (
    <div className="flex items-end gap-2.5">
      <Mascot mood="default" className="h-8 w-8 shrink-0" />
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-mist-200 bg-mist-50 px-4 py-3 text-sm leading-relaxed text-ink">
        {text}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-sage-100 px-4 py-3 text-sm leading-relaxed text-ink">
        {text}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft ambient tints */}
      <div
        aria-hidden
        className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-sage-100/70 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-32 top-32 h-[28rem] w-[28rem] rounded-full bg-mist-50/80 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-28">
        {/* Left: copy */}
        <div>
          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-forest-800 sm:text-5xl">
            Berlatih percakapan,
            <br />
            tumbuhkan rasa{" "}
            <span className="relative whitespace-nowrap text-leaf-700">
              percaya diri
              <svg
                aria-hidden
                viewBox="0 0 220 12"
                className="absolute -bottom-1.5 left-0 h-3 w-full text-sage-300"
                fill="none"
              >
                <path
                  d="M3 9c40-6 130-6 214-3"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            RuangCakap adalah ruang latihan komunikasi sosial berbasis AI untuk
            remaja dan dewasa penyandang autisme (ASD). Hadapi situasi
            sehari-hari — memesan makanan, bertanya arah, bicara dengan dokter —
            lewat percakapan bersama maskot AI, dalam suasana yang tenang,
            bertahap, dan bebas dari rasa dihakimi.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="/login"
              className="rounded-full bg-leaf-500 px-6 py-3 text-sm font-semibold text-forest-800 shadow-lift transition-all hover:-translate-y-0.5 hover:bg-leaf-600 sm:px-7 sm:py-3.5"
            >
              Mulai Berlatih
            </a>
            <a
              href="#keunggulan"
              className="rounded-full border border-sage-300 bg-white px-6 py-3 text-sm font-semibold text-leaf-700 transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:bg-sage-100 sm:px-7 sm:py-3.5"
            >
              Kenapa RuangCakap
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-2.5 text-sm font-medium text-ink-soft">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-leaf-700" />
              Aman & suportif
            </li>
            <li className="flex items-center gap-2">
              <Repeat className="h-4.5 w-4.5 text-mist-400" />
              Bisa diulang
            </li>
            <li className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-teal-400" />
              Bertahap
            </li>
          </ul>
        </div>

        {/* Right: conversation mockup */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden
            className="absolute -right-3 -top-5 h-20 w-20 rounded-3xl bg-sage-100 pattern-dots-green sm:-right-4 sm:-top-6 sm:h-24 sm:w-24"
          />
          <div className="relative rounded-[2rem] border border-sage-200 bg-white p-5 shadow-lift sm:p-6">
            {/* Mock header */}
            <div className="flex items-center justify-between border-b border-sage-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sage-100 via-sage-100/60 to-white">
                  <UtensilsCrossed className="h-5.5 w-5.5 text-forest-700" />
                </span>
                <div>
                  <p className="text-sm font-bold text-forest-700">
                    Kasir Restoran
                  </p>
                  <p className="text-xs text-ink-faint">Skenario · Level 1</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-leaf-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf-500" />
                </span>
                Mendengarkan
              </span>
            </div>

            {/* Mock conversation */}
            <div className="mt-5 space-y-4">
              <AiBubble text="Halo, selamat datang! Ada yang bisa saya bantu hari ini?" />
              <UserBubble text="Saya mau pesan nasi goreng satu, pak." />
            </div>

            {/* Mock mic control */}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-sage-200 bg-page px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-500 text-forest-800 shadow-soft">
                  <Mic className="h-4 w-4" />
                </span>
                Tekan untuk berbicara
              </span>
              <span className="text-xs font-medium text-ink-faint">
                atau ketik jawaban
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
