/* =====================================================================
   FULL-SCREEN BOSS ARENA (2026-11-23) — every boss fight (zone bosses,
   the city / world raids, adventure-gate bosses) opens on a full-screen
   stage: a scene drawn in code that matches the boss's land (ice palace,
   volcano, abyss, sky, forest, sea, desert, night ruins), a large boss in
   the middle, a top bar with the boss HP %, the time left, the players
   fighting with you, skill buttons on the right and the question at the
   bottom. Only the look changes: the fight rules and the ledger are the
   same functions as before. Teacher switch: CFG.bfOn.
   ===================================================================== */
Object.assign(L,{bf_q:m('ตอบถูกเพื่อโจมตี','Answer right to attack','答对即可攻击'),bf_floor:m('ชั้น {n}','Floor {n}','第{n}层'),bf_party:m('ผู้ร่วมตี','Fighting now','正在战斗')});
if(typeof CFG_LABELS!=='undefined')Object.assign(CFG_LABELS,{bfOn:m('ฉากสู้บอสเต็มจอ (1 = เปิด, 0 = ปิด)','Full-screen boss arena (1 = on, 0 = off)','全屏首领战(1 开 0 关)')});
var BF_TH={
 ice:{sky:['#0a1838','#1f4a8a','#7fb8ff'],au:'#7dffd8',sp:'#cfe9ff',pl:'#bfe2ff',fl:'#ffffff',up:false},
 lava:{sky:['#1a0604','#5a1408','#ff6a2a'],au:'#ffb03a',sp:'#3a1a10',pl:'#ff8a3a',fl:'#ff9a4a',up:true},
 abyss:{sky:['#05020c','#2a0a3a','#8a2a8a'],au:'#ff7ab0',sp:'#1a0a24',pl:'#d08aff',fl:'#e0b0ff',up:true},
 sky:{sky:['#2a5aa8','#7ab0ff','#fff2d0'],au:'#fff6c8',sp:'#ffffff',pl:'#ffe9a8',fl:'#ffffff',up:false},
 forest:{sky:['#0c2a18','#2a6a3a','#bfe8a0'],au:'#d8ff9a',sp:'#16381f',pl:'#9dffb0',fl:'#e8ffb0',up:true},
 sea:{sky:['#03203a','#0a5a8a','#7fe0ff'],au:'#9ff4ff',sp:'#0c3a5a',pl:'#7fe8ff',fl:'#d8fbff',up:true},
 desert:{sky:['#3a1a06','#b8641a','#ffd88a'],au:'#ffe0a0',sp:'#6a3a12',pl:'#ffd07a',fl:'#ffe6b0',up:false},
 night:{sky:['#07071a','#1f2048','#5a5a9a'],au:'#c8c8ff',sp:'#14142e',pl:'#b8b8ff',fl:'#ffffff',up:false}};
var BF_REG={meadow:'forest',vale:'forest',forest:'forest',coast:'sea',isles:'sea',cave:'abyss',desert:'desert',graveyard:'night',ruins:'night',snow:'ice',volcano:'lava',sky:'sky',abyss:'abyss',world:'sky'};
var BF_AW={boss_aw_cave_beetle:'abyss',boss_aw_brood_empress:'abyss',boss_aw_drill_colossus:'lava',boss_aw_drowned_captain:'sea',boss_aw_shellguard_warlord:'sea',boss_aw_rift_dragon_king:'abyss'};
function bfOn(){return CFG.bfOn!==0}
function bfThemeOfMon(id){if(!id)return 'night';if(BF_AW[id])return BF_AW[id];var m2=/^boss_([a-z]+)_/.exec(id);return (m2&&BF_REG[m2[1]])||'night'}
function bfThemeOfZone(z){var id=(z&&z.id)||'';if(id==='vol')return 'lava';if(id==='star')return 'sky';var o=(z&&z.order)||0;return ['forest','sea','desert','forest','abyss','ice','night','sea','lava','sky'][o%10]}
function bfThemeOfRaid(){var b=RDB==='ev'&&evCur();if(b&&b.mon)return bfThemeOfMon(b.mon);if(b&&b.art==='rex')return 'lava';if(b&&b.art==='lion')return 'desert';return 'night'}
/* the moving scene: one loop, draws into whatever .bf-bg canvas is on the page now */
var BF={run:false,clock:0,last:0,fl:null};
function bfStart(){if(BF.run)return;BF.run=true;BF.last=performance.now();if(!BF.fl){BF.fl=[];for(var i=0;i<110;i++)BF.fl.push({x:Math.random(),y:Math.random(),s:Math.random()*2+.6,v:Math.random()*.03+.01})}requestAnimationFrame(bfLoop)}
function bfLoop(now){var c=document.querySelector('.bf canvas.bf-bg');if(!c){BF.run=false;return}var dt=Math.min(.05,(now-BF.last)/1000);BF.last=now;BF.clock+=dt;
  var r=c.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1),W=r.width,H=r.height;if(c.width!==Math.round(W*d)){c.width=Math.round(W*d);c.height=Math.round(H*d)}var g=c.getContext('2d');g.setTransform(d,0,0,d,0,0);
  bfDraw(g,W,H,BF_TH[c.getAttribute('data-th')]||BF_TH.night,S.set.motion===false?0:BF.clock);requestAnimationFrame(bfLoop)}
