/* =====================================================================
   LEDGER — anti-cheat core
   Every change to coins, gems, tickets, EXP, items and progress is an
   event in a hash-chained log. The same applyEvent() runs in the game and
   in the teacher's verifier, so a save that was edited by hand no longer
   matches its own history, and each event is re-checked against the rules
   that were in force when it happened.
   ===================================================================== */
function canon(v){if(Array.isArray(v))return '['+v.map(canon).join(',')+']';
  if(v&&typeof v==='object')return '{'+Object.keys(v).filter(function(k){return v[k]!==undefined}).sort().map(function(k){return JSON.stringify(k)+':'+canon(v[k])}).join(',')+'}';
  return JSON.stringify(v===undefined?null:v)}
function cyrb53(str,seed){var h1=0xdeadbeef^(seed||0),h2=0x41c6ce57^(seed||0);for(var i=0,ch;i<str.length;i++){ch=str.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677)}
  h1=Math.imul(h1^(h1>>>16),2246822507);h1^=Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507);h2^=Math.imul(h1^(h1>>>13),3266489909);return 4294967296*(2097151&h2)+(h1>>>0)}
function evHash(prev,e){var o={};Object.keys(e).forEach(function(k){if(k!=='h')o[k]=e[k]});return cyrb53(prev+'|'+canon(o)).toString(36)}
function rng01(seed,key){return cyrb53(String(seed)+'|'+key)/9007199254740992}
function sameR(a,b){return canon(rew(a))===canon(rew(b))}
function sameLu(a,b){return canon(a||null)===canon(b||null)}
var MIN_MS_PER_Q=800,BOT_MS_PER_Q=250;

/* ---------- state shape shared by game (S) and verifier (X) ---------- */
function blankX(){return {coin:0,gems:0,tickets:0,exp:0,lvl:1,owned:{},prog:{},boss:{},npc:{},story:{},wk:{},
  daily:{day:'',p:{correct:0,lesson:0,review:0,boss:0},c:{},bonus:false},gacha:{},stats:{lessons:0,reviews:0,bosses:0,pulls:0},la:{th:{ok:0,n:0},en:{ok:0,n:0},zh:{ok:0,n:0}},trades:{},treq:{},ex:{d:'',g:0,t:0},tn:tnBlank(),tng:{w:tnBlank(),e:tnBlank(),s:tnBlank(),c:tnBlank(),d:tnBlank(),m:tnBlank(),n:tnBlank()},raid:{},raidw:{},rw:0,wq:wqBlank(''),sp:0,spD:'',spV:0,vipc:{},schc:{},pbg:{},chk:{c:0,n:0,last:''},sk:{}}}
/* time tunnel: max = highest floor cleared, k[f] = monsters beaten on floor f since its last boss win,
   drop[f] = Thai date of the last boss drop on floor f, md/mc = monster encounters counted today */
function tnBlank(){return {max:0,k:{},drop:{},md:'',mc:0}}
/* gates: '' = Time Tunnel (X.tn), 'w' = Western Gate, 'e' = Erawan Gate (X.tng[g]) */
var TN_GATES=['','w','e','s','c','d','m','n'];
/* 23 Nov: the two monster gates give triple EXP */
var TN_XM={m:3,n:3};
function tnG(g){return g==='w'||g==='e'||g==='s'||g==='c'||g==='d'||g==='m'||g==='n'?g:''}
function tnOf(X,g){g=tnG(g);if(!g){if(!X.tn)X.tn=tnBlank();return X.tn}if(!X.tng)X.tng={};if(!X.tng[g])X.tng[g]=tnBlank();return X.tng[g]}
function tnKey(g,f,bd){g=tnG(g);return 'tn|'+(g?g+'|':'')+f+'|'+bd}
function tnTier(f){return f<=3?1:f<=6?2:f<=9?3:4}
function tnCapped(X,d,cfg,g){var T=tnOf(X,g);return !!cfg.tnMonDay&&T.md===d&&T.mc>=cfg.tnMonDay}
function tnMonR(X,f,ok,win,d,cfg,g){if(tnCapped(X,d,cfg,g))return {};var xm=TN_XM[tnG(g)]||1;return rew({exp:ok*cfg.tnExp*xm,coin:win?cfg.tnCoin:0})}
function tnBossR(X,f,ok,win,d,cfg,g){if(tnCapped(X,d,cfg,g))return {};var xm=TN_XM[tnG(g)]||1;return win?rew({exp:(cfg.tnBossExp+f*cfg.tnFloorExp)*xm,coin:cfg.tnBossCoin+f*cfg.tnFloorCoin}):rew({exp:ok*cfg.tnExp*xm})}
/* boss drop: fixed by (player seed, floor, Thai date) — one roll per floor per day, nobody can pick it */
var TN_RARS=['common','uncommon','rare','epic','legendary','mythic'];
function tnPool(IM){return Object.keys(IM).sort().filter(function(id){var it=IM[id];return it&&!it.noShop&&!isBound(id)&&TN_RARS.indexOf(it.rar)>=0})}
/* drop weights per rarity; the final (floor 10) guardian of the three exam gates drops only Epic or Legendary */
var TN_TOPG={s:1,c:1,d:1};
/* from this Thai date on, Mythic (and Celestial) items come only from summoning: not from gate bosses, the Chaos City boss or the daily shop.
   Earlier days keep the old rule so items already won still check out. */
var GACHA_ONLY_FROM='2026-11-14';
function gachaOnly(day){return typeof day==='string'&&day>=GACHA_ONLY_FROM}
function tnWeights(f,cfg,g,bd){var tier=tnTier(f),ws=TN_RARS.map(function(r,i){return int(cfg['td'+tier+'_'+(i+1)],0,1e6,0)});
  if(f===10&&TN_TOPG[tnG(g)]){ws=ws.map(function(w,i){return i===3||i===4?w:0});if(!ws[3]&&!ws[4]){ws[3]=1;ws[4]=1}}
  if(gachaOnly(bd))ws[5]=0;if(!ws.some(function(w){return w>0}))ws[4]=1;return ws}
function tnRoll(seed,f,bd,cfg,g){var tier=tnTier(f),key=tnKey(g,f,bd),out=[];
  var u=rng01(seed,key+'|n')*100,c1=int(cfg.tnC1,0,100,60),c2=int(cfg.tnC2,0,100,30),n=u<c1?1:u<c1+c2?2:3;
  var ws=tnWeights(f,cfg,g,bd),tot=ws.reduce(function(a,b){return a+b},0);
  for(var i=0;i<n;i++){var x=rng01(seed,key+'|'+i)*(tot||1),acc=0,ri=0;if(tot)for(var j=0;j<ws.length;j++){acc+=ws[j];if(x<acc){ri=j;break}}out.push(ri)}
  return out}
function tnDrop(seed,f,bd,IM,cfg,g){var pool=tnPool(IM),key=tnKey(g,f,bd);if(!pool.length)return [];
  return tnRoll(seed,f,bd,cfg,g).map(function(ri,i){var list=[];for(var r=ri;r>=0&&!list.length;r--)list=pool.filter(function(id){return IM[id].rar===TN_RARS[r]});
    if(!list.length)list=pool;return list[Math.floor(rng01(seed,key+'|'+i+'|p')*list.length)]})}
function tnApply(X,e){var T=tnOf(X,e.g),f=e.f|0;if(T.md!==e.d){T.md=e.d;T.mc=0}T.mc++;
  if(e.k==='tnmon'){if(e.win)T.k[f]=(T.k[f]||0)+1;return}
  if(e.win){T.max=Math.max(T.max,f);T.k[f]=0;if(e.bd&&T.drop[f]!==e.bd&&Array.isArray(e.items)){T.drop[f]=e.bd;e.items.forEach(function(i){addOwn(X,i)})}}}
/* ---------- weekly quests: progress counted per Thai week (Monday to Sunday) ---------- */
function bkkWeek(ms){var d=new Date((ms==null?Date.now():ms)+7*3600e3),wd=(d.getUTCDay()+6)%7;return new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-wd)).toISOString().slice(0,10)}
function wqBlank(w){return {w:w,p:{correct:0,lesson:0,review:0,boss:0,tunnel:0,days:0,raid:0},dd:{},c:{}}}
function wqOf(X,w){if(!X.wq||X.wq.w!==w)X.wq=wqBlank(w);return X.wq}
var WQ_TIMED={lesson:1,review:1,boss:1,tnmon:1,tnboss:1,raid:1};
/* ===== VIP (by verified top-up total, in baht) and the free Scholar path (by diligence points) ===== */
var VIP_TIERS=[{r:{coin:500}},{r:{coin:1000},it:['vp02']},{r:{gems:30},it:['vp03']},{r:{coin:3000},it:['vp04']},{r:{gems:60},it:['vp05']},
  {it:['vp06']},{r:{gems:100},it:['vp07']},{it:['vp08a','vp08b','vp08c']},{it:['vp09']},{it:['vp10a','vp10b','vp10c']}];
var SCH_TIERS=[{r:{coin:300}},{r:{tickets:2,coin:500}},{it:['sc03']},{r:{tickets:3,gems:20}},{it:['sc05']},{r:{tickets:5,coin:2000}},{it:['sc07']},{r:{tickets:5}},{it:['sc09']},{it:['sc10a','sc10b']}];
var SCH_CAP=40;
function vipNeed(c,lv){return int(c['vipB'+lv],1,1e6,[20,50,100,200,350,500,800,1200,1600,2000][lv-1])}
function schNeed(c,lv){return int(c['schP'+lv],1,1e6,[50,150,300,500,800,1200,1700,2300,3000,4000][lv-1])}
/* diligence points per event; the first scoring event of a day adds 1 more (coming back every day counts); at most SCH_CAP a day */
function schPts(e,X){switch(e.k){case 'lesson':return 3+((e.n|0)>0&&e.ok===e.n?2:0);case 'review':return 2;case 'boss':return e.win?5:0;case 'daily':return 1;case 'weekly':return 2;
  case 'raid':return X.raid&&X.raid[e.rid]&&X.raid[e.rid].n===(e.n|0)?5:0;case 'tnmon':return e.win?1:0;case 'tnboss':return e.win?3:0}return 0}
function schTrack(X,e){var p=schPts(e,X);if(!p||typeof e.d!=='string')return;if(X.spD!==e.d){X.spD=e.d;X.spV=0;p+=1}var a=Math.min(p,SCH_CAP-(X.spV||0));if(a>0){X.spV=(X.spV||0)+a;X.sp=(X.sp||0)+a}}
function bVip(X,lv,cfg){var T=VIP_TIERS[lv-1];return withLevel(X,{k:'vip',lv:lv,r:rew(T.r),items:(T.it||[]).slice()},cfg)}
function bSch(X,lv,cfg){var T=SCH_TIERS[lv-1];return withLevel(X,{k:'sch',lv:lv,r:rew(T.r),items:(T.it||[]).slice()},cfg)}
function weekTrack(X,e){if(!WQ_TIMED[e.k]||typeof e.t!=='number')return;var Q=wqOf(X,bkkWeek(e.t)),p=Q.p;p.correct+=e.ok|0;
  if(e.k==='lesson'&&e.st>0)p.lesson++;if(e.k==='review')p.review+=e.n|0;if(e.k==='boss'&&e.win)p.boss++;if(e.k==='tnboss'&&e.win)p.tunnel++;if(e.k==='raid')p.raid++;
  Q.dd[bkkDay(e.t)]=1;p.days=Object.keys(Q.dd).length}
