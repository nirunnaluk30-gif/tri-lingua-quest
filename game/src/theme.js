/* =====================================================================
   SITE THEME — the admin dresses up the whole site (settings/theme).
   Everyone reads it; only admins write it. Key spots: background,
   top bar, menu bar, cards, main buttons, font, title screen, notice.
   ===================================================================== */
var THEME_PRESETS={
  night:{n:m('ราตรีดาว (ค่าเริ่มต้น)','Starry night (default)','星夜(默认)'),v:{}},
  ocean:{n:m('ทะเลคราม','Deep ocean','深海'),v:{bgMode:'gradient',bg1:'#04223a',bg2:'#0a6c8c',accent:'#38d6ff',headerColor:'#062b45',navColor:'#0b3a5c',panelColor:'#0d3554',panelAlpha:80}},
  sakura:{n:m('ซากุระ','Sakura','樱花'),v:{bgMode:'gradient',bg1:'#ffe3ef',bg2:'#ffd0e4',accent:'#e0457b',headerColor:'#fff0f6',navColor:'#ffffff',panelColor:'#ffffff',panelAlpha:82}},
  forest:{n:m('ป่ามรกต','Emerald forest','翡翠森林'),v:{bgMode:'gradient',bg1:'#0b2416',bg2:'#1f5a37',accent:'#7be495',headerColor:'#0f2e1d',navColor:'#143a25',panelColor:'#123321',panelAlpha:80}},
  sunset:{n:m('อาทิตย์อัสดง','Sunset','日落'),v:{bgMode:'gradient',bg1:'#2a0f3d',bg2:'#d9573b',accent:'#ffb347',headerColor:'#3a1440',navColor:'#4a1a45',panelColor:'#3b1538',panelAlpha:78}},
  royal:{n:m('พระราชวังทอง','Golden palace','金色宫殿'),v:{bgMode:'gradient',bg1:'#1a0f05',bg2:'#5a3a10',accent:'#ffd35a',headerColor:'#22140a',navColor:'#2e1c0c',panelColor:'#2a190b',panelAlpha:82,font:'Kanit'}},
  candy:{n:m('ลูกกวาด','Candy','糖果'),v:{bgMode:'gradient',bg1:'#dff6ff',bg2:'#ffe9f7',accent:'#7a5cff',headerColor:'#ffffff',navColor:'#ffffff',panelColor:'#ffffff',panelAlpha:85,font:'Itim'}},
  classroom:{n:m('ห้องเรียน','Classroom','教室'),v:{bgMode:'gradient',bg1:'#f4f1e8',bg2:'#e6efe4',accent:'#2f7d4f',headerColor:'#fbfaf5',navColor:'#ffffff',panelColor:'#ffffff',panelAlpha:92,font:'Prompt'}}};
var THEME_FONTS=['','Mitr','Kanit','Prompt','Itim','Sriracha'];
var THEME_KEYS={bgMode:'s',bg1:'c',bg2:'c',bgImg:'u',bgDim:'n',accent:'c',headerColor:'c',navColor:'c',panelColor:'c',panelAlpha:'n',radius:'n',font:'f',
  portalImg:'u',title:'s40',tagline:'tri',notice:'tri',noticeColor:'c',stars:'b',preset:'s'};
