// ===== UBUNTU =====
function initUbuntu(){
  renderUbuntuTopbar(); renderUbuntuDock(); renderUbuntuDesktop();
  const desk=document.getElementById('ubuntuDesktop');
  desk.addEventListener('contextmenu', e=>{
    e.preventDefault();
    const ctx=document.getElementById('ubuntuCtx');
    ctx.innerHTML=`<button onclick="openApp('files')">📁 Open Files</button><button onclick="openApp('terminal')">⬛ Open Terminal</button><button onclick="setWallpaper(Math.floor(Math.random()*WALLPAPERS_UBUNTU.length),'ubuntu')">🖼️ Change Background</button><button onclick="openApp('settings')">⚙️ Settings</button><button onclick="exitOS()">🔄 Change OS</button>`;
    ctx.style.left=e.clientX+'px'; ctx.style.top=e.clientY+'px'; ctx.classList.remove('hidden');
  });
  document.addEventListener('click', e=>{
    if(!e.target.closest('#ubuntuCtx')) document.getElementById('ubuntuCtx').classList.add('hidden');
    if(!e.target.closest('#ubuntuMenu') && !e.target.closest('[data-ubuntu-status]')) document.getElementById('ubuntuMenu').classList.add('hidden');
  });
  updateUbuntuClock(); setInterval(updateUbuntuClock,1000);
  // Lock screen like reference
  const lock=document.getElementById('ubuntuLock');
  lock.classList.remove('hidden');
  lock.innerHTML=`<div><div style="font-size:64px">◎</div><h2 id="lockTime">--:--</h2><p id="lockDate"></p><p style="margin-top:14px;color:#e9d5ff">Click or press a key to unlock</p><button onclick="unlockUbuntu()">Unlock →</button></div>`;
  const updLock=()=>{ const d=new Date(); const t=document.getElementById('lockTime'); if(t) t.textContent=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}); const dt=document.getElementById('lockDate'); if(dt) dt.textContent=d.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric'}); };
  updLock(); setInterval(updLock,1000);
  lock.addEventListener('click', unlockUbuntu);
  document.addEventListener('keydown', function unlockOnce(e){ if(!document.getElementById('ubuntu').classList.contains('hidden') && !lock.classList.contains('hidden')){ unlockUbuntu(); } });
}
function unlockUbuntu(){ document.getElementById('ubuntuLock').classList.add('hidden'); toast('Welcome to Ubuntu 👋'); }
function updateUbuntuClock(){
  const el=document.getElementById('ubuntuClock'); if(!el) return;
  const d=new Date();
  el.textContent=d.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})+'  '+d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
}
function renderUbuntuTopbar(){
  document.getElementById('ubuntuTopbar').innerHTML=`
    <span class="acts" onclick="toggleActivities()">◉ Activities</span>
    <span style="font-size:12px;color:#aaa">Ubuntu 24.04</span>
    <span class="clock" id="ubuntuClock">--:--</span>
    <span class="status" data-ubuntu-status onclick="toggleUbuntuMenu()">📶 🔊 🔋 ▾</span>`;
  document.getElementById('ubuntuMenu').innerHTML=`
    <div style="display:flex;justify-content:space-between;font-size:13px"><b>Quick Settings</b><span>🔋 85%</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0;font-size:12px">
      <div style="background:rgba(255,255,255,.08);padding:10px;border-radius:10px">📶 Wi-Fi<br><small>HomeWiFi</small></div>
      <div style="background:rgba(255,255,255,.08);padding:10px;border-radius:10px">🔵 Bluetooth<br><small>Off</small></div>
      <div style="background:rgba(255,255,255,.08);padding:10px;border-radius:10px">🌙 Dark Style</div>
      <div style="background:rgba(255,255,255,.08);padding:10px;border-radius:10px">🔒 Lock</div>
    </div>
    <div style="font-size:12px">🔊 <input type="range" style="width:100%" value="80" oninput="audioEl.volume=this.value/100"></div>
    <div style="font-size:12px;margin-top:8px">☀️ <input type="range" style="width:100%" value="100" oninput="document.body.style.filter='brightness('+(this.value/100)+')'"></div>
    <div style="display:flex;gap:8px;margin-top:12px"><button class="big-btn gray" onclick="exitOS()">🔄 Change OS</button><button class="big-btn gray" onclick="toast('Power off (just kidding 😄)')">⏻ Power</button></div>`;
}
function toggleUbuntuMenu(){ document.getElementById('ubuntuMenu').classList.toggle('hidden'); }
function renderUbuntuDock(){
  const dockApps=['chrome','files','terminal','vscode','spotify','notepad','calculator','settings'];
  document.getElementById('ubuntuDock').innerHTML=
    dockApps.map(id=>{ const a=APPS.find(x=>x.id===id); return `<button class="dock-btn" title="${a.name}" onclick="openApp('${id}')">${a.icon}</button>`; }).join('')+
    `<div style="flex:1"></div><button class="dock-btn" title="Trash" onclick="toast('Trash is empty 🗑')">🗑️</button><button class="dock-btn" title="Show Applications" onclick="toggleAppGrid()">⊞</button>`;
}
function renderUbuntuDesktop(){
  document.getElementById('ubuntuDesktop').innerHTML=`<div class="desk-grid">
    <div class="desk-icon" ondblclick="openApp('files')"><span class="ic">🏠</span>Home</div>
    <div class="desk-icon" ondblclick="toast('Trash is empty 🗑')"><span class="ic">🗑️</span>Trash</div>
    <div class="desk-icon" ondblclick="openApp('chrome')"><span class="ic">🌐</span>Chrome</div>
    <div class="desk-icon" ondblclick="openApp('spotify')"><span class="ic">🎵</span>Spotify</div>
    <div class="desk-icon" ondblclick="openApp('terminal')"><span class="ic">⬛</span>Terminal</div>
  </div>`;
}
function toggleActivities(){
  const el=document.getElementById('ubuntuActivities');
  el.classList.toggle('hidden');
  if(!el.classList.contains('hidden')){
    el.innerHTML=`<input placeholder="Type to search..." oninput="actSearch(this.value)"><div class="act-grid" id="actGrid">${APPS.map(a=>`<button class="act-app" onclick="openApp('${a.id}');toggleActivities()"><span class="ic">${a.icon}</span>${a.name}</button>`).join('')}</div><p style="text-align:center;color:#aaa;margin-top:20px;font-size:12px">Click an app to open • Click outside to close</p>`;
    el.onclick=(e)=>{ if(e.target===el) el.classList.add('hidden'); };
  }
}
function actSearch(q){
  const g=document.getElementById('actGrid'); if(!g) return;
  const hits=APPS.filter(a=>a.name.toLowerCase().includes(q.toLowerCase()));
  g.innerHTML=hits.map(a=>`<button class="act-app" onclick="openApp('${a.id}');toggleActivities()"><span class="ic">${a.icon}</span>${a.name}</button>`).join('')||`<div style="color:#fff;padding:20px">No apps found</div>`;
}
function toggleAppGrid(){
  const el=document.getElementById('ubuntuAppGrid');
  el.classList.toggle('hidden');
  if(!el.classList.contains('hidden')){
    el.innerHTML=`<input placeholder="Search applications..." oninput="actSearch(this.value)" style="width:100%;max-width:560px;margin:0 auto 20px;display:block;padding:13px 18px;border-radius:99px;border:none;font-size:15px;outline:none"><div class="act-grid" id="actGrid">${APPS.map(a=>`<button class="act-app" onclick="openApp('${a.id}');toggleAppGrid()"><span class="ic">${a.icon}</span>${a.name}</button>`).join('')}</div>`;
    el.style.cssText='position:absolute;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(10px);z-index:9400;padding:70px 24px;overflow:auto';
    el.onclick=(e)=>{ if(e.target===el) el.classList.add('hidden'); };
  }
}