/* ---------- Chaos City raid: one shared boss a week ---------- */
var RAID_RARS=['mythic','legendary','rare','celestial','none'];
/* special event bosses (teacher-announced, one-off). start is UTC ms; the boss can be fought for `hours`.
   Drops: the first `cel` players in the fair draw get a celestial item, next `my` mythic, next `lg` legendary; the rest no item.
   Everyone who fought gets coin + gems + exp when it falls. */
/* AUTO CHECK-IN EVENT (2026-11-18): online 19:00–20:00 Bangkok time on 18–30 Nov → 10 free tickets, once per day */
/* boxes closed for good: pulls after this time are not genuine */
var BN_END={bxS:Date.UTC(2026,10,23,4,30)};
var EVA={from:'2026-11-18',to:'2026-11-30',h0:19,h1:20,tk:10};
function evaDayOf(t){var b=new Date(t+7*36e5);return b.getUTCFullYear()+'-'+String(b.getUTCMonth()+1).padStart(2,'0')+'-'+String(b.getUTCDate()).padStart(2,'0')}
function evaNow(t){var b=new Date(t+7*36e5),h=b.getUTCHours(),d=evaDayOf(t);return h>=EVA.h0&&h<EVA.h1&&d>=EVA.from&&d<=EVA.to}
function evaValid(e){var t=int(e.t,0,9e15,0);return evaNow(t)&&e.day===evaDayOf(t)&&(e.tk|0)===EVA.tk}
var EV_BOSSES=[{id:'ev-lion-1',art:'lion',start:Date.UTC(2026,10,14,13,30),hours:24,hp:100,q:10,cel:1,my:3,lg:5,coin:1000,gems:10,exp:200,
  names:m('สิงโตราชันน้อย','Little Lion King','小狮子王')},
 {id:'ev-rex-1',art:'rex',start:Date.UTC(2026,10,18,12,0),hours:24,hp:100,q:10,cel:1,my:3,lg:5,coin:1000,gems:10,exp:200,
  names:m('มังกรกลไกผู้พิทักษ์ไตรภาษา','Tri-Lingua Mecha Dragon','三语守护机械龙')},
 /* 23 Nov: WORLD BOSS — one week, shared HP 300; its skill eats 10 coins for every wrong answer (pen) */
 {id:'ev-goat-1',art:'goat',world:true,start:Date.UTC(2026,10,23,7,0),hours:168,hp:300,q:10,cel:1,my:3,lg:5,coin:1500,gems:15,exp:300,pen:10,
  names:m('แพะแห่งโลกา','World Goat','世界之羊'),mon:'boss_world_goat',emo:'🐐',cast:m('แพะแห่งโลกาใช้สกิล “กลืนทรัพย์”!','The World Goat casts “Coin Devourer”!','世界之羊施放“吞金术”!')},
 /* 30 Nov → 7 Dec, then 7 → 14 Dec: two more world bosses in a row, same coin-eating skill */
 {id:'ev-gale-1',art:'gale',world:true,start:Date.UTC(2026,10,30,7,0),hours:168,hp:350,q:10,cel:1,my:3,lg:5,coin:1500,gems:15,exp:300,pen:10,
  names:m('อัศวินวายุ','Gale Knight','疾风骑士'),mon:'boss_sky_gale_knight',emo:'🌪️',cast:m('อัศวินวายุใช้สกิล “พายุกวาดทรัพย์”!','The Gale Knight casts “Gale Sweep”!','疾风骑士施放“疾风扫金”!')},
 {id:'ev-rift-1',art:'rift',world:true,start:Date.UTC(2026,11,7,7,0),hours:168,hp:400,q:10,cel:1,my:3,lg:5,coin:2000,gems:20,exp:400,pen:10,
  names:m('ราชามังกรรอยแยก','Rift Dragon King','裂隙龙王'),mon:'boss_abyss_rift_dragon_king',emo:'🐲',cast:m('ราชามังกรรอยแยกใช้สกิล “รอยแยกดูดทอง”!','The Rift Dragon King casts “Rift Drain”!','裂隙龙王施放“裂隙吸金”!')}];
/* coins lost to a boss skill in one fight: pen per wrong answer, never more than the coins you have */
/* guardian spirits (VIP 3+): extra boss damage per right answer in raids; 0 when the teacher turns them off */
function gdDmg(c){return c&&c.gdOn===0?0:int(c&&c.gdDmg,0,100,20)}
function raidPenFull(rid,n,ok){var b=evBoss(rid);return b&&b.pen?Math.max(0,(n|0)-(ok|0))*b.pen:0}
function evBoss(rid){return EV_BOSSES.filter(function(b){return b.id===rid})[0]||null}
/* numbers for any boss id: an event boss uses its own, the weekly boss the teacher's settings */
function bossCfg(rid,cfg){var b=evBoss(rid);if(b)return {hp:b.hp,q:b.q,expQ:int(cfg.raidExpQ,0,1e4,2)};return {hp:int(cfg.raidHP,1,1e6,150),q:int(cfg.raidQ,1,50,5),expQ:int(cfg.raidExpQ,0,1e4,2)}}
function raidWinR(rid,cfg){var b=evBoss(rid);return b?rew({exp:b.exp,coin:b.coin,gems:b.gems}):rew({exp:int(cfg.raidExp,0,1e6,200)})}
function evSlotOf(b){return {id:b.id,start:b.start,end:b.start+b.hours*3600e3,next:b.start,ev:b}}
function raidSlot(now,cfg){var d=new Date(now+7*3600e3),T0=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-7*3600e3,back=(d.getUTCDay()-int(cfg.raidDay,0,6,6)+7)%7;
  var st=T0-back*864e5+int(cfg.raidHour,0,23,19)*3600e3;if(st>now)st-=7*864e5;return {id:bkkDay(st),start:st,end:st+int(cfg.raidHours,1,167,48)*3600e3,next:st+7*864e5}}
function raidRank(rid,uids,cfg){var order=uids.slice().sort(function(a,b){var x=rng01(rid,'rk|'+a),y=rng01(rid,'rk|'+b);return x-y||(a<b?-1:1)}),out={},EB=evBoss(rid);
  if(EB){order.forEach(function(u,i){out[u]=i<EB.cel?'celestial':i<EB.cel+EB.my?'mythic':i<EB.cel+EB.my+EB.lg?'legendary':'none'});return out}
  var nm=int(cfg.raidMy,0,1000,5),nl=int(cfg.raidLg,0,1000,15);
  order.forEach(function(u,i){out[u]=i<nm?'mythic':i<nm+nl?'legendary':'rare'});return out}
function raidPool(IM,rar){return Object.keys(IM).sort().filter(function(id){var it=IM[id];return it&&!it.noShop&&!isBound(id)&&it.rar===rar})}
function raidItem(rid,uid,rar,IM){if(rar==='none')return '';var EB=evBoss(rid),ORD=['celestial','mythic','legendary','rare'],ri=ORD.indexOf(rar),list=[];if(ri<0)return '';
  if(!EB&&ri===1&&gachaOnly(rid))ri=2;
  for(var r=ri;r<ORD.length&&!list.length;r++){list=raidPool(IM,ORD[r]);if(!list.length&&EB)list=Object.keys(IM).sort().filter(function(id){var it=IM[id];return it&&!isBound(id)&&it.rar===ORD[r]})}
  if(!list.length)return '';return list[Math.floor(rng01(rid,'it|'+uid)*list.length)]}
function raidR(ok,cfg){return rew({exp:ok*int(cfg.raidExpQ,0,1e4,2)})}
function dayOf(X,d){if(X.daily.day!==d)X.daily={day:d,p:{correct:0,lesson:0,review:0,boss:0},c:{},bonus:false}}
function addOwn(X,id,n){X.owned[id]=(X.owned[id]||0)+(n||1)}
function applyGrant(X,r,lu){r=r||{};X.coin+=r.coin||0;X.gems+=r.gems||0;X.tickets+=r.tickets||0;X.exp+=(r.exp||0)-(lu?lu.exp:0);
  if(lu){X.lvl+=lu.n;X.gems+=lu.gems||0;X.tickets+=lu.tickets||0}}
function applyWords(X,e){(e.wc||[]).forEach(function(w){X.wk[w]=(X.wk[w]||0)+1});(e.ww||[]).forEach(function(w){X.wk[w]=Math.max(0,(X.wk[w]||0)-1)});
  if(isO(e.la))LANGS.forEach(function(l){var a=e.la[l];if(Array.isArray(a)){X.la[l].ok+=a[0]|0;X.la[l].n+=a[1]|0}})}
/* market: what a trade asks for — coins, or n of one item (gems are never tradable) */
function cleanPay(p){p=isO(p)?p:{};if(typeof p.item==='string'&&IDRE.test(p.item))return {item:p.item,n:int(p.n,1,1e4)};return {coin:int(p.coin,1,1e7)}}
function samePay(a,b){return canon(cleanPay(a))===canon(cleanPay(b))}
/* BAG, +UPGRADES AND COMBAT POWER (from 24 Nov 2026 20:00 Bangkok)
   'salv' dismantles one owned item into upgrade stones; 'enh' upgrades an item +1 (to +20) with coins and stones.
   +1..+10 always work; from +11 the chance drops 7% a step (30% at +20); a miss keeps the item and its level.
   The roll is fixed by player, item and try number, so the teacher can redo it. Raids give 2 stones,
   and combat power (best owned item per kind, upgrades included) adds up to +5 boss damage per right answer. */
var ENH_T=Date.UTC(2026,10,24,13,0),ENH_P={common:10,uncommon:20,rare:40,epic:80,legendary:150,mythic:250,celestial:400},ENH_ST={common:1,uncommon:2,rare:4,epic:8,legendary:15,mythic:25,celestial:40};
var ENH_NOCAT={title:1,haircolor:1,hairColor:1,frame:1};
function enhChance(lv){return lv<=10?100:Math.max(30,100-(lv-10)*7)}
function enhCoin(lv){return lv*200}
function enhRoll(uid,id,n){return Math.floor(rng01(uid,'enh|'+id+'|'+n)*100)}
function enhOk(uid,id,n,lv){return enhRoll(uid,id,n)<enhChance(lv)}
function itemPow(it,lv){return it&&ENH_P[it.rar]?Math.round(ENH_P[it.rar]*(1+.08*(lv|0))):0}
function cpBest(X,items,ownF,extra){var best={};Object.keys(X.owned||{}).concat(extra||[]).forEach(function(id){var it=items[id];if(!it||ENH_NOCAT[it.cat]||!((ownF?ownF(id):(X.owned[id]|0))>0))return;var p=itemPow(it,(X.enh||{})[id]),sk=typeof slotOf==='function'?slotOf(it):it.cat;if(p>(best[sk]||0))best[sk]=p});
  return 10*Object.keys(best).reduce(function(a,k){return a+best[k]},0)}
function cpBonus(cp){return Math.min(5,Math.floor((cp|0)/1000))}
function subOwn(X,id,n){X.owned[id]=(X.owned[id]||0)-n;if(X.owned[id]===0)delete X.owned[id]}
function payOut(X,p){p=cleanPay(p);if(p.item)subOwn(X,p.item,p.n);else X.coin-=p.coin}
function payIn(X,p){p=cleanPay(p);if(p.item)addOwn(X,p.item,p.n);else X.coin+=p.coin}
function treqKey(e){return e.tid+'@'+e.from}
/* market rules: 5% stall fee on coin sales (recorded in the tdone event), price range per rarity, 6 open offers per stall */
/* skills: 3 per class, unlocked by level, upgraded to Lv5 with coins. In boss fights each skill works once per boss;
   attack skills add bonus damage (e.sb) that may not exceed what the used skills (e.su) allow at their level. */
