/* =====================================================================
   STUDENT PORTAL & SIGN-UP
   Signing in = the student's own Claude account (no passwords to leak or forget).
   Signing up = a short student profile (class, number, name) + the hero.
   settings/school (admin): rooms list, required profile, class join code (hash only), open/closed.
   The profile lives in the student's own players/{uid} record, which only admins can read.
   ===================================================================== */
var SCH={cfg:{require:false,rooms:[],codeH:'',open:true}};
function cleanSchool(o){o=isO(o)?o:{};return {require:o.require===true,open:o.open!==false,codeH:typeof o.codeH==='string'&&/^[0-9a-z]{1,16}$/.test(o.codeH)?o.codeH:'',
  rooms:Array.isArray(o.rooms)?o.rooms.map(function(r){return str(r,20)}).filter(Boolean).slice(0,120):[]}}
function codeHash(c){return cyrb53('tlq-room|'+String(c||'').trim().toLowerCase()).toString(36)}
function subscribeSchool(){if(!CL.db)return;CL.db.doc('settings/school').onSnapshot(function(d){SCH.cfg=cleanSchool(d.exists?d.data():{});softRender()},function(){})}
var GRADES=['p1','p2','p3','p4','p5','p6','m1','m2','m3','m4','m5','m6','voc','uni','staff','other'];
var GRADE_NAMES={p1:m('ป.1','Primary 1','小学一年级'),p2:m('ป.2','Primary 2','小学二年级'),p3:m('ป.3','Primary 3','小学三年级'),p4:m('ป.4','Primary 4','小学四年级'),p5:m('ป.5','Primary 5','小学五年级'),p6:m('ป.6','Primary 6','小学六年级'),
 m1:m('ม.1','Secondary 1','初一'),m2:m('ม.2','Secondary 2','初二'),m3:m('ม.3','Secondary 3','初三'),m4:m('ม.4','Secondary 4','高一'),m5:m('ม.5','Secondary 5','高二'),m6:m('ม.6','Secondary 6','高三'),
 voc:m('ปวช./ปวส.','Vocational','职业教育'),uni:m('มหาวิทยาลัย','University','大学'),staff:m('ครู/บุคลากร','Teacher/staff','教师/职员'),other:m('บุคคลทั่วไป','Other','其他')};
function gradeName(g){return GRADE_NAMES[g]?tx(GRADE_NAMES[g]):''}
function cleanProf(p){if(!isO(p))return null;var r={nick:str(p.nick,40),room:str(p.room,20),no:int(p.no,0,999,0),grade:GRADES.indexOf(p.grade)>=0?p.grade:'',at:int(p.at,0,9e15,0)};return r.nick||r.room||r.no||r.grade?r:null}
/* the public, staff and university visitors have no class or number */
var NOCLASS=['uni','staff','other'];
function profNeeded(){var p=S.prof;return !!(CL.uid&&SCH.cfg.require&&!(p&&p.nick&&p.grade&&(NOCLASS.indexOf(p.grade)>=0||(p.room&&p.no&&fullName(p.nick)))))}

/* ---------- the landing page every student sees first ---------- */
var PV_ART=(location.protocol==='file:'||window.TLQ_STANDALONE)?{v:'assets/heroes.mp4',p:'assets/heroes.jpg',b:'assets/backdrop.jpg'}:{v:'/_blob/eb06c3bffc00965ab4725d1a3dd2ad65',p:'/_blob/0ce6f45ca7b5aa1de8392771630c246b',b:'/_blob/97feb01eabfa02bd1c693c7628b7cb54'};
var PV_VER='v2.0';
function pvLogo(){var tt=themeNow().title,word=tt||'TRI-LINGUA',cols=['#ff4d5e','#ff6a3d','#ff8a1e','#ffb31a','#ffd21a','#ffe14a','#2fc3ff','#3a8bff','#5a63ff','#8a55ff'];
  var letters=word.split('').map(function(ch,i){var c=tt?cols[i%cols.length]:(i<4?cols[i]:i<7?cols[i]:cols[i]);return ch===' '?'<span class="sp"> </span>':'<span style="color:'+c+';--d:'+(i*0.06).toFixed(2)+'s">'+esc(ch)+'</span>'}).join('');
  return '<div class="pv-logo" aria-label="'+esc(word)+'"><div class="pv-word" aria-hidden="true">'+letters+'</div><div class="pv-badges"><span class="pv-quest">QUEST</span><span class="pv-chip">ไทย · English · 中文</span></div></div>'}
