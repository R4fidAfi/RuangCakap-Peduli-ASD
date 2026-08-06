// ============================================================
// DATA SKENARIO PER LEVEL
// Konsep: setiap skenario punya 3 tingkat kesulitan.
// Level 1 = Tenang, Level 2 = Standar, Level 3 = Menantang.
// Semua konten ditulis ramah ASD: tidak ada kejutan di Level 1,
// komplikasi naik bertahap, dan selalu ada jalan keluar yang sopan.
// ============================================================

export type LevelNumber = 1 | 2 | 3;

export const LEVEL_META: Record<
  LevelNumber,
  { label: string; blurb: string }
> = {
  1: {
    label: "Tenang",
    blurb:
      "Lawan bicara yang ramah dan sabar. Pertanyaan sederhana, alur lurus. Cocok untuk pertama kali.",
  },
  2: {
    label: "Standar",
    blurb:
      "Ada variasi dan komplikasi kecil yang tetap nyaman dihadapi. Melatih adaptasi.",
  },
  3: {
    label: "Menantang",
    blurb:
      "Situasi kompleks: koreksi, klarifikasi, dan ketenangan diuji. Tetap aman untuk diulang.",
  },
};

export type ScenarioLevel = {
  level: LevelNumber;
  /** Peran yang dimainkan AI pada level ini. */
  aiRole: string;
  /** Situasi yang akan dihadapi pengguna. */
  context: string;
  /** Tujuan latihan pada level ini. */
  goal: string;
  /** Komplikasi yang mungkin muncul (kosong = alur sederhana tanpa kejutan). */
  challenges: string[];
  /** Perkiraan jumlah giliran percakapan. */
  minTurns: number;
};

export type Scenario = {
  /** Peran dasar AI untuk skenario ini. */
  baseRole: string;
  levels: ScenarioLevel[];
};

