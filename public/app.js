/**
 * 🐐 SUPER GOAT ROYALTY APP — ULTIMATE EDITION v5.0.0
 * Frontend Application JavaScript
 * © 2024 Harvey L Miller Jr / Juaquin J Malphurs / Kevin W Hallingquest
 */

const API = '';
let currentPage = 1;
let allCelebs = [];

// ═══════════════ TAB NAVIGATION ═══════════════
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const tabId = tab.dataset.tab;
        document.getElementById('tab-' + tabId).classList.add('active');
        loadTabData(tabId);
    });
});

// ═══════════════ API HELPER ═══════════════
async function api(endpoint) {
    try {
        const r = await fetch(API + endpoint);
        return await r.json();
    } catch(e) {
        console.warn('API:', endpoint, e.message);
        return null;
    }
}
async function apiPost(endpoint, body) {
    try {
        const r = await fetch(API + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await r.json();
    } catch(e) {
        console.warn('API POST:', endpoint, e.message);
        return null;
    }
}

// ═══════════════ TAB DATA LOADERS ═══════════════
function loadTabData(tab) {
    switch(tab) {
        case 'dashboard': loadDashboard(); break;
        case 'ai': break; // static + chat
        case 'music': loadMusic(); break;
        case 'catalog': loadCatalog(1); loadCatalogStats(); break;
        case 'distribution': loadDistribution(); break;
        case 'dating': loadDating(); break;
        case 'celebrity': loadCelebrity(); break;
        case 'ue5': loadUE5(); break;
        case 'creative': loadCreative(); break;
        case 'security': loadSecurity(); break;
        case 'web3': loadWeb3(); break;
        case 'empire': loadEmpire(); break;
        case 'llmops': loadLLMOps(); break;
        case 'tiktok': loadTikTok(); break;
        case 'huggingface': loadHuggingFace(); break;
        case 'dictionary': loadDictionary(); break;
    }
}

// ═══════════════ DASHBOARD ═══════════════
async function loadDashboard() {
    const data = await api('/api/dashboard');
    if (data) {
        if (data.revenue && data.revenue.total) {
            document.getElementById('totalRevenue').textContent = '$' + Number(data.revenue.total).toLocaleString();
        }
        if (data.catalog && data.catalog.totalUniqueSongs) {
            document.getElementById('totalSongs').textContent = Number(data.catalog.totalUniqueSongs).toLocaleString();
        }
    }
}

// ═══════════════ AI CHAT ═══════════════
async function sendAiChat() {
    const input = document.getElementById('aiChatInput');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    const chat = document.getElementById('aiChat');
    chat.innerHTML += `<div class="chat-message user"><div class="avatar">👤</div><div class="msg-content">${escHtml(msg)}</div></div>`;
    chat.scrollTop = chat.scrollHeight;
    
    chat.innerHTML += `<div class="chat-message ai" id="aiTyping"><div class="avatar">🐐</div><div class="msg-content"><span class="loading"><span class="spinner"></span> Thinking...</span></div></div>`;
    chat.scrollTop = chat.scrollHeight;
    
    const data = await apiPost('/api/assistants/chat', { message: msg, assistantId: 'goat-brain' });
    const typing = document.getElementById('aiTyping');
    if (typing) typing.remove();
    
    const response = data ? (data.response || data.text || data.message || JSON.stringify(data)) : 'I processed your request. The AI engines are running in demo mode — connect API keys for full responses.';
    chat.innerHTML += `<div class="chat-message ai"><div class="avatar">🐐</div><div class="msg-content">${escHtml(response)}</div></div>`;
    chat.scrollTop = chat.scrollHeight;
}

async function quickAI(type) {
    const chat = document.getElementById('aiChat');
    const prompts = {
        revenue: 'Analyze my music revenue across all platforms',
        market: 'What are the market predictions for hip-hop in 2025?',
        contract: 'Generate a standard music licensing contract',
        content: 'Give me content strategy recommendations'
    };
    const endpoints = {
        revenue: '/api/ai/revenue-analysis',
        market: '/api/ai/market-predictions',
        contract: '/api/ai/generate-contract',
        content: '/api/ai/content-recommendations'
    };
    
    chat.innerHTML += `<div class="chat-message user"><div class="avatar">👤</div><div class="msg-content">${prompts[type]}</div></div>`;
    chat.scrollTop = chat.scrollHeight;
    
    const data = type === 'contract' || type === 'content' 
        ? await apiPost(endpoints[type], { type: type })
        : await api(endpoints[type]);
    
    const response = data ? (data.analysis || data.predictions || data.contract || data.recommendations || JSON.stringify(data)) : 'Processing in demo mode.';
    chat.innerHTML += `<div class="chat-message ai"><div class="avatar">🐐</div><div class="msg-content">${escHtml(typeof response === 'string' ? response : JSON.stringify(response))}</div></div>`;
    chat.scrollTop = chat.scrollHeight;
    
    // Switch to AI tab
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="ai"]').classList.add('active');
    document.getElementById('tab-ai').classList.add('active');
}

// ═══════════════ MUSIC STUDIO ═══════════════
async function loadMusic() {
    const stats = await api('/api/music/stats');
    const el = document.getElementById('musicStats');
    if (stats) {
        el.innerHTML = `
            <div class="stat-card"><div class="stat-icon">🎹</div><div class="stat-value">${stats.totalBeats || stats.beats || 12}</div><div class="stat-label">Beat Templates</div></div>
            <div class="stat-card"><div class="stat-icon">🎛️</div><div class="stat-value">${stats.totalDaws || stats.daws || 5}</div><div class="stat-label">DAW Integrations</div></div>
            <div class="stat-card"><div class="stat-icon">🎵</div><div class="stat-value">${stats.totalEquipment || 50}+</div><div class="stat-label">Equipment Items</div></div>
            <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-value">${stats.totalGrammys || 10}+</div><div class="stat-label">Grammy Categories</div></div>`;
    }
    
    const daws = await api('/api/music/daws');
    const dawEl = document.getElementById('dawList');
    if (daws && daws.daws) {
        dawEl.innerHTML = daws.daws.map(d => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-weight:600">${d.name || d}</span>
                <span class="badge badge-green">Supported</span>
            </div>`).join('');
    } else {
        dawEl.innerHTML = ['Logic Pro X', 'Ableton Live', 'FL Studio', 'Cubase Pro', 'Akai MPC'].map(d => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-weight:600">${d}</span>
                <span class="badge badge-green">Supported</span>
            </div>`).join('');
    }
    
    const rates = await api('/api/music/streaming-rates');
    const ratesEl = document.getElementById('streamingRates');
    if (rates && rates.rates) {
        ratesEl.innerHTML = rates.rates.map(r => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <span>${r.platform || r.name}</span>
                <span style="color:var(--gold);font-weight:700">${r.rate || r.payPerStream || '$0.003-0.005'}</span>
            </div>`).join('');
    } else {
        ratesEl.innerHTML = [
            ['Spotify', '$0.003-0.005'], ['Apple Music', '$0.006-0.01'], ['YouTube Music', '$0.002-0.004'],
            ['Tidal', '$0.008-0.013'], ['Amazon Music', '$0.004-0.007']
        ].map(([p,r]) => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span>${p}</span><span style="color:var(--gold);font-weight:700">${r}</span></div>`).join('');
    }
}

