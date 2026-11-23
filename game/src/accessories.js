/* =====================================================================
   ACCESSORIES — one category, three wear spots (sub-slots):
   body (necklaces, capes, belts…), head (tiaras, halos, glasses…) and
   weapon (class-specific cosmetic weapons; no stats).
   a = main color, b = accent / gem / glow.
   ===================================================================== */
var ACC_BODY=['neck','scarf','pendant','cape','sash','belt','armlet','bowtie','bag','medal','lei','orbs'];
var ACC_HEAD=['crown','tiara','halo','horns','flower','bunny','goggles','headphones','glasses','circlet','antlers'];
var ACC_WEAPON=['sw_crystal','sw_flame','sw_katana','sw_holy','st_moon','st_star','st_dragon','st_tree','bw_angel','bw_storm','bw_moon','bw_dragon'];
var WEAPON_CLASS={sw:'sword',st:'mage',bw:'archer'};
function accSlot(k){return ACC_HEAD.indexOf(k)>=0?'acchead':ACC_WEAPON.indexOf(k)>=0?'weapon':'accessories'}
function slotOf(it){return it.cat==='accessories'?accSlot(it.v&&it.v.k):it.cat}
function weaponClass(k){return WEAPON_CLASS[String(k).slice(0,2)]||null}
var SLOT_NAMES={accessories:m('ลำตัว','Body','身体'),acchead:m('ศีรษะ','Head','头部'),weapon:m('อาวุธ','Weapon','武器')};
function gl(id,sd){return '<defs><filter id="'+id+'" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="'+(sd||3)+'"/></filter></defs>'}
/* drawn behind the body */
var ABACK={
 cape:function(a,b){return '<path d="M74 136q26-8 52 0l18 58q-44 10-88 0z" fill="'+a+'"/><path d="M80 140l-12 50q32 6 64 0l-12-50z" fill="'+shade(a,-35)+'"/><path d="M56 194q44 10 88 0" fill="none" stroke="'+b+'" stroke-width="2.5"/>'}
};
/* drawn over the body and arms */
var ABODY={
 pendant:function(a,b){return '<path d="M84 136q16 16 32 0" fill="none" stroke="'+b+'" stroke-width="2"/><path d="M100 160c-8-6-11-10-11-14a5 5 0 0 1 11-3a5 5 0 0 1 11 3c0 4-3 8-11 14z" fill="'+a+'" stroke="#fff" stroke-width="1"/><circle cx="96" cy="146" r="1.8" fill="#fff"/>'},
 cape:function(a,b){return '<circle cx="78" cy="139" r="4.5" fill="'+b+'" stroke="'+shade(b,-40)+'"/><circle cx="122" cy="139" r="4.5" fill="'+b+'" stroke="'+shade(b,-40)+'"/><path d="M82 139h36" stroke="'+b+'" stroke-width="1.5"/>'},
 sash:function(a,b){return '<path d="M76 138h10l40 38v10z" fill="'+a+'"/><path d="M86 138l40 38M76 148l50 38" stroke="'+b+'" stroke-width="1.5"/><path d="M106 166l3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6-4.5-4 6-1z" fill="'+b+'" stroke="'+shade(b,-45)+'" stroke-width=".8"/>'},
 belt:function(a,b){return '<rect x="74" y="170" width="52" height="8" rx="2" fill="'+a+'"/><rect x="94" y="168" width="12" height="12" rx="2" fill="'+GOLD+'" stroke="'+GOLDD+'"/><circle cx="100" cy="174" r="3" fill="'+b+'"/><rect x="76" y="176" width="13" height="13" rx="3" fill="'+shade(a,-20)+'"/><path d="M76 180h13" stroke="'+shade(a,25)+'" stroke-width="2"/>'},
 armlet:function(a,b){var o='<rect x="61" y="145" width="16" height="6" rx="2" fill="'+a+'" stroke="'+shade(a,-40)+'" stroke-width=".8"/><circle cx="69" cy="148" r="2.2" fill="'+b+'"/><rect x="61" y="168" width="16" height="5" rx="2" fill="'+a+'"/>';return o+mirror(o)},
 bowtie:function(a,b){return '<path d="M100 140l-14-8v16zM100 140l14-8v16z" fill="'+a+'" stroke="'+shade(a,-35)+'" stroke-width="1"/><path d="M90 134v12M110 134v12" stroke="'+b+'" stroke-width="1.5"/><rect x="96" y="136" width="8" height="8" rx="2" fill="'+shade(a,-25)+'"/>'},
 bag:function(a,b){return '<path d="M80 137L122 176" stroke="'+shade(a,-20)+'" stroke-width="4"/><rect x="114" y="170" width="24" height="20" rx="5" fill="'+a+'" stroke="'+shade(a,-35)+'" stroke-width="1.5"/><path d="M114 176q12 6 24 0v-2q-12-4-24 0z" fill="'+shade(a,-25)+'"/><rect x="123" y="177" width="6" height="5" rx="1" fill="'+b+'"/>'},
 medal:function(a,b){return '<path d="M82 136q18 20 36 0M84 138q16 16 32 0" fill="none" stroke="'+a+'" stroke-width="2"/><circle cx="100" cy="158" r="9" fill="'+a+'" stroke="'+shade(a,-45)+'" stroke-width="1.5"/><circle cx="100" cy="158" r="5" fill="'+b+'"/><path d="M96 154l8 8M104 154l-8 8" stroke="'+shade(a,-45)+'" stroke-width="1" opacity=".6"/>'},
 lei:function(a,b){var s='';for(var i=0;i<=6;i++){var t=i/6,x=80+40*t,y=136+4*24*t*(1-t);s+='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="5" fill="'+(i%2?a:shade(a,25))+'"/><circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="1.8" fill="'+b+'"/>'}return s},
 orbs:function(a,b,u){var o=[[40,150,5],[162,128,4],[154,196,4.5]];return gl(u+'ob',3)+o.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(p[2]+5)+'" fill="'+b+'" opacity=".6" filter="url(#'+u+'ob)"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+p[2]+'" fill="'+a+'" stroke="#fff" stroke-width="1"/>'}).join('')}
};
/* drawn on the head (after hair and hats) */
var AHEAD={
 tiara:function(a,b){return '<path d="M74 58q26-14 52 0l-3 5q-23-11-46 0z" fill="'+GOLD+'" stroke="'+GOLDD+'" stroke-width="1"/><path d="M90 52l4-10 6 8 6-8 4 10z" fill="'+GOLD+'" stroke="'+GOLDD+'" stroke-width="1"/><path d="M100 40l4 6-4 6-4-6z" fill="'+a+'" stroke="#fff" stroke-width="1"/><circle cx="82" cy="56" r="2.5" fill="'+b+'"/><circle cx="118" cy="56" r="2.5" fill="'+b+'"/>'},
 halo:function(a,b,u){return gl(u+'hl',2.5)+'<ellipse cx="100" cy="24" rx="27" ry="7" fill="none" stroke="'+b+'" stroke-width="8" opacity=".55" filter="url(#'+u+'hl)"/><ellipse cx="100" cy="24" rx="27" ry="7" fill="none" stroke="'+a+'" stroke-width="3.5"/>'},
 horns:function(a,b){var h='<path d="M74 56c-8-10-10-22-4-32 2 10 8 18 14 24z" fill="'+a+'" stroke="'+shade(a,-35)+'" stroke-width="1"/><path d="M70 24c1 4 3 7 5 9" stroke="'+b+'" stroke-width="2"/>';return h+mirror(h)},
 flower:function(a,b){var fl=function(x,y,r,c){var s='';for(var i=0;i<5;i++){var an=i*72*Math.PI/180-Math.PI/2;s+='<circle cx="'+f1(x+Math.cos(an)*r)+'" cy="'+f1(y+Math.sin(an)*r)+'" r="'+f1(r*.8)+'" fill="'+c+'"/>'}return s+'<circle cx="'+x+'" cy="'+y+'" r="'+f1(r*.6)+'" fill="'+GOLD+'"/>'};
   return '<path d="M128 78q10-2 16 6M132 66q12-6 18 2" stroke="#3f9a4a" stroke-width="3" stroke-linecap="round" fill="none"/>'+fl(138,66,5.5,a)+fl(128,76,4,b)+fl(146,78,3.5,shade(a,20))},
 bunny:function(a,b){var e='<ellipse cx="82" cy="20" rx="9" ry="24" fill="'+a+'" stroke="'+shade(a,-25)+'" stroke-width="1.2" transform="rotate(-12 82 20)"/><ellipse cx="82" cy="22" rx="4.5" ry="16" fill="'+b+'" transform="rotate(-12 82 22)"/>';
   return e+mirror(e)+'<path d="M60 60q40-30 80 0" fill="none" stroke="'+a+'" stroke-width="5" stroke-linecap="round"/>'},
 goggles:function(a,b){return '<path d="M52 66q48-14 96 0" fill="none" stroke="#5a3a24" stroke-width="6"/><circle cx="84" cy="60" r="11" fill="'+b+'" opacity=".75" stroke="'+a+'" stroke-width="3.5"/><circle cx="116" cy="60" r="11" fill="'+b+'" opacity=".75" stroke="'+a+'" stroke-width="3.5"/><path d="M95 60h10" stroke="'+a+'" stroke-width="3"/><path d="M79 56q4-4 8-3M111 56q4-4 8-3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'},
 headphones:function(a,b){return '<path d="M52 92C50 46 76 30 100 30s50 16 48 62" fill="none" stroke="'+a+'" stroke-width="6" stroke-linecap="round"/><rect x="42" y="84" width="16" height="26" rx="7" fill="'+a+'" stroke="'+shade(a,-35)+'" stroke-width="1.5"/><rect x="142" y="84" width="16" height="26" rx="7" fill="'+a+'" stroke="'+shade(a,-35)+'" stroke-width="1.5"/><circle cx="50" cy="97" r="4" fill="'+b+'"/><circle cx="150" cy="97" r="4" fill="'+b+'"/>'},
 glasses:function(a,b){return '<circle cx="82" cy="102" r="12" fill="'+b+'" fill-opacity=".18" stroke="'+a+'" stroke-width="2.8"/><circle cx="118" cy="102" r="12" fill="'+b+'" fill-opacity=".18" stroke="'+a+'" stroke-width="2.8"/><path d="M94 100q6-4 12 0M70 100l-16-4M130 100l16-4" stroke="'+a+'" stroke-width="2.5" fill="none"/><path d="M76 96l5-3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'},
 circlet:function(a,b){return '<path d="M54 78Q100 62 146 78" fill="none" stroke="'+GOLD+'" stroke-width="2.6"/><path d="M100 64c5 6 5 11 0 14-5-3-5-8 0-14z" fill="'+a+'" stroke="'+GOLD+'" stroke-width="1.5"/><circle cx="98.5" cy="69" r="1.4" fill="#fff"/><circle cx="74" cy="72" r="2" fill="'+b+'"/><circle cx="126" cy="72" r="2" fill="'+b+'"/>'},
 antlers:function(a,b){var t='<path d="M78 54C72 40 70 28 74 16M73 34l-10-6M72 24l-8-8M75 44l-12 0" fill="none" stroke="'+a+'" stroke-width="3.5" stroke-linecap="round"/><circle cx="64" cy="16" r="3" fill="'+b+'"/><circle cx="62" cy="44" r="2.5" fill="'+b+'"/>';return t+mirror(t)}
};
/* weapons, held in the right hand */
function swordWrap(inner){return '<g transform="rotate(18 136 172)">'+inner+'</g>'}
var WEAP={
 sw_crystal:function(a,b,u){return swordWrap(gl(u+'wc',3)+'<path d="M136 80l7 20-1 68h-12l-1-68z" fill="'+b+'" opacity=".6" filter="url(#'+u+'wc)"/><path d="M136 80l7 20-1 68h-12l-1-68z" fill="'+a+'" opacity=".92"/><path d="M136 84v80" stroke="#fff" stroke-width="1.5" opacity=".8"/>'+
   '<path d="M124 170l12-6 12 6-12 4z" fill="'+b+'" stroke="#fff" stroke-width="1"/><rect x="133" y="173" width="7" height="16" rx="3" fill="#3a3346"/><circle cx="136.5" cy="191" r="3.5" fill="'+a+'"/>')},
 sw_flame:function(a,b,u){return swordWrap(gl(u+'wf',3.5)+'<defs><linearGradient id="'+u+'wfg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+b+'"/><stop offset="1" stop-color="'+a+'"/></linearGradient></defs>'+
   '<path d="M136 78l12 22-2 68h-20l-2-68z" fill="'+a+'" opacity=".55" filter="url(#'+u+'wf)"/><path d="M136 82l10 20-1 66h-18l-1-66z" fill="url(#'+u+'wfg)"/><path d="M127 120l-6-6 7 2M146 136l6-6-7 2M127 148l-6-5 7 1" stroke="'+a+'" stroke-width="2.5" stroke-linecap="round"/>'+
   '<rect x="120" y="166" width="33" height="7" rx="3" fill="'+GOLD+'" stroke="'+GOLDD+'"/><rect x="132" y="173" width="9" height="17" rx="3" fill="#4a2414"/><circle cx="125" cy="108" r="1.8" fill="'+b+'"/><circle cx="150" cy="96" r="1.5" fill="'+b+'"/>')},
 sw_katana:function(a,b){return swordWrap('<path d="M133 88q11 40 6 80h-5q4-38-6-78z" fill="#e8eef8" stroke="#8a95aa" stroke-width="1"/><path d="M133 96q8 36 4 70" fill="none" stroke="'+b+'" stroke-width="1.2" opacity=".8"/>'+
   '<ellipse cx="136.5" cy="169" rx="8" ry="3" fill="'+GOLD+'" stroke="'+GOLDD+'"/><rect x="133" y="171" width="7" height="22" rx="3" fill="'+a+'"/><path d="M133 175l7 4M133 181l7 4M133 187l7 4M140 175l-7 4M140 181l-7 4M140 187l-7 4" stroke="#1a1a24" stroke-width="1"/>'+
   '<path d="M136 193q-6 8-2 18M136 193q4 8 2 16" stroke="'+b+'" stroke-width="2" fill="none" stroke-linecap="round"/>')},
 sw_holy:function(a,b,u){var wing='<path d="M134 168q-14-10-22-2 6 0 8 4-6 0-6 4 8-2 20-2z" fill="#fff" stroke="'+GOLDD+'" stroke-width="1"/>';
   return swordWrap(gl(u+'wh',3)+'<path d="M136 76l9 18v74h-18v-74z" fill="'+a+'" opacity=".7" filter="url(#'+u+'wh)"/><path d="M136 80l8 16v72h-16v-72z" fill="#fffaf0" stroke="'+GOLDD+'" stroke-width="1"/><path d="M136 88v76" stroke="'+a+'" stroke-width="3"/>'+
   wing+'<g transform="translate(273 0) scale(-1 1)">'+wing+'</g><circle cx="136.5" cy="169" r="4.5" fill="'+b+'" stroke="'+GOLD+'" stroke-width="2"/><rect x="133" y="173" width="7" height="16" rx="3" fill="'+GOLD+'"/>')},
 st_moon:function(a,b,u){return '<rect x="133" y="110" width="6" height="106" rx="3" fill="'+shade(b,-30)+'"/><rect x="132" y="150" width="8" height="5" rx="2" fill="'+GOLD+'"/>'+gl(u+'wm',3)+
   '<path d="M150 88a20 20 0 1 1-24-24a15 15 0 1 0 24 24z" fill="'+a+'" opacity=".55" filter="url(#'+u+'wm)"/><path d="M150 88a20 20 0 1 1-24-24a15 15 0 1 0 24 24z" fill="'+a+'" stroke="'+GOLD+'" stroke-width="1.5"/><path d="M136 102v8" stroke="'+GOLD+'" stroke-width="2"/>'+star4(144,74,4,'#fff')},
 st_star:function(a,b){return '<rect x="133" y="148" width="6" height="66" rx="3" fill="'+b+'"/><path d="M128 150q8 8 16 0" stroke="'+GOLD+'" stroke-width="2" fill="none"/>'+
   '<path d="M136 120l5 10 11 1.5-8 7.5 2 11-10-5.5-10 5.5 2-11-8-7.5 11-1.5z" fill="'+a+'" stroke="'+GOLD+'" stroke-width="2"/><circle cx="133" cy="134" r="2" fill="#fff"/>'+star4(156,120,4,'#fff')+star4(118,128,3,b)},
 st_dragon:function(a,b,u){return '<path d="M136 216q-6-50 0-104" stroke="#6a4020" stroke-width="7" fill="none" stroke-linecap="round"/>'+gl(u+'wd',3)+'<circle cx="136" cy="96" r="13" fill="'+a+'" opacity=".6" filter="url(#'+u+'wd)"/><circle cx="136" cy="96" r="9" fill="'+a+'" stroke="#fff" stroke-width="1"/>'+
   '<path d="M136 114c-16-4-20-20-12-30 2 8 6 10 10 10M136 114c16-4 20-20 12-30-2 8-6 10-10 10" fill="none" stroke="'+b+'" stroke-width="4" stroke-linecap="round"/><path d="M122 82l-6-8 9 3M150 82l6-8-9 3" stroke="'+b+'" stroke-width="3" stroke-linecap="round"/>'},
 st_tree:function(a,b,u){return '<path d="M136 216q-8-30 2-56t-4-50" stroke="#7a5230" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M134 112q-14-8-16-20M138 112q14-8 16-20" stroke="#7a5230" stroke-width="4" fill="none" stroke-linecap="round"/>'+
   '<ellipse cx="116" cy="90" rx="7" ry="4" fill="#58c96a" transform="rotate(-30 116 90)"/><ellipse cx="156" cy="90" rx="7" ry="4" fill="#58c96a" transform="rotate(30 156 90)"/><ellipse cx="128" cy="150" rx="6" ry="3.5" fill="#58c96a" transform="rotate(-20 128 150)"/>'+
   gl(u+'wt',3)+'<circle cx="136" cy="100" r="11" fill="'+a+'" opacity=".6" filter="url(#'+u+'wt)"/><circle cx="136" cy="100" r="6" fill="'+a+'"/>'+star4(150,104,3.5,b)},
 bw_angel:function(a,b){var fw='<path d="M141 106q-2-12 10-16-4 6 0 8-6 2-4 8z" fill="#fff" stroke="'+GOLDD+'" stroke-width="1"/>';
   return '<path d="M140 106q32 54 0 108" fill="none" stroke="'+GOLD+'" stroke-width="5" stroke-linecap="round"/><path d="M140 106v108" stroke="#fff" stroke-width="1.5"/>'+fw+'<g transform="translate(0 320) scale(1 -1)">'+fw+'</g><circle cx="156" cy="160" r="4" fill="'+a+'" stroke="#fff"/>'},
 bw_storm:function(a,b,u){return gl(u+'ws',3)+'<path d="M140 104l14 20-6 4 12 18-6 4 8 18-10 4 10 18-22 24" fill="none" stroke="'+b+'" stroke-width="7" opacity=".55" filter="url(#'+u+'ws)"/><path d="M140 104l14 20-6 4 12 18-6 4 8 18-10 4 10 18-22 24" fill="none" stroke="'+a+'" stroke-width="4" stroke-linejoin="round"/><path d="M140 104v110" stroke="'+b+'" stroke-width="1.5"/>'},
 bw_moon:function(a,b){return '<path d="M140 104q40 56 0 112q22-56 0-112z" fill="'+a+'" stroke="'+shade(a,-40)+'" stroke-width="1.5"/><path d="M140 104v112" stroke="#fff" stroke-width="1.2"/><circle cx="153" cy="160" r="3.5" fill="'+b+'"/>'+star4(162,150,4,'#fff')},
 bw_dragon:function(a,b){return '<path d="M140 108q12 14 14 30t-6 22q14 6 6 22t-14 30" fill="none" stroke="'+a+'" stroke-width="6" stroke-linecap="round"/><path d="M140 108l-6-8 9 2M140 212l-6 8 9-2" stroke="'+b+'" stroke-width="3" stroke-linecap="round"/>'+
   '<path d="M140 108v104" stroke="#e8e0c8" stroke-width="1.5"/><rect x="146" y="154" width="10" height="12" rx="3" fill="'+b+'"/>'}
};
function weaponThumb(it){var f=WEAP[it.v.k];return '<svg viewBox="'+((typeof WEAP_VB!=='undefined'&&WEAP_VB[it.v.k])||'96 60 90 170')+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(tx(it.names))+'">'+(f?f(it.v.a,it.v.b,'t'+(++AVSEQ)):'')+'</svg>'}
