/* =====================================================================
   VIP "Royal Amethyst" + Scholar "Sapphire Sage" — bespoke art (v2)
   Every exclusive item has its own drawing: nothing is a recolour.
   ===================================================================== */
var VQ={am:'#8a3ae0',amL:'#c89aff',amD:'#2e0a5a',au:'#ffd35a',auL:'#fff6c8',auD:'#8a5a08',sa:'#2f6fe0',saL:'#9ad0ff',saD:'#0a1f5a'};
function vqDefs(u){return '<defs>'+
  '<linearGradient id="'+u+'G" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffbe0"/><stop offset=".3" stop-color="#ffd35a"/><stop offset=".55" stop-color="#b8780e"/><stop offset=".8" stop-color="#ffe58a"/><stop offset="1" stop-color="#8a5a08"/></linearGradient>'+
  '<linearGradient id="'+u+'A" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e8d0ff"/><stop offset=".35" stop-color="#a45cf0"/><stop offset=".7" stop-color="#5a1aa8"/><stop offset="1" stop-color="#2e0a5a"/></linearGradient>'+
  '<linearGradient id="'+u+'S" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0f2ff"/><stop offset=".35" stop-color="#5a9cff"/><stop offset=".7" stop-color="#1f4fc8"/><stop offset="1" stop-color="#0a1f5a"/></linearGradient>'+
  '<radialGradient id="'+u+'D" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#e8f6ff"/><stop offset="1" stop-color="#9ad0ff"/></radialGradient>'+
  '<filter id="'+u+'L" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
  '<filter id="'+u+'B" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6"/></filter></defs>'}
/* a faceted gem: diamond (4) or brilliant (8) shape */
function vqGem(u,x,y,r,fill,n){n=n||4;var p=[],q=[];for(var i=0;i<n;i++){var a=-Math.PI/2+i*2*Math.PI/n;p.push(f1(x+Math.cos(a)*r*(n===4?.78:1))+' '+f1(y+Math.sin(a)*r));q.push(f1(x+Math.cos(a)*r*.42*(n===4?.78:1))+' '+f1(y+Math.sin(a)*r*.42))}
  return '<polygon points="'+p.join(' ')+'" fill="'+fill+'" stroke="#fff" stroke-width=".9"/><polygon points="'+q.join(' ')+'" fill="#fff" opacity=".35"/>'+p.map(function(pt){return '<path d="M'+x+' '+y+'L'+pt+'" stroke="#fff" stroke-opacity=".3" stroke-width=".5"/>'}).join('')+
   '<path d="M'+f1(x-r*.35)+' '+f1(y-r*.45)+'l'+f1(r*.25)+' '+f1(-r*.2)+'" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>'}
function vqTwinkle(x,y,r,c,dur,beg){return '<g opacity="0">'+hstar(x,y,r,c||'#fff')+'<animate attributeName="opacity" values="0;1;0" dur="'+(dur||2.2)+'s" begin="'+(beg||0)+'s" repeatCount="indefinite"/></g>'}

