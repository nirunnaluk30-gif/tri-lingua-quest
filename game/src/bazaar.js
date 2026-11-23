/* =====================================================================
   MARKET TOWN (เมืองตลาด) — the trade board shown as a street of stalls.
   Each seller's open offers become a stall with their hero behind the counter.
   Buying still goes through the market escrow (market.js), nothing new to trust.
   The seller names the stall and picks its awning (S.shop, sent with market/{uid}).
   ===================================================================== */
Object.assign(L,{
 bz_name:m('เมืองตลาด','Market Town','集市小镇'),
 bz_sub:m('ถนนแห่งร้านค้าของผู้เล่น · แตะแผงเพื่อดูของ แล้วซื้อด้วยเหรียญ','A street of players\' stalls · tap a stall to see what\'s on sale','玩家摊位一条街 · 点摊位看商品'),
 bz_rules:m('กติกาตลาด','Market rules','集市规则'),
 bz_r1:m('ซื้อขายด้วยเหรียญ 🪙 เท่านั้น','Coins 🪙 only','只用金币 🪙 交易'),
 bz_r2:m('ราคาต้องอยู่ในช่วงของระดับของ','Prices stay inside each rarity\'s range','价格须在稀有度范围内'),
 bz_r3:m('ค่าธรรมเนียมแผง 5% ของราคาขาย','5% stall fee on each sale','每笔交易收5%摊位费'),
 bz_r4:m('วางขายได้ร้านละ 6 ชิ้น','Up to 6 items per stall','每个摊位最多6件'),
 bz_r5:m('ห้ามซื้อขายด้วยเงินจริงนอกเกม','No real-money deals outside the game','禁止游戏外真钱交易'),
 bz_mine:m('ร้านของฉัน','My stall','我的摊位'),bz_open:m('ตั้งร้าน / แต่งร้าน','Set up / decorate','开店 / 装饰'),bz_add:m('เพิ่มของขาย','Add an item','上架商品'),
 bz_empty:m('ยังไม่มีใครตั้งร้าน มาเป็นร้านแรกของเมืองตลาดกัน!','No stalls yet — be the first shop in Market Town!','还没有摊位,来当集市第一家店吧!'),
 bz_shopof:m('ร้านของ {n}','{n}\'s stall','{n}的小店'),bz_items:m('{n} ชิ้น','{n} items','{n}件'),
 bz_setup:m('แต่งร้านของฉัน','Decorate my stall','装饰我的摊位'),bz_sname:m('ชื่อร้าน','Stall name','店名'),bz_sph:m('เช่น ร้านชุดสวยของพลอย','e.g. Ploy\'s Pretty Outfits','例如:小玉的漂亮服装店'),
 bz_color:m('สีผ้าใบ','Awning colour','遮阳棚颜色'),bz_save:m('บันทึกร้าน','Save stall','保存'),bz_saved:m('บันทึกร้านแล้ว','Stall saved','已保存'),
 bz_nostall:m('คุณยังไม่มีของวางขาย กด "เพิ่มของขาย" เพื่อเลือกของจากตู้เสื้อผ้า','Nothing on sale yet — tap "Add an item" to pick from your wardrobe','还没有上架商品,点“上架商品”从衣柜选择'),
 bz_counter:m('หน้าร้าน','On the counter','柜台')});
var BZ_COLORS=[['#ff7a9a','#fff'],['#ffb03a','#fff6dc'],['#5ac8a0','#fff'],['#5a9aff','#fff'],['#a87aff','#fff'],['#ff5a5a','#fff6dc'],['#3ab0c8','#fff'],['#e0b040','#7a4a10']];
function bzStalls(){var out=[];Object.keys(MK.docs).forEach(function(u){var d=MK.docs[u];if(!isO(d))return;var offs=mkOffers(d).filter(function(o){return o.st==='open'&&(!o.to||o.to===CL.uid||u===CL.uid)&&ITEM[o.item]&&!cleanPay(o.want).item});
  if(!offs.length&&u!==CL.uid)return;if(u===CL.uid)d=Object.assign({},d,{name:S.name,look:myLook(),shop:S.shop});out.push({u:u,d:d,offs:offs,me:u===CL.uid})});
  if(!out.some(function(x){return x.me})&&S.created)out.push({u:CL.uid,d:{name:S.name,look:myLook(),shop:S.shop},offs:[],me:true});
  return out.sort(function(a,b){return (b.me?1:0)-(a.me?1:0)||b.offs.length-a.offs.length})}
