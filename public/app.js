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
// ===================== MAIN TAB NAVIGATION =====================
const MAIN_TABS = ['dating','creative','security','business','me'];
const HUB_MAP = {
  discover:'dating', matches:'dating', stars:'dating', feed:'dating',
  music:'creative', writing:'creative', avatar:'creative', gaming:'creative',
  cyber:'security', cyberops:'security', intel:'security', secstatus:'security',
  empire:'business', web3:'business',
  profile:'me', faceid:'me'
};
let currentHub = 'dating';
let currentSubPage = null;

function switchMainTab(hub) {
  currentHub = hub;
  currentSubPage = null;
  // Highlight main tab
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  const tabItems = document.querySelectorAll('.tab-item');
  const idx = MAIN_TABS.indexOf(hub);
  if (idx >= 0 && tabItems[idx]) tabItems[idx].classList.add('active');
  // Show hub page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${hub}`);
  if (page) { page.classList.add('active'); page.classList.add('fade-in'); setTimeout(() => page.classList.remove('fade-in'), 400); }
}

function openSubPage(sub, parentHub) {
  currentHub = parentHub || HUB_MAP[sub] || 'dating';
  currentSubPage = sub;
  // Highlight parent main tab
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  const tabItems = document.querySelectorAll('.tab-item');
  const idx = MAIN_TABS.indexOf(currentHub);
  if (idx >= 0 && tabItems[idx]) tabItems[idx].classList.add('active');
  // Show sub-page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(`page-${sub}`);
  if (page) {
    page.classList.add('active'); page.classList.add('fade-in'); setTimeout(() => page.classList.remove('fade-in'), 400);
    // Inject back button if not already there
    const header = page.querySelector('.page-header, .discover-header');
    if (header && !header.querySelector('.back-btn')) {
      const btn = document.createElement('button');
      btn.className = 'back-btn';
      btn.textContent = 'Back';
      btn.onclick = function() { switchMainTab(currentHub); };
      header.insertBefore(btn, header.firstChild);
    }
  }
  // Trigger legacy switchTab for lazy-loading
  switchTab(sub);
}

function switchTab(tab) {
  currentTab = tab;
  // Keep page visibility only if called from openSubPage (don't re-toggle)
  if (!currentSubPage || currentSubPage !== tab) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(`page-${tab}`);
    if (page) { page.classList.add('active'); page.classList.add('fade-in'); setTimeout(() => page.classList.remove('fade-in'), 400); }
  }
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

// ===================== MUSIC PRODUCTION STUDIO =====================
let activeMusicTab = 'beats';
let beatsCache = [];

function switchMusicTab(tab, el) {
  activeMusicTab = tab;
  document.querySelectorAll('.music-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.music-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`music-panel-${tab}`);
  if (panel) panel.classList.add('active');
  if (tab === 'beats' && !document.getElementById('beats-grid').innerHTML) loadBeats();
  if (tab === 'daws' && !document.getElementById('daws-list').innerHTML) loadDAWs();
  if (tab === 'theory' && !document.getElementById('theory-list').innerHTML) loadTheory();
  if (tab === 'royalties' && !document.getElementById('royalties-list').innerHTML) loadRoyalties();
  if (tab === 'distro' && !document.getElementById('distro-list').innerHTML) loadDistro();
  if (tab === 'equipment' && !document.getElementById('equipment-list').innerHTML) loadEquipment();
  if (tab === 'grammys' && !document.getElementById('grammys-list').innerHTML) loadGrammys();
}

// ---------- BEATS ----------
async function loadBeats() {
  try {
    const res = await fetch('/api/music/beats');
    const data = await res.json();
    if (data.success) {
      beatsCache = data.beats;
      renderBeats(data.beats);
      document.getElementById('beats-count').textContent = `🔊 ${data.total} Genre Kits Available`;
    }
  } catch(e) { console.error('Failed to load beats', e); }
}

function renderBeats(beats) {
  document.getElementById('beats-grid').innerHTML = beats.map(b => `
    <div class="beat-card" onclick="toggleBeatDetail(this)">
      <div class="beat-card-header">
        <div class="beat-emoji">${b.emoji}</div>
        <div class="beat-info">
          <div class="beat-name">${b.name}</div>
          <div class="beat-genre">${b.genre} · ${b.era}</div>
        </div>
        <div class="beat-bpm">${b.bpm.sweet} BPM</div>
      </div>
      <div class="beat-vibes">${b.vibes.map(v => `<span class="beat-vibe">${v}</span>`).join('')}</div>
      <div class="beat-elements">${b.elements.slice(0, 4).map(e => `<span class="beat-el-tag">🎹 ${e}</span>`).join('')}</div>
      <div class="beat-producers">🎤 ${b.producers.join(' · ')}</div>
      <div class="beat-detail">
        <div class="beat-tips">💡 ${b.tips}</div>
        <div class="beat-artists">🎵 Artists: ${b.artists.join(', ')}</div>
        <div style="margin-top:6px;font-size:11px;color:var(--text2)">🎹 Key: ${b.key} · BPM Range: ${b.bpm.min}–${b.bpm.max}</div>
        <div class="beat-elements" style="margin-top:8px">${b.elements.map(e => `<span class="beat-el-tag">🎹 ${e}</span>`).join('')}</div>
      </div>
    </div>
  `).join('');
}

function toggleBeatDetail(card) {
  const detail = card.querySelector('.beat-detail');
  if (detail) detail.style.display = detail.style.display === 'none' || !detail.style.display ? 'block' : 'none';
}

function searchBeats(query) {
  if (!beatsCache.length) return;
  const q = query.toLowerCase();
  const filtered = beatsCache.filter(b =>
    b.name.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q) ||
    b.producers.some(p => p.toLowerCase().includes(q)) ||
    b.vibes.some(v => v.toLowerCase().includes(q)) ||
    b.elements.some(e => e.toLowerCase().includes(q))
  );
  renderBeats(filtered);
  document.getElementById('beats-count').textContent = `🔍 ${filtered.length} kit${filtered.length !== 1 ? 's' : ''} found`;
}

// ---------- DAWs ----------
async function loadDAWs() {
  try {
    const res = await fetch('/api/music/daws');
    const data = await res.json();
    if (data.success) renderDAWs(data.daws);
  } catch(e) { console.error('Failed to load DAWs', e); }
}

function renderDAWs(daws) {
  document.getElementById('daws-list').innerHTML = daws.map(d => `
    <div class="daw-card${d.id === 'fl_studio' ? ' top-pick' : ''}">
      <div class="daw-header">
        <div class="daw-icon">${d.icon}</div>
        <div class="daw-name">${d.name}</div>
        <div class="daw-price">${d.price}</div>
      </div>
      <div class="daw-tier">⭐ ${d.tier}</div>
      <div class="daw-verdict">${d.verdict}</div>
      <div class="daw-features">${d.features.slice(0, 6).map(f => `<span class="daw-feat">✓ ${f}</span>`).join('')}${d.features.length > 6 ? `<span class="daw-feat">+${d.features.length - 6} more</span>` : ''}</div>
      <div style="font-size:11px;color:var(--text2);margin-top:4px">🎯 Best for: ${d.bestFor.join(', ')}</div>
      <div class="daw-used-by">🎤 Used by: ${d.usedBy.join(', ')}</div>
      <div style="font-size:11px;color:var(--text2);margin-top:4px">🖥️ ${d.platforms.join(' · ')}</div>
    </div>
  `).join('');
}

// ---------- THEORY ----------
async function loadTheory() {
  try {
    const res = await fetch('/api/music/theory');
    const data = await res.json();
    if (data.success) renderTheory(data.theory);
  } catch(e) { console.error('Failed to load theory', e); }
}

