// ===== iOS =====
let iosLocked=true, iosCurrentApp=null, iosBrightness=100;
const IOS_APPS=[
  {id:'messages', name:'Messages', icon:'💬', bg:'#34c759', badge:3},
  {id:'safari', name:'Safari', icon:'🧭', bg:'#fff'},
  {id:'music', name:'Music', icon:'🎵', bg:'#ff2d55'},
  {id:'photos', name:'Photos', icon:'🌸', bg:'#fff'},
  {id:'camera', name:'Camera', icon:'📷', bg:'#f2f2f7'},
  {id:'maps', name:'Maps', icon:'🗺️', bg:'#fff'},
  {id:'clock', name:'Clock', icon:'🕐', bg:'#000'},
  {id:'weather', name:'Weather', icon:'☀️', bg:'#0a84ff'},
  {id:'notes', name:'Notes', icon:'📝', bg:'#fff'},
  {id:'reminders', name:'Reminders', icon:'✅', bg:'#fff'},
  {id:'settings', name:'Settings', icon:'⚙️', bg:'#f2f2f7'},
  {id:'calculator', name:'Calculator', icon:'🧮', bg:'#000'},
  {id:'files', name:'Files', icon:'📁', bg:'#0a84ff'},
  {id:'appstore', name:'App Store', icon:'🅰️', bg:'#0a84ff'},
  {id:'phone', name:'Phone', icon:'📞', bg:'#34c759'},
  {id:'spotify', name:'Spotify', icon:'🎵', bg:'#1db954'},
  {id:'chrome', name:'Chrome', icon:'🌐', bg:'#fff'},
  {id:'wallet', name:'Wallet', icon:'👛', bg:'#000'},
];
const IOS_DOCK=['phone','safari','messages','music'];

