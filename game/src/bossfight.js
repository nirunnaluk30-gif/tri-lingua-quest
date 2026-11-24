/* =====================================================================
   SKILL-ONLY BOSS FIGHTS + PARTIES (2026-11-25)
   Monsters still ask questions. Every boss (zone, adventure gate, city / world
   raid) is a 90-second real-time fight: skills with cooldowns (unlocked by level
   and branch as before), the boss attacks back and the player dodges on time
   (a dodge in the last moment = PERFECT: a counter-hit and every cooldown −2 s).
   Damage = skill power × 10 × (1 + level/100) × combat power bonus × party bonus.
   Up to 5 players can fight one boss together: party/{pid} holds each player's
   lobby state, pfight/{pid} their live fight state (each writes only their own).
   The ledger keeps every press (e.bf); the teacher's checker replays it.
   Teacher switches: CFG.bfSkill (skill fights), CFG.ptOn (parties).
   ===================================================================== */
Object.assign(L,{
 bx_solo:m('⚔️ สู้คนเดียว','⚔️ Fight alone','⚔️ 单人挑战'),bx_make:m('👥 ตั้งตี้','👥 Make a party','👥 创建队伍'),bx_find:m('🔎 หาตี้','🔎 Find a party','🔎 寻找队伍'),
 bx_cancel:m('ยกเลิก','Cancel','取消'),bx_lv:m('บอส Lv.{n} · เลือด {h}','Boss Lv.{n} · HP {h}','首领 Lv.{n} · 血量 {h}'),
 bx_rule:m('ด่านบอสไม่มีคำถาม ใช้สกิลโจมตีภายใน 90 วินาที · เมื่อวงแดงหดเข้าหาตัว กด "หลบ" ให้ทัน ถ้ากดตอนวงแดงทับวงทองพอดีจะได้ PERFECT','No questions in boss fights: attack with skills within 90 s · when the red ring closes in, press Dodge in time; press as it meets the gold ring for a PERFECT','首领战没有题目:90 秒内用技能攻击 · 红圈收紧时及时按“闪避”,与金圈重合时按下即为 PERFECT'),
 bx_keys:m('คีย์บอร์ด: 1–6 สกิล · A โจมตี · Space หลบ','Keyboard: 1–6 skills · A attack · Space dodge','键盘:1–6 技能 · A 攻击 · 空格 闪避'),
 bx_dodge:m('หลบ','Dodge','闪避'),bx_basic:m('โจมตี','Attack','攻击'),bx_perfect:m('PERFECT!','PERFECT!','完美!'),bx_safe:m('หลบได้','Dodged','闪开了'),bx_early:m('เร็วไป!','Too early!','太早了!'),
 bx_down:m('หมดแรง! ลุกใน 5 วินาที','Knocked down! Up in 5 s','倒下了!5 秒后起身'),bx_downp:m('หมดแรง! รอเพื่อนชุบ หรือลุกเองใน 5 วินาที','Knocked down! A friend can revive you, or you get up in 5 s','倒下了!等队友复活,或 5 秒后自己起身'),
 bx_up:m('กลับมาสู้ต่อ!','Back in the fight!','重新战斗!'),bx_wait:m('{s} อีก {n} วินาที','{s} ready in {n} s','{s} 还需 {n} 秒'),bx_lockl:m('Lv.{n}','Lv.{n}','Lv.{n}'),bx_pick:m('เลือกสาย','Pick a branch','选择分支'),
 bx_go:m('สู้!','Fight!','战斗!'),bx_win:m('🏆 ชนะ! ล้มบอสได้','🏆 Victory! Boss defeated','🏆 胜利!击败首领'),bx_timeup:m('⏱ หมดเวลา','⏱ Time is up','⏱ 时间到'),
 bx_mydmg:m('ดาเมจของคุณ','Your damage','你的伤害'),bx_pc:m('PERFECT / โดนตี','PERFECT / hits taken','完美 / 被击中'),bx_ok:m('ตกลง','OK','确定'),bx_sec:m('ใช้เวลา {n} วินาที','Took {n} s','用时 {n} 秒'),
 bx_raidok:m('นับเป็นดาเมจบอส {n} จาก {q} หน่วย','Counts as {n} of {q} boss damage units','计为首领伤害 {n}/{q}'),bx_retry:m('บอสโซนและบอสประตู ลองใหม่ได้เลย','Zone and gate bosses can be tried again','区域和关卡首领可以再次挑战'),
 bx_warn:m('⚠ หลบ!','⚠ Dodge!','⚠ 闪避!'),bx_now:m('กดเลย!','Now!','就是现在!'),bx_all:m('⚠ ตีทั้งตี้! หลบ!','⚠ Hits the whole party! Dodge!','⚠ 全队攻击!闪避!'),bx_enr:m('🔥 คลั่ง','🔥 Enraged','🔥 狂暴'),
 pt_room:m('ห้องตี้','Party room','队伍房间'),pt_wait:m('ว่าง · รอเพื่อน…','Empty · waiting…','空位 · 等待中…'),pt_start:m('⚔️ เริ่มสู้พร้อมกัน ({n}/5)','⚔️ Start together ({n}/5)','⚔️ 一起开始({n}/5)'),
 pt_need:m('ต้องมีอย่างน้อย 2 คน เพื่อนกด "หาตี้" ที่บอสตัวเดียวกันแล้วเลือกห้องนี้ หรือพิมพ์รหัส','At least 2 players. Friends press "Find a party" at the same boss and pick this room, or type the code','至少 2 人。队友在同一首领处点“寻找队伍”并选择此房间,或输入房间码'),
 pt_rooms:m('ห้องที่เปิดอยู่ (บอสตัวเดียวกัน)','Open rooms (same boss)','开放的房间(同一首领)'),pt_none:m('ยังไม่มีห้อง ลองตั้งตี้เอง หรือรอสักครู่','No rooms yet. Make one yourself or wait a moment','还没有房间。自己创建一个或稍等'),
 pt_join:m('เข้าร่วม','Join','加入'),pt_full:m('ห้องเต็มแล้ว','The room is full','房间已满'),pt_gone:m('หัวหน้าตี้ปิดห้องแล้ว','The leader closed the room','队长已关闭房间'),pt_lead:m('หัวหน้าตี้','Leader','队长'),
 pt_ready:m('✓ พร้อม','✓ Ready','✓ 准备好'),pt_err:m('เชื่อมห้องตี้ไม่ได้ ครูต้องเพิ่มกฎฐานข้อมูลส่วนตี้ก่อน','Could not reach the party rooms. The teacher needs to add the party database rules first','无法连接队伍房间。老师需要先添加队伍数据库规则'),
 pt_off:m('ต้องเชื่อมระบบกลางก่อนจึงเล่นเป็นตี้ได้','Connect to the class server to play in a party','需要连接班级服务器才能组队'),
 pt_revive:m('💚 ชุบ','💚 Revive','💚 复活'),pt_revd:m('ชุบแล้ว!','Revived!','已复活!'),pt_helped:m('{n} ชุบให้!','{n} revived you!','{n} 复活了你!'),pt_lost:m('หลุด','Away','掉线'),
 pt_mvp:m('🏅 MVP','🏅 MVP','🏅 MVP'),pt_rule:m('ทุกคนที่ตีได้อย่างน้อย 5% ของเลือดบอสได้รางวัลเต็ม','Everyone who deals at least 5% of the boss HP gets the full reward','造成至少 5% 首领血量伤害的成员获得全部奖励'),
 pt_low:m('คุณตีไม่ถึง 5% ของเลือดบอส จึงยังไม่นับชนะ','You dealt under 5% of the boss HP, so the win does not count for you','你的伤害不足首领血量的 5%,本次胜利不计入'),pt_back:m('← กลับ','← Back','← 返回'),
 pt_code:m('รหัสห้อง','Room code','房间码'),pt_codeph:m('พิมพ์รหัส 4 หลัก','Type the 4-digit code','输入 4 位房间码'),pt_bonus:m('👥 ตี้ +{n}%','👥 Party +{n}%','👥 队伍 +{n}%'),pt_you:m('(คุณ)','(you)','(你)'),
 pt_joined:m('เข้าห้องแล้ว รอหัวหน้าตี้กดเริ่ม…','In the room. Waiting for the leader to start…','已进入房间,等待队长开始…')});
