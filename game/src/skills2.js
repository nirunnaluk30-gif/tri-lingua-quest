/* =====================================================================
   SKILL TREES v2 (2026-11-23) — 33 skills. Base skill at level 5, then at
   15 / 25 / 35 / 40 / 60 the player picks branch A or B. Every skill hits
   the boss (damage on the next right answer) and adds its own extra.
   Rules and caps: ledger.js (SK_DEF, skMaxBonus, 'skbr'). Effects here are
   cosmetic + the in-fight helpers; the ledger checks every number.
   Visual effects: a canvas particle layer over the page (glow, fire, smoke,
   sparks with gravity, shock rings, trauma shake, short hit-stop), richer
   at every tier; level 60 plays a short god scene.
   ===================================================================== */
Object.assign(SKN,{
 swa1:m('ฟันทะลวงเกราะ','Armor-Piercing Slash','破甲斩'),swa2:m('ดาบเพลิงสุริยัน','Solar Flame Blade','烈阳火剑'),swa3:m('จันทราเสี้ยวพิฆาต','Crescent Moon Strike','新月斩'),swa5:m('ดาบเทพสังหารสวรรค์','Heaven-Slaying Sword','弑天神剑'),
 swb2:m('ค้อนศักดิ์สิทธิ์','Holy Hammer','圣锤'),swb3:m('เกราะสะท้อน','Mirror Armor','反射铠甲'),swb4:m('ป้อมปราการทองคำ','Golden Fortress','黄金堡垒'),swb5:m('อัศวินเทพพิทักษ์','Divine Guardian Knight','神圣守护骑士'),
 mga2:m('พายุน้ำแข็ง','Ice Storm','冰暴'),mga3:m('เปลวเพลิงมังกร','Dragon Flame','龙焰'),mga5:m('ดาวตกล้างโลก','World-Ending Meteor','灭世流星'),
 mgb1:m('กระจกความจำ','Memory Mirror','记忆之镜'),mgb2:m('คัมภีร์แห่งปัญญา','Tome of Wisdom','智慧之书'),mgb3:m('วงเวทผนึก','Sealing Circle','封印法阵'),mgb4:m('ห้วงเวลาหยุดนิ่ง','Time Stop','时间静止'),mgb5:m('ปราชญ์แห่งสามภาษา','Sage of Three Tongues','三语贤者'),
 ara2:m('ธนูอัคคี','Fire Arrow','火焰箭'),ara3:m('ศรสายลมกรด','Gale Arrow','疾风箭'),ara5:m('ศรเทพพิฆาตดารา','Star-Slaying Arrow','弑星神箭'),
 arb1:m('ลูกศรนำทาง','Guiding Arrow','引导之箭'),arb2:m('เหยี่ยวสอดแนม','Scout Hawk','侦察鹰'),arb3:m('กับดักเถาวัลย์','Vine Trap','藤蔓陷阱'),arb4:m('เหยี่ยวพิทักษ์','Guardian Hawk','守护鹰'),arb5:m('ราชาเหยี่ยวทองคำ','Golden Hawk King','黄金鹰王')});
var SK_BRN={sword:{A:m('ดาบพิฆาต','Slayer','杀戮之剑'),B:m('อัศวินพิทักษ์','Guardian Knight','守护骑士')},mage:{A:m('อาร์เคนพิโรธ','Arcane Wrath','奥术之怒'),B:m('ปราชญ์ตาทิพย์','Mystic Sage','天眼贤者')},archer:{A:m('ฝนธนู','Arrow Storm','箭雨'),B:m('พรานเหยี่ยว','Hawk Ranger','鹰之猎人')}};
Object.assign(L,{
 sk2_sub:m('เลเวล 5 ได้สกิลพื้นฐาน · ที่เลเวล 15 25 35 40 60 เลือกได้ 1 สาย · ทุกสกิลลดเลือดบอส + มีความสามารถพิเศษ · อัปด้วยเหรียญถึง Lv.5','Base skill at level 5 · at 15, 25, 35, 40 and 60 pick one branch · every skill hits the boss and has an extra · upgrade with coins to Lv.5','5级获得基础技能 · 15/25/35/40/60级选择一条分支 · 每个技能都能伤害首领并附带特效 · 用金币升到 Lv.5'),
 sk2_pick:m('เลือกสายนี้','Pick this','选择'),sk2_picked:m('สายที่เลือก','Picked','已选择'),sk2_change:m('เปลี่ยนมาสายนี้ · 🪙 {n}','Switch to this · 🪙 {n}','切换到此 · 🪙 {n}'),sk2_week:m('เปลี่ยนสายได้สัปดาห์ละครั้ง','You can switch once a week','每周可切换一次'),
 sk2_choose:m('ถึงเลเวลแล้ว เลือกสายสกิลได้ที่ปุ่ม "สกิล"','New skill unlocked — pick a branch under "Skills"','新技能已解锁 — 在"技能"中选择分支'),sk2_tier:m('เลเวล {n}','Level {n}','{n}级'),sk2_base:m('สกิลพื้นฐาน','Base skill','基础技能'),
 sk2_d:m('ลดเลือดบอส {n} เมื่อตอบถูกข้อถัดไป','Next right answer hits for {n}','下一题答对造成 {n} 伤害'),
 sk2_pierce:m('ข้อต่อจากนั้นถ้าถูก +{n}','the answer after that +{n}','再下一题答对 +{n}'),sk2_burn:m('เผาไหม้: {n} ข้อถัดไป ถ้าถูก ข้อละ +1','burn: +1 on each of the next {n} right answers','灼烧:接下来{n}题答对各 +1'),
 sk2_streak:m('{n} ข้อถัดไป ถ้าถูก ข้อละ +{k}','+{k} on each of the next {n} right answers','接下来{n}题答对各 +{k}'),sk2_combo:m('ถูกติดกัน {n} ข้อ +{k}','{n} right in a row: +{k}','连续答对{n}题 +{k}'),
 sk2_rest:m('ทุกข้อที่ถูกจนจบรอบ +1 (สูงสุด {n})','+1 on every right answer to the end (up to {n})','之后每答对一题 +1(最多{n})'),sk2_double:m('ดาเมจข้อนั้น ×2','that hit counts twice','该次伤害 ×2'),
 sk2_shield:m('ตอบผิดได้ตอบใหม่ {n} ครั้ง','{n} retry after a wrong answer','答错可重答{n}次'),sk2_cut:m('ตัดตัวเลือกผิด {n} ตัว','removes {n} wrong option(s)','去掉{n}个错误选项'),sk2_hint:m('คำใบ้ {n} ข้อ','a hint on {n} question(s)','{n}题提示'),
 sk2_charge:m('ตอบถูก 1 ข้อก่อน แล้วจึงใช้สกิลได้','Answer one right first to charge a skill','先答对一题才能使用技能'),sk2_ready:m('⚡ สกิลพร้อมใช้ 1 ครั้ง','⚡ One skill charged','⚡ 已充能1次'),sk2_wait:m('🔋 ตอบถูกเพื่อชาร์จสกิล','🔋 Answer right to charge a skill','🔋 答对即可充能'),
 sk2_nobr:m('ยังไม่ได้เลือกสาย','No branch picked yet','尚未选择分支')});
