const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, '..', 'src', 'lib', 'quran-uthmani.json');

async function fetchFullQuran() {
  console.log('Attempting to fetch full Quran (Uthmanic)...');
  const res = await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(`API error: ${json.status}`);
  return json.data;
}

async function fetchSurah(n) {
  const url = `https://api.alquran.cloud/v1/surah/${n}/quran-uthmani`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for surah ${n}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(`API error for surah ${n}: ${json.status}`);
  return json.data;
}

async function main() {
  let data;
  try {
    data = await fetchFullQuran();
    console.log('Full Quran fetched successfully.');
  } catch (err) {
    console.log('Full Quran fetch failed, falling back to individual surahs...');
    console.log(err.message);
    const surahs = [];
    for (let i = 1; i <= 114; i++) {
      try {
        const s = await fetchSurah(i);
        surahs.push(s);
        console.log(`  Fetched surah ${i}/114`);
      } catch (e) {
        console.error(`  Failed surah ${i}: ${e.message}`);
        // Retry once
        try {
          const s = await fetchSurah(i);
          surahs.push(s);
          console.log(`  Retry succeeded for surah ${i}`);
        } catch (e2) {
          console.error(`  Retry also failed for surah ${i}: ${e2.message}`);
        }
      }
      // Small delay to be polite
      await new Promise(r => setTimeout(r, 200));
    }
    data = { surahs, number: 114, name: 'Quran', englishName: 'Quran', revelationType: 'Quran' };
  }

  // Save
  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Saved to ${OUTPUT}`);

  // Verify
  const count = data.surahs.reduce((sum, s) => sum + s.ayahs.length, 0);
  console.log(`Total ayahs: ${count}`);
  console.log(`Total surahs: ${data.surahs.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
