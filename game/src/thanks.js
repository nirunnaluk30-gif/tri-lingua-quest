/* =====================================================================
   THANKS BOARD (ทำเนียบผู้ร่วมสร้าง) — a thank-you wall, not a spending ranking.
   settings/thanks: {sup:[{u,n,ts,t}], help:[{id,n,note,t}], hid:{uid:1}} (admin writes, all read).
   · Supporters appear only if they ticked "show my name" when sending the top-up,
     and only after the teacher approves it. No amounts, no counts, ordered by when they joined.
   · Helpers (bug reports, testing…) are added by hand by the teacher.
   · The teacher can hide anyone (hidden people are not re-added by later top-ups).
   ===================================================================== */
Object.assign(L,{th_title:m('🤝 ทำเนียบผู้ร่วมสร้าง TRI-LINGUA','🤝 TRI-LINGUA Co-creators','🤝 TRI-LINGUA 共建者名录'),
 th_thanks:m('ขอบคุณทุกคนที่ร่วมสร้างเกมนี้','Thank you to everyone who helps build this game','感谢每一位共建这款游戏的人'),
 th_note:m('การสนับสนุนเป็นความสมัครใจ ไม่มีการบังคับ · เงินทุกบาทใช้พัฒนาระบบและเป็นค่าเซิร์ฟเวอร์ของเกม · ไม่สนับสนุนก็เรียนและเล่นได้ครบทุกอย่าง · ของที่ได้เป็นของตกแต่งเท่านั้น ไม่เพิ่มคะแนนหรืออันดับการเรียน · รายชื่อเรียงตามลำดับที่เข้ามาร่วม และแสดงเฉพาะคนที่อนุญาตให้แสดงชื่อ',
   'Support is voluntary, never required · every baht goes to developing the game and paying for its server · without supporting you can still learn and play everything · rewards are decorations only and never add to scores or learning ranks · names are listed in the order people joined, and only for those who agreed to be shown',
   '支持完全自愿,绝不强制 · 每一铢都用于开发系统和支付服务器费用 · 不支持也能完整学习和游玩 · 获得的只是装饰,不增加分数或学习排名 · 名单按加入顺序排列,只显示同意公开的人'),
 th_sup:m('💛 ผู้สนับสนุน','💛 Supporters','💛 支持者'),th_help:m('🛠️ ผู้ช่วยทดสอบ/แจ้งบั๊ก','🛠️ Testers & bug reporters','🛠️ 测试与报错帮手'),
 th_empty:m('ยังไม่มีรายชื่อ','No names yet','暂无名单'),th_more:m('ดูทั้งหมด ({n})','Show all ({n})','查看全部({n})'),
 th_show:m('🤝 แสดงชื่อของฉันในทำเนียบผู้ร่วมสร้าง (ไม่แสดงจำนวนเงิน)','🤝 Show my name on the Co-creators board (no amounts shown)','🤝 在共建者名录中显示我的名字(不显示金额)')});
var TH={cfg:{sup:[],help:[],hid:{}},unsub:null,all:false};
function cleanThanks(o){o=isO(o)?o:{};var c={sup:[],help:[],hid:{}};
  if(Array.isArray(o.sup))c.sup=o.sup.filter(function(x){return isO(x)&&IDRE.test(x.u||'')}).slice(0,500).map(function(x){return {u:x.u,n:str(x.n,16),ts:(Array.isArray(x.ts)?x.ts:[]).filter(function(i){return typeof i==='string'&&/^[a-z0-9]{2,12}$/.test(i)}).slice(0,6),t:int(x.t,0,9e15,0)}});
  if(Array.isArray(o.help))c.help=o.help.filter(isO).slice(0,300).map(function(x,i){return {id:IDRE.test(x.id||'')?x.id:'h'+i,n:str(x.n,24),note:str(x.note,40),t:int(x.t,0,9e15,0)}}).filter(function(x){return x.n});
  if(isO(o.hid))Object.keys(o.hid).forEach(function(k){if(IDRE.test(k)&&o.hid[k]===1)c.hid[k]=1});return c}