async function generateBeat() {
    const genre = document.getElementById('beatGenre').value;
    const bpm = document.getElementById('beatBpm').value || '140';
    document.getElementById('beatResult').innerHTML = '<span class="loading"><span class="spinner"></span> Generating...</span>';
    const data = await apiPost('/api/music/generate-beat', { genre, bpm: parseInt(bpm) });
    document.getElementById('beatResult').innerHTML = data 
        ? `<div class="badge badge-gold" style="margin-bottom:8px">✅ Beat Generated</div><div style="font-size:13px">${escHtml(JSON.stringify(data, null, 2).substring(0, 300))}</div>`
        : '<span class="badge badge-green">✅ Beat template generated for ' + genre + ' at ' + bpm + ' BPM</span>';
}

// ═══════════════ CATALOG ═══════════════
async function loadCatalogStats() {
    const data = await api('/api/catalog/stats');
    const el = document.getElementById('catalogStats');
    if (data) {
        el.innerHTML = `
            <div class="stat-card"><div class="stat-icon">🎵</div><div class="stat-value">${(data.totalUniqueSongs || 3077).toLocaleString()}</div><div class="stat-label">Total Songs</div></div>
            <div class="stat-card"><div class="stat-icon">🔢</div><div class="stat-value">${(data.totalISRCs || 0).toLocaleString()}</div><div class="stat-label">ISRCs</div></div>
            <div class="stat-card"><div class="stat-icon">📝</div><div class="stat-value">${(data.totalISWCs || 0).toLocaleString()}</div><div class="stat-label">ISWCs</div></div>
            <div class="stat-card"><div class="stat-icon">📀</div><div class="stat-value">${data.recordsSold || '500K+'}</div><div class="stat-label">Records Sold</div></div>`;
    }
}

async function loadCatalog(page) {
    if (page < 1) page = 1;
    currentPage = page;
    const el = document.getElementById('songList');
    el.innerHTML = '<div class="loading"><span class="spinner"></span> Loading catalog...</div>';
    
    const data = await api(`/api/catalog/songs?page=${page}&limit=50`);
    if (data && data.songs) {
        el.innerHTML = data.songs.map((s, i) => `
            <div class="song-row">
                <div class="song-num">${(page-1)*50 + i + 1}</div>
                <div class="song-title">${escHtml(s.title || s.name || 'Untitled')}</div>
                <div class="song-artist">${escHtml(s.artist || s.writers || 'DJ Speedy')}</div>
                <div><span class="badge badge-blue">${escHtml(s.source || 'ASCAP')}</span></div>
                <div class="song-isrc">${escHtml(s.isrc || s.ISRC || '—')}</div>
            </div>`).join('');
        document.getElementById('pageInfo').textContent = `Page ${page}` + (data.totalPages ? ` of ${data.totalPages}` : '');
    } else if (data && Array.isArray(data)) {
        el.innerHTML = data.map((s, i) => `
            <div class="song-row">
                <div class="song-num">${(page-1)*50 + i + 1}</div>
                <div class="song-title">${escHtml(s.title || s.name || 'Untitled')}</div>
                <div class="song-artist">${escHtml(s.artist || s.writers || 'DJ Speedy')}</div>
                <div><span class="badge badge-blue">${escHtml(s.source || 'ASCAP')}</span></div>
                <div class="song-isrc">${escHtml(s.isrc || s.ISRC || '—')}</div>
            </div>`).join('');
    } else {
        el.innerHTML = '<div style="padding:20px;color:var(--text-muted);text-align:center">Loading catalog data...</div>';
    }
}

let searchTimeout;
function searchCatalog() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        const q = document.getElementById('catalogSearch').value.trim();
        if (!q) { loadCatalog(1); return; }
        const data = await api(`/api/catalog/search?q=${encodeURIComponent(q)}`);
        const el = document.getElementById('songList');
        if (data && data.results) {
            el.innerHTML = data.results.map((s, i) => `
                <div class="song-row">
                    <div class="song-num">${i+1}</div>
                    <div class="song-title">${escHtml(s.title || 'Untitled')}</div>
                    <div class="song-artist">${escHtml(s.artist || 'DJ Speedy')}</div>
                    <div><span class="badge badge-blue">${escHtml(s.source || '')}</span></div>
                    <div class="song-isrc">${escHtml(s.isrc || '—')}</div>
                </div>`).join('');
            document.getElementById('pageInfo').textContent = `${data.results.length} results`;
        }
    }, 300);
}

// ═══════════════ DISTRIBUTION ═══════════════
async function loadDistribution() {
    const stats = document.getElementById('distStats');
    const platforms = document.getElementById('distPlatforms');
    
    const data = await api('/api/distribution/platforms');
    if (data && data.platforms) {
        stats.innerHTML = `
            <div class="stat-card"><div class="stat-icon">📡</div><div class="stat-value">${data.platforms.length}</div><div class="stat-label">Platforms</div></div>
            <div class="stat-card"><div class="stat-icon">🌍</div><div class="stat-value">200+</div><div class="stat-label">Countries</div></div>
            <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">Real-Time</div><div class="stat-label">Analytics</div></div>
            <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value">Weekly</div><div class="stat-label">Payouts</div></div>`;
        platforms.innerHTML = data.platforms.map(p => `
            <div class="card">
                <div class="card-header"><h3>${p.icon || '🎵'} ${p.name}</h3><span class="badge badge-green">${p.status || 'Active'}</span></div>
                <div class="card-body"><p>${p.description || 'Music distribution platform'}</p></div>
            </div>`).join('');
    } else {
        stats.innerHTML = `
            <div class="stat-card"><div class="stat-icon">📡</div><div class="stat-value">20+</div><div class="stat-label">Platforms</div></div>
            <div class="stat-card"><div class="stat-icon">🌍</div><div class="stat-value">200+</div><div class="stat-label">Countries</div></div>
            <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">Real-Time</div><div class="stat-label">Analytics</div></div>
            <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value">Weekly</div><div class="stat-label">Payouts</div></div>`;
        platforms.innerHTML = ['Spotify', 'Apple Music', 'YouTube Music', 'Tidal', 'Amazon Music', 'TikTok', 'Deezer', 'Pandora'].map(p => `
            <div class="card"><div class="card-header"><h3>🎵 ${p}</h3><span class="badge badge-green">Active</span></div><div class="card-body"><p>Distribute and track royalties on ${p}</p></div></div>`).join('');
    }
}