var SK_TID={sword:[['sw1'],['swa1','sw2'],['swa2','swb2'],['swa3','swb3'],['sw3','swb4'],['swa5','swb5']],mage:[['mg1'],['mg2','mgb1'],['mga2','mgb2'],['mga3','mgb3'],['mg3','mgb4'],['mga5','mgb5']],archer:[['ar1'],['ar2','arb1'],['ara2','arb2'],['ara3','arb3'],['ar3','arb4'],['ara5','arb5']]};
/* skills that fight now: base + the picked branch at each tier */
skList=function(cls){var T=SK_TID[cls]||[],out=[];T.forEach(function(r,t){if(!t)out.push(r[0]);else{var b=(S.skb||{})[t];if(b)out.push(r[b==='A'?0:1])}});return out};
skDesc=function(id,lv){var d=SK_DEF[id],x=d.x||{},parts=[[ 'sk2_d',{n:skDmg(id,lv||1)}]];
  if(x.pierce)parts.push(['sk2_pierce',{n:x.pierce}]);if(x.burn)parts.push(['sk2_burn',{n:x.burn}]);if(x.streak)parts.push(['sk2_streak',{n:x.streak[0],k:x.streak[1]}]);if(x.combo)parts.push(['sk2_combo',{n:x.combo[0],k:x.combo[1]}]);
  if(x.rest)parts.push(['sk2_rest',{n:x.rest}]);if(x.double)parts.push(['sk2_double',{}]);if(x.shield)parts.push(['sk2_shield',{n:x.shield}]);if(x.cut)parts.push(['sk2_cut',{n:x.cut}]);if(x.hint)parts.push(['sk2_hint',{n:x.hint}]);
  var o={};LANGS.forEach(function(l){o[l]=parts.map(function(p){var s=L[p[0]][l]||L[p[0]].en;Object.keys(p[1]).forEach(function(k){s=s.split('{'+k+'}').join(p[1][k])});return s}).join(' · ')});return o};
SK_COL.ult=['#ffe27a','#c8781a'];SK_COL.god=['#fff2b0','#9a6206'];
(function(){var G={
 slash:'<path d="M14 42L42 14M20 46L46 20" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>',fire:'<path d="M29 10c8 10 14 16 10 26-2 6-8 10-10 10s-8-4-10-10c-2-8 4-10 6-16 2 6 4 6 4 0z" fill="#fff"/>',
 moon:'<path d="M36 10a19 19 0 1 0 10 30a15 15 0 1 1-10-30z" fill="#fff"/>',god:'<path d="M29 6l5 30h-10z" fill="#fff"/><rect x="18" y="35" width="22" height="5" rx="2" fill="#fff"/><circle cx="29" cy="29" r="20" fill="none" stroke="#fff6c8" stroke-width="2" stroke-dasharray="3 4"/>',
 hammer:'<rect x="14" y="12" width="30" height="14" rx="3" fill="#fff"/><rect x="26" y="26" width="6" height="22" rx="3" fill="#fff"/>',mirror:'<path d="M29 10l14 6v12c0 9-6 15-14 19-8-4-14-10-14-19V16z" fill="none" stroke="#fff" stroke-width="3"/><path d="M22 30l14-10" stroke="#fff" stroke-width="3"/>',
 fort:'<path d="M12 46V22h6v6h6v-6h10v6h6v-6h6v24z" fill="#fff"/>',ice:'<path d="M29 8v42M11 18l36 22M11 40l36-22" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>',
 star:'<path d="M29 8l6 14 15 1-12 10 4 15-13-8-13 8 4-15-12-10 15-1z" fill="#fff"/>',book:'<path d="M12 16q9-4 17 0v30q-8-4-17 0zM46 16q-9-4-17 0v30q8-4 17 0z" fill="#fff"/>',
 seal:'<circle cx="29" cy="29" r="16" fill="none" stroke="#fff" stroke-width="3"/><path d="M29 13l14 24H15z" fill="none" stroke="#fff" stroke-width="2.5"/>',clock:'<circle cx="29" cy="29" r="16" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M29 18v12l8 5" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>',
 glyph:'<text x="29" y="37" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">ก A 中</text>',farrow:'<path d="M12 44L42 14M42 14l-12 2M42 14l-2 12" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M16 40c-4 0-6-4-4-8" stroke="#ffe0b0" stroke-width="3" fill="none"/>',
 wind:'<path d="M10 22h26a6 6 0 1 0-6-6M10 32h32a6 6 0 1 1-6 6M10 42h18" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/>',hawk:'<path d="M8 28q12-14 21 0q9-14 21 0q-10-4-21 6q-11-10-21-6z" fill="#fff"/>',
 vine:'<path d="M29 50c0-12-12-14-12-26s12-10 12-16M29 50c0-10 12-12 12-22" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="17" cy="24" r="4" fill="#fff"/><circle cx="41" cy="28" r="4" fill="#fff"/>',
 crown:'<path d="M10 42l4-24 9 10 6-14 6 14 9-10 4 24z" fill="#fff"/>'};
 Object.assign(SK_GLYPH,{swa1:G.slash,swa2:G.fire,swa3:G.moon,swa5:G.god,swb2:G.hammer,swb3:G.mirror,swb4:G.fort,swb5:G.god,mga2:G.ice,mga3:G.fire,mga5:G.star,mgb1:G.mirror,mgb2:G.book,mgb3:G.seal,mgb4:G.clock,mgb5:G.glyph,ara2:G.farrow,ara3:G.wind,ara5:G.star,arb1:SK_GLYPH.ar1,arb2:G.hawk,arb3:G.vine,arb4:G.hawk,arb5:G.crown})})();
