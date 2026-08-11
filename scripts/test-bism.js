const d=JSON.parse(require('fs').readFileSync('src/lib/quran-uthmani.json','utf8'));
[2,3,4,9].forEach(s=>{
  const surah=d.surahs.find(x=>x.number===s);
  let t=surah.ayahs[0].text;
  const needle='ٱلرَّحِيمِ'.normalize('NFC');
  const idx=t.normalize('NFC').indexOf(needle);
  if(idx!==-1 && s!==1 && s!==9) t=t.substring(idx+needle.length).replace(/^[\s\uFEFF]+/,'');
  console.log('S'+s+' stripped: '+t.substring(0,40));
});
