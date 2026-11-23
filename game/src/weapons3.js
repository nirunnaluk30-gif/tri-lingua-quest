/* =====================================================================
   ELEMENTAL SLAYER WEAPONS (อาวุธธาตุสังหาร) — 24 animated weapons,
   6 elements x staff / sword / bow / gun. Summon-only (box bxK, items wk01-wk24).
   Drawn in their own space, then placed on the hand (grip near 136,180).
   Everything stays inside this closure so helper names never clash.
   ===================================================================== */
var W3=(function(){
const EL=[
 {id:'sakura',en:'Cherry Blossom',th:'ธาตุซากุระบุปผา',c1:'#ffe3f1',c2:'#ff8cc6',c3:'#b3215f',glow:'#ff9fd0',metal:['#fff4e0','#e8b98a','#9b6a43'],orb:'#ff5fb0',mote:'petal'},
 {id:'cosmic',en:'Cosmic Star',th:'ธาตุจักรวาลดารา',c1:'#dbe9ff',c2:'#5b95ff',c3:'#1a237e',glow:'#7fb2ff',metal:['#fffbe6','#e3c46c','#8a6a1f'],orb:'#5ad1ff',mote:'star'},
 {id:'flame',en:'Phoenix Flame',th:'ธาตุเพลิงหงส์ไฟ',c1:'#fff1b8',c2:'#ff8a1f',c3:'#9e1b0b',glow:'#ffae3d',metal:['#6b4a3a','#3a2420','#1a0d0b'],orb:'#ff5a1a',mote:'ember'},
 {id:'moon',en:'Dark Moon',th:'ธาตุจันทราอัสดง',c1:'#efe3ff',c2:'#a374ff',c3:'#3b1a6e',glow:'#b48bff',metal:['#ffffff','#c9ccd6','#6f7487'],orb:'#a05bff',mote:'moon'},
 {id:'frost',en:'Eternal Frost',th:'ธาตุน้ำแข็งนิรันดร์',c1:'#f2fcff',c2:'#7fd6ff',c3:'#1d5d9b',glow:'#a8e8ff',metal:['#ffffff','#cfefff','#7fb6d8'],orb:'#3fb5ff',mote:'snow'},
 {id:'abyss',en:'Abyssal Void',th:'ธาตุห้วงอเวจี',c1:'#ffc2cc',c2:'#ff2a4d',c3:'#3a0712',glow:'#ff3b5c',metal:['#5a5060','#2a2430','#0e0b12'],orb:'#ff1744',mote:'void'}
];
let UID=0;
const f=n=>Math.round(n*100)/100;
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function defs(p,E){const m=E.metal;return `<defs>
 <linearGradient id="${p}m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${m[2]}"/><stop offset=".35" stop-color="${m[0]}"/><stop offset=".6" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[2]}"/></linearGradient>
 <linearGradient id="${p}mv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m[0]}"/><stop offset=".5" stop-color="${m[1]}"/><stop offset="1" stop-color="${m[2]}"/></linearGradient>
 <linearGradient id="${p}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${E.c1}"/><stop offset=".45" stop-color="${E.c2}"/><stop offset="1" stop-color="${E.c3}"/></linearGradient>
 <linearGradient id="${p}bh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${E.c3}"/><stop offset=".5" stop-color="${E.c2}"/><stop offset="1" stop-color="${E.c1}"/></linearGradient>
 <radialGradient id="${p}o" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="${E.c1}"/><stop offset=".6" stop-color="${E.orb}"/><stop offset="1" stop-color="${E.c3}"/></radialGradient>
 <radialGradient id="${p}h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${E.glow}" stop-opacity=".9"/><stop offset="1" stop-color="${E.glow}" stop-opacity="0"/></radialGradient>
 <filter id="${p}g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="${p}gg" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>`}
const sparkle=(x,y,r,fill,cls)=>`<path  d="M${f(x)} ${f(y-r)}Q${f(x)} ${f(y)} ${f(x+r)} ${f(y)}Q${f(x)} ${f(y)} ${f(x)} ${f(y+r)}Q${f(x)} ${f(y)} ${f(x-r)} ${f(y)}Q${f(x)} ${f(y)} ${f(x)} ${f(y-r)}Z" fill="${fill}"/>`;
function petal(r){return `M0 0C${f(-r*.55)} ${f(-r*.35)} ${f(-r*.62)} ${f(-r*.95)} ${f(-r*.2)} ${f(-r*1.1)}L0 ${f(-r*.9)}L${f(r*.2)} ${f(-r*1.1)}C${f(r*.62)} ${f(-r*.95)} ${f(r*.55)} ${f(-r*.35)} 0 0Z`}
function flower(x,y,r,E,rot){let s=`<g transform="translate(${f(x)} ${f(y)}) rotate(${rot||0})">`;for(let i=0;i<5;i++)s+=`<path d="${petal(r)}" transform="rotate(${i*72})" fill="${E.c2}" stroke="${E.c1}" stroke-width=".8"/>`;
  return s+`<circle r="${f(r*.28)}" fill="#fff3b0"/><circle r="${f(r*.14)}" fill="${E.c3}"/></g>`}
const flameT=(x,y,w,h,fill,delay)=>`<path class="w3fl" style="animation-delay:${delay||0}s" d="M${f(x)} ${f(y)}C${f(x-w)} ${f(y-h*.3)} ${f(x-w*.15)} ${f(y-h*.62)} ${f(x+w*.1)} ${f(y-h)}C${f(x+w*.25)} ${f(y-h*.58)} ${f(x+w)} ${f(y-h*.36)} ${f(x)} ${f(y)}Z" fill="${fill}"/>`;
const crescent=(x,y,r,rot,fill,stroke)=>`<path transform="rotate(${rot} ${f(x)} ${f(y)})" d="M${f(x)} ${f(y-r)}A${r} ${r} 0 1 0 ${f(x)} ${f(y+r)}A${f(r*.78)} ${f(r*.78)} 0 1 1 ${f(x)} ${f(y-r)}Z" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width="1"`:''}/>`;
function snowflake(x,y,r,stroke,w){let s=`<g transform="translate(${f(x)} ${f(y)})" stroke="${stroke}" stroke-width="${w||2}" stroke-linecap="round" fill="none">`;
  for(let i=0;i<6;i++){s+=`<g transform="rotate(${i*60})"><path d="M0 0V${f(-r)}M0 ${f(-r*.55)}L${f(-r*.22)} ${f(-r*.78)}M0 ${f(-r*.55)}L${f(r*.22)} ${f(-r*.78)}M0 ${f(-r*.3)}L${f(-r*.14)} ${f(-r*.44)}M0 ${f(-r*.3)}L${f(r*.14)} ${f(-r*.44)}"/></g>`}return s+'</g>'}
const spike=(x,y,len,ang,w,fill,stroke)=>`<path transform="translate(${f(x)} ${f(y)}) rotate(${ang})" d="M${f(-w/2)} 0Q${f(-w*.15)} ${f(-len*.55)} 0 ${f(-len)}Q${f(w*.05)} ${f(-len*.45)} ${f(w/2)} 0Z" fill="${fill}" ${stroke?`stroke="${stroke}" stroke-width="1"`:''}/>`;
function chain(x1,y1,x2,y2,n,col,sz){let s='';const a=Math.atan2(y2-y1,x2-x1)*180/Math.PI;for(let i=0;i<=n;i++){const t=i/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t;
  s+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${sz||4.2}" ry="${f((sz||4.2)*.6)}" transform="rotate(${f(a+(i%2?90:0))} ${f(x)} ${f(y)})" fill="none" stroke="${col}" stroke-width="1.6"/>`}return s}
