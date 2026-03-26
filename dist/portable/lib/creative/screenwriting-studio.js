// © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
// GOAT Connect — Movie & TV Script Writing Studio
// Industry-Standard Screenwriting Engine with AI-Powered Story Development
'use strict';

class ScreenwritingStudio {
    constructor() {
        this.legendaryWriters = this._buildWritersDatabase();
        this.scriptFormats = this._buildScriptFormats();
        this.storyTemplates = this._buildStoryTemplates();
        this.softwareDatabase = this._buildSoftwareDatabase();
        this.genreDatabase = this._buildGenreDatabase();
        this.oscarHistory = this._buildOscarHistory();
        this.stats = { scriptsGenerated: 0, outlinesCreated: 0, charactersBuilt: 0 };
        console.log(`✍️  Screenwriting Studio loaded: ${this.legendaryWriters.length} legendary writers`);
    }

    // ═══════════════════════════════════════════════════
    //  LEGENDARY WRITERS DATABASE (1900–2026)
    // ═══════════════════════════════════════════════════
    _buildWritersDatabase() {
        return [
            // === TOP 25 GREATEST SCREENWRITERS OF ALL TIME ===
            {
                id: 'sw001', rank: 1, name: 'Billy Wilder', era: 'Golden Age', years: '1934–1981',
                country: 'Austria/USA', emoji: '🎬', born: 1906, died: 2002,
                notableScripts: ['Double Indemnity (1944)', 'Sunset Boulevard (1950)', 'Some Like It Hot (1959)', 'The Apartment (1960)'],
                oscars: { wins: 3, nominations: 12 }, genres: ['Noir', 'Comedy', 'Drama'],
                quote: '"Audience is never wrong. Individual members might be imbeciles, but a thousand imbeciles together — that is critical genius."',
                bio: 'The undisputed #1 screenwriter of all time. Austrian-born master of cynicism and wit who defined the Golden Age of Hollywood.',
                legacy: 'Set the standard for mixing poetry with pulp, elegance with vulgarity. Every screenwriter since owes him a debt.'
            },
            {
                id: 'sw002', rank: 2, name: 'Ethan & Joel Coen', era: 'Modern', years: '1984–present',
                country: 'USA', emoji: '🎭', born: 1957,
                notableScripts: ['Fargo (1996)', 'The Big Lebowski (1998)', 'No Country for Old Men (2007)', 'True Grit (2010)'],
                oscars: { wins: 4, nominations: 7 }, genres: ['Crime', 'Dark Comedy', 'Western'],
                quote: '"We don\'t deny we\'re Jewish, and we have a lot of Jewish characters, but I don\'t think there\'s a unifying Judaism in our work."',
                bio: 'Brothers who created some of the most quotable films in history. Masters of dark irony and American middle-class satire.',
                legacy: '"Comedy is tragedy plus time" — their work transforms over the years, getting funnier and deeper.'
            },
            {
                id: 'sw003', rank: 3, name: 'Robert Towne', era: 'New Hollywood', years: '1965–2006',
                country: 'USA', emoji: '🕵️', born: 1934, died: 2024,
                notableScripts: ['Chinatown (1974)', 'Shampoo (1975)', 'The Godfather (uncredited)', 'Bonnie and Clyde (uncredited)'],
                oscars: { wins: 1, nominations: 4 }, genres: ['Neo-Noir', 'Drama', 'Political'],
                quote: '"The script is what you\'ve heard about — it\'s just not what the movie is about."',
                bio: 'The greatest script doctor in history. His uncredited work on The Godfather is legendary.',
                legacy: 'Buried studio film clichés, unleashed a generation of raw acting talent, and wrote dialogue that left "a sense of moisture on the page."'
            },
            {
                id: 'sw004', rank: 4, name: 'Quentin Tarantino', era: 'Modern', years: '1992–present',
                country: 'USA', emoji: '🔫', born: 1963,
                notableScripts: ['Reservoir Dogs (1992)', 'Pulp Fiction (1994)', 'Kill Bill Vol. 1 (2003)', 'Inglourious Basterds (2009)', 'Django Unchained (2012)'],
                oscars: { wins: 2, nominations: 3 }, genres: ['Crime', 'Action', 'Western'],
                quote: '"If you just love movies enough, you can make a good one."',
                bio: 'Revolutionized screenwriting with non-linear narratives, pop-culture dialogue, and genre-bending mastery.',
                legacy: 'Showed that being derivative isn\'t a crutch — how we weave influences together is where the magic lies.'
            },
            {
                id: 'sw005', rank: 5, name: 'Francis Ford Coppola', era: 'New Hollywood', years: '1963–present',
                country: 'USA', emoji: '🎖️', born: 1939,
                notableScripts: ['Patton (1970)', 'The Godfather (1972)', 'The Conversation (1974)', 'Apocalypse Now (1979)'],
                oscars: { wins: 3, nominations: 5 }, genres: ['Drama', 'War', 'Crime'],
                quote: '"I don\'t think there\'s any artist of any value who doesn\'t doubt what they\'re doing."',
                bio: 'His hot streak — Godfather, Conversation, Godfather II, Apocalypse Now — is the GOAT run in cinema history.',
                legacy: 'His Godfather Notebooks show insights into telling stories using the language of cinema that are jaw-dropping.'
            },
            {
                id: 'sw006', rank: 6, name: 'William Goldman', era: 'Modern Classic', years: '1965–2003',
                country: 'USA', emoji: '📖', born: 1931, died: 2018,
                notableScripts: ['Butch Cassidy and the Sundance Kid (1969)', 'All the President\'s Men (1976)', 'The Princess Bride (1987)', 'Misery (1990)'],
                oscars: { wins: 2, nominations: 2 }, genres: ['Adventure', 'Thriller', 'Fantasy'],
                quote: '"Nobody knows anything." — Adventures in the Screen Trade',
                bio: 'Literally wrote the book on Hollywood screenwriting. Twice. Master of pithy phrases and crowd-pleasing drama.',
                legacy: 'Created iconic lines: "Is it safe?", "Follow the money", "My name is Inigo Montoya, you killed my father, prepare to die."'
            },
            {
                id: 'sw007', rank: 7, name: 'Charlie Kaufman', era: 'Modern', years: '1999–present',
                country: 'USA', emoji: '🧠', born: 1958,
                notableScripts: ['Being John Malkovich (1999)', 'Adaptation (2002)', 'Eternal Sunshine of the Spotless Mind (2004)', 'Synecdoche, New York (2008)'],
                oscars: { wins: 1, nominations: 3 }, genres: ['Surrealist', 'Drama', 'Comedy'],
                quote: '"Constantly talking isn\'t necessarily communicating."',
                bio: 'The most original mind in modern screenwriting. Bakes existential crisis into scripts at the structural level.',
                legacy: 'Opened up possibilities for what a Hollywood film could do. Made himself the hero of his own adaptation.'
            },
            {
                id: 'sw008', rank: 8, name: 'Woody Allen', era: 'Modern Classic', years: '1965–present',
                country: 'USA', emoji: '🎷', born: 1935,
                notableScripts: ['Annie Hall (1977)', 'Manhattan (1979)', 'Midnight in Paris (2011)', 'Blue Jasmine (2013)'],
                oscars: { wins: 3, nominations: 16 }, genres: ['Comedy', 'Romance', 'Drama'],
                quote: '"Eighty percent of success is showing up."',
                bio: 'Most prolific screenwriter in history with nearly 50 films. Physical representation of "a writer writes."',
                legacy: '"If Annie Hall were his only film, he\'d still be on this list." — 16 Oscar nominations for screenwriting alone.'
            },
            {
                id: 'sw009', rank: 9, name: 'Nora Ephron', era: 'Modern Classic', years: '1983–2012',
                country: 'USA', emoji: '💕', born: 1941, died: 2012,
                notableScripts: ['Silkwood (1983)', 'When Harry Met Sally... (1989)', 'Sleepless in Seattle (1993)', 'You\'ve Got Mail (1998)'],
                oscars: { wins: 0, nominations: 3 }, genres: ['Romantic Comedy', 'Drama'],
                quote: '"Be the heroine of your life, not the victim."',
                bio: 'Created the modern romantic comedy genre with When Harry Met Sally... Her heroines were as witty and screwed-up as their male counterparts.',
                legacy: 'Smarter, funnier, and a little bit naughtier than women of her generation were allowed to be.'
            },
            {
                id: 'sw010', rank: 10, name: 'Aaron Sorkin', era: 'Modern', years: '1989–present',
                country: 'USA', emoji: '⚡', born: 1961,
                notableScripts: ['A Few Good Men (1992)', 'The Social Network (2010)', 'Moneyball (2011)', 'Steve Jobs (2015)', 'The West Wing (TV)'],
                oscars: { wins: 1, nominations: 2 }, genres: ['Drama', 'Political', 'Biopic'],
                quote: '"You can\'t handle the truth!"',
                bio: 'Master of blazingly-paced ping-pong dialogue. Packs 190 pages into 2-hour running times.',
                legacy: '"Sorkin-esque" is an adjective anyone film-literate would immediately understand. That alone earns him all-timer status.'
            },
            {
                id: 'sw011', rank: 11, name: 'Spike Lee', era: 'Modern', years: '1986–present',
                country: 'USA', emoji: '✊🏿', born: 1957,
                notableScripts: ['Do the Right Thing (1989)', 'Malcolm X (1992)', 'Jungle Fever (1991)', '25th Hour (2002)', 'BlacKkKlansman (2018)'],
                oscars: { wins: 1, nominations: 2 }, genres: ['Drama', 'Social Commentary'],
                quote: '"Do the right thing."',
                bio: 'The face of the powerful Black film movement. Do the Right Thing was the centerpiece of a future president\'s first date with his wife.',
                legacy: 'Few filmmakers have done more to change their industry simply by never compromising.'
            },
            {
                id: 'sw012', rank: 12, name: 'Oliver Stone', era: 'Modern Classic', years: '1978–present',
                country: 'USA', emoji: '🎗️', born: 1946,
                notableScripts: ['Scarface (1983)', 'Platoon (1986)', 'JFK (1991)', 'Natural Born Killers (1994)', 'Born on the Fourth of July (1989)'],
                oscars: { wins: 1, nominations: 5 }, genres: ['War', 'Political', 'Crime'],
                quote: '"I do believe that movies can change the world."',
                bio: 'Vietnam vet turned filmmaker. His passion and relentless desire for justice resulted in breathtaking scripts.',
                legacy: 'A writer-director whose scripts are legendary even when he doesn\'t direct them.'
            },
            {
                id: 'sw013', rank: 13, name: 'Paddy Chayefsky', era: 'Classic', years: '1955–1981',
                country: 'USA', emoji: '📺', born: 1923, died: 1981,
                notableScripts: ['Marty (1955)', 'Network (1976)', 'The Hospital (1971)'],
                oscars: { wins: 3, nominations: 4 }, genres: ['Drama', 'Satire'],
                quote: '"I\'m as mad as hell, and I\'m not going to take this anymore!"',
                bio: 'The only screenwriter to win 3 Academy Awards for screenplay. Network predicted cultural entropy that allows despots to thrive.',
                legacy: 'All idealistic writers start out wanting to be Paddy Chayefsky.'
            },
            {
                id: 'sw014', rank: 14, name: 'Paul Thomas Anderson', era: 'Modern', years: '1996–present',
                country: 'USA', emoji: '🎪', born: 1970,
                notableScripts: ['Boogie Nights (1997)', 'Magnolia (1999)', 'There Will Be Blood (2007)', 'Phantom Thread (2017)'],
                oscars: { wins: 0, nominations: 4 }, genres: ['Drama', 'Epic'],
                quote: '"I drink your milkshake!"',
                bio: 'Altman-PTA became Kubrick-PTA. Had America quoting an austere drama about corporate sins like it was Borat.',
                legacy: 'His writing is brilliant and eclectic. Punch-Drunk Love is one of the greatest films of all time.'
            },
            {
                id: 'sw015', rank: 15, name: 'Jordan Peele', era: 'Contemporary', years: '2017–present',
                country: 'USA', emoji: '🔑', born: 1979,
                notableScripts: ['Get Out (2017)', 'Us (2019)', 'Nope (2022)'],
                oscars: { wins: 1, nominations: 1 }, genres: ['Horror', 'Social Thriller'],
                quote: '"The best monster is a human."',
                bio: 'Transformed horror into social commentary. Get Out redefined the genre for a new generation.',
                legacy: 'Proved horror can be art, commentary, and blockbuster entertainment simultaneously.'
            },
            {
                id: 'sw016', rank: 16, name: 'Callie Khouri', era: 'Modern', years: '1991–present',
                country: 'USA', emoji: '🚗', born: 1957,
                notableScripts: ['Thelma & Louise (1991)', 'Something to Talk About (1995)', 'Nashville (TV)'],
                oscars: { wins: 1, nominations: 1 }, genres: ['Drama', 'Feminist'],
                quote: '"I just wanted women to have an adventure."',
                bio: 'Broke cardinal rules — wrote a Western with female protagonists where men hold zero power.',
                legacy: 'Changed the culture, redefined feminism, allowed a generation of girls to own the outlaw trope.'
            },
            {
                id: 'sw017', rank: 17, name: 'Stanley Kubrick', era: 'Classic–Modern', years: '1953–1999',
                country: 'USA', emoji: '👁️', born: 1928, died: 1999,
                notableScripts: ['2001: A Space Odyssey (1968)', 'A Clockwork Orange (1971)', 'The Shining (1980)', 'Full Metal Jacket (1987)'],
                oscars: { wins: 0, nominations: 4 }, genres: ['Sci-Fi', 'Horror', 'War', 'Drama'],
                quote: '"A film is — or should be — more like music than like fiction."',
                bio: 'Meticulous adapter who preserved the spirit of source material without being enslaved by it.',
                legacy: 'The single most stunning body of work for any American filmmaker. Writing and directing are inseparable.'
            },
            {
                id: 'sw018', rank: 18, name: 'Akira Kurosawa', era: 'Classic', years: '1943–1993',
                country: 'Japan', emoji: '⚔️', born: 1910, died: 1998,
                notableScripts: ['Rashomon (1950)', 'Seven Samurai (1954)', 'Yojimbo (1961)', 'Ran (1985)'],
                oscars: { wins: 1, nominations: 2 }, genres: ['Samurai', 'Drama', 'Epic'],
                quote: '"In a mad world, only the mad are sane."',
                bio: 'Influenced the Western genre more than any American writer. Rashomon is still invoked for any multiple-perspective story.',
                legacy: 'Created the mold for crowd-pleasing mythmaking that resonates regardless of language or nationality.'
            },
            {
                id: 'sw019', rank: 19, name: 'Cameron Crowe', era: 'Modern', years: '1982–present',
                country: 'USA', emoji: '🎸', born: 1957,
                notableScripts: ['Say Anything (1989)', 'Jerry Maguire (1996)', 'Almost Famous (2000)'],
                oscars: { wins: 1, nominations: 2 }, genres: ['Comedy', 'Romance', 'Drama'],
                quote: '"You had me at hello."',
                bio: 'Makes you feel the pain of men who find loneliness in the funniest places.',
                legacy: '"Cameron was the first screenwriter who made me understand my experiences could be translated into human comedies."'
            },
            {
                id: 'sw020', rank: 20, name: 'James Cameron', era: 'Modern', years: '1981–present',
                country: 'Canada/USA', emoji: '🚢', born: 1954,
                notableScripts: ['Aliens (1986)', 'Terminator 2 (1991)', 'Titanic (1997)', 'Avatar (2009)'],
                oscars: { wins: 0, nominations: 0 }, genres: ['Sci-Fi', 'Action', 'Epic'],
                quote: '"I\'m the king of the world!"',
                bio: 'Perfected the sci-fi action screenplay. Terminator is a perfect screenplay. Aliens is even better.',
                legacy: 'Set the standards for what Hollywood expects from an action film. Everyone is just trying to be James Cameron.'
            },
            // === TELEVISION LEGENDS ===
            {
                id: 'sw021', rank: 21, name: 'Shonda Rhimes', era: 'Contemporary', years: '2005–present',
                country: 'USA', emoji: '📺', born: 1970,
                notableScripts: ['Grey\'s Anatomy (TV)', 'Scandal (TV)', 'How to Get Away with Murder (TV)', 'Bridgerton (TV)'],
                oscars: { wins: 0, nominations: 0 }, genres: ['Drama', 'Medical', 'Political'],
                quote: '"Dreams are lovely. But they are just dreams."',
                bio: 'Created the Shondaland empire. Revolutionized network television with diverse, complex characters.',
                legacy: 'Proved that stories centering women and people of color are not niche — they are mainstream.'
            },
            {
                id: 'sw022', rank: 22, name: 'David Chase', era: 'Modern', years: '1971–present',
                country: 'USA', emoji: '🔫', born: 1945,
                notableScripts: ['The Sopranos (TV)', 'Not Fade Away (2012)'],
                oscars: { wins: 0, nominations: 0 }, genres: ['Crime', 'Drama'],
                quote: '"The best acting is listening."',
                bio: 'Creator of The Sopranos — widely regarded as the greatest television show ever written.',
                legacy: 'Single-handedly launched the Golden Age of Television and proved TV could rival cinema.'
            },
            {
                id: 'sw023', rank: 23, name: 'Vince Gilligan', era: 'Contemporary', years: '1993–present',
                country: 'USA', emoji: '⚗️', born: 1967,
                notableScripts: ['Breaking Bad (TV)', 'Better Call Saul (TV)', 'The X-Files (TV)'],
                oscars: { wins: 0, nominations: 0 }, genres: ['Crime', 'Drama', 'Thriller'],
                quote: '"Chemistry is the study of matter, but I prefer to see it as the study of change."',
                bio: 'Turned a chemistry teacher into TV\'s greatest antihero. Breaking Bad is the most perfectly plotted series ever.',
                legacy: 'Mastered the long-form transformation arc. Walter White\'s descent is the gold standard of character writing.'
            },
            {
                id: 'sw024', rank: 24, name: 'Ryan Coogler', era: 'Contemporary', years: '2013–present',
                country: 'USA', emoji: '🐾', born: 1986,
                notableScripts: ['Fruitvale Station (2013)', 'Creed (2015)', 'Black Panther (2018)', 'Black Panther: Wakanda Forever (2022)'],
                oscars: { wins: 0, nominations: 1 }, genres: ['Drama', 'Action', 'Sci-Fi'],
                quote: '"I realized the best way to change the world is to tell stories."',
                bio: 'Youngest filmmaker to direct a billion-dollar film. Black Panther was a cultural phenomenon.',
                legacy: 'Proved that blockbusters can be deeply personal and culturally significant simultaneously.'
            },
            {
                id: 'sw025', rank: 25, name: 'Greta Gerwig', era: 'Contemporary', years: '2017–present',
                country: 'USA', emoji: '💗', born: 1983,
                notableScripts: ['Lady Bird (2017)', 'Little Women (2019)', 'Barbie (2023)'],
                oscars: { wins: 0, nominations: 3 }, genres: ['Comedy', 'Drama', 'Coming-of-Age'],
                quote: '"The bravest thing you can do is tell someone else\'s story honestly."',
                bio: 'From indie darling to billion-dollar Barbie. Made a toy commercial into the most subversive film of 2023.',
                legacy: 'Proved that deeply personal, feminist storytelling can also be massively commercial.'
            }
        ];
    }

