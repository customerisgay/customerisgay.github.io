// ===== Global Audio / Spotify Player =====
const audioEl = document.getElementById('audioEl');
let currentSongIdx = -1, isShuffle=false, isRepeat=false, liked=new Set(JSON.parse(localStorage.getItem('liked')||'[]'));

function playSong(idx){
  if(idx<0||idx>=SONGS.length) return;
  currentSongIdx = idx;
  const s = SONGS[idx];
  audioEl.src = s.url;
  audioEl.play().catch(()=>toast('Tap play again — browser blocked autoplay'));
  renderGlobalPlayer();
  refreshSpotifyUI();
}
function togglePlay(){
  if(currentSongIdx<0){ playSong(0); return; }
  if(audioEl.paused) audioEl.play(); else audioEl.pause();
  renderGlobalPlayer(); refreshSpotifyUI();
}
function nextSong(){ playSong(isShuffle ? Math.floor(Math.random()*SONGS.length) : (currentSongIdx+1)%SONGS.length); }
function prevSong(){ playSong((currentSongIdx-1+SONGS.length)%SONGS.length); }
audioEl.addEventListener('ended', ()=>{ if(isRepeat) audioEl.play(); else nextSong(); });
audioEl.addEventListener('timeupdate', ()=>{
  const p=document.getElementById('gpProgress'); if(p && audioEl.duration) p.value = (audioEl.currentTime/audioEl.duration)*100;
  document.querySelectorAll('.sp-progress input').forEach(el=>{ if(audioEl.duration) el.value=(audioEl.currentTime/audioEl.duration)*100; });
  const t=document.getElementById('gpTime'); if(t) t.textContent = fmtTime(audioEl.currentTime)+' / '+fmtTime(audioEl.duration||0);
});
function fmtTime(s){ if(!s||isNaN(s)) return '0:00'; const m=Math.floor(s/60), sec=Math.floor(s%60); return m+':'+String(sec).padStart(2,'0'); }

function renderGlobalPlayer(){
  const gp=document.getElementById('globalPlayer');
  if(currentSongIdx<0){ gp.classList.add('hidden'); return; }
  const s=SONGS[currentSongIdx];
  gp.classList.remove('hidden');
  gp.innerHTML = `
    <div class="gp-art" style="background:${s.color}">${s.emoji}</div>
    <div class="gp-meta"><b>${s.title}</b><span>${s.artist}</span><div id="gpTime" style="font-size:10px;color:#888">${fmtTime(audioEl.currentTime)} / ${fmtTime(audioEl.duration||0)}</div></div>
    <button onclick="prevSong()">⏮</button>
    <button class="gp-play" onclick="togglePlay()">${audioEl.paused?'▶':'⏸'}</button>
    <button onclick="nextSong()">⏭</button>
    <input type="range" min="0" max="100" value="${audioEl.volume*100}" oninput="audioEl.volume=this.value/100">
    <button class="gp-close" onclick="audioEl.pause();document.getElementById('globalPlayer').classList.add('hidden')">✕</button>
    <input type="range" id="gpProgress" min="0" max="100" value="0" style="position:absolute;left:14px;right:14px;bottom:2px;width:calc(100% - 28px);height:3px" oninput="if(audioEl.duration)audioEl.currentTime=this.value/100*audioEl.duration">
  `;
}
function refreshSpotifyUI(){
  document.querySelectorAll('[data-song-row]').forEach((row,i)=>{
    row.classList.toggle('playing', i===currentSongIdx);
    const eq=row.querySelector('.eq'); if(eq) eq.textContent = (i===currentSongIdx && !audioEl.paused) ? '🔊 Playing' : (liked.has(i)?'❤️':'');
  });
  renderGlobalPlayer();
}

// ===== Toast =====
let toastTimer;
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2600); }

