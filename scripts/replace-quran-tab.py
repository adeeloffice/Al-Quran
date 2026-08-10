#!/usr/bin/env python3
"""Replace the Quran tab section in page.tsx with para-based reading."""

import re

FILE = "/home/z/my-project/src/app/page.tsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Find the Quran tab section
start_marker = '        {{activeTab === "quran" && ('
end_marker = '        )}\n\n        '

start_idx = content.find(start_marker)
if start_idx == -1:
    print("ERROR: Could not find start marker")
    exit(1)

# Find the closing of this block - it's {activeTab === "quran" && (...)}
# Count braces to find the end
brace_count = 0
i = start_idx
end_idx = -1
while i < len(content):
    if content[i] == '{':
        brace_count += 1
    elif content[i] == '}':
        brace_count -= 1
        if brace_count == 0:
            end_idx = i + 1
            break
    i += 1

if end_idx == -1:
    print("ERROR: Could not find end of quran tab block")
    exit(1)

print(f"Found quran tab from char {start_idx} to {end_idx} (length {end_idx - start_idx})")

new_quran_tab = '''        {activeTab === "quran" && (
          <div>
            {/* Para selector buttons */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Select Para (Juz)</p>
              <div className="flex flex-wrap gap-1.5">
                {paras.map((p) => (
                  <button
                    key={p.id}
                    className={`px-3 py-2 text-xs sm:text-sm rounded-lg border transition-all font-medium ${selectedPara === p.id ? "bg-emerald-700 text-white border-emerald-700 shadow-md" : "border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 text-emerald-800"}`}
                    onClick={() => setSelectedPara(p.id)}
                  >
                    <span className="block text-center font-bold">{toArabicNumeral(p.id)}</span>
                    <span className="block text-center text-[9px] sm:text-[10px] opacity-75" dir="rtl">{p.nameUrdu}</span>
                  </button>
                ))}
              </div>
            </div>

            {quranLoading && (
              <div className="flex flex-col items-center py-12 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-600" />
                <p className="text-sm">Loading Para {toArabicNumeral(selectedPara)}...</p>
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

            {paraSurahsData.length > 0 && !quranLoading && (
              <div className="bg-white rounded-xl border border-emerald-100 overflow-hidden">
                {/* Header: Para name + navigation */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 px-4 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg" dir="rtl" style={{ fontFamily: "'Amiri Quran', serif" }}>
                      جزء {toArabicNumeral(selectedPara)} - {paras.find(p => p.id === selectedPara)?.nameUrdu || ""}
                    </h3>
                    <p className="text-emerald-200 text-xs">Juz {selectedPara} - {paras.find(p => p.id === selectedPara)?.nameEnglish || ""}</p>
                  </div>
                  <div className="flex gap-1">
                    {selectedPara > 1 && (
                      <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-600 h-8" onClick={() => setSelectedPara((prev) => prev - 1)}>
                        Prev
                      </Button>
                    )}
                    {selectedPara < 30 && (
                      <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-600 h-8" onClick={() => setSelectedPara((prev) => prev + 1)}>
                        Next
                      </Button>
                    )}
                  </div>
                </div>

                {/* Dynamic metadata bar - updates on scroll */}
                {(() => {
                  const visibleSurah = paraSurahsData.find(s => s.surah === visibleSurahId) || paraSurahsData[0];
                  if (!visibleSurah) return null;
                  const meta = getSurahMeta(visibleSurah.surah);
                  const [hizbStart] = getHizbRange(selectedPara);
                  return (
                    <div className="border-b border-emerald-200 bg-emerald-50/50 px-2 sm:px-3 py-2 flex items-center justify-around gap-1.5 text-[10px] sm:text-xs" dir="rtl">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-200 bg-white shadow-sm whitespace-nowrap">
                        <span className="text-muted-foreground">الرُّكُوعُ</span>
                        <span className="font-bold text-emerald-800">{toArabicNumeral(meta?.rukus || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-200 bg-white shadow-sm whitespace-nowrap">
                        <span className="text-muted-foreground">سورة</span>
                        <span className="font-bold text-emerald-800" dir="rtl">{visibleSurah.nameArabic}</span>
                        <span className="text-muted-foreground">({toArabicNumeral(visibleSurah.surah)})</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-200 bg-white shadow-sm whitespace-nowrap">
                        <span className="text-muted-foreground">الحزب</span>
                        <span className="font-bold text-emerald-800">{toArabicNumeral(hizbStart)}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-200 bg-white shadow-sm whitespace-nowrap">
                        <span className="text-muted-foreground">جزء</span>
                        <span className="font-bold text-emerald-800">{toArabicNumeral(selectedPara)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Scrollable content: all surahs in this para */}
                <div ref={scrollContainerRef} className="max-h-[70vh] overflow-y-auto custom-scrollbar bg-[#faf8f0]">
                  {paraSurahsData.map((surahData, sIdx) => (
                    <div key={surahData.surah} data-surah-id={surahData.surah} className="px-3 sm:px-6 py-4">
                      {/* Surah heading for multi-surah paras */}
                      {paraSurahsData.length > 1 && (
                        <div className="text-center mb-4">
                          <h4 className="text-xl sm:text-2xl font-bold text-emerald-800" dir="rtl" style={{ fontFamily: "'Amiri Quran', serif" }}>{surahData.nameArabic}</h4>
                          <p className="text-xs text-muted-foreground">Surah {surahData.surah} - {surahData.name} ({surahData.ayahs.length} Ayahs)</p>
                        </div>
                      )}
                      {/* Bismillah (not for Surah 1 and 9, and not for mid-surah starts) */}
                      {surahData._fromAyah === 1 && surahData.surah !== 1 && surahData.surah !== 9 && (
                        <p className="text-center text-2xl sm:text-3xl text-gray-900 font-medium pb-4 mb-2" dir="rtl" lang="ar" style={{ fontFamily: "'Amiri Quran', serif" }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                      )}
                      {/* Mushaf-style continuous text */}
                      <div dir="rtl" lang="ar" className="text-2xl sm:text-[28px] md:text-3xl text-gray-900 leading-[2.8] sm:leading-[3] text-justify font-normal" style={{ fontFamily: "'Amiri Quran', 'Amiri', serif" }}>
                        {surahData.ayahs.map((ayah) => (
                          <span key={ayah.number}>
                            {ayah.arabic}
                            <span className="inline-flex items-center justify-center align-middle mx-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-400 text-sm sm:text-base text-gray-800 relative" style={{ fontFamily: "'Amiri Quran', serif" }}>
                              <span className="mt-0.5">{toArabicNumeral(ayah.numberInSurah)}</span>
                            </span>
                          </span>
                        ))}
                      </div>
                      {/* Separator between surahs */}
                      {sIdx < paraSurahsData.length - 1 && (
                        <div className="my-6 flex items-center gap-3">
                          <div className="flex-1 border-t border-emerald-300/50" />
                          <span className="text-emerald-600 text-lg">✦</span>
                          <div className="flex-1 border-t border-emerald-300/50" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}'''

content = content[:start_idx] + new_quran_tab + content[end_idx:]

with open(FILE, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully replaced Quran tab section. New file length: {len(content)}")
