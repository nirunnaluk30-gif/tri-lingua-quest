/* =====================================================================
   PLAZA GUARDIAN MECHA — an original giant robot that stands on the town plaza.
   About as tall as three players standing on each other's shoulders.
   Original design (jade + gold + gunmetal, single visor, three-gem crest for
   TH / EN / CN, open-book shield). Idle animation only: breathing, visor scan,
   core pulse, crest gems blinking, shield arm sway, back vents puffing steam.
   ===================================================================== */
Object.assign(L,{mc_name:m('ยักษ์กลไกผู้พิทักษ์ไตรภาษา','Tri-Lingua Guardian Mecha','三语守护机甲'),
  mc_hi:m('ผู้พิทักษ์ลานเมือง · แตะเพื่อทักทาย','Guardian of the plaza · tap to say hi','广场守护者 · 点我打招呼'),
  mc_say:m('สวัสดี! ฝึกคำศัพท์วันละนิด เก่งขึ้นทุกวันนะ 💪','Hello! A few words every day makes you stronger 💪','你好!每天练一点,天天都进步 💪')});
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
/* place it on the town plaza (called from townPaint) */
function townMecha(sc){if(!sc||CFG.mechaOn===0)return;var w=sc.querySelector('.tw-mecha');if(w)return;
  w=document.createElement('button');w.type='button';w.className='tw-mecha';w.dataset.act='mchi';w.setAttribute('aria-label',t('mc_name'));
  w.innerHTML='<span class="tw-mclab"><b>🤖 '+esc(t('mc_name'))+'</b><small>'+esc(t('mc_hi'))+'</small></span><span class="tw-mcart">'+mechaArt()+'</span><span class="tw-mcbub" hidden></span>';
  var box=sc.querySelector('.tw-people');sc.insertBefore(w,box||null)}
function mechaAct(a){if(a!=='mchi')return false;var w=document.querySelector('.tw-mecha');if(!w)return true;var b=w.querySelector('.tw-mcbub');
  w.classList.remove('wave');void w.offsetWidth;w.classList.add('wave');b.textContent=t('mc_say');b.hidden=false;clearTimeout(mechaAct.tm);mechaAct.tm=setTimeout(function(){b.hidden=true;w.classList.remove('wave')},3500);sfx('lvl');return true}
