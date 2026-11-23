/* =====================================================================
   SKILLS (สกิล) — 3 per class, unlocked at levels 5 / 15 / 30, upgraded to Lv5 with coins.
   Used in boss fights (weekly boss + event bosses): each skill once per boss.
   Also usable against tunnel monsters (no damage there: attack skills cut wrong options instead,
   and a used skill rests for the next 2 monster fights). Nothing in the ledger changes for that.
   Attack skills add bonus damage, defence/control skills help the player answer —
   the player must still pick the right answer. Rules + caps live in ledger.js (SK_DEF).
   ===================================================================== */
Object.assign(L,{
 sk_title:m('สกิลของฉัน','My skills','我的技能'),sk_open:m('สกิล','Skills','技能'),
 sk_sub:m('ปลดล็อกตามเลเวล · อัปสกิลด้วยเหรียญ · ใช้ได้สกิลละ 1 ครั้งต่อบอส · ตีมอนสเตอร์ในอุโมงค์ก็ใช้ได้ (ใช้แล้วพัก 2 ไฟต์)','Unlocked by level · upgrade with coins · each skill once per boss · also works on tunnel monsters (rests 2 fights after use)','按等级解锁 · 用金币升级 · 每个首领每技能限用1次 · 时空隧道打怪也能用(用后休息2场)'),
 sk_lv:m('Lv.{n}','Lv.{n}','Lv.{n}'),sk_lock:m('ปลดล็อกที่เลเวล {n}','Unlocks at level {n}','{n}级解锁'),sk_used:m('ใช้แล้ว','Used','已使用'),
 sk_up:m('อัปเป็น Lv.{n}','Upgrade to Lv.{n}','升到 Lv.{n}'),sk_max:m('เลเวลสูงสุดแล้ว','Max level','已满级'),sk_need:m('ต้องเลเวล {n}','Needs level {n}','需要{n}级'),
 sk_now:m('ตอนนี้','Now','当前'),sk_next:m('เลเวลถัดไป','Next level','下一级'),sk_upok:m('อัปสกิลแล้ว!','Skill upgraded!','技能已升级!'),sk_nocoin:m('เหรียญไม่พอ','Not enough coins','金币不足'),
 sk_bar:m('สกิล (แตะก่อนตอบ)','Skills (tap before answering)','技能(答题前点击)'),sk_shield:m('🛡️ โล่ใจกล้าป้องกันไว้! ตอบใหม่ได้','🛡️ Brave Shield! Try again','🛡️ 勇气之盾!再答一次'),
 sk_hint:m('คำใบ้','Hint','提示'),sk_bonus:m('ดาเมจสกิล','Skill damage','技能伤害'),
 sk_tnbar:m('สกิล (แตะก่อนตอบ · ใช้แล้วพัก 2 ไฟต์)','Skills (tap before answering · rests 2 fights after use)','技能(答题前点击 · 用后休息2场)'),sk_rest:m('พัก {n}','Rest {n}','休息{n}'),sk_tn:m('ตีมอนสเตอร์','Vs monsters','打怪'),
 sk_k_atk:m('โจมตี','Attack','攻击'),sk_k_def:m('ป้องกัน','Defence','防御'),sk_k_ctl:m('ควบคุม','Control','控制'),sk_k_ult:m('ท่าไม้ตาย','Ultimate','必杀')});
var SKN={
 sw1:m('ฟันสองจังหวะ','Double Slash','二连斩'),sw2:m('โล่ใจกล้า','Brave Shield','勇气之盾'),sw3:m('พายุดาบราชันย์','Royal Blade Storm','王者剑暴'),
 mg1:m('ตาทิพย์','Mystic Eye','天眼'),mg2:m('อุกกาบาตอาร์เคน','Arcane Meteor','奥术陨星'),mg3:m('สายฟ้าพิโรธ','Wrath of Thunder','雷霆之怒'),
 ar1:m('ยิงแม่นยำ','Eagle Aim','鹰眼瞄准'),ar2:m('ธนูต่อเนื่อง','Chain Volley','连珠箭'),ar3:m('ฝนธนูมังกร','Dragon Arrow Rain','龙之箭雨')};
