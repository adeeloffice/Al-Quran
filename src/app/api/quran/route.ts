import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const surah = searchParams.get("surah");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const [arabicRes, urduRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surah || 1}/quran-uthmani`, {
        signal: controller.signal,
        cache: "no-store",
      }),
      fetch(`https://api.alquran.cloud/v1/surah/${surah || 1}/urdu.junagarhi`, {
        signal: controller.signal,
        cache: "no-store",
      }),
    ]);

    clearTimeout(timeoutId);

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
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Quran API timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch Quran data" },
      { status: 502 }
    );
  }
}
