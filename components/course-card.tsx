import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Course } from "@/lib/courses";
import { categoryLabel } from "@/lib/courses";
import { themeClasses } from "@/lib/themes";
import { courseIcons } from "./icons";

export default function CourseCard({
  course,
  completedLevels = 0,
}: {
  course: Course;
  /** Level tertinggi yang sudah diselesaikan (dari localStorage). */
  completedLevels?: number;
}) {
  const theme = themeClasses[course.theme];
  const Icon = courseIcons[course.icon];
  const effective = Math.max(course.completed ? 1 : 0, completedLevels);

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
          className={`absolute bottom-4 left-4 right-4 text-lg font-bold leading-snug tracking-tight sm:text-xl ${theme.text}`}
        >
          {course.title}
        </h3>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {course.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-leaf-700">
              {categoryLabel(course.category)}
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
                    i < effective ? "bg-leaf-500" : "bg-sage-300"
                  }`}
                />
              ))}
            </span>
          </div>

          <Link
            href={`/skenario/${course.id}`}
            aria-label={`Mulai latihan ${course.title}`}
            className="inline-flex items-center gap-1 rounded-full bg-leaf-500 px-4 py-2 text-xs font-bold text-white transition-all group-hover:gap-1.5 hover:bg-leaf-600"
          >
            {effective >= 1 ? (
              <>
                Lanjut <ArrowUpRight className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Mulai <ArrowUpRight className="h-3.5 w-3.5" />
              </>
            )}
          </Link>
        </div>

        {effective >= 1 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-leaf-600">
            <Check className="h-3.5 w-3.5" /> Level {effective} selesai —
            lanjut Level {Math.min(3, effective + 1)}
          </p>
        )}
      </div>
    </article>
  );
}