// ===== Window Manager (shared for Win/Ubuntu) =====
let zTop=100;
function makeWindow(container, opts){
  // opts: {id,title,icon,w,h,x,y,bodyHTML,onOpen}
  const existing = container.querySelector(`[data-win="${opts.id}"]`);
  if(existing){ existing.style.zIndex=++zTop; existing.style.display='flex'; return existing; }
  const win=document.createElement('div');
  win.className='os-window'; win.dataset.win=opts.id;
  const isUbuntu = container.id==='ubuntuWindows';
  if(isUbuntu) win.style.borderRadius='12px';
  win.style.width=(opts.w||720)+'px'; win.style.height=(opts.h||480)+'px';
  win.style.left=(opts.x!==undefined?opts.x:(60+Math.random()*80))+'px';
  win.style.top=(opts.y!==undefined?opts.y:(40+Math.random()*60))+'px';
  win.style.zIndex=++zTop;
  win.innerHTML=`
    <div class="win-titlebar">
      <span class="ticon">${opts.icon}</span><span class="ttitle">${opts.title}</span>
      <button class="wbtn" onclick="minWin(this)">─</button>
      <button class="wbtn" onclick="maxWin(this)">▢</button>
      <button class="wbtn close" onclick="closeWin(this)">✕</button>
    </div>
    <div class="win-body">${opts.bodyHTML||''}</div>
    <div class="resize-handle"></div>`;
  container.appendChild(win);
  // focus
  win.addEventListener('mousedown',()=>{ win.style.zIndex=++zTop; updateTaskActive(); });
  // drag
  const bar=win.querySelector('.win-titlebar');
  bar.addEventListener('dblclick',()=>maxWin(bar));
  let dragging=false, sx, sy, ox, oy;
  bar.addEventListener('mousedown', e=>{
    if(e.target.closest('.wbtn')) return;
    if(win.classList.contains('max')) return;
    dragging=true; sx=e.clientX; sy=e.clientY; ox=win.offsetLeft; oy=win.offsetTop;
  });
  document.addEventListener('mousemove', e=>{
    if(!dragging) return;
    win.style.left=Math.max(0,ox+e.clientX-sx)+'px';
    win.style.top=Math.max(0,oy+e.clientY-sy)+'px';
  });
  document.addEventListener('mouseup', ()=>dragging=false);
  // resize
  const rh=win.querySelector('.resize-handle');
  let resizing=false, rw, rh2;
  rh.addEventListener('mousedown', e=>{ resizing=true; rw=win.offsetWidth; rh2=win.offsetHeight; sx=e.clientX; sy=e.clientY; e.stopPropagation(); });
  document.addEventListener('mousemove', e=>{
    if(!resizing) return;
    win.style.width=Math.max(320, rw+e.clientX-sx)+'px';
    win.style.height=Math.max(200, rh2+e.clientY-sy)+'px';
  });
  document.addEventListener('mouseup', ()=>resizing=false);
  if(opts.onOpen) opts.onOpen(win);
  updateTaskActive();
  return win;
}
function closeWin(btn){ const w=btn.closest('.os-window'); w.remove(); updateTaskActive(); }
function minWin(btn){ const w=btn.closest('.os-window'); w.style.display='none'; updateTaskActive(); }
function maxWin(btn){ const w=btn.closest('.os-window'); w.classList.toggle('max'); }
function updateTaskActive(){ /* hooks in win/ubuntu files override */ if(window._onTaskUpdate) window._onTaskUpdate(); }

