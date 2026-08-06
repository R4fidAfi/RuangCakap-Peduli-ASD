"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Search, SlidersHorizontal } from "lucide-react";
import { categories, courses } from "@/lib/courses";
import { getSessions } from "@/lib/storage";
import CourseCard from "./course-card";

export default function CourseSection() {
  const [activeCategory, setActiveCategory] = useState("semua");
  const [query, setQuery] = useState("");
  const [completedByCourse, setCompletedByCourse] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const map: Record<string, number> = {};
    for (const session of getSessions()) {
      map[session.courseId] = Math.max(
        map[session.courseId] ?? 0,
        session.level,
      );
    }
    setCompletedByCourse(map);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCategory =
        activeCategory === "semua" || course.category === activeCategory;
      const matchesQuery =
        q === "" ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <section id="latihan" className="mx-auto max-w-6xl px-6 py-20">
      {/* Section header */}
      <div className="max-w-2xl">
        <span className="text-sm font-bold uppercase tracking-widest text-leaf-500">
          Katalog Latihan
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-forest-800 sm:text-4xl">
          Pilih Latihanmu
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Pilih skenario yang paling dekat dengan situasi yang mau lu hadapi.
          Setiap latihan punya 3 tingkat kesulitan, jadi bisa dimulai dari yang
          paling tenang.
        </p>
      </div>

      {/* Toolbar: search + category chips */}
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari latihan…"
            aria-label="Cari latihan"
            className="w-full rounded-full border border-sage-200 bg-white py-3 pl-11 pr-4 text-sm text-ink shadow-soft placeholder:text-ink-faint focus:border-leaf-400 focus:outline-none"
          />
        </div>

        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 lg:justify-end"
          role="tablist"
          aria-label="Filter kategori"
        >
          <SlidersHorizontal className="mr-1 h-4 w-4 shrink-0 text-ink-faint" />
          {categories.map((category) => {
            const active = activeCategory === category.id;
            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(category.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "bg-leaf-500 text-white shadow-soft"
                    : "border border-sage-200 bg-white text-ink-soft hover:border-leaf-400 hover:text-leaf-700"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Canva-style course grid */}
      <div className="mt-8">
        <p className="text-sm font-medium text-ink-faint" aria-live="polite">
          Menampilkan {filtered.length} latihan
        </p>
        {filtered.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                completedLevels={completedByCourse[course.id] ?? 0}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-dashed border-sage-300 bg-white px-6 py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sage-100 text-leaf-500">
              <BookOpen className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-forest-700">
              Tidak ada latihan yang cocok
            </h3>
            <p className="mt-1 text-sm text-ink-soft">
              Coba ganti kata kunci atau pilih kategori lain.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveCategory("semua");
              }}
              className="mt-5 rounded-full border border-sage-300 bg-white px-5 py-2.5 text-sm font-semibold text-leaf-700 transition-all hover:bg-sage-100"
            >
              Tampilkan semua
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
