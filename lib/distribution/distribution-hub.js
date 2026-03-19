/**
 * GOAT Royalty App - Music Royalty Management Platform
 * Copyright © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST. All rights reserved.
 *
 * Distribution Hub — DistroKid / TuneCore / CD Baby / MLC / SoundExchange / TikTok Creator
 * License: All Rights Reserved
 */

class DistributionHub {
    constructor(config = {}) {
        this.isDemo = true; // Always demo unless real API keys provided
        this.distrokidKey  = config.distrokidKey  || process.env.DISTROKID_API_KEY  || '';
        this.tunecoreKey   = config.tunecoreKey   || process.env.TUNECORE_API_KEY   || '';
        this.cdbaby        = config.cdbabyKey     || process.env.CDBABY_API_KEY     || '';
        this.mlcKey        = config.mlcKey        || process.env.MLC_API_KEY        || '';
        this.soundexKey    = config.soundexKey    || process.env.SOUNDEXCHANGE_KEY  || '';
        this.tiktokKey     = config.tiktokKey     || process.env.TIKTOK_API_KEY     || '';

        // Distribution platforms
        this.platforms = [
            { id: 'spotify',      name: 'Spotify',          icon: '🟢', category: 'streaming',    rate: 0.004,  currency: 'USD' },
            { id: 'apple',        name: 'Apple Music',      icon: '🎵', category: 'streaming',    rate: 0.007,  currency: 'USD' },
            { id: 'youtube',      name: 'YouTube Music',    icon: '🔴', category: 'streaming',    rate: 0.002,  currency: 'USD' },
            { id: 'tidal',        name: 'TIDAL HiFi',       icon: '🔵', category: 'streaming',    rate: 0.013,  currency: 'USD' },
            { id: 'amazon',       name: 'Amazon Music',     icon: '🟠', category: 'streaming',    rate: 0.004,  currency: 'USD' },
            { id: 'deezer',       name: 'Deezer',           icon: '🎶', category: 'streaming',    rate: 0.0064, currency: 'USD' },
            { id: 'tiktok',       name: 'TikTok',           icon: '🎤', category: 'social',       rate: 0.030,  currency: 'USD/use' },
            { id: 'instagram',    name: 'Instagram Reels',  icon: '📸', category: 'social',       rate: 0.0025, currency: 'USD' },
            { id: 'soundcloud',   name: 'SoundCloud',       icon: '🌤️', category: 'indie',        rate: 0.003,  currency: 'USD' },
            { id: 'pandora',      name: 'Pandora',          icon: '🎸', category: 'radio',        rate: 0.0013, currency: 'USD' },
        ];

        // Distribution services
        this.services = {
            distrokid: {
                id: 'distrokid',
                name: 'DistroKid',
                icon: '🚀',
                color: '#1DB954',
                description: 'Unlimited uploads, fastest distribution to 150+ stores',
                pricing: '$22.99/year unlimited',
                platforms: 150,
                features: ['Unlimited uploads', 'Spotify for Artists', 'YouTube Money', 'TikTok/Reels', 'Sync licensing'],
                apiEndpoint: 'https://distrokid.com/api/v1',
                active: !!this.distrokidKey
            },
            tunecore: {
                id: 'tunecore',
                name: 'TuneCore',
                icon: '🎯',
                color: '#FF4500',
                description: '100% royalties, 150+ streaming services, publishing admin',
                pricing: '$14.99/year per single',
                platforms: 150,
                features: ['100% royalties', 'Publishing admin', 'YouTube Content ID', 'Social media licensing', 'Royalty splits'],
                apiEndpoint: 'https://api.tunecore.com/v2',
                active: !!this.tunecoreKey
            },
            cdbaby: {
                id: 'cdbaby',
                name: 'CD Baby',
                icon: '💿',
                color: '#FF6600',
                description: 'One-time fee, sync licensing marketplace, live performance tracking',
                pricing: '$9.99 one-time per single',
                platforms: 150,
                features: ['One-time fee', 'Sync licensing', 'Physical distribution', 'Publishing admin', 'Mechanical royalties'],
                apiEndpoint: 'https://members.cdbaby.com/api',
                active: !!this.cdbaby
            },
            mlc: {
                id: 'mlc',
                name: 'MLC (Mechanical Licensing Collective)',
                icon: '⚙️',
                color: '#2C3E50',
                description: 'US mechanical royalties from digital music services',
                pricing: 'Free to register',
                platforms: 30,
                features: ['Spotify mechanical', 'Apple Music mechanical', 'Amazon mechanical', 'Claim unclaimed royalties', 'Direct payment'],
                apiEndpoint: 'https://api.themlc.com',
                active: !!this.mlcKey
            },
            soundexchange: {
                id: 'soundexchange',
                name: 'SoundExchange',
                icon: '🔊',
                color: '#8E44AD',
                description: 'Digital performance royalties for masters (Pandora, SiriusXM, webcasters)',
                pricing: 'Free to register',
                platforms: 50,
                features: ['Pandora royalties', 'SiriusXM royalties', 'Webcaster royalties', 'Non-interactive streams', 'International collections'],
                apiEndpoint: 'https://portal.soundexchange.com/api',
                active: !!this.soundexKey
            },
            tiktok_creator: {
                id: 'tiktok_creator',
                name: 'TikTok Creator Marketplace',
                icon: '🎵',
                color: '#000000',
                description: 'Direct brand partnerships, creator fund, music licensing analytics',
                pricing: 'Free (10K+ followers required)',
                platforms: 1,
                features: ['Brand partnerships', 'Creator fund', 'Sound analytics', 'Campaign tracking', 'Revenue dashboard'],
                apiEndpoint: 'https://business-api.tiktok.com/open_api',
                active: !!this.tiktokKey
            }
        };

        // Demo catalog
        this.demoCatalog = [
            { id: 'track-001', title: 'Royalty Flow', artist: 'DJ Speedy', isrc: 'USRC12300001', upc: '885767890123', releaseDate: '2024-01-15', streams: 284750, revenue: 1139.00, platforms: ['spotify', 'apple', 'youtube', 'tidal', 'tiktok'] },
            { id: 'track-002', title: 'GOAT Anthem',  artist: 'DJ Speedy', isrc: 'USRC12300002', upc: '885767890124', releaseDate: '2024-03-22', streams: 512300, revenue: 2049.20, platforms: ['spotify', 'apple', 'amazon', 'deezer', 'tiktok'] },
            { id: 'track-003', title: 'NFT Vibes',    artist: 'DJ Speedy', isrc: 'USRC12300003', upc: '885767890125', releaseDate: '2024-05-01', streams: 198400, revenue: 793.60, platforms: ['spotify', 'soundcloud', 'tiktok', 'instagram'] },
            { id: 'track-004', title: 'Crypto Beat',  artist: 'DJ Speedy', isrc: 'USRC12300004', upc: '885767890126', releaseDate: '2024-06-10', streams: 341200, revenue: 1364.80, platforms: ['spotify', 'apple', 'tidal', 'youtube'] },
            { id: 'track-005', title: 'SUPER GOAT',   artist: 'DJ Speedy', isrc: 'USRC12300005', upc: '885767890127', releaseDate: '2024-08-20', streams: 892100, revenue: 3568.40, platforms: ['spotify', 'apple', 'youtube', 'tidal', 'amazon', 'tiktok', 'instagram'] },
        ];

        // Demo royalty data
        this.demoRoyalties = {
            mechanical: {
                total: 4823.45,
                pending: 1240.00,
                paid: 3583.45,
                sources: [
                    { platform: 'Spotify',     amount: 1842.30, streams: 2045000 },
                    { platform: 'Apple Music', amount: 1205.40, streams: 862000 },
                    { platform: 'Amazon',      amount: 892.75,  streams: 892000 },
                    { platform: 'YouTube',     amount: 483.00,  streams: 1207500 },
                    { platform: 'Others',      amount: 400.00,  streams: 450000 },
                ]
            },
            performance: {
                total: 3291.20,
                pending: 890.00,
                paid: 2401.20,
                sources: [
                    { platform: 'Pandora',    amount: 1420.00, plays: 1092307 },
                    { platform: 'SiriusXM',   amount: 980.50,  plays: 560285 },
                    { platform: 'Webcasters', amount: 540.70,  plays: 415923 },
                    { platform: 'Others',     amount: 350.00,  plays: 192307 },
                ]
            },
            tiktok: {
                total: 8450.00,
                soundUses: 284300,
                viralSounds: 3,
                topSound: { title: 'SUPER GOAT', uses: 142000, revenue: 4260.00 },
                campaigns: 12,
                brandDeals: 4
            }
        };
    }

