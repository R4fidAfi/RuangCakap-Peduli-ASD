export const categories = [
  { id: "semua", label: "Semua" },
  { id: "sehari-hari", label: "Sehari-hari" },
  { id: "tempat-umum", label: "Tempat Umum" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "pertemanan", label: "Pertemanan" },
  { id: "kesehatan", label: "Kesehatan" },
  { id: "dunia-kerja", label: "Dunia Kerja" },
] as const;

export type CourseTheme = "mint" | "mist" | "teal" | "forest" | "sun";

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon:
    | "restaurant"
    | "directions"
    | "doctor"
    | "interview"
    | "friends"
    | "refund"
    | "meeting"
    | "help"
    | "appointment"
    | "neighbor";
  theme: CourseTheme;
  tag?: string;
  completed?: boolean;
};

const categoryLabels: Record<string, string> = {
  "sehari-hari": "Sehari-hari",
  "tempat-umum": "Tempat Umum",
  pendidikan: "Pendidikan",
  pertemanan: "Pertemanan",
  kesehatan: "Kesehatan",
  "dunia-kerja": "Dunia Kerja",
};

export function categoryLabel(id: string): string {
  return categoryLabels[id] ?? id;
}

export function getCourse(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

export const courses: Course[] = [
  {
    id: "pesan-makanan",
    title: "Memesan Makanan",
    description:
      "Berlatih memesan makanan di restoran — dari menyapa kasir sampai membayar dengan tenang.",
    category: "tempat-umum",
    icon: "restaurant",
    theme: "mint",
    tag: "Populer",
    completed: true,
  },
  {
    id: "bertanya-arah",
    title: "Bertanya Arah",
    description:
      "Berlatih menanyakan lokasi kepada petugas atau orang di sekitar dengan jelas.",
    category: "tempat-umum",
    icon: "directions",
    theme: "mist",
  },
  {
    id: "bicara-dokter",
    title: "Bicara dengan Dokter",
    description:
      "Menyampaikan keluhan, menjawab pertanyaan dokter, dan berani meminta penjelasan.",
    category: "kesehatan",
    icon: "doctor",
    theme: "forest",
    tag: "Baru",
  },
  {
    id: "wawancara-kerja",
    title: "Wawancara Kerja",
    description:
      "Menjawab pertanyaan pewawancara dan memperkenalkan diri dengan percaya diri.",
    category: "dunia-kerja",
    icon: "interview",
    theme: "teal",
  },
  {
    id: "kenalan-baru",
    title: "Kenalan dengan Orang Baru",
    description:
      "Memulai percakapan ringan dan menjaga obrolan tetap nyaman dan menyenangkan.",
    category: "pertemanan",
    icon: "friends",
    theme: "sun",
  },
  {
    id: "retur-barang",
    title: "Mengembalikan Barang",
    description:
      "Menjelaskan alasan pengembalian barang di toko dengan sopan dan tidak ragu.",
    category: "tempat-umum",
    icon: "refund",
    theme: "mist",
  },
  {
    id: "bicara-di-rapat",
    title: "Bicara di Rapat Kelas",
    description:
      "Menyampaikan pendapat dan menanggapi diskusi kelompok tanpa gugup.",
    category: "pendidikan",
    icon: "meeting",
    theme: "mint",
  },
  {
    id: "minta-bantuan",
    title: "Meminta Bantuan",
    description:
      "Meminta tolong dengan jelas saat membutuhkan bantuan orang lain.",
    category: "sehari-hari",
    icon: "help",
    theme: "teal",
  },
  {
    id: "buat-janji-temu",
    title: "Membuat Janji Temu",
    description:
      "Membuat dan mengonfirmasi janji temu, termasuk membatalkan dengan sopan.",
    category: "sehari-hari",
    icon: "appointment",
    theme: "forest",
  },
  {
    id: "sapa-tetangga",
    title: "Menyapa Tetangga",
    description:
      "Menyapa dan berbincang singkat dengan tetangga di lingkungan rumah.",
    category: "sehari-hari",
    icon: "neighbor",
    theme: "sun",
  },
];
