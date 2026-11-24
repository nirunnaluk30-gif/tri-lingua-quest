const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const clock = at => `(function(){var off=${at}-Date.now();var D=Date;function N(){if(arguments.length===0)return new D(D.now()+off);return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))()}N.prototype=D.prototype;N.now=function(){return D.now()+off};N.UTC=D.UTC;N.parse=D.parse;window.Date=N})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const AT = Date.UTC(2026, 10, 23, 8, 0); // 15:00 Bangkok, world boss open
  async function open(role, uid, at) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); if (at) await p.addInitScript(clock(at)); await p.addInitScript('window.__noBX=1'); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  try {
  const A = await open('admin', 'u_admin', AT); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const P = await open('student', 'u_stu', AT); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=mage]'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  // give tickets + coins
  await A.click('[data-act=admtab][data-id=players]'); await wait(2500); await A.click('[data-act=admpgive][data-id=u_stu]'); await wait(400); await A.fill('#give_tickets', '30'); await A.fill('#give_coin', '500'); await A.click('[data-act=admpgiveyes]'); await wait(2500);
  // 1) season box gone, pet box = boss pets only
  await P.evaluate(() => document.querySelector('nav [data-id=gacha]').click()); await wait(600);
  const bns = await P.$$eval('[data-act=banner]', a => a.map(b => b.dataset.id));
  check('season weapons box (bxS) is gone', !bns.includes('bxS'), bns.join(','));
  const pool = await P.evaluate(() => { const T = window.__TLQ; return null });
  await P.click('[data-act=banner][data-id=bx2]'); await wait(400);
  await P.screenshot({ path: 'n-petbox.png' });
  const pb = await P.$$eval('[data-act=pull]', a => a.map(b => b.dataset.id)); await P.click(`[data-act=pull][data-id="${pb[pb.length - 1]}"]`); await wait(3000);
  const got = await P.evaluate(() => { const e = window.__TLQ.S().log.filter(x => x.k === 'pull').slice(-1)[0]; const I = window.__TLQ.ITEM(); return e ? e.items.map(id => id + ':' + (I[id] && I[id].rar)) : null });
  check('pet box gives only boss pets (pb..)', got && got.length === 10 && got.every(x => /^pb\d\d:/.test(x)) && !got.some(x => /:common|:uncommon|:rare/.test(x)), JSON.stringify(got));
  await P.screenshot({ path: 'n-pull.png' });
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(500);
  // equip first boss pet and check the avatar draws the sprite
  const pid = got[0].split(':')[0];
  await P.evaluate(id => { const S = window.__TLQ.S(); S.eq.pet = id }, pid);
  const avs = await P.evaluate(() => window.__TLQ.avatar(window.__TLQ.S(), {}).includes('assets/mon/boss_'));
  check('avatar draws the boss pet sprite', avs);
  // 2) monster gates
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(500);
  const gates = await P.$$eval('[data-act=tngate]', a => a.map(b => b.dataset.id));
  check('two new gates m and n listed', gates.includes('m') && gates.includes('n'), gates.join(','));
  await P.click('[data-act=tngate][data-id=m]'); await wait(500); await P.screenshot({ path: 'n-gate.png' });
  await P.click('[data-act=tnfloor][data-id="1"]'); await wait(800);
  const imgs = await P.$$eval('#tn_map img.mon-img', a => a.map(i => i.getAttribute('src')));
  check('gate map shows sprite monsters', imgs.length >= 5 && imgs.every(s => /assets\/mon\/mob_(meadow|vale|woods)/.test(s)), imgs.slice(0, 3).join(','));
  await P.screenshot({ path: 'n-map.png' });
  await P.evaluate(() => document.getElementById('tn_m0').click()); await wait(200); await P.evaluate(() => { const y = document.querySelector('[data-act=tnyes]'); y && y.click() }); await wait(400);
  await P.screenshot({ path: 'n-fight.png' });
  for (let k = 0; k < 6; k++) { const st = await P.evaluate(() => { const e = window.__TLQ.TN().enc; return e ? e.qs[e.i].ans : null }); if (st === null) break; await wait(900); await P.evaluate(p => document.querySelector(`[data-act=tnans][data-id="${p}"]`).click(), st); await wait(100); await P.evaluate(() => document.querySelector('[data-act=tnnext]').click()); await wait(100) }
  await wait(800);
  const tm = await P.evaluate(() => window.__TLQ.S().log.filter(x => x.k === 'tnmon').slice(-1)[0]);
  check('monster gate win gives EXP x3 (ok*tnExp*3)', tm && tm.g === 'm' && tm.win && tm.r.exp === tm.ok * 2 * 3, JSON.stringify(tm && { g: tm.g, ok: tm.ok, r: tm.r }));
  await P.evaluate(() => { const c = document.querySelector('[data-act=tncont]'); c && c.click() }); await wait(300);
  // 3) zone EXP x5
  await P.evaluate(() => { document.querySelector('nav [data-id=map]').click() }); await wait(400);
  await P.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'lesson'; b.dataset.id = 'volen'; b.dataset.z = '17'; document.getElementById('app').appendChild(b); b.click() }); await wait(500);
  const started = await P.evaluate(() => !!(window.__TLQ.UI().sess)); if (started) { await P.evaluate(() => { const b = document.querySelector('[data-act=beginquiz]'); b && b.click() }); await wait(300);
    const n = await P.evaluate(() => window.__TLQ.UI().sess.qs.length); for (let i = 0; i < n; i++) { await wait(850); await P.evaluate(() => window.__TLQ.solveQ(true)); await P.click('#nextbtn') } await wait(1500) }
  const le = await P.evaluate(() => window.__TLQ.S().log.filter(x => x.k === 'lesson').slice(-1)[0]);
  const cfg = await P.evaluate(() => ({ e: window.__TLQ.CFG ? window.__TLQ.CFG().expPerCorrect : null }));
  check('Eternal Volcano lesson gives EXP x5', le && le.u === 'volen' && le.r.exp % 5 === 0 && le.r.exp >= le.ok * 5, JSON.stringify(le && { u: le.u, ok: le.ok, st: le.st, r: le.r }));
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() });
  // 4) world boss
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(800);
  const cards = await P.$$eval('.rd-card', a => a.map(c => c.innerText.replace(/\n/g, ' ').slice(0, 60)));
  check('world goat card is first, above the Chaos City boss', cards.length === 2 && /แพะแห่งโลกา/.test(cards[0]), JSON.stringify(cards));
  await P.screenshot({ path: 'n-home.png' });
  await P.click('.rd-ev [data-act=rdgo]'); await wait(800);
  check('raid page warns about the coin skill', /กลืนเหรียญ/.test(await P.innerText('#app')));
  await P.screenshot({ path: 'n-goat.png' });
  const c0 = await P.evaluate(() => window.__TLQ.S().coin);
  await P.click('[data-act=rdjoin]'); await wait(500);
  for (let i = 0; i < 10; i++) { await P.evaluate(w => { const R = window.__TLQ.raid, e = R.enc(), q = e.qs[e.i]; R.ans(w ? (q.ans === 0 ? 1 : 0) : q.ans) }, i < 3); await wait(150); if (i === 0) await P.screenshot({ path: 'n-goatfight.png' }); await P.evaluate(() => window.__TLQ.raid.next()); await wait(150) }
  await wait(1500);
  const re = await P.evaluate(() => { const S = window.__TLQ.S(); return { coin: S.coin, e: S.log.filter(x => x.k === 'raid').slice(-1)[0] } });
  check('3 wrong answers cost 30 coins (pen recorded)', re.e && re.e.pen === 30 && re.coin === c0 - 30, JSON.stringify({ c0, c1: re.coin, pen: re.e && re.e.pen, ok: re.e && re.e.ok }));
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() });
  await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(2500);
  await A.click('[data-act=admtab][data-id=gift]'); await wait(300); await A.click('[data-act=admtab][data-id=players]'); await wait(3500);
  const v = await A.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; return r && r.res ? { errs: r.res.errs, msgs: r.res.issues.map(x => x.msg).join(',') } : null });
  check('teacher verification clean (pets, gate x3, zone x5, boss coin skill)', v && v.errs === 0, JSON.stringify(v));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