    // ═══════════════════════════════════════════════════
    //  SCRIPT FORMAT TEMPLATES
    // ═══════════════════════════════════════════════════
    _buildScriptFormats() {
        return {
            screenplay: {
                name: 'Feature Film Screenplay',
                format: 'Final Draft / Fountain',
                pageCount: '90-130 pages',
                rule: '1 page = ~1 minute of screen time',
                margins: { left: '1.5"', right: '1"', top: '1"', bottom: '1"' },
                font: 'Courier 12pt',
                elements: [
                    { name: 'SCENE HEADING (Slugline)', format: 'ALL CAPS', example: 'INT. RECORDING STUDIO - NIGHT' },
                    { name: 'Action', format: 'Present tense, lean prose', example: 'DJ Speedy adjusts the mixing board. The bass line drops.' },
                    { name: 'CHARACTER NAME', format: 'ALL CAPS, centered', example: 'DJ SPEEDY' },
                    { name: 'Dialogue', format: 'Centered, 3.7" from left', example: 'This beat is about to change the game.' },
                    { name: 'Parenthetical', format: 'In parentheses under character name', example: '(leaning into the mic)' },
                    { name: 'TRANSITION', format: 'Right-aligned, ALL CAPS', example: 'CUT TO:' },
                    { name: 'MONTAGE', format: 'Numbered sequence', example: 'MONTAGE - DJ SPEEDY\'S RISE TO THE TOP' }
                ],
                acts: ['Act I: Setup (pp. 1-30)', 'Act II: Confrontation (pp. 30-90)', 'Act III: Resolution (pp. 90-120)']
            },
            tvPilot: {
                name: 'TV Pilot Script',
                format: 'Final Draft',
                pageCount: '30 min: 22-32pp | 60 min: 50-65pp',
                types: [
                    { name: 'Single-Camera (Drama)', pages: '50-65', example: 'Breaking Bad, Game of Thrones' },
                    { name: 'Single-Camera (Comedy)', pages: '22-35', example: 'The Office, Atlanta' },
                    { name: 'Multi-Camera (Sitcom)', pages: '35-52', example: 'Friends, The Big Bang Theory' }
                ],
                structure: ['Cold Open / Teaser', 'Act One', 'Act Two', 'Act Three', 'Act Four (if needed)', 'Tag / Stinger']
            },
            stagePlay: {
                name: 'Stage Play',
                format: 'Standard Stage Format',
                pageCount: '90-150 pages',
                acts: ['One-Act', 'Two-Act', 'Three-Act'],
                elements: ['Stage Directions (in italics)', 'Character Names (ALL CAPS)', 'Dialogue', 'Scene Descriptions']
            },
            shortFilm: {
                name: 'Short Film Screenplay',
                format: 'Standard Screenplay Format',
                pageCount: '1-40 pages',
                idealLength: '5-15 pages for festivals',
                tip: 'Focus on one clear conflict, minimal characters, single location works best.'
            },
            musicVideo: {
                name: 'Music Video Treatment',
                format: 'Treatment / Storyboard',
                pageCount: '2-5 pages',
                sections: ['Concept Overview', 'Visual References / Mood Board', 'Shot-by-Shot Breakdown', 'Performance Moments', 'Budget Considerations'],
                tip: 'Connect visuals to the emotion of the track. DJ Speedy\'s GOAT Anthem deserves a cinematic treatment.'
            }
        };
    }