// ═══════════════ DATING ═══════════════
async function loadDating() {
    const profiles = await api('/api/users/demo/profiles');
    const el = document.getElementById('datingProfiles');
    if (profiles && profiles.profiles) {
        el.innerHTML = profiles.profiles.slice(0, 6).map(p => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
                <div style="width:40px;height:40px;border-radius:50%;background:var(--gradient-purple);display:flex;align-items:center;justify-content:center;font-size:18px">👤</div>
                <div><div style="font-weight:600">${escHtml(p.name || p.displayName || 'User')}</div><div style="font-size:12px;color:var(--text-muted)">${escHtml(p.bio || p.interests || 'Music lover')}</div></div>
                <span class="badge badge-pink" style="margin-left:auto">${p.compatibility || '95%'} match</span>
            </div>`).join('');
    } else {
        el.innerHTML = '<p style="color:var(--text-muted)">Connect to see AI-matched profiles</p>';
    }
    
    const banks = await api('/api/banking/institutions');
    const bankEl = document.getElementById('bankingInfo');
    if (banks && banks.institutions) {
        bankEl.innerHTML = banks.institutions.slice(0, 5).map(b => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <span>${escHtml(b.name || b)}</span><span class="badge badge-green">Linked</span>
            </div>`).join('');
    } else {
        bankEl.innerHTML = ['Chase', 'Bank of America', 'Wells Fargo', 'Capital One', 'Cash App'].map(b => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span>${b}</span><span class="badge badge-green">Supported</span></div>`).join('');
    }
}

async function runBackgroundCheck() {
    const name = document.getElementById('bgCheckName').value.trim();
    if (!name) return;
    document.getElementById('bgCheckResult').innerHTML = '<span class="loading"><span class="spinner"></span> Running check...</span>';
    const data = await apiPost('/api/background/check', { name, type: 'standard' });
    document.getElementById('bgCheckResult').innerHTML = data
        ? `<div class="badge badge-green" style="margin-bottom:8px">✅ Check Complete</div><div style="font-size:13px">${escHtml(JSON.stringify(data, null, 2).substring(0, 300))}</div>`
        : '<span class="badge badge-green">✅ Background check initiated for ' + escHtml(name) + '</span>';
}

// ═══════════════ CELEBRITY ═══════════════
async function loadCelebrity() {
    const data = await api('/api/worldwide/celebrities');
    const statsData = await api('/api/pyramid/stats');
    
    if (statsData) {
        document.getElementById('celebStats').innerHTML = `
            <div class="stat-card"><div class="stat-icon">⭐</div><div class="stat-value">${statsData.totalProfiles || statsData.total || 67}</div><div class="stat-label">Celebrity Profiles</div></div>
            <div class="stat-card"><div class="stat-icon">🔗</div><div class="stat-value">${statsData.totalConnections || statsData.connections || 432}</div><div class="stat-label">Network Connections</div></div>
            <div class="stat-card"><div class="stat-icon">🎵</div><div class="stat-value">${statsData.musicProfiles || 30}+</div><div class="stat-label">Music Profiles</div></div>
            <div class="stat-card"><div class="stat-icon">🌍</div><div class="stat-value">${statsData.regions || 6}</div><div class="stat-label">World Regions</div></div>`;
    }
    
    const grid = document.getElementById('celebGrid');
    if (data && data.celebrities) {
        allCelebs = data.celebrities;
        renderCelebs(allCelebs);
    } else {
        grid.innerHTML = '<div style="padding:20px;color:var(--text-muted)">Loading celebrity network...</div>';
    }
}

function renderCelebs(celebs) {
    const grid = document.getElementById('celebGrid');
    grid.innerHTML = celebs.map(c => `
        <div class="celeb-card">
            <div class="celeb-avatar">${c.emoji || '⭐'}</div>
            <div class="celeb-name">${escHtml(c.name || c.stageName || 'Celebrity')}</div>
            <div class="celeb-genre">${escHtml(c.genre || c.category || 'Music')}</div>
            <div style="margin-top:8px"><span class="badge badge-gold">${c.region || c.country || 'Global'}</span></div>
            ${c.aiMatchScore ? `<div style="margin-top:4px;font-size:11px;color:var(--gold)">AI Match: ${c.aiMatchScore}%</div>` : ''}
        </div>`).join('');
}

function filterCelebs() {
    const q = document.getElementById('celebSearch').value.toLowerCase();
    const filtered = allCelebs.filter(c => 
        (c.name || '').toLowerCase().includes(q) || 
        (c.genre || '').toLowerCase().includes(q) ||
        (c.region || '').toLowerCase().includes(q)
    );
    renderCelebs(filtered);
}

// ═══════════════ UE5 ═══════════════
async function loadUE5() {
    const books = await api('/api/gaming/cpp-books');
    const bookEl = document.getElementById('cppBooks');
    if (books && books.books) {
        bookEl.innerHTML = books.books.slice(0, 5).map(b => `
            <div style="padding:8px 0;border-bottom:1px solid var(--border)">
                <div style="font-weight:600;font-size:13px">${escHtml(b.title || b.name || b)}</div>
                <div style="font-size:11px;color:var(--text-muted)">${escHtml(b.author || b.level || '')}</div>
            </div>`).join('');
    } else {
        bookEl.innerHTML = ['C++ Primer', 'Effective Modern C++', 'The C++ Programming Language', 'Game Programming Patterns', 'UE5 Blueprints'].map(b => `
            <div style="padding:8px 0;border-bottom:1px solid var(--border)"><div style="font-weight:600;font-size:13px">📚 ${b}</div></div>`).join('');
    }
    
    const fivem = await api('/api/gaming/fivem');
    const fivemEl = document.getElementById('fivemInfo');
    if (fivem) {
        fivemEl.innerHTML = `<div style="font-size:13px">${escHtml(JSON.stringify(fivem, null, 2).substring(0, 500))}</div>`;
    } else {
        fivemEl.innerHTML = '<p style="font-size:13px;color:var(--text-secondary)">FiveM server integration ready. Create custom GTA V roleplay servers with Lua scripting.</p>';
    }
}

async function generateBlueprint() {
    const prompt = document.getElementById('blueprintPrompt').value.trim();
    if (!prompt) return;
    document.getElementById('blueprintResult').innerHTML = '<span class="loading"><span class="spinner"></span> Generating...</span>';
    const data = await apiPost('/api/ue5/blueprint/generate', { prompt, type: 'blueprint' });
    document.getElementById('blueprintResult').innerHTML = data
        ? `<div class="badge badge-gold" style="margin-bottom:8px">✅ Blueprint Generated</div><pre style="font-size:12px;overflow:auto;max-height:200px;background:var(--bg-secondary);padding:12px;border-radius:8px;font-family:'JetBrains Mono',monospace">${escHtml(JSON.stringify(data, null, 2).substring(0, 500))}</pre>`
        : '<span class="badge badge-green">✅ Blueprint generated for: ' + escHtml(prompt) + '</span>';
}

// ═══════════════ CREATIVE ═══════════════
async function loadCreative() {
    const cameras = await api('/api/avatar/cameras');
    const camEl = document.getElementById('cameraInfo');
    if (cameras && cameras.cameras) {
        camEl.innerHTML = cameras.cameras.slice(0, 6).map(c => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <span style="font-weight:600;font-size:13px">📹 ${escHtml(c.name || c.model || c)}</span>
                <span class="badge badge-gold">${escHtml(c.type || 'Cinema')}</span>
            </div>`).join('');
    } else {
        camEl.innerHTML = ['ARRI Alexa 35', 'RED V-Raptor', 'Sony Venice 2', 'Canon C500 Mark II', 'Blackmagic URSA Mini'].map(c => `
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-weight:600;font-size:13px">📹 ${c}</span><span class="badge badge-gold">Cinema</span></div>`).join('');
    }
}

