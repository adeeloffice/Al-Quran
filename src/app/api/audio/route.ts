import { NextRequest, NextResponse } from "next/server";

const ALLOWED_DOMAINS = [
  "quranurdu.com",
  "aladhan.com",
  "api.aladhan.com",
  "alquran.cloud",
];

function isDomainAllowed(hostname: string): boolean {
  return ALLOWED_DOMAINS.some((d) => hostname === d || hostname.endsWith("." + d));
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const decodedUrl = decodeURIComponent(url);
    const parsed = new URL(decodedUrl);

    if (!isDomainAllowed(parsed.hostname)) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
    }

    const range = request.headers.get("range");
    const fetchHeaders: HeadersInit = {
      "User-Agent": "Mozilla/5.0",
    };

    if (range) {
      fetchHeaders["Range"] = range;
    }

    const response = await fetch(decodedUrl, { headers: fetchHeaders, cache: "no-store" });

    // If Range request failed (416 or upstream doesn't support it),
    // retry without Range to get full content
    if (range && (response.status === 416 || response.status === 200)) {
      // If upstream returned 200 for a Range request, it ignored the Range header.
      // The browser can handle full-content responses for seeks, so pass it through.
      // If 416, retry without Range.
      if (response.status === 416) {
        response.body?.cancel();
        const fallback = await fetch(decodedUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
          cache: "no-store",
        });
        if (fallback.ok) {
          return buildAudioResponse(fallback, false);
        }
        return NextResponse.json({ error: "Upstream error" }, { status: 502 });
      }
    }

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: response.status }
      );
    }

    return buildAudioResponse(response, response.status === 206);
  } catch (error) {
    console.error("Audio proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch audio" }, { status: 502 });
  }
}

function buildAudioResponse(
  response: globalThis.Response,
  isPartial: boolean
) {
  const contentType = response.headers.get("content-type") || "audio/mpeg";
  const contentLength = response.headers.get("content-length");
  const contentRange = response.headers.get("content-range");

  const responseHeaders: Record<string, string> = {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=86400",
    // Always advertise Accept-Ranges so the browser knows seeking is possible
    "Accept-Ranges": "bytes",
  };

  if (contentLength) responseHeaders["Content-Length"] = contentLength;
  if (contentRange) responseHeaders["Content-Range"] = contentRange;

  return new NextResponse(response.body, {
    status: isPartial ? 206 : 200,
    headers: responseHeaders,
  });
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
