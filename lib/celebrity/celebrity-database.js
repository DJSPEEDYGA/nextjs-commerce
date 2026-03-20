// © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
// GOAT Connect — Worldwide Celebrity & Fan Database
'use strict';

class CelebrityDatabase {
    constructor() {
        this.celebrities = this._buildWorldwideCelebrityDB();
        this.fans = new Map();
        this.connections = new Map();
        this.trending = [];
        this._buildTrending();
    }

    _buildWorldwideCelebrityDB() {
        return [
            // ===== HIP-HOP / RAP =====
            { id:'c001', name:'DJ Speedy', realName:'Harvey Lee Miller Jr.', emoji:'🎧', genre:'Hip-Hop/EDM/R&B', country:'USA', city:'Atlanta', hometown:'Orangeburg, SC', followers:40000000, verified:true, tier:'GOAT', bio:'Multi-Platinum Super Producing Composer. 40+ million records sold (RIAA confirmed). Credits: Beyoncé, Jay-Z, Outkast, Waka Flocka, Gucci Mane, Nicki Minaj, 2 Chainz, T.I., Flo Rida, Drake, Future, Migos. ASCAP writer/publisher. Sony Music / The Orchard. Film/TV: Marvel, MTV, CBS, FOX, NBC, VH1. Founder of GOAT Systems & Speedy Productions Inc.', socialLinks:{ ig:'djspeedyga', twitter:'WHOISHARVEY', linkedin:'djspeedy', github:'DJSPEEDYGA' }, musicStyle:'Hip-Hop/R&B/EDM/Trap/Classical Fusion', datePositions:['The GOAT Energy','The Empire Builder'], isCreator:true, publisher:'FASTASSMAN PUBLISHING INC', pro:'ASCAP', ipi:'348202968', distribution:'Sony Music / The Orchard', companies:['Speedy Productions Inc.','Fastassman Publishing Inc.','Life Imitates Art Inc.','HarveyMillerMusic Inc.','Brick Squad Music LLC','GOAT Systems'], catalogSize:333, recordsSold:'40,000,000+' },
            { id:'c002', name:'Drake', realName:'Aubrey Drake Graham', emoji:'🦉', genre:'Hip-Hop/R&B', country:'Canada', city:'Toronto', followers:847000, verified:true, tier:'Legend', bio:'6 God. OVO Sound. Hip-hop icon.', socialLinks:{ ig:'champagnepapi' }, musicStyle:'Hip-Hop/R&B/Pop', datePositions:['The R&B Serenader'] },
            { id:'c003', name:'Beyoncé', realName:'Beyoncé Giselle Knowles-Carter', emoji:'👸', genre:'R&B/Pop', country:'USA', city:'Houston', followers:2100000, verified:true, tier:'Legend', bio:'Queen Bey. Renaissance. Icon.', socialLinks:{ ig:'beyonce' }, musicStyle:'R&B/Pop/Dance', datePositions:['The R&B Serenader','The Pop Dreamer'] },
            { id:'c004', name:'Cardi B', realName:'Belcalis Marlenis Almánzar', emoji:'💅', genre:'Hip-Hop', country:'USA', city:'New York', followers:623000, verified:true, tier:'Star', bio:'Bodak energy. WAP. Real & unfiltered.', socialLinks:{ ig:'iamcardib' }, musicStyle:'Trap/Hip-Hop', datePositions:['The Trap Romantic'] },
            { id:'c005', name:'Travis Scott', realName:'Jacques Webster II', emoji:'🌵', genre:'Trap', country:'USA', city:'Houston', followers:512000, verified:true, tier:'Star', bio:'Astroworld. Highest in the room.', socialLinks:{ ig:'travisscott' }, musicStyle:'Trap/Psychedelic', datePositions:['The Trap Romantic'] },
            { id:'c006', name:'Nicki Minaj', realName:'Onika Tanya Maraj', emoji:'👑', genre:'Hip-Hop', country:'Trinidad', city:'New York', followers:934000, verified:true, tier:'Legend', bio:'The Queen. Barbie world. Roman Reloaded.', socialLinks:{ ig:'nickiminaj' }, musicStyle:'Hip-Hop/Pop/Dancehall', datePositions:['The Hip-Hop Partner'] },
            { id:'c007', name:'DJ Khaled', realName:'Khaled Mohamed Khaled', emoji:'🔑', genre:'Hip-Hop', country:'USA', city:'Miami', followers:445000, verified:true, tier:'Star', bio:'Another one. We the best music.', socialLinks:{ ig:'djkhaled' }, musicStyle:'Hip-Hop/Reggae', datePositions:['The Hip-Hop Partner'] },
            { id:'c008', name:'Megan Thee Stallion', realName:'Megan Jovon Ruth Pete', emoji:'🐎', genre:'Hip-Hop', country:'USA', city:'Houston', followers:678000, verified:true, tier:'Star', bio:'Hot girl summer. Savage. Real hot girl.', socialLinks:{ ig:'theestallion' }, musicStyle:'Hip-Hop/Trap', datePositions:['The Trap Romantic'] },
            { id:'c009', name:'Post Malone', realName:'Austin Richard Post', emoji:'🌹', genre:'Hip-Hop/Rock', country:'USA', city:'Dallas', followers:521000, verified:true, tier:'Star', bio:'Rockstar vibes. Sunflower. Circles.', socialLinks:{ ig:'postmalone' }, musicStyle:'Hip-Hop/Rock/Pop', datePositions:['The Pop Dreamer'] },
            { id:'c010', name:'Lil Baby', realName:'Dominique Armani Jones', emoji:'💎', genre:'Trap', country:'USA', city:'Atlanta', followers:389000, verified:true, tier:'Star', bio:'Harder than Ever. My Turn.', socialLinks:{ ig:'lilbaby4PF' }, musicStyle:'Trap/Hip-Hop', datePositions:['The Trap Romantic'] },
            // ===== R&B / SOUL =====
            { id:'c011', name:'The Weeknd', realName:'Abel Makkonen Tesfaye', emoji:'🌙', genre:'R&B', country:'Canada', city:'Toronto', followers:892000, verified:true, tier:'Legend', bio:'Blinding Lights. After Hours. XO.', socialLinks:{ ig:'theweeknd' }, musicStyle:'R&B/Synth-Pop/Dark', datePositions:['The R&B Serenader'] },
            { id:'c012', name:'SZA', realName:'Solána Imani Rowe', emoji:'🌺', genre:'R&B', country:'USA', city:'New Jersey', followers:445000, verified:true, tier:'Star', bio:'CTRL. SOS. Vulnerable beauty.', socialLinks:{ ig:'sza' }, musicStyle:'R&B/Soul/Alt', datePositions:['The R&B Serenader'] },
            { id:'c013', name:'Bruno Mars', realName:'Peter Gene Hernandez', emoji:'🪐', genre:'Pop/R&B', country:'USA', city:'Honolulu', followers:934000, verified:true, tier:'Legend', bio:'24K Magic. Finesse. Pop perfection.', socialLinks:{ ig:'brunomars' }, musicStyle:'Pop/R&B/Funk', datePositions:['The Pop Dreamer','The R&B Serenader'] },
            // ===== AFROBEATS / GLOBAL =====
            { id:'c014', name:'Burna Boy', realName:'Damini Ebunoluwa Ogulu', emoji:'🌍', genre:'Afrobeats', country:'Nigeria', city:'Lagos', followers:367000, verified:true, tier:'Star', bio:'African Giant. Love Damini. Twice as Tall.', socialLinks:{ ig:'burnaboygram' }, musicStyle:'Afrobeats/Afrofusion', datePositions:['The Afrobeats Lover'] },
            { id:'c015', name:'WizKid', realName:'Ayodeji Ibrahim Balogun', emoji:'🌟', genre:'Afrobeats', country:'Nigeria', city:'Lagos', followers:412000, verified:true, tier:'Star', bio:'Made In Lagos. Essence. Starboy.', socialLinks:{ ig:'wizkidayo' }, musicStyle:'Afrobeats/R&B', datePositions:['The Afrobeats Lover'] },
            { id:'c016', name:'Davido', realName:'David Adedeji Adeleke', emoji:'🎶', genre:'Afrobeats', country:'Nigeria', city:'Lagos', followers:298000, verified:true, tier:'Star', bio:'A Better Time. We Rise. 30BG.', socialLinks:{ ig:'davidoofficial' }, musicStyle:'Afrobeats/Dancehall', datePositions:['The Afrobeats Lover'] },
            // ===== LATIN =====
            { id:'c017', name:'Bad Bunny', realName:'Benito Antonio Ocasio', emoji:'🐰', genre:'Reggaeton', country:'Puerto Rico', city:'San Juan', followers:1200000, verified:true, tier:'Legend', bio:'Un Verano Sin Ti. YHLQMDLG. El Conejo Malo.', socialLinks:{ ig:'badbunnypr' }, musicStyle:'Reggaeton/Latin Trap', datePositions:['The Reggaeton Fire'] },
            { id:'c018', name:'J Balvin', realName:'José Álvaro Osorio Balvin', emoji:'🌈', genre:'Reggaeton', country:'Colombia', city:'Medellín', followers:567000, verified:true, tier:'Star', bio:'Colores. Jose. El Niño de Medellín.', socialLinks:{ ig:'jbalvin' }, musicStyle:'Reggaeton/Urban Latin', datePositions:['The Reggaeton Fire'] },
            // ===== EDM / ELECTRONIC =====
            { id:'c019', name:'Marshmello', realName:'Christopher Comstock', emoji:'🤍', genre:'EDM', country:'USA', city:'Los Angeles', followers:378000, verified:true, tier:'Star', bio:'Alone. Happier. Mello Gang.', socialLinks:{ ig:'marshmellomusic' }, musicStyle:'EDM/Future Bass/Trap', datePositions:['The Electronic Nomad'] },
            { id:'c020', name:'Diplo', realName:'Thomas Wesley Pentz', emoji:'🎛️', genre:'EDM/DJ', country:'USA', city:'Philadelphia', followers:289000, verified:true, tier:'Star', bio:'Major Lazer. Jack Ü. ECO.', socialLinks:{ ig:'diplo' }, musicStyle:'EDM/Trap/Dancehall', datePositions:['The Electronic Nomad'] },
            // ===== POP =====
            { id:'c021', name:'Rihanna', realName:'Robyn Rihanna Fenty', emoji:'💋', genre:'Pop/R&B', country:'Barbados', city:'Bridgetown', followers:1450000, verified:true, tier:'Legend', bio:'Fenty Beauty. ANTI. Diamonds.', socialLinks:{ ig:'badgalriri' }, musicStyle:'Pop/R&B/Dancehall', datePositions:['The Pop Dreamer'] },
            { id:'c022', name:'Taylor Swift', realName:'Taylor Alison Swift', emoji:'🧣', genre:'Pop/Country', country:'USA', city:'Nashville', followers:2300000, verified:true, tier:'Legend', bio:'Eras Tour. Midnights. Mastermind.', socialLinks:{ ig:'taylorswift' }, musicStyle:'Pop/Folk/Country', datePositions:['The Pop Dreamer'] },
            { id:'c023', name:'Dua Lipa', realName:'Dua Lipa', emoji:'💙', genre:'Pop/Dance', country:'UK', city:'London', followers:678000, verified:true, tier:'Star', bio:'Future Nostalgia. Levitating. New Rules.', socialLinks:{ ig:'dualipa' }, musicStyle:'Pop/Disco/Dance', datePositions:['The Pop Dreamer'] },
            // ===== JAZZ / SOUL =====
            { id:'c024', name:'Kendrick Lamar', realName:'Kendrick Lamar Duckworth', emoji:'👁️', genre:'Hip-Hop', country:'USA', city:'Compton', followers:723000, verified:true, tier:'Legend', bio:'DAMN. To Pimp a Butterfly. King Kendrick.', socialLinks:{ ig:'kendricklamar' }, musicStyle:'Conscious Hip-Hop/Jazz Rap', datePositions:['The Jazz Intellectual'] },
            { id:'c025', name:'J. Cole', realName:'Jermaine Lamarr Cole', emoji:'🌾', genre:'Hip-Hop', country:'USA', city:'Fayetteville', followers:589000, verified:true, tier:'Legend', bio:'Forest Hills Drive. KOD. Dreamville.', socialLinks:{ ig:'realcoleworld' }, musicStyle:'Conscious Rap/Jazz', datePositions:['The Jazz Intellectual'] },
            // ===== GOSPEL =====
            { id:'c026', name:'Kirk Franklin', realName:'Kirk Dewayne Franklin', emoji:'🙏', genre:'Gospel', country:'USA', city:'Fort Worth', followers:234000, verified:true, tier:'Star', bio:'Stomp. Lean On Me. God Favored Me.', socialLinks:{ ig:'kirkfranklinofficial' }, musicStyle:'Gospel/Contemporary Christian', datePositions:['The Gospel Soul'] },
            // ===== K-POP =====
            { id:'c027', name:'BTS', realName:'Bangtan Sonyeondan', emoji:'💜', genre:'K-Pop', country:'South Korea', city:'Seoul', followers:4500000, verified:true, tier:'Legend', bio:'Dynamite. Butter. ARMY forever.', socialLinks:{ ig:'bts.bighitofficial' }, musicStyle:'K-Pop/Pop/Hip-Hop', datePositions:['The Pop Dreamer'] },
            { id:'c028', name:'BLACKPINK', realName:'BLACKPINK', emoji:'🖤', genre:'K-Pop', country:'South Korea', city:'Seoul', followers:3200000, verified:true, tier:'Legend', bio:'Pink Venom. How You Like That. Blinks.', socialLinks:{ ig:'blackpinkofficial' }, musicStyle:'K-Pop/EDM/Pop', datePositions:['The Pop Dreamer'] },
            // ===== UK / GRIME =====
            { id:'c029', name:'Stormzy', realName:'Michael Ebenazer Kwadjo Omari Jr', emoji:'⚡', genre:'Grime/UK Hip-Hop', country:'UK', city:'London', followers:312000, verified:true, tier:'Star', bio:'Heavy Is the Head. Gang Signs & Prayer.', socialLinks:{ ig:'stormzy' }, musicStyle:'Grime/Hip-Hop/Gospel', datePositions:['The Hip-Hop Partner'] },
            { id:'c030', name:'Dave', realName:'David Orobosa Omoregie', emoji:'🃏', genre:'UK Hip-Hop', country:'UK', city:'London', followers:198000, verified:true, tier:'Star', bio:'Psychodrama. We\'re All Alone in This Together.', socialLinks:{ ig:'thedave' }, musicStyle:'UK Hip-Hop/Spoken Word', datePositions:['The Jazz Intellectual'] },
            { id:'c031', name:'Waka Flocka Flame', realName:'Juaquin James Malphurs', emoji:'🔥', genre:'Hip-Hop/Trap', country:'USA', city:'Atlanta', followers:8500000, verified:true, tier:'Legend', bio:'ATL trap pioneer. Flockaveli. HARD IN DA PAINT. No Hands. Brick Squad Monopoly. 57 ISRC-registered tracks. Collaborations with Gucci Mane, 2 Chainz, French Montana, Young Thug, T.I., Rocko, Slim Dunkin, Uncle Murda. Brick Squad Music LLC partner.', socialLinks:{ ig:'wakaflocka', twitter:'WakaFlocka' }, musicStyle:'Trap/Hip-Hop/Crunk/Southern Rap', datePositions:['The Trap Romantic','The GOAT Energy'], label:'Brick Squad Monopoly / 1017', isrcTracks:57, isrcPrefix:'QZ-9EM-17' },
        ];
    }

