/* =====================================================================
   PROFILE FRAMES v2 — layered "premium" frames (original designs).
   Frame box: viewBox 0 0 200 240, opening ≈ 16..184 × 16..224.
   Layers, back to front: outer aura → back effects (wings, flames,
   rings) → bevelled metal body → corner ornaments → crest → banner → fx.
   ===================================================================== */
var _frN=0,_frJ=0;
function frX(n){return Math.round(n*10)/10}
function frHex(c){c=String(c||'#888888').replace('#','');if(c.length===3)c=c.split('').map(function(x){return x+x}).join('');var n=parseInt(c,16)||0;return [n>>16&255,n>>8&255,n&255]}
function frMix(a,b,t){var x=frHex(a),y=frHex(b);return '#'+x.map(function(v,i){var r=Math.round(v+(y[i]-v)*t);return ('0'+r.toString(16)).slice(-2)}).join('')}
function frLt(c,t){return frMix(c,'#ffffff',t)}
function frDk(c,t){return frMix(c,'#000000',t)}
function frRR(x,y,w,h,r){return 'M'+(x+r)+' '+y+'H'+(x+w-r)+'Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+r)+'V'+(y+h-r)+'Q'+(x+w)+' '+(y+h)+' '+(x+w-r)+' '+(y+h)+'H'+(x+r)+'Q'+x+' '+(y+h)+' '+x+' '+(y+h-r)+'V'+(y+r)+'Q'+x+' '+y+' '+(x+r)+' '+y+'Z'}
function frIn(k,r){return frRR(k,k,200-2*k,240-2*k,r)}
function frLG(id,stops,x1,y1,x2,y2){return '<linearGradient id="'+id+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'">'+stops.map(function(s){return '<stop offset="'+s[0]+'" stop-color="'+s[1]+'"'+(s[2]!=null?' stop-opacity="'+s[2]+'"':'')+'/>'}).join('')+'</linearGradient>'}
function frRG(id,stops){return '<radialGradient id="'+id+'" cx=".5" cy=".5" r=".5">'+stops.map(function(s){return '<stop offset="'+s[0]+'" stop-color="'+s[1]+'"'+(s[2]!=null?' stop-opacity="'+s[2]+'"':'')+'/>'}).join('')+'</radialGradient>'}
/* polished metal: diagonal light bands */
function frMetal(id,c){return frLG(id,[[0,frDk(c,.5)],[.14,frLt(c,.7)],[.3,c],[.48,frDk(c,.38)],[.66,frLt(c,.55)],[.82,c],[1,frDk(c,.55)]],0,0,1,1)}
function frFour(g){return '<g>'+g+'</g><g transform="translate(200 0) scale(-1 1)">'+g+'</g><g transform="translate(0 240) scale(1 -1)">'+g+'</g><g transform="translate(200 240) scale(-1 -1)">'+g+'</g>'}
function frTop2(g){return '<g>'+g+'</g><g transform="translate(200 0) scale(-1 1)">'+g+'</g>'}
function frBot2(g){return '<g transform="translate(0 240) scale(1 -1)">'+g+'</g><g transform="translate(200 240) scale(-1 -1)">'+g+'</g>'}
function frPair(g){return frTop2(g)}
function frOut(u,g){return '<g mask="url(#'+u+'o)">'+g+'</g>'}
/* shared defs: drop shadow, glow, blur, outside-only mask, top highlight, gold/silver metals + per-frame extras */
function frBase(u,a,b,extra){return '<defs>'+
  '<filter id="'+u+'sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2.6" stdDeviation="2.2" flood-color="#000" flood-opacity=".6"/></filter>'+
  cglow(u+'g',2.4)+'<filter id="'+u+'bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5.5"/></filter>'+
  '<mask id="'+u+'o" maskUnits="userSpaceOnUse" x="-80" y="-80" width="360" height="400"><rect x="-80" y="-80" width="360" height="400" fill="#fff"/><rect x="15" y="15" width="170" height="210" rx="8" fill="#000"/></mask>'+
  frLG(u+'hi',[[0,'#ffffff',.95],[.4,'#ffffff',.2],[1,'#ffffff',0]],0,0,0,1)+
  frMetal(u+'au','#e8b030')+frMetal(u+'ag','#c8d0dc')+frMetal(u+'m',a)+frMetal(u+'n',b)+(extra||'')+'</defs>'}
/* bevelled band: shadowed body, top highlight, inner shadow, bright lip */
function frBody(u,o,i,r1,r2,fill,edge,lip){return '<path fill-rule="evenodd" d="'+frIn(o,r1)+frIn(i,r2)+'" fill="'+fill+'" stroke="'+edge+'" stroke-width="1.6" filter="url(#'+u+'sh)"/>'+
  '<path d="'+frIn(o+1.8,Math.max(r1-1.8,1))+'" fill="none" stroke="url(#'+u+'hi)" stroke-width="1.4"/>'+
  '<path d="'+frIn(i-1.5,r2+1.5)+'" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="2"/>'+
  '<path d="'+frIn(i,r2)+'" fill="none" stroke="'+(lip||'#ffffff')+'" stroke-opacity=".9" stroke-width="1.1"/>'}
function frGroove(k,r,dark,light){return '<path d="'+frIn(k,r)+'" fill="none" stroke="'+dark+'" stroke-opacity=".6" stroke-width="1"/><path d="'+frIn(k+.9,r)+'" fill="none" stroke="'+light+'" stroke-opacity=".5" stroke-width=".8"/>'}
function frAura(u,c,w,op,dur){return frOut(u,'<path d="'+frIn(5,14)+'" fill="none" stroke="'+c+'" stroke-width="'+w+'" opacity="'+op+'" filter="url(#'+u+'bl)">'+(dur?'<animate attributeName="opacity" values="'+op+';'+frX(op*.4)+';'+op+'" dur="'+dur+'s" repeatCount="indefinite"/>':'')+'</path>')}
function frRivet(x,y,r,c){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+frDk(c,.55)+'"/><circle cx="'+frX(x-.4)+'" cy="'+frX(y-.4)+'" r="'+frX(r*.78)+'" fill="'+frLt(c,.2)+'"/><circle cx="'+frX(x-r*.35)+'" cy="'+frX(y-r*.35)+'" r="'+frX(r*.3)+'" fill="#fff" opacity=".85"/>'}
/* faceted gem with metal setting, glow and a twinkle */
function frGem(u,x,y,r,c,set,shape){var id=u+'j'+(++_frJ),s='<defs><radialGradient id="'+id+'" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".22" stop-color="'+frLt(c,.45)+'"/><stop offset=".62" stop-color="'+c+'"/><stop offset="1" stop-color="'+frDk(c,.6)+'"/></radialGradient></defs>';
  s+='<circle cx="'+x+'" cy="'+y+'" r="'+frX(r*1.8)+'" fill="'+c+'" opacity=".4" filter="url(#'+u+'g)"/>';
  if(shape==='round'){if(set)s+='<circle cx="'+x+'" cy="'+y+'" r="'+frX(r*1.36)+'" fill="'+set+'" stroke="#2a1800" stroke-width=".8"/>';
    s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="url(#'+id+')" stroke="'+frDk(c,.6)+'" stroke-width=".8"/><ellipse cx="'+frX(x-r*.3)+'" cy="'+frX(y-r*.38)+'" rx="'+frX(r*.38)+'" ry="'+frX(r*.22)+'" fill="#fff" opacity=".8"/>'}
  else{var n=shape==='hex'?6:4,P=function(k){var p=[];for(var i=0;i<n;i++){var an=-Math.PI/2+i*2*Math.PI/n;p.push([frX(x+Math.cos(an)*k*(n===4?.8:1)),frX(y+Math.sin(an)*k)])}return p},J=function(p){return p.map(function(q){return q.join(' ')}).join(' ')};
    var o=P(r*1.42),bd=P(r);if(set)s+='<polygon points="'+J(o)+'" fill="'+set+'" stroke="#2a1800" stroke-width=".8"/>';
    s+='<polygon points="'+J(bd)+'" fill="url(#'+id+')" stroke="'+frDk(c,.6)+'" stroke-width=".8"/>'+bd.map(function(q){return '<path d="M'+x+' '+y+'L'+q[0]+' '+q[1]+'" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>'}).join('')+
      '<polygon points="'+J(P(r*.45))+'" fill="#fff" opacity=".28"/>'}
  return s+'<g opacity="0">'+hstar(frX(x-r*.4),frX(y-r*.5),frX(r*.6),'#fff')+'<animate attributeName="opacity" values="0;1;0;0" dur="2.8s" begin="'+((_frJ%5)*.5)+'s" repeatCount="indefinite"/></g>'}
/* bottom rank ribbon with folded tails */
function frBanner(u,y,w,txt,fill,dark,col,fs){var x0=100-w/2,x1=100+w/2;
  return '<g filter="url(#'+u+'sh)"><path d="M'+(x0+8)+' '+(y-4)+'H'+(x0-16)+'l7 8-7 8H'+(x0+8)+'z" fill="'+dark+'"/><path d="M'+(x1-8)+' '+(y-4)+'H'+(x1+16)+'l-7 8 7 8H'+(x1-8)+'z" fill="'+dark+'"/>'+
   '<path d="M'+x0+' '+(y+9)+'l8 3v-5zM'+x1+' '+(y+9)+'l-8 3v-5z" fill="#000" opacity=".5"/>'+
   '<path d="M'+x0+' '+(y-9)+'Q100 '+(y-13)+' '+x1+' '+(y-9)+'V'+(y+9)+'Q100 '+(y+5)+' '+x0+' '+(y+9)+'z" fill="'+fill+'" stroke="'+dark+'" stroke-width="1.2"/>'+
   '<path d="M'+(x0+3)+' '+(y-6.5)+'Q100 '+(y-10.5)+' '+(x1-3)+' '+(y-6.5)+'" stroke="#fff" stroke-opacity=".6" stroke-width="1" fill="none"/></g>'+
   '<text x="100" y="'+frX(y+3.4)+'" text-anchor="middle" font-size="'+(fs||9.5)+'" font-weight="900" letter-spacing="1.6" fill="'+col+'" stroke="'+dark+'" stroke-width="2.4" stroke-linejoin="round" paint-order="stroke" font-family="system-ui,sans-serif">'+txt+'</text>'}
/* layered metal wing on the left (mirror with frPair); feathers burst outward */
function frWing(fill,edge,n,len,anim){var s='';for(var i=n-1;i>=0;i--){var rx=14,ry=24+i*11,tx=frX(-12-len*(1-i/n*.55)),ty=frX(-16+i*(16+len*.08)),mx=(rx+tx)/2,my=(ry+ty)/2;
    s+='<path d="M'+rx+' '+ry+'Q'+frX(mx-4)+' '+frX(my-12)+' '+tx+' '+ty+'Q'+frX(mx+7)+' '+frX(my+9)+' '+rx+' '+(ry+14)+'Z" fill="'+fill+'" stroke="'+edge+'" stroke-width="1.1"/><path d="M'+rx+' '+(ry+4)+'Q'+frX(mx)+' '+frX(my-2)+' '+tx+' '+ty+'" stroke="#fff" stroke-opacity=".55" stroke-width=".8" fill="none"/>'}
  return anim?'<g>'+s+'<animateTransform attributeName="transform" type="rotate" values="0 14 40;-5 14 40;0 14 40" dur="'+anim+'s" repeatCount="indefinite"/></g>':s}
function frShield(u,y,s,fill,edge){var P=function(k){return 'M100 '+frX(y-k*1.15)+'L'+frX(100+k)+' '+frX(y-k*.45)+'L'+frX(100+k*.82)+' '+frX(y+k*.55)+'L100 '+frX(y+k*1.25)+'L'+frX(100-k*.82)+' '+frX(y+k*.55)+'L'+frX(100-k)+' '+frX(y-k*.45)+'Z'};
  return '<path d="'+P(s)+'" fill="'+fill+'" stroke="'+edge+'" stroke-width="1.4" filter="url(#'+u+'sh)"/><path d="'+P(s*.76)+'" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>'}
function frCrown(u,y,w,h,fill,edge){var x0=100-w/2,x1=100+w/2;
  return '<g filter="url(#'+u+'sh)"><path d="M'+x0+' '+y+'L'+(x0-5)+' '+(y-h)+'L'+frX(x0+w*.24)+' '+frX(y-h*.42)+'L100 '+frX(y-h*1.2)+'L'+frX(x0+w*.76)+' '+frX(y-h*.42)+'L'+(x1+5)+' '+(y-h)+'L'+x1+' '+y+'Z" fill="'+fill+'" stroke="'+edge+'" stroke-width="1.4"/>'+
   '<rect x="'+(x0-2)+'" y="'+(y-3)+'" width="'+(w+4)+'" height="8" rx="3" fill="'+fill+'" stroke="'+edge+'" stroke-width="1.2"/></g>'+
   '<circle cx="'+(x0-5)+'" cy="'+(y-h)+'" r="3" fill="#fff6d0" stroke="'+edge+'"/><circle cx="'+(x1+5)+'" cy="'+(y-h)+'" r="3" fill="#fff6d0" stroke="'+edge+'"/><circle cx="100" cy="'+frX(y-h*1.2)+'" r="3.6" fill="#fff6d0" stroke="'+edge+'"/>'}
function frHalo(u,y,rx,c,dur){return '<ellipse cx="100" cy="'+y+'" rx="'+rx+'" ry="'+frX(rx*.22)+'" fill="none" stroke="'+c+'" stroke-width="3" filter="url(#'+u+'g)"><animate attributeName="opacity" values="1;.45;1" dur="'+(dur||2.6)+'s" repeatCount="indefinite"/></ellipse><ellipse cx="100" cy="'+y+'" rx="'+rx+'" ry="'+frX(rx*.22)+'" fill="none" stroke="#fff" stroke-width="1"/>'}
/* flame tongue at (x,y) pointing "up" after rotating by ang */
function frFlame(x,y,h,ang,fill,core,dur){var w=h*.42;return '<g transform="translate('+x+' '+y+') rotate('+ang+')"><g><path d="M'+frX(-w)+' 0Q'+frX(-w*1.2)+' '+frX(-h*.55)+' 0 '+(-h)+'Q'+frX(w*.3)+' '+frX(-h*.6)+' '+frX(w)+' 0Z" fill="'+fill+'"/><path d="M'+frX(-w*.5)+' 0Q'+frX(-w*.6)+' '+frX(-h*.4)+' 0 '+frX(-h*.62)+'Q'+frX(w*.2)+' '+frX(-h*.38)+' '+frX(w*.5)+' 0Z" fill="'+core+'"/><animateTransform attributeName="transform" type="scale" values="1 1;1.06 1.2;.94 .9;1 1" dur="'+dur+'s" repeatCount="indefinite"/></g></g>'}
/* flickering electric arc between two points */
function frArc(u,x1,y1,x2,y2,seed,col,dur,beg){var p=[[x1,y1]],dx=x2-x1,dy=y2-y1,L=Math.sqrt(dx*dx+dy*dy)||1,nx=-dy/L,ny=dx/L;
  for(var i=1;i<7;i++){var j=Math.sin(seed*13.7+i*7.3)*5;p.push([frX(x1+dx*i/7+nx*j),frX(y1+dy*i/7+ny*j)])}p.push([x2,y2]);var pts=p.map(function(q){return q.join(',')}).join(' ');
  return '<g opacity="0" filter="url(#'+u+'g)"><polyline points="'+pts+'" fill="none" stroke="'+col+'" stroke-width="2"/><polyline points="'+pts+'" fill="none" stroke="#fff" stroke-width=".7"/><animate attributeName="opacity" values="0;1;.3;1;0;0;0" dur="'+dur+'s" begin="'+(beg||0)+'s" repeatCount="indefinite"/></g>'}
function frEmbers(u,c,n,y0,rise){var s='';for(var k=0;k<n;k++){var x=frX(8+((k*53)%184)),d=frX(1.8+(k%4)*.45),b=frX(k*.37%2.2);
    s+='<circle cx="'+x+'" cy="'+y0+'" r="'+frX(1.2+k%3*.6)+'" fill="'+c+'" filter="url(#'+u+'g)" opacity="0"><animate attributeName="cy" values="'+y0+';'+(y0-rise)+'" dur="'+d+'s" begin="'+b+'s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="'+d+'s" begin="'+b+'s" repeatCount="indefinite"/></circle>'}return s}
/* twinkling dust spread just outside the border */
function frDust(c,n,seed){var s='';for(var k=0;k<n;k++){var t=((k*0.618+seed)%1),per=t*880,x,y,o=4+((k*7)%10);
    if(per<200){x=per;y=-o}else if(per<440){x=200+o;y=per-200}else if(per<640){x=200-(per-440);y=240+o}else{x=-o;y=240-(per-640)}
    s+='<g opacity="0">'+hstar(frX(x),frX(y),frX(1.8+k%3),c)+'<animate attributeName="opacity" values="0;1;0" dur="'+frX(1.6+k%5*.4)+'s" begin="'+frX(k*.29%2)+'s" repeatCount="indefinite"/></g>'}return s}
function frOrbit(u,rx,ry,col,w,dash,dur,rev){return frOut(u,'<ellipse cx="100" cy="120" rx="'+rx+'" ry="'+ry+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-dasharray="'+dash+'"><animateTransform attributeName="transform" type="rotate" from="'+(rev?360:0)+' 100 120" to="'+(rev?0:360)+' 100 120" dur="'+dur+'s" repeatCount="indefinite"/></ellipse>')}
/* corner pieces (drawn for the top-left corner, mirrored with frFour) */
function frBracket(fill,edge,rc){return '<path d="M-3 -3H42L33 7H7V33L-3 42Z" fill="'+fill+'" stroke="'+edge+'" stroke-width="1.3"/><path d="M-1 -1H38" stroke="#fff" stroke-opacity=".55"/>'+frRivet(3,3,2.6,rc)+frRivet(22,2,1.8,rc)+frRivet(2,22,1.8,rc)}
function frFiligree(c,edge){var d='M2 50C-4 24 8 4 36 0C22 9 17 18 20 28C22 35 30 34 30 28C30 23 25 22 23 25M50 2C26 -2 10 10 6 30';
  return '<path d="'+d+'" fill="none" stroke="'+edge+'" stroke-width="5" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="3" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round"/>'}
function frSpikes(fill,edge){return '<path d="M16 6L-16 -18L6 2Z" fill="'+fill+'" stroke="'+edge+'" stroke-width="1.1"/><path d="M6 16L-18 -16L2 6Z" fill="'+fill+'" stroke="'+edge+'" stroke-width="1.1"/><path d="M12 10L-22 -22L10 12Z" fill="'+fill+'" stroke="'+edge+'" stroke-width="1.1"/>'}
var FRAMES={
 /* ================= COMMON — grounded wood, stone, steel ================= */
 wood:{n:m('กรอบไม้โอ๊ค','Oak Frame','橡木相框'),d:function(a,b,u){var gr='',k;
  for(k=0;k<6;k++)gr+='<path d="M'+(14+k*30)+' 7q7-2 14 0t14 0M'+(10+k*30)+' 11q7 2 14 0t14 0M'+(14+k*30)+' 229q7-2 14 0t14 0M'+(10+k*30)+' 233q7 2 14 0" stroke="'+frDk(b,.35)+'" stroke-opacity=".6" stroke-width=".8" fill="none"/>';
  for(k=0;k<7;k++)gr+='<path d="M7 '+(20+k*30)+'q-2 7 0 14t0 14M11 '+(16+k*30)+'q2 7 0 14M193 '+(20+k*30)+'q2 7 0 14t0 14M189 '+(16+k*30)+'q-2 7 0 14" stroke="'+frDk(b,.35)+'" stroke-opacity=".6" stroke-width=".8" fill="none"/>';
  return frBase(u,a,b,frLG(u+'w',[[0,frLt(a,.25)],[.5,a],[1,b]],0,0,0,1))+frBody(u,2,15,10,6,'url(#'+u+'w)','#3a2008','#ffe0b0')+gr+
   frFour(frBracket('url(#'+u+'au)','#5a3a08','#c89040'))+frRivet(100,8.5,2.4,'#8a8e98')+frRivet(100,231.5,2.4,'#8a8e98')+frRivet(8.5,120,2.4,'#8a8e98')+frRivet(191.5,120,2.4,'#8a8e98')}},
 stone:{n:m('กรอบหินแกรนิต','Granite Frame','花岗岩相框'),d:function(a,b,u){var sm='';[40,80,120,160].forEach(function(x){sm+='<path d="M'+x+' 3v12M'+x+' 225v12" stroke="#2a2a30" stroke-width="1.2"/>'});[50,100,150,190].forEach(function(y){sm+='<path d="M3 '+y+'h12M185 '+y+'h12" stroke="#2a2a30" stroke-width="1.2"/>'});
  return frBase(u,a,b,frLG(u+'w',[[0,frLt(a,.3)],[.45,a],[1,b]],0,0,1,1))+frBody(u,2,16,7,5,'url(#'+u+'w)','#24242a','#e8e8f0')+sm+
   '<path d="M30 5l5 5-3 4M150 233l5-6 6 3M7 136l6 3-2 6M193 70l-6 4 2 6" stroke="#202026" stroke-width="1" fill="none"/>'+
   frFour(frBracket('url(#'+u+'n)','#1a1a20','#8a8e98'))+
   '<path d="M-2 66q6-10 4-22q6 6 6 16M202 176q-6-10-4-22q-6 6-6 16" fill="#4fae5a" stroke="#2a6a30" stroke-width=".8"/>'}},
 ribbon:{n:m('กรอบริบบิ้นฟ้า','Sky Ribbon Frame','天蓝缎带相框'),d:function(a,b,u){var st=frMix(a,'#c8d0dc',.5);
  return frBase(u,st,b,frLG(u+'r',[[0,frLt(b,.35)],[1,frDk(b,.25)]],0,0,0,1))+frBody(u,2,15,12,7,'url(#'+u+'m)',frDk(b,.5),'#ffffff')+
   '<path d="'+frIn(8.5,10)+'" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="3 3" opacity=".85"/>'+frFour(frRivet(8,8,2.6,'#c8d0dc'))+
   '<g filter="url(#'+u+'sh)" transform="translate(100 6)"><path d="M-4 2L-14 26l6-3 3 7 7-26zM4 2L14 26l-6-3-3 7-7-26z" fill="url(#'+u+'r)" stroke="'+frDk(b,.4)+'" stroke-width="1"/>'+
   '<path d="M0 0C-8 -16 -30 -16 -26 -2C-24 8 -8 6 0 0ZM0 0C8 -16 30 -16 26 -2C24 8 8 6 0 0Z" fill="url(#'+u+'r)" stroke="'+frDk(b,.4)+'" stroke-width="1.2"/><path d="M-4 -3C-10 -10 -20 -10 -20 -4M4 -3C10 -10 20 -10 20 -4" stroke="#fff" stroke-opacity=".6" fill="none"/>'+
   '<rect x="-6" y="-6" width="12" height="11" rx="4" fill="'+b+'" stroke="'+frDk(b,.45)+'"/><path d="M-3 -3h4" stroke="#fff" stroke-opacity=".7"/></g>'}},
 /* ================= UNCOMMON — polished silver, bronze, sapphire ================= */
 silver:{n:m('กรอบเงินขัดเงา','Polished Silver Frame','亮银相框'),d:function(a,b,u){var ro='<circle cx="8" cy="8" r="11" fill="url(#'+u+'ag)" stroke="#4a5266" stroke-width="1.2"/>';for(var i=0;i<8;i++)ro+='<ellipse cx="8" cy="0" rx="2.6" ry="4.5" fill="url(#'+u+'ag)" stroke="#4a5266" stroke-width=".7" transform="rotate('+(i*45)+' 8 8)"/>';
  return frBase(u,a,b)+frBody(u,2,16,12,7,'url(#'+u+'ag)','#3a4256','#ffffff')+frGroove(9,9,'#4a5266','#ffffff')+
   frFour(ro+frGem(u,8,8,3.4,'#4a9aff',null,'round'))+'<path d="M74 4C82 -6 92 -2 92 4M126 4C118 -6 108 -2 108 4" stroke="url(#'+u+'ag)" stroke-width="3" fill="none" stroke-linecap="round"/>'+frGem(u,100,3,6,'#3a8aff','url(#'+u+'ag)','four')}},
 spring:{n:m('กรอบใบไม้ผลิ','Spring Leaf Frame','春叶相框'),d:function(a,b,u){var lf=function(x,y,r,s){return '<path d="M0 0Q8 -7 16 0Q8 7 0 0Z" fill="url(#'+u+'lf)" stroke="#1f6a3a" stroke-width=".7" transform="translate('+x+' '+y+') rotate('+r+') scale('+(s||1)+')"/>'};
  var fl=function(x,y){var p='';for(var i=0;i<5;i++)p+='<ellipse cx="'+x+'" cy="'+(y-4)+'" rx="2.6" ry="4" fill="#ffb3d0" stroke="#e0709a" stroke-width=".5" transform="rotate('+(i*72)+' '+x+' '+y+')"/>';return p+'<circle cx="'+x+'" cy="'+y+'" r="2" fill="#ffd35a"/>'};
  var vine='<path d="M44 -2C30 8 14 4 6 16S2 36 -4 46" stroke="#2f7a3a" stroke-width="2.2" fill="none"/>'+lf(36,1,-160,1.1)+lf(22,6,-120,1.2)+lf(10,10,170)+lf(3,24,120,1.1)+lf(-1,38,150,.9)+lf(28,2,-40,.8)+fl(8,8);
  return frBase(u,'#b8834a',b,frLG(u+'lf',[[0,frLt(a,.3)],[1,b]],0,0,1,1))+frBody(u,2,15,12,7,'url(#'+u+'m)','#4a2a08','#ffe8c0')+frGroove(8.5,9,'#4a2a08','#ffe8c0')+frFour(vine)+
   '<g transform="translate(100 3)">'+lf(-2,0,-150,1.2)+lf(2,0,-30,1.2)+fl(0,-2)+'</g>'}},
 wave:{n:m('กรอบคลื่นทะเล','Ocean Wave Frame','海浪相框'),d:function(a,b,u){var bub='';[[2,200],[198,170],[4,120],[196,90]].forEach(function(p,i){bub+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(2+i%2)+'" fill="none" stroke="#fff" stroke-width="1" opacity="0"><animate attributeName="cy" values="'+p[1]+';'+(p[1]-60)+'" dur="'+(3+i*.4)+'s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.9;0" dur="'+(3+i*.4)+'s" repeatCount="indefinite"/></circle>'});
  var curl='<path d="M-8 222C-10 204 6 196 18 204C10 204 6 212 12 218C18 224 30 220 30 210C36 226 24 244 4 244C-4 242 -8 234 -8 222Z" fill="url(#'+u+'wv)" stroke="'+frDk(b,.3)+'" stroke-width="1.2"/><path d="M2 214C4 206 10 204 14 206" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/>';
  return frBase(u,frMix(a,'#c8d0dc',.45),b,frLG(u+'wv',[[0,'#ffffff'],[.35,a],[1,b]],0,0,1,1))+bub+frBody(u,2,15,12,7,'url(#'+u+'m)',frDk(b,.45),'#ffffff')+
   frGroove(8.5,9,frDk(b,.4),'#ffffff')+curl+'<g transform="translate(200 0) scale(-1 1)">'+curl+'</g>'+
   '<path d="M76 6C84 -8 116 -8 124 6" fill="url(#'+u+'wv)" stroke="'+frDk(b,.3)+'" stroke-width="1.2" filter="url(#'+u+'sh)"/>'+frGem(u,100,2,5,'#f0f4ff','url(#'+u+'ag)','round')}},
 /* ================= RARE — bronze & silver with tech lines, runes, elemental wisps ================= */
 circuit:{n:m('กรอบวงจรทองแดง','Copper Circuit Frame','铜电路相框'),d:function(a,b,u){var nodes=[[8.5,60],[191.5,180],[60,8.5],[140,231.5],[8.5,170],[191.5,70]].map(function(p,i){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.2" fill="'+b+'" filter="url(#'+u+'g)"><animate attributeName="opacity" values=".25;1;.25" dur="1.4s" begin="'+(i*.23)+'s" repeatCount="indefinite"/></circle>'}).join('');
  var chip='<rect x="-6" y="-6" width="22" height="22" rx="3" fill="#1a0e08" stroke="url(#'+u+'m)" stroke-width="2.4"/><path d="M-1 3h12M5 -3v12M-1 9h4" stroke="'+b+'" stroke-width="1.4" filter="url(#'+u+'g)"/><path d="M-10 0h4M-10 8h4M0 -10v4M8 -10v4" stroke="url(#'+u+'m)" stroke-width="2"/>';
  return frBase(u,a,b,frLG(u+'rk',[[0,frLt(a,.3)],[1,frDk(a,.35)]],0,0,0,1))+frBody(u,2,15,8,5,'url(#'+u+'m)','#2a1408','#ffd0a0')+
   '<path d="'+frIn(8.5,6)+'" fill="none" stroke="'+b+'" stroke-width="1.3" stroke-dasharray="12 6 3 6" filter="url(#'+u+'g)"><animate attributeName="stroke-dashoffset" values="0;-108" dur="3s" repeatCount="indefinite"/></path>'+nodes+frFour(chip)+
   '<g filter="url(#'+u+'sh)"><path d="M70 2h16l4-6h20l4 6h16" stroke="url(#'+u+'m)" stroke-width="3" fill="none"/></g>'+frGem(u,100,1,7,b,'url(#'+u+'m)','hex')+frBanner(u,233,40,'RARE','url(#'+u+'rk)','#2a1408','#fff2e0',8)}},
 ice:{n:m('กรอบผลึกน้ำแข็ง','Ice Crystal Frame','冰晶相框'),d:function(a,b,u){var sh=function(x,y,h,r){return '<path d="M0 0L'+frX(h*.22)+' '+frX(-h*.7)+'L0 '+(-h)+'L'+frX(-h*.22)+' '+frX(-h*.7)+'Z" fill="url(#'+u+'ic)" stroke="#fff" stroke-width=".9" transform="translate('+x+' '+y+') rotate('+r+')"/>'};
  var cl=sh(8,8,30,-45)+sh(10,6,20,-15)+sh(6,10,20,-75)+sh(14,4,14,5)+sh(4,14,14,-95);
  return frBase(u,frMix(a,'#ffffff',.25),b,frLG(u+'ic',[[0,'#ffffff',.95],[.5,a,.85],[1,b,.9]],0,0,1,1)+frLG(u+'rk',[[0,frLt(b,.4)],[1,frDk(b,.3)]],0,0,0,1))+
   frAura(u,a,8,.55,3)+frBody(u,2,15,10,6,'url(#'+u+'m)',frDk(b,.45),'#ffffff')+frGroove(8.5,8,frDk(b,.35),'#ffffff')+frFour(cl)+
   '<g filter="url(#'+u+'sh)">'+sh(100,10,34,0)+sh(94,8,22,-24)+sh(106,8,22,24)+'</g>'+frDust('#ffffff',10,.3)+frBanner(u,233,40,'RARE','url(#'+u+'rk)',frDk(b,.5),'#ffffff',8)}},
 meteor:{n:m('กรอบดาวตก','Shooting Star Frame','流星相框'),d:function(a,b,u){var rn='';[[40,8.5],[160,8.5],[8.5,80],[8.5,160],[191.5,80],[191.5,160],[60,231.5]].forEach(function(p,i){rn+='<g filter="url(#'+u+'g)">'+hstar(p[0],p[1],3.2,'#ffd35a')+'<animate attributeName="opacity" values=".35;1;.35" dur="2s" begin="'+(i*.3)+'s" repeatCount="indefinite"/></g>'});
  return frBase(u,frMix(a,'#8a8ac8',.25),b,frLG(u+'rk',[[0,frLt(b,.3)],[1,frDk(a,.2)]],0,0,0,1))+frAura(u,b,8,.6,3)+frBody(u,2,15,12,7,'url(#'+u+'m)','#0a0a2a','#ffd35a')+rn+
   frFour('<path d="M-4 -4L22 4L8 8L4 22Z" fill="url(#'+u+'au)" stroke="#5a3a08" stroke-width="1"/>')+
   '<g filter="url(#'+u+'g)"><path d="M146 -6L196 -24" stroke="#fff6c0" stroke-width="3" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;1;0;0" dur="3.4s" repeatCount="indefinite"/></path></g>'+
   '<g filter="url(#'+u+'sh)">'+hstar(100,4,14,'url(#'+u+'au)')+'</g>'+frGem(u,100,5,4,'#ff8a3a',null,'round')+frDust('#fff6c0',10,.6)+frBanner(u,233,40,'RARE','url(#'+u+'rk)','#0a0a2a','#fff6c0',8)}},
 /* ================= EPIC — energy, flames and arcs spilling over the border ================= */
 dragonfire:{n:m('กรอบเพลิงมังกร','Dragonfire Frame','龙焰相框'),d:function(a,b,u){var F='url(#'+u+'f)',C='#fff3a0',fl='',k;
  for(k=0;k<9;k++)fl+=frFlame(14+k*21.5,6,14+(k%3)*6,0,F,C,frX(.7+k%3*.18));
  for(k=0;k<5;k++)fl+=frFlame(4,40+k*40,14+k%2*6,-90,F,C,frX(.8+k%2*.2))+frFlame(196,40+k*40,14+(k+1)%2*6,90,F,C,frX(.85+k%2*.2));
  var horn='<path d="M10 14C-2 4 -8 -12 -2 -26C0 -12 8 -4 22 2Z" fill="url(#'+u+'hn)" stroke="#1a0604" stroke-width="1.2"/><path d="M-1 -20C0 -10 6 -3 16 1" stroke="#fff" stroke-opacity=".4" fill="none"/>';
  return frBase(u,'#5a2a22',b,frLG(u+'f',[[0,'#fff3a0'],[.45,b],[1,a]],0,1,0,0)+frLG(u+'hn',[[0,'#f0e0c8'],[1,'#5a3a2a']],0,0,0,1)+frLG(u+'rk',[[0,frLt(a,.2)],[1,frDk(a,.45)]],0,0,0,1))+
   frAura(u,a,14,.8,1.6)+fl+frBody(u,2,16,10,6,'url(#'+u+'m)','#1a0604',b)+frGroove(9,8,'#1a0604',b)+frTop2(horn)+
   frBot2('<path d="M2 16L-12 -6L8 6L4 -10L16 8Z" fill="url(#'+u+'hn)" stroke="#1a0604"/>')+
   frShield(u,6,15,'url(#'+u+'m)','#1a0604')+frGem(u,100,6,7.5,'#ff2a1a','url(#'+u+'au)','four')+frOut(u,frEmbers(u,'#ffd35a',10,244,70))+frBanner(u,233,58,'EPIC','url(#'+u+'rk)','#2a0604','#ffe8a0',10)}},
 thunder:{n:m('กรอบสายฟ้าพิโรธ','Wrath of Thunder Frame','雷霆之怒相框'),d:function(a,b,u){var bolt=function(x,y,s,r){return '<path d="M0 0l-6 16h6l-4 16 12-20h-6l4-12z" fill="'+b+'" stroke="#fff" stroke-width="1" filter="url(#'+u+'g)" transform="translate('+x+' '+y+') rotate('+r+') scale('+s+')"/>'};
  var arcs=frArc(u,-6,30,-8,110,1,b,1.6)+frArc(u,206,130,208,210,2,b,1.9,.6)+frArc(u,20,-6,90,-10,3,b,2.2,1)+frArc(u,110,246,180,248,4,b,1.7,.3)+frArc(u,-6,140,-4,210,5,'#9ad8ff',2.4,1.2)+frArc(u,206,20,204,90,6,'#9ad8ff',2.1,.9);
  return frBase(u,frMix(a,'#8a8ad8',.2),b,frLG(u+'rk',[[0,frLt(a,.3)],[1,frDk(a,.45)]],0,0,0,1))+frAura(u,'#6a8aff',12,.75,1.2)+arcs+
   frBody(u,2,16,10,6,'url(#'+u+'m)','#0a0a2a',b)+'<path d="'+frIn(9,8)+'" fill="none" stroke="'+b+'" stroke-width="1.2" stroke-dasharray="22 8" filter="url(#'+u+'g)"><animate attributeName="stroke-dashoffset" values="0;-60" dur="1s" repeatCount="indefinite"/></path>'+
   frFour(bolt(4,4,.9,-135))+'<g filter="url(#'+u+'sh)"><path d="M64 4L80 -14L84 0L92 -8L100 6L108 -8L116 0L120 -14L136 4Z" fill="url(#'+u+'au)" stroke="#3a2800" stroke-width="1.2"/></g>'+
   frShield(u,6,14,'url(#'+u+'m)','#0a0a2a')+bolt(102,-6,.62,15)+frGem(u,100,8,4.5,'#ffe14d',null,'round')+frBanner(u,233,58,'EPIC','url(#'+u+'rk)','#0a0a2a',b,10)}},
 nightmist:{n:m('กรอบหมอกราตรี','Night Mist Frame','夜雾相框'),d:function(a,b,u){var mist='';[[30,240,30],[160,242,34],[-4,150,18],[204,80,18],[-2,40,14],[202,200,14]].forEach(function(p,i){mist+='<ellipse cx="'+p[0]+'" cy="'+p[1]+'" rx="'+p[2]+'" ry="9" fill="'+b+'" opacity=".55" filter="url(#'+u+'bl)"><animate attributeName="cx" values="'+p[0]+';'+(p[0]+10)+';'+p[0]+'" dur="'+(4+i)+'s" repeatCount="indefinite"/></ellipse>'});
  var bat='<path d="M10 10C0 6 -10 -2 -14 -12C-8 -8 -4 -8 -2 -10C-2 -4 2 -2 6 -4C4 0 6 4 12 4Z" fill="url(#'+u+'m)" stroke="#0a0418" stroke-width="1"/>';
  return frBase(u,frMix(a,'#2a1a4a',.3),b,frLG(u+'rk',[[0,frLt(a,.3)],[1,frDk(a,.5)]],0,0,0,1))+frAura(u,b,12,.7,3.4)+frOut(u,mist)+frBody(u,2,15,13,8,'url(#'+u+'m)','#0a0418','#e0d8ff')+frGroove(8.5,10,'#0a0418','#c8b8ff')+frFour(bat)+
   '<g filter="url(#'+u+'g)"><path d="M112 -16a16 16 0 1 0 0 28a12 12 0 1 1 0-28z" fill="#fff3c0"/></g>'+frGem(u,94,2,3,'#b48aff',null,'round')+frDust('#ffffff',12,.15)+frOut(u,frEmbers(u,b,6,250,60))+frBanner(u,233,58,'EPIC','url(#'+u+'rk)','#0a0418','#e8dcff',10)}},
 /* ================= LEGENDARY — gold filigree, gem crests, wings ================= */
 eagle:{n:m('กรอบปีกอินทรีทอง','Golden Eagle Frame','金鹰相框'),d:function(a,b,u){
  return frBase(u,a,b,frLG(u+'rk',[[0,'#3a6ae0'],[1,'#0a1a5a']],0,0,0,1))+frAura(u,'#ffd35a',14,.7,2.8)+frPair(frWing('url(#'+u+'au)','#6a4204',6,26,3.2))+
   frBody(u,2,17,12,7,'url(#'+u+'au)','#5a3a04','#fff6c8')+frGroove(9.5,9,'#6a4204','#fff6c8')+frFour(frFiligree('url(#'+u+'au)','#5a3a04'))+
   frHalo(u,-22,22,'#fff3a0')+frShield(u,4,17,'url(#'+u+'au)','#5a3a04')+frGem(u,100,4,8.5,'#2f6fe0','url(#'+u+'ag)','four')+
   frGem(u,4,120,4,'#2f6fe0','url(#'+u+'au)','round')+frGem(u,196,120,4,'#2f6fe0','url(#'+u+'au)','round')+frDust('#fff3a0',10,.4)+frBanner(u,233,82,'LEGENDARY','url(#'+u+'rk)','#3a2800','#ffd35a',9.5)}},
 lion:{n:m('กรอบมงกุฎราชสีห์','Lion King Frame','狮王冠相框'),d:function(a,b,u){var mane='';for(var i=0;i<5;i++)mane+='<path d="M14 '+(10+i*8)+'Q'+(-6-i*2)+' '+(4+i*10)+' '+(-14+i*2)+' '+(-6+i*14)+'Q-2 '+(10+i*10)+' 14 '+(18+i*8)+'Z" fill="url(#'+u+'au)" stroke="#5a3a04" stroke-width="1"/>';
  return frBase(u,a,b,frLG(u+'rk',[[0,frLt(a,.25)],[1,b]],0,0,0,1))+frAura(u,'#ff5a3a',14,.6,2.4)+frTop2(mane)+frBot2(mane)+
   frBody(u,2,17,12,7,'url(#'+u+'au)','#5a3a04','#fff6c8')+'<path fill-rule="evenodd" d="'+frIn(7,10)+frIn(12,8)+'" fill="url(#'+u+'rk)"/>'+[40,80,120,160,200].map(function(y){return frRivet(9.5,y,1.6,'#ffd35a')+frRivet(190.5,y,1.6,'#ffd35a')}).join('')+
   frCrown(u,8,52,22,'url(#'+u+'au)','#5a3a04')+frGem(u,100,6,4.5,'#e0302a',null,'four')+frGem(u,82,7,3,'#2fb36a',null,'round')+frGem(u,118,7,3,'#2f6fe0',null,'round')+
   frDust('#ffd35a',10,.7)+frBanner(u,233,82,'LEGENDARY','url(#'+u+'rk)','#2a0004','#ffd35a',9.5)}},
 neon:{n:m('กรอบไซเบอร์นีออน','Cyber Neon Frame','赛博霓虹相框'),d:function(a,b,u){var br='<path d="M-8 22V-8H22" stroke="'+a+'" stroke-width="3.5" fill="none" filter="url(#'+u+'g)"><animate attributeName="opacity" values="1;.4;1;1" dur="1.8s" repeatCount="indefinite"/></path><path d="M-3 32V-3H32" stroke="'+b+'" stroke-width="1.2" fill="none"/><rect x="-11" y="28" width="4" height="10" fill="'+b+'"/>';
  return frBase(u,'#2a2e44',b,frLG(u+'rk',[[0,'#1a1030'],[1,'#05050f']],0,0,0,1))+frAura(u,a,12,.75,2)+frBody(u,2,15,6,4,'url(#'+u+'m)','#05050f',b)+
   '<path d="'+frIn(3,6)+'" fill="none" stroke="'+a+'" stroke-width="1.6" filter="url(#'+u+'g)"/><path d="'+frIn(9,5)+'" fill="none" stroke="'+b+'" stroke-width="1.4" stroke-dasharray="40 10 6 10" filter="url(#'+u+'g)"><animate attributeName="stroke-dashoffset" values="0;-132" dur="3s" repeatCount="indefinite"/></path>'+frFour(br)+
   '<rect x="15" y="15" width="170" height="2" fill="'+b+'" opacity=".45" filter="url(#'+u+'g)"><animate attributeName="y" values="15;223;15" dur="5s" repeatCount="indefinite"/></rect>'+
   '<g filter="url(#'+u+'sh)"><path d="M84 -10h32l8 12-8 12h-32l-8-12z" fill="#0a0a1a" stroke="'+a+'" stroke-width="2"/></g><text x="100" y="6" text-anchor="middle" font-size="11" font-weight="900" fill="'+b+'" filter="url(#'+u+'g)" font-family="system-ui,sans-serif">S1</text>'+
   frGem(u,66,2,3.5,a,null,'hex')+frGem(u,134,2,3.5,a,null,'hex')+frBanner(u,233,82,'LEGENDARY','url(#'+u+'rk)',a,'#ffffff',9.5)}},
 /* ================= MYTHIC — burning wings, cosmic rings, storm armour ================= */
 phoenix:{n:m('กรอบเพลิงฟีนิกซ์','Phoenix Blaze Frame','凤凰烈焰相框'),d:function(a,b,u){var F='url(#'+u+'f)',C='#fff6c0',fl='';for(var k=0;k<7;k++)fl+=frFlame(22+k*26,4,12+(k%3)*7,0,F,C,frX(.7+k%3*.2));
  var tail=frFlame(10,232,26,-130,F,C,1)+frFlame(16,236,20,-150,F,C,.85)+frFlame(4,224,18,-110,F,C,.95);
  return frBase(u,'#e8b030',b,frLG(u+'f',[[0,'#fff6c0'],[.35,b],[1,a]],0,1,0,0)+frLG(u+'w',[[0,'#fff3a0'],[.4,b],[1,a]],1,0,0,1)+frLG(u+'rk',[[0,frLt(a,.15)],[1,frDk(a,.5)]],0,0,0,1))+
   frAura(u,b,16,.85,1.4)+frPair(frWing('url(#'+u+'w)','#6a1404',7,32,1.8))+fl+tail+'<g transform="translate(200 0) scale(-1 1)">'+tail+'</g>'+
   frBody(u,2,17,12,7,'url(#'+u+'au)','#5a1a04',b)+frGroove(9.5,9,'#5a1a04','#fff3a0')+frFour(frFiligree('url(#'+u+'au)','#5a1a04'))+
   frHalo(u,-24,20,'#ffd35a',1.6)+frFlame(100,6,30,0,F,C,.8)+frShield(u,6,15,'url(#'+u+'au)','#5a1a04')+frGem(u,100,6,8,'#ff3a1a','url(#'+u+'au)','four')+
   frOut(u,frEmbers(u,'#ffd35a',14,248,90))+frBanner(u,233,72,'MYTHIC','url(#'+u+'rk)','#3a0800','#ffe8a0',10)}},
 cosmos:{n:m('กรอบวังวนดารา','Cosmic Vortex Frame','星涡相框'),d:function(a,b,u){var neb=frOut(u,'<circle cx="-6" cy="40" r="22" fill="'+b+'" opacity=".55" filter="url(#'+u+'bl)"/><circle cx="206" cy="200" r="24" fill="#3ad8ff" opacity=".45" filter="url(#'+u+'bl)"/><circle cx="190" cy="-6" r="18" fill="#ff6ad8" opacity=".4" filter="url(#'+u+'bl)"/>');
  var sp='';for(var k=0;k<22;k++){var t=k/22,px,py;if(t<.5){px=4+t*2*192;py=k%2?5:235}else{px=k%2?5:195;py=10+(t-.5)*2*220}sp+='<circle cx="'+frX(px)+'" cy="'+frX(py)+'" r=".8" fill="#fff" opacity=".8"/>'}
  var planet='<circle cx="2" cy="2" r="9" fill="url(#'+u+'pl)" stroke="#1a0a3a"/><ellipse cx="2" cy="2" rx="15" ry="4" fill="none" stroke="'+b+'" stroke-width="1.6" transform="rotate(-25 2 2)"/>';
  return frBase(u,frMix(a,'#1a0a3a',.3),b,frRG(u+'pl',[[0,'#ffffff'],[.4,b],[1,a]])+frLG(u+'rk',[[0,frLt(a,.25)],[1,'#05021a']],0,0,0,1))+
   frAura(u,b,14,.8,3)+neb+frOrbit(u,128,146,b,2,'8 12',16)+frOrbit(u,134,150,'#ffffff',1,'2 14',22,true)+
   frBody(u,2,16,12,7,'url(#'+u+'m)','#05021a',b)+sp+'<path d="'+frIn(9,8)+'" fill="none" stroke="'+b+'" stroke-width="1" filter="url(#'+u+'g)" opacity=".8"/>'+frFour(planet)+
   '<g filter="url(#'+u+'sh)"><circle cx="100" cy="4" r="17" fill="#05021a" stroke="url(#'+u+'n)" stroke-width="3.5"/></g><g transform="translate(100 4)"><path d="M0 0m-11 0a11 11 0 1 1 11 11a7 7 0 1 1-7-7a3.5 3.5 0 1 1 3.5 3.5" stroke="'+b+'" stroke-width="2" fill="none" filter="url(#'+u+'g)"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite"/></path></g>'+
   frGem(u,78,6,3.4,'#3ad8ff',null,'hex')+frGem(u,122,6,3.4,'#ff6ad8',null,'hex')+frDust('#ffffff',16,.5)+frBanner(u,233,72,'MYTHIC','url(#'+u+'rk)','#05021a','#e8d8ff',10)}},
 stormlord:{n:m('กรอบจอมทัพอัสนี','Storm Lord Frame','雷暴领主相框'),d:function(a,b,u){var pl='';[34,68,102,136,170,204].forEach(function(y){pl+='<path d="M2 '+y+'h15M183 '+y+'h15" stroke="#05070c" stroke-width="1.4"/>'});[50,100,150].forEach(function(x){pl+='<path d="M'+x+' 2v15M'+x+' 223v15" stroke="#05070c" stroke-width="1.4"/>'});
  var pauldron='<path d="M-10 -10L30 -6L22 4L4 4L4 22L-6 30Z" fill="url(#'+u+'m)" stroke="#05070c" stroke-width="1.3"/><path d="M-4 -4L18 -2L12 4" stroke="'+b+'" stroke-width="1" fill="none" filter="url(#'+u+'g)"/>'+frSpikes('url(#'+u+'ag)','#05070c')+frRivet(10,10,2.4,'#8a96b0');
  var arcs=frArc(u,-8,40,-6,120,7,b,1.5)+frArc(u,208,120,206,200,8,b,1.8,.5)+frArc(u,30,248,100,250,9,b,2.1,.9)+frArc(u,-6,150,-8,220,10,b,1.7,1.3);
  return frBase(u,a,b,frLG(u+'rk',[[0,'#3a4660'],[1,'#05070c']],0,0,0,1)+frLG(u+'hn',[[0,'#e8eef8'],[1,'#3a4256']],0,0,0,1))+frAura(u,b,14,.8,1.6)+arcs+
   frBody(u,2,17,6,4,'url(#'+u+'m)','#05070c',b)+pl+'<path d="'+frIn(9.5,5)+'" fill="none" stroke="'+b+'" stroke-width="1.6" stroke-dasharray="14 8" filter="url(#'+u+'g)"><animate attributeName="stroke-dashoffset" values="0;-44" dur="1s" repeatCount="indefinite"/></path>'+frFour(pauldron)+
   '<g filter="url(#'+u+'sh)"><path d="M84 8C70 -2 62 -18 66 -34C72 -20 80 -14 90 -10Z" fill="url(#'+u+'hn)" stroke="#05070c" stroke-width="1.2"/><path d="M116 8C130 -2 138 -18 134 -34C128 -20 120 -14 110 -10Z" fill="url(#'+u+'hn)" stroke="#05070c" stroke-width="1.2"/></g>'+
   frShield(u,4,16,'url(#'+u+'m)','#05070c')+frGem(u,100,4,7.5,b,'url(#'+u+'ag)','hex')+frBanner(u,233,72,'MYTHIC','url(#'+u+'rk)','#05070c',b,10)}},
 /* ================= CELESTIAL — sacred geometry, halos, star dust, celestial rings ================= */
 trinity:{n:m('กรอบสวรรค์ไตรภาษา','Trinity Heaven Frame','三语天界相框'),d:function(a,b,u){var tri=function(r,rot){var p=[];for(var i=0;i<3;i++){var an=(rot+i*120)*Math.PI/180;p.push(frX(100+Math.cos(an)*r)+' '+frX(120+Math.sin(an)*r))}return '<polygon points="'+p.join(' ')+'" fill="none" stroke="'+b+'" stroke-width="1.6"/>'};
  var geo=frOut(u,'<g opacity=".75" filter="url(#'+u+'g)"><circle cx="100" cy="120" r="142" fill="none" stroke="'+b+'" stroke-width="1.4"/><circle cx="100" cy="120" r="150" fill="none" stroke="#fff" stroke-width=".8" stroke-dasharray="2 6"/>'+tri(142,-90)+tri(142,90)+'<animateTransform attributeName="transform" type="rotate" from="0 100 120" to="360 100 120" dur="60s" repeatCount="indefinite"/></g>');
  var glows=frOut(u,'<circle cx="-4" cy="60" r="16" fill="#1f9d6a" opacity=".5" filter="url(#'+u+'bl)"/><circle cx="204" cy="60" r="16" fill="#e0453a" opacity=".5" filter="url(#'+u+'bl)"/><circle cx="100" cy="250" r="18" fill="#2f6fe0" opacity=".5" filter="url(#'+u+'bl)"/>');
  return frBase(u,'#fff3d0',b,frLG(u+'wf',[[0,'#ffffff'],[.5,'#fff3c0'],[1,'#e8b84a']],1,0,0,1)+frLG(u+'rk',[[0,'#ffffff'],[1,'#f0d890']],0,0,0,1))+
   frAura(u,'#fff6c0',16,.9,3)+glows+geo+frPair(frWing('url(#'+u+'wf)','#b8902a',7,34,3.6))+
   frBody(u,2,17,12,7,'url(#'+u+'m)','#a8802a','#ffffff')+frGroove(9.5,9,'#b8902a','#ffffff')+frFour(frFiligree('url(#'+u+'au)','#7a5a10'))+
   frHalo(u,-26,26,'#fff6a0',2.6)+'<g filter="url(#'+u+'sh)"><path d="M62 8C70 -14 130 -14 138 8L128 12C120 -2 80 -2 72 12Z" fill="url(#'+u+'au)" stroke="#7a5a10" stroke-width="1.3"/></g>'+
   frGem(u,80,4,5.5,'#1f9d6a','url(#'+u+'ag)','four')+frGem(u,100,-2,8,'#2f6fe0','url(#'+u+'ag)','four')+frGem(u,120,4,5.5,'#e0453a','url(#'+u+'ag)','four')+
   frDust('#fff6c0',18,.2)+frBanner(u,233,90,'TRI-LINGUA','url(#'+u+'rk)','#8a6010','#7a4a00',9.5)}},
 moon:{n:m('กรอบเทพจันทรา','Moon Goddess Frame','月神相框'),d:function(a,b,u){var runes='';for(var i=0;i<18;i++){var an=i/18*Math.PI*2;runes+='<text x="'+frX(100+Math.cos(an)*128)+'" y="'+frX(123+Math.sin(an)*148)+'" font-size="10" fill="'+a+'" text-anchor="middle" font-weight="700">'+['ก','A','月','ข','B','星','ค','C','光'][i%9]+'</text>'}
  var cres='<path d="M8 -6a14 14 0 1 0 0 26a10 10 0 1 1 0-26z" fill="url(#'+u+'ag)" stroke="#3a4278" stroke-width="1"/>';
  return frBase(u,a,b,frLG(u+'rk',[[0,frLt(b,.35)],[1,frDk(b,.4)]],0,0,0,1)+frLG(u+'wf',[[0,'#ffffff'],[1,a]],1,0,0,1))+
   frAura(u,a,16,.9,3.4)+frOrbit(u,132,150,b,1.6,'10 8',30)+frOut(u,'<g opacity=".85" filter="url(#'+u+'g)">'+runes+'<animateTransform attributeName="transform" type="rotate" from="0 100 120" to="-360 100 120" dur="70s" repeatCount="indefinite"/></g>')+
   frPair(frWing('url(#'+u+'wf)','#5a6aa8',5,22,4))+frBody(u,2,16,14,8,'url(#'+u+'m)','#2a3268','#ffffff')+frGroove(9,10,'#3a4278','#ffffff')+frFour(cres)+
   '<g filter="url(#'+u+'g)"><path d="M114 -22a20 20 0 1 0 0 36a15 15 0 1 1 0-36z" fill="#fff6d0"/></g>'+frGem(u,100,-4,5,'#b8c8ff',null,'four')+
   frDust('#ffffff',18,.8)+frBanner(u,233,90,'CELESTIAL','url(#'+u+'rk)','#1a2058','#ffffff',9.5)}}};
var FRAME_KINDS=Object.keys(FRAMES);
function frameSvg(it,cls){if(!it||!FRAMES[it.v.k])return '';var u='fr'+(++_frN)+'_';
  return '<svg class="'+(cls||'frame-ov')+'" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" overflow="visible">'+FRAMES[it.v.k].d(it.v.a,it.v.b,u)+'</svg>'}
(function(){var c=CAT.frame;FRAME_KINDS.forEach(function(k){if(c.kinds.indexOf(k)<0)c.kinds.push(k);KIND_NAMES[k]=FRAMES[k].n})})();
/* the frame the player (or any state) is wearing, drawn over a .stagebox */
function stageFrame(st,IM){IM=IM||ITEM;var id=st&&st.eq&&st.eq.frame,it=id&&IM[id];return it&&it.cat==='frame'?frameSvg(it):''}
function frameThumb(it){var u='ft'+(++_frN)+'_';
  return '<svg viewBox="-46 -40 292 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="frame"><rect x="16" y="16" width="168" height="208" rx="10" fill="'+it.v.a+'" opacity=".12"/>'+
   '<g opacity=".35" fill="'+it.v.b+'"><circle cx="100" cy="100" r="34"/><path d="M40 224q0-74 60-74t60 74z"/></g>'+FRAMES[it.v.k].d(it.v.a,it.v.b,u)+'</svg>'}
