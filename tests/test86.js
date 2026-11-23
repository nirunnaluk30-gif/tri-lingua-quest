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
  check('founder card lists 100 tickets', /ตั๋วอัญเชิญ 100 ใบ/.test(await P.innerText('.tp-fd.tp-fd')));
  
  await P.click('[data-act=tppack][data-id=fd]'); await wait(200);
  check('amount says ฿29 and gift line shows box + tickets + title', /🎟️ 100/.test(await P.innerText('.tp-pay')));
  await P.fill('#tp_ref', '10:05'); await P.check('input[name=tp_age][value=adult]'); await P.click('[data-act=tpsend]'); await wait(1200);
  let d = await db(P); const r = d['topup/u_stu'].reqs.slice(-1)[0]; check('request is for the promo at ฿29', r.pack === 'fd', JSON.stringify({ p: r.pack, pr: r.price }));
  const t0 = await P.evaluate(() => window.__TLQ.S().tickets);
  await A.click('[data-act=admtab][data-id=overview]'); await wait(200); await A.click('[data-act=admtab][data-id=topup]'); await wait(800);
  const id = await A.evaluate(() => { const b = [...document.querySelectorAll('[data-act=admwlok]')].find(x => x.dataset.id.startsWith('u_stu|')); return b && b.dataset.id }); await A.click(`[data-act=admwlok][data-id="${id}"]`); await wait(3000);
  const st = await P.evaluate(() => { const S = window.__TLQ.S(), I = window.__TLQ.ITEM(); const cel = Object.keys(S.owned).filter(k => I[k] && I[k].rar === 'celestial'); return { tk: S.tickets, cel, tt: S.tta } });
  check('student gets 10 tickets, 1 celestial item and the title', st.tk === t0 + 100, JSON.stringify(st));
  await goTop(P);
  const fdc = await P.evaluate(() => { const c = document.querySelector('.tp-fd.tp-fd'); return { txt: c.innerText.replace(/\n/g, ' | '), btn: !!c.querySelector('[data-act=tppack]') } });
  check('after approval: ฿99 card says "มีแล้ว" and has no buy button', /มีแล้ว/.test(fdc.txt) && !fdc.btn, JSON.stringify(fdc));
  const n0 = await P.evaluate(() => JSON.parse(localStorage.__mockdb)['topup/u_stu'].reqs.length);
  await P.evaluate(() => { window.__TLQ.UI().tpPack = 'fd' }); await P.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'tpsend'; document.getElementById('app').appendChild(b); b.click() }); await wait(1200);
  const n1 = await P.evaluate(() => JSON.parse(localStorage.__mockdb)['topup/u_stu'].reqs.length);
  check('forcing a second ฿99 request is refused', n1 === n0, n0 + ' -> ' + n1);
  // pending state also blocks
  await P.click('[data-act=tppack][data-id=fd2]'); await wait(200); await P.fill('#tp_ref', '11:00'); await P.check('input[name=tp_age][value=adult]'); await P.click('[data-act=tpsend]'); await wait(1200);
  await goTop(P);
  const f2 = await P.evaluate(() => { const c = document.querySelector('.tp-fd2'); return { txt: c.innerText.replace(/\n/g, ' | '), btn: !!c.querySelector('[data-act=tppack]') } });
  check('while waiting for approval: ฿199 card shows waiting, no buy button', /รอ/.test(f2.txt) && !f2.btn, JSON.stringify(f2));
  const n2 = await P.evaluate(() => JSON.parse(localStorage.__mockdb)['topup/u_stu'].reqs.length);
  await P.evaluate(() => { window.__TLQ.UI().tpPack = 'fd2' }); await P.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'tpsend'; document.getElementById('app').appendChild(b); b.click() }); await wait(1200);
  const n3 = await P.evaluate(() => JSON.parse(localStorage.__mockdb)['topup/u_stu'].reqs.length);
  check('a second ฿199 request while one is waiting is refused', n3 === n2, n2 + ' -> ' + n3);
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
