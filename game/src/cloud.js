/* =====================================================================
   CENTRAL DATABASE (artifact db capability)
   - content collections + history/*: everyone reads, only admins write
   - players/{uid} (+ players/{uid}/log/{chunk}): each student writes their own; admins read/write all
   - adjust/{uid}: teacher gifts, corrections and resets — admins write, the student only reads
   - audit/{uid}: teacher checkpoints — admins only
   ===================================================================== */
var CL={db:null,user:null,uid:null,admin:false,status:'local',seeded:{},got:{},contentReady:false,pfirst:false,pushing:false,dirty:false,timer:null,
  players:null,playersUnsub:null,profiles:{},canWrite:null,hist:{},adjust:{},audit:{},chunks:{},ver:{}};
var CHUNK=200;
function capUse(name){try{return window.claude&&typeof window.claude.use==='function'?window.claude.use(name).catch(function(){return null}):Promise.resolve(null)}catch(e){return Promise.resolve(null)}}
function errCode(e){return e&&e.code?e.code:'unavailable'}

function initCloud(){
  setTimeout(function(){if(!CL.ready){CL.ready=true;render()}},12000);
  Promise.all([capUse('db'),capUse('user')]).then(function(r){CL.db=r[0];CL.user=r[1];
    var u=CL.user;
    var p=u?Promise.all([u.id(),u.canEdit(),u.can('data.write')]).then(function(x){CL.uid=x[0];CL.admin=!!x[1];CL.canWrite=x[2];try{if(u.me)Promise.resolve(u.me()).then(function(pr){CL.myName=pr&&pr.name?str(pr.name,40):'';softRender()},function(){})}catch(e){}}):Promise.resolve();
    p.then(function(){if(!CL.db||!CL.uid){CL.ready=true;render();return}
      subscribeContent();
      setTimeout(function(){if(!CL.contentReady){CL.contentReady=true;startPlayerSync();render()}},10000)});
  })}

function subscribeContent(){var db=CL.db;var pending=COLS.length+1;subscribeTheme();subscribeSchool();if(typeof startWallet==='function')startWallet();
  function done(key){if(CL.got[key])return;CL.got[key]=true;pending--;if(pending<=0&&!CL.contentReady){CL.contentReady=true;startPlayerSync()}}
  COLS.forEach(function(col){
    db.collection(col).onSnapshot(function(snap){
      var list=[];snap.docs.forEach(function(d){var c=cleanDoc(col,d.data(),d.id);if(c)list.push(c)});
      if(snap.empty){if(!snap.metadata.fromCache){CL.seeded[col]=false;CONTENT[col]=DEFAULTS[col];SRC[col]='default'}}
      else{CL.seeded[col]=true;CONTENT[col]=list;SRC[col]='db'}
      if(!snap.metadata.fromCache)done(col);
      applyContent();softRender();
    },function(e){done(col)});
  });
  db.doc('settings/config').onSnapshot(function(d){
    if(d.exists){CONTENT.config=cleanConfig(d.data());SRC.config='db';CL.seeded.config=true}
    else if(!d.metadata.fromCache){CONTENT.config=DEFAULTS.config;SRC.config='default';CL.seeded.config=false}
    if(!d.metadata.fromCache)done('config');applyContent();softRender();
  },function(){done('config')});
}

/* ---------- player sync ---------- */
function playerSummary(st){var acc={};LANGS.forEach(function(l){acc[l]=accPct(l,st)});
  var stars=0;Object.keys(st.prog).forEach(function(k){stars+=st.prog[k].stars});
  return {name:st.name,cls:st.cls,gender:st.gender,lvl:st.lvl,learned:learnedCount(st),mastered:masteredCount(st),stars:stars,
    bosses:Object.keys(st.boss).filter(function(k){return st.boss[k].wins>0}).length,streak:st.streak.days,lastDay:st.streak.last,acc:acc,
    coin:st.coin,gems:st.gems,tickets:st.tickets,grade:st.prof?st.prof.grade||'':'',room:st.prof?st.prof.room:'',no:st.prof?st.prof.no:0,nick:st.prof?st.prof.nick:''}}