    // ═══════════════════════════════════════════════════
    //  STORY TEMPLATES (AI-POWERED FRAMEWORKS)
    // ═══════════════════════════════════════════════════
    _buildStoryTemplates() {
        return [
            {
                id: 'heros_journey', name: 'The Hero\'s Journey', source: 'Joseph Campbell / Christopher Vogler',
                icon: '⚔️', beats: 12,
                steps: [
                    'Ordinary World', 'Call to Adventure', 'Refusal of the Call', 'Meeting the Mentor',
                    'Crossing the Threshold', 'Tests, Allies, Enemies', 'Approach to Inmost Cave',
                    'Ordeal', 'Reward (Seizing the Sword)', 'The Road Back', 'Resurrection', 'Return with Elixir'
                ],
                examples: ['Star Wars (1977)', 'The Matrix (1999)', 'Black Panther (2018)'],
                bestFor: 'Epic adventures, origin stories, fantasy'
            },
            {
                id: 'save_the_cat', name: 'Save the Cat! Beat Sheet', source: 'Blake Snyder',
                icon: '🐱', beats: 15,
                steps: [
                    'Opening Image (p.1)', 'Theme Stated (p.5)', 'Set-Up (p.1-10)', 'Catalyst (p.12)',
                    'Debate (p.12-25)', 'Break into Two (p.25)', 'B Story (p.30)', 'Fun and Games (p.30-55)',
                    'Midpoint (p.55)', 'Bad Guys Close In (p.55-75)', 'All Is Lost (p.75)', 'Dark Night of the Soul (p.75-85)',
                    'Break into Three (p.85)', 'Finale (p.85-110)', 'Final Image (p.110)'
                ],
                examples: ['Legally Blonde (2001)', 'Elf (2003)', 'Get Out (2017)'],
                bestFor: 'Comedies, thrillers, mainstream films'
            },
            {
                id: 'three_act', name: 'Three-Act Structure', source: 'Aristotle / Syd Field',
                icon: '📐', beats: 8,
                steps: [
                    'Act I Setup: Introduce protagonist, world, status quo',
                    'Inciting Incident: Event that disrupts the world',
                    'Plot Point I: Protagonist commits to action (end of Act I)',
                    'Act II Rising Action: Obstacles, complications, subplots',
                    'Midpoint Reversal: Major twist or revelation',
                    'Plot Point II: Crisis moment, all seems lost (end of Act II)',
                    'Act III Climax: Protagonist faces ultimate challenge',
                    'Resolution / Denouement: New equilibrium established'
                ],
                examples: ['Chinatown (1974)', 'Die Hard (1988)', 'Parasite (2019)'],
                bestFor: 'Universal framework, any genre'
            },
            {
                id: 'five_act', name: 'Five-Act Structure (TV)', source: 'Television Industry Standard',
                icon: '📺', beats: 7,
                steps: [
                    'Teaser / Cold Open: Hook the audience immediately',
                    'Act One: Establish the episode\'s conflict',
                    'Act Two: Complicate the conflict, introduce B-story',
                    'Act Three: Midpoint crisis, stakes escalate',
                    'Act Four: Darkest moment, all seems lost',
                    'Act Five: Resolution, but leave threads for next episode',
                    'Tag: Brief comedic or dramatic button'
                ],
                examples: ['The Sopranos', 'Breaking Bad', 'Grey\'s Anatomy'],
                bestFor: 'Network TV, streaming series'
            },
            {
                id: 'dan_harmon', name: 'Dan Harmon\'s Story Circle', source: 'Dan Harmon (Community, Rick and Morty)',
                icon: '⭕', beats: 8,
                steps: [
                    '1. A character is in a zone of comfort',
                    '2. But they WANT something',
                    '3. They enter an unfamiliar situation',
                    '4. They ADAPT to it',
                    '5. They get what they wanted',
                    '6. But PAY a heavy price',
                    '7. They return to their familiar situation',
                    '8. Having CHANGED'
                ],
                examples: ['Community (TV)', 'Rick and Morty (TV)', 'The Mandalorian (TV)'],
                bestFor: 'Episodic TV, comedy, animation'
            },
            {
                id: 'music_biopic', name: 'Music Biopic Structure (GOAT Template)', source: 'GOAT Royalty Original',
                icon: '🎤', beats: 10,
                steps: [
                    'The Spark: Young artist discovers music for the first time',
                    'The Grind: Struggling in the underground scene, honing the craft',
                    'The Mentor: Meeting a producer/manager who believes in them',
                    'The Breakthrough: First hit record / viral moment',
                    'The Rise: Fame, money, touring, industry politics',
                    'The Temptation: Drugs, bad deals, betrayal, ego',
                    'The Fall: Public scandal, creative block, loss of identity',
                    'The Reckoning: Hitting rock bottom, confronting truth',
                    'The Comeback: Returning to what made them love music',
                    'The Legacy: Cementing their place in history'
                ],
                examples: ['8 Mile (2002)', 'Straight Outta Compton (2015)', 'Bohemian Rhapsody (2018)', 'GOAT Royalty: The DJ Speedy Story'],
                bestFor: 'Music biopics, artist documentaries, GOAT Royalty projects'
            }
        ];
    }

