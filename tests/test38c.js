const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const db = P => P.evaluate(() => JSON.parse(localStorage.getItem('__mockdb')));
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(45000);
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=confirmcreate]'); await wait(2000);
  await A.click('[data-act=admtab][data-id=topup]'); await wait(300);
  check('admin has a terms box', !!(await A.$('#wl_terms')));
  await A.check('#wl_en'); await A.fill('#wl_a', '080-000-0000'); await A.fill('#wl_n', 'Test'); await A.fill('#wl_p', '50,20,0\n300,100,30'); await A.fill('#wl_cap', '1000'); await A.uncheck('#wl_fd');
  await A.click('[data-act=admwlsave]'); await wait(1200);
  console.log('WL', JSON.stringify(((await db(A))['settings/wallet'])||{}).slice(0,300));
  const goTop = async () => { await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await P.evaluate(() => document.querySelector('nav [data-id=shop]').click()); await P.click('[data-act=shoptab][data-id=topup]'); await wait(400) };
  await goTop();
  let txt = await P.innerText('#app');
  console.log('TXT', txt.slice(0,1500).replace(/\n/g,' | ')); check('terms are listed (7 standard terms)', /เงื่อนไขการสนับสนุน/.test(txt) && (await P.$$('.tp-terms li')).length === 7);
  check('own monthly limit control is shown', !!(await P.$('#tp_mycap')));
  check('parent tick hidden until "under 18" is chosen', await P.evaluate(() => document.querySelector('.tp-parent').hidden));
  // must choose age
  await P.click('[data-act=tppack][data-id=p1]'); await P.fill('#tp_ref', '10:00'); await P.click('[data-act=tpsend]'); await wait(800);
  check('cannot send without choosing an age group', !((await db(P))['topup/u_stu'] || {}).reqs);
  await P.check('input[name=tp_age][value=minor]'); await wait(200);
  check('choosing under 18 shows the parent tick', await P.evaluate(() => !document.querySelector('.tp-parent').hidden));
  await P.click('[data-act=tpsend]'); await wait(800);
  check('under 18 cannot send without parent agreement', !((await db(P))['topup/u_stu'] || {}).reqs);
  // own limit: set 50 (lower -> now)
  await P.selectOption('#tp_mycap', '50'); await P.click('[data-act=tpcapsave]'); await wait(1000);
  let d = await db(P); check('own limit 50 saved and active now', d['topup/u_stu'] && d['topup/u_stu'].mycap && d['topup/u_stu'].mycap.v === 50 && d['topup/u_stu'].mycap.next === undefined, JSON.stringify(d['topup/u_stu']));
  // adult sends p1 (20 baht) ok
  await goTop(); await P.click('[data-act=tppack][data-id=p1]'); await P.fill('#tp_ref', '10:05'); await P.check('input[name=tp_age][value=adult]'); await P.click('[data-act=tpsend]'); await wait(1200);
  d = await db(P); const r1 = (d['topup/u_stu'].reqs || []).slice(-1)[0];
  check('adult (18+) can send without the parent tick; request marked 18+', r1 && r1.adult === true && !r1.parent, JSON.stringify(r1));
  check('own limit kept after sending', d['topup/u_stu'].mycap && d['topup/u_stu'].mycap.v === 50);
  // admin approves
  await A.click('[data-act=admtab][data-id=overview]'); await wait(200); await A.click('[data-act=admtab][data-id=topup]'); await wait(600);
  check('admin sees 18+ mark', /18\+/.test(await A.innerText('#app')));
  await A.click('[data-act=admwlok]'); await wait(1500);
  // 100 baht pack now over own limit 50 (spent 20)
  await goTop(); await P.click('[data-act=tppack][data-id=p2]'); await wait(300); txt = await P.innerText('#app');
  check('own limit blocks the 100 baht pack', /เพดานที่คุณตั้งไว้/.test(txt) && !(await P.$('[data-act=tpsend]')));
  check('history shows totals', /เดือนนี้ ฿20/.test(txt) && /อนุมัติแล้วทั้งหมด ฿20/.test(txt), txt.match(/เดือนนี้[^\n]*/) + '');
  // raise -> waits 24h
  await P.selectOption('#tp_mycap', '500'); await P.click('[data-act=tpcapsave]'); await wait(1000);
  d = await db(P); const mc = d['topup/u_stu'].mycap;
  check('raising the limit waits 24 hours', mc.v === 50 && mc.next === 500 && mc.at - Date.now() > 23 * 36e5, JSON.stringify(mc));
  await goTop(); await P.click('[data-act=tppack][data-id=p2]'); await wait(300); txt = await P.innerText('#app');
  check('still blocked and shows when the new limit starts', /จะมีผลเมื่อ/.test(txt) && !(await P.$('[data-act=tpsend]')));
  await P.screenshot({ path: 'fair-topup.png', fullPage: true });
  // gacha rates per item
  await P.evaluate(() => document.querySelector('nav [data-id=gacha]').click()); await wait(500); txt = await P.innerText('#app');
  check('gacha shows per-item odds column and pointer', /ต่อชิ้น/.test(txt) && /อัตราได้รับของทุกระดับ/.test(txt));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
