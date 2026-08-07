import {
  Layers,
  MessageCircle,
  MoonStar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Reveal from "./reveal";

export default function Benefits() {
  return (
    <section id="keunggulan" className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-leaf-700">
            Kenapa RuangCakap
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-forest-800 sm:text-4xl">
            Lebih dari sekadar chatbot
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            RuangCakap dirancang khusus sebagai ruang latihan yang aman: kamu
            boleh salah, boleh mengulang, dan tetap dihargai setiap langkahnya.
          </p>
        </div>
      </Reveal>

      {/* Layout bento: posisi kartu bervariasi */}
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Kartu lebar 1: simulasi nyata */}
        <Reveal className="lg:col-span-2">
          <article className="group relative h-full overflow-hidden rounded-3xl border border-sage-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-leaf-300 hover:shadow-lift sm:p-8">
            <div
              aria-hidden
              className="float-soft absolute -right-6 -top-6 h-28 w-28 rounded-full bg-sage-100/70"
              style={{ animationDelay: "0.8s" }}
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-leaf-400 to-leaf-500 text-forest-800 shadow-soft">
                <MessageCircle className="h-8 w-8" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-forest-700">
                  Simulasi percakapan nyata
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Bicara langsung dengan maskot AI lewat suara atau teks, dalam
                  situasi sehari-hari — dari memesan makanan sampai wawancara
                  kerja. Percakapan mengalir alami, bukan dialog kaku.
                </p>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Kartu sempit: feedback suportif */}
        <Reveal delay={90}>
          <article className="group relative h-full overflow-hidden rounded-3xl border border-sage-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-leaf-300 hover:shadow-lift">
            <span
              aria-hidden
              className="twinkle-soft absolute right-5 top-5 text-sun-400"
            >
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-mist-100 to-mist-200 text-mist-600 shadow-soft transition-transform duration-300 group-hover:scale-110">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-forest-700">
              Feedback yang suportif
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Evaluasi 6 aspek komunikasi dengan apresiasi, saran, dan contoh
              kalimat — tanpa penilaian yang menghakimi.
            </p>
          </article>
        </Reveal>

        {/* Kartu sempit: bertahap & adaptif */}
        <Reveal delay={140}>
          <article className="group relative h-full overflow-hidden rounded-3xl border border-sage-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-leaf-300 hover:shadow-lift">
            <span
              aria-hidden
              className="float-soft absolute -bottom-5 -right-5 h-20 w-20 rounded-full bg-mist-50"
              style={{ animationDelay: "1.2s" }}
            />
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-200 to-teal-400/70 text-teal-600 shadow-soft transition-transform duration-300 group-hover:scale-110">
              <Layers className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-forest-700">
              Bertahap & adaptif
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              3 tingkat kesulitan yang naik pelan-pelan, plus rekomendasi yang
              menyesuaikan perkembanganmu.
            </p>
          </article>
        </Reveal>

        {/* Kartu lebar 2: aman & tenang untuk sensorik */}
        <Reveal delay={90} className="lg:col-span-2">
          <article className="group relative h-full overflow-hidden rounded-3xl border border-sage-200 bg-gradient-to-br from-sage-100/80 via-white to-mist-50 p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-leaf-300 hover:shadow-lift sm:p-8">
            <div className="relative flex flex-col gap-5 pl-2 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-forest-700">
                  Aman & tenang untuk sensorik
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Mode Tenang adalah bawaan: tanpa animasi menyala, tanpa efek
                  berkilau, tanpa tekanan waktu. Semua bisa diulang kapan saja —
                  dirancang ramah untuk kepekaan sensorik.
                </p>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-leaf-600 shadow-soft">
                <MoonStar className="h-7 w-7" />
              </span>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
