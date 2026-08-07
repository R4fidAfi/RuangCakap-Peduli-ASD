import { HeartHandshake, Layers, MessageCircleHeart } from "lucide-react";

export default function Makna() {
  return (
    <section id="makna" className="border-y border-sage-200 bg-white/60">
      <div className="mx-auto max-w-4xl px-5 py-20 sm:px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-sage-100 text-leaf-600">
          <HeartHandshake className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-forest-800 sm:text-4xl">
          Kenapa aplikasi ini ada
        </h2>
        <div className="mt-6 space-y-5 text-center">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Banyak remaja dan dewasa penyandang autisme (ASD) mengalami
            kesulitan dalam situasi sosial sehari-hari — memesan makanan,
            bertanya arah, berbicara dengan dokter, atau menghadapi wawancara
            kerja. Kesulitan itu sering muncul karena jarang ada ruang untuk
            berlatih tanpa takut salah.
          </p>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            RuangCakap hadir sebagai jawabannya: sebuah ruang latihan yang aman,
            tempat kamu berlatih percakapan nyata bersama maskot AI, mendapat
            evaluasi yang suportif, dan berkembang selangkah demi selangkah —
            tanpa rasa dihakimi.
          </p>
          <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-3 text-sm font-semibold text-leaf-700">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-4 py-1.5">
              <MessageCircleHeart className="h-4 w-4" /> Bicara nyata
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-4 py-1.5">
              <Layers className="h-4 w-4" /> Bertahap
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-4 py-1.5">
              <HeartHandshake className="h-4 w-4" /> Suportif
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
