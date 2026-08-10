import { NextRequest, NextResponse } from "next/server";
import quranData from "@/lib/quran-data.json";

export async function GET(request: NextRequest) {
  const surah = parseInt(request.nextUrl.searchParams.get("surah") || "1", 10);
  const data = quranData.find((s: any) => s.surah === surah);

  if (!data) {
    return NextResponse.json({ error: "Surah not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