    // ═══════════════════════════════════════════════════
    //  SCREENWRITING SOFTWARE DATABASE
    // ═══════════════════════════════════════════════════
    _buildSoftwareDatabase() {
        return [
            {
                id: 'final_draft', name: 'Final Draft 13', icon: '🏆', tier: 'Industry Standard',
                price: '$249.99 (one-time)', priceMonthly: null,
                url: 'https://www.finaldraft.com',
                features: [
                    'Engineering Emmy® Award winner',
                    'Beat Board™ — visual story planning',
                    'Outline Editor with Structure Lines',
                    'SmartType auto-completion',
                    'Real-time collaboration',
                    'Track changes & revision mode',
                    'Production tagging (props, wardrobe, etc.)',
                    'Advanced reporting (characters, scenes, locations)',
                    'PDF-to-editable script conversion',
                    'Writers Sprint Timer',
                    'Goals & productivity stats',
                    'Multiple dialogue versions',
                    'Industry-standard formatting guarantee'
                ],
                formats: ['Screenplay', 'TV Script', 'Stage Play', 'Novel', 'Graphic Novel'],
                platforms: ['Mac', 'Windows', 'iPhone (Final Draft Go)'],
                usedBy: 'Used by 95% of Hollywood productions',
                verdict: 'The undisputed industry standard. If you\'re serious about screenwriting, this is what you need.'
            },
            {
                id: 'arc_studio', name: 'Arc Studio Pro', icon: '🌟', tier: 'Professional',
                price: 'Free tier + $99/year Pro', priceMonthly: '$9.99/mo',
                url: 'https://www.arcstudiopro.com',
                features: [
                    'Beautiful modern UI',
                    'Real-time collaboration',
                    'AI-powered rewrite suggestions',
                    'Outline & beat sheets built-in',
                    'Import/export Final Draft (.fdx)',
                    'Revision tracking',
                    'Unlimited projects (Pro)',
                    'Offline mode'
                ],
                formats: ['Screenplay', 'TV Script'],
                platforms: ['Web', 'Mac', 'Windows'],
                usedBy: 'Rising favorite among indie filmmakers',
                verdict: 'Best modern alternative to Final Draft. Beautiful UI with AI features.'
            },
            {
                id: 'highland', name: 'Highland 2', icon: '⛰️', tier: 'Professional',
                price: '$49.99 (one-time)', priceMonthly: null,
                url: 'https://quoteunquoteapps.com/highland-2/',
                features: [
                    'Created by John August (Big Fish, Charlie\'s Angels)',
                    'Fountain syntax (plain text formatting)',
                    'Distraction-free writing',
                    'Gender analysis tool',
                    'Sprint Timer',
                    'Export to Final Draft, PDF, FDX'
                ],
                formats: ['Screenplay', 'TV Script', 'Prose'],
                platforms: ['Mac only'],
                usedBy: 'Loved by minimalist writers and professionals who prefer clean text',
                verdict: 'Elegant and affordable. John August\'s philosophy: just write.'
            },
            {
                id: 'celtx', name: 'Celtx', icon: '🎬', tier: 'Production Suite',
                price: '$22.99/mo', priceMonthly: '$22.99/mo',
                url: 'https://www.celtx.com',
                features: [
                    'Scriptwriting + pre-production suite',
                    'Storyboarding tools',
                    'Budgeting & scheduling',
                    'Cast & crew management',
                    'Shot lists and call sheets',
                    'Real-time collaboration',
                    'Cloud-based workflow'
                ],
                formats: ['Screenplay', 'TV Script', 'Short Film', 'Documentary', 'Graphic Novel'],
                platforms: ['Web', 'iOS', 'Android'],
                usedBy: 'Popular with indie productions and film schools',
                verdict: 'Best all-in-one production suite. Script to shoot in one platform.'
            },
            {
                id: 'writerduet', name: 'WriterDuet', icon: '👥', tier: 'Professional',
                price: 'Free tier + $11.99/mo Pro', priceMonthly: '$11.99/mo',
                url: 'https://writerduet.com',
                features: [
                    'Real-time collaborative writing',
                    'Audio/video chat while writing',
                    'Version history',
                    'Offline mode',
                    'Export to FDX, PDF, Fountain',
                    'Free for 3 scripts'
                ],
                formats: ['Screenplay', 'TV Script', 'Stage Play'],
                platforms: ['Web', 'Mac', 'Windows', 'iOS', 'Android', 'Chromebook'],
                usedBy: 'Preferred by writing teams and co-writers',
                verdict: 'Best for collaboration. Google Docs meets screenwriting.'
            },
            {
                id: 'fade_in', name: 'Fade In', icon: '🌅', tier: 'Professional',
                price: '$79.95 (one-time)', priceMonthly: null,
                url: 'https://www.fadeinpro.com',
                features: [
                    'Full professional formatting',
                    'Collaboration tools',
                    'Revision tracking',
                    'Unicode support (any language)',
                    'Import/export FDX, PDF, Fountain',
                    'Cross-platform sync'
                ],
                formats: ['Screenplay', 'TV Script', 'Stage Play'],
                platforms: ['Mac', 'Windows', 'Linux'],
                usedBy: 'Growing among professional screenwriters seeking Final Draft alternative',
                verdict: 'Best value professional tool. $80 for lifetime license.'
            }
        ];
    }

