/* =====================================================================
   PRODUCTION PRACTICE — lessons and reviews also ask the player to USE the
   language, not only recognise it:
   · type  : type the word (English, Thai, or Chinese characters / pinyin)
   · order : put the words of a sentence in the right order (sentence bank)
   · speak : say the word out loud (browser speech recognition)
   Each counts as one ordinary question: same scoring, same review timer,
   same anti-cheat record. Players can switch each kind off in Settings.
   ===================================================================== */
Object.assign(L,{
 s_ptype:m('ฝึกพิมพ์คำ','Typing practice','打字练习'),s_porder:m('ฝึกเรียงประโยค','Sentence building','排句练习'),s_pspeak:m('ฝึกพูด (ใช้ไมโครโฟน)','Speaking practice (microphone)','口语练习(麦克风)'),
 q_type:m('พิมพ์คำนี้เป็นภาษา','Type this word in','用这种语言输入'),q_order:m('เรียงคำให้เป็นประโยคภาษา','Put the words in order in','把词语排成句子:'),q_speak:m('พูดคำนี้ออกเสียงเป็นภาษา','Say this word out loud in','大声说出这个词:'),
 ty_ph:m('พิมพ์คำตอบที่นี่','Type your answer','在这里输入'),ty_zh:m('พิมพ์ตัวจีน หรือพินอินไม่ต้องใส่วรรณยุกต์ (เช่น nihao)','Type the characters, or pinyin without tones (e.g. nihao)','输入汉字,或不带声调的拼音(如 nihao)'),
 ty_letters:m('{n} ตัวอักษร','{n} letters','{n} 个字母'),ty_check:m('ตรวจคำตอบ','Check','检查'),ty_you:m('คุณตอบว่า','You answered','你的答案'),
 or_tap:m('แตะคำด้านล่างตามลำดับ แตะคำที่เลือกแล้วเพื่อเอาออก','Tap the words below in order; tap a chosen word to remove it','按顺序点击下面的词;点击已选的词可移除'),or_right:m('ประโยคที่ถูก','Correct sentence','正确的句子'),
 sp_tap:m('🎤 กดแล้วพูด','🎤 Tap and speak','🎤 点击后说话'),sp_listening:m('กำลังฟัง… พูดได้เลย','Listening… speak now','正在听…请说'),sp_heard:m('ได้ยินว่า','Heard','听到'),
 sp_again:m('ยังไม่ตรง ลองอีกครั้ง ({n}/3)','Not quite. Try again ({n}/3)','还不太对,再试一次({n}/3)'),sp_model:m('ฟังตัวอย่าง','Hear it','听示范'),
 sp_skip:m('ไมค์ใช้ไม่ได้ / ข้าม','Mic not working / skip','麦克风不可用 / 跳过'),sp_err:m('เปิดไมโครโฟนไม่ได้ ตรวจสิทธิ์ไมค์ของเบราว์เซอร์ หรือกด "ข้าม" เพื่อตอบแบบเลือกคำแทน','Couldn\'t use the microphone. Check the browser\'s mic permission, or tap "skip" to answer by choosing instead','无法使用麦克风。请检查浏览器的麦克风权限,或点击“跳过”改为选择题'),
 sp_nohear:m('ไม่ได้ยินเสียง ลองพูดใกล้ไมค์อีกครั้ง','Didn\'t hear anything. Try again closer to the mic','没有听到声音,请靠近麦克风再试')});
var PROD={type:1,order:1,speak:1},SR_LANG={th:'th-TH',en:'en-US',zh:'zh-CN'};
function isProd(q){return !!(q&&PROD[q.type])}
function srAvail(){try{return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}catch(e){return false}}
function sentTok(s,l){var v=s&&s[l];if(!v)return [];return l==='en'?v.replace(/[.,!?;:]/g,'').split(/\s+/).filter(Boolean):v.split('|').map(function(x){return x.trim()}).filter(Boolean)}
function sentText(s,l){if(!s)return '';if(l==='en')return s.en;return sentTok(s,l).join('')}
function sentPy(s){return (s.py||'').split('|').join(' ')}
/* which production kinds fit this word for these target languages */
function prodTypes(w,tg){var r=[];if(S.set.ptype!==false)r.push('type');
  if(S.set.porder!==false&&(SENT_W[w.id]||[]).some(function(s){return tg.some(function(l){return sentTok(s,l).length>=3})}))r.push('order','order');
  if(S.set.pspeak!==false&&srAvail()&&tg.some(function(l){return SR_LANG[l]}))r.push('speak');return r}
