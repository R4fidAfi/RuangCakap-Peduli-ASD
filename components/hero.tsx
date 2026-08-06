import {
  Bot,
  Mic,
  Repeat,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

function AiBubble({
  text,
  typing = false,
}: {
  text?: string;
  typing?: boolean;
}) {
  return (
    <div className="flex items-end gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist-100 text-mist-600">
        <Bot className="h-4 w-4" />
      </span>
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
      {/* Soft ambient tints — calm, not gradient-mesh slop */}
      <div
        aria-hidden
        className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-sage-100/70 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-32 top-32 h-[28rem] w-[28rem] rounded-full bg-mist-50/80 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
        {/* Left: copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-white px-4 py-1.5 text-xs font-semibold text-leaf-700 shadow-soft">
            <span className="h-2 w-2 rounded-full bg-leaf-500" />
            Ruang latihan yang aman untuk remaja & dewasa
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-forest-800 sm:text-5xl">
            Berlatih percakapan,
            <br />
            tumbuhkan rasa{" "}
            <span className="relative whitespace-nowrap text-leaf-500">
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

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Hadapi situasi sosial sehari-hari — memesan makanan, bertanya arah,
            bicara dengan dokter — lewat simulasi percakapan bersama AI. Tenang,
            bertahap, dan bisa diulang kapan saja.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#latihan"
              className="rounded-full bg-leaf-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-leaf-600"
            >
              Mulai Latihan
            </a>
            <a
              href="#keunggulan"
              className="rounded-full border border-sage-300 bg-white px-7 py-3.5 text-sm font-semibold text-leaf-700 transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:bg-sage-100"
            >
              Cara kerjanya
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-ink-soft">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-leaf-500" />
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

        {/* Right: conversation mockup illustration */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden
            className="absolute -right-4 -top-6 h-24 w-24 rounded-3xl bg-sage-100 pattern-dots-green"
          />
          <div className="relative rounded-[2rem] border border-sage-200 bg-white p-6 shadow-lift">
            {/* Mock header */}
            <div className="flex items-center justify-between border-b border-sage-200 pb-4">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mist-100 text-mist-600">
                  <Bot className="h-5 w-5" />
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
              <AiBubble typing />
            </div>

            {/* Mock mic control */}
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-sage-200 bg-page px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-500 text-white shadow-soft">
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
