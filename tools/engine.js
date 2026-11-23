{
const AV=__AV__, T=__T__, TIERS=__TIERS__;
let cur='sword', br='A';const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const C=k=>T[k].c;
/* ---------- canvas particle engine ---------- */
const cv=$('cv'),g=cv.getContext('2d');let W=0,H=0;
function size(){const d=Math.min(2,devicePixelRatio||1),r=$('arena').getBoundingClientRect();W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;g.setTransform(d,0,0,d,0,0)}
const ro=new ResizeObserver(size);ro.observe($('arena'));size();
const BOSS=()=>({x:W*.78,y:H*.48}),HERO=()=>({x:W*.2,y:H*.6});
const P=[],FX=[];let trauma=0,stopUntil=0,last=performance.now(),clock=0;
const GL={};function glow(col){if(GL[col])return GL[col];const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'#fff');gr.addColorStop(.25,col);gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return GL[col]=c}
const rnd=(a,b)=>a+Math.random()*(b-a);
function sp(o){P.push(Object.assign({vx:0,vy:0,life:.6,t:0,size:6,grow:0,col:'#fff',add:true,drag:.98,grav:0,shape:'dot',rot:0,vr:0},o))}
function fx(dur,draw,delay){FX.push({t:-(delay||0),dur,draw})}
function burst(x,y,col,n,spd,o){for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),v=rnd(spd*.3,spd);sp(Object.assign({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rnd(.35,.8),size:rnd(2,4.5),col,shape:'spark',grav:420,drag:.96},o||{}))}}
function embers(x,y,col,n,o){for(let i=0;i<n;i++)sp(Object.assign({x:x+rnd(-20,20),y:y+rnd(-20,20),vx:rnd(-40,40),vy:rnd(-160,-40),life:rnd(.6,1.4),size:rnd(3,7),col,grav:-30,drag:.97},o||{}))}
function smoke(x,y,n,col){for(let i=0;i<n;i++)sp({x:x+rnd(-25,25),y:y+rnd(-15,15),vx:rnd(-30,30),vy:rnd(-60,-15),life:rnd(.8,1.6),size:rnd(14,26),grow:28,col:col||'rgba(60,40,70,.35)',add:false,shape:'smoke',drag:.97})}
function shards(x,y,col,n,spd){for(let i=0;i<n;i++){const a=rnd(0,Math.PI*2),v=rnd(spd*.4,spd);sp({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-80,life:rnd(.5,1),size:rnd(4,9),col,shape:'shard',grav:500,rot:rnd(0,6),vr:rnd(-12,12),drag:.97})}}
function shock(x,y,col,R,dur,w){fx(dur,k=>{const e=1-Math.pow(1-k,3);g.globalCompositeOperation='lighter';g.globalAlpha=1-k;g.strokeStyle=col;g.lineWidth=(w||10)*(1-k)+1;g.beginPath();g.arc(x,y,R*e,0,7);g.stroke();g.strokeStyle='#fff';g.lineWidth=((w||10)*(1-k)+1)*.35;g.stroke();g.globalAlpha=1})}
function flashAt(x,y,col,R,dur){fx(dur,k=>{g.globalCompositeOperation='lighter';g.globalAlpha=(1-k)*.9;g.drawImage(glow(col),x-R,y-R,R*2,R*2);g.globalAlpha=(1-k)*.7;g.drawImage(glow('#ffffff'),x-R*.45,y-R*.45,R*.9,R*.9);g.globalAlpha=1})}
function shake(a){if(!reduce)trauma=Math.min(1,trauma+a)}
function hitstop(ms){if(!reduce)stopUntil=performance.now()+ms}
function dmgNum(d,god){const e=document.createElement('div');e.className='dmg'+(god?' god':'');e.style.setProperty('--c',C(cur));e.style.right=(14+Math.random()*8)+'%';e.textContent='-'+d;$('fx').appendChild(e);setTimeout(()=>e.remove(),god?1900:1150)}
function bossHit(god){const b=$('boss');b.classList.remove('hit','slow');void b.offsetWidth;b.classList.add(god?'slow':'hit')}
function impact(col,pow,d,god,at){const B=at||BOSS();flashAt(B.x,B.y,col,90*pow+40,.35);shock(B.x,B.y,col,120*pow+60,.55,12*pow+4);burst(B.x,B.y,col,Math.round(26*pow+8),520*pow+180);burst(B.x,B.y,'#ffffff',Math.round(10*pow),300);
 if(pow>.6){embers(B.x,B.y,col,Math.round(14*pow));smoke(B.x,B.y+20,Math.round(6*pow))}shake(.25+pow*.5);hitstop(50+pow*90);bossHit(god);if(d)dmgNum(d,god);if(pow>=1.3&&!reduce)flashScreen()}
