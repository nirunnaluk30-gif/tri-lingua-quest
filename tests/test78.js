const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const START = Date.UTC(2026, 10, 18, 12, 0);
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const clock = at => `(function(){var off=${at}-Date.now();var D=Date;function N(){if(arguments.length===0)return new D(D.now()+off);return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))()}N.prototype=D.prototype;N.now=function(){return D.now()+off};N.UTC=D.UTC;N.parse=D.parse;window.Date=N})();`;
  async function open(role, uid, at) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); if (at) await p.addInitScript(clock(at)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const db = P => P.evaluate(() => JSON.parse(localStorage.getItem('__mockdb')));
  try {
    const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
    await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000); await A.close();
    // before 20:30 (19:40)
    let P = await open('student', 'u_s0', START - 50 * 60e3); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Som'); await P.click('[data-act=confirmcreate]'); await wait(2000);
    await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(800);
    let txt = await P.innerText('#app');
    check('home shows lion card before 20:30 with wait message', /มังกรกลไก/.test(txt) && /เริ่มตีได้/.test(txt), (txt.match(/บอสปรากฏ[^\n]*/) || [''])[0]);
    check('weekly boss card still there too', (await P.$$('.rd-card')).length === 2);
    await P.evaluate(() => document.querySelector('nav [data-id=town]').click()); await wait(1500); check('no boss or mecha standing on the plaza', !(await P.$('.tw-mecha')) && !(await P.$('.tw-boss'))); await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(600);
    await P.click('.rd-ev [data-act=rdgo]'); await wait(600); txt = await P.innerText('#app');
    check('raid page: lion hero, join disabled before 20:30', /มังกรกลไกผู้พิทักษ์ไตรภาษา/.test(txt) && !!(await P.$('.rd-big .rex-art')) && !!(await P.$('button[disabled]')) && !(await P.$('[data-act=rdjoin]')));
    check('rewards text lists 1000 coins, 10 gems, 1/3/5 drops', /🪙 1000/.test(txt) && /💎 10/.test(txt) && /สวรรค์ 1/.test(txt) && /เหนือตำนาน 3/.test(txt) && /ตำนาน 5/.test(txt));
    await P.screenshot({ path: 'rex-wait.png', fullPage: true });
    await P.evaluate(() => { const R = window.__TLQ.raid; R.use('ev'); R.join() }); check('cannot join before 20:30 even by force', !(await P.evaluate(() => !!window.__TLQ.raid.enc())));
    await P.close();
    // after 20:30: 11 players answer 10 each (first one gets 2 wrong)
    const pages = [];
    for (let i = 0; i < 11; i++) {
      const Q = await open('student', 'u_p' + i, START + 5 * 60e3 + i * 1000); pages.push(Q); await wait(800);
      await Q.click('[data-act=newgame]'); await Q.fill('#hname', 'Pa' + 'abcdefghijk'[i]); await Q.click('[data-act=confirmcreate]'); await wait(1500);
      await Q.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(500);
      await Q.click('.rd-ev [data-act=rdgo]'); await wait(800);
      if (i === 0) { txt = await Q.innerText('#app'); check('join button says 10 questions', /เข้าร่วมตี \(10 ข้อ\)/.test(txt)); await Q.screenshot({ path: 'rex-live.png' }) }
      await Q.click('[data-act=rdjoin]'); await wait(400);
      if (i === 0) await Q.screenshot({ path: 'rex-arena.png' });
      const n = await Q.evaluate(k => { const R = window.__TLQ.raid; let c = 0; while (R.enc() && c < 30) { const e = R.enc(), q = e.qs[e.i]; R.ans(k === 0 && c < 2 ? (q.ans === 0 ? 1 : 0) : q.ans); c++; R.next() } return c }, i);
      if (i === 0) check('one session = 10 questions', n === 10, 'n=' + n); console.log('N', i, n);
      await wait(1500); await Q.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); if (m) m.click() }); await wait(300);
    }
    await wait(70000);
    const V = await open('student', 'u_p0', START + 20 * 60e3); let d = await db(V); await V.close();
    const hits = Object.keys(d).filter(k => k.startsWith('raid/ev-rex-1/hits/'));
    console.log('HITS', hits.map(k=>k.split('/').pop()+':'+d[k].ok).join(' '));check('11 fighters recorded, 108 damage', hits.length === 11 && hits.reduce((a, k) => a + d[k].ok, 0) === 108, hits.length + ' / ' + hits.reduce((a, k) => a + d[k].ok, 0));
    // claims
    const tiers = {}; let coinOk = 0;
    for (let i = 0; i < 11; i++) {
      const Q = pages[i]; await Q.bringToFront();
      await Q.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(500);
      await Q.click('.rd-ev [data-act=rdgo]'); await wait(1200);
      if (i === 0) { txt = await Q.innerText('#app'); check('boss shown as defeated', /มังกรกลไกผู้พิทักษ์ไตรภาษา ถูกปราบแล้ว/.test(txt), txt.slice(txt.indexOf('ถูกปราบ'), txt.indexOf('ถูกปราบ') + 200).replace(/\n/g, ' | ') + ' raid=' + JSON.stringify(await Q.evaluate(() => window.__TLQ.S().raid))) }
      const before = await Q.evaluate(() => ({ c: window.__TLQ.S().coin, g: window.__TLQ.S().gems }));
      const okc = await Q.waitForSelector('[data-act=rdclaim]', { state: 'attached', timeout: 8000 }).then(() => true, () => false); if (!okc) { check('claim button for P' + i, false, (await Q.innerText('#app')).slice(0, 600).replace(/\n/g, ' | ')); continue } await Q.evaluate(() => document.querySelector('[data-act=rdclaim]').click()); await wait(800);
      const r = await Q.evaluate(() => { const S = window.__TLQ.S(); const e = S.log.filter(x => x.k === 'raidwin').slice(-1)[0]; return { er: e && e.r, coinNow: S.coin, coinsNow: S.coins, tier: e && e.tier, item: e && e.item, rar: e && e.item && window.__TLQ.ITEM()[e.item] ? window.__TLQ.ITEM()[e.item].rar : '', c: S.coin, g: S.gems } });
      tiers[r.tier] = (tiers[r.tier] || 0) + 1; if (r.er && r.er.coin === 1000 && r.er.gems === 10) coinOk++; if (i === 0) check('debug reward', true, JSON.stringify(r) + ' before ' + JSON.stringify(before));
      if (r.tier !== 'none' && r.rar !== r.tier) check('item rarity matches tier for P' + i, false, JSON.stringify(r));
      if (i === 0) await Q.screenshot({ path: 'rex-claim.png' });
    }
    check('drops: 1 celestial, 3 mythic, 5 legendary, 2 none', tiers.celestial === 1 && tiers.mythic === 3 && tiers.legendary === 5 && tiers.none === 2, JSON.stringify(tiers));
    check('everyone got +1000 coins and +10 gems', coinOk === 11, coinOk + '/11');
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
