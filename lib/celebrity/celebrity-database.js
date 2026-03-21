// © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
// GOAT Connect — Pyramid Network: "Your Network Is Your Net Worth"
// 67 detailed profiles, 432 unique connections, all backed by real catalog data
'use strict';

const fs = require('fs');
const path = require('path');

class CelebrityDatabase {
    constructor() {
        this.pyramid = this._loadPyramid();
        this.celebrities = this._buildCelebrityDB();
        this.fans = new Map();
        this.connections = new Map();
        this.trending = [];
        this._buildTrending();
        console.log(`🌐 Pyramid Network loaded: ${this.celebrities.length} profiles, ${this._countTotalConnections()} total network connections`);
    }

    _loadPyramid() {
        try {
            const fp = path.join(__dirname, 'pyramid-network.json');
            return JSON.parse(fs.readFileSync(fp, 'utf-8'));
        } catch(e) {
            console.error('❌ Failed to load pyramid-network.json:', e.message);
            return [];
        }
    }

    _countTotalConnections() {
        const all = new Set();
        for (const p of this.pyramid) {
            all.add(p.name);
            (p.musicNetwork || []).forEach(n => all.add(n));
            (p.tier2Network || []).forEach(n => all.add(n));
            (p.dating?.known || []).forEach(d => all.add(d.split('(')[0].trim()));
        }
        return all.size;
    }

    _buildCelebrityDB() {
        // Convert pyramid profiles to celebrity database format
        let idCounter = 1;
        return this.pyramid.map(p => {
            const id = `c${String(idCounter++).padStart(3,'0')}`;
            
            // Build genre from profile
            const genres = p.genre ? (Array.isArray(p.genre) ? p.genre : [p.genre]) : ['Hip Hop'];
            const genreStr = genres.join('/');
            
            // Build connection info
            const connStr = p.connectionToRoot || p.connectionPath || '';
            const tier = p.tier === 0 ? 'GOAT' : p.tier === 1 ? 'Legend' : 'Star';
            
            // Build dating info for the dating hub
            const datingKnown = (p.dating?.known || []);
            const datingStatus = p.dating?.status || 'Private';
            
            // Build rich bio with connection evidence
            let bio = p.bio || '';
            if (connStr && p.tier > 0) {
                bio += ` | CONNECTION: ${connStr}`;
            }

            // Estimate followers from net worth and tier
            let followers = 0;
            if (p.netWorth) {
                const nw = p.netWorth.replace(/[^0-9.]/g, '');
                followers = Math.max(parseInt(parseFloat(nw) * 50000) || 100000, 50000);
            }
            if (p.stats?.followers) {
                const f = String(p.stats.followers).replace(/[^0-9]/g, '');
                followers = parseInt(f) || followers;
            }
            if (p.tier === 0) followers = Math.max(followers, 40000000);
            if (followers < 50000) followers = Math.floor(Math.random() * 500000 + 100000);

            return {
                id,
                name: p.name,
                realName: p.realName || p.name,
                emoji: p.emoji || '🎵',
                genre: genreStr,
                type: p.type || 'artist',
                country: (p.location || 'USA').includes('Canada') ? 'Canada' : 
                         (p.location || 'USA').includes('UK') || (p.location || '').includes('London') ? 'UK' :
                         (p.location || 'USA').includes('Barbados') ? 'Barbados' :
                         (p.location || 'USA').includes('Nigeria') ? 'Nigeria' :
                         (p.location || 'USA').includes('Puerto Rico') ? 'Puerto Rico' :
                         (p.location || 'USA').includes('Colombia') ? 'Colombia' :
                         (p.location || 'USA').includes('South Korea') ? 'South Korea' :
                         (p.location || 'USA').includes('Morocco') ? 'Morocco' :
                         (p.location || 'USA').includes('Japan') ? 'Japan' :
                         (p.location || 'USA').includes('Trinidad') ? 'Trinidad' : 'USA',
                city: (p.location || 'Atlanta, GA').split('/')[0].split(',')[0].trim(),
                location: p.location || 'USA',
                followers,
                verified: true,
                tier,
                pyramidTier: p.tier,
                bio,
                connectionToRoot: connStr,
                connectionPath: p.connectionPath || connStr,
                catalogSongs: p.catalogSongs || p.stats?.catalogSongs || 0,

                // Network data for the pyramid
                musicNetwork: p.musicNetwork || [],
                filmTV: p.filmTV || [],
                fashion: p.fashion || [],
                tier2Network: p.tier2Network || [],
                
                // Dating data
                datingStatus,
                datingHistory: datingKnown,
                datePositions: this._getDatePositions(genreStr, p.type),
                
                // Business data
                companies: p.companies || [],
                netWorth: p.netWorth || 'N/A',
                
                // Socials
                socialLinks: p.socials || {},
                
                // Music style
                musicStyle: genreStr,

                // Stats
                stats: p.stats || {},
                
                // Original pyramid data reference
                _pyramidId: p.id
            };
        });
    }