var SK_IC0=skIcon;skIcon=function(id,sz,dim){var s=SK_IC0(id,sz,dim);if(SK_DEF[id]&&SK_DEF[id].t===5)s=s.replace('stroke="#ffe39a" stroke-width="3"','stroke="#fff2b0" stroke-width="4"').replace(/stop-color="#ffe27a"/,'stop-color="#fff2b0"').replace(/stop-color="#c8781a"/,'stop-color="#8a5200"');return s};
/* ---------- skills screen: the tree ---------- */
var SK_MD0=skModal;skModal=function(md){if(md.kind!=='skills')return null;var T=SK_TID[S.cls]||[],skb=S.skb||{},wk=bkkWeek(Date.now()),lockedWeek=S.skbw===wk;
  function card(id,ti,b){var d=SK_DEF[id],lvOk=S.lvl>=d.u,picked=!ti||skb[ti]===b,lv=picked?skCurLv(id):0,nl=lv+1,req=lv&&nl<=5?skReq(id,nl):0,cost=nl<=5?SK_COST[nl]:0,canLv=lv&&nl<=5&&S.lvl>=req,canCoin=S.coin>=cost,other=ti&&skb[ti]&&skb[ti]!==b;
    var act='';if(!lvOk)act='<small class="mut">🔒 '+esc(t_('sk_lock',d.u))+'</small>';else if(ti&&!skb[ti])act='<button class="btn sm gold" data-act="skbr" data-id="'+ti+b+'">'+esc(t('sk2_pick'))+'</button>';
     else if(other)act='<button class="btn sm sec" data-act="skbr" data-id="'+ti+b+'"'+(lockedWeek||S.coin<SK_BRCOST?' disabled':'')+'>'+esc(t('sk2_change').replace('{n}',SK_BRCOST))+'</button>';
     else act=(nl>5?'<span class="tag">'+esc(t('sk_max'))+'</span>':'<button class="btn sm'+(canLv&&canCoin?' gold':' sec')+'" data-act="skup" data-id="'+id+'"'+(canLv&&canCoin?'':' disabled')+'>⬆ '+esc(t('sk_up').replace('{n}',nl))+'<br><small>🪙 '+cost+(canLv?'':' · '+esc(t('sk_need').replace('{n}',req)))+'</small></button>');
    return '<div class="sk-card k-'+d.k+(picked&&lvOk?' picked':'')+(!lvOk||other?' locked':'')+(ti===5?' god':'')+'">'+skIcon(id,54,!lvOk||other)+'<div class="stack" style="gap:3px;min-width:0;flex:1"><div class="row" style="gap:6px;flex-wrap:wrap"><b>'+esc(tx(SKN[id]))+'</b>'+(lv?'<span class="tag sk-lvtag">Lv.'+lv+'</span>':'')+(picked&&ti&&lvOk?'<span class="tag">✓ '+esc(t('sk2_picked'))+'</span>':'')+'</div><small>'+esc(tx(skDesc(id,lv||1)))+'</small>'+(lv?'<div class="sk-pips">'+[1,2,3,4,5].map(function(k){return '<i class="'+(k<=lv?'on':'')+'"></i>'}).join('')+'</div>':'')+'</div>'+act+'</div>'}
  function t_(k,n){return t(k).replace('{n}',n)}
  var h=T.map(function(r,ti){return '<div class="sk-tier"><div class="sk-tierh">'+esc(ti?t_('sk2_tier',SK_TIERS[ti]):t('sk2_base')+' · '+t_('sk2_tier',5))+'</div>'+(ti?'<div class="sk-two">'+card(r[0],ti,'A')+card(r[1],ti,'B')+'</div>':card(r[0],0,''))+'</div>'}).join('');
  var brh=SK_BRN[S.cls]?'<div class="sk-brh"><span>A · '+esc(tx(SK_BRN[S.cls].A))+'</span><span>B · '+esc(tx(SK_BRN[S.cls].B))+'</span></div>':'';
  return {wide:true,body:'<span class="eyebrow">🌟 '+esc(t('sk_title'))+'</span><h2 style="margin:0">'+esc(tx(CLASSES[S.cls].names))+'</h2><p class="mut" style="margin:0">'+esc(t('sk2_sub'))+' · '+esc(t('sk2_week'))+'</p>'+brh+'<div class="sk-tree">'+h+'</div><div class="row" style="justify-content:flex-end"><button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button></div>'}};
function skPickBranch(code){var ti=+code[0],b=code[1];if(!(ti>=1&&ti<=5)||(b!=='A'&&b!=='B'))return;var cur=(S.skb||{})[ti];if(cur===b||S.lvl<SK_TIERS[ti])return;var cost=cur?SK_BRCOST:0;
  if(cur&&S.skbw===bkkWeek(Date.now())){toast(t('sk2_week'));return}if(S.coin<cost){toast(t('sk_nocoin'));return}
  commitEv({k:'skbr',d:today(),t2:ti,b:b,cost:cost});save();sfx('lvl');toast('🌟 '+tx(SKN[SK_TID[S.cls][ti][b==='A'?0:1]]));render()}
var SK_ACT0=skillsAct;skillsAct=function(a,id){if(a==='skbr'){skPickBranch(String(id));return true}return SK_ACT0(a,id)};
/* ---------- the fight: queue of bonuses on the coming answers ---------- */
function skQ(s){var f=s.fx;if(!f.Q)f.Q=[];return f.Q}
function skAddQ(s,i,v){var Q=skQ(s);while(Q.length<=i)Q.push(0);Q[i]+=v}
function skApply(s,id,lv,tunnel){var x=SK_DEF[id].x||{},f=s.fx;
  if(!tunnel){skAddQ(s,0,skDmg(id,lv));if(x.pierce)skAddQ(s,1,x.pierce);if(x.burn)for(var i=0;i<x.burn;i++)skAddQ(s,i,1);if(x.streak)for(var j=0;j<x.streak[0];j++)skAddQ(s,j,x.streak[1]);if(x.double)skAddQ(s,0,skDmg(id,lv));
   if(x.combo)f.combo={id:id,got:0,need:x.combo[0],bonus:x.combo[1]};if(x.rest)f.rest=(f.rest|0)+x.rest}
  if(x.shield){f.shield=f.shield||{left:0,cut:0};f.shield.left+=x.shield}
  var cut=(x.cut|0)+(tunnel&&!x.cut&&!x.shield&&!x.hint?1:0);if(cut)skCut(s,cut);if(x.hint){f.hintQ=Math.max(f.hintQ|0,x.hint);s.hint[s.i]=1;f.hintQ--}}
skUse=function(id){var s=RD.enc;if(!s||s.picked!==null)return;if(!(s.chg>0)){toast(t('sk2_charge'));return}var lv=skCurLv(id);if(!lv||SK_DEF[id].cls!==S.cls||skList(S.cls).indexOf(id)<0||skUsedFor(s.rid).indexOf(id)>=0)return;
  s.chg--;s.fx=s.fx||{};s.hid=s.hid||{};s.hint=s.hint||{};s.su.push(id);skApply(s,id,lv,false);sfx('lvl');render();skFxPlay(id)};
skAfterAnswer=function(s,ok){if(ok)s.chg=1;var f=s.fx||{},Q=skQ(s),bonus=Q.length?Q.shift():0;if(!ok)bonus=0;
  if(ok){if(f.combo){f.combo.got++;if(f.combo.got>=f.combo.need){bonus+=f.combo.bonus;f.combo=null}}if(f.rest>0){bonus+=1;f.rest--}}else if(f.combo)f.combo=null;
  if(bonus){var cap=s.su.reduce(function(a,id){return a+skMaxBonus(id,skCurLv(id))},0);bonus=Math.max(0,Math.min(bonus,Math.min(cap,SK_SBMAX)-s.sb))}
  s.sb+=bonus;s.pop=ok?1+bonus:0;if(ok&&bonus)skFxHit(bonus)};
