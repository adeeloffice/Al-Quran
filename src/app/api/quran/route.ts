import { NextRequest, NextResponse } from "next/server";

const META: Record<number, { name: string; nameArabic: string; totalAyahs: number }> = {
  1:{name:"Al-Faatihah",nameArabic:"الفاتحة",totalAyahs:7},2:{name:"Al-Baqarah",nameArabic:"البقرة",totalAyahs:286},3:{name:"Aale-Imran",nameArabic:"آل عمران",totalAyahs:200},4:{name:"An-Nisaa",nameArabic:"النساء",totalAyahs:176},5:{name:"Al-Maaidah",nameArabic:"المائدة",totalAyahs:120},6:{name:"Al-An'aam",nameArabic:"الأنعام",totalAyahs:165},7:{name:"Al-A'raaf",nameArabic:"الأعراف",totalAyahs:206},8:{name:"Al-Anfaal",nameArabic:"الأنفال",totalAyahs:75},9:{name:"At-Taubah",nameArabic:"التوبة",totalAyahs:129},10:{name:"Younus",nameArabic:"يونس",totalAyahs:109},11:{name:"Hud",nameArabic:"هود",totalAyahs:123},12:{name:"Yousuf",nameArabic:"يوسف",totalAyahs:111},13:{name:"Ar-Ra'd",nameArabic:"الرعد",totalAyahs:43},14:{name:"Ibraheem",nameArabic:"إبراهيم",totalAyahs:52},15:{name:"Al-Hijr",nameArabic:"الحجر",totalAyahs:99},16:{name:"An-Nahl",nameArabic:"النحل",totalAyahs:128},17:{name:"Bani Israeel",nameArabic:"الإسراء",totalAyahs:111},18:{name:"Al-Kahf",nameArabic:"الكهف",totalAyahs:110},19:{name:"Maryam",nameArabic:"مريم",totalAyahs:98},20:{name:"Taa Haa",nameArabic:"طه",totalAyahs:135},21:{name:"Al-Ambia",nameArabic:"الأنبياء",totalAyahs:112},22:{name:"Al-Hajj",nameArabic:"الحج",totalAyahs:78},23:{name:"Al-Mominoon",nameArabic:"المؤمنون",totalAyahs:118},24:{name:"An-Noor",nameArabic:"النور",totalAyahs:64},25:{name:"Al-Furqan",nameArabic:"الفرقان",totalAyahs:77},26:{name:"Ash-Shu'araa",nameArabic:"الشعراء",totalAyahs:227},27:{name:"An-Naml",nameArabic:"النمل",totalAyahs:93},28:{name:"Al-Qasas",nameArabic:"القصص",totalAyahs:88},29:{name:"Al-Ankaboot",nameArabic:"العنكبوت",totalAyahs:69},30:{name:"Ar-Room",nameArabic:"الروم",totalAyahs:60},31:{name:"Luqman",nameArabic:"لقمان",totalAyahs:34},32:{name:"As-Sajdah",nameArabic:"السجدة",totalAyahs:30},33:{name:"Al-Ahzaab",nameArabic:"الأحزاب",totalAyahs:73},34:{name:"Saba",nameArabic:"سبأ",totalAyahs:54},35:{name:"Faatir",nameArabic:"فاطر",totalAyahs:45},36:{name:"Yaa Seen",nameArabic:"يس",totalAyahs:83},37:{name:"As-Saffaat",nameArabic:"الصافات",totalAyahs:182},38:{name:"Suad",nameArabic:"ص",totalAyahs:88},39:{name:"Az-Zumar",nameArabic:"الزمر",totalAyahs:75},40:{name:"Al-Momin",nameArabic:"غافر",totalAyahs:85},41:{name:"Haa Meem Sajdah",nameArabic:"فصلت",totalAyahs:54},42:{name:"As-Shura",nameArabic:"الشورى",totalAyahs:53},43:{name:"Az-Zukhruf",nameArabic:"الزخرف",totalAyahs:89},44:{name:"Ad-Dukhan",nameArabic:"الدخان",totalAyahs:59},45:{name:"Al-Jathiyah",nameArabic:"الجاثية",totalAyahs:37},46:{name:"Al-Ahqaaf",nameArabic:"الأحقاف",totalAyahs:35},47:{name:"Muhammad",nameArabic:"محمد",totalAyahs:38},48:{name:"Al-Fatah",nameArabic:"الفتح",totalAyahs:29},49:{name:"Al-Hujuraat",nameArabic:"الحجرات",totalAyahs:18},50:{name:"Qaaf",nameArabic:"ق",totalAyahs:45},51:{name:"Az-Zariyaat",nameArabic:"الذاريات",totalAyahs:60},52:{name:"At-Toor",nameArabic:"الطور",totalAyahs:49},53:{name:"An-Najm",nameArabic:"النجم",totalAyahs:62},54:{name:"Al-Qamar",nameArabic:"القمر",totalAyahs:55},55:{name:"Ar-Rahman",nameArabic:"الرحمن",totalAyahs:78},56:{name:"Al-Waqi'ah",nameArabic:"الواقعة",totalAyahs:96},57:{name:"Al-Hadeed",nameArabic:"الحديد",totalAyahs:29},58:{name:"Al-Mujadilah",nameArabic:"المجادلة",totalAyahs:60},59:{name:"Al-Hashr",nameArabic:"الحشر",totalAyahs:24},60:{name:"Al-Mumtahinah",nameArabic:"الممتحنة",totalAyahs:18},61:{name:"As-Saff",nameArabic:"الصف",totalAyahs:14},62:{name:"Al-Jumu'ah",nameArabic:"الجمعة",totalAyahs:11},63:{name:"Al-Munaafiqoon",nameArabic:"المنافقون",totalAyahs:11},64:{name:"At-Taghabun",nameArabic:"التغابن",totalAyahs:18},65:{name:"At-Talaaq",nameArabic:"الطلاق",totalAyahs:12},66:{name:"At-Tahreem",nameArabic:"التحريم",totalAyahs:12},67:{name:"Al-Mulk",nameArabic:"الملك",totalAyahs:30},68:{name:"Al-Qalam",nameArabic:"القلم",totalAyahs:52},69:{name:"Al-Haaqqah",nameArabic:"الحاقة",totalAyahs:52},70:{name:"Al-Ma'aarij",nameArabic:"المعارج",totalAyahs:44},71:{name:"Nooh",nameArabic:"نوح",totalAyahs:28},72:{name:"Al-Jinn",nameArabic:"الجن",totalAyahs:28},73:{name:"Al-Muzzammil",nameArabic:"المزمل",totalAyahs:20},74:{name:"Al-Muddassir",nameArabic:"المدثر",totalAyahs:56},75:{name:"Al-Qiyaamah",nameArabic:"القيامة",totalAyahs:40},76:{name:"Ad-Dahr",nameArabic:"الإنسان",totalAyahs:31},77:{name:"Al-Mursalaat",nameArabic:"المرسلات",totalAyahs:50},78:{name:"An-Naba",nameArabic:"النبأ",totalAyahs:40},79:{name:"An-Naazi'aat",nameArabic:"النازعات",totalAyahs:46},80:{name:"Abasa",nameArabic:"عبس",totalAyahs:42},81:{name:"At-Takweer",nameArabic:"التكوير",totalAyahs:29},82:{name:"Al-Infitaar",nameArabic:"الانفطار",totalAyahs:19},83:{name:"Al-Mutaffifeen",nameArabic:"المطففين",totalAyahs:36},84:{name:"Al-Inshiqaaq",nameArabic:"الانشقاق",totalAyahs:25},85:{name:"Al-Burooj",nameArabic:"البروج",totalAyahs:22},86:{name:"At-Taariq",nameArabic:"الطارق",totalAyahs:17},87:{name:"Al-A'laa",nameArabic:"الأعلى",totalAyahs:19},88:{name:"Al-Ghaashiyah",nameArabic:"الغاشية",totalAyahs:26},89:{name:"Al-Fajr",nameArabic:"الفجر",totalAyahs:30},90:{name:"Al-Balad",nameArabic:"البلد",totalAyahs:20},91:{name:"Ash-Shams",nameArabic:"الشمس",totalAyahs:15},92:{name:"Al-Lail",nameArabic:"الليل",totalAyahs:21},93:{name:"Ad-Duhaa",nameArabic:"الضحى",totalAyahs:11},94:{name:"Ash-Sharh",nameArabic:"الشرح",totalAyahs:8},95:{name:"At-Teen",nameArabic:"التين",totalAyahs:8},96:{name:"Al-Alaq",nameArabic:"العلق",totalAyahs:19},97:{name:"Al-Qadr",nameArabic:"القدر",totalAyahs:5},98:{name:"Al-Bayyinah",nameArabic:"البينة",totalAyahs:8},99:{name:"Az-Zilzaal",nameArabic:"الزلزلة",totalAyahs:8},100:{name:"Al-Aadiaat",nameArabic:"العاديات",totalAyahs:11},101:{name:"Al-Qaari'ah",nameArabic:"القارعة",totalAyahs:11},102:{name:"At-Takaathur",nameArabic:"التكاثر",totalAyahs:8},103:{name:"Al-Asr",nameArabic:"العصر",totalAyahs:3},104:{name:"Al-Humazah",nameArabic:"الهمزة",totalAyahs:9},105:{name:"Al-Feel",nameArabic:"الفيل",totalAyahs:5},106:{name:"Quraish",nameArabic:"قريش",totalAyahs:4},107:{name:"Al-Maa'oon",nameArabic:"الماعون",totalAyahs:7},108:{name:"Al-Kausar",nameArabic:"الكوثر",totalAyahs:3},109:{name:"Al-Kaafiroon",nameArabic:"الكافرون",totalAyahs:6},110:{name:"An-Nasr",nameArabic:"النصر",totalAyahs:3},111:{name:"Al-Lahab",nameArabic:"المسد",totalAyahs:5},112:{name:"Al-Ikhlaas",nameArabic:"الإخلاص",totalAyahs:4},113:{name:"Al-Falaq",nameArabic:"الفلق",totalAyahs:5},114:{name:"An-Naas",nameArabic:"الناس",totalAyahs:6},
};

