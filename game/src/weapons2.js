/* =====================================================================
   NEW WEAPONS (preview set) — 18 original designs, 6 per class.
   Same hand position as the existing weapons: grip near (136, 180).
   sw_ = sword class, st_ = mage class, bw_ = archer class (ranged).
   a = main colour, b = glow colour.
   ===================================================================== */
function wgrad(id,stops,vert){return '<linearGradient id="'+id+'" x1="0" y1="'+(vert?1:0)+'" x2="'+(vert?0:1)+'" y2="0">'+stops.map(function(s,i){return '<stop offset="'+(i/(stops.length-1))+'" stop-color="'+s+'"/>'}).join('')+'</linearGradient>'}
function wspark(x,y,r,c){return '<g opacity=".95">'+star4(x,y,r,c||'#fff')+'</g>'}
function wtassel(x,y,c){return '<path d="M'+x+' '+y+'v6" stroke="'+GOLDD+'" stroke-width="1.5"/><circle cx="'+x+'" cy="'+(y+7)+'" r="2.4" fill="'+GOLD+'"/><path d="M'+(x-3)+' '+(y+9)+'q-2 12 1 18M'+x+' '+(y+9)+'v19M'+(x+3)+' '+(y+9)+'q2 12-1 18" stroke="'+c+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>'}
function wpole(x,y1,y2,w){return '<rect x="'+(x-w/2)+'" y="'+y1+'" width="'+w+'" height="'+(y2-y1)+'" rx="'+(w/2)+'" fill="'+GOLD+'" stroke="'+GOLDD+'" stroke-width="1"/>'+[0.25,.5,.75].map(function(f){var y=y1+(y2-y1)*f;return '<rect x="'+(x-w/2-1.5)+'" y="'+y+'" width="'+(w+3)+'" height="4" rx="2" fill="'+GOLDD+'"/>'}).join('')}
var WEAP2={
 /* ---------------- sword class ---------------- */
 sw_aurora:{n:m('ง้าวแสงออโรรา','Aurora Glaive','极光偃月刀'),r:'mythic',a:'#bff4ff',b:'#ff9ad8',d:function(a,b,u){return '<defs>'+wgrad(u+'g1',['#7ff0ff','#bfa8ff','#ff9ad8','#fff6a0'],1)+'</defs>'+gl(u+'gf',4)+
   wpole(136,104,222,5)+'<path d="M134 108c-14-22-12-48 6-66c-2 18 10 30 12 44c2 12-4 20-14 24z" fill="url(#'+u+'g1)" opacity=".6" filter="url(#'+u+'gf)"/>'+
   '<path d="M134 108c-14-22-12-48 6-66c-2 18 10 30 12 44c2 12-4 20-14 24z" fill="url(#'+u+'g1)" stroke="#fff" stroke-width="1.2"/><path d="M138 52q-6 26 0 50M142 64q-2 18 2 36" stroke="#fff" stroke-width="1" opacity=".8" fill="none"/>'+
   '<path d="M130 104h12l-2 8h-8z" fill="'+GOLD+'" stroke="'+GOLDD+'"/>'+wtassel(132,112,'#ff7ad8')+wspark(124,60,4)+wspark(150,80,3)}},
 sw_feather:{n:m('ดาบใหญ่ขนนกรุ้ง','Rainbow Feather Greatsword','虹羽巨剑'),r:'legendary',a:'#e8f6ff',b:'#ffb0e8',d:function(a,b,u){return swordWrap('<defs>'+wgrad(u+'f1',['#fff','#bff0ff','#ffc8f0'],1)+'</defs>'+gl(u+'ff',3)+
   '<path d="M128 166c-6-30-6-60 2-84c10 10 22 26 24 46c2 18-4 30-12 38z" fill="'+b+'" opacity=".5" filter="url(#'+u+'ff)"/><path d="M128 166c-6-30-6-60 2-84c10 10 22 26 24 46c2 18-4 30-12 38z" fill="url(#'+u+'f1)" stroke="#8ab0d8" stroke-width="1.2"/>'+
   [100,114,128,142,154].map(function(y,i){return '<path d="M'+(132+i)+' '+y+'q10 2 16 '+(8-i)+'" stroke="'+b+'" stroke-width="1.5" fill="none" opacity=".8"/>'}).join('')+
   '<path d="M120 166h34l-4 7h-26z" fill="'+GOLD+'" stroke="'+GOLDD+'"/><circle cx="137" cy="169" r="3" fill="'+b+'" stroke="#fff"/><rect x="133" y="173" width="8" height="16" rx="3" fill="#6a3a8a"/><path d="M133 177l8 3M133 183l8 3" stroke="'+GOLD+'"/><circle cx="137" cy="192" r="3.5" fill="'+GOLD+'"/>')}},
 sw_twin:{n:m('มีดคู่วิญญาณ','Twin Spirit Daggers','双灵短刃'),r:'epic',a:'#c8ffe8',b:'#ffd0f0',d:function(a,b,u){var k=function(rot,c1,c2){return '<g transform="rotate('+rot+' 136 178)"><defs>'+wgrad(u+'t'+rot,[c1,c2],1)+'</defs><path d="M136 118q9 18 5 44l-5 8-5-8q-4-26 5-44z" fill="url(#'+u+'t'+rot+')" stroke="#fff" stroke-width="1"/><path d="M136 126v38" stroke="#fff" stroke-width=".9" opacity=".8"/><rect x="132" y="170" width="8" height="5" rx="2" fill="'+GOLD+'"/><rect x="133.5" y="175" width="5" height="12" rx="2" fill="#5a3a2a"/>'+wtassel(136,187,'#9af0d0')+'</g>'};
   return gl(u+'tg',3)+'<g filter="url(#'+u+'tg)" opacity=".5"><path d="M128 120q9 18 5 44M146 120q9 18 5 44" stroke="'+b+'" stroke-width="8"/></g>'+k(-14,'#9af0d0','#fff6a0')+k(14,'#ffb0e8','#bfe8ff')+wspark(122,116,3)+wspark(152,112,3)}},
 sw_chain:{n:m('ดาบโซ่สายฟ้าแพรวพราว','Prism Chain Blade','棱彩链刃'),r:'mythic',a:'#ff7ad8',b:'#7ff0ff',d:function(a,b,u){var seg='',pts=[[136,178],[150,160],[160,138],[154,116],[140,100],[128,82],[134,62]];
   for(var i=1;i<pts.length;i++){var p=pts[i],q=pts[i-1];seg+='<path d="M'+q[0]+' '+q[1]+'L'+p[0]+' '+p[1]+'" stroke="#d8dcec" stroke-width="2" stroke-dasharray="3 2"/>';if(i>1)seg+='<path d="M'+p[0]+' '+(p[1]-6)+'l5 6-5 6-5-6z" fill="'+(i%2?a:b)+'" stroke="#fff" stroke-width=".8"/>'}
   return gl(u+'cg',3.5)+'<g filter="url(#'+u+'cg)" opacity=".7"><path d="M136 178C170 150 150 110 130 80" stroke="'+a+'" stroke-width="6" fill="none"/><path d="M140 170C160 140 150 110 136 86" stroke="'+b+'" stroke-width="4" fill="none"/></g>'+seg+
   '<path d="M134 62q-4-16 8-26q-2 14 4 20z" fill="'+a+'" stroke="#fff" stroke-width="1"/><rect x="132" y="176" width="8" height="16" rx="3" fill="#3a3346"/><path d="M136 192q-6 10 0 18" stroke="#c82a3a" stroke-width="3" fill="none"/>'+wspark(162,124,3.5)+wspark(124,96,3)+wspark(146,70,2.5,'#fff6a0')}},
 sw_lotus:{n:m('ทวนดอกบัวแก้ว','Crystal Lotus Spear','琉璃莲花枪'),r:'rare',a:'#ffc8e8',b:'#ff6ab8',d:function(a,b,u){var pet=function(r){return '<path d="M136 96q-6-10 0-18q6 8 0 18z" fill="'+a+'" stroke="'+b+'" stroke-width=".8" transform="rotate('+r+' 136 96)"/>'};
   return gl(u+'lg',3)+wpole(136,96,222,4.5)+pet(-50)+pet(-25)+pet(0)+pet(25)+pet(50)+'<path d="M136 46l7 26-7 18-7-18z" fill="'+b+'" opacity=".6" filter="url(#'+u+'lg)"/><path d="M136 46l6 26-6 18-6-18z" fill="#ffe8f6" stroke="'+b+'" stroke-width="1.2"/><path d="M136 52v34" stroke="#fff" stroke-width="1"/>'+wtassel(136,100,b)+wspark(146,52,3)}},
 sw_moonblade:{n:m('ดาบจันทร์เสี้ยวสีน้ำเงิน','Blue Crescent Saber','蓝月弯刀'),r:'uncommon',a:'#7ab8ff',b:'#e8f6ff',d:function(a,b,u){return swordWrap('<path d="M132 168q-14-40 8-84q-6 44 8 82z" fill="'+a+'" stroke="#2a4a8a" stroke-width="1.2"/><path d="M136 100q-6 30 4 64" stroke="'+b+'" stroke-width="1.6" fill="none"/>'+
   '<path d="M124 166h24l-3 6h-18z" fill="#c8ccd8" stroke="#5a6070"/><rect x="132" y="172" width="8" height="16" rx="3" fill="#2a3a5a"/><circle cx="136" cy="190" r="3" fill="'+a+'"/>')}},
 /* ---------------- mage class ---------------- */
 st_prism:{n:m('คทาคริสตัลชมพู','Pink Prism Wand','粉晶魔杖'),r:'rare',a:'#ff6ab8',b:'#ffd0f0',d:function(a,b,u){return gl(u+'pg',3.5)+'<rect x="132" y="120" width="8" height="96" rx="4" fill="#c8506a" stroke="#7a2a3a"/><path d="M132 200h8M132 206h8" stroke="#7a2a3a"/>'+
   '<g filter="url(#'+u+'pg)" opacity=".75"><path d="M136 62l12 30-12 30-12-30z" fill="'+a+'"/></g><path d="M136 66l10 28-10 28-10-28z" fill="'+a+'" stroke="#fff" stroke-width="1.2"/><path d="M136 66v56M126 94h20" stroke="#fff" stroke-width=".9" opacity=".8"/>'+
   wspark(136,58,6)+wspark(120,76,3)+wspark(152,84,3.5)+wspark(126,52,2.5,b)}},
 st_sun:{n:m('คทาสุริยเทพ','Sun God Scepter','太阳神权杖'),r:'legendary',a:'#ffb43a',b:'#fff6a0',d:function(a,b,u){var rays='';for(var i=0;i<12;i++){rays+='<path d="M136 80l3-'+(i%2?14:20)+'h-6z" fill="'+GOLD+'" stroke="'+GOLDD+'" stroke-width=".8" transform="rotate('+(i*30)+' 136 80)"/>'}
   return gl(u+'sg',4)+'<path d="M136 96q8 20-4 40t4 40q8 20 0 40" stroke="'+b+'" stroke-width="4" fill="none" opacity=".7" filter="url(#'+u+'sg)"/>'+wpole(136,94,220,5)+'<circle cx="136" cy="80" r="22" fill="'+b+'" opacity=".55" filter="url(#'+u+'sg)"/>'+rays+'<circle cx="136" cy="80" r="10" fill="'+a+'" stroke="#fff" stroke-width="2"/><circle cx="133" cy="77" r="3" fill="#fff" opacity=".8"/>'}},
 st_frost:{n:m('คทาลูกแก้วหิมะ','Frost Orb Staff','霜晶法杖'),r:'epic',a:'#9ae8ff',b:'#ffffff',d:function(a,b,u){return gl(u+'og',4)+'<rect x="133" y="96" width="6" height="122" rx="3" fill="#5a8ab8" stroke="#2a4a7a"/><path d="M133 110l6 6M133 124l6 6M133 138l6 6M133 152l6 6M133 166l6 6" stroke="#bfe8ff" stroke-width="1.5"/>'+
   '<path d="M126 98q10-10 20 0l-4 6h-12z" fill="#c8e8ff" stroke="#2a4a7a"/><circle cx="136" cy="80" r="20" fill="'+a+'" opacity=".55" filter="url(#'+u+'og)"/><circle cx="136" cy="80" r="14" fill="'+a+'" stroke="#fff" stroke-width="2"/><circle cx="131" cy="75" r="4" fill="#fff" opacity=".85"/>'+
   '<path d="M136 214l5 8-5 8-5-8z" fill="#bfe8ff" stroke="#2a4a7a"/>'+wspark(118,66,3.5)+wspark(156,70,4)+wspark(150,98,2.5)+wspark(122,96,2.5)}},
 st_trident:{n:m('ตรีศูลแสงทอง','Golden Light Trident','金光三叉戟'),r:'mythic',a:'#ffd35a',b:'#fff6c0',d:function(a,b,u){return gl(u+'rg',4)+wpole(136,100,222,5)+'<g filter="url(#'+u+'rg)" opacity=".7"><path d="M136 36v66M120 52q0 34 16 46q16-12 16-46" stroke="'+b+'" stroke-width="7" fill="none"/></g>'+
   '<path d="M120 52q0 34 16 46q16-12 16-46" stroke="'+GOLD+'" stroke-width="4" fill="none"/><path d="M120 44l4 12h-8zM152 44l4 12h-8z" fill="'+GOLD+'" stroke="'+GOLDD+'"/><path d="M136 30l6 20h-12z" fill="'+GOLD+'" stroke="'+GOLDD+'"/><path d="M136 50v52" stroke="'+GOLD+'" stroke-width="4"/>'+
   '<path d="M136 66l6 10-6 10-6-10z" fill="#fff6a0" stroke="#fff"/>'+wspark(136,40,6)+wspark(112,60,3)+wspark(160,58,3)}},
 st_vine:{n:m('คทาเถาวัลย์ราตรี','Night Vine Staff','夜藤法杖'),r:'uncommon',a:'#b07aff',b:'#ffb0ff',d:function(a,b,u){return gl(u+'vg',4)+'<path d="M136 220q-10-20 0-40t0-40q-10-20 0-40t-4-30" stroke="#7a4a2a" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M136 220q-10-20 0-40t0-40q-10-20 0-40" stroke="#a86a3a" stroke-width="3" fill="none" stroke-dasharray="8 10"/>'+
   '<path d="M128 72q-14-6-8-20q10 4 8 20zM142 70q14-8 10-22q-12 4-10 22z" fill="#5a8a3a"/><circle cx="134" cy="66" r="16" fill="'+a+'" opacity=".6" filter="url(#'+u+'vg)"/><circle cx="134" cy="66" r="9" fill="'+a+'" stroke="'+b+'" stroke-width="2"/>'+wspark(122,52,3,b)+wspark(150,60,3.5,b)+wspark(140,44,2.5)}},
 st_fan:{n:m('พัดเทพจันทรา','Moon Goddess Fan','月神宝扇'),r:'epic',a:'#ffb0e0',b:'#ff6ab8',d:function(a,b,u){var ribs='';for(var i=0;i<11;i++){var r=-60+i*12;ribs+='<path d="M136 168L136 112" stroke="#fff" stroke-width="1" opacity=".8" transform="rotate('+r+' 136 168)"/>'}
   return '<defs><radialGradient id="'+u+'fn" cx="50%" cy="100%" r="100%"><stop offset=".3" stop-color="#fff"/><stop offset=".7" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></radialGradient></defs>'+
   '<path d="M136 168L87.5 140A56 56 0 0 1 184.5 140z" fill="url(#'+u+'fn)" stroke="'+b+'" stroke-width="1.5"/>'+ribs+'<path d="M87.5 140A56 56 0 0 1 184.5 140" fill="none" stroke="'+GOLD+'" stroke-width="3"/><circle cx="136" cy="168" r="4" fill="'+GOLD+'" stroke="'+GOLDD+'"/>'+
   '<rect x="133" y="168" width="6" height="22" rx="3" fill="#7a3a5a"/>'+wtassel(136,190,b)+'<path d="M120 132q16-10 32 0" stroke="'+b+'" stroke-width="1.5" fill="none"/>'+wspark(110,120,3)+wspark(164,118,3)}},
 /* ---------------- archer class (ranged) ---------------- */
 bw_nova:{n:m('ปืนแสงโนวา','Nova Light Blaster','新星光炮'),r:'rare',a:'#7ad8ff',b:'#fff36a',d:function(a,b,u){return gl(u+'ng',3)+'<g transform="rotate(-8 140 170)"><path d="M118 160q0-12 14-12h34q12 0 14 10v10q-2 8-14 8h-34q-14 0-14-12z" fill="#f4f6ff" stroke="#3a5a8a" stroke-width="1.5"/>'+
   '<rect x="176" y="156" width="14" height="10" rx="5" fill="'+a+'" stroke="#3a5a8a"/><circle cx="194" cy="161" r="7" fill="'+b+'" opacity=".7" filter="url(#'+u+'ng)"/><circle cx="194" cy="161" r="3" fill="#fff"/>'+
   '<circle cx="146" cy="162" r="7" fill="'+a+'" stroke="#fff" stroke-width="2"/><path d="M128 176l-4 18h10l4-16z" fill="#3a5a8a"/><path d="M124 154h20" stroke="'+a+'" stroke-width="3" stroke-linecap="round"/></g>'+wspark(204,150,3)}},
 bw_rail:{n:m('ปืนรางแสงดาว','Starlight Rail Cannon','星光轨道炮'),r:'mythic',a:'#5ae8ff',b:'#d08aff',d:function(a,b,u){return gl(u+'rg2',3)+'<g transform="rotate(-6 140 170)"><path d="M112 168h20l6-14h56v6h-50l-4 6h54v6h-58z" fill="#2a2e4a" stroke="#8a94b8" stroke-width="1"/>'+
   '<g filter="url(#'+u+'rg2)"><path d="M140 163h60" stroke="'+a+'" stroke-width="5"/></g><path d="M140 163h60" stroke="#fff" stroke-width="1.5"/><path d="M150 163h4M164 163h4M178 163h4" stroke="'+b+'" stroke-width="5"/>'+
   '<path d="M118 174l-6 20h11l6-18z" fill="#2a2e4a"/><rect x="146" y="148" width="18" height="6" rx="2" fill="'+b+'"/><circle cx="208" cy="163" r="6" fill="'+a+'" opacity=".8" filter="url(#'+u+'rg2)"/></g>'+wspark(212,150,3.5)+wspark(198,176,2.5,b)}},
 bw_bubble:{n:m('ปืนฟองดาว','Star Bubble Blaster','星泡泡枪'),r:'common',a:'#7af0c0',b:'#ffb0e8',d:function(a,b,u){return '<g transform="rotate(-10 140 170)"><path d="M122 156h34q10 0 10 8t-10 8h-34z" fill="'+a+'" stroke="#2a7a5a" stroke-width="1.5"/><circle cx="132" cy="164" r="10" fill="'+b+'" stroke="#fff" stroke-width="2"/>'+star4(132,164,4,'#fff')+
   '<rect x="164" y="160" width="10" height="8" rx="3" fill="#2a7a5a"/><path d="M126 172l-4 16h9l4-14z" fill="#2a7a5a"/></g>'+[[184,150,6],[196,140,4],[192,160,3]].map(function(c){return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="#e8fdff" fill-opacity=".5" stroke="#9ae8ff"/>'}).join('')}},
 bw_plasma:{n:m('ปืนพลาสมาคริสตัล','Crystal Plasma Rifle','水晶等离子步枪'),r:'legendary',a:'#ff5ad8',b:'#7ff0ff',d:function(a,b,u){return gl(u+'pl',3)+'<g transform="rotate(-6 140 170)"><path d="M110 166l8-10h50l10 4h18v8h-18l-10 6h-50z" fill="#f0f2ff" stroke="#5a3a8a" stroke-width="1.5"/><path d="M118 156l8-8h28l6 8" fill="#d8dcf8" stroke="#5a3a8a" stroke-width="1"/>'+
   '<g filter="url(#'+u+'pl)" opacity=".8"><path d="M140 158l8 6-8 6-8-6z" fill="'+a+'"/></g><path d="M140 158l7 6-7 6-7-6z" fill="'+a+'" stroke="#fff"/><path d="M180 164h16" stroke="'+b+'" stroke-width="3"/><circle cx="198" cy="164" r="5" fill="'+b+'" opacity=".8" filter="url(#'+u+'pl)"/>'+
   '<path d="M122 172l-6 20h11l5-16z" fill="#5a3a8a"/><path d="M160 152h10" stroke="'+b+'" stroke-width="2"/></g>'+wspark(204,152,3)}},
 bw_rainbow:{n:m('ธนูปีกรุ้ง','Rainbow Wing Bow','虹翼弓'),r:'epic',a:'#ffd35a',b:'#ff9ad8',d:function(a,b,u){var fw=function(y,sy){return '<g transform="translate(0 '+y+') scale(1 '+sy+')"><path d="M150 0q10-14 26-12q-8 6-8 8q10 0 14 6q-12 2-16 6q4 4 2 10q-10-6-18-18z" fill="url(#'+u+'rw)" stroke="#fff" stroke-width=".8"/></g>'};
   return '<defs>'+wgrad(u+'rw',['#ff9ad8','#fff36a','#7af0c0','#7ab8ff'])+'</defs>'+'<path d="M140 104q34 56 0 112" fill="none" stroke="'+GOLD+'" stroke-width="5" stroke-linecap="round"/><path d="M140 104v112" stroke="url(#'+u+'rw)" stroke-width="2"/>'+fw(108,1)+fw(212,-1)+'<circle cx="157" cy="160" r="5" fill="'+b+'" stroke="#fff" stroke-width="1.5"/>'+wspark(170,96,3)+wspark(172,222,3)}},
 bw_crossbow:{n:m('หน้าไม้คริสตัลน้ำแข็ง','Ice Crystal Crossbow','冰晶弩'),r:'uncommon',a:'#9ae8ff',b:'#ffffff',d:function(a,b,u){return '<g transform="rotate(-8 140 168)"><path d="M118 164h64" stroke="#6a4a2a" stroke-width="7" stroke-linecap="round"/><path d="M168 140q-8 24 0 48" stroke="'+a+'" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M168 140l-30 24 30 24" stroke="#e8eef8" stroke-width="1.2" fill="none"/>'+
   '<path d="M140 164h50" stroke="#c8ccd8" stroke-width="2"/><path d="M190 164l-6-4v8z" fill="'+a+'" stroke="#2a4a7a"/><path d="M124 168l-5 18h10l4-16z" fill="#6a4a2a"/><path d="M168 136l4-6 2 8zM168 192l4 6 2-8z" fill="'+a+'"/></g>'}}
};

/* ---------------- celestial season weapons: moving light ---------------- */
function wan(){return !(typeof S!=='undefined'&&S.set&&S.set.motion===false)}
function wrays(u,x,y,n,len,col,dur){var r='';for(var i=0;i<n;i++)r+='<path d="M0 0L'+f1(Math.cos(i*2*Math.PI/n)*len)+' '+f1(Math.sin(i*2*Math.PI/n)*len)+'L'+f1(Math.cos(i*2*Math.PI/n+.12)*len)+' '+f1(Math.sin(i*2*Math.PI/n+.12)*len)+'z" fill="'+col+'" opacity="'+(i%2?.35:.6)+'"/>';
  return '<g transform="translate('+x+' '+y+')"><g>'+r+anR(wan(),'0;360',dur)+'</g></g>'}
function wpulse(cx,cy,r,col,dur,op){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+col+'" opacity="'+(op||.5)+'">'+anA(wan(),'r',(r*.8)+';'+(r*1.25)+';'+(r*.8),dur)+anA(wan(),'opacity',(op||.5)*.5+';'+(op||.5)+';'+(op||.5)*.5,dur)+'</circle>'}
function wmotes(x,y,w,h,n,col,seed){var o='';for(var i=0;i<n;i++){var sx=x+aseed(i,seed)*w,sy=y+aseed(i,seed+1)*h,d=1.6+aseed(i,seed+2)*1.8,b=f1(aseed(i,seed+3)*d);
  o+='<g transform="translate('+f1(sx)+' '+f1(sy)+')"><g opacity="0">'+star4(0,0,2+aseed(i,seed+4)*2.5,col)+anT(wan(),'0 0;'+f1((aseed(i,seed+5)-.5)*14)+' -26',d,b)+anA(wan(),'opacity','0;1;0',d,b)+'</g></g>'}return o}
var WEAP2_CEL={
 sw_heavenmoon:{n:m('ดาบสวรรค์จันทราประกาย','Celestial Moonshine Blade','天界月辉剑'),r:'celestial',a:'#bff4ff',b:'#ffb0f0',season:true,d:function(a,b,u){
   var blade='M130 168C112 136 110 92 128 58C134 48 146 40 158 38C146 54 146 74 152 92C158 112 156 140 144 168z';
   return '<defs>'+wgrad(u+'c1',['#7ff0ff','#c8b0ff','#ffb0f0','#fff6c0'],1)+'<linearGradient id="'+u+'c2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/><animate attributeName="y1" values="1.6;-0.6" dur="2.2s" repeatCount="indefinite"/><animate attributeName="y2" values="0.6;-1.6" dur="2.2s" repeatCount="indefinite"/></linearGradient>'+
    '<clipPath id="'+u+'cc"><path d="'+blade+'"/></clipPath></defs>'+gl(u+'cg',5)+gl(u+'cs',2.5)+
    wrays(u,140,104,14,62,'#fff6c0',16)+'<g filter="url(#'+u+'cg)">'+wpulse(140,106,30,b,2.4,.55)+'<path d="'+blade+'" fill="'+a+'" opacity=".8"/></g>'+
    '<path d="'+blade+'" fill="url(#'+u+'c1)" stroke="#ffffff" stroke-width="1.5"/>'+[70,86,102,118,134,150].map(function(y,i){return '<path d="M'+(132+i*.6)+' '+y+'q10-4 16 '+(4-i*.6)+'" stroke="#fff" stroke-width="1.4" fill="none" opacity=".75"/>'}).join('')+
    '<rect x="100" y="30" width="80" height="150" fill="url(#'+u+'c2)" clip-path="url(#'+u+'cc)" opacity=".85"/>'+
    '<path d="M118 168q20-10 40 0q-6 8-20 8t-20-8z" fill="'+GOLD+'" stroke="'+GOLDD+'" stroke-width="1.2"/><path d="M126 170q12-8 24 0" stroke="#fff6c0" stroke-width="1.2" fill="none"/>'+
    '<g filter="url(#'+u+'cs)">'+wpulse(138,171,5,'#7ff0ff',1.6,.9)+'</g><circle cx="138" cy="171" r="3.2" fill="#ffffff"/>'+
    '<rect x="134" y="176" width="8" height="18" rx="3" fill="#6a3a8a"/><path d="M134 180l8 3M134 186l8 3" stroke="'+GOLD+'" stroke-width="1.2"/><path d="M138 194q-4 8 0 14l4-4" stroke="#ff7ad8" stroke-width="2.4" fill="none"/>'+wpulse(140,198,4,'#ff7ad8',2,.8)+
    wmotes(110,40,60,130,12,'#ffffff',31)}},
 st_heavenphoenix:{n:m('คทาวิหคสวรรค์','Celestial Phoenix Staff','天界凤凰杖'),r:'celestial',a:'#ffd35a',b:'#ff7ad8',season:true,d:function(a,b,u){
   var wing=function(s){return '<g transform="translate(136 70) scale('+s+' 1)"><g>'+[0,1,2,3,4].map(function(i){var L=46-i*5;return '<path d="M4 6C'+(L*.3)+' -4 '+(L*.7)+' -6 '+L+' -'+(10+i*5)+'C'+(L*.7)+' 0 '+(L*.3)+' 6 4 10z" fill="url(#'+u+'p1)" stroke="#fff" stroke-width=".7" transform="rotate('+(-10+i*-12)+' 4 8)"/>'}).join('')+anR(wan(),'0 4 8;-8 4 8;0 4 8',2.8)+'</g></g>'};
   return '<defs>'+wgrad(u+'p1',['#ffffff','#ffd8f8','#ff9ad8','#ffd35a'])+'<radialGradient id="'+u+'po" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#ffb0f0"/><stop offset="1" stop-color="#a85aff"/></radialGradient></defs>'+gl(u+'pg',5)+gl(u+'ps',2)+
    '<g filter="url(#'+u+'pg)" opacity=".8"><path d="M136 100q10 30-4 60t4 60" stroke="'+b+'" stroke-width="5" fill="none"><animate attributeName="stroke-dashoffset" values="0;-80" dur="2s" repeatCount="indefinite"/></path></g>'+
    wpole(136,98,224,5.5)+wrays(u,136,62,16,58,'#fff6c0',20)+wing(1)+wing(-1)+
    '<g filter="url(#'+u+'pg)">'+wpulse(136,62,22,b,2.2,.6)+'</g>'+
    '<g transform="translate(136 62)"><g><ellipse rx="22" ry="6" fill="none" stroke="#fff6c0" stroke-width="1.6"/>'+anR(wan(),'0;360',4)+'</g><g><ellipse rx="6" ry="22" fill="none" stroke="#ffb0f0" stroke-width="1.4"/>'+anR(wan(),'360;0',5)+'</g></g>'+
    '<circle cx="136" cy="62" r="11" fill="url(#'+u+'po)" stroke="#fff" stroke-width="1.8"/><circle cx="132" cy="58" r="3.5" fill="#fff" opacity=".9"/>'+
    '<path d="M124 96q12-14 24 0l-4 6h-16z" fill="'+GOLD+'" stroke="'+GOLDD+'"/><path d="M136 222l6 8-6 10-6-10z" fill="#ffb0f0" stroke="#fff"/>'+wtassel(128,100,'#ff7ad8')+
    wmotes(100,20,72,180,14,'#fff6c0',47)}},
 bw_heavenstar:{n:m('ธนูดาราจันทร์สวรรค์','Celestial Starmoon Bow','天界星月弓'),r:'celestial',a:'#bff4ff',b:'#7ff0ff',season:true,d:function(a,b,u){
   var bow='M140 100C186 128 186 196 140 224';
   return '<g transform="translate(140 170) scale(.86) translate(-140 -170)">'+'<defs>'+wgrad(u+'b1',['#ffffff','#bff4ff','#8ab0ff','#d8a8ff'],1)+'</defs>'+gl(u+'bg',4)+gl(u+'bs',2)+
    '<g filter="url(#'+u+'bg)" opacity=".8"><path d="'+bow+'" stroke="'+b+'" stroke-width="10" fill="none">'+anA(wan(),'opacity','.4;.9;.4',2)+'</path></g>'+
    '<path d="'+bow+'" stroke="url(#'+u+'b1)" stroke-width="6" fill="none" stroke-linecap="round"/><path d="'+bow+'" stroke="#fff" stroke-width="1.4" fill="none" stroke-dasharray="4 8"><animate attributeName="stroke-dashoffset" values="0;-48" dur="1.6s" repeatCount="indefinite"/></path>'+
    '<g filter="url(#'+u+'bs)"><path d="M140 100V224" stroke="'+b+'" stroke-width="2.5">'+anA(wan(),'stroke-width','1.5;3.5;1.5',1.2)+'</path></g><path d="M140 100V224" stroke="#fff" stroke-width="1"/>'+
    '<g><path d="M114 162H196" stroke="#fff" stroke-width="2.4"/><path d="M196 162l-10-6v12z" fill="#ffffff"/><path d="M118 162l-6-5M118 162l-6 5" stroke="#bff4ff" stroke-width="2"/>'+anT(wan(),'0 0;3 0;0 0',1.4)+'</g>'+
    '<g filter="url(#'+u+'bg)">'+wpulse(198,162,9,b,1.4,.8)+'</g>'+
    '<path d="M168 162a14 14 0 1 1-10-13a10 10 0 1 0 10 13z" fill="#fff6c0" stroke="'+GOLD+'" stroke-width="1.2"/>'+
    '<g transform="translate(140 100)">'+star4(0,0,7,'#ffffff')+'<g>'+star4(0,0,11,'#bff4ff').replace('<path','<path opacity=".6"')+anR(wan(),'0;360',6)+'</g></g><g transform="translate(140 224)">'+star4(0,0,7,'#ffffff')+'</g>'+
    wrays(u,168,162,12,46,'#e8fdff',18)+wmotes(140,96,56,130,12,'#ffffff',63)+'</g>'}}
,
 bw_heavenblaster:{n:m('ปืนแสงสวรรค์นภารัตน์','Celestial Skyjewel Blaster','天界星辉光炮'),r:'celestial',a:'#ffffff',b:'#7ff0ff',season:true,d:function(a,b,u){
   var body='M112 170l6-12h20l8-8h34l12 6h14v10h-14l-12 6h-34l-8-4h-20z';
   return '<defs>'+wgrad(u+'g1',['#ffffff','#e8ecff','#c8d0f8'],1)+wgrad(u+'g2',['#ffd35a','#fff6c0','#ffd35a'])+'<linearGradient id="'+u+'g3" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+b+'" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="'+b+'" stop-opacity="0"/><animate attributeName="x1" values="-1;1" dur="1.6s" repeatCount="indefinite"/><animate attributeName="x2" values="0;2" dur="1.6s" repeatCount="indefinite"/></linearGradient></defs>'+gl(u+'gg',4.5)+gl(u+'gs',2)+
    '<g transform="translate(132 172) scale(.74) translate(-132 -172)"><g transform="rotate(-8 150 166)">'+
    /* wings of light behind the barrel */
    '<g opacity=".9">'+[0,1,2].map(function(i){return '<path d="M150 154C140 '+(136-i*8)+' 124 '+(128-i*10)+' '+(108-i*4)+' '+(126-i*12)+'C122 '+(140-i*6)+' 132 150 146 158z" fill="'+(i%2?'#ffd8f8':'#bff4ff')+'" stroke="#fff" stroke-width=".7" opacity="'+(.95-i*.2)+'"/>'}).join('')+'</g>'+
    '<g filter="url(#'+u+'gg)" opacity=".75"><path d="'+body+'" fill="'+b+'">'+anA(wan(),'opacity','.4;.9;.4',1.8)+'</path></g>'+
    '<path d="'+body+'" fill="url(#'+u+'g1)" stroke="#5a6ab8" stroke-width="1.4"/><path d="M146 150h34l12 6" stroke="url(#'+u+'g2)" stroke-width="3" fill="none"/><path d="M118 158h20" stroke="url(#'+u+'g2)" stroke-width="2.5"/>'+
    '<path d="M150 164h56" stroke="url(#'+u+'g3)" stroke-width="3"/>'+
    /* spinning crystal core */
    '<g transform="translate(162 163)"><g filter="url(#'+u+'gs)">'+wpulse(0,0,9,b,1.4,.9)+'</g><g><path d="M0-8l6 8-6 8-6-8z" fill="#bff4ff" stroke="#fff" stroke-width="1"/>'+anR(wan(),'0;360',3)+'</g><g><ellipse rx="13" ry="4" fill="none" stroke="#ffd35a" stroke-width="1.4"/>'+anR(wan(),'0;360',2.2)+'</g></g>'+
    /* muzzle charge and beam */
    '<g filter="url(#'+u+'gg)">'+wpulse(212,161,10,b,1.2,.9)+'</g><circle cx="212" cy="161" r="4" fill="#ffffff">'+anA(wan(),'r','3;5.5;3',1.2)+'</circle>'+
    '<path d="M216 161h26" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0">'+anA(wan(),'opacity','0;0;1;0',1.2)+'</path>'+
    '<path d="M120 172l-6 22h12l6-18z" fill="#5a6ab8"/><path d="M118 186h10" stroke="#ffd35a" stroke-width="1.5"/>'+
    '</g>'+wrays(u,212,159,12,30,'#e8fdff',14)+'</g>'+wmotes(110,120,80,60,10,'#ffffff',77)}}
};
/* moving parts use plain SVG pivots (see .wfx in base.css) */
Object.keys(WEAP2_CEL).forEach(function(k){var w=WEAP2_CEL[k],f=w.d;w.d=function(a,b,u){return '<g class="wfx">'+f(a,b,u)+'</g>'};WEAP2[k]=w});

/* ---------- into the game: drawings, item kinds, and the 22 items (season = summon only, never sold) ---------- */
var WEAP2_IDS={sw_aurora:'wn01',sw_feather:'wn02',sw_twin:'wn03',sw_chain:'wn04',sw_lotus:'wn05',sw_moonblade:'wn06',st_prism:'wn07',st_sun:'wn08',st_frost:'wn09',st_trident:'wn10',st_vine:'wn11',st_fan:'wn12',
  bw_nova:'wn13',bw_rail:'wn14',bw_bubble:'wn15',bw_plasma:'wn16',bw_rainbow:'wn17',bw_crossbow:'wn18',sw_heavenmoon:'ws01',st_heavenphoenix:'ws02',bw_heavenstar:'ws03',bw_heavenblaster:'ws04'};
/* guns lie sideways, so their icons use a wider frame */
var WEAP_VB={bw_nova:'104 128 112 62',bw_rail:'104 128 112 62',bw_bubble:'104 128 112 62',bw_plasma:'104 128 112 62',bw_crossbow:'104 128 112 62',bw_heavenblaster:'100 116 130 100',
  sw_heavenmoon:'84 24 120 210',st_heavenphoenix:'84 14 104 230',bw_heavenstar:'100 80 120 170',sw_aurora:'96 34 90 196',st_trident:'96 24 90 206',sw_chain:'100 30 90 190',st_fan:'80 90 112 120'};
Object.keys(WEAP2).forEach(function(k){var w=WEAP2[k];WEAP[k]=w.d;if(ACC_WEAPON.indexOf(k)<0)ACC_WEAPON.push(k);if(CAT.accessories.kinds.indexOf(k)<0)CAT.accessories.kinds.push(k);KIND_NAMES[k]=w.n;
  DEFAULTS.items.push({id:WEAP2_IDS[k],cat:'accessories',rar:w.r,names:w.n,g:null,v:{k:k,a:w.a,b:w.b},noShop:true})});
