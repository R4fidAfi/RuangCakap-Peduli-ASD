import { Layers, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Aman & suportif",
    text: "Tidak ada penilaian yang menghakimi. Setiap latihan ditutup dengan apresiasi dan saran yang membangun.",
  },
  {
    icon: Layers,
    title: "Bertahap sesuai kemampuan",
    text: "Setiap skenario punya tingkat kesulitan yang naik pelan-pelan — dari situasi tenang sampai yang menantang.",
  },
  {
    icon: Sparkles,
    title: "Personal & adaptif",
    text: "Rekomendasi latihan menyesuaikan perkembanganmu, jadi setiap sesi terasa relevan dan berguna.",
  },
];

export default function Benefits() {
  return (
    <section id="keunggulan" className="mx-auto max-w-6xl px-6 pb-8">
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-sage-200 bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sage-100 text-leaf-600">
              <item.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-forest-700">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
