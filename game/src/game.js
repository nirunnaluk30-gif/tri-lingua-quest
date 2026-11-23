/* =====================================================================
   CONTENT: cleaning + indexing (db documents are untrusted input)
   ===================================================================== */
var STORE='TRILINGUA_PLAY_V1';
var IDRE=/^[A-Za-z0-9_-]{1,40}$/;
function isO(o){return o&&typeof o==='object'&&!Array.isArray(o)}
function int(n,lo,hi,def){n=Math.floor(Number(n));if(!isFinite(n))n=def===undefined?lo:def;return Math.max(lo,Math.min(hi,n))}
function str(x,max){return typeof x==='string'?x.trim().slice(0,max||120):(typeof x==='number'?String(x).slice(0,max||120):'')}
function hex(c,def){return typeof c==='string'&&/^#[0-9a-fA-F]{6}$/.test(c)?c.toLowerCase():def}
function tri(o,max){o=isO(o)?o:{};return {th:str(o.th,max),en:str(o.en,max),zh:str(o.zh,max)}}
function triOk(o){return !!(o.th||o.en||o.zh)}
function rew(o){o=isO(o)?o:{};var r={};['exp','coin','gems','tickets'].forEach(function(k){var v=int(o[k],0,1e6,0);if(v)r[k]=v});return r}
function idList(a,max){return Array.isArray(a)?a.filter(function(x,i,arr){return typeof x==='string'&&IDRE.test(x)&&arr.indexOf(x)===i}).slice(0,max||100):[]}
var CLEAN={
 units:function(d){if(!triOk(tri(d.names)))return null;var o={id:d.id,order:int(d.order,0,9999,99),names:tri(d.names)};var fc=Array.isArray(d.focus)?d.focus.filter(function(l,i,a){return LANGS.indexOf(l)>=0&&a.indexOf(l)===i}):[];if(fc.length)o.focus=fc;return o},
 exams:function(d){var x={id:d.id,g:['s','c','d'].indexOf(d.g)>=0?d.g:'',f:int(d.f,1,10,1),q:typeof d.q==='string'?d.q.trim().slice(0,600):'',o0:str(d.o0,160),o1:str(d.o1,160),o2:str(d.o2,160),o3:str(d.o3,160),a:int(d.a,0,3,0),ex:str(d.ex,300)};
   return x.g&&x.q&&x.o0&&x.o1&&[x.o0,x.o1,x.o2,x.o3][x.a]?x:null},
 sents:function(d){var p=function(x,n){return typeof x==='string'?x.replace(/\s*\|\s*/g,'|').trim().slice(0,n):''};var s={id:d.id,w:str(d.w,40),th:p(d.th,200),en:str(d.en,200),zh:p(d.zh,200),py:p(d.py,300)};return s.th&&s.en&&s.zh?s:null},
 words:function(d){var w={id:d.id,u:str(d.u,40),pic:str(d.pic,16),th:str(d.th,80),en:str(d.en,80),zh:str(d.zh,80),py:str(d.py,80)};return w.th&&w.en&&w.zh&&IDRE.test(w.u)?w:null},
 zones:function(d){var b=isO(d.boss)?d.boss:{},sk=Array.isArray(d.sky)?d.sky:[];if(!triOk(tri(d.names)))return null;
  return {id:d.id,order:int(d.order,0,9999,99),names:tri(d.names),desc:tri(d.desc,200),units:idList(d.units,20),boss:{names:tri(b.names),pic:str(b.pic,8)||'👾',color:hex(b.color,'#6b4bd0'),hp:int(b.hp,1,50,6)},sky:[hex(sk[0],'#2f4a8a'),hex(sk[1],'#7f9ad8')],ground:hex(d.ground,'#3c5a4a'),art:typeof d.art==='string'&&ZONE_ARTS[d.art]?d.art:'',img:typeof d.img==='string'&&d.img.length<250000&&(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(d.img)||/^\/_blob\/[A-Za-z0-9_-]{1,80}$/.test(d.img))?d.img:''}},
 items:function(d){if(!CAT[d.cat]||!RAR[d.rar]||!triOk(tri(d.names)))return null;var v=isO(d.v)?d.v:{};var k=str(v.k,20);if(CAT[d.cat].kinds.indexOf(k)<0)k=CAT[d.cat].kinds[0];
  var o={id:d.id,cat:d.cat,rar:d.rar,names:tri(d.names),g:d.g==='M'||d.g==='F'?d.g:null,v:{k:k,a:hex(v.a,'#888888'),b:hex(v.b,'#ffffff')}};if(d.noShop===true||d.noShop==='1')o.noShop=true;if(isBound(o.id)){var DI=DEFAULTS.items.filter(function(x){return x.id===o.id})[0];if(DI){o.cat=DI.cat;o.rar=DI.rar;o.v={k:DI.v.k,a:DI.v.a,b:DI.v.b};o.noShop=true}}return o},
 banners:function(d){var c=Array.isArray(d.c)?d.c:[];if(!triOk(tri(d.names)))return null;var pool=idList(d.pool,400);
  return {id:d.id,order:int(d.order,0,9999,99),names:tri(d.names),sub:tri(d.sub,200),pool:pool,feat:IDRE.test(d.feat||'')?d.feat:(pool[0]||''),c:[hex(c[0],'#4a2f9e'),hex(c[1],'#c04a9e')],off:d.off===true||d.off==='1'}},
 titles:function(d){if(!triOk(tri(d.names)))return null;var r=isO(d.rule)?d.rule:{},n=function(v){return int(v,0,9999,0)};
  return {id:d.id,order:int(d.order,0,9999,99),names:tri(d.names),style:/^t([1-9]|10)$/.test(d.style||'')?d.style:'t1',prev:IDRE.test(d.prev||'')&&d.prev!==d.id?d.prev:'',grant:d.grant===true||d.grant==='1',
   rule:{z:idList(r.z,40),ew:n(r.ew),ep:n(r.ep),tp:n(r.tp),pz:IDRE.test(r.pz||'')?r.pz:'',pn:n(r.pn),dy:n(r.dy),rw:n(r.rw),sp:n(r.sp),vp:n(r.vp)}}},
 shop:function(d){if(!IDRE.test(d.item||''))return null;return {id:d.id,kind:d.kind==='gem'?'gem':'coin',item:d.item,price:int(d.price,1,1e6,10),pin:d.pin===true||d.pin==='1'}},
 story:function(d){var c=isO(d.cond)?d.cond:{};if(!triOk(tri(d.names)))return null;
  return {id:d.id,order:int(d.order,0,9999,99),names:tri(d.names),how:tri(d.how,200),cond:{type:COND_TYPES.indexOf(c.type)>=0?c.type:'level',target:str(c.target,40),n:int(c.n,0,1e6,1)},reward:rew(d.reward)}},
 weekly:function(d){if(!triOk(tri(d.names)))return null;return {id:d.id,order:int(d.order,0,9999,99),names:tri(d.names),key:WEEKLY_KEYS.indexOf(d.key)>=0?d.key:'correct',goal:int(d.goal,1,10000,1),reward:rew(d.reward)}},
 daily:function(d){if(!triOk(tri(d.names)))return null;return {id:d.id,order:int(d.order,0,9999,99),names:tri(d.names),key:DAILY_KEYS.indexOf(d.key)>=0?d.key:'correct',goal:int(d.goal,1,1000,1),reward:rew(d.reward)}},
 npcs:function(d){var l=isO(d.line)?d.line:{};if(!str(d.name,40))return null;
  return {id:d.id,order:int(d.order,0,9999,99),name:str(d.name,40),role:tri(d.role),color:hex(d.color,'#6b6bd0'),lang:LANGS.indexOf(d.lang)>=0?d.lang:'th',line:{th:str(l.th,300),en:str(l.en,300),zh:str(l.zh,300),py:str(l.py,300)}}}
};
function cleanDoc(col,d,id){if(!isO(d))return null;d=Object.assign({},d);d.id=id||d.id;if(!IDRE.test(d.id||''))return null;try{return CLEAN[col](d)}catch(e){return null}}
/* tunnel progress is rebuilt from the ledger so it can't be edited separately */
/* raid participation, raid rewards and this week's quest progress are rebuilt from the ledger too */
function raidFromLog(log){var X={raid:{},raidw:{},rw:0,wq:wqBlank(''),owned:{}};(log||[]).forEach(function(e){if(!isO(e))return;
  if(e.k==='raid'){var r=X.raid[e.rid]||{n:0,ok:0};r.n+=e.n|0;r.ok+=e.ok|0;if(e.sb>0)r.sb=(r.sb|0)+(e.sb|0);if(e.gd>0)r.gd=(r.gd|0)+(e.gd|0);if(Array.isArray(e.su))r.su=(r.su||[]).concat(e.su.filter(function(x){return typeof x==='string'}));X.raid[e.rid]=r}else if(e.k==='skup'){X.sk=X.sk||{};X.sk[e.sk]=e.lv|0}else if(e.k==='skbr'){X.skb=X.skb||{};X.skb[e.t2|0]=e.b;if((e.cost|0)>0)X.skbw=bkkWeek(e.t)}else if(e.k==='raidwin'){X.raidw[e.rid]=e.tier||1;X.rw++}else if(e.k==='weekly'){wqOf(X,e.w).c[e.q]=true}
  weekTrack(X,e)});return X}
function schFromLog(log){var X={sp:0,spD:'',spV:0,raid:{},vipc:{},schc:{}};(log||[]).forEach(function(e){if(!isO(e))return;
  if(e.k==='raid'){var r=X.raid[e.rid]||{n:0,ok:0};r.n+=e.n|0;r.ok+=e.ok|0;X.raid[e.rid]=r}else if(e.k==='vip')X.vipc[e.lv]=1;else if(e.k==='sch')X.schc[e.lv]=1;schTrack(X,e)});return X}
function tnFromLog(log){var X={tn:tnBlank(),tng:{w:tnBlank(),e:tnBlank(),s:tnBlank(),c:tnBlank(),d:tnBlank(),m:tnBlank(),n:tnBlank()},owned:{}};(log||[]).forEach(function(e){if(isO(e)&&(e.k==='tnmon'||e.k==='tnboss'))tnApply(X,e)});return X}
function cleanConfig(o){o=isO(o)?o:{};var c={};CONFIG_META.forEach(function(x){c[x[0]]=int(o[x[0]],x[1],x[2],DEFAULTS.config[x[0]])});if(c.hardPity<c.softPity)c.hardPity=c.softPity;
  /* exchange has no daily limit by default: settings saved before that (no exV2) drop their old limits; a limit the teacher sets later is kept */
  if(o.exV2!==1){c.exGemDay=0;c.exTicketDay=0}c.exV2=1;return c}

var CONTENT={}, SRC={};
COLS.forEach(function(c){CONTENT[c]=DEFAULTS[c];SRC[c]='default'});CONTENT.config=DEFAULTS.config;SRC.config='default';
var SENTS=[],SENT_W={},WEEKLY=[],CFG,UNITS,UNIT_FOCUS={},UNIT_LIST,WORDS,WORD,ZONES,ITEMS,ITEM,BANNERS,COIN_SHOP,GEM_SHOP,STORY,DAILY,NPCS;
function cleanTta(o){var r={};if(isO(o))Object.keys(o).slice(0,200).forEach(function(k){if(IDRE.test(k)&&(o[k]===1||o[k]===-1))r[k]=o[k]});return r}
function byOrder(a,b){return (a.order||0)-(b.order||0)||(a.id<b.id?-1:1)}
function applyContent(){
  CFG=cleanConfig(CONTENT.config);
  UNIT_LIST=CONTENT.units.slice().sort(byOrder);UNITS={};UNIT_FOCUS={};UNIT_LIST.forEach(function(u){UNITS[u.id]=u.names;if(u.focus)UNIT_FOCUS[u.id]=u.focus});
  var uo={};UNIT_LIST.forEach(function(u,i){uo[u.id]=i});
  WORDS=CONTENT.words.slice().sort(function(a,b){return (uo[a.u]===undefined?999:uo[a.u])-(uo[b.u]===undefined?999:uo[b.u])||(a.id<b.id?-1:1)});
  WORD={};WORDS.forEach(function(w){WORD[w.id]=w});
  ZONES=CONTENT.zones.slice().sort(byOrder).map(function(z){return Object.assign({},z,{units:z.units.filter(function(u){return UNITS[u]})})});
  SENTS=(CONTENT.sents||[]).slice();SENT_W={};SENTS.forEach(function(s){(SENT_W[s.w]=SENT_W[s.w]||[]).push(s)});
  ITEMS=CONTENT.items.slice();ITEM={};ITEMS.forEach(function(i){ITEM[i.id]=i});
  BANNERS=CONTENT.banners.slice().sort(byOrder).map(function(b){var p=b.pool.filter(function(id){return ITEM[id]});return Object.assign({},b,{pool:p,feat:ITEM[b.feat]?b.feat:p[0]})}).filter(function(b){return b.pool.length&&!b.off&&!BANNER_ENDED[b.id]});if(typeof rebuildTitles==='function')rebuildTitles();
  var sh=CONTENT.shop.filter(function(e){return ITEM[e.item]}).sort(function(a,b){return a.price-b.price});
  COIN_SHOP=sh.filter(function(e){return e.kind==='coin'});GEM_SHOP=sh.filter(function(e){return e.kind==='gem'});
  STORY=CONTENT.story.slice().sort(byOrder);DAILY=CONTENT.daily.slice().sort(byOrder);WEEKLY=(CONTENT.weekly||[]).slice().sort(byOrder);NPCS=CONTENT.npcs.slice().sort(byOrder);
  if(UI&&UI.banner&&!BANNERS.some(function(b){return b.id===UI.banner}))UI.banner=BANNERS[0]?BANNERS[0].id:'';
}

/* ===================================================================== UI STRINGS */
var L={
 tagline:m('ผจญภัยเรียนสามภาษา ไทย · อังกฤษ · จีน','A three-language adventure: Thai · English · Chinese','三语冒险:泰语 · 英语 · 中文'),
 start:m('เริ่มผจญภัย','Start adventure','开始冒险'),cont:m('เล่นต่อ','Continue','继续'),load:m('มีรหัสเซฟอยู่แล้ว','I have a save code','我有存档码'),
 uilang:m('ภาษาของเมนู','Menu language','菜单语言'),
 n_home:m('หมู่บ้าน','Village','村庄'),n_map:m('แผนที่','Map','地图'),n_quest:m('เควสต์','Quests','任务'),n_wd:m('ตู้เสื้อผ้า','Wardrobe','衣橱'),n_gacha:m('อัญเชิญ','Summon','召唤'),n_shop:m('ร้านค้า','Shop','商店'),n_me:m('ฉัน','Me','我的'),n_admin:m('แอดมิน','Admin','管理'),
 create:m('สร้างตัวละคร','Create your hero','创建角色'),hname:m('ชื่อตัวละคร','Hero name','角色名'),gender:m('เพศ','Gender','性别'),male:m('ชาย','Male','男'),female:m('หญิง','Female','女'),
 cls:m('อาชีพ','Class','职业'),starter:m('ชุดเริ่มต้นฟรี','Free starter outfit','免费初始服装'),go:m('ออกเดินทาง','Begin','出发'),
 learnlangs:m('ภาษาที่อยากฝึก','Languages to practice','想练习的语言'),
 namehint:m('ใช้ชื่อเล่นได้ ไม่ต้องใช้ชื่อจริง','A nickname is fine; no real name needed','用昵称就可以,不需要真名'),
 needname:m('ใส่ชื่อตัวละคร 1–16 ตัวอักษร','Enter a hero name of 1–16 characters','请输入1–16个字符的角色名'),
 lv:m('เลเวล','Level','等级'),exp:m('EXP','EXP','经验'),coin:m('เหรียญ','Coins','金币'),gems:m('เพชร','Gems','宝石'),tickets:m('ตั๋วอัญเชิญ','Summon tickets','召唤券'),
 nextstep:m('ด่านถัดไป','Next stop','下一站'),play:m('เล่น','Play','开始'),review:m('ทบทวนคำศัพท์','Review words','复习单词'),due:m('คำที่ถึงเวลาทบทวน','Words due for review','待复习的词'),
 nodue:m('ยังไม่มีคำที่ต้องทบทวน เล่นบทเรียนเพื่อเก็บคำใหม่','Nothing to review yet. Play a lesson to collect new words.','还没有要复习的词。去上课收集新词吧。'),
 talk:m('คุย','Talk','对话'),villagers:m('ชาวหมู่บ้าน','Villagers','村民'),today:m('ภารกิจวันนี้','Today\'s tasks','今日任务'),
 lesson:m('บทเรียน','Lesson','课程'),boss:m('บอส','Boss','Boss'),locked:m('ยังล็อกอยู่','Locked','未解锁'),
 unlockz:m('ชนะบอสโซนก่อนหน้าเพื่อปลดล็อก','Beat the previous zone\'s boss to unlock','打败上一区域的Boss以解锁'),
 unlockb:m('ผ่านบทเรียนทั้งหมดในโซนก่อน','Clear every lesson in this zone first','先通过本区域所有课程'),unlocku:m('ผ่านบทเรียนก่อนหน้าก่อน','Clear the previous lesson first','先通过上一课'),
 nowords:m('ยังไม่มีคำศัพท์ในบทนี้','No words in this lesson yet','本课还没有单词'),
 cleared:m('ผ่านแล้ว','Cleared','已通过'),defeated:m('ชนะแล้ว','Defeated','已击败'),alldone:m('ผ่านครบทุกด่านแล้ว ทบทวนเพื่อเก็บดาวเพิ่ม','Every stage cleared. Replay to collect more stars.','全部通关!再玩一次收集更多星星'),
 startquiz:m('เริ่มแบบทดสอบ','Start the quiz','开始测验'),tapspeak:m('แตะลำโพงเพื่อฟังเสียง','Tap the speaker to hear it','点喇叭听发音'),
 q_mean:m('คำนี้แปลว่าอะไร?','What does this mean?','这是什么意思?'),q_pic:m('ภาพนี้คือคำไหน?','Which word matches the picture?','哪个词和图片对应?'),
 q_listen:m('ฟังแล้วเลือกความหมาย','Listen, then choose the meaning','听后选择意思'),q_py:m('อ่านพินอินว่าอย่างไร?','Which pinyin is correct?','正确的拼音是哪个?'),q_han:m('ตัวอักษรจีนตัวไหน?','Which Chinese characters?','哪个汉字?'),
 playagain:m('ฟังอีกครั้ง','Play again','再听一遍'),
 right:m('ถูกต้อง!','Correct!','答对了!'),wrong:m('ยังไม่ถูก','Not quite','不对哦'),answer:m('คำตอบ','Answer','答案'),next:m('ต่อไป','Next','下一题'),finish:m('ดูผล','See results','查看结果'),
 result:m('ผลลัพธ์','Results','结果'),score:m('คะแนน','Score','得分'),pass:m('ผ่านด่าน!','Stage cleared!','过关!'),fail:m('เกือบแล้ว ลองอีกครั้ง','So close. Try again','差一点,再试一次'),
 needpct:m('ต้องตอบถูกอย่างน้อย','You need at least','至少需要答对'),
 retry:m('เล่นอีกครั้ง','Play again','再玩一次'),tomap:m('กลับแผนที่','Back to map','返回地图'),home:m('กลับหมู่บ้าน','Back to village','返回村庄'),quit:m('ออก','Quit','退出'),
 rewards:m('รางวัล','Rewards','奖励'),levelup:m('เลเวลอัป!','Level up!','升级了!'),
 combo:m('คอมโบ','Combo','连击'),shield:m('โล่','Shield','护盾'),timeup:m('หมดเวลา!','Time\'s up!','时间到!'),
 win:m('ชนะ!','Victory!','胜利!'),tt_head:m('ฉายาเกียรติยศ','Honour titles','荣誉称号'),tt_hint:m('ฉายาลอยอยู่เหนือหัวตัวละครทุกที่ ได้จากการปราบบอสเมือง 9–13 เท่านั้น ต้องได้ฉายาก่อนหน้าก่อนจึงจะได้ฉายาถัดไป','Titles float above your hero everywhere. Earn them only by beating the bosses of cities 9–13, one after another.','称号会显示在角色头顶。只能通过击败第9–13城的首领依次获得。'),
 tt_prev:m('ได้ฉายาก่อนหน้าก่อน','Earn the title before this one first','先获得上一个称号'),tt_on:m('กำลังแสดง','Showing','显示中'),tt_use:m('ใช้ฉายานี้','Show this','使用此称号'),tt_hide:m('ซ่อนฉายา','Hide title','隐藏称号'),tt_aura:m('แสดงออร่าของฉายารอบตัวละคร','Show the title\'s aura around my hero','在角色周围显示称号光环'),tt_new:m('ได้รับฉายาใหม่!','New title earned!','获得新称号!'),lose:m('พ่ายแพ้','Defeated','失败了'),bossintro:m('ตอบถูกเพื่อโจมตี ตอบผิดเสียหัวใจ','Answer right to attack. A wrong answer costs a heart.','答对就攻击,答错会失去一颗心'),
 fight:m('เริ่มต่อสู้','Start the battle','开始战斗'),perk:m('ทักษะอาชีพ','Class skill','职业技能'),
 story:m('เควสต์เนื้อเรื่อง','Story quests','主线任务'),dailyq:m('เควสต์ประจำวัน','Daily quests','每日任务'),claim:m('รับรางวัล','Claim','领取'),claimed:m('รับแล้ว','Claimed','已领取'),
 inprog:m('กำลังทำ','In progress','进行中'),alldaily:m('ทำครบทุกเควสต์วันนี้ รับโบนัส','Finish every daily quest for a bonus','完成全部每日任务可得奖励'),resetdaily:m('รีเซ็ตทุกวันตอนเที่ยงคืน','Resets at midnight','每天午夜重置'),
 unequip:m('ถอด','Take off','卸下'),equipped:m('ใส่อยู่','On','已装备'),all:m('ทั้งหมด','All','全部'),
 noitems:m('ยังไม่มีไอเทมในหมวดนี้ ลองอัญเชิญหรือแวะร้านค้า','No items here yet. Try a summon or visit the shop.','这里还没有道具,去召唤或逛逛商店吧。'),
 mk_max:m('วางขายได้ร้านละ {n} ชิ้น ยกเลิกหรือรอขายชิ้นเดิมก่อน','Up to {n} items per stall — cancel or sell one first','每个摊位最多{n}件,请先取消或卖出一件'),mk_range:m('ราคาของระดับนี้ต้องอยู่ระหว่าง 🪙 {a} – {b}','Price for this rarity must be 🪙 {a} – {b}','该稀有度价格须在 🪙 {a} – {b}'),mk_fee:m('ค่าธรรมเนียมแผง 5% · ได้รับจริง 🪙 {n}','5% stall fee · you receive 🪙 {n}','5%摊位费 · 实得 🪙 {n}'),
 mk_title:m('ตลาดแลกเปลี่ยน','Trading market','交易市场'),mk_manage:m('จัดการ','Manage','管理'),mk_managehint:m('โหมดจัดการ: แตะไอเทมเพื่อ ขายคืน · แลกเปลี่ยน · ทิ้ง (แตะ “จัดการ” อีกครั้งเพื่อกลับไปสวมใส่)','Manage mode: tap an item to sell, trade or throw it away (tap “Manage” again to go back to dressing up)','管理模式:点道具可出售、交易或丢弃(再点“管理”返回穿戴)'),mk_tapmanage:m('แตะเพื่อขาย/แลก/ทิ้ง','Tap to sell / trade / drop','点击出售/交易/丢弃'),mk_tab_sell:m('💰 ขายคืน','💰 Sell','💰 出售'),mk_tab_trade:m('🔁 แลกเปลี่ยน','🔁 Trade','🔁 交易'),mk_tab_drop:m('🗑 ทิ้ง','🗑 Drop','🗑 丢弃'),mk_qty:m('จำนวน','Amount','数量'),mk_sellq:m('ขายคืนให้ร้านค้า ได้ {c} เหรียญ','Sell to the shop for {c} coins','卖给商店,获得 {c} 金币'),mk_sell:m('ขาย','Sell','出售'),mk_dropq:m('ทิ้งไอเทมนี้ถาวร ย้อนกลับไม่ได้','Throw this item away for good — this cannot be undone','永久丢弃此道具,无法恢复'),mk_drop:m('ทิ้งเลย','Throw away','丢弃'),mk_wantq:m('อยากได้อะไรตอบแทน?','What do you want in return?','想换什么?'),mk_anitem:m('ไอเทม','An item','道具'),mk_price:m('จำนวนเหรียญ','Coins','金币数'),mk_search:m('ค้นหาไอเทมที่อยากได้…','Search the item you want…','搜索想要的道具…'),mk_wantn:m('จำนวนที่อยากได้','How many','数量'),mk_towho:m('เสนอให้','Offer to','提供给'),mk_everyone:m('ทุกคน','Everyone','所有人'),mk_list:m('ลงประกาศแลก','Post the offer','发布交易'),mk_same:m('เลือกไอเทมที่ต่างจากของที่ให้','Choose a different item from the one you give','请选择与给出的不同的道具'),mk_sold:m('ขาย {n} ชิ้น ได้ {c} เหรียญ','Sold {n} for {c} coins','出售 {n} 件,获得 {c} 金币'),mk_dropped:m('ทิ้งไอเทมแล้ว','Item thrown away','已丢弃道具'),mk_listed:m('ลงประกาศแล้ว ไอเทมถูกเก็บไว้กลางจนกว่าจะแลกสำเร็จหรือยกเลิก','Offer posted — the item is held safely until the trade completes or you cancel','已发布——道具由系统保管,直到交易完成或取消'),mk_cancelled:m('ยกเลิกแล้ว ไอเทมกลับเข้ากระเป๋า','Cancelled — the item is back in your bag','已取消,道具已退回'),mk_requested:m('ส่งคำขอแลกแล้ว ของที่จ่ายถูกเก็บไว้กลาง รอเจ้าของยืนยัน (อัตโนมัติเมื่อเขาออนไลน์)','Request sent — your payment is held until the owner confirms (automatic when they come online)','已发送请求——付款由系统保管,等待对方确认(对方上线时自动)'),mk_already:m('ส่งคำขอนี้ไปแล้ว','You already asked for this','已经请求过了'),mk_cantpay:m('ของ/เหรียญที่ต้องจ่ายไม่พอ','You do not have what this trade asks for','你没有足够的交换物'),mk_done:m('แลกสำเร็จกับ {who}!','Trade completed with {who}!','与 {who} 交易成功!'),mk_got:m('ได้รับ {x} จากการแลก!','You received {x} from a trade!','通过交易获得 {x}!'),mk_refund:m('การแลกไม่สำเร็จ ได้ของที่จ่ายคืนแล้ว','The trade did not go through — your payment is back','交易未完成,付款已退回'),mk_off:m('ตลาดแลกเปลี่ยนปิดอยู่','Trading is switched off','交易已关闭'),mk_needcloud:m('ต้องเข้าสู่ระบบจึงจะแลกกับผู้เล่นอื่นได้','Sign in to trade with other players','登录后才能与其他玩家交易'),mk_unknown:m('ไม่พบไอเทมนี้','Item not found','找不到该道具'),mk_notenough:m('จำนวนไม่พอ','Not enough','数量不足'),mk_starter:m('ชุดเริ่มต้นฟรีขาย/แลก/ทิ้งไม่ได้','Free starter outfits cannot be sold, traded or dropped','免费初始服装不能出售/交易/丢弃'),mk_worn:m('ไอเทมนี้สวมอยู่ ถอดออกก่อน หรือเหลือไว้อย่างน้อย 1 ชิ้น','You are wearing this — take it off first, or keep at least one','正在穿戴,请先卸下或至少保留一件'),mk_wornlock:m('กำลังใช้อยู่ เปลี่ยนเป็นชุด/ทรงผมอื่นก่อน','In use — switch to another outfit or hairstyle first','正在使用,请先换别的服装/发型'),mk_how:m('ลงประกาศไอเทมที่อยากแลก เลือกรับเป็นเหรียญหรือไอเทม · ระบบเก็บของทั้งสองฝ่ายไว้กลางจนแลกสำเร็จ ไม่มีของหายหรือซ้ำ','Post items you want to swap for coins or another item · both sides are held safely until the swap completes — nothing lost or duplicated','发布想交换的道具,可换金币或道具 · 双方物品由系统保管直至完成,不会丢失或重复'),mk_board:m('ประกาศจากเพื่อน','Offers from others','其他玩家的交易'),mk_none:m('ยังไม่มีประกาศ','No offers yet','暂无交易'),mk_mine:m('ประกาศของฉัน','My offers','我的交易'),mk_nomine:m('ยังไม่มีประกาศ — ไปที่ตู้เสื้อผ้า › จัดการ › แลกเปลี่ยน','None yet — go to Wardrobe › Manage › Trade','暂无——前往衣柜 › 管理 › 交易'),mk_tip:m('ยกเลิกได้ตลอดจนกว่าจะมีคนยอมรับ','You can cancel any time until someone accepts','有人接受前随时可以取消'),mk_waiting:m('คำขอที่รอยืนยัน','Waiting for confirmation','等待确认'),mk_to:m('ถึง','to','给'),mk_from:m('จาก','from','来自'),mk_wants:m('ต้องการ','wants','想要'),mk_foryou:m('ให้คุณ','for you','给你'),mk_accept:m('ยอมรับแลก','Accept','接受'),mk_cancel:m('ยกเลิก','Cancel','取消'),mk_st_done:m('แลกแล้วกับ {who}','Traded with {who}','已与 {who} 交易'),mk_st_cancel:m('ยกเลิกแล้ว','Cancelled','已取消'),mk_st_wait:m('รอเจ้าของยืนยัน','Waiting for the owner','等待对方确认'),mk_st_got:m('ได้รับแล้ว','Received','已收到'),mk_st_refund:m('คืนแล้ว','Refunded','已退回'),
 n_town:m('เมือง','Town','城镇'),n_bazaar:m('ตลาด','Market','集市'),tw_closed:m('เมืองปิดอยู่ชั่วคราว','The town is closed for now','城镇暂时关闭'),tw_muted:m('คุณถูกปิดการพิมพ์ชั่วคราวโดยครู','Your chat is paused by the teacher','老师暂时关闭了你的发言'),tw_slow:m('พิมพ์เร็วไป รออีก {s} วินาที','Slow down — wait {s}s','发得太快了,请等 {s} 秒'),tw_sign:m('ลานกลางเมืองสามภาษา','Tri-lingual Plaza','三语广场'),tw_nomsg:m('ยังไม่มีข้อความ ทักทายเพื่อน ๆ ก่อนเลย!','No messages yet — say hi first!','还没有消息,先打个招呼吧!'),tw_online:m('ออนไลน์','Online','在线'),tw_you:m('คุณ','you','你'),tw_hint:m('แตะพื้นเพื่อเดิน · คุยกับเพื่อนได้ทั้ง 3 ภาษา','Tap the ground to walk · chat in all three languages','点地面走动 · 用三种语言聊天'),tw_chat:m('แชทเมือง','Town chat','城镇聊天'),tw_ph:m('พิมพ์ทักทายเพื่อน… (ลองใช้ภาษาอังกฤษหรือจีนดูสิ!)','Say something… (try English or Chinese!)','说点什么…(试试英语或中文!)'),tw_send:m('ส่ง','Send','发送'),tw_rules:m('พูดจาสุภาพ ห้ามบอกข้อมูลส่วนตัว (เบอร์โทร ที่อยู่ รหัสผ่าน) ครูดูแชทได้ทั้งหมด','Be kind. Never share personal info (phone, address, passwords). Teachers can see all chat.','文明发言,不要透露个人信息(电话、地址、密码),老师可以看到所有聊天。'),tp_off:m('ยังไม่เปิดให้เติมเพชร','Gem top-up is not open yet','暂未开放充值'),tp_title:m('เติมเพชร','Top up gems','充值宝石'),tp_how:m('1) เลือกแพ็ก 2) โอนตามบัญชีด้านล่าง 3) แนบสลิป/ใส่เลขอ้างอิง แล้วกดส่ง — ครูตรวจแล้วเพชรจะเข้าอัตโนมัติ','1) Pick a pack 2) Transfer to the account below 3) Attach the slip or reference and send — gems arrive once the teacher checks it','1) 选择套餐 2) 转账到下方账户 3) 附上凭证或参考号并提交——老师核对后宝石自动到账'),tp_amount:m('ยอดที่ต้องโอน','Amount to transfer','转账金额'),tp_wait:m('มีคำขอรอครูตรวจอยู่ ส่งใหม่ได้หลังครูตรวจเสร็จ','A request is waiting for the teacher — you can send another after it is checked','有请求正在等待老师审核,审核后才能再次提交'),tp_ref:m('เลขอ้างอิง / เวลาที่โอน','Reference no. / transfer time','参考号/转账时间'),tp_refph:m('เช่น 12:45 น. หรือเลขท้ายรายการ','e.g. 12:45 or the last digits','例如 12:45 或尾号'),tp_slip:m('แนบรูปสลิป (ไม่บังคับ)','Attach the slip (optional)','附上转账凭证(可选)'),tp_slipok:m('แนบสลิปแล้ว ✓','Slip attached ✓','已附凭证 ✓'),tp_send:m('ส่งคำขอเติม','Send request','提交充值请求'),tp_hist:m('ประวัติการเติม','Top-up history','充值记录'),tp_need:m('ใส่เลขอ้างอิงหรือแนบสลิปก่อน','Add a reference or a slip first','请先填写参考号或附上凭证'),tp_sent:m('ส่งแล้ว รอครูตรวจ','Sent — waiting for the teacher','已提交,等待老师审核'),tp_st_pending:m('รอตรวจ','Pending','待审核'),tp_st_ok:m('อนุมัติแล้ว','Approved','已通过'),tp_st_no:m('ไม่อนุมัติ','Declined','未通过'),th_badimg:m('ไฟล์รูปไม่ถูกต้อง','That image could not be read','图片无法读取'),
 pt_hi:m('สวัสดี {n} 👋 เข้าสู่ระบบแล้ว','Hi {n} 👋 you are signed in','你好 {n} 👋 已登录'),pt_hi0:m('เข้าสู่ระบบแล้ว 👋','Signed in 👋','已登录 👋'),pt_signin:m('ยังไม่ได้เข้าสู่ระบบ — ล็อกอินบัญชี Claude ของคุณ แล้วเปิดลิงก์นี้อีกครั้ง','Not signed in — sign in to your Claude account, then open this link again','尚未登录——请登录你的 Claude 账号后重新打开此链接'),pt_local:m('โหมดทดลองเล่น (ไม่ได้เชื่อมระบบกลาง ความคืบหน้าอยู่ในเครื่องนี้เท่านั้น)','Trial mode (not connected — progress stays on this device)','试玩模式(未连接服务器,进度仅保存在本设备)'),pt_closed:m('ขณะนี้ปิดรับสมัครสมาชิกใหม่ ติดต่อครูผู้ดูแล','New sign-ups are closed right now — please ask your teacher','目前暂停新成员注册,请联系老师'),pt_signup:m('สมัครสมาชิก & สร้างตัวละคร','Sign up & create your hero','注册并创建角色'),pt_s1:m('ล็อกอินบัญชีของคุณ','Sign in to your account','登录你的账号'),pt_s2:m('กรอกข้อมูลนักเรียน','Fill in your student info','填写学生信息'),pt_s3:m('สร้างตัวละครในฝัน','Create your dream hero','创建你的角色'),pt_s4:m('ออกผจญภัยกับเพื่อน ๆ','Adventure with friends','和朋友一起冒险'),pt_f1:m('ผจญภัย 8 ดินแดน','8 lands to explore','8 片大陆'),pt_f1d:m('ผ่านด่าน ปราบบอส เก็บดาว','Clear lessons, beat bosses, earn stars','闯关、打Boss、收集星星'),pt_f2:m('เมืองออนไลน์','Online town','在线城镇'),pt_f2d:m('เดินเล่น คุยกับเพื่อน 3 ภาษา','Hang out and chat in 3 languages','闲逛并用三种语言聊天'),pt_f3:m('สัตว์เทพ 24 ตัว','24 divine pets','24 只神兽'),pt_f3d:m('พญาครุฑ มังกรหยก กิเลน และอีกมาก','Garuda, Jade Dragon, Qilin and more','迦楼罗、玉龙、麒麟等'),pt_f4:m('ตลาดแลกของ','Trading market','交易市场'),pt_f4d:m('แลกไอเทมกับเพื่อนอย่างปลอดภัย','Swap items with friends safely','和朋友安全交换道具'),pt_f5:m('อัญเชิญ & แต่งตัว','Summon & dress up','召唤与换装'),pt_f5d:m('ชุด ปีก ทรงผม อาวุธ หลายร้อยชิ้น','Hundreds of outfits, wings, hair and weapons','数百件服装、翅膀、发型和武器'),pt_f6:m('ศัพท์ข้อสอบ 230 คำ','230 exam words','230 个考试词汇'),pt_f6d:m('ไทย ป.4–ม.6 · อังกฤษ · จีน HSK 1–3','Thai P4–M6 · English · Chinese HSK 1–3','泰语 · 英语 · 汉语 HSK 1–3'),pf_title:m('ข้อมูลนักเรียน','Student info','学生信息'),pf_opt:m('ไม่บังคับ','optional','选填'),ban_note:m('บัญชีนี้ถูกครูระงับการใช้แชท ลานเมือง ทำเนียบ และบอสรวม หากคิดว่าผิดพลาดให้ติดต่อครู','The teacher has suspended chat, the town, the hall of fame and shared bosses for this account. Talk to your teacher if this is a mistake','老师已暂停此账号的聊天、城镇、名人堂和共同首领功能,如有误请联系老师'),
 forcern_t:m('ครูขอให้ตั้งชื่อตัวละครใหม่','Your teacher asks you to pick a new hero name','老师要求你重新取角色名'),forcern_d:m('ใช้ชื่อที่สุภาพและเหมาะสม ตั้งเสร็จแล้วเล่นต่อได้ทันที','Use a polite, suitable name — then carry on playing','请使用礼貌得体的名字,改好后即可继续'),
 nm_short:m('ชื่อตัวละครต้องมีตัวอักษรอย่างน้อย 2 ตัว','The hero name needs at least 2 letters','角色名至少需要2个字'),nm_junk:m('ชื่อนี้ดูไม่เหมือนชื่อ ห้ามมีแต่ตัวเลข สัญลักษณ์ หรือตัวอักษรซ้ำ ๆ','That does not look like a name — no only-numbers, symbols or repeated letters','这不像名字:不能只有数字、符号或重复字母'),nm_bad:m('ชื่อนี้มีคำไม่สุภาพ กรุณาตั้งชื่อใหม่','That name has a rude word — please choose another','名字含有不雅词语,请重新取名'),
 pf_needreal:m('นักเรียนต้องกรอกชื่อจริงและนามสกุล (เว้นวรรคระหว่างชื่อกับนามสกุล) ครูเห็นคนเดียว','Students must enter their real first and last name (with a space) — only the teacher sees it','学生需填写真实姓名(名和姓之间空格),仅老师可见'),
 pf_nick:m('ชื่อจริง-นามสกุล (นักเรียนต้องกรอก) หรือชื่อเล่นสำหรับบุคคลทั่วไป','Full name or nickname','姓名或昵称'),pf_nickph:m('ให้ครูรู้ว่าเป็นใคร','So your teacher knows who you are','让老师知道你是谁'),pf_room:m('ชั้น/ห้อง','Class','班级'),pf_roomph:m('เช่น ม.1/2','e.g. M1/2','例如 初一2班'),pf_pick:m('— เลือกห้อง —','— choose —','— 选择 —'),pf_no:m('เลขที่','Number','学号'),pf_code:m('รหัสเข้าห้อง (จากครู)','Class code (from your teacher)','班级码(向老师索取)'),pf_codeph:m('พิมพ์รหัสที่ครูให้','Type the code your teacher gave you','输入老师给的班级码'),pf_rules:m('ฉันจะเล่นอย่างสุภาพ และไม่บอกข้อมูลส่วนตัว (เบอร์โทร ที่อยู่ รหัสผ่าน) ในแชท','I will be kind and never share personal info (phone, address, passwords) in chat','我会文明发言,不在聊天中透露个人信息(电话、地址、密码)'),pf_priv:m('ข้อมูลนี้ครู/แอดมินเท่านั้นที่เห็น เพื่อนในเกมเห็นแค่ชื่อตัวละคร','Only teachers/admins see this — other players only see your hero name','只有老师/管理员能看到,其他玩家只看到角色名'),pf_need:m('กรอกข้อมูลให้ครบ: ชื่อ ระดับชั้น ห้อง และเลขที่ (บุคคลทั่วไป/ครู/มหาวิทยาลัย ไม่ต้องใส่ห้องและเลขที่)','Please fill in name, grade, class and number (the public, staff and university do not need class or number)','请填写姓名、年级、班级和学号(社会人士/教师/大学生无需填写班级和学号)'),pf_needrules:m('ติ๊กยอมรับกติกาก่อนนะ','Please tick the rules box first','请先勾选同意规则'),pf_badcode:m('รหัสเข้าห้องไม่ถูกต้อง ถามครูอีกครั้ง','That class code is not right — ask your teacher','班级码不正确,请再问一下老师'),pf_cardt:m('กรอกข้อมูลนักเรียนหน่อยนะ','Please complete your student info','请补充学生信息'),pf_cardd:m('ครูขอให้ทุกคนใส่ชื่อ ห้อง และเลขที่ ใช้เวลาไม่ถึงนาที','Your teacher asks everyone to add name, class and number — it takes under a minute','老师请每个人填写姓名、班级和学号,不到一分钟'),pf_fill:m('กรอกเลย','Fill it in','去填写'),pf_none:m('ยังไม่ได้กรอก','Not filled in yet','尚未填写'),pf_edit:m('แก้ไขข้อมูล','Edit','编辑'),pf_saved:m('บันทึกข้อมูลนักเรียนแล้ว','Student info saved','学生信息已保存'),
 ex_paidnote:m('แลกตั๋วได้จากเพชรที่หาในเกม {f} เม็ด · เพชรจากการเติม {p} เม็ด ใช้ซื้อของในร้านแลกด้วยเพชรเท่านั้น','You can use {f} gems earned in the game · {p} topped-up gems are for the gem shop only','可用游戏中获得的 {f} 宝石兑换 · 充值的 {p} 宝石只能在宝石商店使用'),tp_rule:m('เพชรที่เติมใช้ซื้อของราคาคงที่ในร้าน "แลกด้วยเพชร" เท่านั้น ไม่สามารถแลกเป็นตั๋วอัญเชิญ (กาชา) ได้','Topped-up gems can only buy fixed-price items in the gem shop — they can never be turned into summon tickets','充值的宝石只能购买宝石商店的定价商品,不能兑换召唤券'),
 ex_tab:m('แลกเปลี่ยน','Exchange','兑换'),ex_how:m('แลกเหรียญเป็นเพชร หรือแลกเพชรเป็นตั๋วอัญเชิญ แลกได้ตลอด ไม่จำกัดจำนวน','Turn coins into gems, or gems into summon tickets — as many times as you like.','金币换宝石,或宝石换召唤券,不限次数。'),ex_c2g:m('เหรียญ ➜ เพชร','Coins ➜ gems','金币 ➜ 宝石'),ex_g2t:m('เพชร ➜ ตั๋วอัญเชิญ','Gems ➜ summon tickets','宝石 ➜ 召唤券'),ex_max:m('สูงสุด','Max','最多'),ex_pay:m('จ่าย','Pay','支付'),ex_get:m('ได้รับ','get','获得'),ex_left:m('วันนี้แลกไปแล้ว {u}/{c}','Today: {u}/{c} used','今日已兑换 {u}/{c}'),ex_go:m('แลกเลย','Exchange','兑换'),ex_short:m('ยังมีไม่พอแลก','Not enough to exchange yet','余额不足'),ex_capped:m('ครบโควตาวันนี้แล้ว พรุ่งนี้มาใหม่นะ','Daily limit reached — come back tomorrow','今日已达上限,明天再来'),ex_cant:m('แลกไม่ได้ (ยอดไม่พอหรือเกินโควตาวันนี้)','Cannot exchange (not enough, or over today\'s limit)','无法兑换(余额不足或超过今日上限)'),ex_done:m('แลก {a} ได้ {b} แล้ว!','Exchanged {a} for {b}!','已用 {a} 兑换 {b}!'),tp_soon:m('ระบบเติมเพชรกำลังจะเปิดเร็ว ๆ นี้ ระหว่างนี้หาเพชรได้จากการเลเวลอัป ชนะบอส ภารกิจรายวัน หรือแลกจากเหรียญในหน้าแลกเปลี่ยน','Top-up is coming soon. Meanwhile earn gems by levelling up, beating bosses, daily quests, or exchanging coins.','充值即将开放。现在可通过升级、打Boss、每日任务或用金币兑换获得宝石。'),
 pv_head:m('ลงชื่อเข้าใช้งาน / LOGIN','Sign in / LOGIN','登录 / LOGIN'),pv_login:m('เข้าสู่ระบบ (LOGIN)','Enter the game (LOGIN)','进入游戏 (LOGIN)'),pv_register:m('สมัครสมาชิก (REGISTER)','Sign up (REGISTER)','注册 (REGISTER)'),pv_profile:m('ข้อมูลนักเรียน (PROFILE)','Student info (PROFILE)','学生信息 (PROFILE)'),pv_remember:m('จำฉันไว้ (Remember me)','Remember me','记住我'),pv_nopass:m('ใช้บัญชีของคุณ ไม่ต้องจำรหัสผ่าน','Uses your account — no password to remember','使用你的账号,无需密码'),pv_noreg:m('ยังไม่ได้สมัครสมาชิก — กดสมัครด้านล่าง','Not signed up yet — tap Sign up below','尚未注册——点击下方注册'),pv_nohero:m('ตัวละครของคุณจะแสดงที่นี่','Your hero will appear here','你的角色会显示在这里'),pf_grade:m('ระดับชั้น','Grade level','年级'),
 sl_login:m('เข้าสู่ระบบ','Sign in','登录'),sl_register:m('สมัครสมาชิก','Sign up','注册'),sl_id:m('ID ผู้ใช้ (ภาษาอังกฤษ/ตัวเลข)','User ID (letters/numbers)','用户名(字母/数字)'),sl_pw:m('รหัสผ่าน (สมัครใหม่: 8 ตัวขึ้นไป มีตัวอักษรและตัวเลข)','Password (new: 8+ with letters and numbers)','密码(新注册:至少8位,含字母和数字)'),sl_pw2:m('ยืนยันรหัสผ่านอีกครั้ง','Confirm password','再次输入密码'),sl_name:m('ชื่อ-นามสกุล','Full name','姓名'),sl_grade:m('— เลือกระดับชั้น —','— choose grade level —','— 选择年级 —'),sl_rules:m('ฉันจะเล่นอย่างสุภาพ และไม่บอกข้อมูลส่วนตัวในแชท','I will be kind and never share personal info in chat','我会文明发言,不在聊天中透露个人信息'),sl_forgot:m('ลืมรหัส? แจ้งครู','Forgot? Ask your teacher','忘记密码?请找老师'),sl_idrule:m('ID: a-z 0-9 _ . - (3–20 ตัว)','ID: a-z 0-9 _ . - (3–20)','用户名:a-z 0-9 _ . -(3–20位)'),sl_have:m('มีบัญชีแล้ว? เข้าสู่ระบบ','Already have an account? Sign in','已有账号?登录'),sl_e_bad_id:m('ID ต้องเป็นภาษาอังกฤษตัวเล็ก ตัวเลข หรือ _ . - ยาว 3–20 ตัว','ID must be 3–20 lowercase letters, numbers, _ . -','用户名需为3–20位小写字母、数字或 _ . -'),sl_e_pw_short:m('รหัสผ่านต้องมีอย่างน้อย 8 ตัว และมีทั้งตัวอักษรและตัวเลข (ห้ามใช้วันเกิดหรือเลขประจำตัว)','Password needs 8+ characters with both letters and numbers (not your birthday or student number)','密码至少8位且同时包含字母和数字(不要用生日或学号)'),sl_e_id_taken:m('ID นี้มีคนใช้แล้ว ลองชื่ออื่น','That ID is taken — try another','该用户名已被使用'),sl_e_bad_login:m('ID หรือรหัสผ่านไม่ถูกต้อง','Wrong ID or password','用户名或密码错误'),sl_e_too_many:m('ลองผิดหลายครั้งเกินไป รอสักครู่แล้วลองใหม่','Too many tries — wait a moment','尝试次数过多,请稍后再试'),sl_e_offline:m('เชื่อมต่ออินเทอร์เน็ตไม่ได้','No internet connection','无法连接网络'),sl_e_pw_match:m('รหัสผ่านสองช่องไม่ตรงกัน','The passwords do not match','两次密码不一致'),sl_e_need_name:m('กรอกชื่อ-นามสกุลก่อน','Please enter your full name','请填写姓名'),sl_e_need_grade:m('เลือกระดับชั้นก่อน','Please choose your grade level','请选择年级'),sl_e_need_rules:m('ติ๊กยอมรับกติกาก่อนนะ','Please tick the rules box','请勾选同意规则'),sl_e_unknown:m('เกิดข้อผิดพลาด ลองอีกครั้ง','Something went wrong — try again','出错了,请重试'),sl_setup_t:m('ยังไม่ได้เชื่อมฐานข้อมูล','Database not connected yet','尚未连接数据库'),sl_setup_d:m('ผู้ดูแลต้องใส่ค่า Firebase ในไฟล์ config.js ก่อน (ดูคู่มือ README)','The admin needs to put the Firebase settings into config.js first (see README)','管理员需要先在 config.js 中填写 Firebase 设置(见 README)'),sl_cpw:m('เปลี่ยนรหัสผ่าน','Change password','修改密码'),sl_oldpw:m('รหัสผ่านเดิม','Current password','当前密码'),sl_newpw:m('รหัสผ่านใหม่ (8 ตัวขึ้นไป มีตัวอักษรและตัวเลข)','New password (8+, letters and numbers)','新密码(至少8位,含字母和数字)'),sl_cpwok:m('เปลี่ยนรหัสผ่านแล้ว','Password changed','密码已修改'),
 copyr:m('สงวนลิขสิทธิ์ ห้ามคัดลอกหรือนำไปใช้โดยไม่ได้รับอนุญาต','All rights reserved. No copying or reuse without permission','版权所有,未经许可禁止复制或使用'),connecting:m('กำลังเชื่อมต่อบัญชีของคุณ…','Connecting to your account…','正在连接你的账号…'),autosave:m('☁️ ความคืบหน้าบันทึกกับบัญชีของคุณอัตโนมัติ เข้าเครื่องไหนก็เล่นต่อได้','☁️ Progress saves to your account automatically — continue on any device','☁️ 进度自动保存到你的账号,任何设备都能继续'),
 account:m('บัญชีและการบันทึก','Account & saving','账号与保存'),logout:m('ออกจากเกม','Log out','退出游戏'),dangerzone:m('ตัวเลือกขั้นสูง','Advanced','高级选项'),
 lo_q:m('ระบบจะบันทึกความคืบหน้าทั้งหมดขึ้นระบบกลางก่อนออก เข้ามาใหม่เมื่อไหร่ก็เล่นต่อได้ทันที','Everything is saved to the class server before you leave. Come back any time and continue.','离开前会把全部进度保存到班级服务器,随时回来继续。'),
 lo_clear:m('ล้างข้อมูลในเครื่องนี้','Clear this device','清除本设备数据'),lo_clearh:m('แนะนำสำหรับคอมพิวเตอร์ของโรงเรียน/ใช้ร่วมกัน','Recommended on school or shared computers','学校或共用电脑建议勾选'),
 lo_saving:m('กำลังบันทึกขึ้นระบบกลาง…','Saving to the class server…','正在保存到班级服务器…'),lo_err:m('ยังบันทึกขึ้นระบบไม่สำเร็จ (อินเทอร์เน็ตอาจหลุด) ข้อมูลยังอยู่ในเครื่องนี้ ลองใหม่อีกครั้ง','Could not reach the server yet (check the internet). Your data is still on this device — try again.','暂时无法保存到服务器(请检查网络),数据仍在本设备,请重试。'),lo_retry:m('ลองอีกครั้ง','Try again','重试'),
 bye_t:m('ออกจากเกมแล้ว','You are logged out','已退出游戏'),bye_saved:m('✅ บันทึกความคืบหน้าเรียบร้อย เลเวล ไอเทม และเงินทั้งหมดอยู่ในบัญชีของคุณ','✅ Saved — your level, items and money are all in your account','✅ 已保存——等级、道具和货币都在你的账号里'),
 bye_shared:m('ถ้าเป็นเครื่องส่วนกลาง อย่าลืมออกจากบัญชี Claude ด้วย (มุมซ้ายล่างของ claude.ai → Log out) คนถัดไปจะได้ใช้บัญชีของตัวเอง','On a shared computer, also log out of your Claude account (claude.ai, bottom-left → Log out) so the next student uses their own.','如果是共用电脑,请同时退出 Claude 账号(claude.ai 左下角 → Log out),让下一位同学使用自己的账号。'),bye_back:m('เข้าเล่นต่อ','Play again','继续游戏'),
 wl_tap:m('แตะเพื่อเปลี่ยนอาชีพ','tap to switch class','点击切换职业'),wl_body:m('อาวุธชิ้นนี้ใช้ได้เฉพาะอาชีพ{c} ตอนนี้คุณเป็น{me} — เปลี่ยนอาชีพได้ฟรีทุกเมื่อ ความคืบหน้าไม่หาย','This weapon is for the {c} class. You are a {me} — switching class is free anytime and keeps all progress.','此武器仅限{c}使用。你目前是{me}——可随时免费切换职业,进度不会丢失。'),
 wl_go:m('เปลี่ยนเป็น{c} แล้วใส่เลย','Become {c} and equip','切换为{c}并装备'),wl_done:m('เปลี่ยนเป็น{c} และใส่อาวุธแล้ว!','You are now a {c} — weapon equipped!','已切换为{c}并装备武器!'),
 wrongg:m('ชุดนี้สำหรับเพศอื่น','This outfit is for the other gender','这套服装适合另一性别'),forcls:m('สำหรับ','For','适用于'),nostats:m('ไอเทมแฟชั่นไม่มีค่าพลัง ใส่เพื่อความสวยงาม','Fashion items have no stats. They are just for looks.','时装没有属性,只为好看。'),
 pull1:m('อัญเชิญ ×1','Summon ×1','召唤×1'),pull10:m('อัญเชิญ ×10 (ใช้ 10 ใบ)','Summon ×10 (10 tickets)','召唤×10(用10张)'),ticketonly:m('ใช้ตั๋วอัญเชิญเท่านั้น 1 ครั้ง = 1 ใบ','Tickets only: 1 summon = 1 ticket','仅用召唤券:1次=1张'),
 rates:m('อัตราการได้รับ','Drop rates','掉落率'),rate_each:m('ต่อชิ้น','Each item','每件'),rate_see:m('อัตราได้รับของทุกระดับและทุกชิ้นแสดงไว้ด้านล่าง ก่อนกดสุ่ม','Odds for every rarity and every item are listed below, before you summon','各稀有度与每件物品的概率均列于下方'),pity:m('การันตี','Guarantee','保底'),history:m('ประวัติการอัญเชิญ','Summon history','召唤记录'),
 pity1:m('การันตีระดับ หายาก ขึ้นไปทุก','Rare or better guaranteed every','每抽满此次数必得稀有以上:'),pity2:m('การันตีระดับ ตำนาน ขึ้นไปภายใน','Legendary or better guaranteed within','此次数内必得传说以上:'),times:m('ครั้ง','summons','次'),
 pitycount:m('นับถึงการันตีตำนาน','Toward the Legendary guarantee','距传说保底'),notickets:m('ตั๋วไม่พอ รับตั๋วได้จากเควสต์ บอส และการเลเวลอัป','Not enough tickets. Earn them from quests, bosses and level-ups.','召唤券不足。完成任务、打Boss或升级可获得。'),
 nobanner:m('ยังไม่มีแบนเนอร์อัญเชิญ','No summon banners yet','暂无召唤卡池'),
 got:m('ได้รับ','You got','获得'),dupe:m('ซ้ำ +1 ชิ้น','Duplicate, +1','重复,+1'),newi:m('ใหม่!','New!','新!'),ok:m('ตกลง','OK','好的'),
 coinshop:m('ร้านเหรียญ','Coin shop','金币商店'),gemshop:m('แลกด้วยเพชร','Gem exchange','宝石兑换'),buy:m('ซื้อ','Buy','购买'),owned:m('มีแล้ว','Owned','已拥有'),
 nocoin:m('เหรียญไม่พอ','Not enough coins','金币不足'),nogem:m('เพชรไม่พอ','Not enough gems','宝石不足'),bought:m('ซื้อแล้ว ไปสวมได้ที่ตู้เสื้อผ้า','Bought. Try it on in the wardrobe.','已购买,去衣橱试穿吧。'),
 gemnote:m('เพชรใช้แลกไอเทมราคาคงที่เท่านั้น ใช้อัญเชิญไม่ได้','Gems buy fixed-price items only. They cannot be used to summon.','宝石只能兑换固定价格道具,不能用于召唤。'),
 ds_pin:m('⭐ รายการพิเศษจากครู','⭐ Teacher\'s picks','⭐ 老师精选'),ds_head:m('ไอเทมสุ่มประจำวัน','Today\'s random picks','今日随机商品'),ds_reset:m('เปลี่ยนรายการใหม่ทุกวัน 00:00 น. · อีก {h} ชม. {m} นาที','New list every day at 00:00 · in {h} h {m} min','每天00:00更新 · 还有{h}小时{m}分'),ds_changed:m('ร้านเปลี่ยนรายการแล้ว ลองดูของใหม่วันนี้นะ','The shop has a new list now — take a look at today\'s items','商店已更新,看看今天的新商品吧'),
 confirmbuy:m('ยืนยันการซื้อ','Confirm purchase','确认购买'),cancel:m('ยกเลิก','Cancel','取消'),maxstack:m('มีไอเทมนี้ครบจำนวนสูงสุดแล้ว','You already hold the maximum of this item','该道具已达持有上限'),
 progress:m('ความก้าวหน้า','Progress','学习进度'),wordsl:m('คำที่จำได้','Words learned','已学会'),acc:m('ความแม่นยำ','Accuracy','正确率'),streak:m('วันต่อเนื่อง','Day streak','连续天数'),
 bossw:m('บอสที่ชนะ','Bosses beaten','击败Boss'),bylang:m('ความแม่นยำแยกตามภาษา','Accuracy by language','各语言正确率'),
 s_motion:m('ตัวละครเคลื่อนไหว (ปิดได้ถ้าเครื่องช้าหรือเวียนหัว)','Animated characters (turn off on slow devices or if it feels dizzy)','角色动画(设备较慢或头晕时可关闭)'),
 settings:m('ตั้งค่า','Settings','设置'),s_py:m('แสดงพินอิน','Show pinyin','显示拼音'),s_sound:m('เสียงเอฟเฟกต์','Sound effects','音效'),s_timer:m('จับเวลาในการต่อสู้บอส','Timer in boss battles','Boss战计时'),
 s_speed:m('ความเร็วเสียงอ่าน','Voice speed','朗读速度'),slow:m('ช้า','Slow','慢'),normal:m('ปกติ','Normal','正常'),s_theme:m('ธีม','Theme','主题'),auto:m('อัตโนมัติ','Auto','自动'),dark:m('กลางคืน','Night','夜晚'),light:m('รุ่งอรุณ','Dawn','黎明'),
 savecode:m('รหัสเซฟ','Save code','存档码'),
 savehint:m('ความคืบหน้าบันทึกในเบราว์เซอร์นี้อัตโนมัติ คัดลอกรหัสเพื่อย้ายไปเครื่องอื่น','Progress saves in this browser automatically. Copy the code to move to another device.','进度自动保存在此浏览器。复制存档码可换设备继续。'),
 savehintcloud:m('ความคืบหน้าบันทึกขึ้นระบบกลางอัตโนมัติ เข้าบัญชีเดิมบนเครื่องไหนก็เล่นต่อได้','Progress saves to the class server automatically. Sign in with the same account on any device to continue.','进度自动保存到服务器,用同一账号在任何设备继续。'),
 copy:m('คัดลอก','Copy','复制'),copied:m('คัดลอกแล้ว','Copied','已复制'),copyfail:m('คัดลอกไม่ได้ เลือกข้อความแล้วคัดลอกเอง','Couldn\'t copy. Select the text and copy it yourself.','无法复制,请手动选中复制。'),
 loadcode:m('โหลดรหัสเซฟ','Load a save code','载入存档码'),loaded:m('โหลดความคืบหน้าแล้ว','Progress loaded','进度已载入'),
 badcode:m('รหัสนี้ใช้ไม่ได้ ตรวจว่าคัดลอกมาครบ (ขึ้นต้นด้วย TLQ1:)','That code doesn\'t work. Check you copied all of it (it starts with TLQ1:).','存档码无效,请确认完整复制(以TLQ1:开头)。'),
 report:m('สรุปสำหรับครู','Report for your teacher','给老师的学习报告'),reporthint:m('คัดลอกข้อความนี้ส่งให้ครู','Copy this summary and send it to your teacher','复制这份总结发给老师'),
 reset:m('เริ่มเกมใหม่','Start over','重新开始'),resetq:m('ลบความคืบหน้าทั้งหมด? ย้อนกลับไม่ได้','Erase all progress? This can\'t be undone.','清除全部进度?无法恢复。'),resetyes:m('ลบและเริ่มใหม่','Erase and start over','清除并重新开始'),
 voicemiss:m('เครื่องนี้ไม่มีเสียงอ่านภาษานี้','This device has no voice for that language','此设备没有该语言的朗读声音'),
 newwords:m('คำศัพท์ใหม่','New words','新单词'),
 storage:m('เบราว์เซอร์นี้บันทึกข้อมูลไม่ได้ (โหมดส่วนตัว?) ใช้รหัสเซฟเพื่อเก็บความคืบหน้า','This browser can\'t save (private mode?). Use a save code to keep progress.','此浏览器无法保存(隐私模式?),请用存档码保存进度。'),
 mp_next:m('อีก {n} EXP ถึงเลเวล {l}','{n} EXP to level {l}','再 {n} 经验升到 {l} 级'),mp_streak:m('เข้าเรียนติดกัน {n} วัน','{n}-day streak','连续学习 {n} 天'),mp_power:m('พลังภาษา','Language power','语言力'),
 mp_show:m('ตู้โชว์ของสะสม','Showcase','收藏展柜'),mp_pin:m('ปักหมุดของ','Pin an item','放入展品'),mp_pick:m('เลือกของมาโชว์','Choose an item to show','选择展示物品'),mp_remove:m('เอาออกจากตู้โชว์','Remove from showcase','从展柜移除'),mp_none:m('ยังไม่มีของในกระเป๋า','No items yet','还没有物品'),
 mastered:m('จำแม่นแล้ว','Mastered','已掌握'),class_change:m('เปลี่ยนชื่อ/อาชีพ','Edit name / class','修改名字/职业'),save:m('บันทึก','Save','保存'),hero:m('ตัวละคร','Hero','角色'),
 weeklyq:m('เควสต์ประจำสัปดาห์','Weekly quests','每周任务'),resetweekly:m('รีเซ็ตทุกวันจันทร์ 00:00 น.','Resets every Monday at 00:00','每周一 00:00 重置'),
 mk_bound:m('ของพิเศษ VIP และนักปราชญ์แลกเปลี่ยนไม่ได้ (ขายคืนร้านได้)','VIP and Scholar exclusives cannot be traded (you can still sell them to the shop)','VIP与学者专属道具不能交易(可卖回商店)'), sc_name:m('นักเรียนดีเด่น','Scholar Path','优秀学生'),sc_short:m('ดีเด่น','Scholar','优秀'),sc_lv:m('ระดับ','Level','等级'),sc_max:m('ถึงระดับสูงสุดแล้ว! ยอดเยี่ยมมาก','Top level reached. Outstanding!','已达最高等级,太棒了!'),
 sc_next:m('อีก {n} ดาวขยัน ถึงระดับ {l}','{n} more diligence stars to level {l}','再得 {n} 颗勤奋星升到 {l} 级'),sc_today:m('วันนี้ได้ {n}/{m} ดาว','Today {n}/{m} stars','今日 {n}/{m} 星'),
 sc_how:m('ได้ดาวขยันจากอะไรบ้าง?','How do I earn diligence stars?','怎样获得勤奋星?'),
 sc_howt:m('เรียนบทเรียนจบ 3 (เต็ม +2) · ทบทวนคำศัพท์ 2 · ชนะบอสโซน 5 · รับเควสประจำวัน 1 · รับเควสประจำสัปดาห์ 2 · ช่วยตีบอสเมืองโกลาหล 5 · ชนะมอนสเตอร์อุโมงค์ 1 / บอสอุโมงค์ 3 · เข้าเล่นวันใหม่ +1 · ได้สูงสุดวันละ 40 ดาว: มาเรียนสม่ำเสมอทุกวันดีที่สุด · ของรางวัลสายนักปราชญ์ซื้อด้วยเงินไม่ได้','Finish a lesson 3 (perfect +2) · review 2 · beat a zone boss 5 · claim a daily quest 1 · claim a weekly quest 2 · hit the Chaos City boss 5 · tunnel monster 1 / tunnel boss 3 · first play of a new day +1 · at most 40 a day: steady daily study wins · Scholar rewards can never be bought','完成课程3(满分+2)·复习2·击败区域首领5·领取每日任务1·领取每周任务2·参与混沌之城首领5·隧道怪物1/隧道首领3·新的一天首次游玩+1·每天最多40星:坚持每天学习最好·学者奖励无法用钱购买'),
 vp_note:m('ยอดเติมสะสมจากคำขอที่ครูอนุมัติแล้ว · ไม่หมดอายุ ไม่ลดระดับ · รับรางวัลแต่ละขั้นได้ครั้งเดียว · ของ VIP ไม่มีค่าพลังและแลกเปลี่ยนไม่ได้ · การเติมเป็นความสมัครใจ','Total of top-ups the teacher has approved · never expires or drops · each reward once · VIP items have no stats and cannot be traded · topping up is voluntary','老师已批准的累计充值 · 永不过期、不降级 · 每级奖励限领一次 · VIP道具无属性且不可交易 · 充值完全自愿'),
 vp_claim:m('รับรางวัล','Claim','领取'),vp_got:m('รับแล้ว','Claimed','已领取'),vp_badge:m('ป้าย VIP','VIP badge','VIP徽章'),vp_gold:m('ชื่อสีทองในเมือง','Gold name in town','城镇金色名字'),
 vp_noitems:m('ของรางวัลยังไม่อยู่ในระบบ ให้ครูกด “เพิ่มเนื้อหาใหม่” ในหน้าแอดมินก่อน','The reward items are not in the game yet: ask the teacher to press “Add new content” in admin','奖励道具尚未加入游戏:请老师在管理页点击“添加新内容”'), cw_wait:m('กำลังโหลดตัวละครเดิมจากระบบ รอสักครู่แล้วกดใหม่อีกครั้ง (กันข้อมูลเดิมหาย)','Still loading your saved hero from the server: wait a moment and try again (so your progress is not lost)','正在从服务器载入你的角色,请稍候再试(以免进度丢失)'), sy_local:m('บันทึกในเครื่อง','Saved on this device','本机保存'),sy_ok:m('ซิงก์แล้ว','Synced','已同步'),sy_busy:m('กำลังบันทึก…','Saving…','保存中…'),sy_conn:m('กำลังเชื่อมต่อ…','Connecting…','连接中…'),sy_slow:m('ฐานข้อมูลไม่ตอบ ⓘ','Database not answering ⓘ','数据库无响应 ⓘ'),
 sy_why:m('ฐานข้อมูลยังไม่ตอบกลับ','The database isn\'t answering yet','数据库暂未响应'),sy_why1:m('ไม่ต้องกังวล ข้อมูลของคุณเก็บไว้ในเครื่องนี้แล้ว ไม่หาย เล่นต่อได้ตามปกติ ระบบจะส่งขึ้นเองเมื่อเชื่อมต่อได้','Don\'t worry — your progress is kept on this device and won\'t be lost. Keep playing; it uploads by itself once the connection is back','别担心,进度已保存在本设备,不会丢失。可继续游戏,恢复连接后会自动上传'),
 sy_why2:m('ถ้าเป็นนานเกิน 10 นาที ลองเช็กอินเทอร์เน็ต แล้วรีเฟรชหน้า (อย่าล้างข้อมูลเบราว์เซอร์)','If it lasts more than 10 minutes, check the internet and refresh the page (don\'t clear the browser data)','若超过10分钟,请检查网络并刷新页面(不要清除浏览器数据)'),
 sy_why3:m('สำหรับครู: อาจเป็นเพราะโควตาฟรีรายวันของ Firebase เต็ม ดูที่ Firebase Console → Firestore → Usage จะรีเซ็ตราว 15:00 น. หรือเปลี่ยนเป็นแผน Blaze','For the teacher: Firebase\'s free daily quota may be used up — see Firebase Console → Firestore → Usage; it resets around 15:00 Thai time, or switch to the Blaze plan','老师请注意:可能是 Firebase 每日免费额度用完,见 Firebase Console → Firestore → Usage,约泰国时间15:00重置,或改用 Blaze 方案'),sy_err:m('ซิงก์ไม่ได้ บันทึกในเครื่องไว้ก่อน','Can\'t sync; saved on this device','无法同步,已本机保存'),
 sy_ro:m('บัญชีนี้บันทึกขึ้นระบบกลางไม่ได้ (ขอสิทธิ์ Contributor จากครู)','This account can\'t save to the class server (ask your teacher for Contributor access)','此账号无法保存到服务器(请向老师申请Contributor权限)'),
 gotlvl:m('ครูเพิ่มเลเวลให้ +{n} → Lv.{l}','Your teacher added +{n} levels → Lv.{l}','老师为你增加了 +{n} 级 → Lv.{l}'),cloudloaded:m('โหลดความคืบหน้าจากระบบกลางแล้ว','Loaded your progress from the class server','已从服务器载入进度'),teacherupd:m('ครูอัปเดตข้อมูลของคุณแล้ว','Your teacher updated your progress','老师更新了你的进度')
};

/* ===================================================================== STATE */
/* ---------- daily shop: 5 random items per rarity, new list at 00:00 Thai time ---------- */
var DS_RARS=['common','uncommon','rare','epic','legendary','mythic'];
/* boxes that have ended for good (hidden even if the content database still has them on) — 23 Nov: Northern Starlight season weapons */
var BANNER_ENDED={bxS:1};
function bkkDay(ms){var d=new Date((ms===undefined?Date.now():ms)+7*36e5);return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0')}
function msToBkkMidnight(){var n=Date.now()+7*36e5;return 864e5-(n%864e5)}
function fnv(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}
  h^=h>>>16;h=Math.imul(h,0x85ebca6b)>>>0;h^=h>>>13;h=Math.imul(h,0xc2b2ae35)>>>0;h^=h>>>16;return h>>>0}
function dsPrice(it,sh,c){var i=DS_RARS.indexOf(it&&it.rar);if(i<0||it.noShop)return 0;return int(c[(sh==='gem'?'dsg':'dsc')+(i+1)],1,1e7,1)}
/* the day's list for one shop; items = {id: item}; same day + same items = same list on every device */
function dailyShop(day,sh,items,c){var n=int(c.dsN,1,20,5),out=[];DS_RARS.slice().reverse().forEach(function(r){if(r==='mythic'&&gachaOnly(day))return;
  Object.keys(items).filter(function(id){var it=items[id];return it&&it.rar===r&&!it.noShop&&!isBound(id)}).map(function(id){return [fnv(day+'|'+sh+'|'+id),id]}).sort(function(a,b){return a[0]-b[0]||(a[1]<b[1]?-1:1)}).slice(0,n)
   .forEach(function(x){out.push({item:x[1],price:dsPrice(items[x[1]],sh,c),rar:r,kind:sh})})});return out}
function today(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function fresh(){return {v:1,created:false,name:'',gender:'F',cls:'mage',lvl:1,exp:0,coin:CFG.startCoin,gems:CFG.startGems,tickets:CFG.startTickets,
  owned:{},eq:{},prog:{},boss:{},srs:{},npc:{},
  stats:{th:{ok:0,ng:0},en:{ok:0,ng:0},zh:{ok:0,ng:0},lessons:0,reviews:0,bosses:0,pulls:0},
  story:{},daily:{day:today(),p:{correct:0,lesson:0,review:0,boss:0},c:{},bonus:false},
  gacha:{},hist:[],streak:{last:'',days:0},upd:0,arev:0,rnAck:0,shop:{n:'',c:0},log:[],n:0,lh:'',startT:0,adjSeen:{},tta:{},trades:{},treq:{},prof:null,ex:{d:'',g:0,t:0},tn:tnBlank(),tng:{w:tnBlank(),e:tnBlank(),s:tnBlank(),c:tnBlank(),d:tnBlank(),m:tnBlank(),n:tnBlank()},show:[],raid:{},raidw:{},rw:0,wq:wqBlank(''),sp:0,spD:'',spV:0,vipc:{},schc:{},pbg:{},chk:{c:0,n:0,last:''},vipB:0,paid:0,pushedN:0,wk:{},lseed:'',la:{th:{ok:0,n:0},en:{ok:0,n:0},zh:{ok:0,n:0}},
  set:{lang:'th',targets:['en','zh'],py:true,sound:true,timer:true,rate:.85,theme:'auto',motion:true,title:'',taura:true,ptype:true,porder:true,pspeak:true}}}
applyContent();
var UI={scr:'title',cat:'all',shop:'coin',banner:'bnA',sess:null,modal:null,edit:false,loadOpen:false,resetAsk:false,adm:'overview',q:'',fu:'',form:null};
var S=fresh(), canStore=true;

function load(){try{var raw=localStorage.getItem(STORE);if(raw){var c=sanitize(JSON.parse(raw));if(c)S=c}}catch(e){canStore=false}}
function saveLocal(){if(CL.uid&&!CL.loggedOut&&S.created)S.owner=CL.uid;try{localStorage.setItem(STORE,JSON.stringify(S))}catch(e){canStore=false}}
function save(){S.paid=Math.max(0,Math.min(S.paid||0,S.gems));S.upd=Date.now();saveLocal();schedulePush()}
/* Rebuilds a state object from untrusted input, keeping only known shapes.
   Ids are kept by format (not by current content) so admin-added items survive. */
function sanitize(o){if(!isO(o)||o.v!==1)return null;var s=fresh();
  s.created=!!o.created;s.name=str(o.name,16);s.gender=o.gender==='M'?'M':'F';s.cls=CLASSES[o.cls]?o.cls:'mage';
  s.lvl=int(o.lvl,1,999);s.exp=int(o.exp,0,1e7);s.coin=int(o.coin,0,1e8);s.gems=int(o.gems,0,1e8);s.tickets=int(o.tickets,0,1e6);
  s.upd=int(o.upd,0,9e15);s.paid=Math.min(int(o.paid,0,1e8),s.gems);s.vipB=int(o.vipB,0,1e8,0);if(isO(o.ex)&&o.ex.d===today())s.ex={d:o.ex.d,g:int(o.ex.g,0,1e6),t:int(o.ex.t,0,1e6)};s.prof=cleanProf(o.prof);s.owner=typeof o.owner==='string'&&IDRE.test(o.owner)?o.owner:'';s.arev=int(o.arev,0,1e9);s.shop=isO(o.shop)?{n:str(o.shop.n,24),c:int(o.shop.c,0,7,0)}:{n:'',c:0};s.rnAck=int(o.rnAck,0,1e6,0);
  if(isO(o.owned))Object.keys(o.owned).forEach(function(k){if(IDRE.test(k)){var q=int(o.owned[k],0,CFG.maxStack);if(q)s.owned[k]=q}});
  if(isO(o.eq))Object.keys(o.eq).forEach(function(k){var id=o.eq[k];if((CAT[k]||k==='acchead'||k==='weapon')&&typeof id==='string'&&s.owned[id]>0&&(!ITEM[id]||slotOf(ITEM[id])===k))s.eq[k]=id});
  if(isO(o.prog))Object.keys(o.prog).forEach(function(k){if(IDRE.test(k)&&isO(o.prog[k]))s.prog[k]={stars:int(o.prog[k].stars,0,3),best:int(o.prog[k].best,0,100),clears:int(o.prog[k].clears,0,1e6)}});
  if(isO(o.boss))Object.keys(o.boss).forEach(function(k){var b=o.boss[k];if(IDRE.test(k)&&isO(b))s.boss[k]={wins:int(b.wins,0,1e6),tday:str(b.tday,10)}});
  if(isO(o.srs))Object.keys(o.srs).forEach(function(k){var r=o.srs[k];if(IDRE.test(k)&&isO(r))s.srs[k]={b:int(r.b,0,6),due:int(r.due,0,9e15),ok:int(r.ok,0,1e6),ng:int(r.ng,0,1e6)}});
  if(isO(o.npc))Object.keys(o.npc).forEach(function(k){if(IDRE.test(k)&&o.npc[k])s.npc[k]=true});
  if(isO(o.stats)){LANGS.forEach(function(l){if(isO(o.stats[l]))s.stats[l]={ok:int(o.stats[l].ok,0,1e7),ng:int(o.stats[l].ng,0,1e7)}});['lessons','reviews','bosses','pulls'].forEach(function(k){s.stats[k]=int(o.stats[k],0,1e7)})}
  if(isO(o.story))Object.keys(o.story).forEach(function(k){if(IDRE.test(k)&&o.story[k]==='claimed')s.story[k]='claimed'});
  if(isO(o.daily)&&o.daily.day===today()){s.daily.p={};DAILY_KEYS.forEach(function(k){s.daily.p[k]=int(o.daily.p&&o.daily.p[k],0,1e6)});
    if(isO(o.daily.c))Object.keys(o.daily.c).forEach(function(k){if(IDRE.test(k)&&o.daily.c[k])s.daily.c[k]=true});s.daily.bonus=!!o.daily.bonus}
  if(Array.isArray(o.hist))s.hist=o.hist.filter(function(h){return isO(h)&&IDRE.test(h.id||'')&&IDRE.test(h.b||'')}).slice(0,100).map(function(h){return {id:h.id,b:h.b,t:int(h.t,0,9e15)}});
  if(isO(o.streak)){s.streak.last=str(o.streak.last,10);s.streak.days=int(o.streak.days,0,1e5)}
  if(isO(o.set)){var st=o.set;s.set.lang=LANGS.indexOf(st.lang)>=0?st.lang:'th';
    s.set.targets=Array.isArray(st.targets)?st.targets.filter(function(l,i,a){return LANGS.indexOf(l)>=0&&a.indexOf(l)===i}):s.set.targets;if(!s.set.targets.length)s.set.targets=LANGS.filter(function(l){return l!==s.set.lang});
    s.set.py=st.py!==false;s.set.remember=st.remember===true;s.set.motion=st.motion!==false;s.set.sound=st.sound!==false;s.set.timer=st.timer!==false;s.set.rate=st.rate===.65?.65:.85;s.set.theme=['auto','dark','light'].indexOf(st.theme)>=0?st.theme:'auto';s.set.taura=st.taura!==false;s.set.pshow={};if(isO(st.pshow))['wexp','coin','fash','words','streak','title'].forEach(function(k){if(st.pshow[k]===false)s.set.pshow[k]=false});s.set.pbg=typeof st.pbg==='string'&&/^pb\d\d$/.test(st.pbg)?st.pbg:'';s.set.ptype=st.ptype!==false;s.set.porder=st.porder!==false;s.set.pspeak=st.pspeak!==false;s.set.gd=/^(gd\d|none)$/.test(st.gd||'')?st.gd:'';s.set.title=st.title==='none'||/^[A-Za-z0-9_-]{1,30}$/.test(st.title||'')?st.title:''}
  if(isO(o.gacha))Object.keys(o.gacha).forEach(function(k){var g=o.gacha[k];if(IDRE.test(k)&&isO(g))s.gacha[k]={i:int(g.i,0,1e7),soft:int(g.soft,0,999),hard:int(g.hard,0,9999)}});
  if(Array.isArray(o.log))s.log=o.log.filter(isO).slice(0,60000).map(function(e){return JSON.parse(JSON.stringify(e))});
  s.n=s.log.length;s.lh=s.n?String(s.log[s.n-1].h||''):'';s.startT=int(o.startT,0,9e15);s.pushedN=Math.min(s.n,int(o.pushedN,0,1e7));s.lseed=str(o.lseed,40);
  if(isO(o.adjSeen))Object.keys(o.adjSeen).forEach(function(k){if(IDRE.test(k))s.adjSeen[k]=1});
  s.tta=cleanTta(o.tta);s.show=(Array.isArray(o.show)?o.show:[]).slice(0,3).map(function(x){return typeof x==='string'&&/^[\w-]{1,40}$/.test(x)?x:''});var tnx=tnFromLog(s.log);s.tn=tnx.tn;s.tng=tnx.tng;var rdx=raidFromLog(s.log);s.raid=rdx.raid;s.sk=rdx.sk||{};s.skb=rdx.skb||{};s.skbw=rdx.skbw||'';s.raidw=rdx.raidw;s.rw=rdx.rw;s.wq=rdx.wq;var scx=schFromLog(s.log);s.sp=scx.sp;s.spD=scx.spD;s.spV=scx.spV;s.vipc=scx.vipc;s.schc=scx.schc;s.pbg={};s.eva={};var ckX={chk:{c:0,n:0,last:''}};(s.log||[]).forEach(function(e){if(!isO(e))return;if(e.k==='pbg'&&typeof e.id==='string')s.pbg[e.id]=1;if(e.k==='eva'&&typeof e.day==='string'){if(!s.eva)s.eva={};s.eva[e.day]=1}if(e.k==='chk'){var k=ckState(ckX);k.n=int(e.day,0,30,0);k.last=String(e.d||'');if(k.n>=30){k.c++;k.n=0}ckX.chk=k}});s.chk=ckX.chk;
  if(isO(o.trades))Object.keys(o.trades).slice(-300).forEach(function(k){var x=o.trades[k];if(IDRE.test(k)&&isO(x)&&IDRE.test(x.item||''))s.trades[k]={item:x.item,n:int(x.n,1,1e4),want:cleanPay(x.want),to:typeof x.to==='string'&&IDRE.test(x.to)?x.to:'',st:['open','done','cancel'].indexOf(x.st)>=0?x.st:'open',by:typeof x.by==='string'&&IDRE.test(x.by)?x.by:'',t:int(x.t,0,9e15)}});
  if(isO(o.treq))Object.keys(o.treq).slice(-300).forEach(function(k){var x=o.treq[k];if(/^[A-Za-z0-9_-]{1,40}@[A-Za-z0-9_-]{1,40}$/.test(k)&&isO(x))s.treq[k]={tid:str(x.tid,40),from:str(x.from,40),pay:cleanPay(x.pay),st:['wait','got','refund'].indexOf(x.st)>=0?x.st:'wait',t:int(x.t,0,9e15)}});
  if(isO(o.wk))Object.keys(o.wk).forEach(function(k){if(IDRE.test(k))s.wk[k]=int(o.wk[k],0,1e6)});
  if(isO(o.la))LANGS.forEach(function(l){if(isO(o.la[l]))s.la[l]={ok:int(o.la[l].ok,0,1e7),n:int(o.la[l].n,0,1e7)}});
  if(s.created&&!Object.keys(s.owned).length)return null;
  return s}

/* ===================================================================== HELPERS */
function t(k){var e=L[k];return e?(e[S.set.lang]||e.en):k}
function tx(o){return o?(o[S.set.lang]||o.en||o.th||o.zh||''):''}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function rnd(n){var a=new Uint32Array(1);if(window.crypto&&crypto.getRandomValues)crypto.getRandomValues(a);else a[0]=Math.random()*4294967295;return a[0]/4294967296*n}
function pick(a){return a[Math.floor(rnd(a.length))]}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(rnd(i+1));var x=a[i];a[i]=a[j];a[j]=x}return a}
function unitStars(u,st){st=st||S;return st.prog[u]?st.prog[u].stars:0}
function bossWins(z,st){st=st||S;return st.boss[z]?st.boss[z].wins:0}
function zoneOpen(i){return i===0||bossWins(ZONES[i-1].id)>0}
function zoneWords(z){return WORDS.filter(function(w){return z.units.indexOf(w.u)>=0})}
function learnedCount(st){st=st||S;var wk=st.wk||{};return Object.keys(wk).filter(function(k){return WORD[k]&&wk[k]>=2}).length}
function masteredCount(st){st=st||S;return Object.keys(st.srs).filter(function(k){return WORD[k]&&st.srs[k].b>=4}).length}
function dueWords(){var now=Date.now();return Object.keys(S.srs).filter(function(k){return WORD[k]&&S.srs[k].due<=now}).sort(function(a,b){return S.srs[a].due-S.srs[b].due})}
function wordIn(w,l){return w[l]}
function isNumPic(p){return /^\d+$/.test(p)}
function say(msg){var l=document.getElementById('live');l.textContent='';setTimeout(function(){l.textContent=msg},30)}
function toast(msg){var d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=msg;document.getElementById('toasts').appendChild(d);setTimeout(function(){d.remove()},3000)}
function stars(n){var h='<span class="stars" aria-label="'+n+'/3">';for(var i=0;i<3;i++)h+=i<n?'★':'<span class="off">★</span>';return h+'</span>'}
function langTag(l){return '<span class="tag lt-'+l+'">'+LLABEL[l]+'</span>'}
function accPct(l,st){st=st||S;var a=st.la&&st.la[l];return a&&a.n?Math.round(a.ok/a.n*100):null}
function expNeed(l){return CFG.levelBase+CFG.levelStep*(l-1)}

