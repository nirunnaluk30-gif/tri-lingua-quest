/* =====================================================================
   NEWS BOARD — the teacher posts upcoming activities (with a date) and
   game updates; everyone sees the same board on the village page.
   Stored in settings/news (admins write, everyone signed in reads).
   ===================================================================== */
Object.assign(L,{nw_title:m('📢 กระดานข่าวและกิจกรรม','📢 News & events','📢 公告与活动'),nw_empty:m('ยังไม่มีประกาศ','No announcements yet','暂无公告'),
 nw_add:m('＋ เพิ่มประกาศ','＋ Add post','＋ 新公告'),nw_edit:m('แก้ไข','Edit','编辑'),nw_del:m('ลบ','Delete','删除'),nw_save:m('บันทึกประกาศ','Save post','保存公告'),
 nw_type:m('ประเภท','Type','类型'),nw_event:m('🎉 กิจกรรม','🎉 Event','🎉 活动'),nw_update:m('🆕 อัปเดตเกม','🆕 Game update','🆕 游戏更新'),nw_notice:m('📌 ประกาศ','📌 Notice','📌 通知'),
 nw_head:m('หัวข้อ','Title','标题'),nw_text:m('รายละเอียด','Details','详情'),nw_date:m('วันที่ (กิจกรรม)','Date (for events)','日期(活动)'),nw_end:m('ถึงวันที่ (ถ้ามี)','Until (optional)','截止(可选)'),
 nw_today:m('วันนี้!','Today!','今天!'),nw_in:m('อีก {n} วัน','In {n} days','{n} 天后'),nw_now:m('กำลังจัดอยู่','Happening now','进行中'),nw_past:m('จบแล้ว','Ended','已结束'),
 nw_more:m('ดูทั้งหมด ({n})','Show all ({n})','查看全部({n})'),nw_less:m('ย่อ','Show less','收起'),nw_need:m('ใส่หัวข้อก่อน','Add a title first','请先填写标题'),nw_posted:m('โพสต์','Posted','发布于')});
var NW={items:[],unsub:null,all:false};
function cleanNews(d){var a=d&&Array.isArray(d.items)?d.items:[],re=/^\d{4}-\d{2}-\d{2}$/;return a.filter(isO).map(function(x){return {id:str(x.id,20)||('n'+Date.now().toString(36)),k:['event','update','notice'].indexOf(x.k)>=0?x.k:'notice',
  h:str(x.h,80),tx:typeof x.tx==='string'?x.tx.slice(0,400):'',d:re.test(x.d||'')?x.d:'',e:re.test(x.e||'')?x.e:'',t:int(x.t,0,9e15,0)}}).filter(function(x){return x.h}).slice(0,40)}
function startNews(){if(NW.unsub||!CL.db)return;NW.unsub=CL.db.doc('settings/news').onSnapshot(function(d){NW.items=cleanNews(d.exists?d.data():{});softRender()},function(){})}
function nwDays(a,b){return Math.round((Date.parse(a+'T00:00:00Z')-Date.parse(b+'T00:00:00Z'))/864e5)}
function nwState(x,today){if(x.k!=='event'||!x.d)return {o:2,s:''};var end=x.e&&x.e>=x.d?x.e:x.d,n=nwDays(x.d,today);
  if(n>0)return {o:0,s:t('nw_in').replace('{n}',n),soon:n<=3,n:n};if(nwDays(end,today)>=0)return {o:0,s:n===0&&end===x.d?t('nw_today'):t('nw_now'),hot:true,n:0};return {o:3,s:t('nw_past'),past:-nwDays(end,today)}}
function nwSorted(){var today=bkkDay();return NW.items.map(function(x){return {x:x,st:nwState(x,today)}})
  .filter(function(r){return CL.admin||!(r.st.past>7)})
  .sort(function(a,b){return a.st.o-b.st.o||(a.st.o===0?(a.st.n-b.st.n):b.x.t-a.x.t)})}