    // Get all services status
    getServices() {
        return Object.values(this.services).map(s => ({
            ...s,
            status: s.active ? 'connected' : 'demo'
        }));
    }

    // Get platform catalog
    getPlatforms() {
        return this.platforms;
    }

    // Get music catalog
    getCatalog() {
        return {
            tracks: this.demoCatalog,
            total: this.demoCatalog.length,
            totalStreams: this.demoCatalog.reduce((s, t) => s + t.streams, 0),
            totalRevenue: this.demoCatalog.reduce((s, t) => s + t.revenue, 0)
        };
    }

    // Get royalty overview
    getRoyalties() {
        const mechanical = this.demoRoyalties.mechanical;
        const performance = this.demoRoyalties.performance;
        const tiktok = this.demoRoyalties.tiktok;
        return {
            summary: {
                totalEarned: mechanical.total + performance.total + tiktok.total,
                totalPending: mechanical.pending + performance.pending,
                mechanical: mechanical.total,
                performance: performance.total,
                social: tiktok.total
            },
            mechanical,
            performance,
            tiktok,
            unclaimed: {
                estimated: 2150.00,
                message: '⚠️ Estimated $2,150 in unclaimed MLC mechanical royalties. Register at themlc.com to claim.',
                platforms: ['Spotify', 'Apple Music', 'Amazon']
            }
        };
    }

