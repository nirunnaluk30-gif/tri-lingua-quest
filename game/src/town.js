/* =====================================================================
   TOWN — everyone who is online, together on one plaza, with chat.
   town/{uid}: written only by that student (position, look, last messages);
   everyone signed in reads all of them. settings/town: admin moderation.
   ===================================================================== */
var TW={docs:{},unsub:null,hb:null,mod:{muted:[],slow:3,scene:'plaza',img:'',decor:false},modUnsub:null,in:false,me:{x:50,y:72},lastSend:0,msgs:[],moveT:null,writeQ:null};
var TOWN_ONLINE_MS=75000,TOWN_KEEP=50,TOWN_ATT_DAYS=90;
var QUICK=[['👋','สวัสดี!'],['👋','Hello!'],['👋','你好!'],['😊','ยินดีที่ได้รู้จัก'],['🙏','Thank you!'],['🙏','谢谢!'],['🎉','เก่งมาก!'],['💪','加油!'],['📚','Let\'s study!']];
var BADW=['ควย','เหี้ย','สัส','เย็ด','หี','fuck','shit','bitch','asshole','dick','操','傻逼','妈的'];
/* plaza backdrops: built-in scenes, or a picture the admin uploads (settings/town) */
var TOWN_SCENES={
 plaza:{n:m('ลานกลางเมือง','Town plaza','城镇广场'),bg:'linear-gradient(#8fd3ff 0,#bfe8ff 34%,#9fdc8a 34.2%,#7cc96b 60%,#6bbb5c 100%)',gr:'radial-gradient(#e9dcc0,#d8c7a3)',cloud:1,
  d:[['🏫',4,14,'b'],['🏯',24,10,'b'],['🗼',72,8,'b'],['⛩️',86,14,'b'],['🌳',12,40,'t'],['🌸',84,42,'t'],['🌳',46,24,'t'],['⛲',50,58,'f']]},
 beach:{n:m('ชายหาดทะเลคราม','Blue beach','蓝色海滩'),bg:'linear-gradient(#7fd0ff 0,#c8efff 30%,#2fa8d8 30.2%,#5cc6e8 44%,#f3dfa8 44.2%,#ead09a 100%)',gr:'radial-gradient(#fff3cf,#f0dca8)',cloud:1,
  d:[['🌴',6,30,'b'],['🌴',88,32,'b'],['⛵',30,24,'t'],['🏖️',70,50,'t'],['🐚',20,80,'t'],['🦀',82,82,'t'],['🏰',50,58,'f']]},
 night:{n:m('เทศกาลโคมไฟยามค่ำ','Lantern night','灯笼夜'),bg:'radial-gradient(1.5px 1.5px at 20% 15%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 70% 10%,#fff 50%,transparent 51%),radial-gradient(2px 2px at 45% 22%,#fff 50%,transparent 51%),linear-gradient(#0d1440 0,#2a2a6a 34%,#3a2f5a 34.2%,#2a2245 100%)',gr:'radial-gradient(#5a4a7a,#3a2f5a)',
  d:[['🏮',10,8,'t'],['🏮',30,4,'t'],['🏮',68,6,'t'],['🏮',88,8,'t'],['🌕',50,6,'b'],['🎆',20,22,'b'],['🎇',80,22,'b'],['🏯',50,58,'f']]},
 snow:{n:m('หมู่บ้านหิมะ','Snow village','雪村'),bg:'linear-gradient(#9ab8d8 0,#d8e8f8 34%,#f2f7fd 34.2%,#e4eef8 100%)',gr:'radial-gradient(#ffffff,#dfe9f5)',cloud:1,
  d:[['🏔️',8,10,'b'],['🏔️',80,8,'b'],['🌲',14,40,'t'],['🌲',86,40,'t'],['🏠',30,22,'t'],['🏠',66,22,'t'],['⛄',50,58,'f']]},
 sakura:{n:m('สวนซากุระ','Sakura garden','樱花园'),bg:'linear-gradient(#ffd6e8 0,#ffeef6 34%,#c8e8b0 34.2%,#a8d890 100%)',gr:'radial-gradient(#fbe3ea,#f1cdd8)',cloud:1,
  d:[['🌸',6,20,'b'],['🌸',26,14,'b'],['🌸',72,14,'b'],['🌸',90,20,'b'],['⛩️',50,16,'b'],['🎎',16,62,'t'],['🍡',84,64,'t'],['🎋',50,58,'f']]},
 thai:{n:m('วัดไทยริมน้ำ','Thai riverside temple','泰式河畔寺庙'),bg:'linear-gradient(#ffb36a 0,#ffe0a8 34%,#7cc96b 34.2%,#5fae5a 70%,#3f8fbf 70.2%,#5aa8d8 100%)',gr:'radial-gradient(#f5e3b8,#e2c890)',
  d:[['🛕',8,10,'b'],['🛕',82,10,'b'],['🐘',26,30,'t'],['🌴',66,28,'t'],['🪷',14,84,'t'],['🛶',80,84,'t'],['🏵️',50,58,'f']]},
 palace:{n:m('พระราชวังจีน','Chinese palace','中国宫殿'),bg:'linear-gradient(#ffcf8a 0,#fff0d0 34%,#c8a070 34.2%,#b08a5a 100%)',gr:'radial-gradient(#e8cfa0,#cfae78)',cloud:1,
  d:[['🏯',10,8,'b'],['🏯',80,8,'b'],['🐉',46,10,'b'],['🏮',28,30,'t'],['🏮',70,30,'t'],['🐼',16,64,'t'],['🎋',86,62,'t'],['🧧',50,58,'f']]},
 space:{n:m('สถานีอวกาศ','Space station','太空站'),bg:'radial-gradient(1.5px 1.5px at 15% 20%,#fff 50%,transparent 51%),radial-gradient(1.5px 1.5px at 55% 12%,#fff 50%,transparent 51%),radial-gradient(1px 1px at 82% 28%,#fff 50%,transparent 51%),linear-gradient(#05051a 0,#1a1050 40%,#3a3a5a 40.2%,#2a2a40 100%)',gr:'radial-gradient(#5a5a7a,#3a3a55)',
  d:[['🪐',10,8,'b'],['🌍',82,6,'b'],['🚀',46,10,'b'],['🛸',26,30,'t'],['🛰️',70,28,'t'],['👾',16,70,'t'],['🌌',86,66,'t'],['🌟',50,58,'f']]}};