function stateForCloud(st){var c=JSON.parse(JSON.stringify(st));delete c.log;return c}
/* events live in chunk documents of 200: players/{uid}/log/{k} */
function loadLedger(uid,n){return CL.db.collection('players/'+uid+'/log').get().then(function(s){var ch=s.docs.map(function(d){var x=d.data()||{};return {k:int(x.k,0,1e6),ev:Array.isArray(x.ev)?x.ev:[]}}).sort(function(a,b){return a.k-b.k});
  var out=[];ch.forEach(function(c){if(c.k*CHUNK===out.length)out=out.concat(c.ev)});return out.slice(0,n===undefined?out.length:n)})}
function adoptRemote(d,toastKey){var s=sanitize(d.state);if(!s)return Promise.resolve(false);var n=isO(d.logMeta)?int(d.logMeta.n,0,1e7):0;
  /* re-read the save WITH its history: check-ins, tunnel and boss progress are rebuilt from the history (without it a
     second device thought today's check-in was still open) */
  return loadLedger(CL.uid,n).then(function(ev){var s2=sanitize(Object.assign({},d.state,{log:ev}));if(s2)s=s2;s.log=ev;s.n=ev.length;s.lh=ev.length?String(ev[ev.length-1].h||''):'';s.pushedN=s.n;s.arev=Math.max(s.arev||0,S.arev||0);
    s.owner=CL.uid;S=s;migrateLegacy();saveLocal();if(CL.status!=='busy'){CL.status='ok';renderHeader()}if(S.created&&(UI.scr==='title'||UI.scr==='create'||(UI.scr==='home'&&!UI.navd)))UI.scr=landing();if(UI.sess&&UI.sess.phase!=='result'){UI.sess=null;if(UI.scr==='play')UI.scr='home'}
    if(toastKey)toast(t(toastKey));render();return true})}
/* local data belongs to one account: on a shared computer the next student never inherits (or uploads) the previous one's hero */
/* which save is further along? Events only ever get added, so the longer play history wins; time only breaks a tie.
   (Comparing clocks alone let an older save from another device or a freshly started hero overwrite real progress.) */
function remoteWins(d,tie){if(!d||!isO(d.state))return false;if(!S.created)return true;
  var rn=isO(d.logMeta)?int(d.logMeta.n,0,1e7):0,ln=S.n||0,ru=int(d.updated,0,9e15),lu=S.upd||0;
  if(rn===0&&ln===0)return tie?ru>=lu:ru>lu;
  if(rn===0){var rl=int(d.state.lvl,1,1e4,1),re=int(d.state.exp,0,1e12,0);return rl>S.lvl||(rl===S.lvl&&re>S.exp)}
  if(rn!==ln)return rn>ln;return tie?ru>=lu:ru>lu}
/* logged in but the central save has not answered yet: starting a new hero now could overwrite the real one */
function cloudWait(){return !!(CL.db&&CL.uid&&!CL.pfirst&&!CL.loggedOut)}
function claimLocal(){if(!CL.uid)return;if(S.owner&&S.owner!==CL.uid){var keep=S.set;S=fresh();S.set=keep;UI.sess=null;UI.modal=null;if(UI.scr!=='admin')UI.scr='title'}S.owner=CL.uid;saveLocal()}
function startPlayerSync(){if(!CL.db||!CL.uid||CL.playerRef)return;
  claimLocal();
  CL.playerRef=CL.db.doc('players/'+CL.uid);
  CL.punsub=CL.playerRef.onSnapshot(function(snap){
    if(snap.metadata.hasPendingWrites)return;if(snap.metadata.fromCache)return;
    if(CL.pfirst){cloudFollow(snap.exists?snap.data():null);return}CL.pfirst=true;CL.ready=true;
    var d=snap.exists?snap.data():null;cloudNote(d);
    if(remoteWins(d)){adoptRemote(d,'cloudloaded').then(function(ok){if(!ok&&S.created)push();startAdjustSync();startMarket()});return}
    if(S.created){push();if(UI.scr==='home'&&!UI.navd)UI.scr=landing()}else{CL.status='ok';renderHeader();slAfterLogin()}startAdjustSync();startMarket();render();
  },function(e){CL.status='err';CL.ready=true;CL.perr=errCode(e);renderHeader();render();
    /* database refused (busy / daily quota used up): try again later instead of giving up for the whole visit */
    if(!CL.pfirst){try{if(CL.punsub)CL.punsub()}catch(x){}CL.punsub=null;CL.playerRef=null;clearTimeout(CL.pretry);CL.pretry=setTimeout(startPlayerSync,30000)}});
}
/* TWO DEVICES (2026-11-18): keep listening after the first load. When another device (or the teacher's fix)
   saves a history that this device does not have, this device takes it instead of later overwriting it —
   otherwise a phone left open from earlier could, e.g., offer today's check-in again after the computer took it. */