function pvFx(){var e=['🍂','❄️','🍁','❄️','🍂','✨','❄️','🍁'],h='';for(var i=0;i<18;i++){h+='<span style="left:'+((i*37)%100)+'%;animation-duration:'+(7+(i*13)%9)+'s;animation-delay:-'+((i*7)%11)+'s;font-size:'+(12+(i*5)%14)+'px">'+e[i%e.length]+'</span>'}return '<div class="pv-fx" aria-hidden="true">'+h+'</div>'}
VIEW.title=function(){var signed=!!CL.uid,ready=CL.ready,th=themeNow();
  var who=signed?(CL.myName||t('pt_hi0')):t(CL.db===null&&ready?'pt_local':'pt_signin');
  var hero=S.created?esc(S.name)+(S.prof&&S.prof.grade?' · '+esc(gradeName(S.prof.grade)):'')+' · Lv '+S.lvl:esc(t(signed?'pv_noreg':'pv_nohero'));
  var loginBtn=!ready?'<button class="pv-btn login" disabled><span class="spin"></span> '+esc(t('connecting'))+'</button>':'<button class="pv-btn login" data-act="pvlogin">'+esc(t('pv_login'))+'</button>';
  var regBtn=S.created?'<button class="pv-btn reg" data-act="'+(signed?'pfopen':'go')+'" data-id="me">'+esc(t('pv_profile'))+'</button>':(signed&&!SCH.cfg.open?'<div class="pv-note warn">'+esc(t('pt_closed'))+'</div>':'<button class="pv-btn reg" data-act="newgame">'+esc(t('pv_register'))+'</button>');
  var art=th.portalImg?'<img class="pv-vid" src="'+esc(th.portalImg)+'" alt="">':'<video class="pv-vid" autoplay muted playsinline preload="auto" poster="'+PV_ART.p+'" src="'+PV_ART.v+'" aria-hidden="true"></video>';
  var feats=[['🗺️','pt_f1'],['🏘️','pt_f2'],['🐉','pt_f3'],['🔁','pt_f4'],['🎁','pt_f5'],['📚','pt_f6']];
  return '<section class="pv" aria-label="TRI-LINGUA"><div class="pv-bg" style="background-image:url(\''+PV_ART.b+'\')"></div>'+pvFx()+
   '<div class="pv-lang" role="group" aria-label="'+esc(t('uilang'))+'">'+LANGS.map(function(l){return '<button data-act="uilang" data-id="'+l+'" aria-pressed="'+(S.set.lang===l)+'">'+LLABEL[l]+'</button>'}).join('')+'</div>'+
   '<div class="pv-grid"><div class="pv-left">'+pvLogo()+
    (slOn()&&ready&&!signed?slPanel()+'':('<div class="pv-panel"><h2>'+esc(t('pv_head'))+'</h2>'+
     '<div class="pv-field"><span class="pv-ic">👤</span><span class="pv-val'+(signed?'':' off')+'">'+esc(who)+'</span>'+(signed?'<span class="pv-ok" title="'+esc(t('pt_hi0'))+'">✓</span>':'')+'</div>'+
     '<div class="pv-field"><span class="pv-ic">🎓</span><span class="pv-val'+(S.created?'':' off')+'">'+hero+'</span></div>'+
     '<div class="pv-row"><label class="pv-rem"><input type="checkbox" id="pv_rem" data-act="pvrem"'+(S.set.remember?' checked':'')+'> '+esc(t('pv_remember'))+'</label><small>🔒 '+esc(t('pv_nopass'))+'</small></div>'+
     loginBtn+regBtn+(CL.admin?'<button class="pv-admin" data-act="go" data-id="admin">⚙️ '+esc(t('n_admin'))+'</button>':'')+
     (signed?'<small class="pv-small">'+esc(t('autosave'))+'</small>':'')+'</div>'))+noticeBar()+'</div>'+
    '<div class="pv-art" id="pv_art">'+art+'</div></div>'+
   '<div class="pv-foot"><span>'+PV_VER+'</span><span>© 2026 TRI-LINGUA Quest · '+esc(t('copyr'))+'</span></div></section>'+
   '<section class="pv-more"><div class="pt-feats">'+feats.map(function(f){return '<div class="pt-feat"><span class="pt-ic">'+f[0]+'</span><b>'+esc(t(f[1]))+'</b><small class="mut">'+esc(t(f[1]+'d'))+'</small></div>'}).join('')+'</div></section>'};