/* ======================= WEAPONS (hand ≈ 136,172) ======================= */
(function(){
var W={
 sw_vip:{n:m('ดาบราชันอเมทิสต์','Amethyst Sovereign Blade','紫晶君王剑'),d:function(a,b,u){
   var blade='M133 168L130 74L140 34L150 74L147 168Z';
   return vqDefs(u)+'<defs><linearGradient id="'+u+'sh" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/><animate attributeName="y1" values="1.6;-0.6" dur="2.4s" repeatCount="indefinite"/><animate attributeName="y2" values="0.6;-1.6" dur="2.4s" repeatCount="indefinite"/></linearGradient><clipPath id="'+u+'cp"><path d="'+blade+'"/></clipPath></defs>'+
    '<path d="'+blade+'" fill="#b46bff" opacity=".7" filter="url(#'+u+'B)"><animate attributeName="opacity" values=".45;.85;.45" dur="2s" repeatCount="indefinite"/></path>'+
    '<path d="'+blade+'" fill="url(#'+u+'A)" stroke="#f0e0ff" stroke-width="1.4"/><path d="M140 36L140 166L133 168L130 74Z" fill="#fff" opacity=".18"/><path d="M140 44V160" stroke="#fff" stroke-width="1.6" opacity=".7"/>'+
    '<g clip-path="url(#'+u+'cp)"><rect x="126" y="30" width="30" height="150" fill="url(#'+u+'sh)"/></g>'+
    '<path d="M134 96l6-6 6 6M134 120l6-6 6 6M134 144l6-6 6 6" stroke="#ffe58a" stroke-width="1.2" fill="none" opacity=".85"/>'+
    '<path d="M116 170C122 160 132 164 140 168C148 164 158 160 164 170C158 178 148 176 140 180C132 176 122 178 116 170Z" fill="url(#'+u+'G)" stroke="#5a3a04" stroke-width="1.2"/>'+
    '<path d="M116 170C110 166 106 158 108 152C112 160 118 164 124 164M164 170C170 166 174 158 172 152C168 160 162 164 156 164" fill="none" stroke="url(#'+u+'G)" stroke-width="3" stroke-linecap="round"/>'+
    vqGem(u,140,172,6,'url(#'+u+'D)',4)+'<rect x="136" y="180" width="8" height="22" rx="2" fill="#3a1060"/>'+[184,190,196].map(function(y){return '<path d="M136 '+y+'l8 3" stroke="#ffd35a" stroke-width="1.4"/>'}).join('')+
    '<circle cx="140" cy="206" r="5.5" fill="url(#'+u+'G)" stroke="#5a3a04"/>'+vqGem(u,140,206,3,'#c89aff',4)+vqTwinkle(146,46,5,'#fff',2)+vqTwinkle(132,90,3.5,'#ffe58a',2.6,1)}},
 st_vip:{n:m('คทาราชันอเมทิสต์','Amethyst Sovereign Scepter','紫晶君王权杖'),d:function(a,b,u){
   return vqDefs(u)+'<rect x="137" y="70" width="6" height="140" rx="3" fill="url(#'+u+'G)" stroke="#5a3a04" stroke-width=".8"/>'+
    [90,112,134,156,178].map(function(y){return '<path d="M137 '+y+'q3 4 6 0" stroke="#5a1aa8" stroke-width="2.2" fill="none"/>'}).join('')+'<circle cx="140" cy="210" r="5" fill="url(#'+u+'G)" stroke="#5a3a04"/>'+
    '<circle cx="140" cy="48" r="22" fill="#b46bff" opacity=".55" filter="url(#'+u+'B)"><animate attributeName="r" values="18;25;18" dur="2.4s" repeatCount="indefinite"/></circle>'+
    '<path d="M122 66C118 50 124 36 132 30C130 40 132 50 140 56C148 50 150 40 148 30C156 36 162 50 158 66C150 74 130 74 122 66Z" fill="url(#'+u+'G)" stroke="#5a3a04" stroke-width="1.2"/>'+
    '<path d="M126 30l4-10 4 8 6-12 6 12 4-8 4 10" fill="url(#'+u+'G)" stroke="#5a3a04" stroke-width="1"/>'+
    vqGem(u,140,46,13,'url(#'+u+'A)',8)+
    '<g><ellipse cx="140" cy="46" rx="26" ry="8" fill="none" stroke="#ffe58a" stroke-width="1.2" stroke-dasharray="3 5" opacity=".9"/><animateTransform attributeName="transform" type="rotate" from="0 140 46" to="360 140 46" dur="6s" repeatCount="indefinite"/></g>'+
    '<g>'+vqGem(u,0,0,3.4,'url(#'+u+'D)',4)+'<animateMotion dur="3s" repeatCount="indefinite" path="M166 46a26 8 0 1 1 -52 0a26 8 0 1 1 52 0"/></g>'+
    '<g>'+vqGem(u,0,0,2.6,'#ffe58a',4)+'<animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M166 46a26 8 0 1 1 -52 0a26 8 0 1 1 52 0"/></g>'+vqTwinkle(152,30,4,'#fff',2.2)}},
 bw_vip:{n:m('ธนูราชันอเมทิสต์','Amethyst Sovereign Bow','紫晶君王弓'),d:function(a,b,u){
   var limb='M140 128C150 110 160 84 156 58C154 48 148 42 142 40';
   return vqDefs(u)+'<path d="M138 42L138 214" stroke="#e8d0ff" stroke-width="1.6" filter="url(#'+u+'L)"><animate attributeName="stroke-opacity" values=".5;1;.5" dur="1.8s" repeatCount="indefinite"/></path>'+
    '<g><path d="'+limb+'" fill="none" stroke="#5a3a04" stroke-width="11" stroke-linecap="round"/><path d="'+limb+'" fill="none" stroke="url(#'+u+'G)" stroke-width="8" stroke-linecap="round"/><path d="M148 104C154 90 158 76 156 62" fill="none" stroke="url(#'+u+'A)" stroke-width="4"/>'+
    '<path d="M154 92C168 88 174 76 170 64C166 74 160 80 154 82Z" fill="url(#'+u+'G)" stroke="#5a3a04" stroke-width=".8"/>'+
    '<path d="M142 40C136 34 138 26 146 24C144 30 148 34 152 34C150 40 146 42 142 40Z" fill="url(#'+u+'G)" stroke="#5a3a04" stroke-width=".8"/>'+vqGem(u,156,64,4.4,'#c89aff',4)+'</g>'+
    '<g transform="translate(0 256) scale(1 -1)"><path d="'+limb+'" fill="none" stroke="#5a3a04" stroke-width="11" stroke-linecap="round"/><path d="'+limb+'" fill="none" stroke="url(#'+u+'G)" stroke-width="8" stroke-linecap="round"/><path d="M148 104C154 90 158 76 156 62" fill="none" stroke="url(#'+u+'A)" stroke-width="4"/>'+
    '<path d="M154 92C168 88 174 76 170 64C166 74 160 80 154 82Z" fill="url(#'+u+'G)" stroke="#5a3a04" stroke-width=".8"/>'+
    '<path d="M142 40C136 34 138 26 146 24C144 30 148 34 152 34C150 40 146 42 142 40Z" fill="url(#'+u+'G)" stroke="#5a3a04" stroke-width=".8"/>'+vqGem(u,156,64,3.4,'#c89aff',4)+'</g>'+
    '<rect x="135" y="118" width="12" height="20" rx="4" fill="#3a1060" stroke="url(#'+u+'G)" stroke-width="1.5"/>'+vqGem(u,141,128,6.5,'url(#'+u+'A)',4)+
    '<circle cx="141" cy="128" r="12" fill="#b46bff" opacity=".4" filter="url(#'+u+'B)"><animate attributeName="opacity" values=".2;.6;.2" dur="2s" repeatCount="indefinite"/></circle>'+vqTwinkle(160,50,4,'#fff',2.4)+vqTwinkle(160,206,3.5,'#ffe58a',2,1)}}};
Object.keys(W).forEach(function(k){WEAP[k]=W[k].d;if(ACC_WEAPON.indexOf(k)<0)ACC_WEAPON.push(k);if(CAT.accessories.kinds.indexOf(k)<0)CAT.accessories.kinds.push(k);KIND_NAMES[k]=W[k].n});
WEAP_VB.sw_vip='96 26 90 190';WEAP_VB.st_vip='96 14 90 206';WEAP_VB.bw_vip='96 16 90 206';
})();

/* ======================= PET: Little Royal Lion ======================= */
PSET.viplion={fly:true,d:function(a,b){var u='pl'+(++AVSEQ);
  var wing='<g transform="translate(-8 2)"><ellipse cx="-9" cy="-7" rx="8" ry="3.6" fill="url(#'+u+'G)" stroke="#8a5a08" stroke-width=".7" transform="rotate(-28 -12 -8)"/><ellipse cx="-10" cy="-2" rx="7.4" ry="3.3" fill="#fff6c8" stroke="#c8a040" stroke-width=".7" transform="rotate(-8 -13 -2)"/><ellipse cx="-8" cy="3" rx="6" ry="2.9" fill="#c89aff" stroke="#8a5ac8" stroke-width=".7" transform="rotate(12 -11 4)"/></g>';
  var mane='';for(var i=0;i<12;i++){var an=i*30;mane+='<ellipse cx="0" cy="-17" rx="5.5" ry="7.5" fill="url(#'+u+'M)" transform="rotate('+an+' 0 -6)"/>'}
  return vqDefs(u)+'<defs><radialGradient id="'+u+'M" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#ffe58a"/><stop offset="1" stop-color="#d88a10"/></radialGradient><radialGradient id="'+u+'F" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffbe8"/><stop offset="1" stop-color="#f4d8a0"/></radialGradient></defs>'+
   '<g><animateTransform attributeName="transform" type="rotate" values="0;-8;0" dur=".9s" repeatCount="indefinite"/>'+wing+'</g><g transform="scale(-1 1)"><g><animateTransform attributeName="transform" type="rotate" values="0;-8;0" dur=".9s" repeatCount="indefinite"/>'+wing+'</g></g>'+
   '<path d="M-10 4C-14 16 -12 24 -6 26H6C12 24 14 16 10 4Z" fill="url(#'+u+'A)" stroke="#2e0a5a" stroke-width=".8"/><path d="M-10 24h20" stroke="#ffd35a" stroke-width="1.6"/>'+
   '<ellipse cx="0" cy="12" rx="9" ry="10" fill="url(#'+u+'F)"/><path d="M-5 20v4M5 20v4" stroke="#e8c890" stroke-width="3.5" stroke-linecap="round"/>'+
   '<path d="M8 14C16 14 20 8 18 2" stroke="#e8c890" stroke-width="2" fill="none"/><circle cx="18" cy="1" r="3" fill="url(#'+u+'A)"/>'+
   mane+'<circle cx="0" cy="-6" r="10.5" fill="url(#'+u+'F)"/><circle cx="-8" cy="-14" r="3" fill="#f4d8a0"/><circle cx="8" cy="-14" r="3" fill="#f4d8a0"/>'+
   pe(0,-6,4,2.4)+'<path d="M-2 -1h4l-2 2.4z" fill="#c86a5a"/><path d="M-3 2q3 2 6 0" stroke="#8a4a3a" stroke-width=".9" fill="none"/><ellipse cx="-7" cy="-1" rx="2.4" ry="1.4" fill="#ff9aa8" opacity=".6"/><ellipse cx="7" cy="-1" rx="2.4" ry="1.4" fill="#ff9aa8" opacity=".6"/>'+
   '<path d="M-8 -18L-9 -28L-4 -23L0 -31L4 -23L9 -28L8 -18Z" fill="url(#'+u+'G)" stroke="#8a5a08" stroke-width=".8"/><circle cx="0" cy="-22" r="2" fill="#c89aff" stroke="#fff" stroke-width=".6"/>'+
   vqTwinkle(-14,-24,3,'#fff',2)+vqTwinkle(16,-18,2.4,'#ffe58a',2.6,1)}};