function flashScreen(){const e=document.createElement('div');e.className='flash';$('fx').appendChild(e);setTimeout(()=>e.remove(),450)}
/* slash: a glowing arc swept across the boss */
function slash(col,a0,a1,R,w,dur,delay,cx,cy){fx(dur,k=>{const B=BOSS(),x=cx||B.x,y=cy||B.y,sw=Math.min(1,k*2.2),fade=k<.45?1:1-(k-.45)/.55,e=a0+(a1-a0)*(1-Math.pow(1-sw,3)),st=a0+(a1-a0)*Math.max(0,sw-.55);
 g.globalCompositeOperation='lighter';g.lineCap='round';[[w*3.2,.18,col],[w*1.4,.55,col],[w*.45,1,'#ffffff']].forEach(([lw,al,c])=>{g.globalAlpha=al*fade;g.strokeStyle=c;g.lineWidth=lw;g.beginPath();g.arc(x,y,R,st,e,a1<a0);g.stroke()});g.globalAlpha=1;
 if(k<.5&&Math.random()<.9){const px=x+Math.cos(e)*R,py=y+Math.sin(e)*R;burst(px,py,col,2,260)}},delay)}
/* projectile with a trail, impact at the end */
function shot(o){const H0=HERO();const from=o.from||{x:H0.x+40,y:H0.y-30},to=o.to||BOSS();fx(o.dur,k=>{const e=o.ease==='in'?k*k:k,x=from.x+(to.x-from.x)*e,y=from.y+(to.y-from.y)*e-(o.arc||0)*Math.sin(Math.PI*e);
 g.globalCompositeOperation='lighter';const r=o.size||14;g.drawImage(glow(o.col),x-r*2.2,y-r*2.2,r*4.4,r*4.4);g.drawImage(glow('#ffffff'),x-r*.8,y-r*.8,r*1.6,r*1.6);
 if(o.arrow){const ang=Math.atan2(to.y-from.y-(o.arc||0)*Math.PI*Math.cos(Math.PI*e),to.x-from.x);g.save();g.translate(x,y);g.rotate(ang);g.strokeStyle='#fff';g.lineWidth=2.5;g.beginPath();g.moveTo(-34,0);g.lineTo(6,0);g.stroke();g.fillStyle='#fff';g.beginPath();g.moveTo(12,0);g.lineTo(0,-5);g.lineTo(0,5);g.fill();g.restore()}
 for(let i=0;i<(o.trail||3);i++)sp({x:x+rnd(-4,4),y:y+rnd(-4,4),vx:rnd(-30,30),vy:rnd(-30,30),life:rnd(.25,.55),size:r*rnd(.4,.9),col:o.col,drag:.9});
 if(o.fire)embers(x,y,'#ff7a1a',1,{life:.5});if(o.smoke&&Math.random()<.5)smoke(x,y,1);if(k>=1&&o.hit)o.hit(to)},o.delay)}
/* lightning: jagged bolt with branches, flickering */
function bolt(x1,y1,x2,y2,col,dur,delay){let pts=null,seed=0;const mk=()=>{const p=[[x1,y1],[x2,y2]];for(let d=0,off=90;d<6;d++,off*=.55){for(let i=p.length-1;i>0;i--){const a=p[i-1],b=p[i];p.splice(i,0,[(a[0]+b[0])/2+rnd(-off,off),(a[1]+b[1])/2+rnd(-off*.3,off*.3)])}}return p};
 fx(dur,k=>{if(!pts||performance.now()-seed>55){pts=mk();seed=performance.now()}const al=k<.7?(Math.random()<.85?1:.3):1-(k-.7)/.3;g.globalCompositeOperation='lighter';
  [[16,.15,col],[7,.45,col],[2.4,1,'#fff']].forEach(([lw,a,c])=>{g.globalAlpha=a*al;g.strokeStyle=c;g.lineWidth=lw;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()});g.globalAlpha=1},delay)}
function circle(x,y,R,col,dur,delay,spin,flat){fx(dur,k=>{const al=k<.15?k/.15:k>.85?(1-k)/.15:1,a=k*(spin||2);g.save();g.translate(x,y);if(flat)g.scale(1,flat);g.rotate(a);g.globalCompositeOperation='lighter';
 [[6,.25],[2,1]].forEach(([lw,al2])=>{g.globalAlpha=al*al2;g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.arc(0,0,R,0,7);g.stroke();g.beginPath();g.arc(0,0,R*.78,0,7);g.stroke();
  g.beginPath();for(let i=0;i<3;i++){const q=i*2.094;g.lineTo(Math.cos(q)*R*.78,Math.sin(q)*R*.78)}g.closePath();g.stroke();g.beginPath();for(let i=0;i<3;i++){const q=i*2.094+1.047;g.lineTo(Math.cos(q)*R*.78,Math.sin(q)*R*.78)}g.closePath();g.stroke()});
 g.globalAlpha=al;g.fillStyle=col;for(let i=0;i<24;i++){g.save();g.rotate(i*.2618);g.fillRect(R*.86,-2,R*.08,4);g.restore()}g.restore();g.globalAlpha=1},delay)}
