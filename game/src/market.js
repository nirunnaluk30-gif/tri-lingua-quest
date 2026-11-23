/* =====================================================================
   MARKET — sell back, throw away, and trade with other players.
   Every change is a ledger event, so the teacher's verifier can replay it.
   Trades are an escrow in four steps; nothing is ever in two places:
     A  tout     item leaves A's bag, the offer is listed in market/{A}
     B  tpay     B's payment leaves B's bag, the request is listed in market/{B}
     A  tdone    A's game picks the first valid request and takes the payment
     B  tget     B's game sees "done by me" and receives the item
        trefund  (or "cancelled / done by someone else") and gets the payment back
   market/{uid} is written only by its owner; everyone signed in reads all of them.
   ===================================================================== */
Object.assign(L,{mk_all:m('ทั้งหมด','All','全部'),mk_buynow:m('ซื้อเลย','Buy now','立即购买'),mk_buying:m('กำลังซื้อ…','Buying…','购买中…'),mk_sold:m('มีคนซื้อตัดหน้าไปแล้ว ไม่เสียอะไร','Someone bought it first — nothing was taken','已被别人抢先买走,没有扣除任何东西'),mk_bought:m('ซื้อสำเร็จ ได้ {x} แล้ว','Bought! You got {x}','购买成功,获得 {x}'),mk_neterr:m('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง','Connection problem — try again','连接失败,请重试')});
var MK={docs:{},unsub:null,timer:null,busy:false,started:false,ck:{},noClaim:false,lastCk:0};
/* INSTANT BUY (2026-11-16): who gets an offer is decided by one shared "claim" doc per offer,
   mkclaim/{seller}__{tid} = {by, s, t}. The database lets it be CREATED once and never changed,
   so only the first buyer (or the seller cancelling) wins, even when two press "buy" together.
   The winner gets the item at once (tpay + tget); the seller's game collects the payment (tdone)
   whenever it is next online. Without the new rule published, everything falls back to the old
   request-and-wait flow. */
function mkClaimRef(seller,tid){return CL.db.doc('mkclaim/'+seller+'__'+tid)}
/* any failure that is not "someone already claimed it" (e.g. the database rule for mkclaim is not published yet,
   so even reading is refused) switches to the old request-and-wait flow instead of showing an error */
function mkClaim(seller,tid,by){var ref=mkClaimRef(seller,tid),norule=function(){MK.noClaim=true;return {won:false,norule:true}};
  var tmo=function(p){return new Promise(function(res,rej){var tm=setTimeout(function(){rej({code:'timeout'})},12000);p.then(function(v){clearTimeout(tm);res(v)},function(e){clearTimeout(tm);rej(e)})})};
  return tmo(ref.get()).then(function(d){if(d.exists)return {won:false,by:str((d.data()||{}).by,40)};
    return tmo(ref.set({by:by,s:seller,t:Date.now()})).then(function(){return {won:true,by:by}},function(){
      return tmo(ref.get()).then(function(d2){if(d2.exists)return {won:false,by:str((d2.data()||{}).by,40)};return norule()},norule)})},
   function(e){return (e&&e.code==='timeout')?Promise.reject(e):norule()})}
function doBuyNow(owner,o){if(!CL.uid||owner===CL.uid||!o||!IDRE.test(o.tid||'')||!ITEM[o.item])return;var key=o.tid+'@'+owner;if(S.treq[key]||UI.mkBuying){toast(t('mk_already'));return}
  if(o.to&&o.to!==CL.uid)return;if(!canPay(o.want)){toast(t('mk_cantpay'));return}
  if(MK.noClaim){doAccept(owner,o);return}
  UI.mkBuying=key;render();
  mkClaim(owner,o.tid,CL.uid).then(function(r){UI.mkBuying=null;
    if(r.norule){doAccept(owner,o);render();return}
    if(!r.won){toast('⚡ '+t('mk_sold'));render();return}
    var pay=cleanPay(o.want),n=int(o.n,1,1e4);
    commitEv({k:'tpay',tid:o.tid,from:owner,pay:pay});commitEv({k:'tget',tid:o.tid,from:owner,item:o.item,n:n});
    afterRemove();save();marketPush();sfx('lvl');toast('🎁 '+t('mk_bought').replace('{x}',tx(ITEM[o.item].names)+(n>1?' ×'+n:'')));render()},
   function(){UI.mkBuying=null;toast(t('mk_neterr'));render()})}
