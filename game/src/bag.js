/* =====================================================================
   BAG + UPGRADES (2026-11-24) — character window with equipment slots,
   combat power and stats; bag window with tabs (all / wearable / usable /
   materials), stacking, lock, dismantle, best-gear and sort. Tap an item
   to wear it, upgrade it (+1 to +20) or dismantle it into upgrade stones.
   Rules live in ledger.js ('enh', 'salv', raid stones and combat power).
   ===================================================================== */
Object.assign(L,{
 bag_t:m('กระเป๋า','Bag','背包'),bag_char:m('ตัวละครและสวมใส่','Character & gear','角色与装备'),bag_cp:m('พลังรบ','Combat power','战力'),
 bag_all:m('ทั้งหมด','All','全部'),bag_wear:m('สวมใส่','Wearable','装备'),bag_use:m('กดใช้','Usable','可使用'),bag_mat:m('วัตถุดิบ','Materials','材料'),
 bag_stack:m('รวมของที่ซ้ำ','Stack duplicates','合并重复'),bag_best:m('ใส่ดีสุด','Best gear','最佳装备'),bag_salvdup:m('ย่อยของซ้ำ','Dismantle extras','分解重复'),bag_lockm:m('โหมดล็อก','Lock mode','锁定模式'),bag_sort:m('จัดเรียง','Sort','排序'),
 bag_atk:m('พลังโจมตี','Attack','攻击'),bag_def:m('พลังป้องกัน','Defence','防御'),bag_bdmg:m('ดาเมจบอสเพิ่มต่อข้อที่ตอบถูก','Extra boss damage per right answer','每答对一题额外首领伤害'),bag_stone:m('หินตีบวก','Upgrade stones','强化石'),
 bag_enh:m('ตีบวก','Upgrade','强化'),bag_salv:m('ย่อย','Dismantle','分解'),bag_lock:m('ล็อก','Lock','锁定'),bag_unlock:m('ปลดล็อก','Unlock','解锁'),bag_pow:m('พลัง','Power','战力'),bag_next:m('ขั้นถัดไป','Next step','下一级'),
 bag_chance:m('โอกาสสำเร็จ {n}%','{n}% chance','成功率 {n}%'),bag_safe:m('พลาดแล้วของไม่แตก ไม่ลดขั้น','A miss keeps the item and its level','失败不会损坏或降级'),bag_max:m('ตีบวกสูงสุดแล้ว (+20)','Fully upgraded (+20)','已强化至最高(+20)'),
 bag_ok:m('✨ ตีบวกสำเร็จ! +{n}','✨ Upgrade worked! +{n}','✨ 强化成功!+{n}'),bag_miss:m('💨 ตีบวกพลาด ของยังอยู่ครบ','💨 Missed — the item is safe','💨 强化失败,物品无损'),bag_got:m('ได้หินตีบวก {n} ก้อน','Got {n} upgrade stones','获得强化石 {n} 个'),
 bag_nost:m('หินตีบวกไม่พอ','Not enough upgrade stones','强化石不足'),bag_nocoin:m('เหรียญไม่พอ','Not enough coins','金币不足'),bag_cantsalv:m('ย่อยไม่ได้: ของที่สวมอยู่ ล็อกไว้ หรือของเริ่มต้น','Can\'t dismantle: worn, locked or starter item','无法分解:已穿戴、已锁定或初始物品'),
 bag_salvq:m('ย่อย "{n}" ได้หิน {s} ก้อน?','Dismantle "{n}" for {s} stones?','分解"{n}"获得 {s} 个强化石?'),bag_dupq:m('ย่อยของซ้ำ {n} ชิ้น (เก็บไว้ชิ้นละ 1 และไม่แตะของที่ล็อก) ได้หิน {s} ก้อน?','Dismantle {n} extra copies (keeps one of each, skips locked) for {s} stones?','分解{n}件重复物品(各留1件,跳过锁定)获得{s}个强化石?'),
 bag_nodup:m('ไม่มีของซ้ำให้ย่อย','No extra copies to dismantle','没有可分解的重复物品'),bag_stdesc:m('ได้จากการย่อยของและตีบอสเมือง/บอสโลก (รอบละ 2 ก้อน)','From dismantling and from city/world boss fights (2 a fight)','来自分解和首领战(每场2个)'),
 bag_tk:m('ตั๋วสุ่ม','Gacha tickets','抽奖券'),bag_off:m('ครูปิดระบบตีบวกไว้ชั่วคราว','Upgrades are switched off for now','强化暂时关闭'),bag_empty:m('ยังไม่มีของในหมวดนี้','Nothing here yet','暂无物品'),
 bag_rar:m('ระดับ','Rarity','品级'),bag_new:m('ใหม่','Newest','最新')});