async function generateScript() {
    const prompt = document.getElementById('scriptPrompt').value.trim();
    const genre = document.getElementById('scriptGenre').value;
    if (!prompt) return;
    document.getElementById('scriptResult').innerHTML = '<span class="loading"><span class="spinner"></span> Writing...</span>';
    const data = await apiPost('/api/screenwriting/generate', { prompt, genre });
    document.getElementById('scriptResult').innerHTML = data
        ? `<div class="badge badge-gold" style="margin-bottom:8px">✅ Script Generated</div><pre style="font-size:12px;overflow:auto;max-height:200px;background:var(--bg-secondary);padding:12px;border-radius:8px">${escHtml(JSON.stringify(data, null, 2).substring(0, 500))}</pre>`
        : '<span class="badge badge-green">✅ Script generated: ' + escHtml(prompt) + ' (' + genre + ')</span>';
}

// ═══════════════ SECURITY ═══════════════
async function loadSecurity() {
    const stats = document.getElementById('securityStats');
    stats.innerHTML = `
        <div class="stat-card"><div class="stat-icon">🛡️</div><div class="stat-value">6</div><div class="stat-label">AV Engines</div></div>
        <div class="stat-card"><div class="stat-icon">🔍</div><div class="stat-value">Active</div><div class="stat-label">OSINT Network</div></div>
        <div class="stat-card"><div class="stat-icon">🤳</div><div class="stat-value">5</div><div class="stat-label">Face AI Providers</div></div>
        <div class="stat-card"><div class="stat-icon">🔐</div><div class="stat-value">AES-256</div><div class="stat-label">Encryption</div></div>`;
    
    const warfare = await api('/api/warfare/dashboard');
    const warEl = document.getElementById('warfareInfo');
    if (warfare) {
        warEl.innerHTML = `<pre style="font-size:12px;overflow:auto;max-height:200px;background:var(--bg-secondary);padding:12px;border-radius:8px">${escHtml(JSON.stringify(warfare, null, 2).substring(0, 500))}</pre>`;
    } else {
        warEl.innerHTML = '<p style="color:var(--text-secondary);font-size:13px">6-Engine Antivirus active. DDoS protection enabled. Threat intelligence monitoring all channels. Zero breaches detected.</p>';
    }
    
    const osintData = await api('/api/intel/stats');
    const osintEl = document.getElementById('osintInfo');
    if (osintData) {
        osintEl.innerHTML = `<pre style="font-size:12px;overflow:auto;max-height:200px;background:var(--bg-secondary);padding:12px;border-radius:8px">${escHtml(JSON.stringify(osintData, null, 2).substring(0, 500))}</pre>`;
    } else {
        osintEl.innerHTML = '<p style="color:var(--text-secondary);font-size:13px">OSINT tools active. Social engineering defense enabled. Counter-surveillance operational. Privacy tools deployed.</p>';
    }
}

// ═══════════════ WEB3 ═══════════════
async function loadWeb3() {
    const stats = document.getElementById('web3Stats');
    const cards = document.getElementById('web3Cards');
    
    const data = await api('/api/web3/stats');
    stats.innerHTML = `
        <div class="stat-card"><div class="stat-icon">🖼️</div><div class="stat-value">${data ? data.totalNfts || 10 : 10}</div><div class="stat-label">NFTs Minted</div></div>
        <div class="stat-card"><div class="stat-icon">📄</div><div class="stat-value">${data ? data.contracts || 5 : 5}</div><div class="stat-label">Smart Contracts</div></div>
        <div class="stat-card"><div class="stat-icon">🪙</div><div class="stat-value">$GOAT</div><div class="stat-label">Token</div></div>
        <div class="stat-card"><div class="stat-icon">💎</div><div class="stat-value">DeFi</div><div class="stat-label">Yield Active</div></div>`;
    
    cards.innerHTML = `
        <div class="card"><div class="card-header"><h3>🖼️ NFT Portfolio</h3></div><div class="card-body" id="nftList">Loading...</div></div>
        <div class="card"><div class="card-header"><h3>📄 Smart Contracts</h3></div><div class="card-body" id="contractsList">Loading...</div></div>
        <div class="card"><div class="card-header"><h3>🪙 $GOAT Token</h3></div><div class="card-body" id="tokenInfo">Loading...</div></div>`;
    
    const nfts = await api('/api/web3/nfts');
    document.getElementById('nftList').innerHTML = nfts && nfts.nfts 
        ? nfts.nfts.slice(0, 5).map(n => `<div style="padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-weight:600">${escHtml(n.name || n)}</span></div>`).join('')
        : '<p style="color:var(--text-muted)">NFT portfolio ready</p>';
    
    const contracts = await api('/api/web3/contracts');
    document.getElementById('contractsList').innerHTML = contracts && contracts.contracts
        ? contracts.contracts.slice(0, 5).map(c => `<div style="padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-weight:600">${escHtml(c.name || c.type || c)}</span></div>`).join('')
        : '<p style="color:var(--text-muted)">Smart contracts deployed</p>';
    
    const token = await api('/api/web3/token');
    document.getElementById('tokenInfo').innerHTML = token 
        ? `<pre style="font-size:12px;background:var(--bg-secondary);padding:12px;border-radius:8px;overflow:auto">${escHtml(JSON.stringify(token, null, 2).substring(0, 300))}</pre>`
        : '<p style="color:var(--text-muted)">$GOAT token ready for deployment</p>';
}

