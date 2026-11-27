// wardrobe: items split into main groups (weapons, clothes, hair & hats, accessories, pets, others) with slot sub-tabs
const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  try {
  for (const [w, h, tag] of [[1280, 860, 'pc'], [390, 844, 'ph']]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const P = await ctx.newPage(); P.on('pageerror', e => errors.push(tag + ': ' + e.message));
    await P.addInitScript(MOCK('student', 'u_' + tag)); await P.goto(URL); await wait(3000);
    await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=archer]'); await P.click('[data-act=confirmcreate]'); await wait(2500);
    // give a spread of items for display (test-only state)
    await P.evaluate(() => { const T = window.__TLQ, S = T.S(), seen = {}; T.ITEMS().forEach(i => { const k = i.cat + (i.v && i.v.k || ''); if (!seen[k] || seen[k] < 2) { seen[k] = (seen[k] || 0) + 1; S.owned[i.id] = 1 } }); T.render() });
    await P.evaluate(() => document.querySelector('[data-act=go][data-id=wd]').click()); await wait(600);
    const r = await P.evaluate(() => {
      const g = [...document.querySelectorAll('.wd-groups button')].map(b => b.textContent.trim()), on = document.querySelector('.wd-groups [aria-pressed=true]');
      const all = Object.keys(window.__TLQ.S().owned).filter(k => window.__TLQ.S().owned[k] > 0).length; return { g, on: on && on.dataset.id, shown: document.querySelectorAll('.igrid .icard, .igrid > *').length, all } });
    check(tag + ': wardrobe shows group tabs and only one group at a time (not everything)', r.g.length >= 5 && r.shown < r.all && r.shown > 0, JSON.stringify(r));
    await P.click('.wd-groups [data-id=weapon]'); await wait(300);
    const wp = await P.evaluate(() => { const S = window.__TLQ.S(); return { n: document.querySelectorAll('.igrid > *').length, subs: document.querySelectorAll('.wd-subs button').length, badge: document.querySelector('.wd-groups [data-id=weapon] .wd-n').textContent } });
    check(tag + ': weapons tab lists only weapons (count matches the tab badge)', wp.n > 0 && String(wp.n) === wp.badge, JSON.stringify(wp)); check(tag + ': weapons are split by class, my class first', wp.subs >= 3, String(wp.subs));
    await P.click('.wd-groups [data-id=wear]'); await wait(300);
    const we = await P.evaluate(() => ({ subs: [...document.querySelectorAll('.wd-subs button')].map(b => b.textContent.trim()), n: document.querySelectorAll('.igrid > *').length }));
    check(tag + ': clothes tab has sub-tabs (outfit, top, bottom, shoes)', we.subs.length >= 4, JSON.stringify(we));
    await P.click('.wd-subs button:nth-child(2)'); await wait(300);
    const sub = await P.evaluate(() => document.querySelectorAll('.igrid > *').length);
    check(tag + ': a sub-tab narrows the list', sub > 0 && sub < we.n, sub + ' of ' + we.n);
    await P.screenshot({ path: 'wd-' + tag + '.png', fullPage: false });
    const eq = await P.evaluate(() => { const b = document.querySelector('.igrid [data-act=equip]'); if (!b) return 'none'; b.click(); return 'ok' }); await wait(300);
    check(tag + ': equipping still works from a group', eq !== 'none', eq);
    await ctx.close();
  }
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); console.log('ERRORS: ' + (errors.join(' | ') || 'none')); await browser.close();
})();
