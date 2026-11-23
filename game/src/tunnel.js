/* =====================================================================
   TIME TUNNEL — a solo dungeon of 10 floors.
   Each floor: pet-monsters wander a small map; touching one starts a short
   quiz (tnQ questions). Beat all of them and the floor guardian appears
   (tnBossQ questions). A boss win drops 1–3 items once per floor per Thai day;
   the drop is rolled from (player id, floor, date) so it can be re-checked
   by the teacher's verifier (ledger: tnmon / tnboss).
   ===================================================================== */
Object.assign(L,{
 tn_name:m('อุโมงค์กาลเวลา','Time Tunnel','时空隧道'),
 tn_desc:m('ประตูลึกลับที่พาไปยัง 10 ชั้นแห่งกาลเวลา ปราบมอนสเตอร์ด้วยคำศัพท์ แล้วท้าบอสผู้พิทักษ์เพื่อรับไอเทม!','A mysterious gate to 10 floors of time. Beat the monsters with your words, then challenge the guardian for items!','通往十层时空的神秘之门。用词汇击败怪物,再挑战守护者赢取道具!'),
 tn_enter:m('เข้าอุโมงค์','Enter the tunnel','进入隧道'),tn_floor:m('ชั้น','Floor','第'),tn_floorsfx:m('','','层'),
 tn_locked:m('ปราบบอสชั้นก่อนหน้าก่อน','Beat the boss of the floor before first','先击败上一层首领'),tn_cleared:m('ผ่านแล้ว','Cleared','已通关'),tn_new:m('ยังไม่ผ่าน','Not cleared','未通关'),
 tn_dropready:m('🎁 ดรอปวันนี้พร้อม','🎁 Today\'s drop ready','🎁 今日掉落可领'),tn_droptaken:m('✔ รับดรอปวันนี้แล้ว (รีเซ็ต 00:00 น.)','✔ Today\'s drop taken (resets 00:00)','✔ 今日掉落已领(00:00重置)'),
 tn_tier1:m('ศัพท์พื้นฐาน','Basic words','基础词汇'),tn_tier2:m('ศัพท์ระดับกลาง','Intermediate words','中级词汇'),tn_tier3:m('ศัพท์มัธยม · HSK 2–3','Secondary · HSK 2–3','中学 · HSK 2–3'),tn_tier4:m('ศัพท์ผสมทุกระดับ','Mixed, all levels','全部混合'),
 tn_rates:m('อัตราดรอปไอเทมจากบอส','Boss item drop rates','首领道具掉率'),tn_count:m('จำนวนชิ้นต่อครั้ง','Items per drop','每次掉落件数'),
 tn_topnote:m('🏆 บอสชั้น 10 (ผู้พิทักษ์ตัวสุดท้าย) ของประตูนี้ดรอปเฉพาะไอเทมระดับยอดเยี่ยมถึงระดับตำนาน','🏆 This gate\'s floor-10 final guardian drops only Epic to Legendary items','🏆 本门第10层最终守护者只掉落史诗至传说道具'),tn_ratesnote:m('ไอเทมเหนือตำนานและระดับสวรรค์ได้จากตู้อัญเชิญเท่านั้น และไอเทมประจำซีซั่นไม่ดรอปในประตู','Mythic and Celestial items come only from summoning, and season items never drop in the gates','神话与天界道具只能通过召唤获得,赛季道具不会在大门掉落'),
 tn_left:m('มอนสเตอร์ที่เหลือ','Monsters left','剩余怪物'),tn_hint:m('แตะที่มอนสเตอร์เพื่อเลือกสู้ · แตะพื้นหรือใช้ปุ่มลูกศรเพื่อเดินสำรวจ','Tap a monster to choose a fight · tap the ground or use the arrow keys to walk around','点击怪物选择挑战 · 点击地面或用方向键四处走动'),
 tn_gate:m('ประตูบอสเปิดแล้ว! แตะผู้พิทักษ์ด้านบนเพื่อท้าสู้','The boss gate is open! Tap the guardian at the top to challenge it','首领之门已开!点击上方的守护者发起挑战'),
 tn_guard:m('ผู้พิทักษ์ชั้น','Guardian of floor','守护者 · 第'),tn_back:m('กลับหน้าเลือกชั้น','Back to the floors','返回楼层列表'),
 tn_mon:m('มอนสเตอร์','Monster','怪物'),tn_qof:m('คำถาม','Question','题'),
 tn_monwin:m('ปราบมอนสเตอร์สำเร็จ!','Monster defeated!','怪物被击败!'),tn_monlose:m('มอนสเตอร์ยังอยู่! จำคำที่ผิดไว้ แล้วกลับมาสู้ใหม่ มันจะถามคำนั้นอีก','The monster is still here! Remember the missed word — it will ask it again','怪物还在!记住答错的词,它会再问一次'),
 tn_cont:m('เดินต่อ','Keep exploring','继续探索'),tn_bosswin:m('ชนะผู้พิทักษ์!','Guardian defeated!','击败守护者!'),tn_bosslose:m('ผู้พิทักษ์ยังไม่ยอมแพ้! ต้องตอบถูกทุกข้อ ลองใหม่ได้เลย','The guardian stands! You need every answer right — try again','守护者没倒下!需要全部答对,再试一次'),
 tn_retry:m('สู้บอสอีกครั้ง','Fight the boss again','再次挑战首领'),tn_nextf:m('ไปชั้นถัดไป','Next floor','下一层'),tn_nodrop:m('วันนี้รับดรอปจากชั้นนี้แล้ว ได้ EXP และเหรียญตามปกติ (ดรอปใหม่หลัง 00:00 น.)','Today\'s drop on this floor is already taken — you still get EXP and coins (new drop after 00:00)','本层今日掉落已领,仍可获得经验和金币(00:00后刷新)'),
 tn_drops:m('ไอเทมที่ดรอป','Items dropped','掉落道具'),tn_bossintro:m('ตอบให้ถูกทุกข้อเพื่อเอาชนะผู้พิทักษ์','Answer every question right to beat the guardian','全部答对才能击败守护者'),
 tn_fight:m('ท้าสู้!','Challenge!','挑战!'),tn_walk:m('ไม่ตอบ','Not now','先不答'),tn_closed:m('อุโมงค์กาลเวลาปิดอยู่ชั่วคราว','The Time Tunnel is closed for now','时空隧道暂时关闭'),
 tn_capped:m('วันนี้ได้รางวัลจากอุโมงค์ครบแล้ว ยังเล่นฝึกได้แต่ไม่ได้รางวัล','You\'ve reached today\'s tunnel reward limit — you can still practise','今日隧道奖励已达上限,仍可练习'),
 tn_gates:m('ประตูแห่งการผจญภัย','Adventure Gates','冒险之门'),tn_gatesdesc:m('3 ประตู 3 ภาษา: กาลเวลา (ผสม 3 ภาษา) · ตะวันตก (อังกฤษ) · เอราวัณ (ไทย) แต่ละประตูมี 10 ชั้นพร้อมบอส','3 gates, 3 languages: Time (all three) · Western (English) · Erawan (Thai) — 10 floors and bosses each','三道门三种语言:时空(三语混合)·西方(英语)·爱侣湾(泰语),每道门10层并有首领'),
 tn_pick:m('เลือกประตู','Choose a gate','选择大门'),tn_lgmix:m('ฝึก 3 ภาษาผสมกัน','All three languages','三语混合'),tn_lgen:m('🇬🇧 ภาษาอังกฤษ ป.4–ม.ต้น','🇬🇧 English, Grade 4 – lower secondary','🇬🇧 英语(小学四年级–初中)'),tn_lgth:m('🇹🇭 ภาษาไทยพื้นฐานสำหรับชาวต่างชาติ','🇹🇭 Basic Thai for foreign learners','🇹🇭 外国人基础泰语'),
 tw_name:m('ประตูตะวันตก','Western Gate','西方之门'),tw_desc:m('ประตูสู่ดินแดนตะวันตกสีสดใส ฝึกศัพท์ภาษาอังกฤษตั้งแต่ ป.4 ถึง ม.ต้น ทุกคำถามมีภาษาอังกฤษ','A bright gate to the western lands — English words from Grade 4 to lower secondary in every question','通往缤纷西方之地,每道题都练习小学四年级至初中英语词汇'),
 te_name:m('ประตูเอราวัณ','Erawan Gate','爱侣湾之门'),te_desc:m('ประตูช้างสามเศียรสู่เมืองไทยสีสันสดใส ฝึกภาษาไทยพื้นฐานสำหรับเพื่อนชาวต่างชาติ ทุกคำถามมีภาษาไทย','The three-headed elephant gate to colourful Thailand — basic Thai for foreign learners in every question','三头象之门通往多彩泰国,每道题都练习外国人基础泰语'),
 tw_tier1:m('อังกฤษพื้นฐาน','Basic English','基础英语'),tw_tier2:m('ศัพท์สอบ ป.4–ม.3','Exam words, Grades 4–9','考试词汇(4–9年级)'),tw_tier3:m('อังกฤษ ม.ต้น ขั้นสูง','Advanced lower secondary','初中进阶'),tw_tier4:m('อังกฤษผสมทุกระดับ','Mixed English','英语混合'),
 te_tier1:m('ไทยในชีวิตประจำวัน','Everyday Thai','日常泰语'),te_tier2:m('ไทยรอบตัว','Thai around you','身边的泰语'),te_tier3:m('ไทยระดับกลาง','Intermediate Thai','中级泰语'),te_tier4:m('ไทยผสมทุกระดับ','Mixed Thai','泰语混合'),
 tn_askq:m('จะตอบคำถาม {n} ข้อกับมอนสเตอร์ตัวนี้ไหม?','Answer {n} questions to fight this monster?','要回答 {n} 道题来挑战这只怪物吗?'),tn_askmiss:m('ตัวนี้จะถามคำที่เคยตอบผิดอีกครั้ง','This one will ask the word you missed again','它会再次问你答错的词'),
 tn_yes:m('ตอบเลย!','Let\'s answer!','开始答题!'),tn_no:m('ไม่ตอบ','Not now','先不答'),tn_rest:m('มอนสเตอร์ตัวนี้ยังพักอยู่ รอสักครู่หรือเลือกตัวอื่น','This monster is resting — wait a moment or pick another one','这只怪物在休息,稍等或选另一只'),
 tn_all:m('ผ่านครบ 10 ชั้นแล้ว! กลับมาท้าบอสทุกวันเพื่อรับไอเทม','All 10 floors cleared! Come back daily for boss drops','10层全部通关!每天回来挑战首领领取道具')});

