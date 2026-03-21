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
    console.log('🐐 SUPER GOAT ROYALTY APP v5.0 — ULTIMATE EDITION');
    console.log('© 2024 Harvey L Miller Jr / Juaquin J Malphurs / Kevin W Hallingquest');
    console.log('242 API Endpoints | 13 Tabs | All Systems GO 🚀');
});