    // ═══════════════════════════════════════════════════
    //  GENRE DATABASE
    // ═══════════════════════════════════════════════════
    _buildGenreDatabase() {
        return [
            { id: 'action', name: 'Action', emoji: '💥', tips: 'Lean action lines. Every word counts. INT. WAREHOUSE - NIGHT should be followed by adrenaline.', masters: ['James Cameron', 'Shane Black', 'Christopher McQuarrie'] },
            { id: 'comedy', name: 'Comedy', emoji: '😂', tips: 'Funny is in the characters, not the jokes. If your dialogue is funny when a stranger reads it, you\'re golden.', masters: ['Billy Wilder', 'Mel Brooks', 'Tina Fey'] },
            { id: 'drama', name: 'Drama', emoji: '🎭', tips: 'Conflict is king. Every scene must have stakes. Subtext > text.', masters: ['Francis Ford Coppola', 'Aaron Sorkin', 'Paddy Chayefsky'] },
            { id: 'horror', name: 'Horror', emoji: '👻', tips: 'What you don\'t show is scarier than what you do. Build dread. Earn your scares.', masters: ['Jordan Peele', 'Wes Craven', 'Ari Aster'] },
            { id: 'scifi', name: 'Sci-Fi', emoji: '🚀', tips: 'Start with a human question, then add the science. Technology is the setting, not the story.', masters: ['Stanley Kubrick', 'Charlie Kaufman', 'Denis Villeneuve'] },
            { id: 'thriller', name: 'Thriller', emoji: '🔪', tips: 'Give the audience information the character doesn\'t have. Hitchcock\'s bomb under the table.', masters: ['Alfred Hitchcock', 'David Fincher', 'Taylor Sheridan'] },
            { id: 'romcom', name: 'Romantic Comedy', emoji: '💕', tips: 'The obstacle to love should be internal, not contrived. Make us root for both characters independently.', masters: ['Nora Ephron', 'Richard Curtis', 'Nancy Meyers'] },
            { id: 'biopic', name: 'Biopic', emoji: '📸', tips: 'Don\'t cover their whole life — find the defining 2-3 year period. What moment changed everything?', masters: ['Aaron Sorkin', 'Eric Roth', 'Peter Morgan'] },
            { id: 'animation', name: 'Animation', emoji: '✏️', tips: 'If it can be done in live-action, don\'t animate it. Use the medium to do the impossible.', masters: ['Brad Bird', 'Andrew Stanton', 'Pete Docter'] },
            { id: 'music_film', name: 'Music Film', emoji: '🎤', tips: 'The music IS the dialogue. Performance scenes are the action sequences. Let the songs tell the story.', masters: ['Cameron Crowe', 'Baz Luhrmann', 'DJ Speedy'] }
        ];
    }

