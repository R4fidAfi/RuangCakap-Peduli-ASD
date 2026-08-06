import { MessageCircleHeart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-sage-200 bg-white/70">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-leaf-500 text-white">
                <MessageCircleHeart className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-forest-700">
                Ruang<span className="text-leaf-500">Cakap</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Ruang latihan komunikasi sosial yang aman, bertahap, dan personal
              — lewat simulasi percakapan bersama AI.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-forest-700">Jelajahi</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              <li><a href="/#latihan" className="transition-colors hover:text-leaf-600">Katalog Latihan</a></li>
              <li><a href="/#keunggulan" className="transition-colors hover:text-leaf-600">Kenapa RuangCakap</a></li>
              <li><a href="/riwayat" className="transition-colors hover:text-leaf-600">Riwayat Latihan</a></li>
              <li><a href="/progress" className="transition-colors hover:text-leaf-600">Progress</a></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-sage-200 bg-sage-100/60 p-5">
            <h4 className="text-sm font-bold text-forest-700">
              Perlu diketahui
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              RuangCakap adalah alat latihan komunikasi — bukan alat diagnosis
              medis dan bukan pengganti terapi profesional.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-sage-200 pt-6 text-center text-xs text-ink-faint">
          © 2026 - RuangCakap —
        </div>
      </div>
    </footer>
  );
}