    _buildTrending() {
        this.trending = this.celebrities.sort((a,b) => b.followers - a.followers).slice(0,10).map(c => c.id);
    }

    getAllCelebrities() {
        return { success: true, celebrities: this.celebrities, total: this.celebrities.length };
    }

    getCelebrityById(id) {
        const celeb = this.celebrities.find(c => c.id === id);
        if (!celeb) return { success: false, error: 'Celebrity not found' };
        const fanCount = this.connections.get(id)?.size || Math.floor(Math.random() * 50000 + 1000);
        return { success: true, celebrity: { ...celeb, fanCount } };
    }

    searchCelebrities(query, filters = {}) {
        let results = this.celebrities;
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.genre.toLowerCase().includes(q) ||
                c.country.toLowerCase().includes(q) ||
                c.bio.toLowerCase().includes(q)
            );
        }
        if (filters.genre) results = results.filter(c => c.genre.toLowerCase().includes(filters.genre.toLowerCase()));
        if (filters.country) results = results.filter(c => c.country === filters.country);
        if (filters.tier) results = results.filter(c => c.tier === filters.tier);
        return { success: true, results, count: results.length };
    }

    getTrending() {
        return { success: true, trending: this.trending.map(id => this.celebrities.find(c => c.id === id)).filter(Boolean) };
    }

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
        const overallScore = Math.floor((genreScore * 0.4 + vibeScore * 0.35 + energyScore * 0.25));
        return {
            success: true, celebId, userId, scores: { genre: genreScore, vibe: vibeScore, energy: energyScore, overall: overallScore },
            explanation: `Your music taste aligns ${genreScore}% with ${celeb.name}'s ${celeb.genre} style.`,
            datePositions: celeb.datePositions
        };
    }

    getWorldMap() {
        const byCountry = {};
        this.celebrities.forEach(c => {
            if (!byCountry[c.country]) byCountry[c.country] = [];
            byCountry[c.country].push({ id: c.id, name: c.name, emoji: c.emoji, genre: c.genre, followers: c.followers });
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