function startThanks(){if(TH.unsub||!CL.db)return;TH.unsub=CL.db.doc('settings/thanks').onSnapshot(function(d){var c=cleanThanks(d.exists?d.data():{}),j=JSON.stringify(c);if(j===TH.j)return;TH.j=j;TH.cfg=c;softRender()},function(){})}
function thTitle(id){var T=TITLE[id];return T?tx(T.names):''}
function thanksHtml(){startThanks();var c=TH.cfg,sup=c.sup.filter(function(x){return !c.hid[x.u]}).sort(function(a,b){return a.t-b.t}),help=c.help.slice().sort(function(a,b){return a.t-b.t});
  if(!sup.length&&!help.length)return '';var lim=TH.all?1e9:24;
  var chip=function(n,sub,me){return '<span class="th-chip'+(me?' me':'')+'"><b>'+esc(n)+'</b>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span>'};
  return '<section class="panel stack th-board"><div class="stack" style="gap:2px"><span class="eyebrow">'+esc(t('th_title'))+'</span><b>'+esc(t('th_thanks'))+'</b></div>'+
   (sup.length?'<div class="stack" style="gap:6px"><small class="th-h">'+esc(t('th_sup'))+'</small><div class="th-wall">'+sup.slice(0,lim).map(function(x){return chip(x.n,x.ts.map(thTitle).filter(Boolean).slice(-1)[0]||'',x.u===CL.uid)}).join('')+'</div></div>':'')+
   (help.length?'<div class="stack" style="gap:6px"><small class="th-h">'+esc(t('th_help'))+'</small><div class="th-wall">'+help.slice(0,lim).map(function(x){return chip(x.n,x.note)}).join('')+'</div></div>':'')+
   (!TH.all&&(sup.length>lim||help.length>lim)?'<button class="btn sec sm" data-act="thall">'+esc(t('th_more').replace('{n}',sup.length+help.length))+'</button>':'')+
   '<small class="mut th-note">'+esc(t('th_note'))+'</small></section>'}
/* teacher side: called after a top-up is approved */
function thAddSupporter(u,name,title){if(!CL.admin||!CL.db||!IDRE.test(u||''))return Promise.resolve();var ref=CL.db.doc('settings/thanks');
  return retry(function(){return ref.get().then(function(d){var c=cleanThanks(d.exists?d.data():{});if(c.hid[u])return;var e=c.sup.filter(function(x){return x.u===u})[0];
    if(!e){e={u:u,n:str(name,16),ts:[],t:Date.now()};c.sup.push(e)}else e.n=str(name,16)||e.n;if(title&&e.ts.indexOf(title)<0)e.ts.push(title);return ref.set(JSON.parse(JSON.stringify(c)))})})}
function thSave(mut){var ref=CL.db.doc('settings/thanks');return retry(function(){return ref.get().then(function(d){var c=cleanThanks(d.exists?d.data():{});mut(c);return ref.set(JSON.parse(JSON.stringify(c)))})}).then(function(){toast(at('saved'))},writeErr)}
function thAL(){if(thAL.d)return;thAL.d=1;Object.assign(AL,{th_adm:m('🤝 ทำเนียบผู้ร่วมสร้าง','🤝 Co-creators board','🤝 共建者名录'),
  th_admh:m('ผู้สนับสนุนจะขึ้นเองเมื่อครูอนุมัติคำขอที่นักเรียนติ๊กยินยอมแสดงชื่อ · ไม่แสดงจำนวนเงิน · ซ่อนใครก็ได้ คนที่ถูกซ่อนจะไม่ถูกเพิ่มกลับเอง','Supporters appear when you approve a request where the student agreed to be shown · no amounts · hidden people are not re-added automatically','学生同意公开且老师批准后自动上榜 · 不显示金额 · 被隐藏者不会自动重新加入'),
  th_hide:m('ซ่อน','Hide','隐藏'),th_unhide:m('แสดงอีกครั้ง','Show again','重新显示'),th_hidden:m('ซ่อนอยู่','Hidden','已隐藏'),th_del:m('ลบ','Remove','删除'),
  th_addh:m('เพิ่มผู้ช่วยทดสอบ/แจ้งบั๊ก','Add a tester / bug reporter','添加测试/报错帮手'),th_hn:m('ชื่อ','Name','名字'),th_hnote:m('ช่วยเรื่องอะไร (ไม่บังคับ)','What they helped with (optional)','帮了什么(可选)'),th_add:m('เพิ่ม','Add','添加')})}
