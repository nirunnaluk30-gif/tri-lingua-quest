/* =====================================================================
   VIP 1–10 (verified top-up total) + Scholar path 1–10 (diligence points)
   Rules and rewards live in ledger.js (VIP_TIERS / SCH_TIERS) so claims
   are checked by the teacher's verifier. Everything here is original art.
   ===================================================================== */
/* ---------- exclusive frames ---------- */
(function(){
var V='#7a2fc8',G='#ffd35a';
function vipPlate(u,y){return '<g filter="url(#'+u+'sh)"><path d="M78 '+(y-11)+'h44l8 11-8 11h-44l-8-11z" fill="url(#'+u+'vp)" stroke="#3a1060" stroke-width="1.4"/></g><text x="100" y="'+(y+4.5)+'" text-anchor="middle" font-size="13" font-weight="900" letter-spacing="2" fill="#fff3c0" stroke="#3a1060" stroke-width="2.4" paint-order="stroke" font-family="system-ui,sans-serif">VIP</text>'}
function book(x,y,s,c){return '<g transform="translate('+x+' '+y+') scale('+s+')"><path d="M-14 -8q7-3 14 0q7-3 14 0v18q-7-3-14 0q-7-3-14 0z" fill="#fff8e8" stroke="'+c+'" stroke-width="1.4"/><path d="M0 -8v18" stroke="'+c+'" stroke-width="1.2"/><path d="M-11 -3h8M-11 1h8M3 -3h8M3 1h8" stroke="'+c+'" stroke-width=".8" opacity=".6"/></g>'}
function laurel(side){var s='';for(var i=0;i<6;i++){var y=226-i*12,x=6-i*2.4;s+='<ellipse cx="'+x+'" cy="'+y+'" rx="7" ry="3.2" fill="#3a9a52" stroke="#1f6a3a" stroke-width=".7" transform="rotate('+(-50+i*6)+' '+x+' '+y+')"/>'}return s}
var NEW={
 vipgold:{n:m('กรอบทองวีไอพี','VIP Gold Frame','VIP黄金相框'),d:function(a,b,u){
  return frBase(u,a,b,frLG(u+'vp',[[0,frLt(b,.3)],[1,frDk(b,.35)]],0,0,0,1))+frAura(u,a,10,.6,2.8)+
   frBody(u,2,16,12,7,'url(#'+u+'au)','#5a3a04','#fff6c8')+'<path fill-rule="evenodd" d="'+frIn(7,10)+frIn(11,8)+'" fill="url(#'+u+'vp)" opacity=".9"/>'+
   frPair(frWing('url(#'+u+'au)','#5a3a04',4,18,3.4))+frFour(frFiligree('url(#'+u+'au)','#5a3a04')+'<g transform="translate(6 6)"><path d="M0 0L-6 -18L2 -6Z" fill="#c89aff" stroke="#fff" stroke-width=".8"/><path d="M0 0L-18 -6L-6 2Z" fill="#a45cf0" stroke="#fff" stroke-width=".8"/><path d="M0 0L-14 -14L-3 -3Z" fill="#e8d0ff" stroke="#fff" stroke-width=".8"/></g>')+
   frShield(u,4,15,'url(#'+u+'vp)','#3a1060')+frGem(u,100,4,7,G,'url(#'+u+'au)','four')+frDust('#fff3a0',10,.3)+vipPlate(u,233)}},
 viproyal:{n:m('กรอบราชวังวีไอพี','VIP Royal Palace Frame','VIP皇宫相框'),d:function(a,b,u){var cols='';[[-4,30],[204,30]].forEach(function(p){});
  var pillar='<rect x="-6" y="40" width="12" height="160" rx="3" fill="url(#'+u+'au)" stroke="#5a3a04" stroke-width="1.2"/><rect x="-9" y="34" width="18" height="8" rx="2" fill="url(#'+u+'au)" stroke="#5a3a04"/><rect x="-9" y="198" width="18" height="8" rx="2" fill="url(#'+u+'au)" stroke="#5a3a04"/>'+[60,90,120,150,180].map(function(y){return '<path d="M-6 '+y+'h12" stroke="#5a3a04" stroke-width=".8" opacity=".6"/>'}).join('');
  return frBase(u,a,b,frLG(u+'vp',[[0,frLt(a,.3)],[1,frDk(a,.45)]],0,0,0,1))+frAura(u,'#b46bff',14,.8,2.2)+frPair(frWing('url(#'+u+'au)','#5a3a04',5,22,3))+
   frPair(pillar)+frBody(u,2,17,12,7,'url(#'+u+'vp)','#2a0a4a',G)+frGroove(9.5,9,'#2a0a4a','#ffd35a')+frFour(frFiligree('url(#'+u+'au)','#5a3a04'))+
   frCrown(u,8,46,20,'url(#'+u+'au)','#5a3a04')+frGem(u,100,6,5,'#b46bff',null,'four')+frGem(u,84,7,3,'#e0302a',null,'round')+frGem(u,116,7,3,'#2f6fe0',null,'round')+
   frEmbers(u,G,10,250,80).replace(/<circle/g,'<circle mask="url(#'+u+'o)"')+frDust('#fff3a0',12,.6)+vipPlate(u,234)}},
 vipking:{n:m('กรอบราชาวีไอพี','VIP King Frame','VIP王者相框'),d:function(a,b,u){var rays='';for(var i=0;i<16;i++){var an=i*22.5*Math.PI/180;rays+='<path d="M100 120L'+frX(100+Math.cos(an)*170)+' '+frX(120+Math.sin(an)*170)+'" stroke="'+G+'" stroke-width="'+(i%2?2:4)+'" opacity=".4"/>'}
  return frBase(u,a,b,frLG(u+'vp',[[0,'#b46bff'],[1,'#2a0a4a']],0,0,0,1)+frLG(u+'wf',[[0,'#fffbe0'],[.5,G],[1,'#a86a06']],1,0,0,1))+
   frAura(u,G,18,.9,2.4)+frOut(u,'<g><animateTransform attributeName="transform" type="rotate" from="0 100 120" to="360 100 120" dur="50s" repeatCount="indefinite"/>'+rays+'</g>')+
   frOrbit(u,132,150,'#b46bff',2,'12 10',24)+frPair(frWing('url(#'+u+'wf)','#6a4204',7,36,3))+
   frBody(u,2,18,12,7,'url(#'+u+'au)','#5a3a04','#fff6c8')+'<path fill-rule="evenodd" d="'+frIn(7,10)+frIn(12,8)+'" fill="url(#'+u+'vp)"/>'+
   [40,80,120,160,200].map(function(y){return frGem(u,9.5,y,2.2,'#ff5ab4',null,'round')+frGem(u,190.5,y,2.2,'#5ad8ff',null,'round')}).join('')+frFour(frFiligree('url(#'+u+'au)','#5a3a04'))+
   frHalo(u,-30,26,'#fff3a0',2)+'<g transform="translate(0 -4)">'+frCrown(u,10,58,26,'url(#'+u+'au)','#5a3a04')+'</g>'+frGem(u,100,0,7,'#b46bff','url(#'+u+'au)','four')+frGem(u,78,4,3.5,'#e0302a',null,'round')+frGem(u,122,4,3.5,'#2f6fe0',null,'round')+
   frDust('#ffffff',18,.1)+frBanner(u,233,96,'VIP KING','url(#'+u+'vp)','#2a0a4a','#ffd35a',10.5)}},
 schrare:{n:m('กรอบนักปราชญ์','Scholar Frame','学者相框'),d:function(a,b,u){
  return frBase(u,a,b,frLG(u+'rk',[[0,frLt(a,.3)],[1,frDk(a,.35)]],0,0,0,1))+frBody(u,2,15,10,6,'url(#'+u+'m)','#0a1a4a','#e0f0ff')+frGroove(8.5,8,'#0a1a4a','#ffffff')+
   frFour('<path d="M-2 18Q-2 -2 18 -2" stroke="url(#'+u+'au)" stroke-width="3" fill="none"/>'+frRivet(6,6,2.4,'#ffd35a'))+
   '<path d="M30 4v26l5-5 5 5V4z" fill="#e0453a" stroke="#8a1a1a" stroke-width=".8"/><path d="M160 4v20l5-5 5 5V4z" fill="#1f9d6a" stroke="#0a5a3a" stroke-width=".8"/>'+
   '<circle cx="100" cy="2" r="14" fill="#7ab8ff" opacity=".45" filter="url(#'+u+'g)"/>'+book(100,2,1.3,'#0a1a4a')+frGem(u,100,-10,3,'#5ab0ff',null,'round')+frDust('#cfe6ff',6,.2)+frBanner(u,233,40,'RARE','url(#'+u+'rk)','#0a1a4a','#ffffff',8)}},
 schlegend:{n:m('กรอบนักปราชญ์ทองคำ','Golden Scholar Frame','黄金学者相框'),d:function(a,b,u){var quill='<path d="M16 40C0 26 -12 4 -10 -24C-2 -14 6 0 10 10C14 20 20 30 22 34Z" fill="#fffdf4" stroke="#7a9ad0" stroke-width="1"/><path d="M-10 -24C-4 -8 6 10 18 36" stroke="#3a6ab0" stroke-width="1.2" fill="none"/>'+[0,1,2,3,4,5].map(function(i){var y=-14+i*8,x=-6+i*3.6;return '<path d="M'+x+' '+y+'l-6 3M'+(x+2)+' '+(y+2)+'l5 -4" stroke="#9ab8e8" stroke-width=".8"/>'}).join('')+'<path d="M18 36l4 8" stroke="#ffd35a" stroke-width="2.2" stroke-linecap="round"/>';
  return frBase(u,a,b,frLG(u+'rk',[[0,'#2f6fe0'],[1,'#0a1a4a']],0,0,0,1))+frAura(u,'#7ab8ff',12,.65,3)+frTop2(quill)+frBody(u,2,17,12,7,'url(#'+u+'au)','#5a3a04','#fff6c8')+
   '<path fill-rule="evenodd" d="'+frIn(7,10)+frIn(12,8)+'" fill="url(#'+u+'rk)"/>'+frBot2(laurel())+frFour(frFiligree('url(#'+u+'au)','#5a3a04'))+
   '<g filter="url(#'+u+'sh)">'+book(100,0,1.5,'#0a1a4a')+'</g>'+frGem(u,100,-14,3.5,'#5ad8ff',null,'round')+frDust('#cfe6ff',10,.4)+frBanner(u,233,82,'LEGENDARY','url(#'+u+'rk)','#3a2800','#ffd35a',9.5)}},
 schhonor:{n:m('กรอบเกียรติยศปราชญ์','Sage Honour Frame','贤者荣耀相框'),d:function(a,b,u){var pages='';for(var i=0;i<8;i++){var x=frX(10+i*25),dl=frX(i*.45);pages+='<g opacity="0">'+book(x,250,.6,'#2f6fe0')+'<animateTransform attributeName="transform" type="translate" values="0 0;0 -70" dur="4s" begin="'+dl+'s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="4s" begin="'+dl+'s" repeatCount="indefinite"/></g>'}
  var runes='';for(var j=0;j<12;j++){var an=j/12*Math.PI*2;runes+='<text x="'+frX(100+Math.cos(an)*124)+'" y="'+frX(123+Math.sin(an)*146)+'" font-size="11" fill="#7ab8ff" text-anchor="middle" font-weight="800">'+['ก','A','学','ข','B','文','ค','C','书','ง','D','语'][j]+'</text>'}
  return frBase(u,a,b,frLG(u+'rk',[[0,'#ffffff'],[1,'#cfe2ff']],0,0,0,1)+frLG(u+'wf',[[0,'#ffffff'],[.6,'#e8f2ff'],[1,'#7ab8ff']],1,0,0,1))+
   frAura(u,'#9ad0ff',16,.9,3)+frOut(u,pages)+frOut(u,'<g opacity=".8" filter="url(#'+u+'g)">'+runes+'<animateTransform attributeName="transform" type="rotate" from="0 100 120" to="360 100 120" dur="60s" repeatCount="indefinite"/></g>')+
   frPair(frWing('url(#'+u+'wf)','#3a6ab0',6,30,3.4))+frBody(u,2,17,12,7,'url(#'+u+'m)','#3a6ab0','#ffffff')+frGroove(9.5,9,'#3a6ab0','#ffffff')+frBot2(laurel())+frFour(frFiligree('url(#'+u+'au)','#7a5a10'))+
   frHalo(u,-26,24,'#bfe6ff',2.6)+'<g filter="url(#'+u+'sh)">'+book(100,-2,1.7,'#2f6fe0')+'</g>'+frGem(u,76,6,4.5,'#1f9d6a','url(#'+u+'au)','four')+frGem(u,124,6,4.5,'#e0453a','url(#'+u+'au)','four')+frGem(u,100,-18,5,'#2f6fe0','url(#'+u+'au)','four')+
   frDust('#ffffff',16,.7)+frBanner(u,233,96,'SAGE HONOUR','url(#'+u+'rk)','#2f5aa0','#1a3a8a',9.5)}}};
Object.keys(NEW).forEach(function(k){FRAMES[k]=NEW[k];if(FRAME_KINDS.indexOf(k)<0)FRAME_KINDS.push(k);if(CAT.frame.kinds.indexOf(k)<0)CAT.frame.kinds.push(k);KIND_NAMES[k]=NEW[k].n});
})();
/* ---------- exclusive headwear ---------- */
(function(){
var NH={
 vip_hat:{n:m('หมวกจอมเวทวีไอพี','VIP Royal Hat','VIP皇家礼帽'),d:function(a,b,u){
  return '<defs>'+cg(u+'vh',[[0,shade(a,40)],[1,shade(a,-30)]],1)+cg(u+'vg',[[0,'#fffbe0'],[.5,b],[1,'#a86a06']],1)+cglow(u+'vl',2.4)+'</defs>'+
   '<path d="M46 66q54 18 108 0l-4 10q-50 16-100 0z" fill="url(#'+u+'vh)" stroke="'+shade(a,-50)+'" stroke-width="1.5"/>'+
   '<path d="M66 64L70 18q30-10 60 0l4 46q-34 10-68 0z" fill="url(#'+u+'vh)" stroke="'+shade(a,-50)+'" stroke-width="1.5"/><path d="M76 22q8-4 18-5" stroke="#fff" stroke-opacity=".5" stroke-width="2.5" stroke-linecap="round"/>'+
   '<path d="M67 52q33 10 66 0l1 9q-34 10-68 0z" fill="url(#'+u+'vg)" stroke="#8a5a08" stroke-width="1"/>'+
   '<circle cx="100" cy="55" r="9" fill="'+b+'" opacity=".5" filter="url(#'+u+'vl)"/><path d="M100 47l6 8-6 8-6-8z" fill="#c06bff" stroke="#fff" stroke-width="1.2"/>'+
   '<text x="100" y="40" text-anchor="middle" font-size="12" font-weight="900" fill="url(#'+u+'vg)" stroke="'+shade(a,-50)+'" stroke-width=".8" font-family="system-ui,sans-serif">VIP</text>'+
   '<g opacity="0">'+hstar(132,22,4,'#fff')+'<animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></g>'}},
 sch_cap:{n:m('หมวกบัณฑิตนักปราชญ์','Scholar Graduation Cap','学者学士帽'),d:function(a,b,u){
  return '<defs>'+cg(u+'sc',[[0,shade(a,30)],[1,shade(a,-20)]],1)+'</defs>'+
   '<path d="M64 62q36 12 72 0V46q-36 10-72 0z" fill="url(#'+u+'sc)" stroke="'+shade(a,-40)+'" stroke-width="1.5"/>'+
   '<path d="M100 18L164 40L100 60L36 40z" fill="'+shade(a,15)+'" stroke="'+shade(a,-45)+'" stroke-width="1.8"/><path d="M100 22L156 40" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>'+
   '<circle cx="100" cy="39" r="4" fill="'+b+'" stroke="'+shade(b,-50)+'"/><path d="M100 39Q132 44 140 54" stroke="'+b+'" stroke-width="2.4" fill="none"/>'+
   '<g><path d="M140 54v22" stroke="'+b+'" stroke-width="2"/><path d="M136 74h8l2 14h-12z" fill="'+b+'" stroke="'+shade(b,-50)+'" stroke-width=".8"/><animateTransform attributeName="transform" type="rotate" values="0 140 54;6 140 54;0 140 54;-4 140 54;0 140 54" dur="3s" repeatCount="indefinite"/></g>'}},
 sch_crown:{n:m('มงกุฎปราชญ์สามภาษา','Crown of the Trilingual Sage','三语贤者之冠'),d:function(a,b,u){var lf='';for(var i=0;i<7;i++){var x=58+i*5,y=62-i*5.5;lf+='<ellipse cx="'+x+'" cy="'+y+'" rx="8" ry="3.6" fill="url(#'+u+'lg)" stroke="#8a5a08" stroke-width=".8" transform="rotate('+(-60+i*7)+' '+x+' '+y+')"/>'}
  var gem=function(x,y,r,c){return '<circle cx="'+x+'" cy="'+y+'" r="'+(r+3)+'" fill="'+c+'" opacity=".5" filter="url(#'+u+'cl)"/><path d="M'+x+' '+(y-r)+'l'+frX(r*.8)+' '+r+'-'+frX(r*.8)+' '+r+'-'+frX(r*.8)+'-'+r+'z" fill="'+c+'" stroke="#fff" stroke-width="1.2"/>'};
  var pg='';for(var k=0;k<3;k++){var dl=k*1.3;pg+='<g opacity="0"><path d="M-7 -4q3.5-1.6 7 0q3.5-1.6 7 0v9q-3.5-1.6-7 0q-3.5-1.6-7 0z" fill="#fff8e8" stroke="'+b+'" stroke-width="1"/><animateMotion dur="4s" begin="'+dl+'s" repeatCount="indefinite" path="M100 20a46 12 0 1 1 -1 0"/><animate attributeName="opacity" values="0;1;1;0" dur="4s" begin="'+dl+'s" repeatCount="indefinite"/></g>'}
  return '<defs>'+cg(u+'lg',[[0,'#fffbe0'],[.5,a],[1,'#a86a06']],1)+cglow(u+'cl',2.6)+'</defs>'+
   '<ellipse cx="100" cy="8" rx="34" ry="7" fill="none" stroke="#bfe6ff" stroke-width="3" filter="url(#'+u+'cl)"><animate attributeName="opacity" values="1;.4;1" dur="2.6s" repeatCount="indefinite"/></ellipse>'+
   lf+mirror(lf)+'<path d="M62 62q38 12 76 0l-2 8q-36 12-72 0z" fill="url(#'+u+'lg)" stroke="#8a5a08" stroke-width="1.2"/>'+
   gem(80,52,5,'#1f9d6a')+gem(100,46,7,b)+gem(120,52,5,'#e0453a')+pg}}};
Object.keys(NH).forEach(function(k){HATS[k]=NH[k];if(CAT.headwear.kinds.indexOf(k)<0)CAT.headwear.kinds.push(k);KIND_NAMES[k]=NH[k].n});
/* ---------- exclusive wings: spellbook pages ---------- */
WSET.bookwing=function(a,b,u){var s='<defs>'+grad(u+'bw',a,shade(a,-30))+cglow(u+'bg',2.4)+'</defs>';
  for(var i=0;i<7;i++){var ang=160+i*14,L=78-Math.abs(i-3)*5,d=wdir(ang),px=-d[1],py=d[0],x1=WR.x+d[0]*L,y1=WR.y+d[1]*L,w=12;
    s+='<path d="M'+f1(WR.x)+' '+f1(WR.y)+'L'+f1(x1+px*w)+' '+f1(y1+py*w)+'Q'+f1(x1+d[0]*6)+' '+f1(y1+d[1]*6)+' '+f1(x1-px*w)+' '+f1(y1-py*w)+'Z" fill="url(#'+u+'bw)" stroke="'+b+'" stroke-width="1.2"/>';
    for(var k=1;k<4;k++){var t=k/4;s+='<path d="M'+f1(WR.x+d[0]*L*t+px*w*t*.8)+' '+f1(WR.y+d[1]*L*t+py*w*t*.8)+'L'+f1(WR.x+d[0]*L*t-px*w*t*.8)+' '+f1(WR.y+d[1]*L*t-py*w*t*.8)+'" stroke="'+b+'" stroke-width=".7" opacity=".55"/>'}}
  s+='<g filter="url(#'+u+'bg)" opacity=".9"><text x="28" y="96" font-size="12" font-weight="800" fill="'+b+'">ก</text><text x="18" y="132" font-size="12" font-weight="800" fill="'+b+'">A</text><text x="30" y="166" font-size="12" font-weight="800" fill="'+b+'">字</text><animate attributeName="opacity" values=".3;1;.3" dur="2.8s" repeatCount="indefinite"/></g>';
  return s+mirror(s)};
if(CAT.wings.kinds.indexOf('bookwing')<0)CAT.wings.kinds.push('bookwing');KIND_NAMES.bookwing=m('ปีกคัมภีร์เวท','Spellbook wings','魔典之翼');
})();

