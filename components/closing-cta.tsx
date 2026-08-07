import { ArrowRight, MessageCircleHeart } from "lucide-react";

export default function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-sage-200 bg-gradient-to-br from-sage-100 via-white to-mist-50 px-6 py-16 text-center shadow-soft sm:px-10">
        <div
          aria-hidden
          className="absolute inset-0 pattern-dots-green opacity-60"
        />
        <div className="relative">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-leaf-500 text-forest-800 shadow-lift">
            <MessageCircleHeart className="h-7 w-7" />
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-forest-800 sm:text-4xl">
            Siap berlatih?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-soft">
            Buat akun lokal kamu dan mulai latihan pertama — satu percakapan
            kecil hari ini adalah langkah besar untuk esok.
          </p>
          <a
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-leaf-500 px-8 py-4 text-sm font-bold text-forest-800 shadow-lift transition-all hover:-translate-y-0.5 hover:bg-leaf-600"
          >
            Masuk & Mulai Berlatih
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
