import { notFound } from "next/navigation";
import { categoryLabel, getCourse } from "@/lib/courses";
import { getScenarioLevels, type LevelNumber } from "@/lib/scenarios";
import PracticeRoom from "@/components/practice-room";

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const { id } = await params;
  const { level: levelParam } = await searchParams;

  const course = getCourse(id);
  const levels = getScenarioLevels(id);
  if (!course || !levels) notFound();

  const raw = Number(levelParam);
  const level = ([1, 2, 3].includes(raw) ? raw : 1) as LevelNumber;
  const current = levels.find((l) => l.level === level) ?? levels[0];

  return (
    <PracticeRoom
      courseId={course.id}
      courseTitle={course.title}
      level={current.level}
      levels={levels}
      category={categoryLabel(course.category)}
    />
  );
}
