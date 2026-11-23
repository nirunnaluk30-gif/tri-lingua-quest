import json
A=json.load(open('/home/claude/skillpv/avatars.json'));CSS=open('/home/claude/skillpv/avcss.txt').read()
html=r'''<!DOCTYPE html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ตัวละครและสกิลใหม่</title>
<link href="https://fonts.googleapis.com/css2?family=Mitr:wght@400;600&family=Sarabun:wght@400;600&display=swap" rel="stylesheet">
<style>
/* VOICE: game feature reveal for the teacher, lively but readable
   IDEA: a battle-arena test room: press a skill, watch it land on a boss
   PICTURE: the live arena with the real hero and the awakened dragon king
   COLOUR and TYPE: night arena violet, class colours gold / violet / green as accents; Mitr + Sarabun
   LAYOUT: arena first, then before/after heroes, then the three skill trees, then rules and questions */
:root{color-scheme:light dark;--bg:light-dark(#f3f0fa,#110c1c);--ink:light-dark(#1c1729,#eee8f8);--mut:light-dark(#5d5670,#b5abc8);--card:light-dark(#fff,#1b1428);--line:light-dark(#e1dbee,#2e2540);--sw:#e0a92a;--mg:#8e5cff;--ar:#2fbf6a}
:root[data-theme=light]{color-scheme:light}:root[data-theme=dark]{color-scheme:dark}
*{box-sizing:border-box;min-width:0}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 Sarabun,system-ui,sans-serif;overflow-x:clip}
h1,h2,h3{font-family:Mitr,Sarabun,sans-serif;margin:0;line-height:1.12;text-wrap:balance}
.band{padding:clamp(22px,4vw,52px) max(5vw,16px)}.wrap{max-width:1180px;margin:0 auto}
header.band{background:linear-gradient(120deg,#160c2a,#3b1466 60%,#5a1a6a);color:#fff}
header h1{font-size:clamp(30px,4.6vw,48px)}header p{color:#e5d8f6;max-width:66ch;margin:.5em 0 0}
.arena{position:relative;margin-top:22px;height:clamp(300px,42vw,420px);border-radius:20px;overflow:hidden;background:radial-gradient(ellipse at 70% 30%,#5a1a6a 0,#22113a 55%,#0c0716 100%);box-shadow:0 20px 50px #0007}
.arena::after{content:"";position:absolute;left:0;right:0;bottom:0;height:22%;background:linear-gradient(#0000,#000a)}
.hero{position:absolute;left:6%;bottom:6%;width:clamp(130px,22vw,210px);z-index:3;transition:transform .15s}
.boss{position:absolute;right:6%;bottom:8%;height:72%;z-index:2}.boss img{height:100%;width:auto;filter:drop-shadow(0 10px 18px #000a)}
.boss.hit img{animation:bhit .45s}@keyframes bhit{0%{filter:brightness(3) saturate(0)}30%{transform:translateX(10px)}60%{transform:translateX(-6px)}100%{filter:none;transform:none}}
.shake{animation:ash .4s}@keyframes ash{20%{transform:translate(-7px,3px)}40%{transform:translate(6px,-4px)}60%{transform:translate(-4px,2px)}80%{transform:translate(3px,-1px)}}
.fx{position:absolute;inset:0;pointer-events:none;z-index:5}
.dmg{position:absolute;right:18%;top:22%;font:900 clamp(30px,5vw,46px) Mitr,sans-serif;color:#fff;text-shadow:0 3px 0 #000,0 0 18px var(--c);animation:dmg 1s ease-out forwards;z-index:7}
@keyframes dmg{0%{transform:translateY(10px) scale(.6);opacity:0}20%{transform:scale(1.25);opacity:1}100%{transform:translateY(-50px);opacity:0}}
.cut{position:absolute;left:-10%;right:-10%;top:30%;height:30%;transform:skewY(-6deg);background:linear-gradient(90deg,#0000,var(--c) 18%,var(--c) 82%,#0000);display:flex;align-items:center;justify-content:center;gap:18px;animation:cut 1.1s cubic-bezier(.2,.8,.2,1) forwards;z-index:8;color:#fff}
.cut b{font:600 clamp(22px,4vw,40px) Mitr,sans-serif;text-shadow:0 3px 0 #0006}.cut small{display:block;font-size:14px;opacity:.9}
@keyframes cut{0%{transform:translateX(-100%) skewY(-6deg);opacity:1}22%,78%{transform:translateX(0) skewY(-6deg);opacity:1}100%{transform:translateX(100%) skewY(-6deg);opacity:0}}
.flash{position:absolute;inset:0;background:#fff;animation:flash .35s forwards;z-index:6}@keyframes flash{0%{opacity:.85}100%{opacity:0}}
.controls{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
.tabs{display:flex;gap:8px;flex-wrap:wrap}.tab,.sk{font:600 15px Mitr,sans-serif;border-radius:12px;border:2px solid var(--line);background:var(--card);color:var(--ink);padding:10px 16px;min-height:44px;cursor:pointer}
.tab[aria-pressed=true]{border-color:var(--c);background:var(--c);color:#fff}.sk{border-color:var(--c)}.sk:focus-visible,.tab:focus-visible{outline:3px solid #fff;outline-offset:2px}
.sk small{display:block;font:400 12px Sarabun,sans-serif;color:var(--mut)}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,330px),1fr));gap:18px}
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:18px}
.ba{display:grid;grid-template-columns:1fr 1fr;gap:6px;align-items:end;text-align:center}.ba div{background:linear-gradient(#ebe6f7,#d9d1ef);border-radius:12px;padding:6px}
.ba span{font-size:13px;color:var(--mut)}
.tree{display:grid;grid-template-columns:70px 1fr 1fr;gap:8px;align-items:stretch;margin-top:12px}
.lv{font:600 13px Mitr,sans-serif;color:var(--mut);display:flex;align-items:center}
.node{border-radius:12px;padding:8px 10px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 10%,var(--card));font-size:14px;line-height:1.35}
.node b{display:block;font-family:Mitr,sans-serif;font-weight:600}.node.p{border-style:dashed;background:transparent}.node.span{grid-column:2/4;text-align:center}
.bh{font:600 15px Mitr,sans-serif;text-align:center;color:var(--c)}
ul{margin:.3em 0;padding-left:1.2em}li{margin:.2em 0}.mut{color:var(--mut);font-size:14px}
.q{border:2px solid var(--sw)}
@media (prefers-reduced-motion:reduce){.shake,.boss.hit img,.flash{animation:none!important}}
__AVCSS__
</style></head><body>
<header class="band"><div class="wrap">
<h1>ตัวละครสวยขึ้น + ต้นไม้สกิล + เอฟเฟกต์สกิล</h1>
<p>ตัวอย่างให้ครูดูก่อน ยังไม่ได้ติดตั้งในเกม กดปุ่มสกิลด้านล่างเพื่อดูเอฟเฟกต์บนบอสจริง ตัวละครในสนามใช้ร่างแบบใหม่ (มีแสงเงา) ที่วาดจากโค้ดเกมจริง</p>
<div class="arena" id="arena"><div class="hero" id="hero"></div><div class="boss" id="boss"><img src="boss.webp" alt="ราชามังกรรอยแยก ร่างตื่น"></div><div class="fx" id="fx"></div></div>
<div class="controls"><div class="tabs" id="tabs"></div></div><div class="controls" id="skills"></div>
</div></header>

<section class="band"><div class="wrap grid2">
<div class="card"><h2 style="font-size:26px">ตัวละคร: ร่างเดิม แต่มีมิติขึ้น</h2>
<div class="ba" id="ba" style="margin-top:12px"></div>
<ul style="margin-top:12px"><li>เงาข้างใบหน้าและเงาใต้ผมหน้าม้า มีจมูกเล็ก ๆ</li><li>ขอบแสงด้านที่โดนไฟ เงาอีกด้าน ทำให้ตัวดูกลม</li><li>แสงเรืองรอบตัวตามอาชีพ: ทอง (นักดาบ) ม่วง (นักเวท) เขียว (นักธนู)</li><li>ชุดทั้ง 300 กว่าชิ้นใส่ได้เหมือนเดิม ได้แสงเงาไปด้วยโดยอัตโนมัติ</li><li>ใช้เฉพาะภาพใหญ่ (หน้าหมู่บ้าน โปรไฟล์ ฉากต่อสู้) ลานเมืองยังเบาเหมือนเดิม มือถือไม่ช้าลง</li></ul></div>
<div class="card"><h2 style="font-size:26px">เอฟเฟกต์สกิล</h2>
<ul style="margin-top:10px"><li><b>นักดาบ:</b> รอยฟันสีทอง ประกายไฟ บอสสะดุ้ง</li><li><b>นักเวท:</b> วงเวทใต้บอส อุกกาบาต สายฟ้า</li><li><b>นักธนู:</b> ลูกศรพุ่ง เป้าล็อก ฝนธนู</li><li><b>ท่าไม้ตาย:</b> แถบชื่อสกิล 3 ภาษาพาดจอ แล้วจอสั่นแรง</li><li>ความแรงของเอฟเฟกต์แบ่ง 3 ระดับ (เบา กลาง หนัก) ตามแนวทาง game-feel</li><li>คนที่ตั้ง "ลดการเคลื่อนไหว" จะไม่มีจอสั่นและแสงวาบ</li></ul></div>
</div></section>

<section class="band" style="padding-top:0"><div class="wrap"><h2 style="font-size:30px">ต้นไม้สกิล</h2>
<p class="mut">ได้ 1 แต้มสกิลทุก 5 เลเวล (เลเวล 50 ได้ 10 แต้ม) แต่ละชั้นเลือกได้ 1 ฝั่ง นักเรียนแต่ละคนจึงเล่นต่างกัน สกิลเดิม 9 ตัวยังอยู่ครบในต้นไม้</p>
<div class="grid2" id="trees" style="margin-top:14px"></div></div></section>

<section class="band" style="padding-top:0"><div class="wrap grid2">
<div class="card"><h3 style="font-size:22px">กติกาที่ใช้</h3><ul>
<li>ดาเมจโบนัสจากสกิลรวมกันไม่เกิน 14 ต่อการตีบอส 1 รอบ (เท่าเดิม) ระบบตรวจของครูเช็กได้</li>
<li>สกิลยังต้องตอบถูกเองเสมอ สกิลช่วยตัดตัวเลือกหรือกันพลาดเท่านั้น</li>
<li>แต้มสกิลคำนวณจากเลเวลจริง ปลอมไม่ได้</li><li>รีเซ็ตต้นไม้ได้สัปดาห์ละครั้ง ค่ารีเซ็ต 500 เหรียญ</li>
<li>คนที่เคยอัปสกิลด้วยเหรียญไว้แล้ว ได้เหรียญคืนตามที่จ่ายจริง</li></ul></div>
<div class="card q"><h3 style="font-size:22px">ครูช่วยตัดสิน 3 ข้อ</h3><ul>
<li>หน้าตาตัวละครแบบใหม่ใช้ได้ไหม</li><li>เอฟเฟกต์แรงพอดีไหม (โดยเฉพาะท่าไม้ตาย)</li><li>ต้นไม้สกิลแบบ 2 ฝั่ง และค่ารีเซ็ต 500 เหรียญ โอเคไหม</li></ul>
<p class="mut">ตัวเลขในต้นไม้เป็นค่าเริ่มต้นที่เสนอ ปรับได้ก่อนติดตั้ง</p></div>
</div></section>
<script>
{
const AV=__AV__;
const C={sword:'#e0a92a',mage:'#8e5cff',archer:'#2fbf6a'};
const CN={sword:'นักดาบ',mage:'นักเวท',archer:'นักธนู'};
const SK={
 sword:[{id:'s1',n:'ฟันสองจังหวะ',t:'โจมตี · Lv5',d:2},{id:'s2',n:'โล่ใจกล้า',t:'ป้องกัน · Lv15'},{id:'s3',n:'พายุดาบราชันย์',t:'ท่าไม้ตาย · Lv30',d:6,ult:['พายุดาบราชันย์','Royal Blade Storm','王者剑暴']}],
 mage:[{id:'m1',n:'ตาทิพย์',t:'ควบคุม · Lv5'},{id:'m2',n:'อุกกาบาตอาร์เคน',t:'โจมตี · Lv15',d:3},{id:'m3',n:'สายฟ้าพิโรธ',t:'ท่าไม้ตาย · Lv30',d:6,ult:['สายฟ้าพิโรธ','Wrath of Thunder','雷霆之怒']}],
 archer:[{id:'a1',n:'ยิงแม่นยำ',t:'ควบคุม · Lv5'},{id:'a2',n:'ธนูต่อเนื่อง',t:'โจมตี · Lv15',d:3},{id:'a3',n:'ฝนธนูมังกร',t:'ท่าไม้ตาย · Lv30',d:5,ult:['ฝนธนูมังกร','Dragon Arrow Rain','龙之箭雨']}]};
const TREE={
 sword:{a:'ดาบพิฆาต',b:'อัศวินพิทักษ์',rows:[['5','span','ฟันสองจังหวะ','ตอบถูกข้อถัดไป ดาเมจ +1 ถึง +3'],['10','p','คมดาบ (แต้ม)','ดาเมจสกิลโจมตี +1','p','กายเหล็ก (แต้ม)','โล่กันพลาดได้ +1 ครั้ง'],['15','','ฟันทะลวง (ใหม่)','2 ข้อถัดไป ถ้าตอบถูก ดาเมจ +2','','โล่ใจกล้า','ตอบผิดได้ 1 ครั้ง + ตัดตัวเลือกผิด'],['20–25','p','จังหวะนักรบ (แต้ม)','ฟันสองจังหวะชาร์จเร็วขึ้น','p','ใจนิ่ง (แต้ม)','ตัดตัวเลือกผิดเพิ่ม 1'],['30','','พายุดาบราชันย์','3–4 ข้อติด ดาเมจ +2','','ป้อมปราการทองคำ (ใหม่)','กันพลาด 2 ครั้ง ทั้งรอบ'],['35–50','span','เสริมพลัง (แต้ม)','เพิ่มเลเวลสกิลในฝั่งที่เลือก']]},
 mage:{a:'อาร์เคนพิโรธ',b:'ปราชญ์ตาทิพย์',rows:[['5','span','ตาทิพย์','ตัดตัวเลือกผิด 1–2 ตัว'],['10','p','เวทแรง (แต้ม)','ดาเมจสกิลโจมตี +1','p','สมาธิ (แต้ม)','ตาทิพย์ใช้ได้ 2 ข้อ'],['15','','อุกกาบาตอาร์เคน','ตอบถูกข้อถัดไป ดาเมจ +2 ถึง +4','','กระจกความจำ (ใหม่)','เห็นตัวอักษรแรกของคำตอบ'],['20–25','p','ไฟเวท (แต้ม)','อุกกาบาตแรงขึ้น','p','ปัญญา (แต้ม)','คำใบ้ชัดขึ้น'],['30','','สายฟ้าพิโรธ','2–3 ข้อติด ดาเมจ +2 ถึง +3','','ห้วงเวลาหยุดนิ่ง (ใหม่)','เวลาตอบเพิ่ม + ตัดตัวเลือกผิด 2'],['35–50','span','เสริมพลัง (แต้ม)','เพิ่มเลเวลสกิลในฝั่งที่เลือก']]},
 archer:{a:'ฝนธนู',b:'พรานเหยี่ยว',rows:[['5','span','ยิงแม่นยำ','คำใบ้ + ตัดตัวเลือกผิด'],['10','p','หัวศรคม (แต้ม)','ดาเมจสกิลโจมตี +1','p','ตาเหยี่ยว (แต้ม)','ยิงแม่นยำใช้ได้ 2 ข้อ'],['15','','ธนูต่อเนื่อง','ถูก 3 ข้อติด ได้โบนัส +2 ถึง +4','','ลูกศรนำทาง (ใหม่)','ชี้ตัวเลือกที่ถูกครึ่งหนึ่ง (เหลือ 2 ตัว)'],['20–25','p','สายลม (แต้ม)','คอมโบนับง่ายขึ้น','p','ซุ่มรอ (แต้ม)','คำใบ้ชัดขึ้น'],['30','','ฝนธนูมังกร','ตอบถูกข้อถัดไป ดาเมจ +3 ถึง +5','','เหยี่ยวพิทักษ์ (ใหม่)','กันพลาด 1 ครั้ง + คำใบ้ทุกข้อ 2 ข้อ'],['35–50','span','เสริมพลัง (แต้ม)','เพิ่มเลเวลสกิลในฝั่งที่เลือก']]}};
let cur='sword';const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function el(h){const d=document.createElement('div');d.innerHTML=h;return d.firstElementChild}
function add(h,ms){const e=el(h);$('fx').appendChild(e);setTimeout(()=>e.remove(),ms||1200);return e}
function hit(d,tier){const b=$('boss');b.classList.remove('hit');void b.offsetWidth;b.classList.add('hit');if(d)add(`<div class="dmg" style="--c:${C[cur]}">-${d}</div>`,1100);
 if(!reduce&&tier!=='small'){const a=$('arena');a.classList.remove('shake');void a.offsetWidth;a.classList.add('shake');if(tier==='large')add('<div class="flash"></div>',400)}}
function svg(inner,ms){return add(`<svg viewBox="0 0 800 400" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${inner}</svg>`,ms)}
function slash(delay,y,rot,col){setTimeout(()=>svg(`<path d="M480 ${y-80} Q600 ${y} 720 ${y+60}" stroke="${col}" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="320" stroke-dashoffset="320" transform="rotate(${rot} 600 ${y})"><animate attributeName="stroke-dashoffset" from="320" to="0" dur=".18s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin=".25s" dur=".3s" fill="freeze"/></path><path d="M480 ${y-80} Q600 ${y} 720 ${y+60}" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="320" stroke-dashoffset="320" transform="rotate(${rot} 600 ${y})"><animate attributeName="stroke-dashoffset" from="320" to="0" dur=".18s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" begin=".25s" dur=".3s" fill="freeze"/></path>`+sparks(600,y,col),700),delay)}
function sparks(x,y,col){let s='';for(let i=0;i<10;i++){const a=i*36*Math.PI/180,dx=Math.cos(a)*70,dy=Math.sin(a)*70;s+=`<circle cx="${x}" cy="${y}" r="4" fill="${col}"><animate attributeName="cx" to="${x+dx}" dur=".45s" fill="freeze"/><animate attributeName="cy" to="${y+dy}" dur=".45s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur=".45s" fill="freeze"/></circle>`}return s}
function cutin(u){add(`<div class="cut" style="--c:${C[cur]}">${AVS(cur,'height:150%;width:auto')}<div><b>${u[0]}</b><small>${u[1]} · ${u[2]}</small></div></div>`,1150)}
function AVS(k,st){return `<span style="display:block;${st};aspect-ratio:200/240">${AV[k]}</span>`}
function atk(){const h=$('hero');h.style.transform='translateX(14px) scale(1.04)';setTimeout(()=>h.style.transform='',180)}
const FX={
 s1(s){atk();slash(0,200,-10,'#ffd76a');slash(220,210,14,'#ffd76a');setTimeout(()=>hit(s.d,'medium'),260)},
 s2(){svg(`<g transform="translate(150 230)"><polygon points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60" fill="#ffd76a33" stroke="#ffd76a" stroke-width="5"><animateTransform attributeName="transform" type="scale" from=".3" to="1" dur=".3s" fill="freeze"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.2;.8;1" dur="1.4s" fill="freeze"/></polygon></g>`,1400)},
 s3(s){cutin(s.ult);setTimeout(()=>{atk();[0,140,280,420].forEach((t,i)=>slash(t,150+i*40,[-14,12,-4,18][i],i%2?'#fff1b0':'#ffc83a'));setTimeout(()=>hit(s.d,'large'),480)},1000)},
 m1(){svg(`<g transform="translate(400 120)" fill="none" stroke="#c9a8ff" stroke-width="5"><path d="M-70 0q70-60 140 0q-70 60-140 0z"/><circle r="22" fill="#8e5cff"/><animate attributeName="opacity" values="0;1;1;0" dur="1.3s" fill="freeze"/></g>`,1300)},
 m2(s){svg(`<g transform="translate(600 330)"><ellipse rx="130" ry="26" fill="none" stroke="#b48cff" stroke-width="4" stroke-dasharray="14 8"><animateTransform attributeName="transform" type="rotate" from="0" to="180" dur="1s"/><animate attributeName="opacity" values="0;1;1;0" dur="1.1s" fill="freeze"/></ellipse></g><circle r="34" fill="#c9a8ff" cx="760" cy="-40"><animate attributeName="cx" to="600" begin=".35s" dur=".35s" fill="freeze"/><animate attributeName="cy" to="230" begin=".35s" dur=".35s" fill="freeze"/><animate attributeName="r" to="120" begin=".7s" dur=".25s" fill="freeze"/><animate attributeName="opacity" to="0" begin=".7s" dur=".35s" fill="freeze"/></circle>`,1200);setTimeout(()=>hit(s.d,'medium'),720)},
 m3(s){cutin(s.ult);setTimeout(()=>{const bolt=(x,t)=>`<path d="M${x} 0 l-30 120 h40 l-36 130 h44 l-50 150" stroke="#fff" stroke-width="7" fill="none" opacity="0"><animate attributeName="opacity" values="0;1;0;1;0" begin="${t}s" dur=".4s" fill="freeze"/></path><path d="M${x} 0 l-30 120 h40 l-36 130 h44 l-50 150" stroke="#a77bff" stroke-width="18" fill="none" opacity="0"><animate attributeName="opacity" values="0;.6;0" begin="${t}s" dur=".4s" fill="freeze"/></path>`;svg(bolt(560,0)+bolt(640,.18)+bolt(600,.36),1000);setTimeout(()=>hit(s.d,'large'),420)},1000)},
 a1(){svg(`<g transform="translate(600 210)" stroke="#7dffb0" stroke-width="4" fill="none"><circle r="70"><animate attributeName="r" from="140" to="50" dur=".4s" fill="freeze"/></circle><path d="M-90 0h50M40 0h50M0 -90v50M0 40v50"/><animate attributeName="opacity" values="0;1;1;0" dur="1.2s" fill="freeze"/></g>`,1200)},
 a2(s){atk();[0,120,240].forEach((t,i)=>setTimeout(()=>svg(`<g><line x1="200" y1="${190+i*20}" x2="260" y2="${190+i*20}" stroke="#d6ffe6" stroke-width="5" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" from="0 0" to="360 0" dur=".25s" fill="freeze"/><animate attributeName="opacity" values="1;1;0" dur=".35s" fill="freeze"/></line></g>`+sparks(600,200+i*20,'#7dffb0'),600),t));setTimeout(()=>hit(s.d,'medium'),380)},
 a3(s){cutin(s.ult);setTimeout(()=>{let r='';for(let i=0;i<18;i++){const x=480+Math.random()*260,t=(Math.random()*.5).toFixed(2);r+=`<line x1="${x}" y1="-40" x2="${x-14}" y2="10" stroke="#9dffc4" stroke-width="4" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" from="0 0" to="-40 320" begin="${t}s" dur=".35s" fill="freeze"/><animate attributeName="opacity" values="1;1;0" begin="${t}s" dur=".45s" fill="freeze"/></line>`}svg(r,1300);setTimeout(()=>hit(s.d,'large'),700)},1000)}};
function draw(){document.documentElement.style.setProperty('--c',C[cur]);$('hero').innerHTML=AV[cur];
 $('tabs').innerHTML=Object.keys(C).map(k=>`<button class="tab" style="--c:${C[k]}" aria-pressed="${k===cur}" data-k="${k}">${CN[k]}</button>`).join('');
 $('skills').innerHTML=SK[cur].map(s=>`<button class="sk" style="--c:${C[cur]}" data-s="${s.id}">${s.n}<small>${s.t}</small></button>`).join('')}
$('tabs').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b){cur=b.dataset.k;draw()}});
$('skills').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;const s=SK[cur].find(x=>x.id===b.dataset.s);FX[s.id](s)});
$('ba').innerHTML=['mage','sword'].map(k=>`<div>${AV[k+'_old']}<span>ตอนนี้</span></div><div>${AV[k]}<span>แบบใหม่</span></div>`).join('');
$('trees').innerHTML=Object.keys(TREE).map(k=>{const T=TREE[k];return `<div class="card" style="--c:${C[k]}"><h3 style="font-size:22px;color:${C[k]}">${CN[k]}</h3><div class="tree"><span></span><div class="bh">${T.a}</div><div class="bh">${T.b}</div>${T.rows.map(r=>`<div class="lv">Lv ${r[0]}</div>`+(r[1]==='span'?`<div class="node span"><b>${r[2]}</b>${r[3]}</div>`:`<div class="node ${r[1]}"><b>${r[2]}</b>${r[3]}</div><div class="node ${r[4]}"><b>${r[5]}</b>${r[6]}</div>`)).join('')}</div></div>`}).join('');
draw();
}
</script></body></html>'''
html=html.replace('__AVCSS__',CSS).replace('__AV__',json.dumps(A,ensure_ascii=False))
open('/home/claude/skillpv/index.html','w').write(html);print(len(html))