var TN_THEMES=[
 {n:m('ประตูรุ่งอรุณ','Dawn Gate','黎明之门'),a:'#0f3b4a',b:'#1f8a8a',c:'#7ff3e0'},
 {n:m('ทางเดินนาฬิกาทราย','Hourglass Hall','沙漏长廊'),a:'#4a3212',b:'#b3802a',c:'#ffe08a'},
 {n:m('สวนเฟืองเขียว','Clockwork Garden','发条花园'),a:'#123d22',b:'#3a9a4e',c:'#b8ff9a'},
 {n:m('ห้วงเวลาเยือกแข็ง','Frozen Moment','冻结之瞬'),a:'#13305a',b:'#4a8fd8',c:'#d4f0ff'},
 {n:m('ป่าบรรพกาล','Ancient Forest','远古森林'),a:'#1f2f14',b:'#5f7f2a',c:'#e8ff9a'},
 {n:m('วิหารเฟืองสำริด','Bronze Gear Temple','青铜齿轮神殿'),a:'#3a2010',b:'#a8622a',c:'#ffc48a'},
 {n:m('ทะเลดาวนิรันดร์','Sea of Stars','永恒星海'),a:'#120f3a',b:'#3f3fb0',c:'#c8c8ff'},
 {n:m('ภูเขาไฟยุคดึกดำบรรพ์','Primeval Volcano','太古火山'),a:'#3a0f0f',b:'#c0392b',c:'#ffb38a'},
 {n:m('นครแห่งอนาคต','City of the Future','未来之城'),a:'#0f1f3a',b:'#c03ab0',c:'#7ff0ff'},
 {n:m('ใจกลางกาลเวลา','Heart of Time','时间之心'),a:'#22103a',b:'#8a3ad8',c:'#ffe27a'}];
/* bright themes: d = scenery emoji drawn on the map */
var TW_THEMES=[
 {n:m('ทุ่งดอกไม้ยามเช้า','Morning Meadow','清晨花田'),a:'#7fd8ff',b:'#c8f5a8',c:'#ff5fa2',d:['🌼','🌷','🦋']},
 {n:m('ท่าเรือลูกกวาด','Candy Harbour','糖果港湾'),a:'#8fe3ff',b:'#ffd6f0',c:'#ff4f9a',d:['⛵','🍭','⚓']},
 {n:m('หมู่บ้านกังหันลม','Windmill Village','风车村'),a:'#9fd4ff',b:'#ffeaa0',c:'#ff8a1f',d:['🌷','🏡','🌻']},
 {n:m('ปราสาทบนเมฆ','Cloud Castle','云上城堡'),a:'#c4b5ff',b:'#e6f6ff',c:'#7a5af8',d:['🏰','☁️','⭐']},
 {n:m('สวนสนุกริมทะเล','Seaside Fair','海边乐园'),a:'#5fd0ff',b:'#fff3a8',c:'#ff3f5f',d:['🎡','🎠','🎈']},
 {n:m('ป่าเมเปิลแดง','Maple Forest','枫叶森林'),a:'#ffc27a',b:'#ffe8bd',c:'#e8452b',d:['🍁','🍂','🦊']},
 {n:m('เมืองหอนาฬิกา','Clock Tower Town','钟楼小镇'),a:'#7ab8ff',b:'#ffebd0',c:'#2f5dff',d:['🕰️','🚌','🌉']},
 {n:m('ทุ่งหิมะสีรุ้ง','Rainbow Snowfield','彩虹雪原'),a:'#a8e4ff',b:'#fbfdff',c:'#5a7dff',d:['⛄','❄️','🌈']},
 {n:m('หุบเขาตะวันตก','Wild West Canyon','西部峡谷'),a:'#ffb36b',b:'#ffe2a6',c:'#d2451f',d:['🌵','🐎','🤠']},
 {n:m('มหานครแสงดาว','Starlight Metropolis','星光都市'),a:'#8a7dff',b:'#ffb0de',c:'#ffd400',d:['🗽','🎆','🌃']}];
