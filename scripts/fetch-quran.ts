const fs = require('fs');
const path = require('path');

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url} ${res.status}`);
  return res.json();
}

async function main() {
  const allSurahs = [];
  
  for (let s = 1; s <= 114; s++) {
    try {
      console.log(`Fetching surah ${s}...`);
      const [arabic, urdu] = await Promise.all([
        fetchJSON(`https://api.alquran.cloud/v1/surah/${s}/quran-uthmani`),
        fetchJSON(`https://api.alquran.cloud/v1/surah/${s}/urdu.junagarhi`),
      ]);
      
      const ayahs = arabic.data.ayahs.map((a, i) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        arabic: a.text,
        urdu: urdu.data.ayahs[i]?.text || "",
      }));
      
      allSurahs.push({
        surah: arabic.data.number,
        name: arabic.data.englishName,
        nameArabic: arabic.data.name,
        totalAyahs: arabic.data.numberOfAyahs,
        ayahs,
      });
      
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.error(`Error surah ${s}:`, e.message);
    }
  }
  
  const outPath = '/home/z/my-project/src/lib/quran-data.json';
  fs.writeFileSync(outPath, JSON.stringify(allSurahs), 'utf-8');
  console.log(`Done! Saved ${allSurahs.length} surahs`);
  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
  console.log(`File size: ${sizeMB} MB`);
}

main();
