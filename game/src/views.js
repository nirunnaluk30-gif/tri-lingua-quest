/* ===================================================================== RENDER */
function landing(){return CL.uid&&townOn()?'town':'home'}
function go(scr){UI.navd=true;UI.scr=scr;if(scr!=='play'&&UI.sess&&UI.sess.phase!=='result')UI.sess=null;UI.resetAsk=false;UI.edit=false;render();window.scrollTo(0,0);
  var h=document.querySelector('#app h1, #app h2');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}}
function applyTheme(){var r=document.documentElement;if(S.set.theme==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',S.set.theme);r.lang=S.set.lang==='zh'?'zh-CN':S.set.lang;r.classList.toggle('no-motion',S.set.motion===false);applySiteTheme()}
var NAV=[['home','n_home'],['town','n_town'],['bazaar','n_bazaar'],['map','n_map'],['quest','n_quest'],['wd','n_wd'],['gacha','n_gacha'],['shop','n_shop'],['me','n_me']];
function header(){var h='<div class="hdr-in"><div class="logo"><i aria-hidden="true"><b style="background:var(--th)"></b><b style="background:var(--en)"></b><b style="background:var(--zh)"></b></i><span>'+esc(siteTitle())+'</span></div>';
  if(S.created)h+='<div class="res">'+resPill('coin',S.coin)+resPill('gems',S.gems)+resPill('tickets',S.tickets)+'</div>';
  h+=syncPill();
  h+='<div class="langsw" role="group" aria-label="'+esc(t('uilang'))+'">'+LANGS.map(function(l){return '<button data-act="uilang" data-id="'+l+'" aria-pressed="'+(S.set.lang===l)+'">'+LLABEL[l]+'</button>'}).join('')+'</div></div>';return h}
function renderHeader(){var h=document.getElementById('hdr');if(h)h.innerHTML=header()}
function nav(){var cur=UI.scr==='tunnel'?'map':UI.scr==='raid'?'home':UI.scr==='play'?(UI.sess&&UI.sess.kind==='review'?'home':'map'):UI.scr==='market'?'wd':UI.scr;var items=NAV.slice();if(CL.admin)items.push(['admin','n_admin']);
  return '<nav class="nav" aria-label="Main">'+items.map(function(n){
  var dot=(n[0]==='quest'&&questBadge())?'<span class="dot" aria-hidden="true"></span>':'';if(n[0]==='admin'&&typeof tpPendingN==='function'){tpWatchAll();var pn=tpPendingN();if(pn)dot='<span class="nbadge" aria-label="'+pn+'">'+pn+'</span>'}
  return '<button data-act="go" data-id="'+n[0]+'"'+(cur===n[0]?' aria-current="page"':'')+'>'+ICON[n[0]]+'<span>'+esc(t(n[1]))+'</span>'+dot+'</button>'}).join('')+'</nav>'}

var VIEW={};
VIEW.title=function(){var demo={gender:'F',cls:'mage',eq:{outfit:'of2',hair:'hr3',headwear:'hd1',wings:'wg1',pet:'pt1'}};
  return '<section class="title-screen"><div class="stack" style="justify-items:center;gap:18px;max-width:560px">'+
  '<div class="stagebox" style="width:200px">'+avatar(demo,{label:'TRI-LINGUA',anim:true})+'</div>'+
  '<h1>'+(themeNow().title?esc(themeNow().title):'TRI-LINGUA<br>Quest')+'</h1><div class="tri"><span class="lt-th">ภาษาไทย</span><span class="mut">·</span><span class="lt-en">English</span><span class="mut">·</span><span class="lt-zh han">中文</span></div>'+
  '<p class="mut" style="margin:0">'+esc(siteTagline())+'</p>'+noticeBar()+
  (CL.ready?'':'<p class="mut" role="status" style="margin:0"><span class="spin"></span> '+esc(t('connecting'))+'</p>')+
  '<div class="row" style="justify-content:center">'+(CL.ready?'<button class="btn big" data-act="'+(S.created?'go':'newgame')+'" data-id="home">'+esc(S.created?t('cont'):t('start'))+'</button>':'')+(CL.admin?'<button class="btn sec big" data-act="go" data-id="admin">'+esc(t('n_admin'))+'</button>':'')+'</div>'+
  (CL.uid?'<p class="mut" style="font-size:13px;margin:0">'+esc(t('autosave'))+'</p>':'')+(canStore||CL.uid?'':'<p class="mut" style="font-size:13px">'+esc(t('storage'))+'</p>')+'</div></section>'};
function loadBox(){return '<div class="sub stack" style="width:100%;text-align:left"><label for="codein"><b>'+esc(t('loadcode'))+'</b></label><textarea id="codein" placeholder="TLQ1:…"></textarea><div class="row"><button class="btn sm" data-act="loadcode">'+esc(t('loadcode'))+'</button></div></div>'}

VIEW.bye=function(){return '<section class="title-screen"><div class="stack" style="justify-items:center;gap:14px;max-width:520px;text-align:center">'+
  '<div style="font-size:56px">👋</div><h1 style="font-size:30px;margin:0">'+esc(t('bye_t'))+'</h1><p style="margin:0">'+esc(t('bye_saved'))+'</p>'+
  '<div class="notice warn" style="display:block;text-align:left">🖥️ '+esc(t('bye_shared'))+'</div>'+
  '<button class="btn big" data-act="relogin">'+esc(t('bye_back'))+'</button></div></section>'};
VIEW.create=function(){var d=UI.draft;if(!d){UI.scr=S.created?'me':'title';return VIEW[UI.scr]()}
  var st={gender:d.gender,cls:d.cls,eq:{outfit:d.outfit,hair:d.gender==='F'?'hr3':'hr1'}};
  var h='<div class="panel"><div class="hero" style="align-items:start"><div class="stagebox">'+avatar(st,{label:t('hero'),anim:true})+'</div><div class="stack">'+
  '<h1 class="name">'+esc(UI.edit?t('class_change'):t('create'))+'</h1>'+(UI.edit?'':profFields(d))+
  '<div class="stack" style="gap:6px"><label for="hname"><b>'+esc(t('hname'))+'</b></label><input type="text" id="hname" maxlength="16" value="'+esc(d.name)+'" autocomplete="off"><small class="mut">'+esc(t('namehint'))+'</small></div>';
  if(!UI.edit)h+='<div class="stack" style="gap:6px"><b>'+esc(t('gender'))+'</b><div class="row">'+['F','M'].map(function(g){return '<button class="btn sec" data-act="dgender" data-id="'+g+'" aria-pressed="'+(d.gender===g)+'">'+esc(t(g==='F'?'female':'male'))+'</button>'}).join('')+'</div></div>';
  h+='</div></div><div class="stack" style="margin-top:16px"><b>'+esc(t('cls'))+'</b><div class="choices">'+Object.keys(CLASSES).map(function(k){var c=CLASSES[k];
    return '<button class="choice" data-act="dcls" data-id="'+k+'" aria-pressed="'+(d.cls===k)+'"><b>'+esc(tx(c.names))+'</b><small>'+esc(tx(c.perk))+'</small></button>'}).join('')+'</div>';
  if(!UI.edit)h+='<b>'+esc(t('starter'))+'</b><div class="choices">'+STARTERS[d.gender].filter(function(id){return ITEM[id]}).map(function(id){return '<button class="choice" data-act="dout" data-id="'+id+'" aria-pressed="'+(d.outfit===id)+'"><b>'+esc(tx(ITEM[id].names))+'</b><small>'+esc(t('nostats'))+'</small></button>'}).join('')+'</div>';
  if(!UI.edit)h+='<b>'+esc(t('learnlangs'))+'</b><div class="row">'+LANGS.map(function(l){return '<button class="btn sec" data-act="dtarget" data-id="'+l+'" aria-pressed="'+(d.targets.indexOf(l)>=0)+'">'+langTag(l)+' '+esc(l==='th'?'ภาษาไทย':l==='en'?'English':'中文')+'</button>'}).join('')+'</div>';
  h+='<p id="nameerr" class="err" role="alert"></p><div class="row"><button class="btn big" data-act="'+(UI.edit?'saveedit':'confirmcreate')+'">'+esc(UI.edit?t('save'):t('go'))+'</button>'+(UI.edit?'<button class="btn sec big" data-act="go" data-id="me">'+esc(t('cancel'))+'</button>':'')+'</div></div></div>';return h};

function nextStop(){for(var i=0;i<ZONES.length;i++){var z=ZONES[i];if(!zoneOpen(i))break;
  for(var j=0;j<z.units.length;j++){var u=z.units[j];if(!unitStars(u)&&WORDS.some(function(w){return w.u===u}))return {zi:i,unit:u}}
  if(!bossWins(z.id)&&zoneWords(z).length)return {zi:i,boss:true}}
  return null}
VIEW.home=function(){rollDaily();if(CL.ban&&!UI.banShown){UI.banShown=1;setTimeout(function(){toast('⛔ '+t('ban_note'))},300)}var need=expNeed(S.lvl),ns=nextStop(),due=dueWords().length;
  var hb=typeof heroBg==='function'?heroBg():null;var h=noticeBar()+profCard()+'<section class="panel pr-host'+(hb?' pf-hero'+(hb.dark?' dark':''):'')+'"'+(hb?' style="'+esc(pbgStyle(hb.id))+'"':'')+'>'+(hb?pbgArt(hb):'')+(typeof prPill==='function'?prPill():'')+'<div class="hero"><div class="stagebox">'+avatar(S,{label:S.name,anim:true})+stageFrame(S)+'</div><div class="stack">'+
  '<div class="lvl">'+esc(t('lv'))+' '+S.lvl+' · '+esc(tx(CLASSES[S.cls].names))+'</div><h1 class="name">'+esc(S.name)+'</h1>'+
  '<div class="stack" style="gap:4px"><div class="bar" role="progressbar" aria-label="EXP" aria-valuemin="0" aria-valuemax="'+need+'" aria-valuenow="'+S.exp+'"><i style="width:'+Math.min(100,S.exp/need*100)+'%"></i></div><small class="mut num">EXP '+S.exp+' / '+need+'</small></div>'+
  '<div class="row"><span class="pill num">🔥 '+S.streak.days+' '+esc(t('streak'))+'</span><span class="pill num">📚 '+learnedCount()+'/'+WORDS.length+' '+esc(t('wordsl'))+'</span>'+(CL.db&&CL.uid?'<button class="pill pf-mebtn" data-act="hfme">👤 '+esc(t('pf_title'))+'</button>':'')+'</div></div></div></section>'+(typeof newsHtml==='function'?newsHtml():'')+(typeof evaHtml==='function'?evaHtml():'')+(typeof checkinHtml==='function'?checkinHtml():'');
  if(ns){var z=ZONES[ns.zi];h+='<section class="panel cta"><div class="stack" style="gap:2px"><span class="eyebrow">'+esc(t('nextstep'))+' · '+esc(tx(z.names))+'</span><h2 style="font-size:22px">'+esc(ns.boss?t('boss')+': '+tx(z.boss.names):t('lesson')+': '+tx(UNITS[ns.unit]))+'</h2></div>'+
    '<button class="btn big" data-act="'+(ns.boss?'boss':'lesson')+'" data-id="'+esc(ns.boss?ns.zi:ns.unit)+'" data-z="'+ns.zi+'">'+esc(ns.boss?t('fight'):t('play'))+'</button></section>'}
  else h+='<section class="panel cta"><span>'+esc(t('alldone'))+'</span><button class="btn" data-act="go" data-id="map">'+esc(t('n_map'))+'</button></section>';
  h+='<div class="cols"><section class="panel stack"><span class="eyebrow">'+esc(t('review'))+'</span><div class="row" style="justify-content:space-between"><div class="stat" style="border:0;background:none;padding:0"><div class="v">'+due+'</div><div class="l">'+esc(t('due'))+'</div></div>'+
  '<button class="btn'+(due?'':' sec')+'" data-act="review"'+(due?'':' disabled')+'>'+esc(t('review'))+'</button></div>'+(due?'':'<small class="mut">'+esc(t('nodue'))+'</small>')+'</section>';
  h+='<section class="panel stack"><div class="row" style="justify-content:space-between"><span class="eyebrow">'+esc(t('today'))+'</span><button class="btn sec sm" data-act="go" data-id="quest">'+esc(t('n_quest'))+'</button></div>'+
  DAILY.map(function(d){var p=Math.min(d.goal,S.daily.p[d.key]||0);return '<div class="lgbar" style="grid-template-columns:minmax(0,1fr) 90px 44px"><span>'+esc(tx(d.names))+'</span><div class="bar" style="color:var(--accent)"><i style="width:'+(p/d.goal*100)+'%"></i></div><span class="num mut">'+p+'/'+d.goal+'</span></div>'}).join('')+'</section></div>';
  if(typeof hallHtml==='function')h+=hallHtml();
  if(typeof thanksHtml==='function')h+=thanksHtml();
  if(NPCS.length)h+='<section class="panel stack"><span class="eyebrow">'+esc(t('villagers'))+'</span><div class="npcs">'+NPCS.map(function(n){return '<div class="npc"><div class="face" style="background:'+n.color+'">'+esc(n.name.charAt(0))+'</div><div style="min-width:0;flex:1"><b>'+esc(n.name)+'</b><small>'+esc(tx(n.role))+'</small></div><button class="btn sm sec" data-act="talk" data-id="'+esc(n.id)+'">'+esc(t('talk'))+'</button></div>'}).join('')+'</div></section>';
  return h};

function zoneArt(z,i){var sky='linear-gradient(160deg,'+z.sky[0]+','+z.sky[1]+')';
  return '<div class="zone-art" style="background:'+sky+'">'+zoneScene(z,i)+'<div class="zart-shade"></div><div class="zart-txt"><span class="eyebrow">Zone '+(i+1)+'</span><h2>'+esc(tx(z.names))+'</h2><p>'+esc(tx(z.desc))+'</p></div></div>'}
VIEW.map=function(){return ZONES.map(function(z,i){var open=zoneOpen(i);var h='<section class="zone'+(open?'':' locked')+'">'+zoneArt(z,i);
  if(!open)h+='<div class="lockmsg">'+ICON.lock.replace('<svg','<svg width="14" height="14"')+esc(t('unlockz'))+'</div>';
  h+='<div class="zone-nodes">';z.units.forEach(function(u,j){var nw=WORDS.filter(function(w){return w.u===u}).length;var can=open&&nw>0&&(j===0||unitStars(z.units[j-1])>0);var stz=unitStars(u);
    h+='<button class="node" data-act="lesson" data-id="'+esc(u)+'" data-z="'+i+'"'+(can?'':' disabled')+'><span class="k">'+esc(t('lesson'))+' '+(j+1)+'</span><b>'+esc(tx(UNITS[u]))+'</b>'+
     (can?stars(stz)+(S.prog[u]?'<small class="mut num">'+S.prog[u].best+'%</small>':''):'<small class="mut">'+esc(!nw?t('nowords'):open?t('unlocku'):t('locked'))+'</small>')+'</button>'});
  var bcan=open&&z.units.length&&zoneWords(z).length&&z.units.every(function(u){return unitStars(u)>0||!WORDS.some(function(w){return w.u===u})}),bw=bossWins(z.id);
  h+='<button class="node" data-act="boss" data-id="'+i+'"'+(bcan?'':' disabled')+' style="'+(bcan?'border-color:'+z.boss.color:'')+'"><span class="k">'+esc(t('boss'))+'</span><b>'+esc(z.boss.pic)+' '+esc(tx(z.boss.names))+'</b><small class="mut">'+esc(bw?t('defeated')+' ×'+bw:bcan?'HP '+z.boss.hp:t('unlockb'))+'</small></button>';
  return h+'</div></section>'}).join('')};

function picHtml(p,size){return isNumPic(p)?'<span style="font-family:var(--f-display);font-size:'+(size||72)+'px">'+esc(p)+'</span>':esc(p)}
function promptHtml(q){if(q.type==='mcq')return mcqPrompt(q);if(isProd(q))return prodPrompt(q);var w=q.w,h='<div class="prompt">';
  if(q.type==='pic'){h+='<div class="ask">'+esc(t('q_pic'))+' '+langTag(q.to)+'</div><div class="pic" aria-hidden="true">'+picHtml(w.pic)+'</div><span class="sr">'+esc(w.en)+'</span>'}
  else if(q.type==='listen'){h+='<div class="ask">'+esc(t('q_listen'))+' '+langTag(q.from)+'</div><button class="btn big" data-act="speak" data-t="'+esc(w[q.from])+'" data-l="'+q.from+'">'+ICON.speak.replace('<svg','<svg width="22" height="22"')+esc(t('playagain'))+'</button>'}
  else if(q.type==='py'){h+='<div class="ask">'+esc(t('q_py'))+'</div><div class="big han">'+esc(w.zh)+'</div>'}
  else{var f=q.from;h+='<div class="ask">'+esc(q.type==='han'?t('q_han'):t('q_mean'))+' '+langTag(f)+' → '+langTag(q.to)+'</div><div class="big'+(f==='zh'?' han':'')+'">'+esc(w[f])+'</div>'+(f==='zh'&&S.set.py&&w.py?'<div class="py">'+esc(w.py)+'</div>':'')+
    (hasVoice(f)?'<button class="btn sec sm" data-act="speak" data-t="'+esc(w[f])+'" data-l="'+f+'">'+ICON.speak.replace('<svg','<svg width="16" height="16"')+LLABEL[f]+'</button>':'')}
  return h+'</div>'}
function optsHtml(q,picked){if(q.type==='mcq')return mcqOpts(q,picked);return '<div class="opts" role="group">'+q.opts.map(function(o,i){var cls='opt';if(picked!==null){if(i===q.ans)cls+=' right';else if(i===picked)cls+=' wrong'}
  return '<button class="'+cls+'" data-act="ans" data-id="'+i+'"'+(picked!==null?' disabled':'')+'>'+optLabel(o,q.to)+'</button>'}).join('')+'</div>'}
function fbHtml(s,q,last){if(s.picked===null)return '';var ok=s.lastOk,w=q.w;
  var full='<div class="grow"><div><b>'+esc(s.timedOut?t('timeup'):ok?t('right'):t('wrong'))+'</b>'+(s.kind==='boss'&&ok?' <span class="combo num">−'+s.lastDmg+' HP'+(s.combo>=2?' · '+esc(t('combo'))+' ×'+s.combo:'')+'</span>':'')+(s.kind==='boss'&&!ok&&s.shielded?' <span class="combo">'+esc(t('shield'))+'!</span>':'')+'</div>'+
   '<div class="wl" style="flex-wrap:wrap;gap:6px 12px;margin-top:4px">'+(w.pic&&!isNumPic(w.pic)?'<span style="font-size:22px">'+esc(w.pic)+'</span>':'')+LANGS.map(function(l){return '<span class="row" style="gap:4px">'+langTag(l)+'<span'+(l==='zh'?' class="han"':'')+'>'+esc(w[l])+'</span>'+(l==='zh'&&w.py?'<small class="lt-zh">'+esc(w.py)+'</small>':'')+(hasVoice(l)?spkBtn(w[l],l):'')+'</span>'}).join('')+'</div></div>';
  full=full.replace('<div class="grow">','<div class="grow">'+prodFb(q));
  return '<div class="fb '+(ok?'ok':'ng')+'" role="status">'+full+'<button class="btn" data-act="next" id="nextbtn">'+esc(last?t('finish'):t('next'))+'</button></div>'}
function learnHtml(s){return '<div class="qwrap" style="max-width:none"><div class="row" style="justify-content:space-between"><div><span class="eyebrow">'+esc(t('newwords'))+'</span><h1 style="font-size:26px">'+esc(tx(UNITS[s.unit]))+'</h1><small class="mut">'+esc(t('tapspeak'))+'</small></div>'+
  '<button class="btn big" data-act="beginquiz">'+esc(t('startquiz'))+'</button></div><div class="wgrid">'+s.words.map(function(w){
  return '<div class="wcard"><div class="pic" aria-hidden="true">'+picHtml(w.pic,34)+'</div>'+
   LANGS.map(function(l){return '<div class="wl">'+langTag(l)+'<span class="w'+(l==='zh'?' han':'')+'">'+esc(w[l])+(l==='zh'&&w.py?' <span class="py">'+esc(w.py)+'</span>':'')+'</span>'+spkBtn(w[l],l)+'</div>'}).join('')+'</div>'}).join('')+
  '</div><div class="row" style="justify-content:flex-end"><button class="btn big" data-act="beginquiz">'+esc(t('startquiz'))+'</button></div></div>'}
function rewardList(g){if(!g||!g.lines.length)return '';var agg={};g.lines.forEach(function(l){agg[l[0]]=(agg[l[0]]||0)+l[1]});
  return '<div class="stack" style="gap:8px;justify-items:center"><span class="eyebrow">'+esc(t('rewards'))+'</span><div class="rewards">'+['exp','coin','gems','tickets'].filter(function(k){return agg[k]}).map(function(k){return resPill(k,'+'+agg[k])}).join('')+'</div>'+
  (g.ups.length?'<div class="lvburst" aria-hidden="true"></div><div class="lvl lvpop" style="font-size:18px">'+esc(t('levelup'))+' '+esc(t('lv'))+' '+g.ups[g.ups.length-1]+'</div>':'')+'</div>'}
function resultHtml(s){var g=s.grant,title,sub='';
  if(s.kind==='boss')title=s.win?t('win'):t('lose');else if(s.kind==='review')title=t('result');else{title=s.stars>0?t('pass'):t('fail');if(!s.stars)sub=t('needpct')+' '+CFG.passPct+'%'}
  var z=s.zi!==undefined?ZONES[s.zi]:null;
  var h='<div class="qwrap"><section class="panel stack" style="text-align:center;justify-items:center;gap:14px">';
  if(s.kind==='boss'&&z)h+='<div class="boss-orb" style="--bc:'+z.boss.color+';'+(s.win?'filter:grayscale(1);opacity:.6':'')+'">'+esc(z.boss.pic)+'</div>';
  else if(s.stars>=0)h+='<div style="font-size:40px">'+stars(s.stars)+'</div>';
  h+='<h1 style="font-size:32px">'+esc(title)+'</h1>';
  if(s.newTitle)h+='<div class="tt-new"><b>🏅 '+esc(t('tt_new'))+'</b>'+titleBadge(s.newTitle,260)+'</div>';
  if(s.kind!=='boss')h+='<div class="num" style="font-size:18px">'+esc(t('score'))+' '+s.ok+'/'+s.qs.length+' · '+s.pct+'%</div>';
  if(sub)h+='<p class="mut" style="margin:0">'+esc(sub)+'</p>';
  h+=rewardList(g)+'<div class="row" style="justify-content:center">';
  if(s.kind==='lesson')h+='<button class="btn sec" data-act="lesson" data-id="'+esc(s.unit)+'" data-z="'+s.zi+'">'+esc(t('retry'))+'</button><button class="btn" data-act="go" data-id="map">'+esc(t('tomap'))+'</button>';
  else if(s.kind==='boss')h+=(s.win?'':'<button class="btn sec" data-act="boss" data-id="'+s.zi+'">'+esc(t('retry'))+'</button>')+'<button class="btn" data-act="go" data-id="map">'+esc(t('tomap'))+'</button>';
  else h+='<button class="btn" data-act="go" data-id="home">'+esc(t('home'))+'</button>';
  return h+'</div></section></div>'}
VIEW.play=function(){var s=UI.sess;if(!s){UI.scr='map';return VIEW.map()}
  if(s.phase==='result')return resultHtml(s);
  if(s.kind==='lesson'&&s.phase==='learn')return learnHtml(s);
  if(s.kind==='boss'){var z=ZONES[s.zi];if(!z){UI.sess=null;UI.scr='map';return VIEW.map()}
    if(s.phase==='intro')return '<div class="qwrap"><section class="panel stack" style="text-align:center;justify-items:center;gap:14px"><span class="eyebrow">'+esc(tx(z.names))+'</span><div class="boss-orb" style="--bc:'+z.boss.color+'">'+esc(z.boss.pic)+'</div><h1 style="font-size:30px">'+esc(tx(z.boss.names))+'</h1>'+
      '<p class="mut" style="margin:0">'+esc(t('bossintro'))+'</p><div class="sub" style="text-align:left;width:100%"><b>'+esc(t('perk'))+' · '+esc(tx(CLASSES[S.cls].names))+'</b><div class="mut">'+esc(tx(CLASSES[S.cls].perk))+'</div></div>'+
      '<div class="row" style="justify-content:center"><button class="btn sec" data-act="go" data-id="map">'+esc(t('quit'))+'</button><button class="btn big" data-act="beginfight">'+esc(t('fight'))+'</button></div></section></div>';
    var q=s.q,hh='';for(var i=0;i<CFG.bossHearts;i++)hh+=i<s.hearts?'❤':'<span class="off">❤</span>';
    var fx=s.picked!==null?(s.lastOk?' atk atk-'+S.cls:' ouch'):'';
    return '<div class="qwrap"><div class="arena">'+(s.picked!==null&&s.lastOk?'<span class="fx fx-'+S.cls+'" aria-hidden="true"></span>':'')+'<div class="fighter"><div class="av'+fx+'">'+avatar(S,{label:S.name,anim:true})+'</div><div class="hearts" aria-label="'+s.hearts+' / '+CFG.bossHearts+'">'+hh+(s.shield?' 🛡':'')+'</div><small class="mut">'+esc(S.name)+'</small></div>'+
      '<div class="vs">VS</div><div class="fighter" style="position:relative"><div class="boss-orb'+(s.picked!==null?(s.lastOk?' hit':' lunge'):'')+'" style="--bc:'+z.boss.color+'">'+esc(z.boss.pic)+'</div><div class="hpbar" role="progressbar" aria-label="'+esc(tx(z.boss.names))+' HP" aria-valuemin="0" aria-valuemax="'+s.max+'" aria-valuenow="'+s.hp+'"><i style="width:'+(s.hp/s.max*100)+'%"></i></div><small class="num">'+esc(tx(z.boss.names))+' · '+s.hp+'/'+s.max+'</small>'+(s.picked!==null&&s.lastOk?'<span class="dmg" style="top:10px">−'+s.lastDmg+'</span>':'')+'</div></div>'+
      (s.deadline&&s.picked===null?'<div class="timer" aria-hidden="true"><i id="timerbar"></i></div>':'')+
      '<section class="panel'+(s.picked!==null&&!s.lastOk?' shake':'')+'">'+promptHtml(q)+optsHtml(q,s.picked)+'</section>'+fbHtml(s,q,s.over)+'<div class="row"><button class="btn sec sm" data-act="go" data-id="map">'+ICON.back.replace('<svg','<svg width="16" height="16"')+esc(t('quit'))+'</button>'+(s.combo>=2?'<span class="combo num">'+esc(t('combo'))+' ×'+s.combo+'</span>':'')+'</div></div>'}
  var q2=s.qs[s.i],n=s.qs.length,dn=s.i+(s.picked!==null?1:0);
  return '<div class="qwrap"><div class="qtop"><button class="icbtn" data-act="go" data-id="'+(s.kind==='review'?'home':'map')+'" aria-label="'+esc(t('quit'))+'">'+ICON.back+'</button><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+n+'" aria-valuenow="'+dn+'"><i style="width:'+(dn/n*100)+'%"></i></div><span class="num mut">'+(s.i+1)+'/'+n+'</span></div>'+
   '<section class="panel">'+promptHtml(q2)+(isProd(q2)?prodHtml(q2,s):optsHtml(q2,s.picked))+'</section>'+fbHtml(s,q2,s.i===n-1)+'</div>'};

function rewardPills(r){return ['exp','coin','gems','tickets'].filter(function(k){return r[k]}).map(function(k){return resPill(k,'+'+r[k])}).join('')}
VIEW.quest=function(){rollDaily();
  var h='<section class="panel"><div class="row" style="justify-content:space-between"><h1 style="font-size:24px">'+esc(t('dailyq'))+'</h1><small class="mut">'+esc(t('resetdaily'))+'</small></div>';
  DAILY.forEach(function(d){var p=Math.min(d.goal,S.daily.p[d.key]||0),done=p>=d.goal,cl=S.daily.c[d.id];
    h+='<div class="quest"><div class="stack" style="gap:4px"><b>'+esc(tx(d.names))+'</b><div class="row" style="gap:6px">'+rewardPills(d.reward)+'</div><div class="bar"><i style="width:'+(p/d.goal*100)+'%"></i></div></div>'+
    (cl?'<span class="mut">'+esc(t('claimed'))+'</span>':'<button class="btn sm'+(done?' gold':' sec')+'" data-act="claimd" data-id="'+esc(d.id)+'"'+(done?'':' disabled')+'>'+esc(done?t('claim'):p+'/'+d.goal)+'</button>')+'</div>'});
  if(DAILY.length)h+='<div class="sub row" style="justify-content:space-between;margin-top:10px"><span>'+esc(t('alldaily'))+'</span><span class="row" style="gap:6px">'+rewardPills({tickets:CFG.dailyBonusTickets,gems:CFG.dailyBonusGems})+(S.daily.bonus?' <span class="mut">'+esc(t('claimed'))+'</span>':'')+'</span></div>';
  h+='</section>';
  if(WEEKLY.length){var WQ=curWQ();h+='<section class="panel"><div class="row" style="justify-content:space-between"><h2 style="font-size:24px">📅 '+esc(t('weeklyq'))+'</h2><small class="mut">'+esc(t('resetweekly'))+'</small></div>';
    WEEKLY.forEach(function(d){var p=Math.min(d.goal,WQ.p[d.key]||0),done=p>=d.goal,cl=WQ.c[d.id];
      h+='<div class="quest"><div class="stack" style="gap:4px"><b>'+esc(tx(d.names))+'</b><div class="row" style="gap:6px">'+rewardPills(d.reward)+'</div><div class="bar"><i style="width:'+(p/d.goal*100)+'%"></i></div></div>'+
      (cl?'<span class="mut">'+esc(t('claimed'))+'</span>':'<button class="btn sm'+(done?' gold':' sec')+'" data-act="claimw" data-id="'+esc(d.id)+'"'+(done?'':' disabled')+'>'+esc(done?t('claim'):p+'/'+d.goal)+'</button>')+'</div>'});
    h+='</section>'}
  h+='<section class="panel"><h2 style="font-size:24px;margin-bottom:6px">'+esc(t('story'))+'</h2>';
  STORY.forEach(function(q){var st=storyState(q);h+='<div class="quest"><div class="stack" style="gap:4px"><b>'+esc(tx(q.names))+'</b><small class="mut">'+esc(tx(q.how))+'</small><div class="row" style="gap:6px">'+rewardPills(q.reward)+'</div></div>'+
    (st==='claimed'?'<span class="mut">'+esc(t('claimed'))+'</span>':st==='ready'?'<button class="btn sm gold" data-act="claims" data-id="'+esc(q.id)+'">'+esc(t('claim'))+'</button>':'<span class="mut">'+esc(t('inprog'))+'</span>')+'</div>'});
  return h+'</section>'};

function itemCard(it,o){o=o||{};var q=S.owned[it.id]||0;var on=o.eq;
  return '<button class="item r-'+it.rar+(o.lock?' locked':'')+'" data-act="'+(o.act||'equip')+'" data-id="'+esc(it.id)+'"'+(o.src?' data-src="'+o.src+'"':'')+' aria-pressed="'+(on?'true':'false')+'"'+(o.dis?' disabled':'')+'>'+
   '<span class="thumb">'+itemThumb(it)+'</span>'+(on?'<span class="eqb">'+esc(t('equipped'))+'</span>':'')+(q>1&&!o.noQty?'<span class="qty num">×'+q+'</span>':'')+
   '<span class="nm">'+esc(tx(it.names))+'</span><span class="mt"><span class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span> · '+esc(tx(CAT[it.cat].names))+(it.cat==='accessories'?' · '+esc(tx(SLOT_NAMES[slotOf(it)])):'')+(it.cat==='pet'&&PET_ORIGIN[it.v.k]?' · 🌏 '+esc(tx(PET_ORIGIN[it.v.k])):'')+'</span>'+(o.extra||'')+'</button>'}
VIEW.wd=function(){var cats=CATS.filter(function(c){return ITEMS.some(function(i){return i.cat===c.id&&S.owned[i.id]})});
  var list=ITEMS.filter(function(i){return S.owned[i.id]>0&&(UI.cat==='all'||i.cat===UI.cat)}).sort(function(a,b){return RAR[b.rar].order-RAR[a.rar].order});
  var worn=Object.keys(S.eq).map(function(k){return ITEM[S.eq[k]]}).filter(Boolean);
  var h='<div class="cols wdcols"><section class="panel stack" style="justify-items:center;align-self:start"><div class="stagebox" style="width:240px">'+avatar(S,{label:S.name,anim:true})+stageFrame(S)+'</div>'+
   '<b style="font-family:var(--f-display);font-size:20px;font-weight:500">'+esc(S.name)+'</b><small class="mut" style="text-align:center">'+esc(t('nostats'))+'</small>'+
   '<div class="stack" style="width:100%;gap:6px">'+worn.map(function(it){var lockSlot=it.cat==='hair'||(it.cat==='outfit'&&STARTERS[S.gender].indexOf(it.id)>=0);
     return '<div class="row" style="justify-content:space-between;font-size:13px"><span><span class="rtxt r-'+it.rar+'">●</span> '+esc(tx(it.names))+'</span>'+(lockSlot?'':'<button class="btn sm sec" data-act="uneq" data-id="'+slotOf(it)+'">'+esc(t('unequip'))+'</button>')+'</div>'}).join('')+'</div></section>'+
   '<section class="panel stack"><div class="row" style="justify-content:space-between"><h1 style="font-size:24px;margin:0">'+esc(t('n_wd'))+'</h1><span class="row" style="gap:6px"><button class="btn sm '+(UI.manage?'':'sec')+'" data-act="wdmanage" aria-pressed="'+!!UI.manage+'">🛠 '+esc(t('mk_manage'))+'</button>'+(CL.uid&&tradeOn()?'<button class="btn sm sec" data-act="go" data-id="market">🔁 '+esc(t('mk_title'))+'</button>':'')+'</span></div>'+(UI.manage?'<div class="notice" style="display:block">'+esc(t('mk_managehint'))+'</div>':'')+'<div class="tabs" role="group"><button data-act="cat" data-id="all" aria-pressed="'+(UI.cat==='all')+'">'+esc(t('all'))+'</button>'+
   cats.map(function(c){return '<button data-act="cat" data-id="'+c.id+'" aria-pressed="'+(UI.cat===c.id)+'">'+esc(tx(c.names))+'</button>'}).join('')+'</div>';
  if(!list.length)h+='<div class="empty">'+esc(t('noitems'))+'</div>';
  else h+='<div class="igrid">'+list.map(function(it){var bad=!canEquip(it.id),wc=slotOf(it)==='weapon'?weaponClass(it.v.k):null;var why=wc&&wc!==S.cls?t('forcls')+' '+tx(CLASSES[wc].names):t('wrongg');var clsLock=bad&&wc&&wc!==S.cls&&!(it.g&&it.g!==S.gender);if(UI.manage)return itemCard(it,{eq:S.eq[slotOf(it)]===it.id,act:'itemmenu',extra:'<small class="wlock" style="color:var(--accent)">🛠 '+esc(t('mk_tapmanage'))+'</small>'});return itemCard(it,{eq:S.eq[slotOf(it)]===it.id,dis:bad&&!clsLock,act:clsLock?'wpnlock':null,lock:clsLock,extra:bad?'<small class="wlock">🔒 '+esc(why)+(clsLock?' · '+esc(t('wl_tap')):'')+'</small>':''})}).join('')+'</div>';
  return h+'</section></div>'};

VIEW.gacha=function(){if(!BANNERS.length)return '<section class="panel empty">'+esc(t('nobanner'))+'</section>';
  var b=BANNERS.filter(function(x){return x.id===UI.banner})[0]||BANNERS[0];UI.banner=b.id;var br=bannerRates(b),g=S.gacha[b.id]||{soft:0,hard:0};
  var h='<div class="tabs" role="group">'+BANNERS.map(function(x){return '<button data-act="banner" data-id="'+esc(x.id)+'" aria-pressed="'+(x.id===b.id)+'">'+esc(tx(x.names))+'</button>'}).join('')+'</div>';
  h+='<section class="banner" style="background:linear-gradient(135deg,'+b.c[0]+','+b.c[1]+')"><div class="feat">'+itemThumb(ITEM[b.feat])+'</div><span class="eyebrow" style="color:#fff;opacity:.85">'+esc(t('n_gacha'))+'</span><h1 style="font-size:28px;text-shadow:0 2px 12px rgba(0,0,0,.4)">'+esc(tx(b.names))+'</h1><p style="margin:0;max-width:60%;opacity:.92">'+esc(tx(b.sub))+'</p></section>';
  h+='<section class="panel cta"><div class="stack" style="gap:2px"><div class="row">'+resPill('tickets',S.tickets)+'</div><small class="mut">'+esc(t('ticketonly'))+'</small><small class="mut">📊 '+esc(t('rate_see'))+'</small></div><div class="row"><button class="btn" data-act="pull" data-id="1"'+(S.tickets>=1?'':' disabled')+'>'+esc(t('pull1'))+'</button><button class="btn gold" data-act="pull" data-id="10"'+(S.tickets>=10?'':' disabled')+'>'+esc(t('pull10'))+'</button></div></section>';
  h+='<div class="cols"><section class="panel stack"><h2 style="font-size:20px">'+esc(t('rates'))+'</h2><div class="tblwrap"><table><thead><tr><th>'+esc(t('all'))+'</th><th class="num">%</th><th class="num">'+esc(t('rate_each'))+'</th><th>Items</th></tr></thead><tbody>'+
   RARITY.filter(function(r){return br.byR[r.code]}).slice().reverse().map(function(r){return '<tr><td><span class="rtxt r-'+r.code+'">'+esc(tx(r.names))+'</span></td><td class="num">'+(br.rates[r.code]*100).toFixed(2)+'%</td><td class="num">'+(br.rates[r.code]*100/br.byR[r.code].length).toFixed(2)+'%</td><td>'+br.byR[r.code].map(function(id){return esc(tx(ITEM[id].names))}).join(', ')+'</td></tr>'}).join('')+'</tbody></table></div></section>';
  var hist=S.hist.filter(function(x){return x.b===b.id&&ITEM[x.id]});
  h+='<section class="panel stack"><h2 style="font-size:20px">'+esc(t('pity'))+'</h2><div class="sub stack" style="gap:4px"><span>'+esc(t('pity1'))+' '+CFG.softPity+' '+esc(t('times'))+'</span><span>'+esc(t('pity2'))+' '+CFG.hardPity+' '+esc(t('times'))+'</span></div>'+
   '<div class="stack" style="gap:4px"><small class="mut">'+esc(t('pitycount'))+'</small><div class="bar"><i style="width:'+Math.min(100,g.hard/CFG.hardPity*100)+'%"></i></div><small class="num">'+g.hard+' / '+CFG.hardPity+'</small></div>'+
   '<h2 style="font-size:20px">'+esc(t('history'))+'</h2>'+(hist.length?'<div class="tblwrap" style="max-height:220px;overflow-y:auto"><table><tbody>'+hist.slice(0,30).map(function(x){var it=ITEM[x.id];
    return '<tr><td><span class="rtxt r-'+it.rar+'">'+esc(tx(it.names))+'</span></td><td class="mut num" style="text-align:right">'+new Date(x.t).toLocaleDateString()+'</td></tr>'}).join('')+'</tbody></table></div>':'<div class="mut">—</div>')+'</section></div>';
  return h};

function shopCard(coin,src){return function(e){var it=ITEM[e.item],own=S.owned[e.item]||0;return itemCard(it,{act:'buy',src:src,noQty:true,extra:'<span class="row" style="justify-content:space-between;gap:4px">'+resPill(coin?'coin':'gems',e.price)+(own?'<small class="mut">'+esc(t('owned'))+' ×'+own+'</small>':'')+'</span>'})}}
function dsHead(){var ms=msToBkkMidnight(),h=Math.floor(ms/36e5),mi=Math.floor(ms%36e5/6e4);return '<div class="ds-head"><b>🎲 '+esc(t('ds_head'))+'</b><small class="mut" id="ds_clock">⏰ '+esc(t('ds_reset').replace('{h}',h).replace('{m}',mi))+'</small></div>'}
/* keep the countdown fresh and swap the list at midnight */
var DS_DAY=null;setInterval(function(){if(UI.scr!=='shop'||!CFG.dsOn)return;var d=bkkDay();if(DS_DAY&&d!==DS_DAY){DS_DAY=d;if(UI.modal&&UI.modal.kind==='buy')UI.modal=null;softRender();return}DS_DAY=d;var el=document.getElementById('ds_clock');if(el){var ms=msToBkkMidnight();el.textContent='⏰ '+t('ds_reset').replace('{h}',Math.floor(ms/36e5)).replace('{m}',Math.floor(ms%36e5/6e4))}},20000);
VIEW.shop=function(){if(UI.shop==='ex'&&CFG.exOn===0)UI.shop='coin';var coin=UI.shop==='coin',list=shopList(coin?'coin':'gem'),bal=coin?S.coin:S.gems;
  var h='<div class="tabs wrap" role="group"><button data-act="shoptab" data-id="coin" aria-pressed="'+coin+'">🪙 '+esc(t('coinshop'))+'</button><button data-act="shoptab" data-id="gem" aria-pressed="'+(UI.shop==='gem')+'">💎 '+esc(t('gemshop'))+'</button>'+
   (CFG.exOn!==0?'<button data-act="shoptab" data-id="ex" aria-pressed="'+(UI.shop==='ex')+'">🔄 '+esc(t('ex_tab'))+'</button>':'')+'<button data-act="shoptab" data-id="topup" aria-pressed="'+(UI.shop==='topup')+'">➕ '+esc(t('tp_title'))+'</button></div>';
  if(UI.shop==='topup')return h+topupView();if(UI.shop==='ex')return h+exView();
  h+='<section class="panel stack"><div class="row" style="justify-content:space-between"><h1 style="font-size:24px">'+esc(coin?t('coinshop'):t('gemshop'))+'</h1>'+resPill(coin?'coin':'gems',bal)+'</div>'+(coin?'':'<small class="mut">'+esc(t('gemnote'))+'</small>')+
   (CFG.dsOn&&pinnedList(coin?'coin':'gem').length?'<h3 class="ds-rar">'+esc(t('ds_pin'))+'</h3><div class="igrid">'+pinnedList(coin?'coin':'gem').map(shopCard(coin,'pin')).join('')+'</div>':'')+
   (CFG.dsOn?dsHead():'')+(list.length&&CFG.dsOn?DS_RARS.slice().reverse().map(function(r){var g=list.filter(function(e){return e.rar===r&&ITEM[e.item]});if(!g.length)return '';return '<h3 class="ds-rar r-'+r+'">'+esc(tx(RAR[r].names))+'</h3><div class="igrid">'+g.map(shopCard(coin)).join('')+'</div>'}).join(''):'')+
   (CFG.dsOn?'':list.length?'<div class="igrid">'+list.map(function(e){var it=ITEM[e.item],own=S.owned[e.item]||0;
    return itemCard(it,{act:'buy',noQty:true,extra:'<span class="row" style="justify-content:space-between;gap:4px">'+resPill(coin?'coin':'gems',e.price)+(own?'<small class="mut">'+esc(t('owned'))+' ×'+own+'</small>':'')+'</span>'})}).join('')+'</div>':'<div class="empty">—</div>')+'</section>';
  return h};

/* profile hero: EXP bar + streak flame, three language rings, a 3-slot showcase */
var MP_COL={th:'#1f9d6a',en:'#2f6fe0',zh:'#e0453a'};
function mpRing(l){var p=accPct(l),v=p||0,r=30,c=2*Math.PI*r,id='mpr'+l;
  return '<div class="mp-ring" style="--c:'+MP_COL[l]+'"><svg viewBox="0 0 80 80" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".35" stop-color="'+MP_COL[l]+'"/><stop offset="1" stop-color="'+MP_COL[l]+'"/></linearGradient></defs>'+
   '<circle cx="40" cy="40" r="'+r+'" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-width="7"/>'+
   '<circle class="mp-arc" cx="40" cy="40" r="'+r+'" fill="none" stroke="url(#'+id+')" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+(c*v/100).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 40 40)"/>'+
   (v>=80?'<circle cx="40" cy="40" r="'+(r+6)+'" fill="none" stroke="'+MP_COL[l]+'" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="2 6" class="mp-orbit"/>':'')+'</svg>'+
   '<div class="mp-rv"><b class="num">'+(p===null?'—':p+'%')+'</b><small>'+LLABEL[l]+'</small></div></div>'}
function mpFlame(n){var tier=n>=14?'gold':n>=7?'violet':n>=3?'blue':'orange';return '<span class="mp-flame f-'+tier+'" title="'+esc(t('mp_streak').replace('{n}',n))+'"><span class="mp-fl" aria-hidden="true">🔥</span><b class="num">'+n+'</b><small>'+esc(t('mp_streak').replace('{n}',n).replace(/^[^0-9]*\d+\s*/,''))+'</small></span>'}
function mpShow(){var sh=S.show||[];return '<div class="mp-show">'+[0,1,2].map(function(i){var id=sh[i],it=id&&S.owned[id]&&ITEM[id];
  return it?'<button class="mp-slot r-'+it.rar+'" data-act="mppin" data-id="'+i+'" aria-label="'+esc(tx(it.names))+'"><span class="thumb">'+itemThumb(it)+'</span><small class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</small></button>'
   :'<button class="mp-slot empty" data-act="mppin" data-id="'+i+'"><span aria-hidden="true">＋</span><small>'+esc(t('mp_pin'))+'</small></button>'}).join('')+'</div>'}
function mpHero(){var need=expNeed(S.lvl),ex=Math.min(S.exp,need),pct=Math.round(ex/need*100);
  return '<section class="panel mp-hero"><div class="stagebox">'+avatar(S,{label:S.name,anim:true})+stageFrame(S)+'</div><div class="mp-side">'+
   '<div class="mp-top"><div class="stack" style="gap:2px;min-width:0"><div class="lvl">'+esc(t('lv'))+' '+S.lvl+' · '+esc(tx(CLASSES[S.cls].names))+'</div><h1 class="name">'+esc(S.name)+'</h1>'+vpChips()+'</div>'+mpFlame(S.streak.days||0)+'</div>'+
   '<div class="mp-exp"><div class="mp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+need+'" aria-valuenow="'+ex+'"><i style="width:'+pct+'%"></i></div><div class="row" style="justify-content:space-between"><small class="num">EXP '+ex+' / '+need+'</small><small>'+esc(t('mp_next').replace('{n}',need-ex).replace('{l}',S.lvl+1))+'</small></div></div>'+
   '<div class="mp-row"><div class="mp-sec"><span class="eyebrow">✨ '+esc(t('mp_power'))+'</span><div class="mp-rings">'+LANGS.map(mpRing).join('')+'</div></div>'+
   '<div class="mp-sec"><span class="eyebrow">🏆 '+esc(t('mp_show'))+'</span>'+mpShow()+'</div></div>'+
   '<div class="row"><button class="btn sec sm" data-act="editchar">'+esc(t('class_change'))+'</button></div></div></section>'}
VIEW.me=function(){var h=mpHero()+vipSection();if(typeof skList==='function')h+='<section class="panel row sk-mecard" style="justify-content:space-between;gap:10px;flex-wrap:wrap"><div class="stack" style="gap:4px"><b>🌟 '+esc(t('sk_title'))+'</b><small class="mut">'+esc(t('sk_sub'))+'</small></div><span class="row" style="gap:6px">'+skList(S.cls).map(function(id){var lv=skCurLv(id);return '<span class="sk-mini">'+skIcon(id,40,!lv)+'<small>'+(lv?'Lv.'+lv:'🔒'+SK_DEF[id].u)+'</small></span>'}).join('')+'</span><button class="btn sm gold" data-act="skills">'+esc(t('sk_open'))+'</button></section>';
  h+='<section class="panel stack"><h2 style="font-size:22px">'+esc(t('progress'))+'</h2><div class="statgrid">'+
   [[learnedCount()+'/'+WORDS.length,'wordsl'],[masteredCount(),'mastered'],[S.streak.days,'streak'],[ZONES.filter(function(z){return bossWins(z.id)>0}).length+'/'+ZONES.length,'bossw']].map(function(x){return '<div class="stat"><div class="v">'+x[0]+'</div><div class="l">'+esc(t(x[1]))+'</div></div>'}).join('')+'</div>'+
   '<b>'+esc(t('bylang'))+'</b><div class="stack" style="gap:8px">'+LANGS.map(function(l){var p=accPct(l);return '<div class="lgbar lt-'+l+'">'+langTag(l)+'<div class="bar"><i style="width:'+(p||0)+'%"></i></div><span class="num" style="color:var(--fg)">'+(p===null?'—':p+'%')+'</span></div>'}).join('')+'</div></section>';
  h+=titlesPanel();
  h+='<div class="cols"><section class="panel stack"><h2 style="font-size:22px">'+esc(t('settings'))+'</h2><div>'+
   '<div class="toggle"><span>'+esc(t('learnlangs'))+'</span><span class="row" style="gap:4px">'+LANGS.map(function(l){return '<button class="btn sec sm" data-act="target" data-id="'+l+'" aria-pressed="'+(S.set.targets.indexOf(l)>=0)+'">'+LLABEL[l]+'</button>'}).join('')+'</span></div>'+
   sw('py','s_py')+sw('sound','s_sound')+sw('timer','s_timer')+sw('motion','s_motion')+sw('ptype','s_ptype')+sw('porder','s_porder')+(srAvail()?sw('pspeak','s_pspeak'):'')+
   '<div class="toggle"><span>'+esc(t('s_speed'))+'</span><span class="row" style="gap:4px"><button class="btn sec sm" data-act="rate" data-id="0.65" aria-pressed="'+(S.set.rate===.65)+'">'+esc(t('slow'))+'</button><button class="btn sec sm" data-act="rate" data-id="0.85" aria-pressed="'+(S.set.rate===.85)+'">'+esc(t('normal'))+'</button></span></div>'+
   '<div class="toggle"><span>'+esc(t('s_theme'))+'</span><span class="row" style="gap:4px">'+['auto','dark','light'].map(function(k){return '<button class="btn sec sm" data-act="theme" data-id="'+k+'" aria-pressed="'+(S.set.theme===k)+'">'+esc(t(k))+'</button>'}).join('')+'</span></div></div></section>';
  h+='<section class="panel stack"><h2 style="font-size:22px">'+esc(t('report'))+'</h2><small class="mut">'+esc(t('reporthint'))+'</small><textarea id="reportbox" readonly>'+esc(reportText())+'</textarea><div class="row"><button class="btn sm" data-act="copyreport">'+esc(t('copy'))+'</button></div></section></div>';
  h+=meProf()+(slOn()&&CL.uid?slChangePw():'');var cloud=CL.playerRef&&CL.status==='ok';
  h+='<section class="panel stack"><h2 style="font-size:22px">'+esc(t('account'))+'</h2><small class="mut">'+esc(cloud?t('savehintcloud'):CL.uid?t('sy_busy'):t('savehint'))+'</small>'+
   '<div class="row"><button class="btn" data-act="logoutask">🚪 '+esc(t('logout'))+'</button></div>'+
   '<details class="danger"><summary>'+esc(t('dangerzone'))+'</summary><div class="row" style="margin-top:8px">'+(UI.resetAsk?'<span>'+esc(t('resetq'))+'</span><button class="btn sm" style="background:var(--bad);color:#fff" data-act="resetyes">'+esc(t('resetyes'))+'</button><button class="btn sm sec" data-act="resetno">'+esc(t('cancel'))+'</button>':'<button class="btn sm sec" data-act="reset">'+esc(t('reset'))+'</button>')+'</div></details></section>';
  return h};
/* ---------- currency exchange (shop tab) ---------- */
function freeGems(){return Math.max(0,S.gems-Math.min(S.paid||0,S.gems))}
function exMax(to){var d=today();var tmp={ex:JSON.parse(JSON.stringify(S.ex||{}))};var room=exRoom(tmp,to,d,CFG),bal=to==='gems'?S.coin:freeGems(),rate=to==='gems'?CFG.exCoinGem:CFG.exGemTicket;return Math.max(0,Math.min(room,Math.floor(bal/rate),999))}
function doExchange(to,n){if(CFG.exOn===0||(to!=='gems'&&to!=='tickets'))return;n=int(n,1,999,1);if(n>exMax(to)){toast(t('ex_cant'));return}
  var cost=exCost(to,n,CFG);commitEv({k:'ex',to:to,n:n,cost:cost});save();sfx('buy');UI.exn={};toast('🔄 '+t('ex_done').replace('{a}',(to==='gems'?'🪙 ':'💎 ')+cost).replace('{b}',(to==='gems'?'💎 ':'🎟️ ')+n));render()}
function exCard(to){var rate=to==='gems'?CFG.exCoinGem:CFG.exGemTicket,cap=to==='gems'?CFG.exGemDay:CFG.exTicketDay,d=today(),used=S.ex&&S.ex.d===d?(to==='gems'?S.ex.g:S.ex.t):0,mx=exMax(to),n=Math.max(1,Math.min(UI.exn&&UI.exn[to]||1,Math.max(1,mx)));
  var a=to==='gems'?'coin':'gems',b=to==='gems'?'gems':'tickets';
  return '<div class="ex-card"><div class="ex-rate">'+resPill(a,rate)+'<span class="ex-arrow">➜</span>'+resPill(b,1)+'</div>'+
   '<div class="ex-row"><button class="btn sm sec" data-act="exn" data-id="'+to+'|-10" aria-label="-10">−10</button><button class="btn sm sec" data-act="exn" data-id="'+to+'|-1" aria-label="-1">−</button><b class="num ex-n">'+n+'</b><button class="btn sm sec" data-act="exn" data-id="'+to+'|1" aria-label="+1">+</button><button class="btn sm sec" data-act="exn" data-id="'+to+'|10" aria-label="+10">+10</button><button class="btn sm sec" data-act="exn" data-id="'+to+'|max">'+esc(t('ex_max'))+'</button></div>'+
   '<div class="ex-sum">'+esc(t('ex_pay'))+' '+resPill(a,n*rate)+' '+esc(t('ex_get'))+' '+resPill(b,n)+'</div>'+
   (cap?'<small class="mut">'+esc(t('ex_left').replace('{u}',used).replace('{c}',cap))+'</small>':'')+(to==='tickets'&&S.paid>0?'<small class="ex-paid">💎 '+esc(t('ex_paidnote').replace('{f}',freeGems()).replace('{p}',Math.min(S.paid,S.gems)))+'</small>':'')+
   '<button class="btn" data-act="exgo" data-id="'+to+'"'+(mx<1||n>mx?' disabled':'')+'>🔄 '+esc(t('ex_go'))+'</button>'+(mx<1?'<small class="mut">'+esc(t(cap&&used>=cap?'ex_capped':'ex_short'))+'</small>':'')+'</div>'}
function exView(){return '<section class="panel stack"><div class="row" style="justify-content:space-between"><h1 style="font-size:24px">🔄 '+esc(t('ex_tab'))+'</h1><span class="row" style="gap:6px">'+resPill('coin',S.coin)+resPill('gems',S.gems)+resPill('tickets',S.tickets)+'</span></div><small class="mut">'+esc(t('ex_how'))+'</small>'+
  '<div class="ex-grid"><div class="stack"><b>'+esc(t('ex_c2g'))+'</b>'+exCard('gems')+'</div><div class="stack"><b>'+esc(t('ex_g2t'))+'</b>'+exCard('tickets')+'</div></div></section>'}
function sw(k,label){return '<label class="toggle" for="sw_'+k+'"><span>'+esc(t(label))+'</span><input type="checkbox" class="sw" id="sw_'+k+'" data-act="sw" data-id="'+k+'"'+(S.set[k]?' checked':'')+'></label>'}

/* ---------- modals ---------- */
function showReward(title,g,items){UI.modal={kind:'reward',title:title,g:g,items:items||[]};render()}
function modalHtml(){var md=UI.modal;if(!md)return '';var b='',wide=false;var pm=(typeof prModal==='function'?prModal(md):null)||(typeof nwModal==='function'?nwModal(md):null)||(typeof pfModal==='function'?pfModal(md):null)||(typeof ckModal==='function'?ckModal(md):null)||(typeof bzModal==='function'?bzModal(md):null)||(typeof skModal==='function'?skModal(md):null);if(pm&&pm.wide)wide=true;
  if(pm)b=pm.body;else if(md.kind==='syncslow')b='<h2>⚠️ '+esc(t('sy_why'))+'</h2><div style="text-align:left;display:grid;gap:8px"><p style="margin:0">💾 '+esc(t('sy_why1'))+'</p><p style="margin:0">🔄 '+esc(t('sy_why2'))+'</p>'+(CL.admin?'<p class="mut" style="margin:0">👩‍🏫 '+esc(t('sy_why3'))+'</p>':'')+'</div><button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button>';
  else if(md.kind==='forcern')b='<span class="eyebrow">✏️</span><h2>'+esc(t('forcern_t'))+'</h2><p class="mut" style="margin:0">'+esc(t('forcern_d'))+'</p><input id="rn_in" maxlength="16" autocomplete="off" value="" placeholder="'+esc(t('hname'))+'" aria-label="'+esc(t('hname'))+'"><div id="rn_err" class="err" role="alert" style="color:var(--bad)"></div><button class="btn" data-act="forcernok">'+esc(t('ok'))+'</button>';
  else if(md.kind==='reward')b='<span class="eyebrow">'+esc(t('rewards'))+'</span><h2>'+esc(md.title)+'</h2>'+rewardList(md.g)+((md.items||[]).length?'<div class="vp-won">'+md.items.map(function(id){var it=ITEM[id];return it?'<div class="item r-'+it.rar+'"><span class="thumb">'+itemThumb(it)+'</span><span class="nm">'+esc(tx(it.names))+'</span><span class="mt rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span></div>':''}).join('')+'</div>':'')+'<button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button>';
  else if(md.kind==='mppick'){var own=Object.keys(S.owned).filter(function(id){return S.owned[id]>0&&ITEM[id]}).sort(function(x,y){return RARITY.findIndex(function(r){return r.code===ITEM[y].rar})-RARITY.findIndex(function(r){return r.code===ITEM[x].rar})});
    b='<h2>'+esc(t('mp_pick'))+'</h2>'+(own.length?'<div class="mp-pickgrid">'+own.slice(0,120).map(function(id){var it=ITEM[id];return '<button class="item r-'+it.rar+'" data-act="mppick" data-id="'+md.slot+'|'+esc(id)+'"><span class="thumb">'+itemThumb(it)+'</span><span class="nm">'+esc(tx(it.names))+'</span></button>'}).join('')+'</div>':'<p class="mut">'+esc(t('mp_none'))+'</p>')+
      '<div class="row" style="justify-content:center">'+((S.show||[])[md.slot]?'<button class="btn sec" data-act="mppick" data-id="'+md.slot+'|">'+esc(t('mp_remove'))+'</button>':'')+'<button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button></div>'}
  else if(md.kind==='pull')b='<span class="eyebrow">'+esc(t('got'))+'</span><div class="reveal"'+(md.res.length===1?' style="grid-template-columns:minmax(0,180px);justify-content:center"':'')+'>'+md.res.map(function(r,i){var it=ITEM[r.id];if(!it)return '';
    return '<div class="item r-'+it.rar+'" style="animation-delay:'+(i*.08)+'s"><span class="thumb">'+itemThumb(it)+'</span>'+(r.isNew?'<span class="eqb">'+esc(t('newi'))+'</span>':'')+'<span class="nm">'+esc(tx(it.names))+'</span><span class="mt"><span class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span>'+(r.isNew?'':' · '+esc(t('dupe')))+'</span></div>'}).join('')+'</div><button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button>';
  else if(md.kind==='logout'){if(md.busy)b='<h2>'+esc(t('logout'))+'</h2><p class="num"><span class="spin"></span> '+esc(t('lo_saving'))+'</p>';
    else if(md.err)b='<h2>'+esc(t('logout'))+'</h2><div class="notice warn" style="display:block">'+esc(t('lo_err'))+'</div><div class="row" style="justify-content:center"><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button><button class="btn" data-act="logoutgo" data-id="'+(md.clear?'1':'0')+'">'+esc(t('lo_retry'))+'</button></div>';
    else b='<h2>🚪 '+esc(t('logout'))+'</h2><p style="margin:0">'+esc(t('lo_q'))+'</p><label class="toggle" for="lo_clear" style="text-align:left"><span>'+esc(t('lo_clear'))+'<br><small class="mut">'+esc(t('lo_clearh'))+'</small></span><input type="checkbox" class="sw" id="lo_clear"'+(S.set.remember?'':' checked')+'></label>'+
      '<div class="row" style="justify-content:center"><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button><button class="btn" data-act="logoutgo">'+esc(t('logout'))+'</button></div>'}
  else if(md.kind==='itemmenu')b=itemMenu(md);
  else if(md.kind==='prof')b=profModal();
  else if(md.kind==='slip')b='<img src="'+esc(md.src)+'" alt="slip" style="max-width:100%;max-height:70vh;border-radius:12px"><button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button>';
  else if(md.kind==='wpnlock'){var wi=ITEM[md.id],wc2=wi&&weaponClass(wi.v.k);if(!wi||!CLASSES[wc2]){UI.modal=null;return ''}var cn=tx(CLASSES[wc2].names);
    b='<span class="eyebrow">🔒 '+esc(t('forcls'))+' '+esc(cn)+'</span><div class="item r-'+wi.rar+'" style="max-width:180px;margin:0 auto"><span class="thumb">'+itemThumb(wi)+'</span><span class="nm">'+esc(tx(wi.names))+'</span></div>'+
    '<p style="margin:0">'+esc(t('wl_body').replace('{c}',cn).replace('{me}',tx(CLASSES[S.cls].names)))+'</p><small class="mut">'+esc(tx(CLASSES[wc2].perk))+'</small>'+
    '<div class="row" style="justify-content:center"><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button><button class="btn" data-act="wpnswitch" data-id="'+esc(wi.id)+'">'+esc(t('wl_go').replace('{c}',cn))+'</button></div>'}
  else if(md.kind==='buy'){var it=ITEM[md.id];if(!it){UI.modal=null;return ''}b='<span class="eyebrow">'+esc(t('confirmbuy'))+'</span><div class="item r-'+it.rar+'" style="max-width:180px;margin:0 auto"><span class="thumb">'+itemThumb(it)+'</span><span class="nm">'+esc(tx(it.names))+'</span><span class="mt"><span class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span></span></div>'+
    '<div class="rewards">'+resPill(md.shop==='coin'?'coin':'gems',md.price)+'</div><div class="row" style="justify-content:center"><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button><button class="btn" data-act="confirmbuy">'+esc(t('buy'))+'</button></div>'}
  else if(md.kind==='npc'){var n=NPCS.filter(function(x){return x.id===md.id})[0];if(!n){UI.modal=null;return ''}var ln=n.line;
    b='<div style="width:64px;height:64px;border-radius:50%;margin:0 auto;display:grid;place-items:center;background:'+n.color+';color:#fff;font-family:var(--f-display);font-size:26px">'+esc(n.name.charAt(0))+'</div><h2>'+esc(n.name)+'</h2><small class="mut">'+esc(tx(n.role))+'</small>'+
     '<div class="stack" style="text-align:left;gap:10px">'+LANGS.filter(function(l){return ln[l]}).map(function(l){return '<div class="wl" style="align-items:flex-start">'+langTag(l)+'<span class="w'+(l==='zh'?' han':'')+'" style="font-size:15px;font-weight:'+(l===n.lang?600:400)+'">'+esc(ln[l])+(l==='zh'&&ln.py?'<br><span class="py">'+esc(ln.py)+'</span>':'')+'</span>'+spkBtn(ln[l],l)+'</div>'}).join('')+'</div><button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button>'}
  else if(typeof adminModal==='function'){var am=adminModal(md);if(!am)return '';b=am.body;wide=am.wide}
  return '<div class="scrim" data-act="scrim"><div class="modal'+(wide?' wide':'')+'" role="dialog" aria-modal="true" aria-label="'+esc(md.title||md.kind)+'">'+b+'</div></div>'}

var timerRAF=null,pendingRender=false;
/* someone is typing in the page or in a pop-up window: wait before redrawing */
function typing(){var a=document.activeElement,md=document.getElementById('modal');return !!(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)&&a.type!=='checkbox'&&(document.getElementById('app').contains(a)||(md&&md.contains(a))))}
/* database updates can arrive in bursts (imports, many students): coalesce them into one render */
var softQ=null;function softRender(){if(softQ)return;softQ=setTimeout(function(){softQ=null;if(typing()){pendingRender=true;return}render()},60)}
document.addEventListener('focusout',function(){if(pendingRender)setTimeout(function(){if(pendingRender&&!typing()){pendingRender=false;render()}},50)});
function render(){pendingRender=false;applyTheme();renderHeader();if(UI.scr!=='town'&&TW.in)townLeave();
  var app=document.getElementById('app'),scr=UI.scr;
  if(scr==='admin'&&!CL.admin)scr=UI.scr=S.created?'home':'title';
  if(CL.loggedOut&&scr!=='admin')scr=UI.scr='bye';
  if(!S.created&&scr!=='create'&&scr!=='admin'&&scr!=='bye')scr=UI.scr='title';
  var keepSc=scr==='town'?document.getElementById('tw_scene'):null,keepArt=scr==='title'?document.getElementById('pv_art'):null;document.body.classList.toggle('on-portal',scr==='title');
  app.classList.toggle('wide',scr==='admin');var body=(VIEW[scr]||VIEW.home)();
  app.innerHTML=(S.created&&scr!=='title'&&scr!=='create'&&scr!=='bye'?nav():(scr==='admin'?'<div class="row"><button class="btn sec sm" data-act="go" data-id="title">'+ICON.back.replace('<svg','<svg width="16" height="16"')+'TRI-LINGUA Quest</button></div>':''))+body;
  if(keepArt){var na=document.getElementById('pv_art');if(na&&na!==keepArt&&na.innerHTML.indexOf('<img')<0===keepArt.innerHTML.indexOf('<img')<0)na.replaceWith(keepArt)}
  if(keepSc){var nsc=document.getElementById('tw_scene');if(nsc&&nsc!==keepSc){keepSc.setAttribute('style',nsc.getAttribute('style'));nsc.replaceWith(keepSc)}}
  document.getElementById('modal').innerHTML=modalHtml();
  if(UI.modal){var f=document.querySelector('#modal .btn:last-of-type');if(f&&!document.querySelector('#modal input'))f.focus()}
  else{var nb=document.getElementById('nextbtn');if(nb)nb.focus()}
  cancelAnimationFrame(timerRAF);var s=UI.sess;
  if(scr==='play'&&s&&s.kind==='boss'&&s.phase==='fight'&&s.deadline&&s.picked===null)tickTimer();
  if(scr==='admin'&&typeof adminAfterRender==='function')adminAfterRender()}
function tickTimer(){var s=UI.sess,bar=document.getElementById('timerbar');if(!s||!bar||s.picked!==null)return;var left=(s.deadline-Date.now())/(CFG.bossTimer*1000);
  bar.style.transform='scaleX('+Math.max(0,left)+')';if(left<=0){timeout();return}timerRAF=requestAnimationFrame(tickTimer)}

/* ===================================================================== EVENTS */
function syncName(){var i=document.getElementById('hname');if(i&&UI.draft)UI.draft.name=i.value.slice(0,16)}
document.addEventListener('click',function(e){var el=e.target.closest('[data-act]');if(!el)return;var a=el.dataset.act,id=el.dataset.id;
  if(a==='scrim'){if(e.target===el&&!(UI.modal&&UI.modal.busy)){if(UI.modal&&(UI.modal.kind==='pull'||UI.modal.kind==='forcern'))return;/* summon results close only with the OK button, so repeated taps on the summon button never re-summon */UI.modal=null;render()}return}
  if(a.indexOf('adm')===0){adminAct(a,id,el,e);return}
  if(marketAct(a,id))return;
  if(typeof bazaarAct==='function'&&bazaarAct(a,id))return;
  if(typeof skillsAct==='function'&&skillsAct(a,id))return;
  if(townAct(a,id,el,e))return;
  if(typeof tunnelAct==='function'&&tunnelAct(a,id,el,e))return;
  if(typeof raidAct==='function'&&raidAct(a,id))return;
  if(typeof vipAct==='function'&&vipAct(a,id))return;
  if(topupAct(a,id))return;
  if(typeof thanksAct==='function'&&thanksAct(a,id))return;
  if(typeof mechaAct==='function'&&mechaAct(a,id))return;
  var sa=schoolAct(a);if(sa)return;
  if(slAct(a,id))return;
  if(titleAct(a,id))return;
  switch(a){
  case 'go':if(id==='home'&&!S.created)return;if(id==='admin'&&!CL.admin)return;go(id);break;
  case 'uilang':var old=S.set.lang;S.set.lang=id;if(!S.created&&UI.draft){UI.draft.targets=LANGS.filter(function(l){return l!==id})}
    else if(S.set.targets.length===2&&S.set.targets.indexOf(id)>=0&&S.set.targets.indexOf(old)<0){S.set.targets=LANGS.filter(function(l){return l!==id})}saveLocal();if(S.created)save();render();break;
  case 'newgame':if(cloudWait()){toast(t('cw_wait'));if(syncSlow()||CL.status==='err')UI.modal={kind:'syncslow'};render();break}UI.draft={name:'',gender:'F',cls:'mage',outfit:'sof3',targets:LANGS.filter(function(l){return l!==S.set.lang})};UI.edit=false;UI.scr='create';render();break;
  case 'dgender':syncName();UI.draft.gender=id;UI.draft.outfit=STARTERS[id][2];render();break;
  case 'dcls':syncName();UI.draft.cls=id;render();break;
  case 'dout':syncName();UI.draft.outfit=id;render();break;
  case 'dtarget':syncName();var tg=UI.draft.targets,ix=tg.indexOf(id);if(ix>=0){if(tg.length>1)tg.splice(ix,1)}else tg.push(id);render();break;
  case 'confirmcreate':if(!UI.edit&&cloudWait()){toast(t('cw_wait'));if(syncSlow()||CL.status==='err')UI.modal={kind:'syncslow'};render();break}syncName();var nm=UI.draft.name.trim();if(!nm||nm.length>16){document.getElementById('nameerr').textContent=t('needname');document.getElementById('hname').focus();return}
    var nIs=nameIssue(nm);if(nIs){document.getElementById('nameerr').textContent=t(nIs);document.getElementById('hname').focus();return}
    if(CL.uid&&!SCH.cfg.open){document.getElementById('nameerr').textContent=t('pt_closed');return}var pf=readProf(),pe=profError(pf);if(pe){document.getElementById('nameerr').textContent=t(pe);return}
    var keep=S.set,arev=S.arev;S=fresh();S.set=keep;S.arev=arev;S.set.targets=UI.draft.targets.slice();S.created=true;S.name=nm;S.gender=UI.draft.gender;S.cls=UI.draft.cls;
    var hair=S.gender==='F'?'hr3':'hr1';S.startT=Date.now();commitEv({k:'start',g:S.gender,c:S.cls,o:UI.draft.outfit,hair:hair,r:startR(CFG)});S.eq={outfit:UI.draft.outfit,hair:hair,shoes:'sh1'};setProf(pf);touchStreak();save();UI.draft=null;go(landing());break;
  case 'editchar':UI.draft={name:S.name,gender:S.gender,cls:S.cls,outfit:S.eq.outfit,targets:S.set.targets.slice()};UI.edit=true;UI.scr='create';render();window.scrollTo(0,0);break;
  case 'saveedit':syncName();var nm2=UI.draft.name.trim();if(!nm2){document.getElementById('nameerr').textContent=t('needname');return}S.name=nm2;S.cls=UI.draft.cls;if(S.eq.weapon&&ITEM[S.eq.weapon]&&weaponClass(ITEM[S.eq.weapon].v.k)!==S.cls)delete S.eq.weapon;save();UI.draft=null;go('me');break;
  case 'lesson':startLesson(id,+el.dataset.z);break;
  case 'beginquiz':UI.sess.phase='quiz';UI.sess.t0=Date.now();render();break;
  case 'boss':startBoss(+id);break;
  case 'beginfight':UI.sess.phase='fight';UI.sess.t0=Date.now();nextBossQ();render();break;
  case 'review':startReview();break;
  case 'ans':answer(+id);break;
  case 'ckgo':case 'ckpick':ckAct(a,id);break;
  case 'hfrefresh':case 'hffill':case 'hfopen':case 'hfme':case 'hflike':case 'hfedit':case 'hfbgbuy':case 'hfbguse':case 'hfdone':case 'hfhide':hallAct(a,id);break;
  case 'nwall':case 'nwadd':case 'nwedit':case 'nwdel':case 'nwsave':newsAct(a,id);break;
  case 'prlist':case 'prrefresh':if(a==='prrefresh'){prPoll(true);break}prAct(a);break;
  case 'tycheck':case 'oradd':case 'orrm':case 'orcheck':case 'spgo':case 'spskip':prodAct(a,id);break;
  case 'next':nextQ();break;
  case 'speak':speak(el.dataset.t,el.dataset.l);break;
  case 'talk':var n=NPCS.filter(function(x){return x.id===id})[0];if(!n)return;if(!S.npc[id]){commitEv({k:'talk',npc:id});save()}UI.modal={kind:'npc',id:id,title:n.name};render();speak(n.line[n.lang],n.lang);break;
  case 'claims':claimStory(id);break;
  case 'claimd':claimDaily(id);break;
  case 'claimw':claimWeekly(id);break;
  case 'cat':UI.cat=id;render();break;
  case 'equip':equip(id);save();render();break;
  case 'logoutask':UI.modal={kind:'logout'};render();break;
  case 'logoutgo':var lc=document.getElementById('lo_clear');logout(lc?lc.checked:id==='1');break;
  case 'relogin':relogin();break;
  case 'wpnlock':if(!ITEM[id]||!S.owned[id])return;UI.modal={kind:'wpnlock',id:id};render();break;
  case 'wpnswitch':var wit=ITEM[id],wcl=wit&&weaponClass(wit.v.k);if(!wit||!S.owned[id]||!CLASSES[wcl])return;S.cls=wcl;if(S.eq.weapon&&ITEM[S.eq.weapon]&&weaponClass(ITEM[S.eq.weapon].v.k)!==S.cls)delete S.eq.weapon;equip(id);save();UI.modal=null;sfx&&sfx('buy');toast(t('wl_done').replace('{c}',tx(CLASSES[wcl].names)));render();break;
  case 'uneq':unequip(id);save();render();break;
  case 'banner':UI.banner=id;render();break;
  case 'pull':summon(+id);break;
  case 'shoptab':UI.shop=id;render();break;
  case 'exn':var ek=id.split('|'),eto=ek[0],cur=UI.exn&&UI.exn[eto]||1,mx=exMax(eto);UI.exn=UI.exn||{};UI.exn[eto]=ek[1]==='max'?Math.max(1,mx):Math.max(1,Math.min(Math.max(1,mx),cur+int(ek[1],-100,100,0)));render();break;
  case 'exgo':doExchange(id,UI.exn&&UI.exn[id]||1);break;
  case 'buy':buy(UI.shop==='coin'?'coin':'gem',id,el&&el.getAttribute('data-src'));break;
  case 'confirmbuy':confirmBuy();break;
  case 'forcernok':var ri=document.getElementById('rn_in'),rv=ri?ri.value.trim().slice(0,16):'',re=document.getElementById('rn_err'),ris=!rv?'needname':nameIssue(rv);if(ris){if(re)re.textContent=t(ris);if(ri)ri.focus();break}
    S.name=rv;S.rnAck=Math.max(S.rnAck||0,(UI.modal&&UI.modal.rn)||0);save();UI.modal=null;if(typeof TW!=='undefined'&&TW.in)townWrite({name:rv});if(typeof boardSync==='function')boardSync(true);toast('✅ '+rv);render();break;
  case 'closemodal':if(UI.modal&&UI.modal.kind==='forcern')break;if(UI.modal&&UI.modal.kind==='pull'){if(Date.now()-(UI.pullAt||0)<700)break;UI.pullAt=Date.now()-1000}UI.modal=null;render();break;
  case 'mppin':UI.modal={kind:'mppick',slot:int(id,0,2,0)};render();break;
  case 'mppick':var pp=String(id).split('|'),sl=int(pp[0],0,2,0);if(!S.show)S.show=[];while(S.show.length<3)S.show.push('');S.show[sl]=pp[1]&&S.owned[pp[1]]?pp[1]:'';save();UI.modal=null;render();break;
  case 'syncinfo':UI.modal={kind:'syncslow'};render();break;
  case 'target':var tl=S.set.targets,ti=tl.indexOf(id);if(ti>=0){if(tl.length>1)tl.splice(ti,1)}else tl.push(id);save();render();break;
  case 'rate':S.set.rate=+id;save();render();speak(S.set.lang==='zh'?'你好':S.set.lang==='en'?'Hello':'สวัสดี',S.set.lang);break;
  case 'theme':S.set.theme=id;save();render();break;
  case 'copycode':copyText(saveCode(),document.getElementById('codebox'));break;
  case 'copyreport':copyText(reportText(),document.getElementById('reportbox'));break;
  case 'openload':UI.loadOpen=!UI.loadOpen;render();var ci=document.getElementById('codein');if(ci)ci.focus();break;
  case 'loadcode':var c=readCode(document.getElementById('codein').value);if(!c||!c.created){toast(t('badcode'));return}c.arev=S.arev;S=c;save();UI.loadOpen=false;toast(t('loaded'));go('home');break;
  case 'reset':UI.resetAsk=true;render();break;
  case 'resetno':UI.resetAsk=false;render();break;
  case 'resetyes':var lg=S.set.lang,ar=S.arev;S=fresh();S.set.lang=lg;S.arev=ar;S.set.targets=LANGS.filter(function(l){return l!==lg});saveLocal();
    if(CL.playerRef){CL.playerRef.delete().catch(function(){})}UI.sess=null;UI.modal=null;UI.resetAsk=false;UI.scr='title';render();break;
  }});
document.addEventListener('change',function(e){var el=e.target;if(el.dataset&&el.dataset.act==='sw'){S.set[el.dataset.id]=el.checked;save();render()}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&UI.modal&&!UI.modal.busy&&UI.modal.kind!=='forcern'){UI.modal=null;render();return}
  var s=UI.sess;if(UI.scr!=='play'||!s||UI.modal||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  var cq=s.qs?s.qs[s.i]:s.q;if(cq&&isProd(cq))return;
  if(s.picked===null&&/^[1-4]$/.test(e.key)&&(s.phase==='quiz'||s.phase==='fight')){answer(+e.key-1);e.preventDefault()}});
