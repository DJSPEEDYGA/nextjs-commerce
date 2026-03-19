'use strict';
// ============================================================
// GOAT Connect Ultimate Edition v2.0 — Main App JS
// © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
// ============================================================

const API = 'http://localhost:4001';

// ===================== DATA =====================
const DEMO_PROFILES = [
  { id:'u1', name:'Jasmine Carter', age:26, city:'Atlanta, GA', emoji:'👩🏾', genres:['Hip-Hop','R&B'], match:94, position:'Situationship', bio:'Music lover & choreographer', tags:['Verified ✅','Background Clear','Dancer'] },
  { id:'u2', name:'Marcus Williams', age:29, city:'Houston, TX', emoji:'👨🏿', genres:['Trap','Gospel'], match:88, position:'Long-Term', bio:'Producer & entrepreneur', tags:['Verified ✅','Finance Cleared','Producer'] },
  { id:'u3', name:'Sofia Rodriguez', age:24, city:'Miami, FL', emoji:'👩🏽', genres:['Latin','Reggaeton'], match:92, position:'Dating', bio:'Dancer & content creator', tags:['Verified ✅','Model'] },
  { id:'u4', name:'Darius King', age:31, city:'Los Angeles, CA', emoji:'👨🏾', genres:['R&B','Soul'], match:85, position:'Open', bio:'Songwriter & vocal coach', tags:['Verified ✅','Artist'] },
  { id:'u5', name:'Amara Okafor', age:27, city:'New York, NY', emoji:'👩🏿', genres:['Afrobeats','R&B'], match:97, position:'Exclusive', bio:'Nigerian-American artist', tags:['Verified ✅','Afrobeats Star'] },
  { id:'u6', name:'Tyler Brooks', age:25, city:'Chicago, IL', emoji:'👨🏻', genres:['Drill','Trap'], match:81, position:'Situationship', bio:'Mixing engineer', tags:['Verified ✅','Engineer'] }
];

const CELEBRITIES = [
  { id:'c001', name:'DJ Speedy', emoji:'🎤', genre:'Hip-Hop', country:'USA', city:'Atlanta, GA', followers:'18.4K', tier:'GOAT', verified:true, bio:'The GOAT himself. Creator of the GOAT Royalty App. ATL to the world.', match:99 },
  { id:'c002', name:'Drake', emoji:'👑', genre:'Hip-Hop', country:'Canada', city:'Toronto', followers:'145M', tier:'Diamond', verified:true, bio:'OVO Sound founder. 6 God. Billboard record holder.', match:87 },
  { id:'c003', name:'Beyoncé', emoji:'🐝', genre:'R&B', country:'USA', city:'Houston, TX', followers:'316M', tier:'Diamond', verified:true, bio:'Queen B. 32 Grammy Awards. Global icon.', match:91 },
  { id:'c004', name:'Burna Boy', emoji:'🌍', genre:'Afrobeats', country:'Nigeria', city:'Port Harcourt', followers:'42M', tier:'Platinum', verified:true, bio:'African Giant. Grammy Award Winner.', match:89 },
  { id:'c005', name:'Bad Bunny', emoji:'🐰', genre:'Latin', country:'Puerto Rico', city:'San Juan', followers:'88M', tier:'Diamond', verified:true, bio:'Most-streamed artist 3 years running.', match:82 },
  { id:'c006', name:'BTS', emoji:'💜', genre:'K-Pop', country:'South Korea', city:'Seoul', followers:'72M', tier:'Diamond', verified:true, bio:'Global K-Pop phenomenon. 100M+ album sales.', match:78 },
  { id:'c007', name:'Stormzy', emoji:'🇬🇧', genre:'UK Grime', country:'UK', city:'London', followers:'28M', tier:'Platinum', verified:true, bio:'Merky Records founder. Glasto headliner.', match:84 },
  { id:'c008', name:'WizKid', emoji:'✨', genre:'Afrobeats', country:'Nigeria', city:'Lagos', followers:'38M', tier:'Platinum', verified:true, bio:'Starboy. Made in Lagos. Grammy winner.', match:90 },
  { id:'c009', name:'Cardi B', emoji:'💅', genre:'Hip-Hop', country:'USA', city:'New York, NY', followers:'142M', tier:'Diamond', verified:true, bio:'WAP Queen. First solo female rapper with #1.', match:86 },
  { id:'c010', name:'J Balvin', emoji:'🎸', genre:'Latin', country:'Colombia', city:'Medellín', followers:'55M', tier:'Platinum', verified:true, bio:'Colores. Most-streamed Latin artist.', match:79 },
  { id:'c011', name:'The Weeknd', emoji:'🌙', genre:'R&B', country:'Canada', city:'Toronto', followers:'98M', tier:'Diamond', verified:true, bio:'Blinding Lights. Save Your Tears. After Hours.', match:93 },
  { id:'c012', name:'SZA', emoji:'🌸', genre:'R&B', country:'USA', city:'St. Louis, MO', followers:'45M', tier:'Platinum', verified:true, bio:'SOS. Good Days. Ctrl. Neo-soul queen.', match:95 },
  { id:'c013', name:'Davido', emoji:'🎊', genre:'Afrobeats', country:'Nigeria', city:'Lagos', followers:'33M', tier:'Platinum', verified:true, bio:'OBO. 30BG. Afrobeats ambassador.', match:88 },
  { id:'c014', name:'Marshmello', emoji:'🤍', genre:'EDM', country:'USA', city:'Los Angeles, CA', followers:'52M', tier:'Platinum', verified:true, bio:'Alone. Happier. Silence. EDM icon.', match:75 },
  { id:'c015', name:'Kirk Franklin', emoji:'✝️', genre:'Gospel', country:'USA', city:'Fort Worth, TX', followers:'8M', tier:'Gold', verified:true, bio:'Gospel legend. Stomp. I Smile. Revolution.', match:80 },
  { id:'c016', name:'Megan Thee Stallion', emoji:'🐴', genre:'Hip-Hop', country:'USA', city:'Houston, TX', followers:'78M', tier:'Diamond', verified:true, bio:'Hot Girl Coach. Body-ody-ody. Grammy winner.', match:85 },
  { id:'c017', name:'Kendrick Lamar', emoji:'🎖️', genre:'Hip-Hop', country:'USA', city:'Compton, CA', followers:'62M', tier:'Diamond', verified:true, bio:'Pulitzer Prize winner. Not Like Us.', match:92 },
  { id:'c018', name:'Dua Lipa', emoji:'💃', genre:'Pop', country:'UK', city:'London', followers:'88M', tier:'Diamond', verified:true, bio:'Levitating. Future Nostalgia. Dance pop queen.', match:83 },
  { id:'c019', name:'Travis Scott', emoji:'🔥', genre:'Hip-Hop', country:'USA', city:'Houston, TX', followers:'70M', tier:'Diamond', verified:true, bio:'Astroworld. La Flame. Utopia.', match:88 },
  { id:'c020', name:'BLACKPINK', emoji:'🌸', genre:'K-Pop', country:'South Korea', city:'Seoul', followers:'92M', tier:'Diamond', verified:true, bio:'Shut Down. Pink Venom. How You Like That.', match:77 }
];

const GENRES = ['All','Hip-Hop','R&B','Afrobeats','Latin','K-Pop','UK Grime','EDM','Gospel','Pop'];

const WORLD_REGIONS = [
  { name:'🇺🇸 USA', flag:'🇺🇸', count:9, key:'USA' },
  { name:'🇨🇦 Canada', flag:'🇨🇦', count:2, key:'Canada' },
  { name:'🇳🇬 Nigeria', flag:'🇳🇬', count:3, key:'Nigeria' },
  { name:'🇰🇷 K-Pop', flag:'🇰🇷', count:2, key:'South Korea' },
  { name:'🇬🇧 UK', flag:'🇬🇧', count:2, key:'UK' },
  { name:'🌎 LATAM', flag:'🌎', count:2, key:'LATAM' }
];

const FACE_PROVIDERS = [
  { icon:'☁️', name:'AWS Rekognition', acc:'99.4%', status:'Primary' },
  { icon:'🔷', name:'Azure Face API', acc:'99.1%', status:'Secondary' },
  { icon:'🔍', name:'Google Vision', acc:'98.8%', status:'Tertiary' },
  { icon:'📱', name:'face-api.js', acc:'96.2%', status:'On-Device' },
  { icon:'⚡', name:'NVIDIA Deepfake', acc:'99.7%', status:'Anti-Fake' }
];

