const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1400, height: 500 } }); await p.addInitScript(require('./mock.js')('student','u_x')); await p.goto('file:///home/claude/trilingua/index.html'); await new Promise(r=>setTimeout(r,1500));
 const info = await p.evaluate(() => { const types = ['sakura','cosmic','flame','moon','ice','abyss']; const W3 = window.W3 || (window.__TLQ && window.__TLQ.W3); if (!W3) return 'noW3 ' + Object.keys(window.__TLQ).join(','); 
   document.body.innerHTML = '<svg id="s" width="1400" height="500" viewBox="0 0 1400 500" style="background:#223">' + types.map((t, i) => '<g id="g' + i + '" transform="translate(' + (i * 220) + ' 0)">' + W3.draw(t, 'staff', 'p' + i) + '</g>').join('') + '</svg>';
   return types.map((t, i) => { const bb = document.getElementById('g' + i).getBBox(); return t + ':' + [bb.x, bb.y, bb.width, bb.height].map(Math.round).join(',') }).join(' ') });
 console.log(info); await p.screenshot({ path: 'w3.png' }); await b.close() })();
