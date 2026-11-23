const { chromium } = require('playwright');
const OUT = process.argv[2];
const URL = 'file:///home/claude/trilingua/index.html';
/* In-memory db mock shared across pages through localStorage + storage events. */
const MOCK = (role, uid) => `
(function(){
  if(${JSON.stringify(role)}==='none')return;
  var KEY='__mockdb';
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));fire()}
  var subs=[];
  function snapDoc(path,s){var d=s[path];return {id:path.split('/').pop(),exists:!!d,data:function(){return d?JSON.parse(JSON.stringify(d)):undefined},metadata:{fromCache:false,hasPendingWrites:false}}}
  function colDocs(path,s){return Object.keys(s).filter(function(k){return k.indexOf(path+'/')===0&&k.split('/').length===path.split('/').length+1}).sort().map(function(k){return snapDoc(k,s)})}
  function fire(){var s=load();subs.forEach(function(x){setTimeout(function(){deliver(x,s)},5)})}
  function deliver(x,s){if(x.dead)return;if(x.t==='doc')x.cb(snapDoc(x.p,s));else{var d=colDocs(x.p,s);x.cb({docs:d,size:d.length,empty:!d.length,docChanges:function(){return []},metadata:{fromCache:false,hasPendingWrites:false}})}}
  window.addEventListener('storage',function(e){if(e.key===KEY)fire()});
  var ROLE=${JSON.stringify(role)},UID=${JSON.stringify(uid)};
  function allowed(path){return ROLE==='admin'||path.indexOf('players/'+UID)===0}
  window.__writes=0;
  function docRef(path){return {id:path.split('/').pop(),path:path,
    get:function(){return Promise.resolve(snapDoc(path,load()))},
    set:function(d){if(!allowed(path))return Promise.reject({code:'invalid_argument',message:'denied'});window.__writes++;var s=load();s[path]=JSON.parse(JSON.stringify(d));save(s);return Promise.resolve()},
    update:function(d){var s=load();Object.assign(s[path],d);save(s);return Promise.resolve()},
    delete:function(){if(!allowed(path))return Promise.reject({code:'invalid_argument',message:'denied'});var s=load();delete s[path];save(s);return Promise.resolve()},
    onSnapshot:function(cb){var x={t:'doc',p:path,cb:cb};subs.push(x);setTimeout(function(){deliver(x,load())},20);return function(){x.dead=true}}}}
  function colRef(path){return {path:path,doc:function(id){return docRef(path+'/'+id)},
    get:function(){var d=colDocs(path,load());return Promise.resolve({docs:d,size:d.length,empty:!d.length})},
    onSnapshot:function(cb){var x={t:'col',p:path,cb:cb};subs.push(x);setTimeout(function(){deliver(x,load())},20);return function(){x.dead=true}}}}
  var db={doc:docRef,collection:colRef};
  var user={id:function(){return Promise.resolve(UID)},canEdit:function(){return Promise.resolve(ROLE==='admin')},isOwner:function(){return Promise.resolve(ROLE==='admin')},can:function(){return Promise.resolve(ROLE==='admin')},
    profiles:function(ids){var o={};ids.forEach(function(i){o[i]={id:i,name:i==='u_stu'?'Student One':'Teacher',avatarUrl:'',color:'#888',email:null,isMe:i===UID,guest:false}});return Promise.resolve(o)}};
  window.claude={use:function(n){return Promise.resolve(n==='db'?db:n==='user'?user:null)}};
})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' });
  const results = [], errors = [];
  const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) {
    const p = await ctx.newPage();
    p.on('pageerror', e => errors.push(role + ': ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_TUNNEL/.test(m.text())) errors.push(role + ' console: ' + m.text()); });
    await p.addInitScript(MOCK(role, uid));
    await p.goto(URL); await wait(300); return p;
  }
  const shot = async (p, n) => p.screenshot({ path: `${OUT}/${n}.png` });
  const ov = async (p, n) => { const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); check('no sideways scroll: ' + n, o <= 0, 'excess ' + o); };
  const fill = async (p, sel, v) => { await p.fill(sel, v); };

  // ---------- ADMIN ----------
  const A = await open('admin', 'u_admin');
  check('admin button on title for owner', !!(await A.$('[data-act=go][data-id=admin]')));
  await A.click('[data-act=go][data-id=admin]');
  check('unseeded notice shown', (await A.textContent('#app')).includes('ยังใช้เนื้อหาในตัวเกม'));
  await shot(A, 'a1-overview-empty');
  await A.click('[data-act=admseed][data-id=all]'); await wait(15000);
  let cl = await A.evaluate(() => { const c = window.__TLQ.CL; return { s: c.seeded, w: window.__TLQ.CONTENT.words.length } });
  check('seed all writes every section', Object.values(cl.s).filter(Boolean).length === 14 && cl.w === 590, JSON.stringify(cl.s));
  // add a word
  await A.click('[data-act=admtab][data-id=words]');
  await A.click('[data-act=admadd][data-id=words]');
  await A.selectOption('#af_u', 'greet');
  await fill(A, '#af_th', 'ราตรีสวัสดิ์'); await fill(A, '#af_en', 'good night'); await fill(A, '#af_zh', '晚安'); await fill(A, '#af_py', 'wǎn ān'); await fill(A, '#af_pic', '🌙');
  await fill(A, '#af_id', 'w009');
  await shot(A, 'a2-word-form');
  await A.click('[data-act=admsave]'); await wait(400);
  check('word added and live in game', await A.evaluate(() => window.__TLQ.WORDS().some(w => w.id === 'w009' && w.zh === '晚安')));
  await A.click('[data-act=admedit][data-id=w009]'); await fill(A, '#af_en', 'good night!'); await A.click('[data-act=admsave]'); await wait(300);
  check('word edited', await A.evaluate(() => window.__TLQ.WORDS().find(w => w.id === 'w009').en === 'good night!'));
  await A.click('[data-act=admadd][data-id=words]'); await A.click('[data-act=admsave]'); await wait(200);
  check('incomplete word rejected with message', (await A.textContent('#admerr')).length > 0);
  await A.click('[data-act=admcancel]');
  // add item
  await A.click('[data-act=admtab][data-id=items]'); await A.click('[data-act=admadd][data-id=items]');
  await A.selectOption('#af_cat', 'wings'); await A.selectOption('#af_rar', 'mythic'); await fill(A, '#af_names_th', 'ปีกมังกรไฟ'); await fill(A, '#af_names_en', 'Fire dragon wings'); await fill(A, '#af_id', 'wg9');
  await A.selectOption('#af_v_k', 'bat');
  await shot(A, 'a3-item-form');
  check('item preview renders', !!(await A.$('#admpv svg')));
  await A.click('[data-act=admsave]'); await wait(300);
  check('item added', await A.evaluate(() => window.__TLQ.ITEMS().some(i => i.id === 'wg9')));
  // put item in banner + shop
  await A.click('[data-act=admtab][data-id=banners]'); await A.click('[data-act=admedit][data-id=bnA]');
  await A.click('[data-act=admmulti][data-id=wg9]'); await A.click('[data-act=admsave]'); await wait(300);
  check('banner pool updated', await A.evaluate(() => window.__TLQ.CONTENT.banners.find(b => b.id === 'bnA').pool.includes('wg9')));
  await A.click('[data-act=admtab][data-id=shop]'); await A.click('[data-act=admadd][data-id=shop]');
  await A.selectOption('#af_item', 'wg9'); await fill(A, '#af_price', '10'); await A.click('[data-act=admsave]'); await wait(300);
  check('shop entry added', await A.evaluate(() => window.__TLQ.CONTENT.shop.some(s => s.item === 'wg9' && s.price === 10)));
  // unit + zone + delete with reference warning
  await A.click('[data-act=admtab][data-id=units]'); await A.click('[data-act=admadd][data-id=units]');
  await fill(A, '#af_id', 'body'); await fill(A, '#af_names_th', 'ร่างกาย'); await fill(A, '#af_names_en', 'Body'); await A.click('[data-act=admsave]'); await wait(300);
  await A.click('[data-act=admtab][data-id=zones]'); await A.click('[data-act=admadd][data-id=zones]');
  await fill(A, '#af_id', 'z6'); await fill(A, '#af_names_th', 'หุบเขาลับ'); await A.click('[data-act=admmulti][data-id=body]'); await fill(A, '#af_boss_names_th', 'ยักษ์ภูเขา');
  await shot(A, 'a4-zone-form');
  await A.click('[data-act=admsave]'); await wait(300);
  check('zone added at end of map', await A.evaluate(() => { const c = window.__TLQ.CONTENT.zones; return c.some(z => z.id === 'z6' && z.units[0] === 'body') }));
  await A.click('[data-act=admtab][data-id=units]'); await A.click('[data-act=admdel][data-id=body]');
  check('delete warns about references', (await A.textContent('#modal')).includes('หุบเขาลับ'));
  await A.click('[data-act=closemodal]');
  await A.click('[data-act=admtab][data-id=zones]'); await A.click('[data-act=admdel][data-id=z6]'); await A.click('[data-act=admdelyes]'); await wait(300);
  await A.click('[data-act=admtab][data-id=units]'); await A.click('[data-act=admdel][data-id=body]'); await A.click('[data-act=admdelyes]'); await wait(300);
  check('zone and unit deleted', await A.evaluate(() => !window.__TLQ.CONTENT.zones.some(z => z.id === 'z6') && !window.__TLQ.CONTENT.units.some(u => u.id === 'body')));
  // story quest with talk condition
  await A.click('[data-act=admtab][data-id=story]'); await A.click('[data-act=admadd][data-id=story]');
  await fill(A, '#af_names_th', 'ทักทายครูนกอีกครั้ง'); await A.selectOption('#af_cond_type', 'level');
  await fill(A, '#af_cond_n', '2'); await A.click('[data-act=admsave]'); await wait(300);
  check('story quest added', await A.evaluate(() => window.__TLQ.CONTENT.story.some(q => q.cond.type === 'level' && q.cond.n === 2)));
  // config
  await A.click('[data-act=admtab][data-id=config]'); await fill(A, '#cf_startTickets', '50'); await fill(A, '#cf_passPct', '50');
  await shot(A, 'a5-config');
  await A.click('[data-act=admcfgsave]'); await wait(300);
  check('config saved', await A.evaluate(() => window.__TLQ.CONTENT.config.startTickets === 50 && window.__TLQ.CONTENT.config.passPct === 50));
  // backup export / import
  await A.click('[data-act=admtab][data-id=backup]');
  const exp = await A.inputValue('#admexp');
  const obj = JSON.parse(exp); check('export has all sections', ['words', 'items', 'zones', 'config'].every(k => obj[k]) && obj.words.length === 591, 'words ' + obj.words.length);
  obj.words = obj.words.filter(w => w.id !== 'w009');
  await fill(A, '#admimp', JSON.stringify(obj)); await A.click('[data-act=admimport]');
  check('import confirmation lists sections', (await A.textContent('#modal')).includes('590'));
  await A.click('[data-act=admimportyes]', { noWaitAfter: true, timeout: 120000 }); await wait(60000);
  check('import replaced content (deleted extra word)', await A.evaluate(() => window.__TLQ.CONTENT.words.length === 590 && !window.__TLQ.WORDS().some(w => w.id === 'w009')));

  // ---------- STUDENT (same browser profile; separate account) ----------
  const P = await open('student', 'u_stu');
  await P.evaluate(() => localStorage.removeItem('TRILINGUA_PLAY_V1'));
  await P.reload(); await wait(500);
  check('student sees no admin', !(await P.$('[data-act=go][data-id=admin]')));
  await P.click('[data-act=newgame]'); await P.fill('#hname', 'Nina'); await P.click('[data-act=confirmcreate]'); await wait(200);
  let s = await P.evaluate(() => window.__TLQ.S());
  check('student starts with config from db (50 tickets)', s.tickets === 50, 'tickets ' + s.tickets);
  check('admin item visible in student shop', await P.evaluate(() => { document.querySelector('[data-act=go][data-id=shop]').click(); return !!document.querySelector('[data-act=buy][data-id=wg9]') }));
  await P.click('[data-act=go][data-id=map] >> nth=0'); await P.click('[data-act=lesson][data-id=greet]'); await P.click('[data-act=beginquiz] >> nth=0');
  const nq = await P.evaluate(() => window.__TLQ.UI().sess.qs.length);
  for (let i = 0; i < nq; i++) { await P.evaluate(() => window.__TLQ.solveQ()); await P.click('#nextbtn'); }
  await wait(2000);
  await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(3000);
  const pdoc = await P.evaluate(() => JSON.parse(localStorage.getItem('__mockdb'))['players/u_stu']);
  check('student progress synced to players/{uid}', pdoc && pdoc.name === 'Nina' && pdoc.learned >= 0 && pdoc.state && pdoc.state.prog.greet.stars === 3, pdoc ? 'stars ' + pdoc.stars : 'missing');
  check('sync pill shows synced', (await P.textContent('#hdr')).includes('ซิงก์แล้ว'));
  const denied = await P.evaluate(() => window.__TLQ.CL.db.collection('words').doc('x').set({ th: 'a' }).then(() => 'ok', e => e.code));
  check('student cannot write content (mock rule)', denied === 'invalid_argument');

  // ---------- ADMIN manages student ----------
  await A.click('[data-act=admtab][data-id=players]'); await wait(400);
  check('admin sees student row', (await A.textContent('#app')).includes('Nina'));
  check('account name resolved via profiles', (await A.textContent('#app')).includes('Student One'));
  await shot(A, 'a6-players');
  const before = (await P.evaluate(() => window.__TLQ.S())).tickets;
  await A.click('[data-act=admpgive][data-id=u_stu]'); await A.fill('#give_tickets', '7'); await A.click('[data-act=admpgiveyes]'); await wait(800);
  s = await P.evaluate(() => window.__TLQ.S());
  check('teacher gift reaches student live', s.tickets === before + 7, before + ' -> ' + s.tickets);
  await A.click('[data-act=admpview][data-id=u_stu]'); check('report modal shows student report', (await A.inputValue('#modal textarea')).includes('Nina')); await A.click('[data-act=closemodal]');
  await A.click('[data-act=admpreset][data-id=u_stu]'); await A.click('[data-act=admpresetyes]'); await wait(800);
  s = await P.evaluate(() => window.__TLQ.S());
  check('teacher reset sends student back to start', !s.created && (await P.evaluate(() => window.__TLQ.UI().scr)) === 'title');
  check('reset also clears the cloud record', !(await A.evaluate(() => JSON.parse(localStorage.getItem('__mockdb'))['players/u_stu'])));
  // restore defaults
  await A.click('[data-act=admtab][data-id=backup]'); await A.click('[data-act=admrestore]'); await A.click('[data-act=admimportyes]', { noWaitAfter: true, timeout: 120000 }); await wait(2500);
  await wait(60000);const rd=await A.evaluate(() => ({wg9:window.__TLQ.ITEMS().some(i => i.id === 'wg9'),st:window.__TLQ.CONTENT.config.startTickets,modal:window.__TLQ.UI().modal&&window.__TLQ.UI().modal.kind}));
  check('restore defaults removes admin-added item', !rd.wg9 && rd.st === 5, JSON.stringify(rd));

  // ---------- phone width admin ----------
  await A.setViewportSize({ width: 390, height: 860 });
  for (const tab of ['overview', 'players', 'words', 'items', 'zones', 'config', 'backup']) { await A.click(`[data-act=admtab][data-id=${tab}]`); await wait(80); await ov(A, 'admin ' + tab + ' @390'); }
  await A.click('[data-act=admtab][data-id=items]'); await A.click('[data-act=admedit][data-id=au2]'); await shot(A, 'a7-item-phone'); await ov(A, 'admin item form @390');

  // ---------- no claude (opened outside claude.ai) ----------
  const N = await open('none', '');
  await N.evaluate(() => localStorage.removeItem('TRILINGUA_PLAY_V1')); await N.reload(); await wait(300);
  await N.click('[data-act=newgame]'); await N.fill('#hname', 'Solo'); await N.click('[data-act=confirmcreate]');
  check('offline: game works on built-in content', (await N.evaluate(() => window.__TLQ.WORDS().length)) === 590 && (await N.textContent('#hdr')).includes('บันทึกในเครื่อง'));
  check('offline: no admin tab', !(await N.$('[data-act=go][data-id=admin]')));
  await browser.close();
  console.log(results.join('\n')); console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
})();
