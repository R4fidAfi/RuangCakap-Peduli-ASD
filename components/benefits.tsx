import {
  Layers,
  MessageCircle,
  MoonStar,
  ShieldCheck,
} from "lucide-react";

export default function Benefits() {
  return (
    <section id="keunggulan" className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
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

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {[
          {
            icon: MessageCircle,
            title: "Simulasi percakapan nyata",
            text: "Bicara langsung dengan maskot AI lewat suara atau teks, dalam situasi yang menyerupai kehidupan sehari-hari — dari memesan makanan sampai wawancara kerja. Percakapan mengalir alami, bukan dialog kaku.",
          },
          {
            icon: ShieldCheck,
            title: "Feedback yang suportif",
            text: "Setelah latihan, kamu mendapat evaluasi 6 aspek komunikasi dengan apresiasi, saran, dan contoh kalimat. Tidak ada penilaian yang menghakimi — yang ada hanya dorongan untuk berkembang.",
          },
          {
            icon: Layers,
            title: "Bertahap & adaptif",
            text: "Setiap skenario punya 3 tingkat kesulitan yang naik pelan-pelan. Rekomendasi latihan menyesuaikan perkembanganmu — kalau satu aspek masih lemah, sistem menyarankan latihan yang tepat.",
          },
          {
            icon: MoonStar,
            title: "Aman & tenang untuk sensorik",
            text: "Mode Tenang adalah bawaan: tanpa animasi menyala, tanpa efek berkilau, tanpa tekanan waktu. Semua bisa diulang kapan saja — dirancang ramah untuk kepekaan sensorik.",
          },
        ].map((item) => (
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
