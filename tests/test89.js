const { chromium } = require('playwright');
const MOCK = require('./mock.js');
const URL = 'file:///home/claude/trilingua/index.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const results = [], errors = []; const check = (n, ok, info) => results.push((ok ? 'PASS ' : 'FAIL ') + n + (info ? ' — ' + info : ''));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function open(role, uid) { const p = await ctx.newPage(); p.on('pageerror', e => errors.push(uid + ': ' + e.message)); await p.addInitScript(MOCK(role, uid)); await p.goto(URL); await wait(300); return p; }
  try {
  const A = await open('admin', 'u_admin'); await A.evaluate(() => localStorage.clear()); await A.reload(); await wait(400);
  await A.click('[data-act=go][data-id=admin]'); await A.click('[data-act=admseed][data-id=all]'); await wait(40000);
  const P = await open('student', 'u_stu'); await wait(800); await P.click('[data-act=newgame]'); await P.fill('#hname', 'Ploy'); await P.click('[data-act=dcls][data-id=mage]'); await P.click('[data-act=confirmcreate]'); await wait(2500);
  const ids = await P.evaluate(() => { const I = window.__TLQ.ITEMS(); const w = I.filter(i => i.cat === 'wings').slice(-1)[0]; const S = window.__TLQ.S(); S.eq.wings = w.id; S.eq.pet = 'pb37'; window.__TLQ.forcePush(); return w.id });
  await wait(2000);
  await P.evaluate(() => document.querySelector('nav [data-id=town]').click()); await wait(3500);
  const town = await P.evaluate(() => { const S = window.__TLQ.S(); const s = window.__TLQ.townAvatar({ d: { g: S.gender, cls: S.cls, eq: S.eq, name: 'Ploy' } }); return s.includes('assets/mon/') ? { pet: s.indexOf('<g class="av-pet'), ch: s.indexOf('<g class="av-char') } : null });
  console.log('DBG',JSON.stringify(await P.evaluate(() => ({n:document.querySelectorAll('.tw-p .tw-av svg').length,pets:[...document.querySelectorAll('.tw-p .tw-av svg')].map(x=>x.outerHTML.includes('av-pet')+':'+x.outerHTML.length),pp:window.__TLQ.CFG().petPct,it:!!window.__TLQ.ITEM()['pb37'],eq:window.__TLQ.S().eq}))));
  check('town: pet drawn in front of player (after wings)', town && town.pet > town.ch, JSON.stringify(town) + ' wings ' + ids);
  await P.locator('#tw_scene').screenshot({ path: 'pf-town.png' });
  const home = await P.evaluate(() => { const s = window.__TLQ.avatar(window.__TLQ.S(), {}); return { pet: s.indexOf('<g class="av-pet'), ch: s.indexOf('<g class="av-char'), w: s.indexOf('<g class="av-wings'), all:[...s.matchAll(/<g class="(av-[a-z]+)/g)].map(m=>m[1]+'@'+m.index).join(' ') } });
  console.log('HOME',JSON.stringify(home));
  const tw = await P.evaluate(() => { const S = window.__TLQ.S(); const s = window.__TLQ.townAvatar({ d: { g: S.gender, cls: S.cls, eq: S.eq, name: 'Ploy' } }); document.body.innerHTML='<div style="display:flex;gap:20px;background:#9cf"><div style="width:300px">'+s+'</div><div style="width:300px">'+window.__TLQ.avatar(S,{anim:true,noFx:true,noTitle:true})+'</div></div>'; return [...s.matchAll(/<g class="(av-[a-z]+)/g)].map(m=>m[1]+'@'+m.index).join(' ') });
  console.log('TOWN',tw); await P.screenshot({path:'pf-cmp.png',clip:{x:0,y:0,width:660,height:420}});
  } catch (e) { results.push('FAIL exception ' + e.message) }
  results.forEach(r => console.log(r)); console.log('ERRORS: ' + (errors.join(' | ') || 'none')); await browser.close();
})();