function renderTheory(theory) {
  const scales = Object.entries(theory.scales);
  const progs = theory.chordProgressions;
  document.getElementById('theory-list').innerHTML = `
    <div class="theory-section">
      <div class="theory-title">🎼 Scales & Modes</div>
      ${scales.map(([name, s]) => `
        <div class="scale-item">
          <div class="scale-name">${name.replace(/_/g, ' ')}</div>
          <div class="scale-mood">${s.mood}</div>
          <div class="scale-use">${s.use}</div>
        </div>
      `).join('')}
    </div>
    <div class="theory-section">
      <div class="theory-title">🎹 Chord Progressions</div>
      ${progs.map(p => `
        <div class="prog-card">
          <div class="prog-name">${p.name}</div>
          <div class="prog-numerals">${p.numerals}</div>
          <div class="prog-mood">💭 ${p.mood}</div>
          <div class="prog-examples">📽️ ${p.examples.join(', ')}</div>
          <div class="prog-genres">${p.genres.map(g => `<span class="prog-genre">${g}</span>`).join('')}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ---------- ROYALTIES ----------
async function loadRoyalties() {
  try {
    const res = await fetch('/api/music/royalties');
    const data = await res.json();
    if (data.success) renderRoyalties(data.royalties);
  } catch(e) { console.error('Failed to load royalties', e); }
}

function renderRoyalties(r) {
  document.getElementById('royalties-list').innerHTML = `
    <div class="royalty-section">
      <div class="royalty-title">🎤 Performance Royalties</div>
      <div class="royalty-desc">${r.performanceRoyalties.description}</div>
      ${r.performanceRoyalties.pro.map(p => `
        <div class="pro-card">
          <div class="pro-name">${p.name}</div>
          <div class="pro-info">${p.fullName} · ${p.members} members · Split: ${p.split}</div>
        </div>
      `).join('')}
    </div>
    <div class="royalty-section">
      <div class="royalty-title">💿 Mechanical Royalties</div>
      <div class="royalty-desc">${r.mechanicalRoyalties.description}</div>
      <div style="font-size:12px;color:#1DB954;font-weight:700;margin-top:6px">Rate: ${r.mechanicalRoyalties.rate}</div>
      <div style="font-size:12px;color:var(--text2);margin-top:4px">Streaming: ${r.mechanicalRoyalties.streaming}</div>
    </div>
    <div class="royalty-section">
      <div class="royalty-title">🎬 Sync Royalties</div>
      <div class="royalty-desc">${r.syncRoyalties.description}</div>
      <div style="font-size:13px;color:#1DB954;font-weight:700;margin-top:6px">💵 Range: ${r.syncRoyalties.range}</div>
    </div>
    <div class="royalty-section">
      <div class="royalty-title">🎵 Master Royalties</div>
      <div class="royalty-desc">${r.masterRoyalties.description}</div>
      <div style="font-size:12px;color:var(--text2);margin-top:6px">${r.masterRoyalties.typical}</div>
      <div style="font-size:12px;color:var(--text2);margin-top:4px">${r.masterRoyalties.independent}</div>
      <div style="font-size:13px;color:#1DB954;font-weight:700;margin-top:8px">👑 ${r.masterRoyalties.tips}</div>
    </div>
  `;
}

// ---------- DISTRIBUTION ----------
async function loadDistro() {
  try {
    const res = await fetch('/api/music/distribution');
    const data = await res.json();
    if (data.success) renderDistro(data.platforms);
  } catch(e) { console.error('Failed to load distro', e); }
}

function renderDistro(platforms) {
  document.getElementById('distro-list').innerHTML = platforms.map(p => `
    <div class="distro-card">
      <div class="distro-header">
        <div class="distro-icon">${p.icon}</div>
        <div class="distro-name">${p.name}</div>
        <div class="distro-price">${p.price}</div>
      </div>
      <div class="distro-keep">💰 Keep ${p.keepRoyalties} of royalties · ⚡ ${p.speed} delivery · 🌐 ${p.stores}+ stores</div>
      <div class="distro-features">${p.features.map(f => `<span class="distro-feat">✓ ${f}</span>`).join('')}</div>
      <div style="font-size:11px;color:var(--text2)">🎯 Best for: ${p.bestFor}</div>
    </div>
  `).join('');
}

// ---------- EQUIPMENT ----------
async function loadEquipment() {
  try {
    const res = await fetch('/api/music/equipment');
    const data = await res.json();
    if (data.success) renderEquipment(data.equipment);
  } catch(e) { console.error('Failed to load equipment', e); }
}

function renderEquipment(equipment) {
  document.getElementById('equipment-list').innerHTML = equipment.map(e => `
    <div class="equip-card">
      <div class="equip-header">
        <div class="equip-icon">${e.icon}</div>
        <div class="equip-name">${e.name}</div>
        <div class="equip-price">${e.price}</div>
      </div>
      <div class="equip-tier">⭐ ${e.tier} · ${e.category}</div>
      <div class="equip-verdict">${e.verdict}</div>
      <div class="equip-features">${e.features.slice(0, 5).map(f => `<span class="equip-feat">✓ ${f}</span>`).join('')}${e.features.length > 5 ? `<span class="equip-feat">+${e.features.length - 5} more</span>` : ''}</div>
      <div style="font-size:11px;color:var(--text2);margin-top:4px">🎤 Used by: ${e.usedBy.join(', ')}</div>
    </div>
  `).join('');
}

// ---------- GRAMMYS ----------
async function loadGrammys() {
  try {
    const res = await fetch('/api/music/grammys');
    const data = await res.json();
    if (data.success) renderGrammysMusic(data.history);
  } catch(e) { console.error('Failed to load Grammys', e); }
}

function renderGrammysMusic(history) {
  const sorted = [...history].sort((a, b) => b.year - a.year);
  document.getElementById('grammys-list').innerHTML = sorted.map(y => `
    <div class="grammy-card">
      <div class="grammy-year">🏆 ${y.year} Grammy Awards</div>
      <div class="grammy-cat">
        <div class="grammy-cat-title">🎤 Best Rap Album</div>
        <div class="grammy-winner">🏆 ${y.rapAlbum.title}</div>
        <div class="grammy-artist">${y.rapAlbum.artist} · ${y.rapAlbum.label}</div>
      </div>
      <div class="grammy-cat">
        <div class="grammy-cat-title">🎵 Record of the Year</div>
        <div class="grammy-winner">${y.recordOfYear.title}</div>
        <div class="grammy-artist">${y.recordOfYear.artist}</div>
      </div>
      <div class="grammy-cat">
        <div class="grammy-cat-title">✍️ Song of the Year</div>
        <div class="grammy-winner">${y.songOfYear.title}</div>
        <div class="grammy-artist">${y.songOfYear.writer}</div>
      </div>
    </div>
  `).join('');
}

// ---------- REVENUE CALCULATOR ----------
async function calculateRevenue() {
  const streams = parseInt(document.getElementById('rev-streams').value) || 0;
  const output = document.getElementById('revenue-output');
  output.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)"><div style="font-size:32px;animation:pulse 1s infinite">📊</div>Calculating...</div>';
  try {
    const res = await fetch('/api/music/calculate-revenue', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streams })
    });
    const data = await res.json();
    if (data.success) {
      output.innerHTML = `
        <div class="revenue-output">
          <div style="font-size:16px;font-weight:800;color:#1DB954;margin-bottom:4px">📊 Revenue for ${data.streams.toLocaleString()} Streams</div>
          <div style="display:flex;gap:10px;margin:12px 0;flex-wrap:wrap">
            <div style="flex:1;min-width:80px;background:var(--bg3);border-radius:10px;padding:10px;text-align:center">
              <div style="font-size:10px;color:var(--text2)">Low Est.</div>
              <div style="font-size:16px;font-weight:800;color:var(--text)">${data.total.low}</div>
            </div>
            <div style="flex:1;min-width:80px;background:rgba(29,185,84,.15);border:1px solid #1DB954;border-radius:10px;padding:10px;text-align:center">
              <div style="font-size:10px;color:#1DB954">Average</div>
              <div style="font-size:16px;font-weight:800;color:#1DB954">${data.total.average}</div>
            </div>
            <div style="flex:1;min-width:80px;background:var(--bg3);border-radius:10px;padding:10px;text-align:center">
              <div style="font-size:10px;color:var(--text2)">High Est.</div>
              <div style="font-size:16px;font-weight:800;color:var(--text)">${data.total.high}</div>
            </div>
          </div>
          <div style="font-size:13px;font-weight:700;margin:12px 0 8px">Platform Breakdown</div>
          ${data.breakdown.map(p => `
            <div class="revenue-platform">
              <div class="rev-icon">${p.icon}</div>
              <div class="rev-name">${p.platform}</div>
              <div class="rev-amount">${p.estimated}</div>
            </div>
          `).join('')}
          <div style="font-size:13px;font-weight:700;margin:16px 0 8px">🎯 Milestones</div>
          ${data.milestones.map(m => `
            <div class="milestone-row">
              <div class="milestone-streams">${m.streams.toLocaleString()}</div>
              <div class="milestone-rev">${m.revenue}</div>
              <div class="milestone-status">${m.status}</div>
            </div>
          `).join('')}
        </div>
      `;
      showToast(`📊 Revenue calculated: ${data.total.average} avg`, 'gold');
    }
  } catch(e) { output.innerHTML = '<div style="color:var(--red);padding:20px">❌ Calculation failed</div>'; }
}