/* ---------- levels ---------- */
function vipOn(){return CFG.vipOn!==0}
function schOn(){return CFG.schOn!==0}
function vipLevel(st){st=st||S;var b=st.vipB||0,l=0;for(var i=1;i<=10;i++)if(b>=vipNeed(CFG,i))l=i;return l}
function schLevel(st){st=st||S;var p=st.sp||0,l=0;for(var i=1;i<=10;i++)if(p>=schNeed(CFG,i))l=i;return l}
function vpTodayPts(){return S.spD===today()?(S.spV||0):0}
function vpMissing(T){return (T.it||[]).filter(function(id){return !ITEM[id]})}
function claimVip(lv){if(!vipOn()||!(lv>=1&&lv<=10)||(S.vipc||{})[lv]||(S.vipB||0)<vipNeed(CFG,lv))return;var T=VIP_TIERS[lv-1];if(vpMissing(T).length){toast(t('vp_noitems'));return}
  var g=commitEv(bVip(S,lv,CFG));save();showReward('👑 VIP '+lv,g,T.it||[])}
function claimSch(lv){if(!schOn()||!(lv>=1&&lv<=10)||(S.schc||{})[lv]||(S.sp||0)<schNeed(CFG,lv))return;var T=SCH_TIERS[lv-1];if(vpMissing(T).length){toast(t('vp_noitems'));return}
  var g=commitEv(bSch(S,lv,CFG));save();showReward('📚 '+t('sc_name')+' '+lv,g,T.it||[])}