KIND_NAMES.viplion=m('สิงโตราชันน้อย','Little Royal Lion','小狮子君王');if(CAT.pet.kinds.indexOf('viplion')<0)CAT.pet.kinds.push('viplion');

/* ======================= AURAS (behind the hero, centre 100,140) ======================= */
var AURA2={
 vipaura:{d:function(a,b,u){var gems='';for(var i=0;i<8;i++){var an=i/8*Math.PI*2;gems+=vqGem(u,f1(100+Math.cos(an)*84),f1(140+Math.sin(an)*90),i%2?3.6:5,i%2?'url(#'+u+'D)':'url(#'+u+'A)',4)}
   var sp='';for(var k=0;k<8;k++){var x=f1(24+k*21),d=f1(2.2+k%3*.5),bg=f1(k*.4);sp+='<circle cx="'+x+'" cy="230" r="'+(1.4+k%2)+'" fill="#ffe58a" opacity="0"><animate attributeName="cy" values="230;60" dur="'+d+'s" begin="'+bg+'s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="'+d+'s" begin="'+bg+'s" repeatCount="indefinite"/></circle>'}
   return vqDefs(u)+'<ellipse cx="100" cy="140" rx="92" ry="98" fill="#8a3ae0" opacity=".22" filter="url(#'+u+'B)"/><ellipse cx="100" cy="140" rx="70" ry="76" fill="#ffd35a" opacity=".16" filter="url(#'+u+'B)"/>'+
    '<g><animateTransform attributeName="transform" type="rotate" from="0 100 140" to="360 100 140" dur="20s" repeatCount="indefinite"/><ellipse cx="100" cy="140" rx="84" ry="90" fill="none" stroke="url(#'+u+'G)" stroke-width="2.4" stroke-dasharray="14 6 2 6" opacity=".9"/>'+gems+'</g>'+sp}},
 vipaura2:{d:function(a,b,u){var rays='';for(var i=0;i<18;i++){var an=i*20*Math.PI/180;rays+='<path d="M100 140L'+f1(100+Math.cos(an-.05)*118)+' '+f1(140+Math.sin(an-.05)*118)+'L'+f1(100+Math.cos(an+.05)*118)+' '+f1(140+Math.sin(an+.05)*118)+'Z" fill="'+(i%2?'#ffe58a':'#c89aff')+'" opacity=".22"/>'}
   var cr='';for(var j=0;j<6;j++){var dl=f1(j*.6);cr+='<g>'+vqGem(u,0,0,j%2?4:5.5,j%2?'url(#'+u+'D)':'url(#'+u+'A)',4)+'<animateMotion dur="7s" begin="-'+dl+'s" repeatCount="indefinite" path="M190 140a90 30 0 1 1 -180 0a90 30 0 1 1 180 0"/></g>'}
   return vqDefs(u)+'<ellipse cx="100" cy="140" rx="98" ry="104" fill="#ffd35a" opacity=".2" filter="url(#'+u+'B)"/><ellipse cx="100" cy="140" rx="80" ry="86" fill="#8a3ae0" opacity=".22" filter="url(#'+u+'B)"/>'+
    '<g><animateTransform attributeName="transform" type="rotate" from="0 100 140" to="360 100 140" dur="40s" repeatCount="indefinite"/>'+rays+'</g>'+
    '<g><animateTransform attributeName="transform" type="rotate" from="360 100 140" to="0 100 140" dur="24s" repeatCount="indefinite"/><circle cx="100" cy="140" r="94" fill="none" stroke="url(#'+u+'G)" stroke-width="2" stroke-dasharray="2 8"/></g>'+
    '<g><animateTransform attributeName="transform" type="rotate" from="0 100 140" to="360 100 140" dur="16s" repeatCount="indefinite"/><circle cx="100" cy="140" r="86" fill="none" stroke="#c89aff" stroke-width="2.6" stroke-dasharray="20 10" opacity=".85"/></g>'+cr+
    vqTwinkle(26,70,5,'#fff',2)+vqTwinkle(176,80,4,'#ffe58a',2.4,.7)+vqTwinkle(30,210,4,'#c89aff',2.2,1.2)+vqTwinkle(170,204,5,'#fff',2.6,.4)}}};
KIND_NAMES.vipaura=m('ออร่าราชันวงแหวนเพชร','Royal diamond-ring aura','君王钻石环光环');KIND_NAMES.vipaura2=m('ออร่าจักรพรรดิสุริยะ','Emperor sun aura','帝王太阳光环');
['vipaura','vipaura2'].forEach(function(k){if(CAT.aura.kinds.indexOf(k)<0)CAT.aura.kinds.push(k)});

