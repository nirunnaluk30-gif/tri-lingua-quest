/* =====================================================================
   TWO MONSTER GATES (2026-11-23) — Wild Beast Gate and Spirit Realm Gate.
   Mixed Thai / English / Chinese words, triple EXP (TN_XM in ledger.js).
   The monsters are the animated pixel monsters from the teacher's catalog
   (mons_data.js): each tier of floors has its own creatures, each floor its own boss.
   Same rewards, drops and anti-cheat record as the other gates.
   ===================================================================== */
Object.assign(L,{
 tm_name:m('ประตูพงไพรอสูร','Wild Beast Gate','荒野魔兽之门'),tm_desc:m('ทุ่งหญ้า ป่าลึก ชายฝั่ง ถ้ำ และหมู่เกาะตะวันออก เต็มไปด้วยอสูรขยับได้ ตอบคำศัพท์ผสม 3 ภาษาเพื่อปราบ','Meadows, deep forest, coast, caves and the eastern isles, full of moving monsters. Beat them with words in all three languages','草原、深林、海岸、洞穴与东方群岛满是会动的魔兽,用三种语言的词汇击败它们'),
 tq_name:m('ประตูนครวิญญาณ','Spirit Realm Gate','幽灵国度之门'),tq_desc:m('ทะเลทราย สุสาน แดนหิมะ ซากปราสาท ภูเขาไฟ ฟากฟ้า และห้วงอเวจี อสูรแกร่งขึ้นทุกชั้น คำศัพท์ผสม 3 ภาษาขั้นสูง','Desert, graveyard, snowfields, ruined castles, volcano, sky and the abyss. Monsters grow stronger floor by floor; advanced words in all three languages','沙漠、墓地、雪原、城堡废墟、火山、天空与深渊,魔兽一层比一层强,三语进阶词汇'),
 tn_lgx3:m('🌐 ผสม 3 ภาษา · EXP ×3','🌐 All three languages · EXP ×3','🌐 三语混合 · 经验×3'),
 tn_gatesdesc:m('8 ประตู: กาลเวลา (ผสม) · ตะวันตก (อังกฤษ) · เอราวัณ (ไทย) · เมืองเวหา (อังกฤษ ม.ต้น) · ดินแดนศักดิ์ (จีน ม.ต้น) · ผู้ทดสอบเทวะ (ไทย ม.ต้น) · พงไพรอสูร และนครวิญญาณ (ผสม 3 ภาษา EXP ×3) แต่ละประตูมี 10 ชั้นพร้อมบอส','8 gates: Time (mixed) · Western (English) · Erawan (Thai) · Sky City (English M.1–3) · Sacred Land (Chinese M.1–3) · Divine Examiner (Thai M.1–3) · Wild Beast and Spirit Realm (all three languages, EXP ×3), 10 floors each with a boss','8 道门:时空(混合)· 西方(英语)· 爱侣湾(泰语)· 天空之城(初中英语)· 神圣之地(初中汉语)· 天神考官(初中泰语)· 荒野魔兽与幽灵国度(三语,经验×3),各 10 层并有首领')});
var TM_THEMES=[
 {n:m('ทุ่งหญ้าลมโชย','Breezy Meadow','微风草原'),a:'#8fdcff',b:'#d9f7b0',c:'#4caf50',d:['🌼','🌿','🦋']},
 {n:m('หุบเขาเขียวขจี','Green Vale','翠绿山谷'),a:'#7fd0ff',b:'#c8f0a0',c:'#2e7d32',d:['🌳','🍄','🌸']},
 {n:m('ทางเข้าป่าละเมาะ','Edge of the Woods','林地边缘'),a:'#86c98a',b:'#e3f6c8',c:'#558b2f',d:['🌲','🍂','🐿️']},
 {n:m('ป่าลึกแสงรำไร','Dim Deep Forest','幽暗深林'),a:'#5aa86a',b:'#cfeab0',c:'#1b5e20',d:['🌲','🍄','🪵']},
 {n:m('ชายหาดลมทะเล','Sea-Breeze Beach','海风沙滩'),a:'#7fd8ff',b:'#fff1c8',c:'#0288d1',d:['🐚','🌴','🌊']},
 {n:m('แนวปะการัง','Coral Reef','珊瑚礁'),a:'#5ec8f0',b:'#d8f6ff',c:'#00897b',d:['🪸','🐠','🫧']},
 {n:m('ถ้ำหินย้อย','Dripstone Cave','钟乳石洞'),a:'#a99cd8',b:'#ece6ff',c:'#5e35b1',d:['💎','🪨','🦇']},
 {n:m('รังแมลงสีม่วง','Violet Hive','紫色虫巢'),a:'#c19ce8',b:'#f6ecff',c:'#8e24aa',d:['🕸️','💜','🪲']},
 {n:m('หมู่เกาะโคมเทศกาล','Festival Lantern Isles','节庆灯笼群岛'),a:'#ffb48a',b:'#fff2dc',c:'#e53935',d:['🏮','🎋','⛩️']},
 {n:m('ศาลเจ้าบนเมฆ','Shrine above the Clouds','云上神社'),a:'#9fc2ff',b:'#fff6e6',c:'#c62828',d:['⛩️','☁️','🌸']}];
