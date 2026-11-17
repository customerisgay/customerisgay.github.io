// ===== Main: selector, boot, exit =====
let currentOS=null;
function updateSelClock(){
  const el=document.getElementById('selClock'); if(el) el.textContent=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
}
updateSelClock(); setInterval(updateSelClock,1000);

function bootOS(os){
  currentOS=os;
  document.getElementById('selector').classList.add('hidden');
  const boot=document.getElementById('boot');
  boot.classList.remove('hidden');
  const content=document.getElementById('bootContent');
  let html='', duration=2200;
  if(os==='windows'){
    html=`<div class="boot-win-logo"><span></span><span></span><span></span><span></span></div><div style="font-size:18px">Windows 11</div><div class="boot-dots"><i></i><i></i><i></i><i></i><i></i></div>`;
  } else if(os==='ubuntu'){
    html=`<div class="boot-ubuntu">◎</div><div style="font-size:22px;margin-top:10px">Ubuntu</div><div class="boot-dots"><i></i><i></i><i></i><i></i><i></i></div>`;
  } else {
    html=`<div class="boot-apple">🍎</div><div style="font-size:18px;margin-top:10px">iOS</div><div class="boot-bar"><i id="bootBar"></i></div>`;
  }
  content.innerHTML=html;
  let p=0;
  const bar=document.getElementById('bootBar');
  const iv=setInterval(()=>{ p+=10; if(bar) bar.style.width=p+'%'; if(p>=100) clearInterval(iv); }, duration/10);
  setTimeout(()=>{
    boot.classList.add('hidden');
    document.getElementById(os).classList.remove('hidden');
    if(os==='windows') initWindows();
    if(os==='ubuntu') initUbuntu();
    if(os==='ios') initIOS();
    toast(os==='windows'?'Welcome to Windows 11 🪟':os==='ubuntu'?'Welcome to Ubuntu ◎':'Welcome to iOS 🍎');
  }, duration);
}

function exitOS(){
  ['windows','ubuntu','ios'].forEach(id=>document.getElementById(id).classList.add('hidden'));
  document.getElementById('selector').classList.remove('hidden');
  currentOS=null;
  // clear windows so next boot is fresh
  document.getElementById('winWindows').innerHTML='';
  document.getElementById('ubuntuWindows').innerHTML='';
  document.getElementById('winDesktop').innerHTML='';
  document.getElementById('ubuntuDesktop').innerHTML='';
}

document.addEventListener('keydown', e=>{
  if(e.key==='Escape' && currentOS) exitOS();
});

// Audio play/pause sync for global player button
audioEl.addEventListener('play', renderGlobalPlayer);
audioEl.addEventListener('pause', renderGlobalPlayer);

// Prevent context menu on desktop areas (except inputs)
document.addEventListener('contextmenu', e=>{
  if(e.target.closest('.win-desktop,.ubuntu-desktop')) return; // handled
  if(e.target.closest('input,textarea')) return;
  // allow default elsewhere
});
