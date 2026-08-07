import { HeartHandshake, Sparkles } from "lucide-react";
import Mascot from "./mascot";

/**
 * Ilustrasi tematik section Makna — "percakapan yang tumbuh":
 * maskot dikelilingi gelembung percakapan yang mengambang pelan,
 * dengan detak hati dan kerlip bintang. Semua gerakan halus &
 * hormat prefers-reduced-motion.
 */
export default function MaknaScene() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Gelembung "mengetik" — kiri atas */}
      <div
        className="float-soft absolute -left-2 top-8 z-10 rounded-3xl rounded-bl-md border border-mist-200 bg-mist-50 px-4 py-3 shadow-lift"
        style={{ animationDelay: "0.6s" }}
      >
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-mist-400" />
          <span className="h-2 w-2 rounded-full bg-mist-400" />
          <span className="h-2 w-2 rounded-full bg-mist-400" />
        </span>
      </div>

      {/* Gelembung hati — kanan atas */}
      <div
        className="float-soft absolute -right-2 top-20 z-10 rounded-3xl rounded-tr-md border border-sage-200 bg-white px-4 py-3 shadow-lift"
        style={{ animationDelay: "1.2s" }}
      >
        <HeartHandshake className="beat-soft h-5 w-5 text-leaf-600" />
      </div>

      {/* Chip kecil — bawah kiri */}
      <div
        className="float-soft absolute -bottom-3 left-8 z-10 inline-flex items-center gap-1.5 rounded-full border border-sage-200 bg-white px-3.5 py-1.5 text-xs font-bold text-leaf-700 shadow-lift"
        style={{ animationDelay: "1.8s" }}
      >
        <Sparkles className="twinkle-soft h-3.5 w-3.5 text-sun-400" />
        Latihan yang aman
      </div>

      {/* Kartu utama */}
      <div className="relative rounded-[2.5rem] border border-sage-200 bg-gradient-to-br from-white to-sage-100/70 p-10 shadow-lift sm:p-12">
        <div
          aria-hidden
          className="pattern-dots-green absolute inset-0 rounded-[2.5rem] opacity-60"
        />
        <div className="relative">
          <Mascot
            motion="idle"
            mood="happy"
            className="mx-auto h-32 w-32 drop-shadow-md"
          />
          <p className="mt-6 text-center text-sm font-bold text-forest-700">
            Tumbuh percaya diri,{" "}
            <span className="text-leaf-600">satu percakapan</span> setiap hari
          </p>
        </div>
      </div>
    </div>
  );
}
