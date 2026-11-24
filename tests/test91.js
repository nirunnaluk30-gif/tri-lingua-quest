const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript('window.__noBX=1'); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const WANT = { m: { 7: 'boss_coast_shellguard_warlord', 8: 'boss_aw_cave_beetle', 9: 'boss_aw_brood_empress', 10: 'boss_aw_drill_colossus' }, n: { 7: 'boss_ruins_crimson_count', 8: 'boss_aw_drowned_captain', 9: 'boss_aw_shellguard_warlord', 10: 'boss_aw_rift_dragon_king' } };
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=mage]'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  for (const g of ['m', 'n']) for (const f of [7, 8, 9, 10]) {
    await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(400);
    await P.click(`[data-act=tngate][data-id=${g}]`); await wait(400);
    await P.evaluate(g => { const S = window.__TLQ.S(); S.tng = S.tng || {}; S.tng[g] = Object.assign(S.tng[g] || {}, { max: 9 }) }, g);
    await P.evaluate(f => { const b = document.createElement('button'); b.dataset.act = 'tnfloor'; b.dataset.id = String(f); document.getElementById('app').appendChild(b); b.click() }, f); await wait(900);
    await P.evaluate(() => { window.__TLQ.TN().ents.forEach(e => e.alive = false); document.querySelector('nav [data-id=home]'); }); await P.evaluate(() => window.__TLQ.render()); await wait(300);
    const r = await P.evaluate(() => { const b = document.querySelector('#tn_boss img.mon-img') || document.querySelector('#tn_map img.boss'); return b ? { src: b.getAttribute('src'), ok: b.complete && b.naturalWidth > 0, w: b.naturalWidth } : null });
    const want = 'assets/mon/' + WANT[g][f] + '.webp';
    check(`gate ${g} floor ${f}: boss ${WANT[g][f]}`, r && r.src === want && r.ok, JSON.stringify(r));
    if (!r) { await P.screenshot({ path: 'aw-dbg.png' }); console.log('DBG', await P.evaluate(() => [document.querySelector('#tn_map') ? 'map' : 'nomap', [...document.querySelectorAll('img.mon-img')].map(i => i.className + ':' + i.getAttribute('src')).slice(0, 3).join(' ')].join(' | '))) }
    if (f === 10) await P.screenshot({ path: `aw-map-${g}.png` });
  }
  // fight the awakened Rift Dragon King (gate n floor 10): sprite in the arena, animation really moves, hit shake on a right answer
  await P.evaluate(() => document.getElementById('tn_boss').click()); await wait(300); await P.evaluate(() => { const y = document.querySelector('[data-act=tnyes]'); y && y.click() }); await wait(700);
  const fn = await P.innerText('#app');
  check('fight shows awakened name', /ราชามังกรรอยแยก ร่างตื่น/.test(fn));
  const foe = P.locator('.tn-foe.boss img.mon-img'); await foe.waitFor();
  const shots = []; for (let i = 0; i < 6; i++) { shots.push(await foe.screenshot()); await wait(230) }
  const differ = new Set(shots.map(b => b.toString('base64'))).size;
  check('boss sprite animates in the game (frames differ over time)', differ >= 3, 'distinct frames ' + differ + '/6');
  await P.screenshot({ path: 'aw-intro.png' }); await P.click('[data-act=tnboss]'); await wait(700); await P.screenshot({ path: 'aw-fight.png' });
  const ans = await P.evaluate(() => { const e = window.__TLQ.TN().enc; return e ? e.qs[e.i].ans : null });
  await P.evaluate(p => document.querySelector(`[data-act=tnans][data-id="${p}"]`).click(), ans); await wait(120);
  check('right answer: boss takes the hit (tn-hit)', await P.evaluate(() => !!document.querySelector('.fighter.tn-hit .tn-foe.boss img.mon-img')));
  await P.screenshot({ path: 'aw-hit.png' });
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); console.log('ERRORS: ' + (errors.join(' | ') || 'none')); await browser.close();
})();