function otherLang(l,ui){return l!==ui?ui:LANGS.filter(function(x){return x!==l})[0]}
function prodSetup(q,w,tg,ui){if(!isProd(q))return false;
  if(q.type==='type'){q.to=pick(tg);q.from=otherLang(q.to,ui)}
  else if(q.type==='speak'){q.to=pick(tg.filter(function(l){return SR_LANG[l]}));q.tries=0;q.heard=''}
  else{var ss=(SENT_W[w.id]||[]).filter(function(s){return tg.some(function(l){return sentTok(s,l).length>=3})}),sn=pick(ss);
    q.sent=sn;q.to=pick(tg.filter(function(l){return sentTok(sn,l).length>=3}));q.from=otherLang(q.to,ui);q.tok=sentTok(sn,q.to);
    var idx=q.tok.map(function(_,i){return i}),tries=0;do{idx=shuffle(idx);tries++}while(tries<8&&idx.every(function(v,i){return q.tok[v]===q.tok[i]}));q.tiles=idx;q.pick=[]}
  q.opts=[w];q.ans=0;return true}
/* ---------- checking ---------- */
function nEn(x){return String(x||'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z' ]+/g,' ').replace(/\s+/g,' ').trim()}
function nEnLoose(x){return nEn(x).replace(/^(the|a|an|to) /,'')}
function nTh(x){return String(x||'').replace(/[\s​‌‍.,!?]+/g,'')}
function nPy(x){return String(x||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/v/g,'u').replace(/[^a-z]/g,'')}
function typeOk(w,l,inp){if(!inp)return false;if(l==='en')return nEnLoose(inp)===nEnLoose(w.en);if(l==='th')return nTh(inp)===nTh(w.th);
  return nTh(inp)===nTh(w.zh)||(!!w.py&&nPy(inp)===nPy(w.py))}
function heardOk(w,l,alts){return (alts||[]).some(function(a){if(l==='en'){var h=' '+nEn(a)+' ',t=' '+nEnLoose(w.en)+' ';return h.indexOf(t)>=0}
  if(l==='th')return nTh(a).indexOf(nTh(w.th))>=0;return nTh(a).indexOf(nTh(w.zh))>=0})}
function curQ(){var s=UI.sess;if(!s||s.phase!=='quiz'||!s.qs)return null;return s.qs[s.i]}
function prodAnswer(ok,given){var s=UI.sess,q=curQ();if(!q||s.picked!==null)return;q.given=given;judge(s,q,ok,ok?0:-1)}
/* ---------- views ---------- */
function prodPrompt(q){var w=q.w,h='<div class="prompt">';
  if(q.type==='type'){h+='<div class="ask">'+esc(t('q_type'))+' '+langTag(q.to)+'</div>'+(w.pic?'<div class="pic" aria-hidden="true">'+picHtml(w.pic,56)+'</div>':'')+
    '<div class="big'+(q.from==='zh'?' han':'')+'">'+esc(w[q.from])+'</div>'+(q.from==='zh'&&S.set.py&&w.py?'<div class="py">'+esc(w.py)+'</div>':'')}
  else if(q.type==='order'){var f=q.from;h+='<div class="ask">'+esc(t('q_order'))+' '+langTag(q.to)+'</div><div class="big'+(f==='zh'?' han':'')+'" style="font-size:24px">'+esc(sentText(q.sent,f))+'</div>'+(f==='zh'&&S.set.py?'<div class="py">'+esc(sentPy(q.sent))+'</div>':'')}
  else{h+='<div class="ask">'+esc(t('q_speak'))+' '+langTag(q.to)+'</div>'+(w.pic?'<div class="pic" aria-hidden="true">'+picHtml(w.pic,56)+'</div>':'')+'<div class="big'+(q.to==='zh'?' han':'')+'">'+esc(w[q.to])+'</div>'+(q.to==='zh'&&w.py?'<div class="py">'+esc(w.py)+'</div>':'')+
    (hasVoice(q.to)?'<button class="btn sec sm" data-act="speak" data-t="'+esc(w[q.to])+'" data-l="'+q.to+'">'+ICON.speak.replace('<svg','<svg width="16" height="16"')+esc(t('sp_model'))+'</button>':'')}
  return h+'</div>'}
