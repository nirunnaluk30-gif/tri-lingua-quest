/* =====================================================================
   TITLE AURAS — a moving aura that comes with each honour title:
   wind, leaves, embers, stars, light rays, fire dragons, wings…
   Drawn in the avatar's own space (0..200 × 0..240, feet at y≈222).
   back = behind the hero, front = over the hero. an = animate (SMIL).
   ===================================================================== */
function anR(an,vals,dur,beg){return an?'<animateTransform attributeName="transform" type="rotate" values="'+vals+'" dur="'+dur+'s"'+(beg?' begin="'+beg+'s"':'')+' repeatCount="indefinite" additive="sum"/>':''}
function anT(an,vals,dur,beg){return an?'<animateTransform attributeName="transform" type="translate" values="'+vals+'" dur="'+dur+'s"'+(beg?' begin="-'+beg+'s"':'')+' repeatCount="indefinite" additive="sum"/>':''}
function anS(an,vals,dur,beg){return an?'<animateTransform attributeName="transform" type="scale" values="'+vals+'" dur="'+dur+'s"'+(beg?' begin="-'+beg+'s"':'')+' repeatCount="indefinite" additive="sum"/>':''}
function anA(an,attr,vals,dur,beg){return an?'<animate attributeName="'+attr+'" values="'+vals+'" dur="'+dur+'s"'+(beg?' begin="-'+beg+'s"':'')+' repeatCount="indefinite"/>':''}
function aseed(i,k){var x=Math.sin(i*12.9898+k*78.233+1.7)*43758.5453;return x-Math.floor(x)}
/* a magic circle on the ground, seen in perspective, slowly turning */
function arune(u,an,col,r,dur,glyph){var g='<circle r="'+r+'" fill="none" stroke="'+col+'" stroke-width="3"/><circle r="'+(r*.86)+'" fill="none" stroke="'+col+'" stroke-width="7" stroke-dasharray="2 5" opacity=".85"/><circle r="'+(r*.72)+'" fill="none" stroke="'+col+'" stroke-width="2"/>';
  if(glyph!==false){var p='';for(var i=0;i<6;i++){var a=i*Math.PI/3,b=a+Math.PI*2/3;p+='M'+f1(Math.cos(a)*r*.72)+' '+f1(Math.sin(a)*r*.72)+'L'+f1(Math.cos(b)*r*.72)+' '+f1(Math.sin(b)*r*.72)}g+='<path d="'+p+'" stroke="'+col+'" stroke-width="1.5" fill="none" opacity=".8"/>'}
  return '<g transform="translate(100 222) scale(1 .3)"><g filter="url(#'+u+'ag)" opacity=".9"><g>'+g+anR(an,'0;360',dur)+'</g></g><g opacity=".9"><g>'+g+anR(an,'0;360',dur)+'</g></g></g>'}
/* little things that rise and fade */
function arise(an,n,col,seed,shape,h,spread){var o='';h=h||150;spread=spread||70;for(var i=0;i<n;i++){var x=100+(aseed(i,seed)-.5)*2*spread,y=222-aseed(i,seed+3)*30,r=1.2+aseed(i,seed+7)*2.2,d=2.4+aseed(i,seed+11)*2.8,b=f1(aseed(i,seed+13)*d);
   var el=shape==='leaf'?'<path d="M0 0q4-6 9-2q-4 6-9 2z" fill="'+col+'"/>':shape==='star'?hstar(0,0,r*1.6,col):'<circle r="'+r+'" fill="'+col+'"/>';
   o+='<g transform="translate('+f1(x)+' '+f1(y)+')"><g opacity="'+(an?0:.8)+'">'+el+anT(an,'0 0;'+f1((aseed(i,seed+17)-.5)*30)+' -'+f1(h*(.6+aseed(i,seed+19)*.4)),d,b)+anA(an,'opacity','0;1;.9;0',d,b)+(shape==='leaf'?anR(an,'0;'+(aseed(i,seed)>.5?360:-360),d,0):'')+'</g></g>'}return o}