/* a request sent the old way (already paid, waiting for the seller): claim it myself and take the item now */
function mkUpgradeReq(key,o){var r=S.treq[key];if(!r||r.st!=='wait'||MK.ck['q'+key])return;MK.ck['q'+key]=1;
  mkClaim(r.from,r.tid,CL.uid).then(function(c){MK.ck['q'+key]=0;var r2=S.treq[key];if(!r2||r2.st!=='wait'||c.norule)return;
    if(c.won||c.by===CL.uid){commitEv({k:'tget',tid:r2.tid,from:r2.from,item:o.item,n:int(o.n,1,1e4)});afterRemove();save();marketPush();toast('🎁 '+t('mk_got').replace('{x}',ITEM[o.item]?tx(ITEM[o.item].names):o.item));render()}
    /* someone else won: the seller's game finishes that sale and my payment comes back (trefund) */},function(){MK.ck['q'+key]=0})}
/* seller side: settle my open offers from their claim docs */
function mkCheckClaims(force){if(MK.noClaim||!CL.db||!CL.uid||!S.created)return;if(!force&&Date.now()-MK.lastCk<90e3)return;MK.lastCk=Date.now();
  Object.keys(S.trades).forEach(function(tid){mkSettle(tid)})}
function mkSettle(tid,u){var tr=S.trades[tid];if(!tr||tr.st!=='open'||MK.ck[tid])return;MK.ck[tid]=1;
  mkClaimRef(CL.uid,tid).get().then(function(d){MK.ck[tid]=0;if(!d.exists)return;var by=str((d.data()||{}).by,40),tr2=S.trades[tid];if(!tr2||tr2.st!=='open'||!IDRE.test(by))return;
    if(by===CL.uid){commitEv({k:'tcancel',tid:tid});toast(t('mk_cancelled'))}
    else{var fee=mkFee(tr2.want);commitEv(fee?{k:'tdone',tid:tid,by:by,pay:cleanPay(tr2.want),fee:fee}:{k:'tdone',tid:tid,by:by,pay:cleanPay(tr2.want)});var nm=MK.docs[by]&&MK.docs[by].name;toast('🔁 '+t('mk_done').replace('{who}',str(nm,16)||'?'))}
    afterRemove();save();marketPush();render()},function(){MK.ck[tid]=0})}
function tradeOn(){return CFG.tradeOn!==0}
function newTid(){return 't'+Date.now().toString(36)+Math.floor(rnd(1e6)).toString(36)}
function isStarter(id){return STARTERS.F.indexOf(id)>=0||STARTERS.M.indexOf(id)>=0}
function wornSlot(id){var k=Object.keys(S.eq).filter(function(sl){return S.eq[sl]===id})[0];return k||''}
/* why an item can't leave the bag ('' = it can) */
function removeBlock(id,n){var q=S.owned[id]||0;if(!ITEM[id])return 'mk_unknown';if(!(n>=1)||n>q)return 'mk_notenough';
  if(isStarter(id))return 'mk_starter';var sl=wornSlot(id);if(sl&&q-n<1)return sl==='outfit'||sl==='hair'?'mk_wornlock':'mk_worn';return ''}
function afterRemove(){Object.keys(S.owned).forEach(function(k){if(!(S.owned[k]>0))delete S.owned[k]});Object.keys(S.eq).forEach(function(sl){if(!S.owned[S.eq[sl]])delete S.eq[sl]})}
function payText(p){p=cleanPay(p);return p.item?(ITEM[p.item]?tx(ITEM[p.item].names):p.item)+' ×'+p.n:'🪙 '+p.coin}
function canPay(p){p=cleanPay(p);if(p.item)return !removeBlock(p.item,p.n);return S.coin>=p.coin}

