import { ArrowUpRight, Check } from "lucide-react";
import type { Course } from "@/lib/courses";
import { courseIcons } from "./icons";

const themeClasses: Record<
  Course["theme"],
  { cover: string; pattern: string; text: string }
> = {
  mint: {
    cover: "bg-gradient-to-br from-sage-100 via-sage-100/60 to-white",
    pattern: "pattern-dots-green",
    text: "text-forest-700",
  },
  mist: {
    cover: "bg-gradient-to-br from-mist-100 via-mist-50 to-white",
    pattern: "pattern-dots-green",
    text: "text-mist-700",
  },
  teal: {
    cover: "bg-gradient-to-br from-teal-200/70 via-teal-200/30 to-white",
    pattern: "pattern-dots-green",
    text: "text-teal-600",
  },
  forest: {
    cover: "bg-gradient-to-br from-forest-700 via-leaf-600 to-leaf-400",
    pattern: "pattern-dots-light",
    text: "text-white",
  },
  sun: {
    cover: "bg-gradient-to-br from-sun-100 via-sun-100/50 to-white",
    pattern: "pattern-dots-green",
    text: "text-forest-700",
  },
};

const categoryLabel: Record<string, string> = {
  "sehari-hari": "Sehari-hari",
  "tempat-umum": "Tempat Umum",
  pendidikan: "Pendidikan",
  pertemanan: "Pertemanan",
  kesehatan: "Kesehatan",
  "dunia-kerja": "Dunia Kerja",
};

export default function CourseCard({ course }: { course: Course }) {
  const theme = themeClasses[course.theme];
  const Icon = courseIcons[course.icon];

  return (
    <article className="group overflow-hidden rounded-3xl border border-sage-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      {/* Cover — the Canva-like colorful thumbnail */}
      <div className={`relative h-40 overflow-hidden ${theme.cover}`}>
        <div
          aria-hidden
          className={`absolute inset-0 ${theme.pattern} opacity-70`}
        />
        {course.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-leaf-700 shadow-soft backdrop-blur-sm">
            {course.tag}
          </span>
        )}
        <div className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-white/80 text-leaf-600 shadow-soft backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5.5 w-5.5" />
        </div>
        <h3
          className={`absolute bottom-4 left-4 right-4 text-xl font-bold leading-snug tracking-tight ${theme.text}`}
        >
          {course.title}
        </h3>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {course.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-leaf-700">
              {categoryLabel[course.category] ?? course.category}
            </span>
            <span
              className="flex items-center gap-1"
              title="3 tingkat kesulitan"
              aria-label="3 tingkat kesulitan"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    course.completed || i === 0
                      ? "bg-leaf-500"
                      : "bg-sage-300"
                  }`}
                />
              ))}
            </span>
          </div>

          <a
            href="#"
            aria-label={`Mulai latihan ${course.title}`}
            className="inline-flex items-center gap-1 rounded-full bg-leaf-500 px-4 py-2 text-xs font-bold text-white transition-all group-hover:gap-1.5 hover:bg-leaf-600"
          >
            {course.completed ? (
              <>
                Ulangi <ArrowUpRight className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Mulai <ArrowUpRight className="h-3.5 w-3.5" />
              </>
            )}
          </a>
        </div>

        {course.completed && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-leaf-600">
            <Check className="h-3.5 w-3.5" /> Level 1 selesai — lanjut ke Level 2
          </p>
        )}
      </div>
    </article>
  );
}
