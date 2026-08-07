import { MessageCircle, MoveRight, Sparkles, Target } from "lucide-react";
import Reveal from "./reveal";

const steps = [
  {
    icon: Target,
    title: "Pilih situasi",
    text: "Pilih skenario yang ingin kamu latih dari katalog, lalu tentukan tingkat kesulitannya — mulai dari yang paling tenang.",
  },
  {
    icon: MessageCircle,
    title: "Bicara dengan maskot",
    text: "Maskot AI memerankan lawan bicara sesuai skenario. Kamu menjawab lewat mikrofon atau mengetik — percakapan berjalan bergantian seperti sungguhan.",
  },
  {
    icon: Sparkles,
    title: "Terima evaluasi & rekomendasi",
    text: "Dapatkan penilaian 6 aspek komunikasi, saran, dan contoh kalimat yang membangun — plus rekomendasi latihan berikutnya yang sesuai.",
  },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-leaf-700">
            Cara kerja
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-forest-800 sm:text-4xl">
            Tiga langkah sederhana
          </h2>
        </div>
      </Reveal>

      <div className="relative mt-14">
        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 110}>
              <div className="relative h-full rounded-3xl border border-sage-200 bg-white p-7 pt-8 shadow-soft transition-all hover:-translate-y-1 hover:border-leaf-300 hover:shadow-lift">
                {/* Nomor langkah */}
                <span className="absolute -top-5 left-6 grid h-10 w-10 place-items-center rounded-full bg-leaf-500 text-sm font-bold text-forest-800 shadow-lift">
                  {index + 1}
                </span>
                <span className="mt-2 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-leaf-400 to-leaf-500 text-forest-800 shadow-soft">
                  <step.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-forest-700">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Penghubung antar langkah (desktop) */}
        {[
          { left: "left-1/3", delay: "0s" },
          { left: "left-2/3", delay: "0.7s" },
        ].map((arrow, i) => (
          <span
            key={i}
            aria-hidden
            className={`absolute top-[26px] z-10 hidden -translate-x-1/2 md:grid ${arrow.left} h-8 w-8 place-items-center rounded-full border border-sage-200 bg-white text-leaf-700 shadow-soft`}
            style={{ animationDelay: arrow.delay }}
          >
            <MoveRight className="drift-soft h-4 w-4" />
          </span>
        ))}
      </div>
    </section>
  );
}