// ---------- AUTO-LOAD BEATS WHEN TAB OPENS ----------
const _origSwitchTabMusic = switchTab;
switchTab = function(tab) {
  _origSwitchTabMusic(tab);
  if (tab === 'music' && !document.getElementById('beats-grid').innerHTML) loadBeats();
};

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
const _origSwitchTabWriting = switchTab;
switchTab = function(tab) {
  _origSwitchTabWriting(tab);
  if (tab === 'writing' && !document.getElementById('writers-grid').innerHTML) {
    loadWriters();
  }
};

// ===================== GOAT ROYALTY EMPIRE =====================

function switchEmpireTab(panel) {
  document.querySelectorAll('.empire-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.empire-panel').forEach(p => p.classList.remove('active'));
  // Find and activate the correct tab button
  document.querySelectorAll('.empire-tab').forEach(t => {
    if (t.textContent.toLowerCase().includes(panel)) t.classList.add('active');
  });
  document.getElementById('empire-' + panel + '-panel').classList.add('active');
  // Lazy-load data
  if (panel === 'brand' && !document.getElementById('brand-display').innerHTML) loadBrand();
  if (panel === 'merch' && !document.getElementById('merch-grid').innerHTML) loadMerch();
  if (panel === 'venues' && !document.getElementById('venues-grid').innerHTML) loadVenues();
  if (panel === 'revenue' && !document.getElementById('revenue-display').innerHTML) loadRevenue();
  if (panel === 'contracts' && !document.getElementById('contracts-grid').innerHTML) loadContracts();
  if (panel === 'legal' && !document.getElementById('legal-grid').innerHTML) loadLegal();
  if (panel === 'social' && !document.getElementById('social-grid').innerHTML) loadSocial();
}

