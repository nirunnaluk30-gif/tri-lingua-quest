/* =====================================================================
   GUARDIAN SPIRITS (2026-11-23) — six awakened bosses that float beside
   the player. Not wings, not pets: their own kind. Only from top-ups:
   VIP 3 (฿100) to VIP 8 (฿1,200), one spirit per level, lower ones stay
   unlocked. In raids every right answer lets the spirit hit the boss for
   gdDmg (teacher setting, default 20). The teacher's check counts the
   real top-ups before trusting that damage (ledger.js, 'gd'/'gdvip').
   ===================================================================== */
var GD_LIST=[
 {k:'gd3',lv:3,mon:'boss_aw_cave_beetle',n:m('ภูตด้วงเขาแห่งถ้ำ','Cave Beetle Spirit','洞穴甲虫守护灵')},
 {k:'gd4',lv:4,mon:'boss_aw_drowned_captain',n:m('ภูตกัปตันจมน้ำ','Drowned Captain Spirit','溺亡船长守护灵')},
 {k:'gd5',lv:5,mon:'boss_aw_shellguard_warlord',n:m('ภูตจอมทัพเกราะเปลือก','Shellguard Warlord Spirit','甲壳战王守护灵')},
 {k:'gd6',lv:6,mon:'boss_aw_drill_colossus',n:m('ภูตยักษ์สว่านเหล็ก','Drill Colossus Spirit','钻头巨像守护灵')},
 {k:'gd7',lv:7,mon:'boss_aw_brood_empress',n:m('ภูตจักรพรรดินีฝูงแมลง','Brood Empress Spirit','虫群女皇守护灵')},
 {k:'gd8',lv:8,mon:'boss_aw_rift_dragon_king',n:m('ภูตราชามังกรรอยแยก','Rift Dragon King Spirit','裂隙龙王守护灵')}];
var GD={};GD_LIST.forEach(function(g){GD[g.k]=g});
Object.assign(L,{
 gd_title:m('🛡️ ภูตพิทักษ์','🛡️ Guardian spirits','🛡️ 守护灵'),
 gd_desc:m('ลอยอยู่ข้างตัวคุณ ไม่ใช่ปีกหรือสัตว์เลี้ยง ได้จากการเติมเงินเท่านั้น (VIP 3 ขึ้นไป) ตีบอสเมืองพร้อมคุณ ตอบถูกทุกข้อภูตลดเลือดบอสเพิ่ม {n}','Floats beside you: not wings, not a pet. Only from top-ups (VIP 3 and up). In boss raids every right answer lets it hit for {n} more.','漂浮在你身旁:不是翅膀也不是宠物。仅通过充值获得(VIP 3 以上)。首领战中每答对一题,守护灵额外造成 {n} 点伤害。'),
 gd_follow:m('ให้ติดตาม','Follow me','跟随'),gd_on:m('กำลังติดตาม','Following','跟随中'),gd_hide:m('ไม่แสดงภูต','Hide spirit','隐藏守护灵'),
 gd_need:m('ปลดล็อกที่ VIP {lv} (เติมสะสม ฿{b})','Unlocks at VIP {lv} (฿{b} in total)','VIP {lv} 解锁(累计 ฿{b})'),
 gd_off:m('ครูปิดภูตพิทักษ์ไว้ชั่วคราว','The teacher has turned guardian spirits off for now','老师暂时关闭了守护灵'),
 gd_hidden:m('ซ่อนภูตไว้ ภูตจะไม่ช่วยตีบอส','Spirit hidden: it will not help in raids','守护灵已隐藏,不会协助首领战')});