function doSell(id,n){var b=removeBlock(id,n);if(b){toast(t(b));return false}var price=sellPrice(ITEM[id],CFG);commitEv({k:'sell',item:id,n:n,price:price});afterRemove();save();sfx('buy');
  toast(t('mk_sold').replace('{n}',n).replace('{c}',price*n));return true}
function doDiscard(id,n){var b=removeBlock(id,n);if(b){toast(t(b));return false}commitEv({k:'discard',item:id,n:n});afterRemove();save();toast(t('mk_dropped'));return true}
function doOffer(id,n,want,to){if(!tradeOn()||!CL.uid){toast(t('mk_off'));return false}if(isBound(id)){toast(t('mk_bound'));return false}var b=removeBlock(id,n);if(b){toast(t(b));return false}
  want=cleanPay(want);if(want.item&&!ITEM[want.item]){toast(t('mk_unknown'));return false}
  var openN=Object.keys(S.trades).filter(function(k){return S.trades[k]&&S.trades[k].st==='open'}).length;if(openN>=MK_MAXOPEN){toast(t('mk_max').replace('{n}',MK_MAXOPEN));return false}
  if(!want.item){var rg=mkRange(ITEM[id]);if(want.coin<rg[0]*n||want.coin>rg[1]*n){toast(t('mk_range').replace('{a}',rg[0]*n).replace('{b}',rg[1]*n));return false}}
  commitEv({k:'tout',tid:newTid(),item:id,n:n,want:want,to:to||''});afterRemove();save();marketPush();toast(t('mk_listed'));return true}
function doCancel(tid){var tr=S.trades[tid];if(!tr||tr.st!=='open')return;
  var plain=function(){var tr2=S.trades[tid];if(!tr2||tr2.st!=='open')return;commitEv({k:'tcancel',tid:tid});save();marketPush();toast(t('mk_cancelled'));render()};
  if(MK.noClaim||!CL.db)return plain();
  mkClaim(CL.uid,tid,CL.uid).then(function(r){if(r.norule)return plain();if(r.won)return plain();mkSettle(tid)},function(){toast(t('mk_neterr'))})}
function doAccept(owner,o){if(!CL.uid||owner===CL.uid||!o||!IDRE.test(o.tid||''))return;var key=o.tid+'@'+owner;if(S.treq[key]){toast(t('mk_already'));return}
  if(!canPay(o.want)){toast(t('mk_cantpay'));return}commitEv({k:'tpay',tid:o.tid,from:owner,pay:cleanPay(o.want)});afterRemove();save();marketPush();toast(t('mk_requested'))}

/* what other players can see about me */
function marketBody(){var offers=Object.keys(S.trades).map(function(k){var x=S.trades[k];return {tid:k,item:x.item,n:x.n,want:x.want,to:x.to,st:x.st,by:x.by,t:x.t}})
    .sort(function(a,b){return b.t-a.t}).filter(function(x,i){return x.st==='open'||i<60});
  var reqs=Object.keys(S.treq).map(function(k){return S.treq[k]}).filter(function(r){return r.st==='wait'}).map(function(r){return {tid:r.tid,from:r.from,pay:r.pay,t:r.t}});
  var bought=Object.keys(S.treq).map(function(k){return S.treq[k]}).filter(function(r){return r.st==='got'}).sort(function(a,b){return b.t-a.t}).slice(0,20).map(function(r){return {tid:r.tid,from:r.from}});
  return {bought:bought,name:S.name,lvl:S.lvl,cls:S.cls,gender:S.gender,look:typeof myLook==='function'?myLook():null,shop:S.shop||{n:'',c:0},offers:offers,reqs:reqs,upd:Date.now()}}