function admThanks(){thAL();startThanks();var c=TH.cfg,hidU=Object.keys(c.hid);
  return '<section class="panel stack"><h2 style="font-size:20px">'+at('th_adm')+'</h2><small class="mut">'+at('th_admh')+'</small>'+
   '<b>'+esc(t('th_sup'))+' <span class="mut num">'+c.sup.length+'</span></b>'+(c.sup.length?c.sup.slice().sort(function(a,b){return a.t-b.t}).map(function(x){var h=!!c.hid[x.u];return '<div class="mkrow"><span class="ginm"><b>'+esc(x.n)+'</b><small class="mut">'+esc(x.ts.map(thTitle).filter(Boolean).join(' · ')||'—')+(h?' · '+at('th_hidden'):'')+'</small></span><button class="mini'+(h?'':' danger')+'" data-act="'+(h?'admthunhide':'admthhide')+'" data-id="'+esc(x.u)+'">'+at(h?'th_unhide':'th_hide')+'</button></div>'}).join(''):'<div class="empty">'+esc(t('th_empty'))+'</div>')+
   (hidU.filter(function(u){return !c.sup.some(function(x){return x.u===u})}).length?'<small class="mut">'+at('th_hidden')+': '+hidU.filter(function(u){return !c.sup.some(function(x){return x.u===u})}).map(function(u){return '<button class="mini" data-act="admthunhide" data-id="'+esc(u)+'">'+esc(u.slice(0,6))+'… '+at('th_unhide')+'</button>'}).join(' ')+'</small>':'')+
   '<b>'+esc(t('th_help'))+' <span class="mut num">'+c.help.length+'</span></b>'+c.help.map(function(x){return '<div class="mkrow"><span class="ginm"><b>'+esc(x.n)+'</b><small class="mut">'+esc(x.note||'—')+'</small></span><button class="mini danger" data-act="admthdel" data-id="'+esc(x.id)+'">'+at('th_del')+'</button></div>'}).join('')+
   '<div class="row mkform" style="gap:8px;flex-wrap:wrap"><input id="th_hn" maxlength="24" placeholder="'+esc(at('th_hn'))+'" style="flex:1;min-width:120px"><input id="th_hnote" maxlength="40" placeholder="'+esc(at('th_hnote'))+'" style="flex:2;min-width:160px"><button class="btn sm" data-act="admthadd">➕ '+at('th_addh')+'</button></div></section>'}
function thanksAct(a,id){switch(a){
  case 'thall':TH.all=true;render();return true;
  case 'admthhide':if(!CL.admin||!IDRE.test(id||''))return true;thSave(function(c){c.hid[id]=1});return true;
  case 'admthunhide':if(!CL.admin||!IDRE.test(id||''))return true;thSave(function(c){delete c.hid[id]});return true;
  case 'admthdel':if(!CL.admin)return true;thSave(function(c){c.help=c.help.filter(function(x){return x.id!==id})});return true;
  case 'admthadd':if(!CL.admin)return true;var n=str((document.getElementById('th_hn')||{}).value,24).trim(),no=str((document.getElementById('th_hnote')||{}).value,40).trim();if(!n)return true;
    thSave(function(c){c.help.push({id:'h'+Date.now().toString(36),n:n,note:no,t:Date.now()})});return true}
  return false}
