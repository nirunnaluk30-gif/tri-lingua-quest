const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/bis/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => console.log('ERR', uid, e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CERR', m.text().slice(0, 200)) }); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=confirmcreate]'); await wait(2000);
  await A.click('[data-act=admtab][data-id=topup]'); await wait(300);
  await A.check('#wl_en'); await A.fill('#wl_a', '080-000-0000'); await A.fill('#wl_n', 'Test'); await A.fill('#wl_p', '50,20,0\n300,100,30'); await A.fill('#wl_cap', '1000'); await A.uncheck('#wl_fd');
  await A.click('[data-act=admwlsave]'); await wait(1200);
  for (const w of [400, 3000]) { await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await P.evaluate(() => document.querySelector('nav [data-id=shop]').click()); await P.click('[data-act=shoptab][data-id=topup]'); await wait(w);
    console.log(w, (await P.innerText('#app')).slice(150, 300).replace(/\n/g, ' | ')) }
  console.log('T', await P.evaluate(() => typeof cleanWallet + ' ' + typeof walletOn));
  const sz = await P.evaluate(() => localStorage.getItem('__mockdb').length); console.log('size', sz);
  await browser.close();
})();
