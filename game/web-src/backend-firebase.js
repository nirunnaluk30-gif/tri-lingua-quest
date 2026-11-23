/* =====================================================================
   TRI-LINGUA Quest — stand-alone backend (GitHub Pages + Firebase)
   The game was written against a small database API (doc / collection /
   onSnapshot / set / delete) and a "who is this" API. This file provides
   both on top of Firebase Auth (ID + password) and Cloud Firestore, so the
   game code itself is identical to the hosted version.
   - Login ID "mali01"  ->  Firebase account  id_mali01@id.trilingua.local
   - Player id (uid in the game) = "id_mali01"  (stays the same even if a
     teacher deletes the login and the student signs up again with a new password)
   - Content collections (words, items, …) are stored as one document per
     collection under bundle/{collection} so a student's visit costs ~15 reads.
   ===================================================================== */
(function(){
'use strict';
var DOMAIN='@id.trilingua.local';
var CONTENT=['units','words','zones','items','banners','shop','story','daily','weekly','npcs','titles','sents','exams'];
var cfg=window.TLQ_FIREBASE_CONFIG||{};
var configured=!!(cfg&&cfg.apiKey&&cfg.projectId&&String(cfg.apiKey).indexOf('PASTE')<0);
window.TLQ_STANDALONE=true;
window.TLQ_CONFIGURED=configured;
if(!configured||typeof firebase==='undefined'){window.claude={use:function(){return Promise.resolve(null)}};window.TLQ_AUTH=null;return}

var app=firebase.initializeApp(cfg);
var auth=firebase.auth();
var fs=firebase.firestore();
try{fs.settings({ignoreUndefinedProperties:true,merge:true})}catch(e){}
/* keep a copy of the save on the device: unsent progress survives a closed tab / lost Wi-Fi / a busy database and is sent later */
var REMEMBER=false;try{REMEMBER=localStorage.getItem('TLQ_REMEMBER')==='1'}catch(e){}
if(REMEMBER){try{var pp=fs.enablePersistence({synchronizeTabs:true});if(pp&&pp.catch)pp.catch(function(){})}catch(e){}}
/* also report "now confirmed by the server" moments (the game waits for those before trusting a snapshot) */
var MD={includeMetadataChanges:true};
var DEL=firebase.firestore.FieldValue.delete;

function pidOf(user){var em=(user&&user.email)||'';return em.slice(-DOMAIN.length)===DOMAIN?em.slice(0,-DOMAIN.length):''}
var ready=new Promise(function(res){var first=true;auth.onAuthStateChanged(function(u){if(u)claimAdmin(u);if(first){first=false;res(u)}})});
/* an admin record is tied to the first account that uses it (so a deleted + re-created login cannot inherit admin) */
function claimAdmin(u){var pid=String(u.email||'').split('@')[0];if(!pid)return;var r=fs.doc('admins/'+pid);
  r.get().then(function(s){if(s.exists&&!s.data().auid)return r.update({auid:u.uid})}).catch(function(){})}

/* ---------- content bundles ---------- */
function split(path){var p=String(path).split('/');return p}
function isBundleDoc(path){var p=split(path);return p.length===2&&CONTENT.indexOf(p[0])>=0}
function isBundleCol(path){var p=split(path);return p.length===1&&CONTENT.indexOf(p[0])>=0}
var pend={};
function queue(col,id,val,isDel){var q=pend[col]||(pend[col]={fields:{},vals:{},waiters:[],t:null});q.fields['docs.'+id]=isDel?DEL():val;if(isDel)delete q.vals[id];else q.vals[id]=val;
  return new Promise(function(res,rej){q.waiters.push([res,rej]);clearTimeout(q.t);q.t=setTimeout(function(){flush(col)},120)})}
function flush(col){var q=pend[col];if(!q)return;delete pend[col];var ref=fs.doc('bundle/'+col);
  function done(e){q.waiters.forEach(function(w){e?w[1](e):w[0]()})}
  ref.update(q.fields).then(function(){done()},function(e){
    if(e&&(e.code==='not-found'||e.code==='failed-precondition'))ref.set({docs:q.vals},{merge:true}).then(function(){done()},done);else done(e)})}
function bundleDocSnap(id,data,meta){return {id:id,exists:data!==undefined,metadata:meta||{hasPendingWrites:false,fromCache:false},data:function(){return data===undefined?undefined:JSON.parse(JSON.stringify(data))}}}
function bundleRef(path){var p=split(path),col=p[0],id=p[1];
  return {id:id,path:path,
    get:function(){return fs.doc('bundle/'+col).get().then(function(s){var d=s.exists?(s.data().docs||{}):{};return bundleDocSnap(id,d[id])})},
    set:function(v){return queue(col,id,v,false)},
    delete:function(){return queue(col,id,null,true)},
    onSnapshot:function(cb,err){return fs.doc('bundle/'+col).onSnapshot(MD,function(s){var d=s.exists?(s.data().docs||{}):{};cb(bundleDocSnap(id,d[id],s.metadata))},err)}}}
function bundleCol(path){var col=split(path)[0];
  function snap(s){var d=s.exists?(s.data().docs||{}):{};var docs=Object.keys(d).map(function(id){return bundleDocSnap(id,d[id],s.metadata)});return {docs:docs,size:docs.length,empty:!docs.length,metadata:s.metadata,forEach:function(f){docs.forEach(f)}}}
  return {path:path,doc:function(id){return bundleRef(col+'/'+id)},
    get:function(){return fs.doc('bundle/'+col).get().then(snap)},
    onSnapshot:function(cb,err){return fs.doc('bundle/'+col).onSnapshot(MD,function(s){cb(snap(s))},err)}}}

/* ---------- database facade (same shape the game expects) ---------- */
function wrapErr(e){if(e&&e.code==='permission-denied')e.code='permission_denied';return Promise.reject(e)}
function myPid(){var u=auth.currentUser;return u&&u.email?String(u.email).split('@')[0]:''}
function playerSet(r,pid,v,o){var u=auth.currentUser;if(!u)return r.set(v,o||{});
  if(pid===myPid())return r.set(Object.assign({},v,{auid:u.uid}),o||{});
  /* a teacher rewriting a student's save keeps the student's account binding */
  if(v&&'auid' in v)return r.set(v,o||{});return r.get().then(function(s){var a=s.exists?s.data().auid:undefined;return r.set(a===undefined?v:Object.assign({},v,{auid:a}),o||{})})}
function docRef(path){if(isBundleDoc(path))return bundleRef(path);var r=fs.doc(path),pm=/^players\/([^/]+)$/.exec(path);
  return {id:r.id,path:path,get:function(){return r.get()},set:function(v,o){return (pm?playerSet(r,pm[1],v,o):r.set(v,o||{})).catch(wrapErr)},update:function(v){return r.update(v).catch(wrapErr)},delete:function(){return r.delete().catch(wrapErr)},
    onSnapshot:function(cb,err){return r.onSnapshot(MD,cb,err)},collection:function(c){return colRef(path+'/'+c)}}}
function colRef(path){if(isBundleCol(path))return bundleCol(path);var r=fs.collection(path);
  return {path:path,doc:function(id){return docRef(path+'/'+id)},get:function(){return r.get()},onSnapshot:function(cb,err){return r.onSnapshot(MD,cb,err)},
    where:function(a,b,c){return r.where(a,b,c)},orderBy:function(a,b){return r.orderBy(a,b)},limit:function(n){return r.limit(n)}}}
var db={doc:docRef,collection:colRef};

/* ---------- who is playing ---------- */
var adminP=null;
function isAdmin(pid){if(!adminP)adminP=fs.doc('admins/'+pid).get().then(function(s){return s.exists},function(){return false});return adminP}
function userApi(u){var pid=pidOf(u);return {id:function(){return Promise.resolve(pid)},canEdit:function(){return isAdmin(pid)},isOwner:function(){return false},can:function(){return Promise.resolve(true)},
  me:function(){return Promise.resolve({id:pid,name:u.displayName||pid.slice(3)})},profiles:function(){return Promise.resolve({})}}}
function download(o){try{var b=new Blob([o.data],{type:/\.csv$/i.test(o.filename)?'text/csv;charset=utf-8':/\.json$/i.test(o.filename)?'application/json':'application/octet-stream'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=o.filename||'download';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);return Promise.resolve()}catch(e){return Promise.reject(e)}}
window.claude={use:function(name){return ready.then(function(u){var pid=pidOf(u);
  if(name==='downloads')return {save:download};
  if(!u||!pid)return null;
  if(name==='db')return db;if(name==='user')return userApi(u);return null})}};

/* ---------- ID + password sign-in used by the title screen ---------- */
var ID_RE=/^[a-z0-9_.-]{3,20}$/;
function emailOf(id){return 'id_'+id+DOMAIN}
function msg(e){var c=e&&e.code||'';return c==='auth/email-already-in-use'?'id_taken':c==='auth/weak-password'?'pw_short':(c==='auth/wrong-password'||c==='auth/user-not-found'||c==='auth/invalid-credential'||c==='auth/invalid-login-credentials'||c==='auth/invalid-email')?'bad_login':c==='auth/too-many-requests'?'too_many':c==='auth/network-request-failed'?'offline':'unknown'}
/* new passwords: at least 8 characters with letters and numbers (old 6-character passwords still sign in) */
function pwOk(pw){pw=String(pw||'');return pw.length>=8&&/[A-Za-z]/.test(pw)&&/[0-9]/.test(pw)}
function persist(remember){return auth.setPersistence(remember?firebase.auth.Auth.Persistence.LOCAL:firebase.auth.Auth.Persistence.SESSION)}
window.TLQ_AUTH={
  idOk:function(id){return ID_RE.test(String(id||''))},
  login:function(id,pw,remember){id=String(id||'').trim().toLowerCase();if(!ID_RE.test(id))return Promise.reject('bad_id');
    try{localStorage.setItem('TLQ_REMEMBER',remember?'1':'0')}catch(e){}
    return persist(remember).then(function(){return auth.signInWithEmailAndPassword(emailOf(id),pw)}).catch(function(e){throw msg(e)})},
  register:function(id,pw,name,remember){id=String(id||'').trim().toLowerCase();if(!ID_RE.test(id))return Promise.reject('bad_id');if(!pwOk(pw))return Promise.reject('pw_short');try{localStorage.setItem('TLQ_REMEMBER',remember?'1':'0')}catch(e){}
    return persist(remember).then(function(){return auth.createUserWithEmailAndPassword(emailOf(id),pw)}).then(function(c){return c.user.updateProfile({displayName:String(name||'').slice(0,40)}).catch(function(){})}).catch(function(e){throw typeof e==='string'?e:msg(e)})},
  logout:function(clear){return auth.signOut().then(function(){if(!clear)return;try{localStorage.removeItem('TLQ_REMEMBER')}catch(e){}
    /* shared computer: also wipe the database's offline copy */return fs.terminate().then(function(){return fs.clearPersistence()}).catch(function(){})})},
  pwOk:pwOk,
  unbind:function(pid){return fs.doc('players/'+pid).update({auid:''})},
  changePassword:function(oldPw,newPw){var u=auth.currentUser;if(!u)return Promise.reject('bad_login');if(!pwOk(newPw))return Promise.reject('pw_short');
    var cred=firebase.auth.EmailAuthProvider.credential(u.email,oldPw);return u.reauthenticateWithCredential(cred).then(function(){return u.updatePassword(newPw)}).catch(function(e){throw typeof e==='string'?e:msg(e)})},
  makeAdmin:function(pid){return fs.doc('admins/'+pid).set({at:Date.now()})},
  removeAdmin:function(pid){return fs.doc('admins/'+pid).delete()},
  listAdmins:function(){return fs.collection('admins').get().then(function(s){return s.docs.map(function(d){return d.id})})}
};
})();