function rays(x,y,col,dur,delay){fx(dur,k=>{const al=k<.2?k/.2:k>.7?(1-k)/.3:1;g.save();g.translate(x,y);g.rotate(k*.6);g.globalCompositeOperation='lighter';for(let i=0;i<14;i++){g.rotate(.4488);const gr=g.createLinearGradient(0,0,Math.max(W,H),0);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.globalAlpha=.22*al;g.fillStyle=gr;g.beginPath();g.moveTo(0,0);g.lineTo(Math.max(W,H),-28);g.lineTo(Math.max(W,H),28);g.fill()}g.restore();g.globalAlpha=1},delay)}
function darken(a,dur,delay){fx(dur,k=>{const al=k<.15?k/.15:k>.8?(1-k)/.2:1;g.globalCompositeOperation='source-over';g.globalAlpha=a*al;g.fillStyle='#05020c';g.fillRect(0,0,W,H);g.globalAlpha=1},delay)}
function hexShield(col,dur,delay,shatter){fx(dur,k=>{const Hh=HERO(),R=Math.min(W,H)*.26*(k<.15?k/.15:1),al=k>.8?(1-k)/.2:1;g.globalCompositeOperation='lighter';g.save();g.translate(Hh.x,Hh.y-10);
 g.beginPath();for(let i=0;i<6;i++){const a=i*1.047+.5236;g.lineTo(Math.cos(a)*R,Math.sin(a)*R)}g.closePath();g.globalAlpha=.16*al;g.fillStyle=col;g.fill();g.globalAlpha=al;g.strokeStyle=col;g.lineWidth=5;g.stroke();g.lineWidth=1.5;g.strokeStyle='#fff';g.stroke();
 const sy=-R+((k*3)%1)*2*R;g.globalAlpha=.5*al;g.fillStyle='#fff';g.fillRect(-R*.8,sy,R*1.6,2);g.restore();g.globalAlpha=1;if(shatter&&k>=1){shards(Hh.x,Hh.y,col,24,380)}},delay)}
function hawk(col,dur,delay,big){fx(dur,k=>{const Hh=HERO(),B=BOSS(),x=Hh.x+(B.x-Hh.x)*k,y=Hh.y-90-Math.sin(k*Math.PI)*60,s=big?2.2:1,f=Math.sin(k*40)*.5+.5;g.save();g.translate(x,y);g.scale(s,s);g.globalCompositeOperation='lighter';
 g.drawImage(glow(col),-40,-30,80,60);g.fillStyle='#fff';g.globalAlpha=.95;g.beginPath();g.moveTo(-6,0);g.quadraticCurveTo(-26,-18-f*14,-46,-6+f*6);g.quadraticCurveTo(-24,-4,-6,4);g.moveTo(6,0);g.quadraticCurveTo(26,-18-f*14,46,-6+f*6);g.quadraticCurveTo(24,-4,6,4);g.fill();g.beginPath();g.ellipse(0,2,9,5,0,0,7);g.fill();g.restore();g.globalAlpha=1;
 if(Math.random()<.6)sp({x,y,vx:rnd(-40,-10),vy:rnd(-10,30),life:.6,size:4,col,drag:.95})},delay)}
function vines(col,dur,delay){const B=BOSS();const vs=[...Array(6)].map((_,i)=>({x:B.x+rnd(-90,90),a:rnd(-.6,.6),h:rnd(140,240)}));fx(dur,k=>{const e=Math.min(1,k*2.5),al=k>.8?(1-k)/.2:1;g.globalCompositeOperation='lighter';g.lineCap='round';
 vs.forEach(v=>{[[9,.2],[3.5,1]].forEach(([lw,a])=>{g.globalAlpha=a*al;g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.moveTo(v.x,H*.92);g.bezierCurveTo(v.x+60*v.a,H*.92-v.h*.4*e,v.x-70*v.a,H*.92-v.h*.7*e,v.x+20*v.a,H*.92-v.h*e);g.stroke()})});g.globalAlpha=1},delay)}
