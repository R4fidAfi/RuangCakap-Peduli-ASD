import { MessageCircleHeart } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-sage-200/80 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-leaf-500 text-forest-800 shadow-soft">
            <MessageCircleHeart className="h-5 w-5" />
          </span>
          <span className="truncate text-base font-bold tracking-tight text-forest-700 sm:text-lg">
            Ruang<span className="text-leaf-700">Cakap</span>
          </span>
        </a>
        <a
          href="/login"
          className="shrink-0 rounded-full bg-leaf-500 px-5 py-2.5 text-xs font-semibold text-forest-800 shadow-soft transition-all hover:-translate-y-0.5 hover:bg-leaf-600 sm:px-6 sm:text-sm"
        >
          Masuk
        </a>
      </nav>
    </header>
  );
}