function bfDraw(g,W,H,T,t){var gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,T.sky[0]);gr.addColorStop(.55,T.sky[1]);gr.addColorStop(1,T.sky[2]);g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.globalCompositeOperation='lighter';for(var i=0;i<3;i++){g.beginPath();for(var x=0;x<=W;x+=20){var y=H*(.12+i*.06)+Math.sin(x/140+t*.4+i)*24+Math.sin(x/53+t*.7)*8;x?g.lineTo(x,y):g.moveTo(x,y)}g.strokeStyle=T.au;g.globalAlpha=.18-i*.04;g.lineWidth=40-i*10;g.stroke()}g.globalAlpha=1;g.globalCompositeOperation='source-over';
  for(var side=0;side<2;side++)for(var k=0;k<7;k++){var sx=side?W-(k*W*.06+20):k*W*.06+20,h=H*(.55-k*.05)*(k%2?.8:1),w=W*.035;g.beginPath();g.moveTo(sx-w,H*.72);g.lineTo(sx,H*.72-h);g.lineTo(sx+w,H*.72);g.closePath();var sg=g.createLinearGradient(sx,H*.72-h,sx,H*.72);sg.addColorStop(0,T.sp);sg.addColorStop(1,T.sky[1]);g.fillStyle=sg;g.globalAlpha=.55+k*.05;g.fill();g.globalAlpha=.6;g.strokeStyle=T.pl;g.lineWidth=1;g.stroke()}g.globalAlpha=1;
  var cx=W/2,cy=H*.72,rx=W*.44,ry=Math.max(40,H*.15);g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,7);var pg=g.createRadialGradient(cx,cy,10,cx,cy,rx);pg.addColorStop(0,T.sky[2]);pg.addColorStop(1,T.sky[0]);g.fillStyle=pg;g.globalAlpha=.85;g.fill();g.globalAlpha=1;
  g.save();g.translate(cx,cy);g.scale(1,ry/rx);g.globalCompositeOperation='lighter';g.strokeStyle=T.pl;[1,.8,.55,.3].forEach(function(q,j){g.globalAlpha=.35+.25*Math.sin(t*2+j);g.lineWidth=j?2:4;g.beginPath();g.arc(0,0,rx*q,0,7);g.stroke()});
  g.rotate(t*.15);g.globalAlpha=.45;for(var n=0;n<8;n++){g.rotate(Math.PI/4);g.beginPath();g.moveTo(0,0);g.lineTo(rx*.8,0);g.stroke();g.fillStyle=T.pl;g.fillRect(rx*.62,-4,10,8)}g.restore();g.globalAlpha=1;g.globalCompositeOperation='source-over';
  g.fillStyle=T.fl;BF.fl.forEach(function(f){f.y+=f.v*.016*(T.up?-1:1);if(f.y>1)f.y=0;if(f.y<0)f.y=1;g.globalAlpha=.7;g.beginPath();g.arc(f.x*W+Math.sin(t+f.s*9)*8,f.y*H,f.s,0,7);g.fill()});g.globalAlpha=1}