function weapon(kind,dur,delay){fx(dur,k=>{const B=BOSS(),e=k<.6?1-Math.pow(1-k/.6,3):1,y=-H*.4+(B.y-H*.05+H*.4)*e,al=k>.85?(1-k)/.15:1,s=Math.min(W,H)/400;g.save();g.translate(B.x-W*.02,y);g.scale(s*1.5,s*1.5);
 const gr=g.createLinearGradient(0,-150,0,120);gr.addColorStop(0,'#fff6c8');gr.addColorStop(.5,'#f3c64a');gr.addColorStop(1,'#b07a12');g.globalAlpha=al;g.shadowColor='#f3c64a';g.shadowBlur=30;g.fillStyle=gr;g.strokeStyle='#fff6c8';g.lineWidth=3;g.beginPath();
 if(kind==='sword'){g.moveTo(0,-160);g.lineTo(14,60);g.lineTo(0,80);g.lineTo(-14,60);g.closePath();g.fill();g.stroke();g.fillStyle='#b07a12';g.fillRect(-46,60,92,14);g.fillRect(-7,74,14,46)}
 else if(kind==='mage'){for(let i=0;i<10;i++){const r=i%2?50:130,a=i*.628-1.5708;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.stroke()}
 else{g.lineWidth=14;g.strokeStyle=gr;g.moveTo(-40,-130);g.quadraticCurveTo(90,0,-40,130);g.stroke();g.lineWidth=2;g.strokeStyle='#fff6c8';g.beginPath();g.moveTo(-40,-130);g.lineTo(-40,130);g.stroke();g.lineWidth=7;g.beginPath();g.moveTo(-40,0);g.lineTo(150,0);g.stroke()}
 g.restore();g.globalAlpha=1},delay)}
function goldDust(dur,delay){fx(dur,k=>{if(Math.random()<.9)for(let i=0;i<4;i++)sp({x:rnd(W*.35,W*.98),y:H+10,vx:rnd(-15,15),vy:rnd(-220,-90),life:rnd(1,2),size:rnd(2,4.5),col:'#f3c64a',drag:.99})},delay)}
function stars(dur,delay){const st=[...Array(70)].map(()=>[rnd(0,1),rnd(0,1),rnd(.5,1.8),rnd(0,6)]);fx(dur,k=>{const al=k<.15?k/.15:k>.85?(1-k)/.15:1;g.globalCompositeOperation='lighter';g.fillStyle='#fff';st.forEach(s=>{g.globalAlpha=al*(.5+.5*Math.sin(clock*4+s[3]));g.beginPath();g.arc(s[0]*W,s[1]*H,s[2],0,7);g.fill()});g.globalAlpha=1},delay)}
function glyphs(dur,delay){fx(dur,k=>{const Hh=HERO(),al=k<.15?k/.15:k>.85?(1-k)/.15:1;g.globalCompositeOperation='lighter';g.font='600 34px Mitr, sans-serif';g.textAlign='center';['ก','A','中'].forEach((t,i)=>{const a=clock*2+i*2.094;g.globalAlpha=al;g.fillStyle=['#ff9ad0','#9fd8ff','#ffe08a'][i];g.shadowColor=g.fillStyle;g.shadowBlur=16;g.fillText(t,Hh.x+Math.cos(a)*95,Hh.y-30+Math.sin(a)*40)});g.shadowBlur=0;g.globalAlpha=1},delay)}
function tint(col,a,dur,delay){fx(dur,k=>{const al=k<.1?k/.1:k>.8?(1-k)/.2:1;g.globalCompositeOperation='source-over';g.globalAlpha=a*al;g.fillStyle=col;g.fillRect(0,0,W,H);g.globalAlpha=1},delay)}
/* frame loop */
function loop(now){let dt=Math.min(.05,(now-last)/1000);last=now;const real=dt;if(now<stopUntil)dt*=.06;clock+=dt;g.setTransform(cv.width/W,0,0,cv.height/H,0,0);g.clearRect(0,0,W,H);
 for(let i=FX.length-1;i>=0;i--){const f=FX[i];f.t+=dt;if(f.t<0)continue;const k=Math.min(1,f.t/f.dur);f.draw(k);if(k>=1)FX.splice(i,1)}
 for(let i=P.length-1;i>=0;i--){const p=P[i];p.t+=dt;if(p.t>=p.life){P.splice(i,1);continue}const q=p.t/p.life;p.vx*=Math.pow(p.drag,dt*60);p.vy=p.vy*Math.pow(p.drag,dt*60)+p.grav*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;const s=p.size+p.grow*p.t;
  g.globalCompositeOperation=p.add?'lighter':'source-over';g.globalAlpha=(1-q)*(p.shape==='smoke'?.8:1);
  if(p.shape==='spark'){g.strokeStyle=p.col;g.lineWidth=s*.6;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x-p.vx*.035,p.y-p.vy*.035);g.stroke();g.drawImage(glow(p.col),p.x-s*1.5,p.y-s*1.5,s*3,s*3)}
  else if(p.shape==='smoke'){g.fillStyle=p.col;g.beginPath();g.arc(p.x,p.y,s,0,7);g.fill()}
  else if(p.shape==='shard'){g.save();g.translate(p.x,p.y);g.rotate(p.rot);g.fillStyle=p.col;g.beginPath();g.moveTo(0,-s);g.lineTo(s*.45,0);g.lineTo(0,s);g.lineTo(-s*.45,0);g.fill();g.globalAlpha*=.6;g.fillStyle='#fff';g.fillRect(-1,-s*.6,2,s*.8);g.restore()}
  else g.drawImage(glow(p.col),p.x-s*1.6,p.y-s*1.6,s*3.2,s*3.2)}
 g.globalAlpha=1;g.globalCompositeOperation='source-over';
 trauma=Math.max(0,trauma-1.2*real);const sh=trauma*trauma,a=$('arena');a.style.transform=sh>0.001?`translate(${14*sh*Math.sin(clock*47)}px,${9*sh*Math.sin(clock*61+1)}px) rotate(${.012*sh*Math.sin(clock*37)}rad)`:'';
 requestAnimationFrame(loop)}
