/* =====================================================================
   CHARACTER LIGHT PACK (draft, 2026-11-23) — same body, same items, more depth:
   face side-shadow and hair shadow on the forehead, a small nose, a rim light
   on the lit side and a soft shade on the other, and a class-coloured glow.
   Only in the big "hd" pictures, only when CFG.avHD2 is on.
   ===================================================================== */
function avHD2(opt){return !!(opt&&opt.hd&&!opt.noFx&&typeof CFG!=='undefined'&&CFG.avHD2)}
function avFaceShade(uid,SK){var d=shade(SK,-38);
  return '<clipPath id="'+uid+'hc"><circle cx="100" cy="92" r="48"/></clipPath><g clip-path="url(#'+uid+'hc)">'+
   '<path d="M52 92a48 48 0 1 0 96 0a48 48 0 1 0-96 0M40 84a52 52 0 1 0 104 0a52 52 0 1 0-104 0" fill-rule="evenodd" fill="'+d+'" opacity=".42"/>'+
   '<path d="M50 72q50 26 100 0v14q-50 24-100 0z" fill="'+d+'" opacity=".30"/></g>'+
   '<path d="M101.5 108.5q-2.2 3.4-.6 4.6" fill="none" stroke="'+shade(SK,-34)+'" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>'}
var AV_GLOW={mage:'#a77bff',sword:'#ffc94a',archer:'#6fe39a'};
(function(){var AV=avatar;avatar=function(st,opt){var s=AV(st,opt);if(!avHD2(opt||{}))return s;
  var m=s.match(/<filter id="(a\d+hdf)"[\s\S]*?<\/filter>/);if(!m)return s;var id=m[1],gl=AV_GLOW[st&&st.cls]||'#a77bff';
  var f='<filter id="'+id+'" x="-25%" y="-20%" width="150%" height="140%" color-interpolation-filters="sRGB">'+
   '<feOffset in="SourceAlpha" dx="2.4" dy="1.8" result="o"/><feComposite in="SourceAlpha" in2="o" operator="out" result="ra"/><feGaussianBlur in="ra" stdDeviation=".7" result="rb"/><feFlood flood-color="#fff6dc" flood-opacity=".8"/><feComposite in2="rb" operator="in" result="rim"/>'+
   '<feOffset in="SourceAlpha" dx="-3" dy="-1.5" result="o2"/><feComposite in="SourceAlpha" in2="o2" operator="out" result="sa"/><feGaussianBlur in="sa" stdDeviation="1.6" result="sb"/><feFlood flood-color="#2a1550" flood-opacity=".38"/><feComposite in2="sb" operator="in" result="core"/>'+
   '<feGaussianBlur in="SourceAlpha" stdDeviation="8" result="g0"/><feFlood flood-color="'+gl+'" flood-opacity=".5"/><feComposite in2="g0" operator="in" result="glow"/>'+
   '<feDropShadow in="SourceGraphic" dx="0" dy="3" stdDeviation="2.4" flood-color="#2a1a50" flood-opacity=".28" result="ds"/>'+
   '<feMerge><feMergeNode in="glow"/><feMergeNode in="ds"/><feMergeNode in="core"/><feMergeNode in="rim"/></feMerge></filter>';
  return s.replace(m[0],f)}})();

if(typeof CFG_LABELS!=='undefined')Object.assign(CFG_LABELS,{avHD2:m('ตัวละครแสงเงาแบบใหม่ (1 = เปิด, 0 = ปิด)','New character lighting (1 = on, 0 = off)','新角色光影(1 开 0 关)')});
