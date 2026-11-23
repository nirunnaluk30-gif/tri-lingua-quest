/* =====================================================================
   TITLES — honour titles that float above the hero's head.
   Earned only by beating the bosses of zones 9–13. Everything is worked
   out from the signed play history (S.log), so it cannot be typed in.
   Titles go in order: each one needs the one before it.
   ===================================================================== */
/* titles are game content (admins add and edit them); TITLES = sorted list, TITLE = by id */
var TITLES=[],TITLE={};
function styleLv(T){return T?parseInt(String(T.style||'t1').slice(1),10)||1:0}
/* titles the teacher hands out (grant:true, e.g. top-up / promo titles) also work before the teacher has pressed
   "add new content": they are taken from the built-in defaults when the content database does not have them yet */
function rebuildTitles(){var have={};(CONTENT.titles||[]).forEach(function(x){have[x.id]=1});
  var extra=(typeof DEFAULTS!=='undefined'&&DEFAULTS.titles||[]).filter(function(x){return x.grant&&!have[x.id]});
  TITLES=(CONTENT.titles||[]).concat(extra).sort(byOrder);TITLE={};TITLES.forEach(function(x){x.lv=styleLv(x);TITLE[x.id]=x});if(TSTAT)TSTAT.n=-1}
/* counts from the signed history: wins, flawless wins and flawless days, per zone */
var TSTAT={n:-1,v:null};
function titleStats(st){st=st||S;if(st===S&&TSTAT.n===S.n&&TSTAT.v)return TSTAT.v;
  var w={},pf={},dz={};
  var rw=0,sp=0,vp=0;(st.log||[]).forEach(function(e){if(e&&e.k==='raidwin')rw++;if(e&&e.k==='sch')sp=Math.max(sp,e.lv|0);if(e&&e.k==='vip')vp=Math.max(vp,e.lv|0);if(!e||e.k!=='boss'||!e.win||typeof e.z!=='string')return;w[e.z]=(w[e.z]||0)+1;if((e.n|0)>0&&e.ok===e.n){pf[e.z]=(pf[e.z]||0)+1;(dz[e.z]=dz[e.z]||{})[e.d]=1}});
  var v={w:w,pf:pf,dz:dz,rw:rw,sp:sp,vp:vp};if(st===S){TSTAT.n=S.n;TSTAT.v=v}return v}
/* how far a rule is: list of [have, need] for each part that is set */
function ruleParts(r,s){var z=r.z.length?r.z:[],p=[],days={};
  if(r.ew)p.push(['ew',z.reduce(function(a,k){return a+Math.min(s.w[k]||0,r.ew)},0),r.ew*z.length]);
  if(r.ep)p.push(['ep',z.reduce(function(a,k){return a+Math.min(s.pf[k]||0,r.ep)},0),r.ep*z.length]);
  if(r.tp)p.push(['tp',Math.min(z.reduce(function(a,k){return a+(s.pf[k]||0)},0),r.tp),r.tp]);
  if(r.pz&&r.pn)p.push(['pn',Math.min(s.pf[r.pz]||0,r.pn),r.pn]);
  if(r.rw)p.push(['rw',Math.min(s.rw||0,r.rw),r.rw]);
  if(r.sp)p.push(['sp',Math.min(s.sp||0,r.sp),r.sp]);if(r.vp)p.push(['vp',Math.min(s.vp||0,r.vp),r.vp]);
  if(r.dy){z.forEach(function(k){Object.keys(s.dz[k]||{}).forEach(function(d){days[d]=1})});p.push(['dy',Math.min(Object.keys(days).length,r.dy),r.dy])}
  return p}
