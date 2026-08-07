import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Layers, Mic, MessageCircle } from "lucide-react";
import RequireAuth from "@/components/require-auth";
import { categoryLabel, getCourse } from "@/lib/courses";
import { getScenarioLevels } from "@/lib/scenarios";
import { themeClasses } from "@/lib/themes";
import { courseIcons } from "@/components/icons";
import LevelPicker from "@/components/level-picker";

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCourse(id);
  const levels = getScenarioLevels(id);
  if (!course || !levels) notFound();

  const theme = themeClasses[course.theme];
  const Icon = courseIcons[course.icon];

  return (
    <RequireAuth>
      <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/latihan"
        className="inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-leaf-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke katalog latihan
      </Link>

      {/* Cover banner */}
      <div
        className={`relative mt-6 overflow-hidden rounded-[2rem] ${theme.cover}`}
      >
        <div
          aria-hidden
          className={`absolute inset-0 ${theme.pattern} opacity-70`}
        />
        {course.tag && (
          <span className="absolute left-6 top-6 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-bold text-leaf-700 shadow-soft backdrop-blur-sm">
            {course.tag}
          </span>
        )}
        <div
          aria-hidden
          className="absolute -bottom-10 -right-6 grid h-44 w-44 place-items-center rounded-[2.5rem] bg-white/25 backdrop-blur-sm"
        >
          <Icon className="h-20 w-20 text-white/80" />
        </div>
        <div className="relative px-6 py-10 sm:px-10 sm:py-16">
          <h1
            className={`max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl ${theme.text}`}
          >
            {course.title}
          </h1>
        </div>
      </div>

      {/* Meta row */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-ink-soft">
        <span className="rounded-full bg-sage-100 px-4 py-1.5 text-leaf-700">
          {categoryLabel(course.category)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-200 bg-white px-4 py-1.5">
          <Layers className="h-4 w-4 text-leaf-500" /> 3 tingkat kesulitan
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-200 bg-white px-4 py-1.5">
          <Clock className="h-4 w-4 text-mist-400" /> ±5–8 menit per sesi
        </span>
      </div>

      {/* Description */}
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-soft">
        {course.description} Dalam latihan ini, AI berperan sebagai{" "}
        <span className="font-semibold text-ink">{levels[0].aiRole}</span>.
        Kamu berlatih dari situasi paling tenang sampai situasi yang lebih
        kompleks, sesuai tingkat yang dipilih.
      </p>

      {/* How it works */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Layers,
            title: "1. Pilih level",
            text: "Mulai dari Tenang, lalu naik bertahap ke Standar dan Menantang.",
          },
          {
            icon: Mic,
            title: "2. Bicara atau ketik",
            text: "Jawab AI lewat mikrofon atau ketik. Keduanya sama-sama valid.",
          },
          {
            icon: MessageCircle,
            title: "3. Terima feedback",
            text: "Dapatkan apresiasi, saran, dan contoh kalimat yang suportif.",
          },
        ].map((step) => (
          <div
            key={step.title}
            className="rounded-3xl border border-sage-200 bg-white p-5 shadow-soft"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sage-100 text-leaf-600">
              <step.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-sm font-bold text-forest-700">
              {step.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {step.text}
            </p>
          </div>
        ))}
      </div>

      {/* Level picker */}
      <div className="mt-14">
        <LevelPicker
          courseId={course.id}
          courseTitle={course.title}
          levels={levels}
        />
      </div>
      </main>
    </RequireAuth>
  );
}
