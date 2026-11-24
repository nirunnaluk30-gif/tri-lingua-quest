const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const OFF0 = Date.UTC(2026, 10, 25, 8, 0) - Date.now();
const clock = `(function(){var off=${OFF0};var D=Date;function N(){if(arguments.length===0)return new D(D.now()+off);return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))()}N.prototype=D.prototype;N.now=function(){return D.now()+off};N.UTC=D.UTC;N.parse=D.parse;window.Date=N})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); p.on('dialog', d => d.accept()); await p.addInitScript(clock); await p.addInitScript('window.__noBX=1'); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=archer]'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  await A.click('[data-act=admtab][data-id=players]'); await wait(2500); await A.click('[data-act=admpgive][data-id=u_stu]'); await wait(400); await A.fill('#give_coin', '200000'); await A.fill('#give_tickets', '40'); await A.click('[data-act=admpgiveyes]'); await wait(3000);
  await P.reload(); await wait(4000);
  await P.evaluate(() => document.querySelector('nav [data-id=gacha]').click()); await wait(600);
  for (let k = 0; k < 4; k++) { const pb = await P.$$eval('[data-act=pull]', a => a.map(b => b.dataset.id)); await P.click(`[data-act=pull][data-id="${pb[pb.length - 1]}"]`); await wait(2200); await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(400) }
  const own = await P.evaluate(() => { const S = window.__TLQ.S(); return { n: Object.keys(S.owned).length, dup: Object.values(S.owned).filter(x => x > 1).length } });
  check('student has items from 40 pulls', own.n > 10, JSON.stringify(own));
  // bag page
  await P.evaluate(() => document.querySelector('nav [data-id=me]').click()); await wait(500); await P.click('[data-act=go][data-id=bag]'); await wait(700);
  const bag = await P.evaluate(() => ({ slots: document.querySelectorAll('.bag-slot').length, cells: document.querySelectorAll('.bag-grid .bag-cellb').length, cp: document.querySelector('.bag-cp b').textContent }));
  check('bag shows 10 gear slots, the item grid and combat power', bag.slots === 12 && bag.cells > 10, JSON.stringify(bag));
  await P.click('[data-act=bagbest]'); await wait(500);
  const cp1 = await P.evaluate(() => +document.querySelector('.bag-cp b').textContent.replace(/,/g, ''));
  check('"best gear" equips the strongest wearable items', cp1 >= +bag.cp.replace(/,/g, ''), bag.cp + ' -> ' + cp1);
  await P.screenshot({ path: 'bag-1.png', fullPage: true });
  // dismantle duplicates
  const st0 = await P.evaluate(() => window.__TLQ.S().st | 0);
  await P.click('.bag-acts [data-act=bagsalvdup]'); await wait(800);
  const st1 = await P.evaluate(() => ({ st: window.__TLQ.S().st | 0, dup: Object.values(window.__TLQ.S().owned).filter(x => x > 1).length }));
  check('dismantling extras gives stones and leaves one of each', st1.st > st0 && st1.dup === 0, JSON.stringify({ st0, st1 }));
  // upgrade the weapon-or-best worn item up to +12
  const id = await P.evaluate(() => { const S = window.__TLQ.S(), I = window.__TLQ.ITEM(); return Object.values(S.eq).filter(x => I[x] && !['hairColor', 'frame'].includes(I[x].cat)).sort((a, b) => ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'celestial'].indexOf(I[b].rar) - ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'celestial'].indexOf(I[a].rar))[0] });
  await P.evaluate(i => { const b = document.createElement('button'); b.dataset.act = 'bagitem'; b.dataset.id = i; document.getElementById('app').appendChild(b); b.click() }, id); await wait(400);
  await P.screenshot({ path: 'bag-item.png' });
  let tries = 0; for (; tries < 40; tries++) { const lv = await P.evaluate(i => window.__TLQ.S().enh[i] | 0, id); if (lv >= 12) break; const can = await P.evaluate(() => { const b = document.querySelector('.modal [data-act=bagenh]'); return b && !b.disabled }); if (!can) break; await P.click('.modal [data-act=bagenh]'); await wait(200) }
  const en = await P.evaluate(i => ({ lv: window.__TLQ.S().enh[i] | 0, tries: (window.__TLQ.S().enhn || {})[i] | 0, st: window.__TLQ.S().st }), id);
  check('upgrade +1..+10 always works, then rolls continue', en.lv >= 10 && en.tries >= en.lv, JSON.stringify(en));
  await P.screenshot({ path: 'bag-enh.png' });
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(300);
  const cp2 = await P.evaluate(() => +document.querySelector('.bag-cp b').textContent.replace(/,/g, ''));
  check('upgrades raise combat power', cp2 > cp1, cp1 + ' -> ' + cp2);
  // raid with combat power bonus
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(700);
  await P.click('.rd-ev [data-act=rdgo]'); await wait(600); await P.click('[data-act=rdjoin]'); await wait(600);
  for (let i = 0; i < 10; i++) { await P.evaluate(() => { const R = window.__TLQ.raid, e = R.enc(); R.ans(e.qs[e.i].ans) }); await wait(120); await P.evaluate(() => window.__TLQ.raid.next()); await wait(120) }
  await wait(2000);
  const e = await P.evaluate(() => window.__TLQ.S().log.filter(x => x.k === 'raid').slice(-1)[0]);
  const want = Math.min(5, Math.floor(cp2 / 1000)) * 10;
  check('raid record: 2 stones and combat-power damage', e && e.st === 2 && want > 0 && (e.cb | 0) === want, JSON.stringify(e && { st: e.st, cb: e.cb, want }));
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(300);
  // forgeries
  const f1 = await P.evaluate(i => window.__TLQ.verifyFake({ k: 'enh', item: i, lv: 20, cost: 4000, sc: 20, ok: true }), id);
  check('skipping upgrade steps is caught', Array.isArray(f1) && f1.includes('enh'), JSON.stringify(f1));
  const f2 = await P.evaluate(i => { const S = window.__TLQ.S(), lv = (S.enh[i] | 0) + 1; return window.__TLQ.verifyFake({ k: 'enh', item: i, lv, cost: lv * 200, sc: lv, ok: true, forceRoll: 1 }) }, id);
  const f3 = await P.evaluate(i => window.__TLQ.verifyFake({ k: 'salv', item: i, st: 999 }), id);
  check('dismantling for too many stones is caught', Array.isArray(f3) && f3.includes('enh'), JSON.stringify(f3));
  await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(2500);
  await A.click('[data-act=admtab][data-id=gift]'); await wait(300); await A.click('[data-act=admtab][data-id=players]'); await wait(4000);
  const v = await A.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; return r && r.res ? { errs: r.res.errs, msgs: r.res.issues.map(x => x.msg).join(',') } : null });
  check('teacher verification clean (upgrades, dismantles, raid)', v && v.errs === 0, JSON.stringify(v));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