skPerQuestion=function(s){var f=s.fx||{};if(f.hintQ>0){s.hint[s.i]=1;f.hintQ--}};
skActive=function(s){var f=s.fx||{},a=[],Q=f.Q||[],up=Q.reduce(function(x,y){return x+y},0);if(up)a.push('⚔️ +'+up);if(f.combo)a.push(tx(SKN[f.combo.id])+' '+f.combo.got+'/'+f.combo.need);if(f.rest>0)a.push('✨ +1 ×'+f.rest);if(f.shield&&f.shield.left>0)a.push('🛡️ ×'+f.shield.left);if(f.hintQ>0)a.push('💡 ×'+f.hintQ);
  return a.length?'<small class="sk-act">'+esc(a.join(' · '))+'</small>':''};
skVfx=function(){return ''};
skTnDesc=function(id,lv){return skDesc(id,lv)};
skTnUse=function(id){var s=TN.enc;if(!skTnOk(s)||s.picked!==null)return;if(!(s.chg>0)){toast(t('sk2_charge'));return}var lv=skCurLv(id);if(!lv||SK_DEF[id].cls!==S.cls||skList(S.cls).indexOf(id)<0||(s.su||[]).indexOf(id)>=0||skTnCd(id)>0)return;
  s.chg--;s.fx=s.fx||{};s.su=s.su||[];s.hid=s.hid||{};s.hint=s.hint||{};s.su.push(id);skApply(s,id,lv,true);sfx('lvl');render();skFxPlay(id)};
/* ---------- particle effects ---------- */
var SKFX={cv:null,g:null,P:[],F:[],tr:0,stop:0,last:0,clock:0,run:false,GL:{}};
function skMotion(){return S.set.motion!==false&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)}
function skEl(sel){var e=document.querySelector(sel);if(!e)return null;var r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height,el:e}}
function skHero(){return skEl('.qwrap .fighter .av')||{x:innerWidth*.25,y:innerHeight*.5,w:100,h:120}}
function skBoss(){return skEl('.qwrap .tn-foe')||{x:innerWidth*.72,y:innerHeight*.45,w:140,h:140}}
function skCanvas(){if(SKFX.cv&&document.body.contains(SKFX.cv))return;var c=document.createElement('canvas');c.className='sk-canvas';c.setAttribute('aria-hidden','true');document.body.appendChild(c);SKFX.cv=c;SKFX.g=c.getContext('2d');skSize();addEventListener('resize',skSize)}
function skSize(){var c=SKFX.cv;if(!c)return;var d=Math.min(2,devicePixelRatio||1);c.width=innerWidth*d;c.height=innerHeight*d;SKFX.g.setTransform(d,0,0,d,0,0)}
function skGlow(col){var G=SKFX.GL;if(G[col])return G[col];var c=document.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'#fff');gr.addColorStop(.25,col);gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return G[col]=c}
function skR(a,b){return a+Math.random()*(b-a)}
function skSp(o){var p={vx:0,vy:0,life:.6,t:0,size:6,grow:0,col:'#fff',add:true,drag:.98,grav:0,shape:'dot',rot:0,vr:0};for(var k in o)p[k]=o[k];if(SKFX.P.length<700)SKFX.P.push(p)}
function skF(dur,draw,delay){SKFX.F.push({t:-(delay||0),dur:dur,draw:draw});skStart()}
function skBurst(x,y,col,n,spd){for(var i=0;i<n;i++){var a=skR(0,6.283),v=skR(spd*.3,spd);skSp({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:skR(.35,.8),size:skR(2,4.5),col:col,shape:'spark',grav:420,drag:.96})}skStart()}
function skEmbers(x,y,col,n){for(var i=0;i<n;i++)skSp({x:x+skR(-20,20),y:y+skR(-20,20),vx:skR(-40,40),vy:skR(-160,-40),life:skR(.6,1.4),size:skR(3,7),col:col,grav:-30,drag:.97});skStart()}
function skSmoke(x,y,n,col){for(var i=0;i<n;i++)skSp({x:x+skR(-25,25),y:y+skR(-15,15),vx:skR(-30,30),vy:skR(-60,-15),life:skR(.8,1.6),size:skR(14,26),grow:28,col:col||'rgba(60,40,70,.35)',add:false,shape:'smoke',drag:.97});skStart()}
function skShards(x,y,col,n,spd){for(var i=0;i<n;i++){var a=skR(0,6.283),v=skR(spd*.4,spd);skSp({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-80,life:skR(.5,1),size:skR(4,9),col:col,shape:'shard',grav:500,rot:skR(0,6),vr:skR(-12,12),drag:.97})}skStart()}
function skShock(x,y,col,R,dur,w){skF(dur,function(k,g){var e=1-Math.pow(1-k,3);g.globalCompositeOperation='lighter';g.globalAlpha=1-k;g.strokeStyle=col;g.lineWidth=(w||10)*(1-k)+1;g.beginPath();g.arc(x,y,R*e,0,7);g.stroke();g.strokeStyle='#fff';g.lineWidth=((w||10)*(1-k)+1)*.35;g.stroke();g.globalAlpha=1})}
function skFlashAt(x,y,col,R,dur){skF(dur,function(k,g){g.globalCompositeOperation='lighter';g.globalAlpha=(1-k)*.9;g.drawImage(skGlow(col),x-R,y-R,R*2,R*2);g.globalAlpha=(1-k)*.7;g.drawImage(skGlow('#ffffff'),x-R*.45,y-R*.45,R*.9,R*.9);g.globalAlpha=1})}
function skShake(a){if(skMotion())SKFX.tr=Math.min(1,SKFX.tr+a)}
function skBossHit(){var b=skBoss();if(b&&b.el){b.el.classList.remove('sk-bosshit');void b.el.offsetWidth;b.el.classList.add('sk-bosshit')}}
function skImpact(col,pow,at){var B=at||skBoss();skFlashAt(B.x,B.y,col,90*pow+40,.35);skShock(B.x,B.y,col,110*pow+50,.55,12*pow+4);skBurst(B.x,B.y,col,Math.round(24*pow+8),480*pow+160);skBurst(B.x,B.y,'#ffffff',Math.round(9*pow),280);
  if(pow>.6){skEmbers(B.x,B.y,col,Math.round(12*pow));skSmoke(B.x,B.y+20,Math.round(5*pow))}skShake(.22+pow*.45);if(skMotion())SKFX.stop=performance.now()+50+pow*80;skBossHit()}
