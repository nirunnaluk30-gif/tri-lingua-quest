const MOCK = (role, uid) => `
(function(){
  if(${JSON.stringify(role)}==='none')return;
  var KEY='__mockdb';
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s));fire()}
  var subs=[];
  function snapDoc(path,s){var d=s[path];return {id:path.split('/').pop(),exists:!!d,data:function(){return d?JSON.parse(JSON.stringify(d)):undefined},metadata:{fromCache:false,hasPendingWrites:false}}}
  function colDocs(path,s){return Object.keys(s).filter(function(k){return k.indexOf(path+'/')===0&&k.split('/').length===path.split('/').length+1}).sort().map(function(k){return snapDoc(k,s)})}
  function fire(){var s=load();subs.forEach(function(x){setTimeout(function(){deliver(x,s)},5)})}
  function deliver(x,s){if(x.dead)return;if(x.t==='doc')x.cb(snapDoc(x.p,s));else{var d=colDocs(x.p,s);x.cb({docs:d,size:d.length,empty:!d.length,docChanges:function(){return []},metadata:{fromCache:false,hasPendingWrites:false}})}}
  window.addEventListener('storage',function(e){if(e.key===KEY)fire()});
  var ROLE=${JSON.stringify(role)},UID=${JSON.stringify(uid)};
  function allowed(path){if(path.indexOf('mkclaim/')===0){if(localStorage.__noClaimRule==='1')return false;var ex=load()[path];return !ex}return ROLE==='admin'||path.indexOf('players/'+UID)===0||path==='market/'+UID||path==='town/'+UID||path==='topup/'+UID||(path.indexOf('presence/')===0)||(path.indexOf('board/')===0)||(path.indexOf('raid/')===0&&path.indexOf('/hits/')>0&&path.split('/').pop()===UID)}
  window.__writes=0;
  function docRef(path){return {id:path.split('/').pop(),path:path,
    get:function(){if(path.indexOf('mkclaim/')===0&&localStorage.__noClaimRule==='1')return Promise.reject({code:'permission-denied'});return Promise.resolve(snapDoc(path,load()))},
    set:function(d,o){if(!allowed(path))return Promise.reject({code:'invalid_argument',message:'denied'});window.__writes++;var s=load();var nd=JSON.parse(JSON.stringify(d));if(o&&o.merge&&s[path]){Object.keys(nd).forEach(function(k){var v=nd[k];if(v&&typeof v==='object'&&!Array.isArray(v)&&s[path][k]&&typeof s[path][k]==='object'&&!Array.isArray(s[path][k]))Object.assign(s[path][k],v);else s[path][k]=v})}else s[path]=nd;save(s);return Promise.resolve()},
    update:function(d){var s=load();Object.assign(s[path],d);save(s);return Promise.resolve()},
    delete:function(){if(!allowed(path))return Promise.reject({code:'invalid_argument',message:'denied'});var s=load();delete s[path];save(s);return Promise.resolve()},
    onSnapshot:function(cb){var x={t:'doc',p:path,cb:cb};subs.push(x);setTimeout(function(){deliver(x,load())},20);return function(){x.dead=true}}}}
  function colRef(path){return {path:path,doc:function(id){return docRef(path+'/'+id)},
    get:function(){var d=colDocs(path,load());return Promise.resolve({docs:d,size:d.length,empty:!d.length})},
    orderBy:function(f,dir){var lim=1e9,q={limit:function(n){lim=n;return q},get:function(){var d=colDocs(path,load()).filter(function(x){var v=x.data()[f];return typeof v==='number'}).sort(function(a,b){return (b.data()[f]-a.data()[f])*(dir==='desc'?1:-1)}).slice(0,lim);return Promise.resolve({docs:d,size:d.length,empty:!d.length})}};return q},
    onSnapshot:function(cb){var x={t:'col',p:path,cb:cb};subs.push(x);setTimeout(function(){deliver(x,load())},20);return function(){x.dead=true}}}}
  var db={doc:docRef,collection:colRef};
  var user={id:function(){return Promise.resolve(UID)},canEdit:function(){return Promise.resolve(ROLE==='admin')},isOwner:function(){return Promise.resolve(ROLE==='admin')},can:function(){return Promise.resolve(ROLE==='admin')},
    profiles:function(ids){var o={};ids.forEach(function(i){o[i]={id:i,name:i==='u_stu'?'Student One':'Teacher',avatarUrl:'',color:'#888',email:null,isMe:i===UID,guest:false}});return Promise.resolve(o)}};
  window.claude={use:function(n){return Promise.resolve(n==='db'?db:n==='user'?user:null)}};
})();`;

module.exports=MOCK;
