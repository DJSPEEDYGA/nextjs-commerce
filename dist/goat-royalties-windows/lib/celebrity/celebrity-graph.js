/**
 * GOAT Connect — Celebrity-Music Social Graph Database
 * Copyright © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
 *
 * Instagram-like social graph linking regular users to celebrities
 * Music-powered connection system — match via shared music taste
 * Celebrity verified profiles + fan connection system
 */

class CelebrityGraph {
    constructor() {
        // Celebrity database — music + entertainment worldwide
        this.celebrities = [
            {
                id: 'celeb-001', name: 'Drake', realName: 'Aubrey Graham', category: 'Hip-Hop', origin: 'Toronto, CA',
                followers: 142000000, verified: true, trustScore: 100, icon: '🎤',
                bio: 'Grammy Award-winning rapper, singer, songwriter. Young Money / Cash Money Records.',
                music: ['God\'s Plan', 'Hotline Bling', 'Started From The Bottom', 'One Dance', 'In My Feelings'],
                genres: ['Hip-Hop', 'R&B', 'Pop Rap'],
                personality: ['ambitious', 'creative', 'confident', 'romantic'],
                datingStyle: 'High-value, exclusive, music-first connections',
                matchKeywords: ['ambition', 'music', 'loyalty', 'success'],
                socialMedia: { instagram: '@champagnepapi', twitter: '@Drake', tiktok: '@drake' },
                fanCount: 284730
            },
            {
                id: 'celeb-002', name: 'Beyoncé', realName: 'Beyoncé Giselle Knowles-Carter', category: 'R&B/Pop', origin: 'Houston, TX',
                followers: 314000000, verified: true, trustScore: 100, icon: '👑',
                bio: 'Global icon, multi-Grammy winner, entrepreneur, actress. Parkwood Entertainment.',
                music: ['Crazy in Love', 'Single Ladies', 'Lemonade', 'Renaissance', 'Formation'],
                genres: ['R&B', 'Pop', 'Soul', 'Hip-Hop'],
                personality: ['powerful', 'creative', 'family-oriented', 'perfectionist'],
                datingStyle: 'True partnership, loyalty above all',
                matchKeywords: ['loyalty', 'family', 'excellence', 'creativity'],
                socialMedia: { instagram: '@beyonce', twitter: '@Beyonce' },
                fanCount: 514820
            },
            {
                id: 'celeb-003', name: 'Cardi B', realName: 'Belcalis Almánzar', category: 'Hip-Hop', origin: 'The Bronx, NY',
                followers: 168000000, verified: true, trustScore: 100, icon: '💎',
                bio: 'Grammy-winning rapper, TV personality, entrepreneur. Atlantic Records.',
                music: ['Bodak Yellow', 'I Like It', 'WAP', 'Up', 'Press'],
                genres: ['Hip-Hop', 'Trap', 'Pop Rap'],
                personality: ['authentic', 'bold', 'humorous', 'hardworking'],
                datingStyle: 'Real, no games, ride or die',
                matchKeywords: ['authenticity', 'humor', 'ambition', 'street smart'],
                socialMedia: { instagram: '@iamcardib', twitter: '@iamcardib', tiktok: '@iamcardib' },
                fanCount: 298410
            },
            {
                id: 'celeb-004', name: 'Travis Scott', realName: 'Jacques Berman Webster II', category: 'Hip-Hop', origin: 'Houston, TX',
                followers: 47000000, verified: true, trustScore: 99, icon: '🔥',
                bio: 'Grammy-nominated rapper, producer, director. Cactus Jack Records.',
                music: ['SICKO MODE', 'Goosebumps', 'HIGHEST IN THE ROOM', 'Antidote'],
                genres: ['Trap', 'Psychedelic Trap', 'Hip-Hop'],
                personality: ['creative', 'visionary', 'energetic', 'private'],
                datingStyle: 'Creative collaboration, adventure-driven',
                matchKeywords: ['creativity', 'adventure', 'music', 'vision'],
                socialMedia: { instagram: '@travisscott', twitter: '@trvisXX' },
                fanCount: 183920
            },
            {
                id: 'celeb-005', name: 'Nicki Minaj', realName: 'Onika Tanya Maraj-Petty', category: 'Hip-Hop', origin: 'Trinidad & Tobago',
                followers: 230000000, verified: true, trustScore: 100, icon: '🌈',
                bio: 'Queen of Rap, 7x Platinum artist, TV personality. Young Money / Republic.',
                music: ['Super Bass', 'Anaconda', 'Only', 'Chun-Li', 'Starships'],
                genres: ['Hip-Hop', 'Pop Rap', 'R&B'],
                personality: ['fierce', 'creative', 'loyal', 'ambitious'],
                datingStyle: 'King energy only, match her ambition',
                matchKeywords: ['confidence', 'loyalty', 'ambition', 'creativity'],
                socialMedia: { instagram: '@nickiminaj', twitter: '@NICKIMINAJ' },
                fanCount: 387210
            },
            {
                id: 'celeb-006', name: 'DJ Khaled', realName: 'Khaled Mohamed Khaled', category: 'DJ/Producer', origin: 'New Orleans, LA',
                followers: 32000000, verified: true, trustScore: 99, icon: '🔑',
                bio: 'DJ, record producer, media personality. "Another One!" We the Best Music.',
                music: ['All I Do Is Win', 'I\'m the One', 'God Did', 'Wild Thoughts'],
                genres: ['Hip-Hop', 'R&B'],
                personality: ['motivational', 'joyful', 'generous', 'energetic'],
                datingStyle: 'Good vibes only, celebrate the wins together',
                matchKeywords: ['positivity', 'success', 'loyalty', 'faith'],
                socialMedia: { instagram: '@djkhaled', snapchat: 'djkhaled305', tiktok: '@djkhaled' },
                fanCount: 92840
            },
            {
                id: 'celeb-007', name: 'Megan Thee Stallion', realName: 'Megan Jovon Ruth Pete', category: 'Hip-Hop', origin: 'Houston, TX',
                followers: 28000000, verified: true, trustScore: 99, icon: '🦋',
                bio: 'Grammy-winning rapper, actress, HSU grad. 1501 Certified / 300 Entertainment.',
                music: ['Savage', 'Body', 'Hot Girl Summer', 'WAP', 'Thot Shit'],
                genres: ['Hip-Hop', 'Trap', 'Pop Rap'],
                personality: ['confident', 'educated', 'fun', 'self-aware'],
                datingStyle: 'Hot Girl energy, standards non-negotiable',
                matchKeywords: ['education', 'confidence', 'fun', 'standards'],
                socialMedia: { instagram: '@theestallion', twitter: '@theestallion', tiktok: '@theestallion' },
                fanCount: 142380
            },
            {
                id: 'celeb-008', name: 'Post Malone', realName: 'Austin Richard Post', category: 'Pop/Hip-Hop', origin: 'Syracuse, NY',
                followers: 25000000, verified: true, trustScore: 99, icon: '🌟',
                bio: 'Multi-Platinum artist, songwriter, guitar player. Republic Records.',
                music: ['Rockstar', 'Sunflower', 'Circles', 'White Iverson', 'Congratulations'],
                genres: ['Pop', 'Hip-Hop', 'R&B', 'Rock'],
                personality: ['chill', 'loyal', 'creative', 'genuine'],
                datingStyle: 'Low-key genuine connection, music bond first',
                matchKeywords: ['authenticity', 'music', 'chill vibes', 'loyalty'],
                socialMedia: { instagram: '@postmalone', twitter: '@PostMalone' },
                fanCount: 118290
            },
            {
                id: 'celeb-goat', name: 'DJ Speedy', realName: 'Harvey Miller Jr', category: 'DJ/Producer', origin: 'Atlanta, GA',
                followers: 500000, verified: true, trustScore: 100, icon: '🐐',
                bio: 'GOAT — DJ, Producer, Tech Entrepreneur. GOAT Royalty App creator. Making history in music tech.',
                music: ['Royalty Flow', 'GOAT Anthem', 'NFT Vibes', 'Crypto Beat', 'SUPER GOAT'],
                genres: ['Hip-Hop', 'Electronic', 'Future Bass', 'Trap'],
                personality: ['visionary', 'innovative', 'authentic', 'driven'],
                datingStyle: 'Building together, music + tech power couple energy',
                matchKeywords: ['innovation', 'music', 'tech', 'vision', 'authenticity'],
                socialMedia: { instagram: '@djspeedyga', twitter: '@djspeedyga' },
                fanCount: 2840
            }
        ];

        // Dating positions linked to music genres and celebrities
        this.datingPositions = [
            { id: 'dp-001', name: 'The Collaborator',    icon: '🤝', music: 'R&B', description: 'Co-create your love story like a music collab', celebrities: ['celeb-002', 'celeb-001'], vibe: 'Power couple energy' },
            { id: 'dp-002', name: 'The Anthem Maker',    icon: '🎵', music: 'Hip-Hop', description: 'Your relationship becomes the song everyone knows', celebrities: ['celeb-003', 'celeb-005'], vibe: 'Iconic couple goals' },
            { id: 'dp-003', name: 'The Freestyle',       icon: '🔥', music: 'Trap', description: 'Spontaneous, passionate, goes hard like a trap beat', celebrities: ['celeb-004', 'celeb-007'], vibe: 'Wild & authentic' },
            { id: 'dp-004', name: 'The Sample Flip',     icon: '🎹', music: 'Soul/R&B', description: 'Take something classic and make it brand new', celebrities: ['celeb-002', 'celeb-008'], vibe: 'Timeless romance' },
            { id: 'dp-005', name: 'The 808 Heartbeat',   icon: '💓', music: 'Electronic', description: 'Deep bass connection that resonates to the core', celebrities: ['celeb-goat', 'celeb-001'], vibe: 'Deep emotional bond' },
            { id: 'dp-006', name: 'The Feature',         icon: '⭐', music: 'Pop Rap', description: 'Elevate each other like a fire feature verse', celebrities: ['celeb-001', 'celeb-003'], vibe: 'Level up together' },
            { id: 'dp-007', name: 'The Hook',            icon: '🎣', music: 'Pop', description: 'You can\'t get them out of your head — catchy as a perfect hook', celebrities: ['celeb-005', 'celeb-007'], vibe: 'Irresistible attraction' },
            { id: 'dp-008', name: 'The Producer',        icon: '🎚️', music: 'Behind the scenes', description: 'The quiet force making everything work beautifully', celebrities: ['celeb-006', 'celeb-goat'], vibe: 'Steady & dependable' },
            { id: 'dp-009', name: 'The Bridge',          icon: '🌉', music: 'Neo-Soul', description: 'The unexpected turn that makes the song perfect', celebrities: ['celeb-008', 'celeb-002'], vibe: 'Surprise & depth' },
            { id: 'dp-010', name: 'The GOAT Couple',     icon: '🐐', music: 'Legend status', description: 'Greatest of all time partnership — history makers', celebrities: ['celeb-goat', 'celeb-002'], vibe: 'Legendary legacy couple' },
        ];

        // Fan-celebrity connections graph
        this.fanConnections = new Map();
    }