/* ======================= WINGS (root 88,138; left wing, mirrored) ======================= */
(function(){
function crystalWing(u){var s='',ribs=[[148,74],[164,82],[180,86],[196,82],[212,72]],pts=ribs.map(function(r){var d=wdir(r[0]);return [f1(WR.x+d[0]*r[1]),f1(WR.y+d[1]*r[1])]});
  for(var i=0;i<pts.length-1;i++){var p=pts[i],q=pts[i+1];s+='<path d="M'+WR.x+' '+WR.y+'L'+p[0]+' '+p[1]+'Q'+f1((+p[0]+(+q[0]))/2-8)+' '+f1((+p[1]+(+q[1]))/2)+' '+q[0]+' '+q[1]+'Z" fill="url(#'+u+'A)" opacity="'+(i%2?.78:.9)+'" stroke="url(#'+u+'G)" stroke-width="1.6"/>'}
  pts.forEach(function(p){s+='<path d="M'+WR.x+' '+WR.y+'L'+p[0]+' '+p[1]+'" stroke="url(#'+u+'G)" stroke-width="3" stroke-linecap="round"/>'+vqGem(u,p[0],p[1],3.6,'url(#'+u+'D)',4)});
  s+='<path d="M'+WR.x+' '+WR.y+'L'+pts[1][0]+' '+pts[1][1]+'" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>';return s}
WSET.vipwing=function(a,b,u){var w='<g><animateTransform attributeName="transform" type="rotate" values="0 88 138;-4 88 138;0 88 138" dur="3s" repeatCount="indefinite"/>'+crystalWing(u)+'</g>';
  return vqDefs(u)+'<ellipse cx="50" cy="128" rx="40" ry="44" fill="#8a3ae0" opacity=".3" filter="url(#'+u+'B)"/><ellipse cx="150" cy="128" rx="40" ry="44" fill="#8a3ae0" opacity=".3" filter="url(#'+u+'B)"/>'+w+mirror(w)+vqTwinkle(20,90,4,'#fff',2.2)+vqTwinkle(178,100,3.6,'#ffe58a',2.6,1)};
WSET.vipwing2=function(a,b,u){var back='',mid='',front='';
  for(var i=0;i<8;i++)back+=tear(WR.x,WR.y,150+i*15,104-Math.abs(i-3.5)*3,16,'#b46bff',' opacity=".55"');
  for(var j=0;j<8;j++)mid+=tear(WR.x-2,WR.y-2,154+j*14,92-Math.abs(j-3.5)*3,12,'url(#'+u+'G)',' stroke="#8a5a08" stroke-width=".8"');
  for(var k=0;k<7;k++)front+=tear(WR.x-4,WR.y-4,162+k*14,52,10,'url(#'+u+'W)',' stroke="#c8a040" stroke-width=".6"');
  var gems='';[[160,96],[184,98],[208,88]].forEach(function(r){var d=wdir(r[0]);gems+=vqGem(u,f1(WR.x+d[0]*r[1]),f1(WR.y+d[1]*r[1]),4.2,'url(#'+u+'A)',4)});
  var w='<g><animateTransform attributeName="transform" type="rotate" values="0 88 138;-6 88 138;0 88 138" dur="2.6s" repeatCount="indefinite"/><g filter="url(#'+u+'B)">'+back+'</g>'+mid+front+gems+'</g>';
  return vqDefs(u)+'<defs><linearGradient id="'+u+'W" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fff0c0"/></linearGradient></defs>'+
   '<ellipse cx="100" cy="120" rx="98" ry="70" fill="#ffd35a" opacity=".22" filter="url(#'+u+'B)"/>'+w+mirror(w)+vqTwinkle(14,70,5,'#fff',2)+vqTwinkle(186,74,5,'#ffe58a',2.4,.8)+vqTwinkle(26,180,4,'#c89aff',2.2,1.4)};
/* Scholar: wings of fanned spellbook pages with gold spines and floating letters */
WSET.bookwing=function(a,b,u){var s='';
  for(var i=0;i<7;i++){var ang=156+i*14,L=86-Math.abs(i-3)*5,d=wdir(ang),px=-d[1],py=d[0],x1=WR.x+d[0]*L,y1=WR.y+d[1]*L,w=13;
    s+='<path d="M'+WR.x+' '+WR.y+'L'+f1(x1+px*w)+' '+f1(y1+py*w)+'Q'+f1(x1+d[0]*7)+' '+f1(y1+d[1]*7)+' '+f1(x1-px*w)+' '+f1(y1-py*w)+'Z" fill="url(#'+u+'P)" stroke="#c8a040" stroke-width="1"/>';
    for(var k=1;k<5;k++){var t=k/5;s+='<path d="M'+f1(WR.x+d[0]*L*t+px*w*t*.75)+' '+f1(WR.y+d[1]*L*t+py*w*t*.75)+'L'+f1(WR.x+d[0]*L*t-px*w*t*.75)+' '+f1(WR.y+d[1]*L*t-py*w*t*.75)+'" stroke="#5a7ab0" stroke-width=".6" opacity=".5"/>'}
    s+='<path d="M'+WR.x+' '+WR.y+'L'+f1(x1)+' '+f1(y1)+'" stroke="url(#'+u+'G)" stroke-width="2.2" stroke-linecap="round"/>'}
  var dd=wdir(176);s+='<path d="M'+f1(WR.x+dd[0]*70)+' '+f1(WR.y+dd[1]*70-30)+'C'+f1(WR.x+dd[0]*90)+' '+f1(WR.y-60)+' '+f1(WR.x-40)+' '+f1(WR.y-70)+' '+f1(WR.x-30)+' '+f1(WR.y-84)+'" stroke="#fff" stroke-width="3" fill="none" opacity=".0"/>';
  var w='<g><animateTransform attributeName="transform" type="rotate" values="0 88 138;-5 88 138;0 88 138" dur="3.2s" repeatCount="indefinite"/>'+s+'</g>';
  var letters='';[['ก',26,92],['A',14,128],['文',24,166],['ข',176,94],['B',188,130],['字',178,168]].forEach(function(L,i){letters+='<text x="'+L[1]+'" y="'+L[2]+'" font-size="13" font-weight="900" fill="#5ab0ff" text-anchor="middle" filter="url(#'+u+'L)" opacity="0">'+L[0]+'<animate attributeName="opacity" values="0;1;0" dur="3s" begin="'+(i*.5)+'s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 6;0 -6" dur="3s" begin="'+(i*.5)+'s" repeatCount="indefinite"/></text>'});
  return vqDefs(u)+'<defs><linearGradient id="'+u+'P" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fffdf4"/><stop offset=".7" stop-color="#f4ead0"/><stop offset="1" stop-color="#bfe0ff"/></linearGradient></defs>'+
   '<ellipse cx="50" cy="130" rx="42" ry="46" fill="#5a9cff" opacity=".3" filter="url(#'+u+'B)"/><ellipse cx="150" cy="130" rx="42" ry="46" fill="#5a9cff" opacity=".3" filter="url(#'+u+'B)"/>'+w+mirror(w)+letters};
KIND_NAMES.vipwing=m('ปีกผลึกอเมทิสต์','Amethyst crystal wings','紫晶水晶之翼');KIND_NAMES.vipwing2=m('ปีกจักรพรรดิสุริยะ','Emperor sun wings','帝王太阳之翼');
['vipwing','vipwing2'].forEach(function(k){if(CAT.wings.kinds.indexOf(k)<0)CAT.wings.kinds.push(k)});
})();