function marketPush(){if(!CL.db||!CL.uid||!S.created||CL.loggedOut)return;clearTimeout(MK.timer);MK.timer=setTimeout(function(){
  CL.db.doc('market/'+CL.uid).set(marketBody()).catch(function(){})},600)}
/* the trading board is only watched while it matters: on the market page, or while I have an open offer / a request waiting.
   (Every student watching every trade all the time used up the database's free daily reads.) */
function mkNeed(){if(UI.scr==='market'||UI.scr==='bazaar')return true;var tr=S.trades||{},rq=S.treq||{};return Object.keys(tr).some(function(k){return tr[k]&&tr[k].st==='open'})||Object.keys(rq).some(function(k){return rq[k]&&rq[k].st==='wait'})}
function mkEnsure(){if(!MK.started||!CL.db||!CL.uid)return;var need=mkNeed();
  if(need&&!MK.unsub)MK.unsub=CL.db.collection('market').onSnapshot(function(snap){var d={};snap.docs.forEach(function(x){var v=x.data();if(isO(v)&&IDRE.test(x.id))d[x.id]=v});MK.docs=d;processMarket();softRender()},function(){});
  else if(!need&&MK.unsub){try{MK.unsub()}catch(e){}MK.unsub=null}}
setInterval(mkEnsure,4000);
function startMarket(){if(MK.started||!CL.db||!CL.uid)return;MK.started=true;startWallet();mkEnsure();setTimeout(function(){mkCheckClaims(true)},3000);
  if(S.created)marketPush()}
function mkOffers(doc){return isO(doc)&&Array.isArray(doc.offers)?doc.offers.filter(function(o){return isO(o)&&IDRE.test(o.tid||'')&&IDRE.test(o.item||'')}):[]}
function mkReqs(doc){return isO(doc)&&Array.isArray(doc.reqs)?doc.reqs.filter(function(r){return isO(r)&&IDRE.test(r.tid||'')&&IDRE.test(r.from||'')}):[]}
/* finish my side of every trade the other player has moved on */
function processMarket(){if(!S.created||CL.loggedOut||!CL.uid||MK.busy)return;MK.busy=true;var changed=false;
  try{
    /* my open offers: take the earliest valid request */
    if(!MK.noClaim){Object.keys(S.trades).forEach(function(tid){if(S.trades[tid].st!=='open')return;var hit=Object.keys(MK.docs).some(function(u){var d=MK.docs[u];return u!==CL.uid&&isO(d)&&Array.isArray(d.bought)&&d.bought.some(function(b){return isO(b)&&b.tid===tid&&b.from===CL.uid})});if(hit)mkSettle(tid)});mkCheckClaims(false)}
    Object.keys(S.trades).forEach(function(tid){var tr=S.trades[tid];if(tr.st!=='open')return;var best=null;
      Object.keys(MK.docs).forEach(function(u){if(u===CL.uid)return;if(tr.to&&tr.to!==u)return;mkReqs(MK.docs[u]).forEach(function(r){
        if(r.tid===tid&&r.from===CL.uid&&samePay(r.pay,tr.want)&&(!best||int(r.t,0,9e15)<best.t))best={u:u,t:int(r.t,0,9e15)}})});
      if(best&&!MK.noClaim){(function(tid,u){if(MK.ck[tid])return;MK.ck[tid]=1;mkClaim(CL.uid,tid,u).then(function(r){MK.ck[tid]=0;if(r.norule){MK.noClaim=true;processMarket();return}mkSettle(tid)},function(){MK.ck[tid]=0})})(tid,best.u);best=null}
      if(best){var fee=mkFee(tr.want);commitEv(fee?{k:'tdone',tid:tid,by:best.u,pay:cleanPay(tr.want),fee:fee}:{k:'tdone',tid:tid,by:best.u,pay:cleanPay(tr.want)});changed=true;var nm=MK.docs[best.u]&&MK.docs[best.u].name;toast('🔁 '+t('mk_done').replace('{who}',str(nm,16)||'?'))}});
    /* my waiting requests: receive the item, or my payment back */
    Object.keys(S.treq).forEach(function(key){var r=S.treq[key];if(r.st!=='wait')return;var od=MK.docs[r.from];if(!od)return;
      var o=mkOffers(od).filter(function(x){return x.tid===r.tid})[0];if(!o)return;
      if(o.st==='open'&&!MK.noClaim){mkUpgradeReq(key,o);return}
      if(o.st==='done'&&o.by===CL.uid){commitEv({k:'tget',tid:r.tid,from:r.from,item:o.item,n:int(o.n,1,1e4)});changed=true;toast('🎁 '+t('mk_got').replace('{x}',(ITEM[o.item]?tx(ITEM[o.item].names):o.item)))}
      else if(o.st==='cancel'||(o.st==='done'&&o.by!==CL.uid)){commitEv({k:'trefund',tid:r.tid,from:r.from});changed=true;toast(t('mk_refund'))}});
  }finally{MK.busy=false}
  if(changed){afterRemove();save();marketPush();render()}}