if(typeof CFG_LABELS!=='undefined')Object.assign(CFG_LABELS,{enhOn:m('เปิดตีบวกและย่อยของ (1 = เปิด, 0 = ปิด)','Upgrades and dismantling on (1 = on, 0 = off)','开启强化与分解(1 开 0 关)')});
var BAG_SL=[['headwear','🎩'],['acchead','🎀'],['hair','💇'],['top','👕'],['bottom','👖'],['outfit','👗'],['weapon','🗡️'],['accessories','💍'],['wings','🪽'],['shoes','👟'],['pet','🐾'],['aura','✨']];
var BAG_SN={hair:m('ผม','Hair','发型'),aura:m('ออร่า','Aura','光环'),headwear:m('หมวก','Hat','帽子'),acchead:m('เครื่องประดับหัว','Head piece','头饰'),top:m('เสื้อ','Top','上衣'),bottom:m('กางเกง','Bottom','下装'),outfit:m('ชุด','Outfit','套装'),weapon:m('อาวุธ','Weapon','武器'),accessories:m('เครื่องประดับ','Accessory','饰品'),wings:m('ปีก','Wings','翅膀'),shoes:m('รองเท้า','Shoes','鞋子'),pet:m('สัตว์เลี้ยง','Pet','宠物')};
function enhOnNow(){return CFG.enhOn!==0&&Date.now()>=ENH_T}
function bagLv(id){return S.owned[id]>0?((S.enh||{})[id]|0):0}
function bagPow(id){return itemPow(ITEM[id],bagLv(id))}
function bagCp(){var seen={},sum=0;Object.keys(S.eq||{}).forEach(function(sl){var id=S.eq[sl],it=ITEM[id];if(!it||ENH_NOCAT[it.cat]||seen[id]||!(S.owned[id]>0))return;seen[id]=1;sum+=bagPow(id)});return sum*10}
function bagCpBonus(){return enhOnNow()?cpBonus(bagCp()):0}
function bagLocked(id){return (S.set.lk||[]).indexOf(id)>=0}
function bagWorn(id){return Object.keys(S.eq||{}).some(function(k){return S.eq[k]===id})}
function bagCanSalv(id){var it=ITEM[id];if(!it||ENH_NOCAT[it.cat]||bagLocked(id)||!(S.owned[id]>0))return false;if(bagWorn(id)&&S.owned[id]<2)return false;if(STARTERS&&((STARTERS.F||[]).indexOf(id)>=0||(STARTERS.M||[]).indexOf(id)>=0))return false;return true}
function bagThumb(id,cls){var it=ITEM[id],lv=bagLv(id);return '<span class="bag-cell r-'+it.rar+(cls?' '+cls:'')+'">'+itemThumb(it)+(lv?'<span class="bag-pl">+'+lv+'</span>':'')+(S.owned[id]>1&&UI.bagStack!==false?'<span class="bag-q">'+S.owned[id]+'</span>':'')+(bagLocked(id)?'<span class="bag-lk">🔒</span>':'')+(bagWorn(id)?'<span class="bag-e">E</span>':'')+'</span>'}
VIEW.bag=function(){if(!S.created){UI.scr='title';return VIEW.title()}var tab=UI.bagTab||'all',sort=UI.bagSort||'rar',cp=bagCp(),cpb=cpBonus(cp);
  var ids=Object.keys(S.owned).filter(function(id){return S.owned[id]>0&&ITEM[id]});
  var wear=ids.filter(function(id){return !ENH_NOCAT[ITEM[id].cat]}),use=ids.filter(function(id){var c=ITEM[id].cat;return c==='hairColor'||c==='haircolor'});
  var list=tab==='wear'?wear:tab==='use'?use:tab==='mat'?[]:ids;
  list.sort(function(a,b){return sort==='pow'?bagPow(b)-bagPow(a):(RAR[ITEM[b].rar].order-RAR[ITEM[a].rar].order)||bagLv(b)-bagLv(a)});
  var slot=function(sl){var id=S.eq[sl[0]],it=ITEM[id];return it?'<button class="bag-slot" data-act="bagitem" data-id="'+id+'" aria-label="'+esc(tx(BAG_SN[sl[0]]||{th:sl[0]}))+'">'+bagThumb(id)+'</button>':'<span class="bag-slot empty" title="'+esc(tx(BAG_SN[sl[0]]))+'">'+sl[1]+'</span>'};
  var cells=[];if(tab==='all'||tab==='mat')cells.push('<button class="bag-cellb" data-act="bagstone"><span class="bag-cell r-rare">'+BAG_STONE+'<span class="bag-q">'+(S.st|0)+'</span></span></button>');
  if(tab==='all'||tab==='use')cells.push('<button class="bag-cellb" data-act="go" data-id="gacha"><span class="bag-cell r-epic">'+BAG_TICKET+'<span class="bag-q">'+(S.tickets|0)+'</span></span></button>');
  list.forEach(function(id){var n=UI.bagStack===false?S.owned[id]:1;for(var k=0;k<Math.min(n,20);k++)cells.push('<button class="bag-cellb" data-act="'+(UI.bagLockM?'baglock':'bagitem')+'" data-id="'+id+'" title="'+esc(tx(ITEM[id].names))+'">'+bagThumb(id)+'</button>')});
  var tabs=[['all',ids.length+2],['wear',wear.length],['use',use.length+1],['mat',1]];
  return '<div class="bag2">'+
   '<section class="bag-win"><div class="bag-wh"><b>'+esc(t('bag_char'))+'</b></div><div class="bag-paper">'+
    '<div class="bag-doll"><div class="bag-col">'+BAG_SL.slice(0,6).map(slot).join('')+'</div><div class="bag-stage">'+avatar(S,{label:S.name,anim:true,hd:true,noTitle:true})+'</div><div class="bag-col">'+BAG_SL.slice(6).map(slot).join('')+'</div></div>'+
    '<div class="bag-cp"><span aria-hidden="true">⚔️</span><div><small>'+esc(t('bag_cp'))+' · COMBAT POWER</small><b>'+cp.toLocaleString()+'</b></div></div>'+
    '<div class="bag-stats"><div><span>'+esc(t('bag_atk'))+'</span><b>'+Math.round(cp*.068).toLocaleString()+'</b></div><div><span>'+esc(t('bag_def'))+'</span><b>'+Math.round(cp*.04).toLocaleString()+'</b></div><div><span>'+esc(t('bag_bdmg'))+'</span><b>+'+cpb+(enhOnNow()?'':' ⏳')+'</b></div><div><span>'+esc(t('bag_stone'))+'</span><b>'+(S.st|0)+'</b></div></div>'+
    '<div class="bag-btns"><button data-act="bagtab" data-id="wear">'+esc(t('bag_enh'))+'</button><button data-act="bagsalvdup">'+esc(t('bag_salv'))+'</button><button data-act="go" data-id="wd">'+esc(t('n_wd'))+'</button><button data-act="skills">'+esc(t('sk_title'))+'</button></div>'+
   '</div></section>'+
   '<section class="bag-win"><div class="bag-wh"><b>🎒 '+esc(t('bag_t'))+'</b><span class="bag-chip">🪙 '+S.coin.toLocaleString()+'</span><span class="bag-chip">💎 '+S.gems.toLocaleString()+'</span><span class="bag-chip">🎟️ '+(S.tickets|0)+'</span><span class="bag-chip">💠 '+(S.st|0)+'</span></div><div class="bag-paper">'+
    '<div class="bag-tabs" role="tablist">'+tabs.map(function(x){return '<button role="tab" data-act="bagtab" data-id="'+x[0]+'" aria-pressed="'+(tab===x[0])+'">'+esc(t('bag_'+x[0]))+' '+x[1]+'</button>'}).join('')+'</div>'+
    '<label class="bag-chk"><input type="checkbox" data-act="bagstack"'+(UI.bagStack===false?'':' checked')+'> '+esc(t('bag_stack'))+'</label>'+(enhOnNow()?'':'<div class="notice">⏳ '+esc(t('bag_off'))+'</div>')+
    '<div class="bag-grid">'+(cells.length?cells.join(''):'<div class="empty">'+esc(t('bag_empty'))+'</div>')+'</div>'+
    '<div class="bag-acts"><button data-act="bagbest">'+esc(t('bag_best'))+'</button><button data-act="bagsalvdup">'+esc(t('bag_salvdup'))+'</button><button data-act="baglockm" aria-pressed="'+!!UI.bagLockM+'">🔒 '+esc(t('bag_lockm'))+'</button><button data-act="bagsort">⇅ '+esc(t(sort==='pow'?'bag_pow':'bag_rar'))+'</button></div>'+
   '</div></section></div>'};
