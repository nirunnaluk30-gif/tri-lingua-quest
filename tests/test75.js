const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  const db = P => P.evaluate(() => JSON.parse(localStorage.getItem('__mockdb')));
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(35000);
  // simulate the live database before this update: old combined aura+wings box with commons, no wings box, commons in bx1/bx4
  await A.evaluate(() => { const T = window.__TLQ, I = {}; T.DEFAULTS.items.forEach(i => I[i.id] = i); const d = JSON.parse(localStorage.__mockdb);
    const old3 = T.DEFAULTS.items.filter(it => !it.noShop && (it.cat === 'aura' || it.cat === 'wings')).map(i => i.id);
    const old1 = T.DEFAULTS.items.filter(it => !it.noShop && it.rar === 'common' && ['outfit', 'top', 'bottom', 'shoes'].indexOf(it.cat) >= 0).map(i => i.id);
    Object.keys(d).forEach(k => { if (k === 'banners/bx3') { d[k].pool = old3; d[k].names = { th: 'ออร่าและปีก', en: 'Auras & Wings', zh: '光环与翅膀' } } if (k === 'banners/bx1') d[k].pool = d[k].pool.concat(old1) });
    delete d['banners/bxW']; localStorage.__mockdb = JSON.stringify(d) });
  await A.reload(); await wait(2500); await A.click('[data-act=go][data-id=admin]'); await wait(1500);
  check('admin sees new-content notice', !!(await A.$('[data-act=admaddnew]')), (await A.innerText('#app')).slice(0, 300).replace(/\n/g, ' | '));
  await A.click('[data-act=admaddnew]'); await wait(6000);
  let d = await db(A);
  const I = await A.evaluate(() => { const o = {}; window.__TLQ.DEFAULTS.items.forEach(i => o[i.id] = { c: i.cat, r: i.rar }); return o });
  const p3 = d['banners/bx3'].pool, pW = d['banners/bxW'] && d['banners/bxW'].pool, p1 = d['banners/bx1'].pool, p4 = d['banners/bx4'].pool;
  check('aura box has only auras, no commons', p3.length > 0 && p3.every(id => I[id].c === 'aura' && I[id].r !== 'common'), p3.join(','));
  check('aura box renamed', d['banners/bx3'].names.th === 'ออร่า');
  check('new wings box with only wings, no commons', pW && pW.length > 20 && pW.every(id => I[id].c === 'wings' && I[id].r !== 'common'), pW && pW.length);
  check('fashion box bx1 has no commons', p1.every(id => I[id].r !== 'common'), p1.filter(id => I[id].r === 'common').join(','));
  check('head box bx4 has no commons', p4.every(id => I[id].r !== 'common'));
  // student pulls on the wings box, teacher verifies
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=confirmcreate]'); await wait(2000);
  await A.click('[data-act=admtab][data-id=players]'); await wait(2000); await A.click('[data-act=admpgive][data-id=u_stu]'); await wait(400); await A.fill('#give_tickets', '20'); await A.click('[data-act=admpgiveyes]'); await wait(2500);
  await P.evaluate(() => document.querySelector('nav [data-id=gacha]') && document.querySelector('nav [data-id=gacha]').click()); await wait(600);
  const tabs = await P.$$eval('[data-act=banner]', a => a.map(b => b.dataset.id + ':' + b.innerText.replace(/\s+/g, ' ').slice(0, 30)));
  check('summon page lists separate aura and wings boxes', tabs.some(x => /^bx3:.*ออร่า/.test(x)) && tabs.some(x => /^bxW:.*ปีก/.test(x)), tabs.join(' | '));
  await P.click('[data-act=banner][data-id=bxW]'); await wait(400);
  await P.screenshot({ path: 'g-wings.png' });
  const pb = await P.$$eval('[data-act=pull]', a => a.map(b => b.dataset.id)); await P.click(`[data-act=pull][data-id="${pb[pb.length - 1]}"]`); await wait(2500);
  const got = await P.evaluate(() => { const e = window.__TLQ.S().log.filter(x => x.k === 'pull').slice(-1)[0]; return e ? { b: e.b, items: e.items } : null });
  check('10-pull on wings box gives only wings', got && got.b === 'bxW' && got.items.length === 10 && got.items.every(id => I[id].c === 'wings' && I[id].r !== 'common'), JSON.stringify(got));
  await P.evaluate(() => { const m = document.querySelector('.modal [data-act=closemodal]'); m && m.click() }); await wait(2500);
  await A.click('[data-act=admtab][data-id=gift]'); await wait(300); await A.click('[data-act=admtab][data-id=players]'); await wait(2500);
  const v = await A.evaluate(() => { const r = window.__TLQ.CL.ver['u_stu']; return r && r.res ? { errs: r.res.errs, msgs: r.res.issues.map(x => x.msg).join(',') } : null });
  check('teacher verification clean after the pull', v && v.errs === 0, JSON.stringify(v));
  // sell screen: typed quantity, no full re-render
  const own = await P.evaluate(() => { const S = window.__TLQ.S(); const k = Object.keys(S.owned).filter(k => S.owned[k] >= 1 && /^wg/.test(k)); return k[0] });
  await P.evaluate(id => { window.__TLQ.S().owned[id] = 5 }, own);
  await P.evaluate(() => document.querySelector('nav [data-id=wd]').click()); await wait(400); await P.click('[data-act=wdmanage]'); await P.click(`[data-act=itemmenu][data-id=${own}]`); await wait(300);
  const renders = await P.evaluate(() => new Promise(r => { let n = 0; const o = new MutationObserver(() => n++); o.observe(document.getElementById('app'), { childList: true }); window.__mo = () => n; r(0) }));
  for (let i = 0; i < 3; i++) await P.click('[data-act=imqty][data-id="1"]');
  let st = await P.evaluate(() => ({ n: document.getElementById('im_n').value, sell: document.getElementById('im_sellb').textContent, mo: window.__mo() }));
  check('+ button updates quantity without re-rendering the page', st.n === '4' && st.mo === 0 && /\+/.test(st.sell), JSON.stringify(st));
  await P.fill('#im_n', '2'); await wait(100);
  st = await P.evaluate(() => ({ n: window.__TLQ.UI().modal.n, sell: document.getElementById('im_sellb').textContent }));
  check('typing a quantity works', st.n === 2, JSON.stringify(st));
  await P.fill('#im_n', '99'); await P.press('#im_n', 'Tab'); await wait(100);
  st = await P.evaluate(() => ({ n: window.__TLQ.UI().modal.n, v: document.getElementById('im_n').value }));
  check('typed quantity is capped at what you own', st.n === 5 && st.v === '5', JSON.stringify(st));
  await P.click('[data-act=imtab][data-id=trade]'); await wait(200);
  const cv = await P.inputValue('#im_coin'); await P.click('[data-act=imqty][data-id="-1"]'); await wait(100);
  const cv2 = await P.inputValue('#im_coin');
  check('trade price follows quantity until you type your own price', +cv2 < +cv, cv + ' -> ' + cv2);
  await P.screenshot({ path: 'g-qty.png' });
  } catch (e) { check('exception ' + e.message, false) }
  results.forEach(r => console.log(r)); errors.forEach(e => console.log('PAGEERR ' + e)); await browser.close();
})();
