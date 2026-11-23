/* =====================================================================
   30-DAY CHECK-IN — one check-in per Thai day, counted cumulatively
   (missed days are fine). Every slot shows its reward in advance:
   coins, gems, fashion items and weapons; days 7/14/21/28 give a
   Legendary item; day 30 lets the player choose one Legendary wing,
   weapon or frame. Then a new 30-day cycle starts.
   The reward table is the same code for the game and the anti-cheat.
   ===================================================================== */
Object.assign(L,{ck_title:m('📅 เช็กอิน 30 วัน','📅 30-day check-in','📅 30 天签到'),ck_sub:m('เข้าวันไหนก็ได้วันละ 1 ช่อง (ขาดได้) · ครบ 7 วันได้ของระดับตำนาน · ครบ 30 วันเลือกปีก อาวุธ หรือกรอบระดับตำนาน 1 ชิ้น','One box a day, any days you like · every 7th box: a Legendary item · box 30: choose a Legendary wing, weapon or frame','每天签一格,可间断 · 每 7 格得传说道具 · 第 30 格自选传说翅膀、武器或头像框'),
 ck_btn:m('เช็กอินวันนี้','Check in today','今日签到'),ck_done:m('เช็กอินวันนี้แล้ว พรุ่งนี้มาใหม่นะ','Checked in today, see you tomorrow','今天已签到,明天再来'),ck_day:m('วันที่ {n}','Day {n}','第 {n} 天'),
 ck_cycle:m('รอบที่ {c} · เช็กอินแล้ว {n}/30','Round {c} · {n}/30 checked in','第 {c} 轮 · 已签 {n}/30'),ck_got:m('🎁 เช็กอินวันที่ {n}','🎁 Check-in day {n}','🎁 第 {n} 天签到'),
 ck_choose:m('🏆 ครบ 30 วัน! เลือกของระดับตำนาน 1 ชิ้น','🏆 30 days! Choose one Legendary item','🏆 满 30 天!自选一件传说道具'),ck_pick:m('เลือกชิ้นนี้','Choose this','选这个'),
 ck_wing:m('ปีก','Wings','翅膀'),ck_weapon:m('อาวุธ','Weapon','武器'),ck_frame:m('กรอบรูป','Frame','头像框')});
var CK_N=30,CK_GROUPS={wing:function(it){return it.cat==='wings'},weapon:function(it){return slotOf(it)==='weapon'},frame:function(it){return it.cat==='frame'},
  fashion:function(it){var s=slotOf(it);return s!=='weapon'&&it.cat!=='frame'&&it.cat!=='pet'&&it.cat!=='aura'}};
/* the 30 boxes: c = coins, g = gems, or an item of a rarity from a group; 30 = choice */
var CK_TABLE=[null,
 {c:100},{g:5},{r:'rare',grp:'fashion'},{c:150},{g:10},{r:'rare',grp:'weapon'},{r:'legendary',grp:'fashion'},
 {c:200},{g:10},{r:'epic',grp:'fashion'},{c:250},{g:15},{r:'epic',grp:'weapon'},{r:'legendary',grp:'weapon'},
 {c:300},{g:15},{r:'epic',grp:'fashion'},{c:350},{g:20},{r:'epic',grp:'wing'},{r:'legendary',grp:'wing'},
 {c:400},{g:20},{r:'epic',grp:'weapon'},{c:450},{g:25},{r:'epic',grp:'fashion'},{r:'legendary',grp:'fashion'},
 {c:500,g:30},{choice:['wing','weapon','frame'],r:'legendary'}];
function ckPool(IM,r,grp){var f=CK_GROUPS[grp];return tnPool(IM).filter(function(id){var it=IM[id];return it.rar===r&&f(it)})}
/* which item a box gives this player in this round (fixed in advance, so they can see it) */
function ckItem(uid,c,day,IM,grp){var s=CK_TABLE[day];if(!s||(!s.grp&&!grp))return '';var g=grp||s.grp,list=ckPool(IM,s.r,g);if(!list.length&&s.r==='legendary')list=ckPool(IM,'epic',g);if(!list.length)list=ckPool(IM,s.r,'fashion');
  return list.length?list[Math.floor(rng01(uid+'|ck|'+c,day+'|'+g)*list.length)]:''}
