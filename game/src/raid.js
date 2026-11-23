/* =====================================================================
   CHAOS CITY BOSS — one shared boss a week.
   raid/{rid}/hits/{uid} = {name,n,ok,t}: each player's answers (rules cap n).
   The boss falls when the correct answers of everyone add up to raidHP.
   Then each player who joined claims once (ledger 'raidwin'): the draw that
   decides who gets the mythic / legendary / rare items depends only on the
   boss id and the list of players who joined, so everyone (and the teacher's
   checker) gets the same answer.
   ===================================================================== */
Object.assign(L,{
 rd_name:m('บอสเมืองโกลาหล','Chaos City Boss','混沌之城首领'),
 rd_desc:m('บอสยักษ์ที่ทุกคนต้องช่วยกันตี! แต่ละคนตอบได้ {q} ข้อ ทุกข้อที่ตอบถูกลดพลังบอส 1 แต้ม ต้องช่วยกันให้ครบ {hp} แต้ม','A giant boss everyone fights together! Each player answers {q} questions; every correct answer takes 1 HP. Together you need {hp}','全体玩家共同挑战的巨型首领!每人可答 {q} 题,每答对一题扣1点血量,需共同打掉 {hp} 点'),
 rd_next:m('บอสตัวต่อไปจะเกิด','The next boss appears','下一只首领出现于'),rd_in:m('อีก','in','还有'),rd_left:m('เหลือเวลา','Time left','剩余时间'),
 rd_live:m('🔥 บอสเกิดแล้ว! มาช่วยกันตี','🔥 The boss is here! Come and fight','🔥 首领已出现!快来一起打'),rd_hp:m('พลังชีวิตบอส','Boss HP','首领血量'),rd_joined:m('ผู้ร่วมตี','Fighters','参战人数'),
 rd_join:m('เข้าร่วมตี ({n} ข้อ)','Join the fight ({n} questions)','参战({n}题)'),rd_done:m('คุณตอบครบ {n} ข้อแล้ว รอเพื่อน ๆ ช่วยกันตีให้บอสตาย','You answered all {n} — now wait for friends to finish the boss','你已答完 {n} 题,等待同伴一起击败首领'),
 rd_dead:m('🏆 บอสเมืองโกลาหลถูกปราบแล้ว!','🏆 The Chaos City boss has fallen!','🏆 混沌之城首领已被击败!'),rd_fled:m('บอสหนีไปแล้ว ครั้งนี้ยังตีไม่ตาย','The boss escaped this time','首领这次逃走了'),
 rd_claim:m('รับรางวัล','Claim reward','领取奖励'),rd_wait:m('รางวัลจะเปิดให้รับใน {s} วินาที (รอผลการตีรอบสุดท้าย)','Rewards open in {s} s (waiting for the last hits)','奖励将在 {s} 秒后开放(等待最后的攻击结果)'),
 rd_got:m('รางวัลของคุณ','Your reward','你的奖励'),rd_notjoin:m('คุณไม่ได้ร่วมตีบอสตัวนี้ รอบหน้ามาช่วยกันนะ','You did not join this boss — come next time!','你没有参战这只首领,下次一起来吧!'),
 rd_rew:m('รางวัลเมื่อบอสตาย: ทุกคนที่ร่วมตีได้ฉายา “นักฆ่าเมืองโกลาหล” + {exp} EXP · สุ่มแจกของระดับตำนาน {lg} ชิ้น (คนละ 1 ชิ้น) · คนที่เหลือได้ของหายากคนละ 1 ชิ้น','When the boss falls: everyone who fought gets the “Chaos City Slayer” title + {exp} EXP · {lg} legendary items drawn at random (one each) · everyone else gets a rare item','击败后:所有参战者获得“混沌之城屠戮者”称号 + {exp} 经验 · 随机抽出 {lg} 件传说道具(每人一件)· 其余每人获得一件稀有道具'),
 rd_when:m('บอสเกิดทุกวัน{d} เวลา {h}:00 น. และอยู่ {n} ชั่วโมง','The boss appears every {d} at {h}:00 and stays {n} hours','首领每{d} {h}:00 出现,停留 {n} 小时'),
 rd_top:m('นักรบที่ช่วยตีมากที่สุด','Top fighters','最强参战者'),rd_q:m('คำถาม','Question','题'),rd_dmg:m('ดาเมจ','damage','伤害'),
 rd_saved:m('บันทึกการโจมตีแล้ว','Your hits are recorded','已记录你的攻击'),rd_rules:m('ส่งผลการตีขึ้นระบบกลางไม่ได้ ให้ครูอัปเดตกฎฐานข้อมูล (firestore.rules) ใน Firebase','Could not send your hits — the teacher needs to update the database rules (firestore.rules) in Firebase','无法上传攻击结果,请老师在 Firebase 更新数据库规则(firestore.rules)'),
 rd_off:m('ต้องเข้าสู่ระบบออนไลน์จึงจะร่วมตีบอสรวมได้','Sign in online to join the shared boss','需要在线登录才能参战共同首领'),
 rd_closed:m('ครูปิดบอสเมืองโกลาหลไว้','The teacher has turned the Chaos City boss off','老师关闭了混沌之城首领'),
 rd_title:m('ได้ฉายา “นักฆ่าเมืองโกลาหล”!','Title earned: “Chaos City Slayer”!','获得称号“混沌之城屠戮者”!'),
 rd_evdead:m('🏆 {n} ถูกปราบแล้ว!','🏆 {n} has fallen!','🏆 {n} 已被击败!'),rd_evname:m('บอสพิเศษในเมือง','Special city boss','城市特别首领'),
 rd_evwait:m('บอสปรากฏตัวแล้ว! เริ่มตีได้ {d} (อีก {r})','The boss is here! The fight opens {d} (in {r})','首领已出现!{d} 开打(还有 {r})'),
 rd_evdesc:m('{name} บอสพิเศษบุกเมือง! แต่ละคนตอบได้ {q} ข้อ ทุกข้อที่ตอบถูกลดพลังบอส 1 แต้ม ต้องช่วยกันให้ครบ {hp} แต้ม','{name}, a special boss, is here! Each player answers {q} questions; every correct answer takes 1 HP. Together you need {hp}','特别首领{name}来袭!每人可答 {q} 题,每答对一题扣1点血量,需共同打掉 {hp} 点'),
 rd_evwhen:m('เริ่มตีได้ {d} · อยู่ {n} ชั่วโมงหรือจนกว่าจะถูกปราบ','Fight opens {d} · stays {n} hours or until it falls','{d} 开打 · 停留 {n} 小时或直到被击败'),
 rd_evrew:m('รางวัลเมื่อบอสตาย: ทุกคนที่ร่วมตีได้ 🪙 {c} + 💎 {g} + {exp} EXP · สุ่มของดรอปคนละไม่เกิน 1 ชิ้น: ระดับสวรรค์ {cel} ชิ้น · เหนือตำนาน {my} ชิ้น · ตำนาน {lg} ชิ้น','When it falls: everyone who fought gets 🪙 {c} + 💎 {g} + {exp} EXP · drops drawn at random, at most one each: {cel} celestial · {my} mythic · {lg} legendary','击败后:所有参战者获得 🪙 {c} + 💎 {g} + {exp} 经验 · 随机掉落(每人最多一件):天界 {cel} 件 · 超传说 {my} 件 · 传说 {lg} 件'),
 rd_evnone:m('ครั้งนี้ไม่ได้ของดรอป แต่ได้เหรียญ เพชร และ EXP','No drop this time, but you get coins, gems and EXP','这次没有掉落,但获得金币、宝石和经验'),
 rd_evend:m('บอสพิเศษจบแล้ว','The special boss is over','特别首领已结束'),
 rd_days:[m('อาทิตย์','Sunday','周日'),m('จันทร์','Monday','周一'),m('อังคาร','Tuesday','周二'),m('พุธ','Wednesday','周三'),m('พฤหัสบดี','Thursday','周四'),m('ศุกร์','Friday','周五'),m('เสาร์','Saturday','周六')]});
