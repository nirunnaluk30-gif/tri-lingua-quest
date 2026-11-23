/* =====================================================================
   PLAZA GUARDIAN MECHA — an original giant robot that stands on the town plaza.
   About as tall as three players standing on each other's shoulders.
   Original design (jade + gold + gunmetal, single visor, three-gem crest for
   TH / EN / CN, open-book shield). Idle animation only: breathing, visor scan,
   core pulse, crest gems blinking, shield arm sway, back vents puffing steam.
   ===================================================================== */
Object.assign(L,{mc_name:m('มังกรกลไกผู้พิทักษ์ไตรภาษา','Tri-Lingua Mecha Dragon','三语守护机械龙'),
  mc_hi:m('ผู้พิทักษ์ลานเมือง · แตะเพื่อทักทาย','Guardian of the plaza · tap to say hi','广场守护者 · 点我打招呼'),
  mc_say:m('กร๊าววว! ฝึกคำศัพท์วันละนิด เก่งขึ้นทุกวันนะ 💪','ROAR! A few words every day makes you stronger 💪','吼——!每天练一点,天天都进步 💪')});
function mechaArt(){var u='mc',an=typeof wan!=='function'||wan(),AU=typeof TAURA!=='undefined'&&TAURA[9],WG=typeof WSET!=='undefined'&&WSET.dual;
  var g=function(id,a,b,c,x2,y2){return '<linearGradient id="'+u+id+'" x1="0" y1="0" x2="'+(x2===undefined?1:x2)+'" y2="'+(y2===undefined?0:y2)+'"><stop offset="0" stop-color="'+a+'"/><stop offset=".5" stop-color="'+b+'"/><stop offset="1" stop-color="'+c+'"/></linearGradient>'};
  /* shading helpers: a soft dark side and a thin highlight on every armour piece */
  var sh=function(d){return '<path d="'+d+'" fill="#0b1630" opacity=".22"/>'},hl=function(d,w){return '<path d="'+d+'" fill="none" stroke="#fff" stroke-width="'+(w||2)+'" stroke-linecap="round" opacity=".75"/>'};
  var K='stroke="#141a2c" stroke-width="2.4" stroke-linejoin="round"';
  return '<svg class="mc-svg" viewBox="-70 -30 360 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(t('mc_name'))+'" style="overflow:visible"><defs>'+(AU?auraDefs(u):'')+
   g('W','#ffffff','#e6ebf3','#a9b4c6')+g('W2','#f4f7fb','#cfd7e4','#8d99ae',0,1)+g('R','#ff5a64','#d81f33','#7c0b1b')+g('B','#4f7dff','#2142c4','#0d1d63')+
   g('M','#8a93a6','#545d70','#2a303d')+g('G','#fff1b0','#f2c14e','#9a6c12',0,1)+g('V','#0a2340','#1a4f86','#0a2340')+
   '<radialGradient id="'+u+'C" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#bff4ff"/><stop offset=".75" stop-color="#2fa8ff"/><stop offset="1" stop-color="#0b3b9a"/></radialGradient>'+
   '<radialGradient id="'+u+'Sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'+
  (AU?'<g transform="translate(110 386) scale(1.75) translate(-100 -222)">'+AU.back(u,an)+'</g>':'')+
  '<ellipse cx="110" cy="388" rx="96" ry="11" fill="url(#'+u+'Sh)"/>'+
  '<g class="mc-body">'+
   /* celestial wings */
   (WG?'<g class="mc-wings" transform="translate(110 128) scale(1.75) translate(-100 -138)">'+WG('#ff6a1a','#2a8bff',u+'w')+'</g>':'')+
   /* back vents + steam */
   '<g class="mc-back"><rect x="60" y="92" width="20" height="36" rx="6" fill="url(#'+u+'M)" '+K+'/><rect x="140" y="92" width="20" height="36" rx="6" fill="url(#'+u+'M)" '+K+'/>'+
    '<circle class="mc-steam s1" cx="70" cy="88" r="7" fill="#e8f4ff"/><circle class="mc-steam s2" cx="150" cy="88" r="6" fill="#e8f4ff"/><circle class="mc-steam s3" cx="67" cy="88" r="5" fill="#e8f4ff"/></g>'+
   /* legs: grey frame, blue knee guards, white shins with red stripes, red feet */
   '<g class="mc-legs">'+
    '<path d="M72 248h30l3 44h-36z" fill="url(#'+u+'M)" '+K+'/><path d="M118 248h30l-3 44h-30z" fill="url(#'+u+'M)" '+K+'/>'+
    '<path d="M78 256v30M86 256v30M134 256v30M142 256v30" stroke="#2a303d" stroke-width="2" opacity=".7"/>'+
    '<path d="M62 300l8-14h38l6 14l-4 54h-44z" fill="url(#'+u+'W)" '+K+'/><path d="M106 300l6-14h38l8 14l-4 54h-44z" fill="url(#'+u+'W)" '+K+'/>'+
    sh('M96 300l12 0-4 54h-10z')+sh('M146 300l12 0-4 54h-10z')+
    '<path d="M70 318h38M70 326h38" stroke="url(#'+u+'R)" stroke-width="5"/><path d="M112 318h38M112 326h38" stroke="url(#'+u+'R)" stroke-width="5"/>'+
    '<path d="M64 284q22-14 44 0l-4 18q-18-8-36 0z" fill="url(#'+u+'B)" '+K+'/><path d="M112 284q22-14 44 0l-4 18q-18-8-36 0z" fill="url(#'+u+'B)" '+K+'/>'+
    '<circle class="mc-knee" cx="86" cy="290" r="4" fill="#bff4ff"/><circle class="mc-knee" cx="134" cy="290" r="4" fill="#bff4ff"/>'+
    hl('M68 306l2 40',1.8)+hl('M112 306l2 40',1.8)+
    '<path d="M56 352h56l6 22q0 10-10 10h-52q-10 0-10-10z" fill="url(#'+u+'R)" '+K+'/><path d="M108 352h56l4 22q0 10-10 10h-52q-10 0-10-10z" fill="url(#'+u+'R)" '+K+'/>'+
    '<path d="M54 372h22v12h-12q-10 0-10-8z" fill="url(#'+u+'G)"/><path d="M144 372h22v4q0 8-10 8h-12z" fill="url(#'+u+'G)"/>'+
    sh('M100 352h12l6 22q0 10-10 10h-6z')+sh('M152 352h12l4 22q0 10-10 10h-6z')+
   '</g>'+
   /* hips: white skirt, blue buckle */
   '<path d="M64 218h92l8 38-24 4-6-14h-52l-6 14-24-4z" fill="url(#'+u+'W2)" '+K+'/>'+sh('M140 218h16l8 38-24 4z')+
   '<path d="M96 220h28l-3 28h-22z" fill="url(#'+u+'B)" '+K+'/><path d="M104 226h12l-2 14h-8z" fill="url(#'+u+'G)"/>'+
   /* abdomen */
   '<path d="M78 186h64l-4 34h-56z" fill="url(#'+u+'M)" '+K+'/><path d="M84 196h52M85 205h50M86 213h48" stroke="#1d2230" stroke-width="2.2"/>'+
   /* chest: white plate with red / blue bands (tri-colour) */
   '<path d="M54 112q56-22 112 0l-8 78q-48 18-96 0z" fill="url(#'+u+'W)" '+K+'/>'+
   '<path d="M58 140q52-14 104 0l-1 10q-51-13-102 0z" fill="url(#'+u+'R)"/><path d="M59 152q51-13 102 0l-1 12q-50-12-100 0z" fill="url(#'+u+'B)"/><path d="M60 166q50-12 100 0l-1 10q-49-11-98 0z" fill="url(#'+u+'R)"/>'+
   sh('M140 104q18 2 26 8l-8 78q-10 4-22 6z')+hl('M64 118q46-16 92 0',2.4)+
   '<path d="M88 112q22-10 44 0l-4 14q-18-6-36 0z" fill="url(#'+u+'B)" '+K+'/>'+
   /* core */
   '<g class="mc-core"><polygon points="110,138 128,149 128,169 110,180 92,169 92,149" fill="url(#'+u+'G)" stroke="#6b4c10" stroke-width="2.4"/>'+
    '<polygon class="mc-crys" points="110,145 121,152 121,166 110,173 99,166 99,152" fill="url(#'+u+'C)"/><circle class="mc-glow" cx="110" cy="159" r="20" fill="#6fd0ff" opacity=".16"/></g>'+
   /* left arm (viewer's right): relaxed fist */
   '<g class="mc-arml">'+
    '<path d="M154 140h22l2 46h-24z" fill="url(#'+u+'M)" '+K+'/>'+
    '<path d="M150 182h30l2 36-6 6h-22l-6-6z" fill="url(#'+u+'W)" '+K+'/><path d="M152 196h28" stroke="url(#'+u+'R)" stroke-width="6"/>'+sh('M170 182h10l2 36-6 6h-6z')+
    '<path d="M152 224h26l-2 18q-11 6-22 0z" fill="url(#'+u+'M)" '+K+'/>'+
    '<path d="M142 112q24-28 52-4q8 22-8 36q-22 6-44-6z" fill="url(#'+u+'B)" '+K+'/><path d="M148 108q20-18 42-2" fill="none" stroke="url(#'+u+'W)" stroke-width="6" stroke-linecap="round"/><path d="M150 128q18 6 38 2" stroke="url(#'+u+'R)" stroke-width="5" fill="none"/>'+sh('M176 108q14 8 10 30q-6 6-14 6z')+
   '</g>'+
   /* right arm (viewer's left): holds the celestial staff */
   '<g class="mc-armr">'+
    '<path d="M44 140h22l-2 46h-24z" fill="url(#'+u+'M)" '+K+'/>'+
    '<g class="mc-fore"><path d="M38 182h30l2 36-6 6h-22l-6-6z" fill="url(#'+u+'W)" '+K+'/><path d="M40 196h28" stroke="url(#'+u+'R)" stroke-width="6"/>'+sh('M58 182h10l2 36-6 6h-6z')+
     (typeof W3!=='undefined'?'<g class="mc-staff" transform="translate(50 232) rotate(-12) scale(1.6) translate(-136 -182)">'+W3.draw('cosmic','staff',u+'st')+'</g>':'')+
     '<path d="M40 222h28l-1 20q-13 7-26 0z" fill="url(#'+u+'M)" '+K+'/><path d="M44 230h20M44 236h20" stroke="#1d2230" stroke-width="2"/></g>'+
    '<path d="M78 112q-24-28-52-4q-8 22 8 36q22 6 44-6z" fill="url(#'+u+'B)" '+K+'/><path d="M72 108q-20-18-42-2" fill="none" stroke="url(#'+u+'W)" stroke-width="6" stroke-linecap="round"/><path d="M70 128q-18 6-38 2" stroke="url(#'+u+'R)" stroke-width="5" fill="none"/>'+
   '</g>'+
   /* head: white helmet, blue crest blade, single cyan visor, red chin guard, three gems (TH/EN/CN) */
   '<g class="mc-head">'+
    '<rect x="97" y="88" width="26" height="16" rx="5" fill="url(#'+u+'M)" '+K+'/>'+
    '<path d="M82 62q28-32 56 0l2 26q-30 14-60 0z" fill="url(#'+u+'W)" '+K+'/>'+sh('M124 52q12 6 14 10l2 26q-8 4-16 6z')+
    '<path d="M106 34l4-8 4 8 2 26h-12z" fill="url(#'+u+'B)" '+K+'/>'+
    '<path d="M86 70h48v12q-24 8-48 0z" fill="url(#'+u+'V)" stroke="#05161f" stroke-width="2"/>'+
    '<rect class="mc-eye" x="90" y="73" width="40" height="5" rx="2.5" fill="#7ff7ff"/><rect class="mc-scan" x="90" y="72" width="10" height="7" rx="3" fill="#fff"/>'+
    '<path d="M98 88h24l-3 8h-18z" fill="url(#'+u+'R)" '+K+'/>'+hl('M88 58q20-20 40-6',2)+
    '<path d="M94 50l-12-14M126 50l12-14" stroke="url(#'+u+'G)" stroke-width="4" stroke-linecap="round"/>'+
    '<circle class="mc-gem g1" cx="80" cy="33" r="5.5" fill="#d81f33" stroke="#fff" stroke-width="1.5"/>'+
    '<circle class="mc-gem g2" cx="110" cy="22" r="6" fill="#ffffff" stroke="#2142c4" stroke-width="1.8"/>'+
    '<circle class="mc-gem g3" cx="140" cy="33" r="5.5" fill="#2142c4" stroke="#fff" stroke-width="1.5"/>'+
   '</g>'+
  '</g>'+
  (AU?'<g transform="translate(110 386) scale(1.75) translate(-100 -222)">'+AU.front(u,an)+'</g>':'')+
  '</svg>'}
