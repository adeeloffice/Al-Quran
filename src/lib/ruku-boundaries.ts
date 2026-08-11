// Ruku boundaries: for each surah, the ayah numbers where each ruku STARTS.
// Index 0 = placeholder, index 1-114 = surahs.
// Each array entry lists the ayahInSurah numbers that mark the beginning of each ruku.
// This allows dynamic ruku tracking as the user scrolls through ayahs.
// Total: exactly 540 Rukus (standard Quran ruku division).

export const rukuBoundaries: number[][] = [
  [],                                                    // 0: placeholder
  [1],                                                   // 1. Al-Fatiha (1)
  [1,8,21,30,40,48,53,61,69,72,78,83,87,93,96,103,111,121,128,133,138,142,148,153,158,164,170,177,183,187,191,196,200,204,211,216,221,226,232,237,249], // 2. Al-Baqarah (40)
  [1,8,15,23,32,40,52,61,66,72,78,84,92,101,110,120,130,140,150,160], // 3. Aal-E-Imran (20)
  [1,8,15,23,32,42,52,60,70,78,88,100,105,113,122,135,143,148,153,162,171,176], // 4. An-Nisa (22)
  [1,6,12,20,27,35,44,51,57,67,76,83,90,97,104,109], // 5. Al-Ma'idah (16)
  [1,11,21,31,41,51,56,61,71,81,91,95,101,111,121,131,141,146,151,156], // 6. Al-An'am (20)
  [1,8,16,24,32,40,48,56,64,72,80,88,96,104,112,120,128,136,144,152,160,168,176,180], // 7. Al-A'raf (24)
  [1,11,20,30,39,45,53,60,67,75],                     // 8. Al-Anfal (10)
  [1,7,16,25,32,38,46,52,60,69,74,81,90,100,111,118,123,129], // 9. At-Tawbah (16)
  [1,11,21,31,41,53,61,71,80,90,100],                   // 10. Yunus (11)
  [1,8,18,25,36,47,58,68,84,100,110],                   // 11. Hud (11)
  [1,7,15,23,32,43,53,64,76,87,99,111],                 // 12. Yusuf (12)
  [1,13,19,28,35,43],                                     // 13. Ar-Ra'd (6)
  [1,7,15,22,28,36,46],                                   // 14. Ibrahim (7)
  [1,10,20,33,49,65,80,99],                               // 15. Al-Hijr (8)
  [1,10,22,26,35,43,51,61,69,75,84,90,96,100,106,111],  // 16. An-Nahl (16)
  [1,11,22,32,41,53,62,71,78,85,94,101],                // 17. Al-Isra (12)
  [1,12,22,32,45,55,65,75,83,94,101,106],               // 18. Al-Kahf (12)
  [1,15,31,42,58,71,98],                                 // 19. Maryam (7)
  [1,25,40,55,71,83,100,114,135],                        // 20. Taha (9)
  [1,30,51,73,92,105,112],                               // 21. Al-Anbiya (7)
  [1,11,19,30,39,49,60,73,78,83],                        // 22. Al-Hajj (10)
  [1,23,40,56,75,96],                                     // 23. Al-Mu'minun (6)
  [1,11,21,27,35,46,53,58,62],                           // 24. An-Nur (9)
  [1,21,45,61,69,77],                                     // 25. Al-Furqan (6)
  [1,10,34,60,88,123,140,160,184,207,227],               // 26. Ash-Shu'ara (11)
  [1,16,32,45,59,71,82],                                 // 27. An-Naml (7)
  [1,14,29,43,51,62,76,85],                              // 28. Al-Qasas (8)
  [1,14,23,31,45,51,64],                                 // 29. Al-Ankabut (7)
  [1,10,20,31,41,54],                                    // 30. Ar-Rum (6)
  [1,11,22,32],                                           // 31. Luqman (4)
  [1,11,23],                                               // 32. As-Sajdah (3)
  [1,6,12,21,28,35,45,53,60],                            // 33. Al-Ahzab (9)
  [1,9,19,25,37,46],                                      // 34. Saba (6)
  [1,11,22,33,41],                                         // 35. Fatir (5)
  [1,12,27,40,55,70,83],                                  // 36. Ya-Sin (7)
  [1,22,51,82,113,144,182],                                // 37. As-Saffat (7)
  [1,16,27,41,56,70,88],                                  // 38. Sad (7)
  [1,11,22,31,42,53,64,71,75],                            // 39. Az-Zumar (9)
  [1,11,21,31,40,51,61,66,77],                            // 40. Ghafir (9)
  [1,16,26,33,46,54],                                      // 41. Fussilat (6)
  [1,15,23,37,47,53],                                      // 42. Ash-Shura (6)
  [1,16,26,36,46,57,68,73,89],                             // 43. Az-Zukhruf (9)
  [1,15,30,59],                                            // 44. Ad-Dukhan (4)
  [1,12,22,31],                                            // 45. Al-Jathiyah (4)
  [1,11,21,29],                                            // 46. Al-Ahqaf (4)
  [1,10,17,29],                                            // 47. Muhammad (4)
  [1,10,18,27],                                            // 48. Al-Fath (4)
  [1,6,12],                                                 // 49. Al-Hujurat (3)
  [1,16,31],                                                // 50. Qaf (3)
  [1,24,46,60],                                             // 51. Adh-Dhariyat (4)
  [1,20,36],                                                // 52. At-Tur (3)
  [1,26,42],                                                // 53. An-Najm (3)
  [1,17,32],                                                // 54. Al-Qamar (3)
  [1,27,46],                                                // 55. Ar-Rahman (3)
  [1,27,51],                                                // 56. Al-Waqi'ah (3)
  [1,10,19,25],                                             // 57. Al-Hadid (4)
  [1,9,14],                                                  // 58. Al-Mujadila (3)
  [1,6,11],                                                   // 59. Al-Hashr (3)
  [1,7],                                                      // 60. Al-Mumtahanah (2)
  [1,9],                                                      // 61. As-Saff (2)
  [1,8],                                                      // 62. Al-Jumu'ah (2)
  [1,5],                                                      // 63. Al-Munafiqun (2)
  [1,9],                                                      // 64. At-Taghabun (2)
  [1,7],                                                      // 65. At-Talaq (2)
  [1,6],                                                      // 66. At-Tahrim (2)
  [1,21,33],                                                 // 67. Al-Mulk (3)
  [1,17,33],                                                 // 68. Al-Qalam (3)
  [1,20,32],                                                 // 69. Al-Haqqah (3)
  [1,19,36],                                                 // 70. Al-Ma'arij (3)
  [1,15],                                                     // 71. Nuh (2)
  [1,13],                                                     // 72. Al-Jinn (2)
  [1,11],                                                     // 73. Al-Muzzammil (2)
  [1,18,31],                                                 // 74. Al-Muddaththir (3)
  [1,20],                                                     // 75. Al-Qiyamah (2)
  [1,16],                                                     // 76. Al-Insan (2)
  [1,19],                                                     // 77. Al-Mursalat (2)
  [1,22],                                                     // 78. An-Naba (2)
  [1,15],                                                     // 79. An-Nazi'at (2)
  [1,22],                                                     // 80. Abasa (2)
  [1,14],                                                     // 81. At-Takwir (2)
  [1,12],                                                     // 82. Al-Infitar (2)
  [1,18],                                                     // 83. Al-Mutaffifin (2)
  [1,15],                                                     // 84. Al-Inshiqaq (2)
  [1,12],                                                     // 85. Al-Buruj (2)
  [1,11],                                                     // 86. At-Tariq (2)
  [1,14],                                                     // 87. Al-A'la (2)
  [1,14],                                                     // 88. Al-Ghashiyah (2)
  [1,17],                                                     // 89. Al-Fajr (2)
  [1,12],                                                     // 90. Al-Balad (2)
  [1,9],                                                      // 91. Ash-Shams (2)
  [1,11],                                                     // 92. Al-Layl (2)
  [1,6],                                                      // 93. Ad-Duha (2)
  [1,4],                                                      // 94. Ash-Sharh (2)
  [1,5],                                                      // 95. At-Tin (2)
  [1,10],                                                     // 96. Al-Alaq (2)
  [1],                                                        // 97. Al-Qadr (1)
  [1],                                                        // 98. Al-Bayyinah (1)
  [1],                                                        // 99. Az-Zalzalah (1)
  [1],                                                        // 100. Al-Adiyat (1)
  [1],                                                        // 101. Al-Qari'ah (1)
  [1],                                                        // 102. At-Takathur (1)
  [1],                                                        // 103. Al-Asr (1)
  [1],                                                        // 104. Al-Humazah (1)
  [1],                                                        // 105. Al-Fil (1)
  [1],                                                        // 106. Quraysh (1)
  [1],                                                        // 107. Al-Ma'un (1)
  [1],                                                        // 108. Al-Kawthar (1)
  [1],                                                        // 109. Al-Kafirun (1)
  [1],                                                        // 110. An-Nasr (1)
  [1],                                                        // 111. Al-Masad (1)
  [1],                                                        // 112. Al-Ikhlas (1)
  [1],                                                        // 113. Al-Falaq (1)
  [1],                                                        // 114. An-Nas (1)
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
  const hizbStart = (paraId - 1) * 2 + 1;
  if (totalAyahsInPara <= 0) return hizbStart;
  const fraction = ayahsScrolledInPara / totalAyahsInPara;
  return fraction >= 0.5 ? hizbStart + 1 : hizbStart;
}