if(typeof CFG_LABELS!=='undefined')Object.assign(CFG_LABELS,{gdOn:m('เปิดภูตพิทักษ์ (1 = เปิด, 0 = ปิด)','Guardian spirits on (1 = on, 0 = off)','开启守护灵(1 开 0 关)'),gdDmg:m('ภูตพิทักษ์ลดเลือดบอสต่อข้อที่ตอบถูก','Guardian damage per right answer','守护灵每答对一题的伤害')});
function gdOn(){return CFG.gdOn!==0&&CFG.vipOn!==0}
function gdHas(g,st){return gdOn()&&vipLevel(st||S)>=g.lv}
/* the spirit following the player: the chosen one if unlocked, else the strongest unlocked; 'none' hides it */
function gdCur(){if(!gdOn()||!S.created)return null;var c=S.set.gd;if(c==='none')return null;if(GD[c]&&gdHas(GD[c]))return GD[c];var best=null;GD_LIST.forEach(function(g){if(gdHas(g))best=g});return best}
function gdSvg(g,inside){var M=MON[g.mon];if(!M)return '';var h=inside?74:104,w=h*M.w/M.h;if(w>h*1.1){h=h*h*1.1/w;w=h*M.w/M.h}
  return {w:w,h:h,img:'<image href="'+monSrc(g.mon)+'" width="'+f1(w)+'" height="'+f1(h)+'" preserveAspectRatio="xMidYMax meet"/>'}}
(function(){
  var AV=avatar;avatar=function(st,opt){var s=AV(st,opt);opt=opt||{};if(opt.items||opt.noGd||!st)return s;
    var g=st===S?gdCur():(gdOn()&&GD[st.gd]?GD[st.gd]:null);if(!g)return s;var inside=!!opt.petFront,o=gdSvg(g,inside);if(!o)return s;
    var mm=s.match(/viewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/);if(!mm)return s;var vx=+mm[1],vy=+mm[2],vw=+mm[3],vh=+mm[4],R=vx+vw,GR=inside?0:Math.round(o.w*0.62);
    var cx=inside?R-o.w/2-2:R+GR-o.w/2,foot=inside?150:172;
    var gsvg='<g class="av-gd" transform="translate('+f1(cx-o.w/2)+' '+f1(foot-o.h)+')"><ellipse cx="'+f1(o.w/2)+'" cy="'+f1(o.h+10)+'" rx="'+f1(o.w*0.28)+'" ry="4" fill="#7a4dff" opacity=".22"/><g class="av-gdb">'+o.img+'</g></g>';
    if(GR)s=s.replace(mm[0],'viewBox="'+vx+' '+vy+' '+f1(vw+GR)+' '+vh+'"');
    return s.replace(/<\/svg>$/,gsvg+'</svg>')};
  var ML=myLook;myLook=function(){var o=ML(),g=gdCur();if(g)o.gd=g.k;return o};
  var VS=vipSection;vipSection=function(){var h=VS();if(!vipOn())return h;return h+gdPanel()};
  var VA=vipAct;vipAct=function(a,id){if(a==='gdset'){if(id==='none'||(GD[id]&&gdHas(GD[id]))){S.set.gd=id;save();if(typeof push==='function')push();render()}return true}return VA(a,id)};
})();
function gdPanel(){var cur=gdCur(),vl=vipLevel();
  var h='<section class="panel stack gd-panel"><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px"><b>'+esc(t('gd_title'))+'</b>'+(cur||S.set.gd==='none'?'<button class="mini'+(S.set.gd==='none'?' on':'')+'" data-act="gdset" data-id="none">'+esc(t('gd_hide'))+'</button>':'')+'</div>'+
   '<p class="muted" style="margin:0">'+esc(t('gd_desc').replace('{n}',gdDmg(CFG)))+'</p>'+(!gdOn()?'<p class="muted" style="margin:0">'+esc(t('gd_off'))+'</p>':'')+(S.set.gd==='none'&&vl>=3?'<p class="muted" style="margin:0">'+esc(t('gd_hidden'))+'</p>':'')+'<div class="gd-grid">';
  GD_LIST.forEach(function(g){var has=gdHas(g),on=cur&&cur.k===g.k;
    h+='<div class="gd-card'+(has?'':' locked')+(on?' on':'')+'"><span class="gd-vip">VIP '+g.lv+'</span>'+monImg(g.mon,'gd-img')+'<b>'+esc(tx(g.n))+'</b>'+
     (has?(on?'<span class="tag">✓ '+esc(t('gd_on'))+'</span>':'<button class="mini" data-act="gdset" data-id="'+g.k+'">'+esc(t('gd_follow'))+'</button>'):'<small class="muted">🔒 '+esc(t('gd_need').replace('{lv}',g.lv).replace('{b}',vipNeed(CFG,g.lv)))+'</small>')+'</div>'});
  return h+'</div></section>'}