var TE_THEMES=[
 {n:m('สระบัวหลวง','Lotus Pond','荷花池'),a:'#7fe6d6',b:'#ffe3f1',c:'#ff4f9a',d:['🪷','🐟','🌿']},
 {n:m('ตลาดน้ำ','Floating Market','水上市场'),a:'#6fd3ff',b:'#fff1b3',c:'#ff7a1a',d:['🛶','🥭','🍌']},
 {n:m('ทุ่งนาสีทอง','Golden Rice Fields','金色稻田'),a:'#8fd8ff',b:'#eef8a0',c:'#e0a000',d:['🌾','🐃','🏡']},
 {n:m('สวนช้างเผือก','White Elephant Garden','白象花园'),a:'#a5ecb4',b:'#fff7d8',c:'#1fa35a',d:['🐘','🌳','🌺']},
 {n:m('เทศกาลสงกรานต์','Songkran Splash','泼水节'),a:'#5fd6ff',b:'#dcf8ff',c:'#ff3f8f',d:['💦','🌸','🎉']},
 {n:m('คืนลอยกระทง','Loy Krathong Evening','水灯节之夜'),a:'#ff9e7a',b:'#ffdcb0',c:'#e8307a',d:['🏮','🪷','🌕']},
 {n:m('ดอยดอกไม้บาน','Blooming Mountain','花开山'),a:'#b8a8ff',b:'#ffe3f2',c:'#ff4f9a',d:['🌸','⛰️','🌺']},
 {n:m('ทะเลอันดามัน','Andaman Sea','安达曼海'),a:'#3fd0f0',b:'#fff2c6',c:'#00a0a0',d:['🏝️','🐠','⛵']},
 {n:m('วังทองคำ','Golden Palace','金色宫殿'),a:'#ffd36a',b:'#fff5cf',c:'#c87800',d:['🛕','✨','🪔']},
 {n:m('สวรรค์เอราวัณ','Erawan Heaven','爱侣湾天界'),a:'#ff9ad5',b:'#d2c0ff',c:'#ffc400',d:['🐘','🌈','✨']}];
/* the three gates; '' is the Time Tunnel */
var TN_GATE={
 '':{id:'t',n:'tn_name',ds:'tn_desc',lg:'tn_lgmix',sub:'Time Tunnel',icon:'⏳',th:TN_THEMES,langs:null,g1:'#b89cff',g2:'#ffd76a',bg:'linear-gradient(120deg,#1a1036,#2b1a5a 55%,#3a2378)'},
 w:{id:'w',n:'tw_name',ds:'tw_desc',lg:'tn_lgen',sub:'Western Gate',icon:'🏰',th:TW_THEMES,langs:['en'],light:true,g1:'#ffffff',g2:'#ffe14d',bg:'linear-gradient(120deg,#36b6ff,#8f7dff 52%,#ff7ec0)'},
 e:{id:'e',n:'te_name',ds:'te_desc',lg:'tn_lgth',sub:'Erawan Gate',icon:'🐘',th:TE_THEMES,langs:['th'],light:true,g1:'#ffffff',g2:'#ffe14d',bg:'linear-gradient(120deg,#12b89e,#ffae3a 52%,#ff5fa2)'}};
var TN_ORDER=['','w','e','s','c','d'];
function tnGid(id){return TN_ORDER.indexOf(id)>0?id:''}
function tnGateOn(g){if(CFG.tnOn===0)return false;if(!TN_GATE[g])return false;return g==='w'?CFG.twOn!==0:g==='e'?CFG.teOn!==0:g==='s'?CFG.tsOn!==0:g==='c'?CFG.tcOn!==0:g==='d'?CFG.tdOn!==0:true}
var TN={g:null,f:0,mode:'map',ents:[],boss:null,p:{x:50,y:88},tg:null,keys:{},iv:null,enc:null,res:null,bossMiss:[]};
var TN_R=.625; /* map height / width */
function tnOn(){return CFG.tnOn!==0}
function tnCur(g){return g===undefined?tnGid(TN.g):tnGid(g)}
function tnSt(g){g=tnCur(g);return g?(S.tng&&S.tng[g])||tnBlank():S.tn||tnBlank()}
function tnMaxF(g){return tnSt(g).max||0}
function tnDropTaken(f,g){var T=tnSt(g);return !!(T.drop&&T.drop[f]===bkkDay())}
function tnTheme(f,g){var th=TN_GATE[tnCur(g)].th;return th[(f-1)%th.length]}
function tnTierName(f,g){var c=tnCur(g);return t((TN_GATE[c].tp||(c==='w'?'tw':c==='e'?'te':'tn'))+'_tier'+tnTier(f))}
function tnFloorName(f,g){return t('tn_floor')+' '+f+t('tn_floorsfx')+' · '+tx(tnTheme(f,g).n)}
function tnZW(ids){var ws=[];ZONES.forEach(function(z){if(ids.indexOf(z.id)>=0)ws=ws.concat(zoneWords(z))});return ws}
function tnWords(f,g){var c=tnCur(g),tier=tnTier(f),ws=[],basic=[];ZONES.slice(0,5).forEach(function(z){basic=basic.concat(zoneWords(z))});
  if(c==='w'){var notZh=function(w){var fo=UNIT_FOCUS[w.u];return !fo||fo.indexOf('en')>=0},t1=basic,t2=tnZW(['ex']),t3=tnZW(['hero','kn']).filter(notZh);
    ws=tier===1?t1:tier===2?t2:tier===3?t3:t1.concat(t2,t3)}
  else if(c==='e'){var e1=[],e2=[];ZONES.slice(0,3).forEach(function(z){e1=e1.concat(zoneWords(z))});ZONES.slice(3,5).forEach(function(z){e2=e2.concat(zoneWords(z))});var e3=tnZW(['tx']);
    ws=tier===1?e1:tier===2?e2:tier===3?e3:e1.concat(e2,e3)}
  else{var zs=tier===1?ZONES.slice(0,5):tier===2?ZONES.slice(5,8):tier===3?ZONES.slice(8):ZONES;zs.forEach(function(z){ws=ws.concat(zoneWords(z))})}
  return ws.length>=4?ws:basic.length>=4?basic:WORDS}