function skSlash(col,a0,a1,R,w,dur,delay){skF(dur,function(k,g){var B=skBoss(),sw=Math.min(1,k*2.2),fade=k<.45?1:1-(k-.45)/.55,e=a0+(a1-a0)*(1-Math.pow(1-sw,3)),st=a0+(a1-a0)*Math.max(0,sw-.55);
  g.globalCompositeOperation='lighter';g.lineCap='round';[[w*3.2,.18,col],[w*1.4,.55,col],[w*.45,1,'#ffffff']].forEach(function(q){g.globalAlpha=q[1]*fade;g.strokeStyle=q[2];g.lineWidth=q[0];g.beginPath();g.arc(B.x,B.y,R,st,e,a1<a0);g.stroke()});g.globalAlpha=1;
  if(k<.5&&Math.random()<.9)skBurst(B.x+Math.cos(e)*R,B.y+Math.sin(e)*R,col,2,240)},delay)}
function skShot(o){skF(o.dur,function(k,g){var H=skHero(),B=o.to||skBoss(),fr=o.from||{x:H.x+H.w*.3,y:H.y-H.h*.15},e=o.ease==='in'?k*k:k,x=fr.x+(B.x-fr.x)*e,y=fr.y+(B.y-fr.y)*e-(o.arc||0)*Math.sin(Math.PI*e),r=o.size||14;
  g.globalCompositeOperation='lighter';g.drawImage(skGlow(o.col),x-r*2.2,y-r*2.2,r*4.4,r*4.4);g.drawImage(skGlow('#ffffff'),x-r*.8,y-r*.8,r*1.6,r*1.6);
  if(o.arrow){var ang=Math.atan2(B.y-fr.y,B.x-fr.x);g.save();g.translate(x,y);g.rotate(ang);g.strokeStyle='#fff';g.lineWidth=2.5;g.beginPath();g.moveTo(-34,0);g.lineTo(6,0);g.stroke();g.fillStyle='#fff';g.beginPath();g.moveTo(12,0);g.lineTo(0,-5);g.lineTo(0,5);g.fill();g.restore()}
  for(var i=0;i<(o.trail||3);i++)skSp({x:x+skR(-4,4),y:y+skR(-4,4),vx:skR(-30,30),vy:skR(-30,30),life:skR(.25,.55),size:r*skR(.4,.9),col:o.col,drag:.9});
  if(o.fire)skEmbers(x,y,'#ff7a1a',1);if(o.smoke&&Math.random()<.5)skSmoke(x,y,1);if(k>=1&&o.hit)o.hit(B)},o.delay)}
function skBolt(col,dur,delay){var pts=null,seed=0;skF(dur,function(k,g){var B=skBoss();if(!pts||performance.now()-seed>55){var p=[[B.x+skR(-60,60),-10],[B.x,B.y]];for(var d=0,off=90;d<6;d++,off*=.55)for(var i=p.length-1;i>0;i--){var a=p[i-1],b=p[i];p.splice(i,0,[(a[0]+b[0])/2+skR(-off,off),(a[1]+b[1])/2+skR(-off*.3,off*.3)])}pts=p;seed=performance.now()}
  var al=k<.7?(Math.random()<.85?1:.3):1-(k-.7)/.3;g.globalCompositeOperation='lighter';[[16,.15,col],[7,.45,col],[2.4,1,'#fff']].forEach(function(q){g.globalAlpha=q[1]*al;g.strokeStyle=q[2];g.lineWidth=q[0];g.beginPath();pts.forEach(function(p,i){i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1])});g.stroke()});g.globalAlpha=1},delay)}
function skCircle(at,R,col,dur,delay,spin,flat){skF(dur,function(k,g){var c=at(),al=k<.15?k/.15:k>.85?(1-k)/.15:1;g.save();g.translate(c.x,c.y);if(flat)g.scale(1,flat);g.rotate(k*(spin||2));g.globalCompositeOperation='lighter';
  [[6,.25],[2,1]].forEach(function(q){g.globalAlpha=al*q[1];g.strokeStyle=col;g.lineWidth=q[0];g.beginPath();g.arc(0,0,R,0,7);g.stroke();g.beginPath();g.arc(0,0,R*.78,0,7);g.stroke();for(var s=0;s<2;s++){g.beginPath();for(var i=0;i<3;i++){var a=i*2.094+s*1.047;g.lineTo(Math.cos(a)*R*.78,Math.sin(a)*R*.78)}g.closePath();g.stroke()}});
  g.globalAlpha=al;g.fillStyle=col;for(var i=0;i<24;i++){g.save();g.rotate(i*.2618);g.fillRect(R*.86,-2,R*.08,4);g.restore()}g.restore();g.globalAlpha=1},delay)}
