// Songs from Google Drive folder
const SONGS = [
  {id:"1G9h1Zd2w8Z2Td0Jb1BWhVtmTAVGiqduc", title:"Lollipop Lagelu", artist:"Pawan Singh • Bhojpuri", color:"#e11d48", emoji:"🍭"},
  {id:"1b7NgJvYn1n_QNcDpP5oxTGbuJIITuLfi", title:"Lehnga Utha Deb Remote Se", artist:"Ravi Kishan • Bhojpuri", color:"#f59e0b", emoji:"🎬"},
  {id:"1ynYl9Pah-oz_E6tHFRmsnIk4ONWDZGD2", title:"Lagai Dihi Choliya Ke Hook", artist:"Arvind Akela Kallu • Bhojpuri", color:"#8b5cf6", emoji:"🔥"},
  {id:"1TK9WI8qxIcR1WDP3mJYt4j8Fe_0pwEVQ", title:"Cheater", artist:"Chitranshi ft. KhullarG, Harsh Gujral", color:"#06b6d4", emoji:"🎤"},
  {id:"1nl7XfqJ46uOav7xyvBFcKBjevhSjCh_c", title:"Mujhko Rana Ji Maaf Karna", artist:"Old Hindi • Classic", color:"#ec4899", emoji:"🎵"},
  {id:"1xcdN-vsIe4-V1IXMe7455BCnn8ohZUB8", title:"Piya Ghar Aavenge", artist:"Kailash Kher • Chaandan Mein", color:"#10b981", emoji:"🌸"},
  {id:"1INstJU49E1YRSSA2J0YdEaGGuLkQoKwS", title:"Sanson Ki Mala Pe Simron Mein", artist:"Ustad Nusrat Fateh Ali Khan", color:"#f97316", emoji:"🕌"},
  {id:"1ZfkYq6lACFrWMipfvv1PPIZy7HfXyqxL", title:"Trollywood 1", artist:"Trollywood • Trending", color:"#3b82f6", emoji:"🚜"},
];
SONGS.forEach(s=>{ s.url = `https://drive.google.com/uc?export=download&id=${s.id}`; });

const APPS = [
  {id:'chrome', name:'Google Chrome', icon:'🌐', color:'#4285f4'},
  {id:'files', name:'File Explorer', icon:'📁', color:'#fbbf24'},
  {id:'spotify', name:'Spotify', icon:'🎵', color:'#1db954'},
  {id:'terminal', name:'Terminal', icon:'⬛', color:'#111'},
  {id:'notepad', name:'Notepad', icon:'📝', color:'#60a5fa'},
  {id:'calculator', name:'Calculator', icon:'🧮', color:'#f97316'},
  {id:'settings', name:'Settings', icon:'⚙️', color:'#94a3b8'},
  {id:'photos', name:'Photos', icon:'🖼️', color:'#ec4899'},
  {id:'store', name:'Microsoft Store', icon:'🛍️', color:'#0078d4'},
  {id:'vscode', name:'VS Code', icon:'💻', color:'#007acc'},
  {id:'clock', name:'Clock', icon:'🕐', color:'#fff'},
  {id:'about', name:'About', icon:'ℹ️', color:'#a78bfa'},
];

const WALLPAPERS_WIN = [
  'linear-gradient(135deg,#0f766e,#2563eb 45%,#7c3aed 80%,#ec4899)',
  'linear-gradient(135deg,#f97316,#ef4444 50%,#ec4899)',
  'linear-gradient(135deg,#111827,#1e3a8a 60%,#0ea5e9)',
  'linear-gradient(135deg,#065f46,#10b981 50%,#84cc16)',
  'linear-gradient(135deg,#7c3aed,#db2777 60%,#f59e0b)',
  'linear-gradient(135deg,#0c4a6e,#0369a1 50%,#38bdf8)',
];
const WALLPAPERS_UBUNTU = [
  'radial-gradient(900px 500px at 80% 20%,#e95420 0%,transparent 55%),radial-gradient(800px 500px at 10% 90%,#77216f 0%,transparent 60%),linear-gradient(160deg,#2c001e,#5e2750 55%,#77216f)',
  'linear-gradient(135deg,#111827,#374151)',
  'linear-gradient(135deg,#7c2d12,#ea580c 60%,#fbbf24)',
  'linear-gradient(135deg,#052e16,#166534 60%,#22c55e)',
  'linear-gradient(135deg,#1e1b4b,#4338ca 60%,#818cf8)',
];

// Virtual file system (persisted)
function defaultFS(){
  return {
    "Home": [
      {name:"Documents", type:"folder", children:[
        {name:"Welcome.txt", type:"file", content:"Welcome to your OS simulator!\n\n• Open File Explorer to browse files\n• Open Chrome to browse the web\n• Open Spotify to play your 8 songs\n• Open Terminal and type 'help'\n\nEverything is working — try it all!"},
        {name:"ToDo.txt", type:"file", content:"- Try Windows, Ubuntu & iOS\n- Play a song in Spotify\n- Create a new folder\n- Write in Notepad and save\n- Use Terminal commands"},
        {name:"Notes.txt", type:"file", content:"Your notes here..."},
      ]},
      {name:"Downloads", type:"folder", children:[
        {name:"Songs.txt", type:"file", content:"Your Spotify playlist has 8 songs from Google Drive:\n\n"+SONGS.map((s,i)=>(i+1)+". "+s.title+" — "+s.artist).join("\n")},
      ]},
      {name:"Pictures", type:"folder", children:[
        {name:"Wallpaper1.jpg", type:"image", color:"#2563eb", emoji:"🏖️"},
        {name:"Wallpaper2.jpg", type:"image", color:"#ec4899", emoji:"🌸"},
        {name:"Wallpaper3.jpg", type:"image", color:"#10b981", emoji:"🌿"},
        {name:"Wallpaper4.jpg", type:"image", color:"#f59e0b", emoji:"🌅"},
      ]},
      {name:"Music", type:"folder", children: SONGS.map(s=>({name:s.title+".mp3", type:"audio", songId:s.id}))},
      {name:"Videos", type:"folder", children:[
        {name:"MyVideo.mp4", type:"video"},
      ]},
      {name:"Desktop", type:"folder", children:[]},
      {name:"readme.txt", type:"file", content:"This is a fully working OS simulator in your browser.\nNo install needed. Press Esc to switch OS."},
    ]
  };
}
function loadFS(){
  try{ const raw = localStorage.getItem('os_fs'); if(raw) return JSON.parse(raw); }catch(e){}
  return defaultFS();
}
function saveFS(fs){ try{ localStorage.setItem('os_fs', JSON.stringify(fs)); }catch(e){} }
let FS = loadFS();

function findFolder(path){
  // path: array of names starting at Home
  let cur = FS["Home"];
  for(const p of path){
    const f = cur.find(x=>x.name===p && x.type==='folder');
    if(!f) return null;
    cur = f.children;
  }
  return cur;
}
function fmtSize(item){
  if(item.type==='folder') return '—';
  if(item.type==='audio') return 'MP3';
  if(item.type==='image') return 'IMG';
  if(item.type==='video') return 'MP4';
  const len = (item.content||'').length;
  return len<1024 ? len+' B' : (len/1024).toFixed(1)+' KB';
}