if(typeof CFG_LABELS!=='undefined')Object.assign(CFG_LABELS,{bfSkill:m('สู้บอสด้วยสกิล ไม่มีคำถาม (1 = เปิด, 0 = ปิด)','Skill-only boss fights, no questions (1 = on, 0 = off)','首领战只用技能、无题目(1 开 0 关)'),
 ptOn:m('เล่นเป็นตี้ 2–5 คนในด่านบอส (1 = เปิด, 0 = ปิด)','Parties of 2–5 in boss fights (1 = on, 0 = off)','首领战 2–5 人组队(1 开 0 关)')});

var BX=null,PT=null,BX_POS=[[105,205],[134,134],[205,105],[78,92],[38,200],[198,36]],BX_MATE=[[11,46],[40,49],[42,14],[9,26]];
var BX_BASIC={sword:'⚔️',mage:'✨',archer:'🏹'};
function bxOn(){return CFG.bfSkill!==0&&!window.__noBX}
function ptOn(){return CFG.ptOn!==0&&!!(CL.db&&CL.uid)}
function bxMe(){return CL.uid||'me'}
function r2(x){return Math.round(x*100)/100}
/* the skills this player can use now, in tier order; locked tiers come back as placeholders */
function bxSkills(){var T=SK_TID[S.cls]||[],now=Date.now(),out=[];
  T.forEach(function(r,ti){var id=null;r.forEach(function(x){if(!id&&skLv(S,x,now))id=x});
    if(id){var lv=skLv(S,id,now);out.push({id:id,ti:ti,lv:lv,d:skDmg(id,lv),cd:BF_CDT[ti]})}
    else out.push({id:null,ti:ti,need:S.lvl<SK_TIERS[ti]?SK_TIERS[ti]:0})});return out}
/* ---------- boss specs ---------- */
function bxSpecZone(zi){var z=ZONES[zi];return {kind:'z',key:'z:'+z.id,zi:zi,name:tx(z.boss.names),lv:bfZoneLv(zi),th:bfThemeOfZone(z),
  art:'<div class="boss-orb bx-orb" style="--bc:'+z.boss.color+'">'+esc(z.boss.pic)+'</div>',icon:'<span class="bf-ic bf-emo" style="--bc:'+z.boss.color+'">'+esc(z.boss.pic)+'</span>'}}
function bxSpecTn(){var g=tnCur(),f=TN.f,G=TN_GATE[g],id=G&&G.sprB?G.sprB[(f-1)%G.sprB.length]:'';
  return {kind:'tn',key:'tn:'+(g||'-')+':'+f,g:g,f:f,name:tnBossName(f)||(t('tn_guard')+' '+f),lv:bfTnLv(g,f),th:id?bfThemeOfMon(id):['forest','sea','abyss','desert','night','ice','lava','sky','abyss','night'][(f-1)%10],
   art:tnFoeHtml('boss'),icon:id?bfIcon(monSrc(id)):''}}
function bxSpecRd(n){var sl=rdSlot(),b=RDB==='ev'&&evCur();return {kind:'rd',key:'rd:'+sl.id,rid:sl.id,n:n,name:rdName(),lv:Math.max(10,S.lvl|0),th:bfThemeOfRaid(),art:rdPic(true),icon:b&&b.mon?bfIcon(monSrc(b.mon)):''}}
/* ---------- overlay ---------- */
function bxEl(){var e=document.getElementById('bx');if(!e){e=document.createElement('div');e.id='bx';e.className='bfx';e.setAttribute('role','dialog');e.setAttribute('aria-modal','true');document.body.appendChild(e);bxBind(e)}return e}
function bxClose(){if(BX){BX.over=true;BX.closed=true}ptStopAll();PT=null;var e=document.getElementById('bx');if(e)e.remove();document.body.classList.remove('bx-open');BX=null;render()}
function bxStage(sp){var me=avatar(S,{label:S.name,anim:true,noFx:true,petFront:true,noTitle:true});
  return '<div class="bf bx-bgw"><canvas class="bf-bg" data-th="'+sp.th+'" aria-hidden="true"></canvas></div>'+
   '<div class="bx-boss" id="bx_boss">'+sp.art+'</div><div class="fighter bx-hero" id="bx_hero"><div class="av">'+me+'</div></div><div id="bx_mates"></div>'+
   '<div class="bx-me"><span class="bf-lv">Lv.'+S.lvl+'</span><div class="bx-bars"><small>'+esc(S.name)+' · '+esc(tx(CLASSES[S.cls].names))+'</small><div class="bx-b1"><i id="bx_php" style="width:100%"></i></div><small>⚔️ '+bagCp().toLocaleString()+'</small></div></div>'+
   '<div class="bx-hud">'+(sp.icon||'')+'<div class="bx-hpw"><div class="bx-hpt"><b>'+esc(sp.name)+'</b><span><span class="bx-ptag" id="bx_ptag"></span> <span class="bx-enr" id="bx_enr">'+esc(t('bx_enr'))+'</span> <span id="bx_pct">100%</span> · ⏱ <span class="bx-tm" id="bx_tm">1:30</span></span></div><div class="bx-hpb"><i class="lag" id="bx_lag" style="width:100%"></i><i class="now" id="bx_hp" style="width:100%"></i></div></div></div>'+
   '<div class="bx-plist" id="bx_plist" hidden></div><div class="bx-tip" id="bx_tip"></div><div class="bx-redf" id="bx_redf"></div><canvas class="bx-fx" id="bx_fx" aria-hidden="true"></canvas>'+
   '<button class="bx-dodge" id="bx_dodge" data-bx="dodge" hidden>🌀<br>'+esc(t('bx_dodge'))+'<span class="cd" id="bx_dcd"></span></button><div class="bx-ring" id="bx_ring" hidden></div>'+
   '<div class="bx-over" id="bx_over"><div class="bx-panel" id="bx_panel"></div></div><div class="bx-cnt" id="bx_cnt" hidden></div>'}