/* twinkling stars scattered around */
function atwinkle(an,n,col,seed,box){var o='';box=box||[20,30,160,170];for(var i=0;i<n;i++){var x=box[0]+aseed(i,seed)*box[2],y=box[1]+aseed(i,seed+5)*box[3],d=1.4+aseed(i,seed+9)*2;
   o+='<g transform="translate('+f1(x)+' '+f1(y)+')">'+hstar(0,0,2+aseed(i,seed+2)*2.5,col).replace('/>',' opacity=".9">'+anA(an,'opacity','.1;1;.1',d,f1(aseed(i,seed+4)*d))+'</path>')+'</g>'}return o}
/* a wing made of feathers, attached at (ax, ay); side 1 = left, -1 = right */
function awing(u,an,side,ax,ay,len,fill,n){var o='';for(var i=0;i<n;i++){var L=len*(.72+.28*Math.sin(Math.PI*(i+1)/(n+1)))-i*1.5,a=196+i*(84/n);o+='<path d="M0 0C'+f1(L*.25)+' -'+f1(L*.11)+' '+f1(L*.7)+' -'+f1(L*.1)+' '+f1(L)+' 0C'+f1(L*.7)+' '+f1(L*.07)+' '+f1(L*.25)+' '+f1(L*.07)+' 0 0z" fill="'+fill+'" stroke="#ffffff" stroke-width=".7" stroke-opacity=".8" transform="rotate('+f1(a)+')" opacity="'+(.95-i*.035)+'"/>'}
  for(var j=0;j<Math.round(n*.6);j++){var L2=len*.42-j*3,a2=205+j*14;o+='<path d="M0 0C'+f1(L2*.3)+' -5 '+f1(L2*.7)+' -5 '+f1(L2)+' 0C'+f1(L2*.7)+' 4 '+f1(L2*.3)+' 4 0 0z" fill="#ffffff" opacity=".9" transform="rotate('+a2+')"/>'}
  return '<g transform="translate('+ax+' '+ay+') scale('+side+' 1)"><g>'+o+anR(an,'0;-7;0',3.4)+'</g></g>'}