function initIOS(){
  iosLocked=true; iosCurrentApp=null;
  renderIOSHome();
  updateIOSClock(); setInterval(updateIOSClock,1000);
}
function iosStatusHTML(){
  const d=new Date();
  return `<div class="ios-status"><span id="iosTime">${d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}).replace(/\s?[AP]M/i,'')}</span><span>📶 📡 🔋</span></div><div class="ios-notch"></div>`;
}
function updateIOSClock(){
  const el=document.getElementById('iosTime'); if(!el) return;
  const d=new Date(); el.textContent=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}).replace(/\s?[AP]M/i,'');
  const lt=document.getElementById('lockTime'); if(lt) lt.textContent=d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}).replace(/\s?[AP]M/i,'');
  const ld=document.getElementById('lockDate'); if(ld) ld.textContent=d.toLocaleDateString([],{weekday:'long',month:'long',day:'numeric'});
}
function renderIOSHome(){
  const screen=document.getElementById('iphoneScreen');
  const d=new Date();
  screen.innerHTML=`
    ${iosStatusHTML()}
    <div class="ios-home" id="iosHome">
      <div class="ios-widgets">
        <div class="ios-widget"><h4>Clock</h4><div class="big" id="wClock">${d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</div><div style="font-size:12px;color:#666">${d.toLocaleDateString([],{weekday:'long'})}</div></div>
        <div class="ios-widget dark"><h4>Weather • Kota</h4><div class="big">28° ☀️</div><div style="font-size:12px;opacity:.8">Sunny • H:32 L:18</div></div>
        <div class="ios-widget dark"><h4>🎵 Now Playing</h4><div style="font-size:13px;font-weight:700;margin-top:4px">${currentSongIdx>=0?SONGS[currentSongIdx].title:'Music'}</div><div style="font-size:11px;opacity:.8">${currentSongIdx>=0?SONGS[currentSongIdx].artist:'Tap Music app'}</div><button onclick="openIOSApp('music')" style="margin-top:8px;background:#fff;color:#000;padding:5px 10px;border-radius:99px;font-size:11px;font-weight:700">▶ Play</button></div>
        <div class="ios-widget"><h4>Battery</h4><div class="big">85%</div><div style="font-size:12px;color:#666">🔋 Good</div></div>
      </div>
      <div class="ios-apps">${IOS_APPS.map(a=>`<button class="ios-app" onclick="openIOSApp('${a.id}')"><span class="ic" style="background:${a.bg}">${a.icon}${a.badge?`<span class="badge">${a.badge}</span>`:''}</span>${a.name}</button>`).join('')}</div>
    </div>
    <div class="ios-dock">${IOS_DOCK.map(id=>{ const a=IOS_APPS.find(x=>x.id===id); return `<button class="ios-app" onclick="openIOSApp('${id}')"><span class="ic" style="background:${a.bg}">${a.icon}</span>${a.name}</button>`; }).join('')}</div>
    <div class="ios-homebar" onclick="goHomeIOS()"></div>
    ${iosLocked?`<div class="ios-lock" id="iosLock">
      <div style="font-size:28px">🔒</div>
      <div class="time" id="lockTime">--:--</div><div class="date" id="lockDate"></div>
      <div class="notif"><b>💬 Messages</b> • 3 new<br><span style="opacity:.85">You have new messages</span></div>
      <div class="notif"><b>🎵 Music</b><br><span style="opacity:.85">8 songs ready to play</span></div>
      <button onclick="unlockIOS()">Swipe up to unlock ↑</button>
    </div>`:''}
    <div id="iosAppLayer"></div>
    <div id="iosCCLayer"></div>
  `;
  // swipe down from top for control center (click status bar)
  screen.querySelector('.ios-status').addEventListener('click', toggleControlCenter);
  updateIOSClock();
}
function unlockIOS(){ iosLocked=false; const l=document.getElementById('iosLock'); if(l) l.remove(); toast('Welcome to iOS 👋'); }
function goHomeIOS(){ iosCurrentApp=null; const l=document.getElementById('iosAppLayer'); if(l) l.innerHTML=''; const c=document.getElementById('iosCCLayer'); if(c) c.innerHTML=''; }
function toggleControlCenter(){
  const layer=document.getElementById('iosCCLayer'); if(!layer) return;
  if(layer.innerHTML){ layer.innerHTML=''; return; }
  layer.innerHTML=`<div class="ios-cc" onclick="if(event.target===this)this.innerHTML=''">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><b>Control Center</b><button onclick="document.getElementById('iosCCLayer').innerHTML=''">✕</button></div>
    <div class="cc-grid">
      <div class="cc-tile on" onclick="this.classList.toggle('on')"><span class="ic">✈️</span>Airplane</div>
      <div class="cc-tile on" onclick="this.classList.toggle('on')"><span class="ic">📶</span>Wi-Fi</div>
      <div class="cc-tile" onclick="this.classList.toggle('on')"><span class="ic">🔵</span>Bluetooth</div>
      <div class="cc-tile" onclick="this.classList.toggle('on')"><span class="ic">🌙</span>Focus</div>
      <div class="cc-tile" onclick="openIOSApp('music');document.getElementById('iosCCLayer').innerHTML=''"><span class="ic">🎵</span>Music</div>
      <div class="cc-tile" onclick="openIOSApp('camera');document.getElementById('iosCCLayer').innerHTML=''"><span class="ic">📷</span>Camera</div>
    </div>
    <div class="cc-slider">☀️ Brightness<input type="range" min="40" max="100" value="${iosBrightness}" oninput="iosBrightness=this.value;document.getElementById('iphoneScreen').style.filter='brightness('+(this.value/100)+')'"></div>
    <div class="cc-slider">🔊 Volume<input type="range" min="0" max="100" value="80" oninput="audioEl.volume=this.value/100"></div>
    <button class="big-btn gray" style="width:100%;margin-top:12px" onclick="exitOS()">🔄 Change OS</button>
  </div>`;
}