Object.assign(L,{sy_other:m('มีการเล่นจากอีกเครื่อง โหลดข้อมูลล่าสุดแล้ว','You played on another device — loaded the latest save','检测到在另一台设备上游玩,已载入最新存档'),sy_wait:m('กำลังโหลดข้อมูลล่าสุด รอสักครู่…','Loading your latest save, one moment…','正在载入最新存档,请稍候…')});
function cloudNote(d){CL.rn=d&&isO(d.logMeta)?int(d.logMeta.n,0,1e7):0;CL.rh=d&&isO(d.logMeta)?String(d.logMeta.h||''):'';CL.rd=d}
function cloudInSync(){if(!CL.rn)return true;var e=S.log[CL.rn-1];return CL.rn<=(S.n||0)&&!!e&&String(e.h||'')===CL.rh}
function cloudFollow(d){cloudNote(d);if(!d||!S.created||CL.adopting||cloudInSync())return;
  if(CL.rn>=(S.n||0)){CL.adopting=true;clearTimeout(CL.timer);CL.timer=null;adoptRemote(d,'sy_other').then(function(){CL.adopting=false},function(){CL.adopting=false})}
  else schedulePush()}
/* teacher gifts / corrections / resets */
function startAdjustSync(){if(CL.adjRef)return;CL.adjRef=CL.db.doc('adjust/'+CL.uid);
  CL.adjRef.onSnapshot(function(snap){if(snap.metadata.fromCache)return;var d=snap.exists?snap.data():null;if(!d)return;
    var rev=int(d.rev,0,1e9);
    if(rev>(S.arev||0)){S.arev=rev;
      if(int(d.resetAt,0,9e15)>(S.startT||0)&&!(isO(d.keep))){var keepSet=S.set;S=fresh();S.set=keepSet;S.arev=rev;saveLocal();UI.sess=null;UI.modal=null;UI.scr='title';toast(t('teacherupd'));render();return}
      CL.playerRef.get().then(function(ps){if(ps.exists)return adoptRemote(ps.data(),'teacherupd').then(function(){applyGifts(d)});applyGifts(d)});return}
    applyGifts(d)},function(){})}
