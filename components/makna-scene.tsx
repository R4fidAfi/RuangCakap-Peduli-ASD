import { MessageCircleHeart, Sparkles } from "lucide-react";
import Mascot from "./mascot";

/**
 * Ilustrasi tematik section Makna — "perkenalan Wahyu":
 * maskot melambai menyapa, lalu bubble chat muncul dengan efek
 * mengetik (titik muncul bergantian & menghilang), kemudian teks
 * perkenalan muncul pelan. First impression = Wahyu menyapa sendiri.
 * Semua gerakan halus & hormat prefers-reduced-motion.
 */
export default function MaknaScene() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Bintang kerlip di sekitar kartu */}
      <Sparkles
        aria-hidden
        className="twinkle-soft absolute -left-3 top-4 h-5 w-5 text-sun-400"
      />
      <Sparkles
        aria-hidden
        className="twinkle-soft absolute -right-2 top-24 h-4 w-4 text-leaf-500"
        style={{ animationDelay: "1.4s" }}
      />

      {/* Kartu utama: perkenalan Wahyu */}
      <div className="relative rounded-[2.5rem] border border-sage-200 bg-gradient-to-br from-white to-sage-100/70 p-7 shadow-lift sm:p-8">
        <div
          aria-hidden
          className="pattern-dots-green absolute inset-0 rounded-[2.5rem] opacity-60"
        />
        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:gap-4">
          {/* Maskot melambai menyapa */}
          <Mascot
            motion="wave"
            mood="happy"
            className="h-28 w-28 shrink-0 drop-shadow-md sm:h-32 sm:w-32"
          />

          {/* Bubble perkenalan */}
          <div
            className="pop-in relative min-w-0 flex-1 self-stretch rounded-3xl rounded-bl-md border border-sage-200 bg-white p-4 shadow-lift sm:self-auto"
            style={{ animationDelay: "1.3s" }}
          >
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-leaf-700">
              <MessageCircleHeart className="h-3.5 w-3.5" />
              Wahyu · AI Assistant
            </span>

            {/* Titik "sedang mengetik…" */}
            <span className="mt-2.5 flex gap-1.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="dot-typing h-1.5 w-1.5 rounded-full bg-mist-400"
                  style={{ animationDelay: `${1.6 + i * 0.22}s` }}
                />
              ))}
            </span>

            {/* Teks perkenalan */}
            <p
              className="fade-up mt-2 text-[13px] leading-relaxed text-ink"
              style={{ animationDelay: "2.3s" }}
            >
              Halo! Perkenalkan, aku{" "}
              <b className="text-leaf-700">Wahyu</b> — AI Assistant RuangCakap.
              Aku yang bakal menemani kamu berlatih percakapan, tanpa takut
              salah.
            </p>
          </div>
        </div>

        {/* Cap penyemangat */}
        <p
          className="fade-up relative mt-5 text-center text-xs font-semibold text-ink-faint"
          style={{ animationDelay: "3s" }}
        >
          <Sparkles className="twinkle-soft -mt-0.5 mr-1 inline h-3.5 w-3.5 text-sun-400" />
          Satu percakapan kecil hari ini = langkah besar untuk esok.
        </p>
      </div>
    </div>
  );
}