window._openApp = function(appId, extra){
  const container=document.getElementById('ubuntuWindows');
  const app=APPS.find(a=>a.id===appId) || {name:appId, icon:'📦'};
  let body='', onOpen=null, w=760, h=500;
  switch(appId){
    case 'chrome': body=chromeHTML(); w=900; h=560; break;
    case 'files': body=filesHTML(); w=860; h=520; onOpen=()=>renderExplorer(); break;
    case 'spotify': body=spotifyHTML(); w=880; h=560; break;
    case 'terminal': body=terminalHTML('bash'); w=680; h=420; onOpen=(win)=>initTerminal(win,'bash'); break;
    case 'notepad': body=notepadHTML(extra); w=620; h=440; break;
    case 'calculator': body=calculatorHTML(); w=340; h=480; onOpen=(win)=>initCalculator(win); break;
    case 'settings': body=settingsHTML('ubuntu'); w=680; h=500; onOpen=(win)=>initSettings(win,'ubuntu'); break;
    case 'photos': body=photosHTML(); w=720; h=500; break;
    case 'store': body=storeHTML(); w=760; h=520; break;
    case 'vscode': body=vscodeHTML(); w=880; h=540; break;
    case 'clock': body=clockHTML(); w=640; h=460; onOpen=()=>{ const tick=()=>{ const b=document.getElementById('clockBig'); if(b){ const d=new Date(); b.textContent=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}); document.getElementById('clockDate').textContent=d.toLocaleDateString([],{weekday:'long',day:'numeric',month:'long'}); }}; tick(); setInterval(tick,1000); }; break;
    case 'about': body=aboutHTML('Ubuntu'); w=560; h=480; break;
    default: body=`<div style="padding:30px;text-align:center"><div style="font-size:48px">${app.icon}</div><h3>${app.name}</h3><p style="color:#666;margin-top:8px">Coming soon.</p></div>`;
  }
  // Ubuntu windows offset for dock/topbar
  const win=makeWindow(container, {id:appId, title:app.name, icon:app.icon, bodyHTML:body, w, h, x:80+Math.random()*60, y:50+Math.random()*40, onOpen});
  win.style.top='calc('+win.style.top+' + 32px)';
};