/* titles that come with a level (shown in the reward list) */
var VP_TITLE={vip:{9:'tvip'},sch:{1:'tsch1',8:'tsch8',10:'tsch10'}};
function vpChips(){var h='';if(vipOn()&&vipLevel())h+='<span class="vp-chip vip">👑 VIP '+vipLevel()+'</span>';if(schOn()&&schLevel())h+='<span class="vp-chip sch">📚 '+esc(t('sc_short'))+' '+schLevel()+'</span>';return h?'<div class="vp-chips">'+h+'</div>':''}
function vpRow(kind,lv,T,need,have,claimed,unit){var reach=have>=need,cls=claimed?'got':reach?'ready':'';
  var r=rew(T.r),its=(T.it||[]).map(function(id){var it=ITEM[id];return it?'<span class="vp-it r-'+it.rar+'" title="'+esc(tx(it.names))+'"><span class="thumb">'+itemThumb(it)+'</span></span>':'<span class="vp-it miss" title="'+esc(t('vp_noitems'))+'">🎁</span>'}).join('');
  var tt=VP_TITLE[kind][lv]&&TITLE[VP_TITLE[kind][lv]]?'<span class="pill">🏷️ '+esc(tx(TITLE[VP_TITLE[kind][lv]].names))+'</span>':'';
  var extra=kind==='vip'&&lv===1?'<span class="pill">👑 '+esc(t('vp_badge'))+'</span>':kind==='vip'&&lv===6?'<span class="pill">✨ '+esc(t('vp_gold'))+'</span>':'';
  return '<div class="vp-row '+cls+'"><div class="vp-lv">'+(kind==='vip'?'VIP':'Lv')+' '+lv+'</div><div class="vp-need num">'+(unit==='฿'?'฿'+need:need+' ⭐')+'</div>'+
   '<div class="vp-gets">'+rewardPills(r)+extra+tt+its+'</div><div class="vp-act">'+(claimed?'<span class="tag">✓ '+esc(t('vp_got'))+'</span>':reach?'<button class="btn sm gold" data-act="'+(kind==='vip'?'vipclaim':'schclaim')+'" data-id="'+lv+'">'+esc(t('vp_claim'))+'</button>':'<span class="mut">🔒</span>')+'</div></div>'}