    // ═══════════════════════════════════════════════════
    //  OSCAR HISTORY FOR BEST SCREENPLAY
    // ═══════════════════════════════════════════════════
    _buildOscarHistory() {
        return [
            { year: 2024, original: { title: 'The Holdovers', writer: 'David Hemingson' }, adapted: { title: 'American Fiction', writer: 'Cord Jefferson' } },
            { year: 2023, original: { title: 'Everything Everywhere All at Once', writer: 'Daniel Kwan & Daniel Scheinert' }, adapted: { title: 'Women Talking', writer: 'Sarah Polley' } },
            { year: 2022, original: { title: 'Belfast', writer: 'Kenneth Branagh' }, adapted: { title: 'CODA', writer: 'Siân Heder' } },
            { year: 2021, original: { title: 'Promising Young Woman', writer: 'Emerald Fennell' }, adapted: { title: 'The Father', writer: 'Florian Zeller & Christopher Hampton' } },
            { year: 2020, original: { title: 'Parasite', writer: 'Bong Joon-ho & Han Jin-won' }, adapted: { title: 'Jojo Rabbit', writer: 'Taika Waititi' } },
            { year: 2019, original: { title: 'Green Book', writer: 'Nick Vallelonga, Brian Currie, Peter Farrelly' }, adapted: { title: 'BlacKkKlansman', writer: 'Spike Lee et al.' } },
            { year: 2018, original: { title: 'Get Out', writer: 'Jordan Peele' }, adapted: { title: 'Call Me by Your Name', writer: 'James Ivory' } },
            { year: 2017, original: { title: 'Manchester by the Sea', writer: 'Kenneth Lonergan' }, adapted: { title: 'Moonlight', writer: 'Barry Jenkins' } },
            { year: 2016, original: { title: 'Spotlight', writer: 'Tom McCarthy & Josh Singer' }, adapted: { title: 'The Big Short', writer: 'Charles Randolph & Adam McKay' } },
            { year: 2015, original: { title: 'Birdman', writer: 'Alejandro G. Iñárritu et al.' }, adapted: { title: 'The Imitation Game', writer: 'Graham Moore' } }
        ];
    }