function bzAvatar(d){var lk=isO(d.look)?d.look:{},st={gender:(lk.g||d.gender)==='M'?'M':'F',cls:CLASSES[lk.cls||d.cls]?(lk.cls||d.cls):'mage',eq:{}};
  if(isO(lk.eq))Object.keys(lk.eq).forEach(function(k){var id=lk.eq[k];if(typeof id==='string'&&ITEM[id]&&slotOf(ITEM[id])===k)st.eq[k]=id});
  return avatar(st,{anim:true,noFx:true,noTitle:true,noPet:true,petRoom:false,auraTitle:''})}
function bzStall(x){var sh=isO(x.d.shop)?x.d.shop:{},col=BZ_COLORS[int(sh.c,0,7,0)],nm=str(sh.n,24)||t('bz_shopof').replace('{n}',str(x.d.name,16)||'?');
  var goods=x.offs.slice(0,6).map(function(o){var it=ITEM[o.item];return '<span class="bz-good r-'+it.rar+'" title="'+esc(tx(it.names))+'"><span class="bz-gthumb">'+itemThumb(it)+'</span><span class="bz-price">'+esc(payText(o.want))+'</span></span>'}).join('');
  return '<button type="button" class="bz-stall'+(x.me?' me':'')+'" data-act="bzopen" data-id="'+esc(x.u)+'" style="--aw:'+col[0]+';--aw2:'+col[1]+'">'+
   '<span class="bz-awn"></span><span class="bz-sign">'+(x.me?'⭐ ':'')+esc(nm)+'</span>'+
   '<span class="bz-keeper">'+bzAvatar(x.d)+'</span>'+
   '<span class="bz-counter">'+(goods||'<span class="bz-none">'+(x.me?'＋ '+esc(t('bz_add')):'')+'</span>')+'</span>'+
   '<span class="bz-cap"><b>'+esc(str(x.d.name,16)||'?')+'</b> · '+esc(t('bz_items').replace('{n}',x.offs.length))+'</span></button>'}
/* the market square: every seller stands on the plaza with a floating shop sign; tap to look inside */
function bzSeed(u,k){var h=cyrb53(u+'|'+k);return (h%1000)/1000}
function bzPlaza(st){var W=window.innerWidth||1200,ph=W<520;
  /* standing spots (feet, % of the picture) on the open cobblestones, front rows first, clear of the fountain and the stalls */
  var SL=ph?[[18,94],[82,94],[50,95],[18,75],[82,75],[30,57],[70,57],[18,38],[82,38]]:
    [[30,90],[70,90],[16,88],[84,88],[44,78],[56,78],[22,66],[78,66],[34,64],[66,64],[16,48],[84,48],[30,44],[70,44],[42,30],[58,30]];
  var main=st.slice(0,SL.length),more=st.slice(SL.length);
  function one(x,pos,extra){var sh=isO(x.d.shop)?x.d.shop:{},col2=BZ_COLORS[int(sh.c,0,7,0)],nm=str(sh.n,24)||t('bz_shopof').replace('{n}',str(x.d.name,16)||'?');
    var best=x.offs.map(function(o){return ITEM[o.item]}).filter(Boolean).sort(function(a,b){return (RAR[b.rar]?RAR[b.rar].order:0)-(RAR[a.rar]?RAR[a.rar].order:0)})[0];
    return '<button type="button" class="bz-seller'+(x.me?' me':'')+'" data-act="bzopen" data-id="'+esc(x.u)+'" style="'+pos+';--aw:'+col2[0]+'" aria-label="'+esc(nm+' — '+t('bz_items').replace('{n}',x.offs.length))+'">'+
      '<span class="bz-plq"><span class="bz-bag">💰</span><span class="bz-pn">'+esc(nm)+'</span>'+(x.offs.length?'<span class="bz-pc">'+x.offs.length+'</span>':'')+'</span>'+
      (best?'<span class="bz-peek r-'+best.rar+'">'+itemThumb(best)+'</span>':'')+
      '<span class="bz-mat"></span><span class="bz-av">'+bzAvatar(x.d)+'</span><span class="bz-nm">'+(x.me?'⭐ ':'')+esc(str(x.d.name,16)||'?')+(x.me&&!x.offs.length?' · ＋ '+esc(t('bz_add')):'')+'</span></button>'}
  var h='<section class="bz-plaza bz-pic'+(ph?' ph':'')+'">'+(main.length?main.map(function(x,i){var p=SL[i];return one(x,'left:'+p[0]+'%;top:'+p[1]+'%;z-index:'+p[1])}).join(''):'<div class="bz-emptypic">'+esc(t('bz_empty'))+'</div>')+'</section>';
  if(more.length){var C=ph?3:6,rowH=ph?150:170,rows=Math.ceil(more.length/C);
    h+='<section class="bz-plaza bz-more" style="height:'+(rows*rowH+30)+'px">'+more.map(function(x,i){var col=i%C,row=Math.floor(i/C);return one(x,'left:'+((col+.5)/C*100).toFixed(1)+'%;top:'+(row*rowH+rowH*.86+(col%2?14:0))+'px;z-index:'+(row*10+5))}).join('')+'</section>'}
  return h}