/* top bar */
function bfHud(o){var pct=Math.max(0,Math.min(100,o.pct));
  return '<div class="bf-hud"><div class="bf-me"><span class="bf-lv">Lv.'+S.lvl+'</span><div><b>'+esc(S.name)+'</b><small>'+esc(tx(CLASSES[S.cls].names))+(o.me?' · '+o.me:'')+'</small></div></div>'+
   '<div class="bf-boss">'+(o.icon||'')+'<div class="bf-hpw"><div class="bf-hpt"><b>'+esc(o.name)+'</b><span>'+pct.toFixed(1)+'%'+(o.right?' · '+esc(o.right):'')+'</span></div><div class="bf-hpb"><i style="width:'+pct+'%"></i></div></div></div>'+
   (o.party&&o.party.length?'<div class="bf-party"><small>'+esc(t('bf_party'))+'</small>'+o.party.map(function(p){return '<div><span>'+esc(p.n)+'</span><b>'+p.d+'</b></div>'}).join('')+'</div>':'')+'</div>'}
function bfWrap(html,th,hud){if(!bfOn()||typeof html!=='string'||html.indexOf('<div class="qwrap"')!==0)return html;setTimeout(bfStart,0);
  return '<div class="qwrap bf"><canvas class="bf-bg" data-th="'+th+'" aria-hidden="true"></canvas>'+bfHud(hud)+html.slice(html.indexOf('>')+1)}
function bfIcon(src){return src?'<img class="bf-ic" src="'+src+'" alt="">':''}
function bfLeft(ms){if(!(ms>0))return '';var s=Math.floor(ms/1000),h=Math.floor(s/3600),mm=Math.floor(s%3600/60);return '⏱ '+(h?h+':'+String(mm).padStart(2,'0'):mm+':'+String(s%60).padStart(2,'0'))}
(function(){
  var RE=rdEncHtml;rdEncHtml=function(){var h=RE();if(!bfOn())return h;var st=rdStats(),hp=rdBC().hp,b=RDB==='ev'&&evCur(),sl=rdSlot(),now=Date.now();
    var party=(st.parts||[]).slice().sort(function(a,c){return rdDmgOf(RD.hits[c])-rdDmgOf(RD.hits[a])}).slice(0,4).map(function(u){return {n:(RD.hits[u].name||'—')+(u===CL.uid?' ⭐':''),d:rdDmgOf(RD.hits[u])}});
    return bfWrap(h,bfThemeOfRaid(),{name:rdName(),pct:hp?(hp-(st.dmg||0))/hp*100:100,right:bfLeft((sl.end||0)-now),icon:b&&b.mon?bfIcon(monSrc(b.mon)):'',party:party})};
  var TE=tnEncHtml;tnEncHtml=function(){var h=TE(),s=TN.enc;if(!bfOn()||!s||s.kind!=='boss')return h;var G=TN_GATE[tnCur()],id=G&&G.sprB?G.sprB[(TN.f-1)%G.sprB.length]:'',n=s.qs.length;
    return bfWrap(h,id?bfThemeOfMon(id):['forest','sea','abyss','desert','night','ice','lava','sky','abyss','night'][(TN.f-1)%10],{name:tnBossName(TN.f)||t('tn_guard')+' '+TN.f,pct:(n-s.ok)/n*100,right:t('bf_floor').replace('{n}',TN.f),icon:id?bfIcon(monSrc(id)):''})};
  var VP=VIEW.play;VIEW.play=function(){var h=VP(),s=UI.sess;if(!bfOn()||!s||s.kind!=='boss'||s.phase==='intro'||s.phase==='result'||!ZONES[s.zi])return h;var z=ZONES[s.zi];
    return bfWrap(h,bfThemeOfZone(z),{name:tx(z.boss.names),pct:s.hp/s.max*100,right:s.hp+'/'+s.max,icon:'<span class="bf-ic bf-emo" style="--bc:'+z.boss.color+'">'+esc(z.boss.pic)+'</span>',me:'❤ '+s.hearts+'/'+CFG.bossHearts})};
})();