var RD={rid:'',hits:{},unsub:null,enc:null,res:null,err:'',ver:{},verAt:0};
var RD_SETTLE=60e3;
/* two bosses can be on at once: the weekly one ('wk') and a teacher's event boss ('ev'); RD points at the one being viewed */
var RDS={wk:RD,ev:{rid:'',hits:{},unsub:null,enc:null,res:null,err:'',ver:RD.ver,verAt:0}},RDB='wk';
function rdUse(k){RDB=k==='ev'?'ev':'wk';RD=RDS[RDB]}
/* the boss shown now: one that is live first, then the next one coming, then one that just ended */
function evCur(){var now=Date.now(),w=EV_BOSSES.filter(function(b){return now>=b.start-36*3600e3&&now<=b.start+b.hours*3600e3+24*3600e3});return w.filter(function(b){return now>=b.start&&now<=b.start+b.hours*3600e3})[0]||w.filter(function(b){return now<b.start})[0]||w[0]||null}
function rdOn(){return RDB==='ev'?!!evCur():CFG.raidOn!==0}
function rdSlot(){if(RDB==='ev'){var b=evCur();return b?evSlotOf(b):{id:'',start:9e15,end:0,next:9e15}}return raidSlot(Date.now(),CFG)}
function rdAct(sl,now){return now>=sl.start&&now<=sl.end}
function rdBC(){return bossCfg(rdSlot().id,CFG)}
Object.assign(L,{rd_penrule:m('สกิลบอส: ตอบผิด 1 ข้อ เสีย {n} เหรียญ','Boss skill: every wrong answer costs {n} coins','首领技能:答错一题失去 {n} 金币'),rd_penlost:m('เสียไปแล้ว {n} 🪙','{n} 🪙 lost so far','已失去 {n} 🪙'),rd_pencast:m('แพะแห่งโลกาใช้สกิล “กลืนทรัพย์”!','The World Goat casts “Coin Devourer”!','世界之羊施放“吞金术”!'),rd_world:m('🌍 บอสโลก','🌍 World boss','🌍 世界首领'),rd_pennote:m('ระวัง! บอสตัวนี้กลืนเหรียญ ตอบผิดข้อละ {n} เหรียญ','Careful! This boss eats coins: {n} per wrong answer','小心!这个首领会吞金币:答错一题 {n} 金币')});
function rdEmo(){var b=RDB==='ev'&&evCur();return b&&b.emo?b.emo:b&&b.art==='rex'?'🐉':'🦁'}
function rdName(){var b=RDB==='ev'&&evCur();return b?tx(b.names):t('rd_name')}
function rdDeadTxt(){return RDB==='ev'?t('rd_evdead').replace('{n}',rdName()):t('rd_dead')}
function rdPic(big,hurt){if(RDB!=='ev')return rdArt(big,hurt);var b=evCur();if(b&&b.mon&&typeof monImg==='function')return '<span class="goat-art'+(big?' big':'')+(hurt?' hurt':'')+'">'+monImg(b.mon,'rd-art')+'</span>';return b&&b.art==='rex'&&typeof mechaRex==='function'?mechaRex('rx'+(big?'b':'s')+(hurt?'h':''),'rd-art rex-art'+(hurt?' hurt':'')):lionArt(big,hurt)}
function rdWatch(rid){if(!CL.db||!CL.uid||!rid||RD.rid===rid&&RD.unsub)return;if(RD.unsub){try{RD.unsub()}catch(e){}}RD.rid=rid;RD.hits={};var o=RD;
  RD.unsub=CL.db.collection('raid/'+rid+'/hits').onSnapshot(function(s){var h={};s.docs.forEach(function(d){var x=d.data();if(IDRE.test(d.id)&&isO(x))h[d.id]={name:str(x.name,30),n:int(x.n,0,50,0),ok:int(x.ok,0,50,0),sb:int(x.sb,0,SK_SBMAX,0),gd:int(x.gd,0,5000,0),t:int(x.t,0,9e15,0)}});o.hits=h;
    if(UI.scr==='raid'||UI.scr==='home')softRender()},function(){})}
