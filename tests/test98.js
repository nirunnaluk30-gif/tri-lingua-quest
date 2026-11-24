// parties: two students fight one boss together (lobby, shared boss HP, revive, both ledgers pass)
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
  async function make(uid, name, cls) { const p = await open('student', uid); await wait(800); await p.click('[data-act=newgame]'); await p.fill('#hname', name); await p.click(`[data-act=dcls][data-id=${cls}]`); await p.click('[data-act=confirmcreate]'); await wait(2500); return p }
  async function give(A, uid) { await A.click(`[data-act=admpgive][data-id=${uid}]`); await wait(400); await A.fill('#give_lvl', '61'); await A.click('[data-act=admpgiveyes]'); await wait(3000) }
  async function tver(P, A, uid) { await P.evaluate(() => window.__TLQ.forcePush && window.__TLQ.forcePush()); await wait(2500); await A.click('[data-act=admtab][data-id=gift]'); await wait(300); await A.click('[data-act=admtab][data-id=players]'); await wait(4500);
    return A.evaluate(u => { const r = window.__TLQ.CL.ver[u]; if (!r || !r.res) return null; const e = r.res.issues.filter(x => x.lv === 'err'); return { errs: e.length, msgs: e.map(x => x.k + ':' + x.msg).join(',') } }, uid) }
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const P = await make('u_p', 'Ploy', 'archer'), Q = await make('u_q', 'Beam', 'sword');
  await A.click('[data-act=admtab][data-id=players]'); await wait(2500); await give(A, 'u_p'); await give(A, 'u_q');
  await P.reload(); await Q.reload(); await wait(4500);
  for (const X of [P, Q]) for (const c of ['1A', '2A', '3A', '4A', '5A']) { await X.evaluate(c => window.__BX.pick(c), c); await wait(200) }
  const zi = await P.evaluate(() => window.__TLQ.S && 18);
  // lobby
  await P.evaluate(z => window.__BX.zone(z), zi); await wait(700); await P.click('#bx [data-bx=make]'); await wait(1200);
  const code = await P.evaluate(() => document.querySelector('#bx .pt-code').textContent);
  await Q.evaluate(z => window.__BX.zone(z), zi); await wait(700); await Q.click('#bx [data-bx=find]'); await wait(1500);
  await Q.fill('#pt_code', code.slice(0, 2)); await wait(500);
  const rooms = await Q.evaluate(() => [...document.querySelectorAll('#bx .pt-room')].map(r => r.innerText.replace(/\s+/g, ' ')));
  check('the friend sees the open room for the same boss (filtered by code)', rooms.length === 1 && rooms[0].includes(code), JSON.stringify(rooms));
  await Q.screenshot({ path: 'pt-find.png' });
  await Q.click('#bx [data-bx=join]'); await wait(2000);
  const lead = await P.evaluate(() => ({ slots: document.querySelectorAll('#bx .pt-slot.on').length, start: !document.querySelector('#bx [data-bx=pstart]').disabled }));
  check('leader sees the friend join and can start (2/5)', lead.slots === 2 && lead.start, JSON.stringify(lead));
  await P.screenshot({ path: 'pt-lobby.png' });
  await P.click('#bx [data-bx=pstart]'); await wait(3000);
  const st = await Promise.all([P, Q].map(X => X.evaluate(() => { const b = window.__BX.st(); return b && { party: b.party, m: b.m, max: b.max, seed: b.seed, mates: document.querySelectorAll('#bx .bx-mate').length } })));
  check('both fight together: same seed, 2 members, boss HP ×1.6, the friend is on screen', st[0] && st[1] && st[0].party && st[1].party && st[0].seed === st[1].seed && st[0].m === 2 && st[0].max === Math.round(60 * 58 * 1.6) && st[0].mates === 1 && st[1].mates === 1, JSON.stringify(st));
  await P.evaluate(() => { const b = window.__BX.st(); b.cd.ara5 = 30; b.cd.ar3 = 30; b.cd.ara3 = 30; window.__BX.bot(true) }); await Q.evaluate(() => window.__BX.bot(true)); await wait(2500); await P.screenshot({ path: 'pt-fight0.png' }); await wait(1500);
  const sh = await P.evaluate(() => { const b = window.__BX.st(); return { oth: b.oth, dmg: b.dmg, rows: document.querySelectorAll('#bx .pt-row').length } });
  check('shared boss HP: the leader sees the friend\'s damage', sh.oth > 0 && sh.rows === 2, JSON.stringify(sh));
  await P.screenshot({ path: 'pt-fight.png' });
  // revive: the friend is knocked down, the leader revives them
  await Q.evaluate(() => { const b = window.__BX.st(); b.php = 0; b.down = 30; document.getElementById('bx_hero').classList.add('down'); window.__BX.fw() }); await wait(2500);
  const rvb = await P.$('#bx [data-bx=rv]'); check('a revive button appears for the knocked-down friend', !!rvb);
  if (rvb) { await P.evaluate(() => { const b = document.querySelector('#bx [data-bx=rv]'); b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })) }); await wait(2500) }
  console.log('DBG', await P.evaluate(() => JSON.stringify({ rv: window.__BX.st().rv, rvcd: window.__BX.st().rvcd, down: window.__BX.st().down })), await Q.evaluate(() => JSON.stringify({ fd: window.__BX.pt() && window.__BX.pt().fd['u_p'] && window.__BX.pt().fd['u_p'].rv, seen: window.__BX.st().rvSeen })));
  const up = await Q.evaluate(() => { const b = window.__BX.st(); return b && { down: b.down, php: b.php } });
  check('the friend gets up after the revive', up && up.down === 0 && up.php === 50, JSON.stringify(up));
  const t0 = Date.now(); while (Date.now() - t0 < 95000) { const d = await Promise.all([P, Q].map(X => X.$('#bx [data-bx=end]'))); if (d[0] && d[1]) break; await wait(700) }
  await P.evaluate(() => window.__BX.bot(false)); await Q.evaluate(() => window.__BX.bot(false));
  await P.screenshot({ path: 'pt-end.png' });
  const ends = await Promise.all([P, Q].map(X => X.evaluate(() => document.getElementById('bx_panel').innerText.replace(/\s+/g, ' ').slice(0, 160))));
  check('both see the win and the damage table', ends.every(t => /ชนะ/.test(t) && /MVP/.test(t)), JSON.stringify(ends));
  for (const X of [P, Q]) { await X.click('#bx [data-bx=end]'); await wait(600) }
  const evs = await Promise.all([P, Q].map(X => X.evaluate(() => { const e = window.__BX.last('boss'); return e && { win: e.win, m: e.bf.pt && e.bf.pt.m.length, r: e.bf.pt && e.bf.pt.r, dmg: e.bf.dmg, hp: e.bf.hp } })));
  check('each player saved their own party win', evs.every(e => e && e.win && e.m === 2 && e.r === evs[0].r) && evs[0].dmg + evs[1].dmg >= evs[0].hp * 0.95, JSON.stringify(evs));
  const v1 = await tver(P, A, 'u_p'), v2 = await tver(Q, A, 'u_q');
  check('teacher check passes for both players', v1 && v1.errs === 0 && v2 && v2.errs === 0, JSON.stringify([v1, v2]));
  const solo = await P.evaluate(() => { const e = window.__BX.last('boss'); delete e.s; delete e.h; delete e.t; delete e.lu; delete e.bf.pt; return window.__TLQ.verifyFake(e) });
  check('claiming the party boss HP as a solo win is caught', solo.includes('bfdmg'), JSON.stringify(solo));
  const docs = await P.evaluate(() => { const d = JSON.parse(localStorage.__mockdb || '{}'); return Object.keys(d).filter(k => /^(party|pfight)\//.test(k)).map(k => k + ':' + (d[k].st || '') + (d[k].fin ? 'fin' : '')) });
  check('each player wrote only their own party docs', docs.every(k => /\/(u_p|u_q):/.test(k)) && docs.length === 4, JSON.stringify(docs));
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); console.log('ERRORS: ' + (errors.join(' | ') || 'none')); await browser.close();
})();
