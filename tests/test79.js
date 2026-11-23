const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const DEV = d => `(function(){window.__DEV='${d}';var K='TRILINGUA_PLAY_V1',P=Storage.prototype,g=P.getItem,s=P.setItem,r=P.removeItem;function m(k){return k===K?K+'@'+window.__DEV:k}P.getItem=function(k){return g.call(this,m(k))};P.setItem=function(k,v){return s.call(this,m(k),v)};P.removeItem=function(k){return r.call(this,m(k))}})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid, dev) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + '/' + dev + ': ' + e.message)); if (dev) await p.addInitScript(DEV(dev)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const S = P => P.evaluate(() => { const s = window.__TLQ.S(); return { n: s.n, chk: s.chk, coin: s.coin, k: s.log.map(e => e.k).join(',') } });
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(35000);
  const P = await open('student', 'u_stu', 'phone'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(2000);
  const C = await open('student', 'u_stu', 'pc'); await wait(4000);
  let c = await S(C), p = await S(P); check('computer loads the same hero', c.n === p.n && c.n > 0, JSON.stringify({ c: c.n, p: p.n }));
  // both stay open; check in on the phone
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(500);
  const hasCk = !!(await P.$('[data-act=ckgo]')); check('phone shows the check-in button', hasCk);
  await P.click('[data-act=ckgo]'); await wait(800); await P.evaluate(() => { const m = document.querySelector('.modal [data-act=ckpick]'); m && m.click() }); await wait(800);
  await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(3000);
  p = await S(P); c = await S(C);
  check('computer (left open) picks up the phone check-in', c.n === p.n && /chk/.test(c.k), JSON.stringify({ p: p.n, c: c.n, ck: c.chk }));
  await C.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(500);
  check('computer no longer offers today\'s check-in', !(await C.$('[data-act=ckgo]')));
  // conflict: computer plays offline-ish (not pushed yet) while the phone pushes more
  const cBefore = (await S(C)).n;
  await P.bringToFront(); await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(300); await P.evaluate(() => document.querySelector('nav [data-id=map]').click()); await wait(300); await P.click('[data-act=lesson][data-id=greet]'); await P.click('[data-act=beginquiz] >> nth=0');
  const n = await P.evaluate(() => window.__TLQ.UI().sess.qs.length); for (let i = 0; i < n; i++) { await wait(850); await P.evaluate(() => window.__TLQ.solveQ(true)); await P.click('#nextbtn') }
  await wait(1500); await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(3500);
  p = await S(P); c = await S(C);
  check('computer follows the phone after more play', c.n === p.n && c.n > cBefore, JSON.stringify({ p: p.n, c: c.n }));
  // the computer now plays and pushes; the phone follows
  await C.bringToFront(); await C.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(300); await C.evaluate(() => document.querySelector('nav [data-id=map]').click()); await wait(300); await C.click('[data-act=lesson][data-id=greet]'); await C.click('[data-act=beginquiz] >> nth=0');
  const n2 = await C.evaluate(() => window.__TLQ.UI().sess.qs.length); for (let i = 0; i < n2; i++) { await wait(850); await C.evaluate(() => window.__TLQ.solveQ(true)); await C.click('#nextbtn') }
  await wait(1500); await C.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(3500);
  p = await S(P); c = await S(C); check('phone follows the computer', c.n === p.n, JSON.stringify({ p: p.n, c: c.n }));
  await wait(2000); await A.click('[data-act=admtab][data-id=players]'); await wait(3000);
  const v = await A.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; return r && r.res ? { errs: r.res.errs, msgs: r.res.issues.map(x => x.msg).join(',') } : null });
  check('teacher verification clean (one check-in, no fork)', v && v.errs === 0, JSON.stringify(v));
  const chks = (await S(C)).k.split(',').filter(x => x === 'chk').length; check('exactly one check-in in the history', chks === 1, 'chk=' + chks);
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
