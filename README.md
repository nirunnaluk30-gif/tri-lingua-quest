# TRI-LINGUA Quest — source code (branch `source`)

This branch keeps the readable source, build scripts, tests and art references.
The live game is the built file on branch `main` (served by GitHub Pages).
Nothing on this branch is served to players.

## Layout

| Folder | What is in it |
|---|---|
| `game/src/` | Game source, one file per system (`*.js`) and `base.css`. Order of files is set in `game/build.py`. |
| `game/build.py` | Joins `src/` into `game/index.html` (single-file game). |
| `game/build_web.py` | Makes the deployable folder `game/web/` (minified with `minify.js`, needs `npm i terser`). |
| `game/web-src/` | Files copied into the web build: Firebase backend, Firestore rules, licence. `config.js` here is a placeholder: the real Firebase settings are only on `main`. |
| `tests/` | Browser tests (Playwright + Chrome) with a mock Firebase (`mock.js`). Test data is invented, never real students. |
| `tools/` | Asset scripts: monster sprite export (`spr.py`, `gen_mons.py`), background removal (`cut.py`, needs `rembg`), idle animation from one picture (`anim.py`). |
| `references/bosses/` | The teacher's six master character pictures (awakened bosses and guardian spirits). |

## Build and deploy

1. Copy `assets/` from branch `main` into `game/assets/` (images, video, monster sprites).
2. `cd game && python3 build.py && python3 build_web.py`
3. Copy `game/web/index.html` (and any new files in `game/assets/mon/`) to branch `main`, commit, push.
4. Content added to the built-in defaults (`data.js`, new items, zones, words) reaches the live
   database only after the teacher presses **"เพิ่มเนื้อหาใหม่"** in the admin page.

## Tests

Tests open `file:///home/claude/trilingua/index.html`; change `URL` at the top of a test if the
game is built somewhere else. Run one with `node tests/test92.js`. Every test prints PASS/FAIL lines
and ends with the teacher's ledger verification where it applies.

## Rules kept in this project

- Never put API keys or passwords in the code or the repo; the teacher handles the admin password
  and Firebase console steps.
- Back up `src/` before editing; do not remove or overwrite a working system without the teacher's OK.
- Every reward goes through the ledger (`ledger.js`) so the teacher's verification can recheck it.
- Gacha uses tickets only; topped-up gems never turn into tickets.
- Art: original designs or the teacher's own pictures; no copies of copyrighted characters.

## Art sources

- Monster sprites (`assets/mon/mob_*`, `boss_*`): the teacher's Monster Catalog (uploaded 23 Nov 2026).
- Awakened bosses / guardian spirits (`assets/mon/boss_aw_*`): `references/bosses/`, background removed
  with `tools/cut.py` (isnet-anime) and animated with `tools/anim.py` (soft mesh warp, 10 frames).
