import { MessageCircleHeart } from "lucide-react";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/#latihan", label: "Latihan" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/progress", label: "Progress" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-sage-200/80 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-leaf-500 text-white shadow-soft">
            <MessageCircleHeart className="h-5 w-5" />
          </span>
          <span className="truncate text-base font-bold tracking-tight text-forest-700 sm:text-lg">
            Ruang<span className="text-leaf-500">Cakap</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-leaf-600"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#latihan"
          className="shrink-0 rounded-full bg-leaf-500 px-4 py-2.5 text-xs font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-leaf-600 sm:px-5 sm:text-sm"
        >
          Mulai Latihan
        </a>
      </nav>
    </header>
  );
}
