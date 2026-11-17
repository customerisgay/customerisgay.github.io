// ===== WINDOWS 11 =====
let winOpenApps = new Set();
function initWindows(){
  const desk=document.getElementById('winDesktop');
  desk.innerHTML=`<div class="desk-grid">${APPS.map(a=>`<div class="desk-icon" ondblclick="openApp('${a.id}')" onclick="this.classList.add('sel');setTimeout(()=>this.classList.remove('sel'),400)"><span class="ic">${a.icon}</span>${a.name}</div>`).join('')}</div>`;
  renderWinTaskbar(); renderWinStart();
  // desktop context menu
  desk.addEventListener('contextmenu', e=>{
    e.preventDefault();
    const ctx=document.getElementById('winCtx');
    ctx.innerHTML=`<button onclick="openApp('files')">📁 Open File Explorer</button><button onclick="openApp('terminal')">⬛ Open Terminal</button><button onclick="setWallpaper(Math.floor(Math.random()*WALLPAPERS_WIN.length),'windows')">🖼️ Change Wallpaper</button><button onclick="openApp('settings')">⚙️ Settings</button><button onclick="exitOS()">🔄 Change OS</button>`;
    ctx.style.left=e.clientX+'px'; ctx.style.top=e.clientY+'px'; ctx.classList.remove('hidden');
  });
  document.addEventListener('click', e=>{
    if(!e.target.closest('#winCtx')) document.getElementById('winCtx').classList.add('hidden');
    if(!e.target.closest('#winStart') && !e.target.closest('[data-start-btn]')) document.getElementById('winStart').classList.add('hidden');
    if(!e.target.closest('#winSearch') && !e.target.closest('[data-search-btn]')) document.getElementById('winSearch').classList.add('hidden');
    if(!e.target.closest('#winTrayMenu') && !e.target.closest('[data-tray-btn]')) document.getElementById('winTrayMenu').classList.add('hidden');
  });
  updateWinClock(); setInterval(updateWinClock,1000);
}
function updateWinClock(){
  const el=document.getElementById('winClock'); if(!el) return;
  const d=new Date();
  el.innerHTML=`<div>${d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</div><div style="font-size:11px">${d.toLocaleDateString([],{day:'numeric',month:'numeric',year:'numeric'})}</div>`;
}
function renderWinTaskbar(){
  const tb=document.getElementById('winTaskbar');
  tb.innerHTML=`
    <div class="win-task-center">
      <button class="task-btn" data-start-btn onclick="toggleStart()" title="Start">🪟</button>
      <button class="task-btn" data-search-btn onclick="toggleSearch()" title="Search">🔍</button>
      <button class="task-btn" onclick="toast('Task View — all windows are on desktop')" title="Task View">🗂️</button>
      <button class="task-btn" onclick="openApp('chrome')" title="Chrome">🌐</button>
      <button class="task-btn" onclick="openApp('files')" title="File Explorer">📁</button>
      <button class="task-btn" onclick="openApp('spotify')" title="Spotify">🎵</button>
      <button class="task-btn" onclick="openApp('store')" title="Store">🛍️</button>
      <button class="task-btn" onclick="openApp('settings')" title="Settings">⚙️</button>
    </div>
    <div class="win-tray">
      <div class="tray-icons"><span>📶</span><span>🔊</span><span>🔋</span></div>
      <div class="win-clock" id="winClock" data-tray-btn onclick="toggleTray()">--:--</div>
    </div>`;
  document.getElementById('winTrayMenu').innerHTML=`
    <div style="display:flex;justify-content:space-between"><b>Quick Settings</b><span id="trayDate"></span></div>
    <div class="tray-tiles">
      <div class="tray-tile on">📶<br>Wi-Fi</div><div class="tray-tile">🔵<br>Bluetooth</div><div class="tray-tile on">✈️<br>Airplane</div>
      <div class="tray-tile">🌙<br>Night light</div><div class="tray-tile on">🔋<br>Battery</div><div class="tray-tile">♿<br>Accessibility</div>
    </div>
    <div style="font-size:12px">🔊 Volume <input type="range" style="width:100%" value="80" oninput="audioEl.volume=this.value/100"></div>
    <div style="font-size:12px;margin-top:8px">☀️ Brightness <input type="range" style="width:100%" value="100" oninput="document.body.style.filter='brightness('+(this.value/100)+')'"></div>
    <div style="display:flex;gap:8px;margin-top:12px"><button class="big-btn gray" onclick="exitOS()">🔄 Change OS</button><button class="big-btn gray" onclick="toast('Shutting down... (just kidding 😄)')">⏻ Power</button></div>`;
}
function toggleStart(){ document.getElementById('winStart').classList.toggle('hidden'); document.getElementById('winSearch').classList.add('hidden'); }
function toggleSearch(){ document.getElementById('winSearch').classList.toggle('hidden'); document.getElementById('winStart').classList.add('hidden'); }
function toggleTray(){ const m=document.getElementById('winTrayMenu'); m.classList.toggle('hidden'); const d=document.getElementById('trayDate'); if(d) d.textContent=new Date().toLocaleDateString([],{weekday:'long',day:'numeric',month:'long'}); }
function renderWinStart(){
  document.getElementById('winStart').innerHTML=`
    <input class="start-search" placeholder="Type here to search" oninput="startSearch(this.value)">
    <h3>Pinned</h3><div class="pinned-grid" id="pinnedGrid">${APPS.map(a=>`<button class="pinned-app" onclick="openApp('${a.id}');document.getElementById('winStart').classList.add('hidden')"><span class="ic">${a.icon}</span>${a.name}</button>`).join('')}</div>
    <h3>Recommended</h3><div style="font-size:13px;color:#cbd5e1;line-height:2">📄 Welcome.txt — Recently added<br>🎵 Lollipop Lagelu — Played recently<br>🖼️ Wallpaper1.jpg — Yesterday</div>
    <div class="start-foot"><span>👤 User</span><button onclick="exitOS()" style="font-size:13px">⏻ Power → Change OS</button></div>`;
  document.getElementById('winSearch').innerHTML=`
    <input class="start-search" placeholder="Search apps..." oninput="searchApps(this.value,'winSearchResults')">
    <div id="winSearchResults" style="margin-top:14px"></div>`;
}
function startSearch(q){ searchApps(q,'pinnedGrid',true); }
function searchApps(q, targetId, isStart){
  const el=document.getElementById(targetId); if(!el) return;
  if(!q){ if(isStart) renderWinStart(); return; }
  const hits=APPS.filter(a=>a.name.toLowerCase().includes(q.toLowerCase()));
  el.innerHTML=hits.length?hits.map(a=>`<button class="pinned-app" onclick="openApp('${a.id}')"><span class="ic">${a.icon}</span>${a.name}</button>`).join(''):`<div style="color:#888;padding:10px">No results for "${q}"</div>`;
}

