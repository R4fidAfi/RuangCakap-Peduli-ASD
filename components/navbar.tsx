import { MessageCircleHeart } from "lucide-react";

const links = [
  { href: "#", label: "Beranda" },
  { href: "#latihan", label: "Latihan" },
  { href: "#", label: "Riwayat" },
  { href: "#", label: "Progress" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-sage-200/80 bg-white/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-leaf-500 text-white shadow-soft">
            <MessageCircleHeart className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-forest-700">
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
          className="rounded-full bg-leaf-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-leaf-600"
        >
          Mulai Latihan
        </a>
      </nav>
    </header>
  );
}
