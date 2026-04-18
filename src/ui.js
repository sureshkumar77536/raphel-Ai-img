export const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Raphael AI Generator</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#050510;--bg2:#0a0a1a;
  --surface:rgba(15,15,35,0.8);--card:rgba(20,20,50,0.6);
  --glass:rgba(255,255,255,0.03);--glass-border:rgba(255,255,255,0.06);
  --primary:#7c3aed;--primary-light:#a78bfa;--primary-dark:#5b21b6;
  --accent:#06d6a0;--accent2:#f72585;--gold:#fbbf24;
  --text:#f0f0ff;--text2:#a0a0c0;--text3:#606080;
  --ok:#10b981;--err:#ef4444;
  --r:16px;--r2:12px;
  --glow:0 0 40px rgba(124,58,237,0.15);
  --glow-accent:0 0 30px rgba(6,214,160,0.2);
}
html{scroll-behavior:smooth}
body{
  font-family:'Inter',system-ui,sans-serif;
  background:var(--bg);color:var(--text);
  min-height:100vh;overflow-x:hidden;
  line-height:1.6;
}
.bg-canvas{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.bg-orb{position:absolute;border-radius:50%;filter:blur(100px);opacity:0.4;animation:float 20s ease-in-out infinite}
.bg-orb:nth-child(1){width:600px;height:600px;background:radial-gradient(circle,var(--primary),transparent);top:-200px;left:-100px;animation-delay:0s}
.bg-orb:nth-child(2){width:500px;height:500px;background:radial-gradient(circle,var(--accent),transparent);bottom:-200px;right:-100px;animation-delay:-7s}
.bg-orb:nth-child(3){width:400px;height:400px;background:radial-gradient(circle,var(--accent2),transparent);top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:-14s;opacity:0.2}
.bg-grid{
  position:absolute;inset:0;
  background-image:
    linear-gradient(rgba(124,58,237,0.03) 1px,transparent 1px),
    linear-gradient(90deg,rgba(124,58,237,0.03) 1px,transparent 1px);
  background-size:60px 60px;
  mask-image:radial-gradient(ellipse at center,black 30%,transparent 80%);
}
@keyframes float{
  0%,100%{transform:translate(0,0) scale(1)}
  25%{transform:translate(50px,-30px) scale(1.1)}
  50%{transform:translate(-30px,50px) scale(0.95)}
  75%{transform:translate(30px,30px) scale(1.05)}
}
.app{position:relative;z-index:1;max-width:960px;margin:0 auto;padding:0 1.25rem 4rem}
.header{text-align:center;padding:3.5rem 0 2rem}
.logo{
  display:inline-flex;align-items:center;gap:0.75rem;
  margin-bottom:1rem;
}
.logo-icon{
  width:52px;height:52px;border-radius:14px;
  background:linear-gradient(135deg,var(--primary),var(--accent2));
  display:flex;align-items:center;justify-content:center;
  font-size:1.5rem;box-shadow:var(--glow);
  animation:logo-pulse 3s ease-in-out infinite;
}
@keyframes logo-pulse{
  0%,100%{box-shadow:0 0 20px rgba(124,58,237,0.3)}
  50%{box-shadow:0 0 40px rgba(124,58,237,0.5)}
}
.logo-text{
  font-family:'Space Grotesk',sans-serif;
  font-size:2rem;font-weight:800;
  background:linear-gradient(135deg,#fff 20%,var(--primary-light) 50%,var(--accent) 90%);
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
  letter-spacing:-0.5px;
}
.tagline{
  color:var(--text2);font-size:0.95rem;
  max-width:500px;margin:0 auto;
  font-weight:400;
}
.badges{display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;flex-wrap:wrap}
.badge{
  font-size:0.68rem;font-weight:600;
  padding:0.3rem 0.7rem;border-radius:20px;
  letter-spacing:0.3px;text-transform:uppercase;
  display:flex;align-items:center;gap:0.3rem;
}
.badge.violet{background:rgba(124,58,237,0.12);color:var(--primary-light);border:1px solid rgba(124,58,237,0.2)}
.badge.green{background:rgba(6,214,160,0.08);color:var(--accent);border:1px solid rgba(6,214,160,0.15)}
.badge.pink{background:rgba(247,37,133,0.08);color:var(--accent2);border:1px solid rgba(247,37,133,0.15)}
.section{
  background:var(--surface);
  border:1px solid var(--glass-border);
  border-radius:var(--r);
  padding:1.75rem;margin-bottom:1.25rem;
  backdrop-filter:blur(20px);
  box-shadow:0 8px 32px rgba(0,0,0,0.3);
  transition:border-color 0.3s;
}
.section:hover{border-color:rgba(124,58,237,0.15)}
.section-title{
  font-size:0.72rem;font-weight:700;
  color:var(--text3);text-transform:uppercase;
  letter-spacing:1.2px;margin-bottom:1rem;
  display:flex;align-items:center;gap:0.5rem;
}
.section-title i{font-size:0.8rem;color:var(--primary-light)}
.prompt-wrap{position:relative}
#prompt{
  width:100%;background:var(--bg2);
  border:2px solid var(--glass-border);
  border-radius:var(--r2);
  padding:1rem 1.25rem;
  font-size:1rem;color:var(--text);
  font-family:'Inter',sans-serif;
  resize:none;min-height:70px;max-height:200px;
  transition:all 0.3s;line-height:1.6;
}
#prompt::placeholder{color:var(--text3);font-weight:400}
#prompt:focus{
  outline:none;
  border-color:var(--primary);
  box-shadow:0 0 0 4px rgba(124,58,237,0.1),var(--glow);
}
.char-count{
  position:absolute;bottom:0.5rem;right:0.75rem;
  font-size:0.65rem;color:var(--text3);
  font-variant-numeric:tabular-nums;
}
.suggestions{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.75rem}
.chip{
  background:var(--glass);
  border:1px solid var(--glass-border);
  border-radius:20px;
  padding:0.35rem 0.75rem;
  font-size:0.72rem;color:var(--text2);
  cursor:pointer;transition:all 0.25s;
  white-space:nowrap;
  display:flex;align-items:center;gap:0.3rem;
}
.chip:hover{
  background:rgba(124,58,237,0.08);
  border-color:var(--primary);
  color:var(--text);
  transform:translateY(-1px);
}
.ratio-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem}
.ratio-btn{
  background:var(--bg2);
  border:2px solid var(--glass-border);
  border-radius:var(--r2);
  padding:0.6rem 0.4rem;
  cursor:pointer;transition:all 0.25s;
  display:flex;flex-direction:column;
  align-items:center;gap:0.3rem;
  color:var(--text2);font-size:0.7rem;font-weight:600;
}
.ratio-btn .preview{
  border:1.5px solid var(--text3);
  border-radius:3px;transition:all 0.25s;
}
.ratio-btn:hover{
  border-color:rgba(124,58,237,0.3);
  background:rgba(124,58,237,0.05);
  color:var(--text);
}
.ratio-btn.active{
  border-color:var(--primary);
  background:rgba(124,58,237,0.1);
  color:var(--primary-light);
  box-shadow:0 0 0 3px rgba(124,58,237,0.08);
}
.ratio-btn.active .preview{border-color:var(--primary-light)}
.qty-pills{display:flex;gap:0.5rem}
.qty-pill{
  flex:1;padding:0.6rem;
  background:var(--bg2);
  border:2px solid var(--glass-border);
  border-radius:var(--r2);
  cursor:pointer;transition:all 0.25s;
  text-align:center;
  font-size:0.85rem;font-weight:600;
  color:var(--text2);
}
.qty-pill:hover{
  border-color:rgba(124,58,237,0.3);
  color:var(--text);
}
.qty-pill.active{
  border-color:var(--primary);
  background:rgba(124,58,237,0.1);
  color:var(--primary-light);
}
.generate-btn{
  width:100%;padding:1rem;
  border:none;border-radius:var(--r2);
  font-size:1.05rem;font-weight:700;
  cursor:pointer;
  background:linear-gradient(135deg,var(--primary),var(--accent2));
  color:#fff;
  transition:all 0.3s;
  display:flex;align-items:center;justify-content:center;gap:0.6rem;
  box-shadow:0 4px 20px rgba(124,58,237,0.3);
  letter-spacing:0.3px;
  margin-top:1.25rem;
  position:relative;overflow:hidden;
}
.generate-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,var(--accent2),var(--primary));
  opacity:0;transition:opacity 0.3s;
}
.generate-btn:hover:not(:disabled)::before{opacity:1}
.generate-btn:hover:not(:disabled){
  transform:translateY(-2px);
  box-shadow:0 8px 30px rgba(124,58,237,0.4);
}
.generate-btn:active:not(:disabled){transform:translateY(0)}
.generate-btn:disabled{opacity:0.5;cursor:not-allowed}
.generate-btn>*{position:relative;z-index:1}
.generate-btn.loading{
  background:linear-gradient(135deg,#4f46e5,#7c3aed);
}
.generate-btn.loading::before{display:none}
.btn-spinner{
  display:none;width:22px;height:22px;
  border:3px solid rgba(255,255,255,0.3);
  border-top-color:#fff;border-radius:50%;
  animation:spin 0.8s linear infinite;
}
.generate-btn.loading .btn-spinner{display:block}
.generate-btn.loading .btn-text{display:none}
@keyframes spin{to{transform:rotate(360deg)}}
.viewer{
  background:var(--bg2);
  border:1px solid var(--glass-border);
  border-radius:var(--r);
  overflow:hidden;
  position:relative;
  min-height:400px;
  display:flex;align-items:center;justify-content:center;
}
.placeholder{text-align:center;padding:2rem;color:var(--text3)}
.placeholder .icon{font-size:3rem;margin-bottom:0.75rem;opacity:0.3}
.placeholder p{font-size:0.9rem}
#output-img{
  width:100%;height:auto;display:none;
  animation:img-in 0.6s cubic-bezier(0.16,1,0.3,1);
}
@keyframes img-in{
  from{opacity:0;transform:scale(0.95);filter:blur(10px)}
  to{opacity:1;transform:scale(1);filter:blur(0)}
}
.loading-overlay{
  position:absolute;inset:0;
  background:rgba(5,5,16,0.9);
  backdrop-filter:blur(8px);
  display:none;align-items:center;justify-content:center;
  flex-direction:column;gap:1rem;z-index:10;
}
.loading-overlay.on{display:flex}
.loader-animation{position:relative;width:80px;height:80px}
.loader-ring{
  position:absolute;inset:0;
  border:3px solid transparent;
  border-radius:50%;
  animation:loader-spin 1.5s linear infinite;
}
.loader-ring:nth-child(1){border-top-color:var(--primary);animation-duration:1.5s}
.loader-ring:nth-child(2){inset:8px;border-right-color:var(--accent);animation-duration:2s;animation-direction:reverse}
.loader-ring:nth-child(3){inset:16px;border-bottom-color:var(--accent2);animation-duration:1s}
@keyframes loader-spin{to{transform:rotate(360deg)}}
.loader-text{color:var(--text2);font-size:0.85rem;font-weight:500}
.loader-progress{
  width:200px;height:3px;background:var(--glass);
  border-radius:3px;overflow:hidden;margin-top:0.25rem;
}
.loader-bar{
  height:100%;width:0%;
  background:linear-gradient(90deg,var(--primary),var(--accent));
  border-radius:3px;
  transition:width 0.3s;
}
.img-actions{
  position:absolute;bottom:1rem;right:1rem;
  display:none;gap:0.5rem;z-index:5;
}
.action-btn{
  width:40px;height:40px;
  background:rgba(0,0,0,0.6);
  backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:10px;
  color:#fff;font-size:0.9rem;
  cursor:pointer;transition:all 0.2s;
  display:flex;align-items:center;justify-content:center;
}
.action-btn:hover{
  background:var(--primary);
  transform:translateY(-2px);
  box-shadow:0 4px 15px rgba(124,58,237,0.4);
}
.seed-badge{
  position:absolute;top:0.75rem;left:0.75rem;
  background:rgba(0,0,0,0.6);
  backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,0.08);
  color:rgba(255,255,255,0.8);
  font-size:0.68rem;font-weight:600;
  padding:0.3rem 0.6rem;border-radius:8px;
  font-family:'Space Grotesk',monospace;
  display:none;z-index:5;
}
.gallery{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
  gap:0.75rem;margin-top:1rem;
}
.gallery-thumb{
  position:relative;
  border-radius:var(--r2);
  overflow:hidden;
  border:2px solid var(--glass-border);
  cursor:pointer;
  aspect-ratio:1;
  transition:all 0.25s;
}
.gallery-thumb:hover{
  border-color:var(--primary);
  transform:scale(1.02);
  box-shadow:0 4px 20px rgba(124,58,237,0.2);
}
.gallery-thumb.active{border-color:var(--accent)}
.gallery-thumb img{width:100%;height:100%;object-fit:cover}
.gallery-num{
  position:absolute;top:0.4rem;left:0.4rem;
  background:var(--primary);color:#fff;
  font-size:0.6rem;font-weight:700;
  padding:0.15rem 0.4rem;border-radius:6px;
}
.toast{
  position:fixed;bottom:2rem;left:50%;
  transform:translateX(-50%) translateY(20px);
  background:rgba(15,15,35,0.9);
  backdrop-filter:blur(12px);
  border:1px solid var(--glass-border);
  color:var(--text);
  padding:0.7rem 1.25rem;
  border-radius:12px;font-size:0.82rem;
  opacity:0;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);
  z-index:999;pointer-events:none;
  display:flex;align-items:center;gap:0.5rem;
  max-width:90vw;
  box-shadow:0 8px 30px rgba(0,0,0,0.4);
}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
.toast.success{border-color:rgba(16,185,129,0.3)}
.toast.error{border-color:rgba(239,68,68,0.3)}
.toast.info{border-color:rgba(124,58,237,0.3)}
.footer{
  text-align:center;padding:2rem 0;
  color:var(--text3);font-size:0.72rem;
}
.footer a{color:var(--primary-light);text-decoration:none}
.footer a:hover{text-decoration:underline}
@media(max-width:640px){
  .app{padding:0 1rem 3rem}
  .section{padding:1.25rem}
  .ratio-grid{grid-template-columns:repeat(4,1fr);gap:0.4rem}
  .ratio-btn{padding:0.5rem 0.3rem;font-size:0.65rem}
  .viewer{min-height:280px}
  .logo-text{font-size:1.6rem}
  .gallery{grid-template-columns:repeat(2,1fr)}
  .qty-pills{gap:0.35rem}
  .qty-pill{padding:0.5rem;font-size:0.8rem}
}
@media(max-width:400px){
  .ratio-grid{grid-template-columns:repeat(3,1fr)}
}
.glow-line{
  height:1px;
  background:linear-gradient(90deg,transparent,var(--primary),var(--accent),var(--accent2),transparent);
  margin:2rem 0;opacity:0.3;
}
.stats{
  display:flex;justify-content:center;gap:2rem;
  margin-top:1.5rem;flex-wrap:wrap;
}
.stat{text-align:center}
.stat-value{
  font-family:'Space Grotesk',sans-serif;
  font-size:1.5rem;font-weight:700;
  background:linear-gradient(135deg,var(--primary-light),var(--accent));
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
}
.stat-label{font-size:0.65rem;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-top:0.15rem}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--glass-border);border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:var(--primary)}
</style>
</head>
<body>
<div class="bg-canvas">
  <div class="bg-orb"></div>
  <div class="bg-orb"></div>
  <div class="bg-orb"></div>
  <div class="bg-grid"></div>