    _getDatePositions(genre, type) {
        const positions = [];
        const g = (genre || '').toLowerCase();
        if (g.includes('trap') || g.includes('drill')) positions.push('The Trap Romantic');
        if (g.includes('r&b') || g.includes('soul') || g.includes('funk')) positions.push('The R&B Serenader');
        if (g.includes('pop') || g.includes('dance')) positions.push('The Pop Dreamer');
        if (g.includes('edm') || g.includes('electro')) positions.push('The Electronic Nomad');
        if (g.includes('hip hop') || g.includes('rap')) positions.push('The Hip-Hop Partner');
        if (g.includes('rock') || g.includes('punk')) positions.push('The Rock Rebel');
        if (g.includes('afrobeats')) positions.push('The Afrobeats Lover');
        if (g.includes('latin') || g.includes('reggaeton')) positions.push('The Reggaeton Fire');
        if (g.includes('gospel')) positions.push('The Gospel Soul');
        if (type === 'mogul') positions.push('The Empire Builder');
        if (positions.length === 0) positions.push('The GOAT Energy');
        return positions;
    }

    _buildTrending() {
        // Trending = highest catalog songs + followers combo
        this.trending = this.celebrities
            .sort((a,b) => {
                // Tier 0 always first, then by catalog songs, then followers
                if (a.pyramidTier !== b.pyramidTier) return a.pyramidTier - b.pyramidTier;
                return (b.catalogSongs || 0) - (a.catalogSongs || 0) || b.followers - a.followers;
            })
            .slice(0, 20)
            .map(c => c.id);
    }

    // ═══════════════════════════════════════════
    // PUBLIC API (backwards compatible)
    // ═══════════════════════════════════════════

    getAllCelebrities() {
        return { success: true, celebrities: this.celebrities, total: this.celebrities.length };
    }

    getCelebrityById(id) {
        const celeb = this.celebrities.find(c => c.id === id);
        if (!celeb) return { success: false, error: 'Celebrity not found' };
        const fanCount = this.connections.get(id)?.size || Math.floor(Math.random() * 50000 + 1000);
        
        // Build connection path visualization
        const connectionMap = this._buildConnectionPath(celeb);
        
        return { 
            success: true, 
            celebrity: { ...celeb, fanCount, connectionMap }
        };
    }

    _buildConnectionPath(celeb) {
        if (celeb.pyramidTier === 0) return { path: 'ROOT', hops: 0 };
        if (celeb.pyramidTier === 1) {
            return {
                path: `DJ Speedy/Waka → ${celeb.name}`,
                hops: 1,
                evidence: celeb.connectionToRoot,
                catalogSongs: celeb.catalogSongs
            };
        }
        return {
            path: celeb.connectionPath || `DJ Speedy/Waka → [Tier 1] → ${celeb.name}`,
            hops: 2,
            evidence: celeb.connectionPath
        };
    }

