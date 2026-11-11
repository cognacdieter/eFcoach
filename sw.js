// LevelCoach Offline-Speicher (Service Worker)
// Seite: immer zuerst aus dem Netz (neue Versionen kommen sofort), ohne Internet aus dem Speicher.
// Schriften + Texterkennung: aus dem Speicher, Texterkennung erst beim ersten Einlesen geladen.
const C='lc-1';
const CORE=['./','./fonts/fonts.css','./fonts/MrDafoe-latin-e025ea.woff2','./fonts/MrDafoe-latin-ext-2e615b.woff2','./fonts/SairaCondensed-latin-6cc5d6.woff2','./fonts/SairaCondensed-latin-baab28.woff2','./fonts/SairaCondensed-latin-e0096f.woff2','./fonts/SairaCondensed-latin-ext-05480d.woff2','./fonts/SairaCondensed-latin-ext-2351e7.woff2','./fonts/SairaCondensed-latin-ext-67318a.woff2','./fonts/SourceSans3-latin-263ee0.woff2','./fonts/SourceSans3-latin-ext-7ee8ef.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||u.pathname.endsWith('version.json'))return;
  const page=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('/index.html');
  if(page){
    e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put('./',cp))}return res})
      .catch(()=>caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res})));
});