/* effect numbers per level (must stay inside skMaxBonus in ledger.js) */
function skFx(id,lv){switch(id){
  case 'sw1':return {dmg:[0,1,1,2,2,3][lv],n:1};case 'sw3':return {dmg:lv>=4?2:1,n:lv>=5?4:3};
  case 'mg2':return {dmg:[0,2,2,3,3,4][lv],n:1};case 'mg3':return {dmg:lv>=5?3:2,n:lv>=4?3:2};
  case 'ar3':return {dmg:[0,3,3,4,4,5][lv],n:1};case 'ar2':return {combo:3,bonus:[0,2,2,3,3,4][lv]};
  case 'sw2':return {shield:lv>=5?2:1,cut:lv>=3?1:0};case 'mg1':return {cut:lv>=3?2:1,q:lv>=5?2:1};case 'ar1':return {hint:1,cut:lv>=3?1:0,q:lv>=5?2:1}}return {}}
function skDesc(id,lv){var f=skFx(id,lv),th,en,zh;
  if(f.dmg&&f.n===1){th='ข้อถัดไปถ้าตอบถูก ดาเมจ +'+f.dmg;en='Next correct answer deals +'+f.dmg+' damage';zh='下一题答对伤害 +'+f.dmg}
  else if(f.dmg){th='ตอบถูก '+f.n+' ข้อถัดไป ข้อละ +'+f.dmg+' ดาเมจ';en='Next '+f.n+' correct answers deal +'+f.dmg+' each';zh='接下来答对'+f.n+'题,每题 +'+f.dmg}
  else if(f.combo){th='ตอบถูกติดกัน 3 ข้อ ได้ดาเมจโบนัส +'+f.bonus;en='3 correct in a row: +'+f.bonus+' bonus damage';zh='连续答对3题:额外伤害 +'+f.bonus}
  else if(f.shield){th='ตอบผิดแล้วได้ตอบใหม่ '+f.shield+' ครั้ง'+(f.cut?' และตัดตัวเลือกผิดที่เลือกออก + อีก 1 ข้อ':'');en='A wrong answer gets '+f.shield+' retry'+(f.shield>1?'s':'')+(f.cut?', and removes one more wrong option':'');zh='答错可重答'+f.shield+'次'+(f.cut?',并多去掉1个错误选项':'')}
  else if(f.hint){th='ใบ้ตัวอักษรแรกและคำอ่าน'+(f.cut?' + ตัดตัวเลือกผิด 1 ข้อ':'')+(f.q>1?' (2 ข้อ)':'');en='Shows the first letter and reading'+(f.cut?' + removes 1 wrong option':'')+(f.q>1?' (2 questions)':'');zh='提示首字母和读音'+(f.cut?' + 去掉1个错误选项':'')+(f.q>1?'(2题)':'')}
  else{th='ตัดตัวเลือกผิด '+f.cut+' ข้อ'+(f.q>1?' (2 ข้อ)':'');en='Removes '+f.cut+' wrong option'+(f.cut>1?'s':'')+(f.q>1?' (2 questions)':'');zh='去掉'+f.cut+'个错误选项'+(f.q>1?'(2题)':'')}
  return m(th,en,zh)}
