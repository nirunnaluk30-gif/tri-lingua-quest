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
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(35000);
  const keys = await A.evaluate(() => Object.keys(JSON.parse(localStorage.__mockdb)).filter(k => /tpr1|tsp1/.test(k)));
  console.log('KEYS', keys.join(','));
  // simulate a live database that never got the new title
  await A.evaluate(() => { const d = JSON.parse(localStorage.__mockdb); Object.keys(d).filter(k => /tpr1/.test(k)).forEach(k => delete d[k]); localStorage.__mockdb = JSON.stringify(d) });
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  await A.reload(); await wait(2500); await A.click('[data-act=go][data-id=admin]'); await wait(800);
  await A.click('[data-act=admtab][data-id=players]'); await wait(2500); await A.click('[data-act=admpgive][data-id=u_stu]'); await wait(500);
  const opts = await A.$$eval('#give_tt option', o => o.map(x => x.value + ':' + x.textContent));
  check('give dialog has a title picker with the promo title', opts.some(x => /^tpr1:นักล่าค่าหัว/.test(x)), opts.join(' | '));
  await A.selectOption('#give_tt', 'tpr1'); await A.click('[data-act=admpgiveyes]'); await wait(2500);
  let st = await P.evaluate(() => window.__TLQ.S().tta); check('student receives the title', st && st.tpr1 === 1, JSON.stringify(st));
  const me = await P.evaluate(() => { document.querySelector('nav [data-id=me]').click(); return new Promise(r => setTimeout(() => r(document.getElementById('app').innerText), 800)) });
  check('title appears on the student profile', /นักล่าค่าหัว/.test(me));
  await A.click('[data-act=admpgive][data-id=u_stu]'); await wait(500);
  check('dialog lists the given title with a take-back button', !!(await A.$('[data-act=admttrev][data-id="u_stu|tpr1"]')));
  await A.screenshot({ path: 'tg-admin.png' });
  await A.click('[data-act=admttrev][data-id="u_stu|tpr1"]'); await wait(2500);
  st = await P.evaluate(() => window.__TLQ.S().tta); check('take back works', st && st.tpr1 === -1, JSON.stringify(st));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
