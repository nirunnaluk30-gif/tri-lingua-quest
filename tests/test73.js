const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(MOCK(role, uid)); await p.addInitScript('window.TLQ_FIREBASE_CONFIG={projectId:"demo-proj"}'); await p.goto(URL); await wait(300); return p; }
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(35000);
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=confirmcreate]'); await wait(2000);
  await A.click('[data-act=admtab][data-id=players]'); await wait(2500);
  await A.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'admpforgot'; b.dataset.id = 'u_stu'; document.getElementById('app').appendChild(b); b.click() }); await wait(500);
  const txt = await A.innerText('.modal');
  check('forgot-password helper opens with 4 steps', (await A.$$('.modal .pw-steps > li')).length === 4, txt.slice(0, 200));
  check('explains password cannot be viewed', /ดูรหัสเดิมไม่ได้/.test(txt));
  check('shows ID + sign-in email', /u_stu@id\.trilingua\.local/.test(txt));
  check('console link points to project auth users', (await A.getAttribute('.modal a[href*="console.firebase"]', 'href')) === 'https://console.firebase.google.com/project/demo-proj/authentication/users');
  check('unlock button present', !!(await A.$('.modal [data-act=admpunbind][data-id=u_stu]')));
  check('message for student includes ID', /ID เดิม: u_stu/.test(await A.inputValue('.modal textarea')));
  await A.screenshot({ path: 'pw-modal.png' });
  await A.evaluate(() => document.querySelector('.modal [data-act=closemodal]').click()); await wait(400);
  await A.click('[data-act=admpgive][data-id=u_stu]'); await wait(500);
  check('give modal shows add-level label', /เพิ่มเลเวล/.test(await A.innerText('.modal')));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