// ===== App Body Renderers (return HTML + init fn) =====
function spotifyHTML(){
  return `<div class="spotify">
    <div class="sp-side">
      <div style="font-size:20px;font-weight:900;padding:6px 8px">🎵 Spotify</div>
      <button class="active">🏠 Home</button><button onclick="toast('Search in the top bar')">🔍 Search</button><button onclick="toast('Your Library — 8 songs')">📚 Your Library</button>
      <h4>Playlists</h4>
      <button>❤️ Liked Songs</button><button>🔥 Bhojpuri Hits</button><button>🎧 My Drive Songs</button>
      <h4>Your Songs</h4>
      <div style="font-size:12px;color:#888;padding:0 8px">8 songs from Google Drive</div>
    </div>
    <div class="sp-main">
      <div class="sp-head"><button onclick="toast('← Back')">‹</button><input placeholder="Search songs..." oninput="filterSongs(this.value)"><button onclick="toast('Premium ✨')">👑</button></div>
      <div class="sp-scroll">
        <h2>Good evening 👋</h2>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
          <span style="background:rgba(255,255,255,.12);padding:8px 12px;border-radius:99px;font-size:12px">🔥 Bhojpuri</span>
          <span style="background:rgba(255,255,255,.12);padding:8px 12px;border-radius:99px;font-size:12px">🎤 Punjabi</span>
          <span style="background:rgba(255,255,255,.12);padding:8px 12px;border-radius:99px;font-size:12px">🕌 Qawwali</span>
          <span style="background:rgba(255,255,255,.12);padding:8px 12px;border-radius:99px;font-size:12px">🌸 Old Hindi</span>
        </div>
        <div id="songList">${SONGS.map((s,i)=>songRowHTML(s,i)).join('')}</div>
      </div>
      <div class="sp-player">
        <div class="now"><div class="song-art" id="spNowArt" style="background:${currentSongIdx>=0?SONGS[currentSongIdx].color:'#333'}">${currentSongIdx>=0?SONGS[currentSongIdx].emoji:'🎵'}</div>
        <div class="song-meta"><b id="spNowTitle">${currentSongIdx>=0?SONGS[currentSongIdx].title:'No song playing'}</b><span id="spNowArtist">${currentSongIdx>=0?SONGS[currentSongIdx].artist:'Pick a song below'}</span></div></div>
        <div class="ctrl">
          <button onclick="isShuffle=!isShuffle;this.style.color=isShuffle?'#1db954':''" title="Shuffle">🔀</button>
          <button onclick="prevSong()">⏮</button>
          <button class="main" onclick="togglePlay()">${audioEl.paused?'▶':'⏸'}</button>
          <button onclick="nextSong()">⏭</button>
          <button onclick="isRepeat=!isRepeat;this.style.color=isRepeat?'#1db954':''" title="Repeat">🔁</button>
        </div>
        <div class="sp-progress"><span>0:00</span><input type="range" min="0" max="100" value="0" oninput="if(audioEl.duration)audioEl.currentTime=this.value/100*audioEl.duration"><span>0:00</span></div>
        <div class="sp-vol">🔊<input type="range" min="0" max="100" value="80" oninput="audioEl.volume=this.value/100"></div>
      </div>
    </div>
  </div>`;
}
function songRowHTML(s,i){
  return `<div class="song-row ${i===currentSongIdx?'playing':''}" data-song-row="${i}" data-title="${s.title.toLowerCase()} ${s.artist.toLowerCase()}" onclick="playSong(${i})">
    <span style="color:#888;font-size:12px;width:18px">${i+1}</span>
    <div class="song-art" style="background:${s.color}">${s.emoji}</div>
    <div class="song-meta"><b>${s.title}</b><span>${s.artist}</span></div>
    <span class="eq">${liked.has(i)?'❤️':''}</span>
    <button onclick="event.stopPropagation();toggleLike(${i})" style="font-size:16px">${liked.has(i)?'❤️':'🤍'}</button>
  </div>`;
}
function toggleLike(i){ liked.has(i)?liked.delete(i):liked.add(i); localStorage.setItem('liked',JSON.stringify([...liked])); refreshSpotifyUI(); toast(liked.has(i)?'Added to Liked Songs ❤️':'Removed from Liked'); }
function filterSongs(q){
  q=q.toLowerCase();
  document.querySelectorAll('[data-song-row]').forEach(r=>{ r.style.display = r.dataset.title.includes(q)?'flex':'none'; });
}

function chromeHTML(){
  return `<div class="browser">
    <div class="browser-tabs" id="bTabs"><div class="btab active">🌐 New Tab <span class="x" onclick="event.stopPropagation();toast('Close tab')">✕</span></div></div>
    <div class="browser-bar">
      <button onclick="history.back()">←</button><button onclick="history.forward()">→</button><button onclick="reloadBrowser(this)">↻</button>
      <input id="browserUrl" value="https://www.google.com" onkeydown="if(event.key==='Enter')navigateBrowser(this.value)">
      <button onclick="navigateBrowser(document.getElementById('browserUrl').value)">➤</button>
      <button onclick="toast('⭐ Bookmarked!')">⭐</button>
    </div>
    <div id="browserHome" class="browser-home">
      <h2>🔍 Search the Web</h2>
      <div class="searchbox"><input id="webSearch" placeholder="Search Google, YouTube, Wikipedia..." onkeydown="if(event.key==='Enter')webSearchFn(this.value)"><button onclick="webSearchFn(document.getElementById('webSearch').value)">Search</button></div>
      <div class="quick-links">
        <button onclick="navigateBrowser('https://www.google.com')">Google</button>
        <button onclick="navigateBrowser('https://www.youtube.com')">YouTube</button>
        <button onclick="navigateBrowser('https://en.wikipedia.org')">Wikipedia</button>
        <button onclick="navigateBrowser('https://github.com')">GitHub</button>
        <button onclick="navigateBrowser('https://www.bing.com')">Bing</button>
        <button onclick="navigateBrowser('https://example.com')">Example.com</button>
      </div>
      <p style="color:#888;font-size:12px;margin-top:20px">Type any URL above and press Enter. Some sites block embedding — they'll open in a new tab instead.</p>
    </div>
    <iframe id="browserFrame" class="browser-frame hidden" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
  </div>`;
}
function navigateBrowser(url){
  if(!url) return;
  if(!url.startsWith('http')) url='https://'+url;
  const frame=document.getElementById('browserFrame'), home=document.getElementById('browserHome'), input=document.getElementById('browserUrl');
  if(input) input.value=url;
  // Try iframe first
  frame.classList.remove('hidden'); if(home) home.classList.add('hidden');
  frame.src=url;
  // If blocked, user can open in new tab via button
  toast('Loading '+url+' — if blank, long-press link to open in new tab');
}
function webSearchFn(q){
  if(!q) return;
  navigateBrowser('https://www.google.com/search?q='+encodeURIComponent(q));
}
function reloadBrowser(btn){
  const f=document.getElementById('browserFrame');
  if(f && !f.classList.contains('hidden')) f.src=f.src; else toast('Nothing to reload');
}

