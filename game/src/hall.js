/* =====================================================================
   HALL OF FAME + PROFILES
   · Each player keeps a small public card in board/{pid}: name, look,
     level, this week's EXP, coins, number of fashion items, what they
     chose to show, their profile background — plus 👍 / ❤️ from others
     (each visitor can only set their own mark).
   · The village page shows three weekly boards (EXP this week, richest,
     most fashion items), 10 names each, one person on one board only.
   · Profile backgrounds are bought with coins (a ledger event, checked
     by the anti-cheat) — no uploads, only designs from the game.
   ===================================================================== */
Object.assign(L,{hf_title:m('🏆 ทำเนียบประจำสัปดาห์','🏆 Hall of Fame this week','🏆 本周名人堂'),hf_week:m('สัปดาห์ {a} – {b}','Week {a} – {b}','本周 {a} – {b}'),
 hf_exp:m('⚡ ขยันที่สุด (EXP สะสม)','⚡ Hardest workers (total EXP)','⚡ 最勤奋(累计经验)'),hf_coin:m('💰 เศรษฐีหมู่บ้าน','💰 Richest villagers','💰 村中富豪'),hf_fash:m('👗 ราชาแฟชั่น','👗 Fashion stars','👗 时尚之星'),
 hf_empty:m('ยังไม่มีใครติดบอร์ด มาเป็นคนแรกกัน!','No one here yet. Be the first!','还没有人上榜,快来当第一!'),hf_refresh:m('อัปเดต','Refresh','刷新'),hf_note:m('1 คนติดได้บอร์ดเดียว · นับตั้งแต่เริ่มเล่น · กดชื่อเพื่อดูโปรไฟล์','One person per board · counted since each player started · tap a name to see the profile','每人只上一个榜 · 从开始游戏起累计 · 点名字看资料'),hf_fill:m('🔄 ดึงข้อมูลนักเรียนทุกคน','🔄 Load every student','🔄 载入全部学生'),hf_filled:m('อัปเดตทำเนียบจากข้อมูลนักเรียน {n} คนแล้ว','Hall updated from {n} students','已用 {n} 名学生数据更新'),pf_xp:m('EXP สะสม','Total EXP','累计经验'),
 hf_items:m('{n} ชิ้น','{n} items','{n} 件'),hf_loading:m('กำลังโหลดทำเนียบ…','Loading…','加载中…'),
 pf_title:m('โปรไฟล์','Profile','个人资料'),pf_like:m('ถูกใจ','Like','赞'),pf_heart:m('หัวใจ','Heart','爱心'),pf_edit:m('✏️ แต่งโปรไฟล์','✏️ Edit profile','✏️ 编辑资料'),pf_mine:m('นี่คือโปรไฟล์ของคุณ','This is your profile','这是你的资料'),
 pf_lv:m('เลเวล','Level','等级'),pf_wexp:m('EXP สัปดาห์นี้','EXP this week','本周经验'),pf_coin:m('เหรียญ','Coins','金币'),pf_fash:m('ไอเทมแฟชั่น','Fashion items','时尚道具'),pf_words:m('คำที่จำได้','Words learned','已记单词'),pf_streak:m('วันต่อเนื่อง','Day streak','连续天数'),pf_titlek:m('ฉายา','Title','称号'),
 pf_show:m('เลือกสิ่งที่จะโชว์ในโปรไฟล์','Choose what your profile shows','选择资料展示内容'),pf_showh:m('สิ่งที่ปิดไว้จะไม่โชว์ในโปรไฟล์และจะไม่ขึ้นบอร์ดนั้น','Hidden things don\'t show on your profile, and you won\'t appear on that board','隐藏的内容不会显示,也不会上对应的榜'),
 pf_bg:m('🖼️ พื้นหลังโปรไฟล์','🖼️ Profile background','🖼️ 资料背景'),pf_bgh:m('ซื้อด้วยเหรียญจากการทำภารกิจ แล้วเลือกใส่ให้เพื่อน ๆ เห็นเวลามาเยี่ยม','Buy with coins from your quests, then put it on for visitors to see','用任务金币购买,装上给来访的朋友看'),pf_none:m('ไม่ใส่','None','不用'),
 pf_use:m('ใช้','Use','使用'),pf_using:m('ใช้อยู่','In use','使用中'),pf_buy:m('ซื้อ {p} 🪙','Buy {p} 🪙','购买 {p} 🪙'),pf_nocoin:m('เหรียญไม่พอ','Not enough coins','金币不足'),pf_bought:m('ได้พื้นหลังใหม่แล้ว!','New background unlocked!','获得新背景!'),
 pf_saved:m('บันทึกโปรไฟล์แล้ว','Profile saved','资料已保存'),pf_err:m('โหลดโปรไฟล์ไม่ได้ ลองใหม่อีกครั้ง','Couldn\'t load the profile, please try again','无法加载资料,请重试'),pf_gone:m('ยังไม่มีโปรไฟล์','No profile yet','暂无资料'),pf_hide:m('🙈 ซ่อนจากทำเนียบ','🙈 Hide from the boards','🙈 从榜单隐藏'),pf_unhide:m('👁 แสดงในทำเนียบ','👁 Show on the boards','👁 显示在榜单'),
 pf_visit:m('เยี่ยมชมโปรไฟล์','Visit profile','访问资料'),pf_selfnote:m('กดไลก์ให้ตัวเองไม่ได้นะ','You can\'t like your own profile','不能给自己点赞')});