function marketStop(){if(MK.unsub){try{MK.unsub()}catch(e){}}MK.unsub=null;MK.started=false;MK.docs={}}

/* ---------- views ---------- */
function mkName(u){var d=MK.docs[u];return d&&d.name?str(d.name,16):'?'}
function knownPlayers(){return Object.keys(MK.docs).filter(function(u){return u!==CL.uid&&MK.docs[u].name}).map(function(u){return [u,mkName(u)]})}
function offerRow(owner,o,mine){var it=ITEM[o.item];if(!it)return '';var key=o.tid+'@'+owner,rq=S.treq[key];
  var right='';
  if(mine){right=o.st==='open'?'<button class="btn sm sec" data-act="mkcancel" data-id="'+esc(o.tid)+'">'+esc(t('mk_cancel'))+'</button>':'<span class="tag">'+esc(o.st==='done'?t('mk_st_done').replace('{who}',mkName(o.by)):t('mk_st_cancel'))+'</span>'}
  else if(rq)right='<span class="tag">'+esc(rq.st==='wait'?t('mk_st_wait'):rq.st==='got'?t('mk_st_got'):t('mk_st_refund'))+'</span>';
  else right='<button class="btn sm" data-act="mkaccept" data-id="'+esc(owner+'|'+o.tid)+'"'+(canPay(o.want)&&!UI.mkBuying?'':' disabled')+'>'+esc(UI.mkBuying===key?t('mk_buying'):MK.noClaim?t('mk_accept'):t('mk_buynow'))+'</button>';
  return '<div class="mkrow"><span class="githumb">'+itemThumb(it).replace('<svg','<svg style="width:100%;height:100%"')+'</span><span class="ginm"><b>'+esc(tx(it.names))+(o.n>1?' ×'+o.n:'')+'</b><small class="mut"><span class="rtxt r-'+it.rar+'">'+esc(tx(RAR[it.rar].names))+'</span> · '+
    (mine?'':esc(t('mk_from'))+' <b>'+esc(mkName(owner))+'</b> · ')+esc(t('mk_wants'))+' <b>'+esc(payText(o.want))+'</b>'+(o.to?' · 🔒 '+esc(o.to===CL.uid?t('mk_foryou'):mkName(o.to)):'')+'</small></span>'+right+'</div>'}
