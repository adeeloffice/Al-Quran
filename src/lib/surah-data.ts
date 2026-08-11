export interface SurahAudio {
  title: string;
  url: string;
}

export interface Surah {
  id: number;
  number: string;
  nameArabic: string;
  nameUrdu: string;
  nameEnglish: string;
  ayahCount: number;
  type: "meccan" | "medinan";
  audio: SurahAudio[];
}

const BASE_URL = "http://download1.quranurdu.com/Bayan ul Quran in Urdu Dr Asrar Ahmed/";

export const introductions: SurahAudio[] = [
  { title: "Introduction - Part 1", url: `${BASE_URL}000-Introduction-01.mp3` },
  { title: "Introduction - Part 2", url: `${BASE_URL}000-Introduction-02.mp3` },
  { title: "Introduction - Part 3", url: `${BASE_URL}000-Introduction-03.mp3` },
  { title: "Introduction - Part 4", url: `${BASE_URL}000-Introduction-04.mp3` },
];

export const surahs: Surah[] = [
  {
    id: 1, number: "001", nameArabic: "الفاتحة", nameUrdu: "الفاتحہ", nameEnglish: "Al-Faatihah", ayahCount: 7, type: "meccan",
    audio: [{ title: "Al-Faatihah", url: `${BASE_URL}001-AL-FAATIHAH.mp3` }]
  },
  {
    id: 2, number: "002", nameArabic: "البقرة", nameUrdu: "البقرہ", nameEnglish: "Al-Baqarah", ayahCount: 286, type: "medinan",
    audio: [
      { title: "Al-Baqarah (1-29)", url: `${BASE_URL}002-AL-BAQARAH (001 TO 029).mp3` },
      { title: "Al-Baqarah (30-46)", url: `${BASE_URL}002-AL-BAQARAH (030 TO 046).mp3` },
      { title: "Al-Baqarah (47-74)", url: `${BASE_URL}002-AL-BAQARAH [047 TO 074].mp3` },
      { title: "Al-Baqarah (75-107)", url: `${BASE_URL}002-AL-BAQARAH [075 TO 107].mp3` },
      { title: "Al-Baqarah (108-141)", url: `${BASE_URL}002-AL-BAQARAH [108 TO 141].mp3` },
      { title: "Al-Baqarah (142-176)", url: `${BASE_URL}002-AL-BAQARAH [142 TO 176].mp3` },
      { title: "Al-Baqarah (177-196)", url: `${BASE_URL}002-AL-BAQARAH [177 TO 196].mp3` },
      { title: "Al-Baqarah (197-228)", url: `${BASE_URL}002-AL-BAQARAH [197 TO 228].mp3` },
      { title: "Al-Baqarah (229-253)", url: `${BASE_URL}002-AL-BAQARAH [229 TO 253].mp3` },
      { title: "Al-Baqarah (254-End)", url: `${BASE_URL}002-AL-BAQARAH [254 TO End].mp3` },
    ]
  },
  {
    id: 3, number: "003", nameArabic: "آل عمران", nameUrdu: "آل عمران", nameEnglish: "Aale-Imran", ayahCount: 200, type: "medinan",
    audio: [
      { title: "Aale-Imran (1-47)", url: `${BASE_URL}003-ALE-IMRAN [001 TO 047].mp3` },
      { title: "Aale-Imran (48-101)", url: `${BASE_URL}003-ALE-IMRAN [048 TO 101].mp3` },
      { title: "Aale-Imran (102-151)", url: `${BASE_URL}003-ALE-IMRAN [102 TO 151].mp3` },
      { title: "Aale-Imran (152-End)", url: `${BASE_URL}003-ALE-IMRAN [152 TO End].mp3` },
    ]
  },
  {
    id: 4, number: "004", nameArabic: "النساء", nameUrdu: "النساء", nameEnglish: "An-Nisaa", ayahCount: 176, type: "medinan",
    audio: [
      { title: "An-Nisaa (1-30)", url: `${BASE_URL}004-AN-NISAA [001 TO 030].mp3` },
      { title: "An-Nisaa (31-65)", url: `${BASE_URL}004-AN-NISAA [031 TO 065].mp3` },
      { title: "An-Nisaa (66-100)", url: `${BASE_URL}004-AN-NISAA [066 TO 100].mp3` },
      { title: "An-Nisaa (101-142)", url: `${BASE_URL}004-AN-NISAA [101 TO 142].mp3` },
      { title: "An-Nisaa (143-End)", url: `${BASE_URL}004-AN-NISAA [143 TO End].mp3` },
    ]
  },
  {
    id: 5, number: "005", nameArabic: "المائدة", nameUrdu: "المائدہ", nameEnglish: "Al-Maaidah", ayahCount: 120, type: "medinan",
    audio: [
      { title: "Al-Maaidah (1-43)", url: `${BASE_URL}005-AL-MA'IDAH [001 TO 043].mp3` },
      { title: "Al-Maaidah (44-86)", url: `${BASE_URL}005-AL-MA'IDAH [044 TO 086].mp3` },
      { title: "Al-Maaidah (87-End)", url: `${BASE_URL}005-AL-MA'IDAH [087 TO End].mp3` },
    ]
  },
  {
    id: 6, number: "006", nameArabic: "الأنعام", nameUrdu: "الانعام", nameEnglish: "Al-An'aam", ayahCount: 165, type: "meccan",
    audio: [
      { title: "Al-An'aam (1-49)", url: `${BASE_URL}006-AL-AN'AAM [001 TO 049].mp3` },
      { title: "Al-An'aam (50-90)", url: `${BASE_URL}006-AL-AN'AAM [050 TO 090].mp3` },
      { title: "Al-An'aam (91-129)", url: `${BASE_URL}006-AL-AN'AAM [091 TO 129].mp3` },
      { title: "Al-An'aam (130-End)", url: `${BASE_URL}006-AL-AN'AAM [130 TO End].mp3` },
    ]
  },
  {
    id: 7, number: "007", nameArabic: "الأعراف", nameUrdu: "الاعراف", nameEnglish: "Al-A'raaf", ayahCount: 206, type: "meccan",
    audio: [
      { title: "Al-A'raaf (1-58)", url: `${BASE_URL}007-AL-A'RAAF [001 TO 058].mp3` },
      { title: "Al-A'raaf (59-129)", url: `${BASE_URL}007-AL-A'RAAF [059 TO 129].mp3` },
      { title: "Al-A'raaf (130-166)", url: `${BASE_URL}007-AL-A'RAAF [130 TO 166].mp3` },
      { title: "Al-A'raaf (167-End)", url: `${BASE_URL}007-AL-A'RAAF [167 TO End].mp3` },
    ]
  },
  {
    id: 8, number: "008", nameArabic: "الأنفال", nameUrdu: "الانفال", nameEnglish: "Al-Anfaal", ayahCount: 75, type: "medinan",
    audio: [
      { title: "Al-Anfaal (1-40)", url: `${BASE_URL}008-AL-ANFAAL [001 TO 040].mp3` },
      { title: "Al-Anfaal (41-End)", url: `${BASE_URL}008-AL-ANFAAL [041 TO End].mp3` },
    ]
  },
  {
    id: 9, number: "009", nameArabic: "التوبة", nameUrdu: "التوبہ", nameEnglish: "At-Taubah", ayahCount: 129, type: "medinan",
    audio: [
      { title: "At-Taubah (1-34)", url: `${BASE_URL}009-AT-TAUBAH [001 TO 034].mp3` },
      { title: "At-Taubah (35-85)", url: `${BASE_URL}009-AT-TAUBAH [035 TO 085].mp3` },
      { title: "At-Taubah (86-End)", url: `${BASE_URL}009-AT-TAUBAH [086 TO End].mp3` },
    ]
  },
  {
    id: 10, number: "010", nameArabic: "يونس", nameUrdu: "یونس", nameEnglish: "Younus", ayahCount: 109, type: "meccan",
    audio: [{ title: "Younus", url: `${BASE_URL}010-YOUNUS.mp3` }]
  },
  {
    id: 11, number: "011", nameArabic: "هود", nameUrdu: "ہود", nameEnglish: "Hud", ayahCount: 123, type: "meccan",
    audio: [{ title: "Hud", url: `${BASE_URL}011-HUD.MP3` }]
  },
  {
    id: 12, number: "012", nameArabic: "يوسف", nameUrdu: "یوسف", nameEnglish: "Yousuf", ayahCount: 111, type: "meccan",
    audio: [{ title: "Yousuf", url: `${BASE_URL}012-YOUSUF.mp3` }]
  },
  {
    id: 13, number: "013", nameArabic: "الرعد", nameUrdu: "الرعد", nameEnglish: "Ar-Ra'd", ayahCount: 43, type: "medinan",
    audio: [{ title: "Ar-Ra'd", url: `${BASE_URL}013-AR-RA'AD.mp3` }]
  },
  {
    id: 14, number: "014", nameArabic: "إبراهيم", nameUrdu: "ابراہیم", nameEnglish: "Ibraheem", ayahCount: 52, type: "meccan",
    audio: [{ title: "Ibraheem", url: `${BASE_URL}014-IBRAHEEM.mp3` }]
  },
  {
    id: 15, number: "015", nameArabic: "الحجر", nameUrdu: "الحجر", nameEnglish: "Al-Hijr", ayahCount: 99, type: "meccan",
    audio: [{ title: "Al-Hijr", url: `${BASE_URL}015-AL-HIJR.mp3` }]
  },
  {
    id: 16, number: "016", nameArabic: "النحل", nameUrdu: "النحل", nameEnglish: "An-Nahl", ayahCount: 128, type: "meccan",
    audio: [
      { title: "An-Nahl (1-65)", url: `${BASE_URL}016-AN-NAHL [001 TO 065].mp3` },
      { title: "An-Nahl (66-End)", url: `${BASE_URL}016-AN-NAHL [066 TO End].mp3` },
    ]
  },
  {
    id: 17, number: "017", nameArabic: "الإسراء", nameUrdu: "بنی اسرائیل", nameEnglish: "Bani Israeel", ayahCount: 111, type: "meccan",
    audio: [
      { title: "Bani Israeel (1-35)", url: `${BASE_URL}017-BANI ISRAIL [001 TO 035].mp3` },
      { title: "Bani Israeel (36-End)", url: `${BASE_URL}017-BANI ISRAIL [036 TO End].mp3` },
    ]
  },
  {
    id: 18, number: "018", nameArabic: "الكهف", nameUrdu: "الکہف", nameEnglish: "Al-Kahaf", ayahCount: 110, type: "meccan",
    audio: [{ title: "Al-Kahaf", url: `${BASE_URL}018-AL-KAHEF.mp3` }]
  },
  {
    id: 19, number: "019", nameArabic: "مريم", nameUrdu: "مریم", nameEnglish: "Maryam", ayahCount: 98, type: "meccan",
    audio: [{ title: "Maryam", url: `${BASE_URL}019-MARYAM.mp3` }]
  },
  {
    id: 20, number: "020", nameArabic: "طه", nameUrdu: "طٰہٰ", nameEnglish: "Taa Haa", ayahCount: 135, type: "meccan",
    audio: [{ title: "Taa Haa", url: `${BASE_URL}020-TAA HAA.mp3` }]
  },
  {
    id: 21, number: "021", nameArabic: "الأنبياء", nameUrdu: "الانبیاء", nameEnglish: "Al-Ambia", ayahCount: 112, type: "meccan",
    audio: [{ title: "Al-Ambia", url: `${BASE_URL}021-AL-AMBIA.mp3` }]
  },
  {
    id: 22, number: "022", nameArabic: "الحج", nameUrdu: "الحج", nameEnglish: "Al-Hajj", ayahCount: 78, type: "medinan",
    audio: [{ title: "Al-Hajj", url: `${BASE_URL}022-AL-HAJJ.mp3` }]
  },
  {
    id: 23, number: "023", nameArabic: "المؤمنون", nameUrdu: "المؤمنون", nameEnglish: "Al-Mominoon", ayahCount: 118, type: "meccan",
    audio: [{ title: "Al-Mominoon", url: `${BASE_URL}023-AL-MO'MINOON.mp3` }]
  },
  {
    id: 24, number: "024", nameArabic: "النور", nameUrdu: "النور", nameEnglish: "An-Noor", ayahCount: 64, type: "medinan",
    audio: [{ title: "An-Noor", url: `${BASE_URL}024-AN-NOOR.mp3` }]
  },
  {
    id: 25, number: "025", nameArabic: "الفرقان", nameUrdu: "الفرقان", nameEnglish: "Al-Furqan", ayahCount: 77, type: "meccan",
    audio: [{ title: "Al-Furqan", url: `${BASE_URL}025-AL-FURQAN.mp3` }]
  },
  {
    id: 26, number: "026", nameArabic: "الشعراء", nameUrdu: "الشعراء", nameEnglish: "Ash-Shu'araa", ayahCount: 227, type: "meccan",
    audio: [{ title: "Ash-Shu'araa", url: `${BASE_URL}026-AS-SHU'ARAA.mp3` }]
  },
  {
    id: 27, number: "027", nameArabic: "النمل", nameUrdu: "النمل", nameEnglish: "An-Naml", ayahCount: 93, type: "meccan",
    audio: [{ title: "An-Naml", url: `${BASE_URL}027-AN-NAML.mp3` }]
  },
  {
    id: 28, number: "028", nameArabic: "القصص", nameUrdu: "القصص", nameEnglish: "Al-Qasas", ayahCount: 88, type: "meccan",
    audio: [{ title: "Al-Qasas", url: `${BASE_URL}028-AL-QASES.mp3` }]
  },
  {
    id: 29, number: "029", nameArabic: "العنكبوت", nameUrdu: "العنکبوت", nameEnglish: "Al-Ankaboot", ayahCount: 69, type: "meccan",
    audio: [{ title: "Al-Ankaboot", url: `${BASE_URL}029-AL-ANKABOOT.mp3` }]
  },
  {
    id: 30, number: "030", nameArabic: "الروم", nameUrdu: "الروم", nameEnglish: "Ar-Room", ayahCount: 60, type: "meccan",
    audio: [{ title: "Ar-Room", url: `${BASE_URL}030-AR-ROOM.mp3` }]
  },
  {
    id: 31, number: "031", nameArabic: "لقمان", nameUrdu: "لقمان", nameEnglish: "Luqman", ayahCount: 34, type: "meccan",
    audio: [{ title: "Luqman", url: `${BASE_URL}031-LUQMAN.mp3` }]
  },
  {
    id: 32, number: "032", nameArabic: "السجدة", nameUrdu: "السجدہ", nameEnglish: "As-Sajdah", ayahCount: 30, type: "meccan",
    audio: [{ title: "As-Sajdah", url: `${BASE_URL}032-AS-SAJDAH.mp3` }]
  },
  {
    id: 33, number: "033", nameArabic: "الأحزاب", nameUrdu: "الاحزاب", nameEnglish: "Al-Ahzaab", ayahCount: 73, type: "medinan",
    audio: [{ title: "Al-Ahzaab", url: `${BASE_URL}033-AL-AHZAB.mp3` }]
  },
  {
    id: 34, number: "034", nameArabic: "سبأ", nameUrdu: "سبا", nameEnglish: "Saba", ayahCount: 54, type: "meccan",
    audio: [{ title: "Saba", url: `${BASE_URL}034-SABA.MP3` }]
  },
  {
    id: 35, number: "035", nameArabic: "فاطر", nameUrdu: "فاطر", nameEnglish: "Faatir", ayahCount: 45, type: "meccan",
    audio: [{ title: "Faatir", url: `${BASE_URL}035-FAATIR.mp3` }]
  },
  {
    id: 36, number: "036", nameArabic: "يس", nameUrdu: "یٰسین", nameEnglish: "Yaa Seen", ayahCount: 83, type: "meccan",
    audio: [{ title: "Yaa Seen", url: `${BASE_URL}036-YAA SEEN.mp3` }]
  },
  {
    id: 37, number: "037", nameArabic: "الصافات", nameUrdu: "الصٰفٰت", nameEnglish: "As-Saffaat", ayahCount: 182, type: "meccan",
    audio: [{ title: "As-Saffaat", url: `${BASE_URL}037-AS-SAFFAAT.mp3` }]
  },
  {
    id: 38, number: "038", nameArabic: "ص", nameUrdu: "ص", nameEnglish: "Suad", ayahCount: 88, type: "meccan",
    audio: [{ title: "Suad", url: `${BASE_URL}038-SUAD.MP3` }]
  },
  {
    id: 39, number: "039", nameArabic: "الزمر", nameUrdu: "الزمر", nameEnglish: "Az-Zumar", ayahCount: 75, type: "meccan",
    audio: [{ title: "Az-Zumar", url: `${BASE_URL}039-AZ-ZUMAR.mp3` }]
  },
  {
    id: 40, number: "040", nameArabic: "غافر", nameUrdu: "غافر", nameEnglish: "Al-Momin", ayahCount: 85, type: "meccan",
    audio: [{ title: "Al-Momin", url: `${BASE_URL}040-AL-MO'MIN.mp3` }]
  },
  {
    id: 41, number: "041", nameArabic: "فصلت", nameUrdu: "فصلت", nameEnglish: "Haa Meem As-Sajdah", ayahCount: 54, type: "meccan",
    audio: [{ title: "Haa Meem As-Sajdah", url: `${BASE_URL}041-HAA MEEM AS-SAJDAH.mp3` }]
  },
  {
    id: 42, number: "042", nameArabic: "الشورى", nameUrdu: "الشورٰی", nameEnglish: "As-Shura", ayahCount: 53, type: "meccan",
    audio: [{ title: "As-Shura", url: `${BASE_URL}042-AS-SHURA.mp3` }]
  },
  {
    id: 43, number: "043", nameArabic: "الزخرف", nameUrdu: "الزخرف", nameEnglish: "Az-Zukhruf", ayahCount: 89, type: "meccan",
    audio: [{ title: "Az-Zukhruf", url: `${BASE_URL}043-AZ-ZUKHRUF.mp3` }]
  },
  {
    id: 44, number: "044", nameArabic: "الدخان", nameUrdu: "الدخان", nameEnglish: "Ad-Dukhan", ayahCount: 59, type: "meccan",
    audio: [{ title: "Ad-Dukhan", url: `${BASE_URL}044-AD-DUKHAN.mp3` }]
  },
  {
    id: 45, number: "045", nameArabic: "الجاثية", nameUrdu: "الجاثیہ", nameEnglish: "Al-Jathiyah", ayahCount: 37, type: "meccan",
    audio: [{ title: "Al-Jathiyah", url: `${BASE_URL}045-AL-JATHIA.mp3` }]
  },
  {
    id: 46, number: "046", nameArabic: "الأحقاف", nameUrdu: "الاحقاف", nameEnglish: "Al-Ahqaaf", ayahCount: 35, type: "meccan",
    audio: [{ title: "Al-Ahqaaf", url: `${BASE_URL}046-AL-AHQAAF.mp3` }]
  },
  {
    id: 47, number: "047", nameArabic: "محمد", nameUrdu: "محمد", nameEnglish: "Muhammad", ayahCount: 38, type: "medinan",
    audio: [{ title: "Muhammad", url: `${BASE_URL}047-MUHAMMAD.mp3` }]
  },
  {
    id: 48, number: "048", nameArabic: "الفتح", nameUrdu: "الفتح", nameEnglish: "Al-Fatah", ayahCount: 29, type: "medinan",
    audio: [{ title: "Al-Fatah", url: `${BASE_URL}048-AL-FAT'H.mp3` }]
  },
  {
    id: 49, number: "049", nameArabic: "الحجرات", nameUrdu: "الحجرات", nameEnglish: "Al-Hujuraat", ayahCount: 18, type: "medinan",
    audio: [{ title: "Al-Hujuraat", url: `${BASE_URL}049-AL-HUJURAAT.mp3` }]
  },
  {
    id: 50, number: "050", nameArabic: "ق", nameUrdu: "ق", nameEnglish: "Qaaf", ayahCount: 45, type: "meccan",
    audio: [{ title: "Qaaf", url: `${BASE_URL}050-QAAF.MP3` }]
  },
  {
    id: 51, number: "051", nameArabic: "الذاريات", nameUrdu: "الذاریات", nameEnglish: "Az-Zariyaat", ayahCount: 60, type: "meccan",
    audio: [{ title: "Az-Zariyaat", url: `${BASE_URL}051-AZ-ZARIYAAT.mp3` }]
  },
  {
    id: 52, number: "052", nameArabic: "الطور", nameUrdu: "الطور", nameEnglish: "At-Toor", ayahCount: 49, type: "meccan",
    audio: [{ title: "At-Toor", url: `${BASE_URL}052-AT-TOOR.mp3` }]
  },
  {
    id: 53, number: "053", nameArabic: "النجم", nameUrdu: "النجم", nameEnglish: "An-Najm", ayahCount: 62, type: "meccan",
    audio: [{ title: "An-Najm", url: `${BASE_URL}053-AN-NAJM.mp3` }]
  },
  {
    id: 54, number: "054", nameArabic: "القمر", nameUrdu: "القمر", nameEnglish: "Al-Qamar", ayahCount: 55, type: "meccan",
    audio: [{ title: "Al-Qamar", url: `${BASE_URL}054-AL-QAMAR.mp3` }]
  },
  {
    id: 55, number: "055", nameArabic: "الرحمن", nameUrdu: "الرحمٰن", nameEnglish: "Ar-Rahman", ayahCount: 78, type: "medinan",
    audio: [{ title: "Ar-Rahman", url: `${BASE_URL}055-AR-RAHMAN.mp3` }]
  },
  {
    id: 56, number: "056", nameArabic: "الواقعة", nameUrdu: "الواقعہ", nameEnglish: "Al-Waqi'ah", ayahCount: 96, type: "meccan",
    audio: [{ title: "Al-Waqi'ah", url: `${BASE_URL}056-AL-WAQI'AH.mp3` }]
  },
  {
    id: 57, number: "057", nameArabic: "الحديد", nameUrdu: "الحدید", nameEnglish: "Al-Hadeed", ayahCount: 29, type: "medinan",
    audio: [{ title: "Al-Hadeed", url: `${BASE_URL}057-AL-HADEED.mp3` }]
  },
  {
    id: 58, number: "058", nameArabic: "المجادلة", nameUrdu: "المجادلہ", nameEnglish: "Al-Mujaadilah", ayahCount: 22, type: "medinan",
    audio: [{ title: "Al-Mujaadilah", url: `${BASE_URL}058-AL-MUJADILAH.mp3` }]
  },
  {
    id: 59, number: "059", nameArabic: "الحشر", nameUrdu: "الحشر", nameEnglish: "Al-Hashr", ayahCount: 24, type: "medinan",
    audio: [{ title: "Al-Hashr", url: `${BASE_URL}059-AL-HASHR.mp3` }]
  },
  {
    id: 60, number: "060", nameArabic: "الممتحنة", nameUrdu: "الممتحنہ", nameEnglish: "Al-Mumtahinah", ayahCount: 13, type: "medinan",
    audio: [{ title: "Al-Mumtahinah", url: `${BASE_URL}060-AL-MUMTAHINAH.mp3` }]
  },
  {
    id: 61, number: "061", nameArabic: "الصف", nameUrdu: "الصف", nameEnglish: "As-Saff", ayahCount: 14, type: "medinan",
    audio: [{ title: "As-Saff", url: `${BASE_URL}061-AS-SAFF.mp3` }]
  },
  {
    id: 62, number: "062", nameArabic: "الجمعة", nameUrdu: "الجمعہ", nameEnglish: "Al-Jumu'ah", ayahCount: 11, type: "medinan",
    audio: [{ title: "Al-Jumu'ah", url: `${BASE_URL}062-AL-JUMU'AH.mp3` }]
  },
  {
    id: 63, number: "063", nameArabic: "المنافقون", nameUrdu: "المنافقون", nameEnglish: "Al-Munaafiqoon", ayahCount: 11, type: "medinan",
    audio: [{ title: "Al-Munaafiqoon", url: `${BASE_URL}063-AL-MUNAFIQOON.mp3` }]
  },
  {
    id: 64, number: "064", nameArabic: "التغابن", nameUrdu: "التغابن", nameEnglish: "At-Taghabun", ayahCount: 18, type: "medinan",
    audio: [{ title: "At-Taghabun", url: `${BASE_URL}064-AT-TAGHABUN.mp3` }]
  },
  {
    id: 65, number: "065", nameArabic: "الطلاق", nameUrdu: "الطلاق", nameEnglish: "At-Talaaq", ayahCount: 12, type: "medinan",
    audio: [{ title: "At-Talaaq", url: `${BASE_URL}065-AT-TALAAQ.mp3` }]
  },
  {
    id: 66, number: "066", nameArabic: "التحريم", nameUrdu: "التحریم", nameEnglish: "At-Tahreem", ayahCount: 12, type: "medinan",
    audio: [{ title: "At-Tahreem", url: `${BASE_URL}066-AT-TAHREEM.mp3` }]
  },
  {
    id: 67, number: "067", nameArabic: "الملك", nameUrdu: "الملک", nameEnglish: "Al-Mulk", ayahCount: 30, type: "meccan",
    audio: [{ title: "Al-Mulk", url: `${BASE_URL}067-AL-MULK.mp3` }]
  },
  {
    id: 68, number: "068", nameArabic: "القلم", nameUrdu: "القلم", nameEnglish: "Al-Qalam", ayahCount: 52, type: "meccan",
    audio: [{ title: "Al-Qalam", url: `${BASE_URL}068-AL-QALAM.mp3` }]
  },
  {
    id: 69, number: "069", nameArabic: "الحاقة", nameUrdu: "الحاقہ", nameEnglish: "Al-Haaqqah", ayahCount: 52, type: "meccan",
    audio: [{ title: "Al-Haaqqah", url: `${BASE_URL}069-AL-HAAQ-QAH.mp3` }]
  },
  {
    id: 70, number: "070", nameArabic: "المعارج", nameUrdu: "المعارج", nameEnglish: "Al-Ma'aarij", ayahCount: 44, type: "meccan",
    audio: [{ title: "Al-Ma'aarij", url: `${BASE_URL}070-AL-MA'ARIJ.mp3` }]
  },
  {
    id: 71, number: "071", nameArabic: "نوح", nameUrdu: "نوح", nameEnglish: "Nooh", ayahCount: 28, type: "meccan",
    audio: [{ title: "Nooh", url: `${BASE_URL}071-NOOH.MP3` }]
  },
  {
    id: 72, number: "072", nameArabic: "الجن", nameUrdu: "الجن", nameEnglish: "Al-Jinn", ayahCount: 28, type: "medinan",
    audio: [{ title: "Al-Jinn", url: `${BASE_URL}072-AL-JINN.mp3` }]
  },
  {
    id: 73, number: "073", nameArabic: "المزمل", nameUrdu: "المزمل", nameEnglish: "Al-Muzzammil", ayahCount: 20, type: "meccan",
    audio: [{ title: "Al-Muzzammil", url: `${BASE_URL}073-AL-MUZZAMMIL.mp3` }]
  },
  {
    id: 74, number: "074", nameArabic: "المدثر", nameUrdu: "المدثر", nameEnglish: "Al-Muddassir", ayahCount: 56, type: "meccan",
    audio: [{ title: "Al-Muddassir", url: `${BASE_URL}074-AL-MUDDASSIR.mp3` }]
  },
  {
    id: 75, number: "075", nameArabic: "القيامة", nameUrdu: "القیامہ", nameEnglish: "Al-Qiyaamah", ayahCount: 40, type: "meccan",
    audio: [{ title: "Al-Qiyaamah", url: `${BASE_URL}075-AL-QIYAAMAH.mp3` }]
  },
  {
    id: 76, number: "076", nameArabic: "الإنسان", nameUrdu: "الانسان", nameEnglish: "Ad-Dahr", ayahCount: 31, type: "medinan",
    audio: [{ title: "Ad-Dahr", url: `${BASE_URL}076-AD-DAHR.mp3` }]
  },
  {
    id: 77, number: "077", nameArabic: "المرسلات", nameUrdu: "المرسلات", nameEnglish: "Al-Mursalaat", ayahCount: 50, type: "meccan",
    audio: [{ title: "Al-Mursalaat", url: `${BASE_URL}077-AL-MURSALAAT.mp3` }]
  },
  {
    id: 78, number: "078", nameArabic: "النبأ", nameUrdu: "النبا", nameEnglish: "An-Naba", ayahCount: 40, type: "meccan",
    audio: [{ title: "An-Naba", url: `${BASE_URL}078-AN-NABA.mp3` }]
  },
  {
    id: 79, number: "079", nameArabic: "النازعات", nameUrdu: "النازعات", nameEnglish: "An-Naazi'aat", ayahCount: 46, type: "meccan",
    audio: [{ title: "An-Naazi'aat", url: `${BASE_URL}079-AN-NAZI'AAT.mp3` }]
  },
  {
    id: 80, number: "080", nameArabic: "عبس", nameUrdu: "عبس", nameEnglish: "Abas", ayahCount: 42, type: "meccan",
    audio: [{ title: "Abas", url: `${BASE_URL}080-ABAS.MP3` }]
  },
  {
    id: 81, number: "081", nameArabic: "التكوير", nameUrdu: "التکویر", nameEnglish: "At-Takweer", ayahCount: 29, type: "meccan",
    audio: [{ title: "At-Takweer", url: `${BASE_URL}081-AT-TAKWEER.mp3` }]
  },
  {
    id: 82, number: "082", nameArabic: "الانفطار", nameUrdu: "الانفطار", nameEnglish: "Al-Infitaar", ayahCount: 19, type: "meccan",
    audio: [{ title: "Al-Infitaar", url: `${BASE_URL}082-AL-INFITAAR.mp3` }]
  },
  {
    id: 83, number: "083", nameArabic: "المطففين", nameUrdu: "المطففین", nameEnglish: "Al-Mutaffifeen", ayahCount: 36, type: "meccan",
    audio: [{ title: "Al-Mutaffifeen", url: `${BASE_URL}083-AL-MUTTAFFIFEEN.mp3` }]
  },
  {
    id: 84, number: "084", nameArabic: "الانشقاق", nameUrdu: "الانشقاق", nameEnglish: "Al-Inshiqaaq", ayahCount: 25, type: "meccan",
    audio: [{ title: "Al-Inshiqaaq", url: `${BASE_URL}084-AL-INSHIQAAQ.mp3` }]
  },
  {
    id: 85, number: "085", nameArabic: "البروج", nameUrdu: "البروج", nameEnglish: "Al-Burooj", ayahCount: 22, type: "meccan",
    audio: [{ title: "Al-Burooj", url: `${BASE_URL}085-AL-BUROOJ.mp3` }]
  },
  {
    id: 86, number: "086", nameArabic: "الطارق", nameUrdu: "الطارق", nameEnglish: "At-Taariq", ayahCount: 17, type: "meccan",
    audio: [{ title: "At-Taariq", url: `${BASE_URL}086-AT-TARIQ.mp3` }]
  },
  {
    id: 87, number: "087", nameArabic: "الأعلى", nameUrdu: "الاعلٰی", nameEnglish: "Al-A'laa", ayahCount: 19, type: "meccan",
    audio: [{ title: "Al-A'laa", url: `${BASE_URL}087-AL-A'LAA.mp3` }]
  },
  {
    id: 88, number: "088", nameArabic: "الغاشية", nameUrdu: "الغاشیہ", nameEnglish: "Al-Ghashiyah", ayahCount: 26, type: "meccan",
    audio: [{ title: "Al-Ghashiyah", url: `${BASE_URL}088-AL-GHASHIAH.mp3` }]
  },
  {
    id: 89, number: "089", nameArabic: "الفجر", nameUrdu: "الفجر", nameEnglish: "Al-Fajr", ayahCount: 30, type: "meccan",
    audio: [{ title: "Al-Fajr", url: `${BASE_URL}089-AL-FAJR.mp3` }]
  },
  {
    id: 90, number: "090", nameArabic: "البلد", nameUrdu: "البلد", nameEnglish: "Al-Balad", ayahCount: 20, type: "meccan",
    audio: [{ title: "Al-Balad", url: `${BASE_URL}090-AL-BALAD.mp3` }]
  },
  {
    id: 91, number: "091", nameArabic: "الشمس", nameUrdu: "الشمس", nameEnglish: "Ash-Shams", ayahCount: 15, type: "meccan",
    audio: [{ title: "Ash-Shams", url: `${BASE_URL}091-AS-SHAMS.mp3` }]
  },
  {
    id: 92, number: "092", nameArabic: "الليل", nameUrdu: "اللیل", nameEnglish: "Al-Lail", ayahCount: 21, type: "meccan",
    audio: [{ title: "Al-Lail", url: `${BASE_URL}092-AL-LAIL.mp3` }]
  },
  {
    id: 93, number: "093", nameArabic: "الضحى", nameUrdu: "الضحٰی", nameEnglish: "Az-Zuhaa", ayahCount: 11, type: "meccan",
    audio: [{ title: "Az-Zuhaa", url: `${BASE_URL}093-AZ-ZUHAA.mp3` }]
  },
  {
    id: 94, number: "094", nameArabic: "الشرح", nameUrdu: "الشرح", nameEnglish: "Al-Inshirah", ayahCount: 8, type: "meccan",
    audio: [{ title: "Al-Inshirah", url: `${BASE_URL}094-AL-INSHIRAH.mp3` }]
  },
  {
    id: 95, number: "095", nameArabic: "التين", nameUrdu: "التین", nameEnglish: "At-Teen", ayahCount: 8, type: "meccan",
    audio: [{ title: "At-Teen", url: `${BASE_URL}095-AT-TEEN.mp3` }]
  },
  {
    id: 96, number: "096", nameArabic: "العلق", nameUrdu: "العلق", nameEnglish: "Al-Alaq", ayahCount: 19, type: "meccan",
    audio: [{ title: "Al-Alaq", url: `${BASE_URL}096-AL-ALAQ.mp3` }]
  },
  {
    id: 97, number: "097", nameArabic: "القدر", nameUrdu: "القدر", nameEnglish: "Al-Qadr", ayahCount: 5, type: "meccan",
    audio: [{ title: "Al-Qadr", url: `${BASE_URL}097-Al-Qadr.mp3` }]
  },
  {
    id: 98, number: "098", nameArabic: "البينة", nameUrdu: "البینہ", nameEnglish: "Al-Bayyinah", ayahCount: 8, type: "meccan",
    audio: [{ title: "Al-Bayyinah", url: `${BASE_URL}098-AL-BAYYINAH.mp3` }]
  },
  {
    id: 99, number: "099", nameArabic: "الزلزلة", nameUrdu: "الزلزلہ", nameEnglish: "Az-Zilzaal", ayahCount: 8, type: "meccan",
    audio: [{ title: "Az-Zilzaal", url: `${BASE_URL}099-AZ-ZILZAAL.mp3` }]
  },
  {
    id: 100, number: "100", nameArabic: "العاديات", nameUrdu: "العادیات", nameEnglish: "Al-Aadiaat", ayahCount: 11, type: "meccan",
    audio: [{ title: "Al-Aadiaat", url: `${BASE_URL}100-AL-ADIAAT.mp3` }]
  },
  {
    id: 101, number: "101", nameArabic: "القارعة", nameUrdu: "القارعہ", nameEnglish: "Al-Qaari'ah", ayahCount: 11, type: "meccan",
    audio: [{ title: "Al-Qaari'ah", url: `${BASE_URL}101-AL-QAAR'IAH.mp3` }]
  },
  {
    id: 102, number: "102", nameArabic: "التكاثر", nameUrdu: "التکاثر", nameEnglish: "At-Takaathur", ayahCount: 8, type: "meccan",
    audio: [{ title: "At-Takaathur", url: `${BASE_URL}102AT-TAKASUR.mp3` }]
  },
  {
    id: 103, number: "103", nameArabic: "العصر", nameUrdu: "العصر", nameEnglish: "Al-Asr", ayahCount: 3, type: "meccan",
    audio: [{ title: "Al-Asr", url: `${BASE_URL}103-AL-ASR.mp3` }]
  },
  {
    id: 104, number: "104", nameArabic: "الهمزة", nameUrdu: "الھمزہ", nameEnglish: "Al-Humazah", ayahCount: 9, type: "meccan",
    audio: [{ title: "Al-Humazah", url: `${BASE_URL}104-AL-HUMAZAH.mp3` }]
  },
  {
    id: 105, number: "105", nameArabic: "الفيل", nameUrdu: "الفیل", nameEnglish: "Al-Feel", ayahCount: 5, type: "meccan",
    audio: [{ title: "Al-Feel", url: `${BASE_URL}105-AL-FEEL.mp3` }]
  },
  {
    id: 106, number: "106", nameArabic: "قريش", nameUrdu: "قریش", nameEnglish: "Quraish", ayahCount: 4, type: "meccan",
    audio: [{ title: "Quraish", url: `${BASE_URL}106-QURESH.mp3` }]
  },
  {
    id: 107, number: "107", nameArabic: "الماعون", nameUrdu: "الماعون", nameEnglish: "Al-Maa'oon", ayahCount: 7, type: "meccan",
    audio: [{ title: "Al-Maa'oon", url: `${BASE_URL}107-AL-MAA'OON.mp3` }]
  },
  {
    id: 108, number: "108", nameArabic: "الكوثر", nameUrdu: "الکوثر", nameEnglish: "Al-Kausar", ayahCount: 3, type: "meccan",
    audio: [{ title: "Al-Kausar", url: `${BASE_URL}108-AL-KAUSER.mp3` }]
  },
  {
    id: 109, number: "109", nameArabic: "الكافرون", nameUrdu: "الکافرون", nameEnglish: "Al-Kaafiroon", ayahCount: 6, type: "meccan",
    audio: [{ title: "Al-Kaafiroon", url: `${BASE_URL}109-AL-KAFIROON.mp3` }]
  },
  {
    id: 110, number: "110", nameArabic: "النصر", nameUrdu: "النصر", nameEnglish: "An-Nasr", ayahCount: 3, type: "meccan",
    audio: [{ title: "An-Nasr", url: `${BASE_URL}110-AN-NASR.mp3` }]
  },
  {
    id: 111, number: "111", nameArabic: "المسد", nameUrdu: "المسد", nameEnglish: "Al-Lahab", ayahCount: 5, type: "meccan",
    audio: [{ title: "Al-Lahab", url: `${BASE_URL}111-AL-LAHAB.mp3` }]
  },
  {
    id: 112, number: "112", nameArabic: "الإخلاص", nameUrdu: "الاخلاص", nameEnglish: "Al-Ikhlaas", ayahCount: 4, type: "meccan",
    audio: [{ title: "Al-Ikhlaas", url: `${BASE_URL}112-AL-IKHLAAS.mp3` }]
  },
  {
    id: 113, number: "113", nameArabic: "الفلق", nameUrdu: "الفلق", nameEnglish: "Al-Falaq", ayahCount: 5, type: "meccan",
    audio: [{ title: "Al-Falaq", url: `${BASE_URL}113-AL-FALAQ.mp3` }]
  },
  {
    id: 114, number: "114", nameArabic: "الناس", nameUrdu: "الناس", nameEnglish: "An-Naas", ayahCount: 6, type: "meccan",
    audio: [{ title: "An-Naas", url: `${BASE_URL}114-AN-NAAS.mp3` }]
  },
];