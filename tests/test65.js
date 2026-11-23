const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  try {
    const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
    await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(35000); await A.close();
    const P = await open('student', 'u_s0'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=confirmcreate]'); await wait(2500);
    await P.evaluate(() => document.querySelector('nav [data-id=town]').click()); await wait(1200);
    check('nav has a Market tab next to Town', await P.evaluate(() => { const b = [...document.querySelectorAll('nav [data-act=go]')].map(x => x.dataset.id); return b.indexOf('bazaar') === b.indexOf('town') + 1 }));
    await P.evaluate(() => document.querySelector('nav [data-id=bazaar]').click()); await wait(1200);
    const inject = async () => P.evaluate(() => {
      const T = window.__TLQ, I = T.ITEM(), ids = Object.keys(I); const by = r => ids.filter(k => I[k].rar === r && !I[k].noShop);
      const pick = (r, n) => by(r).slice(0, n); const outfitsF = ids.filter(k => I[k].cat === 'outfits').slice(3, 12);
      const mk = T.mk(); const sellers = [['u_a', 'Mali', 'ร้านชุดสวยของมะลิ', 0, 'F', 'mage', ['legendary', 'epic', 'rare']], ['u_b', 'Beam', 'บีมช็อป อาวุธเท่', 3, 'M', 'sword', ['mythic', 'rare', 'uncommon']], ['u_c', 'Nina', 'Nina Cute Shop', 4, 'F', 'archer', ['epic', 'epic', 'legendary', 'rare']], ['u_d', 'Kai', '', 2, 'M', 'mage', ['uncommon', 'rare']], ['u_e', 'Fah', 'ฟ้าใสพาสเทล', 1, 'F', 'archer', ['rare', 'legendary', 'epic', 'uncommon', 'rare', 'epic']]];
      const price = { uncommon: 120, rare: 300, epic: 800, legendary: 2500, mythic: 6000 };
      sellers.forEach(([u, n, sn, c, g, cls, rs], si) => { const offers = rs.map((r, i) => { const it = by(r)[si + i] || by(r)[0]; return { tid: 't' + u + i, item: it, n: 1, want: { coin: price[r] }, to: '', st: 'open', t: Date.now() } });
        const db = JSON.parse(localStorage.getItem('__mockdb') || '{}'); db['market/' + u] = { name: n, lvl: 5 + si * 3, cls, gender: g, look: { g, cls, eq: { outfit: outfitsF[si] } }, shop: { n: sn, c }, offers, reqs: [] }; localStorage.setItem('__mockdb', JSON.stringify(db)) });
      document.querySelector('nav [data-id=home]').click(); document.querySelector('[data-act=go][data-id=bazaar]') || 0;
    });
    await inject(); await P.reload(); await wait(2500);
    await P.evaluate(() => { document.querySelector('nav [data-id=town]').click() }); await wait(500); await P.evaluate(() => document.querySelector('nav [data-id=bazaar]').click()); await wait(800);
    const n = (await P.$$('.bz-seller')).length; check('sellers standing on the plaza (5 + me)', n === 6, 'n=' + n);
    await P.screenshot({ path: 'bz-pc.png', fullPage: true });
    await P.evaluate(() => document.querySelector('.bz-seller:not(.me)').click()); await wait(500); check('tap stall opens shop with buy buttons', !!(await P.$('.modal [data-act=mkaccept]')));
    await (await P.$('.modal')).screenshot({ path: 'bz-shop.png' });
    await P.evaluate(() => document.querySelector('.modal [data-act=closemodal]').click()); await wait(300);
    await P.click('[data-act=bzsetup]'); await wait(300); await P.fill('#bz_n', 'ร้านพลอยแฟชั่น'); await P.click('[data-act=bzcol][data-id="4"]'); await wait(200);
    check('setup keeps typed name after colour pick', (await P.inputValue('#bz_n')) === 'ร้านพลอยแฟชั่น');
    await (await P.$('.modal')).screenshot({ path: 'bz-setup.png' });
    await P.click('[data-act=bzsave]'); await wait(500);
    check('my stall shows new name', /ร้านพลอยแฟชั่น/.test(await P.innerText('.bz-seller.me')));
    await P.setViewportSize({ width: 390, height: 844 }); await wait(500); await P.screenshot({ path: 'bz-phone.png', fullPage: true }); await (await P.$('nav')).screenshot({ path: 'nav-phone.png' }); await P.setViewportSize({ width: 1280, height: 900 }); await wait(400); await (await P.$('nav')).screenshot({ path: 'nav-pc.png' });
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