function skList(cls){return Object.keys(SK_DEF).filter(function(k){return SK_DEF[k].cls===cls})}
var SK_COL={atk:['#ff8a3d','#c2261b'],def:['#6ad0ff','#2456b8'],ctl:['#c08aff','#5a2aa8'],ult:['#ffe27a','#c8781a']};
var SK_GLYPH={
 sw1:'<path d="M14 40L40 14M20 44L44 20" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/><path d="M14 40L40 14" stroke="#ffe9b0" stroke-width="1.6" stroke-linecap="round"/>',
 sw2:'<path d="M29 12l14 5v11c0 9-6 15-14 19-8-4-14-10-14-19V17z" fill="#fff" fill-opacity=".92"/><path d="M29 18v24M21 27h16" stroke="#2456b8" stroke-width="3" stroke-linecap="round"/>',
 sw3:'<path d="M29 10l4 26h-8z" fill="#fff"/><rect x="21" y="35" width="16" height="4" rx="2" fill="#fff"/><rect x="27" y="39" width="4" height="9" rx="2" fill="#fff"/><g stroke="#fff6c8" stroke-width="2" stroke-linecap="round"><path d="M12 20l5 2M46 20l-5 2M14 32h5M44 32h-5"/></g>',
 mg1:'<circle cx="29" cy="29" r="16" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 3"/><path d="M15 29q14-13 28 0q-14 13-28 0z" fill="#fff"/><circle cx="29" cy="29" r="5" fill="#5a2aa8"/><circle cx="31" cy="27" r="1.6" fill="#fff"/>',
 mg2:'<path d="M12 12l16 8-3 3 8 8-3 3-8-8-3 3z" fill="#ffd6f8" opacity=".8"/><circle cx="37" cy="37" r="9" fill="#fff"/><circle cx="34" cy="34" r="3" fill="#c08aff"/>',
 mg3:'<path d="M33 8L17 32h10l-4 18 18-26H31z" fill="#fff" stroke="#fff6a0" stroke-width="1.5" stroke-linejoin="round"/>',
 ar1:'<circle cx="29" cy="29" r="14" fill="none" stroke="#fff" stroke-width="3"/><circle cx="29" cy="29" r="5" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M29 9v8M29 41v8M9 29h8M41 29h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
 ar2:'<g stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M12 22h28M12 30h28M12 38h28"/></g><g fill="#fff"><path d="M40 17l7 5-7 5zM40 25l7 5-7 5zM40 33l7 5-7 5z"/></g>',
 ar3:'<path d="M12 42c10-2 10-14 20-16s10-12 14-14" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><path d="M46 8l2 10-9-4z" fill="#fff"/><circle cx="18" cy="40" r="2.5" fill="#bfffe9"/><circle cx="26" cy="30" r="2" fill="#bfffe9"/>'};
function skIcon(id,sz,dim){var d=SK_DEF[id],c=SK_COL[d.k],u='ski'+id+(++AVSEQ);
  return '<svg class="sk-ic'+(dim?' dim':'')+'" viewBox="0 0 58 58" width="'+(sz||48)+'" height="'+(sz||48)+'" aria-hidden="true"><defs><linearGradient id="'+u+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient></defs>'+
   '<rect x="2" y="2" width="54" height="54" rx="14" fill="url(#'+u+')" stroke="#ffe39a" stroke-width="3"/><rect x="6" y="6" width="46" height="20" rx="9" fill="#fff" opacity=".18"/>'+SK_GLYPH[id]+'</svg>'}
function skCurLv(id){return skLv(S,id)}
/* ---------- skills screen (modal) ---------- */
function skModal(md){if(md.kind!=='skills')return null;var ids=skList(S.cls);
  return {wide:true,body:'<span class="eyebrow">🌟 '+esc(t('sk_title'))+'</span><h2 style="margin:0">'+esc(tx(CLASSES[S.cls].names))+'</h2><p class="mut" style="margin:0">'+esc(t('sk_sub'))+'</p><div class="sk-list">'+
   ids.map(function(id){var d=SK_DEF[id],lv=skCurLv(id),nl=lv+1,locked=!lv,req=lv&&nl<=5?skReq(id,nl):0,cost=nl<=5?SK_COST[nl]:0,canLv=lv&&nl<=5&&S.lvl>=req,canCoin=S.coin>=cost;
     return '<div class="sk-card k-'+d.k+(locked?' locked':'')+'">'+skIcon(id,58,locked)+'<div class="stack" style="gap:3px;min-width:0;flex:1"><div class="row" style="gap:6px;flex-wrap:wrap"><b>'+esc(tx(SKN[id]))+'</b><span class="tag">'+esc(t('sk_k_'+d.k))+'</span>'+(lv?'<span class="tag sk-lvtag">'+esc(t('sk_lv').replace('{n}',lv))+'</span>':'')+'</div>'+
      (locked?'<small class="mut">🔒 '+esc(t('sk_lock').replace('{n}',d.u))+'</small><small>'+esc(tx(skDesc(id,1)))+'</small>':
       '<small><b>'+esc(t('sk_now'))+':</b> '+esc(tx(skDesc(id,lv)))+'</small>'+(d.k==='atk'||d.k==='ult'?'<small class="mut">👾 '+esc(t('sk_tn'))+': '+esc(tx(skTnDesc(id,lv)))+'</small>':'')+(nl<=5?'<small class="mut"><b>'+esc(t('sk_next'))+':</b> '+esc(tx(skDesc(id,nl)))+'</small>':'')+
       '<div class="sk-pips">'+[1,2,3,4,5].map(function(k){return '<i class="'+(k<=lv?'on':'')+'"></i>'}).join('')+'</div>')+'</div>'+
      (locked?'':nl>5?'<span class="tag">'+esc(t('sk_max'))+'</span>':'<button class="btn sm'+(canLv&&canCoin?' gold':' sec')+'" data-act="skup" data-id="'+id+'"'+(canLv&&canCoin?'':' disabled')+'>⬆ '+esc(t('sk_up').replace('{n}',nl))+'<br><small>🪙 '+cost+(canLv?'':' · '+esc(t('sk_need').replace('{n}',req)))+'</small></button>')+'</div>'}).join('')+
   '</div><div class="row" style="justify-content:flex-end"><button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button></div>'}}