/* SKILL TREES v2 (from 24 Nov 2026 Bangkok): per class a base skill at level 5, then at 15 / 25 / 35 / 40 / 60
   the player picks branch A or B (event 'skbr'; first pick free, a change costs SK_BRCOST once a Thai week).
   Every skill deals damage (d, +1 at Lv3 and Lv5) and has its own extra (x). The old 9 skills sit inside the trees;
   events from before SK_V2_T keep the old rules (old unlock levels, old caps). */
var SK_V2_T=Date.UTC(2026,10,23,17,0),SK_TIERS=[5,15,25,35,40,60],SK_BRCOST=500;
function skT(id,d){return {cls:d[0],u:SK_TIERS[d[1]],t:d[1],b:d[2],k:d[3],d:d[4],x:d[5]}}
var SK_DEF={};(function(){var R={
 sw1:['sword',0,'','atk',2,{pierce:1}],swa1:['sword',1,'A','atk',3,{pierce:2}],swa2:['sword',2,'A','atk',4,{burn:2}],swa3:['sword',3,'A','atk',5,{combo:[2,3]}],sw3:['sword',4,'A','ult',6,{streak:[3,2]}],swa5:['sword',5,'A','ult',10,{rest:5}],
 sw2:['sword',1,'B','def',2,{shield:1}],swb2:['sword',2,'B','def',3,{cut:1}],swb3:['sword',3,'B','def',4,{shield:1,pierce:2}],swb4:['sword',4,'B','def',5,{shield:2}],swb5:['sword',5,'B','ult',8,{shield:3}],
 mg1:['mage',0,'','ctl',2,{cut:1}],mg2:['mage',1,'A','atk',4,{}],mga2:['mage',2,'A','atk',4,{streak:[2,1]}],mga3:['mage',3,'A','atk',5,{burn:3}],mg3:['mage',4,'A','ult',6,{streak:[3,1]}],mga5:['mage',5,'A','ult',10,{double:1}],
 mgb1:['mage',1,'B','ctl',2,{hint:1}],mgb2:['mage',2,'B','ctl',3,{hint:2}],mgb3:['mage',3,'B','ctl',4,{cut:2}],mgb4:['mage',4,'B','ctl',5,{cut:2,shield:1}],mgb5:['mage',5,'B','ult',8,{hint:3,cut:1}],
 ar1:['archer',0,'','ctl',2,{hint:1}],ar2:['archer',1,'A','atk',3,{combo:[3,3]}],ara2:['archer',2,'A','atk',4,{burn:2}],ara3:['archer',3,'A','atk',5,{combo:[2,3]}],ar3:['archer',4,'A','ult',6,{pierce:4}],ara5:['archer',5,'A','ult',10,{rest:5}],
 arb1:['archer',1,'B','ctl',2,{cut:2}],arb2:['archer',2,'B','ctl',3,{hint:2}],arb3:['archer',3,'B','def',4,{shield:1}],arb4:['archer',4,'B','def',5,{shield:1,hint:1}],arb5:['archer',5,'B','ult',8,{shield:2,hint:3}]};
 Object.keys(R).forEach(function(id){SK_DEF[id]=skT(id,R[id])});SK_DEF.sw3.u0=30;SK_DEF.mg3.u0=30;SK_DEF.ar3.u0=30})();
var SK_COST=[0,0,500,1500,4000,10000],SK_SBMAX=40;
function skOld(t){return t!=null&&t<SK_V2_T}
function skU(id,t){var d=SK_DEF[id];return skOld(t)&&d.u0?d.u0:d.u}
function skLv(X,id,t){var d=SK_DEF[id];if(!d||(X.lvl|0)<skU(id,t))return 0;if(!skOld(t)&&d.b&&((X.skb||{})[d.t])!==d.b)return 0;if(skOld(t)&&['sw1','sw2','sw3','mg1','mg2','mg3','ar1','ar2','ar3'].indexOf(id)<0)return 0;return Math.min(5,Math.max(1,(X.sk&&X.sk[id])|0))}
function skReq(id,lv,t){return Math.min(skOld(t)?999:60,skU(id,t)+(lv-1)*5)}
function skDmg(id,lv){var d=SK_DEF[id];return lv?d.d+(lv>=3?1:0)+(lv>=5?1:0):0}
function skMaxBonus(id,lv,t){if(!lv)return 0;if(skOld(t))return skMaxBonus0(id,lv);var x=SK_DEF[id].x,b=skDmg(id,lv);if(x.pierce)b+=x.pierce;if(x.burn)b+=x.burn;if(x.streak)b+=x.streak[0]*x.streak[1];if(x.combo)b+=x.combo[1];if(x.rest)b+=x.rest;if(x.double)b+=skDmg(id,lv);return b}
function skMaxBonus0(id,lv){if(!lv)return 0;switch(id){case 'sw1':return [0,1,1,2,2,3][lv];case 'sw3':return lv>=5?8:lv>=4?6:3;case 'mg2':return [0,2,2,3,3,4][lv];case 'mg3':return lv>=5?9:lv>=4?6:4;case 'ar2':return [0,2,2,3,3,4][lv];case 'ar3':return [0,3,3,4,4,5][lv]}return 0}
var MK_FEE=5,MK_MAXOPEN=6,MK_RANGE={common:[10,300],uncommon:[20,800],rare:[50,2000],epic:[120,5000],legendary:[300,15000],mythic:[600,40000],celestial:[1200,100000]};
function mkFee(pay){pay=cleanPay(pay);return pay.item?0:Math.ceil(pay.coin*MK_FEE/100)}
function mkRange(it){return (it&&MK_RANGE[it.rar])||[1,1e7]}
function sellPrice(it,cfg){return it&&cfg?int(cfg['sell_'+it.rar],0,1e6,0):0}
function exDay(X,d){if(!X.ex||X.ex.d!==d)X.ex={d:d,g:0,t:0}}
function exCost(to,n,cfg){return n*(to==='gems'?cfg.exCoinGem:cfg.exGemTicket)}
function exRoom(X,to,d,cfg){exDay(X,d);var cap=to==='gems'?cfg.exGemDay:cfg.exTicketDay;return cap?Math.max(0,cap-(to==='gems'?X.ex.g:X.ex.t)):1e6}
function applyEvent(X,e){switch(e.k){
  case 'ex':exDay(X,e.d);if(e.to==='gems'){X.coin-=e.cost;X.gems+=e.n;X.ex.g+=e.n}else{X.gems-=e.cost;X.tickets+=e.n;X.ex.t+=e.n}break;
  case 'sell':subOwn(X,e.item,e.n);X.coin+=e.price*e.n;if(!X.owned[e.item]&&X.enh)delete X.enh[e.item];break;
  case 'salv':subOwn(X,e.item,1);X.st=(X.st|0)+(e.st|0);if(!X.owned[e.item]&&X.enh)delete X.enh[e.item];break;
  case 'enh':X.coin-=e.cost|0;X.st=(X.st|0)-(e.sc|0);if(!X.enhn)X.enhn={};X.enhn[e.item]=(X.enhn[e.item]|0)+1;if(e.ok){if(!X.enh)X.enh={};X.enh[e.item]=e.lv|0}break;
  case 'discard':subOwn(X,e.item,e.n);break;
  case 'tout':subOwn(X,e.item,e.n);X.trades[e.tid]={item:e.item,n:e.n,want:cleanPay(e.want),to:e.to||'',st:'open',by:'',t:e.t};break;
  case 'tcancel':var tc=X.trades[e.tid];if(tc&&tc.st==='open'){addOwn(X,tc.item,tc.n);tc.st='cancel'}break;
  case 'tdone':var td=X.trades[e.tid];if(td&&td.st==='open'){td.st='done';td.by=e.by;payIn(X,e.pay);if(e.fee>0)X.coin-=e.fee|0}break;
  case 'tpay':payOut(X,e.pay);X.treq[treqKey(e)]={tid:e.tid,from:e.from,pay:cleanPay(e.pay),st:'wait',t:e.t};break;
  case 'tget':var rg=X.treq[treqKey(e)];if(rg&&rg.st==='wait'){rg.st='got';addOwn(X,e.item,e.n)}break;
  case 'trefund':var rr=X.treq[treqKey(e)];if(rr&&rr.st==='wait'){rr.st='refund';payIn(X,rr.pay)}break;
  case 'start':X.coin=(e.r&&e.r.coin)||0;X.gems=(e.r&&e.r.gems)||0;X.tickets=(e.r&&e.r.tickets)||0;X.exp=0;X.lvl=1;X.owned={};[e.o,e.hair,'sh1'].forEach(function(i){if(i)addOwn(X,i)});break;
  case 'legacy':var p=isO(e.snap)?e.snap:{};['coin','gems','tickets','exp','lvl'].forEach(function(k){X[k]=int(p[k],0,1e8)});X.lvl=Math.max(1,X.lvl);
    ['owned','prog','boss','npc','story','wk','gacha'].forEach(function(k){X[k]=isO(p[k])?JSON.parse(JSON.stringify(p[k])):{}});if(isO(p.stats))['lessons','reviews','bosses','pulls'].forEach(function(k){X.stats[k]=int(p.stats[k],0,1e7)});break;
  case 'lesson':dayOf(X,e.d);if(e.st>0){X.daily.p.lesson++;X.stats.lessons++}X.daily.p.correct+=e.ok;
    var pr=X.prog[e.u]||{stars:0,best:0,clears:0};pr.stars=Math.max(pr.stars,e.st);pr.best=Math.max(pr.best,Math.round(e.ok/e.n*100));if(e.st>0)pr.clears++;X.prog[e.u]=pr;applyWords(X,e);applyGrant(X,e.r,e.lu);break;
  case 'review':dayOf(X,e.d);X.daily.p.review+=e.n;X.daily.p.correct+=e.ok;X.stats.reviews++;applyWords(X,e);applyGrant(X,e.r,e.lu);break;
  case 'boss':dayOf(X,e.d);X.daily.p.correct+=e.ok;if(e.win){X.daily.p.boss++;var b=X.boss[e.z]||{wins:0,tday:''};if(!b.wins||(e.r&&e.r.tickets))b.tday=e.d;b.wins++;X.boss[e.z]=b;X.stats.bosses++}
    applyWords(X,e);applyGrant(X,e.r,e.lu);break;
  case 'talk':X.npc[e.npc]=true;break;
  case 'story':X.story[e.q]='claimed';applyGrant(X,e.r,e.lu);break;
  case 'daily':dayOf(X,e.d);X.daily.c[e.q]=true;applyGrant(X,e.r,e.lu);if(e.b){X.daily.bonus=true;X.gems+=e.b.gems||0;X.tickets+=e.b.tickets||0}break;
  case 'pull':X.tickets-=e.n;(e.items||[]).forEach(function(i){addOwn(X,i)});X.gacha[e.b]=Object.assign({},e.gc);X.stats.pulls+=e.n;break;
  case 'buy':X[e.sh==='gem'?'gems':'coin']-=e.price;addOwn(X,e.item);break;
  case 'tnmon':case 'tnboss':dayOf(X,e.d);X.daily.p.correct+=e.ok;applyWords(X,e);applyGrant(X,e.r,e.lu);tnApply(X,e);break;
  case 'raid':dayOf(X,e.d);X.daily.p.correct+=e.ok;applyWords(X,e);applyGrant(X,e.r,e.lu);if(!X.raid)X.raid={};var rr=X.raid[e.rid]||{n:0,ok:0};rr.n+=e.n;rr.ok+=e.ok;if(e.sb>0)rr.sb=(rr.sb|0)+(e.sb|0);if(e.gd>0)rr.gd=(rr.gd|0)+(e.gd|0);if(e.cb>0)rr.cb=(rr.cb|0)+(e.cb|0);if(e.st>0)X.st=(X.st|0)+(e.st|0);if(Array.isArray(e.su)&&e.su.length)rr.su=(rr.su||[]).concat(e.su);X.raid[e.rid]=rr;if(e.pen>0)X.coin-=e.pen|0;break;
  case 'alvl':X.lvl=Math.min(999,(X.lvl|0)+(e.n|0));break;
  case 'skup':X.coin-=e.cost|0;if(!X.sk)X.sk={};X.sk[e.sk]=e.lv|0;break;
  case 'skbr':X.coin-=e.cost|0;if(!X.skb)X.skb={};X.skb[e.t2|0]=e.b;if((e.cost|0)>0)X.skbw=bkkWeek(e.t);break;
  case 'raidwin':if(!X.raidw)X.raidw={};X.raidw[e.rid]=e.tier||1;X.rw=(X.rw||0)+1;if(e.item)addOwn(X,e.item);applyGrant(X,e.r,e.lu);break;
  case 'eva':X.tickets+=EVA.tk;if(!X.eva)X.eva={};X.eva[e.day]=1;break;
  case 'pbg':X.coin-=e.price;if(!X.pbg)X.pbg={};X.pbg[e.id]=1;break;
  case 'chk':ckApply(X,e);break;
  case 'weekly':var WQ=wqOf(X,e.w);WQ.c[e.q]=true;applyGrant(X,e.r,e.lu);break;
  case 'vip':case 'sch':var CL0=e.k==='vip'?(X.vipc=X.vipc||{}):(X.schc=X.schc||{});CL0[e.lv]=1;(Array.isArray(e.items)?e.items:[]).forEach(function(id){if(IDRE.test(id))addOwn(X,id)});applyGrant(X,e.r,e.lu);break}
  weekTrack(X,e);schTrack(X,e)}

