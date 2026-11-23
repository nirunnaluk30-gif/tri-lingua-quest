/* =====================================================================
   STAND-ALONE MODE (GitHub Pages + Firebase): ID / password sign-in.
   Everything here is inert in the hosted version (window.TLQ_STANDALONE unset).
   ===================================================================== */
var SL={tab:'login',busy:false,err:'',f:{}};
function slKeep(){['sl_id','sl_name','sl_grade','sl_rules'].forEach(function(i){var e=document.getElementById(i);if(e)SL.f[i]=e.type==='checkbox'?e.checked:e.value})}
function slV(i){return SL.f[i]?' value="'+esc(SL.f[i])+'"':''}
function slOn(){return !!window.TLQ_STANDALONE}
function slErr(code){return t('sl_e_'+(['bad_id','pw_short','id_taken','bad_login','too_many','offline','pw_match','need_name','need_grade','need_rules'].indexOf(code)>=0?code:'unknown'))}
function slPanel(){
  if(!window.TLQ_CONFIGURED)return '<div class="pv-panel"><h2>⚙️ '+esc(t('sl_setup_t'))+'</h2><p style="margin:0;color:#3a3a6a">'+esc(t('sl_setup_d'))+'</p></div>';
  var lg=SL.tab==='login',g=GRADES.map(function(k){return '<option value="'+k+'"'+(SL.f.sl_grade===k?' selected':'')+'>'+esc(gradeName(k))+'</option>'}).join('');
  return '<div class="pv-panel"><h2>'+esc(t('pv_head'))+'</h2><div class="sl-tabs" role="tablist"><button role="tab" data-act="sltab" data-id="login" aria-selected="'+lg+'">'+esc(t('sl_login'))+'</button><button role="tab" data-act="sltab" data-id="reg" aria-selected="'+(!lg)+'">'+esc(t('sl_register'))+'</button></div>'+
   '<form class="sl-form" onsubmit="return false" autocomplete="on">'+
   '<label class="pv-field"><span class="pv-ic">👤</span><input id="sl_id" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20"'+slV('sl_id')+' placeholder="'+esc(t('sl_id'))+'"></label>'+
   '<label class="pv-field"><span class="pv-ic">🔒</span><input id="sl_pw" name="password" type="password" autocomplete="'+(lg?'current-password':'new-password')+'" maxlength="64" placeholder="'+esc(t('sl_pw'))+'"></label>'+
   (lg?'':'<label class="pv-field"><span class="pv-ic">🔒</span><input id="sl_pw2" type="password" autocomplete="new-password" maxlength="64" placeholder="'+esc(t('sl_pw2'))+'"></label>'+
     '<label class="pv-field"><span class="pv-ic">📝</span><input id="sl_name" maxlength="40" autocomplete="name"'+slV('sl_name')+' placeholder="'+esc(t('sl_name'))+'"></label>'+
     '<label class="pv-field"><span class="pv-ic">🎓</span><select id="sl_grade"><option value="">'+esc(t('sl_grade'))+'</option>'+g+'</select></label>'+
     '<label class="pv-rem"><input type="checkbox" id="sl_rules"'+(SL.f.sl_rules?' checked':'')+'> '+esc(t('sl_rules'))+'</label>')+
   '<div class="pv-row"><label class="pv-rem"><input type="checkbox" id="sl_rem"'+(S.set.remember?' checked':'')+'> '+esc(t('pv_remember'))+'</label>'+(lg?'<small>'+esc(t('sl_forgot'))+'</small>':'<small>'+esc(t('sl_idrule'))+'</small>')+'</div>'+
   '<p class="sl-err" role="alert">'+esc(SL.err)+'</p>'+
   '<button class="pv-btn '+(lg?'login':'reg')+'" data-act="slgo"'+(SL.busy?' disabled':'')+'>'+(SL.busy?'<span class="spin"></span> ':'')+esc(lg?t('pv_login'):t('pv_register'))+'</button>'+
   (lg?'<button type="button" class="pv-btn reg" data-act="sltab" data-id="reg">'+esc(t('pv_register'))+'</button>':'<button type="button" class="pv-admin" data-act="sltab" data-id="login">'+esc(t('sl_have'))+'</button>')+
   '</form></div>'}