var TQ_THEMES=[
 {n:m('ทะเลทรายสุริยา','Sun-Scorched Desert','烈日沙漠'),a:'#3a2410',b:'#c8902a',c:'#ffe08a'},
 {n:m('เมืองฝังทราย','Buried City','沙埋之城'),a:'#40280f',b:'#a8722a',c:'#ffd27a'},
 {n:m('วิหารสุสานทองคำ','Golden Tomb Temple','黄金墓殿'),a:'#3a2a08',b:'#b8901a',c:'#fff1a0'},
 {n:m('สุสานเงาจันทร์','Moonshadow Graveyard','月影墓地'),a:'#141a2e',b:'#4a5a8a',c:'#c8d8ff'},
 {n:m('ทุ่งน้ำแข็งเหน็บหนาว','Bitter Icefield','刺骨冰原'),a:'#0f2a44',b:'#4a90c8',c:'#e0f4ff'},
 {n:m('มหาวิหารราตรี','Cathedral of Night','暗夜大教堂'),a:'#1a1030',b:'#5a3a8a',c:'#e0c8ff'},
 {n:m('ปราสาทสีชาด','Crimson Castle','绯红城堡'),a:'#2a0a12',b:'#9a1f3a',c:'#ffb3c0'},
 {n:m('ปล่องภูเขาไฟ','Volcano Crater','火山口'),a:'#2a0808',b:'#c0392b',c:'#ffb38a'},
 {n:m('ฟากฟ้าศักดิ์สิทธิ์','Holy Skies','神圣天空'),a:'#13305a',b:'#6a9ae8',c:'#fff4c8'},
 {n:m('ห้วงอเวจีรอยแยก','Rift of the Abyss','深渊裂隙'),a:'#0a0614',b:'#5a1a6a',c:'#ff7ab0'}];
/* 23 Nov: six AWAKENED bosses (teacher's own character pictures, animated) take floors 8-10 of both gates */
Object.assign(MON,{
 boss_aw_rift_dragon_king:{w:241,h:240,t:5,n:m('ราชามังกรรอยแยก ร่างตื่น','Awakened Rift Dragon King','觉醒·裂隙龙王')},
 boss_aw_cave_beetle:{w:243,h:240,t:5,n:m('ด้วงเขาแห่งถ้ำ ร่างตื่น','Awakened Cave Beetle','觉醒·洞穴甲虫')},
 boss_aw_brood_empress:{w:236,h:240,t:5,n:m('จักรพรรดินีฝูงแมลง ร่างตื่น','Awakened Brood Empress','觉醒·虫群女皇')},
 boss_aw_drill_colossus:{w:233,h:240,t:5,n:m('ยักษ์สว่านเหล็ก ร่างตื่น','Awakened Drill Colossus','觉醒·钻头巨像')},
 boss_aw_drowned_captain:{w:231,h:240,t:5,n:m('กัปตันจมน้ำ ร่างตื่น','Awakened Drowned Captain','觉醒·溺亡船长')},
 boss_aw_shellguard_warlord:{w:235,h:240,t:5,n:m('จอมทัพเกราะเปลือก ร่างตื่น','Awakened Shellguard Warlord','觉醒·甲壳战王')}});
