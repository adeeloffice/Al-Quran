import { rukuBoundaries, getRukuForAyah, getGlobalRuku } from '../src/lib/ruku-boundaries';
import { paras } from '../src/lib/quran-paras';

const para28 = paras.find(p => p.id === 28)!;
console.log('=== PARA 28:', para28.nameEnglish, '===');
console.log('Surahs:', para28.surahs.map(s => `Surah ${s.id} (${s.fromAyah}-${s.toAyah})`).join(', '));
console.log();

// Check ruku boundaries for each surah in Para 28
for (const s of para28.surahs) {
  const bounds = rukuBoundaries[s.id];
  console.log(`Surah ${s.id}: ruku boundaries = [${bounds.join(', ')}]`);
  console.log(`  Ayah range in para: ${s.fromAyah}-${s.toAyah}`);
  
  // Show which ruku each ayah range maps to
  const rukuStart = getRukuForAyah(s.id, s.fromAyah);
  const rukuEnd = getRukuForAyah(s.id, s.toAyah);
  const globalStart = getGlobalRuku(s.id, s.fromAyah);
  const globalEnd = getGlobalRuku(s.id, s.toAyah);
  console.log(`  Ruku in surah: ${rukuStart} to ${rukuEnd} (${rukuEnd - rukuStart + 1} rukus)`);
  console.log(`  Global ruku: ${globalStart} to ${globalEnd}`);
  console.log();
}

// Compute para-relative ruku for start of each surah
const baseGlobal = getGlobalRuku(para28.surahs[0].id, para28.surahs[0].fromAyah);
console.log('Base global ruku (start of Para 28):', baseGlobal);
console.log();

console.log('=== PARA-RELATIVE RUKU AT START OF EACH SURAH ===');
for (const s of para28.surahs) {
  const g = getGlobalRuku(s.id, s.fromAyah);
  const paraRuku = g - baseGlobal + 1;
  console.log(`Surah ${s.id} ayah ${s.fromAyah}: para-relative ruku = ${paraRuku} (global ${g})`);
}

// Count total rukus in Para 28
const lastS = para28.surahs[para28.surahs.length - 1];
const gLast = getGlobalRuku(lastS.id, lastS.toAyah);
console.log(`\nTotal rukus in Para 28: ${gLast - baseGlobal + 1}`);

// Also check Para 29
console.log('\n=== PARA 29: ===');
const para29 = paras.find(p => p.id === 29)!;
const baseGlobal29 = getGlobalRuku(para29.surahs[0].id, para29.surahs[0].fromAyah);
console.log('Base global ruku (start of Para 29):', baseGlobal29);
for (const s of para29.surahs.slice(0, 3)) {
  const g = getGlobalRuku(s.id, s.fromAyah);
  const paraRuku = g - baseGlobal29 + 1;
  console.log(`Surah ${s.id} ayah ${s.fromAyah}: para-relative ruku = ${paraRuku} (global ${g})`);
}