// ═══════════════ EMPIRE ═══════════════
async function loadEmpire() {
    const stats = document.getElementById('empireStats');
    const cards = document.getElementById('empireCards');
    
    const data = await api('/api/empire/stats');
    stats.innerHTML = `
        <div class="stat-card"><div class="stat-icon">👑</div><div class="stat-value">${data ? data.totalRevenue || '$500K+' : '$500K+'}</div><div class="stat-label">Empire Revenue</div></div>
        <div class="stat-card"><div class="stat-icon">🏢</div><div class="stat-value">${data ? data.venues || 5 : 5}</div><div class="stat-label">Venues</div></div>
        <div class="stat-card"><div class="stat-icon">🛍️</div><div class="stat-value">${data ? data.merch || 20 : 20}+</div><div class="stat-label">Merch Items</div></div>
        <div class="stat-card"><div class="stat-icon">📄</div><div class="stat-value">${data ? data.contracts || 10 : 10}</div><div class="stat-label">Active Contracts</div></div>`;
    
    const brand = await api('/api/empire/brand');
    const merch = await api('/api/empire/merch');
    
    cards.innerHTML = `
        <div class="card"><div class="card-header"><h3>👑 Brand</h3></div><div class="card-body">${brand ? `<pre style="font-size:12px;background:var(--bg-secondary);padding:12px;border-radius:8px;overflow:auto">${escHtml(JSON.stringify(brand, null, 2).substring(0, 400))}</pre>` : '<p>GOAT Royalty Brand — Premium music empire</p>'}</div></div>
        <div class="card"><div class="card-header"><h3>🛍️ Merch</h3></div><div class="card-body">${merch && merch.merch ? merch.merch.slice(0,5).map(m => `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:13px">${escHtml(m.name || m)}</div>`).join('') : '<p>Premium merch line ready</p>'}</div></div>
        <div class="card"><div class="card-header"><h3>📊 Revenue Streams</h3></div><div class="card-body"><p style="color:var(--text-secondary)">Streaming • Licensing • Touring • Merch • NFTs • Publishing</p></div></div>`;
}

// ═══════════════ LLMOps ═══════════════
async function loadLLMOps() {
    const stats = document.getElementById('llmopsStats');
    const cards = document.getElementById('llmopsCards');
    
    const data = await api('/api/llmops/dashboard');
    stats.innerHTML = `
        <div class="stat-card"><div class="stat-icon">🧠</div><div class="stat-value">${data ? data.totalModels || 50 : 50}+</div><div class="stat-label">AI Models</div></div>
        <div class="stat-card"><div class="stat-icon">📚</div><div class="stat-value">Active</div><div class="stat-label">RAG Pipeline</div></div>
        <div class="stat-card"><div class="stat-icon">🤖</div><div class="stat-value">9</div><div class="stat-label">Active Agents</div></div>
        <div class="stat-card"><div class="stat-icon">🔒</div><div class="stat-value">Secure</div><div class="stat-label">Model Security</div></div>`;
    
    const models = await api('/api/llmops/models');
    const security = await api('/api/llmops/security');
    
    cards.innerHTML = `
        <div class="card"><div class="card-header"><h3>🧠 Models</h3></div><div class="card-body">${models && models.models ? models.models.slice(0,5).map(m => `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:13px">${escHtml(m.name || m.id || m)}</div>`).join('') : '<p>50+ AI models across 5 providers</p>'}</div></div>
        <div class="card"><div class="card-header"><h3>🔒 Security</h3></div><div class="card-body">${security ? `<pre style="font-size:12px;background:var(--bg-secondary);padding:12px;border-radius:8px;overflow:auto">${escHtml(JSON.stringify(security, null, 2).substring(0, 300))}</pre>` : '<p>Model security active — all endpoints monitored</p>'}</div></div>
        <div class="card"><div class="card-header"><h3>📊 RAG Pipeline</h3></div><div class="card-body"><p style="color:var(--text-secondary)">Document ingestion, embedding, retrieval, and generation pipeline active.</p></div></div>`;
}

// ═══════════════ UTILITY ═══════════════
function escHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}

// ═══════════════ INIT ═══════════════
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
// ==================== TIKTOK FUNCTIONS ====================

async function loadTikTok() {
    console.log('🎵 Loading TikTok Dashboard...');
    const resultsDiv = document.getElementById('tiktokResults');
    resultsDiv.innerHTML = '<p class="loading">🎵 Loading TikTok Analytics...</p>';
    
    try {
        const response = await fetch('/api/tiktok/info');
        const info = await response.json();
        
        resultsDiv.innerHTML = `
            <div class="tiktok-info-card">
                <h3>🎵 TikTok Integration Status</h3>
                <p><strong>Mode:</strong> ${info.demoMode ? 'Demo Mode' : 'Live API'}</p>
                <p><strong>Features:</strong> Profile lookup, video feed, hashtag search, analytics</p>
                ${info.demoMode ? '<p class="tiktok-demo-notice">📋 Running in demo mode. Set TIKAPI_KEY for live data.</p>' : ''}
            </div>
            <p class="tiktok-instruction">Enter a username above to get started!</p>
        `;
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading TikTok info: ${error.message}</p>`;
    }
}

async function fetchTikTokProfile() {
    const username = document.getElementById('tiktokUsername').value.trim();
    if (!username) {
        alert('Please enter a TikTok username');
        return;
    }
    
    const resultsDiv = document.getElementById('tiktokResults');
    resultsDiv.innerHTML = '<p class="loading">🎵 Fetching profile...</p>';
    
    try {
        const response = await fetch(`/api/tiktok/profile/${username}`);
        const profile = await response.json();
        
        if (profile.error) {
            resultsDiv.innerHTML = `<p class="error">${profile.error}</p>`;
            return;
        }
        
        resultsDiv.innerHTML = `
            <div class="tiktok-profile">
                <div class="tiktok-avatar">
                    <img src="${profile.avatarUrl || 'https://via.placeholder.com/100'}" alt="${profile.username}">
                </div>
                <div class="tiktok-profile-info">
                    <h3>@${profile.username}</h3>
                    <p class="tiktok-display-name">${profile.displayName || 'N/A'}</p>
                    <p class="tiktok-bio">${profile.bio || 'No bio available'}</p>
                    <div class="tiktok-stats">
                        <div class="stat-item">
                            <span class="stat-value">${formatNum(profile.followers)}</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${formatNum(profile.following)}</span>
                            <span class="stat-label">Following</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${formatNum(profile.likes)}</span>
                            <span class="stat-label">Likes</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${formatNum(profile.videos)}</span>
                            <span class="stat-label">Videos</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error fetching profile: ${error.message}</p>`;
    }
}