/* ---------- profile backgrounds (original designs) ---------- */
var PBG=[
 {id:'pb01',p:300,n:m('ฟ้ายามเช้า','Morning Sky','晨空'),bg:'linear-gradient(180deg,#8fd3ff,#e8f7ff 70%,#fff6d8)',art:'cloud'},
 {id:'pb02',p:300,n:m('ทุ่งหญ้าสีเขียว','Green Meadow','青草地'),bg:'linear-gradient(180deg,#bfe9ff,#e9fbe6 55%,#8fd17c)',art:'hill'},
 {id:'pb03',p:600,n:m('ทะเลใส','Clear Sea','清澈海洋'),bg:'linear-gradient(180deg,#9ee6ff,#36b4e8 60%,#1772b8)',art:'wave'},
 {id:'pb04',p:600,n:m('สวนดอกไม้บาน','Blooming Garden','繁花园'),bg:'linear-gradient(180deg,#ffe3f1,#fff6fb 60%,#ffd1e6)',art:'petal'},
 {id:'pb05',p:1000,n:m('ป่าไผ่เงียบสงบ','Quiet Bamboo','静竹林'),bg:'linear-gradient(180deg,#e7f7da,#bfe3a7 60%,#5fa35a)',art:'bamboo'},
 {id:'pb06',p:1000,n:m('ท้องฟ้ายามเย็น','Sunset Glow','晚霞'),bg:'linear-gradient(180deg,#ff9a7b,#ffcf86 55%,#7a5cff)',art:'sun'},
 {id:'pb07',p:2000,n:m('คืนดาวพราว','Starry Night','繁星夜'),bg:'linear-gradient(180deg,#0b1240,#24307a 60%,#4a3a9a)',art:'star',dark:true},
 {id:'pb08',p:2000,n:m('เมืองนีออน','Neon City','霓虹城'),bg:'linear-gradient(180deg,#1a0b3a,#4a1a7a 55%,#ff3fa4)',art:'city',dark:true},
 {id:'pb09',p:3500,n:m('แสงเหนือ','Aurora','极光'),bg:'linear-gradient(180deg,#071a2f,#0f4b5c 50%,#3be0a8)',art:'aurora',dark:true},
 {id:'pb10',p:3500,n:m('ลายมังกรทอง','Golden Dragon Scales','金龙鳞'),bg:'linear-gradient(135deg,#8a0f12,#d32f2f 50%,#ffb300)',art:'scale',dark:true},
 {id:'pb11',p:5000,n:m('จักรวาลกาแล็กซี','Galaxy','银河'),bg:'radial-gradient(circle at 30% 30%,#ff7ad9,transparent 35%),radial-gradient(circle at 75% 60%,#5ad1ff,transparent 40%),linear-gradient(135deg,#120a2e,#2b0f5c)',art:'star',dark:true},
 {id:'pb12',p:5000,n:m('วิมานทองคำ','Golden Palace','黄金宫殿'),bg:'linear-gradient(180deg,#fff3c4,#ffd54f 55%,#b8860b)',art:'ray'}];