requestAnimationFrame(loop);
/* ---------- skill recipes: class -> branch -> tier ---------- */
const lunge=()=>{const h=$('hero');h.style.transform='translateX(16px) scale(1.05)';setTimeout(()=>h.style.transform='',180)};
const R={
 sword:{base(d){lunge();slash('#ffd76a',-2.4,.6,90,9,.45,0);slash('#ffd76a',-.4,2.6,80,9,.45,.18);setTimeout(()=>impact('#ffd76a',.45,d),330)},
  A:[d=>{lunge();slash('#ffe9a8',-2.4,.6,95,10,.4,0);shot({col:'#fff2c0',dur:.18,size:10,delay:.25,trail:6,hit:()=>{shards(BOSS().x,BOSS().y,'#c9c9d6',18,420);impact('#ffd76a',.7,d)}})},
     d=>{lunge();[0,.16,.32].forEach((t,i)=>slash('#ff8a2a',-2.6+i*.4,.8+i*.3,95-i*8,12,.5,t));setTimeout(()=>{impact('#ff7a1a',.9,d);const B=BOSS();fx(1.6,()=>{if(Math.random()<.8)embers(B.x,B.y+20,'#ff6a1a',2,{size:rnd(4,9)})})},520)},
     d=>{lunge();shot({col:'#bfe2ff',dur:.45,size:26,trail:8,from:{x:HERO().x+40,y:HERO().y-40},hit:()=>{impact('#9fd0ff',1.1,d);slash('#dff1ff',-1.8,1.4,120,16,.45,0)}});fx(.45,k=>{const H0=HERO(),B=BOSS(),x=H0.x+40+(B.x-H0.x-40)*k,y=H0.y-40+(B.y-H0.y+40)*k;g.globalCompositeOperation='lighter';g.strokeStyle='#e8f6ff';g.lineWidth=7;g.beginPath();g.arc(x-30,y,70,-1.1,1.1);g.stroke()})},
     d=>{lunge();for(let i=0;i<7;i++)slash(i%2?'#fff1b0':'#ffc83a',-2.8+i*.55,.4+i*.55,70+i*9,11,.32,i*.1);setTimeout(()=>impact('#ffc83a',1.35,d),800)},
     d=>{weapon('sword',1.6,0);setTimeout(()=>{slash('#fff6c8',-2.4,.7,150,22,.5,0);slash('#fff6c8',-.7,2.4,150,22,.5,.12);impact('#f3c64a',1.8,d,true)},1350)}],
  B:[d=>{hexShield('#ffd76a',1.6,0,true);lunge();slash('#ffd76a',-2.4,.6,85,8,.4,.3);setTimeout(()=>impact('#ffd76a',.45,d),650)},
     d=>{fx(.5,k=>{const B=BOSS(),y=-60+(B.y-60+60)*k*k;g.save();g.translate(B.x,y);g.globalCompositeOperation='lighter';g.drawImage(glow('#ffd76a'),-70,-70,140,140);g.fillStyle='#fff3c0';g.fillRect(-40,-24,80,36);g.fillRect(-6,12,12,60);g.restore()});setTimeout(()=>{impact('#ffd76a',1,d);const B=BOSS();fx(.6,k=>{g.globalCompositeOperation='lighter';g.globalAlpha=1-k;const gr=g.createLinearGradient(B.x,0,B.x,H);gr.addColorStop(0,'rgba(255,220,120,0)');gr.addColorStop(1,'#ffe08a');g.fillStyle=gr;g.fillRect(B.x-40,0,80,H);g.globalAlpha=1})},500)},
     d=>{hexShield('#dff1ff',1.4,0);setTimeout(()=>{const H0=HERO(),B=BOSS();bolt(H0.x+60,H0.y-30,B.x,B.y,'#bfe8ff',.4);setTimeout(()=>impact('#bfe8ff',1,d),150)},450)},
     d=>{fx(1.4,k=>{const H0=HERO(),e=Math.min(1,k*3),al=k>.8?(1-k)/.2:1;g.globalCompositeOperation='lighter';g.globalAlpha=al;[-110,110].forEach(o=>{g.drawImage(glow('#f3c64a'),H0.x+o-40,H0.y-130*e,80,140*e)});g.fillStyle='#fff3c0';[-110,110].forEach(o=>g.fillRect(H0.x+o-14,H0.y+40-150*e,28,150*e));g.globalAlpha=1});lunge();slash('#ffc83a',-2.4,.7,100,12,.45,.5);setTimeout(()=>impact('#ffc83a',1.3,d),850)},
     d=>{weapon('sword',1.6,0);hexShield('#f3c64a',2,0,true);setTimeout(()=>{slash('#fff6c8',-2.4,.7,150,22,.5,0);impact('#f3c64a',1.8,d,true)},1350)}]},
 mage:{base(d){glyphEye();shot({col:'#b48cff',dur:.4,size:14,trail:5,hit:()=>impact('#b48cff',.45,d)})},
  A:[d=>meteor(d,'#b48cff',1,1),
     d=>{tint('#9fd8ff',.18,1.4,0);const B=BOSS();fx(1,k=>{for(let i=0;i<3;i++)sp({x:B.x+rnd(-140,140),y:-10,vx:rnd(-60,-20),vy:rnd(500,700),life:.7,size:rnd(5,9),col:'#cfefff',shape:'shard',grav:300,rot:2.8})});setTimeout(()=>{smoke(B.x,B.y+40,10,'rgba(200,235,255,.35)');impact('#9fd8ff',.9,d)},700)},
     d=>{const H0=HERO();fx(1,k=>{const B=BOSS();for(let i=0;i<6;i++){const t=rnd(0,1);sp({x:H0.x+60,y:H0.y-40,vx:(B.x-H0.x)*rnd(1.1,1.6),vy:(B.y-H0.y+40)*rnd(1.1,1.6)+rnd(-80,80),life:.7,size:rnd(8,16),grow:20,col:Math.random()<.5?'#ff7a1a':'#ffb03a',drag:.96})}if(Math.random()<.3)smoke(BOSS().x,BOSS().y,1)});setTimeout(()=>impact('#ff7a1a',1,d),600)},
     d=>{const B=BOSS();darken(.4,1.4,0);[0,.22,.44].forEach((t,i)=>bolt(B.x+rnd(-60,60),-10,B.x+rnd(-30,30),B.y,'#b48cff',.45,t));setTimeout(()=>impact('#c9a8ff',1.35,d),520)},
     d=>{weapon('mage',1.5,0);setTimeout(()=>{for(let i=0;i<4;i++)meteor(0,'#f3c64a',.8,0,i*.12);setTimeout(()=>impact('#f3c64a',1.9,d,true),700)},1200)}],
  B:[d=>{glyphEye();setTimeout(()=>shards(HERO().x,HERO().y-40,'#d9c8ff',16,260),300);shot({col:'#c9a8ff',dur:.4,size:12,delay:.35,hit:()=>impact('#c9a8ff',.5,d)})},
     d=>{circle(HERO().x,HERO().y+60,90,'#c9a8ff',1.5,0,2,.3);glyphs(1.5,0);shot({col:'#c9a8ff',dur:.4,size:14,delay:.6,hit:()=>impact('#c9a8ff',.7,d)})},
     d=>{const B=BOSS();circle(B.x,B.y,120,'#b48cff',1.6,0,-2);fx(1.2,k=>{g.globalCompositeOperation='lighter';g.strokeStyle='#d9c8ff';g.lineWidth=3;g.globalAlpha=1-k;for(let i=0;i<4;i++){const a=i*1.57+.78;g.beginPath();g.moveTo(B.x+Math.cos(a)*200,B.y+Math.sin(a)*200);g.lineTo(B.x+Math.cos(a)*40,B.y+Math.sin(a)*40);g.stroke()}g.globalAlpha=1},.3);setTimeout(()=>impact('#b48cff',1,d),900)},
     d=>{tint('#6fb8ff',.22,1.6,0);const B=BOSS();circle(W*.5,H*.45,Math.min(W,H)*.38,'#9fd8ff',1.6,0,-3);setTimeout(()=>{for(let i=0;i<5;i++)shot({col:'#c9a8ff',dur:.3,size:12,delay:i*.08,from:{x:HERO().x+60,y:HERO().y-80+i*20}});setTimeout(()=>impact('#c9a8ff',1.3,d),500)},900)},
     d=>{weapon('mage',1.5,0);glyphs(2.2,0);setTimeout(()=>{meteor(0,'#f3c64a',1,0);setTimeout(()=>impact('#f3c64a',1.8,d,true),500)},1200)}]},
 archer:{base(d){reticle();shot({col:'#7dffb0',dur:.25,size:8,arrow:true,trail:4,delay:.25,hit:()=>impact('#7dffb0',.45,d)})},
  A:[d=>{[0,.1,.2].forEach((t,i)=>shot({col:'#7dffb0',dur:.25,size:8,arrow:true,trail:4,delay:t,from:{x:HERO().x+40,y:HERO().y-50+i*18},hit:()=>burst(BOSS().x,BOSS().y,'#7dffb0',10,300)}));setTimeout(()=>impact('#7dffb0',.7,d),480)},
     d=>{[0,.12,.24].forEach((t,i)=>shot({col:'#ff9a3a',dur:.3,size:9,arrow:true,fire:true,trail:5,delay:t,arc:30,from:{x:HERO().x+40,y:HERO().y-50+i*18}}));setTimeout(()=>{impact('#ff7a1a',.9,d);const B=BOSS();fx(1.4,()=>{if(Math.random()<.8)embers(B.x,B.y+20,'#ff6a1a',2)})},560)},
     d=>{const H0=HERO(),B=BOSS();fx(.5,k=>{const x=H0.x+60+(B.x-H0.x-60)*k,y=H0.y-40+(B.y-H0.y+40)*k;for(let i=0;i<4;i++){const a=clock*30+i*1.57;sp({x:x+Math.cos(a)*24,y:y+Math.sin(a)*24,life:.5,size:6,col:'#9dffc4',drag:.9})}});shot({col:'#d6ffe6',dur:.5,size:12,arrow:true,trail:2,hit:()=>{shock(B.x,B.y,'#9dffc4',220,.6,10);impact('#7dffb0',1.1,d)}})},
     d=>{darken(.45,1.6,0);rays(W*.5,-20,'#9dffc4',1.6,0);const B=BOSS();fx(.9,k=>{for(let i=0;i<2;i++)shot({col:'#9dffc4',dur:.25,size:7,arrow:true,trail:2,from:{x:B.x+rnd(-160,120),y:-20},to:{x:B.x+rnd(-60,60),y:B.y+rnd(-40,60)},hit:to=>burst(to.x,to.y,'#9dffc4',5,240)})},.2);setTimeout(()=>impact('#7dffb0',1.35,d),1100)},
     d=>{weapon('archer',1.5,0);setTimeout(()=>{shot({col:'#f3c64a',dur:.35,size:22,arrow:true,trail:10,from:{x:W*.5,y:H*.3},hit:()=>impact('#f3c64a',1.9,d,true)})},1200)}],
  B:[d=>{reticle(true);shot({col:'#7dffb0',dur:.25,size:8,arrow:true,delay:.45,hit:()=>impact('#7dffb0',.5,d)})},
     d=>{hawk('#9dffc4',.9,0);setTimeout(()=>impact('#7dffb0',.7,d),850)},
     d=>{vines('#5fe08a',1.6,0);setTimeout(()=>shot({col:'#7dffb0',dur:.25,size:8,arrow:true,hit:()=>impact('#7dffb0',1,d)}),600)},
     d=>{hexShield('#9dffc4',1.6,0);hawk('#9dffc4',1,.3);setTimeout(()=>impact('#7dffb0',1.2,d),1250)},
     d=>{weapon('archer',1.5,0);setTimeout(()=>{hawk('#f3c64a',.8,0,true);setTimeout(()=>impact('#f3c64a',1.8,d,true),750)},1200)}]}};