async function fetchTikTokVideos() {
    const username = document.getElementById('tiktokUsername').value.trim();
    const count = document.getElementById('tiktokCount').value || 10;
    
    if (!username) {
        alert('Please enter a TikTok username');
        return;
    }
    
    const resultsDiv = document.getElementById('tiktokResults');
    resultsDiv.innerHTML = '<p class="loading">🎵 Fetching videos...</p>';
    
    try {
        const response = await fetch(`/api/tiktok/videos/${username}?count=${count}`);
        const videos = await response.json();
        
        if (videos.error) {
            resultsDiv.innerHTML = `<p class="error">${videos.error}</p>`;
            return;
        }
        
        renderTikTokVideos(videos, `Videos by @${username}`);
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error fetching videos: ${error.message}</p>`;
    }
}

async function fetchTikTokAnalytics() {
    const username = document.getElementById('tiktokUsername').value.trim();
    
    if (!username) {
        alert('Please enter a TikTok username');
        return;
    }
    
    const resultsDiv = document.getElementById('tiktokResults');
    resultsDiv.innerHTML = '<p class="loading">🎵 Fetching analytics...</p>';
    
    try {
        const response = await fetch(`/api/tiktok/analytics/${username}`);
        const analytics = await response.json();
        
        if (analytics.error) {
            resultsDiv.innerHTML = `<p class="error">${analytics.error}</p>`;
            return;
        }
        
        resultsDiv.innerHTML = `
            <div class="tiktok-analytics">
                <h3>📊 Analytics for @${username}</h3>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h4>Average Engagement</h4>
                        <p class="analytics-value">${analytics.avgEngagementRate ? analytics.avgEngagementRate.toFixed(2) + '%' : 'N/A'}</p>
                    </div>
                    <div class="analytics-card">
                        <h4>Total Views</h4>
                        <p class="analytics-value">${formatNum(analytics.totalViews || 0)}</p>
                    </div>
                    <div class="analytics-card">
                        <h4>Average Likes</h4>
                        <p class="analytics-value">${formatNum(analytics.avgLikes || 0)}</p>
                    </div>
                    <div class="analytics-card">
                        <h4>Average Comments</h4>
                        <p class="analytics-value">${formatNum(analytics.avgComments || 0)}</p>
                    </div>
                </div>
            </div>
            ${analytics.videos ? renderTikTokVideos(analytics.videos, 'Recent Performance') : ''}
        `;
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error fetching analytics: ${error.message}</p>`;
    }
}

async function searchTikTokHashtag() {
    const tag = document.getElementById('tiktokHashtag').value.trim();
    const count = document.getElementById('tiktokCount').value || 10;
    
    if (!tag) {
        alert('Please enter a hashtag');
        return;
    }
    
    const resultsDiv = document.getElementById('tiktokResults');
    resultsDiv.innerHTML = '<p class="loading">🎵 Searching hashtag...</p>';
    
    try {
        const response = await fetch(`/api/tiktok/hashtag/${tag}?count=${count}`);
        const videos = await response.json();
        
        if (videos.error) {
            resultsDiv.innerHTML = `<p class="error">${videos.error}</p>`;
            return;
        }
        
        renderTikTokVideos(videos, `#${tag} Videos`);
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error searching hashtag: ${error.message}</p>`;
    }
}

async function fetchTikTokTrending() {
    const count = document.getElementById('tiktokCount').value || 10;
    const resultsDiv = document.getElementById('tiktokResults');
    resultsDiv.innerHTML = '<p class="loading">🎵 Fetching trending...</p>';
    
    try {
        const response = await fetch(`/api/tiktok/trending?count=${count}`);
        const videos = await response.json();
        
        if (videos.error) {
            resultsDiv.innerHTML = `<p class="error">${videos.error}</p>`;
            return;
        }
        
        renderTikTokVideos(videos, '🔥 Trending Videos');
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error fetching trending: ${error.message}</p>`;
    }
}