/* ---------- audio ---------- */
var voices=[];function loadVoices(){try{voices=speechSynthesis.getVoices()||[]}catch(e){voices=[]}}
try{loadVoices();speechSynthesis.onvoiceschanged=loadVoices}catch(e){}
function hasVoice(l){var c=TTSLANG[l].slice(0,2);return voices.some(function(v){return (v.lang||'').toLowerCase().replace('_','-').indexOf(c)===0})}
function speak(text,l){try{if(!('speechSynthesis' in window)||!text){toast(t('voicemiss'));return}speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang=TTSLANG[l];u.rate=S.set.rate;
  var c=TTSLANG[l].toLowerCase();var v=voices.filter(function(v){return (v.lang||'').toLowerCase().replace('_','-')===c})[0]||voices.filter(function(v){return (v.lang||'').toLowerCase().indexOf(c.slice(0,2))===0})[0];
  if(v)u.voice=v;else if(voices.length)toast(t('voicemiss'));speechSynthesis.speak(u)}catch(e){toast(t('voicemiss'))}}
var actx=null;
function sfx(kind){if(!S.set.sound)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();var seq={ok:[660,880],ng:[300,220],lvl:[523,659,784,1046],hit:[180,120],pull:[440,554,659],buy:[700,940]}[kind]||[440];
  seq.forEach(function(f,i){var o=actx.createOscillator(),g=actx.createGain();o.type=kind==='hit'?'square':'triangle';o.frequency.value=f;var st=actx.currentTime+i*.09;g.gain.setValueAtTime(.0001,st);g.gain.exponentialRampToValueAtTime(.12,st+.02);g.gain.exponentialRampToValueAtTime(.0001,st+.16);o.connect(g);g.connect(actx.destination);o.start(st);o.stop(st+.18)})}catch(e){}}
