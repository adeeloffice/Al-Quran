import { NextRequest, NextResponse } from "next/server";

async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
      clearTimeout(timeoutId);
      if (res.ok) return res;
      if (i === retries) return res;
    } catch (err) {
      clearTimeout(timeoutId);
      if (i === retries) throw err;
    }
  }
  throw new Error("All retries failed");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const surah = searchParams.get("surah");

  try {
    const [arabicRes, urduRes] = await Promise.all([
      fetchWithRetry(`https://api.alquran.cloud/v1/surah/${surah || 1}/quran-uthmani`),
      fetchWithRetry(`https://api.alquran.cloud/v1/surah/${surah || 1}/urdu.junagarhi`),
    ]);

    const arabicData = await arabicRes.json();
    const urduData = await urduRes.json();

    if (arabicData.code !== 200 || urduData.code !== 200) {
      return NextResponse.json(
        { error: "Failed to fetch Quran data from API" },
        { status: 502 }
      );
    }

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
      { error: "Quran API timed out. Please tap Try Again." },
      { status: 502 }
    );
  }
}