function rdDmgOf(x){return (x.ok|0)+(x.sb|0)+Math.min(x.gd|0,(x.ok|0)*100)}
function rdStats(){var hp=rdBC().hp,u=Object.keys(RD.hits).filter(function(k){return RD.hits[k].n>0}),dmg=u.reduce(function(a,k){return a+rdDmgOf(RD.hits[k])},0),last=u.reduce(function(a,k){return Math.max(a,RD.hits[k].t)},0);
  return {hp:hp,dmg:Math.min(dmg,hp),left:Math.max(0,hp-dmg),dead:dmg>=hp,parts:u,last:last}}
function rdDur(ms){ms=Math.max(0,ms);var d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),mi=Math.floor(ms%36e5/6e4),L0=S.set.lang;
  var u=L0==='en'?['d','h','m']:L0==='zh'?['天','小时','分']:[' วัน',' ชม.',' นาที'];return (d?d+u[0]+' ':'')+(d||h?h+u[1]+' ':'')+mi+u[2]}
function rdWhen(ms){var d=new Date(ms+7*3600e3),dn=L.rd_days[d.getUTCDay()];return tx(dn)+' '+d.getUTCDate()+'/'+(d.getUTCMonth()+1)+' '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0')}
function rdMine(rid){return (S.raid&&S.raid[rid])||{n:0,ok:0}}
function rdClaimed(rid){var e=(S.log||[]).filter(function(x){return x&&x.k==='raidwin'&&x.rid===rid})[0];return e||null}
/* the event boss: a young lion king standing tall (as tall as three people), original design */
function lionArt(big,hurt){var w=big?230:100,u='ln'+(big?'b':'s')+(hurt?'h':'');
  var mane='';for(var i=0;i<16;i++){var a=i*22.5,l=i%2?30:38;mane+='<path d="M0 -14C'+(-9)+' -'+(l*.5)+' -6 -'+l+' 0 -'+(l+6)+'C6 -'+l+' 9 -'+(l*.5)+' 0 -14Z" transform="rotate('+a+')" fill="url(#'+u+'m)"/>'}
  var an=typeof wan!=='function'||wan(),AU=typeof TAURA!=='undefined'&&TAURA[9],aT='translate(100 292) scale(1.32) translate(-100 -222)';
  return '<svg class="rd-art lion-art'+(hurt?' hurt':'')+'" viewBox="-40 -12 280 314" width="'+w+'" aria-hidden="true" style="overflow:visible"><defs>'+(AU?auraDefs(u):'')+
  '<radialGradient id="'+u+'h"><stop offset="0" stop-color="#ffd86a" stop-opacity=".75"/><stop offset="1" stop-color="#ffb02e" stop-opacity="0"/></radialGradient>'+
  '<linearGradient id="'+u+'m" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b8461a"/><stop offset=".5" stop-color="#ff8a2a"/><stop offset="1" stop-color="#ffd46a"/></linearGradient>'+
  '<linearGradient id="'+u+'f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2a0"/><stop offset="1" stop-color="#e9a34a"/></linearGradient>'+
  '<linearGradient id="'+u+'c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d0283e"/><stop offset="1" stop-color="#6a0d2a"/></linearGradient>'+
  '<linearGradient id="'+u+'g" x1="0" x2="1"><stop offset="0" stop-color="#a86a10"/><stop offset=".5" stop-color="#fff2b0"/><stop offset="1" stop-color="#c8891a"/></linearGradient></defs>'+
  '<ellipse cx="100" cy="120" rx="96" ry="120" fill="url(#'+u+'h)"><animate attributeName="rx" values="88;98;88" dur="2.6s" repeatCount="indefinite"/></ellipse>'+
  (AU?'<g transform="'+aT+'">'+AU.back(u,an)+'</g>':'')+
  '<ellipse cx="100" cy="292" rx="62" ry="7" fill="#000" opacity=".25"/>'+
  (big?'<g opacity=".45" fill="#1a1030">'+[0,1,2].map(function(k){var y=290-k*92;return '<g transform="translate(14 '+(y-92)+')"><circle cx="9" cy="10" r="8"/><path d="M0 92V40Q0 22 9 22Q18 22 18 40V92Z"/></g>'}).join('')+'</g>':'')+
  '<g class="ln-body">'+
  '<path d="M60 150Q40 220 52 262L148 262Q160 220 140 150Z" fill="url(#'+u+'c)" stroke="#3a0618" stroke-width="2"/>'+
  '<path d="M60 150Q40 220 52 262" stroke="url(#'+u+'g)" stroke-width="5" fill="none"/><path d="M140 150Q160 220 148 262" stroke="url(#'+u+'g)" stroke-width="5" fill="none"/>'+
  '<path d="M76 150Q72 200 80 252L120 252Q128 200 124 150Z" fill="url(#'+u+'f)"/>'+
  '<path d="M80 250L74 288L96 288L98 252ZM102 252L104 288L126 288L120 250Z" fill="url(#'+u+'f)" stroke="#b8701a" stroke-width="1.5"/>'+
  '<path d="M74 288h22M104 288h22" stroke="#7a3a10" stroke-width="3" stroke-linecap="round"/>'+
  '<path d="M150 230Q186 236 182 196Q180 184 172 188" stroke="#e9a34a" stroke-width="7" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="-6 150 230;6 150 230;-6 150 230" dur="1.8s" repeatCount="indefinite"/></path>'+
  '<circle cx="173" cy="186" r="8" fill="url(#'+u+'m)"/>'+
  '<g><path d="M66 160Q40 176 34 206" stroke="url(#'+u+'f)" stroke-width="16" fill="none" stroke-linecap="round"/>'+
  (typeof W3!=='undefined'?'<g transform="translate(33 208) scale(1.05) translate(-136 -182)">'+W3.draw('cosmic','staff',u+'st')+'</g>':'<path d="M26 216L30 128" stroke="url(#'+u+'g)" stroke-width="5"/>')+
  '<circle cx="33" cy="210" r="10" fill="#ffe2a0" stroke="#b8701a"/>'+(an?'<animateTransform attributeName="transform" type="rotate" values="0 66 160;0 66 160;-7 66 160;-7 66 160;0 66 160" keyTimes="0;.55;.65;.85;1" dur="5s" repeatCount="indefinite"/>':'')+'</g>'+
  '<path d="M134 160Q162 172 166 200" stroke="url(#'+u+'f)" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="167" cy="204" r="10" fill="#ffe2a0" stroke="#b8701a"/>'+
  '<g transform="translate(100 104)"><g>'+(an?'<animateTransform attributeName="transform" type="rotate" values="-4;3;-4" dur="4.2s" repeatCount="indefinite"/>':'')+'<g>'+mane+'<animateTransform attributeName="transform" type="rotate" values="-3;3;-3" dur="3s" repeatCount="indefinite"/></g>'+
  '<circle r="34" fill="url(#'+u+'f)" stroke="#b8701a" stroke-width="2"/>'+
  '<circle cx="-26" cy="-26" r="9" fill="url(#'+u+'f)" stroke="#b8701a" stroke-width="2"/><circle cx="26" cy="-26" r="9" fill="url(#'+u+'f)" stroke="#b8701a" stroke-width="2"/><circle cx="-26" cy="-26" r="4" fill="#e98a7a"/><circle cx="26" cy="-26" r="4" fill="#e98a7a"/>'+
  (hurt?'<path d="M-18 -6l10 6M-18 6l10-6M18 -6l-10 6M18 6l-10-6" stroke="#3a1a0a" stroke-width="3" stroke-linecap="round"/>':
   '<g transform="translate(0 -2)"><g><ellipse cx="-13" cy="0" rx="6.5" ry="8" fill="#2a1406"/><ellipse cx="13" cy="0" rx="6.5" ry="8" fill="#2a1406"/><circle cx="-11" cy="-3" r="2.4" fill="#fff"/><circle cx="15" cy="-3" r="2.4" fill="#fff"/>'+(an?'<animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 .1;1 1;1 1" keyTimes="0;.9;.94;.98;1" dur="3.6s" repeatCount="indefinite"/>':'')+'</g></g><path d="M-20 -14l12 3M20 -14l-12 3" stroke="#7a3a10" stroke-width="2.5" stroke-linecap="round"/>')+
  '<ellipse cx="0" cy="14" rx="15" ry="11" fill="#fff4dc"/><path d="M-5 9h10l-5 6z" fill="#5a2a14"/><path d="M0 15v4M0 19q-6 5-10 1M0 19q6 5 10 1" stroke="#5a2a14" stroke-width="2" fill="none" stroke-linecap="round"/>'+
  '<path d="M-6 21l2 5 2-5M2 21l2 5 2-5" fill="#fff"/><ellipse cx="-22" cy="10" rx="6" ry="3.5" fill="#ff9a9a" opacity=".6"/><ellipse cx="22" cy="10" rx="6" ry="3.5" fill="#ff9a9a" opacity=".6"/>'+
  '<g transform="translate(0 -40)"><path d="M-22 6L-24 -14L-12 -4L0 -20L12 -4L24 -14L22 6Z" fill="url(#'+u+'g)" stroke="#8a5a0a" stroke-width="1.5"/><circle cy="-2" r="4" fill="#ff3a6a" stroke="#fff" stroke-width="1"/><circle cx="-14" cy="0" r="2.6" fill="#4ad0ff"/><circle cx="14" cy="0" r="2.6" fill="#4ad0ff"/>'+
  '<path d="M0 -26l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#fff6c0"><animate attributeName="opacity" values=".3;1;.3" dur="1.4s" repeatCount="indefinite"/></path></g></g></g>'+
  '<path d="M64 150Q100 172 136 150" stroke="url(#'+u+'g)" stroke-width="6" fill="none"/><circle cx="100" cy="162" r="6" fill="#ff3a6a" stroke="url(#'+u+'g)" stroke-width="2"/>'+
  '<animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="2.4s" repeatCount="indefinite"/></g>'+
  (AU?'<g transform="'+aT+'">'+AU.front(u,an)+'</g>':'')+
  '<g fill="#fff6c0">'+[[22,40],[178,52],[186,150],[12,170]].map(function(p,i){return '<path d="M'+p[0]+' '+(p[1]-6)+'l2 4 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"><animate attributeName="opacity" values="0;1;0" dur="'+(1.5+i*.4)+'s" repeatCount="indefinite"/></path>'}).join('')+'</g></svg>'}
/* the boss: an original chaos demon over a broken skyline */
function rdArt(big,hurt){var w=big?260:120;return '<svg class="rd-art'+(hurt?' hurt':'')+'" viewBox="0 0 200 170" width="'+w+'" aria-hidden="true"><defs><radialGradient id="rdg"><stop offset="0" stop-color="#ffcf5a"/><stop offset=".35" stop-color="#ff4a6a"/><stop offset="1" stop-color="#3a0a5a"/></radialGradient><radialGradient id="rdh"><stop offset="0" stop-color="#ff5a8a" stop-opacity=".6"/><stop offset="1" stop-color="#ff5a8a" stop-opacity="0"/></radialGradient></defs>'+
  '<circle cx="100" cy="88" r="80" fill="url(#rdh)"><animate attributeName="r" values="74;84;74" dur="2.4s" repeatCount="indefinite"/></circle>'+
  '<path d="M10 160V120h14v-16h10v24h12V96h16v40h10v-22h12v46zM130 160v-36h12V98h14v30h10v-18h14v50z" fill="#1a0a2a" opacity=".8"/>'+
  '<g class="rd-body"><path d="M58 70q-28-34-14-58q8 20 30 30zM142 70q28-34 14-58q-8 20-30 30z" fill="#2a0a3a" stroke="#ff4a6a" stroke-width="2"/>'+
  '<circle cx="100" cy="92" r="52" fill="url(#rdg)" stroke="#2a0a3a" stroke-width="3"/>'+
  '<path d="M60 80q40-30 80 0" stroke="#2a0a3a" stroke-width="4" fill="none" opacity=".5"/>'+
  [[80,86,9],[120,86,9],[100,70,6]].map(function(e){return '<circle cx="'+e[0]+'" cy="'+e[1]+'" r="'+e[2]+'" fill="#fff"/><circle cx="'+e[0]+'" cy="'+(e[1]+1)+'" r="'+(e[2]*.5)+'" fill="#1a0a2a"><animate attributeName="cx" values="'+(e[0]-2)+';'+(e[0]+2)+';'+(e[0]-2)+'" dur="3s" repeatCount="indefinite"/></circle>'}).join('')+
  '<path d="M76 112q24 18 48 0l-6 10-6-6-6 8-6-8-6 8-6-8-6 6z" fill="#1a0a2a"/>'+
  '<path d="M48 120q-22 6-30 24M152 120q22 6 30 24" stroke="#2a0a3a" stroke-width="7" stroke-linecap="round" fill="none"/></g>'+
  '<g fill="#ffcf5a">'+[[30,40],[170,36],[40,130],[166,128]].map(function(p,i){return '<path d="M'+p[0]+' '+(p[1]-6)+'l2 4 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"><animate attributeName="opacity" values="0;1;0" dur="'+(1.6+i*.4)+'s" repeatCount="indefinite"/></path>'}).join('')+'</g></svg>'}
function rdCard(){if(!rdOn()||!S.created||!CL.db||!CL.uid)return '';var sl=rdSlot(),now=Date.now(),act=rdAct(sl,now),ev=RDB==='ev';if(act||ev)rdWatch(sl.id);var st=act||ev?rdStats():null,mine=rdMine(sl.id);
  if(ev&&now<sl.start&&!RDS.ev.tm){RDS.ev.tm=1;setTimeout(function(){RDS.ev.tm=0;softRender()},Math.min(sl.start-now+800,2e9))}
  var line=ev&&now<sl.start?esc(t('rd_evwait').replace('{d}',rdWhen(sl.start)).replace('{r}',rdDur(sl.start-now))):ev&&now>sl.end?esc(st.dead?rdDeadTxt():t('rd_evend')):act&&!st.dead?esc(t('rd_live'))+' · '+esc(t('rd_hp'))+' <b class="num">'+st.left+'/'+st.hp+'</b> · '+esc(t('rd_left'))+' '+esc(rdDur(sl.end-now)):act&&st.dead?esc(rdDeadTxt()):esc(t('rd_next'))+' <b>'+esc(rdWhen(sl.next))+'</b> ('+esc(t('rd_in'))+' '+esc(rdDur(sl.next-now))+')';
  return '<section class="panel rd-card'+(act&&!st.dead||ev&&now<sl.start?' live':'')+(ev?' rd-ev':'')+'"><div class="rd-cart">'+rdPic(false,false)+'</div><div class="stack" style="gap:4px;min-width:0;flex:1"><span class="eyebrow">'+(ev?rdEmo()+' '+esc(t('rd_evname'))+' · '+esc(rdName()):'👹 '+esc(t('rd_name')))+'</span><span>'+line+'</span>'+
   (act&&!st.dead?'<div class="bar rd-hpbar" role="progressbar" aria-valuemin="0" aria-valuemax="'+st.hp+'" aria-valuenow="'+st.left+'"><i style="width:'+(st.left/st.hp*100)+'%"></i></div>':'')+'</div><button class="btn'+(act&&!st.dead&&mine.n<rdBC().q?' gold':' sec')+'" data-act="rdgo" data-id="'+RDB+'">'+esc(t('tn_enter'))+'</button></section>'}
function rdEncHtml(){var s=RD.enc,q=s.qs[s.i],n=s.qs.length,dots='';for(var i=0;i<n;i++){var st=s.rs[i]===undefined?'':s.rs[i]?'ok':'ng';dots+='<i class="'+st+(i===s.i?' cur':'')+'"></i>'}
  var fb='';if(s.picked!==null){var w=q.w,last=s.i===n-1;fb='<div class="fb '+(s.lastOk?'ok':'ng')+'" role="status"><div class="grow"><div><b>'+esc(s.lastOk?t('right'):t('wrong'))+'</b></div><div class="wl" style="flex-wrap:wrap;gap:6px 12px;margin-top:4px">'+
    LANGS.map(function(l){return '<span class="row" style="gap:4px">'+langTag(l)+'<span'+(l==='zh'?' class="han"':'')+'>'+esc(w[l])+'</span>'+(l==='zh'&&w.py?'<small class="lt-zh">'+esc(w.py)+'</small>':'')+(hasVoice(l)?spkBtn(w[l],l):'')+'</span>'}).join('')+'</div></div>'+
    '<button class="btn" data-act="rdnext" id="nextbtn">'+esc(last?t('finish'):t('next'))+'</button></div>'}
  var SKX=typeof skBar==='function',cast=SKX&&s.vfx&&Date.now()-s.vfx.k<1600;
  return '<div class="qwrap"><section class="panel rd-arena">'+(SKX?skVfx(s):'')+'<div class="fighter"><div class="av'+(cast?' sk-cast':s.picked!==null?(s.lastOk?' atk atk-'+S.cls:' ouch'):'')+'">'+avatar(S,{label:S.name,anim:true,noPet:true,face:s.picked!==null?(s.lastOk?'happy':'sad'):''})+'</div><small>'+esc(S.name)+'</small></div><div class="vs">VS</div>'+
   '<div class="fighter'+(s.picked!==null&&s.lastOk?' tn-hit':'')+'"><div class="tn-foe">'+rdPic(false,s.picked!==null&&s.lastOk)+(s.picked!==null&&s.pop?'<span class="sk-pop'+(s.pop>1?' big':'')+'">-'+s.pop+'</span>':'')+(s.picked!==null&&s.lastOk&&s.gd?'<span class="gd-pop">🛡️ -'+gdDmg(CFG)+'</span>':'')+'</div><b>'+esc(rdName())+'</b></div></section>'+(SKX?skBar(s):'')+
   (function(){var EB=RDB==='ev'&&evBoss(s.rid);if(!EB||!EB.pen)return '';var wrong=(s.i+(s.picked!==null?1:0))-s.ok;return '<div class="rd-penbar">'+(EB.emo||'⚠️')+' '+esc(t('rd_penrule').replace('{n}',EB.pen))+(wrong>0?' · <b>'+esc(t('rd_penlost').replace('{n}',Math.min(wrong*EB.pen,Math.max(0,S.coin))))+'</b>':'')+'</div>'+(s.picked!==null&&!s.lastOk?'<div class="rd-pencast" role="status">💥 '+esc(EB.cast?tx(EB.cast):t('rd_pencast'))+' <b>-'+EB.pen+' 🪙</b></div>':'')})()+
   '<div class="row" style="justify-content:space-between"><span class="eyebrow">'+esc(t('rd_q'))+' '+(s.i+1)+'/'+n+'</span><span class="tn-dots" aria-hidden="true">'+dots+'</span></div>'+
   '<section class="panel'+(s.picked!==null&&!s.lastOk?' shake':'')+'">'+promptHtml(q)+(SKX?skHintHtml(s,q):'')+(function(){var oh=optsHtml(q,s.picked).replace(/data-act="ans"/g,'data-act="rdans"');return SKX?skOpts(s,oh):oh})()+'</section>'+fb+'</div>'}
VIEW.raid=function(){if(!S.created){UI.scr='title';return VIEW.title()}
  if(!rdOn())return '<section class="panel"><div class="empty">👹 '+esc(t('rd_closed'))+'</div></section>';
  if(RD.enc)return rdEncHtml();
  var sl=rdSlot(),now=Date.now(),act=rdAct(sl,now),rid=sl.id,cloud=!!(CL.db&&CL.uid),ev=RDB==='ev',EB=ev&&sl.ev;if(cloud)rdWatch(rid);
  var st=rdStats(),mine=rdMine(rid),q=rdBC().q,cl=rdClaimed(rid),dead=st.dead;
  var h='<section class="panel rd-hero'+(ev?' rd-ev':'')+'"><div class="rd-big">'+rdPic(true,false)+'</div><div class="stack" style="gap:6px;min-width:0"><span class="eyebrow">'+(ev?esc(t('rd_evname')):'Chaos City Boss')+'</span><h1 style="margin:0;font-size:28px">'+(ev?rdEmo()+' ':'👹 ')+esc(rdName())+'</h1>'+
   '<p style="margin:0">'+esc(t(ev?'rd_evdesc':'rd_desc').replace('{name}',rdName()).replace('{q}',q).replace('{hp}',st.hp))+'</p>'+(EB&&EB.pen?'<p class="rd-pennote">'+(EB.emo||'⚠️')+' '+esc(t('rd_pennote').replace('{n}',EB.pen))+'</p>':'')+'<small>⏰ '+(ev?esc(t('rd_evwhen').replace('{d}',rdWhen(sl.start)).replace('{n}',EB.hours)):esc(t('rd_when').replace('{d}',tx(L.rd_days[int(CFG.raidDay,0,6,6)])).replace('{h}',String(int(CFG.raidHour,0,23,19)).padStart(2,'0')).replace('{n}',int(CFG.raidHours,1,167,48))))+'</small></div></section>';
  if(!cloud)return h+'<section class="panel"><div class="empty">'+esc(t('rd_off'))+'</div></section>';
  h+='<section class="panel stack">';if(typeof skBar==='function')h+='<div class="row" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><span class="row" style="gap:6px">'+skList(S.cls).map(function(id){return skIcon(id,34,!skCurLv(id))}).join('')+'</span><button class="btn sm sec" data-act="skills">🌟 '+esc(t('sk_title'))+'</button></div>';
  if(dead){h+='<h2 style="margin:0">'+esc(rdDeadTxt())+'</h2>';
    if(cl){var it=ITEM[cl.item];h+='<span class="eyebrow">🎁 '+esc(t('rd_got'))+'</span><div class="reveal" style="grid-template-columns:minmax(0,180px)">'+(it?'<div class="item r-'+it.rar+'"><span class="thumb">'+itemThumb(it)+'</span><span class="nm">'+esc(tx(it.names))+'</span><span class="mt"><span class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span></span></div>':'<p class="mut">'+esc(t('rd_evnone'))+'</p>')+'</div>'+'<div class="row" style="gap:6px">'+rewardPills(cl.r||{})+'</div>'}
    else if(mine.n>0){var wait=Math.ceil((st.last+(RD.settle||RD_SETTLE)-now)/1000);h+=wait>0&&act?'<p class="mut" style="margin:0">⏳ '+esc(t('rd_wait').replace('{s}',wait))+'</p>':'<button class="btn big gold" data-act="rdclaim">🎁 '+esc(t('rd_claim'))+'</button>';if(wait>0&&act)setTimeout(function(){if(UI.scr==='raid')softRender()},Math.min(wait,5)*1000)}
    else h+='<p class="mut" style="margin:0">'+esc(t('rd_notjoin'))+'</p>';
    if(!act&&!ev)h+='<small class="mut">'+esc(t('rd_next'))+' '+esc(rdWhen(sl.next))+'</small>'}
  else if(ev&&now<sl.start){h+='<h2 style="margin:0">'+esc(t('rd_evwait').replace('{d}',rdWhen(sl.start)).replace('{r}',rdDur(sl.start-now)))+'</h2><div class="bar rd-hpbar big"><i style="width:100%"></i></div><button class="btn big sec" disabled>⏳ '+esc(t('rd_join').replace('{n}',q))+'</button>';setTimeout(function(){if(UI.scr==='raid'&&RDB==='ev')softRender()},Math.min(Math.max(1000,sl.start-now+500),30e3))}
  else if(!act&&ev){h+='<h2 style="margin:0">'+esc(t('rd_evend'))+'</h2>'}
  else if(!act){h+='<h2 style="margin:0">'+esc(Object.keys(RD.hits).length?t('rd_fled'):t('rd_next'))+'</h2><p style="margin:0">'+esc(t('rd_next'))+' <b>'+esc(rdWhen(sl.next))+'</b> ('+esc(t('rd_in'))+' '+esc(rdDur(sl.next-now))+')</p>'}
  else{h+='<div class="row" style="justify-content:space-between;align-items:baseline"><b>'+esc(t('rd_hp'))+'</b><b class="num">'+st.left+' / '+st.hp+'</b></div><div class="bar rd-hpbar big" role="progressbar" aria-valuemin="0" aria-valuemax="'+st.hp+'" aria-valuenow="'+st.left+'"><i style="width:'+(st.left/st.hp*100)+'%"></i></div>'+
    '<div class="row" style="justify-content:space-between"><small>👥 '+esc(t('rd_joined'))+' <b class="num">'+st.parts.length+'</b></small><small>⏰ '+esc(t('rd_left'))+' '+esc(rdDur(sl.end-now))+'</small></div>';
    h+=mine.n<q?'<button class="btn big gold" data-act="rdjoin">⚔️ '+esc(t('rd_join').replace('{n}',q-mine.n))+'</button>':'<p class="mut" style="margin:0">✅ '+esc(t('rd_done').replace('{n}',q))+'</p>';
    if(RD.err)h+='<div class="notice warn" style="display:block">'+esc(RD.err)+'</div>'}
  h+='<small class="mut">🎁 '+(ev?esc(t('rd_evrew').replace('{c}',EB.coin).replace('{g}',EB.gems).replace('{exp}',EB.exp).replace('{cel}',EB.cel).replace('{my}',EB.my).replace('{lg}',EB.lg))+'</small></section>':esc(t('rd_rew').replace('{exp}',int(CFG.raidExp,0,1e6,200)).replace('{my}',int(CFG.raidMy,0,1e3,5)).replace('{lg}',int(CFG.raidLg,0,1e3,15)+(gachaOnly(bkkDay())?int(CFG.raidMy,0,1e3,5):0)))+'</small></section>');
  var top=st.parts.slice().sort(function(a,b){return rdDmgOf(RD.hits[b])-rdDmgOf(RD.hits[a])||RD.hits[a].t-RD.hits[b].t}).slice(0,10);
  if(top.length)h+='<section class="panel stack"><b>🏅 '+esc(t('rd_top'))+'</b>'+top.map(function(u,i){var x=RD.hits[u];return '<div class="mkrow"><span class="num">'+(i+1)+'</span><span class="ginm"><b>'+esc(x.name||'—')+(u===CL.uid?' ⭐':'')+'</b></span><span class="tag">'+rdDmgOf(x)+' '+esc(t('rd_dmg'))+'</span></div>'}).join('')+'</section>';
  return h};
function rdJoin(){if(CL.ban){toast(t('ban_note'));return}var sl=rdSlot(),now=Date.now();if(!rdAct(sl,now)||rdStats().dead)return;var mine=rdMine(sl.id),n=rdBC().q-mine.n;if(n<=0)return;
  var pool=[];ZONES.slice(8).forEach(function(z){pool=pool.concat(zoneWords(z))});if(pool.length<4)pool=WORDS;var ws=shuffle(pool.slice()).slice(0,n);
  RD.enc={gd:typeof gdCur==='function'&&!!gdCur()&&gdDmg(CFG)>0,rid:sl.id,qs:ws.map(function(w){return makeQ(w,pool,true)}),i:0,ok:0,picked:null,wc:[],ww:[],la:{},rs:[],t0:Date.now()};RD.err='';render()}
function rdAnswer(idx){var s=RD.enc;if(!s||s.picked!==null)return;var q=s.qs[s.i],ok=idx===q.ans;s.picked=idx;s.lastOk=ok;s.rs[s.i]=ok;
  var lg=langOfQ(q);S.stats[lg][ok?'ok':'ng']++;srsMark(q.w.id,ok);if(ok)s.ok++;tally(s,q,lg,ok);sfx(ok?'hit':'ng');say(ok?t('right'):t('wrong')+'. '+t('answer')+': '+plainLabel(q.w,q.to));touchStreak();save();render();
  if(ok&&q.to!=='py'&&q.type!=='listen'&&hasVoice(q.to))speak(q.w[q.to],q.to)}
function rdNext(){var s=RD.enc;if(!s||s.picked===null)return;if(s.i<s.qs.length-1){s.i++;s.picked=null;render();return}rdFinish()}
function rdFinish(){var s=RD.enc;RD.enc=null;rollDaily();var e=bRaid(S,s.rid,s.qs.length,s.ok,Date.now()-s.t0,today(),{c:s.wc,w:s.ww},laArr(s),CFG);if(typeof skStamp==='function')skStamp(e,s);if(s.gd&&s.ok>0)e.gd=s.ok*gdDmg(CFG);var g=commitEv(e);save();
  var mine=rdMine(s.rid),body={name:S.name,n:mine.n,ok:mine.ok,sb:Math.min(mine.sb|0,SK_SBMAX),gd:mine.gd|0,t:Date.now()};RD.hits[CL.uid]=body;
  retry(function(){return CL.db.doc('raid/'+s.rid+'/hits/'+CL.uid).set(body)}).then(function(){toast(t('rd_saved'))},function(){RD.err=t('rd_rules');render()});
  showReward(rdName(),g)}
function rdClaim(){var sl=rdSlot(),rid=RD.rid||sl.id,st=rdStats();if(!st.dead||rdClaimed(rid)||!rdMine(rid).n)return;
  var tier=raidRank(rid,st.parts,CFG)[CL.uid]||'rare',item=raidItem(rid,CL.uid,tier,ITEM),had=S.owned[item]||0,tl0=typeof earnedTitles==='function'?earnedTitles():[];
  var g=commitEv(bRaidWin(S,rid,tier,item,today(),CFG));save();
  var tl1=typeof earnedTitles==='function'?earnedTitles():[];if(tl1.length>tl0.length)setTimeout(function(){toast('🏷️ '+t('rd_title'))},400);
  if(item&&RDB==='ev'){sfx('lvl');showReward(rdName(),g,[item])}else if(item){UI.modal={kind:'pull',res:[{id:item,isNew:!had}]};sfx('lvl');render()}else showReward(rdName(),g)}
function raidAct(a,id){switch(a){
  case 'rdjoin':rdJoin();return true;case 'rdans':rdAnswer(+id);return true;case 'rdnext':rdNext();return true;case 'rdclaim':rdClaim();return true;case 'rdgo':rdUse(id);go('raid');return true}return false}
document.addEventListener('keydown',function(e){if(UI.scr!=='raid'||!RD.enc||UI.modal)return;var tg=document.activeElement;if(tg&&/INPUT|TEXTAREA|SELECT/.test(tg.tagName))return;
  if(RD.enc.picked===null&&/^[1-4]$/.test(e.key)){rdAnswer(+e.key-1);e.preventDefault()}});
/* the teacher's checker needs the hits of recent bosses */
function rdLoadVer(){if(!CL.admin||!CL.db||Date.now()-RD.verAt<5*60e3)return;RD.verAt=Date.now();var now=Date.now();
  for(var k=0;k<8;k++)(function(rid){CL.db.collection('raid/'+rid+'/hits').get().then(function(s){if(!s.docs.length)return;var h={};s.docs.forEach(function(d){var x=d.data();if(isO(x))h[d.id]={n:int(x.n,0,50,0),ok:int(x.ok,0,50,0),sb:int(x.sb,0,SK_SBMAX,0),gd:int(x.gd,0,5000,0),t:int(x.t,0,9e15,0)}});RD.ver[rid]={hits:h}},function(){})})(raidSlot(now-k*7*864e5,CFG).id);EV_BOSSES.forEach(function(b){if(now>=b.start&&now-b.start<60*864e5)CL.db.collection('raid/'+b.id+'/hits').get().then(function(s){var h={};s.docs.forEach(function(d){var x=d.data();if(isO(x))h[d.id]={n:int(x.n,0,50,0),ok:int(x.ok,0,50,0),sb:int(x.sb,0,SK_SBMAX,0),t:int(x.t,0,9e15,0)}});RDS.wk.ver[b.id]={hits:h}},function(){})})}
/* cards on home and map */
(function(){var H=VIEW.home,M=VIEW.map;
  function both(){var k=RDB;rdUse('ev');var a=rdCard();rdUse('wk');var b=rdCard();rdUse(k);return a+b}
  VIEW.home=function(){var h=H(),c=both();if(!c)return h;var i=h.indexOf('<section class="panel tn-gates');return i>=0?h.slice(0,i)+c+h.slice(i):h+c};
  VIEW.map=function(){return both()+M()}})();
