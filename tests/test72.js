const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid, vp) { const p = await (vp ? (await browser.newContext({ viewport: vp })) : ctx).newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const db = P => P.evaluate(() => JSON.parse(localStorage.getItem('__mockdb')));
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=confirmcreate]'); await wait(2000);
  const Q = await open('student', 'u_two'); await wait(800); await Q.click('[data-act=newgame]'); await Q.fill('#hname', 'Beam'); await Q.click('[data-act=confirmcreate]'); await wait(2000);
  await A.click('[data-act=admtab][data-id=topup]'); await wait(400);
  await A.check('#wl_en'); await A.fill('#wl_a', '080-000-0000'); await A.fill('#wl_n', 'Test'); await A.fill('#wl_p', '50,20,0'); await A.click('[data-act=admwlsave]'); await wait(1200);
  const goTop = async (X) => { await X.evaluate(() => document.querySelector('nav [data-id=home]').click()); await X.evaluate(() => document.querySelector('nav [data-id=shop]').click()); await X.click('[data-act=shoptab][data-id=topup]'); await wait(400) };
  await goTop(P); check('opt-in checkbox on top-up form', !!(await P.$('#tp_show')));
  await P.click('[data-act=tppack][data-id=sp3]'); await wait(200); await P.check('#tp_show'); await P.fill('#tp_ref', '10:05'); await P.check('input[name=tp_age][value=adult]'); await P.click('[data-act=tpsend]'); await wait(1200);
  await goTop(Q); await Q.click('[data-act=tppack][data-id=p1]'); await wait(200); await Q.fill('#tp_ref', '10:06'); await Q.check('input[name=tp_age][value=adult]'); await Q.click('[data-act=tpsend]'); await wait(1200);
  let d = await db(P); check('request stores show flag only for opt-in', d['topup/u_stu'].reqs.slice(-1)[0].show === true && d['topup/u_two'].reqs.slice(-1)[0].show === undefined);
  await A.click('[data-act=admtab][data-id=overview]'); await wait(200); await A.click('[data-act=admtab][data-id=topup]'); await wait(800);
  for (const u of ['u_stu', 'u_two']) { const id = await A.evaluate(u => { const b = [...document.querySelectorAll('[data-act=admwlok]')].find(x => x.dataset.id.startsWith(u + '|')); return b && b.dataset.id }, u); await A.click(`[data-act=admwlok][data-id="${id}"]`); await wait(1500) }
  d = await db(A); const th = d['settings/thanks'];
  check('only the opted-in supporter is on the board, with title, no amounts', th && th.sup.length === 1 && th.sup[0].u === 'u_stu' && th.sup[0].ts[0] === 'tsp3' && !JSON.stringify(th).match(/price|gems|baht/), JSON.stringify(th));
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(800);
  let txt = await P.innerText('.th-board').catch(() => '');
  check('village shows the board with name + title + note', /ทำเนียบผู้ร่วมสร้าง/.test(txt) && /Ploy/.test(txt) && !/Beam/.test(txt) && /ความสมัครใจ/.test(txt) && !/฿/.test(txt), txt.replace(/\n/g, ' | '));
  console.log('RENDERS', await P.evaluate(() => new Promise(r => { let n = 0; const o = new MutationObserver(() => n++); o.observe(document.getElementById('app'), { childList: true }); setTimeout(() => r(n), 3000) }))); await wait(500); await P.locator('.th-board').screenshot({ path: 'th-board.png' });
  // helper + hide
  await A.fill('#th_hn', 'น้องฟ้า'); await A.fill('#th_hnote', 'แจ้งบั๊กหน้าตลาด'); await A.click('[data-act=admthadd]'); await wait(1200);
  await P.evaluate(() => document.querySelector('nav [data-id=me]').click()); await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(800);
  txt = await P.innerText('.th-board'); check('helper appears in its own section', /ผู้ช่วยทดสอบ/.test(txt) && /น้องฟ้า/.test(txt) && /แจ้งบั๊กหน้าตลาด/.test(txt));
  await wait(500); await P.locator('.th-board').screenshot({ path: 'th-board2.png' });
  await A.screenshot({ path: 'th-admin.png', fullPage: true });
  await A.click('[data-act=admthhide][data-id=u_stu]'); await wait(1200);
  d = await db(A); check('hide marks the supporter hidden', d['settings/thanks'].hid.u_stu === 1);
  await P.evaluate(() => document.querySelector('nav [data-id=me]').click()); await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(800);
  txt = await P.innerText('.th-board'); check('hidden supporter not shown to students', !/Ploy/.test(txt), txt.replace(/\n/g,' | '));
  await A.click('[data-act=admthunhide][data-id=u_stu]'); await wait(1200);
  d = await db(A); check('show again works', !d['settings/thanks'].hid.u_stu);
  await goTop(Q); check('board also at bottom of top-up page', !!(await Q.$('.th-board')));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
