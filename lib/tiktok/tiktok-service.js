/**
 * 🐐 SUPER GOAT ROYALTY APP — TikTok Integration via TikAPI
 */

let TikAPI;
try { TikAPI = require('tikapi'); } catch(e) { TikAPI = null; }

class TikTokService {
    constructor(apiKey) {
        this.apiKey = apiKey || process.env.TIKAPI_KEY || null;
        this.api = null;
        this.demoMode = true;
        this.cache = new Map();
        this.requestCount = 0;

        if (TikAPI && this.apiKey) {
            try {
                this.api = TikAPI(this.apiKey);
                this.demoMode = false;
                console.log('🎵 TikTok Service: LIVE mode (TikAPI connected)');
            } catch(e) {
                console.log('🎵 TikTok Service: DEMO mode');
            }
        } else {
            console.log('🎵 TikTok Service: DEMO mode (no API key/tikapi)');
        }
    }

    getInfo() {
        return {
            service: '🎵 TikTok Integration',
            version: '1.0.0',
            provider: 'TikAPI',
            mode: this.demoMode ? 'demo' : 'live',
            features: ['User Profile Lookup', 'Video Feed Retrieval', 'Hashtag Search', 'Trending Discovery', 'Video Analytics', 'Content Search'],
            requestCount: this.requestCount,
            cacheSize: this.cache.size,
            apiKeyConfigured: !!this.apiKey
        };
    }

    getStats() {
        return {
            mode: this.demoMode ? 'demo' : 'live',
            totalRequests: this.requestCount,
            cacheEntries: this.cache.size,
            apiKeySet: !!this.apiKey,
            tikApiInstalled: !!TikAPI
        };
    }

    async getUserProfile(username) {
        if (!username) throw new Error('Username is required');
        this.requestCount++;
        if (this.demoMode) return this._demoProfile(username);
        try {
            const response = await this.api.public.check({ username });
            const userInfo = response.json.userInfo;
            return {
                id: userInfo.user.id,
                username: userInfo.user.uniqueId,
                nickname: userInfo.user.nickname,
                bio: userInfo.user.signature || '',
                avatar: userInfo.user.avatarMedium || '',
                verified: userInfo.user.verified || false,
                privateAccount: userInfo.user.privateAccount || false,
                followers: userInfo.stats.followerCount || 0,
                following: userInfo.stats.followingCount || 0,
                hearts: userInfo.stats.heartCount || 0,
                videoCount: userInfo.stats.videoCount || 0,
                diggCount: userInfo.stats.diggCount || 0,
                region: userInfo.user.region || 'unknown',
                demoMode: false
            };
        } catch(err) {
            throw new Error(`Failed to fetch profile for @${username}: ${err.message}`);
        }
    }

    async getUserVideos(username, count = 20) {
        if (!username) throw new Error('Username is required');
        this.requestCount++;
        if (this.demoMode) return this._demoVideos(username, count);
        try {
            const response = await this.api.public.posts({ secUid: username, count });
            return { username, videos: (response.json.itemList || []).map(item => ({
                id: item.id,
                desc: item.desc || '',
                createTime: item.createTime,
                duration: item.video?.duration || 0,
                cover: item.video?.cover || '',
                stats: {
                    plays: item.stats?.playCount || 0,
                    likes: item.stats?.diggCount || 0,
                    comments: item.stats?.commentCount || 0,
                    shares: item.stats?.shareCount || 0
                },
                music: {
                    title: item.music?.title || '',
                    author: item.music?.authorName || '',
                    album: item.music?.album || ''
                },
                hashtags: (item.challenges || []).map(c => c.title)
            })), count: (response.json.itemList || []).length, demoMode: false };
        } catch(err) {
            throw new Error(`Failed to fetch videos for @${username}: ${err.message}`);
        }
    }

    async searchHashtag(hashtag, count = 20) {
        if (!hashtag) throw new Error('Hashtag is required');
        this.requestCount++;
        if (this.demoMode) return this._demoHashtag(hashtag, count);
        try {
            const response = await this.api.public.hashtag({ name: hashtag });
            return {
                hashtag,
                challengeInfo: response.json.challengeInfo || {},
                videos: (response.json.itemList || []).slice(0, count).map(item => ({
                    id: item.id,
                    desc: item.desc || '',
                    author: item.author?.uniqueId || '',
                    stats: {
                        plays: item.stats?.playCount || 0,
                        likes: item.stats?.diggCount || 0,
                        comments: item.stats?.commentCount || 0,
                        shares: item.stats?.shareCount || 0
                    }
                })),
                demoMode: false
            };
        } catch(err) {
            throw new Error(`Failed to search hashtag #${hashtag}: ${err.message}`);
        }
    }

