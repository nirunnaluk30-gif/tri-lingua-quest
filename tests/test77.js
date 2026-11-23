const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  const wait = ms => new Promise(r => setTimeout(r, ms)); const errors = [];
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(35000);
  const ps = [];
  for (const [u, n, c] of [['u_s1', 'Mali', 'mage'], ['u_s2', 'Beam', 'sword'], ['u_s3', 'Ann', 'archer']]) { const P = await open('student', u); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', n); await P.click(`[data-act=dcls][data-id=${c}]`); await P.click('[data-act=confirmcreate]'); await wait(2000); ps.push(P) }
  const P = ps[0];
  for (const Q of ps) { await Q.evaluate(() => document.querySelector('nav [data-id=town]').click()); await wait(1500) }
  await P.bringToFront(); await wait(2500);
  const r = await P.evaluate(() => { const m = document.querySelector('.tw-mcart svg').getBoundingClientRect(), a = [...document.querySelectorAll('.tw-p .tw-av svg')].map(x => x.getBoundingClientRect().height); return { mecha: Math.round(m.height), av: a.map(Math.round) } });
  console.log('SIZE', JSON.stringify(r));
  await P.locator('#tw_scene').screenshot({ path: 'mecha-town.png' });
  await P.click('.tw-mecha'); await wait(900); await P.locator('#tw_scene').screenshot({ path: 'mecha-wave.png' });
  await P.evaluate(() => document.querySelector('.modal [data-act=closemodal]') && document.querySelector('.modal [data-act=closemodal]').click()); await wait(3600);
  const box = await P.locator('#tw_scene').boundingBox(); const fr = [];
  for (let i = 0; i < 36; i++) { await P.screenshot({ path: `fr/f${String(i).padStart(2, '0')}.png`, clip: { x: box.x, y: box.y, width: box.width * 0.62, height: box.height } }); if (i === 14) await P.click('.tw-mecha'); await wait(110) }
  await P.setViewportSize({ width: 390, height: 844 }); await wait(1500); await P.locator('#tw_scene').screenshot({ path: 'mecha-phone.png' });
  errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