var SITE_THEME={};
function cleanTheme(o){o=isO(o)?o:{};var c={};Object.keys(THEME_KEYS).forEach(function(k){var ty=THEME_KEYS[k],v=o[k];
  if(ty==='c'){if(typeof v==='string'&&/^#[0-9a-fA-F]{6}$/.test(v))c[k]=v.toLowerCase()}
  else if(ty==='n'){if(typeof v==='number'&&isFinite(v))c[k]=Math.round(v)}
  else if(ty==='b'){if(typeof v==='boolean')c[k]=v}
  else if(ty==='f'){if(THEME_FONTS.indexOf(v)>0)c[k]=v}
  else if(ty==='u'){if(typeof v==='string'&&v.length<250000&&(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(v)||/^\/_blob\/[A-Za-z0-9_-]{1,80}$/.test(v)||/^https:\/\/[^\s"'()<>\\]{1,400}$/.test(v)))c[k]=v}
  else if(ty==='tri'){if(isO(v)){var t3={};LANGS.forEach(function(l){t3[l]=str(v[l],200)});if(LANGS.some(function(l){return t3[l]}))c[k]=t3}}
  else if(ty==='s40'){if(typeof v==='string')c[k]=str(v,40)}
  else if(typeof v==='string')c[k]=str(v,20)});
  if(c.bgMode&&['default','gradient','image'].indexOf(c.bgMode)<0)delete c.bgMode;
  if(c.bgDim!==undefined)c.bgDim=Math.max(0,Math.min(85,c.bgDim));if(c.panelAlpha!==undefined)c.panelAlpha=Math.max(30,Math.min(100,c.panelAlpha));if(c.radius!==undefined)c.radius=Math.max(0,Math.min(28,c.radius));
  return c}
function hexRgb(h){var n=parseInt(h.slice(1),16);return [(n>>16)&255,(n>>8)&255,n&255]}
function lum(h){var c=hexRgb(h).map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
function onColor(h){return lum(h)>.42?'#141428':'#ffffff'}
function rgba(h,a){var c=hexRgb(h);return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'}
function cssUrl(u){return 'url("'+String(u).replace(/["\\\n\r]/g,'')+'")'}
/* the theme in force: what an admin is editing (live preview) or the saved one */
function themeNow(){return UI.themeDraft||SITE_THEME}
function applySiteTheme(){var th=themeNow(),el=document.getElementById('tl-theme');if(!el){el=document.createElement('style');el.id='tl-theme';document.head.appendChild(el)}
  var R='html:root:root:root',v=[],css='';
  if(th.accent){v.push('--accent:'+th.accent,'--accent-fg:'+onColor(th.accent),'--accent-soft:'+rgba(th.accent,.18))}
  if(th.panelColor){var a=(th.panelAlpha||80)/100,light=lum(th.panelColor)>.42;
    v.push('--panel:'+rgba(th.panelColor,a),'--panel2:'+rgba(th.panelColor,Math.max(.25,a-.3)),'--fg:'+(light?'#1d1f38':'#eef0ff'),'--mut:'+(light?'#575b7b':'#b3b8d8'),
      '--line:'+(light?'rgba(60,60,110,.2)':'rgba(220,220,255,.2)'),'--line2:'+(light?'rgba(60,60,110,.38)':'rgba(220,220,255,.38)'),'color-scheme:'+(light?'light':'dark'))}
  if(th.bgMode==='gradient'&&th.bg1){v.push('--bg:'+th.bg1,'--bg-img:linear-gradient(160deg,'+th.bg1+','+(th.bg2||th.bg1)+')')}
  if(th.bgMode==='image'&&th.bgImg){var d=(th.bgDim||0)/100;v.push('--bg:'+(th.bg1||'#0d1024'),'--bg-img:linear-gradient(rgba(0,0,0,'+d+'),rgba(0,0,0,'+d+')),'+cssUrl(th.bgImg))}
  if(v.length)css+=R+'{'+v.join(';')+'}';
  if(th.bgMode==='image'&&th.bgImg)css+='body{background-size:cover;background-position:center}';
  if(th.headerColor)css+='.hdr{background:'+rgba(th.headerColor,.92)+'!important;color:'+onColor(th.headerColor)+'}.hdr .logo{color:'+onColor(th.headerColor)+'}';
  if(th.navColor)css+='.nav{background:'+rgba(th.navColor,.92)+'}.nav button{color:'+(lum(th.navColor)>.42?'#4a4d6a':'#c9cdea')+'}';
  if(th.radius!==undefined)css+='.panel,.item,.mkrow{border-radius:'+th.radius+'px}.btn{border-radius:'+Math.min(th.radius,999)+'px}';
  if(th.font)css+=R+'{--f-display:\''+th.font+'\',\'Mitr\',\'Noto Sans Thai\',system-ui,sans-serif}';
  if(th.stars===false)css+='.title-screen .stars,.title-screen::before{display:none}';
  el.textContent=css}
function siteTitle(){var th=themeNow();return th.title||'TRI-LINGUA Quest'}
function siteTagline(){var th=themeNow();return th.tagline&&th.tagline[S.set.lang]?th.tagline[S.set.lang]:t('tagline')}
function noticeBar(){var th=themeNow();var n=th.notice&&(th.notice[S.set.lang]||th.notice.th||th.notice.en||th.notice.zh);if(!n)return '';var c=th.noticeColor||'#ffc54d';
  return '<div class="sitenotice" role="note" style="background:'+rgba(c,.16)+';border-color:'+rgba(c,.55)+'">📢 '+esc(n)+'</div>'}
function subscribeTheme(){if(!CL.db)return;CL.db.doc('settings/theme').onSnapshot(function(d){SITE_THEME=d.exists?cleanTheme(d.data()):{};applySiteTheme();softRender()},function(){})}

/* ---------- admin: theme designer ---------- */
function admTheme(){var d=UI.themeDraft||(UI.themeDraft=JSON.parse(JSON.stringify(SITE_THEME)));applySiteTheme();
  function col(k,label,def){return '<div class="fld"><label for="th_'+k+'">'+esc(at(label))+'</label><span class="row" style="gap:6px;flex-wrap:nowrap"><input type="color" id="th_'+k+'" data-th="'+k+'" value="'+(d[k]||def)+'"'+(d[k]?'':' data-unset="1"')+'><button class="mini" data-act="admthclr" data-id="'+k+'"'+(d[k]?'':' disabled')+'>'+esc(at('th_default'))+'</button></span></div>'}
  function rng(k,label,mn,mx,def){return '<div class="fld"><label for="th_'+k+'">'+esc(at(label))+' <b class="num">'+(d[k]===undefined?def:d[k])+'</b></label><input type="range" id="th_'+k+'" data-th="'+k+'" data-t="num" min="'+mn+'" max="'+mx+'" value="'+(d[k]===undefined?def:d[k])+'"></div>'}
  function tri(k,label){var v=d[k]||{};return '<div class="fld full"><label>'+esc(at(label))+'</label><div class="tri3">'+LANGS.map(function(l){return '<input data-th="'+k+'.'+l+'" placeholder="'+LLABEL[l]+'" value="'+esc(v[l]||'')+'">'}).join('')+'</div></div>'}
  var h='<section class="panel stack"><div class="adm-head"><h1>🎨 '+at('theme')+'</h1></div><small class="mut">'+at('th_hint')+'</small>'+
   '<div class="cfgsec"><h3>'+at('th_presets')+'</h3><div class="thpresets">'+Object.keys(THEME_PRESETS).map(function(k){var p=THEME_PRESETS[k].v;var bg=p.bg1?'linear-gradient(160deg,'+p.bg1+','+(p.bg2||p.bg1)+')':'#0d1024';
      return '<button class="thp" data-act="admthpreset" data-id="'+k+'" aria-pressed="'+(d.preset===k)+'"><span class="sw" style="background:'+bg+'"><i style="background:'+(p.accent||'#a08bff')+'"></i><i style="background:'+(p.panelColor||'#1b1f44')+'"></i></span>'+esc(tx(THEME_PRESETS[k].n))+'</button>'}).join('')+'</div></div>'+
   '<div class="cfgsec"><h3>'+at('th_bg')+'</h3><div class="tabs" role="group">'+['default','gradient','image'].map(function(k){return '<button data-act="admthbg" data-id="'+k+'" aria-pressed="'+((d.bgMode||'default')===k)+'">'+esc(at('th_bg_'+k))+'</button>'}).join('')+'</div>'+
    ((d.bgMode==='gradient')?'<div class="cfg">'+col('bg1','th_bg1','#0d1024')+col('bg2','th_bg2','#2a1f5c')+'</div>':'')+
    ((d.bgMode==='image')?'<div class="cfg"><div class="fld full"><label for="th_file">'+esc(at('th_upload'))+'</label><input type="file" id="th_file" accept="image/png,image/jpeg,image/webp"><small class="mut" id="th_upmsg">'+esc(d.bgImg?at('th_hasimg'):at('th_imgtip'))+'</small></div>'+rng('bgDim','th_dim',0,85,30)+col('bg1','th_bgbase','#0d1024')+'</div>':'')+'</div>'+
   '<div class="cfgsec"><h3>'+at('th_spots')+'</h3><div class="cfg">'+col('accent','th_accent','#a08bff')+col('headerColor','th_header','#0d1024')+col('navColor','th_nav','#1b1f44')+col('panelColor','th_panel','#1b1f44')+rng('panelAlpha','th_alpha',30,100,80)+rng('radius','th_radius',0,28,18)+
    '<div class="fld"><label for="th_font">'+esc(at('th_font'))+'</label><select id="th_font" data-th="font">'+THEME_FONTS.map(function(f){return '<option value="'+f+'"'+((d.font||'')===f?' selected':'')+(f?' style="font-family:\''+f+'\'"':'')+'>'+(f||esc(at('th_default')))+'</option>'}).join('')+'</select></div></div></div>'+
   '<div class="cfgsec"><h3>'+at('th_titlescr')+'</h3><div class="cfg"><div class="fld full"><label for="th_pfile">'+esc(at('th_portal'))+'</label><input type="file" id="th_pfile" accept="image/png,image/jpeg,image/webp"><small class="mut" id="th_pmsg">'+esc(d.portalImg?at('th_portalhas'):at('th_portaltip'))+'</small>'+(d.portalImg?'<button class="mini" data-act="admthclr" data-id="portalImg" style="justify-self:start">'+esc(at('th_default'))+'</button>':'')+'</div><div class="fld full"><label for="th_title">'+esc(at('th_title'))+'</label><input id="th_title" data-th="title" maxlength="40" placeholder="TRI-LINGUA Quest" value="'+esc(d.title||'')+'"></div>'+tri('tagline','th_tagline')+'</div></div>'+
   '<div class="cfgsec"><h3>'+at('th_notice')+'</h3><small class="mut">'+at('th_noticeh')+'</small><div class="cfg">'+tri('notice','th_noticetxt')+col('noticeColor','th_noticecol','#ffc54d')+'</div>'+noticeBar()+'</div>'+
   '<div class="row"><button class="btn" data-act="admthsave">'+at('save')+'</button><button class="btn sec" data-act="admthcancel">'+at('cancel')+'</button><button class="btn sec" data-act="admthreset" style="margin-left:auto">'+at('th_resetall')+'</button></div></section>';
  return h}
function themeInput(el){var k=el.dataset.th;if(!k||!UI.themeDraft)return false;var d=UI.themeDraft,v=el.value;
  if(el.dataset.t==='num')v=Number(v);if(k.indexOf('.')>0){var p=k.split('.');d[p[0]]=isO(d[p[0]])?d[p[0]]:{};d[p[0]][p[1]]=v}else if(k==='font'&&!v)delete d.font;else d[k]=v;
  delete d.preset;var lb=el.parentNode&&el.parentNode.querySelector('label b');if(el.type==='range'){var l2=document.querySelector('label[for="'+el.id+'"] b');if(l2)l2.textContent=v}
  UI.themeDraft=cleanTheme(d);if(d.preset)UI.themeDraft.preset=d.preset;applySiteTheme();return true}
function themeUpload(file,key){var msg=document.getElementById(key?'th_pmsg':'th_upmsg');if(!file||!/^image\//.test(file.type)){if(msg)msg.textContent=at('th_badimg');return}
  var img=new Image(),url=URL.createObjectURL(file);img.onload=function(){URL.revokeObjectURL(url);var mx=1600,sc=Math.min(1,mx/Math.max(img.width,img.height));
    var cv=document.createElement('canvas');cv.width=Math.round(img.width*sc);cv.height=Math.round(img.height*sc);cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
    var done=function(src){if(key){UI.themeDraft[key]=src}else{UI.themeDraft.bgImg=src;UI.themeDraft.bgMode='image'}delete UI.themeDraft.preset;applySiteTheme();render()};
    capUse('assets').then(function(as){if(as&&as.upload){cv.toBlob(function(b){if(msg)msg.textContent=at('th_uploading');as.upload(b).then(function(r){done(r&&r.id?'/_blob/'+r.id:r.url)},function(){done(shrink(cv))})},'image/jpeg',.82)}else done(shrink(cv))})};
  img.onerror=function(){if(msg)msg.textContent=at('th_badimg')};img.src=url}
/* no asset store: keep the picture small enough to live inside the theme document */
function shrink(cv){var q=.8,s=cv.toDataURL('image/jpeg',q);while(s.length>230000&&q>.3){q-=.1;s=cv.toDataURL('image/jpeg',q)}
  if(s.length>230000){var c2=document.createElement('canvas');c2.width=Math.round(cv.width/2);c2.height=Math.round(cv.height/2);c2.getContext('2d').drawImage(cv,0,0,c2.width,c2.height);return shrink(c2)}return s}
function themeAct(a,id){switch(a){
  case 'admthpreset':var p=THEME_PRESETS[id];if(!p)return true;var keep={title:UI.themeDraft.title,tagline:UI.themeDraft.tagline,notice:UI.themeDraft.notice,noticeColor:UI.themeDraft.noticeColor};
    UI.themeDraft=cleanTheme(Object.assign({},keep,p.v));UI.themeDraft.preset=id;render();return true;
  case 'admthbg':UI.themeDraft.bgMode=id;if(id==='default'){delete UI.themeDraft.bg1;delete UI.themeDraft.bg2}delete UI.themeDraft.preset;render();return true;
  case 'admthclr':delete UI.themeDraft[id];render();return true;
  case 'admthsave':var body=cleanTheme(UI.themeDraft);if(UI.themeDraft.preset)body.preset=UI.themeDraft.preset;
    retry(function(){return CL.db.doc('settings/theme').set(body)}).then(function(){SITE_THEME=body;UI.themeDraft=null;toast(at('th_saved'));render()},writeErr);return true;
  case 'admthcancel':UI.themeDraft=null;applySiteTheme();render();return true;
  case 'admthreset':UI.themeDraft={};applySiteTheme();render();return true}
  return false}