    async searchContent(keyword, count = 20) {
        if (!keyword) throw new Error('Keyword is required');
        this.requestCount++;
        if (this.demoMode) return this._demoSearch(keyword, count);
        try {
            const response = await this.api.public.search({ query: keyword, count });
            return {
                keyword,
                results: (response.json.itemList || []).slice(0, count).map(item => ({
                    id: item.id,
                    desc: item.desc || '',
                    author: item.author?.uniqueId || '',
                    stats: {
                        plays: item.stats?.playCount || 0,
                        likes: item.stats?.diggCount || 0
                    }
                })),
                count: (response.json.itemList || []).length,
                demoMode: false
            };
        } catch(err) {
            throw new Error(`Failed to search "${keyword}": ${err.message}`);
        }
    }

    async getTrending(count = 30) {
        this.requestCount++;
        if (this.demoMode) return this._demoTrending(count);
        try {
            const response = await this.api.public.explore({ count });
            return {
                trending: (response.json.itemList || []).map(item => ({
                    id: item.id,
                    desc: item.desc || '',
                    author: item.author?.uniqueId || '',
                    stats: {
                        plays: item.stats?.playCount || 0,
                        likes: item.stats?.diggCount || 0,
                        comments: item.stats?.commentCount || 0,
                        shares: item.stats?.shareCount || 0
                    },
                    music: item.music?.title || '',
                    hashtags: (item.challenges || []).map(c => c.title)
                })),
                count: (response.json.itemList || []).length,
                timestamp: new Date().toISOString(),
                demoMode: false
            };
        } catch(err) {
            throw new Error(`Failed to fetch trending: ${err.message}`);
        }
    }

