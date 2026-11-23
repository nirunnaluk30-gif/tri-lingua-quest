import json, os, sys
sys.path.insert(0, '/home/claude/tools')
from zh import ZH
from PIL import Image
cat = {m['id']: m for m in json.load(open('/home/claude/mc/Monster Catalog/catalog.json'))['monsters']}
mobs = open('/home/claude/tools/mobs.txt').read().strip().split(',')
bosses = open('/home/claude/tools/bosses.txt').read().strip().split(',')
REN = {'boss_isles_lunar_lantern_fox': ('นกกระเรียนระฆังจันทรา', 'Lunar Bell Crane')}
def js(s): return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"
lines = []
for i in mobs + bosses:
    m = cat[i]; im = Image.open('/home/claude/monout/' + i + '.webp'); w, h = im.size
    th, en = REN.get(i, (m['nameTH'], m['nameEN']))
    lines.append(" %s:{w:%d,h:%d,t:%d,n:m(%s,%s,%s)}" % (i, w, h, m['tier'], js(th), js(en), js(ZH[i])))
CEL = {'boss_abyss_rift_dragon_king', 'boss_world_goat', 'boss_volcano_inferno_sovereign', 'boss_sky_winged_arbiter', 'boss_snow_tri_crown_wyrm', 'boss_graveyard_night_sovereign'}
def rar(i):
    t = cat[i]['tier']
    if i in CEL: return 'celestial'
    return 'mythic' if t >= 5 else 'legendary' if t == 4 else 'epic'
order = sorted(bosses, key=lambda i: ({'epic': 0, 'legendary': 1, 'mythic': 2, 'celestial': 3}[rar(i)], i))
pets = ",".join("[%s,%s]" % (js(i), js(rar(i))) for i in order)
out = """/* =====================================================================
   MONSTER SPRITES (2026-11-23) — pixel monsters from the teacher's Monster Catalog.
   Each one is a small animated WebP (idle loop) in assets/mon/<id>.webp.
   MON[id] = size, tier and names. The 37 bosses are also pets (pb01–pb37, kinds mb01–mb37):
   ★5 = Mythic (the 6 mightiest = Celestial), ★4 = Legendary, ★2–3 = Epic.
   The pet box now holds only these; old pets stay with whoever owns them.
   ===================================================================== */
var MON={
""" + ",\n".join(lines) + """};
var MB_PETS=[""" + pets + """];
var MB_KIND={};
(function(){MB_PETS.forEach(function(p,i){var n=('0'+(i+1)).slice(-2),k='mb'+n,id='pb'+n;MB_KIND[k]=p[0];
  if(CAT.pet.kinds.indexOf(k)<0)CAT.pet.kinds.push(k);if(typeof KIND_NAMES!=='undefined')KIND_NAMES[k]=MON[p[0]].n;
  if(!DEFAULTS.items.some(function(it){return it.id===id}))DEFAULTS.items.push({id:id,cat:'pet',rar:p[1],names:MON[p[0]].n,g:null,v:{k:k,a:'#ffffff',b:'#ffffff'}})})})();
"""
open('/home/claude/trilingua/src/mons_data.js', 'w').write(out)
print(len(lines), 'monsters', len(bosses), 'pets')
import collections; print(collections.Counter(rar(i) for i in bosses))