/* a column of light */
function apillar(u,an,col,w,op){return '<g><rect x="'+(100-w/2)+'" y="0" width="'+w+'" height="226" fill="url(#'+u+'ap)" opacity="'+op+'">'+anA(an,'opacity',(op*.55)+';'+op+';'+(op*.55),2.6)+'</rect></g>'}
/* a swirling ring around the body at height y (front = the near half) */
function aswirl(an,y,rx,ry,col,w,dur,front,dash){return '<path d="M'+(100-rx)+' '+y+(front?'A'+rx+' '+ry+' 0 0 0 '+(100+rx)+' '+y:'A'+rx+' '+ry+' 0 0 1 '+(100+rx)+' '+y)+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-dasharray="'+(dash||'40 26')+'">'+anA(an,'stroke-dashoffset','0;-132',dur)+'</path>'}
/* a fire serpent rising beside the hero */
function aserpent(u,an,side){var p='M0 110C-30 80 30 60 0 30S-20-20 10-36';var head='<g transform="translate(10 -40)"><path d="M-8 6q-2-14 10-16l4-8 2 9q8 3 9 11l-7 1q1 6-4 8l-4-5q-5 3-10 0z" fill="#ffb03a" stroke="#c8320a" stroke-width="1.2"/><circle cx="4" cy="-2" r="1.6" fill="#fff36a"/></g>';
  return '<g transform="translate('+(100+side*62)+' 70) scale('+side+' 1)"><g filter="url(#'+u+'ag)"><path d="'+p+'" fill="none" stroke="#ff6a1a" stroke-width="12" stroke-linecap="round" opacity=".8"/></g><path d="'+p+'" fill="none" stroke="#ffb03a" stroke-width="7" stroke-linecap="round"/><path d="'+p+'" fill="none" stroke="#fff6a0" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="6 10">'+anA(an,'stroke-dashoffset','0;-64',1.4)+'</path>'+head+anT(an,'0 0;0 -4;0 0',2.2)+'</g>'}
var TAURA={
 1:{back:function(u,an){return arune(u,an,'#e8c070',56,14)},front:function(u,an){return arise(an,10,'#ffe9a8',1)}},
 2:{back:function(u,an){return arune(u,an,'#7ff0ff',64,9)+'<g filter="url(#'+u+'ag)">'+[[206,64,14],[182,58,12],[158,52,11],[136,48,10],[34,34,7]].map(function(r,i){return aswirl(an,r[0],r[1],r[2],'#bff8ff',3,1.6+i*.2,false)}).join('')+'</g>'},
    front:function(u,an){return [[206,64,14],[182,58,12],[158,52,11],[136,48,10],[34,34,7]].map(function(r,i){return aswirl(an,r[0],r[1],r[2],'#e8fdff',2.4,1.6+i*.2,true)}).join('')+arise(an,8,'#8af0c8',4,'leaf',160,60)}},
 3:{back:function(u,an){return arune(u,an,'#5ad86a',60,16)+'<g filter="url(#'+u+'ag)">'+atwinkle(an,10,'#bfff7a',3,[20,40,160,170])+'</g>'},
    front:function(u,an){var o='';for(var i=0;i<9;i++){var x=24+aseed(i,6)*152,d=4+aseed(i,7)*3;o+='<g transform="translate('+f1(x)+' 20)"><g opacity="'+(an?0:.8)+'"><path d="M0 0q5-7 11-2q-5 7-11 2z" fill="'+(i%2?'#3fbf5a':'#7ad84a')+'"/>'+anT(an,'0 0;'+f1((aseed(i,8)-.5)*40)+' 200',d,f1(aseed(i,9)*d))+anA(an,'opacity','0;1;1;0',d,f1(aseed(i,9)*d))+anR(an,'0;300',d,0)+'</g></g>'}return o}},
 4:{back:function(u,an){var ring=function(rot,dur){return '<g transform="translate(100 140) rotate('+rot+') scale(1 .38)"><circle r="74" fill="none" stroke="#ff3a3a" stroke-width="2.5" stroke-dasharray="10 6" opacity=".85">'+anA(an,'stroke-dashoffset','0;-64',dur)+'</circle></g>'};
    return arune(u,an,'#ff4a4a',62,8)+'<g filter="url(#'+u+'ag)">'+ring(28,2.4)+ring(-28,2.8)+'</g>'},
    front:function(u,an){return arise(an,16,'#ff5a3a',5,'dot',170,74)}},
 5:{back:function(u,an){var orb='';for(var i=0;i<6;i++){var a=i*60;orb+='<g transform="rotate('+a+') translate(76 0)">'+hstar(0,0,4,'#ffffff')+'<circle r="7" fill="#c87aff" opacity=".35"/></g>'}
    var eye=function(x,y,s){return '<g transform="translate('+x+' '+y+') scale('+s+')"><circle r="16" fill="none" stroke="#9a7aff" stroke-width="1.6"/><circle r="12" fill="none" stroke="#9a7aff" stroke-width="3" stroke-dasharray="1.5 3"/><path d="M-9 0q9-8 18 0q-9 8-18 0z" fill="#c8a8ff"/><circle r="3" fill="#2a0a5a"/>'+anS(an,'1;1.08;1',2.6)+'</g>'};
    return arune(u,an,'#a87aff',64,12)+'<g filter="url(#'+u+'ag)"><g transform="translate(100 150) scale(1 .4)"><g>'+orb+anR(an,'0;360',6)+'</g></g></g>'+eye(26,120,1)+eye(176,96,.8)+'<g filter="url(#'+u+'ag)">'+atwinkle(an,12,'#e8d8ff',8)+'</g>'},
    front:function(u,an){return arise(an,8,'#d8b8ff',9,'star',150,66)}},
 6:{back:function(u,an){var r='';for(var i=0;i<18;i++){r+='<path d="M0 0L'+f1(Math.cos(i*Math.PI/9)*130)+' '+f1(Math.sin(i*Math.PI/9)*130)+'L'+f1(Math.cos(i*Math.PI/9+.08)*130)+' '+f1(Math.sin(i*Math.PI/9+.08)*130)+'z" fill="#fff3a0" opacity="'+(i%2?.35:.6)+'"/>'}
    return '<g transform="translate(100 120)"><g filter="url(#'+u+'ag)"><circle r="50" fill="#fff6c0" opacity=".55"/></g><g>'+r+anR(an,'0;360',30)+'</g></g>'+arune(u,an,'#ffd35a',64,14)},
    front:function(u,an){return arise(an,10,'#fff3a0',11,'dot',140,64)}},
 7:{back:function(u,an){return arune(u,an,'#ff7a1a',66,7)+aserpent(u,an,-1)+aserpent(u,an,1)},
    front:function(u,an){return arise(an,14,'#ffb43a',12,'dot',170,72)}},
 8:{back:function(u,an){return apillar(u,an,'#ffffff',90,.45)+awing(u,an,1,92,128,96,'url(#'+u+'aw)',8)+awing(u,an,-1,108,128,96,'url(#'+u+'aw)',8)+arune(u,an,'#e8ecff',60,14)},
    front:function(u,an){return '<g filter="url(#'+u+'ag)">'+atwinkle(an,10,'#ffffff',13)+'</g>'+arise(an,6,'#ffffff',14,'star',140,60)}},
 9:{back:function(u,an){return apillar(u,an,'#fff6c0',120,.5)+awing(u,an,1,92,126,112,'url(#'+u+'ar)',10)+awing(u,an,-1,108,126,112,'url(#'+u+'ar)',10)+
    '<g transform="translate(100 222) scale(1 .3)"><g filter="url(#'+u+'ag)"><g>'+'<circle r="66" fill="none" stroke="url(#'+u+'arb)" stroke-width="4"/><circle r="56" fill="none" stroke="url(#'+u+'arb)" stroke-width="8" stroke-dasharray="2 5"/><circle r="46" fill="none" stroke="url(#'+u+'arb)" stroke-width="2"/>'+anR(an,'0;360',10)+'</g></g></g>'},
    front:function(u,an){return '<g filter="url(#'+u+'ag)">'+atwinkle(an,14,'#fff6a0',15,[10,20,180,190])+'</g>'+arise(an,10,'#ffffff',16,'star',170,80)}},
 10:{back:function(u,an){return apillar(u,an,'#7ff0ff',130,.6)+'<g filter="url(#'+u+'ag)"><ellipse cx="100" cy="130" rx="86" ry="110" fill="#5ae8ff" opacity=".22">'+anA(an,'opacity','.12;.3;.12',3)+'</ellipse></g>'+
    awing(u,an,1,92,124,124,'url(#'+u+'ac)',11)+awing(u,an,-1,108,124,124,'url(#'+u+'ac)',11)+arune(u,an,'#7ff0ff',70,9)+'<ellipse cx="100" cy="30" rx="26" ry="6" fill="none" stroke="#bff4ff" stroke-width="3" filter="url(#'+u+'ag)"/>'},
    front:function(u,an){return '<g filter="url(#'+u+'ag)">'+atwinkle(an,18,'#e8fdff',17,[6,10,188,210])+'</g>'+arise(an,12,'#bff4ff',18,'star',190,84)}}
};
function auraDefs(u){return '<filter id="'+u+'ag" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>'+
  '<linearGradient id="'+u+'ap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
  '<linearGradient id="'+u+'aw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe6ff"/></linearGradient>'+
  '<linearGradient id="'+u+'ar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6c0"/><stop offset=".5" stop-color="#ffd8f8"/><stop offset="1" stop-color="#c8f0ff"/></linearGradient>'+
  '<linearGradient id="'+u+'ac" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#bff4ff"/><stop offset="1" stop-color="#3ad8ff"/></linearGradient>'+
  '<linearGradient id="'+u+'arb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff7ad8"/><stop offset=".33" stop-color="#ffe14a"/><stop offset=".66" stop-color="#5af0a0"/><stop offset="1" stop-color="#7ab0ff"/></linearGradient>'}
/* which aura (title level) this hero shows; '' = none */
function auraFor(st,opt){if(opt.noAura)return 0;var id=opt.auraTitle!==undefined?opt.auraTitle:st===S?(S.set.taura===false?'':shownTitle(S)):(st.title&&st.ta!==false?st.title:'');return TITLE[id]?TITLE[id].lv:0}
