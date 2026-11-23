/* =====================================================================
   THREE EXAM GATES — Sky City (English), Sacred Land (Chinese) and the
   Divine Examiner (Thai). Lower-secondary (M.1–M.3) multiple-choice
   questions from the "exams" bank (the teacher can edit / add them),
   10 floors each, getting harder floor by floor. Monsters are masks.
   Same rewards, drops and anti-cheat record as the other gates.
   ===================================================================== */
Object.assign(L,{
 ts_name:m('เมืองเวหา','Sky City','天空之城'),ts_desc:m('เมืองลอยฟ้าเหนือทะเลเมฆ ฝ่าด่านหน้ากากแห่งสายลมด้วยข้อสอบภาษาอังกฤษระดับมัธยมต้น','A floating city above a sea of clouds. Beat the wind masks with lower-secondary English questions','云海之上的浮空之城,用初中英语题击败风之面具'),
 tc_name:m('ดินแดนศักดิ์','Sacred Land','神圣之地'),tc_desc:m('ดินแดนโคมแดงและมังกรหยก ฝึกคำศัพท์และประโยคภาษาจีนระดับมัธยมต้น','A land of red lanterns and jade dragons. Practise lower-secondary Chinese words and sentences','红灯笼与玉龙之地,练习初中汉语词汇与句子'),
 td_name:m('ผู้ทดสอบเทวะ','Divine Examiner','天神考官'),td_desc:m('เหล่าเทวะผู้คุมหน้ากากทองคำรอทดสอบความรู้ภาษาไทยระดับมัธยมต้นของคุณ','Golden-masked devas test your lower-secondary Thai','戴金面具的天神考验你的初中泰语'),
 tn_lgs:m('🇬🇧 ข้อสอบอังกฤษ ม.ต้น','🇬🇧 English exam · M.1–3','🇬🇧 初中英语题'),tn_lgc:m('🇨🇳 ศัพท์และประโยคจีน ม.ต้น','🇨🇳 Chinese words & sentences · M.1–3','🇨🇳 初中汉语词句'),tn_lgd:m('🇹🇭 ข้อสอบภาษาไทย ม.ต้น','🇹🇭 Thai exam · M.1–3','🇹🇭 初中泰语题'),
 ts_tier1:m('ระดับ ม.1','Level M.1','初一'),ts_tier2:m('ระดับ ม.2','Level M.2','初二'),ts_tier3:m('ระดับ ม.3','Level M.3','初三'),ts_tier4:m('ท้าทายรวม','Grand challenge','综合挑战'),
 tc_tier1:m('ระดับ ม.1','Level M.1','初一'),tc_tier2:m('ระดับ ม.2','Level M.2','初二'),tc_tier3:m('ระดับ ม.3','Level M.3','初三'),tc_tier4:m('ท้าทายรวม','Grand challenge','综合挑战'),
 td_tier1:m('ระดับ ม.1','Level M.1','初一'),td_tier2:m('ระดับ ม.2','Level M.2','初二'),td_tier3:m('ระดับ ม.3','Level M.3','初三'),td_tier4:m('ท้าทายรวม','Grand challenge','综合挑战'),
 tn_gatesdesc:m('6 ประตู: กาลเวลา (ผสม) · ตะวันตก (อังกฤษ) · เอราวัณ (ไทย) · เมืองเวหา (อังกฤษ ม.ต้น) · ดินแดนศักดิ์ (จีน ม.ต้น) · ผู้ทดสอบเทวะ (ไทย ม.ต้น) แต่ละประตูมี 10 ชั้นพร้อมบอส','6 gates: Time (mixed) · Western (English) · Erawan (Thai) · Sky City (English M.1–3) · Sacred Land (Chinese M.1–3) · Divine Examiner (Thai M.1–3), 10 floors each with a boss','6 道门:时空(混合)· 西方(英语)· 爱侣湾(泰语)· 天空之城(初中英语)· 神圣之地(初中汉语)· 天神考官(初中泰语),各 10 层并有首领'),
 mq_ask:m('ข้อสอบ','Exam question','考题'),mq_ans:m('คำตอบที่ถูก','Correct answer','正确答案'),mq_why:m('เหตุผล','Why','解析')});
