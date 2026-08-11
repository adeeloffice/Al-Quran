const https = require('https');
function fetchPage(ch) {
  return new Promise((res,rej) => {
    https.get(`https://api.quran.com/api/v4/verses/by_chapter/${ch}?fields=verse_number,ruku_number&per_page=300`, r => {
      let d=''; r.on('data',c=>d+=c); r.on('end',()=>res(JSON.parse(d)));
    }).on('error',rej);
  });
}
(async()=>{
  const all=[null]; let total=0;
  for(let ch=1;ch<=114;ch++){
    const r=await fetchPage(ch);
    const vs=r.verses||[];
    if(!vs.length){all.push([1]);total+=1;continue;}
    const starts=[]; let cur=null;
    for(const v of vs){if(v.ruku_number!==cur){cur=v.ruku_number;starts.push(v.verse_number);}}
    all.push(starts); total+=starts.length;
  }
  console.log('TOTAL:'+total);
  let ts=`// Auto-fetched from Quran.com API - ${total} Rukus\nexport const rukuBoundaries: number[][] = [\n[],`;
  for(let i=1;i<=114;i++) ts+=`\n  [${all[i].join(',')}],`;
  ts+=`\n];\n`;
  ts+=`export function getRukuForAyah(surahId:number,ayahInSurah:number){const b=rukuBoundaries[surahId];if(!b||!b.length)return 1;let r=1;for(let i=1;i<b.length;i++){if(ayahInSurah>=b[i])r=i+1;else break;}return r;}
`;
  ts+=`export function getRukuCount(s:number){return rukuBoundaries[s]?.length||0;}
`;
  ts+=`export function getGlobalRuku(s:number,a:number){let g=0;for(let i=1;i<s;i++)g+=rukuBoundaries[i]?.length||0;return g+getRukuForAyah(s,a);}
`;
  ts+=`export function getHizbForPosition(p:number,t:number,a:number){const h=(p-1)*2+1;return t<=0?h:(a/t>=0.5?h+1:h);}
`;
  require('fs').writeFileSync('/home/z/my-project/src/lib/ruku-boundaries.ts',ts);
  console.log('DONE');
})();
