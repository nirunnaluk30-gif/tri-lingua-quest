const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const clock = at => `(function(){var off=${at}-Date.now();var D=Date;function N(){if(arguments.length===0)return new D(D.now()+off);return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))()}N.prototype=D.prototype;N.now=function(){return D.now()+off};N.UTC=D.UTC;N.parse=D.parse;window.Date=N})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid, at) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); if (at) await p.addInitScript(clock(at)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const T = (h, mi, day) => Date.UTC(2026, 10, day || 18, h - 7, mi || 0);
  const S = P => P.evaluate(() => { const s = window.__TLQ.S(); return { tk: s.tickets, eva: s.log.filter(e => e.k === 'eva').map(e => e.day) } });
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(35000);
  let P = await open('student', 'u_stu', T(18, 30)); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=confirmcreate]'); await wait(7000);
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(500);
  let s = await S(P); check('18:30: no tickets yet, panel says starts 19:00', s.eva.length === 0 && /เริ่ม 19:00/.test(await P.innerText('.eva-panel')), JSON.stringify(s));
  const tk0 = s.tk; await P.close();
  P = await open('student', 'u_stu', T(19, 15)); await wait(7000);
  s = await S(P); check('19:15: auto check-in gives 10 tickets', s.eva.join() === '2026-11-18' && s.tk === tk0 + 10, JSON.stringify(s));
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(400);
  check('panel shows got today', /ได้รับแล้ว/.test(await P.innerText('.eva-panel')));
  await P.locator('.eva-panel').screenshot({ path: 'eva.png' });
  await P.reload(); await wait(7000); s = await S(P); check('reload at 19:40 does not give it twice', s.eva.length === 1 && s.tk === tk0 + 10, JSON.stringify(s));
  await P.close();
  P = await open('student', 'u_stu', T(20, 10)); await wait(7000); s = await S(P); check('20:10: nothing more', s.eva.length === 1);
  await P.close();
  P = await open('student', 'u_stu', T(19, 5, 19)); await wait(7000); s = await S(P); check('next day 19:05: another 10 tickets', s.eva.length === 2 && s.tk === tk0 + 20, JSON.stringify(s));
  await P.close();
  P = await open('student', 'u_stu', T(19, 5, 31 > 30 ? 30 : 30) + 864e5); await wait(7000); s = await S(P); check('1 Dec: event over, nothing', s.eva.length === 2);
  await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(2500);
  const A2 = await open('admin', 'u_admin', T(19, 5, 30) + 864e5 + 3600e3); await A2.click('[data-act=go][data-id=admin]'); await wait(1500); await A2.click('[data-act=admtab][data-id=players]'); await wait(3500);
  let v = await A2.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; return r && r.res ? { errs: r.res.errs, msgs: r.res.issues.map(x => x.msg).join(',') } : null });
  check('teacher verification clean', v && v.errs === 0, JSON.stringify(v));
  const f = await P.evaluate(() => window.__TLQ.verifyFake({ k: 'eva', day: '2026-12-01', tk: 10 }));
  check('forged auto check-in outside the event is caught', f && (Array.isArray(f) ? f.includes('eva') : (f.errs > 0 || (f.issues||[]).some(x => x.msg === 'eva'))), JSON.stringify(f && f.issues ? f.issues.map(x => x.msg) : f));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
