import { MessageCircleHeart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-sage-200 bg-white/70">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-leaf-500 text-forest-800">
                <MessageCircleHeart className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-forest-700">
                Ruang<span className="text-leaf-700">Cakap</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              Ruang latihan komunikasi sosial yang aman, bertahap, dan personal
              — lewat percakapan bersama maskot AI.
            </p>
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
          © 2026 RuangCakap — Dibuat untuk perlombaan.
        </div>
      </div>
    </footer>
  );
}
