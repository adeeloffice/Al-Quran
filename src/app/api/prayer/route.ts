import { NextRequest, NextResponse } from "next/server";

interface PrayerResponse {
  timings: Record<string, string>;
  date: {
    readable: string;
    hijri: {
      date: string;
      month: { en: string };
      year: string;
    };
  };
  meta: { latitude: number; longitude: number; timezone: string };
}

// Major cities as fallback when geolocation is unavailable
const CITIES: Record<string, { lat: number; lng: number; name: string }> = {
  "karachi": { lat: 24.8607, lng: 67.0011, name: "Karachi, Pakistan" },
  "lahore": { lat: 31.5204, lng: 74.3587, name: "Lahore, Pakistan" },
  "islamabad": { lat: 33.6844, lng: 73.0479, name: "Islamabad, Pakistan" },
  "riyadh": { lat: 24.7136, lng: 46.6753, name: "Riyadh, Saudi Arabia" },
  "dubai": { lat: 25.2048, lng: 55.2708, name: "Dubai, UAE" },
  "london": { lat: 51.5074, lng: -0.1278, name: "London, UK" },
  "new_york": { lat: 40.7128, lng: -74.006, name: "New York, USA" },
  "istanbul": { lat: 41.0082, lng: 28.9784, name: "Istanbul, Turkey" },
  "jeddah": { lat: 21.4858, lng: 39.1925, name: "Jeddah, Saudi Arabia" },
  "makkah": { lat: 21.3891, lng: 39.8579, name: "Makkah, Saudi Arabia" },
  "madinah": { lat: 24.5247, lng: 39.5692, name: "Madinah, Saudi Arabia" },
  "dhaka": { lat: 23.8103, lng: 90.4125, name: "Dhaka, Bangladesh" },
  "kuala_lumpur": { lat: 3.139, lng: 101.6869, name: "Kuala Lumpur, Malaysia" },
  "cairo": { lat: 30.0444, lng: 31.2357, name: "Cairo, Egypt" },
  "jakarta": { lat: -6.2088, lng: 106.8456, name: "Jakarta, Indonesia" },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");
  const city = searchParams.get("city") || "";

  let latitude = lat;
  let longitude = lng;
  let locationName = "";

  // Use city fallback if no coordinates
  if ((!latitude || !longitude) && city) {
    const c = CITIES[city.toLowerCase()];
    if (c) {
      latitude = c.lat;
      longitude = c.lng;
      locationName = c.name;
    }
  }

  // Default to Makkah if nothing provided
  if (!latitude || !longitude) {
    latitude = 21.3891;
    longitude = 39.8579;
    locationName = "Makkah, Saudi Arabia (default)";
  }

  const today = new Date();
  const dd = today.getDate().toString().padStart(2, "0");
  const mm = (today.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = today.getFullYear();

  const apiUrl = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${latitude}&longitude=${longitude}&method=1`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(apiUrl, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`Aladhan API returned ${res.status}`);
      return NextResponse.json(
        { error: `Prayer API returned status ${res.status}. Please try again.` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (data.code === 200 && data.data) {
      return NextResponse.json({
        ...data.data,
        meta: {
          ...data.data.meta,
          locationName: locationName || data.data.meta?.timezone || "",
        },
      });
    }

    return NextResponse.json({ error: "Invalid response from prayer API" }, { status: 502 });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.error("Prayer API timeout");
      return NextResponse.json(
        { error: "Prayer API timed out. Please check your internet connection and try again." },
        { status: 504 }
      );
    }
    console.error("Prayer API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prayer times. Please check your internet connection." },
      { status: 502 }
    );
  }
}
