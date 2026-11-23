/* =====================================================================
   EVENT GIFTS — the teacher picks students (filter by grade / room / name,
   tick boxes or "select all") and sends coins, gems, tickets and items with
   an event message, all at once. Each student gets it through the same
   teacher-gift channel as single gifts (adjust/{pid}), so it is checked
   by the anti-cheat and shown to the student with the message.
   ===================================================================== */
var GF={sel:{},items:{},q:'',grade:'',room:'',iq:'',vals:{coin:0,gems:0,tickets:0},note:'',err:'',last:null};
function gfPlayers(){return (CL.players||[]).filter(function(p){return p&&p.d&&p.d.name})}
function gfShown(){var q=GF.q.toLowerCase().trim();return gfPlayers().filter(function(p){var d=p.d;
  if(GF.grade&&d.grade!==GF.grade)return false;if(GF.room&&String(d.room||'')!==GF.room)return false;
  if(q&&(String(d.name)+' '+String(d.nick||'')+' '+p.id).toLowerCase().indexOf(q)<0)return false;return true})
  .sort(function(a,b){return String(a.d.grade).localeCompare(String(b.d.grade))||String(a.d.room).localeCompare(String(b.d.room),undefined,{numeric:true})||int(a.d.no,0,999)-int(b.d.no,0,999)||String(a.d.name).localeCompare(String(b.d.name))})}
function gfKeep(){var g=function(i){return document.getElementById(i)};['coin','gems','tickets'].forEach(function(k){var e=g('gf_'+k);if(e)GF.vals[k]=int(e.value,0,1e5,0)});
  var n=g('gf_note');if(n)GF.note=n.value.slice(0,60);var q=g('gf_q');if(q)GF.q=q.value;var iq=g('gi_q');if(iq)GF.iq=iq.value}
function gfCount(){return Object.keys(GF.sel).filter(function(k){return GF.sel[k]}).length}
function admGift(){var shown=gfShown(),n=gfCount(),grades={},rooms={};gfPlayers().forEach(function(p){if(p.d.grade)grades[p.d.grade]=1;if(p.d.room!=null&&p.d.room!=='')rooms[String(p.d.room)]=1});
  var allOn=shown.length&&shown.every(function(p){return GF.sel[p.id]});
  var h='<section class="panel stack"><div class="adm-head"><h1>🎁 '+at('gf_title')+'</h1></div><small class="mut">'+at('gf_h')+'</small>';
  /* 1) what to give */
  h+='<div class="gf-step"><b>1. '+at('gf_s1')+'</b><label class="fld full">'+at('gf_note')+'<input id="gf_note" maxlength="60" placeholder="'+esc(at('gf_noteph'))+'" value="'+esc(GF.note)+'"></label>'+
   '<div class="rwd" style="grid-template-columns:repeat(3,minmax(0,1fr))">'+['coin','gems','tickets'].map(function(k){return '<label>'+esc(t(k))+'<input type="number" min="0" max="100000" id="gf_'+k+'" value="'+int(GF.vals[k],0,1e5,0)+'"></label>'}).join('')+'</div>'+
   '<div class="gibox"><b>'+at('gi_title')+'</b><input id="gi_q" type="search" autocomplete="off" placeholder="'+esc(at('gi_q'))+'" value="'+esc(GF.iq)+'">'+
   '<div class="girow"><select id="gi_sel" size="6">'+giOptions(GF.iq,{})+'</select><div class="gictl"><label>'+at('gi_n')+'<input type="number" id="gi_n" value="1" min="1" max="999"></label><button class="btn sec" data-act="admgfadd">'+at('gi_add')+'</button></div></div>'+
   '<div class="gilist">'+(Object.keys(GF.items).length?Object.keys(GF.items).map(function(k){var it=ITEM[k];return '<div class="giit"><span class="githumb">'+(it?itemThumb(it).replace('<svg','<svg style="width:100%;height:100%"'):'')+'</span><span class="ginm"><b>'+esc(it?tx(it.names):k)+'</b><small class="mut">'+(it?'<span class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span>':'')+'</small></span><b class="num pos">+'+GF.items[k]+'</b><button class="mini danger" data-act="admgfrm" data-id="'+esc(k)+'">✕</button></div>'}).join(''):'<small class="mut">'+at('gf_noitems')+'</small>')+'</div></div></div>';
  /* 2) who gets it */
  h+='<div class="gf-step"><b>2. '+at('gf_s2')+'</b><div class="row" style="flex-wrap:wrap;gap:8px">'+
   '<input type="search" id="gf_q" placeholder="'+esc(at('gf_find'))+'" value="'+esc(GF.q)+'" style="flex:1;min-width:160px">'+
   '<select id="gf_grade"><option value="">'+at('gf_allgr')+'</option>'+Object.keys(grades).sort().map(function(g){return opt(g,gradeName(g),GF.grade)}).join('')+'</select>'+
   '<select id="gf_room"><option value="">'+at('gf_allrm')+'</option>'+Object.keys(rooms).sort(function(a,b){return a.localeCompare(b,undefined,{numeric:true})}).map(function(r){return opt(r,at('gf_rm')+' '+r,GF.room)}).join('')+'</select></div>'+
   '<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sec sm" data-act="admgfall">'+(allOn?'☐ '+at('gf_none'):'☑ '+at('gf_all')+' ('+shown.length+')')+'</button>'+(n?'<button class="btn sec sm" data-act="admgfclear">✕ '+at('gf_clear')+'</button>':'')+'<span class="tag">✅ '+at('gf_picked')+' '+n+'</span></div>'+
   '<div class="tblwrap" style="max-height:340px;overflow-y:auto"><table class="dt"><thead><tr><th></th><th>'+at('p_hero')+'</th><th>'+at('gf_class')+'</th></tr></thead><tbody>'+
   (shown.length?shown.map(function(p){var d=p.d,on=!!GF.sel[p.id];return '<tr class="'+(on?'gf-on':'')+'"><td><input type="checkbox" class="gf-ck" data-id="'+esc(p.id)+'" aria-label="'+esc(str(d.name,16))+'"'+(on?' checked':'')+'></td><td><b>'+esc(str(d.name,16))+'</b>'+(d.nick?' <small class="mut">'+esc(str(d.nick,40))+'</small>':'')+' <small class="mut">Lv'+int(d.lvl,1,999)+'</small>'+(function(){var r=typeof adjPending==='function'?adjPending(p.id):{n:0};return r.n?' <span class="tag" title="'+esc(pendingText(r))+'">⏳ '+at('pd_tag')+' '+r.n+'</span>':''})()+'</td><td>'+esc(d.grade?gradeName(d.grade):'—')+(d.room?' / '+esc(String(d.room)):'')+(d.no?' #'+int(d.no,0,999):'')+'</td></tr>'}).join(''):'<tr><td colspan="3" class="mut">'+at('gf_nobody')+'</td></tr>')+
   '</tbody></table></div></div>';
  /* 3) send */
  var what=gfWhat();
  h+='<div class="gf-step"><b>3. '+at('gf_s3')+'</b>'+(what?'<div class="notice" style="display:block">'+esc(at('gf_sum').replace('{n}',n))+'<br><b>'+esc(what)+'</b>'+(GF.note?'<br>💬 '+esc(GF.note):'')+'</div>':'')+
   '<p class="err">'+esc(GF.err)+'</p><div class="row"><button class="btn gold" data-act="admgfsend"'+(n&&what?'':' disabled')+'>🎁 '+at('gf_send').replace('{n}',n)+'</button></div>'+
   (GF.last?'<small class="mut">✅ '+esc(GF.last)+'</small>':'')+'</div></section>';
  return h}