function nwDate(s){if(!s)return '';var d=new Date(s+'T00:00:00Z'),lg=S.set.lang;return d.toLocaleDateString(lg==='th'?'th-TH':lg==='zh'?'zh-CN':'en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'})}
function newsHtml(){startNews();var rows=nwSorted();if(!rows.length&&!CL.admin)return '';var lim=NW.all?rows.length:4,ic={event:'🎉',update:'🆕',notice:'📌'};
  var h='<section class="panel stack nw-board"><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px"><span class="eyebrow">'+esc(t('nw_title'))+'</span>'+(CL.admin?'<button class="btn sec sm" data-act="nwadd">'+esc(t('nw_add'))+'</button>':'')+'</div>';
  if(!rows.length)h+='<small class="mut">'+esc(t('nw_empty'))+'</small>';
  h+=rows.slice(0,lim).map(function(r){var x=r.x,st=r.st;return '<article class="nw-item nw-'+x.k+(st.hot?' hot':'')+(st.past?' past':'')+'">'+
    '<div class="nw-ic" aria-hidden="true">'+ic[x.k]+'</div><div class="nw-body"><div class="nw-top"><b>'+esc(x.h)+'</b>'+(st.s?'<span class="nw-when'+(st.hot?' hot':st.soon?' soon':'')+'">'+esc(st.s)+'</span>':'')+'</div>'+
    (x.d?'<small class="mut">📅 '+esc(nwDate(x.d))+(x.e&&x.e!==x.d?' – '+esc(nwDate(x.e)):'')+'</small>':(x.t?'<small class="mut">'+esc(t('nw_posted'))+' '+esc(nwDate(bkkDay(x.t)))+'</small>':''))+
    (x.tx?'<p>'+esc(x.tx).replace(/\n/g,'<br>')+'</p>':'')+
    (CL.admin?'<div class="row" style="gap:6px"><button class="mini" data-act="nwedit" data-id="'+esc(x.id)+'">✏️ '+esc(t('nw_edit'))+'</button><button class="mini danger" data-act="nwdel" data-id="'+esc(x.id)+'">🗑 '+esc(t('nw_del'))+'</button></div>':'')+'</div></article>'}).join('');
  if(rows.length>4)h+='<button class="btn sec sm" data-act="nwall" style="justify-self:center">'+esc(NW.all?t('nw_less'):t('nw_more').replace('{n}',rows.length))+'</button>';
  return h+'</section>'}
function nwModal(md){if(md.kind!=='news')return null;var x=md.x||{k:'event',h:'',tx:'',d:bkkDay(),e:''};
  return {body:'<h2>📢 '+esc(md.x&&md.x.id?t('nw_edit'):t('nw_add'))+'</h2><div class="form" style="text-align:left">'+
   '<label class="fld">'+esc(t('nw_type'))+'<select id="nw_k">'+['event','update','notice'].map(function(k){return '<option value="'+k+'"'+(x.k===k?' selected':'')+'>'+esc(t('nw_'+k))+'</option>'}).join('')+'</select></label>'+
   '<label class="fld full">'+esc(t('nw_head'))+'<input id="nw_h" maxlength="80" value="'+esc(x.h)+'"></label>'+
   '<label class="fld full">'+esc(t('nw_text'))+'<textarea id="nw_tx" maxlength="400" style="min-height:90px">'+esc(x.tx)+'</textarea></label>'+
   '<label class="fld">'+esc(t('nw_date'))+'<input type="date" id="nw_d" value="'+esc(x.d)+'"></label><label class="fld">'+esc(t('nw_end'))+'<input type="date" id="nw_e" value="'+esc(x.e)+'"></label></div>'+
   '<p class="err" id="nw_err"></p><div class="row" style="justify-content:center"><button class="btn sec" data-act="closemodal">'+esc(t('cancel'))+'</button><button class="btn" data-act="nwsave" data-id="'+esc(x.id||'')+'">'+esc(t('nw_save'))+'</button></div>'}}
function nwWrite(items){return CL.db.doc('settings/news').set({items:items,upd:Date.now()})}
function newsAct(a,id){if(a.indexOf('nw')!==0)return false;
  if(a==='nwall'){NW.all=!NW.all;render();return true}
  if(!CL.admin)return true;
  if(a==='nwadd'){UI.modal={kind:'news'};render();return true}
  if(a==='nwedit'){var x=NW.items.filter(function(i){return i.id===id})[0];if(x){UI.modal={kind:'news',x:JSON.parse(JSON.stringify(x))};render()}return true}
  if(a==='nwdel'){var it=NW.items.filter(function(i){return i.id!==id});nwWrite(it).then(function(){NW.items=it;toast(at('saved'));render()},writeErr);return true}
  if(a==='nwsave'){var g=function(i){var e=document.getElementById(i);return e?e.value:''},h=g('nw_h').trim();if(!h){var er=document.getElementById('nw_err');if(er)er.textContent=t('nw_need');return true}
    var rec=cleanNews({items:[{id:id||('n'+Date.now().toString(36)),k:g('nw_k'),h:h,tx:g('nw_tx'),d:g('nw_d'),e:g('nw_e'),t:id?((NW.items.filter(function(i){return i.id===id})[0]||{}).t||Date.now()):Date.now()}]})[0];
    var list=NW.items.filter(function(i){return i.id!==rec.id});list.unshift(rec);list=list.slice(0,40);
    nwWrite(list).then(function(){NW.items=list;UI.modal=null;toast(at('saved'));render()},writeErr);return true}
  return true}