/* ======================= OUTFIT: Emperor Regalia ======================= */
OSET.vipemperor={
 back:function(a,b,g,u){return vqDefs(u)+'<path d="M70 136C56 170 46 206 40 232H160C154 206 144 170 130 136Z" fill="url(#'+u+'A)" stroke="#2e0a5a" stroke-width="1.4"/>'+
   '<path d="M40 232H160" stroke="url(#'+u+'G)" stroke-width="5"/><path d="M44 222C78 228 122 228 156 222" stroke="url(#'+u+'G)" stroke-width="1.6" fill="none"/>'+
   [[58,196],[140,190],[70,214],[126,212],[100,220]].map(function(p,i){return hstar(p[0],p[1],i%2?3:4,'#ffe58a')}).join('')},
 body:function(a,b,g,u){return '<defs><linearGradient id="'+u+'eb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#efe6d4"/></linearGradient></defs>'+
   '<path d="M74 136h52l16 66H58z" fill="url(#'+u+'eb)" stroke="#c8b890" stroke-width="1"/>'+
   '<path d="M92 136h16l6 66H86z" fill="url(#'+u+'A)"/><path d="M92 136l-6 66M108 136l6 66" stroke="url(#'+u+'G)" stroke-width="2.4"/>'+
   '<path d="M58 202h84l-2-7H60z" fill="url(#'+u+'G)"/>'+[150,162,174,186].map(function(y){return '<circle cx="100" cy="'+y+'" r="2.2" fill="url(#'+u+'G)" stroke="#8a5a08" stroke-width=".5"/>'}).join('')+
   '<path d="M66 140C74 128 126 128 134 140C126 148 74 148 66 140Z" fill="#ffffff" stroke="#d8d0c0"/>'+[72,82,92,108,118,128].map(function(x){return '<path d="M'+x+' 140l1.4 3-1.4 2-1.4-2z" fill="#2a2a3a"/>'}).join('')+
   '<ellipse cx="68" cy="144" rx="13" ry="8" fill="url(#'+u+'G)" stroke="#8a5a08" transform="rotate(-18 68 144)"/><ellipse cx="132" cy="144" rx="13" ry="8" fill="url(#'+u+'G)" stroke="#8a5a08" transform="rotate(18 132 144)"/>'+
   '<path d="M60 150l-3 10M66 151l-2 10M72 151l-1 9M140 150l3 10M134 151l2 10M128 151l1 9" stroke="#ffd35a" stroke-width="1.6" stroke-linecap="round"/>'+
   '<circle cx="100" cy="158" r="9" fill="url(#'+u+'G)" stroke="#8a5a08" stroke-width="1.2"/>'+vqGem(u,100,158,6,'url(#'+u+'A)',8)},
 arms:function(a,b,g,u){var s='<rect x="62" y="140" width="14" height="36" rx="7" fill="url(#'+u+'A)"/><rect x="61" y="166" width="16" height="7" rx="3" fill="url(#'+u+'G)"/>';return s+mirror(s)},
 front:function(a,b,g,u){return ''}};
KIND_NAMES.vipemperor=m('ชุดจักรพรรดิราชันอเมทิสต์','Amethyst Emperor regalia','紫晶帝王圣装');if(CAT.outfit.kinds.indexOf('vipemperor')<0)CAT.outfit.kinds.push('vipemperor');

/* ======================= HEADWEAR ======================= */
(function(){
var H={
 vip_hat:{n:m('มงกุฎราชันอเมทิสต์','Amethyst Sovereign Crown','紫晶君王冠'),d:function(a,b,u){
  return vqDefs(u)+'<path d="M62 62C60 38 78 24 100 24S140 38 138 62Z" fill="url(#'+u+'A)"/><path d="M76 34q10-8 22-9" stroke="#fff" stroke-opacity=".45" stroke-width="3" stroke-linecap="round" fill="none"/>'+
   '<g filter="url(#'+u+'L)" opacity=".5"><path d="M100 4L100 -10M88 8L82 -2M112 8L118 -2" stroke="#ffe58a" stroke-width="2" stroke-linecap="round"/><animate attributeName="opacity" values=".2;.7;.2" dur="2.4s" repeatCount="indefinite"/></g>'+
   '<path d="M58 66L54 34L68 46L78 22L90 42L100 14L110 42L122 22L132 46L146 34L142 66Q100 76 58 66Z" fill="url(#'+u+'G)" stroke="#5a3a04" stroke-width="1.4" stroke-linejoin="round"/>'+
   [[54,34],[78,22],[100,14],[122,22],[146,34]].map(function(p,i){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i===2?4.4:3.2)+'" fill="url(#'+u+'D)" stroke="#5a3a04" stroke-width=".8"/>'}).join('')+
   '<path d="M56 62Q100 74 144 62L145 72Q100 84 55 72Z" fill="#ffffff" stroke="#d8d0c0"/>'+[64,76,88,112,124,136].map(function(x){return '<path d="M'+x+' 69l1.4 3-1.4 2-1.4-2z" fill="#2a2a3a"/>'}).join('')+
   vqGem(u,100,50,8.5,'url(#'+u+'A)',8)+vqGem(u,80,54,4,'url(#'+u+'D)',4)+vqGem(u,120,54,4,'url(#'+u+'D)',4)+vqTwinkle(140,24,4.5,'#fff',2.2)+vqTwinkle(62,30,3.5,'#ffe58a',2.6,1)}},
 sch_cap:{n:m('หมวกบัณฑิตปราชญ์แซฟไฟร์','Sapphire Scholar Cap','蓝宝石学者帽'),d:function(a,b,u){
  return vqDefs(u)+'<path d="M64 64q36 12 72 0V46q-36 10-72 0z" fill="url(#'+u+'S)" stroke="#0a1f5a" stroke-width="1.4"/><path d="M64 58q36 12 72 0" stroke="url(#'+u+'G)" stroke-width="2.4" fill="none"/>'+
   '<path d="M100 14L168 38L100 62L32 38z" fill="#1a2f6a" stroke="#0a1440" stroke-width="1.6"/><path d="M100 18L160 38L100 58L40 38z" fill="none" stroke="url(#'+u+'G)" stroke-width="1.4"/><path d="M100 18L150 35" stroke="#fff" stroke-opacity=".25" stroke-width="3"/>'+
   '<g transform="translate(100 37)"><path d="M-10 -4q5-2 10 0q5-2 10 0v8q-5-2-10 0q-5-2-10 0z" fill="#fff8e8" stroke="url(#'+u+'G)" stroke-width="1"/><path d="M0 -4v8" stroke="#c8a040"/></g>'+
   '<circle cx="100" cy="37" r="2" fill="url(#'+u+'G)"/><path d="M110 40Q140 42 148 52" stroke="url(#'+u+'G)" stroke-width="2.6" fill="none"/>'+
   '<g><path d="M148 52v20" stroke="url(#'+u+'G)" stroke-width="2.2"/><circle cx="148" cy="52" r="3" fill="url(#'+u+'G)"/><path d="M143 70h10l2 16h-14z" fill="url(#'+u+'G)" stroke="#8a5a08" stroke-width=".7"/><path d="M145 74v10M148 74v11M151 74v10" stroke="#8a5a08" stroke-width=".6"/>'+
   '<animateTransform attributeName="transform" type="rotate" values="0 148 52;7 148 52;0 148 52;-4 148 52;0 148 52" dur="3s" repeatCount="indefinite"/></g>'+vqGem(u,100,58,3.4,'#5ab0ff',4)+vqTwinkle(46,30,3.5,'#fff',2.4)}},
 sch_crown:{n:m('มงกุฎปราชญ์สามภาษา','Crown of the Trilingual Sage','三语贤者之冠'),d:function(a,b,u){var lf='';
  for(var i=0;i<7;i++){var an=(196+i*10)*Math.PI/180,x=f1(100+Math.cos(an)*46),y=f1(76+Math.sin(an)*40),rot=f1(196+i*10+90+28);
    lf+='<path d="M0 0Q6 -4.5 13 0Q6 4.5 0 0Z" fill="url(#'+u+'G)" stroke="#8a5a08" stroke-width=".6" transform="translate('+x+' '+y+') rotate('+rot+')"/><path d="M0 0Q6 -4.5 12 0Q6 4.5 0 0Z" fill="#3a9a52" stroke="#1f6a3a" stroke-width=".5" transform="translate('+x+' '+y+') rotate('+f1(+rot-50)+') scale(.8)"/>'}
  var glyph='';[['ก','#1f9d6a'],['A','#2f6fe0'],['文','#e0453a']].forEach(function(gp,i){glyph+='<g><text x="0" y="4" font-size="11" font-weight="900" fill="'+gp[1]+'" stroke="#fff" stroke-width="2.4" paint-order="stroke" text-anchor="middle">'+gp[0]+'</text><animateMotion dur="6s" begin="-'+(i*2)+'s" repeatCount="indefinite" path="M152 10a52 12 0 1 1 -104 0a52 12 0 1 1 104 0"/></g>'});
  return vqDefs(u)+'<ellipse cx="100" cy="10" rx="52" ry="12" fill="none" stroke="#bfe6ff" stroke-width="1.2" stroke-dasharray="3 5" opacity=".8"/>'+
   '<g transform="translate(100 -4)"><circle r="16" fill="#5ab0ff" opacity=".45" filter="url(#'+u+'B)"><animate attributeName="r" values="12;18;12" dur="2.6s" repeatCount="indefinite"/></circle>'+
   '<path d="M-16 -2q8-5 16 0q8-5 16 0v13q-8-5-16 0q-8-5-16 0z" fill="#fffdf4" stroke="url(#'+u+'G)" stroke-width="1.4"/><path d="M0 -2v13" stroke="#c8a040" stroke-width="1.2"/><path d="M-13 2h9M-13 5h9M4 2h9M4 5h9" stroke="#7a9ad0" stroke-width=".8"/>'+
   '<g><path d="M0 -2q8-6 16 0v13q-8-6-16 0z" fill="#fff" opacity=".9"><animateTransform attributeName="transform" type="scale" values="1 1;-1 1;1 1" dur="3s" repeatCount="indefinite"/></path></g></g>'+
   lf+mirror(lf)+'<path d="M60 64Q100 76 140 64L139 72Q100 84 61 72Z" fill="url(#'+u+'G)" stroke="#8a5a08" stroke-width="1.2"/>'+
   vqGem(u,80,62,5,'#1f9d6a',4)+vqGem(u,100,58,7.5,'url(#'+u+'S)',8)+vqGem(u,120,62,5,'#e0453a',4)+glyph+vqTwinkle(54,40,4,'#fff',2)+vqTwinkle(148,44,4,'#bfe6ff',2.4,1)}}};
Object.keys(H).forEach(function(k){HATS[k]=H[k];if(CAT.headwear.kinds.indexOf(k)<0)CAT.headwear.kinds.push(k);KIND_NAMES[k]=H[k].n});
})();