function meteor(d,col,pow,withHit,delay){const B=BOSS(),tx=B.x+rnd(-40,40);circle(B.x,B.y+H*.3,110,col,1.1,delay||0,3,.25);shot({col,dur:.55,size:22*pow+8,trail:6,fire:true,smoke:true,ease:'in',delay:(delay||0)+.25,from:{x:tx+W*.25,y:-40},to:{x:tx,y:B.y},hit:to=>{if(withHit)impact(col,1.1*pow,d,false,to);else{flashAt(to.x,to.y,col,120,.35);shock(to.x,to.y,col,180,.5,12);burst(to.x,to.y,col,24,520);smoke(to.x,to.y,6);shake(.4)}}})}
function glyphEye(){const H0=HERO();fx(1,k=>{const al=Math.sin(k*Math.PI);g.globalCompositeOperation='lighter';g.globalAlpha=al;g.strokeStyle='#c9a8ff';g.lineWidth=4;g.beginPath();g.ellipse(H0.x,H0.y-150,60,24,0,0,7);g.stroke();g.drawImage(glow('#8e5cff'),H0.x-30,H0.y-180,60,60);g.globalAlpha=1})}
function reticle(lock){fx(.9,k=>{const B=BOSS(),r=lock?110-60*Math.min(1,k*2):70,al=Math.sin(k*Math.PI);g.globalCompositeOperation='lighter';g.globalAlpha=al;g.strokeStyle='#7dffb0';g.lineWidth=3;g.beginPath();g.arc(B.x,B.y,r,0,7);g.stroke();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{g.beginPath();g.moveTo(B.x+a*(r+25),B.y+b*(r+25));g.lineTo(B.x+a*(r-15),B.y+b*(r-15));g.stroke()});g.globalAlpha=1})}
/* tier wrappers: cut-in from 35, darkness and light rays from 40, god scene at 60 */
function cutin(s,t){const e=document.createElement('div');e.className='cut'+(t>=4?' gold':'');e.style.setProperty('--c',C(cur));e.innerHTML=`<span style="display:block;height:150%;aspect-ratio:200/240">${AV[cur]}</span><div><b>${s[1]}</b><small>เลเวล ${s[0]} · ${T[cur].n}</small></div>`;$('fx').appendChild(e);setTimeout(()=>e.remove(),1150)}
function play(s,t){$('status').textContent=`${s[1]} · ลดเลือดบอส ${s[2]} · ${s[3]}`;const h=$('hero');h.classList.toggle('glow',t>=2);setTimeout(()=>h.classList.remove('glow'),2800);
 const run=()=>{const f=t===0?R[cur].base:R[cur][br][t-1];f(s[2])};let delay=0;
 if(t===5){darken(.9,3.4,0);stars(3.4,0);circle(W*.62,H*.5,Math.min(W,H)*.42,'#f3c64a',3,0,1.2);rays(W*.78,H*.4,'#f3c64a',3,.4);goldDust(2.6,.3)}
 else if(t===4){darken(.5,2.2,0);rays(BOSS().x,BOSS().y,C(cur),2,0)}
 if(t>=3){cutin(s,t);delay=t===5?1100:950}setTimeout(run,delay)}