var BAG_STONE='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4l12 10-4 18H12L8 14z" fill="#8fd0ff" stroke="#fff" stroke-width="2"/><path d="M20 4v28M8 14h24" stroke="#fff" stroke-opacity=".6"/></svg>';
var BAG_TICKET='<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="11" width="30" height="18" rx="4" fill="#ffd36a" stroke="#fff" stroke-width="2"/><circle cx="20" cy="20" r="4" fill="#fff"/></svg>';
function bagItemModal(id){var it=ITEM[id];if(!it)return null;var lv=bagLv(id),nl=lv+1,max=lv>=20,ch=enhChance(nl),cost=enhCoin(nl),worn=bagWorn(id),noenh=!!ENH_NOCAT[it.cat];
  var can=!max&&enhOnNow()&&!noenh&&S.coin>=cost&&(S.st|0)>=nl;
  return {body:'<div class="bag-big">'+bagThumb(id)+'</div><h2 style="margin:6px 0 0;text-align:center">'+esc(tx(it.names))+(lv?' <span class="bag-plt">+'+lv+'</span>':'')+'</h2><p class="mut" style="margin:0;text-align:center"><span class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span> · '+esc(tx((CATS.filter(function(c){return c.id===it.cat})[0]||{names:{th:it.cat}}).names))+'</p>'+
   (noenh?'':'<div class="bag-rows"><div><span>'+esc(t('bag_pow'))+'</span><b>'+(bagPow(id)*10)+'</b></div>'+(max?'<div><span>'+esc(t('bag_max'))+'</span></div>':'<div><span>'+esc(t('bag_next'))+' +'+nl+'</span><b>'+(itemPow(it,nl)*10)+'</b></div><div><span>'+esc(t('bag_enh'))+'</span><b>🪙 '+cost+' · 💠 '+nl+'</b></div><div><span>'+esc(t('bag_chance').replace('{n}',ch))+'</span><small>'+(nl>10?esc(t('bag_safe')):'')+'</small></div>')+'</div>')+
   (UI.bagRes?'<div class="bag-res">'+esc(UI.bagRes)+'</div>':'')+
   '<div class="row" style="justify-content:center;flex-wrap:wrap;gap:6px">'+(it.cat==='hairColor'||canEquip(id)?(worn?'<button class="btn sec" data-act="uneq" data-id="'+slotOf(it)+'">'+esc(t('unequip'))+'</button>':'<button class="btn" data-act="equip" data-id="'+id+'">'+esc(t('equip'))+'</button>'):'')+
    (noenh||max?'':'<button class="btn gold" data-act="bagenh" data-id="'+id+'"'+(can?'':' disabled')+'>✨ '+esc(t('bag_enh'))+'</button>')+
    (noenh?'':'<button class="btn sec" data-act="bagsalv" data-id="'+id+'"'+(bagCanSalv(id)&&enhOnNow()?'':' disabled')+'>⚒ '+esc(t('bag_salv'))+' (💠'+(ENH_ST[it.rar]|0)+')</button>')+
    '<button class="btn sec" data-act="baglock" data-id="'+id+'">'+(bagLocked(id)?'🔓 '+esc(t('bag_unlock')):'🔒 '+esc(t('bag_lock')))+'</button><button class="btn sec" data-act="closemodal">'+esc(t('ok'))+'</button></div>'}}
