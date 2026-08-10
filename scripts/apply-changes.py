#!/usr/bin/env python3
"""Apply all 5 requested changes to page.tsx and layout.tsx"""
import re

with open('/home/z/my-project/src/app/page.tsx', 'r') as f:
    content = f.read()

# ========== CHANGE 1: Add ALLAH and Muhammad SAW in Arabic at landing page ==========
old_landing = '''          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            بَيَان الْقُرْآن
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-emerald-200 mb-1">Bayan ul Quran</h2>
          <p className="text-emerald-300/80 text-sm sm:text-base mb-8 sm:mb-10">Dr. Israr Ahmad</p>'''

new_landing = '''          <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-300/90 mb-4" dir="rtl">الله</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            بَيَان الْقُرْآن
          </h1>
          <p className="text-2xl sm:text-3xl text-emerald-200/90 mb-1" dir="rtl" lang="ar">محمد ﷺ</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-emerald-200 mb-1">Bayan ul Quran</h2>
          <p className="text-emerald-300/80 text-sm sm:text-base mb-8 sm:mb-10">Dr. Israr Ahmad</p>'''

content = content.replace(old_landing, new_landing)

# ========== CHANGE 2: Add dark mode import and ThemeProvider usage ==========
content = content.replace(
    'import { useState, useRef, useEffect, useCallback, useMemo } from "react";',
    'import { useState, useRef, useEffect, useCallback, useMemo } from "react";\nimport { useTheme } from "next-themes";'
)

# Add icons for dark mode and sign out
content = content.replace(
    '  BookText,\n} from "lucide-react";',
    '  BookText,\n  Sun,\n  Moon,\n  LogOut,\n} from "lucide-react";'
)

# ========== CHANGE 3: Remove Intro tab type, add to surahs ==========
content = content.replace(
    'type TabType = "surahs" | "intro" | "asmaulhusna" | "prayer" | "quran";',
    'type TabType = "surahs" | "asmaulhusna" | "prayer" | "quran";'
)

# Remove CITY_OPTIONS (no longer needed)
content = content.replace(
    '''const CITY_OPTIONS = [
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
];''',
    '// Intro audios merged into surahs list as item 0'
)

# ========== Add useTheme hook and dark mode state in component ==========
# Find the export default function line and add theme hook after it
content = content.replace(
    'export default function Home() {\n  const [entered, setEntered] = useState(false);',
    'export default function Home() {\n  const { theme, setTheme } = useTheme();\n  const [entered, setEntered] = useState(false);\n  const [mounted, setMounted] = useState(false);\n  useEffect(() => setMounted(true), []);'
)

# ========== CHANGE 4: Update tabs - remove intro, show Surahs (114) ==========
old_tabs = '''  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "surahs", label: `Surahs (${surahs.length})`, icon: <List className="w-4 h-4" /> },
    { key: "quran", label: "Quran", icon: <BookText className="w-4 h-4" /> },
    { key: "intro", label: "Intro (4)", icon: <Headphones className="w-4 h-4" /> },
    { key: "asmaulhusna", label: "Asma ul Husna", icon: <Sparkles className="w-4 h-4" /> },
    { key: "prayer", label: "Prayer", icon: <Compass className="w-4 h-4" /> },
  ];'''

new_tabs = '''  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "surahs", label: `Surahs (114)`, icon: <List className="w-4 h-4" /> },
    { key: "quran", label: "Quran", icon: <BookText className="w-4 h-4" /> },
    { key: "asmaulhusna", label: "Asma ul Husna", icon: <Sparkles className="w-4 h-4" /> },
    { key: "prayer", label: "Prayer", icon: <Compass className="w-4 h-4" /> },
  ];'''

content = content.replace(old_tabs, new_tabs)

# ========== Add intro surah to filteredSurahs (search include intros) ==========
old_filtered = '''  const filteredSurahs = useMemo(
    () =>
      surahs.filter(
        (s) =>
          s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.nameUrdu.includes(searchQuery) ||
          s.number.includes(searchQuery) ||
          s.nameArabic.includes(searchQuery)
      ),
    [searchQuery]
  );'''

