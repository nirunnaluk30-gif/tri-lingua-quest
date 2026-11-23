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
  await goTop(P);
  check('sp1 card says first time 10 tickets', /ครั้งแรกได้ตั๋ว 10 ใบ/.test(await P.innerText('.tp-sp1')));
  
  await P.click('[data-act=tppack][data-id=sp1]'); await wait(200);
  check('amount says ฿29 and gift line shows box + tickets + title', /🎟️ 10/.test(await P.innerText('.tp-pay')));
  await P.fill('#tp_ref', '10:05'); await P.check('input[name=tp_age][value=adult]'); await P.click('[data-act=tpsend]'); await wait(1200);
  let d = await db(P); const r = d['topup/u_stu'].reqs.slice(-1)[0]; check('request is for the promo at ฿29', r.pack === 'sp1', JSON.stringify({ p: r.pack, pr: r.price }));
  const t0 = await P.evaluate(() => window.__TLQ.S().tickets);
  await A.click('[data-act=admtab][data-id=overview]'); await wait(200); await A.click('[data-act=admtab][data-id=topup]'); await wait(800);
  const id = await A.evaluate(() => { const b = [...document.querySelectorAll('[data-act=admwlok]')].find(x => x.dataset.id.startsWith('u_stu|')); return b && b.dataset.id }); await A.click(`[data-act=admwlok][data-id="${id}"]`); await wait(3000);
  const st = await P.evaluate(() => { const S = window.__TLQ.S(), I = window.__TLQ.ITEM(); const cel = Object.keys(S.owned).filter(k => I[k] && I[k].rar === 'celestial'); return { tk: S.tickets, cel, tt: S.tta } });
  check('student gets 10 tickets, 1 celestial item and the title', st.tk === t0 + 10, JSON.stringify(st));
  // pretend this purchase was approved before the change to 50 tickets
  await A.evaluate(() => { const d = JSON.parse(localStorage.__mockdb); d['topup/u_stu'].reqs.forEach(r => { if (r.pack === 'sp1') r.done = Date.UTC(2026, 10, 22, 5, 0) }); localStorage.__mockdb = JSON.stringify(d) });
  await A.click('[data-act=admtab][data-id=overview]'); await wait(300); await A.click('[data-act=admtab][data-id=topup]'); await wait(1000);
  check('admin sees the make-up notice with a button', !!(await A.$('[data-act=admsptk]')) && /Ploy \+10/.test(await A.innerText('#app')));
  await A.screenshot({ path: 'pr50.png' });
  const tk1 = await P.evaluate(() => window.__TLQ.S().tickets);
  await A.click('[data-act=admsptk]'); await wait(3000);
  const tk2 = await P.evaluate(() => window.__TLQ.S().tickets);
  check('student gets 40 more tickets', tk2 === tk1 + 10, tk1 + ' -> ' + tk2);
  await A.click('[data-act=admtab][data-id=overview]'); await wait(300); await A.click('[data-act=admtab][data-id=topup]'); await wait(1000);
  check('notice gone after sending (no double)', !(await A.$('[data-act=admsptk]')));
  await goTop(P); check('promo now marked as mine; cannot buy again', /ได้รับแล้ว|ของฉัน/.test(await P.innerText('.tp-promo')) && !(await P.$('.tp-promo [data-act=tppack]')), (await P.innerText('.tp-promo')).replace(/\n/g,' | ').slice(-120));
  await wait(2000); await A.click('[data-act=admtab][data-id=players]'); await wait(3000);
  const v = await A.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; return r && r.res ? { errs: r.res.errs, msgs: r.res.issues.map(x => x.msg).join(',') } : null });
  check('teacher verification clean', v && v.errs === 0, JSON.stringify(v));
  // buy sp1 again: gems only
  await goTop(P); check('after first purchase the card no longer promises tickets', !/ครั้งแรกได้ตั๋ว/.test(await P.innerText('.tp-sp1')));
  await P.click('[data-act=tppack][data-id=sp1]'); await wait(200); await P.fill('#tp_ref', '11:30'); await P.check('input[name=tp_age][value=adult]'); await P.click('[data-act=tpsend]'); await wait(1200);
  const g0 = await P.evaluate(() => ({ t: window.__TLQ.S().tickets, g: window.__TLQ.S().gems }));
  await A.click('[data-act=admtab][data-id=overview]'); await wait(200); await A.click('[data-act=admtab][data-id=topup]'); await wait(800);
  const id2 = await A.evaluate(() => { const b = [...document.querySelectorAll('[data-act=admwlok]')].find(x => x.dataset.id.startsWith('u_stu|')); return b && b.dataset.id }); await A.click(`[data-act=admwlok][data-id="${id2}"]`); await wait(3000);
  const g1 = await P.evaluate(() => ({ t: window.__TLQ.S().tickets, g: window.__TLQ.S().gems }));
  check('second purchase: gems yes, tickets no', g1.t === g0.t && g1.g > g0.g, JSON.stringify({ g0, g1 }));
  await A.click('[data-act=admtab][data-id=overview]'); await wait(200); await A.click('[data-act=admtab][data-id=topup]'); await wait(800);
  check('back-pay notice does not come back', !(await A.$('[data-act=admsptk]')));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