const FACE_CHECKS = [
  { icon:'👁️', title:'Liveness Detection', sub:'Passive + Active anti-spoof', badge:'Active', cls:'badge-green' },
  { icon:'🤖', title:'Deepfake Detection', sub:'NVIDIA AI NIM v2', badge:'Online', cls:'badge-green' },
  { icon:'🐟', title:'Catfish Detection', sub:'Reverse image search + OSINT', badge:'Scanning', cls:'badge-blue' },
  { icon:'📸', title:'Reverse Image Search', sub:'Google Vision + TinEye + Yandex', badge:'Ready', cls:'badge-purple' },
  { icon:'🔐', title:'Homomorphic Encryption', sub:'Face vectors never stored raw', badge:'Encrypted', cls:'badge-green' },
  { icon:'✅', title:'Age Verification', sub:'AI-estimated age + ID cross-check', badge:'GDPR', cls:'badge-blue' }
];

const AVATAR_PLATFORMS = [
  { id:'daz3d', label:'DAZ3D', emoji:'🎭', desc:'Genesis 9 — 21,556 poly' },
  { id:'metahuman', label:'MetaHuman', emoji:'🧑', desc:'UE5 — 150K poly' },
  { id:'readyplayerme', label:'ReadyPlayerMe', emoji:'🌐', desc:'Web/AR — GLB format' },
  { id:'fivem', label:'FiveM PED', emoji:'🎮', desc:'GTA V RAGE Engine' }
];

const AVATAR_ANIMATIONS = [
  { id:'wave', icon:'👋', name:'Wave' },
  { id:'heart', icon:'❤️', name:'Heart' },
  { id:'hiphop', icon:'🎵', name:'Hip-Hop' },
  { id:'afrobeats', icon:'🌍', name:'Afrobeats' },
  { id:'reggaeton', icon:'🔥', name:'Reggaeton' },
  { id:'rnb', icon:'🎤', name:'R&B Sway' },
  { id:'strut', icon:'💃', name:'Strut' },
  { id:'selfie', icon:'📸', name:'Selfie' },
  { id:'blosskiss', icon:'💋', name:'Blow Kiss' },
  { id:'spray', icon:'🎨', name:'FiveM Spray' },
  { id:'hype', icon:'🙌', name:'Hype' },
  { id:'drive', icon:'🚗', name:'Drive' }
];

const HOLLYWOOD_CAMERAS = [
  { icon:'🎬', name:'ARRI ALEXA 35', spec:'4.6K — 17 Stops Dynamic Range', price:'$84,995' },
  { icon:'🔴', name:'RED V-RAPTOR 8K', spec:'8K — 17+ Stops — Compact', price:'$54,500' },
  { icon:'🎥', name:'Sony VENICE 2 8K', spec:'8K — Full Frame Cinema', price:'$46,000' },
  { icon:'🖤', name:'Blackmagic URSA 12K', spec:'12K — Super 35 — $2.995K', price:'$2,995' },
  { icon:'📱', name:'iPhone 15 Pro', spec:'4K ProRes — Cinematic Mode', price:'$999' }
];

const AV_ENGINES = [
  { icon:'🛡️', name:'GOAT-AV Core', sigs:'8.4M signatures', status:'Active' },
  { icon:'🧠', name:'GOAT-Heuristic AI', sigs:'Behavior pattern detection', status:'Active' },
  { icon:'👁️', name:'GOAT-Behavioral', sigs:'Zero-day threat detection', status:'Active' },
  { icon:'📦', name:'GOAT-Sandbox', sigs:'Isolated code execution', status:'Active' },
  { icon:'🌐', name:'GOAT-NetGuard', sigs:'Real-time traffic analysis', status:'Active' },
  { icon:'⚡', name:'GOAT-AI (NVIDIA Morpheus)', sigs:'ML-powered threat intelligence', status:'Active' }
];

const CYBER_STATS = [
  { num:'284,730', label:'Total Scans' },
  { num:'18,420', label:'Threats Blocked' },
  { num:'99.999%', label:'Uptime' },
  { num:'0', label:'Active Threats' }
];

const LIVE_THREATS = [
  { name:'SQL Injection Attempt', time:'2 min ago', level:'high', dot:'#EF4444' },
  { name:'Suspicious Login Pattern', time:'5 min ago', level:'med', dot:'#F97316' },
  { name:'Rate Limit Triggered', time:'12 min ago', level:'low', dot:'#10B981' },
  { name:'XSS Probe Detected', time:'18 min ago', level:'high', dot:'#EF4444' },
  { name:'API Key Brute Force', time:'34 min ago', level:'med', dot:'#F97316' }
];

const THREAT_INTEL = [
  { name:'MITRE ATT&CK', detail:'14 Tactics · 196 Techniques', icon:'🗡️', color:'#EF4444' },
  { name:'CISA KEV', detail:'1,078 Known Exploited Vulnerabilities', icon:'🏛️', color:'#F97316' },
  { name:'FBI IC3', detail:'$12.5B losses reported (2023)', icon:'🏢', color:'#3B82F6' },
  { name:'Have I Been Pwned', detail:'13.4 Billion breached accounts', icon:'🔓', color:'#8B5CF6' }
];

const ENC_LAYERS = [
  { icon:'🔑', name:'Signal Protocol (Double Ratchet)', desc:'E2E encrypted messages' },
  { icon:'🔐', name:'AES-256-GCM', desc:'Data at rest encryption' },
  { icon:'🛡️', name:'TLS 1.3', desc:'Transit encryption' },
  { icon:'🧮', name:'Argon2id', desc:'Password hashing (memory-hard)' },
  { icon:'🤫', name:'Zero-Knowledge Proofs', desc:'Auth without exposing data' },
  { icon:'🧬', name:'Homomorphic Encryption', desc:'Face vector privacy' }
];

const CPP_BOOKS = [
  { cover:'📘', title:'A Tour of C++ (3rd Ed)', author:'Bjarne Stroustrup', level:'beginner', levelCls:'level-beginner' },
  { cover:'📗', title:'C++ Primer (5th Ed)', author:'Lippman, Lajoie, Moo', level:'beginner', levelCls:'level-beginner' },
  { cover:'📙', title:'Effective Modern C++', author:'Scott Meyers', level:'intermediate', levelCls:'level-intermediate' },
  { cover:'📕', title:'C++ Concurrency in Action', author:'Anthony Williams', level:'advanced', levelCls:'level-advanced' },
  { cover:'📓', title:'Game Engine Architecture (3rd)', author:'Jason Gregory', level:'expert', levelCls:'level-expert' },
  { cover:'📔', title:'Real-Time Rendering (4th)', author:'Akenine-Möller et al.', level:'expert', levelCls:'level-expert' },
  { cover:'📒', title:'The C++ Programming Language', author:'Bjarne Stroustrup', level:'intermediate', levelCls:'level-intermediate' },
  { cover:'📃', title:'Clean C++20', author:'Stephan Roth', level:'intermediate', levelCls:'level-intermediate' }
];

const CPP_PATH = [
  { num:'1', title:'Learn C++ Syntax', desc:'Variables, pointers, OOP basics', time:'2-4 weeks' },
  { num:'2', title:'STL & Templates', desc:'Vectors, maps, generic programming', time:'3-5 weeks' },
  { num:'3', title:'Memory Management', desc:'Smart pointers, RAII, move semantics', time:'2-3 weeks' },
  { num:'4', title:'Concurrency', desc:'Threads, mutexes, async/await', time:'3-4 weeks' },
  { num:'5', title:'Game Math', desc:'Vectors, matrices, quaternions', time:'4-6 weeks' },
  { num:'6', title:'UE5 C++ API', desc:'Actors, Components, Gameplay Framework', time:'6-8 weeks' },
  { num:'7', title:'Rendering & Shaders', desc:'HLSL, Lumen integration, GPU buffers', time:'4-6 weeks' },
  { num:'8', title:'Ship Your Game', desc:'Profiling, optimization, deployment', time:'Ongoing' }
];

const UE5_TUTORIALS = [
  { title:'UE5 Beginner Bootcamp', meta:'40h · Free on YouTube', features:['Blueprints','World Partition','Lumen'] },
  { title:'MetaHuman Creator Masterclass', meta:'12h · Unreal Online Learning', features:['Facial Capture','Live Link','DNA System'] },
  { title:'Nanite & Lumen Deep Dive', meta:'8h · GDC Talk Series', features:['Virtualized Geometry','Global Illumination','Path Tracing'] },
  { title:'Multiplayer with EOS', meta:'20h · Community Course', features:['Epic Online Services','Replication','Dedicated Servers'] },
  { title:'NVIDIA ACE for Games', meta:'6h · NVIDIA Developer', features:['AI NPCs','SteerLM','Real-time Voice'] },
  { title:'Chaos Physics & Destruction', meta:'10h · Unreal Fest', features:['Cloth Sim','Fluid Sim','Destruction Mesh'] }
];