function filesHTML(){
  return `<div class="explorer">
    <div class="exp-side" id="expSide"></div>
    <div class="exp-main">
      <div class="exp-toolbar">
        <button onclick="expBack()">←</button><button onclick="expUp()">↑</button>
        <button onclick="expNewFolder()">📁 New Folder</button>
        <button onclick="expNewFile()">📄 New File</button>
        <button onclick="expDelete()">🗑 Delete</button>
        <input placeholder="Search files..." oninput="expSearch(this.value)">
      </div>
      <div class="exp-crumbs" id="expCrumbs">Home</div>
      <div class="file-grid" id="fileGrid"></div>
      <div style="padding:8px 12px;border-top:1px solid #eee;font-size:12px;color:#666" id="expStatus"></div>
    </div>
  </div>`;
}
let expPath=[], expSelected=null, expFilter='';
function renderExplorer(){
  const side=document.getElementById('expSide'); if(!side) return;
  const folders=["Home","Documents","Downloads","Pictures","Music","Videos","Desktop"];
  side.innerHTML = folders.map(f=>`<button class="${(expPath.length===0&&f==='Home')||expPath[0]===f?'active':''}" onclick="expGo(['${f}'])">📁 ${f}</button>`).join('') +
    `<div style="margin-top:14px;padding:8px"><div style="font-size:12px;color:#666">💾 Storage</div><div class="storage-bar"><i style="width:38%"></i></div><div style="font-size:11px;color:#888">38 GB free of 64 GB</div></div>`;
  const crumbs=document.getElementById('expCrumbs');
  crumbs.textContent = 'Home' + (expPath.length? ' › '+expPath.join(' › '):'');
  const items = expPath.length===0 ? FS["Home"] : (findFolder(expPath)||[]);
  const grid=document.getElementById('fileGrid');
  const filtered = items.filter(it=>it.name.toLowerCase().includes(expFilter.toLowerCase()));
  grid.innerHTML = filtered.length ? filtered.map(it=>{
    const icon = it.type==='folder'?'📁':it.type==='audio'?'🎵':it.type==='image'?'🖼️':it.type==='video'?'🎬':it.name.endsWith('.txt')?'📄':'📄';
    return `<div class="file-item ${expSelected===it.name?'sel':''}" onclick="expSelect('${it.name.replace(/'/g,"\\'")}')" ondblclick="expOpen('${it.name.replace(/'/g,"\\'")}')">
      <span class="fic">${icon}</span>${it.name}<div style="font-size:10px;color:#888">${fmtSize(it)}</div></div>`;
  }).join('') : `<div style="grid-column:1/-1;text-align:center;color:#888;padding:30px">📂 Empty folder<br><span style="font-size:12px">Use New Folder / New File above</span></div>`;
  document.getElementById('expStatus').textContent = filtered.length+' item(s)'+(expSelected?' • Selected: '+expSelected:'');
}
function expGo(p){ expPath=p; expSelected=null; renderExplorer(); }
function expBack(){ expPath.pop(); expSelected=null; renderExplorer(); }
function expUp(){ expBack(); }
function expSearch(q){ expFilter=q; renderExplorer(); }
function expSelect(name){ expSelected=name; renderExplorer(); }
function getCurrentItems(){ return expPath.length===0?FS["Home"]:(findFolder(expPath)||[]); }
function expNewFolder(){
  const name=prompt('Folder name:','New Folder'); if(!name) return;
  getCurrentItems().push({name, type:'folder', children:[]}); saveFS(FS); renderExplorer(); toast('Folder created 📁');
}
function expNewFile(){
  const name=prompt('File name (e.g. MyNote.txt):','NewFile.txt'); if(!name) return;
  getCurrentItems().push({name, type:'file', content:''}); saveFS(FS); renderExplorer(); toast('File created 📄');
}
function expDelete(){
  if(!expSelected) return toast('Select a file first');
  const items=getCurrentItems(); const idx=items.findIndex(i=>i.name===expSelected);
  if(idx>=0){ items.splice(idx,1); saveFS(FS); expSelected=null; renderExplorer(); toast('Deleted 🗑'); }
}
function expOpen(name){
  const items=getCurrentItems(); const it=items.find(i=>i.name===name); if(!it) return;
  if(it.type==='folder'){ expPath.push(name); renderExplorer(); return; }
  if(it.type==='audio'){ const idx=SONGS.findIndex(s=>s.id===it.songId); if(idx>=0) playSong(idx); return; }
  if(it.type==='image'){ toast('🖼️ '+name); return; }
  // text file -> open notepad with content
  openApp('notepad', {fileName:name, content:it.content||''});
}