function bxOpen(sp){if(document.getElementById('bx'))return;var e=bxEl();document.body.classList.add('bx-open');BX={sp:sp,pre:true};e.innerHTML=bxStage(sp);setTimeout(bfStart,0);bxPre();bxRing();bxResize()}
function bxPanel(h){var p=document.getElementById('bx_panel');if(p)p.innerHTML=h;var o=document.getElementById('bx_over');if(o)o.hidden=!h}
function bxPre(){var sp=BX.sp,hp=bfHp(sp.lv,1),sk=bxSkills().filter(function(x){return x.id});
  bxPanel('<h2>'+esc(sp.name)+'</h2><p class="bx-sub">'+esc(t('bx_lv').replace('{n}',sp.lv).replace('{h}',hp.toLocaleString()))+'</p><p>'+esc(t('bx_rule'))+'</p>'+
   '<div class="bx-sks">'+'<span class="bx-chip">'+(BX_BASIC[S.cls]||'⚔️')+' '+esc(t('bx_basic'))+'</span>'+sk.map(function(x){return '<span class="bx-chip">'+skIcon(x.id,22)+' '+esc(tx(SKN[x.id]))+'</span>'}).join('')+'</div>'+
   '<p class="bx-keys">'+esc(t('bx_keys'))+'</p><div class="bx-btns"><button class="bx-go" data-bx="solo">'+esc(t('bx_solo'))+'</button>'+
   (CFG.ptOn!==0?'<button class="bx-b2" data-bx="make">'+esc(t('bx_make'))+'</button><button class="bx-b2" data-bx="find">'+esc(t('bx_find'))+'</button>':'')+
   '<button class="bx-b3" data-bx="cancel">'+esc(t('bx_cancel'))+'</button></div>');
  var b=document.querySelector('#bx [data-bx="solo"]');if(b)b.focus()}
function bxRing(){var r=document.getElementById('bx_ring');if(!r)return;var sk=bxSkills();
  r.innerHTML='<button class="bx-sk big" data-bx="cast" data-id="b" style="left:205px;top:205px" aria-label="'+esc(t('bx_basic'))+' (A)"><span class="ic">'+(BX_BASIC[S.cls]||'⚔️')+'</span>'+esc(t('bx_basic'))+'<span class="cd"></span></button>'+
   sk.map(function(x,i){var p=BX_POS[i]||BX_POS[0];if(!x.id)return '<button class="bx-sk lock" disabled style="left:'+p[0]+'px;top:'+p[1]+'px" aria-label="'+esc(x.need?t('bx_lockl').replace('{n}',x.need):t('bx_pick'))+'"><span class="ic">🔒</span>'+esc(x.need?t('bx_lockl').replace('{n}',x.need):t('bx_pick'))+'</button>';
    return '<button class="bx-sk'+(x.ti>=4?' ult':'')+(x.ti===5?' god':'')+'" data-bx="cast" data-id="'+x.id+'" style="left:'+p[0]+'px;top:'+p[1]+'px" aria-label="'+esc(tx(SKN[x.id]))+' ('+(i+1)+')"><span class="ic">'+skIcon(x.id,26)+'</span><span class="nm">'+esc(tx(SKN[x.id]))+'</span><span class="cd"></span><span class="cdn"></span><span class="key">'+(i+1)+'</span></button>'}).join('')}
function bxResize(){var c=document.getElementById('bx_fx');if(!c)return;var d=Math.min(2,devicePixelRatio||1);c.width=innerWidth*d;c.height=innerHeight*d;c.getContext('2d').setTransform(d,0,0,d,0,0)}
addEventListener('resize',function(){if(document.getElementById('bx'))bxResize()});
function bxTip(s,ms){var e=document.getElementById('bx_tip');if(!e)return;e.textContent=s;e.style.opacity=1;clearTimeout(bxTip.h);bxTip.h=setTimeout(function(){e.style.opacity=0},ms||1200)}
function bxPos(el,fy){if(!el)return {x:innerWidth/2,y:innerHeight/2};var r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height*(fy||.45)}}
function bxPop(txt,cls,at){var bx=document.getElementById('bx');if(!bx)return;var p=at||bxPos(document.getElementById('bx_boss')),e=document.createElement('div');e.className='bx-dmg '+(cls||'');e.textContent=txt;
  e.style.left=Math.max(4,Math.min(innerWidth-120,p.x-50+Math.random()*60))+'px';e.style.top=(p.y-90+Math.random()*20)+'px';bx.appendChild(e);setTimeout(function(){e.remove()},1000)}
/* the skill VFX engine aims at the fight overlay while it is open */
(function(){var H0=skHero,B0=skBoss;skHero=function(){return document.getElementById('bx')?(skEl('#bx .bx-hero .av')||H0()):H0()};skBoss=function(){return document.getElementById('bx')?(skEl('#bx .bx-boss')||B0()):B0()}})();
/* ---------- the fight ---------- */
function bxStart(party){var sp=BX.sp,m=party?party.mem.length:1;
  BX={sp:sp,t:0,max:bfHp(sp.lv,m),dmg:0,oth:0,php:100,cd:{},dcd:0,next:3,tele:null,down:0,u:[],pc:0,hits:0,over:false,ai:0,rvcd:0,rv:{},rvSeen:0,cp:bagCpBonus(),m:m,
   mem:party?party.mem:[bxMe()],seed:party?party.seed:'s'+Date.now().toString(36)+Math.floor(Math.random()*1e6).toString(36),info:party?party.info:{},t0:Date.now(),last:performance.now(),party:!!party,mates:{}};
  bxPanel('');['bx_ring','bx_dodge'].forEach(function(id){var e=document.getElementById(id);if(e)e.hidden=false});
  var pg=document.getElementById('bx_ptag');if(pg)pg.textContent=party?t('pt_bonus').replace('{n}',5*(m-1)):'';
  if(party)ptFightStart();bxHud();bxTip(t('bx_go'),1200);sfx('lvl');requestAnimationFrame(bxLoop)}
function bxHitOf(d){var h=bfHit(d,S.lvl,BX.cp,BX.m),cri=Math.random()<.1;return [cri?Math.floor(h*1.5):h,cri]}
function bxDealt(n,cri,big){if(!BX||BX.over)return;BX.dmg+=n;var B=bxPos(document.getElementById('bx_boss'));
  if(!skMotion()){}else{skBurst(B.x,B.y,SKC[S.cls]||'#fff',big?30:10,big?560:300)}skBossHit();bxPop(cri?n+'!':String(n),cri?'cri':'');bxHud();bxCheckWin()}
