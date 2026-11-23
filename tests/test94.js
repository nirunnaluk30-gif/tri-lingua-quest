const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const A0 = A; const A2 = await open('admin', 'u_admin'); await wait(800); await A2.click('[data-act=newgame]'); await A2.fill('#hname', 'Teacher'); await A2.click('[data-act=dcls][data-id=mage]'); await A2.click('[data-act=confirmcreate]'); await wait(2000);
  const r = await A2.evaluate(() => { const S = window.__TLQ.S(); return { created: S.created, vip: S.vipB || 0, av: window.__TLQ.avatar(S, {}).includes('boss_aw_rift_dragon_king') } });
  check('admin character exists without any top-up', r.created && r.vip === 0, JSON.stringify(r));
  check('admin follows the strongest spirit (Rift Dragon King)', r.av);
  await A2.evaluate(() => document.querySelector('nav [data-id=me]').click()); await wait(600);
  const pan = await A2.evaluate(() => { const c = [...document.querySelectorAll('.gd-card')]; return { n: c.length, locked: c.filter(x => x.classList.contains('locked')).length } });
  check('admin sees all 6 spirits unlocked', pan.n === 6 && pan.locked === 0, JSON.stringify(pan));
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=mage]'); await P.click('[data-act=confirmcreate]'); await wait(2000);
  check('a student without top-up still has none', await P.evaluate(() => !window.__TLQ.avatar(window.__TLQ.S(), {}).includes('av-gd')));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
