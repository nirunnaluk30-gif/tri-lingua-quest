import json, sys, os
from PIL import Image
ROOT = sys.argv[1]; OUT = sys.argv[2]; H = int(sys.argv[3]); ids = sys.argv[4].split(',')
cat = {m['id']: m for m in json.load(open(os.path.join(ROOT, 'catalog.json')))['monsters']}
def frames(mid, action='idle'):
    m = cat[mid]; d = os.path.join(ROOT, m['sprite']); a = json.load(open(os.path.join(d, mid + '.atlas.json')))
    if action not in a['animations']: action = 'walk'
    sc = a['scales']['2x']; cw, ch = sc['cell']; pages = [Image.open(os.path.join(d, p['file'])).convert('RGBA') for p in sc['pages']]
    out = []
    for k in a['animations'][action]['w']:
        f = a['frames'][k]['2x']; im = pages[f['p']].crop((f['x'], f['y'], f['x'] + f['w'], f['y'] + f['h']))
        c = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); c.paste(im, (f['ox'], f['oy']), im); out.append(c)
    return out, a['actions'][action]['delayMs']
for mid in ids:
    import json as J
    fr, dl = frames(mid)
    bb = None
    for c in fr:
        b = c.getbbox(); bb = b if bb is None else (min(bb[0], b[0]), min(bb[1], b[1]), max(bb[2], b[2]), max(bb[3], b[3]))
    fr = [c.crop(bb) for c in fr]; w, h = fr[0].size; s = H / h
    fr = [c.resize((max(1, round(w * s)), H), Image.LANCZOS) for c in fr]
    fr[0].save(os.path.join(OUT, mid + '.webp'), save_all=True, append_images=fr[1:], duration=max(dl, 180), loop=0, quality=82, method=6, lossless=False)
    print(mid, fr[0].size, os.path.getsize(os.path.join(OUT, mid + '.webp')))
