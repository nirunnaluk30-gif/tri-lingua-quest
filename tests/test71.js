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
  await A.click('[data-act=admtab][data-id=topup]'); await wait(400);
  check('admin form has channel 2 fields', !!(await A.$('#wl2_on')) && !!(await A.$('#wl2_qr')) && !!(await A.$('#wl_b')));
  await A.check('#wl_en'); await A.selectOption('#wl_m', 'TrueMoney Wallet'); await A.fill('#wl_a', '080-000-0000'); await A.fill('#wl_n', 'ทดสอบ วอลเล็ต'); await A.fill('#wl_p', '50,20,0\n300,100,30');
  await A.setInputFiles('#wl_qr', '/home/claude/tests/qr1.png'); await wait(800);
  await A.selectOption('#wl2_m', 'Bank transfer'); await A.fill('#wl2_b', 'ธนาคารทดสอบ'); await A.fill('#wl2_a', '123-4-56789-0'); await A.fill('#wl2_n', 'ทดสอบ ธนาคาร');
  await A.setInputFiles('#wl2_qr', '/home/claude/tests/qr2.png'); await wait(800);
  check('both QR previews in admin form', (await A.$$('.cfg img.tp-qr')).length === 2);
  await A.screenshot({ path: 'ch-admin.png', fullPage: true });
  await A.click('[data-act=admwlsave]'); await wait(1200);
  let d = await db(A); const w = d['settings/wallet'];
  check('wallet saved with channel 2 + both QRs', w && w.ch2 && w.ch2.on && w.ch2.account === '123-4-56789-0' && /^data:image/.test(w.ch2.qr) && /^data:image/.test(w.qr), JSON.stringify({ ch2: w && w.ch2 && Object.assign({}, w.ch2, { qr: (w.ch2.qr || '').length }) }));
  const goTop = async () => { await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await P.evaluate(() => document.querySelector('nav [data-id=shop]').click()); await P.click('[data-act=shoptab][data-id=topup]'); await wait(400) };
  await goTop();
  check('student sees 2 channel buttons', (await P.$$('[data-act=tpch]')).length === 2);
  let pay = await P.innerText('.tp-pay'); check('first channel = TrueMoney by default', /TrueMoney/.test(pay) && /080-000-0000/.test(pay), pay.replace(/\n/g, ' | '));
  const src1 = await P.getAttribute('.tp-pay img', 'src');
  await P.click('[data-act=tpch][data-id="1"]'); await wait(300);
  pay = await P.innerText('.tp-pay'); const src2 = await P.getAttribute('.tp-pay img', 'src');
  check('switching shows bank account + its own QR', /โอนผ่านธนาคาร/.test(pay) && /ธนาคารทดสอบ/.test(pay) && /123-4-56789-0/.test(pay) && src1 !== src2, pay.replace(/\n/g, ' | '));
  await P.screenshot({ path: 'ch-student.png', fullPage: true });
  await P.click('[data-act=tppack][data-id=p1]'); await wait(200); await P.click('[data-act=tpch][data-id="1"]'); await wait(200);
  await P.fill('#tp_ref', '10:05'); await P.check('input[name=tp_age][value=adult]'); await P.click('[data-act=tpsend]'); await wait(1200);
  d = await db(P); const r = (d['topup/u_stu'].reqs || []).slice(-1)[0];
  check('request records the bank channel', r && /Bank transfer ธนาคารทดสอบ 123-4-56789-0/.test(r.ch), JSON.stringify(r && r.ch));
  await A.click('[data-act=admtab][data-id=overview]'); await wait(200); await A.click('[data-act=admtab][data-id=topup]'); await wait(800);
  check('admin request list shows the channel', /💳 Bank transfer ธนาคารทดสอบ/.test(await A.innerText('#app')));
  // mobile layout
  await P.setViewportSize({ width: 390, height: 844 }); const M = P; await goTop(); await P.click('[data-act=tpch][data-id="1"]'); await wait(300);
  const ov = await M.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1); check('no horizontal scroll on phone', !ov);
  await M.screenshot({ path: 'ch-mobile.png', fullPage: true });
  // single channel when ch2 off

  await A.evaluate(() => { const d = JSON.parse(localStorage.__mockdb); d['settings/wallet'].ch2.on = false; d['settings/wallet'].ch2.account = ''; localStorage.__mockdb = JSON.stringify(d) }); await P.reload(); await wait(2500); await goTop();
  check('old save with ch2 off but a bank QR: both channels still offered', (await P.$$('[data-act=tpch]')).length === 2);
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
