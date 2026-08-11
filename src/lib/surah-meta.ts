// Ruku count per surah (standard 540 Rukus total)
// Para/Juz is computed from quran-paras.ts
// Hizb = (Para - 1) * 2 + half within para

export interface SurahMeta {
  id: number;
  rukus: number;
  // Which para(s) this surah starts in
  startPara: number;
  // For surahs spanning multiple paras, which para it ends in
  endPara: number;
  manzil: number;
}

// Ruku counts for all 114 surahs
const rukuCounts: number[] = [
  0, // index 0 placeholder (intro)
  1,  // 1. Al-Fatiha
  40, // 2. Al-Baqarah
  20, // 3. Aal-E-Imran
  24, // 4. An-Nisa
  16, // 5. Al-Ma'idah
  20, // 6. Al-An'am
  24, // 7. Al-A'raf
  10, // 8. Al-Anfal
  16, // 9. At-Tawbah
  11, // 10. Yunus
  10, // 11. Hud
  12, // 12. Yusuf
  6,  // 13. Ar-Ra'd
  7,  // 14. Ibrahim
  6,  // 15. Al-Hijr
  16, // 16. An-Nahl
  12, // 17. Al-Isra
  12, // 18. Al-Kahf
  6,  // 19. Maryam
  8,  // 20. Taha
  7,  // 21. Al-Anbiya
  10, // 22. Al-Hajj
  6,  // 23. Al-Mu'minun
  9,  // 24. An-Nur
  6,  // 25. Al-Furqan
  11, // 26. Ash-Shu'ara
  7,  // 27. An-Naml
  8,  // 28. Al-Qasas
  7,  // 29. Al-Ankabut
  6,  // 30. Ar-Rum
  4,  // 31. Luqman
  3,  // 32. As-Sajdah
  9,  // 33. Al-Ahzab
  6,  // 34. Saba
  5,  // 35. Fatir
  5,  // 36. Ya-Sin
  5,  // 37. As-Saffat
  5,  // 38. Sad
  8,  // 39. Az-Zumar
  9,  // 40. Ghafir
  6,  // 41. Fussilat
  5,  // 42. Ash-Shura
  7,  // 43. Az-Zukhruf
  3,  // 44. Ad-Dukhan
  4,  // 45. Al-Jathiyah
  4,  // 46. Al-Ahqaf
  4,  // 47. Muhammad
  4,  // 48. Al-Fath
  3,  // 49. Al-Hujurat
  3,  // 50. Qaf
  5,  // 51. Adh-Dhariyat
  3,  // 52. At-Tur
  3,  // 53. An-Najm
  3,  // 54. Al-Qamar
  3,  // 55. Ar-Rahman
  3,  // 56. Al-Waqi'ah
  4,  // 57. Al-Hadid
  3,  // 58. Al-Mujadila
  3,  // 59. Al-Hashr
  2,  // 60. Al-Mumtahanah
  2,  // 61. As-Saff
  2,  // 62. Al-Jumu'ah
  2,  // 63. Al-Munafiqun
  2,  // 64. At-Taghabun
  2,  // 65. At-Talaq
  2,  // 66. At-Tahrim
  2,  // 67. Al-Mulk
  2,  // 68. Al-Qalam
  2,  // 69. Al-Haqqah
  2,  // 70. Al-Ma'arij
  2,  // 71. Nuh
  2,  // 72. Al-Jinn
  2,  // 73. Al-Muzzammil
  2,  // 74. Al-Muddaththir
  1,  // 75. Al-Qiyamah
  2,  // 76. Al-Insan
  2,  // 77. Al-Mursalat
  2,  // 78. An-Naba
  2,  // 79. An-Nazi'at
  1,  // 80. Abasa
  1,  // 81. At-Takwir
  1,  // 82. Al-Infitar
  1,  // 83. Al-Mutaffifin
  1,  // 84. Al-Inshiqaq
  1,  // 85. Al-Buruj
  1,  // 86. At-Tariq
  1,  // 87. Al-A'la
  1,  // 88. Al-Ghashiyah
  1,  // 89. Al-Fajr
  1,  // 90. Al-Balad
  1,  // 91. Ash-Shams
  1,  // 92. Al-Layl
  1,  // 93. Ad-Duha
  1,  // 94. Ash-Sharh
  1,  // 95. At-Tin
  1,  // 96. Al-Alaq
  1,  // 97. Al-Qadr
  1,  // 98. Al-Bayyinah
  1,  // 99. Az-Zalzalah
  1,  // 100. Al-Adiyat
  1,  // 101. Al-Qari'ah
  1,  // 102. At-Takathur
  1,  // 103. Al-Asr
  1,  // 104. Al-Humazah
  1,  // 105. Al-Fil
  1,  // 106. Quraysh
  1,  // 107. Al-Ma'un
  1,  // 108. Al-Kawthar
  1,  // 109. Al-Kafirun
  1,  // 110. An-Nasr
  1,  // 111. Al-Masad
  1,  // 112. Al-Ikhlas
  1,  // 113. Al-Falaq
  1,  // 114. An-Nas
];

