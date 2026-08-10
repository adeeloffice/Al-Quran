import { NextRequest, NextResponse } from "next/server";

async function fetchJSON(url: string, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
      clearTimeout(tid);
      const data = await res.json();
      if (data.code === 200) return data;
      if (i === retries) throw new Error(`API error: ${res.status}`);
    } catch (e) {
      clearTimeout(tid);
      if (i === retries) throw e;
    }
  }
  throw new Error("All retries failed");
}

export async function GET(request: NextRequest) {
  const surah = request.nextUrl.searchParams.get("surah") || "1";

  try {
    const [arabicData, urduData] = await Promise.all([
      fetchJSON(`https://api.alquran.cloud/v1/surah/${surah}/quran-uthmani`),
      fetchJSON(`https://api.alquran.cloud/v1/surah/${surah}/urdu.junagarhi`),
    ]);

    const ayahs = arabicData.data.ayahs.map(
      (a: { number: number; numberInSurah: number; text: string }, i: number) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        arabic: a.text,
        urdu: urduData.data.ayahs[i]?.text || "",
      })
    );

    return NextResponse.json({
      surah: arabicData.data.number,
      name: arabicData.data.englishName,
      nameArabic: arabicData.data.name,
      totalAyahs: arabicData.data.numberOfAyahs,
      ayahs,
    });
  } catch (error) {
    console.error("Quran API error:", error);
    return NextResponse.json(
      { error: "Quran API could not be reached. Please try again later." },
      { status: 502 }
    );
  }
}
