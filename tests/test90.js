const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const clock = at => `(function(){var off=${at}-Date.now();var D=Date;function N(){if(arguments.length===0)return new D(D.now()+off);return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))()}N.prototype=D.prototype;N.now=function(){return D.now()+off};N.UTC=D.UTC;N.parse=D.parse;window.Date=N})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid, at) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); if (at) await p.addInitScript(clock(at)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const B = (d, h) => Date.UTC(2026, 10, d, h - 7, 0); // Bangkok time -> UTC
  try {
  const A = await open('admin', 'u_admin', B(23, 15)); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  let P = await open('student', 'u_stu', B(29, 12)); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=mage]'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  const card = async () => { await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(1200); return (await P.$$eval('.rd-card', a => a.map(c => c.innerText.replace(/\n/g, ' ').slice(0, 50))))[0] || '' };
  let c = await card(); check('29 Nov: goat still shown (live beats upcoming knight)', /แพะแห่งโลกา/.test(c), c);
  await P.close();
  P = await open('student', 'u_stu', B(30, 15)); await wait(2500);
  await A.click('[data-act=admtab][data-id=players]'); await wait(2500); await A.click('[data-act=admpgive][data-id=u_stu]'); await wait(400); await A.fill('#give_coin', '500'); await A.click('[data-act=admpgiveyes]'); await wait(2500);
  c = await card(); check('30 Nov 15:00: Gale Knight shown on village', /อัศวินวายุ/.test(c), c);
  await P.screenshot({ path: 'g-home.png' });
  await P.click('.rd-ev [data-act=rdgo]'); await wait(800);
  const img = await P.evaluate(() => !!document.querySelector('img[src*="boss_sky_gale_knight"]'));
  check('Gale Knight sprite drawn', img);
  await P.screenshot({ path: 'g-knight.png' });
  const c0 = await P.evaluate(() => window.__TLQ.S().coin);
  await P.click('[data-act=rdjoin]'); await wait(500);
  for (let i = 0; i < 10; i++) { await P.evaluate(w => { const R = window.__TLQ.raid, e = R.enc(), q = e.qs[e.i]; R.ans(w ? (q.ans === 0 ? 1 : 0) : q.ans) }, i < 2); await wait(150); if (i === 0) { const t = await P.innerText('#app'); check('knight casts its own skill', /พายุกวาดทรัพย์/.test(t)); await P.screenshot({ path: 'g-fight.png' }) } await P.evaluate(() => window.__TLQ.raid.next()); await wait(150) }
  await wait(1500);
  const re = await P.evaluate(() => { const S = window.__TLQ.S(); return { coin: S.coin, e: S.log.filter(x => x.k === 'raid').slice(-1)[0] } });
  check('2 wrong answers cost 20 coins vs knight', re.e && re.e.rid === 'ev-gale-1' && re.e.pen === 20 && re.coin === c0 - 20, JSON.stringify({ c0, c1: re.coin, rid: re.e && re.e.rid, pen: re.e && re.e.pen }));
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() });
  await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(2500);
  await P.close();
  P = await open('student', 'u_stu', Date.UTC(2026, 11, 8, 8, 0)); await wait(2500);
  c = await card(); check('8 Dec: Rift Dragon King shown', /ราชามังกรรอยแยก/.test(c), c);
  await P.click('.rd-ev [data-act=rdgo]'); await wait(800);
  check('Rift Dragon King sprite drawn', await P.evaluate(() => !!document.querySelector('img[src*="boss_abyss_rift_dragon_king"]')));
  await P.screenshot({ path: 'g-dragon.png' });
  const A2 = await open('admin', 'u_admin', Date.UTC(2026, 11, 8, 8, 0)); await A2.click('[data-act=go][data-id=admin]'); await wait(1500); await A2.click('[data-act=admtab][data-id=players]'); await wait(3500);
  const v = await A2.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; return r && r.res ? { errs: r.res.errs, msgs: r.res.issues.map(x => x.msg).join(',') } : null });
  check('teacher verification clean', v && v.errs === 0, JSON.stringify(v));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