function skUpgrade(id){var lv=skCurLv(id),nl=lv+1;if(!lv||nl>5||SK_DEF[id].cls!==S.cls)return;if(S.lvl<skReq(id,nl)){toast(t('sk_need').replace('{n}',skReq(id,nl)));return}
  if(S.coin<SK_COST[nl]){toast(t('sk_nocoin'));return}commitEv({k:'skup',d:today(),sk:id,lv:nl,cost:SK_COST[nl]});save();sfx('lvl');toast('🌟 '+tx(SKN[id])+' Lv.'+nl+' — '+t('sk_upok'));render()}
/* ---------- in the boss fight ---------- */
function skUsedFor(rid){var r=(S.raid&&S.raid[rid])||{};return (r.su||[]).concat((RD.enc&&RD.enc.su)||[])}
function skBar(s){var ids=skList(S.cls);if(!ids.length)return '';var used=skUsedFor(s.rid);
  return '<div class="sk-bar"><small class="eyebrow">'+esc(t('sk_bar'))+'</small><div class="row" style="gap:8px">'+ids.map(function(id){var lv=skCurLv(id),u=used.indexOf(id)>=0,dis=!lv||u||s.picked!==null;
    return '<button class="sk-btn'+(u?' used':'')+(!lv?' locked':'')+'" data-act="skuse" data-id="'+id+'"'+(dis?' disabled':'')+' aria-label="'+esc(tx(SKN[id])+(lv?' Lv.'+lv:''))+'">'+skIcon(id,46,dis)+'<span class="sk-bl">'+(lv?esc(tx(SKN[id])):'🔒 Lv'+SK_DEF[id].u)+'</span>'+(lv?'<span class="sk-blv">'+(u?esc(t('sk_used')):'Lv.'+lv)+'</span>':'')+'</button>'}).join('')+
   '</div>'+(s.sb?'<small class="sk-sb">✨ '+esc(t('sk_bonus'))+' +'+s.sb+'</small>':'')+skActive(s)+'</div>'}
function skActive(s){var f=s.fx||{},a=[];(f.dmg||[]).forEach(function(x){if(x.left>0)a.push(tx(SKN[x.id])+' ×'+x.left)});if(f.combo)a.push(tx(SKN[f.combo.id])+' '+f.combo.got+'/3');if(f.shield&&f.shield.left>0)a.push(tx(SKN.sw2)+' ×'+f.shield.left);
  return a.length?'<small class="sk-act">⚡ '+esc(a.join(' · '))+'</small>':''}
function skCut(s,k){var q=s.qs[s.i];if(!q||!q.opts)return;var hid=s.hid[s.i]||[],wrong=[];for(var i=0;i<q.opts.length;i++)if(i!==q.ans&&hid.indexOf(i)<0)wrong.push(i);
  wrong=shuffle(wrong);while(k-->0&&wrong.length>1)hid.push(wrong.pop());s.hid[s.i]=hid}
function skPerQuestion(s){var f=s.fx||{};if(f.cutQ>0){skCut(s,f.cutK);f.cutQ--}if(f.hintQ>0){s.hint[s.i]=1;f.hintQ--}}
function skUse(id){var s=RD.enc;if(!s||s.picked!==null)return;var lv=skCurLv(id);if(!lv||SK_DEF[id].cls!==S.cls||skUsedFor(s.rid).indexOf(id)>=0)return;
  var f=skFx(id,lv);s.fx=s.fx||{dmg:[]};s.su.push(id);
  if(f.dmg)s.fx.dmg.push({id:id,per:f.dmg,left:f.n});
  else if(f.combo)s.fx.combo={id:id,got:0,bonus:f.bonus};
  else if(f.shield)s.fx.shield={left:f.shield,cut:f.cut};
  else{s.fx.cutK=f.cut;s.fx.cutQ=f.cut?f.q:0;s.fx.hintQ=f.hint?f.q:0;skPerQuestion(s)}
  s.vfx={id:id,k:Date.now()};sfx('lvl');render();setTimeout(function(){if(RD.enc===s&&s.vfx&&s.vfx.id===id){s.vfx=null}},1700)}
