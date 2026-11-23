"""Build the stand-alone GitHub Pages version into ./web (same game code + Firebase backend)."""
import pathlib, shutil, re
root = pathlib.Path(__file__).parent
src = root / 'src'; ws = root / 'web-src'; out = root / 'web'
b = (root / 'build.py').read_text()
files = re.search(r"for f in \[(.*?)\]\)", b).group(1)
order = [x.strip().strip("'") for x in files.split(',')]
css = (src / 'base.css').read_text() + (src / 'admin.css').read_text()
js = '\n'.join((src / f).read_text() for f in order)
import datetime
js = js.replace('__BUILD__', datetime.datetime.now(datetime.timezone.utc).strftime('%Y.%m.%d-%H%M'))
fonts = re.search(r'<link rel="stylesheet" href="(https://fonts.googleapis.com/css2[^"]+)">', b).group(1)
FB = '10.12.2'
html = f'''<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>TRI-LINGUA Quest</title>
<meta name="description" content="เกมฝึก 3 ภาษา ไทย · English · 中文">
<meta name="theme-color" content="#5b3fd0">
<link rel="icon" href="assets/icon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{fonts}">
<style>*,*::before,*::after{{box-sizing:border-box}}html,body{{margin:0}}{css}</style>
<script src="https://www.gstatic.com/firebasejs/{FB}/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/{FB}/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/{FB}/firebase-firestore-compat.js"></script>
<script src="config.js"></script>
<script src="backend-firebase.js"></script>
</head>
<body>
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
</body>
</html>
'''
if out.exists(): shutil.rmtree(out)
(out / 'assets').mkdir(parents=True)
(out / 'index.html').write_text(html)
for f in ['backend-firebase.js', 'config.js', 'firestore.rules', 'LICENSE', '.nojekyll', 'firebase.json']:
    if (ws / f).exists(): shutil.copy(ws / f, out / f)
for f in ['heroes.mp4', 'heroes.jpg', 'backdrop.jpg']:
    shutil.copy(root / 'assets' / f, out / 'assets' / f)
(out / 'assets' / 'icon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#5b3fd0"/><rect x="12" y="14" width="10" height="36" rx="3" fill="#ff5a6a"/><rect x="27" y="14" width="10" height="36" rx="3" fill="#ffd21a"/><rect x="42" y="14" width="10" height="36" rx="3" fill="#2fc3ff"/></svg>')
print(len(html), 'bytes ->', out)
# public README is only a short copyright note (the setup guide web-src/README.md stays private)
shutil.copy(ws / 'README.public.md', out / 'README.md')
# compress the game code and backend for the public site, and stamp the copyright notice (src/ stays readable)
import subprocess
subprocess.run(['node', str(root / 'minify.js'), str(out / 'index.html'), str(out / 'backend-firebase.js')], check=True)