/* ---------- sign-up fields on the create-hero page ---------- */
function profFields(d){if(!CL.uid)return '';var c=SCH.cfg,req=c.require,p=d.prof||{};
  var room=c.rooms.length?'<select id="pf_room"><option value="">'+esc(t('pf_pick'))+'</option>'+c.rooms.map(function(r){return '<option'+(p.room===r?' selected':'')+'>'+esc(r)+'</option>'}).join('')+'</select>':'<input id="pf_room" maxlength="20" placeholder="'+esc(t('pf_roomph'))+'" value="'+esc(p.room||'')+'">';
  return '<fieldset class="pf"><legend>🎓 '+esc(t('pf_title'))+(req?'':' <small class="mut">('+esc(t('pf_opt'))+')</small>')+'</legend>'+
   '<div class="pf-grid"><label>'+esc(t('pf_nick'))+'<input id="pf_nick" maxlength="40" autocomplete="off" placeholder="'+esc(t('pf_nickph'))+'" value="'+esc(p.nick||'')+'"></label>'+
   '<label>'+esc(t('pf_grade'))+'<select id="pf_grade"><option value="">'+esc(t('pf_pick'))+'</option>'+GRADES.map(function(g){return '<option value="'+g+'"'+(p.grade===g?' selected':'')+'>'+esc(gradeName(g))+'</option>'}).join('')+'</select></label><label>'+esc(t('pf_room'))+room+'</label><label>'+esc(t('pf_no'))+'<input id="pf_no" type="number" min="1" max="999" inputmode="numeric" value="'+(p.no||'')+'"></label>'+
   (c.codeH?'<label>'+esc(t('pf_code'))+'<input id="pf_code" maxlength="30" autocomplete="off" placeholder="'+esc(t('pf_codeph'))+'"></label>':'')+'</div>'+
   (req?'<label class="pf-ok"><input type="checkbox" id="pf_rules"'+(p.rules?' checked':'')+'> '+esc(t('pf_rules'))+'</label>':'')+
   '<small class="mut">🔒 '+esc(t('pf_priv'))+'</small></fieldset>'}
function readProf(){var g=function(i){return document.getElementById(i)};if(!g('pf_nick'))return null;
  return {nick:str(g('pf_nick').value,40),grade:g('pf_grade')?g('pf_grade').value:'',room:str(g('pf_room').value,20),no:int(g('pf_no').value,0,999,0),code:g('pf_code')?g('pf_code').value:'',rules:g('pf_rules')?g('pf_rules').checked:true}}
/* '' = fine, otherwise the message key */
function profError(p){var c=SCH.cfg;if(!p)return c.require&&CL.uid?'pf_need':'';
  var noClass=NOCLASS.indexOf(p.grade)>=0;if(c.require&&(!p.nick||!p.grade||(!noClass&&(!p.room||!p.no))))return 'pf_need';if(c.require&&!p.rules)return 'pf_needrules';
  if(p.grade&&!noClass&&!fullName(p.nick))return 'pf_needreal';
  if(!noClass&&c.rooms.length&&p.room&&c.rooms.indexOf(p.room)<0)return 'pf_need';
  if(c.codeH&&codeHash(p.code)!==c.codeH)return 'pf_badcode';return ''}
function setProf(p){if(!p)return;var cp=cleanProf(p);if(cp){cp.at=S.prof&&S.prof.at||Date.now();S.prof=cp}}

/* ---------- existing players: complete the profile once ---------- */
function profCard(){if(!profNeeded())return '';return '<section class="panel stack pf-card"><b>🎓 '+esc(t('pf_cardt'))+'</b><small class="mut">'+esc(t('pf_cardd'))+'</small><div class="row"><button class="btn" data-act="pfopen">'+esc(t('pf_fill'))+'</button></div></section>'}
function profModal(){var d={prof:Object.assign({},S.prof||{})};return '<h2>🎓 '+esc(t('pf_title'))+'</h2>'+profFields(d)+'<p class="err" id="pferr"></p><div class="row" style="justify-content:center"><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button><button class="btn" data-act="pfsave">'+esc(t('save'))+'</button></div>'}
function meProf(){if(!CL.uid)return '';var p=S.prof;return '<section class="panel stack"><h2 style="font-size:22px">🎓 '+esc(t('pf_title'))+'</h2>'+(p?'<div class="pf-show"><span>'+esc(t('pf_nick'))+' <b>'+esc(p.nick||'—')+'</b></span><span>'+esc(t('pf_grade'))+' <b>'+esc(gradeName(p.grade)||'—')+'</b></span><span>'+esc(t('pf_room'))+' <b>'+esc(p.room||'—')+'</b></span><span>'+esc(t('pf_no'))+' <b>'+(p.no||'—')+'</b></span></div>':'<small class="mut">'+esc(t('pf_none'))+'</small>')+
  '<div class="row"><button class="btn sm sec" data-act="pfopen">'+esc(t('pf_edit'))+'</button></div></section>'}
