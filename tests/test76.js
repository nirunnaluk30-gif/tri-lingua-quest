const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = [];
  const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(role + uid + ': ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_TUNNEL|ERR_CONNECTION|net::/.test(m.text())) errors.push(uid + ' console: ' + m.text()); });
    await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  try {
  const A0 = await open('admin', 'u_admin');
  await A0.evaluate(() => localStorage.clear()); await A0.reload(); await wait(400);
  await A0.click('[data-act=go][data-id=admin]'); await A0.click('[data-act=admseed][data-id=all]'); await wait(35000);
  const mk = async (uid, name) => { const P = await open('student', uid); await wait(600);
    await wait(3000); 0&&console.log('DBG', uid, await P.evaluate(() => { const C = window.__TLQ.CL; return JSON.stringify({ ready: C.ready, cr: C.contentReady, pf: C.pfirst, uid: C.uid, got: Object.keys(C.got).length, scr: window.__TLQ.UI().scr, cr8: window.__TLQ.S().created }) }), (await P.innerText('#app')).slice(0, 200));
    await P.click('[data-act=newgame]'); await P.fill('#hname', name); await P.click('[data-act=confirmcreate]'); await wait(2500); return P; };
  const A = await mk('u_aaa', 'Ann');
  const B = await mk('u_bbb', 'Ben'); const C = await mk('u_ccc', 'Cat');
  const S = (P) => P.evaluate(() => JSON.parse(JSON.stringify(window.__TLQ.S())));
  check('separate owners', (await S(A)).owner === 'u_aaa' && (await S(B)).owner === 'u_bbb');
  // teacher gives Ann two pets and Ben coins
  const give = async (uid, item, n, coin) => { await A0.click('[data-act=admtab][data-id=players]'); await wait(1200); await A0.click(`[data-act=admpgive][data-id=${uid}]`);
    if (item) { await A0.fill('#gi_q', item); await wait(100); await A0.fill('#gi_n', String(n)); await A0.click('[data-act=admgiadd]'); }
    if (coin) await A0.fill('#give_coin', String(coin)); await A0.click('[data-act=admpgiveyes]'); await wait(1500); };
  await give('u_aaa', 'pt10', 3, 0); await give('u_bbb', null, 0, 2000); await give('u_ccc', null, 0, 2000);
  let a = await S(A), b = await S(B);
  for (let i = 0; i < 20 && !(a.owned.pt10 === 3 && b.coin >= 2000); i++) { await wait(500); a = await S(A); b = await S(B); }
  if (!(b.coin >= 2000)) { const d = await B.evaluate(() => JSON.parse(localStorage.__mockdb || '{}')['adjust/u_bbb']); console.log('DBG adjust', JSON.stringify(d)); console.log('DBG seen', JSON.stringify(b.adjSeen), 'arev', b.arev, 'startT', b.startT, 'created', b.created); console.log('DBG modal', await A0.evaluate(() => JSON.stringify(window.__TLQ.UI().modal))); }
  check('gifts arrived', a.owned.pt10 === 3 && b.coin >= 2000, a.owned.pt10 + ' / ' + b.coin);
  const db = P => P.evaluate(() => JSON.parse(localStorage.getItem('__mockdb')));


  await A0.evaluate(() => { localStorage.__noClaimRule = '1' });
  await A.evaluate(() => document.querySelector('nav [data-id=wd]').click()); await A.click('[data-act=wdmanage]');
  await A.evaluate(() => { const b = document.querySelector('.wd-groups [data-id=pet]'); b && b.click() }); await A.click('[data-act=itemmenu][data-id=pt10]'); await A.click('[data-act=imtab][data-id=trade]'); await A.fill('#im_coin', '1500'); await A.click('[data-act=imtrade]'); await wait(1500);
  a = await S(A); const tid = Object.keys(a.trades)[0]; const acoin0 = a.coin;
  await A.close();
  const goMk = async (P) => { await P.evaluate(() => document.querySelector('nav [data-id=wd]').click()); await P.click('[data-act=go][data-id=market]'); await wait(1200) };
  await goMk(B); const bc0 = (await S(B)).coin;
  const toasts = []; B.on('console', () => {});
  await B.click(`[data-act=mkaccept][data-id="u_aaa|${tid}"]`); await wait(1000);
  b = await S(B); const tx = await B.evaluate(() => [...document.querySelectorAll('.toast,#toast,[role=status]')].map(x => x.innerText).join(' | '));
  check('rule not published: no error, falls back to a waiting request', b.treq[tid + '@u_aaa'] && b.treq[tid + '@u_aaa'].st === 'wait' && b.coin === bc0 - 1500 && !/เชื่อมต่อไม่ได้/.test(tx), JSON.stringify({ rq: b.treq[tid + '@u_aaa'], tx }));
  // teacher publishes the rule: the waiting request completes on the buyer's side right away
  await B.evaluate(() => { localStorage.__noClaimRule = '0' }); await B.reload(); await wait(1500); await goMk(B); await wait(3000);
  b = await S(B); let d = await db(B);
  check('after the rule: the old waiting request turns into an instant buy', b.treq[tid + '@u_aaa'].st === 'got' && b.owned.pt10 === 1 && d['mkclaim/u_aaa__' + tid] && d['mkclaim/u_aaa__' + tid].by === 'u_bbb', JSON.stringify({ rq: b.treq[tid + '@u_aaa'], pt: b.owned.pt10 }));
  const A2 = await open('student', 'u_aaa'); await wait(7000);
  a = await S(A2); check('seller settles on return', a.trades[tid].st === 'done' && a.trades[tid].by === 'u_bbb' && a.coin === acoin0 + 1425, JSON.stringify({ tr: a.trades[tid].st, dc: a.coin - acoin0 }));
  await wait(2500); await A0.click('[data-act=admtab][data-id=gift]'); await wait(300); await A0.click('[data-act=admtab][data-id=players]'); await wait(3000);
  const v = await A0.evaluate(() => ['u_aaa', 'u_bbb'].map(u => { const r = window.__TLQ.CL.ver[u]; return u + ':' + (r && r.res ? r.res.errs + '/' + r.res.issues.map(x => x.msg).join(',') : 'none') }));
  check('teacher verification clean', v.every(x => /:0\//.test(x)), v.join(' | '));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