VIEW.market=function(){mkEnsure();if(!CL.db||!CL.uid)return '<section class="panel"><div class="empty">'+esc(t('mk_needcloud'))+'</div></section>';
  if(!tradeOn())return '<section class="panel"><div class="empty">'+esc(t('mk_off'))+'</div></section>';
  var mine=Object.keys(S.trades).map(function(k){var x=S.trades[k];return Object.assign({tid:k},x)}).sort(function(a,b){return (a.st==='open'?0:1)-(b.st==='open'?0:1)||b.t-a.t}).slice(0,30);
  var others=[];Object.keys(MK.docs).forEach(function(u){if(u===CL.uid)return;mkOffers(MK.docs[u]).forEach(function(o){if(o.st!=='open')return;if(o.to&&o.to!==CL.uid)return;others.push({u:u,o:o})})});
  others.sort(function(a,b){return (b.o.to===CL.uid?1:0)-(a.o.to===CL.uid?1:0)||int(b.o.t,0,9e15)-int(a.o.t,0,9e15)});
  var waits=Object.keys(S.treq).map(function(k){return S.treq[k]}).filter(function(r){return r.st==='wait'});
  return '<section class="panel stack"><div class="row" style="justify-content:space-between"><h1 style="font-size:24px;margin:0">🔁 '+esc(t('mk_title'))+'</h1><button class="btn sm sec" data-act="go" data-id="wd">'+esc(t('n_wd'))+'</button></div><small class="mut">'+esc(t('mk_how'))+'</small></section>'+
   '<div class="cols"><section class="panel stack"><h2 style="font-size:20px">'+esc(t('mk_board'))+' <span class="mut num">'+others.length+'</span></h2>'+(others.length?others.slice(0,80).map(function(x){return offerRow(x.u,x.o,false)}).join(''):'<div class="empty">'+esc(t('mk_none'))+'</div>')+
   (waits.length?'<h3 style="margin:10px 0 0">'+esc(t('mk_waiting'))+'</h3>'+waits.map(function(r){return '<div class="mkrow"><span class="ginm"><b>'+esc(payText(r.pay))+'</b><small class="mut">'+esc(t('mk_to'))+' '+esc(mkName(r.from))+' · '+esc(t('mk_st_wait'))+'</small></span></div>'}).join(''):'')+'</section>'+
   '<section class="panel stack"><h2 style="font-size:20px">'+esc(t('mk_mine'))+'</h2>'+(mine.length?mine.map(function(o){return offerRow(CL.uid,o,true)}).join(''):'<div class="empty">'+esc(t('mk_nomine'))+'</div>')+
   '<small class="mut">'+esc(t('mk_tip'))+'</small></section></div>'};

