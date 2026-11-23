/* =====================================================================
   HAIRSTYLES — glossy anime styles. Color comes from the Hair Color item
   (or the class default); a = accessory color, b = tips / streak color.
   Each style draws a back layer (behind head/body) and a front layer.
   ===================================================================== */
var CAP='M52 100C46 52 74 36 100 36S154 52 148 100';
function hp(d,fill,extra){return '<path d="'+d+'" fill="'+fill+'"'+(extra||'')+'/>'}
function star4(x,y,r,c){return '<path d="M'+x+' '+(y-r)+'Q'+x+' '+y+' '+(x+r)+' '+y+'Q'+x+' '+y+' '+x+' '+(y+r)+'Q'+x+' '+y+' '+(x-r)+' '+y+'Q'+x+' '+y+' '+x+' '+(y-r)+'z" fill="'+c+'"/>'}
function shine(b){return '<path d="M62 64C82 52 118 52 138 64" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/>'+
  '<path d="M70 72C78 66 86 64 92 64M110 64C118 64 124 66 130 70" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" stroke-linecap="round"/>'+star4(144,50,6,'#fff')+star4(58,62,4,b)}
function lockL(d,fill){return hp(d,fill)+mirror(hp(d,fill))}
var HSET={
 princess:{back:function(g){return hp('M50 88C40 140 40 196 56 220c8-8 14 2 22-6 8 8 14-2 22 6 8-8 14 2 22-6 8 8 14-2 22 6 16-24 16-80 6-132z',g.B)},
  front:function(g){return hp(CAP+'C144 82 132 70 116 64C110 76 96 82 80 84C68 86 58 92 52 100z',g.F)+lockL('M54 90C44 120 46 148 60 166C62 146 60 118 64 96z',g.F)+
   '<path d="M136 54l6 8-6 8-6-8z" fill="'+g.a+'" stroke="#fff" stroke-width="1"/><circle cx="128" cy="62" r="2.5" fill="'+g.a+'"/><circle cx="144" cy="64" r="2.5" fill="'+g.a+'"/>'}},
 twindrill:{back:function(g){return hp('M52 92C50 120 56 136 64 140H136C144 136 150 120 148 92z',g.B)},
  front:function(g){var dr='';[[104,13],[118,12],[132,11],[146,10],[158,8]].forEach(function(p){dr+='<ellipse cx="46" cy="'+p[0]+'" rx="'+p[1]+'" ry="9" fill="'+g.c+'" stroke="'+g.cd+'" stroke-width="1.5"/><path d="M'+(46-p[1]+3)+' '+(p[0]-2)+'Q46 '+(p[0]+6)+' '+(46+p[1]-3)+' '+(p[0]-2)+'" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>'});
   var bow='<path d="M60 58l-14-8v16zM60 58l14-8v16z" fill="'+g.a+'"/><circle cx="60" cy="58" r="4" fill="'+shade(g.a,-30)+'"/>';
   return hp(CAP+'C146 84 140 76 132 74C126 82 116 84 108 78C100 86 90 86 84 78C76 84 66 82 60 76C56 82 54 90 52 100z',g.F)+dr+mirror(dr)+bow+mirror(bow)}},
 hime:{back:function(g){return hp('M50 86C48 140 48 180 52 198H148C152 180 152 140 150 86z',g.B)},
  front:function(g){return hp(CAP+'L146 78H54z',g.F)+lockL('M50 82h15v66q-8 4-15 0z',g.F)+'<path d="M56 78H144" stroke="'+g.cd+'" stroke-width="1.5" opacity=".5"/><circle cx="62" cy="150" r="3" fill="'+g.a+'"/><circle cx="138" cy="150" r="3" fill="'+g.a+'"/>'}},
 bobshort:{back:function(g){return hp('M48 90C44 120 46 138 56 148H144C154 138 156 120 152 90z',g.O)},
  front:function(g){return hp(CAP+'C142 86 130 72 114 70C104 80 86 84 70 82C62 88 56 94 52 100z',g.F)+lockL('M52 96C48 118 50 136 60 148L67 141C61 127 61 112 63 98z',g.O)}},
 highpony:{back:function(g){return hp('M118 46C150 40 172 70 170 110C168 140 176 160 186 178C160 172 150 142 150 112C150 84 138 66 116 60z',g.B)+
   '<path d="M152 78C160 104 158 136 170 162" fill="none" stroke="'+g.b+'" stroke-width="3" stroke-linecap="round" opacity=".85"/>'},
  front:function(g){return hp(CAP+'C144 84 136 76 126 72C120 82 108 86 98 80C90 88 78 88 70 82C62 88 56 94 52 100z',g.F)+lockL('M54 92C50 108 52 122 58 132C60 118 60 106 62 96z',g.F)+
   '<path d="M126 48l14-12 2 16zM126 48l-2-18 14 8z" fill="'+g.a+'"/><circle cx="127" cy="48" r="4" fill="'+shade(g.a,-30)+'"/>'}},
 bun:{back:function(g){return '<circle cx="60" cy="48" r="17" fill="'+g.F+'"/><circle cx="140" cy="48" r="17" fill="'+g.F+'"/>'+lockL('M50 56C40 80 42 104 50 118 54 98 54 80 58 64z',g.B)},
  front:function(g){var pin='<path d="M48 36L70 58" stroke="'+GOLD+'" stroke-width="2.5" stroke-linecap="round"/><circle cx="48" cy="36" r="4" fill="'+g.a+'" stroke="#fff"/>';
   return hp(CAP+'L140 80 130 88 122 76 112 88 100 76 88 88 78 76 70 88 60 80z',g.F)+pin+mirror(pin)+'<path d="M50 40C56 34 64 32 70 36M130 36C136 32 144 34 150 40" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>'}},
 braid:{back:function(g){return hp('M50 90C48 120 52 140 60 146H140C148 140 152 120 150 90z',g.B)},
  front:function(g){var br='';for(var i=0;i<7;i++){var y=112+i*13;br+='<ellipse cx="'+(58+i*1.2)+'" cy="'+y+'" rx="'+(10-i*.6)+'" ry="8" fill="'+g.c+'" stroke="'+g.cd+'" stroke-width="1.2" transform="rotate('+(i%2?25:-25)+' '+(58+i*1.2)+' '+y+')"/>'}
   var fl='';for(var k=0;k<5;k++){var an=k*72*Math.PI/180;fl+='<circle cx="'+f1(66+Math.cos(an)*5)+'" cy="'+f1(198+Math.sin(an)*5)+'" r="4" fill="'+g.a+'"/>'}fl+='<circle cx="66" cy="198" r="3" fill="'+GOLD+'"/>';
   return hp(CAP+'C144 82 132 70 116 64C110 76 96 82 80 84C68 86 58 92 52 100z',g.F)+br+fl}},
 fluffy:{back:function(g){return hp('M44 96C34 70 54 40 82 38C96 26 120 28 132 40C158 44 168 72 156 98C164 120 150 140 136 138H64C48 140 36 120 44 96z',g.B)},
  front:function(g){return hp(CAP+'C150 88 144 80 136 80C134 88 126 92 118 86C114 94 104 94 98 86C92 94 82 94 78 86C72 92 62 90 60 82C54 86 52 92 52 100z',g.F)+
   hp('M100 38C96 22 108 12 118 18C110 18 104 26 106 38z',g.F)+'<path d="M138 56l2.4 5 5.4.6-4 3.7 1.2 5.4-5-2.8-5 2.8 1.2-5.4-4-3.7 5.4-.6z" fill="'+g.a+'" stroke="#fff" stroke-width=".8"/>'}},
 mermaid:{back:function(g){return hp('M48 88C34 150 30 206 44 236C60 222 70 236 86 226 98 236 112 226 124 236 138 222 152 236 160 222C168 190 166 140 152 88z',g.O)},
  front:function(g){return hp(CAP+'C144 80 128 66 104 60L100 66L96 60C72 66 56 80 52 100z',g.F)+lockL('M52 92C42 130 46 170 58 196C62 166 60 126 64 96z',g.O)+
   '<circle cx="64" cy="68" r="3.4" fill="'+g.a+'" stroke="#d8c8e8"/><circle cx="71" cy="63" r="3.4" fill="'+g.a+'" stroke="#d8c8e8"/><circle cx="79" cy="60" r="3.4" fill="'+g.a+'" stroke="#d8c8e8"/>'}},
 sidetail:{back:function(g){return hp('M138 60C168 66 180 100 172 136C168 156 176 170 182 180C158 176 152 150 154 126C156 100 150 82 134 74z',g.B)},
  front:function(g){return hp(CAP+'C146 86 140 76 130 70C126 82 118 86 110 82C100 90 84 92 70 88C62 92 56 96 52 100z',g.F)+hp('M54 92C46 116 48 138 58 152C60 132 60 112 64 96z',g.F)+
   '<ellipse cx="142" cy="66" rx="9" ry="11" fill="'+g.a+'" stroke="'+shade(g.a,-30)+'" stroke-width="1.5"/><path d="M136 60q6 6 12 0M136 72q6-6 12 0" stroke="'+shade(g.a,-30)+'" fill="none"/>'}},
 spiky:{back:function(g){return hp('M52 96C50 120 56 134 64 138H136C144 134 150 120 148 96z',g.B)+lockL('M52 80L26 70 48 98zM62 56L34 38 62 72z',g.B)},
  front:function(g){var tips=[[100,16],[70,26],[132,26],[44,46],[156,46]].map(function(p){return '<path d="M'+(p[0]-5)+' '+(p[1]+10)+'L'+p[0]+' '+p[1]+'L'+(p[0]+5)+' '+(p[1]+10)+'z" fill="'+g.b+'"/>'}).join('');
   return hp('M52 100L42 74 56 70 44 46 68 52 70 26 90 42 100 16 112 40 132 26 132 52 156 46 144 70 158 74 148 100 140 82 132 92 124 76 112 90 102 74 92 90 82 76 72 92 62 80z',g.F)+tips}},
 undercut:{back:function(g){return hp('M54 92C52 116 56 128 62 132H138C144 128 148 116 146 92z',g.B)},
  front:function(g){return lockL('M52 102C50 88 52 78 56 72L62 100z',g.cd,' opacity=".55"')+hp('M56 96C50 64 64 36 96 30C124 26 150 40 152 66C154 80 150 90 146 96C142 74 128 60 104 60C84 60 66 72 60 96z',g.F)+
   '<path d="M70 64C84 46 110 40 132 46M76 72C92 58 116 54 138 60" fill="none" stroke="'+g.cd+'" stroke-width="1.6" opacity=".7"/>'}},
 wolf:{back:function(g){return hp('M50 90C44 120 48 150 58 168L66 156 72 172 80 158 88 170 96 158 104 170 112 158 120 172 128 156 136 168 142 156C152 140 156 112 150 90z',g.B)},
  front:function(g){return hp(CAP+'L144 84 136 96 130 78 120 92 114 74 104 90 96 74 88 92 80 78 72 94 64 80 58 96z',g.F)+lockL('M52 96L46 122 56 112 54 136 64 118 62 98z',g.F)+
   '<path d="M90 44L84 76M118 46L124 76" stroke="'+g.b+'" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>'}},
 topknot:{back:function(){return ''},
  front:function(g){return hp(CAP+'C146 84 138 72 126 68C116 74 104 76 92 72C80 76 66 80 56 88C54 92 52 96 52 100z',g.F)+lockL('M52 98C52 108 54 116 58 122L60 100z',g.F)+
   hp('M100 22C106 6 120 2 128 8C118 8 110 14 106 24z',g.F)+'<circle cx="100" cy="30" r="12" fill="'+g.F+'"/><rect x="91" y="38" width="18" height="6" rx="2" fill="'+g.a+'"/>'}},
 longknight:{back:function(g){return hp('M50 88C46 140 48 180 56 204H144C152 180 154 140 150 88z',g.B)},
  front:function(g){return hp(CAP+'C150 80 140 62 124 58C110 70 90 80 66 86C60 90 56 94 52 100z',g.F)+hp('M146 92C156 120 154 150 146 174C140 150 140 120 138 98z',g.F)+hp('M54 92C48 108 50 122 56 132C58 118 58 106 60 96z',g.F)+
   '<rect x="140" y="148" width="14" height="6" rx="2" fill="'+g.a+'" transform="rotate(-8 147 151)"/><circle cx="147" cy="151" r="2" fill="#fff"/>'}},
 curtain:{back:function(g){return hp('M52 94C50 118 56 132 64 136H136C144 132 150 118 148 94z',g.B)},
  front:function(g){return hp(CAP+'L140 88C130 70 112 60 100 50C88 60 70 70 60 88z',g.F)+lockL('M52 96C50 108 52 118 56 124L60 98z',g.F)}},
 messy:{back:function(g){return hp('M48 96C42 116 50 132 62 138H138C150 132 158 116 152 96z',g.B)},
  front:function(g){return hp(CAP+'L150 84 140 90 142 74 130 84 126 70 116 82 108 70 100 84 92 70 84 82 74 70 70 84 58 74 60 90 50 84z',g.F)+hp('M96 38C88 20 102 10 112 16C102 18 98 26 102 38z',g.F)}},
 fauxhawk:{back:function(g){return hp('M54 94C52 116 56 128 62 132H138C144 128 148 116 146 94z',g.B)},
  front:function(g){return hp('M52 100C48 66 70 50 100 50S152 66 148 100C146 86 140 78 130 74L110 64 90 64 70 74C60 80 54 90 52 100z',g.F)+
   '<path d="M82 58L88 18 100 34 106 8 114 32 124 18 122 60z" fill="url(#'+g.u+'hx)"/><path d="M100 36L104 14M112 34L120 22" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/>'}},
 shoulder:{back:function(g){return hp('M50 90C44 120 46 146 56 160L68 150 80 162 92 150 108 150 120 162 132 150 144 160C154 146 156 120 150 90z',g.B)},
  front:function(g){return hp(CAP+'C146 84 138 74 126 70C118 78 108 80 100 76C96 92 90 104 80 114C72 120 62 118 56 110C54 106 52 104 52 100z',g.F)+hp('M146 94C150 112 148 128 142 140C140 124 140 108 138 98z',g.F)+
   '<path d="M98 80C94 94 88 104 80 112" fill="none" stroke="'+g.b+'" stroke-width="3" stroke-linecap="round"/>'}},
 waveprince:{back:function(g){return hp('M48 92C42 112 46 130 54 138C60 146 70 144 76 140H124C130 144 140 146 146 138C154 130 158 112 152 92z',g.B)},
  front:function(g){return hp(CAP+'C152 88 146 78 138 80C140 70 130 64 122 70C120 60 108 58 102 66C96 58 84 60 82 70C74 64 62 70 64 80C56 78 50 88 52 100z',g.F)+
   '<path d="M70 82c4-6 10-6 12 0M120 72c4-6 10-6 12 0M92 70c4-6 10-6 12 0" fill="none" stroke="'+g.cd+'" stroke-width="1.5"/><path d="M134 46l3 5 5 1-4 3 1 5-5-3-5 3 1-5-4-3 5-1z" fill="'+g.a+'"/>'}}
};
function hairCtx(c,cd,a,b,u){return {c:c,cd:cd,a:a,b:b,u:u,F:'url(#'+u+'hf)',B:'url(#'+u+'hk)',O:'url(#'+u+'ho)',
  defs:'<defs><linearGradient id="'+u+'hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+shade(c,35)+'"/><stop offset=".55" stop-color="'+c+'"/><stop offset="1" stop-color="'+shade(c,-25)+'"/></linearGradient>'+
   '<linearGradient id="'+u+'hk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+cd+'"/><stop offset="1" stop-color="'+shade(cd,-20)+'"/></linearGradient>'+
   '<linearGradient id="'+u+'ho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+c+'"/><stop offset=".45" stop-color="'+c+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient>'+
   '<linearGradient id="'+u+'hx" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="'+c+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs>'}}
var HAIR_KINDS=Object.keys(HSET);
