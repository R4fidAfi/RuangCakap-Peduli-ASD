import type { Course } from "@/lib/courses";

export type CourseThemeClasses = {
  /** Gradient untuk sampul kartu/banner. */
  cover: string;
  /** Pola dekoratif halus. */
  pattern: string;
  /** Warna teks di atas sampul. */
  text: string;
};

export const themeClasses: Record<Course["theme"], CourseThemeClasses> = {
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