const FIVEM_SERVERS = [
  { icon:'🏙️', name:'NoPixel 4.0', players:'32/32', tags:['QBCore','Whitelisted','Premium RP'] },
  { icon:'🎤', name:'GOAT City RP 🔥', players:'0/200', tags:['Music Industry','Celebrity Mansions','Recording Studios','In Dev'] },
  { icon:'🌆', name:'Eclipse RP', players:'200/200', tags:['ESX','Public','Economy System'] },
  { icon:'🚗', name:'Mafia City', players:'64/128', tags:['Custom Framework','Crime RP','Drug Economy'] }
];

const BLUEPRINTS = [
  { id:'dating_widget', title:'Dating Profile Widget', desc:'Full UI Blueprint for displaying user profile card with AI match percentage ring and swipe gesture detection.', nodes:'47 nodes · UI Graph · Event-Driven' },
  { id:'proximity_match', title:'Proximity Matchmaking System', desc:'Sphere collision-based actor detection that triggers AI compatibility analysis when two players enter range.', nodes:'31 nodes · Actor Blueprint · Collision' },
  { id:'music_dance', title:'Music-Synced Dance System', desc:'Audio analyzer that drives procedural animation blending based on beat detection, BPM, and frequency spectrum.', nodes:'62 nodes · Anim Blueprint · Audio' },
  { id:'nvidia_npc', title:'NVIDIA ACE NPC Brain', desc:'Integrates NVIDIA SteerLM personality model for real-time NPC conversation with memory and emotion state.', nodes:'89 nodes · AI Controller · HTTP' }
];

const FEED_POSTS = [
  { id:'p1', user:'DJ Speedy', emoji:'🎤', time:'2m', pos:'GOAT Certified', content:'Just dropped a new beat 🔥 Who wants to collaborate? DM open for real artists only.', music:{ title:'GOAT Anthem (Prod. DJ Speedy)', artist:'DJ Speedy', emoji:'🎵' }, likes:342, liked:false },
  { id:'p2', user:'Amara Okafor', emoji:'👩🏿', time:'15m', pos:'Open to Dating', content:'Afrobeats night was everything last night 🌍💃 Looking for someone who loves good music and good vibes.', music:null, likes:189, liked:false },
  { id:'p3', user:'Marcus Williams', emoji:'👨🏿', time:'45m', pos:'Long-Term', content:'Real talk — what\'s your love language AND your favorite genre? They\'re connected more than you think 🎶❤️', music:{ title:'Love In the Studio', artist:'Marcus Williams', emoji:'🎹' }, likes:276, liked:false },
  { id:'p4', user:'Sofia Rodriguez', emoji:'👩🏽', time:'1h', pos:'Dating', content:'Bad Bunny x DJ Speedy collab when?? 🐰🎤 My favorite artist meeting the GOAT himself!', music:null, likes:421, liked:true }
];

const DATING_POSITIONS = [
  { emoji:'💞', name:'Open Dating' },
  { emoji:'👫', name:'Exclusive' },
  { emoji:'🌶️', name:'Situationship' },
  { emoji:'💍', name:'Marriage Ready' },
  { emoji:'👶', name:'Co-Parenting' },
  { emoji:'🤝', name:'Networking' },
  { emoji:'🏠', name:'Long-Term' },
  { emoji:'🌍', name:'Long Distance' },
  { emoji:'🎯', name:'Casual' },
  { emoji:'👑', name:'FWB' }
];

const MUSIC_DNA = [
  { label:'Hip-Hop', pct:92, color:'linear-gradient(90deg,#8B5CF6,#EC4899)' },
  { label:'R&B', pct:78, color:'linear-gradient(90deg,#3B82F6,#06B6D4)' },
  { label:'Trap', pct:65, color:'linear-gradient(90deg,#EF4444,#F97316)' },
  { label:'Gospel', pct:55, color:'linear-gradient(90deg,#F59E0B,#FFD700)' },
  { label:'Afrobeats', pct:70, color:'linear-gradient(90deg,#10B981,#43e97b)' }
];

// ===================== STATE =====================
let currentTab = 'discover';
let currentCards = [...DEMO_PROFILES];
let cardIndex = 0;
let isDragging = false, startX = 0, startY = 0, currentX = 0;
let dragCard = null;
let followedCelebs = new Set();
let currentGenre = 'All';
let activeGamingTab = 'cpp';
let activeAvatar = { platform:'daz3d', gender:'female', style:'realistic' };
let likedPosts = new Set(['p4']);
let selectedPositions = new Set(['Open Dating']);
let faceVerified = false;

// ===================== TOAST =====================
function showToast(msg, type='info', dur=3000) {
  const t = document.getElementById('toast');
  t.className = `toast ${type}`;
  t.innerHTML = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

// ===================== MODAL =====================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ===================== AUTH =====================
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t, i) => t.classList.toggle('active', (i === 0) === (tab === 'login')));
  document.getElementById('auth-form-login').style.display = tab === 'login' ? 'flex' : 'none';
  document.getElementById('auth-form-register').style.display = tab === 'register' ? 'flex' : 'none';
}

function doLogin() {
  showToast('🔑 Authenticating...', 'info');
  setTimeout(() => {
    document.getElementById('auth-page').style.display = 'none';
    document.getElementById('main').style.display = 'flex';
    document.getElementById('main').style.flexDirection = 'column';
    showToast('✅ Welcome back, DJ Speedy!', 'success');
    initApp();
  }, 1200);
}

function doRegister() {
  showToast('🔄 Creating account...', 'info');
  setTimeout(() => {
    showToast('📋 Background check initiated', 'gold', 3500);
    setTimeout(() => doLogin(), 2000);
  }, 1500);
}

// ===================== INIT =====================
function initApp() {
  renderSwipeCards();
  renderMatchBubbles();
  renderMatchGrid();
  renderCelebs();
  renderGenreChips();
  renderWorldMap();
  renderFaceProviders();
  renderFaceChecks();
  renderAvatarPlatforms();
  renderAvatarOptions();
  renderAnimGrid();
  renderCameraGrid();
  renderCyberStats();
  renderThreatFeed();
  renderAVEngines();
  renderThreatIntel();
  renderEncLayers();
  renderCppBooks();
  renderCppPath();
  renderUE5Tutorials();
  renderFiveMServers();
  renderBlueprints();
  renderFeedPosts();
  renderMusicDNA();
  renderDatingPositions();
  setupKeyboard();
  startLiveThreatUpdates();
}

// ===================== TABS =====================
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const tabItems = document.querySelectorAll('.tab-item');
  const tabMap = ['discover','matches','stars','faceid','avatar','cyber','gaming','writing','feed','profile','security'];
  const idx = tabMap.indexOf(tab);
  if (idx >= 0 && tabItems[idx]) tabItems[idx].classList.add('active');
  const page = document.getElementById(`page-${tab}`);
  if (page) { page.classList.add('active'); page.classList.add('fade-in'); setTimeout(() => page.classList.remove('fade-in'), 400); }
}

// ===================== SWIPE CARDS =====================
function renderSwipeCards() {
  const area = document.getElementById('swipe-area');
  area.innerHTML = '';
  const remaining = DEMO_PROFILES.slice(cardIndex);
  if (remaining.length === 0) {
    area.innerHTML = '<div style="text-align:center;padding:60px 20px"><div style="font-size:64px">🎉</div><div style="font-size:18px;font-weight:700;margin-top:16px">You\'ve seen everyone!</div><div style="font-size:14px;color:var(--text2);margin-top:8px">Check back soon for new matches</div></div>';
    return;
  }
  remaining.slice(0, 3).reverse().forEach((profile, i) => {
    const card = document.createElement('div');
    card.className = 'swipe-card';
    card.dataset.id = profile.id;
    const stack = remaining.length - 1 - i;
    card.style.cssText = `transform:scale(${1 - stack * 0.04}) translateY(${stack * 12}px);z-index:${i + 1};background:${getCardGrad(profile.id)}`;
    card.innerHTML = `
      <div class="swipe-card-img">
        <div class="emoji-avatar">${profile.emoji}</div>
        <div class="swipe-card-gradient"></div>
        <div class="swipe-card-info">
          <div class="swipe-card-name">${profile.name}, ${profile.age}</div>
          <div class="swipe-card-meta">📍 ${profile.city} · ${profile.genres.join(' & ')}</div>
          <div class="swipe-card-tags">
            ${profile.tags.map(t => `<div class="swipe-tag">${t}</div>`).join('')}
          </div>
        </div>
        <div class="match-pct">${profile.match}% match</div>
        <div class="swipe-like">LIKE 💚</div>
        <div class="swipe-nope">NOPE ✕</div>
      </div>`;
    if (i === remaining.slice(0,3).length - 1) setupCardDrag(card, profile);
    area.appendChild(card);
  });
}