var TS_THEMES=[
 {n:m('ทะเลเมฆปุยฝ้าย','Cotton Cloud Sea','棉花云海'),a:'#8fd3ff',b:'#f4fbff',c:'#4aa8ff',d:['☁️','🕊️','✨']},
 {n:m('ท่าเรือเหาะ','Airship Harbour','飞艇港'),a:'#7cc4ff',b:'#fff4d6',c:'#ff9f43',d:['🎈','☁️','🚁']},
 {n:m('สะพานสายรุ้ง','Rainbow Bridge','彩虹桥'),a:'#9ad8ff',b:'#ffe9f6',c:'#ff5fa2',d:['🌈','☁️','🦋']},
 {n:m('หอนาฬิกาสายลม','Wind Clock Tower','风之钟楼'),a:'#86c9f5',b:'#eef7ff',c:'#3d7bd9',d:['🕰️','🌬️','☁️']},
 {n:m('สวนลอยฟ้า','Floating Gardens','空中花园'),a:'#8fe0d0',b:'#f2fff6',c:'#2bb673',d:['🌷','🌿','☁️']},
 {n:m('ตลาดบอลลูน','Balloon Market','气球集市'),a:'#9fd0ff',b:'#fff6e0',c:'#ff7a1a',d:['🎈','🎪','🪁']},
 {n:m('หอดูดาว','Star Observatory','观星台'),a:'#6aa8ff',b:'#e8ecff',c:'#7b5cff',d:['🔭','⭐','🌙']},
 {n:m('ป้อมสายฟ้า','Thunder Fort','雷霆堡'),a:'#7d9cff',b:'#eef0ff',c:'#ffd21a',d:['⚡','☁️','🛡️']},
 {n:m('ปราสาทแสงอรุณ','Dawnlight Castle','晨光城堡'),a:'#ffb48a',b:'#fff3e3',c:'#ff6f61',d:['🏰','🌅','✨']},
 {n:m('บัลลังก์เวหา','Throne of the Sky','天空王座'),a:'#7fb8ff',b:'#fff9e8',c:'#e0a000',d:['👑','☁️','🌟']}];
var TC_THEMES=[
 {n:m('ประตูมังกรหยก','Jade Dragon Gate','玉龙门'),a:'#5fd3a0',b:'#fff4e0',c:'#e53935',d:['🐉','🏮','🎋']},
 {n:m('ตลาดโคมแดง','Red Lantern Market','红灯笼集市'),a:'#ff8a80',b:'#fff3e0',c:'#d32f2f',d:['🏮','🥟','🧧']},
 {n:m('ป่าไผ่','Bamboo Grove','竹林'),a:'#8bd88b',b:'#f3fff0',c:'#2e7d32',d:['🎋','🐼','🍃']},
 {n:m('ไร่ชาบนภูเขา','Mountain Tea Terraces','高山茶园'),a:'#7ed6a8',b:'#f6fff2',c:'#43a047',d:['🍵','⛰️','🌿']},
 {n:m('สะพานจันทร์เพ็ญ','Full Moon Bridge','满月桥'),a:'#9fb8ff',b:'#fff8e1',c:'#ffb300',d:['🌕','🥮','🏮']},
 {n:m('ลานกังฟู','Kung Fu Court','功夫广场'),a:'#ffb199',b:'#fff3ea',c:'#e64a19',d:['🥋','🏮','🎋']},
 {n:m('กำแพงเมืองโบราณ','Ancient City Wall','古城墙'),a:'#ffcc80',b:'#fff8ec',c:'#bf360c',d:['🧱','🏮','🐉']},
 {n:m('ทะเลเมฆหวงซาน','Sea of Clouds Peak','云海峰'),a:'#a5d6f7',b:'#f5fbff',c:'#5e35b1',d:['⛰️','☁️','🌲']},
 {n:m('พระราชวังทองคำ','Golden Palace','金色宫殿'),a:'#ffd54f',b:'#fffbea',c:'#c62828',d:['🏮','🧧','✨']},
 {n:m('บัลลังก์มังกร','Dragon Throne','龙椅'),a:'#ff8a65',b:'#fff6e5',c:'#ffb300',d:['🐉','👑','🏮']}];