    async getAnalytics(username) {
        if (!username) throw new Error('Username is required');
        this.requestCount++;
        try {
            const profile = await this.getUserProfile(username);
            const videosResult = await this.getUserVideos(username, 30);
            const videos = videosResult.videos || [];
            const totalPlays = videos.reduce((s, v) => s + (v.stats?.plays || 0), 0);
            const totalLikes = videos.reduce((s, v) => s + (v.stats?.likes || 0), 0);
            const totalComments = videos.reduce((s, v) => s + (v.stats?.comments || 0), 0);
            const totalShares = videos.reduce((s, v) => s + (v.stats?.shares || 0), 0);
            const avgPlays = videos.length ? Math.round(totalPlays / videos.length) : 0;
            const engagementRate = totalPlays > 0 ? ((totalLikes + totalComments + totalShares) / totalPlays * 100).toFixed(2) : '0.00';
            const topVideos = [...videos].sort((a, b) => (b.stats?.plays || 0) - (a.stats?.plays || 0)).slice(0, 5);
            const hashtagMap = {};
            videos.forEach(v => (v.hashtags || []).forEach(h => { hashtagMap[h] = (hashtagMap[h] || 0) + 1; }));
            const topHashtags = Object.entries(hashtagMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag, count]) => ({ tag, count }));
            return {
                profile: { username: profile.username, nickname: profile.nickname, followers: profile.followers, hearts: profile.hearts, videoCount: profile.videoCount },
                analytics: { videosAnalyzed: videos.length, totalPlays, totalLikes, totalComments, totalShares, avgPlaysPerVideo: avgPlays, engagementRate: `${engagementRate}%` },
                topVideos: topVideos.map(v => ({ desc: v.desc?.substring(0, 80) || '', plays: v.stats?.plays || 0, likes: v.stats?.likes || 0 })),
                topHashtags
            };
        } catch(err) {
            throw new Error(`Failed to generate analytics for @${username}: ${err.message}`);
        }
    }

    _demoProfile(username) {
        const profiles = {
            'wakaflocka': { nickname: 'Waka Flocka Flame', followers: 2800000, hearts: 45000000, videoCount: 1200, bio: '🐐 Official Waka Flocka | BSM | GOAT Royalty', verified: true },
            'djspeedy': { nickname: 'DJ Speedy', followers: 185000, hearts: 3200000, videoCount: 480, bio: '🎵 Producer | DJ | GOAT Royalty App Creator', verified: false }
        };
        const p = profiles[username.toLowerCase()] || { nickname: username, followers: 50000, hearts: 800000, videoCount: 200, bio: 'TikTok Creator', verified: false };
        return {
            id: `demo_${Date.now()}`,
            username: username,
            nickname: p.nickname,
            bio: p.bio,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nickname)}&size=200&background=ff0050&color=fff`,
            verified: p.verified,
            privateAccount: false,
            followers: p.followers,
            following: Math.floor(p.followers * 0.01),
            hearts: p.hearts,
            videoCount: p.videoCount,
            diggCount: Math.floor(p.hearts * 0.3),
            region: 'US',
            demoMode: true
        };
    }

    _demoVideos(username, count) {
        const titles = [
            '🔥 New beat just dropped!! #producer #hiphop',
            'Studio vibes all night 🎵 #studiolife',
            'When the 808 hits different 💥 #beats #trap',
            'GOAT Royalty App preview 🐐🔥 #tech #music'
        ];
        const videos = [];
        for (let i = 0; i < Math.min(count, titles.length); i++) {
            videos.push({
                id: `demo_${Date.now()}_${i}`,
                desc: titles[i],
                createTime: Math.floor(Date.now() / 1000) - (i * 86400),
                duration: 15 + Math.floor(Math.random() * 45),
                cover: `https://picsum.photos/seed/tiktok${i}/400/600`,
                stats: { plays: Math.floor(Math.random() * 500000) + 10000, likes: Math.floor(Math.random() * 50000) + 1000, comments: Math.floor(Math.random() * 5000) + 100, shares: Math.floor(Math.random() * 2000) + 50 },
                music: { title: ['Original Sound', 'GOAT Beat', 'Hard Trap'][i % 3], author: username, album: '' },
                hashtags: ['music', 'producer', 'hiphop'].slice(0, 2 + (i % 3))
            });
        }
        return { username, videos, count: videos.length, demoMode: true };
    }

    _demoHashtag(hashtag, count) {
        const videos = [];
        for (let i = 0; i < Math.min(count, 10); i++) {
            videos.push({
                id: `hashtag_demo_${i}`,
                desc: `#${hashtag} content ${i + 1} 🔥`,
                author: `creator_${i}`,
                stats: { plays: Math.floor(Math.random() * 1000000) + 5000, likes: Math.floor(Math.random() * 100000) + 500, comments: Math.floor(Math.random() * 10000) + 50, shares: Math.floor(Math.random() * 5000) + 25 }
            });
        }
        return { hashtag, challengeInfo: { viewCount: Math.floor(Math.random() * 10000000000) + 1000000, title: hashtag }, videos, demoMode: true };
    }

    _demoSearch(keyword, count) {
        const results = [];
        for (let i = 0; i < Math.min(count, 8); i++) {
            results.push({ id: `search_demo_${i}`, desc: `${keyword} related content #${i + 1}`, author: `user_${1000 + i}`, stats: { plays: Math.floor(Math.random() * 500000) + 1000, likes: Math.floor(Math.random() * 50000) + 100 } });
        }
        return { keyword, results, count: results.length, demoMode: true };
    }

    _demoTrending(count) {
        const descs = [
            'This dance is taking over 💃🕺', 'POV: when you finally get it right 😂',
            'Making music hits different at 3am 🌙', 'New trend alert 🚨 #viral',
            'Tag someone who does this 👀', 'The talent is unmatched 🔥'
        ];
        const trending = [];
        for (let i = 0; i < Math.min(count, descs.length); i++) {
            trending.push({
                id: `trending_demo_${i}`,
                desc: descs[i],
                author: `viral_creator_${i}`,
                stats: { plays: Math.floor(Math.random() * 50000000) + 1000000, likes: Math.floor(Math.random() * 5000000) + 100000, comments: Math.floor(Math.random() * 500000) + 10000, shares: Math.floor(Math.random() * 200000) + 5000 },
                music: ['Viral Sound', 'Original Audio', 'Trending Beat'][i % 3],
                hashtags: ['fyp', 'viral', 'trending'].slice(0, 2 + (i % 3))
            });
        }
        return { trending, count: trending.length, timestamp: new Date().toISOString(), demoMode: true };
    }
}

module.exports = TikTokService;