function skAfterAnswer(s,ok){var f=s.fx||{},bonus=0;
  if(ok){var d=(f.dmg||[]).filter(function(x){return x.left>0})[0];if(d){bonus+=d.per;d.left--}
    if(f.combo){f.combo.got++;if(f.combo.got>=3){bonus+=f.combo.bonus;f.combo=null}}}
  else if(f.combo)f.combo=null;
  if(bonus){var cap=s.su.reduce(function(a,id){return a+skMaxBonus(id,skCurLv(id))},0);bonus=Math.max(0,Math.min(bonus,Math.min(cap,SK_SBMAX)-s.sb))}
  s.sb+=bonus;s.pop=ok?1+bonus:0}
function skStamp(e,s){if(s.su&&s.su.length){e.su=s.su.slice();var cap=s.su.reduce(function(a,id){return a+skMaxBonus(id,skLv(S,id))},0);e.sb=Math.max(0,Math.min(s.sb|0,cap,SK_SBMAX))}}
function skOpts(s,html){var hid=(s.hid||{})[s.i]||[];hid.forEach(function(i){html=html.replace('class="opt" data-act="rdans" data-id="'+i+'"','class="opt sk-gone" data-act="rdans" data-id="'+i+'" disabled')});return html}
function skHintHtml(s,q){if(!(s.hint||{})[s.i]||s.picked!==null)return '';var lab=plainLabel(q.w,q.to)||'',first=Array.from(lab)[0]||'',rd=q.to==='zh'&&q.w.py?q.w.py:'';
  return '<div class="sk-hint">🏹 '+esc(t('sk_hint'))+': <b>'+esc(first)+'…</b>'+(rd?' <span class="lt-zh">('+esc(rd)+')</span>':'')+'</div>'}
/* VFX: one drawn burst per skill, played over the arena */
var SK_VFX={
 sw1:'<g class="v-slash"><path d="M40 20Q60 50 92 70" stroke="#fff6c8" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M44 72Q66 46 96 30" stroke="#ffd36b" stroke-width="5" fill="none" stroke-linecap="round"/></g>',
 sw2:'<g class="v-shield"><path d="M20 22l12-7 12 7v14l-12 7-12-7z" fill="#6ad0ff" fill-opacity=".25" stroke="#bfefff" stroke-width="2"/><path d="M14 18l18-10 18 10v20l-18 10-18-10z" fill="none" stroke="#6ad0ff" stroke-width="1.5" opacity=".7"/></g>',
 sw3:'<g class="v-bigsword"><path d="M80 -6l5 40h-10z" fill="#fff6c8" stroke="#ffd36b" stroke-width="1.5"/><rect x="71" y="33" width="18" height="4" rx="2" fill="#ffd36b"/><g stroke="#ffe27a" stroke-width="2" opacity=".9"><path d="M80 56l-14 8M80 56l14 8M80 56v14M80 56l-18 -2M80 56l18 -2"/></g></g>',
 mg1:'<g class="v-circle"><circle cx="30" cy="40" r="20" fill="none" stroke="#c08aff" stroke-width="2" stroke-dasharray="5 4"/><circle cx="30" cy="40" r="13" fill="none" stroke="#e8d0ff" stroke-width="1.5"/><path d="M20 40q10-9 20 0q-10 9-20 0z" fill="#e8d0ff"/></g>',
 mg2:'<g class="v-meteor"><path d="M10 0L70 50" stroke="#ff9ae8" stroke-width="8" stroke-linecap="round" opacity=".45"/><circle cx="74" cy="54" r="9" fill="#fff" stroke="#c08aff" stroke-width="3"/></g><g class="v-burst"><circle cx="80" cy="58" r="16" fill="#ff9ae8" opacity=".5"/><circle cx="80" cy="58" r="8" fill="#fff"/></g>',
 mg3:'<g class="v-bolt"><path d="M84 0L74 26h10L70 60l22-34H80l8-26z" fill="#fff6a0" stroke="#a87aff" stroke-width="2"/><path d="M66 6l-6 16h7l-9 22" stroke="#e8d0ff" stroke-width="2" fill="none"/></g>',
 ar1:'<g class="v-aim"><circle cx="80" cy="50" r="18" fill="none" stroke="#7dffb0" stroke-width="2.5"/><circle cx="80" cy="50" r="6" fill="none" stroke="#7dffb0" stroke-width="2"/><path d="M80 26v10M80 64v10M56 50h10M94 50h10" stroke="#7dffb0" stroke-width="2.5"/></g>',
 ar2:'<g class="v-arrows"><path class="a1" d="M20 40h22l-4-3m4 3l-4 3" stroke="#fff" stroke-width="2.5" fill="none"/><path class="a2" d="M20 48h22l-4-3m4 3l-4 3" stroke="#fff" stroke-width="2.5" fill="none"/><path class="a3" d="M20 56h22l-4-3m4 3l-4 3" stroke="#fff" stroke-width="2.5" fill="none"/></g>',
 ar3:'<g class="v-dragon"><path d="M10 70C30 40 50 80 70 50S90 30 96 44" stroke="#7de8ff" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="160" stroke-dashoffset="160"/><path d="M96 44l-8-2 4 8z" fill="#fff"/></g>'};
