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
    <Link
      href={`/skenario/${course.id}`}
      className="group flex items-center gap-3.5 rounded-2xl border border-sage-200 bg-white p-3.5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:shadow-lift"
    >
      {/* Tile ikon ala list (bukan cover besar) */}
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${theme.cover}`}
      >
        <Icon className={`h-5.5 w-5.5 ${theme.text}`} />
      </span>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-forest-700">
          {course.title}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-semibold text-leaf-700">
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
                className={`h-1.5 w-1.5 rounded-full ${
                  i < effective ? "bg-leaf-500" : "bg-sage-300"
                }`}
              />
            ))}
          </span>
          {course.tag && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-leaf-700 ring-1 ring-sage-200">
              {course.tag}
            </span>
          )}
        </div>
        {effective >= 1 && (
          <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-leaf-700">
            <Check className="h-3 w-3" /> Level {effective} selesai
          </p>
        )}
      </div>

      {/* Aksi */}
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
          effective >= 1
            ? "bg-leaf-500 text-forest-800"
            : "bg-sage-100 text-leaf-700 group-hover:bg-leaf-500 group-hover:text-forest-800"
        }`}
      >
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