function bagEnh(id){var it=ITEM[id];if(!it||!enhOnNow()||ENH_NOCAT[it.cat]||!(S.owned[id]>0))return;var lv=bagLv(id)+1;if(lv>20)return;if(S.coin<enhCoin(lv)){toast(t('bag_nocoin'));return}if((S.st|0)<lv){toast(t('bag_nost'));return}
  var ok=enhOk(CL.uid,id,(S.enhn||{})[id]|0,lv);commitEv({k:'enh',d:today(),item:id,lv:lv,cost:enhCoin(lv),sc:lv,ok:ok});save();sfx(ok?'lvl':'bad');UI.bagRes=ok?t('bag_ok').replace('{n}',lv):t('bag_miss');
  if(ok&&typeof skFxPlay==='function'&&skMotion()){skCanvas();var c=document.querySelector('.modal .bag-big');if(c){var r=c.getBoundingClientRect();skBurst(r.left+r.width/2,r.top+r.height/2,lv>=15?'#f3c64a':'#9fd8ff',30+lv*2,380);skShock(r.left+r.width/2,r.top+r.height/2,'#ffe08a',90,.5,8)}}render()}
function bagSalv(id,quiet){var it=ITEM[id];if(!bagCanSalv(id)||!enhOnNow())return 0;var st=ENH_ST[it.rar]|0;commitEv({k:'salv',d:today(),item:id,st:st});if(!(S.owned[id]>0)){Object.keys(S.eq).forEach(function(k){if(S.eq[k]===id)unequip(k)})}if(!quiet){save();toast('💠 '+t('bag_got').replace('{n}',st));UI.modal=null;render()}return st}
function bagDups(){var out=[];Object.keys(S.owned).forEach(function(id){var it=ITEM[id];if(!it||ENH_NOCAT[it.cat]||bagLocked(id))return;var extra=S.owned[id]-1;for(var k=0;k<extra;k++)out.push(id)});return out}
function bagBest(){var best={};Object.keys(S.owned).forEach(function(id){var it=ITEM[id];if(!it||!(S.owned[id]>0)||ENH_NOCAT[it.cat]||!canEquip(id))return;var sl=slotOf(it),p=bagPow(id);if(!best[sl]||p>best[sl].p)best[sl]={id:id,p:p}});
  Object.keys(best).forEach(function(sl){if(S.eq[sl]!==best[sl].id)equip(best[sl].id)});save();render()}
