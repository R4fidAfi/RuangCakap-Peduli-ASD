import { HeartHandshake, Layers, MessageCircleHeart } from "lucide-react";
import Reveal from "./reveal";
import MaknaScene from "./makna-scene";

export default function Makna() {
  return (
    <section id="makna" className="border-y border-sage-200 bg-white/60">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          {/* Ilustrasi tematik — mengambang mengelilingi kartu */}
          <Reveal>
            <MaknaScene />
          </Reveal>

          {/* Teks makna */}
          <div>
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-widest text-leaf-700">
                Kenapa aplikasi ini ada
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-forest-800 sm:text-4xl">
                Kenapa aplikasi ini dibuat
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
                Banyak remaja dan dewasa penyandang autisme (ASD) mengalami
                kesulitan dalam situasi sosial sehari-hari — memesan makanan,
                bertanya arah, berbicara dengan dokter, atau menghadapi
                wawancara kerja. Kesulitan itu sering muncul karena jarang ada
                ruang untuk berlatih tanpa takut salah.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
                RuangCakap hadir sebagai jawabannya: ruang latihan yang aman,
                tempat kamu berlatih percakapan nyata bersama maskot AI,
                mendapat evaluasi yang suportif, dan berkembang selangkah demi
                selangkah — tanpa rasa dihakimi.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-7 flex flex-wrap gap-3 text-sm font-semibold text-leaf-700">
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
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