function notepadHTML(file){
  return `<div class="notepad">
    <textarea id="npText" placeholder="Start typing...">${file?escapeHtml(file.content||''):'Welcome to Notepad!\n\nType here, then click Save.'}</textarea>
    <div class="notepad-bar"><button class="big-btn" onclick="saveNotepad('${file?file.fileName.replace(/'/g,"\\'"):'Untitled.txt'}')">💾 Save</button><button class="big-btn gray" onclick="document.getElementById('npText').value=''">Clear</button><span id="npCount">0 words</span><span style="margin-left:auto">UTF-8</span></div>
  </div>`;
}
function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function saveNotepad(fname){
  const txt=document.getElementById('npText').value;
  const docs=findFolder(['Documents'])||FS["Home"];
  let ex=docs.find(i=>i.name===fname);
  if(ex) ex.content=txt; else docs.push({name:fname,type:'file',content:txt});
  saveFS(FS); toast('Saved to Documents/'+fname+' 💾');
}
document.addEventListener('input', e=>{
  if(e.target.id==='npText'){ const w=e.target.value.trim()?e.target.value.trim().split(/\s+/).length:0; const c=document.getElementById('npCount'); if(c) c.textContent=w+' words • '+e.target.value.length+' chars'; }
});

function calculatorHTML(){
  return `<div class="calc"><div class="calc-display" id="calcDisp">0</div><div class="calc-grid" id="calcGrid"></div></div>`;
}
function initCalculator(win){
  const grid=win.querySelector('#calcGrid'); const disp=win.querySelector('#calcDisp');
  const keys=['C','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','±','0','.','='];
  let expr='';
  grid.innerHTML=keys.map(k=>`<button class="${'÷×−+%'.includes(k)?'op':k==='='?'eq':''}" data-k="${k}">${k}</button>`).join('');
  grid.addEventListener('click', e=>{
    const b=e.target.closest('button'); if(!b) return; const k=b.dataset.k;
    if(k==='C'){ expr=''; }
    else if(k==='⌫'){ expr=expr.slice(0,-1); }
    else if(k==='='){ try{ expr=String(Math.round(eval(expr.replace('×','*').replace('÷','/').replace('−','-'))*1e10)/1e10); }catch{ expr='Error'; } }
    else if(k==='±'){ expr=expr?String(-eval(expr)):''; }
    else if(k==='%'){ try{ expr=String(eval(expr)/100); }catch{} }
    else expr+=k;
    disp.textContent=expr||'0';
  });
}