function applyGifts(d){var bn=d.ban===true;if(bn!==!!CL.ban){CL.ban=bn;if(bn&&typeof townLeave==='function')townLeave();softRender()}
  var rn=int(d.rn,0,1e6,0);if(S.created&&rn>(S.rnAck||0)&&!(UI.modal&&UI.modal.kind==='forcern')){UI.modal={kind:'forcern',rn:rn};render()}
var nt=cleanTta(d.tt);if(JSON.stringify(nt)!==JSON.stringify(S.tta||{})){S.tta=nt;saveLocal();if(TW&&TW.in)townWrite({});softRender()}
  if(!S.created||!Array.isArray(d.list))return;var got=false,gotItems=[],gotNotes=[],gG={coin:0,gems:0,tickets:0},gIds=[],gLv=[];
  d.list.forEach(function(a){if(!isO(a)||!IDRE.test(a.id||'')||S.adjSeen[a.id])return;
    if(int(a.t,0,9e15)<(S.startT||0)-6e5)return; /* gift from before a reset */
    S.coin+=int(a.coin,-1e8,1e8,0);S.gems+=int(a.gems,-1e8,1e8,0);if(a.src==='topup'){S.paid=(S.paid||0)+Math.max(0,int(a.gems,0,1e8,0));S.vipB=(S.vipB||0)+int(a.baht,0,1e6,0)}S.tickets+=int(a.tickets,-1e8,1e8,0);
    if(isO(a.items))Object.keys(a.items).forEach(function(k){if(!IDRE.test(k))return;var q=int(a.items[k],-1e4,1e4,0);if(!q)return;var nv=Math.max(0,Math.min(CFG.maxStack,(S.owned[k]||0)+q));
      if(nv)S.owned[k]=nv;else{delete S.owned[k];Object.keys(S.eq).forEach(function(sl){if(S.eq[sl]===k)delete S.eq[sl]})}if(q>0&&ITEM[k])gotItems.push(tx(ITEM[k].names)+(q>1?' ×'+q:''))});
    if(typeof a.note==='string'&&a.note){gotNotes.push(a.note.slice(0,60));['coin','gems','tickets'].forEach(function(k){gG[k]+=Math.max(0,int(a[k],0,1e8,0))});if(isO(a.items))Object.keys(a.items).forEach(function(k){if(ITEM[k]&&int(a.items[k],0,1e4,0)>0&&gIds.indexOf(k)<0)gIds.push(k)})}
    var al=int(a.lvl,0,100,0);if(al)gLv.push([a.id,al]);
    S.adjSeen[a.id]=1;got=true});
  gLv.forEach(function(x){commitEv({k:'alvl',aid:x[0],n:x[1]});toast('⭐ '+t('gotlvl').replace('{n}',x[1]).replace('{l}',S.lvl))});
  if(got){save();
    /* an event gift with a message opens a reward window (not in the middle of a lesson or fight) */
    if(gotNotes.length&&!UI.sess&&!UI.modal&&typeof showReward==='function'){showReward('🎁 '+gotNotes[gotNotes.length-1],{lines:['coin','gems','tickets'].filter(function(k){return gG[k]}).map(function(k){return [k,gG[k]]}),ups:[]},gIds);return}
    toast(gotNotes.length?'🎁 '+gotNotes[gotNotes.length-1]:t('teacherupd'));if(gotItems.length)toast('🎁 '+gotItems.slice(0,4).join(', ')+(gotItems.length>4?' …':''));render()}}
/* wait until everything local is in the central database */
function flushPush(){return new Promise(function(res){if(!CL.playerRef||!S.created){res(true);return}clearTimeout(CL.timer);CL.timer=null;push();var t0=Date.now();
  (function chk(){if(!CL.pushing&&!CL.dirty&&(S.pushedN||0)>=S.n&&CL.status!=='busy'){res(CL.status==='ok');return}if(Date.now()-t0>12000){res(false);return}setTimeout(chk,200)})()})}
function logout(clear){UI.modal={kind:'logout',busy:true,clear:clear};render();
  if(typeof townLeave==='function')townLeave();marketStop();
  flushPush().then(function(ok){if(!ok&&CL.playerRef){UI.modal={kind:'logout',err:true,clear:clear};render();return}
    if(clear){try{localStorage.removeItem(STORE)}catch(e){}var keep={lang:S.set.lang,theme:S.set.theme};S=fresh();S.set.lang=keep.lang;S.set.theme=keep.theme;S.owner='';}
    if(slOn()&&slLogout(clear))return;
    CL.loggedOut=true;UI.sess=null;UI.draft=null;UI.modal=null;UI.scr='bye';render()})}
function relogin(){CL.loggedOut=false;if(!CL.playerRef){UI.scr=S.created?'home':'title';render();return}
  UI.scr='title';CL.ready=false;render();
  CL.playerRef.get().then(function(snap){var d=snap.exists?snap.data():null;S.owner=CL.uid;
    if(remoteWins(d,true))return adoptRemote(d,'cloudloaded');saveLocal();if(S.created)push()}).then(function(){CL.ready=true;if(S.created)UI.scr=landing();startMarket();render()},function(){CL.ready=true;render()})}