function skRays(col,dur,delay){skF(dur,function(k,g){var B=skBoss(),M=Math.max(innerWidth,innerHeight),al=k<.2?k/.2:k>.7?(1-k)/.3:1;g.save();g.translate(B.x,B.y);g.rotate(k*.6);g.globalCompositeOperation='lighter';for(var i=0;i<14;i++){g.rotate(.4488);var gr=g.createLinearGradient(0,0,M,0);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=.14*al;g.fillStyle=gr;g.beginPath();g.moveTo(0,0);g.lineTo(M,-28);g.lineTo(M,28);g.fill()}g.restore();g.globalAlpha=1},delay)}
function skDark(a,dur,delay){skF(dur,function(k,g){var al=k<.15?k/.15:k>.8?(1-k)/.2:1;g.globalCompositeOperation='source-over';g.globalAlpha=a*al;g.fillStyle='#05020c';g.fillRect(0,0,innerWidth,innerHeight);g.globalAlpha=1},delay)}
function skTint(col,a,dur,delay){skF(dur,function(k,g){var al=k<.1?k/.1:k>.8?(1-k)/.2:1;g.globalCompositeOperation='source-over';g.globalAlpha=a*al;g.fillStyle=col;g.fillRect(0,0,innerWidth,innerHeight);g.globalAlpha=1},delay)}
function skHex(col,dur,delay){skF(dur,function(k,g){var H=skHero(),R=H.h*.75*(k<.15?k/.15:1),al=k>.8?(1-k)/.2:1;g.globalCompositeOperation='lighter';g.save();g.translate(H.x,H.y);g.beginPath();for(var i=0;i<6;i++){var a=i*1.047+.5236;g.lineTo(Math.cos(a)*R,Math.sin(a)*R)}g.closePath();g.globalAlpha=.16*al;g.fillStyle=col;g.fill();g.globalAlpha=al;g.strokeStyle=col;g.lineWidth=5;g.stroke();g.lineWidth=1.5;g.strokeStyle='#fff';g.stroke();g.restore();g.globalAlpha=1},delay)}
function skHawk(col,dur,delay,big){skF(dur,function(k,g){var H=skHero(),B=skBoss(),x=H.x+(B.x-H.x)*k,y=H.y-H.h*.6-Math.sin(k*Math.PI)*50,s=big?2:1,f=Math.sin(k*40)*.5+.5;g.save();g.translate(x,y);g.scale(s,s);g.globalCompositeOperation='lighter';g.drawImage(skGlow(col),-40,-30,80,60);g.fillStyle='#fff';g.beginPath();g.moveTo(-6,0);g.quadraticCurveTo(-26,-18-f*14,-46,-6+f*6);g.quadraticCurveTo(-24,-4,-6,4);g.moveTo(6,0);g.quadraticCurveTo(26,-18-f*14,46,-6+f*6);g.quadraticCurveTo(24,-4,6,4);g.fill();g.restore()},delay)}
function skVines(col,dur,delay){var B0=skBoss(),vs=[0,1,2,3,4,5].map(function(){return {dx:skR(-B0.w*.5,B0.w*.5),a:skR(-.6,.6),h:skR(.6,1.1)*B0.h}});skF(dur,function(k,g){var B=skBoss(),base=B.y+B.h*.5,e=Math.min(1,k*2.5),al=k>.8?(1-k)/.2:1;g.globalCompositeOperation='lighter';g.lineCap='round';vs.forEach(function(v){var x=B.x+v.dx;[[9,.2],[3.5,1]].forEach(function(q){g.globalAlpha=q[1]*al;g.strokeStyle=col;g.lineWidth=q[0];g.beginPath();g.moveTo(x,base);g.bezierCurveTo(x+60*v.a,base-v.h*.4*e,x-70*v.a,base-v.h*.7*e,x+20*v.a,base-v.h*e);g.stroke()})});g.globalAlpha=1},delay)}
function skWeapon(kind,dur,delay){skF(dur,function(k,g){var B=skBoss(),e=k<.6?1-Math.pow(1-k/.6,3):1,y=-200+(B.y+200)*e,al=k>.85?(1-k)/.15:1,s=Math.max(.6,Math.min(innerWidth,innerHeight)/500);g.save();g.translate(B.x,y);g.scale(s,s);var gr=g.createLinearGradient(0,-150,0,120);gr.addColorStop(0,'#fff6c8');gr.addColorStop(.5,'#f3c64a');gr.addColorStop(1,'#b07a12');g.globalAlpha=al;g.shadowColor='#f3c64a';g.shadowBlur=30;g.fillStyle=gr;g.strokeStyle='#fff6c8';g.lineWidth=3;g.beginPath();
  if(kind==='sword'){g.moveTo(0,-160);g.lineTo(14,60);g.lineTo(0,80);g.lineTo(-14,60);g.closePath();g.fill();g.stroke();g.fillStyle='#b07a12';g.fillRect(-46,60,92,14);g.fillRect(-7,74,14,46)}
  else if(kind==='mage'){for(var i=0;i<10;i++){var r=i%2?50:130,a=i*.628-1.5708;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.stroke()}
  else{g.lineWidth=14;g.strokeStyle=gr;g.moveTo(-40,-130);g.quadraticCurveTo(90,0,-40,130);g.stroke();g.lineWidth=7;g.strokeStyle='#fff6c8';g.beginPath();g.moveTo(-40,0);g.lineTo(150,0);g.stroke()}
  g.restore();g.globalAlpha=1;g.shadowBlur=0},delay)}
function skGold(dur,delay){skF(dur,function(){if(Math.random()<.9)for(var i=0;i<3;i++)skSp({x:skR(0,innerWidth),y:innerHeight+10,vx:skR(-15,15),vy:skR(-240,-100),life:skR(1,2),size:skR(2,4.5),col:'#f3c64a',drag:.99})},delay)}
function skStars(dur,delay){var st=[];for(var i=0;i<70;i++)st.push([Math.random(),Math.random(),skR(.5,1.8),skR(0,6)]);skF(dur,function(k,g){var al=k<.15?k/.15:k>.85?(1-k)/.15:1;g.globalCompositeOperation='lighter';g.fillStyle='#fff';st.forEach(function(s){g.globalAlpha=al*(.5+.5*Math.sin(SKFX.clock*4+s[3]));g.beginPath();g.arc(s[0]*innerWidth,s[1]*innerHeight,s[2],0,7);g.fill()});g.globalAlpha=1},delay)}
function skGlyphs(dur,delay){skF(dur,function(k,g){var H=skHero(),al=k<.15?k/.15:k>.85?(1-k)/.15:1;g.globalCompositeOperation='lighter';g.font='600 30px Mitr, sans-serif';g.textAlign='center';['ก','A','中'].forEach(function(tx2,i){var a=SKFX.clock*2+i*2.094;g.globalAlpha=al;g.fillStyle=['#ff9ad0','#9fd8ff','#ffe08a'][i];g.fillText(tx2,H.x+Math.cos(a)*H.w*.8,H.y+Math.sin(a)*H.h*.35)});g.globalAlpha=1},delay)}
function skStart(){skCanvas();if(SKFX.run)return;SKFX.run=true;SKFX.last=performance.now();requestAnimationFrame(skLoop)}
function skLoop(now){var c=SKFX.cv,g=SKFX.g;var dt=Math.min(.05,(now-SKFX.last)/1000),real=dt;SKFX.last=now;if(now<SKFX.stop)dt*=.06;SKFX.clock+=dt;g.clearRect(0,0,innerWidth,innerHeight);
  for(var i=SKFX.F.length-1;i>=0;i--){var f=SKFX.F[i];f.t+=dt;if(f.t<0)continue;var k=Math.min(1,f.t/f.dur);try{f.draw(k,g)}catch(e){}if(k>=1)SKFX.F.splice(i,1)}
  for(var j=SKFX.P.length-1;j>=0;j--){var p=SKFX.P[j];p.t+=dt;if(p.t>=p.life){SKFX.P.splice(j,1);continue}var q=p.t/p.life;p.vx*=Math.pow(p.drag,dt*60);p.vy=p.vy*Math.pow(p.drag,dt*60)+p.grav*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;var s=p.size+p.grow*p.t;
   g.globalCompositeOperation=p.add?'lighter':'source-over';g.globalAlpha=(1-q)*(p.shape==='smoke'?.8:1);
   if(p.shape==='spark'){g.strokeStyle=p.col;g.lineWidth=s*.6;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.035,p.y-p.vy*.035);g.stroke();g.drawImage(skGlow(p.col),p.x-s*1.5,p.y-s*1.5,s*3,s*3)}
   else if(p.shape==='smoke'){g.fillStyle=p.col;g.beginPath();g.arc(p.x,p.y,s,0,7);g.fill()}
   else if(p.shape==='shard'){g.save();g.translate(p.x,p.y);g.rotate(p.rot);g.fillStyle=p.col;g.beginPath();g.moveTo(0,-s);g.lineTo(s*.45,0);g.lineTo(0,s);g.lineTo(-s*.45,0);g.fill();g.restore()}
   else g.drawImage(skGlow(p.col),p.x-s*1.6,p.y-s*1.6,s*3.2,s*3.2)}
  g.globalAlpha=1;g.globalCompositeOperation='source-over';
  SKFX.tr=Math.max(0,SKFX.tr-1.2*real);var sh=SKFX.tr*SKFX.tr,app=document.getElementById('app');if(app)app.style.transform=sh>.001?'translate('+(12*sh*Math.sin(SKFX.clock*47)).toFixed(1)+'px,'+(8*sh*Math.sin(SKFX.clock*61+1)).toFixed(1)+'px)':'';
  if(SKFX.F.length||SKFX.P.length||SKFX.tr>0){requestAnimationFrame(skLoop)}else{SKFX.run=false;g.clearRect(0,0,innerWidth,innerHeight);if(app)app.style.transform=''}}