/* item menu (wardrobe → manage) */
function itemMenu(md){var it=ITEM[md.id];if(!it){UI.modal=null;return ''}var q=S.owned[it.id]||0;var n=Math.max(1,Math.min(q,md.n||1));var block=removeBlock(it.id,n);var price=sellPrice(it,CFG);
  var tab=md.tab||'sell';if(isBound(it.id)&&tab==='trade')tab='sell';
  var h='<div class="item r-'+it.rar+'" style="max-width:150px;margin:0 auto"><span class="thumb">'+itemThumb(it)+'</span><span class="nm">'+esc(tx(it.names))+'</span><span class="mt">'+esc(t('owned'))+' ×'+q+'</span></div>'+
   '<div class="tabs" role="group" style="justify-content:center">'+['sell','trade','drop'].filter(function(k){return k!=='trade'||!isBound(it.id)}).map(function(k){return '<button data-act="imtab" data-id="'+k+'" aria-pressed="'+(tab===k)+'">'+esc(t('mk_tab_'+k))+'</button>'}).join('')+'</div>'+
   '<div class="fldrow"><label for="im_n">'+esc(t('mk_qty'))+'</label> <span class="qtybox"><button class="btn sm sec" data-act="imqty" data-id="-1" aria-label="-">−</button><input type="number" inputmode="numeric" class="num im-n" id="im_n" min="1" max="'+q+'" value="'+n+'"><button class="btn sm sec" data-act="imqty" data-id="1" aria-label="+">+</button>'+(q>2?'<button class="btn sm sec" data-act="imqtymax">'+esc(t('mk_all'))+' ('+q+')</button>':'')+'</span></div>';
  if(block)h+='<div class="notice warn" style="display:block">'+esc(t(block))+'</div>';
  if(tab==='sell')h+='<p style="margin:0" id="im_sellp">'+esc(t('mk_sellq').replace('{c}',price*n))+'</p><div class="row" style="justify-content:center"><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button><button class="btn" data-act="imsell" id="im_sellb"'+(block||!price?' disabled':'')+'>💰 '+esc(t('mk_sell'))+' +'+price*n+'</button></div>';
  else if(tab==='drop')h+='<p style="margin:0">'+esc(t('mk_dropq'))+'</p><div class="row" style="justify-content:center"><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button><button class="btn" style="background:var(--bad);color:#fff" data-act="imdrop"'+(block?' disabled':'')+'>🗑 '+esc(t('mk_drop'))+'</button></div>';
  else{if(!CL.db||!CL.uid||!tradeOn())h+='<div class="notice" style="display:block">'+esc(t(!tradeOn()?'mk_off':'mk_needcloud'))+'</div>';
    else{var wk=md.wk||'coin';var pl=knownPlayers();
      h+='<div class="stack mkform" style="gap:8px;text-align:left"><b>'+esc(t('mk_wantq'))+'</b><div class="tabs" role="group"><button data-act="imwk" data-id="coin" aria-pressed="'+(wk==='coin')+'">🪙 '+esc(t('coin'))+'</button><button data-act="imwk" data-id="item" aria-pressed="'+(wk==='item')+'">🎁 '+esc(t('mk_anitem'))+'</button></div>'+
       (wk==='coin'?(function(){var rg=mkRange(it),v=md.coin||rg[0]*n;return '<label>'+esc(t('mk_price'))+'<input type="number" id="im_coin" min="'+rg[0]*n+'" max="'+rg[1]*n+'" value="'+v+'"></label><small class="mut" id="im_rg">'+esc(t('mk_range').replace('{a}',rg[0]*n).replace('{b}',rg[1]*n))+' · '+esc(t('mk_fee').replace('{n}',v-mkFee({coin:v})))+'</small>'})():
        '<input id="im_q" type="search" placeholder="'+esc(t('mk_search'))+'" value="'+esc(md.q||'')+'"><select id="im_item" size="5">'+mkItemOptions(md.q||'',md.wi)+'</select><label>'+esc(t('mk_wantn'))+'<input type="number" id="im_wn" min="1" value="'+(md.wn||1)+'"></label>')+
       '<label>'+esc(t('mk_towho'))+'<select id="im_to"><option value="">'+esc(t('mk_everyone'))+'</option>'+pl.map(function(p){return '<option value="'+esc(p[0])+'"'+(md.to===p[0]?' selected':'')+'>'+esc(p[1])+'</option>'}).join('')+'</select></label></div>'+
       '<div class="row" style="justify-content:center"><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button><button class="btn" data-act="imtrade"'+(block?' disabled':'')+'>🔁 '+esc(t('mk_list'))+'</button></div>'}}
  return h}
function mkItemOptions(q,sel){q=(q||'').toLowerCase().trim();var n=0;return ITEMS.filter(function(it){if(!q)return true;return (it.id+' '+it.names.th+' '+it.names.en+' '+it.names.zh).toLowerCase().indexOf(q)>=0}).slice(0,200).map(function(it){n++;
  return '<option value="'+esc(it.id)+'"'+((sel?sel===it.id:n===1)?' selected':'')+'>'+esc(tx(it.names))+' · '+esc(tx(RAR[it.rar].names))+'</option>'}).join('')}