function terminalHTML(shell){
  return `<div class="terminal" id="termBody"><div>Welcome to ${shell||'Terminal'} — type <b>help</b> to see commands.</div><div id="termOut"></div><div><span style="color:#4ade80">${shell==='PowerShell'?'PS C:\\Users\\User>':'user@os:~$'}</span> <input id="termInput" autocomplete="off" spellcheck="false"></div></div>`;
}
function initTerminal(win, shell){
  const input=win.querySelector('#termInput'), out=win.querySelector('#termOut');
  input.focus();
  win.querySelector('.terminal').addEventListener('click',()=>input.focus());
  input.addEventListener('keydown', e=>{
    if(e.key!=='Enter') return;
    const cmd=input.value.trim(); const prompt=shell==='PowerShell'?'PS C:\\Users\\User>':'user@os:~$';
    out.innerHTML+=`<div><span style="color:#4ade80">${prompt}</span> ${escapeHtml(cmd)}</div>`;
    const [c,...args]=cmd.split(/\s+/); const arg=args.join(' ');
    let res='';
    switch(c.toLowerCase()){
      case 'help': res='Commands: help, ls, cd, echo, clear, date, whoami, open &lt;app&gt;, play, music, about, exit\nApps: chrome, files, spotify, notepad, calculator, settings'; break;
      case 'ls': res=FS["Home"].map(i=>i.name).join('   '); break;
      case 'cd': res=arg?`Changed directory to ${arg}`:'Already home'; break;
      case 'echo': res=arg; break;
      case 'clear': out.innerHTML=''; input.value=''; return;
      case 'date': res=new Date().toString(); break;
      case 'whoami': res='user'; break;
      case 'about': res='OS Simulator — Windows / Ubuntu / iOS in your browser. No install needed.'; break;
      case 'play': case 'music': playSong(0); res='▶ Playing '+SONGS[0].title; break;
      case 'open': if(arg){ openApp(arg.toLowerCase()); res='Opening '+arg+'...'; } else res='Usage: open chrome|files|spotify|notepad|calculator'; break;
      case 'exit': closeWin(input); return;
      case '': res=''; break;
      default: res=`Command not found: ${c} — type 'help'`;
    }
    if(res) out.innerHTML+=`<div style="white-space:pre-wrap">${res}</div>`;
    input.value='';
    win.querySelector('.terminal').scrollTop=99999;
  });
}

function settingsHTML(osType){
  return `<div class="settings-app">
    <h2>⚙️ Settings</h2>
    <div class="set-row"><div><b>Wallpaper</b><div style="color:#888;font-size:12px">Change desktop background</div></div><div class="wall-grid" id="wallGrid"></div></div>
    <div class="set-row"><div><b>Dark Mode</b><div style="color:#888;font-size:12px">System theme</div></div><button class="toggle on" onclick="this.classList.toggle('on');toast('Theme toggled 🌙')"></button></div>
    <div class="set-row"><div><b>Wi-Fi</b><div style="color:#888;font-size:12px">Connected to HomeWiFi</div></div><button class="toggle on" onclick="this.classList.toggle('on')"></button></div>
    <div class="set-row"><div><b>Bluetooth</b></div><button class="toggle" onclick="this.classList.toggle('on')"></button></div>
    <div class="set-row"><div><b>Brightness</b></div><input type="range" min="40" max="100" value="100" oninput="document.body.style.filter='brightness('+(this.value/100)+')'"></div>
    <div class="set-row"><div><b>Volume</b></div><input type="range" min="0" max="100" value="80" oninput="audioEl.volume=this.value/100"></div>
    <div class="set-row"><div><b>About this OS</b><div style="color:#888;font-size:12px">${osType} Simulator • Web Edition</div></div><span>Version 1.0</span></div>
    <div class="set-row"><div><b>Reset File System</b></div><button class="big-btn gray" onclick="localStorage.removeItem('os_fs');FS=defaultFS();saveFS(FS);toast('File system reset ✅')">Reset</button></div>
  </div>`;
}
function initSettings(win, osType){
  const grid=win.querySelector('#wallGrid'); if(!grid) return;
  const walls = osType==='ubuntu'?WALLPAPERS_UBUNTU:WALLPAPERS_WIN;
  const target = osType==='ubuntu'?document.getElementById('ubuntuWallpaper'):document.getElementById('winWallpaper');
  grid.innerHTML=walls.map((w,i)=>`<button style="background:${w}" onclick="setWallpaper(${i},'${osType}')"></button>`).join('');
}
function setWallpaper(i, osType){
  const walls = osType==='ubuntu'?WALLPAPERS_UBUNTU:WALLPAPERS_WIN;
  const target = osType==='ubuntu'?document.getElementById('ubuntuWallpaper'):document.getElementById('winWallpaper');
  if(target) target.style.background=walls[i];
  toast('Wallpaper changed 🖼️');
}