/* ---------- rule formulas (given the config in force) ---------- */
function needAt(l,cfg){return cfg.levelBase+cfg.levelStep*(l-1)}
function levelCalc(X,add,cfg){var exp=X.exp+add,lvl=X.lvl,n=0;while(exp>=needAt(lvl,cfg)&&lvl<999){exp-=needAt(lvl,cfg);lvl++;n++}
  if(!n)return null;return {n:n,exp:X.exp+add-exp,gems:n*cfg.levelUpGems,tickets:n*cfg.levelUpTickets}}
function starsFor(ok,n,cfg){var pct=Math.round(ok/n*100);return pct>=95?3:pct>=80?2:pct>=cfg.passPct?1:0}
/* zones from order xmFrom on give xmMul times the EXP (lessons and boss fights) */
function zoneOrd(z){var Z=typeof ZONES!=='undefined'&&ZONES?ZONES:[];for(var i=0;i<Z.length;i++)if(Z[i].id===z)return Z[i].order||i+1;return 0}
function unitZone(u){var Z=typeof ZONES!=='undefined'&&ZONES?ZONES:[];for(var i=0;i<Z.length;i++)if((Z[i].units||[]).indexOf(u)>=0)return Z[i].id;return ''}
/* 23 Nov: zones from order 18 on (Eternal Volcano, Star Citadel) give EXP ×5 */
var XM5_FROM=18;
function xMul(cfg,z){var o=zoneOrd(z);if(o>=XM5_FROM)return 5;var f=cfg.xmFrom||0,k=cfg.xmMul||1;return f&&k>1&&o>=f?k:1}
function lessonR(X,u,n,ok,cfg){var st=starsFor(ok,n,cfg),p=X.prog[u],first=st>0&&!(p&&p.stars>0),xm=xMul(cfg,unitZone(u));
  var r={exp:(ok*cfg.expPerCorrect+st*cfg.expPerStar)*xm,coin:ok*cfg.coinPerCorrect+st*cfg.coinPerStar};if(first)r.tickets=cfg.firstClearTickets;return {st:st,r:rew(r)}}
function reviewR(n,ok,cfg){return rew({exp:ok*cfg.reviewExp,coin:ok*cfg.reviewCoin})}
function bossR(X,z,win,ok,d,cfg){var xm=xMul(cfg,z);if(!win)return rew({exp:ok*3*xm});var b=X.boss[z];
  if(!b||!b.wins)return rew({exp:cfg.bossFirstExp*xm,coin:cfg.bossFirstCoin,tickets:cfg.bossFirstTickets,gems:cfg.bossFirstGems});
  var r={exp:cfg.bossRepeatExp*xm,coin:cfg.bossRepeatCoin};if(b.tday!==d)r.tickets=cfg.bossRepeatTickets;return rew(r)}
function startR(cfg){return rew({coin:cfg.startCoin,gems:cfg.startGems,tickets:cfg.startTickets})}
/* summon: outcome fixed by (player seed, banner, pull number); nobody can pick it */
function rarPresent(pool,IM){var have={};pool.forEach(function(id){if(IM[id])have[IM[id].rar]=1});return RARITY.map(function(r){return r.code}).filter(function(c){return have[c]})}
function gachaStep(seed,bid,g,cfg,rs){g={i:(g&&g.i||0)+1,soft:(g&&g.soft||0)+1,hard:(g&&g.hard||0)+1};
  var min=g.hard>=cfg.hardPity?RAR.legendary.order:g.soft>=cfg.softPity?RAR.rare.order:0;
  var cand=rs.filter(function(r){return RAR[r].order>=min});if(!cand.length)cand=rs;
  var ws=cand.map(function(r){return cfg['w_'+r]||0}),tot=ws.reduce(function(a,b){return a+b},0);if(!tot){ws=cand.map(function(){return 1});tot=cand.length}
  var x=rng01(seed,bid+'|'+g.i)*tot,acc=0,r=cand[cand.length-1];for(var i=0;i<cand.length;i++){acc+=ws[i];if(x<acc){r=cand[i];break}}
  var o=RAR[r].order;if(o>=RAR.rare.order)g.soft=0;if(o>=RAR.legendary.order)g.hard=0;return {r:r,g:g,u2:rng01(seed,bid+'|'+g.i+'|p')}}
function gachaRun(seed,bid,g0,n,cfg,pool,IM){var rs=rarPresent(pool,IM),g=g0,items=[],rr=[];
  for(var k=0;k<n;k++){var st=gachaStep(seed,bid,g,cfg,rs);g=st.g;rr.push(st.r);var list=pool.filter(function(id){return IM[id]&&IM[id].rar===st.r});items.push(list[Math.floor(st.u2*list.length)])}
  return {items:items,rr:rr,gc:g}}
/* builders: the game and the verifier construct the same event from the same facts */
function withLevel(X,e,cfg){e.lu=levelCalc(X,(e.r&&e.r.exp)||0,cfg)||undefined;if(!e.lu)delete e.lu;return e}
function bLesson(X,u,n,ok,dur,d,words,la,cfg){var x=lessonR(X,u,n,ok,cfg);return withLevel(X,{k:'lesson',d:d,u:u,n:n,ok:ok,st:x.st,dur:dur,wc:words.c,ww:words.w,la:la,r:x.r},cfg)}
function bReview(X,n,ok,dur,d,words,la,cfg){return withLevel(X,{k:'review',d:d,n:n,ok:ok,dur:dur,wc:words.c,ww:words.w,la:la,r:reviewR(n,ok,cfg)},cfg)}
function bBoss(X,z,win,n,ok,dur,d,words,la,cfg){return withLevel(X,{k:'boss',d:d,z:z,win:!!win,n:n,ok:ok,dur:dur,wc:words.c,ww:words.w,la:la,r:bossR(X,z,win,ok,d,cfg)},cfg)}
function bTnMon(X,f,n,ok,dur,d,words,la,cfg,g){g=tnG(g);var win=ok===n&&n>=cfg.tnQ;return withLevel(X,{k:'tnmon',g:g||undefined,d:d,f:f,n:n,ok:ok,win:win,dur:dur,wc:words.c,ww:words.w,la:la,r:tnMonR(X,f,ok,win,d,cfg,g)},cfg)}
function bTnBoss(X,f,n,ok,dur,d,words,la,cfg,seed,sd,g){g=tnG(g);var T=tnOf(X,g),win=ok===n&&n>=cfg.tnBossQ&&(T.k[f]||0)>=cfg.tnMon,bd=bkkDay();
  var e={k:'tnboss',g:g||undefined,d:d,f:f,n:n,ok:ok,win:win,dur:dur,wc:words.c,ww:words.w,la:la,bd:bd,sd:sd,items:win&&T.drop[f]!==bd?tnDrop(seed,f,bd,ITEM,cfg,g):[],r:tnBossR(X,f,ok,win,d,cfg,g)};if(!g)delete e.g;return withLevel(X,e,cfg)}
function bRaid(X,rid,n,ok,dur,d,words,la,cfg){var e={k:'raid',d:d,rid:rid,n:n,ok:ok,dur:dur,wc:words.c,ww:words.w,la:la,r:raidR(ok,cfg)},pf=raidPenFull(rid,n,ok);if(pf)e.pen=Math.min(pf,Math.max(0,X.coin|0));return withLevel(X,e,cfg)}
function bRaidWin(X,rid,tier,item,d,cfg){return withLevel(X,{k:'raidwin',d:d,rid:rid,tier:tier,item:item,r:raidWinR(rid,cfg)},cfg)}
function bWeekly(X,wq,w,cfg){return withLevel(X,{k:'weekly',w:w,q:wq.id,r:rew(wq.reward)},cfg)}
function bStory(X,q,d,cfg){return withLevel(X,{k:'story',d:d,q:q.id,r:rew(q.reward)},cfg)}
function bDaily(X,dq,d,dailyIds,cfg){var Y={c:Object.assign({},X.daily.day===d?X.daily.c:{})};Y.c[dq.id]=true;var bonusDue=!(X.daily.day===d&&X.daily.bonus)&&dailyIds.length&&dailyIds.every(function(id){return Y.c[id]});
  var e=withLevel(X,{k:'daily',d:d,q:dq.id,r:rew(dq.reward)},cfg);if(bonusDue){var b=rew({tickets:cfg.dailyBonusTickets,gems:cfg.dailyBonusGems});if(Object.keys(b).length)e.b=b}return e}

