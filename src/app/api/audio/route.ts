import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    const parsed = new URL(decodedUrl);

    if (
      !parsed.hostname.endsWith("quranurdu.com") &&
      !parsed.hostname.endsWith("aladhan.com") &&
      !parsed.hostname.endsWith("alquran.cloud")
    ) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
    }

    const range = request.headers.get("range");
    const headers: HeadersInit = {
      "User-Agent": "Mozilla/5.0",
    };

    if (range) {
      headers["Range"] = range;
    }

    const response = await fetch(decodedUrl, { headers, cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "audio/mpeg";
    const contentLength = response.headers.get("content-length");
    const contentRange = response.headers.get("content-range");
    const acceptRanges = response.headers.get("accept-ranges");

    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400",
    };

    if (contentLength) responseHeaders["Content-Length"] = contentLength;
    if (contentRange) responseHeaders["Content-Range"] = contentRange;
    if (acceptRanges) responseHeaders["Accept-Ranges"] = acceptRanges;

    if (range && response.status === 206) {
      return new NextResponse(response.body, {
        status: 206,
        headers: responseHeaders,
      });
    }

    return new NextResponse(response.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Audio proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch audio" },
      { status: 502 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Range",
      "Access-Control-Expose-Headers": "Content-Range, Accept-Ranges, Content-Length",
    },
  });
}