function spkBtn(text,l){return '<button class="spk" data-act="speak" data-t="'+esc(text)+'" data-l="'+l+'" aria-label="'+LLABEL[l]+'">'+ICON.speak+'</button>'}

/* ---------- icons ---------- */
function ic(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'}
var ICON={
 home:ic('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
 bazaar:ic('<path d="M3 9l2-5h14l2 5"/><path d="M3 9a3 3 0 0 0 6 0a3 3 0 0 0 6 0a3 3 0 0 0 6 0"/><path d="M5 12v9h14v-9"/><path d="M10 21v-5h4v5"/>'),
 town:ic('<path d="M3 21h18"/><path d="M5 21V10l4-3 4 3v11"/><path d="M13 21v-7h6v7"/><path d="M9 21v-4"/><path d="M16 11l3-2"/>'),
 map:ic('<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'),
 quest:ic('<path d="M6 3h9l3 3v15H6z"/><path d="M9 9h6M9 13h6M9 17h3"/>'),
 wd:ic('<path d="M8 3l-4 3 2 4 2-1v12h8V9l2 1 2-4-4-3-2 2h-4z"/>'),
 gacha:ic('<path d="M12 3l2.6 5.6L20 9.5l-4 4 1 5.8-5-2.8-5 2.8 1-5.8-4-4 5.4-.9z"/>'),
 shop:ic('<path d="M4 8h16l-1 12H5z"/><path d="M9 8V6a3 3 0 016 0v2"/>'),
 me:ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
 admin:ic('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
 speak:ic('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/>'),
 lock:ic('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>'),
 back:ic('<path d="M15 5l-7 7 7 7"/>')};
function coinIc(kind){var c={coin:['#ffcf4a','#d99a12'],gems:['#7fe3ff','#3a8fd8'],tickets:['#d6a2ff','#8a4fd8'],exp:['#9dffb8','#2fa86a']}[kind];
  var shape=kind==='gems'?'<path d="M12 3l7 6-7 12-7-12z" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="1.5"/>':kind==='tickets'?'<path d="M3 7h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4z" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="1.5"/>':kind==='exp'?'<path d="M12 3l2.6 5.6 6 .9-4.4 4.2 1 6-5.2-2.9-5.2 2.9 1-6L3.4 9.5l6-.9z" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="1.3"/>':'<circle cx="12" cy="12" r="8.5" fill="'+c[0]+'" stroke="'+c[1]+'" stroke-width="1.8"/><path d="M12 7.5v9" stroke="'+c[1]+'" stroke-width="1.8"/>';
  return '<svg class="coinic" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">'+shape+'</svg>'}
function resPill(kind,val){return '<span class="pill num" title="'+esc(t(kind))+'">'+coinIc(kind)+'<span class="sr">'+esc(t(kind))+'</span>'+val+'</span>'}

/* ===================================================================== AVATAR */
function shade(h,amt){if(!/^#[0-9a-f]{6}$/i.test(h))return h;var n=parseInt(h.slice(1),16),r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
  r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
var AVSEQ=0,SKIN='#ffe2cd';
/* itemsMap lets Admin preview an unsaved item */
function avatar(st,opt){opt=opt||{};if(opt.hd===undefined)opt.hd=true;var eq=st.eq||{},g=st.gender,cls=st.cls,uid='a'+(++AVSEQ),IM=opt.items||ITEM;
  var ALV=auraFor(st,opt),AN=!!opt.anim&&S.set.motion!==false;
  var TTID=opt.noTitle?'':opt.title!==undefined?opt.title:st===S?shownTitle(S):(st.title&&TITLE[st.title]?st.title:'');
  var V=function(slot){var id=eq[slot];return id&&IM[id]&&slotOf(IM[id])===slot?IM[id].v:null};
  var hc=V('hairColor');var hairC=hc?hc.a:CLASSES[cls].hair, hairD=shade(hairC,-35);
  var hk=V('hair')?V('hair').k:(g==='F'?'long':'short');
  var of=V('outfit'),top=V('top'),bot=V('bottom'),sh=V('shoes');
  var c1=of?of.a:(top?top.a:'#e9e4d8'),c2=of?of.b:(top?top.b:'#8a7a5a'),okind=of?(of.k||'casual'):'casual';
  var legC=bot?bot.a:(of?shade(of.a,-30):'#4a4a5a');var skirt=(g==='F'&&!bot)||(bot&&bot.k==='skirt');
  var au=V('aura'),auc=au?au.a:'#ffffff',rainbow=au&&au.k==='rainbow';
  var s='<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(opt.label||'avatar')+'"'+(opt.anim?' class="av-live" style="--ad:-'+(rnd(30)/10).toFixed(1)+'s"':'')+'><defs>'+
   '<radialGradient id="'+uid+'au"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="'+auc+'" stop-opacity=".35"/><stop offset="1" stop-color="'+auc+'" stop-opacity="0"/></radialGradient>'+
   '<linearGradient id="'+uid+'rb" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ff5f6d"/><stop offset=".25" stop-color="#ffc371"/><stop offset=".5" stop-color="#47e891"/><stop offset=".75" stop-color="#4b9bff"/><stop offset="1" stop-color="#b46bff"/></linearGradient>'+(ALV?auraDefs(uid+'x'):'')+'</defs>';
  if(ALV)s+='<g class="ta-back">'+TAURA[ALV].back(uid+'x',AN)+'</g>';
  if(au&&typeof AURA2!=='undefined'&&AURA2[au.k])s+='<g class="av-aura">'+AURA2[au.k].d(au.a,au.b,uid)+'</g>';
  else if(au){s+='<g class="av-aura"><ellipse cx="100" cy="140" rx="92" ry="98" fill="url(#'+uid+'au)"/>';
    if(rainbow)s+='<ellipse cx="100" cy="140" rx="84" ry="92" fill="none" stroke="url(#'+uid+'rb)" stroke-width="4" opacity=".75"/><ellipse cx="100" cy="140" rx="70" ry="80" fill="none" stroke="url(#'+uid+'rb)" stroke-width="2" opacity=".5"/>';
    for(var k=0;k<7;k++){var ang=k/7*Math.PI*2,x=100+Math.cos(ang)*78,y=140+Math.sin(ang)*84;s+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="'+(k%2?2.5:4)+'" fill="'+au.b+'" opacity=".85"/>'}s+='</g>'}
  if(opt.hd)s+='<defs><filter id="'+uid+'hdf" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="2.4" flood-color="#2a1a50" flood-opacity=".28"/></filter><radialGradient id="'+uid+'tsh" cx=".85" cy=".55" r=".6"><stop offset="0" stop-color="#1a1030" stop-opacity=".22"/><stop offset="1" stop-color="#1a1030" stop-opacity="0"/></radialGradient></defs>';
  s+='<g class="av-char"'+(opt.hd&&!opt.noFx?' filter="url(#'+uid+'hdf)"':'')+'><g class="av-wings">';var wg=V('wings');
  if(wg&&WSET[wg.k])s+=WSET[wg.k](wg.a,wg.b,uid);
  else if(wg){if(wg.k==='butterfly')s+='<g opacity=".85"><ellipse cx="62" cy="128" rx="36" ry="26" fill="'+wg.a+'" transform="rotate(-25 62 128)"/><ellipse cx="66" cy="160" rx="22" ry="16" fill="'+wg.b+'" transform="rotate(20 66 160)"/><ellipse cx="138" cy="128" rx="36" ry="26" fill="'+wg.a+'" transform="rotate(25 138 128)"/><ellipse cx="134" cy="160" rx="22" ry="16" fill="'+wg.b+'" transform="rotate(-20 134 160)"/></g>';
    else if(wg.k==='angel')s+='<g fill="'+wg.a+'" stroke="'+wg.b+'" stroke-width="2"><path d="M84 140C60 110 30 104 18 112c10 6 14 12 10 18 10 2 14 8 10 14 12 0 18 6 16 12 14-4 26-8 30-16z"/><path d="M116 140c24-30 54-36 66-28-10 6-14 12-10 18-10 2-14 8-10 14-12 0-18 6-16 12-14-4-26-8-30-16z"/></g>';
    else s+='<g fill="'+wg.a+'" stroke="'+wg.b+'" stroke-width="2"><path d="M84 138L30 108l6 20-14 2 14 14-10 8 22 0 4 12z"/><path d="M116 138l54-30-6 20 14 2-14 14 10 8-22 0-4 12z"/></g>'}
  s+='</g><g class="av-back">';var acB=V('accessories');if(acB&&ABACK[acB.k])s+=ABACK[acB.k](acB.a,acB.b,uid);
  var OS=OSET[okind];if(OS&&OS.back)s+=OS.back(c1,c2,g,uid);
  var HV=V('hair'),HS=HSET[hk],HG=HS?hairCtx(hairC,hairD,HV.a,HV.b,uid):null;if(HS)s+=HG.defs+HS.back(HG);
  if(hk==='long')s+='<path d="M54 92c0-30 20-48 46-48s46 18 46 48v66c-10 6-22 6-30 0H84c-8 6-20 6-30 0z" fill="'+hairD+'"/>';
  if(hk==='pony')s+='<path d="M140 70c22 4 26 40 14 72-4 10-14 8-12-2 6-26 4-48-8-58z" fill="'+hairD+'"/>';
  if(hk==='twin')s+='<path d="M52 78c-22 6-24 46-12 74 4 8 14 6 12-4-6-24-2-48 8-60z" fill="'+hairD+'"/><path d="M148 78c22 6 24 46 12 74-4 8-14 6-12-4 6-24 2-48-8-60z" fill="'+hairD+'"/>';
  s+='</g>';if(opt.hd)s+='<ellipse cx="100" cy="219" rx="34" ry="6" fill="#1a1030" opacity=".18"/>';var lc=skirt?SKIN:legC;s+='<rect x="84" y="182" width="12" height="32" rx="5" fill="'+lc+'"/><rect x="104" y="182" width="12" height="32" rx="5" fill="'+lc+'"/>';
  var shc=sh?sh.a:'#4a3b30',shb=sh?sh.b:'#2b211b';
  if(sh&&sh.k==='boot')s+='<rect x="82" y="200" width="16" height="16" rx="4" fill="'+shc+'"/><rect x="102" y="200" width="16" height="16" rx="4" fill="'+shc+'"/>';
  s+='<ellipse cx="89" cy="216" rx="11" ry="6" fill="'+shc+'" stroke="'+shb+'" stroke-width="2"/><ellipse cx="111" cy="216" rx="11" ry="6" fill="'+shc+'" stroke="'+shb+'" stroke-width="2"/>';
  if(OS)s+=OS.body(c1,c2,g,uid);
  else if(okind==='robe'){s+='<path d="M74 136h52l14 64H60z" fill="'+c1+'"/><path d="M60 200h80l-2-8H62z" fill="'+c2+'"/><path d="M100 136v62" stroke="'+c2+'" stroke-width="3"/>'}
  else{s+='<rect x="74" y="136" width="52" height="50" rx="14" fill="'+c1+'"/>';
    if(skirt)s+='<path d="M72 172h56l10 22H62z" fill="'+(bot?bot.a:c2)+'"/>';else s+='<rect x="76" y="176" width="48" height="10" rx="3" fill="'+(bot?bot.a:shade(c2,-10))+'"/>'}
  if(okind==='school')s+='<path d="M84 136l16 16 16-16" fill="'+c2+'"/><path d="M96 150l4 10 4-10z" fill="#d84a4a"/>';
  if(okind==='adv')s+='<path d="M74 150h52" stroke="'+c2+'" stroke-width="7"/><rect x="94" y="146" width="12" height="9" rx="2" fill="#e8c46a"/>';
  if(okind==='armor')s+='<path d="M74 140h52v20c0 10-12 16-26 16s-26-6-26-16z" fill="'+c2+'" opacity=".55"/><circle cx="100" cy="152" r="7" fill="'+c1+'" stroke="#ffffff66" stroke-width="2"/><ellipse cx="72" cy="140" rx="12" ry="8" fill="'+shade(c1,-25)+'"/><ellipse cx="128" cy="140" rx="12" ry="8" fill="'+shade(c1,-25)+'"/>';
  if(okind==='casual'&&top)s+='<path d="M100 148l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="'+top.b+'"/>';
  s+='<rect x="62" y="140" width="14" height="36" rx="7" fill="'+shade(c1,-15)+'"/><rect x="124" y="140" width="14" height="36" rx="7" fill="'+shade(c1,-15)+'"/><circle cx="69" cy="178" r="6" fill="'+SKIN+'"/><circle cx="131" cy="178" r="6" fill="'+SKIN+'"/>';
  if(OS&&OS.arms)s+=OS.arms(c1,c2,g,uid);
  if(opt.hd)s+='<ellipse cx="118" cy="164" rx="26" ry="34" fill="url(#'+uid+'tsh)"/><path d="M78 142q-4 18 0 40" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="131" cy="178" r="6" fill="#c98a6a" opacity=".18"/>';
  var ac=V('accessories');if(ac&&ABODY[ac.k])s+=ABODY[ac.k](ac.a,ac.b,uid);
  if(ac&&ac.k==='scarf')s+='<path d="M78 132q22 12 44 0v10q-22 10-44 0z" fill="'+ac.a+'"/><path d="M112 140l4 22-8-2z" fill="'+ac.a+'"/>';
  if(ac&&ac.k==='neck')s+='<path d="M84 136q16 14 32 0" fill="none" stroke="#e8e8f8" stroke-width="2"/><path d="M100 146l5 6-5 6-5-6z" fill="'+ac.a+'" stroke="#fff" stroke-width="1"/>';
  var eyeC=cls==='mage'?'#6a3fc0':cls==='archer'?'#2f8a4a':'#2b4f9a';
  if(opt.hd){var fx=opt.face||'';
    s+='<defs><radialGradient id="'+uid+'sk" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#fff4ea"/><stop offset=".55" stop-color="'+SKIN+'"/><stop offset="1" stop-color="'+shade(SKIN,-14)+'"/></radialGradient>'+
     '<linearGradient id="'+uid+'ir" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+shade(eyeC,-45)+'"/><stop offset=".55" stop-color="'+eyeC+'"/><stop offset="1" stop-color="'+shade(eyeC,55)+'"/></linearGradient>'+
     '<radialGradient id="'+uid+'bl"><stop offset="0" stop-color="#ff7a92" stop-opacity=".6"/><stop offset="1" stop-color="#ff7a92" stop-opacity="0"/></radialGradient></defs>';
    s+='<ellipse cx="100" cy="138" rx="16" ry="5" fill="#8a5a4a" opacity=".22"/><circle cx="100" cy="92" r="48" fill="url(#'+uid+'sk)"/>';if(avHD2(opt))s+=avFaceShade(uid,SKIN);
    var eye=function(x){if(fx==='happy')return '<path d="M'+(x-9)+' 104q9-12 18 0" fill="none" stroke="'+shade(eyeC,-50)+'" stroke-width="3.4" stroke-linecap="round"/>';
      return '<g><ellipse cx="'+x+'" cy="102" rx="10" ry="12.4" fill="#fff"/><ellipse cx="'+x+'" cy="102.6" rx="9" ry="11.6" fill="url(#'+uid+'ir)"/><ellipse cx="'+x+'" cy="104.5" rx="4.6" ry="6" fill="'+shade(eyeC,-60)+'" opacity=".85"/>'+
        '<ellipse cx="'+(x+3.4)+'" cy="97" rx="3.8" ry="4.2" fill="#fff"/><circle cx="'+(x-3.4)+'" cy="108" r="2" fill="#fff" opacity=".9"/><path d="M'+(x+5)+' 106l1.5 1.5" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><path d="M'+(x-6)+' 109q6 3 12 0" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none"/>'+
        '<path d="M'+(x-11)+' 92q11-8 22 0" fill="none" stroke="#2a1a1a" stroke-width="3" stroke-linecap="round"/>'+(g==='F'?'<path d="M'+(x+(x<100?-10:10))+' 93l'+(x<100?-4:4)+' -3" stroke="#2a1a1a" stroke-width="2" stroke-linecap="round"/>':'')+
        (fx==='sad'?'<path d="M'+(x-9)+' '+(x<100?88:84)+'l18 '+(x<100?-4:4)+'" stroke="'+hairD+'" stroke-width="2.4" stroke-linecap="round"/>':'')+
        '</g>'};
    var blink=AN&&fx!=='happy'?'<animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 .08;1 1;1 1" keyTimes="0;.92;.95;.98;1" dur="'+(3.4+rnd(20)/10).toFixed(1)+'s" repeatCount="indefinite"/>':'';
    s+='<g class="av-eyes"><g transform="translate(0 102)"><g>'+blink+'<g transform="translate(0 -102)">'+eye(82)+eye(118)+'</g></g></g></g>';
    s+='<ellipse cx="70" cy="116" rx="10" ry="6" fill="url(#'+uid+'bl)"/><ellipse cx="130" cy="116" rx="10" ry="6" fill="url(#'+uid+'bl)"/><path d="M66 114l3-3M71 115l3-3M126 115l3-3M131 114l3-3" stroke="#ff8aa0" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>';
    s+=fx==='happy'?'<path d="M93 116q7 9 14 0z" fill="#7a2a3a"/><path d="M96 119q4 2.5 8 0" stroke="#ff8a9a" stroke-width="2" fill="none"/>':fx==='sad'?'<path d="M95 121q5-4 10 0" fill="none" stroke="#7a3a3a" stroke-width="2.2" stroke-linecap="round"/><path d="M128 104q3 6 0 9q-3-3 0-9z" fill="#8ad8ff" opacity=".9"/>':'<path d="M95 117q5 5 10 0" fill="none" stroke="#7a3a3a" stroke-width="2.2" stroke-linecap="round"/><path d="M98 119.5q2 1 4 0" stroke="#ff8a9a" stroke-width="1.4" fill="none"/>'}
  else{s+='<circle cx="100" cy="92" r="48" fill="'+SKIN+'"/>';
  s+='<g class="av-eyes"><ellipse cx="82" cy="102" rx="8" ry="10" fill="'+eyeC+'"/><ellipse cx="118" cy="102" rx="8" ry="10" fill="'+eyeC+'"/><circle cx="85" cy="98" r="3" fill="#fff"/><circle cx="121" cy="98" r="3" fill="#fff"/><circle cx="80" cy="106" r="1.5" fill="#fff"/><circle cx="116" cy="106" r="1.5" fill="#fff"/></g>';
  s+='<ellipse cx="70" cy="116" rx="7" ry="4" fill="#ff9aa8" opacity=".55"/><ellipse cx="130" cy="116" rx="7" ry="4" fill="#ff9aa8" opacity=".55"/><path d="M95 118q5 5 10 0" fill="none" stroke="#7a3a3a" stroke-width="2.2"/>'}
  if(HS)s+=HS.front(HG)+shine(HV.b);
  else if(hk==='short')s+='<path d="M52 92c-2-34 20-52 48-52s52 18 48 52c-6-14-14-22-24-26-4 8-14 12-26 12 4-4 6-8 6-12-12 8-30 14-52 26z" fill="'+hairC+'"/>';
  else if(hk==='pony')s+='<path d="M52 90c0-32 20-50 48-50s48 18 48 50c-10-12-24-20-40-22 2 6 0 10-4 14-6-8-18-12-30-12-8 4-16 10-22 20z" fill="'+hairC+'"/><circle cx="144" cy="66" r="7" fill="#e85a7a"/>';
  else s+='<path d="M50 96c-2-36 20-56 50-56s52 20 50 56c-4-10-10-18-18-22l-4 12-10-16c-6 8-16 12-30 12l6-12c-14 6-28 14-44 26z" fill="'+hairC+'"/>';
  if(!HS)s+='<path d="M66 60q14-10 30-12" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/>';
  if(opt.hd)s+='<path d="M60 76q10-26 40-30" stroke="#fff" stroke-opacity=".28" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M140 70q6 10 6 22" stroke="#fff" stroke-opacity=".22" stroke-width="3" fill="none" stroke-linecap="round"/>';
  if(OS&&OS.front)s+=OS.front(c1,c2,g,uid);
  var hw=V('headwear');
  if(hw&&HATS[hw.k])s+=HATS[hw.k].d(hw.a,hw.b,uid);
  else if(hw){if(hw.k==='mage')s+='<path d="M48 64q52-20 104 0l-6 8q-46-14-92 0z" fill="'+hw.a+'"/><path d="M68 62L104 2l34 58q-36-10-70 2z" fill="'+hw.a+'"/><path d="M76 56q30-8 56 0" stroke="'+hw.b+'" stroke-width="5" fill="none"/><path d="M104 14l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z" fill="'+hw.b+'"/>';
    else if(hw.k==='straw')s+='<ellipse cx="100" cy="58" rx="64" ry="14" fill="'+hw.a+'"/><path d="M68 56q0-30 32-30t32 30z" fill="'+hw.a+'"/><path d="M68 52q32 10 64 0v6q-32 8-64 0z" fill="'+hw.b+'"/>';
    else if(hw.k==='cat')s+='<path d="M58 62l6-34 24 20z" fill="'+hw.a+'"/><path d="M142 62l-6-34-24 20z" fill="'+hw.a+'"/><path d="M64 56l3-18 12 10z" fill="'+hw.b+'"/><path d="M136 56l-3-18-12 10z" fill="'+hw.b+'"/>';
    else s+='<path d="M100 48l-26-14v30zM100 48l26-14v30z" fill="'+hw.a+'"/><circle cx="100" cy="48" r="7" fill="'+shade(hw.a,-30)+'"/>'}
  var acH=V('acchead');if(acH&&AHEAD[acH.k])s+=AHEAD[acH.k](acH.a,acH.b,uid);
  if(acH&&acH.k==='crown')s+='<path d="M74 52l8-20 10 14 8-20 8 20 10-14 8 20z" fill="'+acH.a+'" stroke="#a87a10" stroke-width="2"/><circle cx="100" cy="28" r="4" fill="#bfe9ff"/>';
  s+='<g class="av-wpn">';if(!opt.noWeapon){var WV=V('weapon');if(WV&&WEAP[WV.k]&&weaponClass(WV.k)===cls)s+=WEAP[WV.k](WV.a,WV.b,uid);else if(cls==='sword')s+='<g transform="rotate(18 136 172)"><rect x="133" y="104" width="7" height="66" rx="2" fill="#dfe6f2" stroke="#8a95aa" stroke-width="1.5"/><rect x="124" y="168" width="25" height="6" rx="3" fill="#c09030"/><rect x="133" y="173" width="7" height="16" rx="3" fill="#6a4020"/></g>';
    else if(cls==='mage')s+='<rect x="133" y="112" width="6" height="104" rx="3" fill="#7a5230"/><path d="M136 88l10 14-10 16-10-16z" fill="#4fe0a0" stroke="#bfffe0" stroke-width="1.5"/><circle cx="136" cy="103" r="14" fill="#4fe0a0" opacity=".2"/>';
    else s+='<path d="M140 106q30 54 0 108" fill="none" stroke="#8a5a2a" stroke-width="6" stroke-linecap="round"/><path d="M140 106v108" stroke="#e8e0c8" stroke-width="1.5"/>'}
  s+='</g></g>';var pt=V('pet');var PFLY=pt&&PSET[pt.k]&&PSET[pt.k].fly;var PG0=s.length;s+='<g class="av-pet'+(PFLY?' fly':'')+'">';var PI0=s.length;
  if(pt&&!opt.noPet&&PSET[pt.k]){var PF=PSET[pt.k].fly;s+='<g transform="translate('+(PF?38:30)+' '+(PF?150:200)+')">'+PSET[pt.k].d(pt.a,pt.b)+'</g>'}
  else if(pt&&!opt.noPet){var px=28,py=200;
    if(pt.k==='cat')s+='<g><ellipse cx="'+px+'" cy="'+(py+8)+'" rx="18" ry="13" fill="'+pt.a+'" stroke="'+pt.b+'" stroke-width="2"/><circle cx="'+px+'" cy="'+(py-8)+'" r="13" fill="'+pt.a+'" stroke="'+pt.b+'" stroke-width="2"/><path d="M'+(px-11)+' '+(py-14)+'l2-12 8 7zM'+(px+11)+' '+(py-14)+'l-2-12-8 7z" fill="'+pt.a+'" stroke="'+pt.b+'" stroke-width="2"/><circle cx="'+(px-5)+'" cy="'+(py-8)+'" r="2" fill="#333"/><circle cx="'+(px+5)+'" cy="'+(py-8)+'" r="2" fill="#333"/></g>';
    else if(pt.k==='dragon')s+='<g><path d="M'+(px-6)+' '+(py-6)+'l-16-10 4 14z" fill="'+pt.b+'"/><ellipse cx="'+px+'" cy="'+(py+6)+'" rx="17" ry="14" fill="'+pt.a+'"/><circle cx="'+px+'" cy="'+(py-10)+'" r="12" fill="'+pt.a+'"/><path d="M'+(px-6)+' '+(py-20)+'l-2-8 6 5zM'+(px+6)+' '+(py-20)+'l2-8-6 5z" fill="'+pt.b+'"/><circle cx="'+(px-4)+'" cy="'+(py-11)+'" r="2.2" fill="#222"/><circle cx="'+(px+5)+'" cy="'+(py-11)+'" r="2.2" fill="#222"/><ellipse cx="'+px+'" cy="'+(py+8)+'" rx="9" ry="8" fill="'+pt.b+'" opacity=".7"/></g>';
    else if(pt.k==='panda')s+='<g><ellipse cx="'+px+'" cy="'+(py+8)+'" rx="17" ry="13" fill="'+pt.a+'" stroke="#ccc"/><circle cx="'+px+'" cy="'+(py-8)+'" r="13" fill="'+pt.a+'" stroke="#ccc"/><circle cx="'+(px-10)+'" cy="'+(py-18)+'" r="5" fill="'+pt.b+'"/><circle cx="'+(px+10)+'" cy="'+(py-18)+'" r="5" fill="'+pt.b+'"/><ellipse cx="'+(px-5)+'" cy="'+(py-8)+'" rx="4" ry="5" fill="'+pt.b+'"/><ellipse cx="'+(px+5)+'" cy="'+(py-8)+'" rx="4" ry="5" fill="'+pt.b+'"/></g>';
    else s+='<g><path d="M'+(px-14)+' '+(py+4)+'q-10-14 4-20M'+(px+14)+' '+(py+4)+'q10-14-4-20" stroke="'+pt.b+'" stroke-width="4" fill="none"/><ellipse cx="'+px+'" cy="'+(py+4)+'" rx="15" ry="15" fill="'+pt.a+'"/><path d="M'+px+' '+(py-12)+'l-4-10 4 4 4-6z" fill="'+pt.b+'"/><path d="M'+(px+10)+' '+(py-1)+'l8 3-8 3z" fill="'+pt.b+'"/><circle cx="'+(px+4)+'" cy="'+(py-2)+'" r="2.2" fill="#222"/></g>'}
  s+='</g>';
  /* companion size (teacher setting, 1–5×): scaled around its feet; a big companion stands behind the hero */
  var PROOM=0,PK=petScale(opt);if(opt.petFront)PK=Math.min(PK,1.5);if(pt&&!opt.noPet&&PK!==1){var pin=s.slice(PI0,s.length-4),ax=PFLY?38:30,ay=PFLY?150:228,nx=PFLY?62-30*PK:60-27*PK,ny=PFLY?ay-(PK-1)*24:ay;if(opt.petFront){nx=Math.max(nx,(PFLY?33:30)*PK+2);ny=PFLY?ny+30:ay+6}PROOM=Math.min(0,Math.floor(nx-(PFLY?33:30)*PK-4));
    var pg=s.slice(PG0,PI0)+'<g transform="translate('+f1(nx)+' '+f1(ny)+') scale('+PK+') translate('+(-ax)+' '+(-ay)+')">'+pin+'</g></g>';s=s.slice(0,PG0);
    if(PK>=1.6&&!opt.petFront){var ci=s.indexOf('<g class="av-char">');s=ci>=0?s.slice(0,ci)+pg+s.slice(ci):s+pg}else s+=pg}
  if(au&&typeof AURA2!=='undefined'&&AURA2[au.k]&&AURA2[au.k].front)s+='<g class="av-aura-f">'+AURA2[au.k].front(au.a,au.b,uid+'f')+'</g>';if(ALV)s+='<g class="ta-front">'+TAURA[ALV].front(uid+'x',AN)+'</g>';if(TTID){var tcy=((V('headwear')||V('acchead'))?-20:12)-(TITLE[TTID].lv>=10?14:0),tvt=tcy-(TITLE[TTID].lv>=10?42:24);s=s.replace('viewBox="0 0 200 240"','viewBox="0 '+tvt+' 200 '+(240-tvt)+'"')+titleSvg(TTID,100,tcy,uid+'t')}
  if(PROOM<0&&opt.petRoom===true)s=s.replace(/viewBox="0 (-?[\d.]+) 200 ([\d.]+)"/,function(m0,y,h){return 'viewBox="'+PROOM+' '+y+' '+(200-2*PROOM)+' '+h+'"'});
  return s+'</svg>'}
function petScale(opt){var k=opt&&opt.petK!=null?+opt.petK:((typeof CFG!=='undefined'&&+CFG.petPct)||100)/100;return k>=1&&k<=5?Math.round(k*10)/10:1}
function itemThumb(it){if(!it)return '';if(it.cat==='frame')return FRAMES[it.v.k]?frameThumb(it):'';if(it.cat==='accessories'&&accSlot(it.v.k)==='weapon')return weaponThumb(it);var IM={};IM[it.id]=it;var st={gender:it.g||'F',cls:'mage',eq:{}};st.eq[slotOf(it)]=it.id;
  if(it.cat==='accessories'&&(it.v.k==='cape'||it.v.k==='orbs'))return avatar(st,{noWeapon:true,noPet:true,items:IM});
  if(it.cat==='pet'&&PSET[it.v.k])return '<svg viewBox="-34 -38 68 68" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="pet">'+PSET[it.v.k].d(it.v.a,it.v.b)+'</svg>';
  if(it.cat==='pet')return avatar(st,{noWeapon:true,items:IM,petK:1}).replace('viewBox="0 0 200 240"','viewBox="2 172 52 52"');
  if(it.cat==='wings'||it.cat==='aura'||(it.cat==='outfit'&&OSET[it.v.k]))return avatar(st,{noWeapon:true,items:IM});
  var vb={hair:OSET&&HSET[it.v.k]?'14 0 172 200':'34 0 132 132',hairColor:'34 0 132 132',headwear:'30 0 140 140',shoes:'60 194 80 34',outfit:'38 104 124 124',top:'44 112 112 112',bottom:'54 150 92 80'}[it.cat];
  if(it.cat==='headwear'&&HATS[it.v.k])vb='14 -6 172 172';
  if(it.cat==='accessories')vb=accSlot(it.v.k)==='acchead'?(it.v.k==='halo'||it.v.k==='bunny'||it.v.k==='antlers'?'26 -8 148 148':'34 0 132 132'):'54 80 92 92';
  var svg=avatar(st,{noWeapon:true,noPet:true,items:IM});return vb?svg.replace('viewBox="0 0 200 240"','viewBox="'+vb+'"'):svg}

/* ===================================================================== GAME RULES */
/* every economy change goes through the ledger */
function commitEv(e){e.t=Date.now();if(!e.d)e.d=today();e.s=S.n+1;e.h=evHash(S.lh,e);var lv0=S.lvl;applyEvent(S,e);S.log.push(e);S.n=e.s;S.lh=e.h;
  var lines=[];['exp','coin','gems','tickets'].forEach(function(k){var v=e.r&&e.r[k];if(v)lines.push([k,v])});
  if(e.lu){if(e.lu.gems)lines.push(['gems',e.lu.gems]);if(e.lu.tickets)lines.push(['tickets',e.lu.tickets]);sfx('lvl')}
  if(e.b){if(e.b.gems)lines.push(['gems',e.b.gems]);if(e.b.tickets)lines.push(['tickets',e.b.tickets])}
  return {lines:lines,ups:S.lvl>lv0?[S.lvl]:[]}}
function migrateLegacy(){if(!S.created||S.log.length)return;var wk={};Object.keys(S.srs).forEach(function(k){if(S.srs[k].b>=2)wk[k]=2});S.wk=wk;
  var snap={coin:S.coin,gems:S.gems,tickets:S.tickets,exp:S.exp,lvl:S.lvl,owned:S.owned,prog:S.prog,boss:S.boss,npc:S.npc,story:S.story,wk:wk,gacha:S.gacha,stats:{lessons:S.stats.lessons,reviews:S.stats.reviews,bosses:S.stats.bosses,pulls:S.stats.pulls}};
  commitEv({k:'legacy',snap:JSON.parse(JSON.stringify(snap))})}
function addItem(id,n){var cur=S.owned[id]||0;if(cur+n>CFG.maxStack)return false;S.owned[id]=cur+n;return true}
function touchStreak(){var d=today();if(S.streak.last===d)return;var y=new Date();y.setDate(y.getDate()-1);
  var ys=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
  S.streak.days=S.streak.last===ys?S.streak.days+1:1;S.streak.last=d}
function rollDaily(){if(S.daily.day!==today())S.daily={day:today(),p:{correct:0,lesson:0,review:0,boss:0},c:{},bonus:false}}
var SRS_DAYS=[0,1,2,4,7,15,30];
function srsMark(wid,ok){var r=S.srs[wid]||{b:0,due:0,ok:0,ng:0};
  if(ok){r.b=Math.min(6,r.b+1);r.ok++}else{r.b=Math.max(0,r.b-2);r.ng++}
  r.due=Date.now()+SRS_DAYS[r.b]*864e5+(ok?0:6e5);S.srs[wid]=r}
function canEquip(id){var it=ITEM[id];if(!it||(it.g&&it.g!==S.gender))return false;var sl=slotOf(it);return sl!=='weapon'||weaponClass(it.v.k)===S.cls}
function starterOwned(){return STARTERS[S.gender].filter(function(i){return S.owned[i]&&ITEM[i]})[0]}
function equip(id){var it=ITEM[id];if(!it||!S.owned[id]||!canEquip(id))return;var sl=slotOf(it);
  if(S.eq[sl]===id){if(sl==='outfit'||sl==='hair')return;delete S.eq[sl];return}
  S.eq[sl]=id;if(sl===it.cat)CAT[it.cat].excludes.forEach(function(x){delete S.eq[x]})}
function unequip(slot){if(slot==='outfit'){var st=starterOwned();if(st&&S.eq.outfit!==st){S.eq.outfit=st;delete S.eq.top;delete S.eq.bottom}return}
  if(slot==='top'||slot==='bottom'){delete S.eq[slot];if(!S.eq.top&&!S.eq.bottom){var st2=starterOwned();if(st2)S.eq.outfit=st2}return}
  if(slot!=='hair')delete S.eq[slot]}

/* ---------- questions ---------- */
function activeLangs(){var t2=S.set.targets.slice();if(!t2.length)t2=LANGS.filter(function(l){return l!==S.set.lang});return t2}
/* a lesson made for one language (e.g. an English-only zone) asks in that language, whatever the player's own picks */
function makeQ(w,pool,free,prod){var tg=Array.isArray(free)?free:(!free&&UNIT_FOCUS[w.u])||activeLangs(),ui=S.set.lang;var types=['mean','mean','pic'];
  if(tg.some(hasVoice))types.push('listen','listen');if(tg.indexOf('zh')>=0&&w.py)types.push('py','han');
  if(prod&&typeof prodTypes==='function')types=types.concat(prodTypes(w,tg));
  var type=pick(types),q={w:w,type:type};
  if(typeof prodSetup==='function'&&prodSetup(q,w,tg,ui))return q;
  var others=shuffle(pool.filter(function(x){return x.id!==w.id})).slice(0,3);
  if(type==='mean'){var from=pick(tg),dests=LANGS.filter(function(l){return l!==from});q.from=from;q.to=dests.indexOf(ui)>=0&&rnd(1)<.6?ui:pick(dests)}
  else if(type==='pic'){q.to=pick(tg)}
  else if(type==='listen'){var vs=tg.filter(hasVoice);q.from=pick(vs);q.to=q.from===ui?pick(LANGS.filter(function(l){return l!==ui})):ui}
  else if(type==='py'){q.from='zh';q.to='py'}
  else{q.from=pick(LANGS.filter(function(l){return l!=='zh'}));q.to='zh'}
  q.opts=shuffle([w].concat(others));q.ans=q.opts.indexOf(w);return q}
function optLabel(w,to){if(to==='py')return '<span>'+esc(w.py)+'</span>';
  if(to==='zh')return '<span class="han">'+esc(w.zh)+'</span>'+(S.set.py&&w.py?'<span class="py">'+esc(w.py)+'</span>':'');return '<span>'+esc(w[to])+'</span>'}
function langOfQ(q){return q.type==='py'||q.type==='han'?'zh':(q.from&&q.from!==S.set.lang?q.from:q.to)}
function poolFor(z){var p=zoneWords(z);return p.length>=4?p:WORDS}

/* ---------- sessions ---------- */
function startLesson(unit,zi){var ws=WORDS.filter(function(w){return w.u===unit});if(!ws.length)return;var pool=poolFor(ZONES[zi]);
  var qs=[],order=[];while(order.length<CFG.lessonQuestions)order=order.concat(shuffle(ws));
  for(var i=0;i<CFG.lessonQuestions;i++)qs.push(makeQ(order[i],pool,false,true));
  UI.sess={kind:'lesson',unit:unit,zi:zi,phase:'learn',words:ws,qs:qs,i:0,ok:0,picked:null,wc:[],ww:[],la:{}};go('play')}
function startReview(){var ids=dueWords().slice(0,CFG.reviewMax);if(!ids.length)return;var ws=ids.map(function(k){return WORD[k]});
  var qs=ws.map(function(w){var p=WORDS.filter(function(x){return x.u===w.u});return makeQ(w,p.length>=4?p:WORDS,false,true)});
  UI.sess={kind:'review',phase:'quiz',qs:shuffle(qs),i:0,ok:0,picked:null,wc:[],ww:[],la:{},t0:Date.now()};go('play')}
function startBoss(zi){var z=ZONES[zi];var ws=zoneWords(z);if(!ws.length)return;
  UI.sess={kind:'boss',zi:zi,phase:'intro',pool:ws,hp:z.boss.hp,max:z.boss.hp,hearts:CFG.bossHearts,shield:S.cls==='archer'?1:0,combo:0,okCount:0,ok:0,n:0,ans:0,q:null,picked:null,used:{},wc:[],ww:[],la:{}};go('play')}
function nextBossQ(){var s=UI.sess;var fr=s.pool.filter(function(w){return !s.used[w.id]});if(!fr.length){s.used={};fr=s.pool}
  var w=pick(fr);s.used[w.id]=1;s.q=makeQ(w,s.pool.length>=4?s.pool:WORDS);s.picked=null;s.n++;s.deadline=S.set.timer?Date.now()+CFG.bossTimer*1000:0}
function answer(idx){var s=UI.sess;if(!s||s.picked!==null)return;var q=s.kind==='boss'?s.q:s.qs[s.i];judge(s,q,idx===q.ans,idx)}
function judge(s,q,ok,idx){s.picked=idx;s.lastOk=ok;
  var lg=langOfQ(q);S.stats[lg][ok?'ok':'ng']++;srsMark(q.w.id,ok);if(ok)s.ok++;tally(s,q,lg,ok)
  sfx(ok?'ok':'ng');say(ok?t('right'):t('wrong')+'. '+t('answer')+': '+plainLabel(q.w,q.to));
  if(s.kind==='boss')bossResolve(ok);
  touchStreak();save();render();
  if(ok&&q.type==='order'&&hasVoice(q.to))speak(sentText(q.sent,q.to),q.to);
  else if(ok&&q.to!=='py'&&q.type!=='listen'&&q.type!=='speak'&&hasVoice(q.to))speak(q.w[q.to],q.to)}
function plainLabel(w,to){return to==='py'?w.py:to==='zh'?w.zh+(S.set.py&&w.py?' ('+w.py+')':''):w[to]}
function bossResolve(ok){var s=UI.sess;
  if(ok){s.combo++;s.okCount++;var dmg=1;if(S.cls==='sword'&&s.combo>=3)dmg+=1;if(S.cls==='mage'&&s.okCount%3===0)dmg*=2;s.lastDmg=dmg;s.hp=Math.max(0,s.hp-dmg);sfx('hit')}
  else{s.combo=0;s.lastDmg=0;if(s.shield>0){s.shield--;s.shielded=true}else{s.shielded=false;s.hearts--}}
  if(s.hp<=0||s.hearts<=0)s.over=true}
function timeout(){var s=UI.sess;if(!s||s.kind!=='boss'||s.picked!==null||s.phase!=='fight')return;s.picked=-1;s.lastOk=false;s.timedOut=true;
  var lg=langOfQ(s.q);S.stats[lg].ng++;srsMark(s.q.w.id,false);tally(s,s.q,lg,false);sfx('ng');bossResolve(false);save();render()}
function tally(s,q,lg,ok){(ok?s.wc:s.ww).push(q.w.id);var a=s.la[lg]||[0,0];if(ok)a[0]++;a[1]++;s.la[lg]=a;if(s.kind==='boss')s.ans++}
function nextQ(){var s=UI.sess;if(!s)return;
  if(s.kind==='boss'){if(s.over)return finishBoss();s.timedOut=false;nextBossQ();render();return}
  if(s.i<s.qs.length-1){s.i++;s.picked=null;render();return}
  if(s.kind==='lesson')finishLesson();else finishReview()}
function laArr(s){var o={};Object.keys(s.la).forEach(function(l){o[l]=s.la[l].slice()});return o}
function finishLesson(){var s=UI.sess,n=s.qs.length,pct=Math.round(s.ok/n*100);rollDaily();
  var e=bLesson(S,s.unit,n,s.ok,Date.now()-s.t0,today(),{c:s.wc,w:s.ww},laArr(s),CFG);
  s.grant=commitEv(e);s.phase='result';s.pct=pct;s.stars=e.st;save();render()}
function finishReview(){var s=UI.sess;rollDaily();var e=bReview(S,s.qs.length,s.ok,Date.now()-s.t0,today(),{c:s.wc,w:s.ww},laArr(s),CFG);
  s.grant=commitEv(e);s.phase='result';s.pct=Math.round(s.ok/s.qs.length*100);s.stars=-1;save();render()}
function finishBoss(){var s=UI.sess,z=ZONES[s.zi];var win=s.hp<=0;rollDaily();var tl0=earnedTitles();
  var e=bBoss(S,z.id,win,s.ans,s.ok,Date.now()-s.t0,today(),{c:s.wc,w:s.ww},laArr(s),CFG);
  s.grant=commitEv(e);s.phase='result';s.win=win;var tl1=earnedTitles().filter(function(x){return tl0.indexOf(x)<0});if(tl1.length){s.newTitle=tl1[tl1.length-1];if(TW&&TW.in)townWrite({})}save();render()}

/* ---------- quests ---------- */
function storyDone(q,st){st=st||S;var c=q.cond;switch(c.type){
  case 'talk':return !!st.npc[c.target];case 'unit':return unitStars(c.target,st)>0;case 'boss':return bossWins(c.target,st)>0;
  case 'reviews':return st.stats.reviews>=c.n;case 'learned':return learnedCount(st)>=c.n;case 'level':return st.lvl>=c.n;case 'lessons':return st.stats.lessons>=c.n}return false}
function storyState(q){if(S.story[q.id]==='claimed')return 'claimed';return storyDone(q)?'ready':'open'}
function claimStory(id){var q=STORY.filter(function(x){return x.id===id})[0];if(!q||storyState(q)!=='ready')return;var g=commitEv(bStory(S,q,today(),CFG));save();showReward(tx(q.names),g)}
function claimDaily(id){rollDaily();var d=DAILY.filter(function(x){return x.id===id})[0];if(!d||S.daily.c[id]||(S.daily.p[d.key]||0)<d.goal)return;
  var g=commitEv(bDaily(S,d,today(),DAILY.map(function(x){return x.id}),CFG));save();showReward(tx(d.names),g)}
function curWQ(){return wqOf(S,bkkWeek())}
function claimWeekly(id){var Q=curWQ(),d=WEEKLY.filter(function(x){return x.id===id})[0];if(!d||Q.c[id]||(Q.p[d.key]||0)<d.goal)return;
  var g=commitEv(bWeekly(S,d,Q.w,CFG));save();showReward(tx(d.names),g)}
function questBadge(){rollDaily();var Q=curWQ();return STORY.some(function(q){return storyState(q)==='ready'})||DAILY.some(function(d){return !S.daily.c[d.id]&&(S.daily.p[d.key]||0)>=d.goal})||WEEKLY.some(function(d){return !Q.c[d.id]&&(Q.p[d.key]||0)>=d.goal})}

/* ---------- summon ---------- */
function weight(r){return CFG['w_'+r]||0}
function bannerRates(b){var byR={};b.pool.forEach(function(id){if(!ITEM[id])return;var r=ITEM[id].rar;(byR[r]=byR[r]||[]).push(id)});
  var tot=0;Object.keys(byR).forEach(function(r){tot+=weight(r)});var rates={};Object.keys(byR).forEach(function(r){rates[r]=tot?weight(r)/tot:1/Object.keys(byR).length});return {byR:byR,rates:rates}}
function rollOne(b,minOrder){var br=bannerRates(b),rs=Object.keys(br.byR).filter(function(r){return RAR[r].order>=minOrder});
  if(!rs.length)rs=Object.keys(br.byR);var tot=rs.reduce(function(a,r){return a+br.rates[r]},0),x=rnd(tot),acc=0,pr=rs[rs.length-1];
  for(var i=0;i<rs.length;i++){acc+=br.rates[rs[i]];if(x<acc){pr=rs[i];break}}return pick(br.byR[pr])}
/* a summon only counts once per press: extra taps while the result is opening/closing are ignored */
function summon(n){if(UI.modal||Date.now()-(UI.pullAt||0)<1500)return;var b=BANNERS.filter(function(x){return x.id===UI.banner})[0];if(!b)return;if(S.tickets<n){toast(t('notickets'));return}
  var sd=CL.uid?'u':'l';if(!CL.uid&&!S.lseed)S.lseed='l'+Date.now().toString(36)+Math.floor(rnd(1e9)).toString(36);
  var run=gachaRun(CL.uid||S.lseed,b.id,S.gacha[b.id],n,CFG,b.pool,ITEM);if(run.items.some(function(x){return !x}))return;
  var tmp=Object.assign({},S.owned),out=[];for(var i=0;i<n;i++){var id=run.items[i];if((tmp[id]||0)+1>CFG.maxStack){toast(t('maxstack'));return}out.push({id:id,isNew:!tmp[id]});tmp[id]=(tmp[id]||0)+1}
  commitEv({k:'pull',b:b.id,n:n,sd:sd,items:run.items,rr:run.rr,gc:run.gc});var now=Date.now();
  out.forEach(function(r){S.hist.unshift({id:r.id,b:b.id,t:now})});S.hist=S.hist.slice(0,100);sfx('pull');save();
  UI.pullAt=Date.now();UI.modal={kind:'pull',res:out};render()}

/* ---------- shop ---------- */
function shopList(kind){return CFG.dsOn?dailyShop(bkkDay(),kind,ITEM,CFG):(kind==='coin'?COIN_SHOP:GEM_SHOP)}
function pinnedList(kind){return CFG.dsOn?(kind==='coin'?COIN_SHOP:GEM_SHOP).filter(function(e){return e.pin&&ITEM[e.item]}):[]}
function buy(kind,id,src){var pin=src==='pin',list=pin?pinnedList(kind):shopList(kind);var e=list.filter(function(x){return x.item===id})[0];if(!e)return;
  var bal=kind==='coin'?'coin':'gems';if(S[bal]<e.price){toast(t(kind==='coin'?'nocoin':'nogem'));return}
  UI.modal={kind:'buy',shop:kind,id:id,price:e.price,ds:CFG.dsOn&&!pin?bkkDay():''};render()}
function confirmBuy(){var md=UI.modal;var bal=md.shop==='coin'?'coin':'gems';if(S[bal]<md.price){toast(t(md.shop==='coin'?'nocoin':'nogem'));UI.modal=null;render();return}
  if((S.owned[md.id]||0)+1>CFG.maxStack){toast(t('maxstack'));UI.modal=null;render();return}var bev={k:'buy',sh:md.shop==='coin'?'coin':'gem',item:md.id,price:md.price};if(md.ds){if(md.ds!==bkkDay()){toast(t('ds_changed'));UI.modal=null;render();return}bev.ds=md.ds}if(bev.sh==='gem'){var ppay=Math.min(S.paid||0,md.price);if(ppay){bev.pp=ppay;S.paid-=ppay}}commitEv(bev);sfx('buy');save();UI.modal=null;toast(t('bought'));render()}

/* ---------- save codes / report ---------- */
function saveCode(){return 'TLQ1:'+btoa(unescape(encodeURIComponent(JSON.stringify(S))))}
/* a typed-in save code is outside data: keep only items that exist in the game */
function readCode(s){try{s=String(s).trim();if(s.indexOf('TLQ1:')!==0)return null;var r=sanitize(JSON.parse(decodeURIComponent(escape(atob(s.slice(5))))));
  if(r&&isO(r.owned))Object.keys(r.owned).forEach(function(k){if(!ITEM[k])delete r.owned[k]});return r}catch(e){return null}}
function reportText(st){st=st||S;var lines=['TRI-LINGUA Quest — '+t('report'),t('hero')+': '+st.name+' ('+tx(CLASSES[st.cls].names)+')',t('lv')+': '+st.lvl,
  t('wordsl')+': '+learnedCount(st)+'/'+WORDS.length+' · '+t('mastered')+': '+masteredCount(st),t('streak')+': '+st.streak.days,t('bossw')+': '+ZONES.filter(function(z){return bossWins(z.id,st)>0}).length+'/'+ZONES.length];
  LANGS.forEach(function(l){var p=accPct(l,st);lines.push(LLABEL[l]+' '+t('acc')+': '+(p===null?'—':p+'%')+' ('+st.stats[l].ok+'/'+(st.stats[l].ok+st.stats[l].ng)+')')});
  ZONES.forEach(function(z){z.units.forEach(function(u){var sr=unitStars(u,st);lines.push('· '+tx(UNITS[u])+': '+'★'.repeat(sr)+'☆'.repeat(3-sr)+(st.prog[u]?' ('+st.prog[u].best+'%)':''))})});
  lines.push(today());return lines.join('\n')}
function copyText(txt,el){try{navigator.clipboard.writeText(txt).then(function(){toast(t('copied'))},fallback)}catch(e){fallback()}
  function fallback(){toast(t('copyfail'));if(el){el.focus();el.select()}}}

/* hero names: at least 2 letters, not only digits/symbols, no long repeats, no rude words. '' = fine, else a message key */
function nameIssue(nm){nm=String(nm||'').trim();var letters=(nm.match(/[\u0E00-\u0E7Fa-zA-Z\u3400-\u9FFF\uAC00-\uD7AF\u3040-\u30FF]/g)||[]);
  if(letters.length<2)return 'nm_short';var lw=letters.join('').toLowerCase();if(/^(.)\1+$/.test(lw)||/(.)\1{3,}/.test(nm.toLowerCase().replace(/\s/g,'')))return 'nm_junk';
  /* keyboard mashing: odd symbols, a short chunk repeated (sdfsdfsdf), or a long Latin word with no vowel */
  if(/[^\u0E00-\u0E7Fa-zA-Z0-9\u3400-\u9FFF\uAC00-\uD7AF\u3040-\u30FF \-_.'']/.test(nm))return 'nm_junk';
  if(/(.{2,4})\1{2,}/.test(lw))return 'nm_junk';
  if(nm.toLowerCase().split(/[\s\-_.]+/).some(function(w){return /^[a-z]{5,}$/.test(w)&&!/[aeiouy]/.test(w)}))return 'nm_junk';
  var low=nm.toLowerCase().replace(/[\s._\-*]/g,'');if(typeof BADW!=='undefined'&&BADW.some(function(w){return low.indexOf(w)>=0}))return 'nm_bad';return ''}
/* a real first + last name: two parts, each a proper name */
function fullName(s){var parts=String(s||'').trim().split(/\s+/).filter(Boolean);return parts.length>=2&&parts.every(function(x){return !nameIssue(x)})}