function ruleMet(T,s){if(T.grant)return false;var p=ruleParts(T.rule,s);return p.length>0&&p.every(function(x){return x[1]>=x[2]})}
/* which titles this hero holds: earned by play (in order) or given by a teacher; a teacher can also take one away */
function titleAdj(st){return isO(st.tta)?st.tta:{}}
function earnedTitles(st){st=st||S;var s=titleStats(st),adj=titleAdj(st),memo={};
  var has=function(id,depth){if(memo[id]!==undefined)return memo[id];var T=TITLE[id];if(!T||depth>40)return false;memo[id]=false;
    var ok=adj[id]===1||(adj[id]!==-1&&ruleMet(T,s)&&(!T.prev||has(T.prev,depth+1)));memo[id]=ok;return ok};
  return TITLES.filter(function(T){return has(T.id,0)}).map(function(T){return T.id})}
function titleLevel(st){return earnedTitles(st).length}
/* the title this hero shows: the one picked in "Me" (if held), else the highest held */
function shownTitle(st){st=st||S;var e=earnedTitles(st);if(!e.length)return '';var pick=st.set&&st.set.title;
  if(pick==='none')return '';if(pick&&e.indexOf(pick)>=0)return pick;return e[e.length-1]}
/* the rule in words */
var TT_TX={sp:m('ถึงระดับนักเรียนดีเด่น {n}','Reach Scholar level {n}','达到优秀学生等级 {n}'),vp:m('ถึงระดับ VIP {n}','Reach VIP level {n}','达到VIP等级 {n}'),rw:m('ร่วมปราบบอสเมืองโกลาหลสำเร็จ {n} ครั้ง','Help beat the Chaos City boss {n} time(s)','协助击败混沌之城首领 {n} 次'),ew1:m('ชนะบอส{z}','Beat the boss of {z}','击败{z}的首领'),ewN:m('ชนะบอส{z} เมืองละ {n} ครั้ง','Beat the boss of {z}, {n} times each','击败{z}的首领,每城{n}次'),
  ep:m('ชนะแบบไม่ตอบผิดเลย {z} เมืองละ {n} ครั้ง','Flawless wins (no wrong answers) in {z}, {n} each','在{z}零失误获胜,每城{n}次'),tp:m('ไม่ผิดเลยรวม {n} ครั้ง','{n} flawless wins in total','共{n}次零失误'),
  pn:m('ไม่ผิดเลยที่{z} {n} ครั้งขึ้นไป','{n}+ flawless wins in {z}','在{z}零失误{n}次以上'),dy:m('ใน {n} วันขึ้นไป','on {n} or more different days','跨{n}天以上'),
  grant:m('ครูมอบให้เท่านั้น','Given by a teacher only','仅由老师授予'),prev:m('ต้องมีฉายา “{t}” ก่อน','Needs “{t}” first','需先获得“{t}”'),all5:m('ครบ {n} เมือง','all {n} cities','全部{n}城')};
function zName(id){var z=ZONES.filter(function(x){return x.id===id})[0];return z?tx(z.names):id}
function ruleText(T){if(T.grant)return tx(TT_TX.grant);var r=T.rule,zs=r.z.length===1?zName(r.z[0]):tx(TT_TX.all5).replace('{n}',r.z.length),out=[];
  var f=function(k,n,z){return tx(TT_TX[k]).replace('{n}',n).replace('{z}',z||zs)};
  if(r.ew)out.push(r.z.length===1&&r.ew===1?f('ew1',1):r.z.length===1?f('ewN',r.ew):f('ewN',r.ew));
  if(r.sp)out.push(tx(TT_TX.sp).replace('{n}',r.sp));if(r.vp)out.push(tx(TT_TX.vp).replace('{n}',r.vp));
  if(r.rw)out.push(tx(TT_TX.rw).replace('{n}',r.rw));if(r.ep)out.push(f('ep',r.ep));if(r.tp)out.push(f('tp',r.tp));if(r.pz&&r.pn)out.push(f('pn',r.pn,zName(r.pz)));if(r.dy)out.push(f('dy',r.dy));
  return out.join(' · ')}
/* ---------- the floating plate ----------
   Drawn in local units: plate 224×32 centred on (0,0), emblem on the left,
   theme art inside and at the right end. Scaled into place by the caller. */
