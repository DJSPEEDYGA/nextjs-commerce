// © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
// GOAT Connect — Royalty Empire Business Engine
// Brand Management · Merch · Touring · Revenue · Contracts · Legal
'use strict';

class RoyaltyEmpire {
    constructor() {
        this.stats = { pitchesGenerated: 0, contractsViewed: 0, revenueCalculated: 0 };

        // ══════════════════════════════════════════════════════
        //  BRAND IDENTITY — GOAT ROYALTY
        // ══════════════════════════════════════════════════════
        this.brand = {
            name: 'GOAT Royalty Entertainment',
            founder: 'Harvey L. Miller Jr. (DJ Speedy)',
            established: 2024,
            motto: 'Greatness Of All Time — Building Empires Through Sound',
            mission: 'To revolutionize the entertainment industry by combining cutting-edge technology, world-class artistry, and unbreakable business acumen.',
            divisions: [
                { name: 'GOAT Records', emoji: '🎵', description: 'Music label — signing, development, distribution' },
                { name: 'GOAT Studios', emoji: '🎬', description: 'Film & TV production — screenwriting, production, post' },
                { name: 'GOAT Digital', emoji: '💻', description: 'Technology — apps, AI, Web3, metaverse' },
                { name: 'GOAT Touring', emoji: '🎤', description: 'Live events — concerts, festivals, DJ sets' },
                { name: 'GOAT Merch', emoji: '👑', description: 'Merchandise — clothing, accessories, collectibles' },
                { name: 'GOAT Media', emoji: '📱', description: 'Content creation — social media, podcasts, YouTube' }
            ],
            colors: { primary: '#FFD700', secondary: '#1A1A2E', accent: '#E94560', text: '#FFFFFF' },
            website: 'www.goatroyaltyapp.org'
        };

        // ══════════════════════════════════════════════════════
        //  MERCHANDISE ENGINE
        // ══════════════════════════════════════════════════════
        this.merchCatalog = [
            { id: 'goat_hoodie', name: 'GOAT Royalty Signature Hoodie', category: 'Apparel', emoji: '🧥', price: '$85', cost: '$22', margin: '74%', sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'], colors: ['Black/Gold', 'White/Gold', 'Navy/Gold'], features: ['Embroidered GOAT crown logo', 'Premium heavyweight cotton', 'Gold metallic accents', 'Custom interior tags'] },
            { id: 'goat_tee', name: 'GOAT Connect Tour Tee', category: 'Apparel', emoji: '👕', price: '$45', cost: '$8', margin: '82%', sizes: ['S', 'M', 'L', 'XL', '2XL'], colors: ['Black', 'White', 'Forest Green'], features: ['Screen-printed tour dates', 'Vintage wash finish', '100% organic cotton'] },
            { id: 'goat_cap', name: 'Crown Logo Snapback', category: 'Accessories', emoji: '🧢', price: '$35', cost: '$7', margin: '80%', sizes: ['One Size'], colors: ['Black/Gold', 'All Black', 'Camo'], features: ['Structured crown', 'Embroidered logo', 'Adjustable snapback'] },
            { id: 'goat_chain', name: 'GOAT Pendant Chain', category: 'Jewelry', emoji: '⛓️', price: '$150', cost: '$25', margin: '83%', sizes: ['18"', '22"', '26"'], colors: ['Gold', 'Silver', 'Rose Gold'], features: ['Stainless steel', 'CZ diamond encrusted', 'GOAT crown pendant', 'Gift box packaging'] },
            { id: 'goat_vinyl', name: 'Limited Edition Vinyl Box Set', category: 'Collectibles', emoji: '📀', price: '$120', cost: '$35', margin: '71%', sizes: ['Standard'], colors: ['Gold Splatter Vinyl'], features: ['180g colored vinyl', 'Signed by DJ Speedy', 'Exclusive artwork', 'Numbered edition /500'] },
            { id: 'goat_poster', name: 'Concert Poster (Signed)', category: 'Collectibles', emoji: '🖼️', price: '$60', cost: '$5', margin: '92%', sizes: ['18x24"', '24x36"'], colors: ['Full Color'], features: ['Museum-quality print', 'Hand-signed', 'Certificate of authenticity', 'Limited run'] },
            { id: 'goat_usb', name: 'GOAT Producer USB Kit', category: 'Digital', emoji: '💾', price: '$75', cost: '$12', margin: '84%', sizes: ['32GB'], colors: ['Gold USB'], features: ['100+ exclusive samples', '50 drum loops', '25 MIDI files', 'FL Studio presets', 'Royalty-free license'] }
        ];

        // ══════════════════════════════════════════════════════
        //  VENUE & TOUR DATABASE
        // ══════════════════════════════════════════════════════
        this.venueDatabase = [
            { id: 'msg', name: 'Madison Square Garden', city: 'New York, NY', emoji: '🏟️', capacity: 20789, tier: 'Arena', fee: '$300K–$500K', bestFor: 'Major headlining tours', notable: 'Jay-Z, Kanye, Billy Joel residency' },
            { id: 'staples', name: 'Crypto.com Arena', city: 'Los Angeles, CA', emoji: '🌴', capacity: 20000, tier: 'Arena', fee: '$250K–$450K', bestFor: 'West coast flagship shows', notable: 'Drake, Kendrick, BTS' },
            { id: 'o2', name: 'The O2 Arena', city: 'London, UK', emoji: '🇬🇧', capacity: 20000, tier: 'Arena', fee: '£200K–£400K', bestFor: 'European tour opener', notable: 'Beyoncé, Drake, Adele' },
            { id: 'state_farm', name: 'State Farm Arena', city: 'Atlanta, GA', emoji: '🍑', capacity: 21000, tier: 'Arena', fee: '$200K–$400K', bestFor: 'Southern flagship (DJ Speedy home turf)', notable: 'Future, 21 Savage, Lil Baby' },
            { id: 'rolling_loud', name: 'Rolling Loud Festival', city: 'Miami / LA / NYC', emoji: '🎪', capacity: 75000, tier: 'Festival', fee: '$50K–$500K (based on billing)', bestFor: 'Hip-hop festival exposure', notable: 'Travis Scott, Future, Playboi Carti' },
            { id: 'coachella', name: 'Coachella Valley Music Festival', city: 'Indio, CA', emoji: '🌵', capacity: 125000, tier: 'Festival', fee: '$100K–$4M', bestFor: 'Crossover audience, brand deals', notable: 'Beyoncé, Bad Bunny, Frank Ocean' },
            { id: 'club_one', name: 'Intimate Club Show', city: 'Various', emoji: '🎤', capacity: '200–500', tier: 'Club', fee: '$5K–$25K', bestFor: 'Building core fanbase, testing new material', notable: 'Every legend started here' },
            { id: 'theater', name: 'Theater Circuit', city: 'Various', emoji: '🎭', capacity: '1,000–3,000', tier: 'Theater', fee: '$15K–$75K', bestFor: 'Mid-level touring, premium experience', notable: 'Tyler the Creator, Mac Miller started here' }
        ];

        // ══════════════════════════════════════════════════════
        //  REVENUE STREAMS
        // ══════════════════════════════════════════════════════
        this.revenueStreams = [
            { name: 'Streaming Royalties', emoji: '🎵', percentage: 15, description: 'Spotify, Apple Music, Tidal, YouTube Music', growth: '+12% YoY', tips: 'Release consistently (every 6-8 weeks). Playlist placement is key.' },
            { name: 'Live Performance', emoji: '🎤', percentage: 30, description: 'Concerts, festivals, club appearances, DJ sets', growth: '+18% YoY', tips: 'Build a reputation for incredible live shows. Never cancel. Always deliver.' },
            { name: 'Merchandise', emoji: '👕', percentage: 15, description: 'Clothing, accessories, collectibles, digital products', growth: '+25% YoY', tips: 'Design merch fans actually want to wear. Limited drops create urgency.' },
            { name: 'Sync Licensing', emoji: '🎬', percentage: 10, description: 'Film, TV, commercials, video games', growth: '+20% YoY', tips: 'Register with sync agencies. Instrumentals are easier to place than vocals.' },
            { name: 'Publishing', emoji: '📝', percentage: 10, description: 'Songwriting royalties when others cover/sample your work', growth: '+8% YoY', tips: 'Write for other artists. Publishing is passive income that compounds.' },
            { name: 'Brand Partnerships', emoji: '🤝', percentage: 10, description: 'Endorsements, sponsorships, ambassador deals', growth: '+30% YoY', tips: 'Only partner with brands that align with your image. Authenticity > money.' },
            { name: 'Digital Products', emoji: '💻', percentage: 5, description: 'Sample packs, courses, tutorials, NFTs', growth: '+40% YoY', tips: 'Monetize your knowledge. Teach what you know. Build recurring revenue.' },
            { name: 'Investments', emoji: '📈', percentage: 5, description: 'Real estate, stocks, startups, crypto', growth: 'Variable', tips: 'Diversify. Never put all your money in one basket. Build generational wealth.' }
        ];

        // ══════════════════════════════════════════════════════
        //  CONTRACT TEMPLATES
        // ══════════════════════════════════════════════════════
        this.contractTemplates = [
            { id: 'recording', name: 'Recording Contract (360 Deal)', emoji: '🎵', risk: 'HIGH', keyTerms: ['Advance: $50K–$2M', 'Royalty: 12–20% of net', 'Term: 5–7 albums', 'Label owns masters', '360 deal takes % of all revenue'], warning: '⚠️ 360 deals take a cut of EVERYTHING — touring, merch, endorsements. Negotiate hard or stay indie.', tips: 'Counter with higher royalty rate. Try to keep merch and touring revenue. ALWAYS get an entertainment lawyer.' },
            { id: 'distribution', name: 'Distribution Deal', emoji: '📡', risk: 'LOW', keyTerms: ['Keep your masters', 'Distribution fee: 10–30%', 'Term: 1–3 years', 'You fund recording', 'More creative control'], warning: '✅ Best option for established indie artists. Keep your masters, keep your freedom.', tips: 'DistroKid/TuneCore for DIY. AWAL/Stem for artist-friendly label support.' },
            { id: 'publishing', name: 'Publishing Deal', emoji: '📝', risk: 'MEDIUM', keyTerms: ['Advance: $10K–$500K', 'Co-publishing: 75/25 split', 'Admin deal: 80/20 or 90/10', 'Term: 2–5 years', 'Covers sync, mechanical, performance'], warning: '⚠️ Co-pub deals give away 50% of your publishing. Admin deals are safer but smaller advances.', tips: 'Start with an admin deal. Only sign co-pub if the advance justifies giving up ownership.' },
            { id: 'management', name: 'Artist Management', emoji: '👔', risk: 'MEDIUM', keyTerms: ['Commission: 15–20%', 'Term: 2–5 years', 'Sunset clause: 1–3 years post-term', 'Key person clause essential', 'Scope: all entertainment activities'], warning: '⚠️ A bad manager can destroy your career. A good one is worth every penny.', tips: 'Always include a key person clause. If your specific manager leaves the company, you can too.' },
            { id: 'producer', name: 'Producer Agreement', emoji: '🎛️', risk: 'LOW', keyTerms: ['Beat price: $500–$50K', 'Points: 2–5% of master royalties', 'Publishing split: 50/50 or negotiated', 'Exclusive vs. non-exclusive', 'Buyout option'], warning: '✅ Always get the split in writing BEFORE the session.', tips: 'If you produce AND write, you should get both producer points AND publishing.' },
            { id: 'sync', name: 'Sync License Agreement', emoji: '🎬', risk: 'LOW', keyTerms: ['One-time fee: $1K–$500K', 'Territory: worldwide or regional', 'Duration: 1 year to perpetuity', 'Exclusivity: usually non-exclusive', 'Media type specified'], warning: '✅ Sync money is a lump sum. Great for cash flow.', tips: 'Non-exclusive is better — you can license the same song multiple times.' }
        ];

        // ══════════════════════════════════════════════════════
        //  ENTERTAINMENT LAW DATABASE
        // ══════════════════════════════════════════════════════
        this.legalDatabase = [
            { topic: 'Copyright Basics', emoji: '©️', summary: 'Two copyrights exist in every song: the composition (lyrics + melody) and the sound recording (master). You own copyright the moment you create it, but registration provides legal protection.', keyPoints: ['Register with US Copyright Office ($45-$65)', 'Copyright lasts life + 70 years', 'Fair use is a defense, not a right', 'Work for hire = you don\'t own it'] },
            { topic: 'Master Ownership', emoji: '👑', summary: 'The master recording is the actual audio file. Whoever funds the recording typically owns the master. Own your masters — this is the single most important business decision.', keyPoints: ['Label deals: label owns masters', 'Indie: you own masters', 'Masters generate revenue forever', 'Prince, Taylor Swift, Jay-Z all fought for masters'] },
            { topic: 'Trademark Protection', emoji: '™️', summary: 'Your artist name, logo, and brand elements can be trademarked. This prevents others from using your name/brand.', keyPoints: ['File with USPTO ($250-$350 per class)', 'Trademark classes: 9 (recordings), 25 (apparel), 41 (entertainment)', 'Use ™ immediately, ® after registration', 'Monitor for infringement'] },
            { topic: 'Performance Rights', emoji: '🎤', summary: 'When your music is played publicly (radio, streaming, live venues), you earn performance royalties through your PRO (ASCAP, BMI, SESAC).', keyPoints: ['Register both as writer AND publisher', 'PROs only collect performance royalties', 'International: sub-publishers collect overseas', 'Live venues pay blanket licenses'] },
            { topic: 'Contract Red Flags', emoji: '🚩', summary: 'Know what to watch for in any entertainment contract. Never sign without an entertainment lawyer reviewing.', keyPoints: ['Perpetuity clauses (they own it forever)', 'No audit rights (can\'t verify accounting)', 'No termination clause (no way out)', 'Oral agreements (get everything in writing)', '360 deals without caps', 'Cross-collateralization (debt from album 1 blocks album 2 royalties)'] }
        ];

        // ══════════════════════════════════════════════════════
        //  SOCIAL MEDIA STRATEGY
        // ══════════════════════════════════════════════════════
        this.socialStrategy = [
            { platform: 'Instagram', emoji: '📸', followers: 'Target: 100K+', postFreq: '1-2x daily + stories', content: ['Behind-the-scenes studio', 'Lifestyle/fashion', 'Reels with music clips', 'Fan interactions'], bestTime: '11am-1pm & 7pm-9pm EST', tips: 'Reels > static posts. Show personality. Engage in comments first 30 mins.' },
            { platform: 'TikTok', emoji: '🎵', followers: 'Target: 500K+', postFreq: '2-3x daily', content: ['Song snippets (15-30sec)', 'Production tutorials', 'Day-in-the-life', 'Trending sounds with twist'], bestTime: '7am, 12pm, 7pm EST', tips: 'Hook in first 2 seconds. Use trending sounds. Post consistently. Duet fans.' },
            { platform: 'YouTube', emoji: '▶️', followers: 'Target: 250K+', postFreq: '1-2x weekly', content: ['Music videos', 'Vlogs', 'Studio sessions', 'Interviews', 'Lyric videos'], bestTime: 'Saturday 9am-12pm', tips: 'Thumbnails matter more than titles. First 30 seconds = retention hook. Shorts for discovery.' },
            { platform: 'Twitter/X', emoji: '🐦', followers: 'Target: 200K+', postFreq: '3-5x daily', content: ['Hot takes', 'Announcements', 'Fan interactions', 'Industry commentary'], bestTime: '8am-10am & 6pm-9pm EST', tips: 'Be authentic. Start conversations. Quote tweet instead of reply. Threads for storytelling.' },
            { platform: 'Spotify', emoji: '🟢', followers: 'Target: 50K+', postFreq: 'Release every 6-8 weeks', content: ['Singles', 'EPs', 'Playlists', 'Canvas videos', 'Storylines'], bestTime: 'Release on Friday', tips: 'Pitch to editorial playlists 4 weeks before release. Use Canvas for visual loops. Create artist playlists.' }
        ];

        console.log('🏰 Royalty Empire loaded: ' + this.brand.divisions.length + ' divisions, ' + this.merchCatalog.length + ' merch items');
    }

    // ═══════════════════════════════════════════════════════
    //  INVESTOR PITCH GENERATOR
    // ═══════════════════════════════════════════════════════
    generatePitch(options = {}) {
        this.stats.pitchesGenerated++;
        const { artistName, genre, monthlyStreams, socialFollowers, askAmount } = options;
        return {
            success: true,
            pitch: {
                title: `${artistName || 'GOAT Royalty Entertainment'} — Investment Deck`,
                sections: [
                    { name: '🎯 Executive Summary', content: `${artistName || 'GOAT Royalty'} is a next-generation entertainment company at the intersection of music, technology, and culture. With ${(monthlyStreams || 500000).toLocaleString()} monthly streams and ${(socialFollowers || 100000).toLocaleString()} social followers, we're positioned for exponential growth.` },
                    { name: '💰 The Ask', content: `Seeking $${(askAmount || 500000).toLocaleString()} in seed funding for artist development, marketing, and technology infrastructure.` },
                    { name: '📊 Market Opportunity', content: 'Global music industry: $28.6B (2023). Streaming: $19.3B (+10.2% YoY). Live music: $32.8B. Merch: $3.5B. Total addressable market: $84B+.' },
                    { name: '🔥 Traction', content: `${(monthlyStreams || 500000).toLocaleString()} monthly streams. ${(socialFollowers || 100000).toLocaleString()} social followers. Growing ${genre || 'hip-hop'} audience. Multiple revenue streams active.` },
                    { name: '💵 Revenue Model', content: this.revenueStreams.map(r => `${r.emoji} ${r.name}: ${r.percentage}%`).join('\n') },
                    { name: '🚀 Use of Funds', content: '40% Artist development & recording\n25% Marketing & promotion\n20% Technology & platform\n10% Operations & legal\n5% Reserve' },
                    { name: '👥 Team', content: `CEO: ${artistName || 'Harvey Miller (DJ Speedy)'}\nVision: Build the premier independent entertainment empire combining artistry with technology.` }
                ],
                timestamp: new Date().toISOString()
            }
        };
    }

    // ═══════════════════════════════════════════════════════
    //  MERCH REVENUE CALCULATOR
    // ═══════════════════════════════════════════════════════
    calculateMerchRevenue(units, itemId) {
        this.stats.revenueCalculated++;
        const item = this.merchCatalog.find(m => m.id === itemId);
        if (!item) return { success: false, error: 'Item not found' };
        const price = parseFloat(item.price.replace('$', ''));
        const cost = parseFloat(item.cost.replace('$', ''));
        return {
            success: true,
            item: item.name,
            units,
            grossRevenue: `$${(units * price).toLocaleString()}`,
            totalCost: `$${(units * cost).toLocaleString()}`,
            netProfit: `$${(units * (price - cost)).toLocaleString()}`,
            margin: item.margin
        };
    }

    // ═══════════════════════════════════════════════════════
    //  PUBLIC API
    // ═══════════════════════════════════════════════════════
    getBrand() { return { success: true, brand: this.brand }; }
    getMerch() { return { success: true, catalog: this.merchCatalog, total: this.merchCatalog.length }; }
    getVenues() { return { success: true, venues: this.venueDatabase, total: this.venueDatabase.length }; }
    getRevenueStreams() { return { success: true, streams: this.revenueStreams }; }
    getContracts() { return { success: true, contracts: this.contractTemplates, total: this.contractTemplates.length }; }
    getLegal() { return { success: true, legal: this.legalDatabase }; }
    getSocial() { return { success: true, social: this.socialStrategy }; }

    getStats() {
        return {
            success: true,
            divisions: this.brand.divisions.length,
            merchItems: this.merchCatalog.length,
            venues: this.venueDatabase.length,
            revenueStreams: this.revenueStreams.length,
            contractTypes: this.contractTemplates.length,
            legalTopics: this.legalDatabase.length,
            socialPlatforms: this.socialStrategy.length,
            pitchesGenerated: this.stats.pitchesGenerated
        };
    }
}

module.exports = new RoyaltyEmpire();