/* ---------- page ---------- */
function skillsOf(k,b){return [T[k].base].concat(T[k][b][2])}
function draw(){document.documentElement.style.setProperty('--c',C(cur));$('hero').innerHTML=AV[cur];
 $('tabs').innerHTML=Object.keys(T).map(k=>`<button class="tab" style="--c:${C(k)}" aria-pressed="${k===cur}" data-k="${k}">${T[k].n}</button>`).join('');
 $('branch').innerHTML=['A','B'].map(b=>`<button class="tab" style="--c:${C(cur)}" aria-pressed="${b===br}" data-b="${b}">สาย${T[cur][b][0]} <small style="font-weight:400;opacity:.85">· ${T[cur][b][1]}</small></button>`).join('');
 $('skills').innerHTML=skillsOf(cur,br).map((s,i)=>`<button class="sk t${i}" style="--c:${C(cur)}" data-i="${i}">${s[1]}<small>Lv ${s[0]} · ดาเมจ ${s[2]}</small></button>`).join('')}
$('tabs').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b){cur=b.dataset.k;draw()}});
$('branch').addEventListener('click',e=>{const b=e.target.closest('[data-b]');if(b){br=b.dataset.b;draw()}});
$('skills').addEventListener('click',e=>{const b=e.target.closest('[data-i]');if(!b)return;const i=+b.dataset.i;play(skillsOf(cur,br)[i],i)});
$('tierList').innerHTML=TIERS.map(x=>`<div class="tier"><b>เลเวล ${x[0]}</b><span class="mut">${x[1]}</span><div>${x[2]}</div></div>`).join('');
$('trees').innerHTML=Object.keys(T).map(k=>{const Q=T[k],row=(s,cls)=>`<tr class="${cls||''}"><td>${s[0]}</td><td><b>${s[1]}</b><div class="mut">${s[3]}</div></td><td class="n">${s[2]}</td></tr>`;
 return `<div class="card"><h3 style="font-size:22px;color:${Q.c}">${Q.n}</h3><p class="mut" style="margin:4px 0 0">พื้นฐาน: ${Q.base[1]} (ดาเมจ ${Q.base[2]}) · ${Q.base[3]}</p>`+['A','B'].map(b=>`<table><thead><tr><th style="width:44px">Lv</th><th>สาย${Q[b][0]} <span class="mut">· ${Q[b][1]}</span></th><th style="text-align:right">ดาเมจ</th></tr></thead><tbody>${Q[b][2].map(s=>row(s,s[0]===60?'god':'')).join('')}</tbody></table>`).join('')+'</div>'}).join('');
$('ba').innerHTML=['mage','sword'].map(k=>`<div>${AV[k+'_old']}<span>ตอนนี้</span></div><div>${AV[k]}<span>แบบใหม่</span></div>`).join('');
window.__play=(k,b,i)=>{cur=k;br=b;draw();play(skillsOf(k,b)[i],i)};
draw();
}