function tg(id,stops,x2,y2){return '<linearGradient id="'+id+'" x1="0" y1="0" x2="'+(x2===undefined?0:x2)+'" y2="'+(y2===undefined?1:y2)+'">'+stops.map(function(s){return '<stop offset="'+s[0]+'" stop-color="'+s[1]+'"'+(s[2]!==undefined?' stop-opacity="'+s[2]+'"':'')+'/>'}).join('')+'</linearGradient>'}
var TT_PLATE='M-100-16H100L112 0 100 16H-100L-112 0z',TT_INNER='M-97-12H97L106 0 97 12H-97L-106 0z';
var TTS={
 t1:{f:[[0,'#d8b07a'],[.5,'#a87a48'],[1,'#6a4424']],e:'#3a2410',tx:'#fff6e0',ts:'#3a2410',
  art:function(u){return '<path d="M-90-9q60-4 186 0M-90 8q70 3 186 0" stroke="#5a3a1a" stroke-opacity=".25" stroke-width="1.2" fill="none"/>'},
  ic:function(u){return '<g transform="translate(-96 0)"><path d="M-14-10h22q6 0 6 6v16h-22q-6 0-6-6z" fill="#f4e4c0" stroke="#7a5a2a" stroke-width="1.4"/><path d="M-14-10q-6 0-6 6t6 6M8 12q6 0 6-6" fill="#e8d4a8" stroke="#7a5a2a" stroke-width="1.4"/><path d="M-10-3h12M-10 2h10" stroke="#a88a5a"/>'+
   '<path d="M-16 14L12-14" stroke="#dfe6f2" stroke-width="4" stroke-linecap="round"/><path d="M-16 14L12-14" stroke="#8a94a8" stroke-width="1"/><path d="M-12 6l6 6M-18 16l3-3" stroke="#7a4a20" stroke-width="3" stroke-linecap="round"/>'+
   '<path d="M16 14L-12-14" stroke="#dfe6f2" stroke-width="4" stroke-linecap="round"/><path d="M12 6l-6 6M18 16l-3-3" stroke="#7a4a20" stroke-width="3" stroke-linecap="round"/></g>'}},
 t2:{f:[[0,'#a8d8ff'],[.5,'#5a8ad8'],[1,'#2a4a8a']],e:'#0f2a5a',tx:'#ffffff',ts:'#0f2a5a',
  art:function(u){return '<g fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"><path d="M-60 6q20-12 40 0t40 0"/><path d="M10-6q20-10 40 0t30 0"/></g>'},
  ic:function(u){var sw=function(r){return '<g transform="rotate('+r+')"><path d="M0 16V-14" stroke="#e8f6ff" stroke-width="4.5" stroke-linecap="round"/><path d="M0 12V-14" stroke="#7ad8ff" stroke-width="1.2"/><path d="M-6 9h12" stroke="#3a2a1a" stroke-width="3" stroke-linecap="round"/><path d="M0 10v7" stroke="#6a4a2a" stroke-width="3"/></g>'};
   return '<g transform="translate(-94 0)"><circle r="18" fill="#7ad8ff" opacity=".35" filter="url(#'+u+'gl)"/>'+sw(-38)+sw(38)+'</g>'},
  end:function(u){return '<g fill="none" stroke-linecap="round"><path d="M96-12q20-8 30 2q-10-6-18 0" stroke="#e8f6ff" stroke-width="3"/><path d="M98 4q24-6 34 6q-12-4-20 2" stroke="#bfe8ff" stroke-width="3"/><path d="M104-2q14 0 20 6" stroke="#fff" stroke-width="2" opacity=".7"/></g>'}},
 t3:{f:[[0,'#5ab06a'],[.5,'#2a6a3a'],[1,'#0f3a1a']],e:'#082010',tx:'#d8ffc8',ts:'#082010',
  art:function(u){return '<path d="M-100 13q20-8 30 0t30-2 30 2 30-2 30 2 30-2 30 2" fill="none" stroke="#6a8a3a" stroke-width="3"/><g fill="#3f9a4a">'+[-80,-40,0,40,80].map(function(x){return '<path d="M'+x+' 12q4-8 10-6q-4 6-10 6z"/>'}).join('')+'</g>'},
  ic:function(u){return '<g transform="translate(-94 0)"><circle r="17" fill="#0a2a10" stroke="#3a6a2a" stroke-width="2"/><path d="M-17 2q6-14 14-10q4-10 14-4q8-2 6 10" fill="none" stroke="#5a7a2a" stroke-width="3"/>'+
   '<g filter="url(#'+u+'gl)"><path d="M-13 3q5-9 12 0q-6 6-12 0zM1 3q6-9 12 0q-6 6-12 0z" fill="#9aff6a"/></g><path d="M-13 3q5-9 12 0q-6 6-12 0zM1 3q6-9 12 0q-6 6-12 0z" fill="#c8ff8a"/><path d="M-7 0v6M7 0v6" stroke="#0a2a0a" stroke-width="2" stroke-linecap="round"/></g>'},
  end:function(u){return '<g transform="translate(108 0) rotate(-20)"><path d="M0 0q12-18 30-14q-6 20-30 14z" fill="#3f9a4a" stroke="#0f3a1a" stroke-width="1.2"/><path d="M2-1q14-6 24-11" stroke="#bfffa8" stroke-width="1"/><circle cx="18" cy="-6" r="2.2" fill="#7aff5a" filter="url(#'+u+'gl)"/></g>'}},
 t4:{f:[[0,'#ff6a6a'],[.5,'#b8202a'],[1,'#5a0a10']],e:'#2a0508',tx:'#ffe8e8',ts:'#2a0508',
  art:function(u){return '<g stroke="#2a0508" stroke-opacity=".45" stroke-width="1.2" fill="none"><path d="M60-12l6 8-4 6 8 10M70-4l8-2M30 12l6-8 8 2"/></g>'},
  ic:function(u){var ax=function(r){return '<g transform="rotate('+r+')"><path d="M0 17V-15" stroke="#7a4a20" stroke-width="3"/><path d="M0-15q12-2 13 10q-7-2-13-2z" fill="#e8ecf4" stroke="#5a5a6a" stroke-width="1"/></g>'};
   return '<g transform="translate(-94 0)"><path d="M0-17l13 5v10q0 12-13 18q-13-6-13-18v-10z" fill="#c8202a" stroke="#5a0a10" stroke-width="2"/><path d="M0-12l8 3v7q0 8-8 12" fill="#ff5a5a" opacity=".6"/>'+ax(-35)+ax(35)+'</g>'},
  end:function(u){var drop=function(x,y,s){return '<path transform="translate('+x+' '+y+') scale('+s+')" d="M0-8q6 8 6 12a6 6 0 0 1-12 0q0-4 6-12z" fill="#e2202a" stroke="#5a0a10" stroke-width="1"/>'};return drop(112,-10,1)+drop(122,2,.75)+'<path d="M96 6l10-4 4 8 8-2" stroke="#2a0508" stroke-width="1.5" fill="none"/>'}},
 t5:{f:[[0,'#7a4ae8'],[.5,'#3a1a8a'],[1,'#1a0a4a']],e:'#0a0428',tx:'#f4e8ff',ts:'#0a0428',
  art:function(u){var st='';for(var i=0;i<26;i++){st+='<circle cx="'+((i*37)%190-80)+'" cy="'+((i*13)%22-11)+'" r="'+(i%3?0.7:1.2)+'" fill="#fff" opacity="'+(.4+(i%4)/6)+'"/>'}return st+'<ellipse cx="40" cy="0" rx="40" ry="8" fill="#c87aff" opacity=".18"/>'},
  ic:function(u){return '<g transform="translate(-94 0)"><path d="M-18-8q9-4 18 1q9-5 18-1v20q-9-4-18 1q-9-5-18-1z" fill="#fff6e0" stroke="#7a5a2a" stroke-width="1.5"/><path d="M0-7v20" stroke="#7a5a2a" stroke-width="1.2"/><path d="M-14-2h10M-14 3h10M4 3h10" stroke="#c8b08a"/>'+hstar(9,-2,6,'#ffd23a')+'<g filter="url(#'+u+'gl)">'+hstar(-16,-16,3,'#fff')+hstar(17,-14,2.4,'#fff')+'</g></g>'},
  end:function(u){return '<g filter="url(#'+u+'gl)">'+hstar(116,-10,4,'#fff')+hstar(108,10,2.6,'#fff8c0')+'</g>'}},
 t6:{f:[[0,'#f0a860'],[.5,'#b8642a'],[1,'#6a3410']],e:'#3a1a05',tx:'#fff0dc',ts:'#3a1a05',
  art:function(u){return '<path d="M-100 16L-80 0l10 6 14-14 16 14 10-6 20 16zM60 16l16-12 8 4 12-10 16 18z" fill="#5a3a20" opacity=".55"/><path d="M-56-8l5 4h-10zM90-12l4 4h-8z" fill="#fff" opacity=".8"/>'},
  ic:function(u){return '<g transform="translate(-94 0)"><circle cx="8" cy="-8" r="6" fill="#ffd23a"/><path d="M-20 15L-6-12l7 9 6-7 15 25z" fill="#8a6a4a" stroke="#3a1a05" stroke-width="1.5"/><path d="M-6-12l4 7-4-2-3 3zM7-10l3 4h-6z" fill="#fff"/></g>'}},
 t7:{f:[[0,'#ffd86a'],[.5,'#e8901a'],[1,'#8a3a0a']],e:'#4a1a05',tx:'#fff8e0',ts:'#4a1a05',
  art:function(u){var sc='';for(var r=0;r<2;r++)for(var i=0;i<14;i++)sc+='<path d="M'+(-70+i*13+r*6.5)+' '+(-6+r*9)+'a6.5 6.5 0 0 0 13 0" fill="none" stroke="#8a3a0a" stroke-opacity=".3" stroke-width="1"/>';return sc},
  ic:function(u){return '<g transform="translate(-94 0)"><path d="M-14 16q-4-14 4-24q4-6 12-6l6-8 2 8q8 2 12 10l-8 2q2 6-2 10l-6-4q-4 6-12 6z" fill="#e8601a" stroke="#4a1a05" stroke-width="1.6"/>'+
   '<path d="M2-14l-6-8 10 4" fill="#ffd86a" stroke="#4a1a05" stroke-width="1"/><circle cx="6" cy="-6" r="2.2" fill="#fff36a"/><path d="M14 2l6 2M12 6l5 4" stroke="#4a1a05" stroke-width="1.2"/><path d="M-10 4q4-4 8 0q-4 4-8 0" fill="#ffb03a"/></g>'},
  end:function(u){return '<g filter="url(#'+u+'gl)"><path d="M98 14q4-14 14-18q-2 8 4 10q2-12 12-16q-4 12 2 18q2-6 8-8q-2 10-6 14z" fill="#ff8a1a"/><path d="M104 14q2-8 8-10q0 6 4 8q2-6 6-8q-2 6 0 10z" fill="#ffe14a"/></g>'}},
 t8:{f:[[0,'#ffffff'],[.5,'#d8dcec'],[1,'#8a94b8']],e:'#4a5478',tx:'#1a2a5a',ts:'#ffffff',
  art:function(u){return '<path d="M-90-10q90 6 196 0" stroke="#fff" stroke-width="2" opacity=".8" fill="none"/>'},
  ic:function(u){var wg='<path d="M-12-2q-14-10-22-4q6 2 6 5q-8 0-10 5q8-1 10 2q-6 3-6 7q10-6 22-5z" fill="#fff" stroke="#8a94b8" stroke-width="1"/>';return '<g transform="translate(-94 0)">'+wg+'<g transform="scale(-1 1)">'+wg+'</g><path d="M-11 15v-13q0-15 11-15t11 15v13z" fill="#e8ecf4" stroke="#4a5478" stroke-width="1.8"/><path d="M-11 0h22" stroke="#4a5478" stroke-width="3"/><path d="M-1-13v26M1-13v26" stroke="#4a5478" stroke-width="1"/><path d="M-11 15v-13q0-15 11-15" fill="none" stroke="#ffd35a" stroke-width="1.5"/><path d="M0-13q-4-8 3-12" stroke="#ffd35a" stroke-width="3" fill="none"/></g>'},
  end:function(u){return '<g transform="translate(104 2) rotate(-28)"><path d="M0 0q14-12 34-10q-8 6-12 6q8 0 10 4q-12 6-32 0z" fill="#fff" stroke="#8a94b8" stroke-width="1"/><path d="M2 0l28-8" stroke="#8a94b8" stroke-width="1"/></g>'}},
 t9:{rb:true,e:'#ffffff',tx:'#3a1a5a',ts:'#ffffff',
  art:function(u){return '<g filter="url(#'+u+'gl)">'+hstar(-50,-8,2.5,'#fff')+hstar(70,8,2.5,'#fff')+hstar(30,-10,2,'#fff')+'</g>'},
  ic:function(u){var wg='<path d="M-10 4q-16-14-26-6q8 2 8 5q-10 0-12 6q10-2 12 2q-6 3-6 7q12-8 24-8z" fill="url(#'+u+'rw)" stroke="#fff" stroke-width="1"/>';return '<g transform="translate(-94 0)">'+wg+'<g transform="scale(-1 1)">'+wg+'</g><path d="M-14 10l-3-18 9 8 8-14 8 14 9-8-3 18z" fill="#ffd35a" stroke="#a8761a" stroke-width="1.5"/><circle cy="2" r="3" fill="#ff5ad8"/><circle cx="-8" cy="5" r="2" fill="#5ad8ff"/><circle cx="8" cy="5" r="2" fill="#5af07a"/><path d="M-14 10h28v4h-28z" fill="#ffb43a" stroke="#a8761a" stroke-width="1"/></g>'},
  end:function(u){var wg='<path d="M0 0q18-16 40-12q-10 6-10 8q12-2 16 4q-12 2-14 6q8 2 8 8q-20-10-40-14z" fill="url(#'+u+'rw)" stroke="#fff" stroke-width="1"/>';return '<g transform="translate(104 0)">'+wg+'</g><g filter="url(#'+u+'gl)">'+hstar(126,-16,3,'#fff')+'</g>'}}
};
/* level 10: no plate — glowing letters over a great pair of celestial wings */
function tt10(u,name){var wing=function(){var o='';for(var i=0;i<9;i++){var L=124-i*9,a=-182+i*8;o+='<path d="M0 0C'+(L*.3)+' -9 '+(L*.7)+' -9 '+L+' 0C'+(L*.7)+' 6 '+(L*.3)+' 6 0 0z" fill="url(#'+u+'cw)" stroke="#ffffff" stroke-width=".9" transform="rotate('+a+')" opacity="'+(.95-i*.04)+'"/>'}
   for(var j=0;j<5;j++){var L2=60-j*7,a2=-176+j*9;o+='<path d="M0 0C'+(L2*.3)+' -6 '+(L2*.7)+' -6 '+L2+' 0C'+(L2*.7)+' 4 '+(L2*.3)+' 4 0 0z" fill="#ffffff" opacity=".85" transform="rotate('+a2+')"/>'}return o};
  return '<g transform="translate(0 22)"><g filter="url(#'+u+'gl)" opacity=".9"><ellipse cx="0" cy="-14" rx="118" ry="30" fill="#5ae8ff" opacity=".3"/></g>'+
   '<g transform="translate(-6 0)">'+wing()+'</g><g transform="translate(6 0) scale(-1 1)">'+wing()+'</g>'+
   '<g filter="url(#'+u+'gl)"><circle r="12" fill="#7ff0ff"/><path d="M0-16l6 16-6 16-6-16z" fill="#ffffff"/></g><path d="M0-12l4 12-4 12-4-12z" fill="#ffffff"/><circle r="3" fill="#bff4ff"/>'+
   '<path d="M-20 10q20-14 40 0" fill="none" stroke="#bff4ff" stroke-width="2"/></g>'+
   '<text x="0" y="0" text-anchor="middle" font-family="Mitr,Noto Sans SC,sans-serif" font-size="21" font-weight="700" fill="#f0feff" stroke="#0a4a7a" stroke-width="3.5" paint-order="stroke" filter="url(#'+u+'tl)"'+ttFit(name,200)+'>'+esc(name)+'</text>'+
   '<g filter="url(#'+u+'gl)">'+hstar(-112,-28,4,'#fff')+hstar(114,-30,4.5,'#bff4ff')+hstar(84,-46,2.5,'#fff')+hstar(-80,-48,2.5,'#fff')+'</g>'}