// --- Brand ---
async function loadBrand() {
  const el = document.getElementById('brand-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading brand...</div>';
  try {
    const res = await fetch('/api/empire/brand');
    const data = await res.json();
    if (data.success) renderBrand(data.brand);
    else el.innerHTML = '<div style="color:#f44">Failed to load brand</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderBrand(brand) {
  const el = document.getElementById('brand-display');
  const divs = brand.divisions || [];
  const colors = brand.colors || [];
  let html = `
    <div class="brand-hero">
      <div class="brand-name">${brand.name}</div>
      <div class="brand-tagline">${brand.motto || 'Entertainment Empire'}</div>
      <div class="brand-divisions">
        ${divs.map(d => `
          <div class="division-card">
            <div class="division-emoji">${d.emoji || '🏰'}</div>
            <div class="division-name">${d.name}</div>
            <div class="division-desc">${d.description || ''}</div>
          </div>
        `).join('')}
      </div>
      <div class="brand-stats">
        <div class="brand-stat"><div class="brand-stat-val">${divs.length}</div><div class="brand-stat-label">Divisions</div></div>
        <div class="brand-stat"><div class="brand-stat-val">${brand.established || '2024'}</div><div class="brand-stat-label">Established</div></div>
        <div class="brand-stat"><div class="brand-stat-val">∞</div><div class="brand-stat-label">Potential</div></div>
      </div>
    </div>`;
  if (brand.mission) html += '<div style="background:var(--bg2);border-radius:12px;padding:16px;margin-top:12px;border:1px solid var(--border)"><div style="font-size:13px;font-weight:700;color:#FFD700;margin-bottom:6px">🎯 Mission</div><div style="font-size:12px;color:var(--text2);line-height:1.6">' + brand.mission + '</div></div>';
  if (brand.founder) html += '<div style="background:var(--bg2);border-radius:12px;padding:16px;margin-top:8px;border:1px solid var(--border)"><div style="font-size:13px;font-weight:700;color:#FFD700;margin-bottom:6px">👑 Founder</div><div style="font-size:12px;color:var(--text2);line-height:1.6">' + brand.founder + '</div></div>';
  if (brand.website) html += '<div style="background:var(--bg2);border-radius:12px;padding:16px;margin-top:8px;border:1px solid var(--border)"><div style="font-size:13px;font-weight:700;color:#FFD700;margin-bottom:6px">🌐 Website</div><div style="font-size:12px;color:var(--text2);line-height:1.6">' + brand.website + '</div></div>';
  if (colors.length) html += '<div style="background:var(--bg2);border-radius:12px;padding:16px;margin-top:8px;border:1px solid var(--border)"><div style="font-size:13px;font-weight:700;color:#FFD700;margin-bottom:6px">🎨 Brand Colors</div><div style="display:flex;gap:8px;flex-wrap:wrap">' + colors.map(c => '<span style="background:rgba(255,215,0,0.1);border-radius:8px;padding:4px 12px;font-size:12px;color:var(--text2)">' + c + '</span>').join('') + '</div></div>';
  el.innerHTML = html;
}

// --- Merch ---
async function loadMerch() {
  const el = document.getElementById('merch-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading merch...</div>';
  try {
    const res = await fetch('/api/empire/merch');
    const data = await res.json();
    if (data.success) renderMerch(data.catalog);
    else el.innerHTML = '<div style="color:#f44">Failed to load merch</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderMerch(catalog) {
  const el = document.getElementById('merch-grid');
  let html = catalog.map(item => `
    <div class="merch-card">
      <div class="merch-header">
        <div>
          <span class="merch-emoji">${item.emoji || '🛍️'}</span>
          <div class="merch-name">${item.name}</div>
          <div class="merch-category">${item.category}</div>
        </div>
        <div class="merch-price">${item.price}</div>
      </div>
      <div class="merch-details">
        <div class="merch-detail"><div class="merch-detail-val">${item.cost}</div><div class="merch-detail-label">Cost</div></div>
        <div class="merch-detail"><div class="merch-detail-val">${item.margin}</div><div class="merch-detail-label">Margin</div></div>
        <div class="merch-detail"><div class="merch-detail-val">${(item.sizes || []).length}</div><div class="merch-detail-label">Sizes</div></div>
      </div>
      <div class="merch-features">${(item.features || []).map(f => '<span class="merch-feature">' + f + '</span>').join('')}</div>
      <div class="merch-colors">${(item.colors || []).map(c => '<span class="merch-color">' + c + '</span>').join('')}</div>
    </div>
  `).join('');
  el.innerHTML = html;
  // Show calculator & populate select
  document.getElementById('merch-calc-section').style.display = 'block';
  const sel = document.getElementById('merch-item-select');
  sel.innerHTML = catalog.map(i => `<option value="${i.id}">${i.emoji} ${i.name} (${i.price})</option>`).join('');
}

// --- Merch Calculator ---
async function calculateMerchRevenue() {
  const itemId = document.getElementById('merch-item-select').value;
  const units = parseInt(document.getElementById('merch-units').value) || 1000;
  const el = document.getElementById('merch-calc-result');
  el.innerHTML = '<div style="text-align:center;color:var(--text2)">Calculating...</div>';
  try {
    const res = await fetch('/api/empire/calculate-merch', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ units, itemId })
    });
    const data = await res.json();
    if (data.success) {
      el.innerHTML = `
        <div class="merch-result-card">
          <div style="font-size:13px;color:var(--text2);margin-bottom:4px">${data.item} × ${data.units} units</div>
          <div class="merch-result-val">${data.netProfit}</div>
          <div class="merch-result-label">Net Profit</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:12px">
            <div class="brand-stat"><div class="brand-stat-val" style="font-size:14px">${data.grossRevenue}</div><div class="brand-stat-label">Gross Revenue</div></div>
            <div class="brand-stat"><div class="brand-stat-val" style="font-size:14px">${data.totalCost}</div><div class="brand-stat-label">Total Cost</div></div>
          </div>
          <div style="margin-top:8px;font-size:12px;color:#FFD700;font-weight:700">Margin: ${data.margin}</div>
        </div>`;
    } else el.innerHTML = '<div style="color:#f44">' + (data.error || 'Error') + '</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

// --- Venues ---
async function loadVenues() {
  const el = document.getElementById('venues-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading venues...</div>';
  try {
    const res = await fetch('/api/empire/venues');
    const data = await res.json();
    if (data.success) renderVenues(data.venues);
    else el.innerHTML = '<div style="color:#f44">Failed to load venues</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderVenues(venues) {
  const el = document.getElementById('venues-grid');
  el.innerHTML = venues.map(v => `
    <div class="venue-card">
      <div class="venue-top">
        <div>
          <div class="venue-name">${v.emoji || '🏟️'} ${v.name}</div>
          <div class="venue-location">📍 ${v.city || 'TBD'}</div>
        </div>
        <div class="venue-type">${v.tier || 'Venue'}</div>
      </div>
      <div class="venue-stats">
        <div class="venue-stat"><div class="venue-stat-val">${v.capacity ? v.capacity.toLocaleString() : 'N/A'}</div><div class="venue-stat-label">Capacity</div></div>
        <div class="venue-stat"><div class="venue-stat-val">${v.fee || 'N/A'}</div><div class="venue-stat-label">Venue Fee</div></div>
        <div class="venue-stat"><div class="venue-stat-val">${v.bestFor ? '✓' : 'N/A'}</div><div class="venue-stat-label">Best For</div></div>
      </div>
      <div style="margin-top:8px;font-size:11px;color:var(--text2)">🎯 ${v.bestFor || ''}</div>
      ${v.notable ? '<div style="margin-top:6px;font-size:11px;color:#FFD700">⭐ ' + v.notable + '</div>' : ''}
    </div>
  `).join('');
}

// --- Revenue Streams ---
async function loadRevenue() {
  const el = document.getElementById('revenue-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading revenue...</div>';
  try {
    const res = await fetch('/api/empire/revenue-streams');
    const data = await res.json();
    if (data.success) renderRevenue(data.streams);
    else el.innerHTML = '<div style="color:#f44">Failed to load revenue</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderRevenue(streams) {
  const el = document.getElementById('revenue-display');
  const arr = Array.isArray(streams) ? streams : Object.values(streams);
  let html = '<div class="revenue-chart">';
  arr.forEach(s => {
    const pct = parseInt(s.percentage) || 0;
    html += `
      <div class="revenue-bar">
        <div class="revenue-label">${s.emoji || '💰'} ${s.name}</div>
        <div class="revenue-track">
          <div class="revenue-fill" style="width:${pct * 3.3}%">
            <span class="revenue-pct">${pct}%</span>
          </div>
        </div>
      </div>
      <div style="font-size:10px;color:var(--text2);margin:-8px 0 12px 132px;line-height:1.4">${s.description || ''} ${s.growth ? '<span style="color:#00c853">' + s.growth + '</span>' : ''}</div>`;
  });
  html += '</div>';
  html += '<div class="revenue-total"><div class="revenue-total-val">' + arr.length + ' Revenue Streams</div><div class="revenue-total-label">Diversified Income Model</div></div>';
  el.innerHTML = html;
}

// --- Contracts ---
async function loadContracts() {
  const el = document.getElementById('contracts-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading contracts...</div>';
  try {
    const res = await fetch('/api/empire/contracts');
    const data = await res.json();
    if (data.success) renderContracts(data.contracts);
    else el.innerHTML = '<div style="color:#f44">Failed to load contracts</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderContracts(contracts) {
  const el = document.getElementById('contracts-grid');
  el.innerHTML = contracts.map(c => {
    const risk = (c.risk || '').toUpperCase();
    const riskClass = risk.includes('HIGH') ? 'high' : risk.includes('MED') ? 'medium' : 'low';
    return `
      <div class="contract-card">
        <div class="contract-top">
          <div class="contract-name">${c.emoji || '📝'} ${c.name}</div>
          <div class="contract-risk ${riskClass}">${c.risk || 'N/A'}</div>
        </div>
        ${c.warning ? '<div style="background:rgba(255,193,7,0.1);border:1px solid rgba(255,193,7,0.3);border-radius:8px;padding:10px;margin-bottom:10px;font-size:11px;color:#ffc107">' + c.warning + '</div>' : ''}
        <div class="contract-terms">${(c.keyTerms || []).map(t => '<span class="contract-term">' + t + '</span>').join('')}</div>
        ${c.tips ? '<div style="margin-top:10px;font-size:11px;color:var(--text2);line-height:1.5">💡 ' + c.tips + '</div>' : ''}
      </div>`;
  }).join('');
}

// --- Legal ---
async function loadLegal() {
  const el = document.getElementById('legal-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading legal...</div>';
  try {
    const res = await fetch('/api/empire/legal');
    const data = await res.json();
    if (data.success) renderLegal(data.legal);
    else el.innerHTML = '<div style="color:#f44">Failed to load legal</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderLegal(legal) {
  const el = document.getElementById('legal-grid');
  const arr = Array.isArray(legal) ? legal : Object.values(legal);
  el.innerHTML = arr.map(l => `
    <div class="legal-card">
      <div class="legal-emoji">${l.emoji || '⚖️'}</div>
      <div class="legal-topic">${l.topic || l.name || 'Legal Topic'}</div>
      <div class="legal-desc">${l.summary || l.description || ''}</div>
      ${l.keyPoints ? '<ul class="legal-points">' + l.keyPoints.map(p => '<li>' + p + '</li>').join('') + '</ul>' : ''}
    </div>
  `).join('');
}

// --- Social Strategy ---
async function loadSocial() {
  const el = document.getElementById('social-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading social...</div>';
  try {
    const res = await fetch('/api/empire/social');
    const data = await res.json();
    if (data.success) renderSocial(data.social);
    else el.innerHTML = '<div style="color:#f44">Failed to load social</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderSocial(social) {
  const el = document.getElementById('social-grid');
  const arr = Array.isArray(social) ? social : Object.values(social);
  el.innerHTML = arr.map(s => `
    <div class="social-card">
      <div class="social-top">
        <div class="social-icon">${s.emoji || '📱'}</div>
        <div>
          <div class="social-name">${s.platform || s.name}</div>
          <div class="social-audience">${s.followers || ''}</div>
        </div>
      </div>
      <div class="social-strategy">${s.tips || ''}</div>
      ${s.content ? '<div class="social-content">' + s.content.map(t => '<span class="social-type">' + t + '</span>').join('') + '</div>' : ''}
      <div class="social-metrics">
        <div class="social-metric"><div class="social-metric-val">${s.postFreq || 'N/A'}</div><div class="social-metric-label">Post Freq</div></div>
        <div class="social-metric"><div class="social-metric-val">${s.bestTime || 'N/A'}</div><div class="social-metric-label">Best Time</div></div>
      </div>
    </div>
  `).join('');
}

// --- Pitch Generator ---
async function generatePitch() {
  const el = document.getElementById('pitch-output');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">🚀 Generating pitch deck...</div>';
  const body = {
    artistName: document.getElementById('pitch-artist').value || 'GOAT Royalty',
    genre: document.getElementById('pitch-genre').value || 'Hip-Hop',
    monthlyStreams: parseInt(document.getElementById('pitch-streams').value) || 500000,
    socialFollowers: parseInt(document.getElementById('pitch-followers').value) || 100000,
    fundingAsk: parseInt(document.getElementById('pitch-funding').value) || 500000
  };
  try {
    const res = await fetch('/api/empire/generate-pitch', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.success) renderPitch(data.pitch);
    else el.innerHTML = '<div style="color:#f44">' + (data.error || 'Error') + '</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderPitch(pitch) {
  const el = document.getElementById('pitch-output');
  let html = `
    <div class="pitch-deck">
      <div class="pitch-deck-header">
        <div class="pitch-deck-title">${pitch.title || 'Investment Deck'}</div>
        <div class="pitch-deck-sub">${new Date(pitch.timestamp).toLocaleDateString()}</div>
      </div>`;
  (pitch.sections || []).forEach(sec => {
    html += `
      <div class="pitch-section">
        <div class="pitch-section-name">${sec.name}</div>
        <div class="pitch-section-content">${(sec.content || '').replace(/\\n/g, '\n')}</div>
      </div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

// Empire auto-load on tab switch
const _origSwitchTabEmpire = switchTab;
switchTab = function(tab) {
  _origSwitchTabEmpire(tab);
  if (tab === 'empire' && !document.getElementById('brand-display').innerHTML) {
    loadBrand();
  }
};

// ===================== ADVANCED CYBER OPS =====================

function switchCyberOpsTab(panel) {
  document.querySelectorAll('.cop-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.cop-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.cop-tab').forEach(t => {
    if (t.textContent.toLowerCase().includes(panel.substring(0,4))) t.classList.add('active');
  });
  document.getElementById('cop-' + panel + '-panel').classList.add('active');
  if (panel === 'pentest' && !document.getElementById('pentest-grid').innerHTML) loadPenTestTools();
  if (panel === 'owasp' && !document.getElementById('owasp-grid').innerHTML) loadOWASP();
  if (panel === 'threats' && !document.getElementById('threats-display').innerHTML) loadThreatIntel();
  if (panel === 'forensics' && !document.getElementById('forensics-grid').innerHTML) loadForensics();
  if (panel === 'crypto' && !document.getElementById('crypto-display').innerHTML) loadCrypto();
  if (panel === 'ir' && !document.getElementById('ir-display').innerHTML) loadIR();
  if (panel === 'compliance' && !document.getElementById('compliance-grid').innerHTML) loadCompliance();
  if (panel === 'certs' && !document.getElementById('certs-grid').innerHTML) loadCerts();
}

// --- PenTest Tools ---
async function loadPenTestTools() {
  const el = document.getElementById('pentest-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading tools...</div>';
  try {
    const res = await fetch('/api/cyberops/tools');
    const data = await res.json();
    if (data.success) renderPenTestTools(data.tools);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderPenTestTools(tools) {
  document.getElementById('pentest-grid').innerHTML = tools.map(t => {
    const diffClass = t.difficulty.toLowerCase();
    return `
    <div class="pentool-card">
      <div class="pentool-top">
        <div class="pentool-name">${t.emoji} ${t.name}</div>
        <div class="pentool-cat">${t.category}</div>
      </div>
      <div class="pentool-desc">${t.description}</div>
      <div class="pentool-cmds">${t.commands.map(c => '<div class="pentool-cmd">' + c + '</div>').join('')}</div>
      <div class="pentool-meta">
        <span class="pentool-diff ${diffClass}">${t.difficulty}</span>
        <span class="pentool-power">Power: ${'🟢'.repeat(Math.ceil(t.power/2))} ${t.power}/10</span>
      </div>
      <div class="pentool-tip">💡 ${t.tip}</div>
    </div>`;
  }).join('');
}

// --- OWASP Top 10 ---
async function loadOWASP() {
  const el = document.getElementById('owasp-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading OWASP...</div>';
  try {
    const res = await fetch('/api/cyberops/owasp');
    const data = await res.json();
    if (data.success) renderOWASP(data.owasp);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderOWASP(owasp) {
  document.getElementById('owasp-grid').innerHTML = owasp.map(o => {
    const sevClass = o.severity.toLowerCase();
    return `
    <div class="owasp-card">
      <div><span class="owasp-rank">${o.rank}</span><span class="owasp-name">${o.emoji} ${o.id}: ${o.name}</span><span class="owasp-severity ${sevClass}">${o.severity}</span></div>
      <div class="owasp-desc">${o.description}</div>
      <div class="owasp-section">
        <div class="owasp-section-title">⚠️ Examples</div>
        <div class="owasp-list">${o.examples.map(e => '<span class="owasp-item">' + e + '</span>').join('')}</div>
      </div>
      <div class="owasp-section">
        <div class="owasp-section-title">✅ Prevention</div>
        <div class="owasp-list">${o.prevention.map(p => '<span class="owasp-item owasp-prev">' + p + '</span>').join('')}</div>
      </div>
      ${o.prevalence ? '<div style="font-size:10px;color:var(--text2);margin-top:8px">📊 Prevalence: ' + o.prevalence + '</div>' : ''}
    </div>`;
  }).join('');
}

// --- Threat Intel ---
async function loadThreatIntel() {
  const el = document.getElementById('threats-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading threat intel...</div>';
  try {
    const res = await fetch('/api/cyberops/threat-intel');
    const data = await res.json();
    if (data.success) renderCyberOpsThreatIntel(data.intel);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderCyberOpsThreatIntel(intel) {
  let html = '<div class="threat-section"><div class="threat-section-title">🎯 Active Threat Actors</div>';
  intel.activeThreatActors.forEach(a => {
    html += `<div class="threat-card">
      <div class="threat-top"><div class="threat-name">${a.emoji} ${a.name}</div><div class="threat-danger">${a.dangerLevel}/10</div></div>
      <div class="threat-origin">🌍 Origin: ${a.origin}</div>
      <div class="threat-targets">🎯 Targets: ${a.targets}</div>
      <div class="threat-ttps">⚔️ TTPs: ${a.ttps}</div>
    </div>`;
  });
  html += '</div>';

  html += '<div class="threat-section"><div class="threat-section-title">🔥 Recent Critical CVEs</div>';
  intel.recentCVEs.forEach(c => {
    const cvssClass = c.cvss >= 9 ? 'crit' : 'high';
    html += `<div class="cve-card">
      <div class="cve-top"><div class="cve-id">${c.id}</div><div class="cve-cvss ${cvssClass}">CVSS ${c.cvss}</div></div>
      <div class="cve-name">${c.name}</div>
      <div class="cve-desc">${c.description}</div>
    </div>`;
  });
  html += '</div>';

  html += '<div class="threat-section"><div class="threat-section-title">📊 Attack Vector Distribution</div>';
  intel.attackVectors.forEach(v => {
    html += `<div class="attack-vector">
      <div class="av-emoji">${v.emoji}</div>
      <div class="av-info"><div class="av-name">${v.name} ${v.trend}</div><div class="av-desc">${v.description}</div></div>
      <div class="av-bar"><div class="av-fill" style="width:${v.percentage * 2.8}%"></div></div>
      <div class="av-pct">${v.percentage}%</div>
    </div>`;
  });
  html += '</div>';

  document.getElementById('threats-display').innerHTML = html;
}

// --- Forensics ---
async function loadForensics() {
  const el = document.getElementById('forensics-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading forensics...</div>';
  try {
    const res = await fetch('/api/cyberops/forensics');
    const data = await res.json();
    if (data.success) renderForensics(data.toolkit);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderForensics(toolkit) {
  document.getElementById('forensics-grid').innerHTML = toolkit.map(t => `
    <div class="forensic-card">
      <div class="forensic-emoji">${t.emoji}</div>
      <div class="forensic-name">${t.name}</div>
      <div class="forensic-cat">${t.category}</div>
      <div class="forensic-desc">${t.description}</div>
      <div class="forensic-caps">${t.capabilities.map(c => '<span class="forensic-cap">' + c + '</span>').join('')}</div>
      <div class="forensic-use">🎯 ${t.useCase}</div>
    </div>
  `).join('');
}

// --- Cryptography ---
async function loadCrypto() {
  const el = document.getElementById('crypto-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading cryptography...</div>';
  try {
    const res = await fetch('/api/cyberops/crypto');
    const data = await res.json();
    if (data.success) renderCrypto(data.crypto);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderCrypto(crypto) {
  let html = '<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:700;color:#7c4dff;margin-bottom:12px">🔐 Algorithms</div>';
  crypto.algorithms.forEach(a => {
    const recClass = a.recommendation.includes('DEPRECATED') ? 'deprecated' : a.recommendation.includes('FUTURE') ? 'future' : '';
    html += `<div class="crypto-card">
      <div class="crypto-top"><div class="crypto-name">${a.emoji} ${a.name}</div><div class="crypto-rec ${recClass}">${a.recommendation}</div></div>
      <div class="crypto-meta">
        <div class="crypto-meta-item"><div class="crypto-meta-val">${a.type}</div><div class="crypto-meta-label">Type</div></div>
        <div class="crypto-meta-item"><div class="crypto-meta-val">${a.strength}</div><div class="crypto-meta-label">Strength</div></div>
        <div class="crypto-meta-item"><div class="crypto-meta-val">${a.speed}</div><div class="crypto-meta-label">Speed</div></div>
      </div>
      <div class="crypto-use">📋 ${a.useCase}</div>
    </div>`;
  });
  html += '</div>';

  html += '<div><div style="font-size:14px;font-weight:700;color:#7c4dff;margin-bottom:12px">🌐 Protocols</div>';
  crypto.protocols.forEach(p => {
    html += `<div class="protocol-card">
      <div class="protocol-name">${p.name}</div>
      <div class="protocol-status">${p.status}</div>
      <div class="protocol-desc">${p.description}</div>
    </div>`;
  });
  html += '</div>';

  document.getElementById('crypto-display').innerHTML = html;
}

// --- Incident Response ---
async function loadIR() {
  const el = document.getElementById('ir-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading IR...</div>';
  try {
    const res = await fetch('/api/cyberops/incident-response');
    const data = await res.json();
    if (data.success) renderIR(data.ir);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderIR(ir) {
  let html = '<div style="margin-bottom:16px"><div style="font-size:14px;font-weight:700;color:#00ff41;margin-bottom:12px">📋 NIST IR Phases</div>';
  ir.phases.forEach(p => {
    html += `<div class="ir-phase" data-phase="Phase ${p.phase}">
      <div class="ir-phase-name">${p.emoji} ${p.name}</div>
      <div class="ir-phase-desc">${p.description}</div>
      <ul class="ir-tasks">${p.tasks.map(t => '<li>' + t + '</li>').join('')}</ul>
    </div>`;
  });
  html += '</div>';

  html += '<div><div style="font-size:14px;font-weight:700;color:#ff4444;margin-bottom:12px">🚨 Severity Levels</div>';
  ir.severityLevels.forEach(s => {
    html += `<div class="severity-card">
      <div class="severity-emoji">${s.emoji}</div>
      <div style="flex:1">
        <div class="severity-level">${s.level}</div>
        <div class="severity-response">Response: ${s.response}</div>
        <div class="severity-desc">${s.description}</div>
      </div>
    </div>`;
  });
  html += '</div>';

  document.getElementById('ir-display').innerHTML = html;
}

// --- Compliance ---
async function loadCompliance() {
  const el = document.getElementById('compliance-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading compliance...</div>';
  try {
    const res = await fetch('/api/cyberops/compliance');
    const data = await res.json();
    if (data.success) renderCompliance(data.frameworks);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderCompliance(frameworks) {
  document.getElementById('compliance-grid').innerHTML = frameworks.map(f => `
    <div class="compliance-card">
      <div class="compliance-top">
        <div class="compliance-name">${f.emoji} ${f.name}</div>
        <div class="compliance-diff">${f.difficulty}</div>
      </div>
      <div class="compliance-desc">${f.description}</div>
      <div class="compliance-meta">
        <div class="compliance-meta-item"><div class="compliance-meta-val">${f.industry}</div><div class="compliance-meta-label">Industry</div></div>
        <div class="compliance-meta-item"><div class="compliance-meta-val">${f.timeline}</div><div class="compliance-meta-label">Timeline</div></div>
      </div>
    </div>
  `).join('');
}

// --- Certifications ---
async function loadCerts() {
  const el = document.getElementById('certs-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading certs...</div>';
  try {
    const res = await fetch('/api/cyberops/certs');
    const data = await res.json();
    if (data.success) renderCerts(data.certs);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderCerts(certs) {
  document.getElementById('certs-grid').innerHTML = certs.map(c => {
    const lvlClass = c.level.toLowerCase();
    return `
    <div class="cert-card">
      <div class="cert-top">
        <div class="cert-name">${c.emoji} ${c.name}</div>
        <div class="cert-level ${lvlClass}">${c.level}</div>
      </div>
      <div class="cert-desc">${c.description}</div>
      <div class="cert-meta">
        <div class="cert-meta-item"><div class="cert-meta-val">${c.salary}</div><div class="cert-meta-label">Salary Range</div></div>
        <div class="cert-meta-item"><div class="cert-meta-val">${c.examCost}</div><div class="cert-meta-label">Exam Cost</div></div>
        <div class="cert-meta-item"><div class="cert-meta-val">${c.prereq}</div><div class="cert-meta-label">Prerequisites</div></div>
      </div>
    </div>`;
  }).join('');
}

// --- Attack Simulator ---
async function runSimulation() {
  const el = document.getElementById('sim-output');
  const scenario = document.getElementById('sim-scenario').value;
  el.innerHTML = '<div style="text-align:center;padding:20px;color:#00ff41">⚔️ Running simulation...</div>';
  try {
    const res = await fetch('/api/cyberops/simulate', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ scenario })
    });
    const data = await res.json();
    if (data.success) renderSimulation(data.simulation);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderSimulation(sim) {
  let html = `<div class="sim-result">
    <div class="sim-header">
      <div class="sim-title">${sim.emoji} ${sim.scenario}</div>
      <div class="sim-meta">${sim.difficulty} | MITRE ATT&CK: ${sim.mitreAttack}</div>
    </div>`;
  sim.results.forEach(r => {
    html += `<div class="sim-step">
      <div class="sim-step-num">${r.step}</div>
      <div class="sim-step-action">${r.action}</div>
      <div class="sim-step-status">${r.status}</div>
      <div class="sim-step-dur">${r.duration}</div>
    </div>`;
  });
  html += `<div class="sim-verdict">
    <div class="sim-verdict-score">${sim.overallScore}</div>
    <div class="sim-verdict-text">${sim.recommendation}</div>
  </div></div>`;
  document.getElementById('sim-output').innerHTML = html;
}

// CyberOps auto-load on tab switch
const _origSwitchTabCyberOps = switchTab;
switchTab = function(tab) {
  _origSwitchTabCyberOps(tab);
  if (tab === 'cyberops' && !document.getElementById('pentest-grid').innerHTML) {
    loadPenTestTools();
  }
};

// ===================== METAVERSE & WEB3 =====================

function switchWeb3Tab(panel) {
  document.querySelectorAll('.w3-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.w3-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.w3-tab').forEach(t => {
    if (t.textContent.toLowerCase().includes(panel.substring(0,4))) t.classList.add('active');
  });
  document.getElementById('w3-' + panel + '-panel').classList.add('active');
  if (panel === 'nfts' && !document.getElementById('nfts-grid').innerHTML) loadNFTs();
  if (panel === 'wallet' && !document.getElementById('wallet-display').innerHTML) loadWallet();
  if (panel === 'contracts' && !document.getElementById('contracts-display').innerHTML) loadSmartContracts();
  if (panel === 'venues' && !document.getElementById('vvenues-grid').innerHTML) loadVirtualVenues();
  if (panel === 'token' && !document.getElementById('token-display').innerHTML) loadToken();
  if (panel === 'defi' && !document.getElementById('defi-grid').innerHTML) loadDeFi();
  if (panel === 'explorer' && !document.getElementById('explorer-display').innerHTML) loadExplorer();
  if (panel === 'learn' && !document.getElementById('learn-grid').innerHTML) loadWeb3Learn();
}

// --- NFTs ---
async function loadNFTs() {
  const el = document.getElementById('nfts-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading NFTs...</div>';
  try {
    const res = await fetch('/api/web3/nfts');
    const data = await res.json();
    if (data.success) renderNFTs(data.collections);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderNFTs(collections) {
  document.getElementById('nfts-grid').innerHTML = collections.map(c => `
    <div class="nft-card">
      <div class="nft-header">
        <div class="nft-name">${c.emoji} ${c.name}</div>
        <div class="nft-chain">${c.chain} · ${c.standard}</div>
      </div>
      <div class="nft-desc">${c.description}</div>
      <div class="nft-stats">
        <div class="nft-stat"><div class="nft-stat-val">${c.supply.toLocaleString()}</div><div class="nft-stat-label">Supply</div></div>
        <div class="nft-stat"><div class="nft-stat-val">${c.minted.toLocaleString()}</div><div class="nft-stat-label">Minted</div></div>
        <div class="nft-stat"><div class="nft-stat-val">${c.floorPrice}</div><div class="nft-stat-label">Floor</div></div>
        <div class="nft-stat"><div class="nft-stat-val">${c.volume}</div><div class="nft-stat-label">Volume</div></div>
      </div>
      <div class="nft-utils">${c.utilities.map(u => '<span class="nft-util">' + u + '</span>').join('')}</div>
      <div class="nft-rarity">${Object.entries(c.rarity).map(([k,v]) => '<span class="nft-rarity-tier">' + k + ': ' + v + '</span>').join('')}</div>
      <button class="nft-mint-btn" onclick="mintNFT('${c.id}')">🎨 Mint ${c.name}</button>
      <div id="mint-result-${c.id}"></div>
    </div>
  `).join('');
}

async function mintNFT(collectionId) {
  const el = document.getElementById('mint-result-' + collectionId);
  el.innerHTML = '<div style="text-align:center;color:#7c4dff;padding:8px">⏳ Minting...</div>';
  try {
    const res = await fetch('/api/web3/mint', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ collectionId, quantity: 1 })
    });
    const data = await res.json();
    if (data.success) {
      const m = data.mint;
      el.innerHTML = '<div class="mint-result"><div class="mint-result-title">✅ Minted Successfully!</div><div class="mint-result-detail">Token: ' + m.tokenIds.join(', ') + ' | Rarity: ' + m.rarity + '<br>Gas: ' + m.gasUsed + ' | TX: ' + m.transactionHash.substring(0,16) + '...</div></div>';
    } else el.innerHTML = '<div style="color:#f44;padding:8px">' + data.error + '</div>';
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

// --- Wallet ---
async function loadWallet() {
  const el = document.getElementById('wallet-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading wallet...</div>';
  try {
    const res = await fetch('/api/web3/wallet');
    const data = await res.json();
    if (data.success) renderWallet(data.wallet);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderWallet(wallet) {
  let html = '<div class="wallet-section"><div class="wallet-section-title">⛓️ Supported Chains</div>';
  wallet.supported.forEach(c => {
    html += '<div class="chain-card"><div class="chain-emoji">' + c.emoji + '</div><div style="flex:1"><div class="chain-name">' + c.name + ' <span class="chain-type">' + c.type + '</span></div><div class="chain-cap">Market Cap: ' + c.marketCap + '</div><div class="chain-use">' + c.useCase + '</div></div></div>';
  });
  html += '</div>';
  html += '<div class="wallet-section"><div class="wallet-section-title">🛡️ Security Features</div>';
  wallet.securityFeatures.forEach(f => {
    html += '<div class="security-feat">' + f + '</div>';
  });
  html += '</div>';
  document.getElementById('wallet-display').innerHTML = html;
}

// --- Smart Contracts ---
async function loadSmartContracts() {
  const el = document.getElementById('contracts-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading contracts...</div>';
  try {
    const res = await fetch('/api/web3/contracts');
    const data = await res.json();
    if (data.success) renderSmartContracts(data.contracts);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderSmartContracts(contracts) {
  document.getElementById('contracts-display').innerHTML = contracts.map(c => `
    <div class="sc-card">
      <div class="sc-top"><div class="sc-name">${c.emoji} ${c.name}</div><div class="sc-lang">${c.language}</div></div>
      <div class="sc-desc">${c.description}</div>
      <div class="sc-features">${c.features.map(f => '<span class="sc-feat">' + f + '</span>').join('')}</div>
      <div class="sc-meta"><span>⛽ ${c.gas}</span><span class="sc-audit">${c.auditStatus}</span></div>
    </div>
  `).join('');
}

// --- Virtual Venues ---
async function loadVirtualVenues() {
  const el = document.getElementById('vvenues-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading venues...</div>';
  try {
    const res = await fetch('/api/web3/venues');
    const data = await res.json();
    if (data.success) renderVirtualVenues(data.venues);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderVirtualVenues(venues) {
  document.getElementById('vvenues-grid').innerHTML = venues.map(v => `
    <div class="vv-card">
      <div class="vv-header"><div class="vv-name">${v.emoji} ${v.name}</div><div class="vv-type">${v.type}</div></div>
      <div class="vv-desc">${v.description}</div>
      <div class="vv-stats">
        <div class="vv-stat"><div class="vv-stat-val">${v.capacity.toLocaleString()}</div><div class="vv-stat-label">Capacity</div></div>
        <div class="vv-stat"><div class="vv-stat-val">${v.tech}</div><div class="vv-stat-label">Tech Stack</div></div>
        <div class="vv-stat"><div class="vv-stat-val">${v.ticketPrice}</div><div class="vv-stat-label">Ticket</div></div>
      </div>
      <div class="vv-features">${v.features.map(f => '<span class="vv-feat">' + f + '</span>').join('')}</div>
    </div>
  `).join('');
}

// --- Token Economy ---
async function loadToken() {
  const el = document.getElementById('token-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading token...</div>';
  try {
    const res = await fetch('/api/web3/token');
    const data = await res.json();
    if (data.success) renderToken(data.economy);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderToken(economy) {
  const t = economy.token;
  let html = '<div class="token-hero"><div class="token-name">' + t.emoji + ' ' + t.name + '</div><div class="token-symbol">' + t.symbol + '</div><div class="token-price">' + t.price + '</div><div class="token-mcap">Market Cap: ' + t.marketCap + ' | Holders: ' + t.holders + '</div></div>';
  html += '<div class="token-dist">';
  economy.distribution.forEach(d => {
    html += '<div class="token-dist-bar"><div class="token-dist-label">' + d.emoji + ' ' + d.name + '</div><div class="token-dist-track"><div class="token-dist-fill" style="width:' + (d.percentage * 3.3) + '%"><span class="token-dist-pct">' + d.percentage + '%</span></div></div></div>';
  });
  html += '</div>';
  html += '<div style="margin-top:16px"><div style="font-size:13px;font-weight:700;color:#7c4dff;margin-bottom:8px">🔧 Token Utilities</div><div class="token-utils">' + economy.utilities.map(u => '<span class="token-util-item">' + u + '</span>').join('') + '</div></div>';
  document.getElementById('token-display').innerHTML = html;
}

// --- DeFi ---
async function loadDeFi() {
  const el = document.getElementById('defi-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading DeFi...</div>';
  try {
    const res = await fetch('/api/web3/defi');
    const data = await res.json();
    if (data.success) renderDeFi(data.defi);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderDeFi(defi) {
  document.getElementById('defi-grid').innerHTML = defi.map(d => `
    <div class="defi-card">
      <div class="defi-top"><div class="defi-name">${d.emoji} ${d.name}</div><div class="defi-apy">${d.apy}</div></div>
      <div class="defi-desc">${d.description}</div>
      <div class="defi-meta">
        <div class="defi-meta-item"><div class="defi-meta-val">${d.minStake}</div><div class="defi-meta-label">Min Stake</div></div>
        <div class="defi-meta-item"><div class="defi-meta-val">${d.lockPeriod}</div><div class="defi-meta-label">Lock Period</div></div>
      </div>
      <div style="margin-top:8px;font-size:11px;color:var(--text2)">💰 ${d.rewards}</div>
    </div>
  `).join('');
}

// --- Explorer ---
async function loadExplorer() {
  const el = document.getElementById('explorer-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading explorer...</div>';
  try {
    const res = await fetch('/api/web3/explorer');
    const data = await res.json();
    if (data.success) renderExplorer(data.explorer);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderExplorer(explorer) {
  const s = explorer.networkStats;
  let html = '<div class="explorer-stats">';
  html += '<div class="explorer-stat"><div class="explorer-stat-val">' + s.totalTransactions + '</div><div class="explorer-stat-label">Transactions</div></div>';
  html += '<div class="explorer-stat"><div class="explorer-stat-val">' + s.uniqueWallets + '</div><div class="explorer-stat-label">Wallets</div></div>';
  html += '<div class="explorer-stat"><div class="explorer-stat-val">' + s.nftsMinted + '</div><div class="explorer-stat-label">NFTs Minted</div></div>';
  html += '<div class="explorer-stat"><div class="explorer-stat-val">' + s.totalValueLocked + '</div><div class="explorer-stat-label">TVL</div></div>';
  html += '<div class="explorer-stat"><div class="explorer-stat-val">' + s.goatBurned + '</div><div class="explorer-stat-label">Burned</div></div>';
  html += '<div class="explorer-stat"><div class="explorer-stat-val">' + s.activeContracts + '</div><div class="explorer-stat-label">Contracts</div></div>';
  html += '</div>';
  html += '<div style="font-size:13px;font-weight:700;color:#7c4dff;margin-bottom:10px">📋 Recent Transactions</div>';
  explorer.recentTransactions.forEach(tx => {
    html += '<div class="tx-card"><div class="tx-hash">' + tx.hash + '</div><div class="tx-type">' + tx.type + '</div><div class="tx-amount">' + tx.amount + '</div><div class="tx-parties">' + tx.from + ' → ' + tx.to + '</div><div class="tx-time">' + tx.time + '</div></div>';
  });
  document.getElementById('explorer-display').innerHTML = html;
}

// --- Web3 Learn ---
async function loadWeb3Learn() {
  const el = document.getElementById('learn-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading lessons...</div>';
  try {
    const res = await fetch('/api/web3/learn');
    const data = await res.json();
    if (data.success) renderWeb3Learn(data.lessons);
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

function renderWeb3Learn(lessons) {
  document.getElementById('learn-grid').innerHTML = lessons.map(l => {
    const diffClass = l.difficulty.toLowerCase();
    return '<div class="learn-card"><div class="learn-top"><div class="learn-topic">' + l.emoji + ' ' + l.topic + '</div><div class="learn-diff ' + diffClass + '">' + l.difficulty + '</div></div><div class="learn-desc">' + l.description + '</div></div>';
  }).join('');
}

// Web3 auto-load on tab switch
const _origSwitchTabWeb3 = switchTab;
switchTab = function(tab) {
  _origSwitchTabWeb3(tab);
  if (tab === 'web3' && !document.getElementById('nfts-grid').innerHTML) {
    loadNFTs();
  }
};

// ===================== INTELLIGENCE NETWORK =====================

function switchIntelTab(panel) {
  document.querySelectorAll('.intel-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.intel-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.intel-tab').forEach(t => {
    if (t.textContent.toLowerCase().includes(panel.substring(0,4))) t.classList.add('active');
  });
  document.getElementById('intel-' + panel + '-panel').classList.add('active');
  if (panel === 'osint' && !document.getElementById('osint-grid').innerHTML) loadOSINTTools();
  if (panel === 'profiles' && !document.getElementById('profiles-grid').innerHTML) loadThreatProfiles();
  if (panel === 'comms' && !document.getElementById('comms-grid').innerHTML) loadEncryptedComms();
  if (panel === 'soceng' && !document.getElementById('soceng-display').innerHTML) loadSocialEng();
  if (panel === 'privacy' && !document.getElementById('privacy-grid').innerHTML) loadPrivacyTools();
  if (panel === 'countersurv' && !document.getElementById('countersurv-grid').innerHTML) loadCounterSurv();
  if (panel === 'breaches' && !document.getElementById('breaches-grid').innerHTML) loadBreaches();
}

async function loadOSINTTools() {
  const el = document.getElementById('osint-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading OSINT tools...</div>';
  try {
    const res = await fetch('/api/intel/osint-tools');
    const data = await res.json();
    if (data.success) el.innerHTML = data.tools.map(t => `
      <div class="osint-card">
        <div class="osint-top"><div class="osint-name">${t.emoji} ${t.name}</div><div class="osint-cat">${t.category}</div></div>
        <div class="osint-desc">${t.description}</div>
        <div class="osint-caps">${t.capabilities.map(c => '<span class="osint-cap">' + c + '</span>').join('')}</div>
        <div class="osint-meta"><span>💰 ${t.license}</span><span>📊 ${t.difficulty}</span></div>
      </div>
    `).join('');
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

async function loadThreatProfiles() {
  const el = document.getElementById('profiles-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading profiles...</div>';
  try {
    const res = await fetch('/api/intel/threat-profiles');
    const data = await res.json();
    if (data.success) el.innerHTML = data.profiles.map(p => `
      <div class="profile-card">
        <div class="profile-top"><div class="profile-type">${p.emoji} ${p.type}</div><div class="profile-danger">${p.dangerLevel}/10</div></div>
        <div style="font-size:11px;color:var(--text2);margin-bottom:6px">🎯 Motivation: ${p.motivation}</div>
        <div class="profile-section"><div class="profile-section-title">⚠️ Indicators</div><div class="profile-items">${p.indicators.map(i => '<span class="profile-item">' + i + '</span>').join('')}</div></div>
        <div class="profile-defense">🛡️ Defense: ${p.defense}</div>
      </div>
    `).join('');
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

async function loadEncryptedComms() {
  const el = document.getElementById('comms-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading comms...</div>';
  try {
    const res = await fetch('/api/intel/encrypted-comms');
    const data = await res.json();
    if (data.success) el.innerHTML = data.comms.map(c => `
      <div class="comm-card">
        <div class="comm-top"><div class="comm-name">${c.emoji} ${c.name}</div><div class="comm-rating">${c.rating}/10</div></div>
        <div class="comm-enc">🔐 ${c.encryption}</div>
        <div class="comm-features">${c.features.map(f => '<span class="comm-feat">' + f + '</span>').join('')}</div>
        <div class="comm-platforms">📱 ${c.platforms.join(' · ')}</div>
        <div class="comm-verdict">${c.verdict}</div>
      </div>
    `).join('');
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

async function loadSocialEng() {
  const el = document.getElementById('soceng-display');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading social engineering...</div>';
  try {
    const res = await fetch('/api/intel/social-engineering');
    const data = await res.json();
    if (data.success) {
      const se = data.socialEng;
      let html = '<div class="soceng-stats">';
      Object.entries(se.stats).forEach(([k,v]) => {
        const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        html += '<div class="soceng-stat"><div class="soceng-stat-val">' + v + '</div><div class="soceng-stat-label">' + label + '</div></div>';
      });
      html += '</div>';
      se.techniques.forEach(t => {
        html += '<div class="soceng-card"><div class="soceng-name">' + t.emoji + ' ' + t.name + '</div><div class="soceng-desc">' + t.description + '</div><div class="soceng-defense">🛡️ ' + t.defense + '</div></div>';
      });
      el.innerHTML = html;
    }
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

async function loadPrivacyTools() {
  const el = document.getElementById('privacy-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading privacy tools...</div>';
  try {
    const res = await fetch('/api/intel/privacy-tools');
    const data = await res.json();
    if (data.success) el.innerHTML = data.tools.map(t => `
      <div class="priv-card">
        <div class="priv-top"><div class="priv-name">${t.emoji} ${t.name}</div><div class="priv-rec">${t.recommendation}</div></div>
        <div class="priv-desc">${t.description}</div>
      </div>
    `).join('');
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

async function loadCounterSurv() {
  const el = document.getElementById('countersurv-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading counter-surveillance...</div>';
  try {
    const res = await fetch('/api/intel/counter-surveillance');
    const data = await res.json();
    if (data.success) el.innerHTML = data.measures.map(m => `
      <div class="cs-card">
        <div class="cs-threat">${m.emoji} ${m.threat}</div>
        <div class="cs-section"><div class="cs-section-title">🔍 Detection</div><div class="cs-items">${m.detection.map(d => '<span class="cs-item">' + d + '</span>').join('')}</div></div>
        <div class="cs-counter">🛡️ ${m.countermeasure}</div>
      </div>
    `).join('');
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

async function loadBreaches() {
  const el = document.getElementById('breaches-grid');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Loading breaches...</div>';
  try {
    const res = await fetch('/api/intel/breaches');
    const data = await res.json();
    if (data.success) el.innerHTML = data.breaches.map(b => {
      const impactClass = b.impact.toLowerCase();
      return '<div class="breach-card"><div class="breach-top"><div class="breach-name">' + b.emoji + ' ' + b.name + '</div><div class="breach-impact ' + impactClass + '">' + b.impact + '</div></div><div class="breach-records">' + b.records + ' records</div><div class="breach-type">Type: ' + b.type + '</div><div class="breach-lesson">📝 ' + b.lesson + '</div></div>';
    }).join('');
  } catch(e) { el.innerHTML = '<div style="color:#f44">Error: ' + e.message + '</div>'; }
}

// Intel auto-load on tab switch
const _origSwitchTabIntel = switchTab;
switchTab = function(tab) {
  _origSwitchTabIntel(tab);
  if (tab === 'intel' && !document.getElementById('osint-grid').innerHTML) {
    loadOSINTTools();
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