function bxCast(id){if(!BX||BX.over||BX.pre||!(BX.t>=0)||BX.down>0)return;var x=null;
  if(id!=='b'){x=bxSkills().filter(function(s){return s.id===id})[0];if(!x)return}
  var cd=id==='b'?1:x.cd,left=BX.cd[id]||0;if(left>0){if(id!=='b')bxTip(t('bx_wait').replace('{s}',tx(SKN[id])).replace('{n}',left.toFixed(1)),700);return}
  BX.cd[id]=cd;BX.u.push([r2(BX.t),id]);var btn=document.querySelector('#bx [data-id="'+id+'"]');if(btn){btn.classList.remove('flash');void btn.offsetWidth;btn.classList.add('flash')}
  skLunge();var d=id==='b'?1:x.d,ti=id==='b'?-1:x.ti;
  if(id==='b'){skShot({col:SKC[S.cls]||'#fff',dur:.22,size:6,arrow:S.cls==='archer',trail:3,hit:function(){var r=bxHitOf(1);bxDealt(r[0],r[1],false)}});sfx('hit');return}
  skFxPlay(id);sfx('hit');setTimeout(function(){var r=bxHitOf(d);bxDealt(r[0],r[1],ti>=3)},ti===5?1700:ti>=3?1350:450)}
function bxDodge(){if(!BX||BX.over||BX.pre||BX.down>0||BX.dcd>0)return;BX.dcd=BF_PCD;var h=document.getElementById('bx_hero');if(h){h.classList.add('dodge');setTimeout(function(){h.classList.remove('dodge')},380)}
  var te=BX.tele;if(!te||te.tg.indexOf(bxMe())<0||te.me)return;var rem=te.at-BX.t,hp=bxPos(h);
  if(rem<=.35){te.me='p';BX.pc++;BX.u.push([r2(BX.t),'p']);Object.keys(BX.cd).forEach(function(k){BX.cd[k]=Math.max(0,BX.cd[k]-2)});bxPop(t('bx_perfect'),'per',hp);bxWarn(false);sfx('ok');
    setTimeout(function(){skShot({col:'#fff2a8',dur:.18,size:9,hit:function(){var r=bxHitOf(4);bxDealt(r[0],true,true);var b=document.getElementById('bx_boss');if(b){b.classList.remove('stag');void b.offsetWidth;b.classList.add('stag')}}})},120)}
  else if(rem<=.8){te.me='s';bxPop(t('bx_safe'),'good',hp);bxWarn(false)}else bxPop(t('bx_early'),'bad',hp)}
function bxWarn(on){var d=document.getElementById('bx_dodge');if(d)d.classList.toggle('warn',!!on)}
function bxEnr(){return BX.party?BX.t>60:BX.dmg>=BX.max*.7}
function bxNewTele(){BX.ai++;var i=BX.ai,tg;var alive=BX.mem;
  if(BX.party){tg=i%2===0?alive.slice():[alive[Math.floor(rng01(BX.seed,'t'+i)*alive.length)]]}else tg=[bxMe()];
  BX.tele={at:BX.t+BF_TELE,tg:tg,me:null};if(tg.indexOf(bxMe())>=0&&!(BX.down>0))bxWarn(true);
  var enr=bxEnr(),gap=(enr?(BX.party?2.6:3):(BX.party?3.4:4.2))+rng01(BX.seed,'g'+i)*(BX.party?1.4:2);BX.next=BX.t+BF_TELE+gap}
function bxBossHit(){var te=BX.tele;BX.tele=null;bxWarn(false);var b=document.getElementById('bx_boss');if(b){b.classList.add('lunge');setTimeout(function(){b.classList.remove('lunge')},300)}
  var col=(BF_TH[BX.sp.th]||BF_TH.night).au;
  te.tg.forEach(function(pid){if(pid===bxMe()){var h=document.getElementById('bx_hero'),H=bxPos(h);skShot({col:col,dur:.15,size:14,from:bxPos(b),to:H,hit:function(){if(!BX||BX.over)return;skBurst(H.x,H.y,col,22,380);
      if(te.me||BX.down>0||(h&&h.classList.contains('dodge')))return;BX.php=Math.max(0,BX.php-30);BX.hits++;bxPop('-30','bad',H);if(h){h.classList.remove('hurt');void h.offsetWidth;h.classList.add('hurt')}skShake(.5);
      var rf=document.getElementById('bx_redf');if(rf){rf.style.opacity=.9;setTimeout(function(){rf.style.opacity=0},300)}sfx('ng');
      if(BX.php<=0){BX.down=5;if(h)h.classList.add('down');bxTip(t(BX.party?'bx_downp':'bx_down'),1800)}bxHud()}})}
    else{var me=document.getElementById('bx_m_'+bxSafeId(pid));if(me){var P=bxPos(me);skShot({col:col,dur:.15,size:10,from:bxPos(b),to:P,hit:function(){skBurst(P.x,P.y,col,10,260)}})}}})}
function bxLoop(now){if(!BX||BX.closed)return;var dt=Math.min(.05,(now-BX.last)/1000);BX.last=now;
  if(!BX.over){BX.t+=dt;for(var k in BX.cd)BX.cd[k]=Math.max(0,BX.cd[k]-dt);BX.dcd=Math.max(0,BX.dcd-dt);BX.rvcd=Math.max(0,BX.rvcd-dt);
    if(BX.down>0){BX.down-=dt;if(BX.down<=0)bxStand('')}
    if(!BX.tele&&BX.t>=BX.next)bxNewTele();if(BX.tele&&BX.t>=BX.tele.at)bxBossHit();
    if(BX.party&&now-(BX.wr||0)>1500){BX.wr=now;ptFightWrite()}
    if(BX.t>=BF_ROUND)bxFinish(false);bxUi()}
  bxDrawFx();requestAnimationFrame(bxLoop)}