function slGo(){var A=window.TLQ_AUTH;if(!A||SL.busy)return;var g=function(i){var e=document.getElementById(i);return e?e.value:''};var id=g('sl_id').trim().toLowerCase(),pw=g('sl_pw'),rem=!!(document.getElementById('sl_rem')||{}).checked;
  slKeep();var fail=function(c){SL.busy=false;SL.err=slErr(c);render();var f=document.getElementById(c==='bad_login'||c==='pw_short'||c==='pw_match'?'sl_pw':'sl_id');if(f)f.focus()};
  if(!A.idOk(id))return fail('bad_id');if(SL.tab==='login'?pw.length<6:!(A.pwOk?A.pwOk(pw):pw.length>=8))return fail('pw_short');
  S.set.remember=rem;saveLocal();
  if(SL.tab==='login'){SL.busy=true;SL.err='';render();A.login(id,pw,rem).then(function(){location.reload()},fail);return}
  var name=g('sl_name').trim(),grade=g('sl_grade');if(pw!==g('sl_pw2'))return fail('pw_match');if(!name)return fail('need_name');if(!grade)return fail('need_grade');if(!(document.getElementById('sl_rules')||{}).checked)return fail('need_rules');
  SL.busy=true;SL.err='';render();
  A.register(id,pw,name,rem).then(function(){try{sessionStorage.setItem('tlq_reg',JSON.stringify({nick:name,grade:grade}))}catch(e){}location.reload()},fail)}
/* after signing up the page reloads signed in: go straight to making the hero, with the profile filled in */
function slAfterLogin(){if(!slOn()||!CL.uid||S.created)return;var reg=null;try{reg=JSON.parse(sessionStorage.getItem('tlq_reg')||'null')}catch(e){}
  if(UI.scr==='title'||UI.scr==='home'){UI.draft={name:'',gender:'F',cls:'mage',outfit:'sof3',targets:LANGS.filter(function(l){return l!==S.set.lang}),prof:reg?{nick:str(reg.nick,40),grade:GRADES.indexOf(reg.grade)>=0?reg.grade:'',rules:true}:null};UI.edit=false;UI.scr='create'}}
function slLogout(clear){var A=window.TLQ_AUTH;if(!A)return false;A.logout(!!clear).then(function(){location.reload()},function(){location.reload()});return true}
function slChangePw(){return '<section class="panel stack"><h2 style="font-size:22px">🔑 '+esc(t('sl_cpw'))+'</h2><div class="pf-grid"><label>'+esc(t('sl_oldpw'))+'<input type="password" id="sl_old" autocomplete="current-password"></label><label>'+esc(t('sl_newpw'))+'<input type="password" id="sl_new" autocomplete="new-password"></label></div><p class="err" id="sl_cpwerr"></p><div class="row"><button class="btn sm" data-act="slcpw">'+esc(t('save'))+'</button></div></section>'}
function slAct(a,id){switch(a){
  case 'sltab':slKeep();SL.tab=id==='reg'?'reg':'login';SL.err='';render();return true;
  case 'slgo':slGo();return true;
  case 'slcpw':var o=(document.getElementById('sl_old')||{}).value,n=(document.getElementById('sl_new')||{}).value,er=document.getElementById('sl_cpwerr');
    window.TLQ_AUTH.changePassword(o,n).then(function(){toast(t('sl_cpwok'));render()},function(c){if(er)er.textContent=slErr(c)});return true}
  return false}
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&/^sl_/.test(e.target.id||'')&&e.target.tagName==='INPUT'){e.preventDefault();slGo()}});
/* admin: who else can manage the game (stand-alone only) */
function slAdmins(){if(!slOn()||!window.TLQ_AUTH)return '';if(!SL.admins){SL.admins=[];window.TLQ_AUTH.listAdmins().then(function(l){SL.admins=l;softRender()},function(){})}
  var ps=(CL.players||[]).filter(function(p){return SL.admins.indexOf(p.id)<0});
  return '<section class="panel stack"><div class="adm-head"><h1>🛡️ '+at('sl_admins')+'</h1></div><small class="mut">'+at('sl_adminsh')+'</small>'+
   '<div class="row" style="gap:6px">'+SL.admins.map(function(a){return '<span class="tag">'+esc(a.slice(3))+(a===CL.uid?' ('+esc(t('tw_you'))+')':' <button class="mini danger" data-act="admsldel" data-id="'+esc(a)+'" aria-label="remove">✕</button>')+'</span>'}).join('')+'</div>'+
   '<div class="row"><select id="sl_newadmin"><option value="">— '+at('sl_pick')+' —</option>'+ps.map(function(p){return '<option value="'+esc(p.id)+'">'+esc(p.id.slice(3))+' · '+esc(str(p.d.nick||p.d.name,30))+'</option>'}).join('')+'</select><button class="btn sm" data-act="admsladd">'+at('sl_add')+'</button></div>'+
   '<small class="mut">🔑 '+at('sl_pwhelp')+'</small></section>'}
function slAdminAct(a,id){if(!slOn())return false;switch(a){
  case 'admsladd':var v=(document.getElementById('sl_newadmin')||{}).value;if(!v)return true;window.TLQ_AUTH.makeAdmin(v).then(function(){SL.admins=null;toast(at('saved'));render()},writeErr);return true;
  case 'admsldel':window.TLQ_AUTH.removeAdmin(id).then(function(){SL.admins=null;toast(at('saved'));render()},writeErr);return true}
  return false}
