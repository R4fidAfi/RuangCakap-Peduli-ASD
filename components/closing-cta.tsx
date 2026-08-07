import { ArrowRight } from "lucide-react";
import Mascot from "./mascot";

export default function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-leaf-400 via-leaf-500 to-leaf-600 px-6 py-16 text-center shadow-lift sm:px-10">
        <div
          aria-hidden
          className="absolute inset-0 pattern-dots-light opacity-50"
        />
        <div className="relative">
          <Mascot mood="happy" className="mx-auto h-24 w-24 drop-shadow-md" />
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-forest-800 sm:text-4xl">
            Siap berlatih?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-forest-800/80">
            Buat akun lokal kamu dan mulai latihan pertama — satu percakapan
            kecil hari ini adalah langkah besar untuk esok.
          </p>
          <a
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-800 px-8 py-4 text-sm font-bold text-white shadow-lift transition-all hover:-translate-y-0.5 hover:bg-forest-700"
          >
            Masuk & Mulai Berlatih
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
