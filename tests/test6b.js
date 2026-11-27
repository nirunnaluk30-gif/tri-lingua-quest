const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = [];
  const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(role + uid + ': ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_TUNNEL|ERR_CONNECTION|net::/.test(m.text())) errors.push(uid + ' console: ' + m.text()); });
    await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  try {
  const A0 = await open('admin', 'u_admin');
  await A0.evaluate(() => localStorage.clear()); await A0.reload(); await wait(400);
  await A0.click('[data-act=go][data-id=admin]'); await A0.click('[data-act=admseed][data-id=all]'); await wait(35000);
  const mk = async (uid, name) => { const P = await open('student', uid); await wait(600);
    await wait(3000); 0&&console.log('DBG', uid, await P.evaluate(() => { const C = window.__TLQ.CL; return JSON.stringify({ ready: C.ready, cr: C.contentReady, pf: C.pfirst, uid: C.uid, got: Object.keys(C.got).length, scr: window.__TLQ.UI().scr, cr8: window.__TLQ.S().created }) }), (await P.innerText('#app')).slice(0, 200));
    await P.click('[data-act=newgame]'); await P.fill('#hname', name); await P.click('[data-act=confirmcreate]'); await wait(2500); return P; };
  const A = await mk('u_aaa', 'Ann');
  const B = await mk('u_bbb', 'Ben');
  const S = (P) => P.evaluate(() => JSON.parse(JSON.stringify(window.__TLQ.S())));
  check('separate owners', (await S(A)).owner === 'u_aaa' && (await S(B)).owner === 'u_bbb');
  // teacher gives Ann two pets and Ben coins
  const give = async (uid, item, n, coin) => { await A0.click('[data-act=admtab][data-id=players]'); await wait(1200); await A0.click(`[data-act=admpgive][data-id=${uid}]`);
    if (item) { await A0.fill('#gi_q', item); await wait(100); await A0.fill('#gi_n', String(n)); await A0.click('[data-act=admgiadd]'); }
    if (coin) await A0.fill('#give_coin', String(coin)); await A0.click('[data-act=admpgiveyes]'); await wait(1500); };
  await give('u_aaa', 'pt10', 3, 0); await give('u_bbb', null, 0, 2000);
  let a = await S(A), b = await S(B);
  for (let i = 0; i < 20 && !(a.owned.pt10 === 3 && b.coin >= 2000); i++) { await wait(500); a = await S(A); b = await S(B); }
  if (!(b.coin >= 2000)) { const d = await B.evaluate(() => JSON.parse(localStorage.__mockdb || '{}')['adjust/u_bbb']); console.log('DBG adjust', JSON.stringify(d)); console.log('DBG seen', JSON.stringify(b.adjSeen), 'arev', b.arev, 'startT', b.startT, 'created', b.created); console.log('DBG modal', await A0.evaluate(() => JSON.stringify(window.__TLQ.UI().modal))); }
  check('gifts arrived', a.owned.pt10 === 3 && b.coin >= 2000, a.owned.pt10 + ' / ' + b.coin);
  // Ann: manage mode -> sell 1 pt10
  await A.evaluate(() => document.querySelector('nav [data-id=wd]').click()); await A.click('[data-act=wdmanage]');
  await A.evaluate(() => { const b = document.querySelector('.wd-groups [data-id=pet]'); b && b.click() }); await A.click('[data-act=itemmenu][data-id=pt10]'); await A.screenshot({ path: 'm1-menu.png' });
  const coin0 = a.coin; await A.click('[data-act=imsell]'); a = await S(A);
  check('sell gives coins and removes item', a.owned.pt10 === 2 && a.coin === coin0 + 600, a.owned.pt10 + ' ' + (a.coin - coin0));
  // Ann: drop starter -> blocked
  const starter = Object.keys(a.owned).find(k => /^sof|^som/.test(k));
  await A.evaluate(() => { const b = document.querySelector('.wd-groups [data-id=wear]'); b && b.click() }); await A.click(`[data-act=itemmenu][data-id=${starter}]`); await A.click('[data-act=imtab][data-id=drop]');
  check('starter outfit cannot be dropped', await A.$eval('[data-act=imdrop]', e => e.disabled)); await A.click('[data-act=closemodal]');
  // Ann: list 1 pt10 for 120 coins to everyone
  await A.evaluate(() => { const b = document.querySelector('.wd-groups [data-id=pet]'); b && b.click() }); await A.click('[data-act=itemmenu][data-id=pt10]'); await A.click('[data-act=imtab][data-id=trade]'); await A.fill('#im_coin', '50'); await A.click('[data-act=imtrade]'); await wait(600); check('price below the rarity range is refused', Object.keys((await S(A)).trades).length === 0); await A.evaluate(() => { const b = document.querySelector('.wd-groups [data-id=pet]'); b && b.click() }); await A.click('[data-act=itemmenu][data-id=pt10]').catch(() => {}); await A.click('[data-act=imtab][data-id=trade]').catch(() => {}); await A.fill('#im_coin', '1500'); await A.screenshot({ path: 'm2-trade.png' }); await A.click('[data-act=imtrade]'); await wait(1500);
  a = await S(A); const tid = Object.keys(a.trades)[0];
  check('offer escrows the item', a.owned.pt10 === 1 && a.trades[tid].st === 'open', JSON.stringify(a.trades));
  // Ben sees it in the market and accepts
  await B.evaluate(() => { window.__TLQ.UI().scr = 'market'; }); await B.evaluate(() => document.querySelector('nav [data-id=wd]').click()); await B.click('[data-act=go][data-id=market]'); await wait(800);
  await B.screenshot({ path: 'm3-market.png' });
  const bc0 = (await S(B)).coin;
  await B.click(`[data-act=mkaccept][data-id="u_aaa|${tid}"]`); await wait(3500);
  a = await S(A); b = await S(B);
  check('trade completes both sides', a.trades[tid].st === 'done' && a.trades[tid].by === 'u_bbb' && b.owned.pt10 === 1 && b.coin === bc0 - 1500, JSON.stringify({ at: a.trades[tid], bpt: b.owned.pt10, bdc: bc0 - b.coin, fee: (a.log.filter(e => e.k === 'tdone')[0] || {}).fee }));
  check('seller got the coins minus 5% fee (1500 - 75)', a.coin === coin0 + 600 + 1425, String(a.coin - coin0));
  // cancel flow
  await A.evaluate(() => document.querySelector('nav [data-id=wd]').click()); await A.evaluate(() => { const b = document.querySelector('.wd-groups [data-id=pet]'); b && b.click() }); await A.click('[data-act=itemmenu][data-id=pt10]'); await A.click('[data-act=imtab][data-id=trade]'); await A.click('[data-act=imwk][data-id=item]'); await A.fill('#im_q', 'pt11'); await wait(100); await A.click('[data-act=imtrade]'); await wait(800);
  a = await S(A); const tid2 = Object.keys(a.trades).find(k => k !== tid);
  check('item-for-item offer posted', a.trades[tid2] && a.trades[tid2].want.item === 'pt11' && !a.owned.pt10, JSON.stringify(a.trades[tid2]));
  await A.click(`[data-act=mkcancel][data-id=${tid2}]`); await wait(500); a = await S(A);
  check('cancel returns the item', a.owned.pt10 === 1 && a.trades[tid2].st === 'cancel');
  await wait(2500);
  // teacher verification stays clean
  const verdict = async (uid) => { await A0.click('[data-act=admtab][data-id=players]'); await wait(1500);
    return A0.evaluate((u) => { const v = window.__TLQ.CL.ver[u]; return v && v.res ? { errs: v.res.errs, warns: v.res.warns, msgs: v.res.issues.map(x => x.msg + (x.extra ? '(' + x.extra + ')' : '')).join(',') } : null }, uid) };
  let va = await verdict('u_aaa'), vb = await verdict('u_bbb');
  check('seller ledger verifies clean', va && va.errs === 0, JSON.stringify(va));
  check('buyer ledger verifies clean', vb && vb.errs === 0, JSON.stringify(vb));
  // forged: Ben fakes receiving an item from Ann without a trade
  await B.evaluate(() => { const T = window.__TLQ; const S = T.S(); const e = { k: 'tpay', tid: 'tfake', from: 'u_aaa', pay: { coin: 1 } }; });
  await B.evaluate(() => { const S = window.__TLQ.S(); const T = window.__TLQ; // write raw events that skip Ann's side
    const push = (e) => { e.t = Date.now(); e.d = '2026-01-01'; e.s = S.n + 1; e.h = T.evHash(S.lh, e); T.applyEvent(S, e); S.log.push(e); S.n = e.s; S.lh = e.h; };
    push({ k: 'tpay', tid: 'tfake', from: 'u_aaa', pay: { coin: 1 } }); push({ k: 'tget', tid: 'tfake', from: 'u_aaa', item: 'pt15', n: 1 }); S.upd = Date.now(); });
  await B.evaluate(() => { const S = window.__TLQ.S(); S.coin += 0; }); await B.evaluate(() => document.querySelector('nav [data-id=home]').click());
  await B.evaluate(() => { window.__TLQ.S().upd = Date.now(); }); await B.evaluate(() => { localStorage.setItem('x', '1'); });
  await B.evaluate(() => { const ev = new Event('x'); }); await wait(300);
  await B.evaluate(() => window.__TLQ.CL && 0); await B.evaluate(() => { document.querySelector('[data-act=go]') && 0 });
  // force a push
  await B.evaluate(() => { window.__TLQ.forcePush && window.__TLQ.forcePush(); });
  await wait(3000);
  vb = await verdict('u_bbb');
  check('forged trade receipt is caught', vb && vb.errs > 0 && /tcross/.test(vb.msgs), JSON.stringify(vb));
  await A.evaluate(() => { const S = window.__TLQ.S(); for (let i = 0; i < 6; i++) S.trades['tfk' + i] = { item: 'pt10', n: 1, want: { coin: 1500 }, to: '', st: 'open', by: '', t: Date.now() } });
  await A.evaluate(() => document.querySelector('nav [data-id=wd]').click()); await A.evaluate(() => { const b = document.querySelector('.wd-groups [data-id=pet]'); b && b.click() }); await A.click('[data-act=itemmenu][data-id=pt10]'); await A.click('[data-act=imtab][data-id=trade]'); await A.fill('#im_coin', '1500'); await A.click('[data-act=imtrade]'); await wait(600);
  check('7th item on the stall is refused', Object.keys((await S(A)).trades).length === 8 && (await S(A)).owned.pt10 === 1, Object.keys((await S(A)).trades).length + ' trades, pt10=' + (await S(A)).owned.pt10);
  await A.evaluate(() => { const S = window.__TLQ.S(); for (let i = 0; i < 6; i++) delete S.trades['tfk' + i] });
  await A0.click('[data-act=admtab][data-id=town]'); await wait(2500); await A0.click('[data-act=admtab][data-id=overview]'); await wait(200); await A0.click('[data-act=admtab][data-id=town]'); await wait(1500);
  const lg = await A0.innerText('#app'); check('teacher sees market sales history (Ann → Ben, 1500)', /ประวัติการซื้อขายในตลาด/.test(lg) && /Ann/.test(lg) && /Ben/.test(lg) && /1500/.test(lg), (lg.match(/ประวัติการซื้อขาย[\s\S]{0,200}/) || [''])[0].replace(/\n/g, ' | '));
  await A0.screenshot({ path: 'm4-admin.png' });
  } catch (e) { results.push('CRASH ' + e.message.split('\n')[0]); }
  console.log(results.join('\n')); console.log('ERRORS:', errors.join('\n') || 'none'); await browser.close();
})();
