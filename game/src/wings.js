/* =====================================================================
   WING STYLES — drawn behind the hero. Each style draws the left wing;
   the right wing is its mirror. Colors: a = main, b = accent / glow.
   ===================================================================== */
var WR={x:88,y:138}; /* wing root (left shoulder) */
function wdir(deg){var r=deg*Math.PI/180;return [Math.cos(r),Math.sin(r)]}
function f1(n){return Math.round(n*10)/10}
/* teardrop from (x0,y0) toward angle, length L, half-width w */
function tear(x0,y0,ang,L,w,fill,extra){var d=wdir(ang),p=[-d[1],d[0]],tx=x0+d[0]*L,ty=y0+d[1]*L,mx=x0+d[0]*L*.48,my=y0+d[1]*L*.48;
  return '<path d="M'+f1(x0)+' '+f1(y0)+'Q'+f1(mx+p[0]*w)+' '+f1(my+p[1]*w)+' '+f1(tx)+' '+f1(ty)+'Q'+f1(mx-p[0]*w)+' '+f1(my-p[1]*w)+' '+f1(x0)+' '+f1(y0)+'z" fill="'+fill+'"'+(extra||'')+'/>'}
function grad(id,c1,c2,o2){return '<linearGradient id="'+id+'" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"'+(o2!==undefined?' stop-opacity="'+o2+'"':'')+'/></linearGradient>'}
function blurF(id,sd){return '<filter id="'+id+'" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="'+sd+'"/></filter>'}
var WBASE='M88 132C72 96 46 56 14 44c6 26-10 52-10 78 0 28 14 54 36 74 20-18 36-36 48-46z';
function featherWing(u,a,b,tipC){var s='<defs>'+grad(u+'f1',a,tipC||b)+grad(u+'f2',shade(a,20),tipC||b)+grad(u+'f0',shade(a,-25),tipC||b)+'</defs>',sk=' stroke="'+shade(a,-45)+'" stroke-width=".8" stroke-opacity=".55"';
  s+='<path d="'+WBASE+'" fill="url(#'+u+'f0)" opacity=".9"/>';
  for(var i=0;i<8;i++)s+=tear(WR.x,WR.y,158+i*13,86-Math.abs(i-3.5)*2,13,'url(#'+u+'f1)',sk);
  for(var j=0;j<7;j++)s+=tear(WR.x-2,WR.y-2,164+j*13,62,11,'url(#'+u+'f2)',sk);
  for(var k=0;k<6;k++)s+=tear(WR.x-2,WR.y-4,172+k*14,36,11,shade(a,35),sk);return s}
function ornament(gem){return '<g transform="translate(-38 -16)"><path d="M94 126c-14-5-26 3-24 18 2 13 14 17 24 9z" fill="'+GOLD+'" stroke="'+GOLDD+'" stroke-width="1.5"/>'+
  '<path d="M78 128c-6 6-8 14-4 22M86 152c-6 6-14 8-22 4" fill="none" stroke="'+GOLDD+'" stroke-width="1.5"/>'+
  '<circle cx="83" cy="140" r="5.5" fill="'+gem+'" stroke="#fff" stroke-width="1"/><circle cx="81.5" cy="138.5" r="1.6" fill="#fff"/></g>'}