function getCardGrad(id) {
  const grads = ['linear-gradient(135deg,#1a1a2e,#16213e)','linear-gradient(135deg,#1a1a2e,#2d1b69)','linear-gradient(135deg,#1a2744,#1a1a2e)','linear-gradient(135deg,#1f1a2e,#2d1b47)','linear-gradient(135deg,#1a2e1e,#1a1a2e)','linear-gradient(135deg,#2e1a1a,#1a1a2e)'];
  const n = parseInt(id.replace('u','')) - 1;
  return grads[n % grads.length];
}

function setupCardDrag(card, profile) {
  card.addEventListener('mousedown', startDrag);
  card.addEventListener('touchstart', startDrag, { passive: true });
  function startDrag(e) {
    isDragging = true; dragCard = card;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    card.style.transition = 'none';
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('touchmove', onDrag, { passive: true });
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  }
  function onDrag(e) {
    if (!isDragging) return;
    currentX = (e.type === 'touchmove' ? e.touches[0].clientX : e.clientX) - startX;
    const rot = currentX * 0.08;
    card.style.transform = `translateX(${currentX}px) rotate(${rot}deg)`;
    const likeEl = card.querySelector('.swipe-like');
    const nopeEl = card.querySelector('.swipe-nope');
    likeEl.style.opacity = Math.max(0, currentX / 80);
    nopeEl.style.opacity = Math.max(0, -currentX / 80);
  }
  function endDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
    if (!dragCard) return;
    if (Math.abs(currentX) > 80) {
      const dir = currentX > 0 ? 'right' : 'left';
      animateSwipe(card, dir, profile);
    } else {
      card.style.transition = 'transform .3s ease';
      card.style.transform = 'translateX(0) rotate(0deg)';
      card.querySelector('.swipe-like').style.opacity = 0;
      card.querySelector('.swipe-nope').style.opacity = 0;
    }
    currentX = 0; dragCard = null;
  }
}

function animateSwipe(card, dir, profile) {
  card.style.transition = 'transform .4s ease, opacity .4s ease';
  card.style.transform = `translateX(${dir === 'right' ? 600 : -600}px) rotate(${dir === 'right' ? 30 : -30}deg)`;
  card.style.opacity = '0';
  setTimeout(() => {
    cardIndex++;
    renderSwipeCards();
    if (dir === 'right') {
      const isMatch = Math.random() > 0.5;
      if (isMatch) {
        setTimeout(() => {
          document.getElementById('match-modal-names').textContent = `You & ${profile.name} matched!`;
          openModal('modal-match');
        }, 300);
      } else {
        showToast(`💚 Liked ${profile.name}!`, 'success');
      }
    } else {
      showToast(`💔 Passed on ${profile.name}`, 'error');
    }
  }, 400);
}

function swipe(dir) {
  const remaining = DEMO_PROFILES.slice(cardIndex);
  if (!remaining.length) return;
  const profile = remaining[0];
  const cards = document.querySelectorAll('.swipe-card');
  const topCard = cards[cards.length - 1];
  if (topCard) animateSwipe(topCard, dir === 'right' ? 'right' : dir === 'left' ? 'left' : 'right', profile);
}

function setupKeyboard() {
  document.addEventListener('keydown', e => {
    if (currentTab !== 'discover') return;
    if (e.key === 'ArrowLeft') swipe('left');
    if (e.key === 'ArrowRight') swipe('right');
    if (e.key === 'ArrowUp') swipe('super');
  });
}

// ===================== MATCHES =====================
function renderMatchBubbles() {
  const row = document.getElementById('match-bubbles');
  row.innerHTML = DEMO_PROFILES.slice(0, 6).map(p => `
    <div class="match-bubble" onclick="showToast('💬 Opening chat with ${p.name}...','info')">
      <div class="match-bubble-img" style="background:${getCardGrad(p.id)}">
        ${p.emoji}<div class="match-bubble-dot"></div>
      </div>
      <div class="match-bubble-name">${p.name.split(' ')[0]}</div>
    </div>`).join('');
}

function renderMatchGrid() {
  const grid = document.getElementById('match-grid');
  grid.innerHTML = DEMO_PROFILES.map(p => `
    <div class="match-card">
      <div class="match-card-img" style="background:${getCardGrad(p.id)}">${p.emoji}</div>
      <div class="match-card-body">
        <div class="match-card-name">${p.name}</div>
        <div class="match-card-sub">📍 ${p.city}</div>
        <div class="match-card-pct">🤖 ${p.match}% AI match</div>
        <button class="match-card-msg" onclick="showToast('💬 Messaging ${p.name}...','info')">💬 Message</button>
      </div>
    </div>`).join('');
}

// ===================== WORLD STARS =====================
function renderGenreChips() {
  const el = document.getElementById('genre-chips');
  el.innerHTML = GENRES.map(g => `<div class="genre-chip${g === 'All' ? ' active' : ''}" onclick="selectGenre(this,'${g}')">${g}</div>`).join('');
}

function selectGenre(el, genre) {
  currentGenre = genre;
  document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  filterCelebs();
}

function filterCelebs() {
  const search = document.getElementById('celeb-search').value.toLowerCase();
  let list = CELEBRITIES;
  if (currentGenre !== 'All') list = list.filter(c => c.genre === currentGenre);
  if (search) list = list.filter(c => c.name.toLowerCase().includes(search) || c.genre.toLowerCase().includes(search) || c.city.toLowerCase().includes(search));
  renderCelebGrid(list);
}

function renderWorldMap() {
  const el = document.getElementById('world-map-grid');
  el.innerHTML = WORLD_REGIONS.map(r => `
    <div class="world-region" onclick="selectWorldRegion('${r.key}')">
      <div class="world-region-flag">${r.flag}</div>
      <div class="world-region-name">${r.name}</div>
      <div class="world-region-count">${r.count}</div>
    </div>`).join('');
}

function selectWorldRegion(key) {
  const el = document.getElementById('genre-chips');
  currentGenre = 'All';
  document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
  document.querySelector('.genre-chip').classList.add('active');
  const search = document.getElementById('celeb-search');
  const regionMap = { 'USA':'USA','Canada':'Canada','Nigeria':'Nigeria','South Korea':'Korea','UK':'UK','LATAM':'Latin' };
  search.value = regionMap[key] || '';
  filterCelebs();
  showToast(`🌍 Showing ${key} artists`, 'info');
}

function renderCelebs() { renderCelebGrid(CELEBRITIES); }

function renderCelebGrid(list) {
  const el = document.getElementById('celeb-grid');
  el.innerHTML = list.map(c => `
    <div class="celeb-card" onclick="openCelebModal('${c.id}')">
      <div class="celeb-card-top" style="background:linear-gradient(135deg,#1a1a2e,#${Math.floor(Math.random()*0xFFFFFF).toString(16).padStart(6,'0')}22)">
        <span style="font-size:56px">${c.emoji}</span>
        ${c.verified ? '<div class="celeb-verified">✅</div>' : ''}
        <div class="celeb-tier">${c.tier}</div>
      </div>
      <div class="celeb-card-body">
        <div class="celeb-name">${c.name}</div>
        <div class="celeb-genre">🎵 ${c.genre}</div>
        <div class="celeb-country">📍 ${c.city}</div>
        <div class="celeb-pct">🤖 ${c.match}% match</div>
        <button class="celeb-follow ${followedCelebs.has(c.id) ? 'following' : ''}" onclick="event.stopPropagation();toggleFollow('${c.id}',this)">
          ${followedCelebs.has(c.id) ? '✓ Following' : '+ Follow'}
        </button>
      </div>
    </div>`).join('');
}

function toggleFollow(id, btn) {
  if (followedCelebs.has(id)) {
    followedCelebs.delete(id);
    btn.className = 'celeb-follow';
    btn.textContent = '+ Follow';
    showToast('Unfollowed', 'info');
  } else {
    followedCelebs.add(id);
    btn.className = 'celeb-follow following';
    btn.textContent = '✓ Following';
    const c = CELEBRITIES.find(x => x.id === id);
    showToast(`🌟 Following ${c ? c.name : 'artist'}!`, 'gold');
  }
}