function imKeep(md){var g=function(id){return document.getElementById(id)};if(g('im_n')&&g('im_n').value!==''){var q0=S.owned[md.id]||1;md.n=Math.max(1,Math.min(q0,int(g('im_n').value,1,1e6,1)))}if(g('im_coin'))md.coin=int(g('im_coin').value,1,1e7,1);if(g('im_wn'))md.wn=int(g('im_wn').value,1,1e4,1);if(g('im_item'))md.wi=g('im_item').value;if(g('im_to'))md.to=g('im_to').value;if(g('im_q'))md.q=g('im_q').value}
function imSetN(v){var md=UI.modal;if(!md||md.kind!=='itemmenu')return;var it=ITEM[md.id];if(!it)return;var q=S.owned[it.id]||0;var n=Math.max(1,Math.min(q||1,int(v,1,1e6,1)));
  var b0=!!removeBlock(it.id,md.n||1),b1=!!removeBlock(it.id,n);md.n=n;if(b0!==b1){imKeep(md);md.n=n;render();return}
  var g=function(id){return document.getElementById(id)},inp=g('im_n');if(inp&&String(inp.value)!==String(n)&&document.activeElement!==inp)inp.value=n;
  var price=sellPrice(it,CFG);if(g('im_sellp'))g('im_sellp').textContent=t('mk_sellq').replace('{c}',price*n);if(g('im_sellb'))g('im_sellb').textContent='💰 '+t('mk_sell')+' +'+price*n;
  var c=g('im_coin');if(c){var rg=mkRange(it);c.min=rg[0]*n;c.max=rg[1]*n;if(!md.coinSet){c.value=rg[0]*n;md.coin=rg[0]*n}var cv=int(c.value,0,1e9,0);if(g('im_rg'))g('im_rg').textContent=t('mk_range').replace('{a}',rg[0]*n).replace('{b}',rg[1]*n)+' · '+t('mk_fee').replace('{n}',cv-mkFee({coin:cv}))}}
document.addEventListener('input',function(e){var el=e.target;if(!el||!UI.modal||UI.modal.kind!=='itemmenu')return;
  if(el.id==='im_n'){if(el.value!=='')imSetN(el.value)}
  else if(el.id==='im_coin'){UI.modal.coinSet=true;UI.modal.coin=int(el.value,0,1e7,0);var it=ITEM[UI.modal.id],cv=int(el.value,0,1e9,0),rg=it?mkRange(it):[0,0],n=UI.modal.n||1,r=document.getElementById('im_rg');if(r)r.textContent=t('mk_range').replace('{a}',rg[0]*n).replace('{b}',rg[1]*n)+' · '+t('mk_fee').replace('{n}',cv-mkFee({coin:cv}))}});
document.addEventListener('change',function(e){var el=e.target;if(el&&el.id==='im_n'&&UI.modal&&UI.modal.kind==='itemmenu')imSetN(el.value===''?1:el.value)});
function marketAct(a,id){var md=UI.modal;switch(a){
  case 'itemmenu':if(!S.owned[id])return;UI.modal={kind:'itemmenu',id:id,n:1,tab:'sell'};render();return true;
  case 'imtab':if(!md)return true;imKeep(md);md.tab=id;render();return true;
  case 'imwk':if(!md)return true;imKeep(md);md.wk=id;render();return true;
  case 'imqty':if(!md)return true;var ni=document.getElementById('im_n');imSetN((ni?int(ni.value,1,1e6,md.n||1):(md.n||1))+int(id,-1,1,0));return true;
  case 'imqtymax':if(!md)return true;imSetN(S.owned[md.id]||1);return true;
  case 'imsell':if(md&&doSell(md.id,md.n||1)){UI.modal=null;render()}return true;
  case 'imdrop':if(md&&doDiscard(md.id,md.n||1)){UI.modal=null;render()}return true;
  case 'imtrade':if(!md)return true;imKeep(md);var want=(md.wk||'coin')==='coin'?{coin:md.coin||1}:{item:md.wi,n:md.wn||1};if(want.item===md.id){toast(t('mk_same'));return true}
    if(doOffer(md.id,md.n||1,want,md.to||'')){UI.modal=null;UI.scr='market';render()}return true;
  case 'mkcancel':doCancel(id);render();return true;
  case 'mkaccept':var pa=String(id).split('|');var od=MK.docs[pa[0]];var o=mkOffers(od).filter(function(x){return x.tid===pa[1]})[0];if(o&&o.st==='open')doBuyNow(pa[0],o);render();return true;
  case 'wdmanage':UI.manage=!UI.manage;render();return true}
  return false}