function photosHTML(){
  const pics=[["🏖️","#2563eb"],["🌸","#ec4899"],["🌿","#10b981"],["🌅","#f59e0b"],["🏔️","#6366f1"],["🌊","#06b6d4"],["🔥","#ef4444"],["⭐","#eab308"],["🦋","#a855f7"]];
  return `<div style="padding:16px;overflow:auto;background:#fff;flex:1"><h2 style="margin-bottom:12px">🖼️ Photos</h2><div class="photo-grid">${pics.map(p=>`<div style="background:${p[1]}">${p[0]}</div>`).join('')}</div></div>`;
}
function storeHTML(){
  const apps=[["🎮","Game Hub"],["💬","Chat App"],["🎬","Video Player"],["📸","Photo Editor"],["🎵","Music Pro"],["📚","E-Books"],["🗺️","Maps"],["💳","Payments"]];
  return `<div style="padding:16px;overflow:auto;background:#f3f3f3;flex:1"><h2>🛍️ Microsoft Store</h2><p style="color:#666;font-size:13px;margin:6px 0 14px">Discover apps for your OS</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:12px">${apps.map(a=>`<div style="background:#fff;border-radius:12px;padding:16px;text-align:center"><div style="font-size:36px">${a[0]}</div><div style="font-size:12px;margin:8px 0">${a[1]}</div><button class="big-btn" onclick="toast('Installing ${a[1]}... ✅')">Get</button></div>`).join('')}</div></div>`;
}
function vscodeHTML(){
  return `<div style="display:flex;flex:1;background:#1e1e1e;color:#d4d4d4;min-height:0">
    <div style="width:200px;background:#252526;padding:12px;font-size:12px;flex-shrink:0"><b style="color:#fff">EXPLORER</b><div style="margin-top:10px;line-height:2">📁 OS-SIMULATOR<br>&nbsp;&nbsp;📄 index.html<br>&nbsp;&nbsp;📄 style.css<br>&nbsp;&nbsp;📄 app.js<br>&nbsp;&nbsp;📄 README.md</div></div>
    <div style="flex:1;display:flex;flex-direction:column;min-width:0"><div style="background:#2d2d2d;padding:8px 12px;font-size:12px">index.html</div><textarea style="flex:1;background:#1e1e1e;color:#d4d4d4;border:none;outline:none;padding:14px;font-family:Consolas,monospace;font-size:13px;resize:none" spellcheck="false">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello from your OS!&lt;/h1&gt;
    &lt;p&gt;This is a working code editor.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</textarea><div style="background:#007acc;color:#fff;padding:6px 12px;font-size:11px">Ln 1, Col 1 &nbsp;•&nbsp; UTF-8 &nbsp;•&nbsp; HTML</div></div>
  </div>`;
}
function clockHTML(){
  return `<div style="padding:20px;background:#fff;flex:1;overflow:auto;text-align:center"><div id="clockBig" style="font-size:52px;font-weight:200">--:--</div><div id="clockDate" style="color:#666"></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:20px;text-align:left">${["New York","London","Dubai","Mumbai","Tokyo","Sydney"].map(c=>`<div style="background:#f3f3f3;border-radius:12px;padding:12px"><b>${c}</b><div class="wc" data-city="${c}" style="font-size:20px">--:--</div></div>`).join('')}</div></div>`;
}
function aboutHTML(osType){
  return `<div style="padding:24px;background:#fff;flex:1;overflow:auto;text-align:center"><div style="font-size:56px">💻</div><h2>${osType} Simulator</h2><p style="color:#666;margin:10px 0;line-height:1.6">A fully working OS experience in your browser.<br>Files • Chrome • Spotify • Terminal • Calculator • Notepad • Settings</p><div style="background:#f3f3f3;border-radius:12px;padding:14px;text-align:left;font-size:13px;line-height:1.8">🖥️ System: Web Edition 1.0<br>💾 Storage: 64 GB (38 GB free)<br>🎵 Songs: 8 from Google Drive<br>🌐 Browser: Built-in Chrome<br>📁 Files: Fully working manager</div><button class="big-btn" style="margin-top:16px" onclick="toast('Thanks for trying! 🎉')">Enjoy!</button></div>`;
}

// Open app dispatcher — filled by OS-specific files
function openApp(appId, extra){
  if(window._openApp) window._openApp(appId, extra);
  else toast('App: '+appId);
}