const gem=(x,y,r,p,fill)=>`<g transform="translate(${f(x)} ${f(y)})"><path d="M0 ${-r}L${f(r*.8)} 0L0 ${r}L${f(-r*.8)} 0Z" fill="${fill||`url(#${p}o)`}" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/><path d="M0 ${-r}L${f(r*.25)} 0L0 ${r}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".7"/></g>`;
function orb(x,y,r,p){return `<circle cx="${x}" cy="${y}" r="${r*2}" fill="url(#${p}h)" class="glowp"/><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${p}o)" filter="url(#${p}g)"><animate attributeName="r" values="${r};${f(r*1.06)};${r}" dur="2.6s" repeatCount="indefinite"/></circle><ellipse cx="${f(x-r*.32)}" cy="${f(y-r*.38)}" rx="${f(r*.32)}" ry="${f(r*.2)}" fill="#fff" opacity=".75" transform="rotate(-30 ${f(x-r*.32)} ${f(y-r*.38)})"/>`}
function hangCharm(x,y,len,E,p,kind){let s=`<g class="w3sw" style="animation-delay:${(x%3)/3}s">`+chain(x,y,x,y+len,Math.max(2,Math.round(len/7)),E.metal[1],3.2);
  const cy=y+len+8;
  if(kind==='petal')s+=flower(x,cy,7,E,15);else if(kind==='star')s+=sparkle(x,cy,9,E.c1);else if(kind==='moon')s+=crescent(x,cy,7,20,E.c1)+sparkle(x+3,cy+9,4,'#fff');
  else if(kind==='snow')s+=`<path d="M${x} ${cy-9}L${x+5} ${cy}L${x} ${cy+14}L${x-5} ${cy}Z" fill="${E.c2}" stroke="#fff" stroke-width=".8"/>`;
  else if(kind==='void')s+=`<path d="M${x} ${cy-6}L${x+5} ${cy+2}L${x} ${cy+14}L${x-5} ${cy+2}Z" fill="${E.c2}" filter="url(#${p}g)"/>`;
  else s+=gem(x,cy,7,p);return s+'</g>'}
function ribbon(x,y,dir,E,len){const d=dir||1,L=len||140;return `<g class="w3sw"><path d="M${x} ${y}C${x+28*d} ${y+L*.2} ${x-26*d} ${y+L*.45} ${x+20*d} ${y+L*.7}S${x-6*d} ${y+L*.95} ${x+14*d} ${y+L}" fill="none" stroke="${E.c2}" stroke-width="7" stroke-linecap="round" opacity=".85"/>
 <path d="M${x} ${y}C${x+28*d} ${y+L*.2} ${x-26*d} ${y+L*.45} ${x+20*d} ${y+L*.7}S${x-6*d} ${y+L*.95} ${x+14*d} ${y+L}" fill="none" stroke="${E.c1}" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>`}
function bowKnot(x,y,E){return `<g transform="translate(${x} ${y})"><path d="M0 0C-14 -12 -26 -4 -22 6C-18 14 -8 8 0 0Z" fill="${E.c2}" stroke="${E.c1}" stroke-width="1"/><path d="M0 0C14 -12 26 -4 22 6C18 14 8 8 0 0Z" fill="${E.c2}" stroke="${E.c1}" stroke-width="1"/><path d="M0 0L-10 22L-4 20L0 26L4 20L10 22Z" fill="${E.c3}"/><circle r="4" fill="${E.c1}"/></g>`}

/* ------------------------------------------------------------------ *
 *  STAFF
 * ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ *
 *  Premium weapon art (v2) — layered glow, faceted metal, flowing light
 * ------------------------------------------------------------------ */
const MET={flame:['#fff1c1','#e9a93a','#7a3c0c'],abyss:['#9a8fa6','#3a3242','#0e0b12']};
const metalOf=E=>MET[E.id]||E.metal;
const BP={ /* blade palettes: [edge→mid→ridge] light half, [ridge→mid→edge] shadow half */
 sakura:[['#ffaed6','#ffe8f4','#ffffff'],['#fff2f8','#f7a3cc','#c2437c']],
 cosmic:[['#8fb8ff','#e4eeff','#ffffff'],['#e2ecff','#6f9cff','#26338f']],
 flame:[['#ffa43a','#ffe6a0','#fffbe8'],['#ffe08a','#ff7a1a','#9e1b0b']],
 moon:[['#c3a8ff','#f1eaff','#ffffff'],['#e9e0ff','#a37cf2','#43237f']],
 frost:[['#b6e6ff','#effaff','#ffffff'],['#e6f8ff','#8fd6f7','#2b74b5']],
 abyss:[['#ff3b5c','#4a3a50','#7a6c80'],['#3a3044','#1d1724','#08060b']]};
const SHAFT={sakura:['#a83a6c','#f3a6cb','#ffe6f2','#ffffff','#ffd3e8','#e486b4','#8a2a58'],cosmic:['#0b1030','#1f2c8a','#4a6ee0','#bcd4ff','#3a58c8','#18227a','#070b26'],
 flame:['#2a0a05','#6a200c','#b8471a','#ffc070','#a33a12','#5a1a0a','#200803'],moon:['#2a1450','#7a5ac8','#d8c8ff','#ffffff','#b9a0f0','#6040a8','#22103f'],
 frost:['#3c86c0','#9fdcff','#e8f8ff','#ffffff','#c8eeff','#78c4ef','#2c6ea8'],abyss:['#050307','#1d1622','#3e3346','#7a6c80','#2e2636','#140f18','#030204']};
const BODY={sakura:['#ffffff','#f9cfe3','#d06a9b'],cosmic:['#4a60d0','#1f2c8a','#0b1030'],flame:['#6a200c','#3a0f06','#160502'],moon:['#6d4cb0','#3b1a6e','#170930'],
 frost:['#ffffff','#cdeeff','#5aa8d8'],abyss:['#2e2636','#16111a','#050307']};
const GRIPC={sakura:['#ffffff','#ffd6ea','#d9779f'],cosmic:['#3346b8','#1a237e','#090d2a'],flame:['#7a2a10','#4a140a','#220804'],moon:['#f1e8ff','#b39af0','#5c3ca0'],
 frost:['#effaff','#a8e0ff','#3f8cc4'],abyss:['#4a0a18','#1e0309','#000000']};
const stops=(a,op)=>a.map((c,i)=>`<stop offset="${f(i/(a.length-1))}" stop-color="${c}"${op?` stop-opacity="${op[i]}"`:''}/>`).join('');
function D2(p,E){const m=metalOf(E),b=BP[E.id],hl=E.id==='abyss'?'#ff6a85':'#ffffff';return `<defs>
<linearGradient id="${p}bl" x1="0" x2="1">${stops(b[0])}</linearGradient>
<linearGradient id="${p}br" x1="0" x2="1">${stops(b[1])}</linearGradient>
<linearGradient id="${p}tf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".22" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${p}mh" x1="0" x2="1">${stops([m[2],m[1],m[0],hl,m[0],m[1],m[2]])}</linearGradient>
<linearGradient id="${p}mv" x1="0" y1="0" x2="0" y2="1">${stops([m[0],hl,m[0],m[1],m[2]])}</linearGradient>
<linearGradient id="${p}sh" x1="0" x2="1">${stops(SHAFT[E.id])}</linearGradient>
<linearGradient id="${p}bd" x1="0" y1="0" x2="0" y2="1">${stops(BODY[E.id])}</linearGradient>
<linearGradient id="${p}gp" x1="0" x2="1">${stops([GRIPC[E.id][2],GRIPC[E.id][1],GRIPC[E.id][0],GRIPC[E.id][1],GRIPC[E.id][2]])}</linearGradient>
<radialGradient id="${p}orb" cx=".5" cy=".5" r=".5" fx=".36" fy=".3">${stops(['#ffffff',E.c1,E.orb,E.c3,E.c3])}</radialGradient>
<radialGradient id="${p}rim" cx=".5" cy=".5" r=".5"><stop offset=".62" stop-color="${E.glow}" stop-opacity="0"/><stop offset=".93" stop-color="${E.c1}" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></radialGradient>
<radialGradient id="${p}gem" cx=".5" cy=".5" r=".55" fx=".34" fy=".3">${stops(['#ffffff',E.c1,E.orb,E.c3])}</radialGradient>
<radialGradient id="${p}halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${E.glow}" stop-opacity=".95"/><stop offset=".35" stop-color="${E.glow}" stop-opacity=".38"/><stop offset="1" stop-color="${E.glow}" stop-opacity="0"/></radialGradient>
<linearGradient id="${p}en" x1="0" y1="1" x2="0" y2="0">${stops([E.c3,E.c2,E.glow,E.c1,'#ffffff'])}</linearGradient>
<linearGradient id="${p}fl" x1="0" y1="1" x2="0" y2="0">${stops(E.id==='abyss'?['#000000','#3a0712','#ff2a4d','#ff8aa0']:E.id==='flame'?['#9e1b0b','#ff5a1a','#ffae3d','#fff1b8','#ffffff']:[E.c3,E.c2,E.c1,'#ffffff'])}</linearGradient>
<linearGradient id="${p}sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="${p}ray" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${E.glow}" stop-opacity=".75"/><stop offset="1" stop-color="${E.glow}" stop-opacity="0"/></linearGradient>
<radialGradient id="${p}sky" cx=".5" cy=".6" r=".6">${stops([E.c2,'#1a237e','#070b26'])}</radialGradient>
<filter id="${p}b2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.4"/></filter>
<filter id="${p}b6" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4.5"/></filter>
<filter id="${p}b12" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="11"/></filter>
</defs>`}

/* geometry helpers */
const pt=q=>`${f(q[0])} ${f(q[1])}`;
function cr(pts){let d='';for(let i=0;i<pts.length-1;i++){const a=pts[i-1]||pts[i],b=pts[i],c=pts[i+1],e=pts[i+2]||c;
  d+=`C${f(b[0]+(c[0]-a[0])/6)} ${f(b[1]+(c[1]-a[1])/6)} ${f(c[0]-(e[0]-b[0])/6)} ${f(c[1]-(e[1]-b[1])/6)} ${pt(c)}`}return d}
const seg=(pts,sm)=>sm?cr(pts):pts.slice(1).map(q=>'L'+pt(q)).join('');
const star4=(x,y,r,k)=>{k=k||.18;return `M${f(x)} ${f(y-r)}C${f(x+r*k)} ${f(y-r*k)} ${f(x+r*k)} ${f(y-r*k)} ${f(x+r)} ${f(y)}C${f(x+r*k)} ${f(y+r*k)} ${f(x+r*k)} ${f(y+r*k)} ${f(x)} ${f(y+r)}C${f(x-r*k)} ${f(y+r*k)} ${f(x-r*k)} ${f(y+r*k)} ${f(x-r)} ${f(y)}C${f(x-r*k)} ${f(y-r*k)} ${f(x-r*k)} ${f(y-r*k)} ${f(x)} ${f(y-r)}Z`};
const glowC=(inner,p,k,op)=>`<g filter="url(#${p}${k||'b6'})" opacity="${op||.8}">${inner}</g>`;
const twk=(x,y,r,col,dur,beg)=>`<g transform="translate(${f(x)} ${f(y)})"><g><path d="${star4(0,0,r)}" fill="${col||'#fff'}"/><circle r="${f(r*.35)}" fill="#fff"/><animateTransform attributeName="transform" type="scale" values="0;1;0" dur="${dur||2.4}s" begin="${beg||0}s" repeatCount="indefinite"/></g></g>`;
const flow=(d,col,w,dash,dur,op)=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${dash}" opacity="${op||1}"><animate attributeName="stroke-dashoffset" from="0" to="-${dash.split(' ').reduce((a,b)=>a+ +b,0)*4}" dur="${dur}s" repeatCount="indefinite"/></path>`;
const pulseOp=(a,b,dur)=>`<animate attributeName="opacity" values="${a};${b};${a}" dur="${dur}s" repeatCount="indefinite"/>`;
const spinT=(cx,cy,dur,rev)=>`<animateTransform attributeName="transform" type="rotate" from="${rev?360:0} ${cx} ${cy}" to="${rev?0:360} ${cx} ${cy}" dur="${dur}s" repeatCount="indefinite"/>`;
const swayT=(cx,cy,a,dur,beg)=>`<animateTransform attributeName="transform" type="rotate" values="${-a} ${cx} ${cy};${a} ${cx} ${cy};${-a} ${cx} ${cy}" dur="${dur}s" begin="${beg||0}s" repeatCount="indefinite"/>`;
function rays(cx,cy,R,n,p,dur){let s=`<g opacity=".55">`;for(let i=0;i<n;i++){const w=i%2?3:6,L=R*(i%2?.72:1);s+=`<path d="M${-w} 0L0 ${-L}L${w} 0Z" fill="url(#${p}ray)" transform="translate(${cx} ${cy}) rotate(${f(i*360/n)})"/>`}
  return s+spinT(cx,cy,dur||40)+'</g>'}
/* faceted gem with sparkle */
function gem2(x,y,r,p,shape){const d=shape==='dia'?`M${f(x)} ${f(y-r*1.25)}L${f(x+r)} ${f(y)}L${f(x)} ${f(y+r*1.25)}L${f(x-r)} ${f(y)}Z`:null;
  let s=`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r*2.2)}" fill="url(#${p}halo)">${pulseOp(.5,1,2.4)}</circle>`;
  s+=d?`<path d="${d}" fill="url(#${p}gem)" stroke="#fff" stroke-opacity=".8" stroke-width=".7"/><path d="M${f(x-r)} ${f(y)}L${f(x)} ${f(y-r*.35)}L${f(x+r)} ${f(y)}M${f(x)} ${f(y-r*1.25)}L${f(x)} ${f(y-r*.35)}" stroke="#fff" stroke-opacity=".55" stroke-width=".6" fill="none"/>`
   :`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${p}gem)" stroke="#fff" stroke-opacity=".75" stroke-width=".7"/><path d="M${f(x-r*.7)} ${f(y-r*.1)}L${f(x)} ${f(y-r*.62)}L${f(x+r*.7)} ${f(y-r*.1)}L${f(x)} ${f(y+r*.7)}Z" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width=".6"/>`;
  return s+`<ellipse cx="${f(x-r*.32)}" cy="${f(y-r*.4)}" rx="${f(r*.32)}" ry="${f(r*.18)}" fill="#fff" opacity=".9" transform="rotate(-35 ${f(x-r*.32)} ${f(y-r*.4)})"/>`}
/* soft sakura flower with gradient petals */
function bloom(x,y,r,E,rot,op){let s=`<g transform="translate(${f(x)} ${f(y)}) rotate(${rot||0})" opacity="${op||1}">`;
  for(let i=0;i<5;i++)s+=`<path d="${petal(r)}" transform="rotate(${i*72})" fill="${i%2?'#ffd6ea':'#ffc2df'}" stroke="#fff" stroke-width=".7"/><path d="M0 0L0 ${f(-r*.75)}" transform="rotate(${i*72})" stroke="${E.c2}" stroke-width=".6" opacity=".7"/>`;
  return s+`<circle r="${f(r*.3)}" fill="#fff6c8"/>${[0,72,144,216,288].map(a=>`<circle cx="0" cy="${f(-r*.38)}" r="${f(r*.07+.4)}" fill="#e88a3a" transform="rotate(${a+36})"/>`).join('')}</g>`}
const leaf=(x,y,l,rot,col)=>`<path d="M0 0C${f(l*.3)} ${f(-l*.3)} ${f(l*.75)} ${f(-l*.25)} ${f(l)} 0C${f(l*.7)} ${f(l*.2)} ${f(l*.3)} ${f(l*.22)} 0 0Z" fill="${col}" stroke="#fff" stroke-opacity=".5" stroke-width=".5" transform="translate(${f(x)} ${f(y)}) rotate(${rot})"/>`;
/* feather (flame / light wings) */
const feather=(x,y,l,w,rot,p,op)=>`<path d="M0 0C${f(w)} ${f(-l*.25)} ${f(w*.9)} ${f(-l*.7)} 0 ${f(-l)}C${f(-w*.55)} ${f(-l*.7)} ${f(-w*.6)} ${f(-l*.25)} 0 0Z" fill="url(#${p}fl)" stroke="#fff" stroke-opacity=".55" stroke-width=".6" opacity="${op||1}" transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"/><path d="M0 0L0 ${f(-l*.92)}" stroke="#fff" stroke-opacity=".6" stroke-width=".6" transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"/>`;
/* faceted crystal shard */
function shard(x,y,l,w,rot,p,E){const T=`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`;
  return `<g transform="${T}"><path d="M0 0L${f(-w)} ${f(-l*.25)}L0 ${f(-l)}Z" fill="${E.c1}" opacity=".95"/><path d="M0 0L${f(w)} ${f(-l*.25)}L0 ${f(-l)}Z" fill="${E.c2}" opacity=".9"/><path d="M0 0L0 ${f(-l)}" stroke="#fff" stroke-width=".9"/><path d="M${f(-w)} ${f(-l*.25)}L0 ${f(-l)}" stroke="#fff" stroke-opacity=".8" stroke-width=".6" fill="none"/></g>`}
function thorn(x,y,l,w,rot,p,E,curl){const c=curl||0;return `<path d="M${f(-w/2)} 0Q${f(-w*.2+c)} ${f(-l*.6)} ${f(c*1.6)} ${f(-l)}Q${f(w*.15+c*.6)} ${f(-l*.5)} ${f(w/2)} 0Z" fill="url(#${p}mh)" stroke="${E.c2}" stroke-width=".7" stroke-opacity=".8" transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"/>`}
function tassel(x,y,E,p,len){const L=len||46;let s=`<g>${swayT(x,y,6,3.4)}<path d="M${x} ${y}L${x} ${y+10}" stroke="${E.c2}" stroke-width="1.6"/>${gem2(x,y+13,3.6,p)}<path d="M${x-5} ${y+18}L${x+5} ${y+18}L${x+3.5} ${y+22}L${x-3.5} ${y+22}Z" fill="url(#${p}mh)"/>`;
  for(let i=-4;i<=4;i++)s+=`<path d="M${x+i*.8} ${y+22}Q${f(x+i*1.6)} ${f(y+22+L*.5)} ${f(x+i*2.3)} ${y+22+L-Math.abs(i)*2}" stroke="${i%2?E.c1:E.c2}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
  return s+`<circle cx="${x}" cy="${y+22+L*.25}" r="2.2" fill="${E.c1}"/></g>`}
function bez(a,b,c,d,t){const u=1-t;const P=[0,1].map(k=>u*u*u*a[k]+3*u*u*t*b[k]+3*u*t*t*c[k]+t*t*t*d[k]);
  const T=[0,1].map(k=>3*u*u*(b[k]-a[k])+6*u*t*(c[k]-b[k])+3*t*t*(d[k]-c[k]));const n=Math.hypot(T[0],T[1])||1;return {x:P[0],y:P[1],tx:T[0]/n,ty:T[1]/n,ang:Math.atan2(T[1],T[0])*180/Math.PI}}

/* ============================ SWORD ============================ */
function bladeShape(id){let T=[0,-198],R,L,sm=true;
  if(id==='sakura')R=[[5,-186],[11,-162],[15,-122],[15.5,-74],[14,-24],[18,6],[22,20]];
  else if(id==='cosmic'){sm=false;R=[[10,-180],[22,-152],[22,-64],[19,-16],[26,8],[30,20]]}
  else if(id==='flame'){R=[];for(let i=0;i<=12;i++){const k=Math.min(1,.35+i*.22);R.push([f((12+5.5*Math.sin(i*1.3+.6)+i*.5)*k),-184+i*17])}R[12]=[24,20]}
  else if(id==='moon'){T=[-26,-198];R=[[-14,-184],[-1,-160],[9,-124],[14,-80],[15,-32],[16,20]];L=[[-34,-178],[-37,-150],[-33,-110],[-25,-66],[-18,-24],[-16,20]]}
  else if(id==='frost'){sm=false;R=[[7,-178],[9,-170],[17,-136],[12,-128],[19,-90],[14,-82],[19,-42],[15,-34],[21,4],[24,20]]}
  else{sm=false;R=[[8,-178]];for(let y=-158;y<-10;y+=26)R.push([15,y],[26,y+8],[15,y+13]);R.push([19,6],[26,20])}
  L=L||R.map(q=>[-q[0],q[1]]);const Rg=[T].concat(R.map((q,i)=>[(q[0]+L[i][0])/2,(q[1]+L[i][1])/2]));return {T,R,L,sm,Rg}}
function bladeEtch(E,p,B){const id=E.id;let s='';
  if(id==='sakura'){s+=`<path d="M0 14C-4 -30 5 -70 -2 -110S3 -150 -1 -176" fill="none" stroke="#b8457a" stroke-width="1.3" opacity=".5"/><path d="M-1 -40Q-9 -52 -11 -64M1 -92Q9 -100 10 -112M-1 -140Q-7 -150 -6 -160" stroke="#b8457a" stroke-width="1" fill="none" opacity=".45"/>`;
    [[-10,-66,5],[9,-114,4.5],[-5,-162,3.6],[3,-20,5.5],[-2,-128,3]].forEach((q,i)=>s+=bloom(q[0],q[1],q[2],E,i*23,.9))}
  else if(id==='cosmic'){const o=B.out;s+=`<path d="${o}" transform="translate(0 -12) scale(.58 .86)" fill="url(#${p}sky)" stroke="#ffe9a8" stroke-width="1.2"/>`;
    s+=`<ellipse cx="2" cy="-90" rx="7" ry="26" fill="${E.c2}" opacity=".55" filter="url(#${p}b2)">${pulseOp(.35,.7,4)}</ellipse>`;
    const R=rng(77);for(let i=0;i<22;i++){const y=-150+R()*150,x=(R()-.5)*14*(1-(-y)/220);s+=`<circle cx="${f(x)}" cy="${f(y)}" r="${f(.4+R()*1.1)}" fill="#fff">${pulseOp(.2,1,f(1.2+R()*2.5))}</circle>`}
    s+=twk(-3,-120,5,'#fff',2.6,.3)+twk(4,-50,4,E.c1,3.1,1.4)+twk(0,-160,3.5,'#fff',2.2,.8)}
  else if(id==='flame'){s+=`<path d="${B.out}" transform="translate(0 -6) scale(.42 .9)" fill="#fff3b0" opacity=".75" filter="url(#${p}b2)">${pulseOp(.45,.9,1.6)}</path>`;
    for(let k=-1;k<=1;k+=2)s+=`<path d="M${k*3} 16C${k*9} -30 ${-k*6} -70 ${k*5} -110S${-k*4} -150 0 -180" fill="none" stroke="#ff5a1a" stroke-width="1.1" opacity=".55"/>`}
  else if(id==='moon'){[-40,-84,-128].forEach((y,i)=>{const x=B.Rg[0][0]*(-y/220)*.8;s+=crescent(f(x+1),y,5.5,-30+i*20,'#ffffff')+`<circle cx="${f(x+1)}" cy="${y+13}" r="1.3" fill="#fff"/>`});
    s+=`<path d="${'M'+pt([B.Rg[1][0]*.95+3,B.Rg[1][1]+6])+seg(B.Rg.slice(1).map(q=>[q[0]+3,q[1]]),true)}" fill="none" stroke="#6b45c2" stroke-width=".8" stroke-dasharray="1 4" opacity=".7"/>`}
  else if(id==='frost'){B.R.forEach((q,i)=>{const m=B.Rg[i+1];s+=`<path d="M${pt(m)}L${pt(q)}M${pt(m)}L${pt(B.L[i])}" stroke="#fff" stroke-width=".7" opacity=".75"/>`});
    s+=snowflake(0,-40,9,'#ffffff',1.1).replace('<g ','<g opacity=".8" ')+snowflake(0,-120,6,'#ffffff',.9).replace('<g ','<g opacity=".7" ')}
  else{let v='';B.R.forEach((q,i)=>{if(i%3===2){v+=`M0 ${f(q[1]-6)}Q${f(q[0]*.5)} ${f(q[1]-2)} ${f(q[0]-2)} ${f(q[1]+4)}M0 ${f(q[1]-6)}Q${f(-q[0]*.5)} ${f(q[1]-2)} ${f(-q[0]+2)} ${f(q[1]+4)}`}});
    s+=`<path d="${v}" stroke="${E.c2}" stroke-width="2.4" fill="none" filter="url(#${p}b2)">${pulseOp(.3,1,1.8)}</path><path d="${v}" stroke="#ffb3c1" stroke-width=".8" fill="none">${pulseOp(.3,1,1.8)}</path>`}
  return s}
function guard(E,p){const id=E.id,W={sakura:46,cosmic:50,flame:50,moon:42,frost:46,abyss:54}[id],H={sakura:14,cosmic:22,flame:24,moon:16,frost:8,abyss:20}[id];
  const d=`M0 18C-12 16 -${f(W*.6)} 14 -${W} ${30-H}C-${f(W*.86)} ${f(36-H*.3)} -${f(W*.45)} 40 -10 44L10 44C${f(W*.45)} 40 ${f(W*.86)} ${f(36-H*.3)} ${W} ${30-H}C${f(W*.6)} 14 12 16 0 18Z`;
  let back='',s='',front='';
  if(id==='sakura'){[[-W-2,30-H-4,8,-20],[W+2,30-H-4,8,20],[-W*.55,18,5.5,10],[W*.55,18,5.5,-10]].forEach(q=>front+=bloom(q[0],q[1],q[2],E,q[3]));back+=leaf(-W+4,30-H,14,-150,'#9fd38a')+leaf(W-4,30-H,14,-30,'#9fd38a')}
  else if(id==='cosmic'){back+=`<path d="${star4(0,30,30,.12)}" fill="url(#${p}mh)" stroke="#fff" stroke-width=".6"/>`;front+=`<g><ellipse cx="0" cy="30" rx="20" ry="6" fill="none" stroke="${E.c1}" stroke-width="1.2" stroke-dasharray="20 6"/>${spinT(0,30,6)}</g>`+twk(-W,30-H,6,'#fff',2.4,.2)+twk(W,30-H,6,'#fff',2.4,1.2)}
  else if(id==='flame'){for(let k=-1;k<=1;k+=2)for(let i=0;i<5;i++)back+=`<g>${swayT(k*8,26,3,1.4+i*.2,i*.1)}${feather(k*8,26,30+i*6,7,k*(38+i*12),p)}</g>`}
  else if(id==='moon'){back+=crescent(0,30,20,-90+180,`url(#${p}mh)`,'#fff');front+=ribbon(-W+2,30-H+2,-1,E,70)+ribbon(W-2,30-H+2,1,E,70)}
  else if(id==='frost'){back+=snowflake(0,30,26,E.c1,2).replace('<g ','<g opacity=".85" ');[[-W,30-H,-62],[W,30-H,62],[-W*.6,22,-30],[W*.6,22,30],[0,18,0]].forEach((q,i)=>back+=shard(q[0],q[1],i<2?22:16,4.5,q[2],p,E))}
  else{for(let i=0;i<7;i++){const t=i/6,x=-W+t*2*W;back+=thorn(x,30-H*(1-Math.abs(t-.5)*.4)+Math.abs(t-.5)*6,10+Math.abs(t-.5)*14,6,(t-.5)*120,p,E)}
    front+=`<path d="M-${W} ${30-H}L-${W+6} ${42-H}M${W} ${30-H}L${W+6} ${42-H}" stroke="${E.c2}" stroke-width="1.2"/>`}
  s+=back+glowC(`<path d="${d}" fill="${E.glow}"/>`,p,'b6',.5)+`<path d="${d}" fill="url(#${p}mv)" stroke="${metalOf(E)[2]}" stroke-width=".9"/>`;
  s+=`<path d="M-8 22C-${f(W*.4)} 20 -${f(W*.7)} 22 -${f(W*.86)} ${f(34-H*.6)}M8 22C${f(W*.4)} 20 ${f(W*.7)} 22 ${f(W*.86)} ${f(34-H*.6)}" stroke="#fff" stroke-width="1" fill="none" opacity=".85"/>`;
  s+=`<path d="M-14 36C-22 30 -30 32 -28 38S-18 40 -20 34M14 36C22 30 30 32 28 38S18 40 20 34" stroke="${metalOf(E)[2]}" stroke-width=".9" fill="none" opacity=".8"/>`;
  s+=`<circle cy="31" r="11.5" fill="url(#${p}mh)" stroke="${metalOf(E)[2]}" stroke-width=".8"/>`+(id==='abyss'?`<circle cy="31" r="8.5" fill="#1a0308"/><ellipse cy="31" rx="7.5" ry="4.5" fill="url(#${p}gem)"/><ellipse cy="31" rx="1.3" ry="4.2" fill="#000">${'<animate attributeName="rx" values="1.3;2.4;1.3" dur="3s" repeatCount="indefinite"/>'}</ellipse>`:gem2(0,31,7.5,p));
  return s+front}
function grip(E,p,x0,y0,w,h,uid){const m=metalOf(E);let s=`<clipPath id="${uid}"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${w/2.2}"/></clipPath><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="${w/2.2}" fill="url(#${p}gp)"/><g clip-path="url(#${uid})">`;
  for(let y=y0-6;y<y0+h+6;y+=8)s+=`<path d="M${x0} ${y}L${x0+w} ${y+6}" stroke="${m[1]}" stroke-width="2.2"/><path d="M${x0} ${y-1}L${x0+w} ${y+5}" stroke="#fff" stroke-width=".6" opacity=".7"/>`;
  return s+`</g><rect x="${x0+w*.22}" y="${y0}" width="${w*.15}" height="${h}" fill="#fff" opacity=".18"/>`}
function sword(E,p){const id=E.id,B=bladeShape(id),m=metalOf(E);
  B.out=`M${pt(B.T)}${seg([B.T,...B.R],B.sm)}L${pt(B.L[B.L.length-1])}${seg([B.T,...B.L].reverse(),B.sm)}Z`;
  const half=side=>`M${pt(B.T)}${seg([B.T,...side],B.sm)}L${pt(B.Rg[B.Rg.length-1])}${seg(B.Rg.slice().reverse(),B.sm)}Z`;
  const ridge=`M${pt(B.Rg[0])}${seg(B.Rg,B.sm)}`;
  let s=defs(p,E)+D2(p,E);
  s+=`<ellipse cx="0" cy="-80" rx="60" ry="150" fill="url(#${p}halo)" opacity=".55">${pulseOp(.35,.7,3.2)}</ellipse>`;
  if(id==='flame')for(let i=0;i<7;i++){const q=B.R[1+i]||B.R[6],k=i%2?-1:1;s+=`<path class="w3fl" style="animation-delay:${-i*.13}s" d="M${f(k*q[0])} ${q[1]+10}C${f(k*(q[0]+18))} ${q[1]-4} ${f(k*(q[0]+4))} ${q[1]-18} ${f(k*(q[0]+12))} ${q[1]-34}C${f(k*(q[0]-2))} ${q[1]-16} ${f(k*(q[0]-6))} ${q[1]-4} ${f(k*q[0])} ${q[1]+10}Z" fill="url(#${p}fl)" opacity=".75"/>`}
  if(id==='abyss')s+=`<g opacity=".55">${chain(-24,40,-40,120,7,m[1],3)}${chain(24,40,36,110,6,m[1],3)}</g>`;
  s+=glowC(`<path d="${B.out}" fill="${E.c2}"/>`,p,'b12',.85).replace('<g ','<g style="mix-blend-mode:screen" ');
  s+=`<path d="${half(B.L)}" fill="url(#${p}bl)"/><path d="${half(B.R)}" fill="url(#${p}br)"/><path d="${B.out}" fill="url(#${p}tf)"/>`;
  s+=`<clipPath id="${p}cl"><path d="${B.out}"/></clipPath><g clip-path="url(#${p}cl)">${bladeEtch(E,p,B)}<g><rect x="-80" y="-10" width="160" height="20" fill="url(#${p}sw)" opacity=".85" transform="rotate(-30)"/><animateTransform attributeName="transform" type="translate" values="0 -250;0 60;0 60" keyTimes="0;.42;1" dur="4.6s" repeatCount="indefinite"/></g></g>`;
  s+=`<path d="M${pt(B.T)}${seg([B.T,...B.L],B.sm)}" fill="none" stroke="#fff" stroke-width="1.3" opacity=".95"/><path d="M${pt(B.T)}${seg([B.T,...B.R],B.sm)}" fill="none" stroke="${BP[id][1][2]}" stroke-width="1" opacity=".7"/>`;
  s+=`<path d="${ridge}" fill="none" stroke="#fff" stroke-width="1.5" opacity=".9"/>`+glowC(flow(ridge,E.c1,3,'10 26',2.2),p,'b2',1)+flow(ridge,'#fff',1.2,'10 26',2.2);
  s+=`<path d="M-15 18L15 18L11 24L-11 24Z" fill="url(#${p}mh)"/>`;
  s+=grip(E,p,-6.5,44,13,70,p+'gc')+`<rect x="-8.5" y="42" width="17" height="6" rx="2" fill="url(#${p}mv)"/><rect x="-8.5" y="110" width="17" height="6" rx="2" fill="url(#${p}mv)"/>`;
  s+=guard(E,p);
  s+=`<path d="M-9 116L9 116L7.5 126Q0 140 -7.5 126Z" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".7"/>`+gem2(0,125,4.6,p,'dia')+tassel(0,138,E,p,44);
  s+=twk(B.T[0],B.T[1]+2,9,'#fff',2.2,0)+twk(B.T[0]+14,-120,4,E.c1,3,1)+twk(-20,-40,5,'#fff',2.8,.6)+twk(24,-150,3.5,'#fff',2.4,1.6);
  return s}

/* ============================ STAFF ============================ */
function orbBig(E,p,cx,cy,r){const id=E.id;let inner='';
  if(id==='sakura')inner=`<g opacity=".55">${bloom(0,0,r*.62,E,0)}${spinT(0,0,24)}</g>`;
  else if(id==='cosmic'){inner=`<g>${[0,180].map(a=>`<path d="M0 0C${r*.3} ${-r*.3} ${r*.7} ${-r*.1} ${r*.8} ${r*.3}" stroke="#fff" stroke-width="2.2" fill="none" opacity=".55" transform="rotate(${a})"/>`).join('')}<circle r="${r*.18}" fill="#fff"/>${spinT(0,0,10)}</g>`;const R=rng(5);for(let i=0;i<14;i++)inner+=`<circle cx="${f((R()-.5)*r*1.6)}" cy="${f((R()-.5)*r*1.6)}" r="${f(.5+R())}" fill="#fff">${pulseOp(.2,1,f(1+R()*2))}</circle>`}
  else if(id==='flame')inner=`<path class="w3fl" d="M0 ${r*.7}C${-r*.7} ${r*.2} ${-r*.2} ${-r*.3} ${r*.05} ${-r*.8}C${r*.2} ${-r*.3} ${r*.75} ${r*.1} 0 ${r*.7}Z" fill="#fff3b0" opacity=".8"/><path class="w3fl" style="animation-delay:-.25s" d="M0 ${r*.6}C${-r*.35} ${r*.3} ${-r*.1} 0 0 ${-r*.35}C${r*.12} 0 ${r*.4} ${r*.3} 0 ${r*.6}Z" fill="#fff"/>`;
  else if(id==='moon')inner=crescent(-r*.12,0,r*.55,-25,'#ffffff')+`<circle cx="${r*.35}" cy="${-r*.35}" r="1.6" fill="#fff"/><circle cx="${r*.45}" cy="${r*.15}" r="1" fill="#fff"/>`;
  else if(id==='frost')inner=`<g opacity=".85">${snowflake(0,0,r*.68,'#ffffff',1.8)}${spinT(0,0,20)}</g>`;
  else inner=`<ellipse rx="${r*.78}" ry="${r*.46}" fill="#2a0008" stroke="${E.c1}" stroke-width="1"/><circle r="${r*.4}" fill="url(#${p}gem)"/><ellipse rx="${r*.09}" ry="${r*.38}" fill="#000"><animate attributeName="rx" values="${f(r*.09)};${f(r*.2)};${f(r*.09)}" dur="3.4s" repeatCount="indefinite"/></ellipse><g opacity="0"><ellipse rx="${r*.8}" ry="${r*.5}" fill="#1a0308"/><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.86;.9;.94;1" dur="5s" repeatCount="indefinite"/></g>`;
  return `<g transform="translate(${cx} ${cy})"><circle r="${r*1.9}" fill="url(#${p}halo)">${pulseOp(.6,1,2.6)}</circle><circle r="${r}" fill="url(#${p}orb)"/><clipPath id="${p}oc"><circle r="${r*.92}"/></clipPath><g clip-path="url(#${p}oc)">${inner}</g>
   <circle r="${r}" fill="url(#${p}rim)"/><ellipse cx="${f(-r*.36)}" cy="${f(-r*.42)}" rx="${f(r*.36)}" ry="${f(r*.2)}" fill="#fff" opacity=".85" transform="rotate(-38 ${f(-r*.36)} ${f(-r*.42)})"/><circle cx="${f(r*.42)}" cy="${f(r*.44)}" r="${f(r*.08)}" fill="#fff" opacity=".7"/>
   <path d="M${f(-r*.55)} ${f(r*.55)}A${r*.78} ${r*.78} 0 0 0 ${f(r*.6)} ${f(r*.48)}" stroke="#fff" stroke-width="1.2" fill="none" opacity=".45"/></g>`}
function staff(E,p){const id=E.id,m=metalOf(E),cy=-138,r=24;let s=defs(p,E)+D2(p,E),back='',front='';
  let hb=`<circle cx="0" cy="${cy}" r="100" fill="url(#${p}halo)" opacity=".7">${pulseOp(.45,.85,3)}</circle>`+rays(0,cy,108,16,p,36);
  if(id==='sakura'){const br=k=>`M${k*5} -104C${k*48} -108 ${k*58} -158 ${k*30} -182C${k*18} -192 ${k*6} -190 ${k*2} -184`;
    for(let k=-1;k<=1;k+=2)back+=`<path d="${br(k)}" stroke="#7a2e52" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${br(k)}" stroke="#d27aa4" stroke-width="2" fill="none" stroke-linecap="round" transform="translate(${-k} -1)"/>`+leaf(k*44,-128,16,k>0?-60:-120,'#a7dc8f')+leaf(k*40,-168,12,k>0?-110:-70,'#a7dc8f');
    [[-46,-148,10,0],[46,-150,10,30],[-30,-180,8,10],[30,-182,8,40],[-40,-112,7,15],[40,-114,7,55],[0,-190,11,18]].forEach(q=>front+=bloom(q[0],q[1],q[2],E,q[3]));
    front+=ribbon(-8,-102,-1,E,96)+ribbon(8,-102,1,E,96)+bowKnot(0,-100,E);
    for(let i=0;i<5;i++)front+=`<g opacity="0"><path d="${petal(5)}" fill="#ffc2df" transform="rotate(${i*60})"/><animateMotion dur="${4+i*.6}s" begin="${i*.9}s" repeatCount="indefinite" path="M${-40+i*20} -170C${-20+i*20} -110 ${-60+i*20} -60 ${-30+i*18} 0"/><animate attributeName="opacity" values="0;1;1;0" dur="${4+i*.6}s" begin="${i*.9}s" repeatCount="indefinite"/></g>`}
  else if(id==='cosmic'){back+=`<circle cx="0" cy="${cy}" r="40" fill="none" stroke="url(#${p}mh)" stroke-width="4.5"/><circle cx="0" cy="${cy}" r="35" fill="none" stroke="${E.c1}" stroke-width=".8" stroke-dasharray="2 5"/>`;
    for(let i=0;i<8;i++){const a=i*45*Math.PI/180;back+=`<path d="${star4(Math.sin(a)*40,cy-Math.cos(a)*40,i%2?6:10,.15)}" fill="url(#${p}mh)" stroke="#fff" stroke-width=".5"/>`}
    back+=`<path d="${star4(0,cy-62,16,.12)}" fill="url(#${p}mh)" stroke="#fff" stroke-width=".7"/>`+gem2(0,cy-62,4,p);
    back+=`<path d="M-10 -100C-30 -104 -46 -112 -38 -124M10 -100C30 -104 46 -112 38 -124" stroke="url(#${p}mh)" stroke-width="3.5" fill="none"/>`;
    [[54,16,-22,7],[64,12,28,11]].forEach((q,i)=>{const ep=`M${-q[0]} 0A${q[0]} ${q[1]} 0 1 0 ${q[0]} 0A${q[0]} ${q[1]} 0 1 0 ${-q[0]} 0`;
      front+=`<g transform="translate(0 ${cy}) rotate(${q[2]})"><path d="${ep}" fill="none" stroke="${E.c1}" stroke-width="1.1" opacity=".75"/>${flow(ep,'#fff',1.4,'18 60',q[3]*.6)}<circle r="${i?3.6:4.6}" fill="url(#${p}gem)" stroke="#fff" stroke-width=".6"><animateMotion dur="${q[3]}s" repeatCount="indefinite" path="${ep}"/></circle></g>`})}
  else if(id==='flame'){for(let k=-1;k<=1;k+=2){let w='';for(let i=0;i<8;i++)w+=feather(k*10,-118,48+i*8-(i>5?(i-5)*14:0),9,k*(14+i*13),p,.95);back+=`<g>${swayT(k*10,-118,4,2.2)}${w}</g>`}
    for(let i=0;i<5;i++)front+=`<g class="w3fl" style="animation-delay:${-i*.11}s">${flameT((i-2)*9,cy-r+6,8+(2-Math.abs(i-2))*3,24+(2-Math.abs(i-2))*14,`url(#${p}fl)`)}</g>`;
    for(let i=0;i<6;i++)front+=`<circle r="${1.4+i%3*.6}" fill="#fff1b8"><animateMotion dur="${2.4+i*.4}s" begin="${i*.5}s" repeatCount="indefinite" path="M${-30+i*12} -120Q${-20+i*10} -180 ${-34+i*14} -230"/><animate attributeName="opacity" values="1;0" dur="${2.4+i*.4}s" begin="${i*.5}s" repeatCount="indefinite"/></circle>`}
  else if(id==='moon'){back+=`<g transform="rotate(-30 0 ${cy})">${crescent(0,cy,48,0,`url(#${p}mh)`,'#ffffff')}</g>`+`<path d="M-30 ${cy+32}Q-50 ${cy} -40 ${cy-34}" stroke="${E.c2}" stroke-width=".8" fill="none" stroke-dasharray="2 3"/>`;
    front+=hangCharm(-30,-118,34,E,p,'moon')+hangCharm(32,-112,26,E,p,'star')+ribbon(-6,-102,-1,E,100)+ribbon(6,-102,1,E,90);
    for(let i=0;i<3;i++)front+=`<g>${spinT(0,cy,9+i*4,i%2)}<path d="${star4(0,cy-38-i*8,3.5)}" fill="#fff"/></g>`}
  else if(id==='frost'){back+=`<g opacity=".7">${snowflake(0,cy,62,E.c1,2.4)}${spinT(0,cy,40,1)}</g>`;
    for(let i=0;i<8;i++){const a=i*45;back+=`<g transform="rotate(${a} 0 ${cy})">${shard(0,cy-r-2,i%2?24:40,i%2?5:7.5,0,p,E)}</g>`}
    front+=shard(-10,-104,18,4,-150,p,E)+shard(10,-104,18,4,150,p,E)+shard(0,-104,24,4.5,180,p,E);
    for(let i=0;i<6;i++)front+=`<g opacity="0"><path d="${star4(0,0,3,.3)}" fill="#fff"/><animateMotion dur="${3.5+i*.5}s" begin="${i*.6}s" repeatCount="indefinite" path="M${-48+i*18} -200Q${-40+i*16} -150 ${-52+i*18} -90"/><animate attributeName="opacity" values="0;1;0" dur="${3.5+i*.5}s" begin="${i*.6}s" repeatCount="indefinite"/></g>`}
  else{for(let i=0;i<9;i++){const a=-120+i*30;back+=`<g transform="rotate(${a} 0 ${cy})">${thorn(0,cy-r+4,i%2?30:46,9,0,p,E,i<4?-6:i>4?6:0)}</g>`}
    back+=`<g>${pulseOp(.35,1,1.8)}${[...Array(9)].map((_,i)=>`<path d="M0 ${cy-r}L0 ${cy-r-(i%2?20:34)}" stroke="${E.c2}" stroke-width="1" transform="rotate(${-120+i*30} 0 ${cy})"/>`).join('')}</g>`;
    front+=`<path d="M-10 -100C-46 -96 -56 -150 -36 -170M10 -100C46 -96 56 -150 36 -170" fill="none" stroke="${m[1]}" stroke-width="2.6" stroke-dasharray="5 3"/>`+chain(-10,-98,-34,-40,6,m[0],3)+chain(10,-98,30,-50,5,m[0],3)}
  s+=`<g transform="translate(0 -100) scale(1.35) translate(0 100)">${hb}${back}</g>`;
  // shaft
  s+=glowC(`<rect x="-5" y="-110" width="10" height="262" rx="5" fill="${E.c2}"/>`,p,'b6',.45)+`<rect x="-4.6" y="-110" width="9.2" height="262" rx="4.6" fill="url(#${p}sh)"/>`;
  let sp='M0 -96';for(let y=-96;y<142;y+=6)sp+=`L${f(Math.sin((y+96)/14)*7)} ${y+6}`;
  s+=glowC(flow(sp,E.c1,3.5,'16 20',3),p,'b2',1)+flow(sp,'#fff',1.2,'16 20',3,.9);
  [-44,30,104].forEach((y,i)=>s+=`<rect x="-7" y="${y-5}" width="14" height="10" rx="3" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".6"/><path d="M-7 ${y-5}L-11 ${y}L-7 ${y+5}M7 ${y-5}L11 ${y}L7 ${y+5}" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".6"/>`+gem2(0,y,3.2,p,'dia'));
  s+=`<path d="M-7 150L7 150L5 162L0 178L-5 162Z" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".7"/>`;
  // collar
  s+=`<g transform="translate(0 -100) scale(1.35) translate(0 100)">`+`<path d="M-14 -96C-14 -106 -20 -110 -24 -114C-14 -114 -8 -110 0 -116C8 -110 14 -114 24 -114C20 -110 14 -106 14 -96Z" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".8"/><path d="M-9 -96L9 -96L7 -88L-7 -88Z" fill="url(#${p}mv)"/>`+gem2(0,-104,4,p,'dia');
  s+=orbBig(E,p,0,cy,r);
  s+=`<g transform="translate(0 ${cy})"><g><ellipse rx="${r+12}" ry="${f(r*.32)}" fill="none" stroke="${E.c1}" stroke-width="1.3" stroke-dasharray="26 8 4 8" opacity=".9"/><animateTransform attributeName="transform" type="rotate" values="-18;18;-18" dur="6s" repeatCount="indefinite"/></g></g>`;
  s+=front+'</g>'+twk(-44,-210,7,'#fff',2.4,0)+twk(50,-170,5,E.c1,2.8,.9)+twk(-20,-40,4,'#fff',2.2,1.6)+twk(22,60,3.5,'#fff',3,.4);
  return s}

/* ============================ BOW ============================ */
function bow(E,p){const id=E.id,m=metalOf(E);let s=defs(p,E)+D2(p,E),back='',front='';
  const U=[[40,-30],[48,-102],[16,-160],[-44,-184]],tipU=[-63,-174];
  const up=`M40 -30C48 -102 16 -160 -44 -184C-54 -188 -62 -184 -63 -174`,lo=`M40 30C48 102 16 160 -44 184C-54 188 -62 184 -63 174`;
  s+=`<ellipse cx="0" cy="0" rx="90" ry="190" fill="url(#${p}halo)" opacity=".45">${pulseOp(.3,.6,3)}</ellipse>`;
  s+=`<linearGradient id="${p}lg" gradientUnits="userSpaceOnUse" x1="0" y1="-190" x2="0" y2="190">${stops([E.c1,E.c2,'#ffffff',E.c2,E.c1])}</linearGradient>`;
  for(const sg of [1,-1]){for(let i=0;i<8;i++){const b=bez(...U.map(q=>[q[0],q[1]]),.12+i*.12);const y=b.y*sg,nx=-b.ty*sg*sg,ny=b.tx*sg;// outward normal
      const ang=Math.atan2(sg*b.tx,-b.ty*1)*180/Math.PI;const nang=Math.atan2(sg>0?b.tx:-b.tx, -b.ty)*180/Math.PI;
      const ox=b.x+(-b.ty)*6,oy=y+(sg>0?b.tx:-b.tx)*6,ra=90-Math.atan2(-(sg>0?b.tx:-b.tx),-b.ty)*180/Math.PI;// rotate so local -y points along normal
      const rot=Math.atan2((sg>0?b.tx:-b.tx),(-b.ty))*180/Math.PI;// angle of normal from +x
      const r2=rot+90;
      if(id==='sakura'){if(i%2===0)back+=bloom(ox+(-b.ty)*4,oy+(sg>0?b.tx:-b.tx)*4,7-i*.3,E,i*30);else back+=leaf(ox,oy,13,rot-25*sg,'#a7dc8f')}
      else if(id==='cosmic'){if(i%2)back+=twk(ox+(-b.ty)*8,oy+(sg>0?b.tx:-b.tx)*8,5,'#fff',2.4,i*.3);else back+=`<path d="${star4(ox+(-b.ty)*5,oy+(sg>0?b.tx:-b.tx)*5,4.5,.16)}" fill="url(#${p}mh)"/>`}
      else if(id==='flame')back+=`<g>${swayT(ox,oy,4,1.6,i*.15)}${feather(ox,oy,22+Math.sin(i/7*3.14)*22,6.5,r2-sg*28,p)}</g>`;
      else if(id==='moon'){if(i%3===1)back+=crescent(ox+(-b.ty)*6,oy+(sg>0?b.tx:-b.tx)*6,6,rot,`url(#${p}mh)`,'#fff')}
      else if(id==='frost')back+=shard(ox,oy,10+Math.sin(i/7*3.14)*16,3.6,r2-sg*20,p,E);
      else back+=thorn(ox,oy,10+Math.sin(i/7*3.14)*14,6,r2-sg*30,p,E,sg*3)}}
  // limbs
  const limb=(d,k)=>`<path d="${d}" fill="none" stroke="${BP[id][1][2]}" stroke-width="12" stroke-linecap="round"/><path d="${d}" fill="none" stroke="url(#${p}lg)" stroke-width="8.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".85" transform="translate(2.6 0)"/>`;
  s+=back+glowC(`<path d="${up}" stroke="${E.c2}" stroke-width="14" fill="none"/><path d="${lo}" stroke="${E.c2}" stroke-width="14" fill="none"/>`,p,'b6',.7)+limb(up)+limb(lo);
  s+=flow(up,'#fff',1.6,'12 34',2.4,.9)+flow(lo,'#fff',1.6,'12 34',2.4,.9);
  if(id==='abyss')s+=`<path d="${up}" stroke="${E.c2}" stroke-width="1.2" fill="none" stroke-dasharray="3 5">${pulseOp(.3,1,1.6)}</path><path d="${lo}" stroke="${E.c2}" stroke-width="1.2" fill="none" stroke-dasharray="3 5">${pulseOp(.3,1,1.6)}</path>`;
  // string
  s+=glowC(`<path d="M-63 -174L-63 174" stroke="${E.glow}" stroke-width="4"/>`,p,'b2',.9)+`<path d="M-63 -174L-63 174" stroke="${E.c1}" stroke-width="1.2"/>`+flow('M-63 -174L-63 174','#fff',1,'4 18',1.6);
  // tips
  for(const sg of [1,-1]){const y=174*sg;
    if(id==='sakura')s+=bloom(-63,y,9,E,20*sg);else if(id==='cosmic')s+=`<path d="${star4(-63,y,13,.13)}" fill="url(#${p}mh)" stroke="#fff" stroke-width=".6"/>`+gem2(-63,y,3,p);
    else if(id==='flame')s+=`<g transform="translate(-63 ${y}) scale(1 ${sg})">${flameT(0,8,9,34,`url(#${p}fl)`)}</g>`;else if(id==='moon')s+=crescent(-63,y,10,sg>0?150:30,`url(#${p}mh)`,'#fff')+gem2(-60,y,2.6,p);
    else if(id==='frost')s+=shard(-63,y,26,5.5,sg>0?200:-20,p,E);else s+=thorn(-63,y,22,8,sg>0?215:-35,p,E)+gem2(-63,y,3,p,'dia')}
  // arrow
  const ar=`M-66 0L96 0`;s+=glowC(`<path d="${ar}" stroke="${E.glow}" stroke-width="6"/>`,p,'b6',.8)+`<path d="${ar}" stroke="url(#${p}mh)" stroke-width="2.6"/>`+flow(ar,'#fff',1.4,'8 22',.9);
  for(let i=0;i<3;i++){const x=-58+i*7;s+=`<path d="M${x} -1C${x+4} -10 ${x+12} -14 ${x+18} -15C${x+14} -8 ${x+12} -4 ${x+12} -1Z" fill="url(#${p}fl)" stroke="#fff" stroke-width=".5" opacity=".95"/><path d="M${x} 1C${x+4} 10 ${x+12} 14 ${x+18} 15C${x+14} 8 ${x+12} 4 ${x+12} 1Z" fill="url(#${p}fl)" stroke="#fff" stroke-width=".5" opacity=".95"/>`}
  s+=glowC(`<path d="M92 -9L118 0L92 9L98 0Z" fill="${E.glow}"/>`,p,'b6',1)+`<path d="M92 -9L118 0L92 9L98 0Z" fill="url(#${p}gem)" stroke="#fff" stroke-width=".8"/><path d="M92 -9L118 0L98 0Z" fill="#fff" opacity=".35"/>`+twk(118,0,11,'#fff',1.6,0);
  // grip
  s+=grip(E,p,32,-30,16,60,p+'bg')+`<rect x="30" y="-34" width="20" height="7" rx="2.5" fill="url(#${p}mh)"/><rect x="30" y="27" width="20" height="7" rx="2.5" fill="url(#${p}mh)"/>`;
  s+=`<circle cx="40" cy="0" r="12" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".8"/>`+gem2(40,0,8,p);
  if(id==='cosmic')s+=`<g><ellipse cx="40" cy="0" rx="22" ry="7" fill="none" stroke="${E.c1}" stroke-width="1.1" stroke-dasharray="24 6"/>${spinT(40,0,5)}</g>`;
  if(id==='moon')front+=ribbon(46,30,1,E,110)+ribbon(36,32,-1,E,90);
  if(id==='sakura')front+=bowKnot(40,34,E)+ribbon(44,40,1,E,80);
  if(id==='abyss')front+=chain(46,30,70,120,7,m[0],3)+`<ellipse cx="40" cy="0" rx="1.4" ry="5" fill="#000"/>`;
  if(id==='frost')front+=snowflake(40,0,16,'#ffffff',1.2).replace('<g ','<g opacity=".7" ');
  if(id==='flame')front+=`<g>${swayT(48,0,5,1.8)}${feather(48,0,40,8,60,p)}${feather(48,0,34,7,100,p)}${feather(48,0,40,8,130,p)}</g>`;
  s+=front+twk(-63,-174,8,'#fff',2.6,.5)+twk(-63,174,8,'#fff',2.6,1.7)+twk(70,-60,4,E.c1,2.8,.9);
  return s}

/* ============================ GUN ============================ */
function gun(E,p){const id=E.id,m=metalOf(E),rifle=id==='frost',bx=rifle?192:168,my=-25;let s=defs(p,E)+D2(p,E),back='',front='';
  s+=`<ellipse cx="10" cy="-5" rx="200" ry="95" fill="url(#${p}halo)" opacity=".4">${pulseOp(.25,.55,3)}</ellipse>`;
  // stock (rifle) / back adornments
  if(rifle){const st='M-74 -42L-186 -34Q-200 -32 -202 -18L-200 8Q-198 18 -186 16L-112 0L-74 -2Z';s+=`<path d="${st}" fill="url(#${p}bd)" stroke="${m[2]}" stroke-width="1"/><path d="M-80 -36L-184 -28" stroke="#fff" stroke-width="1.2" opacity=".85"/><path d="M-196 -26L-196 6" stroke="url(#${p}mh)" stroke-width="5"/>`;for(let i=0;i<3;i++)s+=shard(-110-i*24,-38,14+i*4,4,-10,p,E);s+=snowflake(-140,-14,9,E.c2,1.3)}
  if(id==='sakura'){back+=`<path d="M-30 -48C10 -70 60 -60 110 -72C130 -76 150 -70 160 -60" stroke="#7a2e52" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M40 -64Q50 -84 64 -88M100 -70Q110 -88 122 -90" stroke="#7a2e52" stroke-width="2" fill="none"/>`;
    [[-6,-58,8,0],[38,-66,9,25],[64,-88,7,10],[96,-70,8,40],[122,-90,7,5],[152,-66,7,30]].forEach(q=>back+=bloom(q[0],q[1],q[2],E,q[3]));back+=leaf(80,-70,14,-40,'#a7dc8f')+leaf(20,-64,12,-150,'#a7dc8f')}
  if(id==='flame')for(let i=0;i<8;i++)back+=`<g class="w3fl" style="animation-delay:${-i*.13}s">${flameT(10+i*19,-44,9,20+(i%3)*9,`url(#${p}fl)`)}</g>`;
  if(id==='moon')back+=`<path d="M10 -6C40 30 120 34 160 -8C130 16 60 18 10 -6Z" fill="url(#${p}mh)" stroke="#fff" stroke-width=".8"/>`+crescent(150,-6,9,200,`url(#${p}mh)`,'#fff');
  if(id==='abyss'){for(let i=0;i<6;i++)back+=thorn(10+i*26,-44,12+(i%2)*8,8,-12,p,E,4);back+=thorn(0,-6,20,8,170,p,E)+thorn(40,-6,16,7,165,p,E)}
  if(id==='cosmic')back+=`<path d="${star4(176,-25,34,.1)}" fill="url(#${p}mh)" opacity=".9"/>`;
  s+=back;
  // barrel
  const bar=`M-8 -36L${bx} -36Q${bx+6} -36 ${bx+6} -30L${bx+6} -18Q${bx+6} -14 ${bx} -14L-8 -14Z`;
  s+=glowC(`<path d="${bar}" fill="${E.c2}"/>`,p,'b6',.55)+`<path d="${bar}" fill="url(#${p}mv)" stroke="${m[2]}" stroke-width=".9"/>`;
  s+=`<rect x="-4" y="-42" width="${bx-6}" height="7" rx="2" fill="url(#${p}bd)" stroke="${m[2]}" stroke-width=".7"/><rect x="0" y="-15" width="${rifle?120:92}" height="10" rx="3" fill="url(#${p}bd)" stroke="${m[2]}" stroke-width=".7"/>`;
  s+=`<path d="M0 -33L${bx-4} -33" stroke="#fff" stroke-width="1.4" opacity=".9"/>`;
  if(id==='cosmic'){s+=`<rect x="14" y="-31" width="${bx-34}" height="12" rx="5" fill="url(#${p}sky)" stroke="#ffe9a8" stroke-width=".8"/>`;const R=rng(11);for(let i=0;i<16;i++)s+=`<circle cx="${f(18+R()*(bx-42))}" cy="${f(-28+R()*6)}" r="${f(.4+R()*.9)}" fill="#fff">${pulseOp(.2,1,f(1+R()*2))}</circle>`}
  else s+=`<path d="M14 -25L${bx-20} -25" stroke="${E.c3}" stroke-width="5" stroke-linecap="round" opacity=".55"/>`+glowC(flow(`M14 -25L${bx-20} -25`,E.c1,3,'14 18',1.4),p,'b2',1)+flow(`M14 -25L${bx-20} -25`,'#fff',1.2,'14 18',1.4);
  if(id==='abyss')for(let i=0;i<7;i++)s+=`<g transform="translate(${20+i*20} -25) rotate(55)"><ellipse rx="7" ry="3.6" fill="none" stroke="url(#${p}mh)" stroke-width="2.4"/></g>`;
  // muzzle crown
  s+=`<path d="M${bx-8} -46L${bx+4} -50L${bx+12} -40L${bx+12} -10L${bx+4} 0L${bx-8} -4Z" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".9"/>`+gem2(bx+2,-25,4.2,p,'dia');
  // scope (rifle)
  if(rifle)s+=`<path d="M-30 -62L60 -62L66 -56L60 -50L-30 -50L-36 -56Z" fill="url(#${p}bl)" stroke="#fff" stroke-width=".8"/><path d="M-30 -58L60 -58" stroke="#fff" stroke-width="1"/><rect x="-6" y="-50" width="8" height="8" fill="url(#${p}mh)"/><rect x="40" y="-50" width="8" height="8" fill="url(#${p}mh)"/>`+gem2(66,-56,4,p)+shard(10,-62,16,4,0,p,E)+shard(-14,-62,11,3,-14,p,E)+shard(34,-62,11,3,14,p,E);
  // frame
  const fr='M-78 -46L-6 -46L-6 -4L-22 6L-52 8L-78 2Z';s+=glowC(`<path d="${fr}" fill="${E.c2}"/>`,p,'b6',.5)+`<path d="${fr}" fill="url(#${p}bd)" stroke="url(#${p}mh)" stroke-width="2.4"/>`;
  s+=`<path d="M-72 -6C-66 -20 -52 -18 -54 -8S-66 -4 -62 -12M-14 -10C-20 -2 -34 0 -32 -6" stroke="${id==='sakura'||id==='frost'?E.c2:m[0]}" stroke-width="1" fill="none" opacity=".85"/>`;
  // cylinder
  s+=`<rect x="-54" y="-42" width="42" height="34" rx="7" fill="url(#${p}mv)" stroke="${m[2]}" stroke-width=".9"/>`;
  [-34,-25,-16].forEach(y=>s+=`<path d="M-50 ${y}L-16 ${y}" stroke="${m[2]}" stroke-width="2.2" opacity=".55"/><path d="M-50 ${y-1.2}L-16 ${y-1.2}" stroke="#fff" stroke-width=".6" opacity=".8"/>`);
  s+=gem2(-33,-25,5,p)+`<rect x="-54" y="-42" width="42" height="6" rx="3" fill="#fff" opacity=".25"/>`;
  if(id==='cosmic')s+=`<g><ellipse cx="-33" cy="-25" rx="30" ry="9" fill="none" stroke="${E.c1}" stroke-width="1.1" stroke-dasharray="28 8"/>${spinT(-33,-25,6)}</g>`;
  // hammer
  s+=`<path d="M-80 -44L-86 -60Q-84 -64 -78 -62L-72 -46Z" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".8"/>`;
  // trigger guard + trigger
  s+=`<path d="M-46 6C-48 34 -14 38 -10 4" fill="none" stroke="url(#${p}mh)" stroke-width="4"/><path d="M-30 6Q-28 18 -34 24" stroke="url(#${p}mh)" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  // grip
  const gp='M-78 0C-84 34 -100 74 -110 108Q-112 118 -100 120L-70 124Q-62 124 -62 114C-58 80 -48 40 -40 6Z';
  s+=glowC(`<path d="${gp}" fill="${E.c2}"/>`,p,'b6',.5)+`<path d="${gp}" fill="url(#${p}gp)" stroke="url(#${p}mh)" stroke-width="3"/>`;
  s+=`<path d="M-74 10C-80 40 -92 76 -100 106" stroke="#fff" stroke-width="1.2" opacity=".6" fill="none"/><path d="M-66 104C-62 74 -54 40 -48 12" stroke="url(#${p}mh)" stroke-width="1" fill="none" stroke-dasharray="3 3"/>`;
  s+=`<circle cx="-72" cy="60" r="12" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".8"/>`+(id==='abyss'?`<circle cx="-72" cy="60" r="8" fill="url(#${p}gem)"/><ellipse cx="-72" cy="60" rx="1.6" ry="6.4" fill="#000"><animate attributeName="rx" values="1.6;3;1.6" dur="3s" repeatCount="indefinite"/></ellipse>`:id==='sakura'?bloom(-72,60,9,E,0):id==='moon'?gem2(-72,60,7.5,p)+crescent(-72,60,6,-30,'#fff'):id==='frost'?gem2(-72,60,7.5,p)+snowflake(-72,60,6,'#fff',.9):gem2(-72,60,7.5,p));
  s+=`<path d="M-114 112Q-116 128 -100 130L-66 132Q-56 130 -58 118Z" fill="url(#${p}mh)" stroke="${m[2]}" stroke-width=".8"/>`;
  if(id==='sakura')front+=bowKnot(-58,4,E)+ribbon(-62,10,1,E,80);
  if(id==='moon')front+=ribbon(-66,122,-1,E,70)+hangCharm(-84,126,18,E,p,'moon');
  if(id==='abyss')front+=chain(-62,122,-30,150,5,m[0],3);
  if(id==='cosmic')front+=tassel(-86,126,E,p,30);
  if(id==='flame')front+=`<g>${swayT(-104,118,4,2)}${feather(-104,118,34,7,-150,p)}${feather(-104,118,30,6,-120,p)}${feather(-104,118,30,6,-180,p)}</g>`;
  if(id==='frost')front+=tassel(-196,10,E,p,26);
  // muzzle energy
  const mx=bx+16;front+=`<circle cx="${mx}" cy="${my}" r="16" fill="url(#${p}halo)">${pulseOp(.5,1,1.2)}</circle><circle cx="${mx}" cy="${my}" r="5.5" fill="#fff"><animate attributeName="r" values="4;6.5;4" dur="1.2s" repeatCount="indefinite"/></circle>`;
  front+=`<g opacity="0">${glowC(`<rect x="${mx}" y="${my-6}" width="60" height="12" rx="6" fill="${E.c2}"/>`,p,'b6',1)}<rect x="${mx}" y="${my-2.5}" width="60" height="5" rx="2.5" fill="#fff"/><animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.78;.84;1" dur="3.4s" repeatCount="indefinite"/></g>`;
  front+=twk(mx,my,14,'#fff',1.7,0)+twk(-50,-48,5,'#fff',2.6,.7)+twk(90,-46,4,E.c1,2.2,1.3)+twk(-90,70,4,'#fff',3,.4);
  return s+front}

const W3_PLACE={staff:[.5,0,40,136,182],sword:[.58,0,56,138,184],bow:[.32,40,0,170,164],gun:[.3,-60,20,124,178]};
function draw(el,type,u){const E=EL.filter(x=>x.id===el)[0],P=W3_PLACE[type],B={staff:staff,sword:sword,bow:bow,gun:gun}[type];
  let s=B(E,'w3'+u+'_');if(typeof wan==='function'&&!wan())s=s.replace(/<animate[^>]*\/>/g,'').replace(/ class="w3(fl|sw)"/g,'');
  return '<g class="wfx"><g transform="translate('+P[3]+' '+P[4]+') scale('+P[0]+') translate('+(-P[1])+' '+(-P[2])+')">'+s+'</g></g>'}
return {draw:draw};
})();
/* names: [element, th, en, zh] per type */
var W3_NAMES={
 staff:[['sakura','คทาคำสาบานบุปผา','Blossom Oath Scepter','花誓权杖'],['cosmic','คทามงกุฎดวงดาว','Astral Crown Staff','星冠法杖'],['flame','คทาเพลิงหงส์ไฟ','Phoenix Pyre Staff','凤焰法杖'],
  ['moon','คทาสุริยคราส','Eclipse Scepter','日蚀权杖'],['frost','คทาเกล็ดหิมะผลิบาน','Glacial Bloom Staff','冰花法杖'],['abyss','คทาบัลลังก์อเวจี','Abyssal Throne Staff','深渊王座法杖']],
 sword:[['sakura','ดาบพายุกลีบซากุระ','Petalstorm Blade','樱花风暴剑'],['cosmic','ดาบดาวตก','Starfall Sword','流星剑'],['flame','ดาบเขี้ยวอัคคี','Inferno Fang','炎狱之牙'],
  ['moon','ดาบจันทร์เสี้ยว','Crescent Reaper','新月收割剑'],['frost','ดาบคมยะเยือก','Frostbite Edge','霜咬之刃'],['abyss','ดาบพันธนาการหนาม','Thornbound Blade','荆缚之剑']],
 bow:[['sakura','ธนูสายลมวสันต์','Spring Breeze Bow','春风弓'],['cosmic','ธนูเนบิวลา','Nebula Bow','星云弓'],['flame','ธนูปีกถ่านเพลิง','Emberwing Bow','烬翼弓'],
  ['moon','ธนูริบบิ้นจันทรา','Lunar Ribbon Bow','月缎弓'],['frost','ธนูแสงเหนือ','Aurora Ice Bow','极光冰弓'],['abyss','ธนูหนามห้วงลึก','Void Thorn Bow','虚空荆棘弓']],
 gun:[['sakura','ปืนฮานามิ','Hanami Revolver','花见左轮'],['cosmic','ปืนดาวหาง','Comet Revolver','彗星左轮'],['flame','ปืนค้อนเพลิง','Blaze Hammer Pistol','烈焰锤手枪'],
  ['moon','ปืนเพลงราตรี','Nocturne Revolver','夜曲左轮'],['frost','ปืนไรเฟิลหอกน้ำแข็ง','Rime Lance Rifle','霜枪步枪'],['abyss','ปืนทำลายโซ่ตรวน','Chainbreaker Revolver','断链左轮']]};
/* rarity by type: staff celestial, sword mythic, bow legendary, gun epic */
var W3_RAR={staff:'celestial',sword:'mythic',bow:'legendary',gun:'epic'},W3_PFX={staff:'st',sword:'sw',bow:'bw',gun:'bw'},W3_KEY={staff:'k',sword:'k',bow:'k',gun:'kg'};
var W3_COL={sakura:['#ff8cc6','#ffe3f1'],cosmic:['#5b95ff','#dbe9ff'],flame:['#ff8a1f','#fff1b8'],moon:['#a374ff','#efe3ff'],frost:['#7fd6ff','#f2fcff'],abyss:['#ff2a4d','#ffc2cc']};
var W3_VB={staff:'78 31 115 222',sword:'83 30 110 241',bow:'131 101 69 127',gun:'105 140 110 75',gunR:'79 141 137 73'};
(function(){var n=0;['staff','sword','bow','gun'].forEach(function(type){W3_NAMES[type].forEach(function(r){var el=r[0],k=W3_PFX[type]+'_'+W3_KEY[type]+el,id='wk'+String(++n).padStart(2,'0'),nm=m(r[1],r[2],r[3]);
  WEAP[k]=function(a,b,u){return W3.draw(el,type,u)};WEAP_VB[k]=type==='gun'&&el==='frost'?W3_VB.gunR:W3_VB[type];
  if(ACC_WEAPON.indexOf(k)<0)ACC_WEAPON.push(k);if(CAT.accessories.kinds.indexOf(k)<0)CAT.accessories.kinds.push(k);KIND_NAMES[k]=nm;
  DEFAULTS.items.push({id:id,cat:'accessories',rar:W3_RAR[type],names:nm,g:null,v:{k:k,a:W3_COL[el][0],b:W3_COL[el][1]},noShop:true})})})})();