function dragonWing(a,b,spiky){var W=[34,92],pts=spiky?[[6,150],[22,184],[48,198],[72,186]]:[[14,150],[30,176],[52,188],[74,180]];
  var d='M88 140L60 112L'+W[0]+' '+W[1]+'L'+pts[0][0]+' '+pts[0][1];
  for(var i=1;i<pts.length;i++){var p0=pts[i-1],p1=pts[i];d+=spiky?'L'+f1((p0[0]+p1[0])/2+4)+' '+f1((p0[1]+p1[1])/2-10)+'L'+p1[0]+' '+p1[1]:'Q'+f1((p0[0]+p1[0])/2+8)+' '+f1((p0[1]+p1[1])/2-12)+' '+p1[0]+' '+p1[1]}
  d+='Q84 172 88 160z';var gid='dg'+a.slice(1)+(spiky?'s':'');var s='<defs><linearGradient id="'+gid+'" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+shade(a,spiky?70:35)+'"/><stop offset="1" stop-color="'+a+'"/></linearGradient></defs><path d="'+d+'" fill="url(#'+gid+')" opacity=".95"/>';
  pts.forEach(function(p){s+='<path d="M'+W[0]+' '+W[1]+'L'+p[0]+' '+p[1]+'" stroke="'+b+'" stroke-width="2.2" stroke-linecap="round"/>'});
  s+='<path d="M88 140L60 112L'+W[0]+' '+W[1]+'" fill="none" stroke="'+b+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 92l-8-8 2 10z" fill="'+b+'"/>';return s}
var WSET={
 feather:function(a,b,u){return featherWing(u+'L',a,b)+mirror(featherWing(u+'L',a,b))},
 seraph:function(a,b,u){var w=featherWing(u+'S',a,'#ffffff')+ornament(b);return w+mirror(w)},
 dual:function(a,b,u){return featherWing(u+'A',a,shade(a,60))+ornament(b)+mirror(featherWing(u+'B',b,shade(b,60))+ornament(a))},
 flame:function(a,b,u){var t='';for(var i=0;i<6;i++){t+=tear(WR.x,WR.y+4,152+i*19,74+(i%2)*12,20,'url(#'+u+'fl)');t+=tear(WR.x-14,WR.y-6,160+i*19,40,9,b)}
  t='<path d="'+WBASE+'" fill="url(#'+u+'fl)" opacity=".75"/>'+t;
  var w='<defs><linearGradient id="'+u+'fl" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="'+b+'"/><stop offset=".55" stop-color="'+a+'"/><stop offset="1" stop-color="'+shade(a,-30)+'" stop-opacity=".85"/></linearGradient>'+blurF(u+'flb',4)+'</defs>'+
   '<g filter="url(#'+u+'flb)" opacity=".7">'+t+'</g>'+t+'<circle cx="30" cy="120" r="2.5" fill="'+b+'"/><circle cx="46" cy="76" r="2" fill="'+b+'"/><circle cx="18" cy="160" r="2" fill="'+a+'"/>';return w+mirror(w)},
 crystal:function(a,b,u){var s='';for(var i=0;i<8;i++){var ang=152+i*14,L=i%2?62:86,w=i%2?12:16,d=wdir(ang),p=[-d[1],d[0]],x0=WR.x,y0=WR.y;
   var s1=[x0+d[0]*L*.6+p[0]*w,y0+d[1]*L*.6+p[1]*w],tp=[x0+d[0]*L,y0+d[1]*L],s2=[x0+d[0]*L*.6-p[0]*w,y0+d[1]*L*.6-p[1]*w];
   s+='<path d="M'+x0+' '+y0+'L'+f1(s1[0])+' '+f1(s1[1])+'L'+f1(tp[0])+' '+f1(tp[1])+'z" fill="'+a+'" opacity=".95"/><path d="M'+x0+' '+y0+'L'+f1(tp[0])+' '+f1(tp[1])+'L'+f1(s2[0])+' '+f1(s2[1])+'z" fill="'+shade(a,-35)+'" opacity=".95"/>'+
     '<path d="M'+x0+' '+y0+'L'+f1(s1[0])+' '+f1(s1[1])+'L'+f1(tp[0])+' '+f1(tp[1])+'" fill="none" stroke="'+b+'" stroke-width="1" opacity=".9"/>'}
  s+='<circle cx="40" cy="104" r="2" fill="#fff"/><circle cx="24" cy="146" r="1.6" fill="#fff"/>';return s+mirror(s)},
 fairy:function(a,b,u){var w='<defs><linearGradient id="'+u+'fy" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs>'+
   '<path d="M90 138C62 70 8 66 12 108c4 30 48 38 78 36z" fill="url(#'+u+'fy)" opacity=".88" stroke="'+shade(a,-40)+'" stroke-width="1.5"/>'+
   '<path d="M90 148c-26 2-60 22-50 48 10 18 40-10 50-40z" fill="url(#'+u+'fy)" opacity=".88" stroke="'+shade(a,-40)+'" stroke-width="1.5"/>'+
   '<path d="M90 140L28 92M90 140L18 116M90 142L40 132M90 150L48 192M90 152L60 180" stroke="'+shade(a,-40)+'" stroke-width="1" opacity=".55"/>'+
   '<circle cx="38" cy="104" r="5" fill="#fff" opacity=".65"/><circle cx="56" cy="118" r="3" fill="#fff" opacity=".6"/><circle cx="54" cy="180" r="3.5" fill="#fff" opacity=".6"/>';return w+mirror(w)},
 dragon:function(a,b){var w=dragonWing(a,b,false);return w+mirror(w)},
 demonic:function(a,b,u){var w='<defs>'+blurF(u+'dm',3)+'</defs>'+dragonWing(a,'#d8a63a',true)+'<path d="M88 140L60 112L34 92" fill="none" stroke="'+b+'" stroke-width="2" filter="url(#'+u+'dm)"/>'+
   '<g transform="translate(-36 -22)"><path d="M94 128c-12-4-22 4-20 16 2 10 12 14 20 8z" fill="#2a2030" stroke="#d8a63a" stroke-width="1.5"/><circle cx="83" cy="140" r="7" fill="'+b+'" filter="url(#'+u+'dm)"/><circle cx="83" cy="140" r="4" fill="'+b+'" stroke="#fff" stroke-width="1"/></g>';return w+mirror(w)},
 leaf:function(a,b,u){var s='<defs>'+grad(u+'lf',a,b)+'</defs>';for(var i=0;i<5;i++){var ang=160+i*20,L=70-Math.abs(i-2)*6,d=wdir(ang),tx=WR.x+d[0]*L*.78,ty=WR.y+d[1]*L*.78;
   s+=tear(WR.x,WR.y,ang,L,17,'url(#'+u+'lf)',' stroke="'+shade(a,-35)+'" stroke-width="1.2"')+'<circle cx="'+f1(tx)+'" cy="'+f1(ty)+'" r="4.5" fill="'+b+'" stroke="'+shade(a,-35)+'"/><circle cx="'+f1(tx)+'" cy="'+f1(ty)+'" r="2" fill="'+shade(a,-40)+'"/>'}return s+mirror(s)},
 mini:function(a,b){var w='<g transform="translate(-24 -10) scale(1.15) translate(-12 -18)"><path d="M90 136c-12-18-34-18-36-6-8 0-10 12-2 16-6 6 2 14 10 10 8 4 20-2 28-8z" fill="'+a+'" stroke="'+shade(a,-30)+'" stroke-width="2"/><path d="M84 138c-8-4-16-6-24-4M82 146c-8 0-14 2-20 6" stroke="'+b+'" stroke-width="2" stroke-linecap="round" opacity=".9"/></g>';return w+mirror(w)},
 spirit:function(a,b,u){var s='';for(var i=0;i<6;i++){var ang=156+i*18,L=82-(i===0||i===4?10:0),d=wdir(ang),p=[-d[1],d[0]],tx=WR.x+d[0]*L,ty=WR.y+d[1]*L,cx=WR.x+d[0]*L*.5+p[0]*22,cy=WR.y+d[1]*L*.5+p[1]*22;
   s+='<path d="M'+WR.x+' '+WR.y+'Q'+f1(cx)+' '+f1(cy)+' '+f1(tx)+' '+f1(ty)+'Q'+f1(cx+p[0]*18)+' '+f1(cy+p[1]*18)+' '+WR.x+' '+(WR.y+4)+'z" fill="url(#'+u+'sp)"/>'}
  var w='<defs>'+grad(u+'sp',b,a,.5)+blurF(u+'spb',3)+'</defs><g filter="url(#'+u+'spb)" opacity=".8">'+s+'</g>'+s+'<circle cx="26" cy="112" r="2" fill="'+b+'"/><circle cx="40" cy="74" r="1.6" fill="'+b+'"/><circle cx="20" cy="164" r="1.8" fill="'+a+'"/>';return w+mirror(w)}
};
var WING_KINDS=Object.keys(WSET);
