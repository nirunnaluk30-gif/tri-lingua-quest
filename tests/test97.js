// skill-only boss fights: zone boss, adventure-gate boss, world raid; ledger checks and tampering
const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
const OFF0 = Date.UTC(2026, 10, 25, 8, 0) - Date.now();
const clock = `(function(){var off=${OFF0};var D=Date;function N(){if(arguments.length===0)return new D(D.now()+off);return new (Function.prototype.bind.apply(D,[null].concat([].slice.call(arguments))))()}N.prototype=D.prototype;N.now=function(){return D.now()+off};N.UTC=D.UTC;N.parse=D.parse;window.Date=N})();`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); p.on('dialog', d => d.accept()); await p.addInitScript(clock); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  async function fight(P, tag, maxMs) {
    await P.click('#bx [data-bx=solo]'); await wait(2400);
    await P.evaluate(() => window.__BX.bot(true)); await wait(3500); if (tag) await P.screenshot({ path: `bx-${tag}-fight.png` });
    const t0 = Date.now(); while (Date.now() - t0 < (maxMs || 95000)) { if (await P.$('#bx [data-bx=end]')) break; await wait(500) }
    await P.evaluate(() => window.__BX.bot(false)); await wait(300); if (tag) await P.screenshot({ path: `bx-${tag}-end.png` });
    const txt = await P.evaluate(() => { const p = document.getElementById('bx_panel'); return p ? p.innerText : '' });
    await P.click('#bx [data-bx=end]'); await wait(800); return txt;
  }
  async function tver(P, A) { await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(2500); await A.click('[data-act=admtab][data-id=gift]'); await wait(300); await A.click('[data-act=admtab][data-id=players]'); await wait(4500);
    return A.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; if (!r || !r.res) return null; const e = r.res.issues.filter(x => x.lv === 'err' && x.msg !== 'tnorder'); return { errs: e.length, msgs: e.map(x => x.k + ':' + x.msg).join(','), skippedTestFloor: r.res.issues.filter(x => x.msg === 'tnorder').length } }) }
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=archer]'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  await A.click('[data-act=admtab][data-id=players]'); await wait(2500); await A.click('[data-act=admpgive][data-id=u_stu]'); await wait(400); await A.fill('#give_coin', '50000'); await A.fill('#give_lvl', '61'); await A.click('[data-act=admpgiveyes]'); await wait(3000);
  await P.reload(); await wait(4000);
  const lv = await P.evaluate(() => window.__TLQ.S().lvl); check('student reached Lv.61 from the teacher gift', lv >= 61, 'lvl ' + lv);
  for (const c of ['1A', '2A', '3A', '4A', '5A']) { await P.evaluate(c => window.__BX.pick(c), c); await wait(250) }
  // zone boss: pre-fight panel, skill ring, no questions
  await P.evaluate(() => window.__BX.zone(0)); await wait(800);
  const pre = await P.evaluate(() => ({ panel: !!document.querySelector('#bx .bx-panel [data-bx=solo]'), make: !!document.querySelector('#bx [data-bx=make]'), sk: document.querySelectorAll('#bx .bx-sk[data-bx=cast]').length, lock: document.querySelectorAll('#bx .bx-sk.lock').length, q: !!document.querySelector('#bx .opts, #bx [data-act=ans]') }));
  check('zone boss opens the skill arena: start panel, party buttons, 7 skill buttons (attack + 6), no question', pre.panel && pre.make && pre.sk === 7 && pre.lock === 0 && !pre.q, JSON.stringify(pre));
  await P.screenshot({ path: 'bx-pc-pre.png' });
  const zt = await fight(P, 'pc-zone', 95000);
  check('zone boss is defeated with skills', /ชนะ|Victory/.test(zt), zt.slice(0, 80).replace(/\n/g, ' '));
  const zr = await P.evaluate(() => ({ scr: document.querySelector('#app').innerText.slice(0, 200), win: window.__TLQ.S().boss[Object.keys(window.__TLQ.S().boss)[0]], ev: window.__BX.last('boss') }));
  check('result screen + boss win saved', zr.win && zr.win.wins === 1 && zr.ev.win === true && zr.ev.bf && zr.ev.bf.u.length > 5, JSON.stringify({ w: zr.win, n: zr.ev.n, ok: zr.ev.ok, sec: zr.ev.bf.sec, dmg: zr.ev.bf.dmg, hp: zr.ev.bf.hp, u: zr.ev.bf.u.length, pc: zr.ev.bf.pc }));
  let v = await tver(P, A); check('teacher check: the fight passes', v && v.errs === 0, JSON.stringify(v));
  // tampering
  const tam = await P.evaluate(() => {
    const e0 = window.__BX.last('boss'), out = {};
    function fake(f) { const e = JSON.parse(JSON.stringify(e0)); delete e.s; delete e.h; delete e.t; delete e.lu; f(e); return window.__TLQ.verifyFake(e) }
    out.dmg = fake(e => { e.bf.dmg = e.bf.dmg * 50 });
    out.cd = fake(e => { e.bf.u = e.bf.u.concat([[e.bf.sec, 'ara5'], [e.bf.sec, 'ara5']]) });
    out.lock = fake(e => { e.bf.u.push([e.bf.sec, 'arb5']) });
    out.time = fake(e => { e.bf.sec = 300 });
    out.hp = fake(e => { e.bf.hp = 10; e.bf.dmg = 10 });
    out.pc = fake(e => { e.bf.pc = 99 });
    return out });
  check('tampered damage is caught (bfdmg)', tam.dmg.includes('bfdmg'), JSON.stringify(tam.dmg));
  check('skill pressed before its cooldown is caught (bfcd)', tam.cd.includes('bfcd'), JSON.stringify(tam.cd));
  check('skill from the other branch is caught (skill)', tam.lock.includes('skill'), JSON.stringify(tam.lock));
  check('fight longer than 90 s is caught', tam.time.includes('shape'), JSON.stringify(tam.time));
  check('fake small boss HP is caught', tam.hp.includes('bfdmg'), JSON.stringify(tam.hp));
  check('fake PERFECT count is caught', tam.pc.includes('bfcd'), JSON.stringify(tam.pc));
  // monsters still ask questions: a lesson is unchanged
  // adventure gate boss (gate n floor 10, awakened Rift Dragon King)
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(400);
  await P.click('[data-act=tngate][data-id=n]'); await wait(400);
  await P.evaluate(() => { const S = window.__TLQ.S(); S.tng = S.tng || {}; S.tng.n = Object.assign(S.tng.n || {}, { max: 9 }) });
  await P.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'tnfloor'; b.dataset.id = '10'; document.getElementById('app').appendChild(b); b.click() }); await wait(900);
  const monQ = await P.evaluate(() => { const T = window.__TLQ.TN(); return T.ents && T.ents.length });
  await P.evaluate(() => { window.__TLQ.TN().ents.forEach(e => e.alive = false); window.__TLQ.render() }); await wait(300);
  await P.evaluate(() => document.getElementById('tn_boss').click()); await wait(300); await P.evaluate(() => { const y = document.querySelector('[data-act=tnyes]'); y && y.click() }); await wait(500);
  await P.click('[data-act=tnboss]'); await wait(900);
  const tnp = await P.evaluate(() => ({ open: !!document.getElementById('bx'), img: !!document.querySelector('#bx .bx-boss img.mon-img'), name: document.querySelector('#bx .bx-panel h2') && document.querySelector('#bx .bx-panel h2').textContent }));
  check('gate boss opens the skill arena with the awakened boss sprite', tnp.open && tnp.img, JSON.stringify(tnp) + ' monsters ' + monQ);
  const tt = await fight(P, 'pc-gate', 95000);
  const tev = await P.evaluate(() => { const e = window.__BX.last('tnboss'); return e && { n: e.n, ok: e.ok, win: e.win, bfw: e.bf.win, hp: e.bf.hp, dmg: e.bf.dmg, g: e.g, f: e.f } });
  const tres = await P.evaluate(() => window.__TLQ.TN().mode);
  check('gate boss fight saved (win needs the floor monsters beaten first, as before)', tev && tev.n === 0 && tev.g === 'n' && tev.f === 10 && tres === 'res', JSON.stringify(tev) + ' mode ' + tres + ' ' + tt.slice(0, 40).replace(/\n/g, ' '));
  v = await tver(P, A); check('teacher check passes after the gate boss', v && v.errs === 0, JSON.stringify(v));
  // world raid
  await P.evaluate(() => document.querySelector('nav [data-id=home]').click()); await wait(500);
  const hasEv = await P.$('.rd-ev [data-act=rdgo]');
  if (hasEv) { await P.click('.rd-ev [data-act=rdgo]'); await wait(600) } else { await P.evaluate(() => window.__TLQ.raid.use('wk')); await P.evaluate(() => { const b = document.createElement('button'); b.dataset.act = 'go'; b.dataset.id = 'raid'; document.getElementById('app').appendChild(b); b.click() }); await wait(600) }
  await P.click('[data-act=rdjoin]'); await wait(900);
  const rp = await P.evaluate(() => ({ open: !!document.getElementById('bx'), q: !!(window.__TLQ.raid.enc && window.__TLQ.raid.enc()) }));
  check('world raid opens the skill arena (no quiz)', rp.open && !rp.q, JSON.stringify(rp));
  const rt = await fight(P, 'pc-raid', 95000);
  const rev = await P.evaluate(() => { const e = window.__BX.last('raid'); return e && { pen: e.pen, n: e.n, ok: e.ok, sb: e.sb, gd: e.gd, cb: e.cb, st: e.st, dmg: e.bf.dmg, rid: e.rid } });
  const hit = await P.evaluate(r => { const d = JSON.parse(localStorage.__mockdb || '{}'); return d['raid/' + r + '/hits/u_stu'] }, rev && rev.rid);
  check('raid fight turns into boss damage units and is written to the raid board', rev && rev.pen === undefined && rev.n >= 1 && rev.ok >= 1 && rev.sb === rev.ok && hit && hit.ok === rev.ok, JSON.stringify(rev) + ' hit ' + JSON.stringify(hit) + ' · ' + rt.slice(0, 60).replace(/\n/g, ' '));
  v = await tver(P, A); check('teacher check passes after the raid', v && v.errs === 0, JSON.stringify(v));
  const rtam = await P.evaluate(() => { const e = window.__BX.last('raid'); delete e.s; delete e.h; delete e.t; delete e.lu; e.ok = e.n; e.sb = e.n; e.bf.dmg = 1; e.r = { exp: e.n * 2 }; return window.__TLQ.verifyFake(e) });
  check('raid: claiming more damage units than the fight earned is caught', rtam.includes('bfdmg') || rtam.includes('raidcap'), JSON.stringify(rtam));
  // phone layout
  const ph = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const PP = await ph.newPage(); PP.on('pageerror', e => errors.push('phone: ' + e.message)); await PP.addInitScript(clock); await PP.addInitScript(MOCK('student', 'u_stu')); await PP.goto(URL); await wait(5000);
  await PP.evaluate(() => window.__BX.zone(1)); await wait(800); await PP.screenshot({ path: 'bx-ph-pre.png' });
  await PP.tap('#bx [data-bx=solo]'); await wait(2400); await PP.evaluate(() => window.__BX.bot(true)); await wait(4000); await PP.screenshot({ path: 'bx-ph-fight.png' });
  const lay = await PP.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(); const a = r('#bx .bx-ring'), d = r('#bx .bx-dodge'), h = r('#bx .bx-hud'); return { ringIn: a.right <= innerWidth + 1 && a.bottom <= innerHeight + 1, dodgeIn: d.left >= 0 && d.bottom <= innerHeight + 1, overlap: !(d.right < a.left + 40 || d.left > a.right), hudIn: h.left >= 0 && h.right <= innerWidth } });
  check('phone: skill ring, dodge button and boss bar fit on screen', lay.ringIn && lay.dodgeIn && lay.hudIn, JSON.stringify(lay));
  await PP.evaluate(() => window.__BX.bot(false));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); console.log('ERRORS: ' + (errors.join(' | ') || 'none')); await browser.close();
})();