function bxStand(by){if(!BX)return;BX.down=0;BX.php=50;var h=document.getElementById('bx_hero');if(h)h.classList.remove('down');bxTip(by?t('pt_helped').replace('{n}',by):t('bx_up'));bxHud()}
function bxDrawFx(){var c=document.getElementById('bx_fx');if(!c||!BX)return;var g=c.getContext('2d');g.clearRect(0,0,innerWidth,innerHeight);var te=BX.tele;if(!te||BX.over)return;
  var k=1-(te.at-BX.t)/BF_TELE,perf=(te.at-BX.t)<=.35;
  te.tg.forEach(function(pid){var me=pid===bxMe();if(me&&(te.me||BX.down>0))return;var el=me?document.getElementById('bx_hero'):document.getElementById('bx_m_'+bxSafeId(pid));if(!el)return;
    var P=bxPos(el,.9),sc=me?1:.6,R0=130*sc,Rin=40*sc,R=R0-(R0-Rin)*k;g.save();g.translate(P.x,P.y);g.scale(1,.5);g.fillStyle='rgba(255,40,40,'+(.12+.2*k)+')';g.beginPath();g.arc(0,0,R0,0,7);g.fill();
    g.lineWidth=me?6:4;g.strokeStyle=perf&&me?'#fff2a8':'#ff4a4a';g.beginPath();g.arc(0,0,R,0,7);g.stroke();if(me){g.lineWidth=4;g.strokeStyle='#f3c64a';g.setLineDash([8,6]);g.beginPath();g.arc(0,0,Rin,0,7);g.stroke();g.setLineDash([])}g.restore();
    if(me){var H=bxPos(el,0);g.font='600 18px Mitr,sans-serif';g.textAlign='center';g.fillStyle=perf?'#fff2a8':'#ffdddd';g.fillText(perf?t('bx_now'):te.tg.length>1?t('bx_all'):t('bx_warn'),H.x,H.y-14)}})}
function bxUi(){var sk=bxSkills();['b'].concat(sk.filter(function(x){return x.id}).map(function(x){return x.id})).forEach(function(id){var b=document.querySelector('#bx [data-id="'+id+'"]');if(!b)return;
    var cd=id==='b'?1:BF_CDT[SK_DEF[id].t],l=BX.cd[id]||0,c=b.querySelector('.cd'),n=b.querySelector('.cdn');if(c)c.style.setProperty('--p',(l/cd*100)+'%');if(n)n.textContent=l>0?Math.ceil(l):'';b.classList.toggle('cool',l>0&&id!=='b');b.classList.toggle('ready',l<=0&&id!=='b'&&SK_DEF[id].t>=4)});
  var dc=document.getElementById('bx_dcd');if(dc)dc.style.setProperty('--p',(BX.dcd/BF_PCD*100)+'%');var r=Math.max(0,BF_ROUND-BX.t),tm=document.getElementById('bx_tm');if(tm){tm.textContent=Math.floor(r/60)+':'+String(Math.floor(r%60)).padStart(2,'0');tm.classList.toggle('low',r<15)}
  if(BX.party&&now0()-(BX.pl||0)>300){BX.pl=now0();ptList()}}
function now0(){return performance.now()}
function bxHud(){if(!BX)return;var left=Math.max(0,BX.max-BX.dmg-BX.oth),p=left/BX.max*100;[['bx_hp',p],['bx_lag',p]].forEach(function(x){var e=document.getElementById(x[0]);if(e)e.style.width=x[1]+'%'});
  var pc=document.getElementById('bx_pct');if(pc)pc.textContent=p.toFixed(1)+'%';var en=document.getElementById('bx_enr');if(en)en.classList.toggle('on',!BX.over&&bxEnr());var ph=document.getElementById('bx_php');if(ph)ph.style.width=BX.php+'%'}
function bxCheckWin(){if(BX&&!BX.over&&BX.dmg+BX.oth>=BX.max)bxFinish(true)}
function bxSafeId(p){return String(p).replace(/[^a-zA-Z0-9_-]/g,'_')}
/* ---------- finish: one ledger event per player ---------- */
function bxFinish(win){if(!BX||BX.over)return;BX.over=true;bxWarn(false);BX.tele=null;var sp=BX.sp,dur=Date.now()-BX.t0,sec=r2(Math.min(BX.t,BF_ROUND)),mineOk=!BX.party||BX.dmg>=Math.ceil(BX.max*.05);
  var bf={sec:sec,dmg:BX.dmg,cp:BX.cp,pc:BX.pc,u:BX.u,hp:BX.max,win:!!(win&&mineOk&&sp.kind!=='rd')};if(BX.party)bf.pt={r:BX.seed,m:BX.mem.slice()};if(sp.kind==='rd'){bf.win=false;delete bf.hp}
  if(BX.party)ptFightWrite(true,win);rollDaily();var res={win:win,mineOk:mineOk},tl0=typeof earnedTitles==='function'?earnedTitles():[];
  if(sp.kind==='z'){var z=ZONES[sp.zi],e=bBoss(S,z.id,bf.win,0,0,dur,today(),{c:[],w:[]},{},CFG);e.bf=bf;var g=commitEv(e);
    res.after=function(){var s={kind:'boss',zi:sp.zi,phase:'result',win:e.win,grant:g,qs:[],ok:0,n:0,pct:0};var tl1=typeof earnedTitles==='function'?earnedTitles().filter(function(x){return tl0.indexOf(x)<0}):[];if(tl1.length)s.newTitle=tl1[tl1.length-1];UI.sess=s;UI.scr='play'}}
  else if(sp.kind==='tn'){var gid=sp.g,f=sp.f,capped=tnCapped(S,today(),CFG,gid);if(!CL.uid&&!S.lseed)S.lseed='l'+Date.now().toString(36)+Math.floor(rnd(1e9)).toString(36);
    var b=bTnBoss(S,f,0,0,dur,today(),{c:[],w:[]},{},CFG,CL.uid||S.lseed,CL.uid?'u':'l',gid,bf),had={};(b.items||[]).forEach(function(id){had[id]=S.owned[id]||0});var g2=commitEv(b);
    res.after=function(){if(b.win){TN.bossMiss=[]}else{TN.boss.stun=90;TN.p.y=Math.min(94,TN.p.y+14)}
      TN.res={kind:'boss',win:b.win,g:g2,items:(b.items||[]).map(function(id,i){return {id:id,isNew:!had[id]&&b.items.indexOf(id)===i}}),taken:b.win&&!(b.items||[]).length,capped:capped};TN.enc=null;TN.mode='res'}}
  else{var n=sp.n,ok=bfRaidOk(n,BX.dmg,S.lvl),er=bRaid(S,sp.rid,n,ok,dur,today(),{c:[],w:[]},{},CFG);er.bf=bf;er.sb=ok;delete er.pen;if(ok>0&&typeof gdCur==='function'&&gdCur()&&gdDmg(CFG)>0)er.gd=ok*gdDmg(CFG);
    if(Date.now()>=ENH_T){er.st=ok>0?2:0;var cpb=bagCpBonus();if(cpb&&ok>0)er.cb=ok*cpb}var g3=commitEv(er);res.raid={ok:ok,n:n};rdUse(sp.rid.indexOf('ev-')===0?'ev':'wk');
    var mine=rdMine(sp.rid),body={name:S.name,n:mine.n,ok:mine.ok,sb:Math.min(mine.sb|0,SK_SBMAX),gd:mine.gd|0,cb:mine.cb|0,t:Date.now()};RD.hits[CL.uid]=body;
    if(CL.db&&CL.uid)retry(function(){return CL.db.doc('raid/'+sp.rid+'/hits/'+CL.uid).set(body)}).then(function(){},function(){RD.err=t('rd_rules')});
    res.after=function(){showReward(rdName(),g3)}}
  save();if(win)sfx('lvl');setTimeout(function(){bxEnd(res)},win?1100:400)}