/* 2026-11-16 v3: an original mechanical dino-dragon (horizontal T-rex build, wings, no dorsal fins) */
function mechaRex(uid,cls){var u=uid||'mx',an=typeof wan!=='function'||wan(),AU=typeof TAURA!=='undefined'&&TAURA[9],WG=typeof WSET!=='undefined'&&WSET.dual;
  var g=function(id,a,b,c,x2,y2){return '<linearGradient id="'+u+id+'" x1="0" y1="0" x2="'+(x2===undefined?1:x2)+'" y2="'+(y2===undefined?0:y2)+'"><stop offset="0" stop-color="'+a+'"/><stop offset=".5" stop-color="'+b+'"/><stop offset="1" stop-color="'+c+'"/></linearGradient>'};
  var sh=function(d,o){return '<path d="'+d+'" fill="#0b1630" opacity="'+(o||.22)+'"/>'},hl=function(d,w){return '<path d="'+d+'" fill="none" stroke="#fff" stroke-width="'+(w||2)+'" stroke-linecap="round" opacity=".7"/>'};
  var K='stroke="#141a2c" stroke-width="2.4" stroke-linejoin="round"';
  var teeth=function(x0,y0,x1,y1,n,up){var o='';for(var i=0;i<n;i++){var t0=i/n,t1=(i+.5)/n,t2=(i+1)/n,ax=x0+(x1-x0)*t0,ay=y0+(y1-y0)*t0,bx=x0+(x1-x0)*t1,by=y0+(y1-y0)*t1+(up?-7:7),cx=x0+(x1-x0)*t2,cy=y0+(y1-y0)*t2;o+='M'+f1(ax)+' '+f1(ay)+'L'+f1(bx)+' '+f1(by)+'L'+f1(cx)+' '+f1(cy)+'z'}return '<path d="'+o+'" fill="#f4f7fb" stroke="#5a6478" stroke-width="1"/>'};
  /* tail: armoured segments, each a little smaller */
  var tail='';for(var i=0;i<7;i++){var x=262+i*21,y=166+i*7+i*i*.7,h=42-i*4.8,w=26-i*1.3;
    tail+='<g transform="translate('+f1(x)+' '+f1(y)+') rotate('+(10+i*3)+')"><rect x="0" y="'+f1(-h/2)+'" width="'+f1(w)+'" height="'+f1(h)+'" rx="'+f1(Math.min(8,h/3))+'" fill="url(#'+u+(i%2?'W':'W2')+')" '+K+'/>'+
     '<rect x="3" y="'+f1(-h/2+2)+'" width="'+f1(w-6)+'" height="'+f1(h*.32)+'" rx="3" fill="url(#'+u+'B)"/>'+(i%2?'':'<rect x="'+f1(w/2-3)+'" y="'+f1(h/2-8)+'" width="6" height="5" rx="1.5" fill="url(#'+u+'R)"/>')+'<rect x="'+f1(w*.62)+'" y="'+f1(-h/2)+'" width="'+f1(w*.38)+'" height="'+f1(h)+'" fill="#0b1630" opacity=".18"/></g>'}
  tail+='<path d="M402 240l24 10-26 4z" fill="url(#'+u+'G)" '+K+'/>';
  var leg=function(dx,far){var o=far?'<g opacity=".88" transform="translate('+dx+' -6)">':'<g transform="translate('+dx+' 0)">';
    return o+'<path d="M196 168q36-18 58 12q10 34-14 52l-38-2q-22-26-6-62z" fill="url(#'+u+(far?'W2':'W')+')" '+K+'/>'+sh('M238 176q16 12 16 28q-4 22-14 28l-12-2z')+hl('M206 182q4-10 18-12',2.2)+
     '<path d="M206 224h34l-4 46h-24z" fill="url(#'+u+'M)" '+K+'/><path d="M211 234h24M211 246h22M212 258h20" stroke="#1d2230" stroke-width="2"/>'+
     '<path d="M200 214q24-12 46 0l-4 22q-18-8-38 0z" fill="url(#'+u+'B)" '+K+'/><circle class="mc-knee" cx="222" cy="222" r="4" fill="#bff4ff"/>'+
     '<path d="M190 268h56l8 18q0 10-10 10h-58q-10 0-8-10z" fill="url(#'+u+'R)" '+K+'/>'+sh('M232 268h14l8 18q0 10-10 10h-8z')+
     '<path d="M182 286l-14 10h18zM200 290l-10 10h18zM218 290l-6 10h16z" fill="url(#'+u+'G)" stroke="#6b4c10" stroke-width="1.4"/></g>'};
  return '<svg class="mc-svg mx-svg'+(cls?' '+cls:'')+'" viewBox="-30 -40 500 350" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(t('mc_name'))+'" style="overflow:visible"><defs>'+(AU?auraDefs(u):'')+
   g('W','#ffffff','#e6ebf3','#a9b4c6')+g('W2','#eef2f8','#c9d2e0','#8d99ae',0,1)+g('R','#ff5a64','#d81f33','#7c0b1b')+g('B','#4f7dff','#2142c4','#0d1d63')+
   g('M','#8a93a6','#545d70','#2a303d')+g('G','#fff1b0','#f2c14e','#9a6c12',0,1)+g('V','#0a2340','#1a4f86','#0a2340')+
   '<radialGradient id="'+u+'C" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#bff4ff"/><stop offset=".75" stop-color="#2fa8ff"/><stop offset="1" stop-color="#0b3b9a"/></radialGradient>'+
   '<radialGradient id="'+u+'Sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>'+
  (AU?'<g transform="translate(220 300) scale(2.1 1.6) translate(-100 -222)">'+AU.back(u,an)+'</g>':'')+
  '<ellipse cx="240" cy="298" rx="170" ry="12" fill="url(#'+u+'Sh)"/>'+
  '<g class="mc-body">'+
   (WG?'<g class="mc-wings" transform="translate(210 108) scale(1.3) translate(-100 -138)">'+WG('#ff6a1a','#2a8bff',u+'w')+'</g>':'')+
   leg(26,true)+
   '<g class="mx-tail">'+tail+'</g>'+
   /* back vents + steam */
   '<g class="mc-back"><rect x="214" y="86" width="20" height="30" rx="6" fill="url(#'+u+'M)" '+K+'/><rect x="240" y="96" width="18" height="28" rx="6" fill="url(#'+u+'M)" '+K+'/>'+
    '<circle class="mc-steam s1" cx="224" cy="82" r="7" fill="#e8f4ff"/><circle class="mc-steam s2" cx="249" cy="92" r="6" fill="#e8f4ff"/><circle class="mc-steam s3" cx="221" cy="82" r="5" fill="#e8f4ff"/></g>'+
   /* torso: angular armour plates */
   '<path d="M124 126L150 98L214 84L258 96L280 132L272 180L238 208L176 214L134 194L118 160Z" fill="url(#'+u+'W2)" '+K+'/>'+
   '<path d="M132 134L166 108L212 104L222 156L190 198L148 186Z" fill="url(#'+u+'W)" '+K+'/>'+
   '<path d="M222 104L256 108L270 138L262 176L232 200L190 198L222 156Z" fill="url(#'+u+'W2)" '+K+'/>'+sh('M232 110L256 108L270 138L262 176L232 200Z',.28)+
   '<path d="M150 98L214 84L258 96L254 112L212 102L166 110Z" fill="url(#'+u+'B)" '+K+'/>'+
   '<path d="M152 194L176 214L238 208L234 196L190 198Z" fill="url(#'+u+'M)" '+K+'/><path d="M170 202l4 10M190 202l2 10M210 200l2 8" stroke="#1d2230" stroke-width="2"/>'+
   '<path d="M226 120l30 4M226 136l36 6M224 152l34 8" stroke="url(#'+u+'R)" stroke-width="4" stroke-linecap="round"/>'+
   hl('M136 136L166 112L208 108',2.4)+'<path d="M180 120l8 60M200 118l6 56" stroke="#5a6478" stroke-width="1.6" opacity=".6"/>'+
   /* chest core */
   '<g class="mc-core"><polygon points="150,128 166,137 166,155 150,164 134,155 134,137" fill="url(#'+u+'G)" stroke="#6b4c10" stroke-width="2.2"/>'+
    '<polygon class="mc-crys" points="150,134 160,140 160,152 150,158 140,152 140,140" fill="url(#'+u+'C)"/><circle class="mc-glow" cx="150" cy="146" r="18" fill="#6fd0ff" opacity=".16"/></g>'+
   /* little arms */
   '<g class="mx-arm"><path d="M138 164q-14 6-18 20l10 6q6-10 16-14z" fill="url(#'+u+'M)" '+K+'/><path d="M116 184l-8 10 8 2zM124 190l-4 12 8-2zM130 188l2 12 6-6z" fill="url(#'+u+'G)" stroke="#6b4c10" stroke-width="1.2"/><path d="M128 160q12-8 22 0l-4 14q-10-4-18 0z" fill="url(#'+u+'R)" '+K+'/></g>'+
   leg(0,false)+
   /* neck + head */
   '<g class="mx-head">'+
    '<path d="M148 120q-20-26-44-38l-14 22q22 14 36 34z" fill="url(#'+u+'M)" '+K+'/><path d="M110 92l22 14M104 100l20 14M98 108l18 12" stroke="#1d2230" stroke-width="2"/>'+
    '<g class="mx-jaw"><path d="M60 92h58l6 10q-26 18-66 8z" fill="url(#'+u+'W2)" '+K+'/>'+teeth(66,94,114,94,7,true)+'<path d="M62 104h50" stroke="url(#'+u+'R)" stroke-width="4"/></g>'+
    '<path d="M32 66q24-30 78-30q28 2 30 30l-6 26h-80q-20-4-22-26z" fill="url(#'+u+'W)" '+K+'/>'+sh('M118 40q20 6 22 26l-6 26h-20q8-26 4-52z')+
    teeth(44,92,116,92,8,false)+
    '<path d="M44 58q30-24 70-18" fill="none" stroke="url(#'+u+'B)" stroke-width="8" stroke-linecap="round"/>'+
    '<path d="M70 62h44l2 12h-46z" fill="url(#'+u+'V)" stroke="#05161f" stroke-width="2"/><rect class="mc-eye" x="73" y="65" width="40" height="5" rx="2.5" fill="#7ff7ff"/><rect class="mc-scan" x="73" y="64" width="10" height="7" rx="3" fill="#fff"/>'+
    '<path d="M36 76h20" stroke="url(#'+u+'R)" stroke-width="5" stroke-linecap="round"/><circle cx="38" cy="66" r="3" fill="#1d2230"/>'+
    hl('M46 52q28-16 60-14',2.2)+
    '<path d="M96 38l-8-18M110 38l2-22M122 42l12-16" stroke="url(#'+u+'G)" stroke-width="4" stroke-linecap="round"/>'+
    '<circle class="mc-gem g1" cx="87" cy="17" r="5.5" fill="#d81f33" stroke="#fff" stroke-width="1.5"/><circle class="mc-gem g2" cx="112" cy="12" r="6" fill="#fff" stroke="#2142c4" stroke-width="1.8"/><circle class="mc-gem g3" cx="135" cy="23" r="5.5" fill="#2142c4" stroke="#fff" stroke-width="1.5"/>'+
   '</g>'+
  '</g>'+
  (AU?'<g transform="translate(220 300) scale(2.1 1.6) translate(-100 -222)">'+AU.front(u,an)+'</g>':'')+
  '</svg>'}
/* place it on the town plaza (called from townPaint) */
function townMecha(sc){if(!sc||CFG.mechaOn===0)return;var w=sc.querySelector('.tw-mecha');if(w)return;
  w=document.createElement('button');w.type='button';w.className='tw-mecha rex';w.dataset.act='mchi';w.setAttribute('aria-label',t('mc_name'));
  w.innerHTML='<span class="tw-mclab"><b>🐉 '+esc(t('mc_name'))+'</b><small>'+esc(t('mc_hi'))+'</small></span><span class="tw-mcart">'+mechaRex()+'</span><span class="tw-mcbub" hidden></span>';
  var box=sc.querySelector('.tw-people');sc.insertBefore(w,box||null)}
function mechaAct(a){if(a!=='mchi')return false;var w=document.querySelector('.tw-mecha');if(!w)return true;var b=w.querySelector('.tw-mcbub');
  w.classList.remove('wave');void w.offsetWidth;w.classList.add('wave');b.textContent=t('mc_say');b.hidden=false;clearTimeout(mechaAct.tm);mechaAct.tm=setTimeout(function(){b.hidden=true;w.classList.remove('wave')},3500);sfx('lvl');return true}