Object.assign(TN_GATE,{
 m:{id:'m',n:'tm_name',ds:'tm_desc',lg:'tn_lgx3',sub:'Wild Beast Gate',icon:'🐺',th:TM_THEMES,langs:null,light:true,xm:3,g1:'#ffffff',g2:'#c8ff8a',bg:'linear-gradient(120deg,#2e7d32,#43a047 45%,#0288d1)',
  spr:[['mob_meadow_beetle', 'mob_meadow_blob', 'mob_meadow_bloomlet', 'mob_meadow_cocoon', 'mob_meadow_hopper', 'mob_vale_bee', 'mob_vale_cap', 'mob_vale_stump'], ['mob_forest_acorn_squirrel', 'mob_forest_pitcher_maw', 'mob_forest_sticky_flytrap', 'mob_forest_greymane_wolf', 'mob_forest_mistail_fox', 'mob_forest_tusklet', 'mob_forest_lone_packlord', 'mob_forest_skimmer_king'], ['mob_cave_burrow_rat', 'mob_coast_crab', 'mob_coast_tidestar', 'mob_coast_bladefin', 'mob_coast_jelly', 'mob_coast_reefgrasp', 'mob_cave_dripstone_hulk', 'mob_cave_violet_broodqueen'], ['mob_isles_club_imp', 'mob_isles_festival_dragon', 'mob_isles_mochi_sprite', 'mob_isles_parasol_hopper', 'mob_isles_talisman_hopper', 'mob_isles_crow_mask', 'mob_isles_mourning_maiden', 'mob_isles_totem_sentinel']],sprB:['boss_vale_tiger','boss_cave_beetle','boss_forest_tusk_champion','boss_coast_drowned_captain','boss_forest_rampage_beast','boss_forest_blazing_serpent','boss_coast_shellguard_warlord','boss_aw_cave_beetle','boss_aw_brood_empress','boss_aw_drill_colossus']},
 n:{id:'n',n:'tq_name',ds:'tq_desc',lg:'tn_lgx3',sub:'Spirit Realm Gate',icon:'💀',th:TQ_THEMES,langs:null,xm:3,g1:'#ffd8f0',g2:'#ffd54f',bg:'linear-gradient(120deg,#1a1030,#5a1a6a 50%,#c0392b)',
  spr:[['mob_desert_dune_egg', 'mob_desert_dune_wolf', 'mob_desert_linenwalker', 'mob_desert_sandchick', 'mob_desert_spinewalker', 'mob_desert_strider_bird', 'mob_desert_gilded_linenwalker', 'mob_desert_jackal_priest'], ['mob_snow_frost_pup', 'mob_snow_puff', 'mob_graveyard_bone_guard', 'mob_graveyard_gravegnaw', 'mob_graveyard_shadehound', 'mob_snow_frost_ape', 'mob_snow_snowhulk', 'mob_graveyard_gallows_tree'], ['mob_ruins_bellclock', 'mob_ruins_haunted_frame', 'mob_volcano_cinder_skull', 'mob_volcano_lava_scorpion', 'mob_ruins_dread_shade', 'mob_ruins_hatred_shade', 'mob_ruins_mirror_twin', 'mob_volcano_hellfire_steed'], ['mob_sky_bigbeak', 'mob_sky_haloblob', 'mob_sky_puffseed', 'mob_abyss_rift_wyvern', 'mob_abyss_wyrmling_runner', 'mob_sky_gustfang', 'mob_sky_spear_maiden', 'mob_sky_vigil_warden']],sprB:['boss_desert_sandmaw_glutton','boss_desert_dune_emperor','boss_desert_solar_tomb_lord','boss_graveyard_fallen_prelate','boss_snow_frostfang_alpha','boss_graveyard_night_sovereign','boss_ruins_crimson_count','boss_aw_drowned_captain','boss_aw_shellguard_warlord','boss_aw_rift_dragon_king']}});
TN_ORDER.push('m','n');
(function(){
  var gOn=tnGateOn;tnGateOn=function(g){if(g==='m')return CFG.tnOn!==0&&CFG.tmOn!==0;if(g==='n')return CFG.tnOn!==0&&CFG.tqOn!==0;return gOn(g)};
  var W=tnWords;tnWords=function(f,g){var c=tnCur(g);if(c!=='m'&&c!=='n')return W(f,g);var tier=tnTier(f),ws=[],zs;
    if(c==='m')zs=tier===1?ZONES.slice(0,5):tier===2?ZONES.slice(5,10):tier===3?ZONES.slice(10,17):ZONES;
    else zs=tier===1?ZONES.slice(5,10):tier===2?ZONES.slice(10,15):tier===3?ZONES.slice(15):ZONES.slice(8);
    zs.forEach(function(z){ws=ws.concat(zoneWords(z))});return ws.length>=4?ws:W(f,'')};
  var ST=tnStart;tnStart=function(f){ST(f);var G=TN_GATE[tnCur()];if(!G||!G.spr||!TN.ents)return;var L=G.spr[tnTier(TN.f)-1]||G.spr[0];
    TN.ents.forEach(function(e){e.sp=L[Math.floor(rnd(L.length))]});if(TN.boss)TN.boss.sp=G.sprB[(TN.f-1)%G.sprB.length];render()};
  var MS=tnMobSvg,MN=tnMobName,BS=tnBossSvg,BN=tnBossName;
  var spr=function(){var G=TN_GATE[tnCur()];return G&&G.spr?G:null};
  tnMobSvg=function(e){return spr()&&e&&e.sp?monImg(e.sp,'tn-spr'):MS(e)};
  tnMobName=function(e){return spr()&&e&&e.sp&&MON[e.sp]?tx(MON[e.sp].n):MN(e)};
  tnBossSvg=function(f){var G=spr();if(!G)return BS(f);var id=G.sprB[(f-1)%G.sprB.length];return monImg(id,'tn-spr boss')};
  tnBossName=function(f){var G=spr();if(!G)return BN(f);var id=G.sprB[(f-1)%G.sprB.length];return MON[id]?tx(MON[id].n):''};
})();
