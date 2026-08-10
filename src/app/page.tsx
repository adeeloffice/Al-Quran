"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  X,
  BookOpen,
  Headphones,
  List,
} from "lucide-react";

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState<SurahAudio | null>(null);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeTab, setActiveTab] = useState<"surahs" | "intro">("surahs");
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const filteredSurahs = surahs.filter(
    (s) =>
      s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameUrdu.includes(searchQuery) ||
      s.number.includes(searchQuery) ||
      s.nameArabic.includes(searchQuery)
  );

  const playTrack = useCallback(
    (track: SurahAudio, surah?: Surah) => {
      setCurrentTrack(track);
      setCurrentSurah(surah || null);
      setIsPlaying(true);
      setShowPlayer(true);
    },
    []
  );

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

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
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
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

  const changeVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      setVolume(v);
      if (audioRef.current) {
        audioRef.current.volume = v;
        if (v > 0) setIsMuted(false);
      }
    },
    []
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.url;
    audio.volume = isMuted ? 0 : volume;
    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [currentTrack, volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration);
    const onEnd = () => {
      setIsPlaying(false);
      playNext();
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDur);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("ended", onEnd);
    };
  }, [playNext]);

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-emerald-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                  Bayan ul Quran
                </h1>
                <p className="text-emerald-200 text-xs sm:text-sm">
                  Dr. Israr Ahmad
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 text-xs"
              >
                114 Surahs
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 sm:py-6 pb-40">
        {/* Search */}
        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search surah by name or number..."
            className="pl-10 h-11 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 sm:mb-6">
          <Button
            variant={activeTab === "surahs" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("surahs")}
            className={
              activeTab === "surahs"
                ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            }
          >
            <List className="w-4 h-4 mr-1.5" />
            Surahs ({surahs.length})
          </Button>
          <Button
            variant={activeTab === "intro" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("intro")}
            className={
              activeTab === "intro"
                ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            }
          >
            <Headphones className="w-4 h-4 mr-1.5" />
            Introduction (4)
          </Button>
        </div>

        {/* Surahs Tab */}
        {activeTab === "surahs" && (
          <div className="space-y-2">
            {filteredSurahs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No surahs found matching &quot;{searchQuery}&quot;</p>
              </div>
            )}
            {filteredSurahs.map((surah) => {
              const isCurrentSurah = currentSurah?.id === surah.id;
              return (
                <div
                  key={surah.id}
                  className={`surah-card bg-white rounded-xl border p-3 sm:p-4 cursor-pointer ${
                    isCurrentSurah
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : "border-emerald-100 hover:border-emerald-300"
                  }`}
                  onClick={() =>
                    playTrack(surah.audio[0], surah)
                  }
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Number */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrentSurah
                          ? "bg-emerald-700 text-white"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {isCurrentSurah && isPlaying ? (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <span className="text-sm sm:text-base font-semibold">
                          {surah.id}
                        </span>
                      )}
                    </div>

                    {/* Surah Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm sm:text-base text-foreground truncate">
                          {surah.nameEnglish}
                        </span>
                        <span
                          className="text-base sm:text-lg text-emerald-800 font-medium"
                          dir="rtl"
                        >
                          {surah.nameArabic}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 ${
                            surah.type === "meccan"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {surah.type === "meccan" ? "Meccan" : "Medinan"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {surah.ayahCount} Ayahs
                        </span>
                        {surah.audio.length > 1 && (
                          <span className="text-xs text-emerald-600 font-medium">
                            {surah.audio.length} parts
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Play button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`shrink-0 rounded-full ${
                        isCurrentSurah
                          ? "text-emerald-700 hover:bg-emerald-50"
                          : "text-muted-foreground hover:text-emerald-700"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrentSurah && isPlaying) {
                          togglePlay();
                        } else {
                          playTrack(surah.audio[0], surah);
                        }
                      }}
                    >
                      {isCurrentSurah && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  {/* Parts list for multi-part surahs */}
                  {surah.audio.length > 1 && isCurrentSurah && (
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Parts
                      </p>
                      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                        {surah.audio.map((part, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                              currentTrack?.url === part.url
                                ? "bg-emerald-100 text-emerald-800 font-medium"
                                : "hover:bg-emerald-50 text-foreground"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              playTrack(part, surah);
                            }}
                          >
                            {currentTrack?.url === part.url && isPlaying ? (
                              <Pause className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
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

        {/* Introduction Tab */}
        {activeTab === "intro" && (
          <div className="space-y-2">
            {introductions.map((intro, idx) => {
              const isCurrentTrack =
                currentTrack?.url === intro.url && !currentSurah;
              return (
                <div
                  key={idx}
                  className={`surah-card bg-white rounded-xl border p-3 sm:p-4 cursor-pointer ${
                    isCurrentTrack
                      ? "border-emerald-500 ring-2 ring-emerald-500/20"
                      : "border-emerald-100 hover:border-emerald-300"
                  }`}
                  onClick={() => playTrack(intro)}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${
                        isCurrentTrack
                          ? "bg-emerald-700 text-white"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {isCurrentTrack && isPlaying ? (
                        <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm sm:text-base truncate">
                        {intro.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Introduction to Bayan ul Quran
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`shrink-0 rounded-full ${
                        isCurrentTrack
                          ? "text-emerald-700"
                          : "text-muted-foreground"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrentTrack && isPlaying) {
                          togglePlay();
                        } else {
                          playTrack(intro);
                        }
                      }}
                    >
                      {isCurrentTrack && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Player */}
      {showPlayer && currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-emerald-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          {/* Mini progress bar at top of player */}
          <div
            ref={progressRef}
            className="h-1 bg-emerald-100 cursor-pointer group"
            onClick={seekTo}
          >
            <div
              className="h-full bg-emerald-600 transition-all duration-200 group-hover:bg-emerald-500 relative"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-3">
            {/* Track info + controls row */}
            <div className="flex items-center gap-3">
              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate text-foreground">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentSurah
                    ? `Surah ${currentSurah.id} - ${currentSurah.nameEnglish}`
                    : "Introduction"}
                </p>
              </div>

              {/* Playback controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-foreground"
                  onClick={playPrev}
                  disabled={!currentSurah || currentSurah.audio.length <= 1}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-foreground"
                  onClick={playNext}
                  disabled={!currentSurah || currentSurah.audio.length <= 1}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Time + Volume */}
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-xs text-muted-foreground tabular-nums w-10">
                  {formatTime(duration)}
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={toggleMute}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={changeVolume}
                    className="w-20 h-1 accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground sm:hidden"
                onClick={() => {
                  setShowPlayer(false);
                  setIsPlaying(false);
                  if (audioRef.current) audioRef.current.pause();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