    // ═══════════════════════════════════════════════════
    //  AI SCRIPT GENERATOR
    // ═══════════════════════════════════════════════════
    async generateScript(options = {}) {
        const { genre, template, title, logline, protagonist, setting } = options;
        this.stats.scriptsGenerated++;

        const selectedTemplate = this.storyTemplates.find(t => t.id === (template || 'three_act'));
        const selectedGenre = this.genreDatabase.find(g => g.id === (genre || 'drama'));

        const script = {
            success: true,
            metadata: {
                title: title || 'UNTITLED PROJECT',
                logline: logline || 'A compelling story about the human condition.',
                genre: selectedGenre?.name || 'Drama',
                format: 'Feature Film Screenplay',
                estimatedPages: Math.floor(Math.random() * 30) + 95,
                template: selectedTemplate?.name || 'Three-Act Structure'
            },
            titlePage: this._generateTitlePage(title || 'UNTITLED PROJECT'),
            outline: selectedTemplate?.steps || [],
            openingScene: this._generateOpeningScene(genre, protagonist, setting),
            characterBreakdown: this._generateCharacters(protagonist),
            genreTips: selectedGenre?.tips || '',
            masterStudy: selectedGenre?.masters || [],
            software: 'Final Draft 13 (Recommended)',
            timestamp: new Date().toISOString()
        };

        return script;
    }