new_filtered = '''  // Build intro as a virtual surah (id=0) for the surahs list
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
  );'''

content = content.replace(old_filtered, new_filtered)

# ========== Update search bar to not include intro tab ==========
content = content.replace(
    '{(activeTab === "surahs" || activeTab === "intro" || activeTab === "asmaulhusna") && (',
    '{(activeTab === "surahs" || activeTab === "asmaulhusna") && ('
)

# ========== Update surah card to handle intro (id=0) specially ==========
# Change surah.id display for intro
old_surah_num = '                      {isCurrent && isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base font-semibold">{surah.id}</span>}'
new_surah_num = '                      {isCurrent && isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base font-semibold">{surah.id === 0 ? "●" : surah.id}</span>'
content = content.replace(old_surah_num, new_surah_num)

# Change ayah count display for intro
old_ayah = '''                        <span className="text-xs text-muted-foreground">{surah.ayahCount} Ayahs</span>
                        {surah.audio.length > 1 && <span className="text-xs text-emerald-600 font-medium">{surah.audio.length} parts</span>}'''
new_ayah = '''                        <span className="text-xs text-muted-foreground">{surah.id === 0 ? "4 parts" : `${surah.ayahCount} Ayahs`}</span>
                        {surah.audio.length > 1 && <span className="text-xs text-emerald-600 font-medium">{surah.id === 0 ? "" : `${surah.audio.length} parts`}</span>}'''
content = content.replace(old_ayah, new_ayah)

# ========== Remove intro tab section entirely ==========
old_intro_section = '''        {activeTab === "intro" && (
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
        )}'''

content = content.replace(old_intro_section, '')

# ========== CHANGE 4: Make sign-out more prominent ==========
old_signout = '''              <Button size="sm" variant="ghost" className="text-emerald-200 hover:text-white hover:bg-emerald-700 text-xs sm:text-sm" onClick={() => { setEntered(false); setShowPlayer(false); if (audioRef.current) { audioRef.current.pause(); } }}>
                Sign Out
              </Button>'''

new_signout = '''              <Button size="sm" className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-red-100 border border-red-400/30 text-xs sm:text-sm gap-1.5 font-medium" onClick={() => { setEntered(false); setShowPlayer(false); if (audioRef.current) { audioRef.current.pause(); } }}>
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>'''

content = content.replace(old_signout, new_signout)

# ========== Add dark mode toggle button next to donate ==========
old_header_buttons = '''            <div className="flex items-center gap-2">
              <a href="https://www.sos.org.pk/PersonForm" target="_blank" rel="noopener noreferrer">'''

new_header_buttons = '''            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-emerald-200 hover:text-amber-300 hover:bg-emerald-700" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle dark mode">
                {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <a href="https://www.sos.org.pk/PersonForm" target="_blank" rel="noopener noreferrer">'''

content = content.replace(old_header_buttons, new_header_buttons)

# ========== CHANGE 5: Simplify prayer location - geo only with prominent button ==========
old_prayer_location = '''            <div className="bg-white rounded-xl border border-emerald-100 p-4">
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
            </div>'''

new_prayer_location = '''            <div className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-emerald-900 p-4">
              <Button
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold h-12 text-sm gap-2"
                onClick={() => { setUseGeo(true); setPrayerData(null); fetchPrayerTimes(); }}
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
            </div>'''

content = content.replace(old_prayer_location, new_prayer_location)

# ========== Add dark mode classes to cards ==========
# Surah cards
content = content.replace(
    'surah-card bg-white rounded-xl border',
    'surah-card bg-white dark:bg-gray-800 rounded-xl border'
)
content = content.replace(
    '"border-emerald-500 ring-2 ring-emerald-500/20" : "border-emerald-100 hover:border-emerald-300"',
    '"border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20" : "border-emerald-100 dark:border-gray-700 hover:border-emerald-300"'
)

# Asma ul Husna cards
content = content.replace(
    'className="bg-white rounded-xl border border-emerald-100 p-4 hover:border-emerald-300 transition-colors"',
    'className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-gray-700 p-4 hover:border-emerald-300 transition-colors"'
)

