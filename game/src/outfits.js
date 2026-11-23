/* =====================================================================
   OUTFIT SETS — full-look costumes (outfit category). Each set can draw
   behind the body (capes, tails, wings), the body itself, over the arms,
   and over the head (masks, horns, hoods). Colors: a = main, b = accent.
   ===================================================================== */
var GOLD='#ffd35a',GOLDD='#a8761a';
function lg(id,c1,c2,vert){return '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="'+(vert?0:1)+'" y2="'+(vert?1:0)+'"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></linearGradient></defs>'}
function mirror(d){return '<g transform="translate(200 0) scale(-1 1)">'+d+'</g>'}
var OSET={
 phoenix:{
  back:function(a,b,g,u){return lg(u+'ph',b,a,true)+
    '<path d="M94 166C76 186 58 206 34 228c26-6 46-22 66-46z" fill="url(#'+u+'ph)"/>'+mirror('<path d="M94 166C76 186 58 206 34 228c26-6 46-22 66-46z" fill="url(#'+u+'ph)"/>')+
    '<path d="M96 172c-4 20-2 40 4 58 6-18 8-38 4-58z" fill="'+b+'" opacity=".9"/>'+
    [[40,150],[160,146],[30,190],[170,196],[52,120],[150,116]].map(function(p,i){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(i%2?2:3)+'" fill="'+(i%2?b:'#ff7a3d')+'" opacity=".85"/>'}).join('')},
  body:function(a,b,g,u){return lg(u+'pb',a,shade(a,-40),true)+
    '<path d="M74 136h52l16 66H58z" fill="url(#'+u+'pb)"/>'+
    '<path d="M58 202l6-10 6 8 6-12 6 10 6-14 6 12 6-12 6 10 6-12 6 8 6-10 6 10v4H58z" fill="'+b+'"/>'+
    '<path d="M86 146l14 10 14-10M88 156l12 8 12-8" fill="none" stroke="'+b+'" stroke-width="3" stroke-linecap="round"/>'+
    '<rect x="76" y="170" width="48" height="6" rx="3" fill="'+b+'"/><circle cx="100" cy="173" r="5" fill="#ff7a3d" stroke="'+b+'" stroke-width="2"/>'+
    '<ellipse cx="72" cy="142" rx="14" ry="9" fill="'+b+'" transform="rotate(-20 72 142)"/><ellipse cx="128" cy="142" rx="14" ry="9" fill="'+b+'" transform="rotate(20 128 142)"/>'+
    '<ellipse cx="72" cy="144" rx="9" ry="5" fill="'+a+'" transform="rotate(-20 72 144)"/><ellipse cx="128" cy="144" rx="9" ry="5" fill="'+a+'" transform="rotate(20 128 144)"/>'},
  arms:function(a,b){return '<path d="M62 168l3 6 3-5 3 6 3-5 2 6v4H62z" fill="'+b+'"/>'+mirror('<path d="M62 168l3 6 3-5 3 6 3-5 2 6v4H62z" fill="'+b+'"/>')},
  front:function(a,b){return '<g transform="rotate(25 140 60)"><path d="M140 64l-6-22 6 6 2-12 4 12 6-6-4 22z" fill="'+b+'"/><path d="M140 64l-2-14 4 4 4-4-2 14z" fill="'+a+'"/></g>'}},
 ninja:{
  back:function(a,b){return '<path d="M118 132c22-4 42-12 60-28-8 18-22 30-46 38z" fill="'+b+'"/><path d="M120 138c18 2 34 0 50-8-10 12-24 18-44 18z" fill="'+shade(b,-30)+'"/>'},
  body:function(a,b){return '<rect x="74" y="136" width="52" height="50" rx="12" fill="'+a+'"/><path d="M76 140L124 176v8L76 148z" fill="'+b+'"/>'+
    '<rect x="76" y="172" width="48" height="6" rx="2" fill="'+shade(a,30)+'"/><path d="M112 175l8 8M112 175l9-3" stroke="'+b+'" stroke-width="3" stroke-linecap="round"/>'+
    '<path d="M88 150l2.5 4 4.5.5-3.5 3 1 4.5-4-2.3-4 2.3 1-4.5-3.5-3 4.5-.5z" fill="#d8dbe8"/>'+
    '<path d="M84 196h12M84 204h12M104 196h12M104 204h12" stroke="'+b+'" stroke-width="2"/>'},
  arms:function(a,b){return '<path d="M62 152h14M62 160h14M62 168h14M124 152h14M124 160h14M124 168h14" stroke="'+shade(a,40)+'" stroke-width="2"/>'},
  front:function(a,b){return '<path d="M58 106q42 10 84 0-2 28-42 34-40-6-42-34z" fill="'+a+'" stroke="'+b+'" stroke-width="2"/>'+
    '<rect x="52" y="62" width="96" height="9" rx="4" fill="'+b+'"/><rect x="90" y="60" width="20" height="13" rx="3" fill="#c9cfe0" stroke="'+shade(b,-40)+'" stroke-width="1.5"/>'+
    '<path d="M148 66l14-6-6 10 10 2" fill="none" stroke="'+b+'" stroke-width="4" stroke-linecap="round"/>'}},
 paladin:{
  back:function(a,b){return '<path d="M70 138q30-10 60 0l22 76q-52 12-104 0z" fill="#2d4c9c"/><path d="M48 214q52 12 104 0" fill="none" stroke="'+b+'" stroke-width="3"/>'},
  body:function(a,b){return '<path d="M74 136h52l12 68H62z" fill="'+a+'"/><rect x="97" y="136" width="6" height="68" fill="'+b+'"/>'+
    '<path d="M62 198h76l1 6H61z" fill="'+b+'"/><rect x="76" y="166" width="48" height="7" rx="2" fill="#6a4320"/><rect x="95" y="165" width="10" height="9" rx="2" fill="'+b+'"/>'+
    '<path d="M100 142l3 7 7.5.6-5.7 4.9 1.8 7.4L100 158l-6.6 3.9 1.8-7.4-5.7-4.9 7.5-.6z" fill="'+b+'" stroke="'+shade(b,-50)+'" stroke-width="1"/>'+
    '<ellipse cx="70" cy="142" rx="15" ry="10" fill="'+b+'" stroke="'+shade(b,-50)+'" stroke-width="1.5"/><ellipse cx="70" cy="148" rx="12" ry="6" fill="'+shade(b,25)+'"/>'+
    '<ellipse cx="130" cy="142" rx="15" ry="10" fill="'+b+'" stroke="'+shade(b,-50)+'" stroke-width="1.5"/><ellipse cx="130" cy="148" rx="12" ry="6" fill="'+shade(b,25)+'"/>'},
  arms:function(a,b){return '<rect x="61" y="162" width="16" height="13" rx="4" fill="'+b+'"/><rect x="123" y="162" width="16" height="13" rx="4" fill="'+b+'"/>'},
  front:function(a,b){return '<path d="M80 134q20 14 40 0-2 10-20 14-18-4-20-14z" fill="'+b+'" stroke="'+shade(b,-50)+'" stroke-width="1"/>'}},
 sorceress:{
  back:function(a,b){var col='<path d="M82 140L34 92q8 22 4 34l36 4z" fill="'+a+'" stroke="'+b+'" stroke-width="2"/><path d="M78 136L44 104" stroke="'+b+'" stroke-width="1" opacity=".6"/>';
    return '<path d="M70 138q30-14 60 0l34 74q-64 14-128 0z" fill="'+shade(a,-25)+'"/><path d="M36 212q64 14 128 0" fill="none" stroke="'+b+'" stroke-width="2.5"/>'+col+mirror(col)},
  body:function(a,b){return '<path d="M80 168h40l26 38q-46 10-92 0z" fill="'+a+'"/><path d="M58 202q10 6 20 0 10 6 22 0 12 6 22 0 10 6 20 0l2 4q-44 10-88 0z" fill="'+b+'"/>'+
    '<path d="M76 136h48l-4 36H80z" fill="'+shade(a,-10)+'"/><path d="M76 136h48" stroke="'+b+'" stroke-width="3"/>'+
    '<path d="M94 142l12 6-12 6 12 6-12 6" fill="none" stroke="'+b+'" stroke-width="1.6"/>'+
    '<circle cx="100" cy="182" r="7" fill="none" stroke="'+b+'" stroke-width="2"/><circle cx="100" cy="182" r="11" fill="'+b+'" opacity=".2"/><path d="M100 176v12M94 182h12" stroke="'+b+'" stroke-width="1.5"/>'},
  arms:function(a,b){return '<path d="M62 160h14l6 18H56z" fill="'+shade(a,10)+'" stroke="'+b+'" stroke-width="1.5"/>'+mirror('<path d="M62 160h14l6 18H56z" fill="'+shade(a,10)+'" stroke="'+b+'" stroke-width="1.5"/>')},
  front:function(a,b){return '<circle cx="100" cy="134" r="4" fill="'+b+'"/>'}},
 kitsune:{
  back:function(a,b){var t=function(cx,cy,r){return '<g transform="rotate('+r+' '+cx+' '+cy+')"><ellipse cx="'+cx+'" cy="'+cy+'" rx="15" ry="36" fill="#f2a347"/><ellipse cx="'+cx+'" cy="'+(cy-24)+'" rx="11" ry="14" fill="#fff4e0"/></g>'};
    return t(44,176,-62)+t(156,176,62)+t(58,148,-32)+t(142,148,32)},
  body:function(a,b){return '<rect x="74" y="136" width="52" height="40" rx="12" fill="'+a+'"/><path d="M88 136l12 20 12-20" fill="none" stroke="'+b+'" stroke-width="2.5"/>'+
    '<path d="M76 168h48l10 40h-28l-6-30-6 30H66z" fill="'+b+'"/><path d="M76 168h48v5H76z" fill="'+shade(b,-30)+'"/>'+
    '<path d="M100 160l-9-5v10zM100 160l9-5v10z" fill="'+b+'"/><circle cx="100" cy="160" r="2.5" fill="'+shade(b,-30)+'"/>'},
  arms:function(a,b){return '<path d="M62 140h14l6 38H52z" fill="'+a+'" stroke="#dcdce8" stroke-width="1"/><path d="M52 176h30" stroke="'+b+'" stroke-width="3"/>'+
    mirror('<path d="M62 140h14l6 38H52z" fill="'+a+'" stroke="#dcdce8" stroke-width="1"/><path d="M52 176h30" stroke="'+b+'" stroke-width="3"/>')},
  front:function(a,b){var e='<path d="M60 64l4-36 24 24z" fill="#f2a347"/><path d="M65 57l2-20 15 14z" fill="#fff4e0"/>';return e+mirror(e)}},
 demon:{
  back:function(a,b){var w='<path d="M84 146L38 108l8 20-18 2 16 14-10 12 46 4z" fill="#2a1528" stroke="'+b+'" stroke-width="2"/><path d="M80 148L50 124M78 152L44 146" stroke="'+b+'" stroke-width="1.2" opacity=".7"/>';
    return w+mirror(w)+'<path d="M118 178q34 22 38-6t14-24" fill="none" stroke="'+a+'" stroke-width="3.5" stroke-linecap="round"/><path d="M170 140l6 12-8 2-6-8z" fill="'+b+'"/>'},
  body:function(a,b){return '<path d="M78 168h44l14 36H64z" fill="'+b+'"/><path d="M78 168h44l8 36h-26l-6-22-6 22H70z" fill="'+a+'"/>'+
    '<path d="M76 136h48l-4 34H80z" fill="'+a+'"/><path d="M76 136h48" stroke="'+b+'" stroke-width="3"/><path d="M94 144l12 5-12 5 12 5-12 5" fill="none" stroke="'+b+'" stroke-width="1.6"/>'+
    '<path d="M64 204h72" stroke="'+b+'" stroke-width="2"/>'},
  arms:function(a,b){return '<rect x="61" y="158" width="16" height="18" rx="5" fill="'+shade(a,15)+'"/><rect x="123" y="158" width="16" height="18" rx="5" fill="'+shade(a,15)+'"/><path d="M61 158h16M123 158h16" stroke="'+b+'" stroke-width="2"/>'},
  front:function(a,b,g,u){var h='<path d="M72 62C58 50 54 30 64 16c2 16 10 30 22 40z" fill="url(#'+u+'hn)"/>';
    return lg(u+'hn','#2a1528',b,true)+h+mirror(h)+'<path d="M84 132q16 6 32 0" fill="none" stroke="#1a0c14" stroke-width="4"/><path d="M100 134l3 4-3 4-3-4z" fill="'+b+'"/>'}},
 frost:{
  back:function(a,b){return '<circle cx="100" cy="88" r="56" fill="'+a+'" stroke="'+shade(a,-35)+'" stroke-width="2"/>'},
  body:function(a,b){var fur='';for(var x=62;x<=138;x+=8)fur+='<circle cx="'+x+'" cy="202" r="5" fill="#ffffff"/>';
    return '<path d="M74 136h52l14 66H60z" fill="'+a+'"/><rect x="97" y="136" width="6" height="64" fill="'+b+'"/>'+fur+
    '<g stroke="'+b+'" stroke-width="2" stroke-linecap="round"><path d="M88 150h24M100 138v24M91.5 141.5l17 17M108.5 141.5l-17 17"/></g><circle cx="100" cy="150" r="3" fill="#fff"/>'},
  arms:function(a,b){return '<circle cx="69" cy="172" r="7" fill="#fff"/><circle cx="131" cy="172" r="7" fill="#fff"/>'},
  front:function(a,b){var drape='<path d="M46 100q2 26 18 38l10-2q-14-16-16-36z" fill="'+a+'"/>';
    return '<path d="M44 102C38 34 162 34 156 102c-6-30-28-48-56-48S50 72 44 102z" fill="'+a+'"/>'+drape+mirror(drape)+
      '<path d="M50 96C56 66 76 54 100 54s44 12 50 42" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="1 7" stroke-linecap="round"/>'+
      '<path d="M100 40l2 6 6-2-4 5 4 5-6-2-2 6-2-6-6 2 4-5-4-5 6 2z" fill="'+b+'"/>'}},
 ranger:{
  back:function(a,b){return '<path d="M72 138L52 212q48 10 96 0l-20-74z" fill="'+shade(a,-25)+'"/>'+
    '<g transform="rotate(22 134 136)"><rect x="128" y="104" width="13" height="58" rx="4" fill="'+b+'"/><path d="M131 104v-14M135 104v-16M139 104v-12" stroke="#e8e0c8" stroke-width="1.6"/>'+
    '<path d="M129 92l2-6 2 6zM133 90l2-6 2 6zM137 94l2-6 2 6z" fill="#d84a4a"/></g>'},
  body:function(a,b){return '<rect x="74" y="136" width="52" height="50" rx="12" fill="'+a+'"/><path d="M74 184l6 8 6-8 6 8 6-8 6 8 6-8 6 8 6-8 6 8 4-6v-4H74z" fill="'+a+'"/>'+
    '<path d="M78 140L122 180" stroke="'+b+'" stroke-width="5"/><rect x="76" y="170" width="48" height="6" rx="2" fill="'+b+'"/><rect x="95" y="168" width="10" height="10" rx="2" fill="'+GOLD+'" stroke="'+GOLDD+'"/>'+
    '<path d="M76 136q24 20 48 0-6 12-24 14-18-2-24-14z" fill="'+shade(a,-18)+'"/>'},
  arms:function(a,b){return '<rect x="61" y="160" width="16" height="14" rx="4" fill="'+b+'"/><rect x="123" y="160" width="16" height="14" rx="4" fill="'+b+'"/>'},
  front:function(a,b){return '<path d="M148 70q14-18 8-34-8 10-12 30z" fill="#58c96a"/><path d="M150 66q6-12 4-24" stroke="#2f7a3a" stroke-width="1.2" fill="none"/>'}},
 qipao:{
  back:function(){return ''},
  body:function(a,b){return '<path d="M76 136h48l-2 34 6 38H72l6-38z" fill="'+a+'"/><path d="M118 184l3 24" stroke="'+shade(a,-45)+'" stroke-width="2"/>'+
    '<path d="M100 138q12 2 22 12" fill="none" stroke="'+b+'" stroke-width="2.5"/><circle cx="108" cy="140" r="2" fill="'+b+'"/><circle cx="116" cy="144" r="2" fill="'+b+'"/><circle cx="121" cy="150" r="2" fill="'+b+'"/>'+
    '<g fill="none" stroke="'+b+'" stroke-width="1.8" stroke-linecap="round"><path d="M84 184c4-6 12-4 10 2s-8 4-6-1"/><path d="M104 196c4-6 12-4 10 2s-8 4-6-1"/><path d="M84 158c4-6 12-4 10 2s-8 4-6-1"/></g>'+
    '<path d="M76 136h48" stroke="'+b+'" stroke-width="2"/>'},
  arms:function(a,b){return '<rect x="62" y="152" width="14" height="24" rx="7" fill="'+SKIN+'"/><rect x="124" y="152" width="14" height="24" rx="7" fill="'+SKIN+'"/><path d="M62 152h14M124 152h14" stroke="'+b+'" stroke-width="2.5"/>'},
  front:function(a,b){return '<rect x="88" y="128" width="24" height="9" rx="3" fill="'+a+'" stroke="'+b+'" stroke-width="2"/>'+
    '<g transform="translate(60 66)"><circle r="6" fill="'+b+'"/><circle cx="-6" cy="-4" r="4" fill="'+a+'"/><circle cx="5" cy="-6" r="4" fill="'+a+'"/><circle cx="7" cy="4" r="4" fill="'+a+'"/><circle cx="-4" cy="6" r="4" fill="'+a+'"/><circle r="3" fill="'+b+'"/></g>'}},
 thai:{
  back:function(a,b){return '<path d="M80 136q-12 34-6 70h10q-4-34 8-66z" fill="'+b+'"/><path d="M76 200h8" stroke="'+GOLD+'" stroke-width="2"/>'},
  body:function(a,b){return '<path d="M76 168h48l4 40H72z" fill="'+a+'"/><path d="M100 172v36" stroke="'+shade(a,-45)+'" stroke-width="1.5"/><path d="M94 172l6 5 6-5M94 180l6 5 6-5" fill="none" stroke="'+shade(a,-45)+'" stroke-width="1.2"/>'+
    '<g fill="'+shade(a,-30)+'"><circle cx="84" cy="186" r="1.6"/><circle cx="116" cy="186" r="1.6"/><circle cx="86" cy="198" r="1.6"/><circle cx="114" cy="198" r="1.6"/></g>'+
    '<path d="M76 136h48v34H76z" fill="'+shade(a,15)+'"/><path d="M74 136h30l22 22v16L74 152z" fill="'+b+'"/><path d="M104 136l22 22M74 152l52 22" stroke="'+GOLD+'" stroke-width="2"/>'+
    '<g fill="'+GOLD+'"><circle cx="100" cy="150" r="1.6"/><circle cx="108" cy="158" r="1.6"/><circle cx="92" cy="142" r="1.6"/></g>'+
    '<rect x="74" y="166" width="52" height="7" rx="2" fill="'+GOLD+'" stroke="'+GOLDD+'"/><circle cx="100" cy="169.5" r="5" fill="'+GOLD+'" stroke="'+GOLDD+'"/><circle cx="100" cy="169.5" r="2" fill="#e2475f"/>'},
  arms:function(a,b){return '<rect x="61" y="145" width="16" height="5" rx="2" fill="'+GOLD+'" stroke="'+GOLDD+'" stroke-width=".8"/><rect x="123" y="145" width="16" height="5" rx="2" fill="'+GOLD+'" stroke="'+GOLDD+'" stroke-width=".8"/>'},
  front:function(a,b){return '<path d="M80 134q20 16 40 0-4 14-20 18-16-4-20-18z" fill="'+GOLD+'" stroke="'+GOLDD+'" stroke-width="1"/><circle cx="100" cy="146" r="3" fill="#e2475f"/><circle cx="90" cy="142" r="1.8" fill="#3fa8ff"/><circle cx="110" cy="142" r="1.8" fill="#3fa8ff"/>'}}
};
var SET_KINDS=Object.keys(OSET);