function vipSection(){if(!vipOn()&&!schOn())return '';var h='<div class="cols vp-cols">';
  if(schOn()){var sp=S.sp||0,sl=schLevel(),nx=sl<10?schNeed(CFG,sl+1):schNeed(CFG,10),prev=sl?schNeed(CFG,sl):0,pct=sl>=10?100:Math.round((sp-prev)/Math.max(1,nx-prev)*100);
    h+='<section class="panel stack vp-panel sch"><div class="vp-head"><div><span class="eyebrow">📚 '+esc(t('sc_name'))+'</span><h2>'+esc(t('sc_lv'))+' '+sl+' / 10</h2></div><div class="vp-big">'+sp+' ⭐</div></div>'+
     '<div class="mp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><i style="width:'+pct+'%"></i></div>'+
     '<small class="mut">'+esc(sl>=10?t('sc_max'):t('sc_next').replace('{n}',nx-sp).replace('{l}',sl+1))+' · '+esc(t('sc_today').replace('{n}',vpTodayPts()).replace('{m}',SCH_CAP))+'</small>'+
     '<details class="vp-how"><summary>'+esc(t('sc_how'))+'</summary><small>'+esc(t('sc_howt'))+'</small></details>'+
     '<div class="vp-list">'+SCH_TIERS.map(function(T,i){return vpRow('sch',i+1,T,schNeed(CFG,i+1),sp,(S.schc||{})[i+1],'⭐')}).join('')+'</div></section>'}
  if(vipOn()){var b=S.vipB||0,vl=vipLevel(),vn=vl<10?vipNeed(CFG,vl+1):vipNeed(CFG,10),vp0=vl?vipNeed(CFG,vl):0,vpct=vl>=10?100:Math.round((b-vp0)/Math.max(1,vn-vp0)*100);
    h+='<section class="panel stack vp-panel vip"><div class="vp-head"><div><span class="eyebrow">👑 VIP</span><h2>VIP '+vl+' / 10</h2></div><div class="vp-big">฿'+b+'</div></div>'+
     '<div class="mp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+vpct+'"><i style="width:'+vpct+'%"></i></div>'+
     '<small class="mut">'+esc(t('vp_note'))+'</small>'+
     '<div class="vp-list">'+VIP_TIERS.map(function(T,i){return vpRow('vip',i+1,T,vipNeed(CFG,i+1),b,(S.vipc||{})[i+1],'฿')}).join('')+'</div>'+
     '<div class="row"><button class="btn sec sm" data-act="vptopup">💎 '+esc(t('tp_title'))+'</button></div></section>'}
  return h+'</div>'}
function vipAct(a,id){if(a==='vptopup'){UI.shop='topup';UI.scr='shop';render();return true}if(a==='vipclaim'){claimVip(parseInt(id,10));return true}if(a==='schclaim'){claimSch(parseInt(id,10));return true}return false}