</div>
<div class="app">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">✨</div>
      <span class="logo-text">Raphael AI</span>
    </div>
    <p class="tagline">Turn your imagination into stunning visuals — free, unlimited, no signup</p>
    <div class="badges">
      <span class="badge violet"><i class="fas fa-bolt"></i> Free</span>
      <span class="badge green"><i class="fas fa-infinity"></i> Unlimited</span>
      <span class="badge pink"><i class="fas fa-shield-halved"></i> No Login</span>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><i class="fas fa-pen-fancy"></i> Describe Your Vision</div>
    <div class="prompt-wrap">
      <textarea id="prompt" rows="2" placeholder="A mystical forest with glowing mushrooms and fireflies at twilight..."></textarea>
      <span class="char-count" id="charCount">0</span>
    </div>
    <div class="suggestions">
      <span class="chip" data-p="Cyberpunk cityscape at night with neon reflections on wet streets">🏙️ Cyberpunk</span>
      <span class="chip" data-p="Enchanted underwater palace with bioluminescent coral gardens">🏰 Underwater</span>
      <span class="chip" data-p="Astronaut riding a horse on Mars, cinematic lighting">🚀 Space</span>
      <span class="chip" data-p="Steampunk airship floating above Victorian London at golden hour">⚙️ Steampunk</span>
      <span class="chip" data-p="Japanese zen garden with cherry blossoms falling in moonlight">🌸 Zen Garden</span>
      <span class="chip" data-p="Ancient dragon perched on crystal mountain peak at sunset">🐉 Dragon</span>
      <span class="chip" data-p="Cozy cabin in snowy forest with northern lights overhead">❄️ Cabin</span>
      <span class="chip" data-p="Neon-lit ramen shop on a rainy Tokyo backstreet">🍜 Tokyo</span>
      <span class="chip" data-p="Bioluminescent jellyfish galaxy, deep space nebula background">🌌 Galaxy</span>
      <span class="chip" data-p="Medieval knight armor made of flowers and butterflies">🦋 Knight</span>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><i class="fas fa-expand"></i> Aspect Ratio</div>
    <div class="ratio-grid" id="ratioGrid">
      <button class="ratio-btn active" data-ratio="1:1"><div class="preview" style="width:24px;height:24px"></div>1:1</button>
      <button class="ratio-btn" data-ratio="16:9"><div class="preview" style="width:32px;height:18px"></div>16:9</button>
      <button class="ratio-btn" data-ratio="9:16"><div class="preview" style="width:18px;height:32px"></div>9:16</button>
      <button class="ratio-btn" data-ratio="4:3"><div class="preview" style="width:28px;height:21px"></div>4:3</button>
      <button class="ratio-btn" data-ratio="3:4"><div class="preview" style="width:21px;height:28px"></div>3:4</button>
      <button class="ratio-btn" data-ratio="3:2"><div class="preview" style="width:27px;height:18px"></div>3:2</button>
      <button class="ratio-btn" data-ratio="2:3"><div class="preview" style="width:18px;height:27px"></div>2:3</button>
      <button class="ratio-btn" data-ratio="21:9"><div class="preview" style="width:35px;height:15px"></div>21:9</button>
    </div>
  </div>
  <div class="section">
    <div class="section-title"><i class="fas fa-layer-group"></i> Number of Images</div>
    <div class="qty-pills" id="qtyPills">
      <button class="qty-pill active" data-qty="1">1</button>
      <button class="qty-pill" data-qty="2">2</button>
      <button class="qty-pill" data-qty="3">3</button>
      <button class="qty-pill" data-qty="4">4</button>
    </div>
  </div>
  <button class="generate-btn" id="goBtn" onclick="generate()">
    <span class="btn-text"><i class="fas fa-wand-magic-sparkles"></i> Generate Images</span>
    <div class="btn-spinner"></div>
  </button>
  <div style="margin-top:1.25rem">
    <div class="viewer" id="viewer">
      <div class="placeholder" id="placeholder">
        <div class="icon">🎨</div>
        <p>Your masterpiece will appear here</p>
      </div>
      <div class="loading-overlay" id="loader">
        <div class="loader-animation">
          <div class="loader-ring"></div>
          <div class="loader-ring"></div>
          <div class="loader-ring"></div>
        </div>
        <div class="loader-text" id="loaderText">Creating your image...</div>
        <div class="loader-progress"><div class="loader-bar" id="loaderBar"></div></div>
      </div>
      <img id="output-img" alt="Generated image">
      <div class="seed-badge" id="seedBadge"></div>
      <div class="img-actions" id="imgActions">
        <button class="action-btn" onclick="downloadImg()" title="Download"><i class="fas fa-download"></i></button>
        <button class="action-btn" onclick="copySeed()" title="Copy Seed"><i class="fas fa-key"></i></button>
        <button class="action-btn" onclick="openFull()" title="Open Full Size"><i class="fas fa-up-right-from-square"></i></button>
      </div>
    </div>
    <div id="gallerySection" style="display:none">
      <div class="section" style="margin-top:1rem">
        <div class="section-title"><i class="fas fa-images"></i> All Results</div>
        <div class="gallery" id="gallery"></div>
      </div>
    </div>
  </div>
  <div class="glow-line"></div>
  <div class="stats">
    <div class="stat"><div class="stat-value">∞</div><div class="stat-label">Generations</div></div>
    <div class="stat"><div class="stat-value">0¢</div><div class="stat-label">Cost</div></div>
    <div class="stat"><div class="stat-value">0</div><div class="stat-label">Signups</div></div>
  </div>
  <div class="footer">Powered by <a href="https://raphael.app" target="_blank">Raphael AI</a> — Basic Model</div>