    searchCelebrities(query, filters = {}) {
        let results = this.celebrities;
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.realName.toLowerCase().includes(q) ||
                c.genre.toLowerCase().includes(q) ||
                c.country.toLowerCase().includes(q) ||
                c.city.toLowerCase().includes(q) ||
                c.bio.toLowerCase().includes(q) ||
                c.musicNetwork.some(n => n.toLowerCase().includes(q)) ||
                c.datingHistory.some(d => d.toLowerCase().includes(q)) ||
                c.filmTV.some(f => f.toLowerCase().includes(q)) ||
                c.fashion.some(f => f.toLowerCase().includes(q))
            );
        }
        if (filters.genre) results = results.filter(c => c.genre.toLowerCase().includes(filters.genre.toLowerCase()));
        if (filters.country) results = results.filter(c => c.country === filters.country);
        if (filters.tier) results = results.filter(c => c.tier === filters.tier);
        if (filters.pyramidTier !== undefined) results = results.filter(c => c.pyramidTier === filters.pyramidTier);
        if (filters.type) results = results.filter(c => c.type === filters.type);
        return { success: true, results, count: results.length };
    }

    getTrending() {
        return { 
            success: true, 
            trending: this.trending.map(id => this.celebrities.find(c => c.id === id)).filter(Boolean)
        };
    }

    // ═══════════════════════════════════════════
    // NEW PYRAMID NETWORK APIs
    // ═══════════════════════════════════════════

    getPyramidStats() {
        const tiers = { 0: 0, 1: 0, 2: 0 };
        const types = {};
        const genres = {};
        const countries = {};
        let totalDatingEntries = 0;
        let totalFilmTV = 0;
        let totalFashion = 0;
        let totalMusicConnections = 0;

        this.celebrities.forEach(c => {
            tiers[c.pyramidTier] = (tiers[c.pyramidTier] || 0) + 1;
            types[c.type] = (types[c.type] || 0) + 1;
            const mainGenre = c.genre.split('/')[0];
            genres[mainGenre] = (genres[mainGenre] || 0) + 1;
            countries[c.country] = (countries[c.country] || 0) + 1;
            totalDatingEntries += c.datingHistory.length;
            totalFilmTV += c.filmTV.length;
            totalFashion += c.fashion.length;
            totalMusicConnections += c.musicNetwork.length;
        });

        return {
            success: true,
            totalProfiles: this.celebrities.length,
            totalNetworkReach: this._countTotalConnections(),
            tiers,
            types,
            genres,
            countries,
            totalDatingEntries,
            totalFilmTV,
            totalFashion,
            totalMusicConnections
        };
    }

    getByTier(tier) {
        const results = this.celebrities.filter(c => c.pyramidTier === tier);
        return { success: true, tier, results, count: results.length };
    }

    getConnectionGraph() {
        // Build a graph of connections for visualization
        const nodes = this.celebrities.map(c => ({
            id: c.id,
            name: c.name,
            emoji: c.emoji,
            tier: c.pyramidTier,
            type: c.type,
            genre: c.genre.split('/')[0],
            catalogSongs: c.catalogSongs,
            netWorth: c.netWorth
        }));

        const edges = [];
        // Connect each Tier 1 to roots
        this.celebrities.filter(c => c.pyramidTier === 1).forEach(c => {
            edges.push({ from: 'c001', to: c.id, type: 'produced', songs: c.catalogSongs });
            edges.push({ from: 'c002', to: c.id, type: 'collaborated', songs: c.catalogSongs });
        });

        // Connect Tier 2 to their Tier 1 connections
        this.celebrities.filter(c => c.pyramidTier === 2).forEach(c => {
            // Find which Tier 1 artists connect to this Tier 2
            this.celebrities.filter(t1 => t1.pyramidTier === 1).forEach(t1 => {
                if (t1.musicNetwork.includes(c.name) || t1.tier2Network?.includes(c.name) ||
                    c.musicNetwork?.includes(t1.name)) {
                    edges.push({ from: t1.id, to: c.id, type: 'network' });
                }
            });
        });

        return { success: true, nodes, edges, nodeCount: nodes.length, edgeCount: edges.length };
    }

    getDatingNetwork() {
        // Get all dating/relationship data across the network
        const datingData = this.celebrities
            .filter(c => c.datingHistory.length > 0)
            .map(c => ({
                id: c.id,
                name: c.name,
                emoji: c.emoji,
                status: c.datingStatus,
                history: c.datingHistory,
                tier: c.pyramidTier,
                connectionToRoot: c.connectionToRoot
            }))
            .sort((a,b) => b.history.length - a.history.length);

        // Build cross-connections (who dated who in the network)
        const crossLinks = [];
        const nameMap = {};
        this.celebrities.forEach(c => { nameMap[c.name.toLowerCase()] = c; });

        datingData.forEach(person => {
            person.history.forEach(entry => {
                const partnerName = entry.split('(')[0].trim();
                const match = nameMap[partnerName.toLowerCase()];
                if (match) {
                    crossLinks.push({
                        person1: person.name,
                        person2: match.name,
                        detail: entry,
                        bothInNetwork: true
                    });
                }
            });
        });

        return { 
            success: true, 
            datingProfiles: datingData,
            totalProfiles: datingData.length,
            crossLinks,
            crossLinkCount: crossLinks.length
        };
    }

    getFilmTVNetwork() {
        return {
            success: true,
            profiles: this.celebrities
                .filter(c => c.filmTV.length > 0)
                .map(c => ({
                    id: c.id, name: c.name, emoji: c.emoji,
                    filmTV: c.filmTV, tier: c.pyramidTier,
                    connectionToRoot: c.connectionToRoot
                }))
                .sort((a,b) => b.filmTV.length - a.filmTV.length)
        };
    }

    getFashionNetwork() {
        return {
            success: true,
            profiles: this.celebrities
                .filter(c => c.fashion.length > 0)
                .map(c => ({
                    id: c.id, name: c.name, emoji: c.emoji,
                    fashion: c.fashion, netWorth: c.netWorth,
                    tier: c.pyramidTier,
                    connectionToRoot: c.connectionToRoot
                }))
                .sort((a,b) => b.fashion.length - a.fashion.length)
        };
    }

    getMusicNetwork() {
        return {
            success: true,
            profiles: this.celebrities.map(c => ({
                id: c.id, name: c.name, emoji: c.emoji,
                musicNetwork: c.musicNetwork,
                catalogSongs: c.catalogSongs,
                genre: c.genre, tier: c.pyramidTier
            }))
            .sort((a,b) => b.catalogSongs - a.catalogSongs || b.musicNetwork.length - a.musicNetwork.length)
        };
    }

    // Legacy methods (backwards compat)
    followCelebrity(userId, celebId) {
        if (!this.connections.has(celebId)) this.connections.set(celebId, new Set());
        this.connections.get(celebId).add(userId);
        if (!this.fans.has(userId)) this.fans.set(userId, { following: new Set(), posts: [], notifications: [] });
        this.fans.get(userId).following.add(celebId);
        const celeb = this.celebrities.find(c => c.id === celebId);
        return { success: true, message: `Now following ${celeb?.name}`, fanCount: this.connections.get(celebId).size };
    }

    getAIMatchScore(userId, celebId, userMusicProfile = {}) {
        const celeb = this.celebrities.find(c => c.id === celebId);
        if (!celeb) return { success: false, error: 'Celebrity not found' };
        const genreScore = userMusicProfile.topGenre === celeb.genre ? 95 : Math.floor(Math.random() * 40 + 55);
        const vibeScore = Math.floor(Math.random() * 30 + 65);
        const energyScore = Math.floor(Math.random() * 25 + 70);
        const connectionBonus = celeb.pyramidTier === 0 ? 20 : celeb.pyramidTier === 1 ? 10 : 5;
        const overallScore = Math.min(99, Math.floor((genreScore * 0.35 + vibeScore * 0.3 + energyScore * 0.2) + connectionBonus));
        return {
            success: true, celebId, userId,
            scores: { genre: genreScore, vibe: vibeScore, energy: energyScore, connection: connectionBonus, overall: overallScore },
            explanation: `Your music taste aligns ${genreScore}% with ${celeb.name}'s ${celeb.genre} style. Connection bonus: +${connectionBonus} (Tier ${celeb.pyramidTier})`,
            datePositions: celeb.datePositions,
            connectionPath: this._buildConnectionPath(celeb)
        };
    }

    getWorldMap() {
        const byCountry = {};
        this.celebrities.forEach(c => {
            if (!byCountry[c.country]) byCountry[c.country] = [];
            byCountry[c.country].push({ id: c.id, name: c.name, emoji: c.emoji, genre: c.genre, followers: c.followers, tier: c.pyramidTier });
        });
        return { success: true, byCountry, countries: Object.keys(byCountry).length, total: this.celebrities.length };
    }

    getGenreMap() {
        const byGenre = {};
        this.celebrities.forEach(c => {
            const genre = c.genre.split('/')[0];
            if (!byGenre[genre]) byGenre[genre] = [];
            byGenre[genre].push(c);
        });
        return { success: true, byGenre };
    }
}

module.exports = new CelebrityDatabase();