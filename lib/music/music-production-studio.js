// © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
// GOAT Connect — Music Production Studio & Royalty Engine
// Full-Spectrum Music Industry Platform for Artists, Producers & DJs
'use strict';

class MusicProductionStudio {
    constructor() {
        this.stats = { beatsCreated: 0, royaltiesCalculated: 0, sessionsStarted: 0 };

        // ══════════════════════════════════════════════════════
        //  BEAT LIBRARY — Genre Kits & Sound Packs
        // ══════════════════════════════════════════════════════
        this.beatLibrary = [
            {
                id: 'trap_808',
                name: '808 Trap Essentials',
                genre: 'Trap',
                emoji: '🔊',
                bpm: { min: 130, max: 160, sweet: 140 },
                key: 'C Minor',
                elements: ['808 sub bass', 'hi-hat rolls', 'snare rolls', 'dark pads', 'trap horns', 'vocal chops'],
                producers: ['Metro Boomin', 'Southside', 'London On Da Track', 'Murda Beatz'],
                vibes: ['Dark', 'Aggressive', 'Hard-hitting', 'Street'],
                artists: ['Future', 'Young Thug', '21 Savage', 'Travis Scott'],
                tips: 'Layer your 808s with a clean sine sub. Use pitch bends on the 808 for melodic movement. Hi-hats should be triplet-based with velocity variations.',
                era: '2012–present'
            },
            {
                id: 'boom_bap',
                name: 'Golden Era Boom Bap',
                genre: 'Boom Bap',
                emoji: '🎤',
                bpm: { min: 85, max: 100, sweet: 92 },
                key: 'Eb Minor',
                elements: ['chopped soul samples', 'dusty drums', 'vinyl crackle', 'jazz piano', 'bass guitar', 'horn stabs'],
                producers: ['DJ Premier', 'Pete Rock', 'J Dilla', '9th Wonder', 'Madlib'],
                vibes: ['Nostalgic', 'Gritty', 'Soulful', 'Raw'],
                artists: ['Nas', 'Jay-Z', 'MF DOOM', 'Joey Bada$$'],
                tips: 'Sample from 60s-70s soul and jazz records. Chop on the transients. Use SP-404/MPC-style swing. Keep drums punchy with subtle compression.',
                era: '1986–present'
            },
            {
                id: 'rnb_modern',
                name: 'Modern R&B Vibes',
                genre: 'R&B',
                emoji: '💜',
                bpm: { min: 60, max: 90, sweet: 72 },
                key: 'Ab Major',
                elements: ['lush pads', 'smooth bass', 'reverbed vocals', 'rhodes keys', 'finger snaps', 'ambient textures'],
                producers: ['The Neptunes', 'Timbaland', 'Kaytranada', 'Frank Dukes'],
                vibes: ['Sensual', 'Smooth', 'Atmospheric', 'Intimate'],
                artists: ['The Weeknd', 'SZA', 'Frank Ocean', 'Daniel Caesar'],
                tips: 'Use wide stereo reverbs on pads. Keep the drums minimal but groove-heavy. Layer vocal harmonies in thirds. Sidechain compress the bass to the kick.',
                era: '2010–present'
            },
            {
                id: 'drill_uk',
                name: 'UK/NY Drill',
                genre: 'Drill',
                emoji: '🇬🇧',
                bpm: { min: 140, max: 145, sweet: 142 },
                key: 'F# Minor',
                elements: ['sliding 808s', 'UK drill hi-hats', 'orchestral hits', 'dark piano', 'reverse FX', 'eerie pads'],
                producers: ['808Melo', 'AXL Beats', 'Ghosty', 'ChopSquad DJ'],
                vibes: ['Menacing', 'Cold', 'Hypnotic', 'Relentless'],
                artists: ['Pop Smoke', 'Central Cee', 'Fivio Foreign', 'Headie One'],
                tips: 'The 808 slide is everything — use glide/portamento on the sub. Hi-hats need that bouncing triplet pattern. Use minor keys exclusively. Layer orchestral strings for drama.',
                era: '2017–present'
            },
            {
                id: 'afrobeats',
                name: 'Afrobeats & Amapiano',
                genre: 'Afrobeats',
                emoji: '🌍',
                bpm: { min: 100, max: 120, sweet: 110 },
                key: 'G Major',
                elements: ['log drums', 'shakers', 'talking drum', 'guitar loops', 'afro bass', 'vocal chants', 'percussive keys'],
                producers: ['Sarz', 'P2J', 'Kel-P', 'Spax'],
                vibes: ['Energetic', 'Joyful', 'Danceable', 'Warm'],
                artists: ['Burna Boy', 'Wizkid', 'Tems', 'Davido', 'Rema'],
                tips: 'The groove is in the percussion layers. Use shakers and log drums as the backbone. Guitar should be rhythmic, not melodic. Bass needs to be bouncy, not sustained.',
                era: '2016–present'
            },
            {
                id: 'lofi_hip_hop',
                name: 'Lo-Fi Hip Hop',
                genre: 'Lo-Fi',
                emoji: '🌧️',
                bpm: { min: 70, max: 90, sweet: 80 },
                key: 'D Minor',
                elements: ['vinyl noise', 'tape saturation', 'muted keys', 'jazz chords', 'ambient rain', 'warm bass', 'subtle sidechain'],
                producers: ['Nujabes', 'J Dilla', 'Knxwledge', 'Tomppabeats'],
                vibes: ['Chill', 'Nostalgic', 'Dreamy', 'Cozy'],
                artists: ['lofi girl', 'Joji', 'Mac Miller', 'Tom Misch'],
                tips: 'Bitcrush and tape saturate everything slightly. Use jazz 7th and 9th chords. Keep the mix lo-fi with gentle high-cut EQ. Sample old movies for dialogue.',
                era: '2013–present'
            },
            {
                id: 'reggaeton',
                name: 'Reggaeton & Latin Trap',
                genre: 'Reggaeton',
                emoji: '🔥',
                bpm: { min: 85, max: 100, sweet: 92 },
                key: 'A Minor',
                elements: ['dembow rhythm', 'reggaeton snare', 'latin bass', 'synth leads', 'vocal ad-libs', 'dancehall kicks'],
                producers: ['Tainy', 'Sky Rompiendo', 'Ovy On The Drums'],
                vibes: ['Party', 'Sexy', 'Rhythmic', 'Hypnotic'],
                artists: ['Bad Bunny', 'J Balvin', 'Daddy Yankee', 'Ozuna'],
                tips: 'The dembow pattern is the signature — kick-snare-kick-snare with that specific groove. Use Latin percussion (congas, bongos) for authenticity. Keep the bass tight and punchy.',
                era: '2004–present'
            },
            {
                id: 'hyperpop',
                name: 'Hyperpop & Digicore',
                genre: 'Hyperpop',
                emoji: '⚡',
                bpm: { min: 140, max: 180, sweet: 160 },
                key: 'E Major',
                elements: ['bitcrushed vocals', 'glitched drums', 'pitch-shifted leads', 'heavy distortion', 'nightcore FX', 'EDM drops'],
                producers: ['A.G. Cook', '100 gecs', 'Danny L Harle', 'Umru'],
                vibes: ['Chaotic', 'Euphoric', 'Experimental', 'Digital'],
                artists: ['charli xcx', '100 gecs', 'SOPHIE', 'Bladee'],
                tips: 'Stack vocals with extreme pitch shifting. Use glitch plugins on drums. Layer multiple distortion stages. Mix loud and compressed — clipping is a feature.',
                era: '2018–present'
            },
            {
                id: 'gospel_trap',
                name: 'Gospel Trap / Holy Fire',
                genre: 'Gospel Trap',
                emoji: '✝️',
                bpm: { min: 130, max: 150, sweet: 140 },
                key: 'Bb Major',
                elements: ['church organ', 'gospel choir', 'trap 808s', 'piano runs', 'tambourine', 'claps', 'cathedral reverb'],
                producers: ['Kanye West', 'Boi-1da', 'S1'],
                vibes: ['Uplifting', 'Powerful', 'Spiritual', 'Triumphant'],
                artists: ['Kanye West', 'Lecrae', 'Kirk Franklin', 'Chance the Rapper'],
                tips: 'Layer gospel choirs with massive reverb. Combine church organ with 808 bass for contrast. Use call-and-response vocal patterns. Build to big, arena-filling drops.',
                era: '2019–present'
            },
            {
                id: 'phonk',
                name: 'Memphis Phonk & Drift Phonk',
                genre: 'Phonk',
                emoji: '🏎️',
                bpm: { min: 130, max: 165, sweet: 145 },
                key: 'G Minor',
                elements: ['Memphis vocal samples', 'cowbell', 'distorted 808', 'chopped vocals', 'dark synths', 'aggressive hi-hats'],
                producers: ['DJ Smokey', 'Soudiere', 'MYTHIC', 'Kordhell'],
                vibes: ['Aggressive', 'Dark', 'High-energy', 'Cinematic'],
                artists: ['Freddie Dredd', 'Playaphonk', '$uicideboy$', 'Xavier Wulf'],
                tips: 'Sample old Memphis rap acapellas. Use heavy distortion on the 808. Cowbell is essential. Chop and screw vocal samples for that classic phonk feel.',
                era: '2015–present'
            }
        ];

        // ══════════════════════════════════════════════════════
        //  DAW DATABASE — Digital Audio Workstations
        // ══════════════════════════════════════════════════════
        this.dawDatabase = [
            {
                id: 'fl_studio',
                name: 'FL Studio 2024',
                icon: '🍊',
                company: 'Image-Line',
                price: '$99–$499 (lifetime free updates)',
                tier: 'Industry Standard (Beat-Making)',
                platforms: ['Windows', 'macOS'],
                bestFor: ['Beat production', 'Electronic music', 'Trap', 'Hip-hop'],
                features: ['Piano Roll (best in class)', 'Step Sequencer', 'Mixer with 125 tracks', 'Edison audio editor', 'Sytrus FM synth', 'Gross Beat (half-time/stutter)', 'Lifetime free updates', 'Flex synth engine', 'Patcher modular environment'],
                usedBy: ['Metro Boomin', 'Southside', 'Murda Beatz', 'Lex Luger', 'Martin Garrix', 'Avicii'],
                verdict: 'The undisputed king of beat-making. If you produce hip-hop, trap, or electronic, FL Studio is your weapon. Lifetime free updates = unbeatable value.',
                website: 'https://www.image-line.com'
            },
            {
                id: 'ableton',
                name: 'Ableton Live 12',
                icon: '⚫',
                company: 'Ableton AG',
                price: '$99–$749',
                tier: 'Industry Standard (Live Performance + Production)',
                platforms: ['Windows', 'macOS'],
                bestFor: ['Live performance', 'Electronic music', 'Sound design', 'DJing'],
                features: ['Session View (loop-based)', 'Arrangement View', 'Max for Live integration', 'Wavetable synth', 'Granulator III', 'Probability-based MIDI tools', 'Meld polysynth', 'Drift subtractive synth', 'Spectral effects suite'],
                usedBy: ['Skrillex', 'Flume', 'Deadmau5', 'Diplo', 'Kaytranada', 'ODESZA'],
                verdict: 'The creative playground. Session View revolutionized music production. Best for live performance, sound design, and experimental production.',
                website: 'https://www.ableton.com'
            },
            {
                id: 'logic_pro',
                name: 'Logic Pro 11',
                icon: '🍎',
                company: 'Apple Inc.',
                price: '$199.99 (one-time)',
                tier: 'Professional (Apple Ecosystem)',
                platforms: ['macOS', 'iPad'],
                bestFor: ['Full production', 'Mixing', 'Film scoring', 'Singer-songwriters'],
                features: ['Session Player (AI drummer/bassist/keyboardist)', 'Alchemy synth', 'Space Designer reverb', 'Mastering Assistant', 'ChromaGlow saturation', 'Dolby Atmos support', 'Stem Splitter', '100+ GB of sounds', 'Smart Tempo'],
                usedBy: ['Billie Eilish & FINNEAS', 'Calvin Harris', 'Kendrick Lamar (DAMN.)', 'Rihanna'],
                verdict: 'Incredible value for macOS users. $199 for a full professional DAW with AI tools. Session Player is a game-changer for solo producers.',
                website: 'https://www.apple.com/logic-pro'
            },
            {
                id: 'pro_tools',
                name: 'Pro Tools 2024',
                icon: '🎛️',
                company: 'Avid Technology',
                price: '$99/year – $599/year',
                tier: 'Industry Standard (Recording & Mixing)',
                platforms: ['Windows', 'macOS'],
                bestFor: ['Professional recording', 'Mixing', 'Mastering', 'Post-production'],
                features: ['HDX hardware integration', 'Advanced automation', 'Clip gain', 'Elastic Audio', 'Track Presets', 'ARA2 support', 'Dolby Atmos native', 'Edit Groups', 'VCA masters', 'Up to 2048 tracks'],
                usedBy: ['Dr. Dre', 'Pharrell', 'Chris Lord-Alge', 'Every major studio'],
                verdict: 'The industry recording standard. Every professional studio runs Pro Tools. Essential for engineering, mixing, and mastering at the highest level.',
                website: 'https://www.avid.com/pro-tools'
            },
            {
                id: 'studio_one',
                name: 'Studio One 6',
                icon: '🔵',
                company: 'PreSonus',
                price: '$99–$399',
                tier: 'Professional Alternative',
                platforms: ['Windows', 'macOS'],
                bestFor: ['All-in-one production', 'Mixing', 'Mastering', 'Live performance'],
                features: ['Drag-and-drop workflow', 'Integrated mastering suite', 'ARA2 Melodyne integration', 'Show Page (live performance)', 'Sphere plugin ecosystem', 'Smart Templates', 'Chord Track', 'Score View'],
                usedBy: ['Armin van Buuren', 'Rodney Jerkins', 'PreSonus ecosystem users'],
                verdict: 'The fastest workflow of any DAW. Drag-and-drop everything. Integrated mastering suite means you never leave the DAW. Underrated gem.',
                website: 'https://www.presonus.com/studio-one'
            },
            {
                id: 'reason',
                name: 'Reason 13',
                icon: '🔴',
                company: 'Reason Studios',
                price: '$499 / $19.99/mo',
                tier: 'Creative Sound Design',
                platforms: ['Windows', 'macOS'],
                bestFor: ['Sound design', 'Modular synthesis', 'Experimentation'],
                features: ['Virtual rack interface', 'Modular patching', 'Europa wavetable synth', 'Grain granular synth', 'Kong drum machine', 'Combinators', 'Works as VST in other DAWs'],
                usedBy: ['Deadmau5', 'Diplo', 'Electronic producers'],
                verdict: 'The modular synth playground. The virtual rack with real cable patching is unlike anything else. Now works as a VST inside other DAWs.',
                website: 'https://www.reasonstudios.com'
            }
        ];

        // ══════════════════════════════════════════════════════
        //  MUSIC THEORY ENGINE
        // ══════════════════════════════════════════════════════
        this.musicTheory = {
            scales: {
                major:       { intervals: [0,2,4,5,7,9,11], mood: 'Happy, Bright, Uplifting', use: 'Pop, Gospel, Country' },
                minor:       { intervals: [0,2,3,5,7,8,10], mood: 'Sad, Dark, Emotional', use: 'Hip-Hop, R&B, Film scores' },
                dorian:      { intervals: [0,2,3,5,7,9,10], mood: 'Jazzy, Sophisticated, Smooth', use: 'Jazz, Neo-Soul, Lo-fi' },
                mixolydian:  { intervals: [0,2,4,5,7,9,10], mood: 'Bluesy, Rock, Groovy', use: 'Blues, Rock, Funk' },
                pentatonic:  { intervals: [0,2,4,7,9],       mood: 'Universal, Simple, Catchy', use: 'Pop, Rock, World music' },
                blues:       { intervals: [0,3,5,6,7,10],    mood: 'Soulful, Gritty, Raw', use: 'Blues, Jazz, Soul' },
                harmonic_minor: { intervals: [0,2,3,5,7,8,11], mood: 'Exotic, Dramatic, Tense', use: 'Metal, Middle Eastern, Film' },
                phrygian:    { intervals: [0,1,3,5,7,8,10], mood: 'Dark, Spanish, Intense', use: 'Flamenco, Metal, Dark Trap' },
                lydian:      { intervals: [0,2,4,6,7,9,11], mood: 'Dreamy, Ethereal, Floating', use: 'Film scores, Ambient, Progressive' },
                chromatic:   { intervals: [0,1,2,3,4,5,6,7,8,9,10,11], mood: 'Tense, Dissonant, Experimental', use: 'Avant-garde, Transition FX' }
            },
            chordProgressions: [
                { id: 'pop_classic', name: 'The Pop Classic', numerals: 'I – V – vi – IV', mood: 'Universally pleasing', examples: ['Let It Be', 'No Woman No Cry', 'Someone Like You'], genres: ['Pop', 'Rock', 'Country'] },
                { id: 'trap_dark', name: 'Dark Trap Minor', numerals: 'i – VI – III – VII', mood: 'Dark, atmospheric', examples: ['Mask Off', 'XO Tour Llif3'], genres: ['Trap', 'Drill'] },
                { id: 'jazz_251', name: 'Jazz ii-V-I', numerals: 'ii7 – V7 – Imaj7', mood: 'Sophisticated, resolved', examples: ['Take the A Train', 'Autumn Leaves'], genres: ['Jazz', 'Neo-Soul', 'Lo-fi'] },
                { id: 'rnb_smooth', name: 'R&B Smooth', numerals: 'Imaj7 – IVmaj7 – vi7 – V7', mood: 'Warm, romantic', examples: ['Best Part', 'Adorn'], genres: ['R&B', 'Neo-Soul'] },
                { id: 'gospel_turnaround', name: 'Gospel Turnaround', numerals: 'IV – V – iii – vi – ii – V – I', mood: 'Uplifting, spiritual', examples: ['Sunday Service', 'Kirk Franklin'], genres: ['Gospel', 'Gospel Trap'] },
                { id: 'blues_12bar', name: '12-Bar Blues', numerals: 'I-I-I-I-IV-IV-I-I-V-IV-I-V', mood: 'Bluesy, soulful, raw', examples: ['Sweet Home Chicago', 'The Thrill Is Gone'], genres: ['Blues', 'Rock', 'Soul'] },
                { id: 'andalusian', name: 'Andalusian Cadence', numerals: 'i – VII – VI – V', mood: 'Spanish, dramatic, flamenco', examples: ['Hit the Road Jack', 'Happy Together'], genres: ['Latin', 'Flamenco', 'Rock'] },
                { id: 'lofi_chill', name: 'Lo-fi Chill', numerals: 'IVmaj9 – iii7 – vi9 – ii7', mood: 'Dreamy, nostalgic, rainy', examples: ['Nujabes beats', 'lofi girl streams'], genres: ['Lo-fi', 'Chillhop'] }
            ],
            noteNames: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        };

        // ══════════════════════════════════════════════════════
        //  ROYALTY & DISTRIBUTION
        // ══════════════════════════════════════════════════════
        this.royaltySplits = {
            performanceRoyalties: {
                description: 'Earned when a song is performed publicly (radio, live, streaming)',
                pro: [
                    { name: 'ASCAP', fullName: 'American Society of Composers, Authors and Publishers', split: 'Writer 50% / Publisher 50%', members: '920,000+', founded: 1914, website: 'https://www.ascap.com' },
                    { name: 'BMI', fullName: 'Broadcast Music Inc.', split: 'Writer 50% / Publisher 50%', members: '1,300,000+', founded: 1939, website: 'https://www.bmi.com' },
                    { name: 'SESAC', fullName: 'Society of European Stage Authors & Composers', split: 'Negotiated individually', members: '30,000+', founded: 1930, website: 'https://www.sesac.com' },
                    { name: 'GMR', fullName: 'Global Music Rights', split: 'Negotiated individually', members: 'Select catalog', founded: 2013, website: 'https://www.globalmusicrights.com' }
                ]
            },
            mechanicalRoyalties: {
                description: 'Earned when a song is reproduced (streams, downloads, physical copies)',
                rate: '$0.0913 per copy (2024 statutory rate)',
                streaming: '$0.003–$0.005 per stream average',
                collector: 'Harry Fox Agency (HFA) / Mechanical Licensing Collective (MLC)'
            },
            syncRoyalties: {
                description: 'Earned when music is used in film, TV, commercials, video games',
                range: '$1,000–$500,000+ per placement',
                factors: ['Song popularity', 'Duration of use', 'Type of media', 'Exclusivity', 'Territory'],
                agencies: ['Position Music', 'Musicbed', 'Artlist', 'Epidemic Sound']
            },
            masterRoyalties: {
                description: 'Earned by the owner of the master recording (label or independent artist)',
                typical: 'Label: 80–85% / Artist: 15–20% (traditional deal)',
                independent: 'Artist keeps 100% of master royalties',
                tips: 'Own your masters. Always. This is the #1 rule in the music business.'
            }
        };

        this.distributionPlatforms = [
            { id: 'distrokid', name: 'DistroKid', icon: '🟢', price: '$22.99/year', keepRoyalties: '100%', speed: '1-2 days', stores: 150, features: ['Unlimited uploads', 'HyperFollow pages', 'Spotify for Artists auto-claim', 'Splits', 'Teams'], bestFor: 'Prolific indie artists', website: 'https://distrokid.com' },
            { id: 'tunecore', name: 'TuneCore', icon: '🔵', price: '$9.99/single – $29.99/album/year', keepRoyalties: '100%', speed: '1-3 days', stores: 150, features: ['Publishing admin', 'YouTube monetization', 'Social media distribution', 'Detailed analytics'], bestFor: 'Artists wanting publishing services', website: 'https://www.tunecore.com' },
            { id: 'unitedmasters', name: 'UnitedMasters', icon: '🟡', price: 'Free (90%) or $5/mo (100%)', keepRoyalties: '90–100%', speed: '2-5 days', stores: 50, features: ['Brand deal marketplace', 'Select tier for top artists', 'Apple Music partnership', 'Spotify playlist pitching'], bestFor: 'Artists seeking brand partnerships', website: 'https://unitedmasters.com' },
            { id: 'awal', name: 'AWAL (Sony)', icon: '⚪', price: 'Application-based', keepRoyalties: '80-85%', speed: '2-4 weeks', stores: 200, features: ['A&R support', 'Marketing funding', 'Playlist pitching', 'Radio promotion', 'Sync licensing'], bestFor: 'Established indie artists seeking label support', website: 'https://www.awal.com' },
            { id: 'cdbaby', name: 'CD Baby', icon: '🟣', price: '$9.95/single – $29/album (one-time)', keepRoyalties: '91%', speed: '2-5 days', stores: 150, features: ['One-time fee', 'Publishing admin', 'Sync licensing', 'YouTube Content ID', 'Physical distribution'], bestFor: 'One-time fee model', website: 'https://cdbaby.com' },
            { id: 'stem', name: 'Stem', icon: '🟤', price: 'Free', keepRoyalties: '100% (minus 5% Stem fee)', speed: '2-3 days', stores: 50, features: ['Automatic split payments', 'Real-time analytics', 'Advance funding', 'Collaborative financial tools'], bestFor: 'Artists who need automatic split payments', website: 'https://stem.is' }
        ];

        // ══════════════════════════════════════════════════════
        //  STREAMING REVENUE ESTIMATOR
        // ══════════════════════════════════════════════════════
        this.streamingRates = [
            { platform: 'Spotify', icon: '🟢', payPerStream: 0.004, avgRange: '$0.003–$0.005', monthlyUsers: '626M', marketShare: '31%' },
            { platform: 'Apple Music', icon: '🍎', payPerStream: 0.008, avgRange: '$0.007–$0.010', monthlyUsers: '88M', marketShare: '15%' },
            { platform: 'Tidal', icon: '🌊', payPerStream: 0.013, avgRange: '$0.010–$0.015', monthlyUsers: '5M', marketShare: '1%' },
            { platform: 'Amazon Music', icon: '📦', payPerStream: 0.004, avgRange: '$0.003–$0.005', monthlyUsers: '82M', marketShare: '13%' },
            { platform: 'YouTube Music', icon: '▶️', payPerStream: 0.002, avgRange: '$0.001–$0.003', monthlyUsers: '80M', marketShare: '10%' },
            { platform: 'Deezer', icon: '💎', payPerStream: 0.004, avgRange: '$0.003–$0.005', monthlyUsers: '16M', marketShare: '2%' },
            { platform: 'Pandora', icon: '📻', payPerStream: 0.003, avgRange: '$0.002–$0.004', monthlyUsers: '50M', marketShare: '6%' },
            { platform: 'SoundCloud', icon: '🟠', payPerStream: 0.003, avgRange: '$0.002–$0.004', monthlyUsers: '76M', marketShare: '5%' }
        ];

        // ══════════════════════════════════════════════════════
        //  DJ EQUIPMENT DATABASE
        // ══════════════════════════════════════════════════════
        this.djEquipment = [
            {
                id: 'pioneer_cdj3000',
                name: 'Pioneer CDJ-3000',
                category: 'Media Player',
                icon: '🎛️',
                price: '$2,299',
                brand: 'Pioneer DJ',
                tier: 'Industry Standard',
                features: ['9" HD touchscreen', 'MPU for audio processing', '8 Hot Cues', 'Key Shift/Key Sync', 'Beat Jump', '96kHz/32-bit audio', 'Pro DJ Link', 'USB-C'],
                usedBy: ['Every major club/festival', 'Carl Cox', 'Tiësto', 'DJ Speedy'],
                verdict: 'The gold standard. If you walk into any club in the world, you will find CDJ-3000s. Period.'
            },
            {
                id: 'pioneer_djm_v10',
                name: 'Pioneer DJM-V10',
                category: 'Mixer',
                icon: '🔊',
                price: '$3,499',
                brand: 'Pioneer DJ',
                tier: 'Flagship',
                features: ['6-channel', '4-band EQ + filter', 'Send/Return FX', 'Compressor per channel', '96kHz/64-bit audio', 'Phono pre-amps', 'USB audio interface'],
                usedBy: ['Carl Cox', 'Richie Hawtin', 'Black Coffee'],
                verdict: 'The ultimate DJ mixer. 6 channels, pristine audio, and built-in send/return effects. The mixer that every top DJ wants in their rider.'
            },
            {
                id: 'technics_sl1200',
                name: 'Technics SL-1200MK7',
                category: 'Turntable',
                icon: '📀',
                price: '$1,099',
                brand: 'Technics (Panasonic)',
                tier: 'Legendary',
                features: ['Direct drive motor', 'S-shaped tonearm', 'Reverse play', 'Pitch adjustment ±8/16%', 'Die-cast aluminum body', 'Vibration dampening'],
                usedBy: ['DJ Premier', 'Q-Bert', 'Jazzy Jeff', 'DJ Speedy'],
                verdict: 'The most iconic turntable ever made. The foundation of hip-hop DJing since 1972. If you scratch, you need Technics.'
            },
            {
                id: 'ni_traktor_s4',
                name: 'Native Instruments Traktor S4 MK3',
                category: 'Controller',
                icon: '🎮',
                price: '$799',
                brand: 'Native Instruments',
                tier: 'Professional Controller',
                features: ['Motorized jog wheels', 'Stems control', 'Haptic feedback', 'Color displays', '4-channel mixer', 'Loop/Remix decks', 'Traktor Pro included'],
                usedBy: ['Richie Hawtin', 'Digital DJs', 'Club performers'],
                verdict: 'The most advanced controller with motorized platters that feel like CDJs. Stems support lets you isolate vocals/drums/bass/melody in real-time.'
            },
            {
                id: 'rane_twelve',
                name: 'Rane TWELVE MKII',
                category: 'Motorized Controller',
                icon: '⚫',
                price: '$1,099',
                brand: 'Rane (inMusic)',
                tier: 'Battle DJ Standard',
                features: ['12" motorized platter', 'True vinyl feel', 'Works with any software', 'MIDI mappable', 'Real torque control', 'Tension adjustment'],
                usedBy: ['Scratch DJs', 'Battle DJs', 'Turntablists'],
                verdict: 'A motorized controller that feels like a real turntable. Perfect for scratch DJs who want vinyl feel with digital convenience.'
            },
            {
                id: 'akai_mpc_live',
                name: 'Akai MPC Live II',
                category: 'Sampler/Groovebox',
                icon: '🟥',
                price: '$1,199',
                brand: 'Akai Professional',
                tier: 'Beat Production Standard',
                features: ['Standalone (no computer needed)', '7" touchscreen', '16 velocity-sensitive pads', 'Built-in speakers', 'Battery powered', 'MPC 2.0 software', '10GB+ sounds', 'MIDI/CV out'],
                usedBy: ['J Dilla', 'DJ Premier', 'Araab Muzik', 'Hit-Boy'],
                verdict: 'The MPC is hip-hop. From J Dilla to Metro Boomin, the MPC pad workflow created an entire genre. The Live II does it all standalone.'
            }
        ];

        // ══════════════════════════════════════════════════════
        //  GRAMMY HISTORY — Best Rap Album / Record of Year
        // ══════════════════════════════════════════════════════
        this.grammyHistory = [
            { year: 2024, rapAlbum: { title: 'A Few Good Things', artist: 'Killer Mike', label: 'Loma Vista' }, recordOfYear: { title: 'Flowers', artist: 'Miley Cyrus' }, songOfYear: { title: 'Flowers', writer: 'Miley Cyrus' } },
            { year: 2023, rapAlbum: { title: 'Mr. Morale & The Big Steppers', artist: 'Kendrick Lamar', label: 'pgLang/Interscope' }, recordOfYear: { title: 'About Damn Time', artist: 'Lizzo' }, songOfYear: { title: 'Just Like That', writer: 'Bonnie Raitt' } },
            { year: 2022, rapAlbum: { title: "Call Me If You Get Lost", artist: 'Tyler, the Creator', label: 'Columbia' }, recordOfYear: { title: 'Leave The Door Open', artist: 'Silk Sonic' }, songOfYear: { title: 'Leave The Door Open', writer: 'Silk Sonic' } },
            { year: 2021, rapAlbum: { title: "King's Disease", artist: 'Nas', label: 'Mass Appeal' }, recordOfYear: { title: 'Everything I Wanted', artist: 'Billie Eilish' }, songOfYear: { title: 'I Can\'t Breathe', writer: 'Dernst Emile II, H.E.R., Tiara Thomas' } },
            { year: 2020, rapAlbum: { title: 'IGOR', artist: 'Tyler, the Creator', label: 'Columbia' }, recordOfYear: { title: 'Bad Guy', artist: 'Billie Eilish' }, songOfYear: { title: 'Bad Guy', writer: 'Billie Eilish & FINNEAS' } },
            { year: 2019, rapAlbum: { title: 'Invasion of Privacy', artist: 'Cardi B', label: 'Atlantic' }, recordOfYear: { title: 'This Is America', artist: 'Childish Gambino' }, songOfYear: { title: 'This Is America', writer: 'Donald Glover & Ludwig Göransson' } },
            { year: 2018, rapAlbum: { title: 'DAMN.', artist: 'Kendrick Lamar', label: 'TDE/Interscope' }, recordOfYear: { title: '24K Magic', artist: 'Bruno Mars' }, songOfYear: { title: 'That\'s What I Like', writer: 'Bruno Mars et al.' } },
            { year: 2017, rapAlbum: { title: 'Coloring Book', artist: 'Chance the Rapper', label: 'Independent' }, recordOfYear: { title: 'Hello', artist: 'Adele' }, songOfYear: { title: 'Hello', writer: 'Adele & Greg Kurstin' } },
            { year: 2016, rapAlbum: { title: 'To Pimp a Butterfly', artist: 'Kendrick Lamar', label: 'TDE/Interscope' }, recordOfYear: { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' }, songOfYear: { title: 'Thinking Out Loud', writer: 'Ed Sheeran' } },
            { year: 2015, rapAlbum: { title: 'The Marshall Mathers LP 2', artist: 'Eminem', label: 'Aftermath/Interscope' }, recordOfYear: { title: 'Stay With Me', artist: 'Sam Smith' }, songOfYear: { title: 'Stay With Me', writer: 'Sam Smith' } }
        ];

        // ══════════════════════════════════════════════════════
        //  MUSIC INDUSTRY CONTACTS / A&R DATABASE
        // ══════════════════════════════════════════════════════
        this.industryContacts = {
            majorLabels: [
                { name: 'Universal Music Group', emoji: '🌐', sublabels: ['Interscope', 'Republic', 'Def Jam', 'Capitol', 'Motown', 'Cash Money'], marketShare: '32%', ceo: 'Lucian Grainge' },
                { name: 'Sony Music Entertainment', emoji: '🎵', sublabels: ['Columbia', 'RCA', 'Epic', 'Arista', 'Legacy'], marketShare: '22%', ceo: 'Rob Stringer' },
                { name: 'Warner Music Group', emoji: '🎶', sublabels: ['Atlantic', 'Warner Records', 'Elektra', 'Parlophone', '300 Entertainment'], marketShare: '16%', ceo: 'Robert Kyncl' }
            ],
            indieLabels: [
                { name: 'Quality Control Music', emoji: '🔥', artists: ['Migos', 'Lil Baby', 'Lil Yachty', 'City Girls'], genre: 'Hip-Hop/Trap' },
                { name: 'Top Dawg Entertainment', emoji: '👑', artists: ['Kendrick Lamar', 'SZA', 'ScHoolboy Q', 'Ab-Soul'], genre: 'Hip-Hop/R&B' },
                { name: 'Dreamville Records', emoji: '🌙', artists: ['J. Cole', 'JID', 'Bas', 'EarthGang', 'Ari Lennox'], genre: 'Hip-Hop' },
                { name: 'Griselda Records', emoji: '🦂', artists: ['Westside Gunn', 'Conway the Machine', 'Benny the Butcher'], genre: 'Boom Bap/Hardcore' },
                { name: 'GOOD Music', emoji: '🐻', artists: ['Kanye West', 'Pusha T', 'Teyana Taylor'], genre: 'Hip-Hop' },
                { name: 'GOAT Royalty Entertainment', emoji: '🐐', artists: ['DJ Speedy', 'GOAT Connect Artists'], genre: 'All Genres', note: '👑 YOUR LABEL — Building the empire' }
            ],
            syncAgencies: [
                { name: 'Position Music', specialty: 'Film & TV sync', notable: 'Marvel, Netflix, HBO' },
                { name: 'Musicbed', specialty: 'Commercial & brand sync', notable: 'Nike, Apple, Samsung' },
                { name: 'Artlist', specialty: 'Content creator licensing', notable: 'YouTube, social media' },
                { name: 'Epidemic Sound', specialty: 'Subscription sync licensing', notable: 'Podcast, streaming' }
            ]
        };

        // ══════════════════════════════════════════════════════
        //  SAMPLE CLEARANCE & LICENSING
        // ══════════════════════════════════════════════════════
        this.sampleClearance = {
            process: [
                { step: 1, name: 'Identify the Sample', description: 'Document the original song, artist, writers, and publishers. Use WhoSampled.com for research.' },
                { step: 2, name: 'Contact Publishers', description: 'Reach out to the publishing company that controls the composition rights.' },
                { step: 3, name: 'Contact Master Owner', description: 'Contact the record label that owns the master recording.' },
                { step: 4, name: 'Negotiate Terms', description: 'Terms vary: flat fee ($1K–$100K+), royalty percentage (15–50%), or combination.' },
                { step: 5, name: 'Get Written Clearance', description: 'Must have signed clearance BEFORE release. No handshake deals.' },
                { step: 6, name: 'Register Properly', description: 'Update song registration with PRO/MLC to reflect sample credits and splits.' }
            ],
            famousCases: [
                { song: 'Ice Ice Baby', artist: 'Vanilla Ice', sampled: 'Under Pressure (Queen & Bowie)', result: 'Settled — Queen/Bowie given songwriting credit and royalties', cost: '$4M+', lesson: 'Always clear your samples before release.' },
                { song: 'Bitter Sweet Symphony', artist: 'The Verve', sampled: 'The Last Time (Rolling Stones)', result: 'Lost 100% of royalties to ABKCO Music (Stones publisher)', cost: '100% royalties', lesson: 'Negotiate limits on sample use BEFORE agreeing to terms.' },
                { song: 'Old Town Road', artist: 'Lil Nas X', sampled: 'Nine Inch Nails beat', result: 'Properly cleared — NIN\'s Trent Reznor & Atticus Ross got co-writing credit', cost: 'Co-writing credit', lesson: 'Clear samples properly and everyone wins.' }
            ],
            resources: [
                { name: 'WhoSampled.com', use: 'Identify samples in songs' },
                { name: 'Harry Fox Agency', use: 'Mechanical license clearance' },
                { name: 'ASCAP ACE', use: 'Search song registrations' },
                { name: 'BMI Repertoire', use: 'Search BMI song catalog' }
            ]
        };

        console.log('🎵 Music Production Studio loaded: ' + this.beatLibrary.length + ' genre kits, ' + this.dawDatabase.length + ' DAWs');
    }

    // ═══════════════════════════════════════════════════════
    //  REVENUE CALCULATOR
    // ═══════════════════════════════════════════════════════
    calculateStreamingRevenue(streams) {
        this.stats.royaltiesCalculated++;
        return {
            success: true,
            streams: streams,
            breakdown: this.streamingRates.map(p => ({
                platform: p.platform,
                icon: p.icon,
                estimated: `$${(streams * p.payPerStream).toFixed(2)}`,
                perStream: p.avgRange
            })),
            total: {
                low: `$${(streams * 0.003).toFixed(2)}`,
                average: `$${(streams * 0.005).toFixed(2)}`,
                high: `$${(streams * 0.010).toFixed(2)}`
            },
            milestones: [
                { streams: 1000, revenue: '$3–$10', status: streams >= 1000 ? '✅' : '⏳' },
                { streams: 10000, revenue: '$30–$100', status: streams >= 10000 ? '✅' : '⏳' },
                { streams: 100000, revenue: '$300–$1,000', status: streams >= 100000 ? '✅' : '⏳' },
                { streams: 1000000, revenue: '$3,000–$10,000', status: streams >= 1000000 ? '✅' : '⏳' },
                { streams: 10000000, revenue: '$30,000–$100,000', status: streams >= 10000000 ? '✅' : '⏳' },
                { streams: 100000000, revenue: '$300,000–$1,000,000', status: streams >= 100000000 ? '✅' : '⏳' },
                { streams: 1000000000, revenue: '$3M–$10M', status: streams >= 1000000000 ? '✅' : '⏳' }
            ]
        };
    }

    // ═══════════════════════════════════════════════════════
    //  ROYALTY SPLIT CALCULATOR
    // ═══════════════════════════════════════════════════════
    calculateRoyaltySplit(totalRevenue, splits) {
        this.stats.royaltiesCalculated++;
        const result = splits.map(s => ({
            name: s.name,
            role: s.role,
            percentage: s.percentage,
            amount: `$${(totalRevenue * s.percentage / 100).toFixed(2)}`
        }));
        const totalPct = splits.reduce((sum, s) => sum + s.percentage, 0);
        return {
            success: true,
            totalRevenue: `$${totalRevenue.toFixed(2)}`,
            splits: result,
            totalPercentage: totalPct,
            valid: Math.abs(totalPct - 100) < 0.01,
            warning: Math.abs(totalPct - 100) >= 0.01 ? `Splits total ${totalPct}%, should be 100%` : null
        };
    }

    // ═══════════════════════════════════════════════════════
    //  BPM TAP CALCULATOR
    // ═══════════════════════════════════════════════════════
    calculateBPM(tapTimestamps) {
        if (tapTimestamps.length < 2) return { success: false, error: 'Need at least 2 taps' };
        const intervals = [];
        for (let i = 1; i < tapTimestamps.length; i++) {
            intervals.push(tapTimestamps[i] - tapTimestamps[i-1]);
        }
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const bpm = Math.round(60000 / avgInterval);
        return {
            success: true,
            bpm: bpm,
            confidence: tapTimestamps.length >= 8 ? 'High' : tapTimestamps.length >= 4 ? 'Medium' : 'Low',
            suggestedGenres: this.beatLibrary.filter(b => bpm >= b.bpm.min && bpm <= b.bpm.max).map(b => b.genre)
        };
    }

    // ═══════════════════════════════════════════════════════
    //  AI BEAT GENERATOR
    // ═══════════════════════════════════════════════════════
    async generateBeat(options = {}) {
        this.stats.beatsCreated++;
        const { genre, mood, bpm, key } = options;
        const kit = this.beatLibrary.find(b => b.id === genre || b.genre.toLowerCase() === (genre || '').toLowerCase()) || this.beatLibrary[0];
        const selectedBpm = bpm || kit.bpm.sweet;
        const selectedKey = key || kit.key;
        const progression = this.musicTheory.chordProgressions.find(p =>
            p.genres.some(g => g.toLowerCase().includes(kit.genre.toLowerCase()))
        ) || this.musicTheory.chordProgressions[0];

        return {
            success: true,
            beat: {
                title: `${kit.genre} Beat — ${selectedBpm} BPM`,
                genre: kit.genre,
                bpm: selectedBpm,
                key: selectedKey,
                timeSignature: '4/4',
                bars: 64,
                sections: [
                    { name: 'Intro', bars: 4, elements: ['Ambient pad', 'Soft hi-hat'] },
                    { name: 'Verse 1', bars: 16, elements: kit.elements.slice(0, 4) },
                    { name: 'Hook/Chorus', bars: 8, elements: kit.elements },
                    { name: 'Verse 2', bars: 16, elements: kit.elements.slice(0, 5) },
                    { name: 'Hook/Chorus', bars: 8, elements: kit.elements },
                    { name: 'Bridge', bars: 4, elements: ['Stripped arrangement', 'Vocal chops'] },
                    { name: 'Final Chorus', bars: 8, elements: [...kit.elements, 'Ad-libs', 'Double-time hi-hats'] }
                ],
                chordProgression: progression.numerals,
                mixTips: kit.tips,
                referenceTracks: kit.artists.map(a => `${a} — [reference track]`),
                recommendedDAW: this.dawDatabase.find(d => d.bestFor.some(b => b.toLowerCase().includes('beat') || b.toLowerCase().includes('hip')))?.name || 'FL Studio 2024',
                recommendedKit: kit.name
            },
            producerInspo: kit.producers,
            timestamp: new Date().toISOString()
        };
    }

    // ═══════════════════════════════════════════════════════
    //  PUBLIC API METHODS
    // ═══════════════════════════════════════════════════════
    getBeats(filters = {}) {
        let beats = this.beatLibrary;
        if (filters.genre) beats = beats.filter(b => b.genre.toLowerCase().includes(filters.genre.toLowerCase()));
        if (filters.mood) beats = beats.filter(b => b.vibes.some(v => v.toLowerCase().includes(filters.mood.toLowerCase())));
        if (filters.bpm) {
            const bpm = parseInt(filters.bpm);
            beats = beats.filter(b => bpm >= b.bpm.min && bpm <= b.bpm.max);
        }
        return { success: true, beats, total: beats.length };
    }

    getBeatById(id) {
        const beat = this.beatLibrary.find(b => b.id === id);
        return beat ? { success: true, beat } : { success: false, error: 'Beat kit not found' };
    }

    getDAWs() {
        return { success: true, daws: this.dawDatabase, total: this.dawDatabase.length };
    }

    getTheory() {
        return { success: true, theory: this.musicTheory };
    }

    getRoyaltyInfo() {
        return { success: true, royalties: this.royaltySplits };
    }

    getDistribution() {
        return { success: true, platforms: this.distributionPlatforms, total: this.distributionPlatforms.length };
    }

    getStreamingRates() {
        return { success: true, rates: this.streamingRates };
    }

    getEquipment() {
        return { success: true, equipment: this.djEquipment, total: this.djEquipment.length };
    }

    getGrammys() {
        return { success: true, history: this.grammyHistory };
    }

    getIndustry() {
        return { success: true, industry: this.industryContacts };
    }

    getSampleClearance() {
        return { success: true, clearance: this.sampleClearance };
    }

    getStats() {
        return {
            success: true,
            genreKits: this.beatLibrary.length,
            daws: this.dawDatabase.length,
            equipment: this.djEquipment.length,
            distributors: this.distributionPlatforms.length,
            streamingPlatforms: this.streamingRates.length,
            grammyYears: this.grammyHistory.length,
            beatsCreated: this.stats.beatsCreated,
            royaltiesCalculated: this.stats.royaltiesCalculated
        };
    }
}

module.exports = new MusicProductionStudio();