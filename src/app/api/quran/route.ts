import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const surah = request.nextUrl.searchParams.get("surah") || "1";

  try {
    const filePath = path.join(process.cwd(), "src", "lib", "quran-surahs", `surah-${surah}.json`);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Surah not found" }, { status: 404 });
  }
}