function cleanTownImg(v){return typeof v==='string'&&v.length<250000&&(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(v)||/^\/_blob\/[A-Za-z0-9_-]{1,80}$/.test(v))?v:''}
function sceneBack(mod){mod=mod||TW.mod;var sc=TOWN_SCENES[mod.scene]||TOWN_SCENES.plaza,img=mod.img,showDecor=!img||mod.decor;
  return (img?'':(sc.cloud?'<div class="tw-sky"></div>':''))+(showDecor?'<div class="tw-ground" style="background:'+sc.gr+(img?';opacity:.55':'')+'"></div>'+sc.d.map(function(x){return '<div class="tw-dec tw-'+x[3]+'" style="left:'+x[1]+'%;top:'+x[2]+'%">'+x[0]+'</div>'}).join(''):'')+
   '<div class="tw-sign">'+esc(t('tw_sign'))+'</div>'}
function sceneStyle(mod){mod=mod||TW.mod;var sc=TOWN_SCENES[mod.scene]||TOWN_SCENES.plaza;return mod.img?'background:#223 url(&#39;'+String(mod.img).replace(/["'\\<>\s]/g,'')+'&#39;) center/cover no-repeat':'background:'+sc.bg}
function townOn(){return CFG.townOn!==0}
function cleanMsg(s){s=String(s||'').replace(/[\u0000-\u001f\u007f​-‏‪-‮⁦-⁩]/g,' ').replace(/\s+/g,' ').trim().slice(0,150);
  BADW.forEach(function(w){var re=new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');s=s.replace(re,new Array(w.length+1).join('*'))});return s}
function isMuted(u){return TW.mod.muted.indexOf(u)>=0}
function townDocs(){var out=[];Object.keys(TW.docs).forEach(function(u){var d=TW.docs[u];if(isO(d))out.push({u:u,d:d})});return out}
function onlineNow(){var now=Date.now();return townDocs().filter(function(x){return int(x.d.seen,0,9e15)>now-TOWN_ONLINE_MS})}
function myLook(){var eq={};Object.keys(S.eq).forEach(function(k){if(typeof S.eq[k]==='string')eq[k]=S.eq[k]});return {name:S.name,lvl:S.lvl,g:S.gender,cls:S.cls,eq:eq,tt:shownTitle(S),ta:S.set.taura!==false,vip:typeof vipLevel==='function'&&vipOn()?vipLevel():0}}
function townWrite(patch,delay){if(!CL.db||!CL.uid)return;if(TW.mineUid!==CL.uid){TW.mineUid=CL.uid;TW.mineOk=false;TW.mineLd=false;TW.pend=null}if(!TW.mineOk){TW.pend=Object.assign(TW.pend||{},patch||{});townLoadMine();return}var cur=TW.docs[CL.uid]||{};var body=Object.assign({},cur,myLook(),patch||{});
  body.msgs=(Array.isArray(body.msgs)?body.msgs:[]).slice(-TOWN_KEEP);TW.docs[CL.uid]=body;
  clearTimeout(TW.writeQ);TW.writeQ=setTimeout(function(){TW.writeQ=null;var b=TW.docs[CL.uid]||body;CL.db.doc('town/'+CL.uid).set(b).catch(function(){})},delay||250)}
/* read my own town doc once before any write, so an update never wipes my earlier messages / attendance */
function townLoadMine(){if(TW.mineOk||TW.mineLd||!CL.db||!CL.uid)return;TW.mineLd=true;var uid=CL.uid;
  retry(function(){return CL.db.doc('town/'+uid).get()}).then(function(s){if(uid!==CL.uid){TW.mineLd=false;return}var v=s&&s.exists?s.data():null;if(isO(v))TW.docs[uid]=Object.assign({},v,TW.docs[uid]||{});TW.mineOk=true;TW.mineLd=false;
    if(TW.pend){var p=TW.pend;TW.pend=null;townWrite(p)}},function(){TW.mineLd=false;setTimeout(townLoadMine,15000)})}
function townEnter(){if(TW.in||!CL.db||!CL.uid||!townOn()||CL.ban)return;TW.in=true;startTownSync();
  var mine=TW.docs[CL.uid];if(mine&&typeof mine.x==='number'){TW.me={x:mine.x,y:mine.y}}
  townWrite({x:TW.me.x,y:TW.me.y,seen:Date.now()});clearInterval(TW.hb);TW.hb=setInterval(function(){if(UI.scr!=='town'){townLeave();return}townWrite({seen:Date.now()})},50000)}
function townLeave(){if(!TW.in)return;TW.in=false;clearInterval(TW.hb);TW.hb=null;clearTimeout(TW.writeQ);TW.writeQ=null;if(CL.db&&CL.uid&&TW.mineOk&&TW.mineUid===CL.uid&&TW.docs[CL.uid]){TW.docs[CL.uid].seen=0;CL.db.doc('town/'+CL.uid).set(TW.docs[CL.uid]).catch(function(){})}
  if(!(UI.scr==='admin'&&UI.adm==='town'))townStopSync()}
/* students only listen to people seen in the last few minutes (old visitors cost a database read each); the teacher's town page sees everyone */
function townStopSync(){if(TW.unsub){try{TW.unsub()}catch(e){}}TW.unsub=null;TW.all=false}
function startTownSync(all){all=!!all;if(TW.unsub&&(TW.all||!all))return;if(!CL.db)return;townStopSync();TW.all=all;
  var col=CL.db.collection('town'),qs=[col];if(!all&&typeof col.where==='function'){try{qs=[col.where('seen','>',Date.now()-5*60000),col.where('lm','>',Date.now()-864e5)]}catch(e){qs=[col]}}
  var parts=qs.map(function(){return {}}),un=qs.map(function(q,i){return q.onSnapshot(function(snap){var d={};snap.docs.forEach(function(x){var v=x.data();if(isO(v)&&IDRE.test(x.id))d[x.id]=v});parts[i]=d;
    var m={};parts.forEach(function(p){Object.keys(p).forEach(function(k){var a=m[k],b=p[k];m[k]=!a||int(b.seen,0,9e15)>=int(a.seen,0,9e15)?b:a})});
    var mine=TW.docs[CL.uid];if(mine&&(TW.writeQ||!m[CL.uid]))m[CL.uid]=mine;TW.docs=m;if(UI.scr==='town')townPaint();else if(UI.scr==='admin'&&UI.adm==='town')softRender()},function(){})});
  TW.unsub=function(){un.forEach(function(f){try{f()}catch(e){}})};
  if(!TW.modUnsub)TW.modUnsub=CL.db.doc('settings/town').onSnapshot(function(s){var v=s.exists?s.data():{};TW.mod={muted:Array.isArray(v.muted)?v.muted.filter(function(x){return typeof x==='string'&&IDRE.test(x)}).slice(0,500):[],slow:int(v.slow,0,60,3),scene:TOWN_SCENES[v.scene]?v.scene:'plaza',img:cleanTownImg(v.img),decor:v.decor===true};var sc=document.getElementById('tw_scene');if(sc&&UI.scr==='town'){sc.setAttribute('style',sceneStyle().replace(/&#39;/g,"'"));var bd=sc.querySelector('.tw-bd');if(bd)bd.innerHTML=sceneBack();townPaint()}softRender()},function(){})}
function townSend(txt){txt=cleanMsg(txt);if(!txt)return;if(CL.ban){toast(t('ban_note'));return}if(!townOn()){toast(t('tw_closed'));return}if(isMuted(CL.uid)){toast(t('tw_muted'));return}
  var gap=Date.now()-TW.lastSend,need=(TW.mod.slow||3)*1000;if(gap<need){toast(t('tw_slow').replace('{s}',Math.ceil((need-gap)/1000)));return}TW.lastSend=Date.now();
  var cur=TW.docs[CL.uid]||{};var msgs=(Array.isArray(cur.msgs)?cur.msgs:[]).concat([{id:'m'+Date.now().toString(36)+Math.floor(rnd(1e4)).toString(36),t:Date.now(),txt:txt}]);
  var now=Date.now(),day=today(),att=Object.assign({},isO(cur.att)?cur.att:{});if(!isO(att[day]))att[day]={t:now,txt:txt.slice(0,60)};
  Object.keys(att).sort().slice(0,-TOWN_ATT_DAYS).forEach(function(k){delete att[k]});
  townWrite({msgs:msgs,seen:now,lm:now,att:att});townPaint();['tw_in','tw_in2'].forEach(function(k){var c=document.getElementById(k);if(c)c.value=''});var ci=document.getElementById(TW.lastIn||'tw_in');if(ci)ci.focus()}
function townMove(x,y){TW.me={x:Math.max(4,Math.min(96,x)),y:Math.max(44,Math.min(94,y))};townWrite({x:TW.me.x,y:TW.me.y,seen:Date.now()},1000);townPaint()}
function allMsgs(days){var out=[],cut=Date.now()-864e5*(days||1);townDocs().forEach(function(x){if(isMuted(x.u)&&x.u!==CL.uid)return;(Array.isArray(x.d.msgs)?x.d.msgs:[]).forEach(function(mm){if(isO(mm)&&typeof mm.txt==='string'&&int(mm.t,0,9e15)>cut)out.push({u:x.u,name:str(x.d.name,16)||'?',t:int(mm.t,0,9e15),txt:cleanMsg(mm.txt),id:str(mm.id,30)})})});
  return out.sort(function(a,b){return a.t-b.t}).slice(-120)}
function townAvatar(x){var d=x.d,st={gender:d.g==='M'?'M':'F',cls:CLASSES[d.cls]?d.cls:'mage',eq:{},gd:typeof d.gd==='string'?d.gd:''};if(isO(d.eq))Object.keys(d.eq).forEach(function(k){var id=d.eq[k];if(typeof id==='string'&&ITEM[id]&&(slotOf(ITEM[id])===k))st.eq[k]=id});return avatar(st,{label:str(d.name,16),anim:true,noFx:true,noTitle:true,petRoom:false,petFront:true,auraTitle:d.ta===false?'':(TITLE[d.tt]?d.tt:'')})}
function townPeople(){var on=onlineNow(),now=Date.now();if(!on.some(function(x){return x.u===CL.uid})&&TW.in)on.push({u:CL.uid,d:Object.assign({},myLook(),{x:TW.me.x,y:TW.me.y,seen:now,msgs:(TW.docs[CL.uid]||{}).msgs})});
  return on.map(function(x){var me=x.u===CL.uid,d=x.d;return {u:x.u,me:me,d:d,x:me?TW.me.x:Math.max(4,Math.min(96,+d.x||50)),y:me?TW.me.y:Math.max(44,Math.min(94,+d.y||72))}})}
function personInner(p,now){var d=p.d,last=(Array.isArray(d.msgs)?d.msgs:[]).slice(-1)[0];var showB=last&&isO(last)&&now-int(last.t,0,9e15)<9000&&!(isMuted(p.u)&&!p.me);
  return {bub:showB?'<span class="tw-bub">'+esc(cleanMsg(last.txt))+'</span>':'',lastId:last&&isO(last)?str(last.id,30):'',look:JSON.stringify([d.g,d.cls,d.eq,d.name,d.lvl,d.tt,d.ta,d.vip,d.gd||''])}}
function sceneHtml(){return '<div class="tw-bd">'+sceneBack()+'</div><div class="tw-people"></div>'}
/* keep each player's element alive so walking glides, they face where they go, and hop when they talk */
TW.pos={};
function paintPeople(sc){var box=sc.querySelector('.tw-people');if(!box){sc.innerHTML=sceneHtml();box=sc.querySelector('.tw-people')}var now=Date.now(),seen={};
  townPeople().forEach(function(p){seen[p.u]=1;var el=box.querySelector('[data-u="'+CSS.escape(p.u)+'"]'),r=personInner(p,now),ps=TW.pos[p.u]||{};
    if(!el){el=document.createElement('div');el.className='tw-p'+(p.me?' me':'');el.dataset.u=p.u;el.innerHTML='<span class="tw-bubw"></span><span class="tw-tt"></span><span class="tw-av"></span><span class="tw-nm"></span>';box.appendChild(el);el.style.left=p.x+'%';el.style.top=p.y+'%'}
    if(el.dataset.look!==r.look){el.dataset.look=r.look;el.querySelector('.tw-av').innerHTML=townAvatar(p);el.querySelector('.tw-tt').innerHTML=TITLE[p.d.tt]?titleBadge(p.d.tt,150):'';var vg=int(p.d.vip,0,10,0)>=6;el.querySelector('.tw-nm').classList.toggle('vipgold',vg);el.querySelector('.tw-nm').innerHTML=(p.me?'⭐ ':'')+(vg?'👑 ':'')+esc(str(p.d.name,16))+' <small>Lv'+int(p.d.lvl,1,999)+'</small>'}
    var bw=el.querySelector('.tw-bubw');if(bw&&bw.innerHTML!==r.bub)bw.innerHTML=r.bub;
    if(ps.x!==undefined&&(Math.abs(ps.x-p.x)>.3||Math.abs(ps.y-p.y)>.3)){if(Math.abs(ps.x-p.x)>.3)el.classList.toggle('left',p.x<ps.x);el.classList.add('walk');clearTimeout(ps.wt);ps.wt=setTimeout(function(){el.classList.remove('walk')},900)}
    if(ps.lastId!==undefined&&r.lastId&&r.lastId!==ps.lastId){el.classList.remove('hop');void el.offsetWidth;el.classList.add('hop');setTimeout(function(){el.classList.remove('hop')},650)}
    el.style.left=p.x+'%';el.style.top=p.y+'%';el.style.zIndex=Math.round(p.y);ps.x=p.x;ps.y=p.y;ps.lastId=r.lastId;TW.pos[p.u]=ps});
  Array.prototype.slice.call(box.children).forEach(function(el){if(!seen[el.dataset.u])el.remove()});
  townBoss(sc);var om=sc.querySelector('.tw-mecha');if(om)om.remove()}
/* the teacher's event boss stands still on the plaza (tap it to open the fight) */
function townBoss(sc){if(typeof evCur!=='function')return;var b=evCur();if(b&&b.art!=='lion')b=null;var w=sc.querySelector('.tw-boss'),now=Date.now(),lab='';
  if(b&&now<=b.start+b.hours*3600e3){var k=RDB;rdUse('ev');var sl=rdSlot();rdWatch(sl.id);var st=rdStats();rdUse(k);
    if(!st.dead)lab=now<b.start?'⏳ '+t('rd_evwait').replace('{d}',rdWhen(b.start)).replace('{r}',rdDur(b.start-now)).replace(/^[^!]*! /,''):'⚔️ '+t('rd_hp')+' '+st.left+'/'+st.hp}
  if(!lab){if(w)w.remove();return}
  if(!w){w=document.createElement('button');w.type='button';w.className='tw-boss';w.dataset.act='rdgo';w.dataset.id='ev';
    w.innerHTML='<span class="tw-bosslab"></span><span class="tw-bossart">'+lionArt(true,false)+'</span>';sc.appendChild(w)}
  w.setAttribute('aria-label',tx(b.names)+' — '+lab);var lb=w.querySelector('.tw-bosslab'),html='<b>🦁 '+esc(tx(b.names))+'</b><small>'+esc(lab)+'</small>';if(lb.innerHTML!==html)lb.innerHTML=html}
function chatHtml(days){var ms=allMsgs(days);return ms.length?ms.map(function(mm){var me=mm.u===CL.uid;return '<div class="tw-msg'+(me?' me':'')+'"><b>'+esc(mm.name)+'</b> <small class="mut">'+new Date(mm.t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+'</small><div>'+esc(mm.txt)+'</div></div>'}).join(''):'<div class="empty">'+esc(t('tw_nomsg'))+'</div>'}
function townPaint(){var sc=document.getElementById('tw_scene'),cl=document.getElementById('tw_chat'),ol=document.getElementById('tw_online');if(!sc){return}
  paintPeople(sc);var mn=document.getElementById('tw_mini');if(mn){var mh=allMsgs().slice(-4).map(function(mm){return '<div><b>'+esc(mm.name)+':</b> '+esc(mm.txt)+'</div>'}).join('');if(mn.innerHTML!==mh)mn.innerHTML=mh}
  if(cl){var atBottom=cl.scrollHeight-cl.scrollTop-cl.clientHeight<60;cl.innerHTML=chatHtml();if(atBottom)cl.scrollTop=cl.scrollHeight}
  if(ol){var on=onlineNow();ol.innerHTML='<b>🟢 '+esc(t('tw_online'))+' '+on.length+'</b>'+on.map(function(x){return '<span class="tw-chip">'+esc(str(x.d.name,16))+(x.u===CL.uid?' ('+esc(t('tw_you'))+')':'')+'</span>'}).join('')}}
VIEW.town=function(){if(!CL.db||!CL.uid)return '<section class="panel"><div class="empty">'+esc(t('mk_needcloud'))+'</div></section>';
  if(!townOn())return '<section class="panel"><div class="empty">🏘️ '+esc(t('tw_closed'))+'</div></section>';
  if(CL.ban)return '<section class="panel"><div class="empty">⛔ '+esc(t('ban_note'))+'</div></section>';
  setTimeout(function(){townEnter();townPaint();var cl=document.getElementById('tw_chat');if(cl)cl.scrollTop=cl.scrollHeight},0);
  return '<section class="panel stack"><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:6px"><h1 style="font-size:24px;margin:0">🏘️ '+esc(t('n_town'))+'</h1><small class="mut">'+esc(t('tw_hint'))+'</small>'+'</div>'+
   '<div class="tw-wrap"><div class="tw-scene" id="tw_scene" data-act="twmove" style="'+sceneStyle()+'" role="application" aria-label="'+esc(t('n_town'))+'">'+sceneHtml()+'</div>'+(isMuted(CL.uid)?'':'<div class="tw-over"><div class="tw-mini" id="tw_mini" aria-hidden="true"></div><form class="tw-form tw-form2" onsubmit="return false"><span class="tw-f2ic" aria-hidden="true">💬</span><input id="tw_in2" maxlength="150" autocomplete="off" enterkeyhint="send" placeholder="'+esc(t('tw_ph'))+'" aria-label="'+esc(t('tw_ph'))+'"><button class="btn" data-act="twsend" data-id="2">'+esc(t('tw_send'))+'</button></form></div>')+'</div><div class="tw-online" id="tw_online"></div></section>'+
   '<section class="panel stack"><h2 style="font-size:20px">💬 '+esc(t('tw_chat'))+'</h2><div class="tw-chat" id="tw_chat" aria-live="polite">'+chatHtml()+'</div>'+
   (isMuted(CL.uid)?'<div class="notice warn" style="display:block">'+esc(t('tw_muted'))+'</div>':
   '<div class="tw-quick">'+QUICK.map(function(q,i){return '<button class="btn sm sec" data-act="twquick" data-id="'+i+'">'+q[0]+' '+esc(q[1])+'</button>'}).join('')+'</div>'+
   '<form class="tw-form" onsubmit="return false"><input id="tw_in" maxlength="150" autocomplete="off" placeholder="'+esc(t('tw_ph'))+'" aria-label="'+esc(t('tw_ph'))+'"><button class="btn" data-act="twsend">'+esc(t('tw_send'))+'</button></form>')+
   '<small class="mut">'+esc(t('tw_rules'))+'</small></section>'};
function townAct(a,id,el,e){switch(a){
  case 'twmove':if(!e||!TW.in)return true;var sc=document.getElementById('tw_scene');if(!sc)return true;var r=sc.getBoundingClientRect();townMove((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);return true;
  case 'twsend':TW.lastIn=id==='2'?'tw_in2':'tw_in';var ci=document.getElementById(TW.lastIn);if(ci)townSend(ci.value);return true;
  case 'twquick':var q=QUICK[int(id,0,QUICK.length-1)];if(q)townSend(q[0]+' '+q[1]);return true}
  return false}
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&(e.target.id==='tw_in'||e.target.id==='tw_in2')){e.preventDefault();TW.lastIn=e.target.id;townSend(e.target.value)}});
setInterval(function(){if(UI.scr==='town'&&TW.in)townPaint()},4000);

/* ---------- admin: town moderation ---------- */
function modSave(patch){var body=Object.assign({muted:TW.mod.muted.slice(),slow:TW.mod.slow,scene:TW.mod.scene||'plaza',img:TW.mod.img||'',decor:!!TW.mod.decor},patch);return retry(function(){return CL.db.doc('settings/town').set(body)}).then(function(){TW.mod=body;render()},writeErr)}
function admTown(){startTownSync(true);var all=townDocs().sort(function(a,b){return int(b.d.seen,0,9e15)-int(a.d.seen,0,9e15)}),on=onlineNow().length,now=Date.now();
  var md=TW.mod;
  return '<section class="panel stack"><div class="adm-head"><h1>🖼️ '+at('tw_bgt')+'</h1></div><small class="mut">'+at('tw_bgh')+'</small>'+
   '<div class="tw-bgrid">'+Object.keys(TOWN_SCENES).map(function(k){var on=!md.img&&md.scene===k;return '<button class="tw-bpick" data-act="admtwscene" data-id="'+k+'" aria-pressed="'+on+'"><span class="tw-bmini" style="'+sceneStyle({scene:k})+'">'+sceneBack({scene:k})+'</span><span>'+esc(tx(TOWN_SCENES[k].n))+'</span></button>'}).join('')+'</div>'+
   '<div class="cfg"><div class="fld full"><label for="tw_file">📁 '+at('tw_upload')+'</label><input type="file" id="tw_file" accept="image/png,image/jpeg,image/webp"><small class="mut" id="tw_upmsg">'+at(md.img?'tw_hasimg':'tw_imgtip')+'</small></div></div>'+
   (md.img?'<div class="row"><label class="toggle" for="tw_decor" style="flex:1"><span>'+at('tw_decor')+'</span><input type="checkbox" class="sw" id="tw_decor"'+(md.decor?' checked':'')+'></label><button class="btn sm sec" data-act="admtwnoimg">'+at('tw_noimg')+'</button></div>':'')+
   '<b>'+at('tw_preview')+'</b><div class="tw-scene" style="'+sceneStyle()+';height:clamp(220px,34vw,320px);cursor:default">'+sceneBack()+'</div></section>'+
   '<section class="panel stack"><div class="adm-head"><h1>🏘️ '+at('town')+'</h1></div><small class="mut">'+at('tw_admh')+'</small>'+
   '<div class="row"><span class="tag">🟢 '+esc(t('tw_online'))+' '+on+'</span><span class="tag">'+esc(CFG.townOn!==0?at('tw_isopen'):at('tw_isclosed'))+'</span><label class="row" style="gap:6px">'+at('tw_slowl')+' <input type="number" id="tw_slow" min="0" max="60" value="'+TW.mod.slow+'" style="width:70px"></label><button class="btn sm sec" data-act="admtwslow">'+at('save')+'</button><button class="btn sm" style="background:var(--bad);color:#fff;margin-left:auto" data-act="admtwclearall">'+at('tw_clearall')+'</button></div>'+
   '<div class="tblwrap"><table class="dt"><thead><tr><th>'+at('p_hero')+'</th><th>'+at('tw_status')+'</th><th>'+at('tw_last')+'</th><th></th></tr></thead><tbody>'+
   (all.length?all.map(function(x){var d=x.d,ms=Array.isArray(d.msgs)?d.msgs:[],last=ms.slice(-1)[0],online=int(d.seen,0,9e15)>now-TOWN_ONLINE_MS,mu=isMuted(x.u);
     return '<tr><td><b>'+esc(str(d.name,16))+'</b> <small class="mut">Lv'+int(d.lvl,1,999)+'</small></td><td>'+(online?'🟢':'⚪')+(mu?' 🔇':'')+'</td><td style="max-width:320px">'+(last&&isO(last)?esc(cleanMsg(last.txt))+' <small class="mut">('+ms.length+')</small>':'—')+'</td>'+
      '<td class="act"><button class="mini" data-act="admtwmute" data-id="'+esc(x.u)+'">'+(mu?at('tw_unmute'):at('tw_mute'))+'</button> <button class="mini danger" data-act="admtwclear" data-id="'+esc(x.u)+'">'+at('tw_clear')+'</button></td></tr>'}).join(''):'<tr><td colspan="4" class="mut">'+at('tw_none')+'</td></tr>')+'</tbody></table></div>'+
   '<b>'+at('tw_log')+'</b><div class="tw-chat" style="max-height:300px">'+chatHtml(7)+'</div></section>'+attHtml()}
/* ===== attendance from chat: who typed in town on a given day (first message of the day) ===== */
function attOf(d,day){if(isO(d.att)&&isO(d.att[day]))return {t:int(d.att[day].t,0,9e15),txt:str(d.att[day].txt,60)};var first=null;
  (Array.isArray(d.msgs)?d.msgs:[]).forEach(function(mm){if(!isO(mm))return;var t0=int(mm.t,0,9e15),dt=new Date(t0),k=dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0');if(k===day&&(!first||t0<first.t))first={t:t0,txt:cleanMsg(mm.txt).slice(0,60)}});return first}
function attRows(day){return townDocs().map(function(x){var a=attOf(x.d,day);return a?{u:x.u,name:str(x.d.name,16)||'?',lvl:int(x.d.lvl,1,999),t:a.t,txt:a.txt}:null}).filter(Boolean).sort(function(a,b){return a.t-b.t})}
function attHtml(){var day=UI.attDay||today(),rows=attRows(day);
  return '<section class="panel stack"><div class="adm-head"><h2 style="font-size:20px">📋 '+at('tw_att')+'</h2></div><small class="mut">'+at('tw_atth')+'</small>'+
   '<div class="row"><label class="row" style="gap:6px">'+at('tw_attday')+' <input type="date" id="tw_attday" value="'+esc(day)+'"></label><span class="tag">👥 '+rows.length+' '+at('tw_attn')+'</span>'+
   (rows.length?'<button class="btn sec sm" data-act="admtwattcopy">📋 '+at('tw_attcopy')+'</button>':'')+'</div>'+
   '<div class="tblwrap"><table class="dt"><thead><tr><th>#</th><th>'+at('p_hero')+'</th><th>'+at('tw_atttime')+'</th><th>'+at('tw_attmsg')+'</th></tr></thead><tbody>'+
   (rows.length?rows.map(function(r,i){return '<tr><td>'+(i+1)+'</td><td><b>'+esc(r.name)+'</b> <small class="mut">Lv'+r.lvl+'</small></td><td class="num">'+new Date(r.t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+'</td><td>'+esc(r.txt)+'</td></tr>'}).join(''):'<tr><td colspan="4" class="mut">'+at('tw_attnone')+'</td></tr>')+
   '</tbody></table></div></section>'}
function townUpload(file){var msg=document.getElementById('tw_upmsg');if(!file||!/^image\//.test(file.type)){if(msg)msg.textContent=at('th_badimg');return}
  if(msg)msg.textContent=at('th_uploading');var img=new Image(),url=URL.createObjectURL(file);
  img.onload=function(){URL.revokeObjectURL(url);var sc=Math.min(1,1600/Math.max(img.width,img.height)),cv=document.createElement('canvas');cv.width=Math.round(img.width*sc);cv.height=Math.round(img.height*sc);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
    var done=function(src){modSave({img:src,decor:false}).then(function(){toast(at('tw_bgsaved'))})};
    capUse('assets').then(function(as){if(as&&as.upload)cv.toBlob(function(b){as.upload(b).then(function(r){done(r&&r.id?'/_blob/'+r.id:shrink(cv))},function(){done(shrink(cv))})},'image/jpeg',.85);else done(shrink(cv))})};
  img.onerror=function(){if(msg)msg.textContent=at('th_badimg')};img.src=url}
function townAdminAct(a,id){switch(a){
  case 'admtwscene':if(!TOWN_SCENES[id])return true;modSave({scene:id,img:''}).then(function(){toast(at('tw_bgsaved'))});return true;
  case 'admtwnoimg':modSave({img:''});return true;
  case 'admtwmute':var mu=TW.mod.muted.slice(),i=mu.indexOf(id);if(i>=0)mu.splice(i,1);else mu.push(id);modSave({muted:mu});return true;
  case 'admtwslow':var sv=document.getElementById('tw_slow');modSave({slow:int(sv&&sv.value,0,60,3)});return true;
  case 'admtwclear':var d=TW.docs[id];if(!d)return true;var nd=Object.assign({},d,{msgs:[]});retry(function(){return CL.db.doc('town/'+id).set(nd)}).then(function(){toast(at('saved'))},writeErr);return true;
  case 'admtwattcopy':var rr=attRows(UI.attDay||today()),txt=rr.map(function(r,i){return (i+1)+'\t'+r.name+'\t'+new Date(r.t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})+'\t'+r.txt}).join('\n');
    try{navigator.clipboard.writeText(txt).then(function(){toast(at('tw_attcopied'))},function(){toast(at('tw_attcopied'))})}catch(e){}return true;
  case 'admtwclearall':Promise.all(townDocs().map(function(x){return retry(function(){return CL.db.doc('town/'+x.u).set(Object.assign({},x.d,{msgs:[]}))})})).then(function(){toast(at('saved'))},writeErr);return true}
  return false}
document.addEventListener('change',function(e){if(e.target&&e.target.id==='tw_attday'&&/^\d{4}-\d{2}-\d{2}$/.test(e.target.value)){UI.attDay=e.target.value;render()}});