function skVfx(s){if(!s.vfx||Date.now()-s.vfx.k>1600)return '';var id=s.vfx.id,c=SK_COL[SK_DEF[id].k];
  return '<div class="sk-vfx" aria-hidden="true"><svg viewBox="0 0 110 80" preserveAspectRatio="none">'+SK_VFX[id]+'</svg><span class="sk-vname" style="--c1:'+c[0]+';--c2:'+c[1]+'">'+esc(tx(SKN[id]))+'!</span></div>'}
function skillsAct(a,id){switch(a){case 'skills':UI.modal={kind:'skills'};render();return true;case 'skup':skUpgrade(id);return true;case 'skuse':skUse(id);return true;case 'sktnuse':skTnUse(id);return true}return false}
/* ---------- against tunnel monsters / tunnel bosses ---------- */
var SK_TN_CD=3;
function skTnFx(id,lv){var k=SK_DEF[id].k;if(k==='atk')return {cut:1,q:lv>=4?2:1};if(k==='ult')return {cut:2,q:lv>=5?3:2};return skFx(id,lv)}
function skTnDesc(id,lv){var f=skTnFx(id,lv);if(f.shield||f.hint||SK_DEF[id].k==='ctl')return skDesc(id,lv);
  return m('ตัดตัวเลือกผิด '+f.cut+' ข้อ'+(f.q>1?' ('+f.q+' ข้อ)':''),'Removes '+f.cut+' wrong option'+(f.cut>1?'s':'')+(f.q>1?' ('+f.q+' questions)':''),'去掉'+f.cut+'个错误选项'+(f.q>1?'('+f.q+'题)':''))}
function skTnOk(s){return !!(s&&s.qs&&s.qs.every(function(q){return q.type!=='mcq'&&Array.isArray(q.opts)&&typeof q.ans==='number'}))}
function skTnCd(id){return ((TN.skcd||{})[id])|0}
function skTnBar(s){var ids=skList(S.cls);if(!ids.length)return '';
  return '<div class="sk-bar"><small class="eyebrow">'+esc(t('sk_tnbar'))+'</small><div class="row" style="gap:8px">'+ids.map(function(id){var lv=skCurLv(id),u=(s.su||[]).indexOf(id)>=0,cd=skTnCd(id),dis=!lv||u||cd>0||s.picked!==null;
    return '<button class="sk-btn'+(u||cd?' used':'')+(!lv?' locked':'')+'" data-act="sktnuse" data-id="'+id+'"'+(dis?' disabled':'')+' title="'+esc(lv?tx(skTnDesc(id,lv)):'')+'" aria-label="'+esc(tx(SKN[id])+(lv?' Lv.'+lv:''))+'">'+skIcon(id,46,dis)+'<span class="sk-bl">'+(lv?esc(tx(SKN[id])):'🔒 Lv'+SK_DEF[id].u)+'</span>'+(lv?'<span class="sk-blv">'+(u?esc(t('sk_used')):cd?esc(t('sk_rest').replace('{n}',cd)):'Lv.'+lv)+'</span>':'')+'</button>'}).join('')+
   '</div>'+skActive(s)+'</div>'}
