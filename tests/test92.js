const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const clock = at => `(function(){var off=${at}-Date.now();var D=Date;function N(){if(arguments.length===0)return new D(D.now()+off);return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))()}N.prototype=D.prototype;N.now=function(){return D.now()+off};N.UTC=D.UTC;N.parse=D.parse;window.Date=N})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const AT = Date.UTC(2026, 10, 24, 8, 0);
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(clock(AT)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const mk = async (uid, name) => { const P = await open('student', uid); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', name); await P.click('[data-act=dcls][data-id=mage]'); await P.click('[data-act=confirmcreate]'); await wait(2500); return P };
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  let P = await mk('u_stu', 'Ploy'); const Q = await mk('u_two', 'Beam');
  // teacher approves a ฿500 top-up for Ploy (VIP 6)
  await A.evaluate(at => window.__TLQ.CL.db.doc('adjust/u_stu').set({ rev: 1, list: [{ id: 'atop1', t: at + 30000, coin: 0, gems: 100, tickets: 0, src: 'topup', baht: 500 }], resetAt: 0, tt: {}, vipB: 500, rn: 0, ban: false }), AT); await wait(1500);
  await P.reload(); await wait(4000);
  const v0 = await P.evaluate(() => ({ b: window.__TLQ.S().vipB }));
  check('top-up reached the student (VIP 6)', v0.b === 500, JSON.stringify(v0));
  const home = await P.evaluate(() => window.__TLQ.avatar(window.__TLQ.S(), { anim: true }));
  check('home avatar has the strongest unlocked spirit (Drill Colossus, VIP 6)', home.includes('boss_aw_drill_colossus') && home.includes('av-gd'));
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(700); await P.screenshot({ path: 'gd-home.png' });
  // me page panel
  await P.evaluate(() => document.querySelector('nav [data-id=me]').click()); await wait(700);
  const pan = await P.evaluate(() => { const c = [...document.querySelectorAll('.gd-card')]; return { n: c.length, locked: c.filter(x => x.classList.contains('locked')).length, btn: [...document.querySelectorAll('[data-act=gdset]')].map(b => b.dataset.id) } });
  check('me page shows 6 spirits: 4 unlocked, 2 locked', pan.n === 6 && pan.locked === 2, JSON.stringify(pan));
  await P.locator('.gd-panel').screenshot({ path: 'gd-panel.png' });
  await P.click('[data-act=gdset][data-id=gd4]'); await wait(500);
  check('choosing Drowned Captain makes it follow', await P.evaluate(() => window.__TLQ.avatar(window.__TLQ.S(), {}).includes('boss_aw_drowned_captain')));
  await P.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'gdset'; b.dataset.id = 'gd8'; document.getElementById('app').appendChild(b); b.click() }); await wait(300);
  check('a locked spirit (VIP 8) cannot be chosen', await P.evaluate(() => window.__TLQ.S().set.gd === 'gd4'));
  // non-VIP student: nothing
  const q0 = await Q.evaluate(() => window.__TLQ.avatar(window.__TLQ.S(), {}));
  check('student without top-up has no spirit', !q0.includes('av-gd'));
  // town
  await P.evaluate(() => document.querySelector('nav [data-id=town]').click()); await wait(3500);
  const tw = await P.evaluate(() => [...document.querySelectorAll('.tw-p.me .tw-av svg')].map(s => s.outerHTML.includes('boss_aw_drowned_captain'))[0]);
  check('town: spirit floats beside the player', tw === true);
  await P.locator('#tw_scene').screenshot({ path: 'gd-town.png' });
  // raid: World Goat, 10 questions, 3 wrong -> ok 7 -> spirit adds 7*20
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(700);
  await P.click('.rd-ev [data-act=rdgo]'); await wait(800);
  const hp0 = await P.evaluate(() => document.body.innerText.match(/(\d+) \/ 300/) ? +document.body.innerText.match(/(\d+) \/ 300/)[1] : null);
  await P.click('[data-act=rdjoin]'); await wait(500);
  for (let i = 0; i < 10; i++) { await P.evaluate(w => { const R = window.__TLQ.raid, e = R.enc(), q = e.qs[e.i]; R.ans(w ? (q.ans === 0 ? 1 : 0) : q.ans) }, i < 3); await wait(150); if (i === 3) { check('spirit hit shows -20 on a right answer', !!(await P.$('.gd-pop'))); await P.screenshot({ path: 'gd-raid.png' }) } await P.evaluate(() => window.__TLQ.raid.next()); await wait(150) }
  await wait(2000);
  const e = await P.evaluate(() => window.__TLQ.S().log.filter(x => x.k === 'raid').slice(-1)[0]);
  check('raid record: gd = 7 right x 20 = 140', e && e.ok === 7 && e.gd === 140, JSON.stringify(e && { ok: e.ok, gd: e.gd }));
  const hit = await P.evaluate(() => JSON.parse(localStorage.__mockdb)['raid/ev-goat-1/hits/u_stu']);
  check('shared boss record has the spirit damage', hit && hit.gd === 140 && hit.ok === 7, JSON.stringify(hit));
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(600);
  const hp1 = await P.evaluate(() => { const m = document.body.innerText.match(/(\d+) \/ 300/); return m ? +m[1] : null });
  check('boss HP fell by 7 + 140 = 147', hp0 === 300 && hp1 === 153, hp0 + ' -> ' + hp1);
  // forged damage is caught
  const f1 = await Q.evaluate(() => window.__TLQ.verifyFake({ k: 'raid', rid: 'ev-goat-1', n: 1, ok: 1, gd: 500, dur: 9000, wc: [], ww: [], la: {}, r: { exp: 0, coin: 0, gems: 0 } }));
  check('forged spirit damage (too big) is caught', Array.isArray(f1) && f1.includes('gd'), JSON.stringify(f1));
  const f2 = await Q.evaluate(() => window.__TLQ.verifyFake({ k: 'raid', rid: 'ev-goat-1', n: 1, ok: 1, gd: 20, dur: 9000, wc: [], ww: [], la: {}, r: { exp: 0, coin: 0, gems: 0 } }));
  check('spirit damage without a top-up is caught', Array.isArray(f2) && f2.includes('gdvip'), JSON.stringify(f2));
  // teacher check
  await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(2500);
  await A.click('[data-act=admtab][data-id=gift]'); await wait(300); await A.click('[data-act=admtab][data-id=players]'); await wait(4000);
  const v = await A.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; return r && r.res ? { errs: r.res.errs, msgs: r.res.issues.map(x => x.msg).join(',') } : null });
  check('teacher verification clean for the VIP student', v && v.errs === 0, JSON.stringify(v));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