function ckState(X){var c=isO(X.chk)?X.chk:{};return {c:int(c.c,0,1e6,0),n:int(c.n,0,CK_N,0),last:typeof c.last==='string'?c.last:''}}
function ckApply(X,e){var k=ckState(X);X.coin+=int(e.cc,0,1e6,0);X.gems+=int(e.cg,0,1e6,0);if(e.item)addOwn(X,e.item);
  k.n=e.day;k.last=e.d;if(k.n>=CK_N){k.c++;k.n=0}X.chk=k}
/* anti-cheat: one box per Thai day, boxes in order, rewards exactly as the table says */
function ckCheck(X,e,IM,add){var k=ckState(X),s=CK_TABLE[e.day];
  if(!s||e.c!==k.c||e.day!==k.n+1){add('err',e,'ckorder');return}if(k.last&&k.last>=e.d){add('err',e,'ckday');return}
  if(e.cc!==(s.c||0)||e.cg!==(s.g||0)){add('err',e,'ckrew');return}
  if(s.grp||s.choice){var it=IM[e.item];if(!it){add('warn',e,'unknown');return}
    var grps=s.choice||[s.grp],okG=grps.some(function(g){return CK_GROUPS[g](it)});var rOk=it.rar===s.r||(s.r==='legendary'&&it.rar==='epic');
    if(!okG||!rOk||isBound(e.item))add('err',e,'ckitem')}else if(e.item)add('err',e,'ckitem')}
function bCk(X,uid,day,IM,grp){var k=ckState(X),s=CK_TABLE[day];return {k:'chk',c:k.c,day:day,cc:s.c||0,cg:s.g||0,item:(s.grp||s.choice)?ckItem(uid,k.c,day,IM,grp):''}}

/* ---------- view ---------- */
function ckToday(){var k=ckState(S);return k.last===today()}
function ckCell(day,k){var s=CK_TABLE[day],done=day<=k.n,next=day===k.n+1,it=null,ico='';
  if(s.choice){ico='<span class="ck-ch">'+s.choice.map(function(g){var id=ckItem(CL.uid||'',k.c,day,ITEM,g);return ITEM[id]?'<span class="ck-th">'+itemThumb(ITEM[id])+'</span>':''}).join('')+'</span>'}
  else if(s.grp){var id=ckItem(CL.uid||'',k.c,day,ITEM);it=ITEM[id];ico=it?'<span class="ck-th">'+itemThumb(it)+'</span>':'🎁'}
  else ico='<span class="ck-num">'+(s.c?'🪙'+s.c:'')+(s.g?(s.c?'<br>':'')+'💎'+s.g:'')+'</span>';
  var big=s.r==='legendary',lbl=s.choice?t('ck_choose'):it?tx(it.names)+' · '+tx(RAR[it.rar].names):(s.c?s.c+' '+t('coin'):'')+(s.g?' '+s.g+' '+t('gems'):'');
  return '<div class="ck-cell'+(done?' done':'')+(next?' next':'')+(big?' big':'')+(s.choice?' final':'')+'" title="'+esc(lbl)+'"><small>'+day+'</small>'+ico+(done?'<i class="ck-ok" aria-hidden="true">✓</i>':'')+'</div>'}
function checkinHtml(){if(!S.created)return '';var k=ckState(S),done=ckToday();
  var h='<section class="panel stack ck-panel"><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px"><div class="stack" style="gap:2px"><span class="eyebrow">'+esc(t('ck_title'))+'</span><small class="mut">'+esc(t('ck_cycle').replace('{c}',k.c+1).replace('{n}',k.n))+'</small></div>'+
   (done?'<span class="tag">✅ '+esc(t('ck_done'))+'</span>':'<button class="btn gold ck-go" data-act="ckgo">📅 '+esc(t('ck_btn'))+'</button>')+'</div>'+
   '<div class="ck-grid">';for(var d=1;d<=CK_N;d++)h+=ckCell(d,k);
  return h+'</div><small class="mut">'+esc(t('ck_sub'))+'</small></section>'}