function openCelebModal(id) {
  const c = CELEBRITIES.find(x => x.id === id);
  if (!c) return;
  document.getElementById('celeb-modal-content').innerHTML = `
    <div style="text-align:center;margin-bottom:16px">
      <div style="font-size:72px">${c.emoji}</div>
      <div style="font-size:22px;font-weight:800;margin-top:8px">${c.name} ${c.verified ? '✅' : ''}</div>
      <div style="font-size:14px;color:var(--text2);margin-top:4px">🎵 ${c.genre} · 📍 ${c.city}</div>
      <div style="background:var(--grad5);color:#fff;font-size:12px;padding:4px 14px;border-radius:20px;display:inline-block;margin-top:8px;font-weight:700">${c.tier}</div>
    </div>
    <div class="celeb-modal-stats">
      <div class="celeb-modal-stat"><div class="celeb-modal-stat-num">${c.followers}</div><div class="celeb-modal-stat-label">Followers</div></div>
      <div class="celeb-modal-stat"><div class="celeb-modal-stat-num">${c.match}%</div><div class="celeb-modal-stat-label">AI Match</div></div>
      <div class="celeb-modal-stat"><div class="celeb-modal-stat-num">${followedCelebs.has(c.id) ? '✓' : '+'}Follow</div><div class="celeb-modal-stat-label">Status</div></div>
    </div>
    <div class="celeb-modal-bio">${c.bio}</div>
    <button class="modal-btn modal-btn-primary" onclick="toggleFollow('${c.id}',this.previousElementSibling?.querySelector('button'));closeModal('modal-celeb');showToast('${followedCelebs.has(c.id) ? 'Unfollowed' : '⭐ Following ' + c.name + '!'}','${followedCelebs.has(c.id) ? 'info' : 'gold'}')">${followedCelebs.has(c.id) ? 'Unfollow' : '⭐ Follow ' + c.name}</button>
    <button class="modal-btn modal-btn-secondary" onclick="closeModal('modal-celeb')">Close</button>`;
  openModal('modal-celeb');
}

// ===================== FACE ID =====================
function renderFaceProviders() {
  const el = document.getElementById('face-providers');
  el.innerHTML = FACE_PROVIDERS.map(p => `
    <div class="face-provider">
      <div class="face-provider-icon">${p.icon}</div>
      <div class="face-provider-name">${p.name}</div>
      <div class="face-provider-acc">${p.acc} accuracy</div>
      <div class="face-provider-status">${p.status}</div>
    </div>`).join('');
}

function renderFaceChecks() {
  const el = document.getElementById('face-checks');
  el.innerHTML = FACE_CHECKS.map(c => `
    <div class="face-check-item">
      <div class="face-check-icon">${c.icon}</div>
      <div class="face-check-body">
        <div class="face-check-title">${c.title}</div>
        <div class="face-check-sub">${c.sub}</div>
      </div>
      <div class="face-check-badge ${c.cls}">${c.badge}</div>
    </div>`).join('');
}

function startFaceVerification() {
  const circle = document.getElementById('face-circle');
  const status = document.getElementById('face-status');
  const emoji = document.getElementById('face-emoji');
  const btn = document.querySelector('.face-verify-btn');
  btn.disabled = true; btn.textContent = '🔄 Scanning...';
  circle.style.borderColor = '#F97316';
  status.style.color = '#F97316';
  status.textContent = 'Initiating scan...';
  const steps = [
    [800, '🔍', '#3B82F6', 'Liveness detection...'],
    [1600, '🤖', '#8B5CF6', 'Deepfake analysis...'],
    [2400, '🐟', '#06B6D4', 'Catfish check...'],
    [3200, '🔐', '#10B981', 'Encrypting face vector...'],
    [4000, '✅', '#10B981', 'Identity Verified!']
  ];
  steps.forEach(([delay, em, color, text]) => {
    setTimeout(() => {
      emoji.textContent = em;
      circle.style.borderColor = color;
      status.style.color = color;
      status.textContent = text;
      if (delay === 4000) {
        faceVerified = true;
        btn.disabled = false; btn.textContent = '✅ Verified — Re-scan';
        btn.style.background = 'var(--grad4)';
        showToast('🎉 Face verification complete! Identity confirmed.', 'success', 4000);
      }
    }, delay);
  });
}

// ===================== AVATAR =====================
function renderAvatarPlatforms() {
  const el = document.getElementById('platform-tabs');
  el.innerHTML = AVATAR_PLATFORMS.map(p => `
    <div class="platform-tab ${p.id === 'daz3d' ? 'active' : ''}" onclick="selectPlatform('${p.id}',this)">
      ${p.emoji} ${p.label}
    </div>`).join('');
}

function renderAvatarOptions() {
  document.getElementById('opt-gender').innerHTML = ['Female','Male','Non-Binary','Custom'].map(g => `
    <div class="option-btn ${g === 'Female' ? 'active' : ''}" onclick="selectOption(this,'gender','${g.toLowerCase()}')">${g}</div>`).join('');
  document.getElementById('opt-style').innerHTML = ['Realistic','Stylized','Anime','Cartoon','Cyberpunk'].map(s => `
    <div class="option-btn ${s === 'Realistic' ? 'active' : ''}" onclick="selectOption(this,'style','${s.toLowerCase()}')">${s}</div>`).join('');
}

function selectPlatform(id, el) {
  activeAvatar.platform = id;
  document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const p = AVATAR_PLATFORMS.find(x => x.id === id);
  document.getElementById('avatar-platform-badge').textContent = p.label + ' ' + p.desc;
  const emojiMap = { daz3d:'🎭', metahuman:'🧑', readyplayerme:'🌐', fivem:'🎮' };
  document.getElementById('avatar-emoji').textContent = emojiMap[id] || '🎭';
  const bgMap = { daz3d:'var(--grad1)', metahuman:'var(--grad2)', readyplayerme:'var(--grad3)', fivem:'var(--grad5)' };
  document.getElementById('avatar-preview').style.background = bgMap[id];
}