function bxEnd(res){if(!BX)return;var sp=BX.sp,rows=[{n:S.name+' '+t('pt_you'),d:BX.dmg}];
  if(BX.party)BX.mem.forEach(function(p){if(p===bxMe())return;var d=PT&&PT.fd[p];rows.push({n:(BX.info[p]&&BX.info[p].name)||'—',d:d&&d.r===BX.seed?d.dmg|0:0})});rows.sort(function(a,b){return b.d-a.d});
  var tot=rows.reduce(function(a,r){return a+r.d},0)||1;
  bxPanel('<h2>'+esc(res.win?t('bx_win'):t('bx_timeup'))+'</h2><p>'+esc(res.win?t('bx_sec').replace('{n}',BX.t.toFixed(1)):sp.kind==='rd'?'':t('bx_retry'))+'</p>'+
   (BX.party?'<table class="bx-tbl">'+rows.map(function(r,i){return '<tr><td>'+(i===0?esc(t('pt_mvp'))+' · ':'')+esc(r.n)+'</td><td>'+r.d.toLocaleString()+' ('+Math.round(r.d/tot*100)+'%)</td></tr>'}).join('')+'</table><p class="bx-sub">'+esc(t('pt_rule'))+'</p>'+(res.win&&!res.mineOk&&sp.kind!=='rd'?'<p class="bx-bad">'+esc(t('pt_low'))+'</p>':''):'')+
   '<div class="bx-res"><div>'+esc(t('bx_mydmg'))+'<b>'+BX.dmg.toLocaleString()+'</b></div><div>'+esc(t('bx_pc'))+'<b>'+BX.pc+' / '+BX.hits+'</b></div></div>'+
   (res.raid?'<p>'+esc(t('bx_raidok').replace('{n}',res.raid.ok).replace('{q}',res.raid.n))+'</p>':'')+'<div class="bx-btns"><button class="bx-go" data-bx="end">'+esc(t('bx_ok'))+'</button></div>');
  BX.after=res.after;var b=document.querySelector('#bx [data-bx="end"]');if(b)b.focus()}
/* ---------- input ---------- */
function bxBind(el){el.addEventListener('pointerdown',function(e){var b=e.target.closest('[data-bx]');if(!b)return;var a=b.getAttribute('data-bx');if(a==='cast'||a==='dodge'||a==='rv'){e.preventDefault();bxAct(a,b.getAttribute('data-id'))}});
  el.addEventListener('click',function(e){var b=e.target.closest('[data-bx]');if(!b||b.disabled)return;var a=b.getAttribute('data-bx');if((a==='cast'||a==='dodge'||a==='rv')&&e.detail!==0)return;bxAct(a,b.getAttribute('data-id'))});
  el.addEventListener('input',function(e){if(e.target&&e.target.id==='pt_code'){PT&&(PT.q=e.target.value.replace(/\D/g,'').slice(0,4));ptFindDraw()}})}
function bxAct(a,id){switch(a){case 'cast':bxCast(id);break;case 'dodge':bxDodge();break;case 'rv':ptRevive(id);break;
  case 'solo':bxCountdown(null);break;case 'cancel':bxClose();break;case 'make':ptMake();break;case 'find':ptFind();break;case 'join':ptJoin(id);break;case 'pstart':ptGo();break;
  case 'pback':ptLeave();bxPre();break;case 'end':var f=BX&&BX.after;bxClose();if(f){f();render()}break}}
addEventListener('keydown',function(e){if(!document.getElementById('bx'))return;var k=(e.key||'').toLowerCase();
  if(k==='escape'&&BX&&BX.pre&&!PT){bxClose();e.preventDefault();e.stopImmediatePropagation();return}
  if(!BX||BX.pre||BX.over){if(e.target&&e.target.id==='pt_code')return;if(k===' '||/^[1-6a]$/.test(k)){e.stopImmediatePropagation()}return}
  if(k===' '){bxDodge()}else if(k==='a'){bxCast('b')}else if(/^[1-6]$/.test(k)){var x=bxSkills()[+k-1];if(x&&x.id)bxCast(x.id)}else return;e.preventDefault();e.stopImmediatePropagation()},true);
function bxCountdown(party){var c=document.getElementById('bx_cnt');bxPanel('');if(!c){bxStart(party);return}var n=3;c.hidden=false;c.textContent=n;
  var iv=setInterval(function(){if(!document.getElementById('bx')){clearInterval(iv);return}n--;if(n>0)c.textContent=n;else{clearInterval(iv);c.textContent=t('bx_go');setTimeout(function(){c.hidden=true},500);bxStart(party)}},700)}
/* ---------- parties ---------- */
function ptDoc(){return CL.db.doc('party/'+CL.uid)}
function ptLook(){var l=typeof myLook==='function'?myLook():{name:S.name,cls:S.cls,g:S.gender,eq:{}};if(typeof gdCur==='function'&&gdCur())l.gd=gdCur();return l}
function ptFresh(d){return d&&typeof d.ts==='number'&&Date.now()-d.ts<45000}
function ptErr(){bxTip(t('pt_err'),3000);ptStopAll();PT=null;bxPre()}
function ptListen(){if(PT.lunsub)return;try{PT.lunsub=CL.db.collection('party').onSnapshot(function(snap){if(!PT)return;var o={};snap.docs.forEach(function(d){o[d.id]=d.data()});PT.all=o;ptTick()},function(){if(PT)ptErr()})}catch(e){ptErr()}}
function ptBeat(){if(!PT)return;clearInterval(PT.hb);PT.hb=setInterval(function(){if(PT&&PT.mine)ptDoc().set(Object.assign(PT.mine,{ts:Date.now()})).catch(function(){})},12000)}
function ptWrite(o){PT.mine=Object.assign({name:S.name,lv:S.lvl,cls:S.cls,look:ptLook(),bk:BX.sp.key,ts:Date.now()},o);return ptDoc().set(PT.mine).catch(function(){ptErr()})}
function ptMake(){if(!ptOn()){bxTip(t('pt_off'),2400);return}var code=String(1000+Math.floor(Math.random()*9000));PT={role:'lead',code:code,all:{},fd:{},q:''};
  ptWrite({lead:CL.uid,code:code,st:'lobby',ts0:Date.now()});ptListen();ptBeat();ptLeadDraw()}