var TD_THEMES=[
 {n:m('ลานทดสอบ','Trial Courtyard','试炼广场'),a:'#ffd27a',b:'#fff9ea',c:'#b8860b',d:['🪷','✨','🕯️']},
 {n:m('ประตูทองคำ','Golden Gate','黄金之门'),a:'#ffcf6b',b:'#fff6dc',c:'#e09b00',d:['🌟','🪷','🔔']},
 {n:m('สระอโนดาต','Anodat Lake','阿耨达池'),a:'#7fd8e6',b:'#fff5e6',c:'#00897b',d:['🪷','🐟','✨']},
 {n:m('ป่าหิมพานต์','Himmapan Forest','雪山林'),a:'#8fdc9a',b:'#fbffef',c:'#6a1b9a',d:['🐘','🌳','🦚']},
 {n:m('หอคัมภีร์','Hall of Scriptures','经阁'),a:'#e0b0ff',b:'#fff7ee',c:'#8e24aa',d:['📜','🕯️','🪷']},
 {n:m('ระเบียงนาค','Naga Terrace','龙蛇回廊'),a:'#80cbc4',b:'#fffbe9',c:'#2e7d32',d:['🐍','🪷','✨']},
 {n:m('วิมานเมฆ','Cloud Palace','云中宫殿'),a:'#b3c7ff',b:'#fffaf0',c:'#5c6bc0',d:['☁️','🏛️','🌟']},
 {n:m('สภาเทวดา','Assembly of Devas','天神议会'),a:'#ffc4a3',b:'#fff6ee',c:'#d84315',d:['🔱','🪷','✨']},
 {n:m('ยอดเขาพระสุเมรุ','Peak of Mount Meru','须弥山顶'),a:'#ffd1dc',b:'#fffaf2',c:'#ad1457',d:['⛰️','🌟','🪷']},
 {n:m('บัลลังก์เทวะ','Throne of the Devas','天神王座'),a:'#ffd54f',b:'#fffdf0',c:'#b8860b',d:['👑','🔱','🌟']}];
Object.assign(TN_GATE,{
 s:{id:'s',n:'ts_name',ds:'ts_desc',lg:'tn_lgs',sub:'Sky City',tp:'ts',icon:'☁️',th:TS_THEMES,langs:['en'],light:true,exam:'en',mask:'s',g1:'#ffffff',g2:'#bfe6ff',bg:'linear-gradient(120deg,#4fb3ff,#8ad7ff 50%,#ffd27a)'},
 c:{id:'c',n:'tc_name',ds:'tc_desc',lg:'tn_lgc',sub:'Sacred Land',tp:'tc',icon:'🏮',th:TC_THEMES,langs:['zh'],light:true,exam:'zh',mask:'c',g1:'#ffe082',g2:'#ff5252',bg:'linear-gradient(120deg,#c62828,#ef6c00 52%,#2e9d6a)'},
 d:{id:'d',n:'td_name',ds:'td_desc',lg:'tn_lgd',sub:'Divine Examiner',tp:'td',icon:'🔱',th:TD_THEMES,langs:['th'],light:true,exam:'th',mask:'d',g1:'#fff3c4',g2:'#ffd54f',bg:'linear-gradient(120deg,#6a1b9a,#c2185b 50%,#f9a825)'}});

/* ---------- exam questions ---------- */
function examList(g){return (CONTENT.exams||[]).filter(function(x){return x.g===g})}
/* the floor's own questions plus the floor below (more variety); falls back to the whole gate */
function examPool(g,f){var all=examList(g),p=all.filter(function(x){return x.f===f||x.f===f-1});if(p.length<4)p=all.filter(function(x){return Math.abs(x.f-f)<=2});return p.length>=1?p:all}
function examQ(x,lg){var ops=[x.o0,x.o1,x.o2,x.o3],idx=[0,1,2,3].filter(function(i){return ops[i]}),ord=shuffle(idx);
  return {type:'mcq',mc:x,w:{id:x.id},lg:lg,to:lg,o:ord.map(function(i){return ops[i]}),opts:ord,ans:ord.indexOf(x.a)}}