function openIOSApp(id){
  iosCurrentApp=id;
  const layer=document.getElementById('iosAppLayer');
  let body='';
  switch(id){
    case 'messages': body=iosMessagesHTML(); break;
    case 'safari': case 'chrome': body=iosSafariHTML(); break;
    case 'music': body=iosMusicHTML(); break;
    case 'spotify': body=iosSpotifyHTML(); break;
    case 'photos': body=iosPhotosHTML(); break;
    case 'camera': body=iosCameraHTML(); break;
    case 'clock': body=iosClockHTML(); break;
    case 'weather': body=iosWeatherHTML(); break;
    case 'notes': body=iosNotesHTML(); break;
    case 'reminders': body=iosRemindersHTML(); break;
    case 'settings': body=iosSettingsHTML(); break;
    case 'calculator': body=iosCalcHTML(); break;
    case 'files': body=iosFilesHTML(); break;
    case 'appstore': body=iosStoreHTML(); break;
    case 'phone': body=iosPhoneHTML(); break;
    case 'maps': body=iosMapsHTML(); break;
    case 'wallet': body=iosWalletHTML(); break;
    default: body=`<div class="ios-card" style="text-align:center;padding:30px"><div style="font-size:48px">📦</div><h3>${id}</h3><p style="color:#888">Coming soon</p></div>`;
  }
  const app=IOS_APPS.find(a=>a.id===id)||{name:id,icon:'📦'};
  layer.innerHTML=`<div class="ios-app-screen">
    <div class="ios-app-head"><button onclick="goHomeIOS()">‹ Home</button><h2>${app.icon} ${app.name}</h2><button onclick="goHomeIOS()">Done</button></div>
    <div class="ios-app-body" style="display:flex;flex-direction:column">${body}</div>
  </div>`;
  if(id==='files') renderIOSFiles();
  if(id==='calculator') initIOSCalc();
  if(id==='clock') initIOSClockApp();
  if(id==='music'||id==='spotify') refreshIOSMusic();
}