VIEW.bazaar=function(){mkEnsure();if(!CL.db||!CL.uid)return '<section class="panel"><div class="empty">'+esc(t('mk_needcloud'))+'</div></section>';
  if(!tradeOn())return '<section class="panel"><div class="empty">'+esc(t('mk_off'))+'</div></section>';
  var st=bzStalls();
  return '<section class="panel bz-hero"><div class="bz-htxt"><span class="eyebrow">Market Town</span><h1>🏪 '+esc(t('bz_name'))+'</h1><p>'+esc(t('bz_sub'))+'</p>'+
   '<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn gold" data-act="bzsetup">🎨 '+esc(t('bz_open'))+'</button><button class="btn sec" data-act="go" data-id="wd">➕ '+esc(t('bz_add'))+'</button><button class="btn sec" data-act="go" data-id="market">🔁 '+esc(t('mk_title'))+'</button></div></div>'+
   '<div class="bz-board"><b>📜 '+esc(t('bz_rules'))+'</b><ol>'+['bz_r1','bz_r2','bz_r3','bz_r4','bz_r5'].map(function(k){return '<li>'+esc(t(k))+'</li>'}).join('')+'</ol></div></section>'+
   bzPlaza(st)};
function bzModal(md){if(md.kind==='bzshop'){var d=md.u===CL.uid?{name:S.name,look:myLook(),shop:S.shop,offers:[]}:MK.docs[md.u];if(!d)return {body:'<button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button>'};
    var me=md.u===CL.uid,offs=me?Object.keys(S.trades).map(function(k){return Object.assign({tid:k},S.trades[k])}).filter(function(o){return o.st==='open'&&!cleanPay(o.want).item}):mkOffers(d).filter(function(o){return o.st==='open'&&(!o.to||o.to===CL.uid)&&!cleanPay(o.want).item});
    var sh=isO(d.shop)?d.shop:{},nm=str(sh.n,24)||t('bz_shopof').replace('{n}',str(d.name,16));
    return {wide:true,body:'<div class="bz-mhead" style="--aw:'+BZ_COLORS[int(sh.c,0,7,0)][0]+'"><span class="bz-mav">'+bzAvatar(d)+'</span><div><span class="eyebrow">🏪 '+esc(t('bz_name'))+'</span><h2 style="margin:0">'+esc(nm)+'</h2><small class="mut">'+esc(str(d.name,16))+'</small></div></div>'+
      (offs.length?offs.map(function(o){return offerRow(md.u,o,me)}).join(''):'<p class="mut">'+esc(me?t('bz_nostall'):t('mk_none'))+'</p>')+
      '<div class="row" style="justify-content:flex-end;gap:8px">'+(me?'<button class="btn sec" data-act="bzsetup">🎨 '+esc(t('bz_open'))+'</button><button class="btn sec" data-act="go" data-id="wd">➕ '+esc(t('bz_add'))+'</button>':'')+'<button class="btn" data-act="closemodal">'+esc(t('ok'))+'</button></div>'}}
  if(md.kind==='bzsetup'){var c=md.c===undefined?int((S.shop||{}).c,0,7,0):md.c;
    return {body:'<h2>🎨 '+esc(t('bz_setup'))+'</h2><label class="fld">'+esc(t('bz_sname'))+'<input id="bz_n" maxlength="24" value="'+esc((S.shop||{}).n||'')+'" placeholder="'+esc(t('bz_sph'))+'"></label><b>'+esc(t('bz_color'))+'</b><div class="row" style="gap:8px;flex-wrap:wrap">'+
      BZ_COLORS.map(function(cc,i){return '<button type="button" class="bz-sw'+(i===c?' sel':'')+'" data-act="bzcol" data-id="'+i+'" style="--aw:'+cc[0]+';--aw2:'+cc[1]+'" aria-label="'+(i+1)+'" aria-pressed="'+(i===c)+'"></button>'}).join('')+'</div>'+
      '<div class="bz-prev" style="--aw:'+BZ_COLORS[c][0]+';--aw2:'+BZ_COLORS[c][1]+'"><span class="bz-awn"></span></div>'+
      '<div class="row" style="justify-content:flex-end;gap:8px"><button class="btn sec" data-act="closemodal">'+esc(t('cancel')||'ยกเลิก')+'</button><button class="btn" data-act="bzsave">'+esc(t('bz_save'))+'</button></div>'}}
  return null}
