"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { surahs, introductions, type Surah, type SurahAudio } from "@/lib/surah-data";

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
  Compass,
  Clock,
  MapPin,
  RefreshCw,
  Loader2,
  Navigation,
  Heart,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
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

type TabType = "surahs" | "prayer";

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

// Intro audios merged into surahs list as item 0

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLInputElement>(null);
  const isSeekingRef = useRef(false);
  const isLoadingRef = useRef(false);
  const restoredRef = useRef(false);

  // Prayer times state
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [prayerError, setPrayerError] = useState("");

  const [prayerNotifEnabled, setPrayerNotifEnabled] = useState(false);
  const [silentModeDetected, setSilentModeDetected] = useState(false);
  const notifTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedPrayersRef = useRef<Set<string>>(new Set());

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
        if (s.prayerNotifEnabled) setPrayerNotifEnabled(true);

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
    const state: any = { entered, activeTab, volume, isMuted, prayerNotifEnabled };
    if (currentTrack) {
      state.trackUrl = currentTrack.url;
      state.trackTitle = currentTrack.title;
      if (currentSurah) state.surahId = currentSurah.id;
    }
    try { localStorage.setItem("bayan-ul-quran-state", JSON.stringify(state)); } catch {}
  }, [entered, activeTab, volume, isMuted, currentTrack, currentSurah, prayerNotifEnabled]);

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

  // Build intro as a virtual surah (id=0) for the surahs list
  const introAsSurah: Surah = useMemo(() => ({
    id: 0, number: "000", nameArabic: "مقدمہ", nameUrdu: "مقدمہ", nameEnglish: "Introduction",
    ayahCount: 0, type: "meccan", audio: introductions,
  }), []);

  const allSurahItems = useMemo(() => [introAsSurah, ...surahs], [introAsSurah]);

  const filteredSurahs = useMemo(
    () =>
      allSurahItems.filter(
        (s) =>
          s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nameUrdu.includes(searchQuery) ||
          s.number.includes(searchQuery) ||
          s.nameArabic.includes(searchQuery)
      ),
    [allSurahItems, searchQuery]
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

  const seekFromBar = useCallback((val: string) => {
    if (!audioRef.current || !duration) return;
    const newTime = parseFloat(val);
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

    const onTime = () => { if (!isSeekingRef.current) setCurrentTime(audio.currentTime); };
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
  const fetchPrayerTimes = useCallback(async (useCachedLocation = false) => {
    setPrayerLoading(true);
    setPrayerError("");

    try {
      let lat: number, lng: number;

      // Try cached location first for instant refresh
      const cachedLoc = (() => { try { return JSON.parse(localStorage.getItem("prayer-location") || "null"); } catch { return null; } })();

      if (useCachedLocation && cachedLoc) {
        lat = cachedLoc.lat;
        lng = cachedLoc.lng;
      } else {
        // Get fresh location
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 8000,
            enableHighAccuracy: false,
            maximumAge: 300000, // accept 5-min cached position
          });
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        // Cache location for next time
        try { localStorage.setItem("prayer-location", JSON.stringify({ lat, lng })); } catch {}
      }

      const res = await fetch(`/api/prayer?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (data.error) {
        setPrayerError(data.error);
      } else {
        setPrayerData(data);
      }
    } catch (err) {
      // If geolocation fails but we have cached location, use it
      const cachedLoc = (() => { try { return JSON.parse(localStorage.getItem("prayer-location") || "null"); } catch { return null; } })();
      if (cachedLoc && !useCachedLocation) {
        try {
          const res = await fetch(`/api/prayer?lat=${cachedLoc.lat}&lng=${cachedLoc.lng}`);
          const data = await res.json();
          if (!data.error) {
            setPrayerData(data);
            setPrayerLoading(false);
            return;
          }
        } catch {}
      }
      if (err instanceof GeolocationPositionError) {
        setPrayerError("Location access denied. Please enable location permission and try again.");
      } else {
        setPrayerError("Failed to load prayer times. Check your internet connection.");
      }
    } finally {
      setPrayerLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "prayer" && !prayerData && !prayerLoading) {
      fetchPrayerTimes();
    }
  }, [activeTab, prayerData, prayerLoading, fetchPrayerTimes]);

  // Auto-refresh prayer times at midnight (new day = new prayer times)
  useEffect(() => {
    if (!prayerData) return;

    const scheduleMidnightRefresh = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = midnight.getTime() - now.getTime();

      const timer = setTimeout(() => {
        fetchPrayerTimes(true); // use cached location, instant refresh
        scheduleMidnightRefresh(); // schedule next midnight
      }, msUntilMidnight);

      return () => clearTimeout(timer);
    };

    const cleanup = scheduleMidnightRefresh();
    return () => { if (cleanup) cleanup(); };
  }, [prayerData, fetchPrayerTimes]);

  // === Prayer Notification System ===

  // Check if device is on silent mode using Web Audio API
  const checkSilentMode = useCallback(async () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.001; // near-silent test tone
      osc.connect(gain);
      gain.connect(ctx.destination);
      await ctx.resume();
      // If the context starts in 'suspended' state, device may be on silent
      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
          // If it still won't resume, likely silent mode
          if (ctx.state === 'suspended') {
            setSilentModeDetected(true);
            ctx.close();
            return true;
          }
        } catch {
          setSilentModeDetected(true);
          ctx.close();
          return true;
        }
      }
      ctx.close();
      setSilentModeDetected(false);
      return false;
    } catch {
      setSilentModeDetected(false);
      return false;
    }
  }, []);

  // Play Allahu Akbar alert sound using Web Audio API (synthesized)
  const playAllahuAkbarAlert = useCallback(async () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      await ctx.resume();

      // Create a rich tone for the adhan-like alert
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.setValueAtTime(0.3, startTime + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      // Allahu Akbar melody - ascending tones
      playTone(392, now, 0.4);        // G4
      playTone(440, now + 0.4, 0.4);  // A4
      playTone(523, now + 0.8, 0.6);  // C5
      playTone(587, now + 1.4, 0.6);  // D5
      playTone(523, now + 2.0, 0.4);  // C5
      playTone(440, now + 2.4, 0.5);  // A4
      playTone(392, now + 2.9, 0.8);  // G4

      setTimeout(() => ctx.close(), 4500);
    } catch {}
  }, []);

  // Request notification permission
  const requestNotifPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }, []);

  // Toggle notification on/off
  const togglePrayerNotif = useCallback(async () => {
    if (!prayerNotifEnabled) {
      // Turning ON
      const isSilent = await checkSilentMode();
      if (isSilent) {
        // Don't enable if silent mode - show message
        return;
      }
      const granted = await requestNotifPermission();
      if (granted) {
        setPrayerNotifEnabled(true);
      }
    } else {
      // Turning OFF
      setPrayerNotifEnabled(false);
      if (notifTimerRef.current) {
        clearInterval(notifTimerRef.current);
        notifTimerRef.current = null;
      }
      notifiedPrayersRef.current.clear();
    }
  }, [prayerNotifEnabled, checkSilentMode, requestNotifPermission]);

  // Notification checker - runs every 30 seconds when enabled
  useEffect(() => {
    if (!prayerNotifEnabled || !prayerData) {
      if (notifTimerRef.current) {
        clearInterval(notifTimerRef.current);
        notifTimerRef.current = null;
      }
      return;
    }

    const check = () => {
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]; // exclude Sunrise

      for (const name of prayerNames) {
        const timeStr = prayerData.timings[name];
        if (!timeStr) continue;
        const t = timeStr.split(" ")[0];
        const [h, m] = t.split(":").map(Number);
        const pMins = h * 60 + m;
        const key = `${name}-${now.toDateString()}`;

        // Check if it's prayer time (within 1 minute window)
        if (Math.abs(nowMins - pMins) <= 1 && !notifiedPrayersRef.current.has(key)) {
          notifiedPrayersRef.current.add(key);

          // Send browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Azan - ${name}`, {
              body: `It's time for ${name} prayer. ${formatTime12(t)}`,
              icon: '/icon-192.png',
              tag: key,
              requireInteraction: true,
            });
          }

          // Play Allahu Akbar sound
          playAllahuAkbarAlert();
        }
      }
    };

    // Check immediately
    check();
    // Then every 30 seconds
    notifTimerRef.current = setInterval(check, 30000);

    return () => {
      if (notifTimerRef.current) {
        clearInterval(notifTimerRef.current);
        notifTimerRef.current = null;
      }
    };
  }, [prayerNotifEnabled, prayerData, playAllahuAkbarAlert]);

  // Check silent mode on mount and when tab becomes visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && prayerNotifEnabled) {
        checkSilentMode();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [prayerNotifEnabled, checkSilentMode]);

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "surahs", label: "Bayan ul Quran", icon: <Headphones className="w-4 h-4" /> },
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
          <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-300/90 mb-4" dir="rtl">الله</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            بَيَان الْقُرْآن
          </h1>
          <p className="text-2xl sm:text-3xl text-emerald-200/90 mb-1" dir="rtl" lang="ar">محمد ﷺ</p>
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
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-950">
      <audio ref={audioRef} preload="auto"></audio>

      <header className="sticky top-0 z-50 bg-emerald-800 dark:bg-emerald-950 text-white shadow-lg">
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
              <Button size="icon" variant="ghost" className="text-emerald-200 hover:text-amber-300 hover:bg-emerald-700" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle dark mode">
                {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <a href="https://www.sos.org.pk/PersonForm" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-amber-300 hover:bg-amber-200 text-emerald-900 text-xs sm:text-sm gap-1.5 font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Donate for Orphan</span>
                  <span className="sm:hidden">Donate</span>
                </Button>
              </a>
              <Button size="sm" className="bg-amber-300 hover:bg-amber-200 text-emerald-900 text-xs sm:text-sm gap-1.5 font-bold shadow-md hover:shadow-lg" onClick={() => { setEntered(false); setShowPlayer(false); if (audioRef.current) { audioRef.current.pause(); } }}>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 sm:py-6 pb-44">
        {/* Search */}
        {activeTab === "surahs" && (
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search surah by name or number..."
              className="pl-10 h-11 bg-white dark:bg-gray-800 border-emerald-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  className={`surah-card bg-white dark:bg-gray-800 rounded-xl border p-3 sm:p-4 cursor-pointer ${isCurrent ? "border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20" : "border-emerald-100 dark:border-gray-700 hover:border-emerald-300"}`}
                  onClick={() => playTrack(surah.audio[0], surah)}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${isCurrent ? "bg-emerald-700 text-white" : "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700"}`}>
                      {isCurrent && isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base font-semibold">{surah.id === 0 ? "\u25CF" : surah.id}</span>}
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
                        <span className="text-xs text-muted-foreground">{surah.id === 0 ? "4 parts" : `${surah.ayahCount} Ayahs`}</span>
                        {surah.audio.length > 1 && <span className="text-xs text-emerald-600 font-medium">{surah.id === 0 ? "" : `${surah.audio.length} parts`}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className={`shrink-0 rounded-full ${isCurrent ? "text-emerald-700 hover:bg-emerald-50" : "text-muted-foreground hover:text-emerald-700"}`} onClick={(e) => { e.stopPropagation(); if (isCurrent && isPlaying) togglePlay(); else playTrack(surah.audio[0], surah); }}>
                      {isCurrent && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                  </div>
                  {surah.audio.length > 1 && isCurrent && (
                    <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-gray-700">
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Parts</p>
                      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                        {surah.audio.map((part, idx) => (
                          <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${currentTrack?.url === part.url ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-medium" : "hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-foreground"}`} onClick={(e) => { e.stopPropagation(); playTrack(part, surah); }}>
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

        {activeTab === "prayer" && (
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-emerald-900 p-4">
              <Button
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold h-12 text-sm gap-2"
                onClick={() => { fetchPrayerTimes(false); }}
                disabled={prayerLoading}
              >
                <MapPin className="w-4 h-4" />
                {prayerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                Use Your Current Location
              </Button>
              {prayerData && (
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Location: <span className="font-medium text-foreground">{prayerData.meta?.locationName || prayerData.meta?.timezone}</span>
                </p>
              )}
            </div>

            {/* Prayer Notification Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-lg">🔔</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">Prayer Notifications</p>
                    <p className="text-xs text-muted-foreground">Allahu Akbar alert at prayer time</p>
                  </div>
                </div>
                <button
                  onClick={togglePrayerNotif}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${prayerNotifEnabled ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-600"}`}
                  aria-label="Toggle prayer notifications"
                >
                  <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${prayerNotifEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
              {silentModeDetected && (
                <div className="mt-3 flex items-start gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <span className="text-amber-600 text-sm mt-0.5">⚠️</span>
                  <p className="text-xs text-amber-700 dark:text-amber-400">Your device is on <b>silent mode</b>. Notifications will not produce sound. Please turn off silent mode to hear the Allahu Akbar alert.</p>
                </div>
              )}
              {prayerNotifEnabled && !silentModeDetected && (
                <p className="mt-2 text-xs text-emerald-600 text-center">✓ Notifications active — Allahu Akbar will play at each prayer time</p>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-semibold text-foreground">Prayer Times</h3>
                </div>
                <Button variant="outline" size="sm" onClick={() => fetchPrayerTimes(false)} disabled={prayerLoading} className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
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
                  <Button onClick={() => fetchPrayerTimes(false)} size="sm" className="bg-emerald-700 hover:bg-emerald-800">Try Again</Button>
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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-50 dark:bg-gray-900 border-t-2 border-emerald-600 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
          {/* Touch-friendly seekbar */}
          <div className="px-3 pt-2.5">
            <input
              ref={seekBarRef}
              type="range"
              min="0"
              max={duration || 0}
              step="0.5"
              value={currentTime}
              onChange={(e) => seekFromBar(e.target.value)}
              onMouseDown={() => { isSeekingRef.current = true; }}
              onMouseUp={() => { isSeekingRef.current = false; }}
              onTouchStart={() => { isSeekingRef.current = true; }}
              onTouchEnd={() => { isSeekingRef.current = false; }}
              className="w-full h-2.5 cursor-pointer"
              style={{ WebkitAppearance: 'none', appearance: 'none', background: `linear-gradient(to right, #047857 ${progressPct}%, #a7f3d0 ${progressPct}%)`, borderRadius: '6px' }}
            />
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