// Manzil (7 Manzils in Quran)
const manzilMap: number[] = [
  0, // index 0
  1, 1, 1, 1, 1, // 1-5: Manzil 1
  2, 2, 2, 2, 2, // 6-10: Manzil 2
  3, 3, 3, 3, 3, // 11-15: Manzil 3
  4, 4, 4, 4, 4, // 16-20: Manzil 4
  5, 5, 5, 5, 5, // 21-25: Manzil 5
  6, 6, 6, 6, 6, // 26-30: Manzil 6
  7, 7, 7, 7, 7, // 31-35: Manzil 7
  7, 7, 7, 7, 7, // 36-40: Manzil 7
  7, 7, 7, 7, 7, // 41-45: Manzil 7
  7, 7, 7, 7, 7, // 46-50: Manzil 7
  7, 7, 7, 7, 7, // 51-55: Manzil 7
  7, 7, 7, 7, 7, // 56-60: Manzil 7
  7, 7, 7, 7, 7, // 61-65: Manzil 7
  7, 7, 7, 7, 7, // 66-70: Manzil 7
  7, 7, 7, 7, 7, // 71-75: Manzil 7
  7, 7, 7, 7, 7, // 76-80: Manzil 7
  7, 7, 7, 7, 7, // 81-85: Manzil 7
  7, 7, 7, 7, 7, // 86-90: Manzil 7
  7, 7, 7, 7, 7, // 91-95: Manzil 7
  7, 7, 7, 7, 7, // 96-100: Manzil 7
  7, 7, 7, 7, 7, // 101-105: Manzil 7
  7, 7, 7, 7, 7, // 106-110: Manzil 7
  7, 7, 7, 7, 7, // 111-114: Manzil 7
];

// Para start surahs (which surah each para starts with)
const paraStartSurah = [0, 1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9, 11, 12, 15, 17, 18, 21, 23, 25, 27, 29, 33, 36, 39, 41, 46, 51, 58, 67, 78];

// Build metadata for all surahs
function buildMeta(): SurahMeta[] {
  const result: SurahMeta[] = [];
  for (let i = 1; i <= 114; i++) {
    // Find which para this surah starts in
    let startPara = 1;
    for (let p = 30; p >= 1; p--) {
      if (paraStartSurah[p] <= i) {
        startPara = p;
        break;
      }
    }

    // Find which para this surah ends in (for surahs spanning paras like Al-Baqarah)
    let endPara = startPara;
    for (let p = startPara + 1; p <= 30; p++) {
      if (paraStartSurah[p] <= i) {
        // This para also starts with same or earlier surah, so surah continues
        endPara = p;
      } else {
        break;
      }
    }
    // Also check: if next para starts at same surah, surah spans to prev para
    if (startPara < 30 && paraStartSurah[startPara + 1] === i) {
      endPara = startPara; // Surah starts exactly at start of this para
    } else if (startPara < 30 && paraStartSurah[startPara + 1] <= i) {
      endPara = startPara; // Next para starts with same or earlier surah
    }

    result.push({
      id: i,
      rukus: rukuCounts[i],
      startPara,
      endPara,
      manzil: manzilMap[i],
    });
  }
  return result;
}

export const surahMetaList: SurahMeta[] = buildMeta();

export function getSurahMeta(surahId: number): SurahMeta | undefined {
  return surahMetaList.find(m => m.id === surahId);
}

// Get Hizb number for a given para position
// Each Juz has 2 Hizbs. Hizb number = (Juz - 1) * 2 + 1 or 2
// Since we can't know exact half without ayah-level data, we return both possible hizbs
export function getHizbRange(paraId: number): [number, number] {
  return [(paraId - 1) * 2 + 1, (paraId - 1) * 2 + 2];
}
