"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { surahs, introductions, type Surah, type SurahAudio } from "@/lib/surah-data";
import { asmaUlHusna } from "@/lib/asma-ul-husna";
import { paras } from "@/lib/quran-paras";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
  VolumeX,
  X,
  BookOpen,
  Headphones,
  List,
  Sparkles,
  Compass,
  Clock,
  MapPin,
  RefreshCw,
  Loader2,
  Navigation,
  Heart,
  ChevronRight,
  BookText,
} from "lucide-react";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTime12(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function proxyUrl(originalUrl: string): string {
  return `/api/audio?url=${encodeURIComponent(originalUrl)}`;
}

type TabType = "surahs" | "intro" | "asmaulhusna" | "prayer" | "quran";

interface PrayerTime {
  name: string;
  time: string;
  isNext?: boolean;
}

interface PrayerData {
  timings: Record<string, string>;
  date: {
    readable: string;
    hijri: { date: string; month: { en: string }; year: string };
  };
  meta: { latitude: number; longitude: number; timezone: string; locationName?: string };
}

interface QuranAyah {
  number: number;
  numberInSurah: number;
  arabic: string;
  urdu: string;
}

interface QuranSurah {
  surah: number;
  name: string;
  nameArabic: string;
  totalAyahs: number;
  ayahs: QuranAyah[];
}

const CITY_OPTIONS = [
  { key: "karachi", label: "Karachi" },
  { key: "lahore", label: "Lahore" },
  { key: "islamabad", label: "Islamabad" },
  { key: "makkah", label: "Makkah" },
  { key: "madinah", label: "Madinah" },
  { key: "riyadh", label: "Riyadh" },
  { key: "dubai", label: "Dubai" },
  { key: "istanbul", label: "Istanbul" },
  { key: "london", label: "London" },
  { key: "new_york", label: "New York" },
  { key: "cairo", label: "Cairo" },
  { key: "dhaka", label: "Dhaka" },
  { key: "jakarta", label: "Jakarta" },
  { key: "kuala_lumpur", label: "Kuala Lumpur" },
  { key: "jeddah", label: "Jeddah" },
];

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState<SurahAudio | null>(null);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("surahs");
  const [asmaSearch, setAsmaSearch] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const restoredRef = useRef(false);

  // Prayer times state
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState("");
  const [selectedCity, setSelectedCity] = useState("karachi");
  const [useGeo, setUseGeo] = useState(true);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);

  // Quran reading state
  const [selectedSurahForReading, setSelectedSurahForReading] = useState<number>(1);
  const [quranData, setQuranData] = useState<QuranSurah | null>(null);
  const [quranLoading, setQuranLoading] = useState(false);
  const [quranError, setQuranError] = useState("");
  const [quranRetryKey, setQuranRetryKey] = useState(0);
  const quranLoadingRef = useRef(false);

  // Restore state from localStorage on mount
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const saved = localStorage.getItem("bayan-ul-quran-state");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.entered) setEntered(true);
        if (s.activeTab) setActiveTab(s.activeTab);
        if (s.volume !== undefined) setVolume(s.volume);
        if (s.isMuted !== undefined) setIsMuted(s.isMuted);
        if (s.selectedSurahForReading) setSelectedSurahForReading(s.selectedSurahForReading);
        if (s.selectedCity) setSelectedCity(s.selectedCity);
        if (s.useGeo !== undefined) setUseGeo(s.useGeo);
        if (s.trackUrl) {
          const track: SurahAudio = { url: s.trackUrl, title: s.trackTitle || "" };
          const surah = s.surahId ? surahs.find((su) => su.id === s.surahId) || null : null;
          setCurrentTrack(track);
          setCurrentSurah(surah);
          setShowPlayer(true);
        }
      }
    } catch {}
  }, []);

  // Save audio position periodically (with track URL so we only restore for the same track)
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && audioRef.current.currentTime > 0 && currentTrack) {
        try { localStorage.setItem("bayan-audio-pos", JSON.stringify({ url: currentTrack.url, time: audioRef.current.currentTime })); } catch {}
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [currentTrack]);

  // Save state to localStorage on changes
  useEffect(() => {
    const state: any = { entered, activeTab, volume, isMuted, selectedSurahForReading, selectedCity, useGeo };
    if (currentTrack) {
      state.trackUrl = currentTrack.url;
      state.trackTitle = currentTrack.title;
      if (currentSurah) state.surahId = currentSurah.id;
    }
    try { localStorage.setItem("bayan-ul-quran-state", JSON.stringify(state)); } catch {}
  }, [entered, activeTab, volume, isMuted, currentTrack, currentSurah, selectedSurahForReading, selectedCity, useGeo]);

  // Restore audio position after track loads (only if same track URL)
  useEffect(() => {
    if (!audioRef.current || !currentTrack || isLoadingRef.current) return;
    try {
      const saved = localStorage.getItem("bayan-audio-pos");
      if (saved) {
        const { url, time } = JSON.parse(saved);
        if (url === currentTrack.url && time > 0 && isFinite(time)) {
          audioRef.current.currentTime = time;
          setCurrentTime(time);
        }
      }
    } catch {}
  }, [currentTrack]);

  const filteredSurahs = useMemo(
    () =>
      surahs.filter(
        (s) =>
          s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nameUrdu.includes(searchQuery) ||
          s.number.includes(searchQuery) ||
          s.nameArabic.includes(searchQuery)
      ),
    [searchQuery]
  );

  const filteredAsma = useMemo(
    () =>
      asmaUlHusna.filter(
        (n) =>
          n.transliteration.toLowerCase().includes(asmaSearch.toLowerCase()) ||
          n.meaning.toLowerCase().includes(asmaSearch.toLowerCase()) ||
          n.arabic.includes(asmaSearch) ||
          n.id.toString().includes(asmaSearch)
      ),
    [asmaSearch]
  );

  const prayerTimes: PrayerTime[] = useMemo(() => {
    if (!prayerData) return [];
    const order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    let nextFound = false;
    return order
      .filter((n) => prayerData.timings[n])
      .map((n) => {
        const t = prayerData.timings[n].split(" ")[0];
        const [h, m] = t.split(":").map(Number);
        const pMins = h * 60 + m;
        const isNext = !nextFound && pMins > nowMins;
        if (isNext) nextFound = true;
        return { name: n, time: t, isNext };
      });
  }, [prayerData]);

  const playTrack = useCallback((track: SurahAudio, surah?: Surah) => {
    setCurrentTrack(track);
    setCurrentSurah(surah || null);
    setIsPlaying(true);
    setShowPlayer(true);
  }, []);

  const closePlayer = useCallback(() => {
    setShowPlayer(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }
    setCurrentTrack(null);
    setCurrentSurah(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const seekBy = useCallback((seconds: number) => {
    if (!audioRef.current || !duration) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
 isLoadingRef.current = true;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  const playNext = useCallback(() => {
    if (!currentSurah || !currentTrack) return;
    const idx = currentSurah.audio.findIndex((a) => a.url === currentTrack.url);
    if (idx < currentSurah.audio.length - 1) {
      playTrack(currentSurah.audio[idx + 1], currentSurah);
    }
  }, [currentSurah, currentTrack, playTrack]);

  const playPrev = useCallback(() => {
    if (!currentSurah || !currentTrack) return;
    const idx = currentSurah.audio.findIndex((a) => a.url === currentTrack.url);
    if (idx > 0) {
      playTrack(currentSurah.audio[idx - 1], currentSurah);
    }
  }, [currentSurah, currentTrack, playTrack]);

  const seekTo = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pct * duration;
    isLoadingRef.current = true;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  }, [isMuted, volume]);

  const changeVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
      if (v > 0) setIsMuted(false);
    }
  }, []);

  // Audio source effect — with AbortError prevention
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Prevent AbortError: abort any pending play before loading new source
    isLoadingRef.current = true;
    audio.pause();
    setIsPlaying(false);

    audio.src = proxyUrl(currentTrack.url);
    audio.volume = isMuted ? 0 : volume;
    audio.load();
  }, [currentTrack]);

  // Separate effect for playing after load
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const canPlay = () => {
      if (isLoadingRef.current) {
        isLoadingRef.current = false;
        audio.play().then(() => setIsPlaying(true)).catch(() => {
          setIsPlaying(false);
          isLoadingRef.current = false;
        });
      }
    };

    audio.addEventListener("canplay", canPlay);
    return () => audio.removeEventListener("canplay", canPlay);
  }, [currentTrack]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration);
    const onEnd = () => {
      setIsPlaying(false);
      try { localStorage.removeItem("bayan-audio-pos"); } catch {}
      playNext();
    };
    const onError = () => {
      // Silently recover from seek/network errors — the browser usually
      // fires a second canplaythrough after the error so playback resumes.
      console.warn("Audio element error (likely seek-related), ignoring.");
    };
    const onWaiting = () => {
      // Browser is buffering (happens after seek) — keep isPlaying true
    };
    const onCanPlayThrough = () => {
      // Auto-resume playback after seek buffer is ready
      if (isLoadingRef.current) {
        isLoadingRef.current = false;
        audio.play().then(() => setIsPlaying(true)).catch(() => {
          setIsPlaying(false);
          isLoadingRef.current = false;
        });
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDur);
    audio.addEventListener("durationchange", onDur);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError, true); // capture phase
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplaythrough", onCanPlayThrough);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("durationchange", onDur);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError, true);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplaythrough", onCanPlayThrough);
    };
  }, [playNext]);

  // Fetch prayer times
  const fetchPrayerTimes = useCallback(async () => {
    setPrayerLoading(true);
    setPrayerError("");
    setQiblaAngle(null);

    try {
      let lat: number, lng: number;
      let locName = "";

      if (useGeo) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: false,
          });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
      } else {
        const res = await fetch(`/api/prayer?city=${selectedCity}`);
        const data = await res.json();
        if (data.error) {
          setPrayerError(data.error);
          setPrayerLoading(false);
          return;
        }
        setPrayerData(data);
        lat = data.meta.latitude;
        lng = data.meta.longitude;
        locName = data.meta.locationName || data.meta.timezone;
        setPrayerLoading(false);
        // Calculate Qibla
        calcQibla(lat, lng, locName);
        return;
      }

      const res = await fetch(`/api/prayer?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data.error) {
        setPrayerError(data.error);
      } else {
        setPrayerData(data);
        locName = data.meta.locationName || data.meta.timezone;
      }

      calcQibla(lat, lng, locName);
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        setPrayerError("Location access denied. Please select a city below instead.");
        setUseGeo(false);
      } else {
        setPrayerError("Failed to load prayer times. Check your internet connection.");
      }
    } finally {
      setPrayerLoading(false);
    }
  }, [selectedCity, useGeo]);

  const calcQibla = (lat: number, lng: number, _locName?: string) => {
    const kaabaLat = (21.4225 * Math.PI) / 180;
    const kaabaLng = (39.8262 * Math.PI) / 180;
    const latR = (lat * Math.PI) / 180;
    const lngR = (lng * Math.PI) / 180;
    const y = Math.sin(kaabaLng - lngR);
    const x = Math.cos(latR) * Math.tan(kaabaLat) - Math.sin(latR) * Math.cos(kaabaLng - lngR);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    qibla = ((qibla % 360) + 360) % 360;
    setQiblaAngle(qibla);
  };

  useEffect(() => {
    if (activeTab === "prayer" && !prayerData && !prayerLoading) {
      fetchPrayerTimes();
    }
  }, [activeTab, prayerData, prayerLoading, fetchPrayerTimes]);

  // Fetch Quran surah — from API (real Urdu Junagarhi translation from Quran.com, with local fallback)
  useEffect(() => {
    if (activeTab !== "quran" || quranLoadingRef.current) return;
    quranLoadingRef.current = true;
    setQuranLoading(true);
    setQuranError("");
    fetch(`/api/quran?surah=${selectedSurahForReading}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        if (data.error) {
          setQuranError(data.error);
          setQuranData(null);
        } else {
          setQuranData(data);
        }
      })
      .catch(() => {
        setQuranError("Failed to load. Check your internet connection.");
      })
      .finally(() => {
        quranLoadingRef.current = false;
        setQuranLoading(false);
      });
  }, [activeTab, selectedSurahForReading, quranRetryKey]);

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "surahs", label: `Surahs (${surahs.length})`, icon: <List className="w-4 h-4" /> },
    { key: "quran", label: "Quran", icon: <BookText className="w-4 h-4" /> },
    { key: "intro", label: "Intro (4)", icon: <Headphones className="w-4 h-4" /> },
    { key: "asmaulhusna", label: "Asma ul Husna", icon: <Sparkles className="w-4 h-4" /> },
    { key: "prayer", label: "Prayer", icon: <Compass className="w-4 h-4" /> },
  ];

  // Landing screen
  if (!entered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative Islamic pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        {/* Glowing circle behind content */}
        <div className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Book icon */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-700/50 border-2 border-amber-400/30 flex items-center justify-center mb-6 sm:mb-8 shadow-lg shadow-emerald-900/50">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300" />
          </div>
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            بَيَان الْقُرْآن
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-emerald-200 mb-1">Bayan ul Quran</h2>
          <p className="text-emerald-300/80 text-sm sm:text-base mb-8 sm:mb-10">Dr. Israr Ahmad</p>
          
          {/* Enter button */}
          <button
            onClick={() => setEntered(true)}
            className="group relative px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-base font-semibold rounded-xl shadow-lg shadow-emerald-900/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-800/40 active:scale-95"
          >
            <span className="flex items-center gap-2">
              Login
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
        
        {/* Bottom decoration */}
        <div className="absolute bottom-8 text-emerald-500/40 text-xs">
 من الله توفيق
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <audio ref={audioRef} preload="auto"></audio>

      <header className="sticky top-0 z-50 bg-emerald-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">Bayan ul Quran</h1>
                <p className="text-emerald-200 text-xs sm:text-sm">Dr. Israr Ahmad</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://www.sos.org.pk/PersonForm" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-amber-300 hover:bg-amber-200 text-emerald-900 text-xs sm:text-sm gap-1.5 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Donate for Orphan</span>
                  <span className="sm:hidden">Donate</span>
                </Button>
              </a>
              <Button size="sm" variant="ghost" className="text-emerald-200 hover:text-white hover:bg-emerald-700 text-xs sm:text-sm" onClick={() => { setEntered(false); setShowPlayer(false); if (audioRef.current) { audioRef.current.pause(); } }}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 sm:py-6 pb-44">
        {/* Search */}
        {(activeTab === "surahs" || activeTab === "intro" || activeTab === "asmaulhusna") && (
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "asmaulhusna" ? "Search 99 Names of Allah..." : "Search surah by name or number..."}
              className="pl-10 h-11 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
              value={activeTab === "asmaulhusna" ? asmaSearch : searchQuery}
              onChange={(e) => (activeTab === "asmaulhusna" ? setAsmaSearch(e.target.value) : setSearchQuery(e.target.value))}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 -mx-1 px-1">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap ${activeTab === tab.key ? "bg-emerald-700 hover:bg-emerald-800 text-white" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        
        {activeTab === "surahs" && (
          <div className="space-y-2">
            {filteredSurahs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No surahs found</p>
              </div>
            )}
            {filteredSurahs.map((surah) => {
              const isCurrent = currentSurah?.id === surah.id;
              return (
                <div
                  key={surah.id}
                  className={`surah-card bg-white rounded-xl border p-3 sm:p-4 cursor-pointer ${isCurrent ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-emerald-100 hover:border-emerald-300"}`}
                  onClick={() => playTrack(surah.audio[0], surah)}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${isCurrent ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-700"}`}>
                      {isCurrent && isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base font-semibold">{surah.id}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm sm:text-base text-foreground truncate">{surah.nameEnglish}</span>
                        <span className="text-base sm:text-lg text-emerald-800 font-medium" dir="rtl">{surah.nameArabic}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${surah.type === "meccan" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>
                          {surah.type === "meccan" ? "Meccan" : "Medinan"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{surah.ayahCount} Ayahs</span>
                        {surah.audio.length > 1 && <span className="text-xs text-emerald-600 font-medium">{surah.audio.length} parts</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className={`shrink-0 rounded-full ${isCurrent ? "text-emerald-700 hover:bg-emerald-50" : "text-muted-foreground hover:text-emerald-700"}`} onClick={(e) => { e.stopPropagation(); if (isCurrent && isPlaying) togglePlay(); else playTrack(surah.audio[0], surah); }}>
                      {isCurrent && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                  </div>
                  {surah.audio.length > 1 && isCurrent && (
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Parts</p>
                      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                        {surah.audio.map((part, idx) => (
                          <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${currentTrack?.url === part.url ? "bg-emerald-100 text-emerald-800 font-medium" : "hover:bg-emerald-50 text-foreground"}`} onClick={(e) => { e.stopPropagation(); playTrack(part, surah); }}>
                            {currentTrack?.url === part.url && isPlaying ? <Pause className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Play className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            <span>{part.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        
        {activeTab === "quran" && (
          <div>
            <div className="flex gap-3 mb-4">
              <select
                className="flex-1 h-11 bg-white border border-emerald-200 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500"
                value={selectedSurahForReading}
                onChange={(e) => setSelectedSurahForReading(Number(e.target.value))}
              >
                {surahs.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}. {s.nameEnglish} ({s.nameArabic}) - {s.ayahCount} Ayahs
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Para Navigation */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Jump to Para</p>
              <div className="flex flex-wrap gap-1.5">
                {paras.map((p) => (
                  <button
                    key={p.id}
                    className="px-2.5 py-1.5 text-xs rounded-lg border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 transition-colors text-emerald-800 font-medium"
                    onClick={() => setSelectedSurahForReading(p.fromSurah)}
                  >
                    {p.id}
                  </button>
                ))}
              </div>
            </div>

            {quranLoading && (
              <div className="flex flex-col items-center py-12 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-600" />
                <p className="text-sm">Loading Surah...</p>
              </div>
            )}

            {quranError && !quranLoading && (
              <div className="text-center py-12">
                <p className="text-sm text-red-500 mb-3">{quranError}</p>
                <Button onClick={() => setQuranRetryKey((k) => k + 1)} size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                  Try Again
                </Button>
              </div>
            )}

            {quranData && !quranLoading && (
              <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 px-4 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg" dir="rtl">{quranData.nameArabic}</h3>
                    <p className="text-emerald-200 text-xs">Surah {quranData.surah} - {quranData.name} ({quranData.totalAyahs} Ayahs)</p>
                  </div>
                  <div className="flex gap-1">
                    {selectedSurahForReading > 1 && (
                      <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-600 h-8" onClick={() => setSelectedSurahForReading((prev) => prev - 1)}>
                        Prev
                      </Button>
                    )}
                    {selectedSurahForReading < 114 && (
                      <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-600 h-8" onClick={() => setSelectedSurahForReading((prev) => prev + 1)}>
                        Next
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
                  {quranData.surah !== 9 && quranData.surah !== 1 && (
                    <p className="text-center text-2xl text-emerald-800 font-medium pb-6 mb-6 border-b border-emerald-100" dir="rtl" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                  )}
                  <div className="space-y-6">
                    {quranData.ayahs.map((ayah) => (
                      <div key={ayah.number} className="flex gap-3">
                        <span className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 text-xs font-bold mt-1">{ayah.numberInSurah}</span>
                        <p className="text-xl sm:text-2xl text-gray-900 leading-[2.5] font-medium flex-1" dir="rtl" lang="ar">{ayah.arabic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        
        {activeTab === "intro" && (
          <div className="space-y-2">
            {introductions.map((intro, idx) => {
              const isCurrent = currentTrack?.url === intro.url && !currentSurah;
              return (
                <div key={idx} className={`surah-card bg-white rounded-xl border p-3 sm:p-4 cursor-pointer ${isCurrent ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-emerald-100 hover:border-emerald-300"}`} onClick={() => playTrack(intro)}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${isCurrent ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-700"}`}>
                      {isCurrent && isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">{intro.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Introduction to Bayan ul Quran</p>
                    </div>
                    <Button variant="ghost" size="icon" className={`shrink-0 rounded-full ${isCurrent ? "text-emerald-700" : "text-muted-foreground"}`} onClick={(e) => { e.stopPropagation(); if (isCurrent && isPlaying) togglePlay(); else playTrack(intro); }}>
                      {isCurrent && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        
        {activeTab === "asmaulhusna" && (
          <div>
            <div className="text-center mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800" dir="rtl">أسماء الله الحسنى</h2>
              <p className="text-sm text-muted-foreground mt-1">The 99 Beautiful Names of Allah</p>
            </div>

            
            <div className="bg-white rounded-xl border border-emerald-100 p-3 mb-6">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/VamZ-Jr8o5o?rel=0"
                  title="Asma ul Husna - 99 Names of Allah"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">Listen to the 99 Names of Allah</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredAsma.map((name) => (
                <div key={name.id} className="bg-white rounded-xl border border-emerald-100 p-4 hover:border-emerald-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-700 text-sm font-semibold">{name.id}</div>
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl text-emerald-800 font-medium" dir="rtl">{name.arabic}</p>
                      <p className="font-semibold text-sm text-foreground mt-1">{name.transliteration}</p>
                      <p className="text-xs text-muted-foreground" dir="rtl" lang="ur" style={{ fontFamily: "'Noto Nastaliq Urdu', serif" }}>{name.meaningUrdu}</p>
                      <p className="text-xs text-muted-foreground/70">{name.meaning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredAsma.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No names found</p>
              </div>
            )}
          </div>
        )}

        
        {activeTab === "prayer" && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-xl border border-emerald-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span className="text-sm font-medium">Select Location</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-emerald-600 w-4 h-4"
                    checked={useGeo}
                    onChange={(e) => { setUseGeo(e.target.checked); if (e.target.checked) { setPrayerData(null); } else { setPrayerData(null); } }}
                  />
                  <span className="text-sm">Use my current location</span>
                </label>
              </div>
              {!useGeo && (
                <div className="flex flex-wrap gap-1.5">
                  {CITY_OPTIONS.map((c) => (
                    <button
                      key={c.key}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors font-medium ${selectedCity === c.key ? "bg-emerald-700 text-white border-emerald-700" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
                      onClick={() => { setSelectedCity(c.key); setPrayerData(null); }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            
            <div className="bg-white rounded-xl border border-emerald-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-semibold text-foreground">Qibla Direction</h3>
              </div>
              {qiblaAngle !== null ? (
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-emerald-200 relative bg-gradient-to-b from-emerald-50 to-white mb-3">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-600">N</div>
                    <div className="absolute top-1/2 left-1/2" style={{ transform: `translate(-50%, -50%) rotate(${qiblaAngle}deg)`, transformOrigin: 'center center' }}>
                      <div className="w-1 h-20 bg-gradient-to-t from-emerald-700 to-amber-400 rounded-full relative">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-amber-500" />
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-700" />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">
                    Qibla: <span className="font-semibold text-emerald-700">{Math.round(qiblaAngle)}deg</span> from North
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  <MapPin className="w-5 h-5 mr-2 opacity-50" />
                  Select a location to see Qibla direction
                </div>
              )}
            </div>

            
            <div className="bg-white rounded-xl border border-emerald-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-semibold text-foreground">Prayer Times</h3>
                </div>
                <Button variant="outline" size="sm" onClick={fetchPrayerTimes} disabled={prayerLoading} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${prayerLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              {prayerLoading && (
                <div className="flex flex-col items-center py-8 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-600" />
                  <p className="text-sm">Loading prayer times...</p>
                </div>
              )}

              {prayerError && !prayerLoading && (
                <div className="text-center py-8">
                  <p className="text-sm text-red-500 mb-3">{prayerError}</p>
                  <Button onClick={fetchPrayerTimes} size="sm" className="bg-emerald-700 hover:bg-emerald-800">Try Again</Button>
                </div>
              )}

              {prayerData && !prayerLoading && (
                <>
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{prayerData.meta?.locationName || prayerData.meta?.timezone}</span>
                    <span className="mx-1">|</span>
                    <span>{prayerData.date?.readable}</span>
                    <span className="mx-1">|</span>
                    <span>{prayerData.date?.hijri?.date} {prayerData.date?.hijri?.month?.en} {prayerData.date?.hijri?.year} AH</span>
                  </div>
                  <div className="space-y-2">
                    {prayerTimes.map((p) => (
                      <div key={p.name} className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${p.isNext ? "bg-emerald-100 border border-emerald-300" : "bg-emerald-50/50"}`}>
                        <div className="flex items-center gap-3">
                          {p.isNext && <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />}
                          <span className={`font-medium text-sm ${p.isNext ? "text-emerald-800" : "text-foreground"}`}>{p.name}</span>
                          {p.isNext && <Badge className="bg-emerald-600 text-white text-[10px] px-1.5">Next</Badge>}
                        </div>
                        <span className={`text-sm tabular-nums font-medium ${p.isNext ? "text-emerald-700" : "text-muted-foreground"}`}>{formatTime12(p.time)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      
      {showPlayer && currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-emerald-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div ref={progressRef} className="h-1.5 bg-emerald-100 cursor-pointer group" onClick={seekTo}>
            <div className="h-full bg-emerald-600 transition-all duration-200 group-hover:bg-emerald-500 relative" style={{ width: `${progressPct}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-foreground">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground truncate">{currentSurah ? `Surah ${currentSurah.id} - ${currentSurah.nameEnglish}` : "Introduction"}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground" onClick={() => seekBy(-10)} title="Back 10s">
                  <Rewind className="w-4 h-4" />
                </Button>
                <Button variant="default" size="icon" className="h-10 w-10 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white" onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground" onClick={() => seekBy(10)} title="Forward 10s">
                  <FastForward className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground tabular-nums">{formatTime(currentTime)}/{formatTime(duration)}</span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={toggleMute}>
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={changeVolume} className="w-20 h-1 accent-emerald-600 cursor-pointer" />
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 shrink-0" onClick={closePlayer} aria-label="Close player">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