export async function GET(request: NextRequest) {
  const surah = parseInt(request.nextUrl.searchParams.get("surah") || "1", 10);
  const meta = META[surah];
  if (!meta) return NextResponse.json({ error: "Surah not found" }, { status: 404 });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const [arabicRes, urduRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surah}/quran-uthmani`, { signal: controller.signal }),
      fetch(`https://api.alquran.cloud/v1/surah/${surah}/ur.junagarhi`, { signal: controller.signal }),
    ]);
    clearTimeout(timeout);

    if (!arabicRes.ok || !urduRes.ok) throw new Error("API error");

    const arabicData = await arabicRes.json();
    const urduData = await urduRes.json();

    // Arabic diacritical marks (tashkeel) Unicode ranges
    const TASHKEEL_RE = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g;

    // Strip tashkeel for reliable comparison (diacritical mark order varies between sources)
    const stripTashkeel = (s: string) => s.replace(TASHKEEL_RE, "");
    const BISMILLAH_BASE = stripTashkeel("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ");

    const ayahs = arabicData.data.ayahs.map((a: any, i: number) => {
      let text = a.text.replace(/^\ufeff/, "");
      // For surahs other than 1 and 9, ayah 1 contains Bismillah merged with the first real ayah.
      // Strip the Bismillah portion so only the actual first ayah text remains.
      if (a.numberInSurah === 1 && surah !== 1 && surah !== 9) {
        const stripped = stripTashkeel(text);
        if (stripped.startsWith(BISMILLAH_BASE)) {
          // Find how many original characters the Bismillah spans
          let baseIdx = 0;
          let origIdx = 0;
          while (baseIdx < BISMILLAH_BASE.length && origIdx < text.length) {
            if (!TASHKEEL_RE.test(text[origIdx])) {
              baseIdx++;
            }
            TASHKEEL_RE.lastIndex = 0; // reset regex state
            origIdx++;
          }
          text = text.slice(origIdx).trim();
        }
      }
      return {
        number: a.number,
        numberInSurah: a.numberInSurah,
        arabic: text,
        urdu: urduData.data.ayahs[i]?.text || "",
      };
    });

    return NextResponse.json({
      surah,
      name: meta.name,
      nameArabic: meta.nameArabic,
      totalAyahs: meta.totalAyahs,
      ayahs,
    });
  } catch (err) {
    try {
      const { readFileSync } = require("fs");
      const { join } = require("path");
      const filePath = join(process.cwd(), "public", "quran-surahs", `surah-${surah}.json`);
      const data = JSON.parse(readFileSync(filePath, "utf-8"));
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ error: "Failed to load surah" }, { status: 500 });
    }
  }
}