/* =====================================================================
   VIP v3 — "everything moves and glows": aurora spirit wings, a spirit
   dragon circling the hero, and living light on every VIP piece.
   ===================================================================== */
var AUR=['#6af7e0','#6ab0ff','#b46bff','#ff9ae8','#ffe58a'];
function vqAurora(u,id,vert){return '<linearGradient id="'+u+id+'" x1="'+(vert?0:1)+'" y1="0" x2="0" y2="'+(vert?1:0)+'">'+AUR.map(function(c,i){return '<stop offset="'+(i/4)+'" stop-color="'+c+'"/>'}).join('')+'</linearGradient>'}
function vqGlowF(u,id,sd){return '<filter id="'+u+id+'" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="'+sd+'" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'}
function vqStars(n,x0,y0,w,h,seed,cols){var s='';for(var i=0;i<n;i++){var x=f1(x0+((i*37+seed*11)%100)/100*w),y=f1(y0+((i*61+seed*7)%100)/100*h),c=cols[i%cols.length];
  s+='<circle cx="'+x+'" cy="'+y+'" r="'+(i%3?0.9:1.6)+'" fill="'+c+'" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="'+f1(1.4+i%5*.35)+'s" begin="'+f1(i*.23%2.4)+'s" repeatCount="indefinite"/></circle>'}return s}

/* ---- VIP 10 wings: aurora spirit ribbons (left wing, mirrored) ---- */
WSET.vipwing2=function(a,b,u){
  function ribbon(ang,L,w,fill,op,dur,ph){var d=wdir(ang),px=-d[1],py=d[0],tx=WR.x+d[0]*L,ty=WR.y+d[1]*L,mx=WR.x+d[0]*L*.55,my=WR.y+d[1]*L*.55;
    var c1x=mx+px*w,c1y=my+py*w-L*.1,c2x=mx-px*w*.35,c2y=my-py*w*.35,curl='M'+f1(tx)+' '+f1(ty)+'q'+f1(d[0]*10-px*8)+' '+f1(d[1]*10-py*8-6)+' '+f1(d[0]*4-px*16)+' '+f1(d[1]*4-py*16-2);
    return '<g><animateTransform attributeName="transform" type="rotate" values="0 88 138;'+(ph%2?-7:6)+' 88 138;0 88 138" dur="'+dur+'s" begin="-'+f1(ph*.4)+'s" repeatCount="indefinite"/>'+
      '<path d="M'+WR.x+' '+WR.y+'Q'+f1(c1x)+' '+f1(c1y)+' '+f1(tx)+' '+f1(ty)+'Q'+f1(c2x)+' '+f1(c2y)+' '+WR.x+' '+WR.y+'Z" fill="'+fill+'" opacity="'+op+'"/>'+
      '<path d="M'+WR.x+' '+WR.y+'Q'+f1((c1x+c2x)/2)+' '+f1((c1y+c2y)/2)+' '+f1(tx)+' '+f1(ty)+'" stroke="#ffffff" stroke-width=".9" fill="none" opacity=".8"/>'+
      '<path d="'+curl+'" stroke="'+fill+'" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="'+op+'"/>'+
      (w>18?'<path d="M'+f1(tx)+' '+f1(ty)+'c'+f1(-px*20)+' '+f1(-py*20+20)+' '+f1(d[0]*30+px*10)+' '+f1(40)+' '+f1(d[0]*18-px*6)+' '+f1(70)+'" stroke="'+fill+'" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="'+f1(op*.8)+'"><animate attributeName="opacity" values="'+f1(op*.3)+';'+f1(op*.9)+';'+f1(op*.3)+'" dur="2.6s" repeatCount="indefinite"/></path>':'')+'</g>'}
  var back='',mid='',front='';
  for(var i=0;i<8;i++)back+=ribbon(128+i*15,118-Math.abs(i-3.5)*5,34,'url(#'+u+'au1)',.45,3.4+i%3*.4,i);
  for(var j=0;j<7;j++)mid+=ribbon(140+j*15,104-Math.abs(j-3)*5,24,'url(#'+u+'au2)',.85,2.8+j%3*.3,j+1);
  for(var k=0;k<5;k++)front+=ribbon(156+k*15,48,8,'url(#'+u+'au3)',.6,2.4+k%2*.3,k+2);
  var w='<g filter="url(#'+u+'wg)">'+back+mid+front+'</g>';
  return '<defs>'+vqAurora(u,'au1')+vqAurora(u,'au2')+'<linearGradient id="'+u+'au3" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#ffe58a"/><stop offset="1" stop-color="#ff9ae8"/></linearGradient>'+vqGlowF(u,'wg',2.2)+'<filter id="'+u+'wb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>'+
   '<ellipse cx="100" cy="118" rx="96" ry="74" fill="#6ab0ff" opacity=".22" filter="url(#'+u+'wb)"><animate attributeName="opacity" values=".12;.32;.12" dur="3s" repeatCount="indefinite"/></ellipse>'+
   w+mirror(w)+vqStars(26,4,40,192,150,3,['#ffffff','#ffe58a','#6af7e0','#ff9ae8'])};