function skTnOpts(s,html){var hid=(s.hid||{})[s.i]||[];hid.forEach(function(i){html=html.replace('class="opt" data-act="tnans" data-id="'+i+'"','class="opt sk-gone" data-act="tnans" data-id="'+i+'" disabled')});return html}
function skTnUse(id){var s=TN.enc;if(!skTnOk(s)||s.picked!==null)return;var lv=skCurLv(id);if(!lv||SK_DEF[id].cls!==S.cls||(s.su||[]).indexOf(id)>=0||skTnCd(id)>0)return;
  var f=skTnFx(id,lv);s.fx=s.fx||{dmg:[]};s.su=s.su||[];s.hid=s.hid||{};s.hint=s.hint||{};s.su.push(id);
  if(f.shield)s.fx.shield={left:f.shield,cut:f.cut};
  else{if(f.cut){s.fx.cutK=Math.max(s.fx.cutQ>0?s.fx.cutK|0:0,f.cut);s.fx.cutQ=Math.max(s.fx.cutQ|0,f.q)}if(f.hint)s.fx.hintQ=Math.max(s.fx.hintQ|0,f.q);skPerQuestion(s)}
  s.vfx={id:id,k:Date.now()};sfx('lvl');render();setTimeout(function(){if(TN.enc===s&&s.vfx&&s.vfx.id===id){s.vfx=null;render()}},1700)}
(function(){
  var E=tnEncounter;tnEncounter=function(kind,mi){E(kind,mi);var s=TN.enc;if(s&&!s.fx){s.fx={dmg:[]};s.su=[];s.hid={};s.hint={}}};
  var A=tnAnswer;tnAnswer=function(idx){var s=TN.enc;if(!s||s.picked!==null)return;var q=s.qs[s.i];
    if(skTnOk(s)&&idx!==q.ans&&s.fx&&s.fx.shield&&s.fx.shield.left>0){s.fx.shield.left--;var h=s.hid[s.i]||[];h.push(idx);s.hid[s.i]=h;if(s.fx.shield.cut)skCut(s,1);s.vfx={id:'sw2',k:Date.now()};toast(t('sk_shield'));sfx('ng');render();return}
    A(idx)};
  var N=tnNext;tnNext=function(){var s=TN.enc,i0=s&&s.i;N();var s2=TN.enc;if(s2&&s2===s&&s2.i!==i0&&skTnOk(s2)){skPerQuestion(s2);render()}};
  var F=tnFinish;tnFinish=function(){var s=TN.enc,cd=TN.skcd=TN.skcd||{};Object.keys(cd).forEach(function(k){if(cd[k]>0)cd[k]--});if(s&&s.su)s.su.forEach(function(id){cd[id]=SK_TN_CD-1});F()};
})();
/* hook the boss fight */
(function(){
  var J=rdJoin;rdJoin=function(){J();var s=RD.enc;if(s&&!s.fx){s.fx={dmg:[]};s.su=[];s.sb=0;s.hid={};s.hint={}}};
  var A=rdAnswer;rdAnswer=function(idx){var s=RD.enc;if(!s||s.picked!==null)return;var q=s.qs[s.i],ok=idx===q.ans;s.fx=s.fx||{dmg:[]};s.hid=s.hid||{};s.hint=s.hint||{};s.su=s.su||[];s.sb=s.sb||0;
    if(!ok&&s.fx.shield&&s.fx.shield.left>0){s.fx.shield.left--;var h=s.hid[s.i]||[];h.push(idx);s.hid[s.i]=h;if(s.fx.shield.cut)skCut(s,1);s.vfx={id:'sw2',k:Date.now()};toast(t('sk_shield'));sfx('ng');render();return}
    A(idx);skAfterAnswer(s,ok);render()};
  var N=rdNext;rdNext=function(){var s=RD.enc,i0=s&&s.i;N();var s2=RD.enc;if(s2&&s2===s&&s2.i!==i0){s2.pop=0;skPerQuestion(s2);render()}};
})();
