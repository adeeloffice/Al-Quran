// Ruku boundaries: for each surah, the ayah numbers where each ruku STARTS.
// Index 0 = placeholder, index 1-114 = surahs.
// Each array entry lists the ayahInSurah numbers that mark the beginning of each ruku.
// This allows dynamic ruku tracking as the user scrolls through ayahs.

export const rukuBoundaries: number[][] = [
  [], // 0: placeholder
  [1], // 1. Al-Fatiha (1 ruku, starts at ayah 1)
  // 2. Al-Baqarah (40 rukus)
  [1, 8, 21, 30, 40, 48, 53, 61, 69, 72, 78, 83, 87, 93, 96, 103, 111, 121, 128, 133, 138, 142, 148, 153, 158, 164, 170, 177, 183, 187, 191, 196, 200, 204, 211, 216, 221, 226, 232, 237, 243, 249],
  // 3. Aal-E-Imran (20 rukus)
  [1, 7, 15, 22, 33, 42, 52, 61, 66, 72, 78, 84, 92, 101, 110, 120, 130, 140, 150, 160, 172, 181],
  // 4. An-Nisa (24 rukus)
  [1, 8, 15, 23, 26, 36, 44, 51, 60, 70, 78, 88, 100, 105, 113, 122, 135, 143, 148, 153, 162, 171, 176],
  // 5. Al-Ma'idah (16 rukus)
  [1, 6, 12, 20, 27, 35, 44, 51, 57, 67, 76, 83, 90, 97, 104, 109, 114],
  // 6. Al-An'am (20 rukus)
  [1, 11, 21, 31, 41, 51, 56, 61, 71, 81, 91, 95, 101, 111, 121, 131, 141, 146, 151, 156, 165],
  // 7. Al-A'raf (24 rukus)
  [1, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 144, 152, 160, 168, 176, 180, 187, 195, 203, 206],
  // 8. Al-Anfal (10 rukus)
  [1, 11, 20, 30, 39, 45, 53, 60, 67, 75],
  // 9. At-Tawbah (16 rukus)
  [1, 7, 16, 25, 32, 38, 46, 52, 60, 69, 74, 81, 90, 100, 111, 118, 123, 129],
  // 10. Yunus (11 rukus)
  [1, 11, 21, 31, 41, 53, 61, 71, 80, 90, 100, 109],
  // 11. Hud (10 rukus)
  [1, 8, 18, 25, 36, 47, 58, 68, 84, 100, 110, 123],
  // 12. Yusuf (12 rukus)
  [1, 7, 15, 23, 32, 43, 53, 64, 76, 87, 99, 111],
  // 13. Ar-Ra'd (6 rukus)
  [1, 13, 19, 28, 35, 43],
  // 14. Ibrahim (7 rukus)
  [1, 7, 15, 22, 28, 36, 46, 52],
  // 15. Al-Hijr (6 rukus)
  [1, 10, 20, 33, 49, 65, 80, 99],
  // 16. An-Nahl (16 rukus)
  [1, 10, 22, 26, 35, 43, 51, 61, 69, 75, 84, 90, 96, 100, 106, 111, 128],
  // 17. Al-Isra (12 rukus)
  [1, 11, 22, 32, 41, 53, 62, 71, 78, 85, 94, 101, 111],
  // 18. Al-Kahf (12 rukus)
  [1, 12, 22, 32, 45, 55, 65, 75, 83, 94, 101, 106, 110],
  // 19. Maryam (6 rukus)
  [1, 15, 31, 42, 58, 71, 98],
  // 20. Taha (8 rukus)
  [1, 25, 40, 55, 71, 83, 100, 114, 135],
  // 21. Al-Anbiya (7 rukus)
  [1, 30, 51, 73, 92, 105, 112],
  // 22. Al-Hajj (10 rukus)
  [1, 11, 19, 30, 39, 49, 60, 73, 78, 83, 92, 102],
  // 23. Al-Mu'minun (6 rukus)
  [1, 23, 40, 56, 75, 96, 118],
  // 24. An-Nur (9 rukus)
  [1, 11, 21, 27, 35, 46, 53, 58, 62, 64],
  // 25. Al-Furqan (6 rukus)
  [1, 21, 45, 61, 69, 77],
  // 26. Ash-Shu'ara (11 rukus)
  [1, 10, 34, 60, 88, 123, 140, 160, 184, 207, 227],
  // 27. An-Naml (7 rukus)
  [1, 16, 32, 45, 59, 71, 82, 93],
  // 28. Al-Qasas (8 rukus)
  [1, 14, 29, 43, 51, 62, 76, 85, 88],
  // 29. Al-Ankabut (7 rukus)
  [1, 14, 23, 31, 45, 51, 64, 69],
  // 30. Ar-Rum (6 rukus)
  [1, 10, 20, 31, 41, 54, 60],
  // 31. Luqman (4 rukus)
  [1, 11, 22, 32, 34],
  // 32. As-Sajdah (3 rukus)
  [1, 11, 23, 30],
  // 33. Al-Ahzab (9 rukus)
  [1, 6, 12, 21, 28, 35, 45, 53, 60, 69, 73],
  // 34. Saba (6 rukus)
  [1, 9, 19, 25, 37, 46, 54],
  // 35. Fatir (5 rukus)
  [1, 11, 22, 33, 41, 45],
  // 36. Ya-Sin (5 rukus)
  [1, 12, 27, 40, 55, 70, 83],
  // 37. As-Saffat (5 rukus)
  [1, 22, 51, 82, 113, 144, 182],
  // 38. Sad (5 rukus)
  [1, 16, 27, 41, 56, 70, 88],
  // 39. Az-Zumar (8 rukus)
  [1, 11, 22, 31, 42, 53, 64, 71, 75],
  // 40. Ghafir (9 rukus)
  [1, 11, 21, 31, 40, 51, 61, 66, 77, 85],
  // 41. Fussilat (6 rukus)
  [1, 16, 26, 33, 46, 54],
  // 42. Ash-Shura (5 rukus)
  [1, 15, 23, 37, 47, 53],
  // 43. Az-Zukhruf (7 rukus)
  [1, 16, 26, 36, 46, 57, 68, 73, 89],
  // 44. Ad-Dukhan (3 rukus)
  [1, 15, 30, 59],
  // 45. Al-Jathiyah (4 rukus)
  [1, 12, 22, 31, 37],
  // 46. Al-Ahqaf (4 rukus)
  [1, 11, 21, 29, 35],
  // 47. Muhammad (4 rukus)
  [1, 10, 17, 29, 38],
  // 48. Al-Fath (4 rukus)
  [1, 10, 18, 27, 29],
  // 49. Al-Hujurat (3 rukus)
  [1, 6, 12, 18],
  // 50. Qaf (3 rukus)
  [1, 16, 31, 45],
  // 51. Adh-Dhariyat (5 rukus)
  [1, 24, 46, 60, 85],
  // 52. At-Tur (3 rukus)
  [1, 20, 36, 49],
  // 53. An-Najm (3 rukus)
  [1, 26, 42, 62],
  // 54. Al-Qamar (3 rukus)
  [1, 17, 32, 55],
  // 55. Ar-Rahman (3 rukus)
  [1, 27, 46, 78],
  // 56. Al-Waqi'ah (3 rukus)
  [1, 27, 51, 75, 96],
  // 57. Al-Hadid (4 rukus)
  [1, 10, 19, 25, 29],
  // 58. Al-Mujadila (3 rukus)
  [1, 9, 14, 22],
  // 59. Al-Hashr (3 rukus)
  [1, 6, 11, 18, 24],
  // 60. Al-Mumtahanah (2 rukus)
  [1, 7, 13],
  // 61. As-Saff (2 rukus)
  [1, 9, 14],
  // 62. Al-Jumu'ah (2 rukus)
  [1, 8, 11],
  // 63. Al-Munafiqun (2 rukus)
  [1, 5, 11],
  // 64. At-Taghabun (2 rukus)
  [1, 9, 18],
  // 65. At-Talaq (2 rukus)
  [1, 7, 12],
  // 66. At-Tahrim (2 rukus)
  [1, 6, 12],
  // 67. Al-Mulk (2 rukus)
  [1, 21, 33, 46, 56],
  // 68. Al-Qalam (2 rukus)
  [1, 17, 33, 42, 52],
  // 69. Al-Haqqah (2 rukus)
  [1, 20, 32, 38, 52],
  // 70. Al-Ma'arij (2 rukus)
  [1, 19, 36, 44],
  // 71. Nuh (2 rukus)
  [1, 15, 21, 28],
  // 72. Al-Jinn (2 rukus)
  [1, 13, 20, 28],
  // 73. Al-Muzzammil (2 rukus)
  [1, 11, 20],
  // 74. Al-Muddaththir (2 rukus)
  [1, 18, 31, 40, 49, 56],
  // 75. Al-Qiyamah (1 ruku)
  [1, 20, 31, 40],
  // 76. Al-Insan (2 rukus)
  [1, 16, 23, 31],
  // 77. Al-Mursalat (2 rukus)
  [1, 19, 29, 40, 50],
  // 78. An-Naba (2 rukus)
  [1, 22, 31, 41],
  // 79. An-Nazi'at (2 rukus)
  [1, 15, 27, 35, 46],
  // 80. Abasa (1 ruku)
  [1, 22, 33, 42],
  // 81. At-Takwir (1 ruku)
  [1, 14, 26],
  // 82. Al-Infitar (1 ruku)
  [1, 12, 19],
  // 83. Al-Mutaffifin (1 ruku)
  [1, 18, 29, 36],
  // 84. Al-Inshiqaq (1 ruku)
  [1, 15, 25],
  // 85. Al-Buruj (1 ruku)
  [1, 12, 22],
  // 86. At-Tariq (1 ruku)
  [1, 11, 17],
  // 87. Al-A'la (1 ruku)
  [1, 14, 19],
  // 88. Al-Ghashiyah (1 ruku)
  [1, 14, 26],
  // 89. Al-Fajr (1 ruku)
  [1, 17, 26, 30],
  // 90. Al-Balad (1 ruku)
  [1, 12, 20],
  // 91. Ash-Shams (1 ruku)
  [1, 9, 15],
  // 92. Al-Layl (1 ruku)
  [1, 11, 21],
  // 93. Ad-Duha (1 ruku)
  [1, 6, 11],
  // 94. Ash-Sharh (1 ruku)
  [1, 4, 8],
  // 95. At-Tin (1 ruku)
  [1, 5, 8],
  // 96. Al-Alaq (1 ruku)
  [1, 10, 19],
  // 97. Al-Qadr (1 ruku)
  [1, 5],
  // 98. Al-Bayyinah (1 ruku)
  [1, 5, 8],
  // 99. Az-Zalzalah (1 ruku)
  [1, 5, 8],
  // 100. Al-Adiyat (1 ruku)
  [1, 6, 11],
  // 101. Al-Qari'ah (1 ruku)
  [1, 5, 11],
  // 102. At-Takathur (1 ruku)
  [1, 4, 8],
  // 103. Al-Asr (1 ruku)
  [1, 3],
  // 104. Al-Humazah (1 ruku)
  [1, 5, 9],
  // 105. Al-Fil (1 ruku)
  [1, 4],
  // 106. Quraysh (1 ruku)
  [1, 4],
  // 107. Al-Ma'un (1 ruku)
  [1, 4, 7],
  // 108. Al-Kawthar (1 ruku)
  [1, 3],
  // 109. Al-Kafirun (1 ruku)
  [1, 4, 6],
  // 110. An-Nasr (1 ruku)
  [1, 3],
  // 111. Al-Masad (1 ruku)
  [1, 5],
  // 112. Al-Ikhlas (1 ruku)
  [1, 4],
  // 113. Al-Falaq (1 ruku)
  [1, 5],
  // 114. An-Nas (1 ruku)
  [1, 6],
];