window._openApp = function(appId, extra){
  const container=document.getElementById('winWindows');
  const app=APPS.find(a=>a.id===appId) || {name:appId, icon:'📦'};
  let body='', onOpen=null, w=760, h=500;
  switch(appId){
    case 'chrome': body=chromeHTML(); w=900; h=560; break;
    case 'files': body=filesHTML(); w=860; h=520; onOpen=()=>renderExplorer(); break;
    case 'spotify': body=spotifyHTML(); w=880; h=560; break;
    case 'terminal': body=terminalHTML('PowerShell'); w=680; h=420; onOpen=(win)=>initTerminal(win,'PowerShell'); break;
    case 'notepad': body=notepadHTML(extra); w=620; h=440; break;
    case 'calculator': body=calculatorHTML(); w=340; h=480; onOpen=(win)=>initCalculator(win); break;
    case 'settings': body=settingsHTML('windows'); w=680; h=500; onOpen=(win)=>initSettings(win,'windows'); break;
    case 'photos': body=photosHTML(); w=720; h=500; break;
    case 'store': body=storeHTML(); w=760; h=520; break;
    case 'vscode': body=vscodeHTML(); w=880; h=540; break;
    case 'clock': body=clockHTML(); w=640; h=460; onOpen=()=>{ const tick=()=>{ const b=document.getElementById('clockBig'); if(b){ const d=new Date(); b.textContent=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}); document.getElementById('clockDate').textContent=d.toLocaleDateString([],{weekday:'long',day:'numeric',month:'long'}); }}; tick(); setInterval(tick,1000); }; break;
    case 'about': body=aboutHTML('Windows 11'); w=560; h=480; break;
    default: body=`<div style="padding:30px;text-align:center"><div style="font-size:48px">${app.icon}</div><h3>${app.name}</h3><p style="color:#666;margin-top:8px">This app is coming soon in the simulator.</p></div>`;
  }
  makeWindow(container, {id:appId, title:app.name, icon:app.icon, bodyHTML:body, w, h, onOpen});
  winOpenApps.add(appId);
};
window._onTaskUpdate = function(){ /* taskbar active state could go here */ };