function ptMembers(lead){var all=PT.all||{};return Object.keys(all).filter(function(p){var d=all[p];return p!==lead&&d&&d.join===lead&&d.st==='join'&&d.bk===BX.sp.key&&ptFresh(d)}).sort(function(a,b){return (all[a].ts0||0)-(all[b].ts0||0)}).slice(0,4)}
function ptSlots(lead,mem){var all=PT.all||{},ids=[lead].concat(mem),h='<div class="pt-slots">';
  for(var i=0;i<5;i++){var p=ids[i],d=p===CL.uid?PT.mine:all[p];h+=p&&d?'<div class="pt-slot on">'+(d.look?townAvatar({d:Object.assign({},d.look,{name:d.name})}):'')+'<b>'+esc(d.name||'—')+(i===0?' 👑':'')+'</b><small>Lv.'+(d.lv|0)+' · '+esc(tx((CLASSES[d.cls]||CLASSES.mage).names))+'</small><small class="ok">'+esc(i===0?t('pt_lead'):t('pt_ready'))+'</small></div>':'<div class="pt-slot">'+esc(t('pt_wait'))+'</div>'}return h+'</div>'}
function ptLeadDraw(){if(!PT||PT.role!=='lead'||!BX||!BX.pre)return;var mem=ptMembers(CL.uid);
  bxPanel('<h2>👥 '+esc(t('pt_room'))+' <span class="pt-code">'+PT.code+'</span></h2><p class="bx-sub">'+esc(BX.sp.name)+'</p>'+ptSlots(CL.uid,mem)+'<p class="bx-keys">'+esc(t('pt_need'))+'</p>'+
   '<div class="bx-btns"><button class="bx-go" data-bx="pstart"'+(mem.length?'':' disabled')+'>'+esc(t('pt_start').replace('{n}',mem.length+1))+'</button><button class="bx-b3" data-bx="pback">'+esc(t('pt_back'))+'</button></div>')}
function ptFind(){if(!ptOn()){bxTip(t('pt_off'),2400);return}PT={role:'find',all:{},fd:{},q:''};ptListen();ptFindDraw()}
function ptRooms(){var all=PT.all||{};return Object.keys(all).filter(function(p){var d=all[p];return p!==CL.uid&&d&&d.lead===p&&d.st==='lobby'&&d.bk===BX.sp.key&&ptFresh(d)&&(!PT.q||String(d.code).indexOf(PT.q)===0)})}
function ptFindDraw(){if(!PT||PT.role!=='find'||!BX||!BX.pre)return;var rs=ptRooms(),inp=document.getElementById('pt_code');
  var list=rs.length?rs.map(function(p){var d=PT.all[p],n=ptMembers(p).length+1;return '<div class="pt-room"><span><b>'+esc(d.name||'—')+'</b> · Lv.'+(d.lv|0)+'<small> · '+esc(t('pt_code'))+' '+esc(d.code)+' · '+n+'/5</small></span><button class="bx-b2" data-bx="join" data-id="'+esc(p)+'"'+(n>=5?' disabled':'')+'>'+esc(n>=5?t('pt_full'):t('pt_join'))+'</button></div>'}).join(''):'<p class="bx-sub">'+esc(t('pt_none'))+'</p>';
  if(inp&&document.getElementById('pt_rooms')){document.getElementById('pt_rooms').innerHTML=list;return}
  bxPanel('<h2>🔎 '+esc(t('pt_rooms'))+'</h2><input id="pt_code" class="pt-input" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="'+esc(t('pt_codeph'))+'" value="'+esc(PT.q||'')+'"><div id="pt_rooms">'+list+'</div><div class="bx-btns"><button class="bx-b3" data-bx="pback">'+esc(t('pt_back'))+'</button></div>')}
function ptJoin(lead){if(!PT)return;PT.role='mem';PT.lead=lead;ptWrite({join:lead,st:'join',ts0:Date.now()});ptBeat();ptMemDraw()}
function ptMemDraw(){if(!PT||PT.role!=='mem'||!BX||!BX.pre)return;var L0=PT.all[PT.lead];
  bxPanel('<h2>👥 '+esc(t('pt_room'))+(L0?' <span class="pt-code">'+esc(L0.code)+'</span>':'')+'</h2><p class="bx-sub">'+esc(t('pt_joined'))+'</p>'+ptSlots(PT.lead,ptMembers(PT.lead))+'<div class="bx-btns"><button class="bx-b3" data-bx="pback">'+esc(t('pt_back'))+'</button></div>')}
function ptTick(){if(!PT||!BX)return;if(!BX.pre)return;
  if(PT.role==='lead')ptLeadDraw();else if(PT.role==='find')ptFindDraw();
  else if(PT.role==='mem'){var L0=PT.all[PT.lead];
    if(L0&&L0.st==='go'&&L0.bk===BX.sp.key&&Array.isArray(L0.mem)){if(L0.mem.indexOf(CL.uid)>=0){if(!PT.going){PT.going=true;ptLaunch(L0.mem,L0.seed)}}else{bxTip(t('pt_full'),2400);PT.role='find';ptWrite({st:'left'});ptFindDraw()}return}
    if(!L0||L0.st!=='lobby'||!ptFresh(L0)){bxTip(t('pt_gone'),2400);PT.role='find';ptWrite({st:'left'});ptFindDraw();return}ptMemDraw()}}
function ptGo(){if(!PT||PT.role!=='lead')return;var mem=[CL.uid].concat(ptMembers(CL.uid));if(mem.length<2)return;var seed='p'+PT.code+'-'+Date.now().toString(36);
  ptWrite({lead:CL.uid,code:PT.code,st:'go',mem:mem,seed:seed,ts0:PT.mine.ts0}).then(function(){ptLaunch(mem,seed)})}
function ptLaunch(mem,seed){if(!PT||!BX)return;var info={};mem.forEach(function(p){var d=p===CL.uid?PT.mine:PT.all[p];info[p]={name:d&&d.name||'—',look:d&&d.look||null,cls:d&&d.cls||'mage'}});
  if(PT.lunsub){try{PT.lunsub()}catch(e){}PT.lunsub=null}clearInterval(PT.hb);PT.fight={mem:mem,seed:seed,info:info};bxCountdown({mem:mem,seed:seed,info:info})}
function ptLeave(){if(!PT)return;if(PT.mine&&CL.db&&CL.uid)ptDoc().set(Object.assign(PT.mine,{st:'left',ts:Date.now()})).catch(function(){});ptStopAll();PT=null}
function ptStopAll(){if(!PT)return;if(PT.lunsub){try{PT.lunsub()}catch(e){}PT.lunsub=null}clearInterval(PT.hb);(PT.funs||[]).forEach(function(u){try{u()}catch(e){}});PT.funs=[];
  if(PT.mine&&PT.mine.st!=='left'&&PT.mine.st!=='done'&&CL.db&&CL.uid&&!PT.fight)ptDoc().set(Object.assign(PT.mine,{st:'left',ts:Date.now()})).catch(function(){})}