KIND_NAMES.vipwing2=m('ปีกวิญญาณออโรร่า','Aurora spirit wings','极光灵翼');

/* ---- VIP 10 aura: a spirit dragon circling the hero (back half behind, front half in front) ---- */
AURA2.vipaura2={d:function(a,b,u){return vqDragon(u,'back')},front:function(a,b,u){return vqDragon(u,'front')}};
KIND_NAMES.vipaura2=m('ออร่ามังกรวิญญาณจักรพรรดิ','Emperor spirit-dragon aura','帝王灵龙光环');
function vqDragon(u,part){var RX=96,RY=40,CY=160,C=Math.PI*(3*(RX+RY)-Math.sqrt((3*RX+RY)*(RX+3*RY))),B=C*.62,DUR=6;
  var P='M'+(100+RX)+' '+CY+'a'+RX+' '+RY+' 0 1 0 -'+(2*RX)+' 0a'+RX+' '+RY+' 0 1 0 '+(2*RX)+' 0';
  var clip='<clipPath id="'+u+'dc'+part+'"><rect x="-40" y="'+(part==='back'?-60:CY)+'" width="280" height="'+(part==='back'?CY+60:200)+'"/></clipPath>';
  function seg(w,frac,col,op){var bb=B*frac,g=B-bb;return '<path d="'+P+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" opacity="'+op+'" stroke-dasharray="0 '+f1(g)+' '+f1(bb)+' '+f1(C-B)+'"><animate attributeName="stroke-dashoffset" values="0;-'+f1(C)+'" dur="'+DUR+'s" repeatCount="indefinite"/></path>'}
  var lead=f1(B/C*DUR);
  var head='<g><animateMotion dur="'+DUR+'s" begin="-'+lead+'s" repeatCount="indefinite" rotate="auto-reverse" path="'+P+'"/><g transform="scale(-1.7 1.7)">'+
    '<path d="M0 -6L-14 -15L-7 -4L-18 -6L-7 1L-16 7L0 6Z" fill="#bff6ff" opacity=".75"/>'+
    '<path d="M0 -8C8 -12 18 -11 26 -6L38 -3C42 -2 42 2 38 3L26 5C18 9 8 9 0 7Z" fill="url(#'+u+'dh)" stroke="#e8fbff" stroke-width=".9"/>'+
    '<path d="M24 3.5L37 2" stroke="#9ad0ff" stroke-width=".9"/><path d="M28 -4.5l2 -3 2 3" stroke="#e8fbff" stroke-width=".8" fill="none"/>'+
    '<path d="M8 -9C2 -20 -8 -26 -17 -26C-9 -22 -3 -16 1 -9M14 -10C12 -18 8 -22 2 -24C6 -19 8 -15 9 -10" stroke="#ffffff" stroke-width="1.7" fill="none" stroke-linecap="round"/>'+
    '<circle cx="18" cy="-4" r="2.3" fill="#ffffff"/><circle cx="18" cy="-4" r="5.5" fill="#6af7e0" opacity=".55" filter="url(#'+u+'dg)"><animate attributeName="opacity" values=".3;.8;.3" dur="1.4s" repeatCount="indefinite"/></circle>'+
    '<path d="M38 1C48 6 54 14 62 12M36 -2C46 -9 52 -9 60 -15" stroke="#bff6ff" stroke-width="1.1" fill="none" opacity=".9"><animate attributeName="opacity" values=".5;1;.5" dur="2s" repeatCount="indefinite"/></path>'+
    '</g></g>';
  var fins='';for(var i=1;i<6;i++){var off=f1(DUR*(B/C)*(1-i*.15));fins+='<g opacity=".8"><animateMotion dur="'+DUR+'s" begin="-'+off+'s" repeatCount="indefinite" rotate="auto" path="'+P+'"/><path d="M0 0L-7 -16L7 -3Z" fill="#bff6ff" opacity="'+(1-i*.13)+'"/></g>'}
  var trail='';for(var j=0;j<8;j++){var o2=f1(DUR*(B/C)*(1-j*.11));trail+='<g><animateMotion dur="'+DUR+'s" begin="-'+o2+'s" repeatCount="indefinite" path="'+P+'"/><circle r="'+(j%2?1.2:2)+'" cy="'+(j%3-1)*6+'" fill="'+AUR[j%5]+'"><animate attributeName="opacity" values="1;.2;1" dur="1.2s" begin="'+f1(j*.15)+'s" repeatCount="indefinite"/></circle></g>'}
  var body='<g transform="rotate(-12 100 '+CY+')"><g clip-path="url(#'+u+'dc'+part+')" filter="url(#'+u+'dg)">'+seg(24,.5,'url(#'+u+'db)',.3)+seg(15,.78,'url(#'+u+'db)',.5)+seg(8,1,'#e8fbff',.7)+seg(2.4,1,'#ffffff',.95)+fins+trail+head+'</g></g>';
  var defs='<defs>'+clip+'<linearGradient id="'+u+'db" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6af7e0"/><stop offset=".5" stop-color="#9ad0ff"/><stop offset="1" stop-color="#d8b0ff"/></linearGradient>'+
    '<linearGradient id="'+u+'dh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#bff6ff" stop-opacity=".7"/><stop offset="1" stop-color="#ffffff" stop-opacity=".95"/></linearGradient>'+vqGlowF(u,'dg',2.4)+
    '<radialGradient id="'+u+'dr" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".35" stop-color="#ffe58a" stop-opacity=".5"/><stop offset="1" stop-color="#b46bff" stop-opacity="0"/></radialGradient>'+vqAurora(u,'ar',1)+'</defs>';
  if(part==='front')return defs+body;
  var curtain='';for(var k=0;k<5;k++){var x=f1(14+k*44);curtain+='<path d="M'+x+' 10C'+f1(+x+20)+' 50 '+f1(+x-14)+' 90 '+f1(+x+10)+' 140" stroke="url(#'+u+'ar)" stroke-width="'+(16-k%2*6)+'" fill="none" opacity=".22" filter="url(#'+u+'dg)"><animateTransform attributeName="transform" type="translate" values="0 0;'+(k%2?8:-8)+' 0;0 0" dur="'+f1(4+k*.6)+'s" repeatCount="indefinite"/><animate attributeName="opacity" values=".12;.32;.12" dur="'+f1(3+k*.5)+'s" repeatCount="indefinite"/></path>'}
  return defs+curtain+'<circle cx="100" cy="150" r="46" fill="url(#'+u+'dr)"><animate attributeName="r" values="38;52;38" dur="2.4s" repeatCount="indefinite"/></circle>'+
    vqStars(22,6,10,188,220,5,['#ffffff','#6af7e0','#ffe58a','#ff9ae8','#b46bff'])+body}

/* ---- VIP 6 aura: add aurora swirl + pulsing core to the diamond ring ---- */
(function(){var base=AURA2.vipaura.d;AURA2.vipaura.d=function(a,b,u){var sw='';for(var i=0;i<3;i++)sw+='<g><animateTransform attributeName="transform" type="rotate" from="'+(i*120)+' 100 140" to="'+(i*120+360)+' 100 140" dur="'+(9+i*2)+'s" repeatCount="indefinite"/><path d="M100 46C150 60 178 100 176 146" stroke="url(#'+u+'sw)" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7" filter="url(#'+u+'sg)"/></g>';
  return '<defs>'+vqAurora(u,'sw')+vqGlowF(u,'sg',2)+'</defs>'+base(a,b,u)+sw+'<circle cx="100" cy="150" r="30" fill="#ffe58a" opacity=".25" filter="url(#'+u+'sg)"><animate attributeName="opacity" values=".1;.35;.1" dur="2.2s" repeatCount="indefinite"/></circle>'+vqStars(14,10,30,180,200,2,['#ffffff','#ffe58a','#c89aff'])}})();

/* ---- living light on the other VIP pieces (wrap their drawings) ---- */
function vqWrap(fn,extra){return function(a,b,u){return fn(a,b,u)+extra(a,b,u)}}
/* crystal wings: breathing glow + shimmer sparkles */
WSET.vipwing=vqWrap(WSET.vipwing,function(a,b,u){return '<g opacity=".9">'+vqStars(16,8,60,184,120,4,['#ffffff','#e8d0ff','#ffe58a'])+'</g><ellipse cx="100" cy="128" rx="96" ry="56" fill="#b46bff" opacity=".18" filter="url(#'+u+'B)"><animate attributeName="opacity" values=".08;.3;.08" dur="2.6s" repeatCount="indefinite"/></ellipse>'});
/* crown: pulsing halo light and drifting sparkles */
HATS.vip_hat.d=vqWrap(HATS.vip_hat.d,function(a,b,u){return '<ellipse cx="100" cy="46" rx="44" ry="26" fill="#c89aff" opacity=".25" filter="url(#'+u+'B)"><animate attributeName="opacity" values=".1;.4;.1" dur="2.4s" repeatCount="indefinite"/></ellipse>'+vqStars(10,52,4,96,60,6,['#ffffff','#ffe58a','#e8d0ff'])});
/* weapons: energy aura + rising sparks */
['sw_vip','st_vip','bw_vip'].forEach(function(k){var f=WEAP[k];WEAP[k]=function(a,b,u){return '<ellipse cx="140" cy="110" rx="26" ry="90" fill="#b46bff" opacity=".2" filter="url(#'+u+'B)"><animate attributeName="opacity" values=".1;.35;.1" dur="2s" repeatCount="indefinite"/></ellipse>'+f(a,b,u)+vqStars(12,120,30,40,170,k.length,['#ffffff','#ffe58a','#c89aff'])}});
/* royal lion: glowing halo + twinkles */
(function(){var f=PSET.viplion.d;PSET.viplion.d=function(a,b){return '<circle cx="0" cy="0" r="30" fill="#ffd35a" opacity=".22"><animate attributeName="r" values="24;32;24" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".12;.3;.12" dur="2.2s" repeatCount="indefinite"/></circle>'+f(a,b)+vqStars(8,-28,-30,56,56,1,['#ffffff','#ffe58a'])}})();
/* emperor regalia: shimmering cape and a pulsing chest jewel */
(function(){var bk=OSET.vipemperor.back,bd=OSET.vipemperor.body;
  OSET.vipemperor.back=function(a,b,g,u){return bk(a,b,g,u)+'<path d="M70 136C56 170 46 206 40 232H160C154 206 144 170 130 136Z" fill="url(#'+u+'cs)" opacity=".5"/><defs><linearGradient id="'+u+'cs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/><animate attributeName="x1" values="-1;1" dur="3s" repeatCount="indefinite"/><animate attributeName="x2" values="0;2" dur="3s" repeatCount="indefinite"/></linearGradient></defs>'+vqStars(12,44,150,112,80,8,['#ffe58a','#ffffff','#c89aff'])};
  OSET.vipemperor.body=function(a,b,g,u){return bd(a,b,g,u)+'<circle cx="100" cy="158" r="12" fill="#c89aff" opacity=".4" filter="url(#'+u+'B)"><animate attributeName="opacity" values=".15;.6;.15" dur="1.8s" repeatCount="indefinite"/></circle>'}})();
/* VIP frames: a bright light runs around the band, gems breathe */
['vipgold','viproyal','vipking'].forEach(function(k,i){var f=FRAMES[k].d;FRAMES[k].d=function(a,b,u){var per=2*(196+236);
  return f(a,b,u)+'<path d="'+frIn(9,9)+'" fill="none" stroke="#fff6c0" stroke-width="3" stroke-linecap="round" stroke-dasharray="46 '+(per-46)+'" filter="url(#'+u+'g)"><animate attributeName="stroke-dashoffset" values="0;-'+per+'" dur="'+(3.4-i*.5)+'s" repeatCount="indefinite"/></path>'+
   (i?'<path d="'+frIn(9,9)+'" fill="none" stroke="#c89aff" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="30 '+(per-30)+'" filter="url(#'+u+'g)"><animate attributeName="stroke-dashoffset" values="-'+(per/2)+';-'+(per*1.5)+'" dur="'+(3.4-i*.5)+'s" repeatCount="indefinite"/></path>':'')+
   frAura(u,i===2?'#ffd35a':'#b46bff',16,.5,1.8)}});