function tnExamEnc(kind,mi){var g=tnCur(),G=TN_GATE[g],f=TN.f,n=kind==='boss'?int(CFG.tnBossQ,1,20,5):int(CFG.tnQ,1,10,3),pool=examPool(g,f);if(!pool.length)return;
  var byId={};examList(g).forEach(function(x){byId[x.id]=x});
  var miss=kind==='boss'?TN.bossMiss:TN.ents[mi].miss,xs=[],seen={};
  miss.forEach(function(id){if(byId[id]&&xs.length<n&&!seen[id]){xs.push(byId[id]);seen[id]=1}});
  /* bosses ask the floor's own (harder) questions first */
  var rest=shuffle(pool.filter(function(x){return !seen[x.id]}));if(kind==='boss')rest.sort(function(a,b){return (a.f===f?1:0)-(b.f===f?1:0)});
  while(xs.length<n&&rest.length){var x=rest.pop();xs.push(x);seen[x.id]=1}while(xs.length<n)xs.push(pick(pool));
  TN.keys={};TN.tg=null;TN.mode='enc';
  TN.enc={kind:kind,mi:mi,qs:xs.map(function(x){return examQ(x,G.exam)}),i:0,ok:0,picked:null,wc:[],ww:[],la:{},rs:[],t0:Date.now()};render()}
function mcqMark(s,q,ok){var lg=q.lg;S.stats[lg][ok?'ok':'ng']++;if(ok)s.ok++;tally(s,q,lg,ok)}
function mcqFb(s,q,last,act){var x=q.mc,right=[x.o0,x.o1,x.o2,x.o3][x.a];
  return '<div class="fb '+(s.lastOk?'ok':'ng')+'" role="status"><div class="grow"><div><b>'+esc(s.lastOk?t('right'):t('wrong'))+'</b></div>'+
   '<div style="margin-top:4px"><small class="mut">'+esc(t('mq_ans'))+':</small> <b'+(q.lg==='zh'?' class="han"':'')+'>'+esc(right)+'</b>'+(hasVoice(q.lg)&&q.lg!=='th'?spkBtn(right,q.lg):'')+'</div>'+
   (x.ex?'<div style="margin-top:2px"><small class="mut">💡 '+esc(t('mq_why'))+':</small> <small>'+esc(x.ex)+'</small></div>':'')+'</div>'+
   '<button class="btn" data-act="'+act+'" id="nextbtn">'+esc(last?t('finish'):t('next'))+'</button></div>'}
function mcqPrompt(q){var G=TN_GATE[tnCur()]||{};return '<div class="prompt"><div class="ask">📝 '+esc(t('mq_ask'))+' '+langTag(q.lg)+(G.tp?' · '+esc(tnTierName(TN.f||1)):'')+'</div><div class="mcq-stem'+(q.lg==='zh'?' han':'')+'">'+esc(q.mc.q).replace(/\n/g,'<br>')+'</div></div>'}
function mcqOpts(q,picked){return '<div class="opts mcq-opts" role="group">'+q.o.map(function(o,i){var cls='opt';if(picked!==null){if(i===q.ans)cls+=' right';else if(i===picked)cls+=' wrong'}
  return '<button class="'+cls+'" data-act="ans" data-id="'+i+'"'+(picked!==null?' disabled':'')+'><span class="mcq-k">'+'กขคง'.charAt(i)+'</span><span'+(q.lg==='zh'?' class="han"':'')+'>'+esc(o)+'</span></button>'}).join('')+'</div>'}