    _generateTitlePage(title) {
        return [
            '',
            '',
            '',
            '',
            `                    ${title.toUpperCase()}`,
            '',
            '',
            '                        Written by',
            '',
            '                    [YOUR NAME HERE]',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '  Contact:                           © 2024',
            '  GOAT Royalty Entertainment          All Rights Reserved',
            '  www.goatroyaltyapp.org              WGA Registration #_______'
        ].join('\n');
    }

    _generateOpeningScene(genre, protagonist, setting) {
        const protName = (protagonist || 'PROTAGONIST').toUpperCase();
        return [
            `FADE IN:`,
            ``,
            `EXT. ${(setting || 'CITY SKYLINE').toUpperCase()} - NIGHT`,
            ``,
            `The city breathes. Lights pulse like a heartbeat.`,
            ``,
            `A FIGURE emerges from the shadows — ${protName}, early 30s,`,
            `eyes that have seen too much, hands that have built too`,
            `little. Something burns in the chest. A hunger.`,
            ``,
            `                    ${protName}`,
            `                (to themselves)`,
            `          Tonight changes everything.`,
            ``,
            `SMASH CUT TO:`,
            ``,
            `TITLE CARD: [YOUR TITLE]`,
            ``,
            `                                        CUT TO:`
        ].join('\n');
    }

    _generateCharacters(protagonist) {
        return [
            { role: 'Protagonist', name: protagonist || '[NAME]', arc: 'Flaw → Growth → Transformation', tips: 'Give them a wound, a want, and a need. The want drives Act I-II, the need drives Act III.' },
            { role: 'Antagonist', name: '[NAME]', arc: 'Mirror of protagonist\'s darkest potential', tips: 'The best villains believe they\'re the hero. Give them a valid point.' },
            { role: 'Mentor', name: '[NAME]', arc: 'Guides hero, then steps back or dies', tips: 'The mentor represents who the hero could become — or who they must surpass.' },
            { role: 'Love Interest', name: '[NAME]', arc: 'Independent goal + connection to theme', tips: 'They should be a complete character, not a prize. What do they want for themselves?' },
            { role: 'Comic Relief / Best Friend', name: '[NAME]', arc: 'Truth-teller who keeps hero grounded', tips: 'The best friend says what the audience is thinking.' }
        ];
    }

    // ═══════════════════════════════════════════════════
    //  PUBLIC API METHODS
    // ═══════════════════════════════════════════════════
    getWriters(filters = {}) {
        let writers = this.legendaryWriters;
        if (filters.era) writers = writers.filter(w => w.era.toLowerCase().includes(filters.era.toLowerCase()));
        if (filters.genre) writers = writers.filter(w => w.genres.some(g => g.toLowerCase().includes(filters.genre.toLowerCase())));
        if (filters.country) writers = writers.filter(w => w.country.toLowerCase().includes(filters.country.toLowerCase()));
        if (filters.search) {
            const q = filters.search.toLowerCase();
            writers = writers.filter(w => w.name.toLowerCase().includes(q) || w.notableScripts.some(s => s.toLowerCase().includes(q)));
        }
        return { success: true, writers, total: writers.length };
    }

    getWriterById(id) {
        const w = this.legendaryWriters.find(x => x.id === id);
        return w ? { success: true, writer: w } : { success: false, error: 'Writer not found' };
    }

    getScriptFormats() {
        return { success: true, formats: this.scriptFormats };
    }

    getStoryTemplates() {
        return { success: true, templates: this.storyTemplates };
    }

    getSoftware() {
        return { success: true, software: this.softwareDatabase };
    }

    getGenres() {
        return { success: true, genres: this.genreDatabase };
    }

    getOscarHistory() {
        return { success: true, history: this.oscarHistory };
    }

    getStats() {
        return {
            success: true,
            writers: this.legendaryWriters.length,
            softwareOptions: this.softwareDatabase.length,
            storyTemplates: this.storyTemplates.length,
            genres: this.genreDatabase.length,
            scriptsGenerated: this.stats.scriptsGenerated
        };
    }
}

module.exports = new ScreenwritingStudio();