import pathlib
root = pathlib.Path(__file__).parent
src = root / 'src'
base_css = pathlib.Path('/tmp/claude-0/-home-claude/61ec07f2-851d-5a5a-b6e9-584b620370be/scratchpad/base.css').read_text()
(src / 'base.css').write_text(base_css) if not (src / 'base.css').exists() else None
css = (src / 'base.css').read_text() + (src / 'admin.css').read_text()
js = '\n'.join((src / f).read_text() for f in ['data.js', 'exams.js', 'outfits.js', 'wings.js', 'hair.js', 'accessories.js', 'weapons2.js', 'weapons3.js', 'mons_data.js', 'hats.js', 'frames.js', 'vip.js', 'pets.js', 'mons_art.js', 'vip2.js', 'zoneart.js', 'game.js', 'titles.js', 'auras.js', 'ledger.js', 'cloud.js', 'views.js', 'practice.js', 'market.js', 'theme.js', 'town.js', 'mecha.js', 'bazaar.js', 'presence.js', 'news.js', 'hall.js', 'checkin.js', 'tunnel.js', 'gates2.js', 'gates3.js', 'raid.js', 'skills.js', 'skills2.js', 'guardian.js', 'avhd2.js', 'arena.js', 'bag.js', 'bossfight.js', 'topup.js', 'thanks.js', 'school.js', 'standalone.js', 'admin.js', 'gift.js', 'boot.js'])
import datetime
js = js.replace('__BUILD__', datetime.datetime.utcnow().strftime('%Y.%m.%d-%H%M'))
html = f'''<meta charset="utf-8">
<title>TRI-LINGUA Quest</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mitr:wght@400;500;600&family=Baloo+2:wght@700;800&family=Kanit:wght@400;500;600&family=Prompt:wght@400;500;600&family=Itim&family=Sriracha&family=Noto+Sans+Thai:wght@400;500;700&family=Noto+Sans+SC:wght@400;700&display=swap">
<style>{css}</style>

<div class="hdr" id="hdr"></div>
<div class="app" id="app" style="padding-top:14px"></div>
<div class="toasts" id="toasts" aria-live="polite"></div>
<div id="modal"></div>
<div class="sr" id="live" aria-live="assertive"></div>

<script>
(function(){{
'use strict';
{js}
}})();
</script>
'''
(root / 'index.html').write_text(html)
(root / 'game.check.js').write_text('(function(){\n"use strict";\n' + js + '\n})();')
print(len(html))