function skLunge(){var h=skHero();if(h&&h.el){h.el.classList.remove('sk-lunge');void h.el.offsetWidth;h.el.classList.add('sk-lunge')}}
function skCutin(id,t){var e=document.createElement('div');e.className='sk-cutin'+(t>=4?' gold':'');var c=SK_COL[SK_DEF[id].k];e.style.setProperty('--c',t>=4?'#5a3a06':c[1]);
  e.innerHTML='<span class="sk-cutav">'+avatar(S,{noTitle:true,noPet:true,noGd:true})+'</span><div><b>'+esc(tx(SKN[id]))+'</b><small>'+esc(SKN[id].th)+' · '+esc(SKN[id].en)+' · '+esc(SKN[id].zh)+'</small></div>';document.body.appendChild(e);setTimeout(function(){e.remove()},1150)}
var SKC={sword:'#ffd76a',mage:'#b48cff',archer:'#7dffb0'};
function skMeteor(col,pow,delay){var B=skBoss();skCircle(function(){var b=skBoss();return {x:b.x,y:b.y+b.h*.45}},B.w*.8,col,1.1,delay||0,3,.25);skShot({col:col,dur:.55,size:22*pow+8,trail:6,fire:true,smoke:true,ease:'in',delay:(delay||0)+.25,from:{x:B.x+innerWidth*.2,y:-40},hit:function(to){skImpact(col,pow,to)}})}
var SK_RECIPE={
 sw1:function(){skLunge();skSlash('#ffd76a',-2.4,.6,70,8,.45,0);skSlash('#ffd76a',-.4,2.6,62,8,.45,.18);setTimeout(function(){skImpact('#ffd76a',.45)},330)},
 swa1:function(){skLunge();skSlash('#ffe9a8',-2.4,.6,75,9,.4,0);skShot({col:'#fff2c0',dur:.18,size:10,delay:.25,trail:6,hit:function(B){skShards(B.x,B.y,'#c9c9d6',18,400);skImpact('#ffd76a',.7)}})},
 swa2:function(){skLunge();[0,.16,.32].forEach(function(t,i){skSlash('#ff8a2a',-2.6+i*.4,.8+i*.3,78-i*6,11,.5,t)});setTimeout(function(){skImpact('#ff7a1a',.9);skF(1.6,function(){var B=skBoss();if(Math.random()<.8)skEmbers(B.x,B.y+20,'#ff6a1a',2)})},520)},
 swa3:function(){skLunge();skShot({col:'#bfe2ff',dur:.45,size:24,trail:8,hit:function(B){skImpact('#9fd0ff',1.1,B);skSlash('#dff1ff',-1.8,1.4,95,14,.45,0)}})},
 sw3:function(){skLunge();for(var i=0;i<7;i++)skSlash(i%2?'#fff1b0':'#ffc83a',-2.8+i*.55,.4+i*.55,55+i*7,10,.32,i*.1);setTimeout(function(){skImpact('#ffc83a',1.35)},800)},
 swa5:function(){skWeapon('sword',1.6,0);setTimeout(function(){skSlash('#fff6c8',-2.4,.7,120,20,.5,0);skSlash('#fff6c8',-.7,2.4,120,20,.5,.12);skImpact('#f3c64a',1.8)},1350)},
 sw2:function(){skHex('#ffd76a',1.6,0);skLunge();skSlash('#ffd76a',-2.4,.6,65,7,.4,.3);setTimeout(function(){skImpact('#ffd76a',.45)},650)},
 swb2:function(){skF(.5,function(k,g){var B=skBoss(),y=-60+(B.y+60)*k*k;g.save();g.translate(B.x,y);g.globalCompositeOperation='lighter';g.drawImage(skGlow('#ffd76a'),-70,-70,140,140);g.fillStyle='#fff3c0';g.fillRect(-40,-24,80,36);g.fillRect(-6,12,12,60);g.restore()});setTimeout(function(){skImpact('#ffd76a',1)},500)},
 swb3:function(){skHex('#dff1ff',1.4,0);setTimeout(function(){skShot({col:'#bfe8ff',dur:.2,size:12,trail:8,hit:function(){skImpact('#bfe8ff',1)}})},450)},
 swb4:function(){skHex('#f3c64a',1.6,0);skLunge();skSlash('#ffc83a',-2.4,.7,80,11,.45,.5);setTimeout(function(){skImpact('#ffc83a',1.3)},850)},
 swb5:function(){skWeapon('sword',1.6,0);skHex('#f3c64a',2.2,0);setTimeout(function(){skSlash('#fff6c8',-2.4,.7,120,20,.5,0);skImpact('#f3c64a',1.8)},1350)},
 mg1:function(){skShot({col:'#b48cff',dur:.4,size:13,trail:5,hit:function(){skImpact('#b48cff',.45)}})},
 mg2:function(){skMeteor('#b48cff',1)},
 mga2:function(){skTint('#9fd8ff',.15,1.4,0);skF(1,function(){var B=skBoss();for(var i=0;i<2;i++)skSp({x:B.x+skR(-B.w,B.w),y:-10,vx:skR(-60,-20),vy:skR(500,700),life:.7,size:skR(5,9),col:'#cfefff',shape:'shard',grav:300,rot:2.8})});setTimeout(function(){var B=skBoss();skSmoke(B.x,B.y+30,8,'rgba(200,235,255,.35)');skImpact('#9fd8ff',.9)},700)},
 mga3:function(){skF(1,function(){var H=skHero(),B=skBoss();for(var i=0;i<5;i++)skSp({x:H.x+H.w*.3,y:H.y-H.h*.2,vx:(B.x-H.x)*skR(1.1,1.6),vy:(B.y-H.y)*skR(1.1,1.6)+skR(-80,80),life:.7,size:skR(8,16),grow:20,col:Math.random()<.5?'#ff7a1a':'#ffb03a',drag:.96})});setTimeout(function(){skImpact('#ff7a1a',1)},600)},
 mg3:function(){skDark(.4,1.4,0);[0,.22,.44].forEach(function(t){skBolt('#b48cff',.45,t)});setTimeout(function(){skImpact('#c9a8ff',1.35)},520)},
 mga5:function(){skWeapon('mage',1.5,0);setTimeout(function(){for(var i=0;i<4;i++)skMeteor('#f3c64a',.8,i*.12)},1200)},
 mgb1:function(){setTimeout(function(){var H=skHero();skShards(H.x,H.y-H.h*.3,'#d9c8ff',14,240)},200);skShot({col:'#c9a8ff',dur:.4,size:12,delay:.35,hit:function(){skImpact('#c9a8ff',.5)}})},
 mgb2:function(){skCircle(function(){var h=skHero();return {x:h.x,y:h.y+h.h*.45}},70,'#c9a8ff',1.5,0,2,.3);skGlyphs(1.5,0);skShot({col:'#c9a8ff',dur:.4,size:13,delay:.6,hit:function(){skImpact('#c9a8ff',.7)}})},
 mgb3:function(){var B=skBoss();skCircle(skBoss,B.w*.75,'#b48cff',1.6,0,-2);setTimeout(function(){skImpact('#b48cff',1)},900)},
 mgb4:function(){skTint('#6fb8ff',.2,1.6,0);skCircle(function(){return {x:innerWidth/2,y:innerHeight/2}},Math.min(innerWidth,innerHeight)*.38,'#9fd8ff',1.6,0,-3);setTimeout(function(){for(var i=0;i<5;i++)skShot({col:'#c9a8ff',dur:.3,size:11,delay:i*.08});setTimeout(function(){skImpact('#c9a8ff',1.3)},500)},900)},
 mgb5:function(){skWeapon('mage',1.5,0);skGlyphs(2.2,0);setTimeout(function(){skMeteor('#f3c64a',1.6)},1200)},
 ar1:function(){skShot({col:'#7dffb0',dur:.25,size:8,arrow:true,trail:4,delay:.15,hit:function(){skImpact('#7dffb0',.45)}})},
 ar2:function(){[0,.1,.2].forEach(function(t){skShot({col:'#7dffb0',dur:.25,size:8,arrow:true,trail:4,delay:t})});setTimeout(function(){skImpact('#7dffb0',.7)},480)},
 ara2:function(){[0,.12,.24].forEach(function(t){skShot({col:'#ff9a3a',dur:.3,size:9,arrow:true,fire:true,trail:5,delay:t,arc:30})});setTimeout(function(){skImpact('#ff7a1a',.9);skF(1.4,function(){var B=skBoss();if(Math.random()<.8)skEmbers(B.x,B.y+20,'#ff6a1a',2)})},560)},
 ara3:function(){skShot({col:'#d6ffe6',dur:.5,size:12,arrow:true,trail:8,hit:function(B){skShock(B.x,B.y,'#9dffc4',200,.6,10);skImpact('#7dffb0',1.1)}})},
 ar3:function(){skDark(.45,1.6,0);skRays('#9dffc4',1.6,0);skF(.9,function(){var B=skBoss();skShot({col:'#9dffc4',dur:.25,size:7,arrow:true,trail:2,from:{x:B.x+skR(-B.w,B.w*.6),y:-20},to:{x:B.x+skR(-B.w*.3,B.w*.3),y:B.y+skR(-B.h*.2,B.h*.3)}})},.2);setTimeout(function(){skImpact('#7dffb0',1.35)},1100)},
 ara5:function(){skWeapon('archer',1.5,0);setTimeout(function(){skShot({col:'#f3c64a',dur:.35,size:22,arrow:true,trail:10,from:{x:innerWidth*.5,y:innerHeight*.25},hit:function(){skImpact('#f3c64a',1.8)}})},1200)},
 arb1:function(){skShot({col:'#7dffb0',dur:.25,size:8,arrow:true,delay:.3,hit:function(){skImpact('#7dffb0',.5)}})},
 arb2:function(){skHawk('#9dffc4',.9,0);setTimeout(function(){skImpact('#7dffb0',.7)},850)},
 arb3:function(){skVines('#5fe08a',1.6,0);setTimeout(function(){skShot({col:'#7dffb0',dur:.25,size:8,arrow:true,hit:function(){skImpact('#7dffb0',1)}})},600)},
 arb4:function(){skHex('#9dffc4',1.6,0);skHawk('#9dffc4',1,.3);setTimeout(function(){skImpact('#7dffb0',1.2)},1250)},
 arb5:function(){skWeapon('archer',1.5,0);setTimeout(function(){skHawk('#f3c64a',.8,0,true);setTimeout(function(){skImpact('#f3c64a',1.8)},750)},1200)}};
