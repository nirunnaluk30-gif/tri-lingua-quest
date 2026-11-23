/* =====================================================================
   WHO IS ONLINE — every signed-in player stamps their own key in one of two
   small shared docs (presence/s0, presence/s1) every few minutes while the
   game is open; the count reads just those two docs every few minutes.
   Cheap on the free database plan: no listener, no reading every player.
   ===================================================================== */
Object.assign(L,{pr_on:m('ออนไลน์ {n} คน','{n} online','{n} 人在线'),pr_wait:m('กำลังนับ…','Counting…','统计中…'),pr_none:m('ออนไลน์ —','Online —','在线 —'),
 pr_title:m('ผู้เล่นที่ออนไลน์ตอนนี้','Players online now','当前在线玩家'),pr_note:m('นับคนที่เปิดเกมอยู่ภายใน 6 นาทีที่ผ่านมา อัปเดตทุก 3 นาที','Counts players with the game open in the last 6 minutes; updates every 3 minutes','统计最近 6 分钟内打开游戏的玩家,每 3 分钟更新'),pr_refresh:m('อัปเดตตอนนี้','Refresh now','立即刷新')});
var PR={n:null,ids:[],t:0,iv:null,hb:0,busy:false,pruned:false},PR_SHARDS=['s0','s1'],PR_WIN=6*60000,PR_EVERY=3*60000;
function prShard(pid){var h=0;for(var i=0;i<pid.length;i++)h=(h*31+pid.charCodeAt(i))|0;return PR_SHARDS[Math.abs(h)%PR_SHARDS.length]}
function prReady(){return !!(CL.db&&CL.uid&&S.created&&!CL.loggedOut)}
function prBeat(){if(!prReady()||document.hidden)return;var o={};o[CL.uid]=Date.now();PR.hb=Date.now();try{CL.db.doc('presence/'+prShard(CL.uid)).set(o,{merge:true}).catch(function(){})}catch(e){}}
function prPoll(force){if(!prReady()||PR.busy||(document.hidden&&!force))return;PR.busy=true;
  Promise.all(PR_SHARDS.map(function(s){return CL.db.doc('presence/'+s).get()})).then(function(snaps){var now=Date.now(),ids=[];
    snaps.forEach(function(sn,i){var d=sn&&sn.exists?(sn.data()||{}):{},keep={},old=0;Object.keys(d).forEach(function(k){var v=int(d[k],0,9e15,0);if(IDRE.test(k)&&v>now-PR_WIN&&ids.indexOf(k)<0)ids.push(k);if(v>now-864e5)keep[k]=v;else old++});
      /* the teacher tidies away keys older than a day so the docs stay small */
      if(CL.admin&&!PR.pruned&&old>20){try{CL.db.doc('presence/'+PR_SHARDS[i]).set(keep).catch(function(){})}catch(e){}}});
    if(CL.admin)PR.pruned=true;
    if(PR.hb&&now-PR.hb<PR_WIN&&ids.indexOf(CL.uid)<0)ids.push(CL.uid);PR.ids=ids;PR.n=ids.length;PR.t=now;PR.busy=false;prPaint()},function(){PR.busy=false})}
function prStart(){if(PR.iv||!prReady())return;prBeat();setTimeout(function(){prPoll()},1500);
  PR.iv=setInterval(function(){if(!prReady()){clearInterval(PR.iv);PR.iv=null;PR.n=null;return}if(Date.now()-PR.hb>=PR_EVERY-5000)prBeat();prPoll()},PR_EVERY)}
/* leaving the screen or switching to another app = offline right away; coming back = online again */
function prOff(){if(!prReady()||!PR.hb)return;var o={};o[CL.uid]=0;PR.hb=0;try{CL.db.doc('presence/'+prShard(CL.uid)).set(o,{merge:true}).catch(function(){})}catch(e){}
  var i=PR.ids.indexOf(CL.uid);if(i>=0){PR.ids.splice(i,1);PR.n=PR.ids.length}}
document.addEventListener('visibilitychange',function(){
  if(document.hidden){prOff();if(typeof TW!=='undefined'&&TW.in&&typeof townLeave==='function'){TW.away=true;townLeave()}return}
  if(PR.iv){prBeat();setTimeout(function(){prPoll()},800)}
  if(typeof TW!=='undefined'&&TW.away){TW.away=false;if(UI.scr==='town'&&typeof townEnter==='function')townEnter()}});
window.addEventListener('pagehide',function(){prOff()});
setInterval(function(){if(!PR.iv&&prReady())prStart()},5000);
function prLabel(){return PR.n===null?t('pr_wait'):t('pr_on').replace('{n}',PR.n)}
function prPill(){if(!CL.db||!CL.uid)return '';return '<button class="pr-pill" data-act="prlist" aria-label="'+esc(t('pr_title'))+'"><i aria-hidden="true"></i><span class="pr-n">'+esc(prLabel())+'</span></button>'}
function prPaint(){Array.prototype.forEach.call(document.querySelectorAll('.pr-pill .pr-n'),function(el){el.textContent=prLabel()});
  var ml=document.getElementById('pr_list');if(ml)ml.innerHTML=prListHtml()}
function prName(pid){if(pid===CL.uid)return (S.name||pid)+' ⭐';var p=(CL.players||[]).filter(function(x){return x.id===pid})[0];if(p&&p.d&&p.d.name)return str(p.d.name,16)+(p.d.room?' · '+str(p.d.room,20):'');
  var tw=typeof TW!=='undefined'&&TW.docs&&TW.docs[pid];if(tw&&tw.name)return str(tw.name,16);return pid.replace(/^id_/,'')}
function prListHtml(){return PR.ids.map(prName).sort(function(a,b){return a.localeCompare(b)}).map(function(n){return '<li>🟢 '+esc(n)+'</li>'}).join('')}
function prAct(a){if(a!=='prlist')return false;if(!CL.admin){prPoll(true);toast('🟢 '+prLabel()+' · '+t('pr_note'));return true}
  UI.modal={kind:'prlist'};render();prPoll(true);return true}
function prModal(md){if(md.kind!=='prlist')return null;return {body:'<h2>🟢 '+esc(t('pr_title'))+'</h2><p style="margin:0"><b class="pr-n">'+esc(prLabel())+'</b></p><small class="mut">'+esc(t('pr_note'))+'</small><ul id="pr_list" class="pr-list">'+prListHtml()+'</ul><div class="row" style="justify-content:center"><button class="btn sec" data-act="prrefresh">'+esc(t('pr_refresh'))+'</button><button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button></div>'}}
