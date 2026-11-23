const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const OFF0 = Date.UTC(2026, 10, 25, 8, 0) - Date.now();
const clock = at => `(function(){var off=${OFF0};var D=Date;function N(){if(arguments.length===0)return new D(D.now()+off);return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))()}N.prototype=D.prototype;N.now=function(){return D.now()+off};N.UTC=D.UTC;N.parse=D.parse;window.Date=N})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const AT = Date.UTC(2026, 10, 25, 8, 0); // 25 Nov 15:00 BKK: skill trees v2 live, World Goat open
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(clock(AT)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  let P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=sword]'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  await A.click('[data-act=admtab][data-id=players]'); await wait(2500); await A.click('[data-act=admpgive][data-id=u_stu]'); await wait(400); await A.fill('#give_coin', '30000'); await A.fill('#give_lvl', '60'); await A.click('[data-act=admpgiveyes]'); await wait(3000);
  await P.reload(); await wait(4000);
  const s0 = await P.evaluate(() => { const S = window.__TLQ.S(); return { lvl: S.lvl, coin: S.coin } });
  check('teacher gave 60 levels and 30000 coins', s0.lvl >= 61 && s0.coin >= 30000, JSON.stringify(s0));
  // skill tree modal
  await P.evaluate(() => document.querySelector('nav [data-id=me]').click()); await wait(500);
  await P.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'skills'; document.getElementById('app').appendChild(b); b.click() }); await wait(600);
  const tiers = await P.$$eval('.sk-tier', a => a.length); const picks = await P.$$eval('[data-act=skbr]', a => a.map(b => b.dataset.id));
  check('tree shows 6 tiers and 10 branch choices', tiers === 6 && picks.length === 10, tiers + ' / ' + picks.join(','));
  await P.screenshot({ path: 'sk2-tree.png' });
  for (const id of ['1A', '2A', '3B', '4A', '5A']) { await P.click(`[data-act=skbr][data-id="${id}"]`); await wait(250) }
  let st = await P.evaluate(() => ({ skb: window.__TLQ.S().skb, list: null }));
  check('branches picked for free', JSON.stringify(st.skb) === JSON.stringify({ 1: 'A', 2: 'A', 3: 'B', 4: 'A', 5: 'A' }), JSON.stringify(st.skb));
  const c1 = await P.evaluate(() => window.__TLQ.S().coin);
  await P.click('[data-act=skbr][data-id="1B"]'); await wait(300);
  const c2 = await P.evaluate(() => ({ coin: window.__TLQ.S().coin, b: window.__TLQ.S().skb[1] }));
  check('switching a branch costs 500 coins', c2.coin === c1 - 500 && c2.b === 'B', JSON.stringify({ c1, c2 }));
  const dis = await P.evaluate(() => { const b = document.querySelector('[data-act=skbr][data-id="1A"]'); return b && b.disabled });
  check('a second switch the same week is blocked', dis === true);
  await P.click('[data-act=skup][data-id=sw3]'); await wait(300);
  check('upgrade the 40 skill to Lv.2', await P.evaluate(() => window.__TLQ.S().sk.sw3 === 2));
  await P.screenshot({ path: 'sk2-tree2.png' });
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(300);
  // raid with skills
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(700);
  await P.click('.rd-ev [data-act=rdgo]'); await wait(700); await P.click('[data-act=rdjoin]'); await wait(500);
  const bar = await P.$$eval('[data-act=skuse]', a => a.map(b => b.dataset.id));
  check('fight bar has the 6 picked skills', JSON.stringify(bar) === JSON.stringify(['sw1', 'sw2', 'swa2', 'swb3', 'sw3', 'swa5']), bar.join(','));
  await P.click('[data-act=skuse][data-id=swa5]'); await wait(1600);
  const px = await P.evaluate(() => { const c = document.querySelector('.sk-canvas'); if (!c) return -1; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 400) if (d[i] > 0) n++; return n });
  check('level-60 skill draws on the effect layer', px > 50, 'lit samples ' + px);
  await P.screenshot({ path: 'sk2-god.png' }); await wait(2600);
  await P.click('[data-act=skuse][data-id=sw3]'); await wait(1200); await P.screenshot({ path: 'sk2-ult.png' }); await wait(1500);
  for (let i = 0; i < 10; i++) {
    if (i === 3) { await P.click('[data-act=skuse][data-id=sw2]'); await wait(300) }
    if (i === 4) { await P.click('[data-act=skuse][data-id=swb3]'); await wait(1500) }
    await P.evaluate(() => { const R = window.__TLQ.raid, e = R.enc(), q = e.qs[e.i]; R.ans(q.ans) }); await wait(150); await P.evaluate(() => window.__TLQ.raid.next()); await wait(150) }
  await wait(2000);
  const e = await P.evaluate(() => window.__TLQ.S().log.filter(x => x.k === 'raid').slice(-1)[0]);
  const exp = await P.evaluate(() => ['swa5', 'sw3', 'sw2', 'swb3'].reduce((a, id) => a + window.__TLQ.skMax(id), 0));
  check('raid record: 4 skills used, bonus damage within the cap', e && e.su && e.su.length === 4 && e.sb > 10 && e.sb <= Math.min(40, exp), JSON.stringify(e && { su: e.su, sb: e.sb, ok: e.ok, cap: exp }));
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(500);
  const f1 = await P.evaluate(() => ({ notPicked: window.__TLQ.skMax('swb5'), picked: window.__TLQ.skMax('swa5') }));
  check('a skill from a branch not picked counts as locked (verifier uses the same rule)', f1.notPicked === 0 && f1.picked > 0, JSON.stringify(f1));
  const f2 = await P.evaluate(() => window.__TLQ.verifyFake({ k: 'skbr', t2: 1, b: 'A', cost: 500 }));
  check('a second branch switch in the same week is caught', Array.isArray(f2) && f2.includes('skill'), JSON.stringify(f2));
  await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(2500);
  await A.click('[data-act=admtab][data-id=gift]'); await wait(300); await A.click('[data-act=admtab][data-id=players]'); await wait(4000);
  const v = await A.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; return r && r.res ? { errs: r.res.errs, msgs: r.res.issues.map(x => x.msg).join(',') } : null });
  check('teacher verification clean', v && v.errs === 0, JSON.stringify(v));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