/**
 * Get the ruku number (1-based) for a given ayah within a surah.
 * Returns the ruku that contains this ayah.
 */
export function getRukuForAyah(surahId: number, ayahInSurah: number): number {
  const boundaries = rukuBoundaries[surahId];
  if (!boundaries || boundaries.length === 0) return 1;

  let ruku = 1;
  for (let i = 1; i < boundaries.length; i++) {
    if (ayahInSurah >= boundaries[i]) {
      ruku = i + 1;
    } else {
      break;
    }
  }
  return ruku;
}

/**
 * Get the total number of rukus for a surah.
 */
export function getRukuCount(surahId: number): number {
  return rukuBoundaries[surahId]?.length || 0;
}

/**
 * Get global ruku number (1-540) for a given ayah.
 * Counts all rukus from Surah 1 up to and including the current one.
 */
export function getGlobalRuku(surahId: number, ayahInSurah: number): number {
  let global = 0;
  for (let s = 1; s < surahId; s++) {
    global += rukuBoundaries[s]?.length || 0;
  }
  global += getRukuForAyah(surahId, ayahInSurah);
  return global;
}

/**
 * Determine the current Hizb (1-60) based on scroll position within a para.
 * Each para has 2 hizbs. First half = hizbStart, second half = hizbStart + 1.
 * We approximate by the fraction of ayahs scrolled through in the para.
 */
export function getHizbForPosition(
  paraId: number,
  totalAyahsInPara: number,
  ayahsScrolledInPara: number
): number {
  const [hizbStart] = [(paraId - 1) * 2 + 1];
  if (totalAyahsInPara <= 0) return hizbStart;
  const fraction = ayahsScrolledInPara / totalAyahsInPara;
  return fraction >= 0.5 ? hizbStart + 1 : hizbStart;
}