function prodHtml(q,s){var done=s.picked!==null;
  if(q.type==='type'){var hint=q.to==='en'?'<small class="mut">'+esc(t('ty_letters').replace('{n}',q.w.en.replace(/[^A-Za-z]/g,'').length))+(q.w.en.indexOf(' ')>=0?' · '+q.w.en.split(/\s+/).length+' words':'')+'</small>':q.to==='zh'?'<small class="mut">'+esc(t('ty_zh'))+'</small>':'';
    return '<div class="pr-type"><input id="q_type" autocomplete="off" autocapitalize="off" spellcheck="false" lang="'+(SR_LANG[q.to]||q.to)+'" placeholder="'+esc(t('ty_ph'))+'"'+(done?' disabled value="'+esc(q.given||'')+'"':'')+' class="'+(done?(s.lastOk?'ok':'ng'):'')+(q.to==='zh'?' han':'')+'">'+hint+
      (done?'':'<button class="btn" data-act="tycheck">'+esc(t('ty_check'))+'</button>')+'</div>'}
  if(q.type==='order'){var zh=q.to==='zh',used={};q.pick.forEach(function(i){used[i]=1});
    var tile=function(i,act,pos){return '<button class="pr-tile'+(zh?' han':'')+'" data-act="'+act+'" data-id="'+(act==='orrm'?pos:i)+'"'+(done?' disabled':'')+'>'+esc(q.tok[i])+(zh&&S.set.py&&q.sent.py?'<small class="py">'+esc((q.sent.py.split('|')[i]||''))+'</small>':'')+'</button>'};
    return '<div class="pr-order"><div class="pr-line'+(done?(s.lastOk?' ok':' ng'):'')+'" aria-live="polite">'+(q.pick.length?q.pick.map(function(i,p){return tile(i,'orrm',p)}).join(''):'<small class="mut">'+esc(t('or_tap'))+'</small>')+'</div>'+
      '<div class="pr-bank">'+q.tiles.filter(function(i){return !used[i]}).map(function(i){return tile(i,'oradd')}).join('')+'</div>'+
      (done?'':'<button class="btn" data-act="orcheck"'+(q.pick.length===q.tok.length?'':' disabled')+'>'+esc(t('ty_check'))+'</button>')+'</div>'}
  /* speak */
  return '<div class="pr-speak">'+(done?'':'<button class="btn big'+(q.listening?' pr-live':'')+'" data-act="spgo"'+(q.listening?' disabled':'')+'>'+esc(q.listening?t('sp_listening'):t('sp_tap'))+'</button>')+
    (q.heard?'<small>'+esc(t('sp_heard'))+': <b>'+esc(q.heard)+'</b></small>':'')+(q.msg?'<small class="mut">'+esc(q.msg)+'</small>':'')+
    (done?'':'<button class="btn sec sm" data-act="spskip">'+esc(t('sp_skip'))+'</button>')+'</div>'}
