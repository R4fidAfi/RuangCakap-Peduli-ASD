import { MessageCircle, Sparkles, Target } from "lucide-react";

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
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-leaf-700">
          Cara kerja
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-forest-800 sm:text-4xl">
          Tiga langkah sederhana
        </h2>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative rounded-3xl border border-sage-200 bg-white p-7 shadow-soft"
          >
            <span className="absolute right-6 top-6 text-4xl font-bold text-sage-200">
              {index + 1}
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-100 text-leaf-600">
              <step.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-forest-700">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {step.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