function skFxPlay(id){var d=SK_DEF[id],t=d.t,r=SK_RECIPE[id];if(!r)return;skCanvas();var col=SKC[d.cls]||'#fff',delay=0;
  if(!skMotion()){var B=skBoss();skFlashAt(B.x,B.y,col,90,.5);return}
  if(t===5){skDark(.9,3.4,0);skStars(3.4,0);skCircle(function(){return {x:innerWidth/2,y:innerHeight/2}},Math.min(innerWidth,innerHeight)*.42,'#f3c64a',3,0,1.2);skRays('#f3c64a',3,.4);skGold(2.6,.3)}
  else if(t===4){skDark(.72,2.2,0);skRays(col,2,0)}
  if(t>=3){skCutin(id,t);delay=t===5?1100:950}
  var h=skHero();if(h&&h.el&&t>=2){h.el.classList.add('sk-glow');setTimeout(function(){h.el.classList.remove('sk-glow')},2600)}
  setTimeout(r,delay)}
function skFxHit(n){if(!skMotion())return;var B=skBoss();skCanvas();skBurst(B.x,B.y,SKC[S.cls]||'#fff',8+n*2,320);skShock(B.x,B.y,SKC[S.cls]||'#fff',60+n*6,.4,6)}

var SK_BAR0=skBar;skBar=function(s){var h=SK_BAR0(s),T=SK_TID[S.cls]||[],need=T.some(function(r,ti){return ti&&S.lvl>=SK_TIERS[ti]&&!(S.skb||{})[ti]});return need?h.replace(/<\/div>$/,'<small class="sk-act">🌟 '+esc(t('sk2_choose'))+'</small></div>'):h};

/* a skill needs a right answer first: one charge per right answer, at most one waiting */
function skChargeBar(h,s,act){var ok=s&&s.chg>0;if(!ok)h=h.replace(new RegExp('data-act="'+act+'"([^>]*)>','g'),function(m0,a){return a.indexOf('disabled')>=0?m0:'data-act="'+act+'"'+a+' disabled>'});return h.replace(/<\/div>$/,'<small class="sk-act">'+esc(t(ok?'sk2_ready':'sk2_wait'))+'</small></div>')}
var SK_BAR1=skBar;skBar=function(s){return skChargeBar(SK_BAR1(s),s,'skuse')};
var SK_TNB=skTnBar;skTnBar=function(s){return skChargeBar(SK_TNB(s),s,'sktnuse')};
(function(){var A=tnAnswer;tnAnswer=function(idx){var s=TN.enc,q=s&&s.qs&&s.qs[s.i];var before=s&&s.picked;A(idx);if(s&&q&&before===null&&s.picked!==null&&s.lastOk)s.chg=1}})();