/* ---------- verifier ---------- */
var VMSG={seq:m('ลำดับประวัติขาดหาย','History has gaps','记录序号缺失'),hash:m('ประวัติถูกแก้ไข (ลายเซ็นลูกโซ่ไม่ตรง)','History was edited (chain mismatch)','记录被修改(链校验失败)'),
 back:m('เวลาย้อนหลัง','Time goes backwards','时间倒流'),future:m('เวลาอยู่ในอนาคต','Time is in the future','时间在未来'),overlap:m('เล่นซ้อนเวลากัน','Sessions overlap in time','游戏时间重叠'),
 fast:m('เร็วเกินกว่ามนุษย์ทำได้','Faster than humanly possible','速度不合常理'),quick:m('ตอบเร็วมาก (น่าจะจำคำตอบได้จากการเล่นซ้ำ — ไม่ถือว่าโกง)','Answered very fast (likely remembered from replaying — not cheating)','答题很快(多半是重复练习记住了——不算作弊)'),daycap:m('เล่นเยอะมากในวันเดียว (ขยัน — ไม่ถือว่าโกง)','Played a lot in one day (diligent — not cheating)','单日练习很多(勤奋——不算作弊)'),
 cphash:m('ประวัติก่อนจุดตรวจของครูถูกแก้ไข','History before the teacher\'s checkpoint was changed','老师检查点之前的记录被修改'),cpback:m('เพิ่มเหตุการณ์ย้อนหลังจุดตรวจของครู','Events back-dated before the teacher\'s checkpoint','在老师检查点之前补加记录'),
 first:m('ประวัติต้องเริ่มด้วยการสร้างตัวละคร','History must start with hero creation','记录必须从创建角色开始'),start:m('ของเริ่มต้นไม่ตรงกติกา','Starting items don\'t match the rules','初始物品不符合规则'),
 shape:m('ข้อมูลเหตุการณ์ผิดรูปแบบ','Malformed event','记录格式错误'),qn:m('จำนวนข้อไม่ตรงกติกา','Question count doesn\'t match the rules','题数不符'),stars:m('จำนวนดาวไม่ตรงคะแนน','Stars don\'t match the score','星数与得分不符'),
 reward:m('รางวัลไม่ตรงกติกา','Reward doesn\'t match the rules','奖励不符合规则'),level:m('การเลเวลอัปไม่ตรงกติกา','Level-up doesn\'t match the rules','升级不符合规则'),
enh:m('ตีบวกหรือย่อยของไม่ตรงกติกา','Upgrade or dismantle breaks the rules','强化或分解不符合规则'),cp:m('ดาเมจจากพลังรบเกินกว่าของที่มี','Combat power damage is more than the gear allows','战力伤害超出装备允许'),gd:m('ความแรงภูตพิทักษ์เกินกว่าที่ตั้งไว้','Guardian damage is more than allowed','守护灵伤害超出设定'),gdvip:m('ใช้ภูตพิทักษ์ทั้งที่ยอดเติมยังไม่ถึง VIP 3','Guardian used before reaching VIP 3','未达到 VIP 3 就使用守护灵'),bnend:m('สุ่มตู้ที่ปิดไปแล้ว','Summoned from a box that has closed','从已关闭的卡池召唤'), pen:m('เหรียญที่ถูกบอสกลืนไม่ตรงกับจำนวนข้อที่ตอบผิด','Coins eaten by the boss do not match the wrong answers','被首领吞掉的金币与答错题数不符'), eva:m('รับตั๋วเช็คชื่ออัตโนมัตินอกเวลา 19:00–20:00 หรือนอกช่วงกิจกรรม','Auto check-in tickets claimed outside 19:00–20:00 or outside the event days','在19:00–20:00或活动日期之外领取自动签到券'), skill:m('ใช้สกิลหรืออัปสกิลผิดเงื่อนไข','Skill used or upgraded against the rules','技能使用或升级不符合规则'), dup:m('รับรางวัลซ้ำ','Reward claimed twice','重复领取'),cond:m('รับรางวัลก่อนทำเงื่อนไขครบ','Claimed before meeting the condition','未达成条件就领取'),unknown:m('ไม่มีเควสต์/ไอเทมนี้ในระบบ','Quest or item doesn\'t exist','任务或道具不存在'),
 bonus:m('โบนัสประจำวันไม่ถูกต้อง','Daily bonus is wrong','每日奖励不正确'),rng:m('ผลอัญเชิญไม่ตรงกับการสุ่มของระบบ','Summon result doesn\'t match the system roll','召唤结果与系统随机不符'),
 rngitem:m('ไอเทมจากการอัญเชิญไม่อยู่ในแบนเนอร์','Summoned item isn\'t in the banner','召唤道具不在卡池中'),local:m('อัญเชิญตอนยังไม่เชื่อมระบบกลาง (ตรวจผลสุ่มไม่ได้)','Summoned before connecting to the server (roll can\'t be checked)','未连接服务器时召唤(无法核验)'),
 paidgem:m('ใช้เพชรที่เติมด้วยเงินแลกเป็นตั๋ว (ไม่อนุญาต)','Used topped-up gems for summon tickets (not allowed)','用充值宝石兑换召唤券(不允许)'),
 exrate:m('อัตราแลกเปลี่ยนไม่ตรงกับที่กำหนด','Exchange rate does not match the settings','兑换比例与设置不符'),excap:m('แลกเกินจำนวนที่กำหนดต่อวัน','Exchanged more than the daily limit','超过每日兑换上限'),
 own:m('ขาย/แลก/ทิ้งไอเทมที่ไม่มีอยู่จริง','Sold, traded or dropped an item they did not own','出售/交易/丢弃了并不拥有的道具'),tstate:m('ขั้นตอนแลกเปลี่ยนไม่ถูกต้อง','Trade step out of order','交易步骤不正确'),sellprice:m('ราคาขายสูงกว่าที่กำหนด','Sold above the set price','出售价格高于规定'),
 tcross:m('ได้ของจากการแลกที่อีกฝ่ายไม่ได้ให้','Received a trade item the other player never gave','收到了对方从未交出的交易道具'),tnopay:m('รับของแลกโดยไม่ได้จ่ายจริง','Took a traded item without really paying','未真正付款就收取了交易道具'),tdouble:m('ได้ทั้งของและเงินคืนจากการแลกเดียวกัน','Got both the item and a refund from one trade','同一笔交易既拿到道具又获退款'),tpend:m('อีกฝ่ายของการแลกยังไม่ซิงก์','The other side of this trade has not synced yet','交易对方尚未同步'),
 price:m('ราคาซื้อต่ำกว่าราคาจริง','Paid less than the real price','购买价格低于实际价格'),dsday:m('ซื้อจากร้านรายวันผิดวัน','Bought from a daily-shop list of another day','购买了非当天的每日商品'),dslist:m('ไอเทมไม่อยู่ในร้านรายวันของวันนั้น (อาจเพราะครูแก้ไอเทมภายหลัง)','Item was not in that day\'s shop list (may be because items were edited later)','该商品不在当天的每日商店中(可能因之后修改了物品)'),pricechg:m('ราคาไม่ตรงกับราคาปัจจุบัน','Price differs from the current price','价格与当前不同'),neg:m('ใช้ของเกินกว่าที่มี','Spent more than they had','花费超过持有'),
 mismatch:m('ยอดในเซฟไม่ตรงกับประวัติ','Saved totals don\'t match the history','存档数值与记录不符'),legacy:m('เล่นก่อนเปิดระบบกันโกง (ยอดตั้งต้นตรวจย้อนไม่ได้)','Played before anti-cheat (starting totals can\'t be checked)','反作弊上线前的进度(无法核验)'),
 count:m('จำนวนเหตุการณ์ไม่ตรงกับที่บันทึก','Event count doesn\'t match','记录数量不符'),kind:m('ประเภทเหตุการณ์ไม่รู้จัก','Unknown event type','未知记录类型'),
 raidtime:m('ตีบอสเมืองโกลาหลนอกเวลาที่บอสเกิด','Hit the Chaos City boss outside its time','在混沌之城首领出现时间之外攻击'),raidcap:m('ตอบคำถามบอสเมืองโกลาหลเกินจำนวนที่กำหนด','Answered the Chaos City boss more times than allowed','回答混沌之城首领的次数超过上限'),
 raidjoin:m('รับรางวัลบอสเมืองโกลาหลโดยไม่ได้ร่วมตี','Claimed the Chaos City reward without joining','未参战却领取混沌之城奖励'),raidalive:m('รับรางวัลก่อนบอสเมืองโกลาหลถูกปราบ','Claimed before the Chaos City boss was beaten','首领未被击败就领取奖励'),
 raiditem:m('ของรางวัลบอสเมืองโกลาหลไม่ตรงกับการจับฉลากของระบบ','Chaos City reward does not match the system draw','混沌之城奖励与系统抽签不符'),raidunk:m('ยังโหลดข้อมูลบอสเมืองโกลาหลไม่ได้ ตรวจรางวัลไม่ได้','Chaos City data not loaded — reward not checked','未能载入混沌之城数据,无法核验奖励'),wkday:m('รับเควสประจำสัปดาห์ผิดสัปดาห์','Weekly quest claimed in the wrong week','在错误的周领取每周任务'),
 tnorder:m('เข้าชั้นอุโมงค์ข้ามลำดับ','Entered a tunnel floor out of order','跳层进入时空隧道'),tnmon:m('ชนะบอสอุโมงค์โดยยังปราบมอนสเตอร์ไม่ครบ','Beat a tunnel boss without clearing the monsters','未清完怪物就击败隧道首领'),
 tnday:m('วันที่ดรอปของบอสอุโมงค์ไม่ตรงเวลาเล่น','Tunnel drop date does not match play time','隧道掉落日期与游戏时间不符'),tndrop:m('ของดรอปจากบอสอุโมงค์ไม่ตรงกับการสุ่มของระบบ (อาจเพราะครูแก้ไอเทมภายหลัง)','Tunnel drop does not match the system roll (may be because items were edited later)','隧道掉落与系统随机不符(可能因老师之后修改了道具)'),
 tnlocal:m('ได้ของจากอุโมงค์ตอนยังไม่เชื่อมระบบกลาง (ตรวจผลสุ่มไม่ได้)','Tunnel drop while not connected to the server (roll can\'t be checked)','未连接服务器时的隧道掉落(无法核验)'),
 bound:m('ส่งของพิเศษ VIP/นักปราชญ์ไปแลกเปลี่ยน (ของชนิดนี้แลกไม่ได้)','Put a VIP/Scholar exclusive up for trade (these cannot be traded)','交易了不可交易的VIP/学者专属道具'),rarchg:m('ระดับไอเทมถูกแก้หลังอัญเชิญ','Item rarity changed after the summon','召唤后道具稀有度被修改'),words:m('รายการคำตอบไม่ตรงคะแนน','Answer list doesn\'t match the score','答题记录与得分不符')};