/* ---------- masks (original designs, coloured per gate) ---------- */
var MASK_PAL={
 s:[['#ffffff','#bfe6ff','#2f7fd8','#ffd86b'],['#e9f6ff','#8fd0ff','#1f5fb8','#ffffff'],['#fff8e6','#ffe0a3','#e08a00','#7cc8ff']],
 c:[['#ffebee','#e53935','#7f0000','#ffd54f'],['#fffde7','#ffca28','#b71c1c','#2e7d32'],['#e8f5e9','#43a047','#1b5e20','#ffd54f']],
 d:[['#fff8e1','#ffc107','#8d5a00','#e040fb'],['#f3e5f5','#ab47bc','#4a148c','#ffd54f'],['#fff3e0','#ff7043','#bf360c','#ffd54f']]};
var MASK_N=[
 m('หน้ากากปีกขนนก','Feathered Mask','羽翼面具'),m('หน้ากากยิ้มร่า','Grinning Mask','笑脸面具'),m('หน้ากากเศร้า','Weeping Mask','哭脸面具'),m('หน้ากากเขาคู่','Twin-Horn Mask','双角面具'),
 m('หน้ากากจิ้งจอก','Fox Mask','狐狸面具'),m('หน้ากากสุริยะ','Sun Mask','太阳面具'),m('หน้ากากวิหค','Bird Mask','飞鸟面具'),m('หน้ากากพระจันทร์','Moon Mask','月亮面具')];