function prodFb(q){if(!isProd(q))return '';
  if(q.type==='order')return '<div style="margin-bottom:4px"><small class="mut">'+esc(t('or_right'))+':</small> <b class="'+(q.to==='zh'?'han':'')+'">'+esc(q.to==='en'?q.sent.en:q.tok.join(q.to==='zh'?'':' '))+'</b>'+(q.to==='zh'&&q.sent.py?' <small class="lt-zh">'+esc(sentPy(q.sent))+'</small>':'')+(hasVoice(q.to)?spkBtn(sentText(q.sent,q.to),q.to):'')+'</div>';
  if(q.type==='type'&&q.given&&UI.sess&&!UI.sess.lastOk)return '<div style="margin-bottom:4px"><small class="mut">'+esc(t('ty_you'))+':</small> <s>'+esc(q.given)+'</s></div>';
  if(q.type==='speak'&&q.heard)return '<div style="margin-bottom:4px"><small class="mut">'+esc(t('sp_heard'))+':</small> '+esc(q.heard)+'</div>';return ''}
/* ---------- speech ---------- */
var SR=null;
function spListen(){var q=curQ();if(!q||q.type!=='speak'||q.listening)return;var R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){q.msg=t('sp_err');render();return}
  var r;try{r=new R()}catch(e){q.msg=t('sp_err');render();return}SR=r;r.lang=SR_LANG[q.to];r.maxAlternatives=5;r.interimResults=false;r.continuous=false;
  var got=false;q.listening=true;q.msg='';render();
  r.onresult=function(e){got=true;var alts=[];var res=e.results&&e.results[0];if(res)for(var i=0;i<res.length;i++)alts.push(res[i].transcript);spHeard(q,alts)};
  r.onerror=function(e){q.listening=false;var c=e&&e.error;q.msg=c==='no-speech'?t('sp_nohear'):c==='aborted'?'':t('sp_err');render()};
  r.onend=function(){if(q.listening&&!got){q.listening=false;if(!q.msg)q.msg=t('sp_nohear');render()}};
  try{r.start()}catch(e){q.listening=false;q.msg=t('sp_err');render()}}
function spHeard(q,alts){q.listening=false;if(curQ()!==q)return;q.heard=alts[0]||'';q.tries=(q.tries||0)+1;
  if(heardOk(q.w,q.to,alts)){q.msg='';prodAnswer(true,q.heard);return}
  if(q.tries>=3){prodAnswer(false,q.heard);return}q.msg=t('sp_again').replace('{n}',q.tries);render()}
/* mic not available: ask the same word as an ordinary choice question instead (no penalty) */
function spSkip(){var s=UI.sess,q=curQ();if(!q||s.picked!==null)return;try{SR&&SR.abort()}catch(e){}var w=q.w,pool=WORDS.filter(function(x){return x.u===w.u});
  var nq;var tries=0;do{nq=makeQ(w,pool.length>=4?pool:WORDS);tries++}while(isProd(nq)&&tries<10);s.qs[s.i]=nq;render()}
function prodAct(a,id){var s=UI.sess,q=curQ();if(!q||!isProd(q))return false;
  if(a==='tycheck'){var el=document.getElementById('q_type'),v=el?el.value.trim():'';if(!v){if(el)el.focus();return true}prodAnswer(typeOk(q.w,q.to,v),v);return true}
  if(a==='oradd'){if(s.picked===null&&q.pick.indexOf(+id)<0&&q.tok[+id]!==undefined){q.pick.push(+id);render()}return true}
  if(a==='orrm'){if(s.picked===null){q.pick.splice(+id,1);render()}return true}
  if(a==='orcheck'){if(q.pick.length!==q.tok.length)return true;var ok=q.pick.map(function(i){return q.tok[i]}).join('\u0001')===q.tok.join('\u0001');prodAnswer(ok,q.pick.map(function(i){return q.tok[i]}).join(' '));return true}
  if(a==='spgo'){spListen();return true}
  if(a==='spskip'){spSkip();return true}
  return false}
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target&&e.target.id==='q_type'){e.preventDefault();prodAct('tycheck')}});
/* put the cursor in the typing box when a typing question appears */
var _prodFocus=null;setInterval(function(){var q=curQ(),el=document.getElementById('q_type');if(q&&q.type==='type'&&el&&!el.disabled&&_prodFocus!==q){_prodFocus=q;try{el.focus()}catch(e){}}},250);