function schoolAct(a){switch(a){
  case 'pvlogin':if(!CL.ready)return true;if(S.created){go(landing());return true}if(CL.uid){if(!SCH.cfg.open){toast(t('pt_closed'));return true}document.querySelector('[data-act=newgame]')&&document.querySelector('[data-act=newgame]').click();return true}toast(t('pt_signin'));return true;
  case 'pvrem':var cb=document.getElementById('pv_rem');S.set.remember=!!(cb&&cb.checked);saveLocal();return 'keep';
  case 'pfopen':UI.modal={kind:'prof'};render();return true;
  case 'pfsave':var p=readProf(),er=profError(p);if(er){var e=document.getElementById('pferr');if(e)e.textContent=t(er);return true}setProf(p);save();UI.modal=null;toast(t('pf_saved'));render();return true}
  return false}

/* ---------- admin: classes and sign-up ---------- */
function admSchool(){var c=UI.schDraft||(UI.schDraft=JSON.parse(JSON.stringify(SCH.cfg)));var rooms={};(CL.players||[]).forEach(function(p){var r=p.d.room||'—';rooms[r]=(rooms[r]||0)+1});
  return '<section class="panel stack"><div class="adm-head"><h1>🎓 '+at('school')+'</h1></div><small class="mut">'+at('sc_h')+'</small>'+
   '<div class="cfg"><div class="fld"><label class="toggle" for="sc_open"><span>'+at('sc_open')+'</span><input type="checkbox" class="sw" id="sc_open"'+(c.open?' checked':'')+'></label></div>'+
   '<div class="fld"><label class="toggle" for="sc_req"><span>'+at('sc_req')+'</span><input type="checkbox" class="sw" id="sc_req"'+(c.require?' checked':'')+'></label></div>'+
   '<div class="fld full"><label for="sc_rooms">'+at('sc_rooms')+'</label><textarea id="sc_rooms" style="min-height:120px" placeholder="ป.4/1&#10;ป.4/2&#10;ม.1/1">'+esc(c.rooms.join('\n'))+'</textarea><small class="mut">'+at('sc_roomsh')+'</small></div>'+
   '<div class="fld full"><label for="sc_code">'+at('sc_code')+'</label><input id="sc_code" maxlength="30" autocomplete="off" placeholder="'+esc(c.codeH?at('sc_codeset'):at('sc_codeph'))+'"><small class="mut">'+at('sc_codeh')+'</small>'+(c.codeH?'<button class="mini" data-act="admscnocode" style="justify-self:start">'+at('sc_nocode')+'</button>':'')+'</div></div>'+
   '<div class="row"><button class="btn" data-act="admscsave">'+at('save')+'</button></div>'+
   ''+(Object.keys(rooms).length?'<b>'+at('sc_count')+'</b><div class="row" style="gap:6px">'+Object.keys(rooms).sort().map(function(r){return '<span class="tag">'+esc(r)+' · '+rooms[r]+'</span>'}).join('')+'</div>':'')+'</section>'}
/* evaluation: who is playing, by grade level */
function gradeStats(){var out={},cut=new Date(Date.now()-7*864e5).toISOString().slice(0,10);
  (CL.players||[]).forEach(function(p){var d=p.d||{},g=GRADES.indexOf(d.grade)>=0?d.grade:'none',o=out[g]=out[g]||{n:0,act:0,lvl:0,words:0,stars:0,acc:{th:[0,0],en:[0,0],zh:[0,0]}};
    o.n++;if(str(d.lastDay,10)>=cut)o.act++;o.lvl+=pnum(d.lvl);o.words+=pnum(d.learned);o.stars+=pnum(d.stars);
    LANGS.forEach(function(l){var v=isO(d.acc)?d.acc[l]:null;if(typeof v==='number'){o.acc[l][0]+=v;o.acc[l][1]++}})});
  return GRADES.concat(['none']).filter(function(g){return out[g]}).map(function(g){var o=out[g];return {g:g,name:g==='none'?at('sc_nograde'):gradeName(g),n:o.n,act:o.act,lvl:o.n?Math.round(o.lvl/o.n*10)/10:0,words:o.n?Math.round(o.words/o.n):0,stars:o.stars,acc:LANGS.map(function(l){return o.acc[l][1]?Math.round(o.acc[l][0]/o.acc[l][1]):null})}})}
