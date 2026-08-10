import { rukuBoundaries } from '../src/lib/ruku-boundaries';

let total = 0;
for (let s = 1; s <= 114; s++) {
  const count = rukuBoundaries[s]?.length || 0;
  if (count > 0) {
    total += count;
    if (count > 20 || (s <= 60 && count > 10)) {
      console.log(`Surah ${s}: ${count} rukus`);
    }
  }
}
console.log(`\nTotal rukus: ${total}`);
console.log(`Expected: 540`);

// Show all surahs with their ruku counts
console.log('\n=== ALL SURAH RUKU COUNTS ===');
for (let s = 1; s <= 114; s++) {
  const count = rukuBoundaries[s]?.length || 0;
  console.log(`Surah ${s.toString().padStart(3)}: ${count.toString().padStart(2)} rukus`);
}