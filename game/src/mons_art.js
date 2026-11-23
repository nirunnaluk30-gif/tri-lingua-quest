/* sprite monsters: pictures for pets (inside the avatar SVG) and for gate monsters (plain <img>) */
var MON_DIR='assets/mon/';
function monSrc(id){return MON_DIR+id+'.webp'}
/* inside an SVG (pet box: x -34..34, y -38..30, feet at about y 28) */
function monSvgImg(id,maxH,maxW,foot){var M=MON[id];if(!M)return '';var h=maxH||58,w=h*M.w/M.h,mw=maxW||70;if(w>mw){h=h*mw/w;w=mw}
  return '<image href="'+monSrc(id)+'" x="'+f1(-w/2)+'" y="'+f1((foot===undefined?28:foot)-h)+'" width="'+f1(w)+'" height="'+f1(h)+'" preserveAspectRatio="xMidYMax meet" style="image-rendering:auto"/>'}
function monImg(id,cls){var M=MON[id];if(!M)return '';return '<img class="mon-img'+(cls?' '+cls:'')+'" src="'+monSrc(id)+'" width="'+M.w+'" height="'+M.h+'" alt="'+esc(tx(M.n))+'" loading="lazy" decoding="async">'}
Object.keys(MB_KIND).forEach(function(k){PSET[k]={spr:MB_KIND[k],d:function(){return monSvgImg(MB_KIND[k])}}});