(function(){var MD=typeof modalHtml==='function'?modalHtml:null;
  var A0=typeof skillsAct==='function'?skillsAct:null;
  window.bagAct=function(a,id){switch(a){
   case 'bagtab':UI.bagTab=id;UI.scr='bag';render();return true;
   case 'bagstack':UI.bagStack=UI.bagStack===false;render();return true;
   case 'bagsort':UI.bagSort=UI.bagSort==='pow'?'rar':'pow';render();return true;
   case 'baglockm':UI.bagLockM=!UI.bagLockM;render();return true;
   case 'baglock':var lk=S.set.lk||(S.set.lk=[]),i=lk.indexOf(id);if(i>=0)lk.splice(i,1);else lk.push(id);save();render();return true;
   case 'bagitem':UI.bagRes='';UI.modal={kind:'bagitem',id:id};render();return true;
   case 'bagenh':bagEnh(id);return true;
   case 'bagsalv':var it=ITEM[id];if(it&&confirmBox(t('bag_salvq').replace('{n}',tx(it.names)).replace('{s}',ENH_ST[it.rar]|0)))bagSalv(id);return true;
   case 'bagsalvdup':if(!enhOnNow()){toast(t('bag_off'));return true}var d=bagDups().filter(bagCanSalv);if(!d.length){toast(t('bag_nodup'));return true}var s=d.reduce(function(a,x){return a+(ENH_ST[ITEM[x].rar]|0)},0);
     if(confirmBox(t('bag_dupq').replace('{n}',d.length).replace('{s}',s))){var got=0;d.forEach(function(x){if(bagCanSalv(x)&&S.owned[x]>1)got+=bagSalv(x,true)});save();toast('💠 '+t('bag_got').replace('{n}',got));render()}return true;
   case 'bagbest':bagBest();return true;
   case 'bagstone':toast('💠 '+t('bag_stone')+' '+(S.st|0)+' · '+t('bag_stdesc'));return true}
   return false}})();
function confirmBox(msg){try{return window.confirm(msg)}catch(e){return true}}
(function(){var SKM=skModal;skModal=function(md){if(md&&md.kind==='bagitem')return bagItemModal(md.id);return SKM(md)};
  var SA=skillsAct;skillsAct=function(a,id){return bagAct(a,id)||SA(a,id)};
  var VM=VIEW.me;VIEW.me=function(){return '<div class="row" style="justify-content:flex-end;margin-bottom:8px"><button class="btn gold" data-act="go" data-id="bag">🎒 '+esc(t('bag_t'))+'</button></div>'+VM()};
  var VW=VIEW.wd;VIEW.wd=function(){return '<div class="row" style="justify-content:flex-end;margin-bottom:8px"><button class="btn gold" data-act="go" data-id="bag">🎒 '+esc(t('bag_t'))+' · ✨ '+esc(t('bag_enh'))+'</button></div>'+VW()}})();