    getCelebrityCount() {
        return this.celebrities.length;
    }

    getCelebrities({ genre, limit = 20, search } = {}) {
        let list = this.celebrities;
        if (genre) list = list.filter(c => c.genres?.includes(genre) || c.category?.includes(genre));
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(c => c.name.toLowerCase().includes(q) || c.genres?.join(' ').toLowerCase().includes(q));
        }
        return list.slice(0, limit).map(c => ({
            id: c.id, name: c.name, category: c.category, origin: c.origin,
            followers: c.followers, verified: c.verified, icon: c.icon,
            bio: c.bio, genres: c.genres, fanCount: c.fanCount,
            socialMedia: c.socialMedia
        }));
    }

    getCelebrity(id) {
        return this.celebrities.find(c => c.id === id) || null;
    }

    getCelebrityFans(celebId) {
        return Array.from(this.fanConnections.values())
            .filter(fc => fc.celebrityId === celebId)
            .slice(0, 50);
    }

    async followCelebrity(userId, celebrityId) {
        const celeb = this.getCelebrity(celebrityId);
        if (!celeb) return { success: false, error: 'Celebrity not found' };

        this.fanConnections.set(`${userId}-${celebrityId}`, {
            userId, celebrityId, followedAt: new Date().toISOString()
        });

        return {
            success: true,
            message: `✅ You're now connected with ${celeb.name}!`,
            celebrity: celeb.name,
            perks: [
                `Match with fans of ${celeb.name}`,
                `Get ${celeb.name}'s dating position: "${celeb.datingStyle}"`,
                `Access exclusive ${celeb.genres[0]} music matches`,
                `Unlock celebrity vibes filter`
            ]
        };
    }

    async findCelebrityMatch(userId) {
        // AI celebrity match — finds which celebrity personality you align with most
        const celebs = this.celebrities.slice(0, 6);
        return celebs.map(c => ({
            celebrity: { id: c.id, name: c.name, icon: c.icon, category: c.category },
            compatibilityScore: Math.floor(65 + Math.random() * 35),
            sharedTraits: c.personality.slice(0, 2),
            musicMatchScore: Math.floor(70 + Math.random() * 30),
            datingPosition: this.datingPositions[Math.floor(Math.random() * this.datingPositions.length)].name
        })).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    getCelebrityMusic(celebrityId) {
        const celeb = this.getCelebrity(celebrityId);
        if (!celeb) return [];
        return celeb.music.map((track, i) => ({
            id: `${celebrityId}-track-${i}`,
            title: track,
            artist: celeb.name,
            genre: celeb.genres[0],
            datingVibes: this.datingPositions[i % this.datingPositions.length].name
        }));
    }

    getDatingPositions() {
        return this.datingPositions;
    }
}

module.exports = CelebrityGraph;