/* ctx: cfgs(t) -> [cfg...], ent(col,id,t) -> [doc|null ...] candidates, dailyIds(t) -> [[ids]...], items -> map, now */
function verifyLedger(o){var ev=o.events||[],ctx=o.ctx,issues=[],bad={},X=blankX(),prevH='',prevT=0,days={},lastEnd=0;
  /* reward/level/chain problems are repaired by recomputing; these mean the event itself can't be trusted and is dropped on fix */
  var DROP={bound:1,paidgem:1,exrate:1,excap:1,own:1,tstate:1,tcross:1,tdouble:1,tnopay:1,sellprice:1,fast:1,overlap:1,daycap:1,back:1,cpback:1,future:1,dup:1,cond:1,unknown:1,rng:1,rngitem:1,price:1,raidtime:1,raidcap:1,raidjoin:1,raidalive:1,wkday:1,tnorder:1,tnmon:1,tnday:1,neg:1,shape:1,words:1,qn:1,first:1,start:1,kind:1};
  function add(lv,e,k,extra){issues.push({lv:lv,s:e?e.s:0,k:e?e.k:'',msg:k,extra:extra||''});if(lv==='err'&&e&&DROP[k])bad[e.s]=1}
  var adj=(o.adjust&&Array.isArray(o.adjust.list)?o.adjust.list:[]).filter(function(a){return o.state&&o.state.adjSeen&&o.state.adjSeen[a.id]});
  var adjSum={coin:0,gems:0,tickets:0,items:{},paid:0,lv:{}};(o.adjust&&Array.isArray(o.adjust.list)?o.adjust.list:[]).forEach(function(a){var n=isO(a)?int(a.lvl,0,100,0):0;if(n&&IDRE.test(a.id||''))adjSum.lv[a.id]=n});adj.forEach(function(a){['coin','gems','tickets'].forEach(function(k){adjSum[k]+=int(a[k],-1e8,1e8,0)});if(a.src==='topup')adjSum.paid+=Math.max(0,int(a.gems,-1e8,1e8,0));
    if(isO(a.items))Object.keys(a.items).forEach(function(k){if(IDRE.test(k)){var q=int(a.items[k],-1e4,1e4,0);if(q)adjSum.items[k]=(adjSum.items[k]||0)+q}})});
  var cp=o.audit&&o.audit.n?o.audit:null;
  function ownN(id){return (X.owned[id]||0)+Math.max(0,adjSum.items[id]||0)}
  var usedLv={},gf=0,ppSum=0,freeGift=Math.max(0,adjSum.gems-adjSum.paid);
  ev.forEach(function(e,i){if(!isO(e)||typeof e.k!=='string'){add('err',{s:i+1,k:'?'},'shape');return}
    if(e.s!==i+1)add('err',e,'seq');var hh=evHash(prevH,e);if(e.h!==hh)add('err',e,'hash');prevH=e.h||hh;
    if(cp&&e.s===cp.n&&e.h!==cp.h)add('err',e,'cphash');
    if(cp&&e.s>cp.n&&e.t<cp.t-6e5)add('err',e,'cpback');
    if(typeof e.t!=='number'||e.t<prevT-1000)add('err',e,'back');if(e.t>o.now+3e5)add('err',e,'future');
    var cfgs=ctx.cfgs(e.t);
    if(i===0&&e.k!=='start'&&e.k!=='legacy')add('err',e,'first');
    if(i>0&&(e.k==='start'||e.k==='legacy'))add('err',e,'first');
    var timed=e.k==='lesson'||e.k==='review'||e.k==='boss'||e.k==='tnmon'||e.k==='tnboss'||e.k==='raid';
    if(timed){var dur=int(e.dur,0,864e5,0),nq=e.n|0;if(dur<nq*BOT_MS_PER_Q)add('err',e,'fast');else if(dur<nq*MIN_MS_PER_Q)add('warn',e,'quick');if(e.t-dur<lastEnd-5000)add('err',e,'overlap');lastEnd=e.t;
      var dd=days[e.d]=days[e.d]||{ses:0,ms:0};if(e.k!=='tnmon')dd.ses++;dd.ms+=dur;if((dd.ses>150||dd.ms>16*36e5)&&!dd.w){dd.w=1;add('warn',e,'daycap')}
      var wc=Array.isArray(e.wc)?e.wc:[],ww=Array.isArray(e.ww)?e.ww:[];if(wc.length!==e.ok||wc.length+ww.length!==e.n)add('err',e,'words');
      if(isO(e.la)){var so=0,sn=0;LANGS.forEach(function(l){var a=e.la[l];if(Array.isArray(a)){so+=a[0]|0;sn+=a[1]|0}});if(so!==e.ok||sn!==e.n)add('err',e,'words')}}
    else if(typeof e.t==='number')lastEnd=Math.max(lastEnd,e.t);
    function okR(fn){return cfgs.some(function(c){return sameR(fn(c),e.r)})}
    function okLu(){return cfgs.some(function(c){return sameLu(levelCalc(X,(e.r&&e.r.exp)||0,c),e.lu)})}
    switch(e.k){
    case 'start':if(!okR(startR))add('err',e,'reward');if(STARTERS[e.g==='M'?'M':'F'].indexOf(e.o)<0||['hr1','hr3'].indexOf(e.hair)<0)add('err',e,'start');break;
    case 'legacy':add('warn',e,'legacy');break;
    case 'lesson':if(!(e.n>0)||e.ok<0||e.ok>e.n)add('err',e,'shape');
      if(!cfgs.some(function(c){return c.lessonQuestions===e.n}))add('err',e,'qn');
      if(!cfgs.some(function(c){return starsFor(e.ok,e.n,c)===e.st}))add('err',e,'stars');
      if(!cfgs.some(function(c){return sameR(lessonR(X,e.u,e.n,e.ok,c).r,e.r)}))add('err',e,'reward');if(!okLu())add('err',e,'level');break;
    case 'review':if(!(e.n>0)||e.ok<0||e.ok>e.n||!cfgs.some(function(c){return e.n<=c.reviewMax}))add('err',e,'qn');
      if(!okR(function(c){return reviewR(e.n,e.ok,c)}))add('err',e,'reward');if(!okLu())add('err',e,'level');break;
    case 'boss':if(e.ok<0||e.ok>e.n||e.n>300||(e.win&&e.ok<1))add('err',e,'shape');
      if(!okR(function(c){return bossR(X,e.z,e.win,e.ok,e.d,c)}))add('err',e,'reward');if(!okLu())add('err',e,'level');break;
    case 'talk':break;
    case 'story':if(X.story[e.q])add('err',e,'dup');var qs=ctx.ent('story',e.q,e.t).filter(Boolean);if(!qs.length){add('err',e,'unknown');break}
      if(!qs.some(function(q){return storyDone(q,X)}))add('err',e,'cond');if(!qs.some(function(q){return sameR(q.reward,e.r)}))add('err',e,'reward');if(!okLu())add('err',e,'level');break;
    case 'daily':dayOf(X,e.d);if(X.daily.c[e.q])add('err',e,'dup');var ds=ctx.ent('daily',e.q,e.t).filter(Boolean);if(!ds.length){add('err',e,'unknown');break}
      if(!ds.some(function(q){return (X.daily.p[q.key]||0)>=q.goal}))add('err',e,'cond');if(!ds.some(function(q){return sameR(q.reward,e.r)}))add('err',e,'reward');if(!okLu())add('err',e,'level');
      if(e.b){var Yc=Object.assign({},X.daily.c);Yc[e.q]=true;var allIds=ctx.dailyIds(e.t);
        if(X.daily.bonus||!allIds.some(function(ids){return ids.length&&ids.every(function(id){return Yc[id]})})||!cfgs.some(function(c){return sameR({tickets:c.dailyBonusTickets,gems:c.dailyBonusGems},e.b)}))add('err',e,'bonus')}break;
    case 'raid':if(!(e.n>=1&&e.n<=50)||e.ok<0||e.ok>e.n||typeof e.rid!=='string'){add('err',e,'shape');break}
      var EVr=evBoss(e.rid),slotOk=EVr?(e.t>=EVr.start-60e3&&e.t<=EVr.start+EVr.hours*3600e3+15*60e3):cfgs.some(function(c){var sl=raidSlot(e.t,c);return sl.id===e.rid&&e.t>=sl.start&&e.t<=sl.end+15*60e3});if(!slotOk){add('err',e,'raidtime');break}
      var had=(X.raid&&X.raid[e.rid])?X.raid[e.rid].n:0;if(!cfgs.some(function(c){return had+e.n<=bossCfg(e.rid,c).q})){add('err',e,'raidcap');break}
      if(e.su||e.sb){var su=Array.isArray(e.su)?e.su:[],prevSu=(X.raid&&X.raid[e.rid]&&X.raid[e.rid].su)||[],cap=0,okSu=su.every(function(id,i){return SK_DEF[id]&&skLv(X,id,e.t)>0&&su.indexOf(id)===i&&prevSu.indexOf(id)<0});su.forEach(function(id){cap+=skMaxBonus(id,skLv(X,id,e.t),e.t)});
        if(!okSu||!((e.sb|0)>=0)||(e.sb|0)>Math.min(cap,skOld(e.t)?14:SK_SBMAX)||(!skOld(e.t)&&su.length>(e.ok|0))){add('err',e,'skill');break}}
      if(e.st!==undefined&&((e.st|0)!==(e.t>=ENH_T&&e.ok>0?2:0)||e.st!==(e.st|0))){add('err',e,'enh');break}
      if(e.cb!==undefined){var cbv=e.cb;if(e.t<ENH_T||!(cbv===(cbv|0)&&cbv>=0)||cbv>e.ok*cpBonus(cpBest(X,ctx.items,ownN,Object.keys(adjSum.items||{})))){add('err',e,'cp');break}}
      if(e.gd!==undefined){var gv=e.gd;if(!(typeof gv==='number'&&gv===(gv|0)&&gv>=0)||!cfgs.some(function(c){return gv<=e.ok*gdDmg(c)})){add('err',e,'gd');break}
        if(gv>0){var gdB=adj.filter(function(a){return a.src==='topup'&&int(a.t,0,9e15)<=e.t+6e5}).reduce(function(s,a){return s+int(a.baht,0,1e6,0)},0);if(!cfgs.some(function(c){return gdB>=vipNeed(c,3)})&&(ctx.admins||[]).indexOf(o.uid)<0){add('err',e,'gdvip','฿'+gdB);break}}}
      var pfull=raidPenFull(e.rid,e.n,e.ok),pp=e.pen|0;if(pp<0||pp>pfull||(pp<pfull&&X.coin+(adjSum.coin|0)>=pfull)){add('err',e,'pen');break}
      if(!okR(function(c){return raidR(e.ok,c)}))add('err',e,'reward');if(!okLu())add('err',e,'level');break;
    case 'raidwin':if(typeof e.rid!=='string'||RAID_RARS.indexOf(e.tier)<0){add('err',e,'shape');break}
      if(!X.raid||!X.raid[e.rid]||!X.raid[e.rid].n){add('err',e,'raidjoin');break}if(X.raidw&&X.raidw[e.rid]){add('err',e,'dup');break}
      if(!okR(function(c){return raidWinR(e.rid,c)}))add('err',e,'reward');if(!okLu())add('err',e,'level');
      var RD=ctx.raids&&ctx.raids[e.rid];if(!RD){add('warn',e,'raidunk');break}
      var parts=Object.keys(RD.hits).filter(function(u){return RD.hits[u].n>0}),dmg=parts.reduce(function(a,u){return a+(RD.hits[u].ok|0)+Math.min(RD.hits[u].sb|0,SK_SBMAX)+Math.min(RD.hits[u].gd|0,(RD.hits[u].ok|0)*100)+Math.min(RD.hits[u].cb|0,(RD.hits[u].ok|0)*5)},0);
      if(parts.indexOf(o.uid)<0){add('err',e,'raidjoin');break}if(!cfgs.some(function(c){return dmg>=bossCfg(e.rid,c).hp})){add('err',e,'raidalive');break}
      var fair=cfgs.some(function(c){var tier=raidRank(e.rid,parts,c)[o.uid];return tier===e.tier&&raidItem(e.rid,o.uid,tier,ctx.items)===e.item});
      if(!fair){var it0=ctx.items[e.item];add(it0&&RAID_RARS.indexOf(it0.rar)>=RAID_RARS.indexOf(e.tier)&&cfgs.some(function(c){return raidRank(e.rid,parts,c)[o.uid]===e.tier})?'warn':'err',e,'raiditem')}break;
    case 'weekly':var WQv=wqOf(X,e.w);if(e.w!==bkkWeek(e.t)&&e.w!==bkkWeek(e.t-15*60e3)){add('err',e,'wkday');break}if(WQv.c[e.q]){add('err',e,'dup');break}
      var wqs=ctx.ent('weekly',e.q,e.t).filter(Boolean);if(!wqs.length){add('err',e,'unknown');break}
      if(!wqs.some(function(q){return (WQv.p[q.key]||0)>=q.goal}))add('err',e,'cond');if(!wqs.some(function(q){return sameR(q.reward,e.r)}))add('err',e,'reward');if(!okLu())add('err',e,'level');break;
    case 'vip':case 'sch':var lv=e.lv,isV=e.k==='vip';if(!(lv>=1&&lv<=10&&lv===(lv|0))){add('err',e,'shape');break}if((isV?X.vipc:X.schc)&&(isV?X.vipc:X.schc)[lv]){add('err',e,'dup');break}
      var TR=(isV?VIP_TIERS:SCH_TIERS)[lv-1];if(JSON.stringify(Array.isArray(e.items)?e.items:[])!==JSON.stringify(TR.it||[])||!sameR(rew(TR.r),e.r))add('err',e,'reward');
      if(isV){var paidB=adj.filter(function(a){return a.src==='topup'&&int(a.t,0,9e15)<=e.t+6e5}).reduce(function(s,a){return s+int(a.baht,0,1e6,0)},0);if(!cfgs.some(function(c){return paidB>=vipNeed(c,lv)}))add('err',e,'cond','฿'+paidB)}
      else if(!cfgs.some(function(c){return (X.sp||0)>=schNeed(c,lv)}))add('err',e,'cond',String(X.sp||0));if(!okLu())add('err',e,'level');break;
    case 'tnmon':case 'tnboss':var tf=e.f;if(!(tf>=1&&tf<=10&&tf===(tf|0))||!(e.n>=1&&e.n<=50)||e.ok<0||e.ok>e.n||(e.win&&e.ok!==e.n)||(e.g!==undefined&&TN_GATES.indexOf(e.g)<1)){add('err',e,'shape');break}
      var tg=e.g,TT=tnOf(X,tg);if(tf>TT.max+1){add('err',e,'tnorder');break}
      if(e.k==='tnmon'){if(e.win&&!cfgs.some(function(c){return e.n>=c.tnQ}))add('err',e,'qn');
        if(!okR(function(c){return tnMonR(X,tf,e.ok,e.win,e.d,c,tg)}))add('err',e,'reward');if(!okLu())add('err',e,'level');break}
      if(e.win&&!cfgs.some(function(c){return e.n>=c.tnBossQ}))add('err',e,'qn');
      if(e.win&&!cfgs.some(function(c){return (TT.k[tf]||0)>=c.tnMon})){add('err',e,'tnmon');break}
      if(!okR(function(c){return tnBossR(X,tf,e.ok,e.win,e.d,c,tg)}))add('err',e,'reward');if(!okLu())add('err',e,'level');
      var its=Array.isArray(e.items)?e.items:[];if(its.length>3||(!e.win&&its.length)){add('err',e,'shape');break}
      if(!e.win)break;if(typeof e.bd!=='string'||!(Math.abs(Date.parse(e.bd)-Date.parse(bkkDay(e.t)))<=864e5)){add('err',e,'tnday');break}
      if(TT.drop[tf]===e.bd){if(its.length)add('err',e,'dup');break}
      if(e.sd!=='u'){if(its.length)add('warn',e,'tnlocal');break}
      if(cfgs.some(function(c){return canon(tnDrop(o.uid,tf,e.bd,ctx.items,c,tg))===canon(its)}))break;
      /* items edited later can change which item a roll lands on, but never lift it above the rolled rarity */
      var pool0=tnPool(ctx.items),fair=cfgs.some(function(c){var rr=tnRoll(o.uid,tf,e.bd,c,tg);return rr.length===its.length&&its.every(function(id,j){var it=ctx.items[id];return pool0.indexOf(id)>=0&&TN_RARS.indexOf(it.rar)<=rr[j]})});
      add(fair?'warn':'err',e,fair?'tndrop':'rngitem');break;
    case 'pull':if(!(e.n>0&&e.n<=10)||!Array.isArray(e.items)||e.items.length!==e.n){add('err',e,'shape');break}if(BN_END[e.b]&&int(e.t,0,9e15,0)>BN_END[e.b]){add('err',e,'bnend');break}
      if(e.sd!=='u'){add('warn',e,'local');break}
      var bs=ctx.ent('banners',e.b,e.t).filter(Boolean);if(!bs.length){add('err',e,'unknown');break}
      var g0=X.gacha[e.b],okRoll=false,okItems=false;
      bs.forEach(function(bn){cfgs.forEach(function(c){var run=gachaRun(o.uid,e.b,g0,e.n,c,bn.pool,ctx.items);
        if(canon(run.rr)===canon(e.rr)&&canon(run.gc)===canon(e.gc)){okRoll=true;if(canon(run.items)===canon(e.items))okItems=true}})});
      if(!okRoll)add('err',e,'rng');
      else if(!okItems){var inPool=e.items.every(function(id,j){return bs.some(function(bn){return bn.pool.indexOf(id)>=0})&&ctx.items[id]&&ctx.items[id].rar===e.rr[j]});
        if(!inPool){var rarOnly=e.items.every(function(id){return bs.some(function(bn){return bn.pool.indexOf(id)>=0})});add(rarOnly?'warn':'err',e,rarOnly?'rarchg':'rngitem')}}break;
    case 'buy':if(e.ds){var dit=ctx.items[e.item];if(!dit){add('err',e,'unknown');break}
      /* daily shop: the day must match the purchase time (Thai date, ±1 day) and the price must be the rarity price then in force */
      var dday=bkkDay(e.t),dd=Math.abs(Date.parse(e.ds)-Date.parse(dday));if(!(dd<=864e5)){add('err',e,'dsday');break}
      var dprices=cfgs.map(function(c){return dsPrice(dit,e.sh,c)}).filter(Boolean);if(!dprices.length){add('err',e,'unknown');break}
      if(!(e.price>=Math.min.apply(null,dprices))){add('err',e,'price');break}
      var inList=cfgs.some(function(c){return dailyShop(e.ds,e.sh,ctx.items,c).some(function(x){return x.item===e.item&&x.price===e.price})});if(!inList)add('warn',e,'dslist');break}
      var ps=ctx.ent('shop',e.sh+'_'+e.item,e.t).filter(Boolean).concat((CONTENT.shop||[]).filter(function(x){return x.item===e.item&&x.kind===e.sh}));
      if(!ps.length){add('err',e,'unknown');break}var minP=Math.min.apply(null,ps.map(function(x){return x.price}));
      if(!(e.price>=minP))add('err',e,'price');else if(!ps.some(function(x){return x.price===e.price}))add('warn',e,'pricechg');break;
    case 'skup':if(!SK_DEF[e.sk]||(e.lv|0)!==skLv(X,e.sk,e.t)+1||e.lv>5||(X.lvl|0)<skReq(e.sk,e.lv,e.t)||(e.cost|0)!==SK_COST[e.lv]){add('err',e,'skill');break}break;
    case 'skbr':var sbt=e.t2|0,sbo=(X.skb||{})[sbt];if(skOld(e.t)||!(sbt>=1&&sbt<=5)||(e.b!=='A'&&e.b!=='B')||sbo===e.b||(X.lvl|0)<SK_TIERS[sbt]||(e.cost|0)!==(sbo?SK_BRCOST:0)||(sbo&&X.skbw===bkkWeek(e.t))){add('err',e,'skill');break}break;
    case 'ex':if(!(e.n>=1)||(e.to!=='gems'&&e.to!=='tickets')){add('err',e,'shape');break}
      if(!cfgs.some(function(c){return c.exOn!==0&&exCost(e.to,e.n,c)===e.cost})){add('err',e,'exrate');break}
      if(!cfgs.some(function(c){var X2=JSON.parse(JSON.stringify(X.ex||{}));var tmp={ex:X2};return exRoom(tmp,e.to,e.d,c)>=e.n}))add('err',e,'excap');break;
    case 'salv':if(e.t<ENH_T||ownN(e.item)<1){add('err',e,'own');break}var svi=ctx.items[e.item];if(!svi||ENH_NOCAT[svi.cat]||(e.st|0)!==(ENH_ST[svi.rar]|0)){add('err',e,'enh');break}break;
    case 'enh':var eni=ctx.items[e.item],enl=e.lv|0;if(e.t<ENH_T||ownN(e.item)<1||!eni||ENH_NOCAT[eni.cat]||enl<1||enl>20||((X.enh||{})[e.item]|0)!==enl-1||(e.cost|0)!==enhCoin(enl)||(e.sc|0)!==enl||(X.st|0)<enl||X.coin+adjSum.coin<enhCoin(enl)||!!e.ok!==enhOk(o.uid,e.item,(X.enhn||{})[e.item]|0,enl)){add('err',e,'enh');break}break;
    case 'sell':if(!(e.n>=1)||ownN(e.item)<e.n){add('err',e,'own');break}var si=ctx.items[e.item];if(!si){add('warn',e,'unknown');break}
      var sx=cfgs.map(function(c){return sellPrice(si,c)});if(sx.indexOf(e.price)<0){var hi=Math.max.apply(null,sx.concat([0]));add(e.price>hi?'err':'warn',e,e.price>hi?'sellprice':'pricechg')}break;
    case 'discard':if(!(e.n>=1)||ownN(e.item)<e.n)add('err',e,'own');break;
    case 'chk':ckCheck(X,e,ctx.items,add);break;
    case 'eva':if(!evaValid(e)){add('err',e,'eva');break}if(X.eva&&X.eva[e.day])add('err',e,'dup');break;
    case 'pbg':if(typeof PBG_MAP==='undefined'||!PBG_MAP[e.id]){add('err',e,'unknown');break}if(e.price!==PBG_MAP[e.id].p){add('err',e,'price');break}if(X.pbg&&X.pbg[e.id])add('err',e,'dup');break;
    case 'tout':if(isBound(e.item)){add('err',e,'bound');break}if(!IDRE.test(e.tid||'')||X.trades[e.tid]){add('err',e,'dup');break}if(!(e.n>=1)||ownN(e.item)<e.n)add('err',e,'own');break;
    case 'tcancel':if(!X.trades[e.tid]||X.trades[e.tid].st!=='open')add('err',e,'tstate');break;
    case 'tdone':var tx0=X.trades[e.tid];if(!tx0||tx0.st!=='open'||!samePay(tx0.want,e.pay)||!IDRE.test(e.by||''))add('err',e,'tstate');else if(e.fee&&e.fee!==mkFee(e.pay))add('err',e,'reward');break;
    case 'tpay':if(!IDRE.test(e.tid||'')||!IDRE.test(e.from||'')||X.treq[treqKey(e)]){add('err',e,'dup');break}var pp=cleanPay(e.pay);if(pp.item&&ownN(pp.item)<pp.n)add('err',e,'own');break;
    case 'tget':case 'trefund':var rq=X.treq[treqKey(e)];if(!rq||rq.st!=='wait')add('err',e,'tstate');break;
    case 'alvl':if(!(e.n>=1)||adjSum.lv[e.aid]!==e.n){add('err',e,'unknown');break}if(usedLv[e.aid]){add('err',e,'dup');break}usedLv[e.aid]=1;break;
    default:add('err',e,'kind')}
    prevT=Math.max(prevT,typeof e.t==='number'?e.t:0);
    var g0=X.gems;applyEvent(X,e);
    if(e.k==='buy'&&e.sh==='gem'){var pp=int(e.pp,0,1e6,0);ppSum+=pp;gf-=Math.max(0,e.price-pp)}else if(e.k==='ex'&&e.to==='tickets'){gf-=e.cost}else gf+=X.gems-g0;
    if((e.k==='ex'&&e.to==='tickets'||e.k==='buy'&&e.sh==='gem')&&gf+freeGift<0)add('err',e,'paidgem');
    if(X.coin+Math.max(0,adjSum.coin)<0||X.gems+Math.max(0,adjSum.gems)<0||X.tickets+Math.max(0,adjSum.tickets)<0)add('err',e,'neg');
  });
  var st=o.state;
  if(ppSum>adjSum.paid)add('err',null,'paidgem','paid '+ppSum+'/'+adjSum.paid);
  if(st){var exp={coin:X.coin+adjSum.coin,gems:X.gems+adjSum.gems,tickets:X.tickets+adjSum.tickets};
    var mm=[];['coin','gems','tickets'].forEach(function(k){if(st[k]!==exp[k])mm.push(k)});if(st.lvl!==X.lvl)mm.push('lvl');if(st.exp!==X.exp)mm.push('exp');
    var ids={};Object.keys(st.owned||{}).concat(Object.keys(X.owned),Object.keys(adjSum.items)).forEach(function(k){ids[k]=1});Object.keys(ids).forEach(function(k){if((st.owned[k]||0)!==Math.max(0,(X.owned[k]||0)+(adjSum.items[k]||0)))mm.push('item:'+k)});
    Object.keys(X.prog).concat(Object.keys(st.prog||{})).forEach(function(u){if(((st.prog[u]||{}).stars||0)!==((X.prog[u]||{}).stars||0))mm.push('stars:'+u)});
    if(mm.length)add('err',null,'mismatch',mm.slice(0,6).join(', '));
    if(o.metaN!==undefined&&o.metaN!==ev.length)add('err',null,'count')}
  var errs=issues.filter(function(x){return x.lv==='err'}).length;
  return {X:X,issues:issues,bad:bad,errs:errs,warns:issues.length-errs,adjSum:adjSum,n:ev.length,h:prevH}}