function bazaarAct(a,id){switch(a){
  case 'bzopen':UI.modal={kind:'bzshop',u:id};render();return true;
  case 'bzsetup':UI.modal={kind:'bzsetup'};render();return true;
  case 'bzcol':if(UI.modal&&UI.modal.kind==='bzsetup'){var ni=document.getElementById('bz_n');UI.modal.c=int(id,0,7,0);if(ni)UI.modal.n=ni.value;render();var n2=document.getElementById('bz_n');if(n2&&UI.modal.n!==undefined)n2.value=UI.modal.n}return true;
  case 'bzsave':var inp=document.getElementById('bz_n'),nm=inp?inp.value.trim().slice(0,24):'',c=UI.modal&&UI.modal.c!==undefined?UI.modal.c:int((S.shop||{}).c,0,7,0);
    if(nm&&nameIssue(nm)){toast(t(nameIssue(nm)));return true}S.shop={n:nm,c:c};save();marketPush();UI.modal=null;toast(t('bz_saved'));render();return true}return false}
/* teacher: market history (completed sales and what is on sale now), under the town tab of the admin page */
var BZL={t:0,rows:null,open:0};
function bzLoadLog(){if(!CL.admin||!CL.db||Date.now()-BZL.t<60e3)return;BZL.t=Date.now();
  CL.db.collection('market').get().then(function(s){var rows=[],open=0,names={};s.docs.forEach(function(d){var x=d.data()||{};names[d.id]=str(x.name,16)});
    s.docs.forEach(function(d){var x=d.data()||{};mkOffers(x).forEach(function(o){if(o.st==='open')open++;if(o.st==='done')rows.push({s:d.id,sn:names[d.id]||'?',b:o.by,bn:names[o.by]||'?',item:o.item,n:o.n,want:cleanPay(o.want),t:int(o.t,0,9e15,0)})})});
    rows.sort(function(a,b){return b.t-a.t});BZL.rows=rows.slice(0,100);BZL.open=open;softRender()},function(){})}
function bzAdminLog(){bzLoadLog();var r=BZL.rows;
  return '<section class="panel stack"><div class="row" style="justify-content:space-between"><b>📜 '+esc(t('bz_log'))+'</b><small class="mut">'+esc(t('bz_logopen').replace('{n}',BZL.open))+'</small></div>'+
   (!r?'<div class="empty">…</div>':!r.length?'<div class="empty">'+esc(t('bz_lognone'))+'</div>':'<div class="tblwrap" style="max-height:320px;overflow-y:auto"><table class="dt"><thead><tr><th>'+esc(t('bz_logwhen'))+'</th><th>'+esc(t('bz_logsell'))+'</th><th>'+esc(t('bz_logbuy'))+'</th><th>'+esc(t('bz_logitem'))+'</th><th class="num">'+esc(t('bz_logprice'))+'</th></tr></thead><tbody>'+
    r.map(function(x){var it=ITEM[x.item];return '<tr><td>'+esc(new Date(x.t).toLocaleString([], {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}))+'</td><td>'+esc(x.sn)+'</td><td>'+esc(x.bn)+'</td><td>'+esc(it?tx(it.names):x.item)+(x.n>1?' ×'+x.n:'')+'</td><td class="num">'+esc(payText(x.want))+'</td></tr>'}).join('')+'</tbody></table></div>')+'</section>'}
Object.assign(L,{bz_log:m('ประวัติการซื้อขายในตลาด','Market sales history','集市交易记录'),bz_logopen:m('กำลังวางขาย {n} ชิ้น','{n} items on sale now','在售 {n} 件'),bz_lognone:m('ยังไม่มีการซื้อขาย','No sales yet','暂无交易'),
 bz_logwhen:m('วางขายเมื่อ','Listed','上架时间'),bz_logsell:m('ผู้ขาย','Seller','卖家'),bz_logbuy:m('ผู้ซื้อ','Buyer','买家'),bz_logitem:m('ของ','Item','物品'),bz_logprice:m('ราคา','Price','价格')});
(function(){if(typeof admTown!=='function')return;var A=admTown;admTown=function(){return A()+bzAdminLog()}})();