function gradeReport(){ensurePlayers();var rows=gradeStats(),max=Math.max.apply(null,rows.map(function(r){return r.n}).concat([1])),tot=rows.reduce(function(a,r){return a+r.n},0);
  return '<section class="panel stack"><div class="adm-head"><h1>📊 '+at('sc_rep')+'</h1><div class="tools"><button class="btn sm" data-act="admgradecsv">'+at('csv')+'</button></div></div><small class="mut">'+at('sc_reph')+'</small>'+
   (!CL.players?'<div class="empty">…</div>':!rows.length?'<div class="empty">'+at('p_none')+'</div>':
   '<div class="gbars">'+rows.map(function(r){return '<div class="gbar"><span class="gl">'+esc(r.name)+'</span><span class="gt"><i style="width:'+(r.n/max*100)+'%"></i><i class="act" style="width:'+(r.act/max*100)+'%"></i></span><b class="num">'+r.n+'</b></div>'}).join('')+'</div>'+
   '<small class="mut"><span class="gkey"></span> '+at('sc_all')+' · <span class="gkey act"></span> '+at('sc_act7')+' · '+at('sc_total')+' '+tot+'</small>'+
   '<div class="tblwrap"><table class="dt"><thead><tr><th>'+at('sc_grade')+'</th><th class="num">'+at('sc_cnt')+'</th><th class="num">'+at('sc_act7')+'</th><th class="num">'+at('p_lvl')+'</th><th class="num">'+at('p_words')+'</th>'+LANGS.map(function(l){return '<th class="num">'+LLABEL[l]+' %</th>'}).join('')+'<th class="num">'+at('p_stars')+'</th></tr></thead><tbody>'+
   rows.map(function(r){return '<tr><td><b>'+esc(r.name)+'</b></td><td class="num">'+r.n+'</td><td class="num">'+r.act+'</td><td class="num">'+r.lvl+'</td><td class="num">'+r.words+'</td>'+r.acc.map(function(a,i){return '<td class="num lt-'+LANGS[i]+'">'+(a===null?'—':a+'%')+'</td>'}).join('')+'<td class="num">'+r.stars+'</td></tr>'}).join('')+'</tbody></table></div>')+'</section>'}
function gradeCsv(){var head=[at('sc_grade'),at('sc_cnt'),at('sc_act7'),at('p_lvl'),at('p_words'),'TH %','EN %','CN %',at('p_stars')];
  return '\ufeff'+[head].concat(gradeStats().map(function(r){return [r.name,r.n,r.act,r.lvl,r.words].concat(r.acc.map(function(a){return a===null?'':a})).concat([r.stars])})).map(function(r){return r.map(function(v){v=String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(',')}).join('\n')}
function schoolAdminAct(a){switch(a){
  case 'admgradecsv':capUse('downloads').then(function(dl){var data=gradeCsv();if(dl&&dl.save)dl.save({filename:'tri-lingua-grade-report.csv',data:data}).catch(function(){});else copyText(data)});return true;
  case 'admscsave':var g=function(i){return document.getElementById(i)},c=UI.schDraft;c.open=g('sc_open').checked;c.require=g('sc_req').checked;
    c.rooms=g('sc_rooms').value.split(/\n+/).map(function(r){return r.trim()}).filter(Boolean);var code=g('sc_code').value.trim();if(code)c.codeH=codeHash(code);
    var body=cleanSchool(c);retry(function(){return CL.db.doc('settings/school').set(body)}).then(function(){SCH.cfg=body;UI.schDraft=null;toast(at('saved'));render()},writeErr);return true;
  case 'admscnocode':UI.schDraft.codeH='';var b2=cleanSchool(UI.schDraft);retry(function(){return CL.db.doc('settings/school').set(b2)}).then(function(){SCH.cfg=b2;UI.schDraft=null;toast(at('saved'));render()},writeErr);return true}
  return false}