var MASK_GN={s:m('แห่งสายลม','of the Wind','之风'),c:m('แห่งมังกรหยก','of the Jade Dragon','之玉龙'),d:m('แห่งเทวะ','of the Devas','之天神')};
function maskBody(k,p){var L=p[0],M=p[1],D=p[2],A=p[3],eyes='',s='';
  var eye=function(x,y,rx,ry,rot){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" transform="rotate('+(rot||0)+' '+x+' '+y+')" fill="#1a1030"/><ellipse class="mk-glow" cx="'+x+'" cy="'+y+'" rx="'+(rx*.55)+'" ry="'+(ry*.55)+'" transform="rotate('+(rot||0)+' '+x+' '+y+')" fill="'+A+'"/>'};
  switch(k){
  case 0: /* feathered half mask */
    s+='<path d="M-6-14C-14-34-30-30-30-18C-24-24-16-22-10-16Z" fill="'+M+'"/><path d="M6-14C14-34 30-30 30-18C24-24 16-22 10-16Z" fill="'+M+'"/><path d="M0-16C-2-34 4-36 2-18Z" fill="'+A+'"/>'+
      '<path d="M-27-6C-27-17-13-19 0-13C13-19 27-17 27-6C27 6 14 10 0 5C-14 10-27 6-27-6Z" fill="'+L+'" stroke="'+D+'" stroke-width="1.6"/>'+
      '<path d="M-22-4C-16 2-8 2 0 0C8 2 16 2 22-4" fill="none" stroke="'+M+'" stroke-width="1.4"/>'+eye(-11,-6,6,3.6,-8)+eye(11,-6,6,3.6,8)+'<circle cx="0" cy="-12" r="2.4" fill="'+A+'"/>';break;
  case 1: /* grinning */
    s+='<path d="M0-30C17-30 24-16 24-2C24 16 12 26 0 26C-12 26-24 16-24-2C-24-16-17-30 0-30Z" fill="'+L+'" stroke="'+D+'" stroke-width="1.6"/>'+
      '<path d="M-17-17Q-11-23-5-17M5-17Q11-23 17-17" fill="none" stroke="'+D+'" stroke-width="2"/>'+eye(-10,-9,5,3.4)+eye(10,-9,5,3.4)+
      '<path d="M-13 6Q0 22 13 6Q0 12-13 6Z" fill="'+D+'"/><circle cx="-16" cy="4" r="3.6" fill="'+M+'" opacity=".7"/><circle cx="16" cy="4" r="3.6" fill="'+M+'" opacity=".7"/>';break;
  case 2: /* weeping */
    s+='<path d="M0-30C17-30 24-16 24-2C24 16 12 26 0 26C-12 26-24 16-24-2C-24-16-17-30 0-30Z" fill="'+M+'" stroke="'+D+'" stroke-width="1.6"/>'+
      '<path d="M-17-13Q-11-19-5-15M5-15Q11-19 17-13" fill="none" stroke="'+D+'" stroke-width="2"/>'+eye(-10,-7,5,3.2,10)+eye(10,-7,5,3.2,-10)+
      '<path d="M-11 16Q0 6 11 16" fill="none" stroke="'+D+'" stroke-width="2.6" stroke-linecap="round"/><path d="M-10-2Q-12 4-10 7Q-8 4-10-2Z" fill="'+A+'"><animate attributeName="opacity" values="1;.2;1" dur="2.4s" repeatCount="indefinite"/></path>';break;
  case 3: /* twin horns */
    s+='<path d="M-14-22C-22-30-24-38-18-40C-18-32-12-28-8-26Z" fill="'+A+'" stroke="'+D+'" stroke-width="1.2"/><path d="M14-22C22-30 24-38 18-40C18-32 12-28 8-26Z" fill="'+A+'" stroke="'+D+'" stroke-width="1.2"/>'+
      '<path d="M0-28C16-28 23-15 22 0C21 14 11 24 0 24C-11 24-21 14-22 0C-23-15-16-28 0-28Z" fill="'+M+'" stroke="'+D+'" stroke-width="1.6"/>'+
      '<path d="M-16-12L-4-8M16-12L4-8" stroke="'+D+'" stroke-width="2.4" stroke-linecap="round"/>'+eye(-10,-3,4.6,3)+eye(10,-3,4.6,3)+
      '<path d="M-10 10Q0 16 10 10" fill="none" stroke="'+D+'" stroke-width="2"/><path d="M-6 11L-4 15L-2 11M2 11L4 15L6 11" fill="'+L+'"/>';break;
  case 4: /* fox */
    s+='<path d="M-20-14L-24-36L-8-22Z" fill="'+M+'" stroke="'+D+'" stroke-width="1.2"/><path d="M20-14L24-36L8-22Z" fill="'+M+'" stroke="'+D+'" stroke-width="1.2"/>'+
      '<path d="M0-24C14-24 22-14 22-4C22 6 8 22 0 26C-8 22-22 6-22-4C-22-14-14-24 0-24Z" fill="'+L+'" stroke="'+D+'" stroke-width="1.6"/>'+
      '<path d="M-18-6Q-10-12-4-6M4-6Q10-12 18-6" fill="none" stroke="'+M+'" stroke-width="3"/>'+eye(-10,-4,4.6,2.6,-14)+eye(10,-4,4.6,2.6,14)+
      '<circle cx="0" cy="17" r="2.6" fill="'+D+'"/><path d="M0-22L-3-14L0-10L3-14Z" fill="'+A+'"/>';break;
  case 5: /* sun */
    for(var r=0;r<12;r++){var an=r*30;s+='<path d="M0-38L4-27L-4-27Z" fill="'+(r%2?A:M)+'" transform="rotate('+an+')"/>'}
    s+='<circle r="24" fill="'+L+'" stroke="'+D+'" stroke-width="1.6"/><circle r="19" fill="none" stroke="'+M+'" stroke-width="1.2" stroke-dasharray="3 3"/>'+eye(-8,-4,4.4,3)+eye(8,-4,4.4,3)+'<path d="M-8 8Q0 14 8 8" fill="none" stroke="'+D+'" stroke-width="2"/>';break;
  case 6: /* bird */
    s+='<path d="M-22-10C-30-20-28-30-18-30C-14-22-10-20-6-20Z" fill="'+M+'"/><path d="M22-10C30-20 28-30 18-30C14-22 10-20 6-20Z" fill="'+M+'"/>'+
      '<path d="M0-26C14-26 22-16 22-4C22 4 14 8 0 8C-14 8-22 4-22-4C-22-16-14-26 0-26Z" fill="'+L+'" stroke="'+D+'" stroke-width="1.6"/>'+eye(-9,-10,5,3.4)+eye(9,-10,5,3.4)+
      '<path d="M-6 0L0 26L6 0Z" fill="'+A+'" stroke="'+D+'" stroke-width="1.4"/><path d="M-3 4L0 16L3 4" fill="none" stroke="'+D+'" stroke-width="1"/>';break;
  default: /* moon */
    s+='<path d="M4-30C-14-30-24-14-24 0C-24 16-10 28 6 28C-6 22-12 12-12 0C-12-14-4-24 4-30Z" fill="'+M+'" stroke="'+D+'" stroke-width="1.4"/>'+
      '<path d="M0-28C15-28 24-14 24 0C24 15 13 26 0 26C-6 26-10 22-10 22C2 16 6 8 6 0C6-10 2-20-4-26Z" fill="'+L+'" stroke="'+D+'" stroke-width="1.6"/>'+eye(8,-6,4.6,3)+
      '<path d="M4 10Q10 14 16 9" fill="none" stroke="'+D+'" stroke-width="2"/><circle cx="16" cy="-18" r="1.6" fill="'+A+'"/><circle cx="20" cy="4" r="1.2" fill="'+A+'"/>'}
  return s}
/* gate decoration: clouds & wings (sky), tassel & mark (China), golden spire crown (deva) */
function maskDeco(g,p,big){var A=p[3],D=p[2];
  if(g==='s')return '<g opacity=".9"><path d="M-34 10C-38 6-34 0-28 2C-26-4-18-4-17 2C-12 2-12 9-17 10Z" fill="#fff"/><path d="M34 14C38 10 34 4 28 6C26 0 18 0 17 6C12 6 12 13 17 14Z" fill="#fff"/></g>';
  if(g==='c')return '<path d="M0 24V31" stroke="'+D+'" stroke-width="1.4"/><circle cx="0" cy="32" r="2.4" fill="'+A+'"/><path d="M-2 34L-3 40M0 34V41M2 34L3 40" stroke="#e53935" stroke-width="1.2"/><path d="M0-25L-2.4-20L0-17L2.4-20Z" fill="#e53935"/>';
  return '<path d="M-12-26L-8-34L-4-28L0-44L4-28L8-34L12-26Z" fill="#ffd54f" stroke="#8d5a00" stroke-width="1.1"/><circle cx="0" cy="-30" r="2" fill="'+A+'"/><path d="M-14-26H14" stroke="#8d5a00" stroke-width="1.6"/>'}
function maskSvg(k,g,v,big){var pal=(MASK_PAL[g]||MASK_PAL.s)[v%3],kk=k%8,id='mk'+g+kk+v+(big?'b':'');
  var aura=big?'<circle r="36" fill="url(#'+id+'a)"><animate attributeName="r" values="33;38;33" dur="2.6s" repeatCount="indefinite"/></circle>':'<ellipse cx="0" cy="32" rx="16" ry="3" fill="#000" opacity=".18"/>';
  return '<svg viewBox="-40 -46 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="mk"><defs><radialGradient id="'+id+'a"><stop offset="0" stop-color="'+pal[3]+'" stop-opacity=".55"/><stop offset="1" stop-color="'+pal[3]+'" stop-opacity="0"/></radialGradient></defs>'+aura+
   '<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -2.5;0 0" dur="'+(2.2+(k%5)*.3)+'s" repeatCount="indefinite"/>'+maskBody(kk,pal)+maskDeco(g,pal,big)+'</g></svg>'}
function tnMaskGate(){var G=TN_GATE[tnCur()];return G&&G.mask}
function tnMobSvg(e){var g=tnMaskGate();if(g)return maskSvg(e.mk||0,g,Math.floor((e.mk||0)/8));return tnPetSvg(ITEM[e.id])}
function tnMobName(e){var g=tnMaskGate();if(g)return tx(MASK_N[(e.mk||0)%8]);var it=ITEM[e.id];return it?tx(it.names):''}
function tnBossSvg(f){var g=tnMaskGate();if(g)return maskSvg((f*3+1)%8,g,f%3,true);return tnPetSvg(tnBossPet(f))}
function tnBossName(f){var g=tnMaskGate();if(g)return tx(MASK_N[(f*3+1)%8])+' '+tx(MASK_GN[g]);var bp=TN.boss&&ITEM[TN.boss.id]||tnBossPet(f);return bp?tx(bp.names):''}
