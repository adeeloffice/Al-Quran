import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const surah = searchParams.get("surah");

  try {
    // Fetch Arabic + Urdu translation
    const [arabicRes, urduRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surah || 1}/quran-uthmani`, {
        next: { revalidate: 86400 },
      }),
      fetch(
        `https://api.alquran.cloud/v1/surah/${surah || 1}/urdu.junagarhi`,
        { next: { revalidate: 86400 } }
      ),
    ]);

    const arabicData = await arabicRes.json();
    const urduData = await urduRes.json();

    if (arabicData.code !== 200 || urduData.code !== 200) {
      return NextResponse.json(
        { error: "Failed to fetch Quran data" },
        { status: 502 }
      );
    }

    // Merge ayahs
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
      { error: "Failed to fetch Quran data" },
      { status: 502 }
    );
  }
}