    // Distribute track (demo)
    async distributeTrack(trackData) {
        const { title, service, platforms } = trackData;
        if (this.isDemo) {
            return {
                success: true,
                demo: true,
                trackId: 'DEMO-' + Date.now(),
                title: title || 'Untitled Track',
                service: service || 'distrokid',
                platforms: platforms || this.platforms.map(p => p.id),
                isrc: 'USRC' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
                upc: '885767' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
                estimatedLive: '24-72 hours',
                message: `✅ "${title}" queued for distribution via ${service || 'DistroKid'} to ${(platforms || this.platforms).length} platforms (Demo Mode)`
            };
        }
        // Real API call would go here
        throw new Error('Real distribution API not configured');
    }

    // Get TikTok analytics
    getTikTokAnalytics() {
        return {
            ...this.demoRoyalties.tiktok,
            monthlyGrowth: '+34%',
            topCreators: [
                { username: '@musiclover', uses: 28400, reach: 4200000 },
                { username: '@viralbeats', uses: 21000, reach: 3100000 },
                { username: '@goatnation', uses: 18700, reach: 2800000 },
            ],
            sounds: this.demoCatalog.map(t => ({
                title: t.title,
                uses: Math.floor(t.streams * 0.12),
                revenue: Math.floor(t.revenue * 0.4 * 100) / 100
            }))
        };
    }

    // Get distribution analytics
    getAnalytics() {
        return {
            totalTracks: this.demoCatalog.length,
            totalPlatforms: this.platforms.length,
            totalStreams: this.demoCatalog.reduce((s, t) => s + t.streams, 0),
            totalRevenue: this.demoCatalog.reduce((s, t) => s + t.revenue, 0),
            topPlatform: { name: 'Spotify', streams: 1200000, revenue: 4800 },
            growth: { monthly: '+18%', quarterly: '+34%', yearly: '+127%' },
            breakdown: this.platforms.map(p => ({
                platform: p.name,
                icon: p.icon,
                streams: Math.floor(Math.random() * 300000 + 50000),
                revenue: Math.floor(Math.random() * 1200 + 200),
                trend: ['+', '-'][Math.floor(Math.random() * 2)] + Math.floor(Math.random() * 30) + '%'
            }))
        };
    }
}

module.exports = DistributionHub;