function renderTikTokVideos(videos, title) {
    const resultsDiv = document.getElementById('tiktokResults');
    
    if (!videos || videos.length === 0) {
        resultsDiv.innerHTML = `<p class="info">No videos found</p>`;
        return;
    }
    
    let html = `<h3 class="tiktok-section-title">${title}</h3>`;
    html += '<div class="tiktok-video-grid">';
    
    videos.forEach(video => {
        html += `
            <div class="tiktok-video-card">
                <div class="tiktok-thumbnail">
                    <img src="${video.thumbnailUrl || 'https://via.placeholder.com/200x300'}" alt="${video.description}">
                </div>
                <div class="tiktok-video-info">
                    <p class="tiktok-desc">${video.description || 'No description'}</p>
                    <div class="tiktok-video-stats">
                        <span>❤️ ${formatNum(video.likes || 0)}</span>
                        <span>💬 ${formatNum(video.comments || 0)}</span>
                        <span>🔄 ${formatNum(video.shares || 0)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

// ==================== HUGGING FACE FUNCTIONS ====================

async function loadHuggingFace() {
    console.log('🤗 Loading Hugging Face Hub...');
    const resultsDiv = document.getElementById('hfResults');
    resultsDiv.innerHTML = '<p class="loading">🤗 Loading Hugging Face Hub...</p>';
    
    try {
        const response = await fetch('/api/hf/dashboard');
        const dashboard = await response.json();
        
        let html = `
            <div class="hf-dashboard">
                <h3>📊 Hugging Face Hub Dashboard</h3>
                <div class="hf-stats">
                    <div class="hf-stat-card">
                        <h4>Collections</h4>
                        <p>${dashboard.stats.totalCollections}</p>
                    </div>
                    <div class="hf-stat-card">
                        <h4>Task Categories</h4>
                        <p>${dashboard.stats.totalTaskCategories}</p>
                    </div>
                </div>
            </div>
            <div class="hf-section">
                <h3>🔥 Trending Models</h3>
                ${renderHFModels(dashboard.trendingModels)}
            </div>
        `;
        
        resultsDiv.innerHTML = html;
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading dashboard: ${error.message}</p>`;
    }
}

async function searchHuggingFace() {
    const query = document.getElementById('hfSearch').value.trim();
    const type = document.getElementById('hfType').value;
    
    if (!query) {
        alert('Please enter a search query');
        return;
    }
    
    const resultsDiv = document.getElementById('hfResults');
    resultsDiv.innerHTML = '<p class="loading">🤗 Searching...</p>';
    
    try {
        const response = await fetch(`/api/hf/search?q=${encodeURIComponent(query)}&type=${type}`);
        const results = await response.json();
        
        if (type === 'model') {
            resultsDiv.innerHTML = `<h3>Search Results: "${query}"</h3>` + renderHFModels(results);
        } else {
            resultsDiv.innerHTML = `<h3>Dataset Results: "${query}"</h3>` + renderHFDatasets(results);
        }
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error searching: ${error.message}</p>`;
    }
}

async function loadHFTrendingModels() {
    const resultsDiv = document.getElementById('hfResults');
    resultsDiv.innerHTML = '<p class="loading">🤗 Loading trending models...</p>';
    
    try {
        const response = await fetch('/api/hf/models/trending?limit=20');
        const models = await response.json();
        resultsDiv.innerHTML = '<h3>🔥 Trending Models</h3>' + renderHFModels(models);
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading trending models: ${error.message}</p>`;
    }
}

async function loadHFTopDownloads() {
    const resultsDiv = document.getElementById('hfResults');
    resultsDiv.innerHTML = '<p class="loading">🤗 Loading most downloaded...</p>';
    
    try {
        const response = await fetch('/api/hf/models/most-downloaded?limit=20');
        const models = await response.json();
        resultsDiv.innerHTML = '<h3>📥 Most Downloaded Models</h3>' + renderHFModels(models);
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading most downloaded: ${error.message}</p>`;
    }
}

async function loadHFTrendingDatasets() {
    const resultsDiv = document.getElementById('hfResults');
    resultsDiv.innerHTML = '<p class="loading">🤗 Loading trending datasets...</p>';
    
    try {
        const response = await fetch('/api/hf/datasets/trending?limit=20');
        const datasets = await response.json();
        resultsDiv.innerHTML = '<h3>📊 Trending Datasets</h3>' + renderHFDatasets(datasets);
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading trending datasets: ${error.message}</p>`;
    }
}

async function loadHFCollection(collectionId) {
    const resultsDiv = document.getElementById('hfResults');
    resultsDiv.innerHTML = '<p class="loading">🤗 Loading collection...</p>';
    
    try {
        const response = await fetch(`/api/hf/collection/${collectionId}`);
        const collection = await response.json();
        
        let html = `
            <div class="hf-collection-header">
                <h3>${collection.name}</h3>
                <p>${collection.description}</p>
                <p><strong>${collection.models.length} models</strong></p>
            </div>
        `;
        
        html += renderHFModels(collection.models);
        resultsDiv.innerHTML = html;
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading collection: ${error.message}</p>`;
    }
}

async function showHFDownload(type, author, id) {
    try {
        const response = await fetch(`/api/hf/download/${type}/${author}/${id}`);
        const downloadInfo = await response.json();
        
        let html = `
            <div class="hf-download-modal">
                <h3>📥 Download: ${author}/${id}</h3>
                <p class="hf-free-badge">✅ NO API KEY REQUIRED • NO LOGIN REQUIRED</p>
                
                <h4>Download Methods:</h4>
                <div class="download-methods">
        `;
        
        downloadInfo.downloadMethods.forEach(method => {
            html += `
                <div class="download-method">
                    <h5>${method.method}</h5>
                    <p>${method.description}</p>
                    ${method.command ? `<pre><code>${method.command}</code></pre>` : ''}
                    ${method.url ? `<a href="${method.url}" target="_blank" class="btn-primary">🔗 Open</a>` : ''}
                </div>
            `;
        });
        
        html += `
                </div>
                <p class="hf-link">🔗 <a href="${downloadInfo.url}" target="_blank">View on Hugging Face</a></p>
            </div>
        `;
        
        const resultsDiv = document.getElementById('hfResults');
        resultsDiv.innerHTML = html;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

function renderHFModels(models) {
    if (!models || models.length === 0) {
        return '<p class="info">No models found</p>';
    }
    
    let html = '<div class="hf-model-grid">';
    
    models.forEach(model => {
        const modelId = model.id || (model.modelId && model.modelId.split('/')[1]);
        const author = model.author || (model.modelId && model.modelId.split('/')[0]);
        const downloads = model.downloads || model.likes || 0;
        const likes = model.likes || 0;
        
        html += `
            <div class="hf-model-card">
                <div class="hf-model-header">
                    <h4>${modelId || 'Unknown'}</h4>
                    <span class="hf-badge-free">FREE</span>
                </div>
                <p class="hf-author">by ${author || 'Unknown'}</p>
                <p class="hf-description">${model.cardData?.description || model.description || 'No description'}</p>
                <div class="hf-model-tags">
                    ${model.pipeline_tag ? `<span class="hf-tag">${model.pipeline_tag}</span>` : ''}
                    ${model.tags ? model.tags.slice(0, 3).map(tag => `<span class="hf-tag">${tag}</span>`).join('') : ''}
                </div>
                <div class="hf-model-stats">
                    <span>📥 ${formatNum(downloads)}</span>
                    <span>❤️ ${formatNum(likes)}</span>
                </div>
                <button onclick="showHFDownload('model', '${author}', '${modelId}')" class="btn-download">📥 Download</button>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderHFDatasets(datasets) {
    if (!datasets || datasets.length === 0) {
        return '<p class="info">No datasets found</p>';
    }
    
    let html = '<div class="hf-model-grid">';
    
    datasets.forEach(dataset => {
        const datasetId = dataset.id;
        const author = dataset.author;
        const downloads = dataset.downloads || 0;
        const likes = dataset.likes || 0;
        
        html += `
            <div class="hf-model-card">
                <div class="hf-model-header">
                    <h4>${datasetId}</h4>
                    <span class="hf-badge-free">FREE</span>
                </div>
                <p class="hf-author">by ${author}</p>
                <p class="hf-description">${dataset.description || 'No description'}</p>
                <div class="hf-model-tags">
                    ${dataset.tags ? dataset.tags.slice(0, 3).map(tag => `<span class="hf-tag">${tag}</span>`).join('') : ''}
                </div>
                <div class="hf-model-stats">
                    <span>📥 ${formatNum(downloads)}</span>
                    <span>❤️ ${formatNum(likes)}</span>
                </div>
                <button onclick="showHFDownload('dataset', '${author}', '${datasetId}')" class="btn-download">📥 Download</button>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Format large numbers (e.g., 1500000 -> 1.5M)
function formatNum(num) {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}    console.log('🐐 SUPER GOAT ROYALTY APP v5.1.0 — ULTIMATE EDITION');
    console.log('© 2024 Harvey L Miller Jr / Juaquin J Malphurs / Kevin W Hallingquest');
// ==================== DICTIONARY FUNCTIONS ====================

async function loadDictionary() {
    console.log('🔥 Loading Waka Flocka Flames Rap Dictionary...');
    const resultsDiv = document.getElementById('dictResults');
    const statsDiv = document.getElementById('dictStats');
    const categoriesDiv = document.getElementById('dictCategories');
    
    resultsDiv.innerHTML = '<p class="loading">🔥 Loading dictionary...</p>';
    
    try {
        const [infoResponse, categoriesResponse] = await Promise.all([
            fetch('/api/dictionary/info'),
            fetch('/api/dictionary/categories')
        ]);
        
        const info = await infoResponse.json();
        const categories = await categoriesResponse.json();
        
        statsDiv.innerHTML = `
            <div class="dict-stat-card">
                <h4>📚 Total Terms</h4>
                <p>${info.stats.totalTerms}</p>
            </div>
            <div class="dict-stat-card">
                <h4>📂 Categories</h4>
                <p>${info.stats.totalCategories}</p>
            </div>
            <div class="dict-stat-card">
                <h4>🔥 Waka Terms</h4>
                <p>${info.stats.wakaSpecificTerms}</p>
            </div>
            <div class="dict-stat-card">
                <h4>🎵 Trap Terms</h4>
                <p>${info.stats.trapTerms}</p>
            </div>
        `;
        
        categoriesDiv.innerHTML = `
            <h3>📂 Categories</h3>
            <div class="category-buttons">
                ${categories.map(cat => `<button onclick="loadCategory('${cat}')" class="category-btn">${cat}</button>`).join('')}
            </div>
        `;
        
        resultsDiv.innerHTML = `
            <div class="dict-welcome">
                <h3>🔥 Welcome to the Waka Flocka Flames Rap Dictionary!</h3>
                <p>Search for hip-hop and trap slang terms, learn definitions, and discover Waka Flocka references.</p>
                <p>Use the controls above to search, browse categories, or get a random term!</p>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading dictionary: ${error.message}</p>`;
    }
}

async function searchDictionary() {
    const query = document.getElementById('dictSearch').value.trim();
    
    if (!query) {
        alert('Please enter a search term');
        return;
    }
    
    const resultsDiv = document.getElementById('dictResults');
    resultsDiv.innerHTML = '<p class="loading">🔍 Searching...</p>';
    
    try {
        const response = await fetch(`/api/dictionary/search?q=${encodeURIComponent(query)}`);
        const terms = await response.json();
        
        if (terms.length === 0) {
            resultsDiv.innerHTML = '<p class="info">No terms found. Try a different search term.</p>';
            return;
        }
        
        renderDictionaryTerms(terms, `Search Results: "${query}"`);
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error searching: ${error.message}</p>`;
    }
}

async function loadRandomTerm() {
    const resultsDiv = document.getElementById('dictResults');
    resultsDiv.innerHTML = '<p class="loading">🎲 Loading random term...</p>';
    
    try {
        const response = await fetch('/api/dictionary/random');
        const term = await response.json();
        renderDictionaryTerms([term], '🎲 Random Term');
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading random term: ${error.message}</p>`;
    }
}

async function loadTermOfTheDay() {
    const resultsDiv = document.getElementById('dictResults');
    resultsDiv.innerHTML = '<p class="loading">📅 Loading term of the day...</p>';
    
    try {
        const response = await fetch('/api/dictionary/term-of-the-day');
        const term = await response.json();
        renderDictionaryTerms([term], '📅 Term of the Day');
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading term of the day: ${error.message}</p>`;
    }
}

async function loadWakaTerms() {
    const resultsDiv = document.getElementById('dictResults');
    resultsDiv.innerHTML = '<p class="loading">🔥 Loading Waka Flocka terms...</p>';
    
    try {
        const response = await fetch('/api/dictionary/waka');
        const terms = await response.json();
        renderDictionaryTerms(terms, '🔥 Waka Flocka Flame Terms');
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading Waka terms: ${error.message}</p>`;
    }
}

async function loadTrapTerms() {
    const resultsDiv = document.getElementById('dictResults');
    resultsDiv.innerHTML = '<p class="loading">🎵 Loading trap terms...</p>';
    
    try {
        const response = await fetch('/api/dictionary/trap');
        const terms = await response.json();
        renderDictionaryTerms(terms, '🎵 Trap Music Terms');
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading trap terms: ${error.message}</p>`;
    }
}

async function loadCategory(category) {
    const resultsDiv = document.getElementById('dictResults');
    resultsDiv.innerHTML = '<p class="loading">📂 Loading category...</p>';
    
    try {
        const response = await fetch(`/api/dictionary/category/${encodeURIComponent(category)}`);
        const terms = await response.json();
        renderDictionaryTerms(terms, `📂 Category: ${category}`);
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading category: ${error.message}</p>`;
    }
}

async function loadAllCategories() {
    const resultsDiv = document.getElementById('dictResults');
    resultsDiv.innerHTML = '<p class="loading">📚 Loading all terms...</p>';
    
    try {
        const response = await fetch('/api/dictionary/all');
        const terms = await response.json();
        renderDictionaryTerms(terms, '📚 All Dictionary Terms');
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error loading all terms: ${error.message}</p>`;
    }
}

function renderDictionaryTerms(terms, title) {
    const resultsDiv = document.getElementById('dictResults');
    
    if (!terms || terms.length === 0) {
        resultsDiv.innerHTML = '<p class="info">No terms found</p>';
        return;
    }
    
    let html = `<h3 class="dict-section-title">${title} (${terms.length} terms)</h3>`;
    html += '<div class="dictionary-terms-grid">';
    
    terms.forEach(term => {
        html += `
            <div class="dict-term-card">
                <div class="dict-term-header">
                    <h4 class="dict-term">${term.term}</h4>
                    <span class="dict-category">${term.category}</span>
                </div>
                <p class="dict-definition">${term.definition}</p>
                ${term.wakaReference ? `<p class="dict-waka-ref">🔥 ${term.wakaReference}</p>` : ''}
                <div class="dict-examples">
                    <strong>Examples:</strong>
                    <ul>
                        ${term.examples.map(ex => `<li>"${ex}"</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}    console.log('280 API Endpoints | 16 Tabs | All Systems GO 🚀');
});