/* in the fight: everyone writes pfight/{own id} every 1.5 s and listens to the others */
function ptFightStart(){var me=CL.uid,box=document.getElementById('bx_mates');PT.fd={};PT.funs=[];
  if(box)box.innerHTML=BX.mem.filter(function(p){return p!==me}).map(function(p,i){var I=BX.info[p]||{},pos=BX_MATE[i]||BX_MATE[0];return '<div class="bx-mate" id="bx_m_'+bxSafeId(p)+'" style="left:'+pos[0]+'%;bottom:'+pos[1]+'%;--c:'+(SKC[I.cls]||'#fff')+'"><span class="tag">'+esc(I.name||'—')+'</span>'+(I.look?townAvatar({d:Object.assign({},I.look,{name:''})}):'')+'</div>'}).join('');
  document.getElementById('bx_plist').hidden=false;
  BX.mem.forEach(function(p){if(p===me)return;try{PT.funs.push(CL.db.doc('pfight/'+p).onSnapshot(function(sn){var d=sn&&sn.exists?sn.data():null;if(!d||d.r!==BX.seed||!BX)return;var old=PT.fd[p];PT.fd[p]=d;ptSeen(p,old,d)},function(){}))}catch(e){}});
  if(PT.role!=='lead')ptDoc().set(Object.assign(PT.mine||{},{st:'done',ts:Date.now()})).catch(function(){});ptFightWrite()}
function ptFightWrite(fin,win){if(!BX||!CL.db||!CL.uid)return;CL.db.doc('pfight/'+CL.uid).set({r:BX.seed,dmg:BX.dmg,hp:BX.php,dn:BX.down>0?1:0,rv:BX.rv,ts:Date.now(),fin:fin?1:0,win:win?1:0,name:S.name}).catch(function(){})}
function ptSeen(p,old,d){if(!BX)return;var el=document.getElementById('bx_m_'+bxSafeId(p)),gain=(d.dmg|0)-((old&&old.dmg)|0);
  if(gain>0&&el&&!BX.over){var I=BX.info[p]||{};skShot({col:SKC[I.cls]||'#fff',dur:.22,size:5,from:bxPos(el),hit:function(){skBossHit()}});if(Math.random()<.6)bxPop(String(gain),'mate',(function(B){return {x:B.x+90,y:B.y+40}})(bxPos(document.getElementById('bx_boss'))))}
  if(el)el.classList.toggle('down',!!d.dn);
  BX.oth=BX.mem.reduce(function(a,q){var x=PT.fd[q];return a+(q!==CL.uid&&x&&x.r===BX.seed?x.dmg|0:0)},0);
  var seen=BX.mem.reduce(function(a,q){var x=PT.fd[q];return a+((x&&x.rv&&x.rv[CL.uid])|0)},0);if(seen>BX.rvSeen){BX.rvSeen=seen;if(BX.down>0)bxStand(d.name||'')}
  bxHud();if(d.fin&&d.win)bxFinish(true);else bxCheckWin()}
function ptRevive(p){if(!BX||BX.over||BX.down>0||BX.rvcd>0)return;var d=PT&&PT.fd[p];if(!d||!d.dn)return;BX.rv[p]=(BX.rv[p]|0)+1;BX.rvcd=15;BX.u.push([r2(BX.t),'r']);
  var el=document.getElementById('bx_m_'+bxSafeId(p));if(el){var P=bxPos(el);skBurst(P.x,P.y,'#7dffb0',20,260);bxPop(t('pt_revd'),'good',P)}ptFightWrite();ptList()}
function ptList(){var el=document.getElementById('bx_plist');if(!el||!BX)return;var rows=[{p:CL.uid,n:S.name+' '+t('pt_you'),d:BX.dmg,hp:BX.php,dn:BX.down>0,me:1,c:SKC[S.cls]}];
  BX.mem.forEach(function(p){if(p===CL.uid)return;var x=PT&&PT.fd[p],I=BX.info[p]||{},lost=!x||Date.now()-(x.ts||0)>8000;rows.push({p:p,n:I.name||'—',d:x?x.dmg|0:0,hp:x?x.hp:100,dn:x&&x.dn,lost:lost&&!BX.over,c:SKC[I.cls]})});
  var h=rows.sort(function(a,b){return b.d-a.d}).map(function(r){return '<div class="pt-row'+(r.me?' mine':'')+(r.dn?' dn':'')+'" style="--c:'+(r.c||'#fff')+'"><span>'+(r.dn?'💫 ':'')+esc(r.n)+(r.lost?' · '+esc(t('pt_lost')):'')+'</span><b>'+r.d.toLocaleString()+'</b><span class="hb"><i style="width:'+Math.max(0,Math.min(100,r.hp))+'%"></i></span>'+
   (!r.me&&r.dn&&!(BX.down>0)&&!BX.over?'<button data-bx="rv" data-id="'+esc(r.p)+'"'+(BX.rvcd>0?' disabled':'')+'>'+esc(t('pt_revive'))+(BX.rvcd>0?' ('+Math.ceil(BX.rvcd)+')':'')+'</button>':'')+'</div>'}).join('');
  if(h!==ptList.last){ptList.last=h;el.innerHTML=h}}
/* ---------- entry points: zone boss, adventure-gate boss, city / world raid ---------- */
(function(){
  var SB=startBoss;startBoss=function(zi){if(!bxOn()||!ZONES[zi]||!zoneWords(ZONES[zi]).length)return SB(zi);if(CL.ban){toast(t('ban_note'));return}bxOpen(bxSpecZone(zi))};
  var TE=tnEncounter;tnEncounter=function(kind,mi){if(!bxOn()||kind!=='boss')return TE(kind,mi);TN.keys={};TN.tg=null;TN.mode='map';bxOpen(bxSpecTn())};
  var RJ=rdJoin;rdJoin=function(){if(!bxOn())return RJ();if(CL.ban){toast(t('ban_note'));return}var sl=rdSlot(),now=Date.now();if(!rdAct(sl,now)||rdStats().dead)return;var rem=rdBC().q-rdMine(sl.id).n;if(rem<=0)return;bxOpen(bxSpecRd(Math.min(5,rem)))};
})();
if(location.protocol==='file:')window.__BX={st:function(){return BX},fw:function(){ptFightWrite()},pt:function(){return PT},zone:function(zi){startBoss(zi)},pick:function(c){skPickBranch(c)},
  bot:function(on,noDodge){clearInterval(window.__BX.iv);if(!on)return;window.__BX.iv=setInterval(function(){if(!BX||BX.pre||BX.over)return;var te=BX.tele;if(!noDodge&&te&&te.tg.indexOf(bxMe())>=0&&!te.me&&te.at-BX.t<=.3)bxDodge();
    bxSkills().forEach(function(x){if(x.id&&!(BX.cd[x.id]>0))bxCast(x.id)});if(!(BX.cd.b>0))bxCast('b')},60)},
  verify:function(){return verifyLedger({events:S.log,state:S,adjust:[],audit:[],ctx:verCtx(),uid:CL.uid,now:Date.now(),metaN:S.n}).issues.map(function(x){return x.s+':'+x.k+':'+x.msg})},
  last:function(k){for(var i=S.log.length-1;i>=0;i--)if(S.log[i].k===k)return JSON.parse(JSON.stringify(S.log[i]));return null}};