# Asma heading card
content = content.replace(
    '<div className="bg-white rounded-xl border border-emerald-100 p-3 mb-6">',
    '<div className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-gray-700 p-3 mb-6">'
)

# Prayer cards  
content = content.replace(
    '<div className="bg-white rounded-xl border border-emerald-100 p-6">',
    '<div className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-gray-700 p-6">'
)

# Quran reading container  
content = content.replace(
    'className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-gray-700 p-4 sm:p-6"',
    'className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-100 dark:border-gray-700 p-4 sm:p-6"'
)

# Main background
content = content.replace(
    '<div className="min-h-screen flex flex-col bg-background">',
    '<div className="min-h-screen flex flex-col bg-background dark:bg-gray-950">'
)

# Header dark
content = content.replace(
    '<header className="sticky top-0 z-50 bg-emerald-800 text-white shadow-lg">',
    '<header className="sticky top-0 z-50 bg-emerald-800 dark:bg-emerald-950 text-white shadow-lg">'
)

# Search input
content = content.replace(
    'className="pl-10 h-11 bg-white border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"',
    'className="pl-10 h-11 bg-white dark:bg-gray-800 border-emerald-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"'
)

# Select for Quran reading
content = content.replace(
    'className="flex-1 h-11 bg-white border border-emerald-200 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500"',
    'className="flex-1 h-11 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-gray-700 rounded-xl px-3 text-sm focus:outline-none focus:border-emerald-500 dark:text-gray-200"'
)

# Player bar dark
content = content.replace(
    'className="fixed bottom-0 left-0 right-0 z-50 bg-gray-50 border-t-2 border-emerald-600',
    'className="fixed bottom-0 left-0 right-0 z-50 bg-gray-50 dark:bg-gray-900 border-t-2 border-emerald-600'
)

# Surah number bg in list
content = content.replace(
    'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${isCurrent ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-700"}',
    'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 ${isCurrent ? "bg-emerald-700 text-white" : "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700"}'
)

# Surah parts expand
content = content.replace(
    'mt-3 pt-3 border-t border-emerald-100',
    'mt-3 pt-3 border-t border-emerald-100 dark:border-gray-700'
)

# Part items hover
content = content.replace(
    'hover:bg-emerald-50 text-foreground',
    'hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-foreground'
)

# Active part bg
content = content.replace(
    '"bg-emerald-100 text-emerald-800 font-medium"',
    '"bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-medium"'
)

with open('/home/z/my-project/src/app/page.tsx', 'w') as f:
    f.write(content)

print("All changes applied to page.tsx")

# ========== Update layout.tsx for ThemeProvider ==========
with open('/home/z/my-project/src/app/layout.tsx', 'r') as f:
    layout = f.read()

layout = layout.replace(
    'import type { Metadata } from "next";\nimport { Geist } from "next/font/google";',
    'import type { Metadata } from "next";\nimport { Geist } from "next/font/google";\nimport { ThemeProvider } from "next-themes";'
)

layout = layout.replace(
    '    <html lang="ur" dir="ltr" suppressHydrationWarning>',
    '    <html lang="ur" dir="ltr" suppressHydrationWarning>'
)

layout = layout.replace(
    '      <body className={`${geistSans.variable} antialiased`}>\n        <ServiceWorkerRegistrar />\n        {children}',
    '      <body className={`${geistSans.variable} antialiased`}>\n        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>\n          <ServiceWorkerRegistrar />\n          {children}\n        </ThemeProvider>'
)

# Update theme-color meta for dark mode support
layout = layout.replace(
    '<meta name="theme-color" content="#065f46" />',
    '<meta name="theme-color" content="#065f46" media="(prefers-color-scheme: light)" />\n        <meta name="theme-color" content="#022c22" media="(prefers-color-scheme: dark)" />'
)

with open('/home/z/my-project/src/app/layout.tsx', 'w') as f:
    f.write(layout)

print("Layout updated with ThemeProvider")
print("Done!")
