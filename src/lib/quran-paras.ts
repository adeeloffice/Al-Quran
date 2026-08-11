export interface ParaInfo {
  id: number;
  nameUrdu: string;
  nameEnglish: string;
  // Exact ayah boundaries within the Quran
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  // All surahs that this para spans (may be partial at start/end)
  surahs: { id: number; fromAyah: number; toAyah: number }[];
}

// Standard 30 Juz with exact ayah boundaries
export const paras: ParaInfo[] = [
  {
    id: 1, nameUrdu: "آلم", nameEnglish: "Alif Laam Meem",
    startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141,
    surahs: [
      { id: 1, fromAyah: 1, toAyah: 7 },
      { id: 2, fromAyah: 1, toAyah: 141 },
    ],
  },
  {
    id: 2, nameUrdu: "سَيَقُولُ", nameEnglish: "Sayaqulu",
    startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252,
    surahs: [
      { id: 2, fromAyah: 142, toAyah: 252 },
    ],
  },
  {
    id: 3, nameUrdu: "تِلْكَ الرُّسُلُ", nameEnglish: "Tilkar Rusul",
    startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92,
    surahs: [
      { id: 2, fromAyah: 253, toAyah: 286 },
      { id: 3, fromAyah: 1, toAyah: 92 },
    ],
  },
  {
    id: 4, nameUrdu: "لَنْ تَنَالُوا", nameEnglish: "Lan Tanaloo",
    startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23,
    surahs: [
      { id: 3, fromAyah: 93, toAyah: 200 },
      { id: 4, fromAyah: 1, toAyah: 23 },
    ],
  },
  {
    id: 5, nameUrdu: "وَالْمُحْصَنَاتُ", nameEnglish: "Wal Mohsanat",
    startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147,
    surahs: [
      { id: 4, fromAyah: 24, toAyah: 147 },
    ],
  },
  {
    id: 6, nameUrdu: "لَا يُحِبُّ اللَّهُ", nameEnglish: "La Yuhibbullah",
    startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81,
    surahs: [
      { id: 4, fromAyah: 148, toAyah: 176 },
      { id: 5, fromAyah: 1, toAyah: 81 },
    ],
  },
  {
    id: 7, nameUrdu: "وَإِذَا سَمِعُوا", nameEnglish: "Wa Iza Samiu",
    startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110,
    surahs: [
      { id: 5, fromAyah: 82, toAyah: 120 },
      { id: 6, fromAyah: 1, toAyah: 110 },
    ],
  },
  {
    id: 8, nameUrdu: "وَلَوْ أَنَّنَا", nameEnglish: "Wa Law Anna",
    startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87,
    surahs: [
      { id: 6, fromAyah: 111, toAyah: 165 },
      { id: 7, fromAyah: 1, toAyah: 87 },
    ],
  },
  {
    id: 9, nameUrdu: "قَالَ الْمَلَأُ", nameEnglish: "Qalal Malao",
    startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40,
    surahs: [
      { id: 7, fromAyah: 88, toAyah: 206 },
      { id: 8, fromAyah: 1, toAyah: 40 },
    ],
  },
  {
    id: 10, nameUrdu: "وَاعْلَمُوا", nameEnglish: "Wa A lamu",
    startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92,
    surahs: [
      { id: 8, fromAyah: 41, toAyah: 75 },
      { id: 9, fromAyah: 1, toAyah: 92 },
    ],
  },
  {
    id: 11, nameUrdu: "يَعْتَذِرُونَ", nameEnglish: "Ya A tezeroon",
    startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5,
    surahs: [
      { id: 9, fromAyah: 93, toAyah: 129 },
      { id: 10, fromAyah: 1, toAyah: 109 },
      { id: 11, fromAyah: 1, toAyah: 5 },
    ],
  },
  {
    id: 12, nameUrdu: "وَمَا مِنْ دَابَّةٍ", nameEnglish: "Wa Ma Min Dabbah",
    startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52,
    surahs: [
      { id: 11, fromAyah: 6, toAyah: 123 },
      { id: 12, fromAyah: 1, toAyah: 52 },
    ],
  },
  {
    id: 13, nameUrdu: "وَمَا أُبَرِّئُ", nameEnglish: "Wa Ma Ubriee",
    startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52,
    surahs: [
      { id: 12, fromAyah: 53, toAyah: 111 },
      { id: 13, fromAyah: 1, toAyah: 43 },
      { id: 14, fromAyah: 1, toAyah: 52 },
    ],
  },
  {
    id: 14, nameUrdu: "رُبَمَا", nameEnglish: "Rubama",
    startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128,
    surahs: [
      { id: 15, fromAyah: 1, toAyah: 99 },
      { id: 16, fromAyah: 1, toAyah: 128 },
    ],
  },
  {
    id: 15, nameUrdu: "سُبْحَانَ الَّذِي", nameEnglish: "Subhanallazi",
    startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74,
    surahs: [
      { id: 17, fromAyah: 1, toAyah: 111 },
      { id: 18, fromAyah: 1, toAyah: 74 },
    ],
  },
  {
    id: 16, nameUrdu: "قَالَ أَلَمْ", nameEnglish: "Qala Alam",
    startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135,
    surahs: [
      { id: 18, fromAyah: 75, toAyah: 110 },
      { id: 19, fromAyah: 1, toAyah: 98 },
      { id: 20, fromAyah: 1, toAyah: 135 },
    ],
  },
  {
    id: 17, nameUrdu: "اقْتَرَبَ", nameEnglish: "Aqtarab",
    startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78,
    surahs: [
      { id: 21, fromAyah: 1, toAyah: 112 },
      { id: 22, fromAyah: 1, toAyah: 78 },
    ],
  },
  {
    id: 18, nameUrdu: "قَدْ أَفْلَحَ", nameEnglish: "Qad Aflaha",
    startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20,
    surahs: [
      { id: 23, fromAyah: 1, toAyah: 118 },
      { id: 24, fromAyah: 1, toAyah: 64 },
      { id: 25, fromAyah: 1, toAyah: 20 },
    ],
  },
  {
    id: 19, nameUrdu: "وَقَالَ الَّذِينَ", nameEnglish: "Wa Qalallazeena",
    startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55,
    surahs: [
      { id: 25, fromAyah: 21, toAyah: 77 },
      { id: 26, fromAyah: 1, toAyah: 227 },
      { id: 27, fromAyah: 1, toAyah: 55 },
    ],
  },
  {
    id: 20, nameUrdu: "أَمَّنْ خَلَقَ", nameEnglish: "Aman Khalaq",
    startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45,
    surahs: [
      { id: 27, fromAyah: 56, toAyah: 93 },
      { id: 28, fromAyah: 1, toAyah: 88 },
      { id: 29, fromAyah: 1, toAyah: 45 },
    ],
  },
  {
    id: 21, nameUrdu: "اتْلُ مَا أُوحِيَ", nameEnglish: "Utlu Ma Oohiya",
    startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30,
    surahs: [
      { id: 29, fromAyah: 46, toAyah: 69 },
      { id: 30, fromAyah: 1, toAyah: 60 },
      { id: 31, fromAyah: 1, toAyah: 34 },
      { id: 32, fromAyah: 1, toAyah: 30 },
      { id: 33, fromAyah: 1, toAyah: 30 },
    ],
  },
  {
    id: 22, nameUrdu: "وَمَنْ يَقْنُتْ", nameEnglish: "Wa Man Yanqut",
    startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27,
    surahs: [
      { id: 33, fromAyah: 31, toAyah: 73 },
      { id: 34, fromAyah: 1, toAyah: 54 },
      { id: 35, fromAyah: 1, toAyah: 45 },
      { id: 36, fromAyah: 1, toAyah: 27 },
    ],
  },
  {
    id: 23, nameUrdu: "وَمَا لِيَ", nameEnglish: "Wa Ma Lee",
    startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31,
    surahs: [
      { id: 36, fromAyah: 28, toAyah: 83 },
      { id: 37, fromAyah: 1, toAyah: 182 },
      { id: 38, fromAyah: 1, toAyah: 88 },
      { id: 39, fromAyah: 1, toAyah: 31 },
    ],
  },
  {
    id: 24, nameUrdu: "فَمَنْ أَظْلَمُ", nameEnglish: "Fa Man Azlam",
    startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46,
    surahs: [
      { id: 39, fromAyah: 32, toAyah: 75 },
      { id: 40, fromAyah: 1, toAyah: 85 },
      { id: 41, fromAyah: 1, toAyah: 46 },
    ],
  },
  {
    id: 25, nameUrdu: "إِلَيْهِ يُرَدُّ", nameEnglish: "Ilayhi Yuradd",
    startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37,
    surahs: [
      { id: 41, fromAyah: 47, toAyah: 54 },
      { id: 42, fromAyah: 1, toAyah: 53 },
      { id: 43, fromAyah: 1, toAyah: 89 },
      { id: 44, fromAyah: 1, toAyah: 59 },
      { id: 45, fromAyah: 1, toAyah: 37 },
    ],
  },
  {
    id: 26, nameUrdu: "حم", nameEnglish: "Ha Meem",
    startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30,
    surahs: [
      { id: 46, fromAyah: 1, toAyah: 35 },
      { id: 47, fromAyah: 1, toAyah: 38 },
      { id: 48, fromAyah: 1, toAyah: 29 },
      { id: 49, fromAyah: 1, toAyah: 18 },
      { id: 50, fromAyah: 1, toAyah: 45 },
      { id: 51, fromAyah: 1, toAyah: 30 },
    ],
  },
  {
    id: 27, nameUrdu: "قَالَ فَمَا خَطْبُكُمْ", nameEnglish: "Qala Fa Ma Khatbukum",
    startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29,
    surahs: [
      { id: 51, fromAyah: 31, toAyah: 60 },
      { id: 52, fromAyah: 1, toAyah: 49 },
      { id: 53, fromAyah: 1, toAyah: 62 },
      { id: 54, fromAyah: 1, toAyah: 55 },
      { id: 55, fromAyah: 1, toAyah: 78 },
      { id: 56, fromAyah: 1, toAyah: 96 },
      { id: 57, fromAyah: 1, toAyah: 29 },
    ],
  },
  {
    id: 28, nameUrdu: "قَدْ سَمِعَ اللَّهُ", nameEnglish: "Qad Sami Allahu",
    startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12,
    surahs: [
      { id: 58, fromAyah: 1, toAyah: 22 },
      { id: 59, fromAyah: 1, toAyah: 24 },
      { id: 60, fromAyah: 1, toAyah: 13 },
      { id: 61, fromAyah: 1, toAyah: 14 },
      { id: 62, fromAyah: 1, toAyah: 11 },
      { id: 63, fromAyah: 1, toAyah: 11 },
      { id: 64, fromAyah: 1, toAyah: 18 },
      { id: 65, fromAyah: 1, toAyah: 12 },
      { id: 66, fromAyah: 1, toAyah: 12 },
    ],
  },
  {
    id: 29, nameUrdu: "تَبَارَكَ الَّذِي", nameEnglish: "Tabarakallazi",
    startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50,
    surahs: [
      { id: 67, fromAyah: 1, toAyah: 30 },
      { id: 68, fromAyah: 1, toAyah: 52 },
      { id: 69, fromAyah: 1, toAyah: 52 },
      { id: 70, fromAyah: 1, toAyah: 44 },
      { id: 71, fromAyah: 1, toAyah: 28 },
      { id: 72, fromAyah: 1, toAyah: 28 },
      { id: 73, fromAyah: 1, toAyah: 20 },
      { id: 74, fromAyah: 1, toAyah: 56 },
      { id: 75, fromAyah: 1, toAyah: 40 },
      { id: 76, fromAyah: 1, toAyah: 31 },
      { id: 77, fromAyah: 1, toAyah: 50 },
    ],
  },
  {
    id: 30, nameUrdu: "عَمَّ", nameEnglish: "Amma",
    startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6,
    surahs: [
      { id: 78, fromAyah: 1, toAyah: 40 },
      { id: 79, fromAyah: 1, toAyah: 46 },
      { id: 80, fromAyah: 1, toAyah: 42 },
      { id: 81, fromAyah: 1, toAyah: 29 },
      { id: 82, fromAyah: 1, toAyah: 19 },
      { id: 83, fromAyah: 1, toAyah: 36 },
      { id: 84, fromAyah: 1, toAyah: 25 },
      { id: 85, fromAyah: 1, toAyah: 22 },
      { id: 86, fromAyah: 1, toAyah: 17 },
      { id: 87, fromAyah: 1, toAyah: 19 },
      { id: 88, fromAyah: 1, toAyah: 26 },
      { id: 89, fromAyah: 1, toAyah: 30 },
      { id: 90, fromAyah: 1, toAyah: 20 },
      { id: 91, fromAyah: 1, toAyah: 15 },
      { id: 92, fromAyah: 1, toAyah: 21 },
      { id: 93, fromAyah: 1, toAyah: 11 },
      { id: 94, fromAyah: 1, toAyah: 8 },
      { id: 95, fromAyah: 1, toAyah: 8 },
      { id: 96, fromAyah: 1, toAyah: 19 },
      { id: 97, fromAyah: 1, toAyah: 5 },
      { id: 98, fromAyah: 1, toAyah: 8 },
      { id: 99, fromAyah: 1, toAyah: 8 },
      { id: 100, fromAyah: 1, toAyah: 11 },
      { id: 101, fromAyah: 1, toAyah: 11 },
      { id: 102, fromAyah: 1, toAyah: 8 },
      { id: 103, fromAyah: 1, toAyah: 3 },
      { id: 104, fromAyah: 1, toAyah: 9 },
      { id: 105, fromAyah: 1, toAyah: 5 },
      { id: 106, fromAyah: 1, toAyah: 4 },
      { id: 107, fromAyah: 1, toAyah: 7 },
      { id: 108, fromAyah: 1, toAyah: 3 },
      { id: 109, fromAyah: 1, toAyah: 6 },
      { id: 110, fromAyah: 1, toAyah: 3 },
      { id: 111, fromAyah: 1, toAyah: 5 },
      { id: 112, fromAyah: 1, toAyah: 4 },
      { id: 113, fromAyah: 1, toAyah: 5 },
      { id: 114, fromAyah: 1, toAyah: 6 },
    ],
  },
];