function selectOption(el, type, val) {
  activeAvatar[type] = val;
  const parent = el.parentElement;
  parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function renderAnimGrid() {
  document.getElementById('anim-grid').innerHTML = AVATAR_ANIMATIONS.map(a => `
    <div class="anim-btn" onclick="playAnimation('${a.id}','${a.name}')">
      <div class="anim-btn-icon">${a.icon}</div>
      <div class="anim-btn-name">${a.name}</div>
    </div>`).join('');
}

function playAnimation(id, name) {
  const preview = document.getElementById('avatar-preview');
  preview.style.animation = 'pulse .6s ease';
  setTimeout(() => preview.style.animation = '', 600);
  showToast(`🎬 Playing "${name}" animation`, 'info');
}

function renderCameraGrid() {
  document.getElementById('camera-grid').innerHTML = HOLLYWOOD_CAMERAS.map(c => `
    <div class="camera-card">
      <div class="camera-icon">${c.icon}</div>
      <div class="camera-body">
        <div class="camera-name">${c.name}</div>
        <div class="camera-spec">${c.spec}</div>
      </div>
      <div class="camera-price">${c.price}</div>
    </div>`).join('');
}

function createAvatar() {
  const p = AVATAR_PLATFORMS.find(x => x.id === activeAvatar.platform);
  showToast(`🎭 Creating ${p.label} avatar (${activeAvatar.style})...`, 'gold', 3000);
  setTimeout(() => showToast(`✅ Avatar created! Export ready for ${activeAvatar.platform === 'fivem' ? 'FiveM' : 'UE5'}.`, 'success', 4000), 2500);
}

// ===================== CYBER =====================
function renderCyberStats() {
  document.getElementById('cyber-stats-grid').innerHTML = CYBER_STATS.map(s => `
    <div class="stat-card">
      <div class="stat-num">${s.num}</div>
      <div class="stat-label">${s.label}</div>
    </div>`).join('');
}

function renderThreatFeed() {
  document.getElementById('threat-feed').innerHTML = LIVE_THREATS.map(t => `
    <div class="threat-item">
      <div class="threat-dot" style="background:${t.dot}"></div>
      <div class="threat-body">
        <div class="threat-name">${t.name}</div>
        <div class="threat-time">${t.time}</div>
      </div>
      <div class="threat-badge threat-${t.level}">${t.level.toUpperCase()}</div>
    </div>`).join('');
}

function renderAVEngines() {
  document.getElementById('av-engine-list').innerHTML = AV_ENGINES.map(e => `
    <div class="av-engine">
      <div class="av-icon">${e.icon}</div>
      <div class="av-body">
        <div class="av-name">${e.name}</div>
        <div class="av-sigs">${e.sigs}</div>
      </div>
      <div class="face-check-badge badge-green">${e.status}</div>
    </div>`).join('');
}

function renderThreatIntel() {
  document.getElementById('threat-intel-list').innerHTML = THREAT_INTEL.map(t => `
    <div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--card);border-radius:12px;margin-bottom:8px;border:1px solid var(--border)">
      <div style="font-size:24px;width:40px;text-align:center">${t.icon}</div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:700;color:${t.color}">${t.name}</div>
        <div style="font-size:12px;color:var(--text2);margin-top:3px">${t.detail}</div>
      </div>
      <div style="font-size:11px;color:var(--green);font-weight:700">SYNCED</div>
    </div>`).join('');
}

function checkBreach() {
  const email = document.getElementById('breach-email').value;
  if (!email) { showToast('⚠️ Enter an email address', 'error'); return; }
  showToast('🔍 Checking breach databases...', 'info');
  setTimeout(() => {
    const hasBreaches = email.includes('test') || Math.random() > 0.6;
    if (hasBreaches) {
      showToast(`⚠️ Warning! ${email} found in 3 data breaches. Change passwords immediately!`, 'error', 5000);
    } else {
      showToast(`✅ ${email} not found in any known breaches. Stay safe!`, 'success', 4000);
    }
  }, 2000);
}

function renderEncLayers() {
  document.getElementById('enc-layers-list').innerHTML = ENC_LAYERS.map(e => `
    <div class="enc-item">
      <div class="enc-icon">${e.icon}</div>
      <div class="enc-body">
        <div class="enc-name">${e.name}</div>
        <div class="enc-desc">${e.desc}</div>
      </div>
      <div class="face-check-badge badge-green">Active</div>
    </div>`).join('');
}

function startLiveThreatUpdates() {
  setInterval(() => {
    if (currentTab !== 'cyber') return;
    const threats = document.getElementById('threat-feed');
    if (!threats) return;
    const now = new Date();
    const mins = Math.floor(Math.random() * 3) + 1;
    const newThreats = [
      { name:'Port Scan Detected', dot:'#F97316', level:'med' },
      { name:'CSRF Attempt Blocked', dot:'#EF4444', level:'high' },
      { name:'Credential Stuffing', dot:'#EF4444', level:'high' },
      { name:'Honeytrap Triggered', dot:'#06B6D4', level:'low' }
    ];
    const t = newThreats[Math.floor(Math.random() * newThreats.length)];
    LIVE_THREATS.unshift({ ...t, time: `${mins} min ago` });
    LIVE_THREATS.pop();
    renderThreatFeed();
  }, 15000);
}

// ===================== GAMING =====================
function switchGamingTab(tab, el) {
  activeGamingTab = tab;
  document.querySelectorAll('.gaming-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.gaming-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`gaming-panel-${tab}`);
  if (panel) panel.classList.add('active');
}

function renderCppPath() {
  document.getElementById('cpp-learning-path').innerHTML = `
    <div style="font-size:14px;font-weight:700;margin-bottom:12px;padding:0 0 0 0">🗺️ C++ Learning Path</div>
    ${CPP_PATH.map((s, i) => `
      <div class="path-step">
        <div class="path-line">
          <div class="path-dot">${s.num}</div>
          ${i < CPP_PATH.length - 1 ? '<div class="path-connector"></div>' : ''}
        </div>
        <div class="path-body">
          <div class="path-title">${s.title}</div>
          <div class="path-desc">${s.desc}</div>
          <div class="path-time">⏱️ ${s.time}</div>
        </div>
      </div>`).join('')}
    <div style="font-size:14px;font-weight:700;margin:16px 0 12px">📚 Recommended Books</div>`;
}

function renderCppBooks() {
  document.getElementById('cpp-books-list').innerHTML = CPP_BOOKS.map(b => `
    <div class="book-card">
      <div class="book-cover" style="background:var(--bg3)">${b.cover}</div>
      <div class="book-body">
        <div class="book-title">${b.title}</div>
        <div class="book-author">✍️ ${b.author}</div>
        <div class="book-level ${b.levelCls}">${b.level}</div>
      </div>
    </div>`).join('');
}

function renderUE5Tutorials() {
  document.getElementById('ue5-tutorials-list').innerHTML = `
    <div style="font-size:14px;font-weight:700;margin-bottom:12px">🎮 UE5 Tutorial Library</div>
    ${UE5_TUTORIALS.map(t => `
      <div class="ue5-tutorial">
        <div class="ue5-tut-header">
          <div class="ue5-tut-title">${t.title}</div>
        </div>
        <div class="ue5-tut-meta">📖 ${t.meta}</div>
        <div class="ue5-features">${t.features.map(f => `<div class="ue5-feature">${f}</div>`).join('')}</div>
      </div>`).join('')}`;
}

function renderFiveMServers() {
  document.getElementById('fivem-servers-list').innerHTML = `
    <div style="font-size:14px;font-weight:700;margin-bottom:12px">🏙️ FiveM Server Directory</div>
    ${FIVEM_SERVERS.map(s => `
      <div class="fivem-server">
        <div class="fivem-server-header">
          <div class="fivem-server-icon">${s.icon}</div>
          <div>
            <div class="fivem-server-name">${s.name}</div>
            <div class="fivem-server-players">👥 ${s.players} players</div>
          </div>
        </div>
        <div class="fivem-tags">${s.tags.map(t => `<div class="fivem-tag">${t}</div>`).join('')}</div>
      </div>`).join('')}`;
}

function renderBlueprints() {
  document.getElementById('blueprint-list').innerHTML = `
    <div style="font-size:14px;font-weight:700;margin-bottom:12px">🔷 UE5 Blueprint Templates</div>
    ${BLUEPRINTS.map(b => `
      <div class="blueprint-card" onclick="generateBlueprint('${b.id}','${b.title}')">
        <div class="blueprint-title">🔷 ${b.title}</div>
        <div class="blueprint-desc">${b.desc}</div>
        <div class="blueprint-nodes">📊 ${b.nodes}</div>
      </div>`).join('')}`;
}

function generateBlueprint(id, title) {
  showToast(`🔷 Generating "${title}" Blueprint...`, 'info');
  setTimeout(() => showToast(`✅ Blueprint ready! Copy the node graph to UE5.`, 'success', 4000), 2000);
}

// ===================== FEED =====================
function renderFeedPosts() {
  document.getElementById('feed-posts').innerHTML = FEED_POSTS.map(p => `
    <div class="feed-post">
      <div class="feed-post-header">
        <div class="feed-avatar">${p.emoji}</div>
        <div style="flex:1">
          <div class="feed-name">${p.user}</div>
          <div class="feed-meta">🕐 ${p.time} ago</div>
          <div class="feed-pos">💞 ${p.pos}</div>
        </div>
        <div style="font-size:18px;cursor:pointer" onclick="showToast('Reported!','error')">⋯</div>
      </div>
      <div class="feed-content">${p.content}</div>
      ${p.music ? `
        <div class="feed-music">
          <div class="feed-music-art">${p.music.emoji}</div>
          <div style="flex:1">
            <div class="feed-music-title">${p.music.title}</div>
            <div class="feed-music-artist">${p.music.artist}</div>
          </div>
          <button class="feed-music-play" onclick="showToast('🎵 Playing...','info')">▶</button>
        </div>` : ''}
      <div class="feed-actions">
        <div class="feed-action ${likedPosts.has(p.id) ? 'liked' : ''}" onclick="likePost('${p.id}',this)">
          ${likedPosts.has(p.id) ? '❤️' : '🤍'} ${p.likes + (likedPosts.has(p.id) ? 1 : 0)}
        </div>
        <div class="feed-action" onclick="showToast('💬 Comments coming soon!','info')">💬 Comment</div>
        <div class="feed-action" onclick="showToast('🔗 Link copied!','success')">🔗 Share</div>
      </div>
    </div>`).join('');
}

function likePost(id, el) {
  if (likedPosts.has(id)) {
    likedPosts.delete(id);
  } else {
    likedPosts.add(id);
    showToast('❤️ Liked!', 'success');
  }
  renderFeedPosts();
}

function createPost() {
  const content = document.getElementById('post-content').value;
  if (!content.trim()) { showToast('⚠️ Write something first!', 'error'); return; }
  FEED_POSTS.unshift({ id:'p' + Date.now(), user:'DJ Speedy', emoji:'🎤', time:'now', pos:'GOAT Certified', content, music:null, likes:0, liked:false });
  closeModal('modal-post');
  document.getElementById('post-content').value = '';
  renderFeedPosts();
  showToast('🚀 Posted!', 'success');
}

// ===================== PROFILE =====================
function renderMusicDNA() {
  document.getElementById('music-dna-bars').innerHTML = MUSIC_DNA.map(d => `
    <div class="dna-bar-row">
      <div class="dna-bar-label"><span>${d.label}</span><span>${d.pct}%</span></div>
      <div class="dna-bar-track"><div class="dna-bar-fill" style="width:${d.pct}%;background:${d.color}"></div></div>
    </div>`).join('');
}

function renderDatingPositions() {
  document.getElementById('dating-positions').innerHTML = DATING_POSITIONS.map(p => `
    <div class="pos-item ${selectedPositions.has(p.name) ? 'active' : ''}" onclick="togglePosition('${p.name}',this)">
      <span class="pos-emoji">${p.emoji}</span>
      <span class="pos-name">${p.name}</span>
    </div>`).join('');
}

function togglePosition(name, el) {
  if (selectedPositions.has(name)) {
    selectedPositions.delete(name);
    el.classList.remove('active');
  } else {
    selectedPositions.add(name);
    el.classList.add('active');
    showToast(`💞 Dating style updated: ${name}`, 'gold');
  }
}

// ===================== SCREENWRITING STUDIO =====================
let activeWritingTab = 'writers';
let writersCache = [];

function switchWritingTab(tab, el) {
  activeWritingTab = tab;
  document.querySelectorAll('.writing-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.writing-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`writing-panel-${tab}`);
  if (panel) panel.classList.add('active');
  // Lazy-load content
  if (tab === 'writers' && !document.getElementById('writers-grid').innerHTML) loadWriters();
  if (tab === 'formats' && !document.getElementById('formats-list').innerHTML) loadFormats();
  if (tab === 'templates' && !document.getElementById('templates-list').innerHTML) loadTemplates();
  if (tab === 'software' && !document.getElementById('software-list').innerHTML) loadSoftware();
  if (tab === 'genres' && !document.getElementById('genres-list').innerHTML) loadGenres();
  if (tab === 'oscars' && !document.getElementById('oscars-list').innerHTML) loadOscars();
}

// ---------- WRITERS ----------
async function loadWriters() {
  try {
    const res = await fetch('/api/screenwriting/writers');
    const data = await res.json();
    if (data.success) {
      writersCache = data.writers;
      renderWriters(data.writers);
      document.getElementById('writers-count').textContent = `🏆 ${data.total} Legendary Screenwriters`;
    }
  } catch(e) { console.error('Failed to load writers', e); }
}

function renderWriters(writers) {
  const grid = document.getElementById('writers-grid');
  grid.innerHTML = writers.map(w => `
    <div class="writer-card" onclick="toggleWriterDetail(this)">
      <div class="writer-card-header">
        <div class="writer-rank">${w.rank}</div>
        <div class="writer-info">
          <div class="writer-name">${w.name}</div>
          <div class="writer-era">${w.era} · ${w.years} · ${w.country}</div>
        </div>
        <div class="writer-emoji">${w.emoji}</div>
      </div>
      <div class="writer-scripts">
        ${w.notableScripts.slice(0, 5).map(s => `<span class="writer-script-tag">🎬 ${s}</span>`).join('')}
      </div>
      <div class="writer-oscars">🏆 ${w.oscars.wins} Oscar Win${w.oscars.wins !== 1 ? 's' : ''} · ${w.oscars.nominations} Nomination${w.oscars.nominations !== 1 ? 's' : ''}</div>
      <div class="writer-detail" style="display:none">
        <div class="writer-quote">"${w.quote}"</div>
        <div class="writer-bio">${w.bio}</div>
        <div class="writer-legacy">✨ ${w.legacy}</div>
        <div class="writer-genres">
          ${w.genres.map(g => `<span class="writer-genre-tag">${g}</span>`).join('')}
        </div>
        ${w.notableScripts.length > 5 ? `<div class="writer-scripts" style="margin-top:8px">${w.notableScripts.slice(5).map(s => `<span class="writer-script-tag">🎬 ${s}</span>`).join('')}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function toggleWriterDetail(card) {
  const detail = card.querySelector('.writer-detail');
  if (detail) {
    detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
  }
}

function searchWriters(query) {
  if (!writersCache.length) return;
  const q = query.toLowerCase();
  const filtered = writersCache.filter(w =>
    w.name.toLowerCase().includes(q) ||
    w.notableScripts.some(s => s.toLowerCase().includes(q)) ||
    w.era.toLowerCase().includes(q) ||
    w.genres.some(g => g.toLowerCase().includes(q))
  );
  renderWriters(filtered);
  document.getElementById('writers-count').textContent = `🔍 ${filtered.length} writer${filtered.length !== 1 ? 's' : ''} found`;
}

function filterWriters() {
  const era = document.getElementById('writer-era-filter').value;
  const genre = document.getElementById('writer-genre-filter').value;
  let filtered = writersCache;
  if (era) filtered = filtered.filter(w => w.era.toLowerCase().includes(era.toLowerCase()));
  if (genre) filtered = filtered.filter(w => w.genres.some(g => g.toLowerCase().includes(genre.toLowerCase())));
  renderWriters(filtered);
  document.getElementById('writers-count').textContent = `🔍 ${filtered.length} writer${filtered.length !== 1 ? 's' : ''} found`;
}

// ---------- FORMATS ----------
async function loadFormats() {
  try {
    const res = await fetch('/api/screenwriting/formats');
    const data = await res.json();
    if (data.success) renderFormats(data.formats);
  } catch(e) { console.error('Failed to load formats', e); }
}

function renderFormats(formats) {
  const list = document.getElementById('formats-list');
  // formats is an object keyed by type, convert to array
  const fmtArr = typeof formats === 'object' && !Array.isArray(formats) ? Object.values(formats) : formats;
  list.innerHTML = fmtArr.map(f => `
    <div class="format-card">
      <div class="format-header">
        <div class="format-icon">📜</div>
        <div>
          <div class="format-title">${f.name}</div>
          <div class="format-desc">${f.format || ''} · ${f.font || ''}</div>
        </div>
      </div>
      ${f.pageCount ? `<div style="font-size:11px;color:var(--text2);margin-bottom:4px">📄 ${f.pageCount}</div>` : ''}
      ${f.acts ? `<div style="font-size:11px;color:var(--text2);margin-bottom:4px">🎭 ${f.acts}</div>` : ''}
      ${f.rule ? `<div style="font-size:11px;color:var(--gold);margin-bottom:8px;font-weight:600">💡 ${f.rule}</div>` : ''}
      ${f.margins ? `<div style="font-size:11px;color:var(--text2);margin-bottom:8px">📐 Margins: Left ${f.margins.left}" · Right ${f.margins.right}" · Top ${f.margins.top}" · Bottom ${f.margins.bottom}"</div>` : ''}
      ${f.elements ? `
        <div class="format-elements">
          ${f.elements.map(el => `
            <div class="format-element">
              <div class="format-el-name">${el.name}</div>
              <div>
                <div class="format-el-desc">${el.format || ''}</div>
                ${el.example ? `<span class="format-el-example">${el.example}</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
}

// ---------- TEMPLATES ----------
async function loadTemplates() {
  try {
    const res = await fetch('/api/screenwriting/templates');
    const data = await res.json();
    if (data.success) renderTemplates(data.templates);
  } catch(e) { console.error('Failed to load templates', e); }
}

function renderTemplates(templates) {
  const list = document.getElementById('templates-list');
  list.innerHTML = templates.map(t => `
    <div class="template-card">
      <div class="template-header">
        <div class="template-icon">${t.icon || '🎭'}</div>
        <div class="template-title">${t.name}</div>
      </div>
      <div class="template-origin">${t.source || ''} · ${t.beats || t.steps?.length || 0} beats</div>
      ${t.bestFor ? `<div style="font-size:11px;color:var(--gold);margin-bottom:10px">🎯 Best for: ${t.bestFor}</div>` : ''}
      ${t.examples && t.examples.length ? `<div style="font-size:11px;color:var(--text2);margin-bottom:10px">📽️ Examples: ${t.examples.join(', ')}</div>` : ''}
      <div class="template-steps">
        ${(t.steps || []).map((s, i) => `
          <div class="template-step">
            <div class="step-num">${i + 1}</div>
            <div class="step-content">
              <div class="step-name">${typeof s === 'string' ? s : (s.name || s.beat || '')}</div>
              ${typeof s === 'object' && s.description ? `<div class="step-desc">${s.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ---------- SOFTWARE ----------
async function loadSoftware() {
  try {
    const res = await fetch('/api/screenwriting/software');
    const data = await res.json();
    if (data.success) renderSoftware(data.software);
  } catch(e) { console.error('Failed to load software', e); }
}

function renderSoftware(software) {
  const list = document.getElementById('software-list');
  list.innerHTML = software.map(s => `
    <div class="software-card${s.id === 'final_draft' ? ' recommended' : ''}">
      <div class="software-header">
        <div class="software-icon">${s.icon || '💻'}</div>
        <div class="software-name">${s.name}</div>
        <div class="software-price">${s.price}</div>
      </div>
      ${s.tier ? `<div style="font-size:11px;color:var(--gold);font-weight:700;margin-bottom:6px">⭐ ${s.tier}</div>` : ''}
      ${s.verdict ? `<div class="software-desc">${s.verdict}</div>` : ''}
      ${s.usedBy ? `<div style="font-size:11px;color:var(--green);margin-bottom:8px;font-weight:600">${s.usedBy}</div>` : ''}
      ${s.features ? `
        <div class="software-features">
          ${s.features.slice(0, 8).map(f => `<span class="software-feat">✓ ${f}</span>`).join('')}
          ${s.features.length > 8 ? `<span class="software-feat">+${s.features.length - 8} more</span>` : ''}
        </div>
      ` : ''}
      ${s.formats ? `<div style="font-size:11px;color:var(--text2);margin-top:6px">📄 ${s.formats.join(' · ')}</div>` : ''}
      ${s.platforms ? `<div class="software-platforms" style="margin-top:4px">🖥️ ${Array.isArray(s.platforms) ? s.platforms.join(' · ') : s.platforms}</div>` : ''}
      ${s.url ? `<div style="margin-top:6px"><a href="${s.url}" target="_blank" style="font-size:11px;color:var(--gold);text-decoration:none">🔗 ${s.url}</a></div>` : ''}
    </div>
  `).join('');
}

// ---------- GENRES ----------
async function loadGenres() {
  try {
    const res = await fetch('/api/screenwriting/genres');
    const data = await res.json();
    if (data.success) renderGenres(data.genres);
  } catch(e) { console.error('Failed to load genres', e); }
}

function renderGenres(genres) {
  const list = document.getElementById('genres-list');
  list.innerHTML = genres.map(g => `
    <div class="genre-card">
      <div class="genre-header">
        <div class="genre-icon">${g.emoji || g.icon || '🎬'}</div>
        <div class="genre-name">${g.name}</div>
      </div>
      <div class="genre-tips">${g.tips || ''}</div>
      ${g.masters && g.masters.length ? `
        <div class="genre-masters">
          <div class="genre-masters-title">✍️ Master Writers</div>
          <div class="genre-master-list">
            ${g.masters.map(m => `<span class="genre-master-tag">${m}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// ---------- OSCARS ----------
async function loadOscars() {
  try {
    const res = await fetch('/api/screenwriting/oscars');
    const data = await res.json();
    if (data.success) renderOscars(data.history);
  } catch(e) { console.error('Failed to load Oscars', e); }
}

function renderOscars(history) {
  const list = document.getElementById('oscars-list');
  // Sort by year descending (most recent first)
  const sorted = [...history].sort((a, b) => b.year - a.year);
  list.innerHTML = sorted.map(y => `
    <div class="oscar-year-card">
      <div class="oscar-year-header">🏅 ${y.year} Academy Awards</div>
      ${y.original ? `
        <div class="oscar-category">
          <div class="oscar-cat-title">✍️ Best Original Screenplay</div>
          <div class="oscar-winner">🏆 ${y.original.title || y.original.winner || ''}</div>
          <div class="oscar-writers">✍️ ${y.original.writer || y.original.writers || ''}</div>
        </div>
      ` : ''}
      ${y.adapted ? `
        <div class="oscar-category">
          <div class="oscar-cat-title">📖 Best Adapted Screenplay</div>
          <div class="oscar-winner">🏆 ${y.adapted.title || y.adapted.winner || ''}</div>
          <div class="oscar-writers">✍️ ${y.adapted.writer || y.adapted.writers || ''}</div>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// ---------- AI SCRIPT GENERATOR ----------
async function generateScript() {
  const title = document.getElementById('gen-title').value || 'UNTITLED PROJECT';
  const logline = document.getElementById('gen-logline').value;
  const genre = document.getElementById('gen-genre').value;
  const template = document.getElementById('gen-template').value;
  const protagonist = document.getElementById('gen-protagonist').value;
  const setting = document.getElementById('gen-setting').value;

  const output = document.getElementById('generated-script-output');
  output.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text2)"><div style="font-size:40px;animation:pulse 1s infinite">✍️</div><div style="margin-top:10px">Generating screenplay...</div></div>';

  try {
    const res = await fetch('/api/screenwriting/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, logline, genre, template, protagonist, setting })
    });
    const data = await res.json();
    if (data.success) {
      renderGeneratedScript(data);
      showToast(`🎬 Script "${data.metadata.title}" generated!`, 'gold');
    } else {
      output.innerHTML = '<div style="color:var(--red);padding:20px">❌ Generation failed. Try again.</div>';
    }
  } catch(e) {
    output.innerHTML = '<div style="color:var(--red);padding:20px">❌ Network error. Try again.</div>';
  }
}

function renderGeneratedScript(data) {
  const m = data.metadata;
  const output = document.getElementById('generated-script-output');
  output.innerHTML = `
    <div class="script-output">
      <div class="script-output-title">🎬 ${m.title}</div>
      <div class="script-output-logline">${m.logline}</div>
      <div class="script-output-meta">
        <span class="script-meta-tag">🎭 ${m.genre}</span>
        <span class="script-meta-tag">📐 ${m.template}</span>
        <span class="script-meta-tag">📄 ~${m.estimatedPages} pages</span>
        <span class="script-meta-tag">💻 ${data.software}</span>
      </div>

      <div class="script-section">
        <div class="script-section-title">📜 Title Page</div>
        <div class="script-text">${(data.titlePage || '').replace(/\\n/g, '\n')}</div>
      </div>

      <div class="script-section">
        <div class="script-section-title">🎬 Opening Scene</div>
        <div class="script-text">${(data.openingScene || '').replace(/\\n/g, '\n')}</div>
      </div>

      <div class="script-section">
        <div class="script-section-title">📐 Story Outline (${m.template})</div>
        ${(data.outline || []).map((step, i) => `
          <div class="script-outline-step">
            <div class="step-num">${i + 1}</div>
            <div class="step-content">
              <div class="step-name">${step.name || step.beat || step}</div>
              <div class="step-desc">${step.description || step.desc || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="script-section">
        <div class="script-section-title">👥 Character Breakdown</div>
        ${(data.characterBreakdown || []).map(c => `
          <div class="script-char">
            <div class="script-char-role">${c.role}: ${c.name}</div>
            <div class="script-char-arc">Arc: ${c.arc}</div>
            <div class="script-char-tips">💡 ${c.tips}</div>
          </div>
        `).join('')}
      </div>

      ${data.genreTips ? `
        <div class="script-section">
          <div class="script-section-title">🎯 Genre Tips</div>
          <div style="font-size:12px;color:var(--text2);line-height:1.5;white-space:pre-line">${data.genreTips}</div>
        </div>
      ` : ''}

      ${data.masterStudy && data.masterStudy.length ? `
        <div class="script-section">
          <div class="script-section-title">📚 Study These Masters</div>
          <div class="genre-master-list">
            ${data.masterStudy.map(m => `<span class="genre-master-tag">${m}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ---------- AUTO-LOAD WRITERS WHEN TAB OPENS ----------
const origSwitchTab = switchTab;
switchTab = function(tab) {
  origSwitchTab(tab);
  if (tab === 'writing' && !document.getElementById('writers-grid').innerHTML) {
    loadWriters();
  }
};

// ===================== SPLASH =====================
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.style.transition = 'opacity .5s ease';
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      const auth = document.getElementById('auth-page');
      auth.style.display = 'flex';
      auth.style.flexDirection = 'column';
      // Auto-demo login after 1.5s
      setTimeout(() => doLogin(), 1500);
    }, 500);
  }, 2500);
});