function gfWhat(){var p=[];['coin','gems','tickets'].forEach(function(k){if(GF.vals[k]>0)p.push(t(k)+' +'+GF.vals[k])});Object.keys(GF.items).forEach(function(k){if(ITEM[k])p.push(tx(ITEM[k].names)+' ×'+GF.items[k])});return p.join(' · ')}
function gfSend(){var ids=Object.keys(GF.sel).filter(function(k){return GF.sel[k]&&IDRE.test(k)}),v=GF.vals,items={};
  Object.keys(GF.items).forEach(function(k){var q=int(GF.items[k],1,999,0);if(q&&ITEM[k])items[k]=q});
  if(!ids.length||(!v.coin&&!v.gems&&!v.tickets&&!Object.keys(items).length))return;var note=cleanMsg(GF.note||'').slice(0,60),stamp=Date.now().toString(36);
  var ops=ids.map(function(pid,i){return function(){return bumpAdjust(pid,function(b){var e={id:'g'+stamp+i.toString(36)+Math.floor(rnd(1e4)).toString(36),t:Date.now(),coin:int(v.coin,0,1e5,0),gems:int(v.gems,0,1e5,0),tickets:int(v.tickets,0,1e5,0),src:'event'};
    if(Object.keys(items).length)e.items=items;if(note)e.note=note;b.list.push(e);if(b.list.length>200)b.list=b.list.slice(-200);return {}})}});
  var label=at('gf_sending');GF.last=at('gf_done').replace('{n}',ids.length)+(note?' · '+note:'');runOps(ops,label);GF.sel={}}
function giftAct(a,id,el){if(a.indexOf('admgf')!==0)return false;a=a.slice(3);gfKeep();
  if(a==='gfadd'){var s=document.getElementById('gi_sel'),k=s&&s.value,q=int((document.getElementById('gi_n')||{}).value,1,999,0);GF.err='';if(k&&ITEM[k]&&q){if(isBound(k))GF.err=at('gf_bound');else GF.items[k]=Math.min(999,(GF.items[k]||0)+q)}render();return true}
  if(a==='gfrm'){delete GF.items[id];render();return true}
  if(a==='gfall'){var sh=gfShown(),on=sh.length&&sh.every(function(p){return GF.sel[p.id]});sh.forEach(function(p){if(on)delete GF.sel[p.id];else GF.sel[p.id]=true});render();return true}
  if(a==='gfclear'){GF.sel={};render();return true}
  if(a==='gfsend'){GF.err='';gfSend();return true}
  return true}
document.addEventListener('change',function(e){var el=e.target;if(!el)return;
  if(el.classList&&el.classList.contains('gf-ck')){var id=el.dataset.id;if(el.checked)GF.sel[id]=true;else delete GF.sel[id];gfKeep();render();return}
  if(el.id==='gf_grade'||el.id==='gf_room'){gfKeep();GF[el.id==='gf_grade'?'grade':'room']=el.value;render()}});
document.addEventListener('input',function(e){var el=e.target;if(!el)return;
  if(el.id==='gf_q'){GF.q=el.value;clearTimeout(GF.qt);GF.qt=setTimeout(function(){gfKeep();render();var f=document.getElementById('gf_q');if(f){f.focus();f.setSelectionRange(f.value.length,f.value.length)}},250)}
  if(el.id==='gi_q'&&UI.adm==='gift'&&!UI.modal){GF.iq=el.value;var s=document.getElementById('gi_sel');if(s)s.innerHTML=giOptions(GF.iq,{})}
  if(/^gf_(coin|gems|tickets|note)$/.test(el.id)){gfKeep();var b=document.querySelector('[data-act=admgfsend]');if(b)b.disabled=!(gfCount()&&gfWhat())}});