/* Rebuild a ledger keeping only events that still pass, with rewards recomputed by the rules (teacher's "fix"). */
function rebuildLedger(o){var usedL={},out=[],X=blankX(),prevH='',ctx=o.ctx,adj=o.adjSum||{coin:0,gems:0,tickets:0};var aItems=adj.items||{},paidLeft=adj.paid||0;function own(id){return (X.owned[id]||0)+Math.max(0,aItems[id]||0)}
  function push(e){e.s=out.length+1;e.h=evHash(prevH,e);prevH=e.h;out.push(e);applyEvent(X,e)}
  o.events.forEach(function(e0,i){if(o.bad[e0.s])return;var e=JSON.parse(JSON.stringify(e0));delete e.h;delete e.s;delete e.lu;var c=ctx.cfgs(e.t)[0];
    if(i===0&&e.k!=='start'&&e.k!=='legacy')return;
    switch(e.k){
    case 'start':e.r=startR(c);break;case 'legacy':break;
    case 'lesson':var x=lessonR(X,e.u,e.n,e.ok,c);e.st=x.st;e.r=x.r;withLevel(X,e,c);break;
    case 'review':e.r=reviewR(e.n,e.ok,c);withLevel(X,e,c);break;
    case 'boss':e.r=bossR(X,e.z,e.win,e.ok,e.d,c);withLevel(X,e,c);break;
    case 'talk':break;
    case 'raid':var hadr=(X.raid&&X.raid[e.rid])?X.raid[e.rid].n:0;if(hadr+e.n>bossCfg(e.rid,c).q)return;e.r=raidR(e.ok,c);if(e.gd>0)e.gd=Math.min(e.gd|0,e.ok*gdDmg(c));if(e.t>=ENH_T){e.st=e.ok>0?2:0;if(e.cb>0)e.cb=Math.min(e.cb|0,e.ok*cpBonus(cpBest(X,ctx.items,own,Object.keys(aItems))))}else{delete e.st;delete e.cb}var pf2=raidPenFull(e.rid,e.n,e.ok);if(pf2)e.pen=Math.min(pf2,Math.max(0,X.coin+adj.coin));else delete e.pen;withLevel(X,e,c);break;
    case 'raidwin':if(!X.raid||!X.raid[e.rid]||(X.raidw&&X.raidw[e.rid]))return;e.r=raidWinR(e.rid,c);withLevel(X,e,c);break;
    case 'vip':case 'sch':if(!(e.lv>=1&&e.lv<=10)||(e.k==='vip'?X.vipc:X.schc)[e.lv])return;if(e.k==='sch'&&(X.sp||0)<schNeed(c,e.lv))return;var ne2=(e.k==='vip'?bVip:bSch)(X,e.lv,c);ne2.t=e.t;ne2.d=e.d;e=ne2;break;
    case 'weekly':var WQr=wqOf(X,e.w),wq0=ctx.ent('weekly',e.q,e.t).filter(Boolean)[0];if(!wq0||WQr.c[e.q]||(WQr.p[wq0.key]||0)<wq0.goal)return;e.r=rew(wq0.reward);withLevel(X,e,c);break;
    case 'tnmon':var T1=tnOf(X,e.g);if(!(e.f>=1&&e.f<=T1.max+1))return;e.win=e.ok===e.n&&e.n>=c.tnQ;e.r=tnMonR(X,e.f,e.ok,e.win,e.d,c,e.g);withLevel(X,e,c);break;
    case 'tnboss':var T2=tnOf(X,e.g);if(!(e.f>=1&&e.f<=T2.max+1))return;e.win=e.ok===e.n&&e.n>=c.tnBossQ&&(T2.k[e.f]||0)>=c.tnMon;e.r=tnBossR(X,e.f,e.ok,e.win,e.d,c,e.g);
      if(!e.win||typeof e.bd!=='string'||T2.drop[e.f]===e.bd)e.items=[];else if(e.sd==='u')e.items=tnDrop(o.uid,e.f,e.bd,ctx.items,c,e.g);else e.items=(Array.isArray(e.items)?e.items:[]).filter(function(id){return ctx.items[id]}).slice(0,3);withLevel(X,e,c);break;
    case 'story':var q=ctx.ent('story',e.q,e.t).filter(Boolean)[0];if(!q||X.story[e.q]||!storyDone(q,X))return;e.r=rew(q.reward);withLevel(X,e,c);break;
    case 'daily':dayOf(X,e.d);var dq=ctx.ent('daily',e.q,e.t).filter(Boolean)[0];if(!dq||X.daily.c[e.q]||(X.daily.p[dq.key]||0)<dq.goal)return;var ne=bDaily(X,dq,e.d,ctx.dailyIds(e.t)[0]||[],c);ne.t=e.t;e=ne;break;
    case 'pull':var bn=ctx.ent('banners',e.b,e.t).filter(Boolean)[0];if(!bn||X.tickets+adj.tickets<e.n)return;var run=gachaRun(o.uid,e.b,X.gacha[e.b],e.n,c,bn.pool,ctx.items);
      if(run.items.some(function(x){return !x}))return;e.items=run.items;e.rr=run.rr;e.gc=run.gc;e.sd='u';break;
    case 'buy':var sp=e.ds?(ctx.items[e.item]&&dsPrice(ctx.items[e.item],e.sh,c)?{price:dsPrice(ctx.items[e.item],e.sh,c)}:null):ctx.ent('shop',e.sh+'_'+e.item,e.t).filter(Boolean)[0]||(CONTENT.shop||[]).filter(function(x){return x.item===e.item&&x.kind===e.sh})[0];if(!sp)return;e.price=sp.price;
      if(X[e.sh==='gem'?'gems':'coin']+adj[e.sh==='gem'?'gems':'coin']<e.price)return;if(e.sh==='gem'){e.pp=Math.min(int(e.pp,0,1e6,0),paidLeft,e.price);paidLeft-=e.pp;if(!e.pp)delete e.pp}break;
    case 'skup':if(!SK_DEF[e.sk]||(e.lv|0)!==skLv(X,e.sk,e.t)+1||X.coin+adj.coin<e.cost)return;break;
    case 'skbr':if(!(e.t2>=1&&e.t2<=5)||(e.b!=='A'&&e.b!=='B')||((X.skb||{})[e.t2])===e.b||X.coin+adj.coin<(e.cost|0))return;break;
    case 'alvl':if(!(adj.lv&&adj.lv[e.aid]===e.n)||usedL[e.aid])return;usedL[e.aid]=1;break;
    case 'ex':if(!(e.n>=1)||c.exOn===0||exRoom(X,e.to,e.d,c)<e.n)return;e.cost=exCost(e.to,e.n,c);if(e.to==='gems'?X.coin+adj.coin<e.cost:X.gems+adj.gems<e.cost)return;break;
    case 'sell':if(!(e.n>=1)||own(e.item)<e.n||!ctx.items[e.item])return;e.price=sellPrice(ctx.items[e.item],c);break;
    case 'salv':var rvi=ctx.items[e.item];if(e.t<ENH_T||own(e.item)<1||!rvi||ENH_NOCAT[rvi.cat])return;e.st=ENH_ST[rvi.rar]|0;break;
    case 'enh':var rei=ctx.items[e.item],rl=((X.enh||{})[e.item]|0)+1;if(e.t<ENH_T||own(e.item)<1||!rei||ENH_NOCAT[rei.cat]||rl>20||(X.st|0)<rl||X.coin+adj.coin<enhCoin(rl))return;e.lv=rl;e.cost=enhCoin(rl);e.sc=rl;e.ok=enhOk(o.uid,e.item,(X.enhn||{})[e.item]|0,rl);break;
    case 'chk':var ck0=ckState(X),cs=CK_TABLE[e.day];if(!cs||e.c!==ck0.c||e.day!==ck0.n+1||(ck0.last&&ck0.last>=e.d))return;e.cc=cs.c||0;e.cg=cs.g||0;if(!(cs.grp||cs.choice))e.item='';else if(!ctx.items[e.item])return;break;
    case 'eva':if(!evaValid(e)||(X.eva&&X.eva[e.day]))return;break;
    case 'pbg':if(typeof PBG_MAP==='undefined'||!PBG_MAP[e.id]||(X.pbg&&X.pbg[e.id])||X.coin+adj.coin<PBG_MAP[e.id].p)return;e.price=PBG_MAP[e.id].p;break;
    case 'discard':case 'tout':if(!(e.n>=1)||own(e.item)<e.n)return;if(e.k==='tout'&&X.trades[e.tid])return;break;
    case 'tcancel':if(!X.trades[e.tid]||X.trades[e.tid].st!=='open')return;break;
    case 'tdone':if(!X.trades[e.tid]||X.trades[e.tid].st!=='open'||!samePay(X.trades[e.tid].want,e.pay))return;break;
    case 'tpay':if(X.treq[treqKey(e)])return;var p2=cleanPay(e.pay);if(p2.item?own(p2.item)<p2.n:X.coin+adj.coin<p2.coin)return;break;
    case 'tget':case 'trefund':if(!X.treq[treqKey(e)]||X.treq[treqKey(e)].st!=='wait')return;break;
    default:return}
    push(e)});
  return {events:out,X:X,h:prevH}}