function tnPets(){var p=ITEMS.filter(function(it){return it.cat==='pet'&&it.v&&PSET[it.v.k]&&!PSET[it.v.k].spr});return p}
function tnPetSvg(it){if(!it||!PSET[it.v.k])return '<svg viewBox="-34 -38 68 68"><text x="0" y="10" font-size="40" text-anchor="middle">👾</text></svg>';
  return '<svg viewBox="-34 -38 68 68" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+PSET[it.v.k].d(it.v.a,it.v.b)+'</svg>'}
function tnBossPet(f){var ps=tnPets();return ps.length?ps[(f*7+3)%ps.length]:null}

/* ----- backdrop ----- */
function tnBackdropBright(f,th){var s='',seed=f*7919+13,u='tb'+tnCur()+f;function r(){seed=(seed*9301+49297)%233280;return seed/233280}
  var pal=['#ff5f6d','#ffb347','#ffe66d','#6be38a','#5fb8ff','#a78bfa','#ff7ec0'];
  s+='<defs><linearGradient id="'+u+'s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+th.a+'"/><stop offset=".62" stop-color="'+th.b+'"/><stop offset="1" stop-color="'+th.b+'"/></linearGradient>'+
     '<radialGradient id="'+u+'u"><stop offset="0" stop-color="#fffbe0"/><stop offset=".45" stop-color="#ffe680"/><stop offset="1" stop-color="#ffe680" stop-opacity="0"/></radialGradient></defs>';
  s+='<rect width="160" height="100" fill="url(#'+u+'s)"/><circle cx="140" cy="14" r="16" fill="url(#'+u+'u)"><animate attributeName="r" values="15;17;15" dur="4s" repeatCount="indefinite"/></circle><circle cx="140" cy="14" r="6.5" fill="#fff6b0"/>';
  /* rainbow around the guardian portal */
  pal.slice(0,6).forEach(function(c,k){var rr=34-k*3.2;s+='<path d="M'+f1(80-rr)+' 30A'+f1(rr)+' '+f1(rr*.62)+' 0 0 1 '+f1(80+rr)+' 30" fill="none" stroke="'+c+'" stroke-width="2.6" stroke-opacity=".5"/>'});
  /* clouds */
  [[22,14,1],[58,8,.8],[108,12,.9],[30,40,.6],[128,38,.7]].forEach(function(c,j){s+='<g opacity=".9"><animateTransform attributeName="transform" type="translate" values="0 0;'+(6+j*2)+' 0;0 0" dur="'+(14+j*4)+'s" repeatCount="indefinite"/><g transform="translate('+c[0]+' '+c[1]+') scale('+c[2]+')" fill="#fff"><ellipse cx="0" cy="0" rx="9" ry="4"/><ellipse cx="-5" cy="1" rx="6" ry="3.4"/><ellipse cx="6" cy="1" rx="6" ry="3.2"/><ellipse cx="1" cy="-2.6" rx="5" ry="3.6"/></g></g>'});
  /* ground */
  s+='<path d="M0 62Q40 54 80 60T160 58V100H0Z" fill="'+th.c+'" opacity=".16"/><path d="M0 74Q46 66 92 72T160 70V100H0Z" fill="#fff" opacity=".28"/>';
  for(var p=0;p<8;p++){var px=24+r()*112,py=56+r()*38;s+='<ellipse cx="'+f1(px)+'" cy="'+f1(py)+'" rx="'+f1(5+r()*5)+'" ry="'+f1(1.3+r()*1.2)+'" fill="#fff" opacity=".45"/>'}
  /* confetti sparkles */
  for(var i=0;i<34;i++){var x=r()*160,y=r()*100,c=pal[Math.floor(r()*pal.length)];
    s+=(i%3?'<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(.5+r()*.7)+'"':'<rect x="'+f1(x)+'" y="'+f1(y)+'" width="1.4" height="1.4" transform="rotate('+Math.floor(r()*90)+' '+f1(x)+' '+f1(y)+')"')+' fill="'+c+'" opacity=".75"><animate attributeName="opacity" values=".25;.9;.25" dur="'+f1(2+r()*3)+'s" repeatCount="indefinite"/>'+(i%3?'</circle>':'</rect>')}
  /* scenery */
  [[14,58,11],[146,56,11],[40,93,8],[121,95,8],[36,47,6],[126,45,6]].forEach(function(q,j){s+='<text x="'+q[0]+'" y="'+q[1]+'" font-size="'+q[2]+'" text-anchor="middle" opacity=".92">'+th.d[j%th.d.length]+'</text>'});
  return '<svg class="tn-bg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+s+'</svg>'}
function tnBackdrop(f){var th=tnTheme(f),s='',seed=f*9301;if(th.d)return tnBackdropBright(f,th);function r(){seed=(seed*9301+49297)%233280;return seed/233280}
  s+='<defs><radialGradient id="tnbg'+f+'" cx="50%" cy="12%" r="95%"><stop offset="0" stop-color="'+th.b+'"/><stop offset=".55" stop-color="'+th.a+'"/><stop offset="1" stop-color="#05040c"/></radialGradient>'+
     '<radialGradient id="tnpt'+f+'"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="'+th.c+'" stop-opacity=".8"/><stop offset="1" stop-color="'+th.b+'" stop-opacity="0"/></radialGradient></defs>';
  s+='<rect width="160" height="100" fill="url(#tnbg'+f+')"/>';
  for(var i=0;i<46;i++){var x=r()*160,y=r()*100;s+='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(.2+r()*.6)+'" fill="'+th.c+'" opacity="'+f1(.25+r()*.6)+'"><animate attributeName="opacity" values=".2;.9;.2" dur="'+f1(2+r()*4)+'s" repeatCount="indefinite"/></circle>'}
  /* time rings around the guardian portal */
  for(var k=0;k<5;k++)s+='<ellipse cx="80" cy="20" rx="'+(10+k*9)+'" ry="'+(4+k*3.4)+'" fill="none" stroke="'+th.c+'" stroke-opacity="'+f1(.5-k*.08)+'" stroke-width=".5" stroke-dasharray="'+(2+k)+' '+(3+k)+'"><animateTransform attributeName="transform" type="rotate" from="0 80 20" to="'+(k%2?-360:360)+' 80 20" dur="'+(30+k*12)+'s" repeatCount="indefinite"/></ellipse>';
  /* clock faces in the corners */
  [[16,24,10],[146,30,8],[22,84,7],[140,82,9]].forEach(function(c,j){var tk='';for(var q=0;q<12;q++){var an=q/12*Math.PI*2;tk+='<line x1="'+f1(c[0]+Math.cos(an)*c[2]*.78)+'" y1="'+f1(c[1]+Math.sin(an)*c[2]*.78)+'" x2="'+f1(c[0]+Math.cos(an)*c[2])+'" y2="'+f1(c[1]+Math.sin(an)*c[2])+'"/>'}
    s+='<g stroke="'+th.c+'" stroke-opacity=".35" stroke-width=".45" fill="none"><circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'"/>'+tk+'<line x1="'+c[0]+'" y1="'+c[1]+'" x2="'+c[0]+'" y2="'+(c[1]-c[2]*.6)+'"><animateTransform attributeName="transform" type="rotate" from="0 '+c[0]+' '+c[1]+'" to="360 '+c[0]+' '+c[1]+'" dur="'+(8+j*3)+'s" repeatCount="indefinite"/></line></g>'});
  /* floating path stones */
  for(var p=0;p<9;p++){var px=26+r()*108,py=34+r()*58;s+='<ellipse cx="'+f1(px)+'" cy="'+f1(py)+'" rx="'+f1(5+r()*6)+'" ry="'+f1(1.4+r()*1.4)+'" fill="'+th.c+'" opacity=".09"/>'}
  s+='<ellipse cx="80" cy="96" rx="40" ry="6" fill="'+th.c+'" opacity=".1"/>';
  return '<svg class="tn-bg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+s+'</svg>'}

/* ----- floor setup and loop ----- */
function tnStart(f){f=int(f,1,10,1);if(!tnGateOn(tnCur())||f>tnMaxF()+1)return;var ps=tnPets(),n=int(CFG.tnMon,1,20,10),ents=[];
  for(var i=0;i<n;i++){var it=ps.length?ps[Math.floor(rnd(ps.length))]:null,x,y,tries=0;
    do{x=8+rnd(84);y=26+rnd(58);tries++}while(tries<30&&(Math.hypot(x-50,(y-88)*TN_R)<18||ents.some(function(o){return Math.hypot(o.x-x,(o.y-y)*TN_R)<9})));
    var an=rnd(Math.PI*2);ents.push({i:i,id:it&&it.id,mk:Math.floor(rnd(64)),x:x,y:y,vx:Math.cos(an)*.22,vy:Math.sin(an)*.22,alive:true,stun:0,miss:[]})}
  TN.f=f;TN.mode='map';TN.ents=ents;TN.boss={id:(tnBossPet(f)||{}).id,x:50,y:28,stun:0};TN.p={x:50,y:88};TN.tg=null;TN.enc=null;TN.res=null;TN.bossMiss=[];TN.keys={};
  if(UI.scr!=='tunnel')go('tunnel');else render()}
function tnLeft(){return TN.ents.filter(function(e){return e.alive}).length}
function tnLoopOn(){if(TN.iv)return;TN.iv=setInterval(tnTick,40)}
function tnLoopOff(){if(TN.iv){clearInterval(TN.iv);TN.iv=null}}
function tnTick(){if(UI.scr!=='tunnel'||!TN.f){tnLoopOff();TN.keys={};return}if(TN.mode!=='map'||UI.modal)return;
  var mp=document.getElementById('tn_map');if(mp&&mp.clientWidth)TN_R=mp.clientHeight/mp.clientWidth;
  var p=TN.p,sp=.85,kx=(TN.keys.r?1:0)-(TN.keys.l?1:0),ky=(TN.keys.d?1:0)-(TN.keys.u?1:0);
  if(kx||ky){var kl=Math.hypot(kx,ky);p.x+=kx/kl*sp;p.y+=ky/kl*sp/TN_R;TN.tg=null}
  else if(TN.tg){var dx=TN.tg.x-p.x,dy=(TN.tg.y-p.y)*TN_R,dl=Math.hypot(dx,dy);if(dl<sp){p.x=TN.tg.x;p.y=TN.tg.y;TN.tg=null}else{p.x+=dx/dl*sp;p.y+=dy/dl*sp/TN_R}}
  p.x=Math.max(4,Math.min(96,p.x));p.y=Math.max(10,Math.min(94,p.y));
  var still=S.set.motion===false;
  TN.ents.forEach(function(e){if(!e.alive)return;if(e.stun>0)e.stun--;
    if(!still){if(rnd(1)<.02){var an=rnd(Math.PI*2);e.vx=Math.cos(an)*.22;e.vy=Math.sin(an)*.22}e.x+=e.vx;e.y+=e.vy/TN_R*.6;
      if(e.x<6||e.x>94){e.vx=-e.vx;e.x=Math.max(6,Math.min(94,e.x))}if(e.y<24||e.y>90){e.vy=-e.vy;e.y=Math.max(24,Math.min(90,e.y))}}});
  if(TN.boss&&TN.boss.stun>0)TN.boss.stun--;
  tnPaint();
  /* bumping into a monster no longer starts a fight: the player taps the one they choose (tnpick) */
}
function tnPaint(){var pe=document.getElementById('tn_p');if(!pe)return;pe.style.left=TN.p.x+'%';pe.style.top=TN.p.y+'%';
  TN.ents.forEach(function(e){var el=document.getElementById('tn_m'+e.i);if(!el)return;if(!e.alive){el.remove();return}el.style.left=e.x+'%';el.style.top=e.y+'%';el.classList.toggle('stun',e.stun>0);el.classList.toggle('flip',e.vx<0)});
  var be=document.getElementById('tn_boss');if(be)be.classList.toggle('stun',TN.boss.stun>0)}

/* ----- encounters ----- */
function tnEncounter(kind,mi){if(TN_GATE[tnCur()].exam)return tnExamEnc(kind,mi);var f=TN.f,pool=tnWords(f),langs=TN_GATE[tnCur()].langs,n=kind==='boss'?int(CFG.tnBossQ,1,20,5):int(CFG.tnQ,1,10,3);
  var miss=kind==='boss'?TN.bossMiss:TN.ents[mi].miss,ws=[],seen={};
  miss.forEach(function(id){if(WORD[id]&&ws.length<n&&!seen[id]){ws.push(WORD[id]);seen[id]=1}});
  var rest=shuffle(pool.filter(function(w){return !seen[w.id]}));while(ws.length<n&&rest.length)ws.push(rest.pop());
  while(ws.length<n)ws.push(pick(pool));
  TN.keys={};TN.tg=null;TN.mode='enc';
  TN.enc={kind:kind,mi:mi,qs:ws.map(function(w){return makeQ(w,pool,langs||true)}),i:0,ok:0,picked:null,wc:[],ww:[],la:{},rs:[],t0:Date.now()};render()}
function tnAnswer(idx){var s=TN.enc;if(!s||s.picked!==null)return;var q=s.qs[s.i],ok=idx===q.ans;s.picked=idx;s.lastOk=ok;s.rs[s.i]=ok;
  if(q.type==='mcq'){mcqMark(s,q,ok);sfx(ok?'hit':'ng');say(ok?t('right'):t('wrong'));touchStreak();save();render();return}
  var lg=langOfQ(q);S.stats[lg][ok?'ok':'ng']++;srsMark(q.w.id,ok);if(ok)s.ok++;tally(s,q,lg,ok);
  sfx(ok?'hit':'ng');say(ok?t('right'):t('wrong')+'. '+t('answer')+': '+plainLabel(q.w,q.to));touchStreak();save();render();
  if(ok&&q.to!=='py'&&q.type!=='listen'&&hasVoice(q.to))speak(q.w[q.to],q.to)}
function tnNext(){var s=TN.enc;if(!s||s.picked===null)return;if(s.i<s.qs.length-1){s.i++;s.picked=null;render();return}tnFinish()}
function tnFinish(){var s=TN.enc,f=TN.f,n=s.qs.length,dur=Date.now()-s.t0,words={c:s.wc,w:s.ww};rollDaily();var gid=tnCur(),capped=tnCapped(S,today(),CFG,gid);
  if(s.kind==='mon'){var e=bTnMon(S,f,n,s.ok,dur,today(),words,laArr(s),CFG,gid),g=commitEv(e),m0=TN.ents[s.mi];
    if(e.win){m0.alive=false;m0.miss=[]}else{m0.miss=s.ww.slice();m0.stun=90;var dx=TN.p.x-m0.x,dy=TN.p.y-m0.y,dl=Math.hypot(dx,dy)||1;TN.p.x=Math.max(4,Math.min(96,TN.p.x+dx/dl*8));TN.p.y=Math.max(10,Math.min(94,TN.p.y+dy/dl*8))}
    TN.res={kind:'mon',win:e.win,g:g,capped:capped};TN.enc=null;TN.mode='res';save();render();return}
  var tl0=typeof earnedTitles==='function'?earnedTitles():[];
  if(!CL.uid&&!S.lseed)S.lseed='l'+Date.now().toString(36)+Math.floor(rnd(1e9)).toString(36);
  var b=bTnBoss(S,f,n,s.ok,dur,today(),words,laArr(s),CFG,CL.uid||S.lseed,CL.uid?'u':'l',gid),had={};(b.items||[]).forEach(function(id){had[id]=S.owned[id]||0});
  var g2=commitEv(b);
  if(b.win){TN.bossMiss=[];sfx('lvl')}else{TN.bossMiss=s.ww.slice();TN.boss.stun=90;TN.p.y=Math.min(94,TN.p.y+14)}
  TN.res={kind:'boss',win:b.win,g:g2,items:(b.items||[]).map(function(id,i){var isNew=!had[id]&&(b.items.indexOf(id)===i);return {id:id,isNew:isNew}}),taken:b.win&&!(b.items||[]).length,capped:capped};
  TN.enc=null;TN.mode='res';save();render()}
function tnContinue(){var r=TN.res;TN.res=null;if(r&&r.kind==='boss'&&r.win){TN.f=0;TN.mode='map';render();return}TN.mode='map';render()}

/* ----- views ----- */
function tnGateArt(G,big){return '<div class="tn-gateart'+(big?' big':'')+'" aria-hidden="true" style="--g1:'+G.g1+';--g2:'+G.g2+'"><i></i><i></i><i></i><b>'+G.icon+'</b></div>'}
function tnGateStat(g){var mx=tnMaxF(g),ready=0;for(var f=1;f<=Math.min(10,mx);f++)if(!tnDropTaken(f,g))ready++;return {mx:mx,ready:ready}}
function tnGateCard(compact){if(!tnOn()||!S.created)return '';var gs=TN_ORDER.filter(tnGateOn);if(!gs.length)return '';
  return '<section class="panel tn-gates'+(compact?' compact':'')+'"><div class="row" style="justify-content:space-between;align-items:baseline"><span class="eyebrow">🚪 '+esc(t('tn_gates'))+'</span>'+(compact?'':'<small class="mut">'+esc(t('tn_gatesdesc'))+'</small>')+'</div><div class="tn-gaterow">'+
   gs.map(function(g){var G=TN_GATE[g],st=tnGateStat(g);return '<button class="tn-gbtn" data-act="tngate" data-id="'+G.id+'" style="background:'+G.bg+'">'+tnGateArt(G)+'<span class="stack" style="gap:1px;min-width:0;text-align:left"><b>'+esc(t(G.n))+'</b><small>'+esc(t(G.lg))+'</small><small class="num">'+esc(st.mx>=10?'🏆 10/10':t('tn_floor')+' '+Math.min(10,st.mx+1)+t('tn_floorsfx')+' · '+st.mx+'/10')+(st.ready?' · 🎁×'+st.ready:'')+'</small></span></button>'}).join('')+'</div></section>'}
function tnGatesHtml(){var gs=TN_ORDER.filter(tnGateOn);
  var h='<section class="panel tn-hero" style="background:linear-gradient(120deg,#3a1d7a,#d94f9e 55%,#ffb347);border-color:#ffb347">'+tnGateArt({icon:'🚪',g1:'#fff',g2:'#ffe14d'},true)+'<div class="stack" style="gap:6px"><span class="eyebrow">Adventure Gates</span><h1 style="font-size:28px;margin:0">'+esc(t('tn_gates'))+'</h1><p class="mut" style="margin:0">'+esc(t('tn_gatesdesc'))+'</p></div></section><div class="tn-gatebig">';
  gs.forEach(function(g){var G=TN_GATE[g],st=tnGateStat(g);h+='<button class="tn-gcard" data-act="tngate" data-id="'+G.id+'" style="background:'+G.bg+'">'+tnGateArt(G,true)+'<span class="stack" style="gap:4px;text-align:left"><span class="eyebrow">'+esc(G.sub)+'</span><b style="font-size:22px">'+esc(t(G.n))+'</b><span class="tn-lang">'+esc(t(G.lg))+'</span><small>'+esc(t(G.ds))+'</small>'+
    '<span class="tn-gprog" aria-label="'+st.mx+'/10"><i style="width:'+st.mx*10+'%"></i></span><small class="num">'+esc(t('tn_cleared'))+' '+st.mx+'/10'+(st.ready?' · 🎁 × '+st.ready:'')+'</small></span></button>'});
  return h+'</div>'}
function tnRatesHtml(){var h='<details class="tn-rates"><summary>📊 '+esc(t('tn_rates'))+'</summary><div class="tn-rtable" role="table"><div class="tn-rrow hd" role="row"><span role="columnheader"></span>'+TN_RARS.map(function(r){return '<span role="columnheader" class="rtxt r-'+r+'">'+esc(tx(RAR[r].names))+'</span>'}).join('')+'</div>';
  [[1,'1–3',1],[2,'4–6',4],[3,'7–9',7],[4,'10',10]].forEach(function(x){var ws=tnWeights(x[2],CFG,tnCur(),bkkDay()),tot=ws.reduce(function(a,b){return a+b},0)||1;
    h+='<div class="tn-rrow" role="row"><span role="rowheader"><b>'+esc(t('tn_floor'))+' '+x[1]+esc(t('tn_floorsfx'))+'</b></span>'+ws.map(function(w){return '<span class="num" role="cell">'+(Math.round(w/tot*1000)/10)+'%</span>'}).join('')+'</div>'});
  var c1=int(CFG.tnC1,0,100,60),c2=int(CFG.tnC2,0,100,30);
  return h+'</div><p class="mut" style="margin:6px 0 0">'+esc(t('tn_count'))+': 1 = '+c1+'% · 2 = '+c2+'% · 3 = '+Math.max(0,100-c1-c2)+'%</p><p class="mut" style="margin:2px 0 0">'+esc(t('tn_ratesnote'))+'</p>'+(TN_TOPG[tnCur()]?'<p style="margin:4px 0 0"><b>'+esc(t('tn_topnote'))+'</b></p>':'')+'</details>'}
function tnFloorsHtml(){var mx=tnMaxF(),G=TN_GATE[tnCur()],h='<div class="row"><button class="btn sec sm" data-act="tngates">'+ICON.back.replace('<svg','<svg width="16" height="16"')+esc(t('tn_pick'))+'</button></div>'+
   '<section class="panel tn-hero" style="background:'+G.bg+'">'+tnGateArt(G,true)+'<div class="stack" style="gap:6px"><span class="eyebrow">'+esc(G.sub)+'</span><h1 style="font-size:28px;margin:0">'+esc(t(G.n))+'</h1><span class="tn-lang">'+esc(t(G.lg))+'</span><p class="mut" style="margin:0">'+esc(t(G.ds))+'</p></div></section>';
  h+='<div class="tn-floors">';for(var f=1;f<=10;f++){var th=tnTheme(f),open=f<=mx+1,done=f<=mx,bp=tnBossPet(f);
    h+='<button class="tn-fl'+(th.d?' light':'')+(open?'':' locked')+(done?' done':'')+'" data-act="tnfloor" data-id="'+f+'"'+(open?'':' disabled aria-disabled="true"')+' style="--a:'+th.a+';--b:'+th.b+';--c:'+th.c+'">'+
     '<span class="tn-fnum num">'+f+'</span><span class="tn-fpet" aria-hidden="true">'+(open?tnBossSvg(f):'🔒')+'</span><span class="stack" style="gap:2px;min-width:0;text-align:left"><b>'+esc(tx(th.n))+'</b><small>'+esc(tnTierName(f))+'</small>'+
     '<small class="tn-fst">'+esc(!open?t('tn_locked'):done?'✔ '+t('tn_cleared'):t('tn_new'))+'</small>'+(open?'<small class="tn-fst">'+esc(tnDropTaken(f)?t('tn_droptaken'):t('tn_dropready'))+'</small>':'')+'</span></button>'}
  return h+'</div><section class="panel">'+tnRatesHtml()+'</section>'}
function tnMapHtml(){var f=TN.f,th=tnTheme(f),left=tnLeft(),bp=TN.boss&&ITEM[TN.boss.id],gate=!left;
  var h='<section class="panel stack tn-play'+(th.d?' light':'')+'" style="--a:'+th.a+';--b:'+th.b+';--c:'+th.c+'"><div class="row" style="justify-content:space-between;align-items:center"><button class="btn sec sm" data-act="tnexit">'+ICON.back.replace('<svg','<svg width="16" height="16"')+esc(t('tn_back'))+'</button>'+
   '<div class="stack" style="gap:0;text-align:right"><b>'+esc(tnFloorName(f))+'</b><small class="mut">'+esc(tnTierName(f))+' · '+esc(tnDropTaken(f)?t('tn_droptaken'):t('tn_dropready'))+'</small></div></div>'+
   '<div class="tn-bar"><span>👾 '+esc(t('tn_left'))+'</span><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+TN.ents.length+'" aria-valuenow="'+(TN.ents.length-left)+'"><i style="width:'+((TN.ents.length-left)/TN.ents.length*100)+'%"></i></div><b class="num">'+left+'/'+TN.ents.length+'</b></div>'+
   '<div class="tn-map" id="tn_map" data-act="tnmove" role="application" aria-label="'+esc(t(TN_GATE[tnCur()].n)+' · '+tnFloorName(f))+'">'+tnBackdrop(f)+
   '<div class="tn-portal'+(gate?' open':'')+'" aria-hidden="true"></div>';
  if(gate&&(bp||TN_GATE[tnCur()].mask))h+='<div class="tn-ent tn-boss'+(TN.boss.stun>0?' stun':'')+'" id="tn_boss" data-act="tnpickboss" role="button" tabindex="0" aria-label="'+esc(t('tn_guard')+' '+f)+'" style="left:'+TN.boss.x+'%;top:'+TN.boss.y+'%"><span class="tn-crown" aria-hidden="true">👑</span>'+tnBossSvg(f)+'<span class="tn-tag">'+esc(t('tn_guard'))+' '+f+'</span></div>';
  TN.ents.forEach(function(e){if(!e.alive)return;var it0=ITEM[e.id];h+='<div class="tn-ent tn-mon'+(e.stun>0?' stun':'')+(e.miss.length?' angry':'')+'" id="tn_m'+e.i+'" data-act="tnpick" data-id="'+e.i+'" role="button" tabindex="0" aria-label="'+esc(t('tn_mon')+' · '+tnMobName(e))+'" style="left:'+e.x+'%;top:'+e.y+'%">'+tnMobSvg(e)+'</div>'});
  h+='<div class="tn-ent tn-me" id="tn_p" style="left:'+TN.p.x+'%;top:'+TN.p.y+'%">'+avatar(S,{noPet:true,noWeapon:false})+'</div>'+tnAskHtml()+'</div>'+
   '<div class="tn-pad" role="group" aria-label="move"><button class="btn sec sm" data-act="tnpad" data-id="u" aria-label="up">▲</button><button class="btn sec sm" data-act="tnpad" data-id="l" aria-label="left">◀</button><button class="btn sec sm" data-act="tnpad" data-id="d" aria-label="down">▼</button><button class="btn sec sm" data-act="tnpad" data-id="r" aria-label="right">▶</button></div>'+
   '<small class="mut" style="text-align:center">'+esc(gate?t('tn_gate'):t('tn_hint'))+'</small></section>';
  return h}
function tnAskHtml(){if(TN.mode!=='ask'||TN.ask==null||!TN.ents[TN.ask])return '';var e=TN.ents[TN.ask],n=int(CFG.tnQ,1,10,3);
  return '<div class="tn-ask" role="dialog" aria-modal="true" aria-labelledby="tn_askq"><div class="tn-askbox"><div class="tn-foe">'+tnMobSvg(e)+'</div><b>'+esc(t('tn_mon')+' · '+tnMobName(e))+'</b>'+
   '<p id="tn_askq" style="margin:0">'+esc(t('tn_askq').replace('{n}',n))+'</p>'+(e.miss.length?'<small class="tn-askmiss">💢 '+esc(t('tn_askmiss'))+'</small>':'')+
   '<div class="row" style="justify-content:center"><button class="btn sec" data-act="tnno">'+esc(t('tn_no'))+'</button><button class="btn" data-act="tnyes" id="tn_yes">'+esc(t('tn_yes'))+'</button></div></div></div>'}
function tnFoeHtml(kind,mi){var f=TN.f;if(kind==='boss'){var bn=tnBossName(f);return '<div class="tn-foe boss"><span class="tn-crown" aria-hidden="true">👑</span>'+tnBossSvg(f)+'</div><b>'+esc(t('tn_guard'))+' '+f+(bn?' · '+esc(bn):'')+'</b>'}
  var e=TN.ents[mi];return '<div class="tn-foe">'+(e?tnMobSvg(e):'')+'</div><b>'+esc(t('tn_mon'))+(e?' · '+esc(tnMobName(e)):'')+'</b>'}
function tnEncHtml(){var s=TN.enc,q=s.qs[s.i],n=s.qs.length,th=tnTheme(TN.f),dots='';
  for(var i=0;i<n;i++){var st=s.rs[i]===undefined?'':s.rs[i]?'ok':'ng';dots+='<i class="'+st+(i===s.i?' cur':'')+'"></i>'}
  var fb='';if(s.picked!==null&&q.type==='mcq')fb=mcqFb(s,q,s.i===n-1,'tnnext');else if(s.picked!==null){var w=q.w,last=s.i===n-1;fb='<div class="fb '+(s.lastOk?'ok':'ng')+'" role="status"><div class="grow"><div><b>'+esc(s.lastOk?t('right'):t('wrong'))+'</b></div><div class="wl" style="flex-wrap:wrap;gap:6px 12px;margin-top:4px">'+
    LANGS.map(function(l){return '<span class="row" style="gap:4px">'+langTag(l)+'<span'+(l==='zh'?' class="han"':'')+'>'+esc(w[l])+'</span>'+(l==='zh'&&w.py?'<small class="lt-zh">'+esc(w.py)+'</small>':'')+(hasVoice(l)?spkBtn(w[l],l):'')+'</span>'}).join('')+'</div></div>'+
    '<button class="btn" data-act="tnnext" id="nextbtn">'+esc(last?t('finish'):t('next'))+'</button></div>'}
  var SKT=typeof skTnBar==='function'&&skTnOk(s),cast=SKT&&s.vfx&&Date.now()-s.vfx.k<1600;
  return '<div class="qwrap"><section class="panel tn-arena'+(th.d?' light':'')+'" style="--a:'+th.a+';--b:'+th.b+';--c:'+th.c+'">'+(SKT?skVfx(s):'')+'<div class="fighter"><div class="av'+(cast?' sk-cast':s.picked!==null?(s.lastOk?' atk atk-'+S.cls:' ouch'):'')+'">'+avatar(S,{label:S.name,anim:true,noPet:true,face:s.picked!==null?(s.lastOk?'happy':'sad'):''})+'</div><small>'+esc(S.name)+'</small></div><div class="vs">VS</div>'+
   '<div class="fighter'+(s.picked!==null&&s.lastOk?' tn-hit':'')+'">'+tnFoeHtml(s.kind,s.mi)+'</div></section>'+
   '<div class="row" style="justify-content:space-between"><span class="eyebrow">'+esc(t('tn_qof'))+' '+(s.i+1)+'/'+n+'</span><span class="tn-dots" aria-hidden="true">'+dots+'</span></div>'+
   (SKT?skTnBar(s):'')+'<section class="panel'+(s.picked!==null&&!s.lastOk?' shake':'')+'">'+promptHtml(q)+(SKT?skHintHtml(s,q):'')+(SKT?skTnOpts(s,optsHtml(q,s.picked).replace(/data-act="ans"/g,'data-act="tnans"')):optsHtml(q,s.picked).replace(/data-act="ans"/g,'data-act="tnans"'))+'</section>'+fb+'</div>'}
function tnBossIntroHtml(){var f=TN.f,taken=tnDropTaken(f);return '<div class="qwrap"><section class="panel stack" style="text-align:center;justify-items:center;gap:12px"><span class="eyebrow">'+esc(tnFloorName(f))+'</span>'+tnFoeHtml('boss')+
  '<p style="margin:0">'+esc(t('tn_bossintro'))+' ('+int(CFG.tnBossQ,1,20,5)+' '+esc(t('tn_qof'))+')</p><small class="mut">'+esc(taken?t('tn_nodrop'):t('tn_dropready'))+'</small>'+
  '<div class="row" style="justify-content:center"><button class="btn sec" data-act="tnaway">'+esc(t('tn_walk'))+'</button><button class="btn big" data-act="tnboss">'+esc(t('tn_fight'))+'</button></div></section></div>'}
function tnResHtml(){var r=TN.res,f=TN.f,h='<div class="qwrap"><section class="panel stack" style="text-align:center;justify-items:center;gap:12px">';
  if(r.kind==='mon'){h+='<div style="font-size:44px" aria-hidden="true">'+(r.win?'✨':'💢')+'</div><h2 style="margin:0">'+esc(r.win?t('tn_monwin'):t('tn_mon'))+'</h2>'+(r.win?'':'<p class="mut" style="margin:0">'+esc(t('tn_monlose'))+'</p>')}
  else{h+='<div style="font-size:44px" aria-hidden="true">'+(r.win?'🏆':'🛡️')+'</div><h2 style="margin:0">'+esc(r.win?t('tn_bosswin'):t('tn_guard')+' '+f)+'</h2>'+(r.win?'':'<p class="mut" style="margin:0">'+esc(t('tn_bosslose'))+'</p>');
    if(r.win&&r.items.length)h+='<span class="eyebrow">🎁 '+esc(t('tn_drops'))+'</span><div class="reveal" style="grid-template-columns:repeat('+r.items.length+',minmax(0,180px));justify-content:center">'+r.items.map(function(x,i){var it=ITEM[x.id];if(!it)return '';
      return '<div class="item r-'+it.rar+'" style="animation-delay:'+(i*.12)+'s"><span class="thumb">'+itemThumb(it)+'</span>'+(x.isNew?'<span class="eqb">'+esc(t('newi'))+'</span>':'')+'<span class="nm">'+esc(tx(it.names))+'</span><span class="mt"><span class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span></span></div>'}).join('')+'</div>';
    else if(r.win&&r.taken)h+='<p class="mut" style="margin:0">'+esc(t('tn_nodrop'))+'</p>'}
  if(r.capped)h+='<p class="mut" style="margin:0">'+esc(t('tn_capped'))+'</p>';
  h+=rewardList(r.g)+'<div class="row" style="justify-content:center">';
  if(r.kind==='boss'&&r.win){h+='<button class="btn sec" data-act="tnexit">'+esc(t('tn_back'))+'</button>'+(f<10?'<button class="btn big" data-act="tnfloor" data-id="'+(f+1)+'">'+esc(t('tn_nextf'))+'</button>':'')}
  else h+='<button class="btn big" data-act="tncont" id="nextbtn">'+esc(t('tn_cont'))+'</button>';
  return h+'</div></section></div>'}
VIEW.tunnel=function(){if(!S.created){UI.scr='title';return VIEW.title()}
  if(!tnOn())return '<section class="panel"><div class="empty">⏳ '+esc(t('tn_closed'))+'</div></section>';
  if(TN.g!==null&&!tnGateOn(tnGid(TN.g))){TN.g=null;TN.f=0}
  if(TN.g===null){tnLoopOff();return tnGatesHtml()}
  if(!TN.f){tnLoopOff();return tnFloorsHtml()}
  if(TN.mode==='enc'&&TN.enc)return tnEncHtml();
  if(TN.mode==='res'&&TN.res)return tnResHtml();
  if(TN.mode==='bossintro')return tnBossIntroHtml();
  if(TN.mode!=='ask')TN.mode='map';setTimeout(function(){tnLoopOn();if(TN.mode==='ask'){var y=document.getElementById('tn_yes');if(y)y.focus()}},0);return tnMapHtml()};
function tunnelAct(a,id,el,e){switch(a){
  case 'tngate':var gg=id==='t'?'':tnGid(id);if(!tnGateOn(gg))return true;TN.g=gg;TN.f=0;TN.mode='map';TN.enc=null;TN.res=null;tnLoopOff();if(UI.scr!=='tunnel')go('tunnel');else{render();window.scrollTo(0,0)}return true;
  case 'tngates':TN.g=null;TN.f=0;TN.mode='map';TN.enc=null;TN.res=null;tnLoopOff();render();window.scrollTo(0,0);return true;
  case 'tnfloor':tnStart(+id);return true;
  case 'tnexit':TN.f=0;TN.mode='map';TN.enc=null;TN.res=null;tnLoopOff();render();window.scrollTo(0,0);return true;
  case 'tnmove':if(TN.mode!=='map'||!e)return true;var mp=document.getElementById('tn_map');if(!mp)return true;var rc=mp.getBoundingClientRect();TN.tg={x:Math.max(4,Math.min(96,(e.clientX-rc.left)/rc.width*100)),y:Math.max(10,Math.min(94,(e.clientY-rc.top)/rc.height*100))};return true;
  case 'tnpad':if(TN.mode!=='map')return true;var d={u:[0,-12],d:[0,12],l:[-10,0],r:[10,0]}[id];if(d)TN.tg={x:Math.max(4,Math.min(96,TN.p.x+d[0])),y:Math.max(10,Math.min(94,TN.p.y+d[1]))};return true;
  case 'tnans':tnAnswer(+id);return true;
  case 'tnnext':tnNext();return true;
  case 'tncont':tnContinue();return true;
  case 'tnboss':tnEncounter('boss');return true;
  case 'tnpick':if(TN.mode!=='map')return true;var pe=TN.ents[+id];if(!pe||!pe.alive)return true;if(pe.stun>0){toast(t('tn_rest'));return true}TN.keys={};TN.tg=null;TN.mode='ask';TN.ask=+id;render();return true;
  case 'tnpickboss':if(TN.mode!=='map'||tnLeft())return true;if(TN.boss.stun>0){toast(t('tn_rest'));return true}TN.keys={};TN.tg=null;TN.mode='bossintro';render();return true;
  case 'tnyes':if(TN.mode!=='ask'||TN.ask==null)return true;var ai=TN.ask;TN.ask=null;tnEncounter('mon',ai);return true;
  case 'tnno':TN.mode='map';TN.ask=null;render();return true;
  case 'tnaway':TN.mode='map';render();return true}
  return false}
var TN_KEYS={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r',w:'u',s:'d',a:'l',d:'r',W:'u',S:'d',A:'l',D:'r'};
document.addEventListener('keydown',function(e){if(UI.scr!=='tunnel'||!TN.f||UI.modal)return;var tg=document.activeElement;if(tg&&/INPUT|TEXTAREA|SELECT/.test(tg.tagName))return;
  if(TN.mode==='map'&&TN_KEYS[e.key]){TN.keys[TN_KEYS[e.key]]=true;e.preventDefault();return}
  if(TN.mode==='ask'&&e.key==='Escape'){TN.mode='map';TN.ask=null;render();e.preventDefault();return}
  if(TN.mode==='map'&&(e.key==='Enter'||e.key===' ')&&tg&&tg.dataset&&(tg.dataset.act==='tnpick'||tg.dataset.act==='tnpickboss')){tg.click();e.preventDefault();return}
  if(TN.mode==='enc'&&TN.enc&&TN.enc.picked===null&&/^[1-4]$/.test(e.key)){tnAnswer(+e.key-1);e.preventDefault()}});
document.addEventListener('keyup',function(e){if(TN_KEYS[e.key])TN.keys[TN_KEYS[e.key]]=false});
window.addEventListener('blur',function(){TN.keys={}});

/* gates: home, map and town */
(function(){var H=VIEW.home,M=VIEW.map,T=VIEW.town;
  VIEW.home=function(){var h=H();var i=h.indexOf('<div class="cols">');return i>=0?h.slice(0,i)+tnGateCard()+h.slice(i):h+tnGateCard()};
  VIEW.map=function(){return tnGateCard(true)+M()};
  VIEW.town=function(){var h=T();return h.indexOf('tw_scene')>=0?tnGateCard(true)+h:h}})();
