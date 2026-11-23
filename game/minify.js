/* Minify the web build (game code + backend) and stamp the copyright notice.
   Usage: node minify.js <file.html|file.js> ...   — source in src/ stays readable. */
const fs = require('fs'), { minify } = require('terser');
const NOTICE = `TRI-LINGUA Quest © 2026 — สงวนลิขสิทธิ์ (All rights reserved)
ซอฟต์แวร์ เนื้อหา ภาพ และการออกแบบทั้งหมดเป็นผลงานของครูผู้พัฒนา
ห้ามคัดลอก ดัดแปลง เผยแพร่ หรือนำไปใช้ไม่ว่าทั้งหมดหรือบางส่วน โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
No copying, modification, redistribution or reuse, in whole or in part, without written permission.`;
const OPT = { compress: { passes: 2 }, mangle: true, format: { comments: false } };
const cssMin = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s{2,}/g, ' ');
(async () => {
  for (const f of process.argv.slice(2)) {
    let s = fs.readFileSync(f, 'utf8'), before = s.length;
    if (f.endsWith('.html')) {
      const parts = []; let re = /<script>([\s\S]*?)<\/script>/g, m;
      while ((m = re.exec(s))) parts.push(m);
      for (const p of parts.reverse()) { const r = await minify(p[1], OPT); s = s.slice(0, p.index) + '<script>' + r.code + '</script>' + s.slice(p.index + p[0].length) }
      s = s.replace(/<style>([\s\S]*?)<\/style>/, (_, c) => '<style>' + cssMin(c) + '</style>');
      s = s.replace(/^<!doctype html>\n?/i, '<!doctype html>\n<!--\n' + NOTICE + '\n-->\n');
    } else {
      s = '/*!\n' + NOTICE + '\n*/\n' + (await minify(s, OPT)).code;
    }
    fs.writeFileSync(f, s); console.log(f, before, '->', s.length);
  }
})().catch(e => { console.error('MINIFY FAILED', e); process.exit(1) });