function ckModal(md){if(md.kind!=='ckpick')return null;var k=ckState(S);
  return {wide:true,body:'<h2>'+esc(t('ck_choose'))+'</h2><div class="ck-pick">'+CK_TABLE[30].choice.map(function(g){var id=ckItem(CL.uid||'',k.c,30,ITEM,g),it=ITEM[id];if(!it)return '';
    return '<div class="ck-opt"><span class="ck-big">'+itemThumb(it)+'</span><b>'+esc(t('ck_'+g))+'</b><small>'+esc(tx(it.names))+'</small><span class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span><button class="btn" data-act="ckpick" data-id="'+g+'">'+esc(t('ck_pick'))+'</button></div>'}).join('')+'</div><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button>'}}
function ckDo(grp){if(!S.created||ckToday())return;var k=ckState(S),day=k.n+1;if(CK_TABLE[day].choice&&!grp){UI.modal={kind:'ckpick'};render();return}
  var e=bCk(S,CL.uid||'',day,ITEM,grp);commitEv(e);save();sfx('win');
  showReward(t('ck_got').replace('{n}',day),{lines:[['coin',e.cc],['gems',e.cg]].filter(function(x){return x[1]>0}),ups:[]},e.item?[e.item]:[])}
function ckAct(a,id){if((a==='ckgo'||a==='ckpick')&&typeof cloudWait==='function'&&cloudWait()){toast(t('sy_wait'));return true}if(a==='ckgo'){ckDo();return true}if(a==='ckpick'){UI.modal=null;ckDo(id);return true}return false}

/* ---------- AUTO CHECK-IN EVENT: online 19:00–20:00 on 18–30 Nov → 10 tickets once a day (rules: EVA in ledger.js) ---------- */
Object.assign(L,{eva_t:m('🎟️ เช็คชื่ออัตโนมัติ ช่วงค่ำ','🎟️ Evening auto check-in','🎟️ 晚间自动签到'),
 eva_d:m('เข้าเล่นช่วง 19:00–20:00 น. ทุกวัน ถึง 30 พ.ย. รับตั๋วฟรี {n} ใบ อัตโนมัติ (วันละครั้ง)','Play between 19:00 and 20:00 every day until 30 Nov to get {n} free tickets automatically (once a day)','11月30日前每天19:00–20:00上线,自动获得 {n} 张免费召唤券(每天一次)'),
 eva_ok:m('วันนี้ได้รับแล้ว ✓','Got today’s tickets ✓','今天已领取 ✓'),eva_now:m('เปิดอยู่ตอนนี้!','On now!','正在进行!'),eva_wait:m('เริ่ม 19:00 น.','Starts at 19:00','19:00 开始'),eva_end:m('วันนี้หมดเวลาแล้ว พรุ่งนี้มาใหม่','Over for today — come back tomorrow','今天已结束,明天再来'),
 eva_got:m('เช็คชื่ออัตโนมัติ! ได้ตั๋วฟรี {n} ใบ','Auto check-in! {n} free tickets','自动签到!获得 {n} 张免费券')});
function evaTick(){if(!S.created||typeof EVA==='undefined'||CL.loggedOut)return;if(typeof cloudWait==='function'&&cloudWait())return;if(CL.adopting)return;
  var now=Date.now(),d=evaDayOf(now);if(!evaNow(now)||(S.eva&&S.eva[d]))return;
  commitEv({k:'eva',day:d,tk:EVA.tk});save();toast('🎟️ '+t('eva_got').replace('{n}',EVA.tk));sfx('lvl');if(typeof forcePushNow==='function')forcePushNow();else if(typeof push==='function')push();render()}
setInterval(evaTick,20000);setTimeout(evaTick,5000);
function evaHtml(){if(!S.created||typeof EVA==='undefined')return '';var now=Date.now(),d=evaDayOf(now);if(d<EVA.from||d>EVA.to)return '';
  var b=new Date(now+7*36e5),h=b.getUTCHours(),got=S.eva&&S.eva[d],st=got?t('eva_ok'):h<EVA.h0?t('eva_wait'):h>=EVA.h1?t('eva_end'):t('eva_now');
  return '<section class="panel eva-panel'+(got?' got':h>=EVA.h0&&h<EVA.h1?' live':'')+'"><div class="eva-ic" aria-hidden="true">🎟️</div><div class="stack" style="gap:2px;min-width:0"><b>'+esc(t('eva_t'))+'</b><small>'+esc(t('eva_d').replace('{n}',EVA.tk))+'</small></div><span class="tag">'+esc(st)+'</span></section>'}