function ttFit(name,max){var est=name.replace(/[ัิ-ฺ็-๎]/g,'').length*10;return est>max?' textLength="'+max+'" lengthAdjust="spacingAndGlyphs"':''}
/* the whole plate in local units (about 260×60 including decorations) */
function ttLocal(id,u){var T=TITLE[id];if(!T)return '';var name=tx(T.names),lv=T.lv;
  var d='<defs><filter id="'+u+'gl" x="-60%" y="-120%" width="220%" height="340%"><feGaussianBlur stdDeviation="2.4"/></filter>'+
   '<filter id="'+u+'tl" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="1.5" result="b"/><feFlood flood-color="#7ff0ff"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
   '<filter id="'+u+'sh" x="-10%" y="-40%" width="120%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-opacity=".45"/></filter>'+
   '<clipPath id="'+u+'cp"><path d="'+TT_PLATE+'"/></clipPath>'+
   tg(u+'rw',[[0,'#ffffff'],[.5,'#ffd8f8'],[1,'#c8e8ff']],1,0)+tg(u+'cw',[[0,'#ffffff'],[.6,'#bff4ff'],[1,'#3ad8ff']],1,0)+
   tg(u+'sn',[[0,'#fff',0],[.5,'#fff',.75],[1,'#fff',0]],1,0)+
   (lv===9?tg(u+'pf',[[0,'#ff9ad8'],[.2,'#ffd36a'],[.4,'#fff6a0'],[.6,'#8af0c0'],[.8,'#8ad0ff'],[1,'#c89aff']],1,0):tg(u+'pf',TTS['t'+lv]?TTS['t'+lv].f:[[0,'#888'],[1,'#444']]))+'</defs>';
  if(lv>=10)return d+'<g class="tt-plate tt-l10">'+tt10(u,name)+'</g>';
  var S2=TTS[T.style]||TTS.t1,g='<g class="tt-plate tt-l'+lv+'">';
  if(lv>=7)g+='<path d="'+TT_PLATE+'" fill="'+(lv===9?'#ffd8f8':S2.f[1][1])+'" opacity=".7" filter="url(#'+u+'gl)" class="tt-halo" transform="scale(1.04 1.25)"/>';
  g+='<g filter="url(#'+u+'sh)"><path d="'+TT_PLATE+'" fill="url(#'+u+'pf)" stroke="'+S2.e+'" stroke-width="2.4"/></g>';
  g+='<g clip-path="url(#'+u+'cp)">'+S2.art(u)+'<path d="M-112-16H112v9q-112 5-224 0z" fill="#fff" opacity=".22"/>'+(lv>=5?'<rect class="tt-shine" x="-150" y="-20" width="40" height="40" fill="url(#'+u+'sn)" transform="skewX(-20)"/>':'')+'</g>';
  g+='<path d="'+TT_INNER+'" fill="none" stroke="'+(lv>=8?'#ffffff':'#ffe9b0')+'" stroke-opacity="'+(lv>=8?.9:.55)+'" stroke-width="1.2"/>';
  g+='<circle cx="-106" cy="0" r="2.5" fill="'+(lv>=8?'#ffd35a':'#ffe9b0')+'"/><circle cx="106" cy="0" r="2.5" fill="'+(lv>=8?'#ffd35a':'#ffe9b0')+'"/>';
  if(S2.end)g+=S2.end(u);
  g+=S2.ic(u);
  g+='<text x="10" y="5.5" text-anchor="middle" font-family="Mitr,Noto Sans SC,sans-serif" font-size="17" font-weight="700" fill="'+S2.tx+'" stroke="'+S2.ts+'" stroke-width="3" paint-order="stroke"'+ttFit(name,150)+'>'+esc(name)+'</text>';
  return d+g+'</g>'}