export const scenarios: Record<string, Scenario> = {
  // ----------------------------------------------------------
  "pesan-makanan": {
    baseRole: "Kasir restoran",
    levels: [
      {
        level: 1,
        aiRole: "Kasir restoran yang ramah dan sabar",
        context:
          "Kamu datang ke restoran sendirian dan mau memesan nasi goreng dengan es teh.",
        goal: "Menyapa kasir, menyampaikan pesanan dengan jelas, mengonfirmasi, dan mengucapkan terima kasih.",
        challenges: [],
        minTurns: 5,
      },
      {
        level: 2,
        aiRole: "Kasir restoran yang ramah namun agak sibuk",
        context:
          "Sama seperti Level 1, tetapi sebagian menu sedang habis dan kasir bertanya detail pesananmu.",
        goal: "Tetap tenang saat pilihan berubah, menyebutkan pengganti, dan mengonfirmasi pesanan sampai jelas.",
        challenges: [
          "Nasi goreng yang kamu mau sedang habis — kasir menawarkan pengganti.",
          "Kasir bertanya ukuran es teh (kecil atau besar).",
        ],
        minTurns: 6,
      },
      {
        level: 3,
        aiRole: "Kasir restoran yang berbicara cepat karena antrean",
        context:
          "Restoran sedang ramai. Pesananmu datang salah dan kasir melayani dengan cepat.",
        goal: "Menyampaikan koreksi dengan sopan, meminta klarifikasi, dan tetap tenang dalam suasana ramai.",
        challenges: [
          "Pesanan yang datang tidak sesuai (malam itu juga diketahui setelah dibawa).",
          "Kasir berbicara cepat dan antrean di belakangmu panjang.",
          "Pembayaran dengan kartu ditolak pertama kali.",
        ],
        minTurns: 7,
      },
    ],
  },

  // ----------------------------------------------------------
  "bertanya-arah": {
    baseRole: "Petugas informasi / orang di sekitar",
    levels: [
      {
        level: 1,
        aiRole: "Petugas informasi yang ramah",
        context:
          "Kamu di sebuah mall dan tidak menemukan toilet. Kamu melihat petugas informasi.",
        goal: "Menarik perhatian petugas dengan sopan, bertanya dengan jelas, dan mengucapkan terima kasih.",
        challenges: [],
        minTurns: 4,
      },
      {
        level: 2,
        aiRole: "Petugas yang membantu namun petunjuknya berbelit",
        context:
          "Kamu mencari toko tertentu di mall besar. Petugas memberi arah yang cukup panjang.",
        goal: "Mendengarkan petunjuk, bertanya ulang bagian yang kurang jelas, dan memastikan pemahaman.",
        challenges: [
          "Petunjuk melibatkan beberapa titik (lampu, eskalator, belokan).",
          "Petugas menyebut nama toko yang tidak kamu kenal.",
        ],
        minTurns: 5,
      },
      {
        level: 3,
        aiRole: "Orang di sekitar yang kurang yakin dengan arah",
        context:
          "Kamu di stasiun dan bertanya arah ke peron. Orang yang kamu tanya tidak terlalu yakin.",
        goal: "Tetap sopan saat jawaban tidak pasti, mencari informasi tambahan, dan memastikan sebelum berangkat.",
        challenges: [
          "Orang yang ditanya memberi jawaban ragu-ragu.",
          "Dua orang memberi petunjuk yang sedikit berbeda.",
          "Kamu perlu memutuskan arah mana yang diikuti.",
        ],
        minTurns: 6,
      },
    ],
  },

  // ----------------------------------------------------------
  "bicara-dokter": {
    baseRole: "Dokter umum",
    levels: [
      {
        level: 1,
        aiRole: "Dokter yang tenang dan sabar",
        context:
          "Kamu datang ke klinik karena sakit kepala sejak pagi. Ini kunjungan pertama untuk keluhan ini.",
        goal: "Menyampaikan keluhan dengan jelas, menjawab pertanyaan dokter, dan menerima saran pengobatan.",
        challenges: [],
        minTurns: 5,
      },
      {
        level: 2,
        aiRole: "Dokter yang bertanya lebih detail",
        context:
          "Keluhanmu belum hilang, jadi dokter bertanya lebih dalam tentang kapan mulai dan seberapa sering.",
        goal: "Menjelaskan kronologi dengan runtut dan tidak ragu menjawab pertanyaan lanjutan.",
        challenges: [
          "Dokter bertanya kapan tepatnya keluhan mulai terasa.",
          "Dokter menanyakan kebiasaan tidur dan makan.",
        ],
        minTurns: 6,
      },
      {
        level: 3,
        aiRole: "Dokter yang menggunakan istilah medis",
        context:
          "Dokter menyarankan pemeriksaan lanjutan dan menyebut beberapa istilah yang asing bagimu.",
        goal: "Berani meminta penjelasan istilah, bertanya tentang prosedur, dan memastikan langkah selanjutnya.",
        challenges: [
          "Dokter menyebut istilah medis yang tidak kamu pahami.",
          "Dokter menyarankan cek laboratorium dan kamu perlu bertanya caranya.",
        ],
        minTurns: 6,
      },
    ],
  },

  // ----------------------------------------------------------
  "wawancara-kerja": {
    baseRole: "Pewawancara (HRD)",
    levels: [
      {
        level: 1,
        aiRole: "Pewawancara yang ramah",
        context:
          "Kamu melamar pekerjaan pertama dan diwawancarai untuk posisi admin muda.",
        goal: "Memperkenalkan diri dengan singkat dan menjawab pertanyaan standar dengan jujur.",
        challenges: [],
        minTurns: 5,
      },
      {
        level: 2,
        aiRole: "Pewawancara yang menggali pengalaman",
        context:
          "Wawancara berlanjut ke pertanyaan pengalaman dan cara kamu menangani situasi tertentu.",
        goal: "Memberi contoh pengalaman yang relevan dan menjelaskannya secara terstruktur.",
        challenges: [
          "Pertanyaan: ceritakan pengalaman saat menghadapi masalah.",
          "Pewawancara meminta contoh yang lebih spesifik.",
        ],
        minTurns: 6,
      },
      {
        level: 3,
        aiRole: "Pewawancara yang menantang",
        context:
          "Wawancara memasuki pertanyaan yang lebih sulit, termasuk kelemahanmu.",
        goal: "Menjawab pertanyaan sulit dengan tenang, jujur, dan menutup wawancara dengan pertanyaan balasan.",
        challenges: [
          "Pertanyaan: apa kelemahan terbesarmu?",
          "Pertanyaan: kenapa kami harus memilihmu?",
          "Menutup wawancara dengan pertanyaan balasan yang sopan.",
        ],
        minTurns: 7,
      },
    ],
  },

  // ----------------------------------------------------------
  "kenalan-baru": {
    baseRole: "Teman baru di acara",
    levels: [
      {
        level: 1,
        aiRole: "Peserta acara yang terbuka",
        context:
          "Kamu mengikuti komunitas baru dan diminta berkenalan dengan orang di sebelahmu.",
        goal: "Memperkenalkan diri, menyebut nama dan hobi, serta bertanya balik.",
        challenges: [],
        minTurns: 5,
      },
      {
        level: 2,
        aiRole: "Teman baru yang suka bercerita",
        context:
          "Obrolan mulai berlanjut. Lawan bicaramu bercerita tentang kesukaannya.",
        goal: "Menanggapi cerita orang lain, bertanya lanjutan, dan ikut berbagi tanpa memonopoli obrolan.",
        challenges: [
          "Lawan bicara bercerita panjang tentang hobinya.",
          "Topik berganti dan kamu perlu menyesuaikan.",
        ],
        minTurns: 6,
      },
      {
        level: 3,
        aiRole: "Teman baru di tengah suasana ramai",
        context:
          "Acara semakin ramai dan orang lain ikut bergabung dalam percakapan.",
        goal: "Menjaga percakapan kelompok, tetap menyampaikan pendapat, dan mengakhiri dengan sopan saat mau pergi.",
        challenges: [
          "Orang lain ikut nimbrung dan topik berganti cepat.",
          "Kamu ingin pergi — perlu menutup percakapan dengan sopan.",
        ],
        minTurns: 6,
      },
    ],
  },

  // ----------------------------------------------------------
  "retur-barang": {
    baseRole: "Petugas toko",
    levels: [
      {
        level: 1,
        aiRole: "Petugas toko yang ramah",
        context:
          "Barang yang kamu beli rusak. Kamu kembali ke toko membawa barang dan struknya.",
        goal: "Menyampaikan masalah dengan jelas dan menerima solusi yang ditawarkan.",
        challenges: [],
        minTurns: 5,
      },
      {
        level: 2,
        aiRole: "Petugas yang ingin detail",
        context:
          "Petugas menanyakan detail kerusakan dan menawarkan pilihan: tukar atau refund.",
        goal: "Menjelaskan detail tanpa ragu dan memilih opsi yang paling sesuai dengan kebutuhanmu.",
        challenges: [
          "Petugas menanyakan sejak kapan barang rusak.",
          "Petugas menawarkan pilihan tukar atau refund.",
        ],
        minTurns: 6,
      },
      {
        level: 3,
        aiRole: "Petugas yang ragu karena struk hilang",
        context:
          "Kamu tidak membawa struk. Petugas ragu memproses pengembalian.",
        goal: "Tetap sopan, menjelaskan situasi, dan mencari solusi bersama tanpa terpancing emosi.",
        challenges: [
          "Petugas bilang pengembalian butuh struk.",
          "Petugas meminta bukti pembelian lain.",
          "Suasana bisa terasa menekan — tetap tenang.",
        ],
        minTurns: 6,
      },
    ],
  },

  // ----------------------------------------------------------
  "bicara-di-rapat": {
    baseRole: "Anggota diskusi kelompok",
    levels: [
      {
        level: 1,
        aiRole: "Teman kelompok yang mendukung",
        context:
          "Dalam rapat kelompok kecil, kamu diminta menyampaikan pendapat tentang pembagian tugas.",
        goal: "Menyampaikan satu pendapat dengan jelas saat diberi giliran bicara.",
        challenges: [],
        minTurns: 4,
      },
      {
        level: 2,
        aiRole: "Teman kelompok yang punya pendapat berbeda",
        context:
          "Pendapatmu berbeda dari teman lain. Diskusi berjalan dan kamu diminta menanggapinya.",
        goal: "Menanggapi pendapat orang lain dengan sopan dan mempertahankan pendapat tanpa memaksa.",
        challenges: [
          "Teman punya ide yang berbeda denganmu.",
          "Kamu perlu menyampaikan alasan singkat untuk idemu.",
        ],
        minTurns: 5,
      },
      {
        level: 3,
        aiRole: "Kelompok dengan perbedaan pendapat yang cukup kuat",
        context:
          "Diskusi memanas. Ada dua kubu dan kamu perlu ikut menentukan keputusan.",
        goal: "Tetap tenang, menyampaikan pandangan, dan membantu kelompok mencapai kompromi.",
        challenges: [
          "Dua orang bersikeras dengan idenya masing-masing.",
          "Kamu perlu meminta giliran bicara dengan sopan.",
          "Kelompok butuh keputusan akhir yang disepakati.",
        ],
        minTurns: 6,
      },
    ],
  },

  // ----------------------------------------------------------
  "minta-bantuan": {
    baseRole: "Teman / rekan",
    levels: [
      {
        level: 1,
        aiRole: "Rekan yang bersedia membantu",
        context:
          "Kamu butuh bantuan mengangkat barang di kampus/kantor.",
        goal: "Meminta bantuan dengan jelas: siapa, butuh apa, dan kapan.",
        challenges: [],
        minTurns: 4,
      },
      {
        level: 2,
        aiRole: "Rekan yang menanyakan detail",
        context:
          "Rekanmu bersedia membantu tetapi menanyakan detail dulu.",
        goal: "Menjawab pertanyaan detail dengan sabar dan mengucapkan terima kasih.",
        challenges: [
          "Rekan bertanya barangnya apa dan beratnya.",
          "Rekan bertanya kapan waktunya.",
        ],
        minTurns: 5,
      },
      {
        level: 3,
        aiRole: "Rekan yang menolak dengan sopan",
        context:
          "Rekan yang kamu mintai bantuan sedang sibuk dan menolak, atau tidak segera merespons.",
        goal: "Menerima penolakan dengan tenang, tetap sopan, dan mencari alternatif.",
        challenges: [
          "Rekan bilang sedang sibuk.",
          "Kamu perlu mencari solusi alternatif sendiri.",
        ],
        minTurns: 5,
      },
    ],
  },

  // ----------------------------------------------------------
  "buat-janji-temu": {
    baseRole: "Resepsionis klinik / kantor",
    levels: [
      {
        level: 1,
        aiRole: "Resepsionis yang ramah",
        context:
          "Kamu mau membuat janji temu di klinik gigi.",
        goal: "Menyebutkan nama, keperluan, dan memilih waktu yang tersedia.",
        challenges: [],
        minTurns: 5,
      },
      {
        level: 2,
        aiRole: "Resepsionis dengan jadwal hampir penuh",
        context:
          "Waktu yang kamu inginkan sudah penuh. Resepsionis menawarkan jadwal lain.",
        goal: "Menerima alternatif dengan fleksibel dan mengonfirmasi ulang jadwal yang dipilih.",
        challenges: [
          "Waktu yang kamu mau sudah penuh.",
          "Resepsionis menawarkan dua pilihan waktu lain.",
        ],
        minTurns: 5,
      },
      {
        level: 3,
        aiRole: "Resepsionis yang melayani perubahan jadwal",
        context:
          "Kamu harus membatalkan atau mengubah janji mendadak karena ada keperluan lain.",
        goal: "Menyampaikan perubahan dengan sopan, minta jadwal baru, dan memastikan konfirmasi.",
        challenges: [
          "Membatalkan janji di hari yang sama.",
          "Meminta jadwal pengganti yang tersedia.",
        ],
        minTurns: 5,
      },
    ],
  },

  // ----------------------------------------------------------
  "sapa-tetangga": {
    baseRole: "Tetangga",
    levels: [
      {
        level: 1,
        aiRole: "Tetangga yang ramah",
        context:
          "Pagi hari di depan rumah, kamu berpapasan dengan tetangga.",
        goal: "Menyapa dengan sopan dan melakukan basa-basi singkat.",
        challenges: [],
        minTurns: 4,
      },
      {
        level: 2,
        aiRole: "Tetangga yang suka mengobrol",
        context:
          "Tetangga mengajak ngobrol lebih lama — soal cuaca, kabar, atau keluarga.",
        goal: "Menanggapi obrolan, bertanya balik, dan mengakhiri dengan sopan saat harus pergi.",
        challenges: [
          "Tetangga bercerita cukup panjang.",
          "Kamu perlu menutup obrolan dengan alasan yang sopan.",
        ],
        minTurns: 5,
      },
      {
        level: 3,
        aiRole: "Tetangga yang bertanya hal pribadi",
        context:
          "Tetangga bertanya hal yang terasa terlalu pribadi, atau mengeluh lama tentang sesuatu.",
        goal: "Menjaga batas pribadi dengan sopan dan tetap menjaga hubungan baik.",
        challenges: [
          "Pertanyaan pribadi yang tidak nyaman — perlu menolak dengan halus.",
          "Tetangga mengeluh panjang dan kamu perlu merespons singkat.",
        ],
        minTurns: 5,
      },
    ],
  },
};

export function getScenarioLevels(courseId: string): ScenarioLevel[] | undefined {
  return scenarios[courseId]?.levels;
}
