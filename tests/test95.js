const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const OFF0 = Date.UTC(2026, 10, 25, 8, 0) - Date.now();
const clock = `(function(){var off=${OFF0};var D=Date;function N(){if(arguments.length===0)return new D(D.now()+off);return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))()}N.prototype=D.prototype;N.now=function(){return D.now()+off};N.UTC=D.UTC;N.parse=D.parse;window.Date=N})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  for (const vp of [{ width: 1366, height: 768, tag: 'pc' }, { width: 390, height: 844, tag: 'ph' }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(clock); await p.addInitScript('window.__noBX=1'); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=archer]'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  // 1) world boss
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(700);
  await P.click('.rd-ev [data-act=rdgo]'); await wait(600); await P.click('[data-act=rdjoin]'); await wait(900);
  let r = await P.evaluate(() => { const b = document.querySelector('.qwrap.bf'), c = b && b.querySelector('canvas.bf-bg'); return { bf: !!b, th: c && c.dataset.th, hud: !!document.querySelector('.bf-boss'), opts: document.querySelectorAll('.bf [data-act=rdans]').length, full: b && b.getBoundingClientRect().width === innerWidth } });
  check(vp.tag + ' world boss opens full-screen with scene, HP bar and answers', r.bf && r.th === 'sky' && r.hud && r.opts >= 2 && r.full, JSON.stringify(r));
  await P.evaluate(() => { const R = window.__TLQ.raid, e = R.enc(), q = e.qs[e.i]; R.ans(q.ans) }); await wait(250); await P.screenshot({ path: `bf-${vp.tag}-raid.png` });
  for (let i = 0; i < 10; i++) { await P.evaluate(() => { const R = window.__TLQ.raid, e = R.enc(); if (!e) return; if (e.picked === null) R.ans(e.qs[e.i].ans) }); await wait(120); await P.evaluate(() => window.__TLQ.raid.next && window.__TLQ.raid.next()); await wait(120) }
  await wait(1500);
  check(vp.tag + ' after the fight the full-screen layer is gone', await P.evaluate(() => !document.querySelector('.qwrap.bf')));
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(400);
  // 2) zone boss
  await P.evaluate(() => document.querySelector('nav [data-id=map]').click()); await wait(600);
  await P.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'boss'; b.dataset.id = '0'; document.getElementById('app').appendChild(b); b.click() }); await wait(500);
  await P.click('[data-act=beginfight]').catch(() => {}); await wait(700);
  r = await P.evaluate(() => { const b = document.querySelector('.qwrap.bf'); return { bf: !!b, th: b && b.querySelector('canvas').dataset.th, emo: !!document.querySelector('.bf-emo') } });
  check(vp.tag + ' zone boss full-screen', r.bf && !!r.th && r.emo, JSON.stringify(r));
  await P.screenshot({ path: `bf-${vp.tag}-zone.png` });
  await P.evaluate(() => { const b = document.querySelector('.bf [data-act=go][data-id=map]'); b && b.click() }); await wait(500);
  // 3) gate boss (spirit gate floor 10)
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(400);
  await P.click('[data-act=tngate][data-id=n]'); await wait(300);
  await P.evaluate(() => { const S = window.__TLQ.S(); S.tng.n = Object.assign(S.tng.n || {}, { max: 9 }) });
  await P.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'tnfloor'; b.dataset.id = '10'; document.getElementById('app').appendChild(b); b.click() }); await wait(700);
  await P.evaluate(() => { window.__TLQ.TN().ents.forEach(e => e.alive = false); window.__TLQ.render() }); await wait(300);
  await P.evaluate(() => document.getElementById('tn_boss').click()); await wait(300); await P.evaluate(() => { const y = document.querySelector('[data-act=tnyes]'); y && y.click() }); await wait(400); await P.click('[data-act=tnboss]'); await wait(800);
  r = await P.evaluate(() => { const b = document.querySelector('.qwrap.bf'); return { bf: !!b, th: b && b.querySelector('canvas').dataset.th, name: (document.querySelector('.bf-hpt b') || {}).textContent } });
  check(vp.tag + ' gate boss full-screen with its land (abyss for the Rift Dragon King)', r.bf && r.th === 'abyss' && /ร่างตื่น/.test(r.name || ''), JSON.stringify(r));
  await P.click('.bf [data-act=skuse], .bf [data-act=sktnuse]').catch(() => {}); await wait(700);
  await P.screenshot({ path: `bf-${vp.tag}-gate.png` });
  } catch (e) { check(vp.tag + ' exception ' + e.message, false) }
  await ctx.close() }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