/* pushes are spaced out (one every PUSH_GAP at most) to stay well inside the database's daily write quota;
   the device keeps everything locally, and leaving or hiding the page sends at once */
var PUSH_GAP=30000;
function schedulePush(){if(!CL.playerRef||!CL.pfirst)return;if(!MK.started)startMarket();if(CL.timer)return;
  var wait=Math.max(1200,(CL.lastPush||0)+PUSH_GAP-Date.now());CL.timer=setTimeout(function(){CL.timer=null;push()},wait)}
function pushNow(){if(!CL.timer)return;clearTimeout(CL.timer);CL.timer=null;push()}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')pushNow()});
window.addEventListener('pagehide',pushNow);
function push(){if(!CL.playerRef||!S.created||CL.loggedOut||CL.adopting)return;if(CL.pushing){CL.dirty=true;return}
  if(!cloudInSync()&&CL.rn>=(S.n||0)&&CL.rd){cloudFollow(CL.rd);return}
  CL.pushing=true;CL.lastPush=Date.now();if(CL.status!=='busy')CL.busySince=Date.now();CL.status='busy';renderHeader();
  var n=S.n,from=Math.floor((S.pushedN||0)/CHUNK),to=Math.floor(Math.max(0,n-1)/CHUNK),chain=Promise.resolve();
  for(var k=from;k<=to&&n>0;k++)(function(k){chain=chain.then(function(){return CL.db.doc('players/'+CL.uid+'/log/'+k).set({k:k,ev:S.log.slice(k*CHUNK,(k+1)*CHUNK)})})})(k);
  chain.then(function(){var body=Object.assign(playerSummary(S),{state:stateForCloud(S),logMeta:{n:n,h:S.log[n-1]?S.log[n-1].h:''},updated:S.upd||Date.now()});return CL.playerRef.set(body)})
  .then(function(){S.pushedN=n;saveLocal();CL.status='ok'},function(e){CL.status=errCode(e)==='invalid_argument'?'ro':'err'}).then(function(){
    CL.pushing=false;renderHeader();if(CL.dirty){CL.dirty=false;schedulePush()}})}
/* sync pill: "connecting" until the first answer, "saving" while a write is out; if the database stays silent for 30 s
   it says so and opens an explanation (the device keeps everything in the meantime) */
var SY_SLOW_MS=30000;
function syncSlow(){var now=Date.now(),st=CL.status;if(st==='busy')return !!CL.busySince&&now-CL.busySince>SY_SLOW_MS;if(!st)return !!CL.connSince&&now-CL.connSince>SY_SLOW_MS;return false}
function syncPill(){if(!CL.db||!CL.uid)return '<span class="sync" title="'+esc(t('sy_local'))+'"><i></i><span>'+esc(t('sy_local'))+'</span></span>';
  if(!CL.status&&!CL.connSince)CL.connSince=Date.now();syncTick();
  var st=CL.status,slow=syncSlow(),cls=slow?'err':st==='ok'?'ok':st==='busy'?'busy':(st==='err'||st==='ro')?'err':'',k=slow?'sy_slow':st==='ok'?'sy_ok':st==='busy'?'sy_busy':st==='ro'?'sy_ro':st==='err'?'sy_err':'sy_conn';
  var inner='<i></i><span>'+esc(st==='ro'&&!slow?t('sy_local'):t(k))+'</span>';
  return slow||st==='err'?'<button class="sync '+cls+'" data-act="syncinfo" title="'+esc(t(k))+'">'+inner+'</button>':'<span class="sync '+cls+'" title="'+esc(t(k))+'">'+inner+'</span>'}
function syncTick(){if(CL.syIv)return;CL.syIv=setInterval(function(){var w=CL.status==='busy'||!CL.status;if(w||CL.syWasSlow){var sl=syncSlow();if(sl!==CL.syWasSlow||w){CL.syWasSlow=sl;renderHeader()}}},5000)}