var PBG_MAP={};PBG.forEach(function(b){PBG_MAP[b.id]=b});
function pbgArt(b){var a=b.art,s='';
  if(a==='cloud'||a==='hill'){s='<path d="M20 70c0-12 18-16 26-8 6-14 30-12 32 4 14-2 18 16 4 18H26c-8 0-10-10-6-14z" fill="#fff" opacity=".85"/><path d="M230 50c0-9 14-12 20-6 5-10 22-9 24 3 10-1 13 12 3 13h-42c-6 0-8-7-5-10z" fill="#fff" opacity=".7"/>';if(a==='hill')s+='<path d="M0 150c60-40 120-40 170-10s90 20 130-5v45H0z" fill="#6cc25a" opacity=".7"/>'}
  else if(a==='wave'){for(var i=0;i<3;i++)s+='<path d="M0 '+(110+i*18)+'q25-12 50 0t50 0 50 0 50 0 50 0 50 0v60H0z" fill="#fff" opacity="'+(.18+i*.08)+'"/>'}
  else if(a==='petal'){for(var j=0;j<14;j++){var x=(j*47)%300,y=(j*29)%160;s+='<ellipse cx="'+x+'" cy="'+y+'" rx="5" ry="3" fill="#ff8fc0" opacity=".7" transform="rotate('+(j*37)+' '+x+' '+y+')"/>'}}
  else if(a==='bamboo'){for(var k=0;k<7;k++){var bx=10+k*44;s+='<rect x="'+bx+'" y="0" width="8" height="180" fill="#3f8f3c" opacity=".35"/>';for(var q=0;q<5;q++)s+='<rect x="'+(bx-1)+'" y="'+(q*38+10)+'" width="10" height="2" fill="#2e6b2c" opacity=".4"/>'}}
  else if(a==='sun'){s='<circle cx="220" cy="120" r="34" fill="#fff3b0" opacity=".85"/><path d="M0 150h300v30H0z" fill="#5a3fbf" opacity=".35"/>'}
  else if(a==='star'){for(var st=0;st<40;st++){var sx=(st*67)%300,sy=(st*41)%175,r=st%5===0?1.8:.9;s+='<circle cx="'+sx+'" cy="'+sy+'" r="'+r+'" fill="#fff" opacity="'+(.5+(st%3)*.2)+'"/>'}}
  else if(a==='city'){for(var c=0;c<12;c++){var h=40+((c*37)%70),cx=c*26;s+='<rect x="'+cx+'" y="'+(180-h)+'" width="22" height="'+h+'" fill="#12062a" opacity=".85"/><rect x="'+(cx+5)+'" y="'+(186-h)+'" width="4" height="4" fill="#ffd3f0"/><rect x="'+(cx+13)+'" y="'+(196-h)+'" width="4" height="4" fill="#7af3ff"/>'}}
  else if(a==='aurora'){s='<path d="M-10 60C60 20 120 90 180 50s100-10 130 10" stroke="#5affc6" stroke-width="22" fill="none" opacity=".35"/><path d="M-10 85C70 50 130 110 200 70s90 0 120 20" stroke="#8a7bff" stroke-width="14" fill="none" opacity=".35"/>'}
  else if(a==='scale'){for(var ry=0;ry<7;ry++)for(var rx=0;rx<12;rx++){var px=rx*26+(ry%2?13:0),py=ry*26;s+='<path d="M'+(px-13)+' '+py+'a13 13 0 0 0 26 0" fill="none" stroke="#ffe082" stroke-width="2" opacity=".45"/>'}}
  else if(a==='ray'){for(var ra=0;ra<14;ra++)s+='<path d="M150 200L'+(ra*24-20)+' -10L'+(ra*24-8)+' -10Z" fill="#fff" opacity=".18"/>'}
  return '<svg class="pbg-art" viewBox="0 0 300 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+s+'</svg>'}
function pbgStyle(id){var b=PBG_MAP[id];return b?'background:'+b.bg:''}

/* ---------- my public card ---------- */
var HF={rows:null,t:0,busy:false,last:'',lastT:0,prof:null};
function weekKey(){return 'w'+bkkWeek().replace(/-/g,'')}
function weeklyXp(){var wk=bkkWeek(),n=0;(S.log||[]).forEach(function(e){if(e&&e.r&&typeof e.t==='number'&&bkkWeek(e.t)===wk)n+=Math.max(0,int(e.r.exp,0,1e9,0))});return n}
function fashCount(){return Object.keys(S.owned||{}).filter(function(id){return ITEM[id]&&S.owned[id]>0}).length}
function pfShow(){var d={wexp:true,coin:true,fash:true,words:true,streak:true,title:true},o=isO(S.set.pshow)?S.set.pshow:{};Object.keys(d).forEach(function(k){if(o[k]===false)d[k]=false});return d}
/* total EXP earned since the start = all the levels passed + EXP in the current level */
function totalXp(st){var l=int(st.lvl,1,999,1),n=Math.max(0,int(st.exp,0,1e12,0));for(var i=1;i<l;i++)n+=expNeed(i);return n}
function myCard(){var c={n:S.name,lv:S.lvl,look:myLook(),coin:S.coin,fash:fashCount(),words:learnedCount(),streak:S.streak.days,xp:totalXp(S),wk:bkkWeek(),show:pfShow(),bg:PBG_MAP[S.set.pbg]&&(S.pbg||{})[S.set.pbg]?S.set.pbg:'',adm:!!CL.admin};c[weekKey()]=weeklyXp();return c}
/* the teacher's game fills in cards for every student (from their saves), so the hall counts everyone from the start,
   not only those who opened the game since the hall was added; it never touches the student's own choices, 👍/❤️ or "hide" */
function cardOf(p){var st=p.d&&isO(p.d.state)?p.d.state:null;if(!st||!st.created||!st.name)return null;var eq={};if(isO(st.eq))Object.keys(st.eq).forEach(function(k){if(typeof st.eq[k]==='string')eq[k]=st.eq[k]});
  var own=isO(st.owned)?st.owned:{},tt='';try{tt=shownTitle(st)}catch(e){}
  return {n:str(st.name,16),lv:int(st.lvl,1,999,1),look:{name:str(st.name,16),lvl:int(st.lvl,1,999,1),g:st.gender==='M'?'M':'F',cls:CLASSES[st.cls]?st.cls:'mage',eq:eq,tt:tt,ta:!(st.set&&st.set.taura===false),vip:0},
    coin:int(st.coin,0,1e12,0),fash:Object.keys(own).filter(function(id){return ITEM[id]&&own[id]>0}).length,words:learnedCount(st),streak:int(st.streak&&st.streak.days,0,1e5,0),xp:totalXp(st),t:Date.now()}}
var HF_FILL={done:false,busy:false};
function hfBackfill(manual){if(!CL.admin||!CL.db||!Array.isArray(CL.players)||HF_FILL.busy||(HF_FILL.done&&!manual))return;HF_FILL.busy=true;
  var list=CL.players.filter(function(p){return p&&IDRE.test(p.id)&&p.id!==CL.uid}).map(function(p){return [p.id,cardOf(p)]}).filter(function(x){return x[1]}),i=0,n=0;
  (function next(){if(i>=list.length){HF_FILL.busy=false;HF_FILL.done=true;HF.t=0;hfLoad(true);if(manual)toast(t('hf_filled').replace('{n}',n));return}var x=list[i++];
    CL.db.doc('board/'+x[0]).set(x[1],{merge:true}).then(function(){n++;setTimeout(next,60)},function(){setTimeout(next,60)})})()}
setInterval(function(){if(CL.admin&&Array.isArray(CL.players)&&CL.players.length&&!HF_FILL.done)hfBackfill()},15000);
function boardSync(force){if(!CL.db||!CL.uid||!S.created||CL.ban)return;var c=myCard(),j=JSON.stringify(c);if(!force&&(j===HF.last||Date.now()-HF.lastT<60000))return;HF.last=j;HF.lastT=Date.now();
  c.t=Date.now();try{CL.db.doc('board/'+CL.uid).set(c,{merge:true}).catch(function(){HF.last=''})}catch(e){}}
setInterval(function(){boardSync()},90000);setTimeout(function(){boardSync(true)},8000);

/* ---------- the three boards ---------- */
function hfLoad(force){if(!CL.db||HF.busy)return;if(!force&&HF.rows&&Date.now()-HF.t<10*60000)return;HF.busy=true;var col=CL.db.collection('board'),wk=weekKey(),q=function(f){try{return col.orderBy(f,'desc').limit(40).get()}catch(e){return Promise.resolve({docs:[]})}};
  Promise.all([q('xp'),q('coin'),q('fash')]).then(function(res){
    /* candidates per board, best first */
    var spec=[['xp','wexp'],['coin','coin'],['fash','fash']],cand=res.map(function(snap,i){var f=spec[i][0],sk=spec[i][1],l=[];(snap&&snap.docs||[]).forEach(function(d){var x=d.data?d.data():d;if(!x||!IDRE.test(d.id)||x.adm||x.hid)return;
      var v=int(x[f],0,1e12,0);if(v<=0||(x.show&&x.show[sk]===false))return;l.push({id:d.id,v:v,d:x})});return l});
    /* one person, one board: fill rank by rank, taking turns, so every board gets its own leader first */
    var used={},out=[[],[],[]],ptr=[0,0,0],more=true;
    while(more){more=false;for(var b=0;b<3;b++){if(out[b].length>=10)continue;while(ptr[b]<cand[b].length&&used[cand[b][ptr[b]].id])ptr[b]++;if(ptr[b]<cand[b].length){var c=cand[b][ptr[b]++];used[c.id]=1;out[b].push(c);more=true}}}
    HF.rows=out;HF.t=Date.now();HF.busy=false;softRender()},function(){HF.busy=false;HF.rows=HF.rows||[[],[],[]];softRender()})}
function hfLikes(d){var c=function(m){return isO(m)?Object.keys(m).filter(function(k){return m[k]===1}).length:0};return {lk:c(d.lk),ht:c(d.ht)}}
function hfBoard(key,list,fmt){var md=['🥇','🥈','🥉'];return '<div class="hf-col"><h3>'+esc(t(key))+'</h3>'+(list.length?'<ol class="hf-list">'+list.map(function(r,i){var lk=hfLikes(r.d);
    return '<li><button class="hf-row'+(i<3?' top':'')+'" data-act="hfopen" data-id="'+esc(r.id)+'"><span class="hf-rank">'+(md[i]||(i+1))+'</span>'+(i<3?'<span class="hf-av" aria-hidden="true">'+townAvatar({d:r.d.look||{}})+'</span>':'')+
     '<span class="hf-nm"><b>'+esc(str(r.d.n,16))+'</b><small class="mut">'+esc(t('pf_lv'))+' '+int(r.d.lv,1,999,1)+(lk.lk||lk.ht?' · 👍'+lk.lk+' ❤️'+lk.ht:'')+'</small></span><span class="hf-v num">'+esc(fmt(r.v))+'</span></button></li>'}).join('')+'</ol>':'<small class="mut">'+esc(t('hf_empty'))+'</small>')+'</div>'}
function hallHtml(){hfLoad();var wk=bkkWeek(),end=bkkDay(Date.parse(wk+'T00:00:00Z')+6*864e5-7*36e5),rows=HF.rows;
  var h='<section class="panel stack hof"><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px"><div class="stack" style="gap:2px"><span class="eyebrow">'+esc(t('hf_title'))+'</span><small class="mut">'+esc(t('hf_week').replace('{a}',nwDate(wk)).replace('{b}',nwDate(end)))+'</small></div><div class="row" style="gap:6px">'+(CL.admin?'<button class="btn sec sm" data-act="hffill">'+esc(t('hf_fill'))+'</button>':'')+'<button class="btn sec sm" data-act="hfrefresh">↻ '+esc(t('hf_refresh'))+'</button></div></div>';
  if(!rows)return h+'<small class="mut">'+esc(t('hf_loading'))+'</small></section>';
  h+='<div class="hf-grid">'+hfBoard('hf_exp',rows[0],function(v){return v+' EXP'})+hfBoard('hf_coin',rows[1],function(v){return v.toLocaleString()+' 🪙'})+hfBoard('hf_fash',rows[2],function(v){return t('hf_items').replace('{n}',v)})+'</div>';
  return h+'<small class="mut">'+esc(t('hf_note'))+'</small></section>'}

/* ---------- profile view ---------- */
function pfOpen(pid){if(!CL.db||!IDRE.test(pid||''))return;UI.modal={kind:'pfv',pid:pid,d:null,loading:true};render();
  if(pid===CL.uid)boardSync(true);
  /* my own profile always opens from my own game data (even before the card reaches the database) */
  var mine=pid===CL.uid,fill=function(d){if(!UI.modal||UI.modal.kind!=='pfv'||UI.modal.pid!==pid)return;UI.modal.d=mine?Object.assign({},d||{},myCard()):d;UI.modal.loading=false;render()};
  if(mine)fill(null);
  CL.db.doc('board/'+pid).get().then(function(s){fill(s&&s.exists?s.data():null)},function(){if(mine)return;if(UI.modal&&UI.modal.kind==='pfv'){UI.modal.loading=false;UI.modal.err=true;render()}})}
function heroBg(){var b=PBG_MAP[S.set.pbg];return b&&(S.pbg||{})[b.id]?b:null}
function pfStat(icon,label,val){return '<div class="pf-stat"><span aria-hidden="true">'+icon+'</span><b class="num">'+esc(String(val))+'</b><small>'+esc(t(label))+'</small></div>'}
function pfModal(md){if(md.kind==='hfedit')return pfEditModal(md);if(md.kind!=='pfv')return null;var d=md.d;
  if(md.loading)return {body:'<h2>'+esc(t('pf_title'))+'</h2><p class="mut">'+esc(t('hf_loading'))+'</p>'};
  if(!d)return {body:'<h2>'+esc(t('pf_title'))+'</h2><p class="mut">'+esc(md.err?t('pf_err'):t('pf_gone'))+'</p><button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button>'};
  var sh=isO(d.show)?d.show:{},look=isO(d.look)?d.look:{},mine=md.pid===CL.uid,lk=hfLikes(d),iLk=isO(d.lk)&&d.lk[CL.uid]===1,iHt=isO(d.ht)&&d.ht[CL.uid]===1,b=PBG_MAP[d.bg],tt=TITLE[look.tt];
  var st={eq:isO(look.eq)?look.eq:{}};
  var h='<div class="pf-card'+(b&&b.dark?' dark':'')+'" style="'+esc(pbgStyle(d.bg)||'')+'">'+(b?pbgArt(b):'')+'<div class="pf-stage">'+townAvatar({d:look})+stageFrame(st)+'</div>'+
   '<div class="pf-id"><h2>'+esc(str(d.n,16))+'</h2><div class="pf-sub">'+esc(t('pf_lv'))+' '+int(d.lv,1,999,1)+(look.vip>0?' · 👑 VIP '+int(look.vip,0,10,0):'')+'</div>'+(sh.title!==false&&tt?'<div class="pf-tt">🎖️ '+esc(tx(tt.names))+'</div>':'')+'</div></div>';
  var stats=[];if(sh.wexp!==false){stats.push(pfStat('⚡','pf_xp',int(d.xp,0,1e12,0)));stats.push(pfStat('📅','pf_wexp',int(d[weekKey()],0,1e12,0)))}if(sh.coin!==false)stats.push(pfStat('💰','pf_coin',int(d.coin,0,1e12,0).toLocaleString()));
  if(sh.fash!==false)stats.push(pfStat('👗','pf_fash',int(d.fash,0,1e6,0)));if(sh.words!==false)stats.push(pfStat('📚','pf_words',int(d.words,0,1e6,0)));if(sh.streak!==false)stats.push(pfStat('🔥','pf_streak',int(d.streak,0,1e5,0)));
  h+=(stats.length?'<div class="pf-stats">'+stats.join('')+'</div>':'');
  h+='<div class="row pf-react" style="justify-content:center;gap:10px"><button class="btn sec'+(iLk?' on':'')+'" data-act="hflike" data-id="lk"'+(mine?' disabled title="'+esc(t('pf_selfnote'))+'"':'')+'>👍 '+esc(t('pf_like'))+' <b class="num">'+lk.lk+'</b></button><button class="btn sec'+(iHt?' on':'')+'" data-act="hflike" data-id="ht"'+(mine?' disabled title="'+esc(t('pf_selfnote'))+'"':'')+'>❤️ '+esc(t('pf_heart'))+' <b class="num">'+lk.ht+'</b></button></div>';
  h+='<div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap">'+(mine?'<button class="btn" data-act="hfedit">'+esc(t('pf_edit'))+'</button>':'')+(CL.admin&&!mine?'<button class="btn sec" data-act="hfhide">'+esc(d.hid?t('pf_unhide'):t('pf_hide'))+'</button>':'')+'<button class="btn sec" data-act="closemodal">'+esc(t('ok'))+'</button></div>';
  return {body:h,wide:true}}
/* ---------- edit my profile ---------- */
function pfEditModal(md){var sh=pfShow(),own=S.pbg||{},cur=S.set.pbg||'';
  var h='<h2>'+esc(t('pf_edit'))+'</h2><div class="stack" style="text-align:left;gap:6px"><b>'+esc(t('pf_show'))+'</b><small class="mut">'+esc(t('pf_showh'))+'</small><div class="pf-toggles">'+
   [['wexp','⚡','pf_xp'],['coin','💰','pf_coin'],['fash','👗','pf_fash'],['words','📚','pf_words'],['streak','🔥','pf_streak'],['title','🎖️','pf_titlek']].map(function(x){return '<label class="pf-tg"><input type="checkbox" class="pf-sh" data-k="'+x[0]+'"'+(sh[x[0]]?' checked':'')+'> '+x[1]+' '+esc(t(x[2]))+'</label>'}).join('')+'</div>'+
   '<b style="margin-top:8px">'+esc(t('pf_bg'))+'</b><small class="mut">'+esc(t('pf_bgh'))+' · 🪙 '+S.coin.toLocaleString()+'</small><div class="pbg-grid">'+
   '<div class="pbg-card'+(cur?'':' on')+'"><div class="pbg-prev" style="background:rgba(127,127,127,.08)"></div><b>'+esc(t('pf_none'))+'</b>'+(cur?'<button class="mini" data-act="hfbguse" data-id="">'+esc(t('pf_use'))+'</button>':'<small>'+esc(t('pf_using'))+'</small>')+'</div>'+
   PBG.map(function(b){var has=!!own[b.id],on=cur===b.id;return '<div class="pbg-card'+(on?' on':'')+'"><div class="pbg-prev" style="background:'+esc(b.bg)+'">'+pbgArt(b)+'</div><b>'+esc(tx(b.n))+'</b>'+
     (on?'<small>✅ '+esc(t('pf_using'))+'</small>':has?'<button class="mini" data-act="hfbguse" data-id="'+b.id+'">'+esc(t('pf_use'))+'</button>':'<button class="mini'+(S.coin<b.p?' dis':'')+'" data-act="hfbgbuy" data-id="'+b.id+'">'+esc(t('pf_buy').replace('{p}',b.p.toLocaleString()))+'</button>')+'</div>'}).join('')+'</div></div>'+
   '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn" data-act="hfdone">'+esc(t('ok'))+'</button></div>';
  return {body:h,wide:true}}
function pfLike(kind){var md=UI.modal;if(!md||md.kind!=='pfv'||!md.d||md.pid===CL.uid||!CL.db)return;var m0=isO(md.d[kind])?md.d[kind]:{},on=m0[CL.uid]!==1,o={};o[kind]={};o[kind][CL.uid]=on?1:0;
  md.d[kind]=Object.assign({},m0);md.d[kind][CL.uid]=on?1:0;render();if(on)sfx('ok');
  CL.db.doc('board/'+md.pid).set(o,{merge:true}).catch(function(){md.d[kind][CL.uid]=on?0:1;toast(t('sy_err'));render()})}
function buyPbg(id){var b=PBG_MAP[id];if(!b||(S.pbg||{})[id])return;if(S.coin<b.p){toast(t('pf_nocoin'));return}
  commitEv({k:'pbg',id:id,price:b.p});S.set.pbg=id;save();sfx('ok');toast('🖼️ '+t('pf_bought'));boardSync(true);render()}
function hallAct(a,id){
  if(a==='hfrefresh'){hfLoad(true);toast('↻');return true}
  if(a==='hffill'){if(!Array.isArray(CL.players)&&typeof ensurePlayers==='function'){ensurePlayers();toast('…');setTimeout(function(){hfBackfill(true)},4000);return true}hfBackfill(true);return true}
  if(a==='hfopen'){pfOpen(id);return true}
  if(a==='hfme'){pfOpen(CL.uid);return true}
  if(a==='hflike'){pfLike(id==='ht'?'ht':'lk');return true}
  if(a==='hfedit'){UI.modal={kind:'hfedit'};render();return true}
  if(a==='hfbgbuy'){buyPbg(id);return true}
  if(a==='hfbguse'){if(!id||(S.pbg||{})[id]){S.set.pbg=id||'';save();boardSync(true);render()}return true}
  if(a==='hfdone'){boardSync(true);HF.t=0;pfOpen(CL.uid);toast(t('pf_saved'));return true}
  if(a==='hfhide'){var md=UI.modal;if(CL.admin&&md&&md.kind==='pfv'&&md.d){var hid=!md.d.hid;CL.db.doc('board/'+md.pid).set({hid:hid},{merge:true}).then(function(){md.d.hid=hid;HF.t=0;render()},writeErr)}return true}
  return false}
document.addEventListener('change',function(e){var el=e.target;if(el&&el.classList&&el.classList.contains('pf-sh')){var o=isO(S.set.pshow)?Object.assign({},S.set.pshow):{};o[el.dataset.k]=el.checked;S.set.pshow=o;save()}});