</div>
<div class="toast" id="toast"></div>
<script>
let currentImages=[],busy=false,selectedRatio='1:1',selectedQty=1;
const history=JSON.parse(localStorage.getItem('rg_hist')||'[]');
document.querySelectorAll('.chip').forEach(c=>{
  c.addEventListener('click',()=>{
    const p=document.getElementById('prompt');
    p.value=c.dataset.p;
    updateCharCount();
    p.focus();
  });
});
document.getElementById('prompt').addEventListener('input',updateCharCount);
function updateCharCount(){
  document.getElementById('charCount').textContent=document.getElementById('prompt').value.length;
}
document.querySelectorAll('.ratio-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.ratio-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    selectedRatio=btn.dataset.ratio;
  });
});
document.querySelectorAll('.qty-pill').forEach(pill=>{
  pill.addEventListener('click',()=>{
    document.querySelectorAll('.qty-pill').forEach(p=>p.classList.remove('active'));
    pill.classList.add('active');
    selectedQty=parseInt(pill.dataset.qty);
  });
});
document.getElementById('prompt').addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();generate();}
});
async function generate(){
  if(busy)return;
  const prompt=document.getElementById('prompt').value.trim();
  if(prompt.length<3){toast('Enter at least 3 characters','error');return;}
  busy=true;
  const btn=document.getElementById('goBtn');
  const loader=document.getElementById('loader');
  const loaderText=document.getElementById('loaderText');
  const loaderBar=document.getElementById('loaderBar');
  btn.classList.add('loading');btn.disabled=true;
  loader.classList.add('on');
  loaderText.textContent='Connecting to Raphael AI...';
  loaderBar.style.width='0%';
  let elapsed=0;
  const progressInterval=setInterval(()=>{
    elapsed+=1;
    const pct=Math.min(90,(elapsed/45)*100);
    loaderBar.style.width=pct+'%';
    if(elapsed<5)loaderText.textContent='Connecting to Raphael AI...';
    else if(elapsed<15)loaderText.textContent='AI is creating your image(s)...';
    else if(elapsed<30)loaderText.textContent='Almost there, adding details...';
    else loaderText.textContent='Finalizing...';
  },1000);
  try{
    const res=await fetch('/api/generate',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt,aspect:selectedRatio,quantity:selectedQty})
    });
    const data=await res.json();
    clearInterval(progressInterval);
    if(!res.ok||!data.success)throw new Error(data.error||'Generation failed');
    currentImages=data.data.images.map((img,i)=>({...img,index:i+1,prompt}));
    if(currentImages.length===0)throw new Error('No images returned');
    loaderBar.style.width='100%';
    await sleep(300);
    showImage(0);
    if(currentImages.length>1){
      renderGallery();
      document.getElementById('gallerySection').style.display='block';
    }else{
      document.getElementById('gallerySection').style.display='none';
    }
    currentImages.forEach(img=>addHistory(img,prompt));
    toast('Generated '+currentImages.length+' image(s)!','success');
  }catch(e){
    clearInterval(progressInterval);
    toast(e.message,'error');
  }finally{
    busy=false;
    btn.classList.remove('loading');btn.disabled=false;
    loader.classList.remove('on');
  }
}
function showImage(idx){
  const img=currentImages[idx];
  if(!img)return;
  const el=document.getElementById('output-img');
  el.src=img.url;
  el.style.display='block';
  document.getElementById('placeholder').style.display='none';
  document.getElementById('seedBadge').textContent='Seed: '+img.seed;
  document.getElementById('seedBadge').style.display='block';
  document.getElementById('imgActions').style.display='flex';
  document.querySelectorAll('.gallery-thumb').forEach((t,i)=>{
    t.classList.toggle('active',i===idx);
  });
}
function renderGallery(){
  const g=document.getElementById('gallery');
  g.innerHTML=currentImages.map((img,i)=>
    '<div class="gallery-thumb '+(i===0?'active':'')+'" onclick="showImage('+i+')"><span class="gallery-num">#'+(i+1)+'</span><img src="'+img.url+'" loading="lazy" alt="Image '+(i+1)+'"></div>'
  ).join('');
}
function downloadImg(){
  if(!currentImages.length)return;
  const src=document.getElementById('output-img').src;
  const img=currentImages.find(i=>i.url===src)||currentImages[0];
  const a=document.createElement('a');
  a.href=img.url;a.download='raphael-'+img.seed+'.webp';a.target='_blank';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  toast('Downloading...','success');
}
function copySeed(){
  if(!currentImages.length)return;
  const src=document.getElementById('output-img').src;
  const img=currentImages.find(i=>i.url===src)||currentImages[0];
  navigator.clipboard.writeText(String(img.seed));
  toast('Seed copied: '+img.seed,'success');
}
function openFull(){
  if(!currentImages.length)return;
  window.open(document.getElementById('output-img').src,'_blank');
}
function addHistory(img,prompt){
  history.unshift({url:img.url,seed:img.seed,prompt,ratio:selectedRatio,t:Date.now()});
  if(history.length>20)history.pop();
  try{localStorage.setItem('rg_hist',JSON.stringify(history));}catch{}
}
function toast(msg,type='info'){
  const t=document.getElementById('toast');
  const icons={success:'check-circle',error:'exclamation-circle',info:'info-circle'};
  t.className='toast '+type+' show';
  t.innerHTML='<i class="fas fa-'+(icons[type]||'info-circle')+'"></i> '+msg;
  setTimeout(()=>t.classList.remove('show'),4000);
}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
</script>
</body>
</html>`;