function iosMessagesHTML(){
  return `<div id="chatBox" style="flex:1;overflow:auto;padding:6px 2px">
    <div class="msg-bubble msg-in">Hey! 👋 Welcome to iOS Messages</div>
    <div class="msg-bubble msg-out">Hi! This is working! 🎉</div>
    <div class="msg-bubble msg-in">Try sending a message below — I'll reply!</div>
  </div>
  <div class="chat-input"><input id="chatInput" placeholder="iMessage" onkeydown="if(event.key==='Enter')sendMsg()"><button onclick="sendMsg()">↑</button></div>`;
}
function sendMsg(){
  const inp=document.getElementById('chatInput'); const txt=inp.value.trim(); if(!txt) return;
  const box=document.getElementById('chatBox');
  box.innerHTML+=`<div class="msg-bubble msg-out">${escapeHtml(txt)}</div>`; inp.value=''; box.scrollTop=99999;
  setTimeout(()=>{ box.innerHTML+=`<div class="msg-bubble msg-in">${['Nice! 😊','Haha, got it!','Let me check... ✅','Sounds good! 👍','Try Spotify — music is playing 🎵'][Math.floor(Math.random()*5)]}</div>`; box.scrollTop=99999; },700);
}
function iosSafariHTML(){
  return `<div class="browser" style="flex:1">
    <div class="browser-bar"><button onclick="history.back()">←</button><input id="safariUrl" value="https://www.google.com" onkeydown="if(event.key==='Enter')navigateIOSBrowser(this.value)"><button onclick="navigateIOSBrowser(document.getElementById('safariUrl').value)">➤</button></div>
    <div id="safariHome" class="browser-home"><h2>🧭 Safari</h2><div class="searchbox"><input placeholder="Search..." onkeydown="if(event.key==='Enter')navigateIOSBrowser('https://www.google.com/search?q='+encodeURIComponent(this.value))"><button>Go</button></div><div class="quick-links"><button onclick="navigateIOSBrowser('https://www.google.com')">Google</button><button onclick="navigateIOSBrowser('https://en.wikipedia.org')">Wikipedia</button><button onclick="navigateIOSBrowser('https://github.com')">GitHub</button><button onclick="navigateIOSBrowser('https://example.com')">Example</button></div></div>
    <iframe id="safariFrame" class="browser-frame hidden" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
  </div>`;
}
function navigateIOSBrowser(url){
  if(!url.startsWith('http')) url='https://'+url;
  const f=document.getElementById('safariFrame'), h=document.getElementById('safariHome');
  f.classList.remove('hidden'); if(h) h.classList.add('hidden'); f.src=url;
}
function iosMusicHTML(){
  const s=currentSongIdx>=0?SONGS[currentSongIdx]:SONGS[0];
  return `<div class="ios-music">
    <div class="art" id="iosArt" style="background:${s.color}">${s.emoji}</div>
    <div style="text-align:center;padding:0 20px"><b id="iosTitle" style="font-size:18px">${s.title}</b><div id="iosArtist" style="color:#888;font-size:14px">${s.artist}</div></div>
    <input type="range" min="0" max="100" value="0" oninput="if(audioEl.duration)audioEl.currentTime=this.value/100*audioEl.duration">
    <div class="controls"><button onclick="prevSong();refreshIOSMusic()">⏮</button><button class="play" onclick="togglePlay();refreshIOSMusic()">${audioEl.paused?'▶':'⏸'}</button><button onclick="nextSong();refreshIOSMusic()">⏭</button></div>
    <div style="overflow:auto;padding:0 16px 16px"><b style="font-size:13px;color:#888">UP NEXT</b>${SONGS.map((x,i)=>`<div class="song-row" style="color:#111" onclick="playSong(${i});refreshIOSMusic()"><div class="song-art" style="background:${x.color}">${x.emoji}</div><div class="song-meta"><b>${x.title}</b><span style="color:#888">${x.artist}</span></div>${i===currentSongIdx?'🔊':''}</div>`).join('')}</div>
  </div>`;
}
function refreshIOSMusic(){
  const s=currentSongIdx>=0?SONGS[currentSongIdx]:null; if(!s) return;
  const a=document.getElementById('iosArt'); if(a){ a.style.background=s.color; a.textContent=s.emoji; }
  const t=document.getElementById('iosTitle'); if(t) t.textContent=s.title;
  const ar=document.getElementById('iosArtist'); if(ar) ar.textContent=s.artist;
}
function iosSpotifyHTML(){
  return `<div style="background:#121212;color:#fff;border-radius:14px;padding:14px;flex:1;overflow:auto">
    <h2 style="margin-bottom:10px">🎵 Spotify</h2>
    ${SONGS.map((s,i)=>`<div class="song-row" onclick="playSong(${i})"><div class="song-art" style="background:${s.color}">${s.emoji}</div><div class="song-meta"><b>${s.title}</b><span>${s.artist}</span></div>${i===currentSongIdx?'🔊':''}</div>`).join('')}
  </div>`;
}
function iosPhotosHTML(){
  const pics=[["🏖️","#2563eb"],["🌸","#ec4899"],["🌿","#10b981"],["🌅","#f59e0b"],["🏔️","#6366f1"],["🌊","#06b6d4"],["🔥","#ef4444"],["⭐","#eab308"],["🦋","#a855f7"]];
  return `<div class="photo-grid">${pics.map(p=>`<div style="background:${p[1]}">${p[0]}</div>`).join('')}</div><p style="text-align:center;color:#888;font-size:12px;margin-top:10px">9 photos • Tap Camera to take a photo</p>`;
}
function iosCameraHTML(){
  return `<div class="camera-view" id="camView">🏞️<div class="flash" id="camFlash"></div><div style="position:absolute;top:12px;left:12px;background:rgba(0,0,0,.5);padding:6px 10px;border-radius:99px;font-size:12px">📷 Photo</div></div>
  <button class="shutter" onclick="takePhoto()"></button><p style="text-align:center;color:#888;font-size:12px;padding-bottom:10px">Tap shutter to capture</p>`;
}
function takePhoto(){
  const f=document.getElementById('camFlash'); f.classList.add('go'); setTimeout(()=>f.classList.remove('go'),400);
  toast('📸 Photo saved to Photos!');
}
function iosClockHTML(){
  return `<div style="text-align:center;padding:10px">
    <div class="stopwatch" id="swTime">00:00.00</div>
    <div style="display:flex;gap:10px;justify-content:center"><button class="big-btn green" id="swBtn" onclick="toggleStopwatch()">Start</button><button class="big-btn gray" onclick="resetStopwatch()">Reset</button></div>
    <div class="ios-list" style="margin-top:18px;text-align:left">
      <div class="row"><span class="ic" style="background:#ff9f0a">🌍</span><div class="grow"><b>World Clock</b><div class="sub">Kota, India</div></div><b id="wcLocal">--:--</b></div>
      <div class="row"><span class="ic" style="background:#0a84ff">⏰</span><div class="grow"><b>Alarm</b><div class="sub">7:00 AM • Weekdays</div></div><span class="toggle on" onclick="this.classList.toggle('on')"></span></div>
      <div class="row"><span class="ic" style="background:#34c759">⏱️</span><div class="grow"><b>Timer</b><div class="sub">5 minutes</div></div><b>05:00</b></div>
    </div>
  </div>`;
}
let swInterval=null, swStart=0, swElapsed=0;
function toggleStopwatch(){
  const btn=document.getElementById('swBtn');
  if(swInterval){ clearInterval(swInterval); swInterval=null; btn.textContent='Resume'; }
  else{ swStart=Date.now()-swElapsed; swInterval=setInterval(()=>{ swElapsed=Date.now()-swStart; const el=document.getElementById('swTime'); if(el){ const m=Math.floor(swElapsed/60000), s=Math.floor(swElapsed/1000)%60, cs=Math.floor(swElapsed/10)%100; el.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+'.'+String(cs).padStart(2,'0'); } },10); btn.textContent='Pause'; }
}
function resetStopwatch(){ clearInterval(swInterval); swInterval=null; swElapsed=0; const el=document.getElementById('swTime'); if(el) el.textContent='00:00.00'; const b=document.getElementById('swBtn'); if(b) b.textContent='Start'; }
function initIOSClockApp(){ const el=document.getElementById('wcLocal'); if(el) el.textContent=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}); }
function iosWeatherHTML(){
  return `<div style="background:linear-gradient(160deg,#0a84ff,#5ac8fa);color:#fff;border-radius:18px;padding:20px;text-align:center">
    <div style="font-size:18px">Kota, Rajasthan</div><div style="font-size:64px;font-weight:200">28°</div><div>☀️ Sunny</div><div style="opacity:.85;font-size:13px">H:32° L:18° • Clear tonight</div></div>
    <div class="ios-list" style="margin-top:12px">${["Today ☀️ 28°","Tue 🌤️ 30°","Wed 🌧️ 24°","Thu ☀️ 31°","Fri 🌤️ 29°"].map(d=>`<div class="row"><div class="grow"><b>${d}</b></div><span>›</span></div>`).join('')}</div>`;
}
function iosNotesHTML(){
  const saved=localStorage.getItem('ios_notes')||'Welcome to Notes!\n\nType here — it saves automatically.';
  return `<textarea id="iosNotes" style="flex:1;border:none;outline:none;padding:14px;font-size:15px;line-height:1.6;resize:none;border-radius:14px" oninput="localStorage.setItem('ios_notes',this.value)">${escapeHtml(saved)}</textarea><p style="text-align:center;color:#888;font-size:11px;padding:8px">💾 Auto-saved</p>`;
}
function iosRemindersHTML(){
  return `<div class="ios-list">${["✅ Try Windows OS","✅ Play a song in Spotify","✅ Create a folder in Files","✅ Take a photo in Camera","✅ Send a message"].map((r,i)=>`<div class="row"><input type="checkbox" ${i<2?'checked':''} onchange="this.parentElement.style.opacity=this.checked?.5:1"><div class="grow">${r}</div></div>`).join('')}</div><button class="big-btn" style="width:100%" onclick="toast('Reminder added ✅')">+ New Reminder</button>`;
}
function iosSettingsHTML(){
  return `<div class="ios-list">
    <div class="row"><span class="ic" style="background:#8e8e93">👤</span><div class="grow"><b>User</b><div class="sub">iCloud • Apple ID</div></div><span>›</span></div>
    <div class="row"><span class="ic" style="background:#ff9f0a">✈️</span><div class="grow"><b>Airplane Mode</b></div><span class="toggle" onclick="this.classList.toggle('on')"></span></div>
    <div class="row"><span class="ic" style="background:#0a84ff">📶</span><div class="grow"><b>Wi-Fi</b><div class="sub">HomeWiFi</div></div><span>›</span></div>
    <div class="row"><span class="ic" style="background:#0a84ff">🔵</span><div class="grow"><b>Bluetooth</b></div><span class="toggle on" onclick="this.classList.toggle('on')"></span></div>
    <div class="row"><span class="ic" style="background:#34c759">🔋</span><div class="grow"><b>Battery</b><div class="sub">85%</div></div><span>›</span></div>
    <div class="row"><span class="ic" style="background:#8e8e93">ℹ️</span><div class="grow"><b>About</b><div class="sub">iOS Simulator 1.0</div></div><span>›</span></div>
  </div>
  <div class="ios-card">☀️ Brightness <input type="range" style="width:100%" min="40" max="100" value="100" oninput="document.getElementById('iphoneScreen').style.filter='brightness('+(this.value/100)+')'"></div>
  <button class="big-btn gray" style="width:100%" onclick="exitOS()">🔄 Change OS</button>`;
}
function iosCalcHTML(){
  return `<div style="background:#000;color:#fff;border-radius:18px;padding:16px;flex:1;display:flex;flex-direction:column">
    <div id="iosCalcDisp" style="text-align:right;font-size:44px;font-weight:200;padding:20px 10px;min-height:80px">0</div>
    <div id="iosCalcGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px"></div>
  </div>`;
}
function initIOSCalc(){
  const grid=document.getElementById('iosCalcGrid'), disp=document.getElementById('iosCalcDisp'); if(!grid) return;
  const keys=['AC','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','='];
  let expr='';
  grid.innerHTML=keys.map(k=>{
    let bg='#333', col='#fff';
    if('÷×−+%'.includes(k)){ bg='#ff9f0a'; }
    if(k==='='){ bg='#ff9f0a'; }
    if(k==='AC'||k==='±'){ bg='#a5a5a5'; col='#000'; }
    if(k==='0'){ return `<button style="grid-column:span 2;background:${bg};color:${col};border-radius:99px;height:60px;font-size:22px;text-align:left;padding-left:22px" data-k="${k}">${k}</button>`; }
    return `<button style="background:${bg};color:${col};border-radius:50%;height:60px;font-size:22px" data-k="${k}">${k}</button>`;
  }).join('');
  grid.addEventListener('click', e=>{
    const b=e.target.closest('button'); if(!b) return; const k=b.dataset.k;
    if(k==='AC') expr='';
    else if(k==='='){ try{ expr=String(Math.round(eval(expr.replace('×','*').replace('÷','/').replace('−','-'))*1e10)/1e10); }catch{ expr='Error'; } }
    else if(k==='±'){ expr=expr?String(-eval(expr)):''; }
    else if(k==='%'){ try{ expr=String(eval(expr)/100); }catch{} }
    else expr+=k;
    disp.textContent=expr||'0';
  });
}
function iosFilesHTML(){
  return `<div class="ios-list" id="iosFileList"></div><div style="display:flex;gap:8px"><button class="big-btn" style="flex:1" onclick="iosNewFolder()">📁 New Folder</button><button class="big-btn gray" style="flex:1" onclick="toast('Upload coming soon')">☁️ iCloud</button></div>`;
}
function renderIOSFiles(){
  const el=document.getElementById('iosFileList'); if(!el) return;
  el.innerHTML=FS["Home"].map(it=>`<div class="row" onclick="iosOpenFile('${it.name.replace(/'/g,"\\'")}')"><span class="ic" style="background:${it.type==='folder'?'#0a84ff':'#f2f2f7'}">${it.type==='folder'?'📁':it.type==='audio'?'🎵':'📄'}</span><div class="grow"><b>${it.name}</b><div class="sub">${fmtSize(it)}</div></div><span>›</span></div>`).join('');
}
function iosNewFolder(){ const n=prompt('Folder name:','New Folder'); if(n){ FS["Home"].push({name:n,type:'folder',children:[]}); saveFS(FS); renderIOSFiles(); toast('Folder created 📁'); } }
function iosOpenFile(name){
  const it=FS["Home"].find(i=>i.name===name); if(!it) return;
  if(it.type==='folder') return toast('📁 '+name+' — '+it.children.length+' items');
  if(it.type==='audio'){ const idx=SONGS.findIndex(s=>s.id===it.songId); if(idx>=0) playSong(idx); return; }
  toast('📄 '+name);
}
function iosStoreHTML(){
  return `<div class="ios-list">${[["🎮","Game Hub","Games"],["💬","Chat Pro","Social"],["🎬","Video+","Entertainment"],["📸","Photo Lab","Photo"]].map(a=>`<div class="row"><span class="ic" style="background:#f2f2f7;font-size:20px">${a[0]}</span><div class="grow"><b>${a[1]}</b><div class="sub">${a[2]}</div></div><button class="big-btn" onclick="toast('Downloading ${a[1]}...')">GET</button></div>`).join('')}</div>`;
}
function iosPhoneHTML(){
  return `<div style="text-align:center"><div id="dialNum" style="font-size:32px;min-height:44px;margin:10px 0"></div>
  <div class="keypad">${['1','2','3','4','5','6','7','8','9','*','0','#'].map(k=>`<button onclick="dial('${k}')">${k}</button>`).join('')}</div>
  <button class="big-btn green" style="margin-top:14px;padding:12px 28px" onclick="toast('Calling '+ (document.getElementById('dialNum').textContent||'...') +' 📞')">📞 Call</button></div>`;
}
function dial(k){ const el=document.getElementById('dialNum'); el.textContent+=k; }
function iosMapsHTML(){
  return `<div style="background:linear-gradient(135deg,#a7f3d0,#bfdbfe);border-radius:18px;height:260px;display:grid;place-items:center;font-size:42px;position:relative">🗺️<span style="position:absolute;top:40%;left:45%;font-size:28px">📍</span></div><div class="ios-card" style="margin-top:12px"><b>📍 Kota, Rajasthan</b><div style="color:#888;font-size:13px">Your current location</div></div>`;
}
function iosWalletHTML(){
  return `<div class="ios-card" style="background:linear-gradient(135deg,#111,#333);color:#fff"><b>💳 Apple Card</b><div style="font-size:20px;margin-top:10px">•••• 4242</div><div style="opacity:.7;font-size:12px">USER</div></div><div class="ios-card"><b>🎟️ Boarding Pass</b><div style="color:#888;font-size:13px;margin-top:6px">No passes yet</div></div>`;
}