/* placed in the avatar at (cx, cy); the plate is scaled to fit above the head */
function titleSvg(id,cx,cy,u){return '<g class="tt-wrap" transform="translate('+cx+' '+cy+') scale(.66)">'+ttLocal(id,u||'tt')+'</g>'}
/* a standalone plate (town, lists): its own little picture */
function titleBadge(id,width){if(!TITLE[id])return '';var lv=TITLE[id].lv;
  return '<svg class="tt-badge" viewBox="-140 '+(lv>=10?'-62':'-34')+' 280 '+(lv>=10?92:64)+'" width="'+(width||180)+'" role="img" aria-label="'+esc(tx(TITLE[id].names))+'">'+ttLocal(id,'b'+(++AVSEQ))+'</svg>'}
/* ---------- the "Me" page section ---------- */
function titlesPanel(){var s=titleStats(),e=earnedTitles(),cur=shownTitle(),adj=titleAdj(S);
  var vis=TITLES.filter(function(T){return !T.grant||e.indexOf(T.id)>=0});
  var h='<section class="panel stack" id="titles"><div class="row" style="justify-content:space-between"><h2 style="font-size:22px">🏅 '+esc(t('tt_head'))+'</h2><small class="mut">'+e.length+' / '+vis.length+'</small></div><small class="mut">'+esc(t('tt_hint'))+'</small><div class="tt-list">';
  vis.forEach(function(T){var got=e.indexOf(T.id)>=0,ready=!got&&(!T.prev||e.indexOf(T.prev)>=0),pr=ruleParts(T.rule,s),have=pr.reduce(function(a,x){return a+x[1]},0),need=pr.reduce(function(a,x){return a+x[2]},0)||1,pct=Math.round(have/need*100);
    h+='<div class="tt-row'+(got?' got':'')+(ready?' next':'')+'">'+(got||ready?titleBadge(T.id,175):'<div class="tt-lock">🔒 '+esc(tx(T.names))+'</div>')+
     '<div class="stack" style="gap:4px;min-width:0"><small>'+esc(ruleText(T))+(adj[T.id]===1?' · 🎁 '+esc(t('tt_gift')):'')+'</small>'+(got?'':ready?'<div class="bar"><i style="width:'+pct+'%"></i></div>':'<small class="mut">'+esc(tx(TT_TX.prev).replace('{t}',TITLE[T.prev]?tx(TITLE[T.prev].names):''))+'</small>')+'</div>'+
     (got?'<button class="btn sec sm" data-act="ttpick" data-id="'+T.id+'" aria-pressed="'+(cur===T.id)+'">'+esc(cur===T.id?t('tt_on'):t('tt_use'))+'</button>':'<span></span>')+'</div>'});
  h+='</div>'+(e.length?'<label class="toggle"><span>'+esc(t('tt_aura'))+'</span><button class="btn sec sm" data-act="tatoggle" aria-pressed="'+(S.set.taura!==false)+'">'+(S.set.taura!==false?'✓':'—')+'</button></label><div class="row"><button class="btn sec sm" data-act="ttpick" data-id="none" aria-pressed="'+(cur==='')+'">'+esc(t('tt_hide'))+'</button></div>':'')+'</section>';return h}
function titleAct(a,id){if(a==='tatoggle'){S.set.taura=S.set.taura===false;save();if(typeof townWrite==='function'&&TW&&TW.in)townWrite({});render();return true}
  if(a!=='ttpick')return false;if(id==='none'||TITLE[id]){S.set.title=id;save();if(typeof townWrite==='function'&&TW&&TW.in)townWrite({});render()}return true}
rebuildTitles();
