/***********************************************************************
 * GOAT CONNECT — REAL CATALOG ENGINE
 * =====================================================================
 * FASTASSMAN PUBLISHING INC (ASCAP) × BRICK SQUAD MUSIC LLC
 * Harvey Lee Miller Jr. (DJ Speedy) × Waka Flocka Flame
 * 
 * 333 ASCAP registered works | 57 Waka ISRC tracks | 377 full ISRC catalog
 * 40+ MILLION records sold (RIAA confirmed)
 * 
 * © GOAT Systems — Zero Cloud. Zero Tracking. All Rights Reserved.
 ***********************************************************************/

const path = require('path');
const fs = require('fs');

class RealCatalog {
  constructor() {
    this.version = '1.0.0';
    this.publisher = {
      name: 'FASTASSMAN PUBLISHING INC',
      partyId: '60881',
      pro: 'ASCAP',
      totalWorks: 333,
      ipiNumber: '348585814',
      adminPublisher: 'ROYNET MUSIC',
      adminIPI: '339668123'
    };

    this.artist = {
      id: 'dj-speedy',
      name: 'DJ Speedy',
      realName: 'Harvey Lee Miller Jr.',
      aliases: ['DJ Speedy', 'Harvey Miller', 'FASTASSMAN', 'Speedy Productions'],
      ipiNumber: '348202968',
      emoji: '🎧',
      bio: 'Multi-Platinum Super Producing Composer with 40+ million records sold (RIAA confirmed). World-renowned veteran DJ in Hip Hop and EDM. Classical music trained, Atlanta-based pioneer. Producer credits include Beyoncé, Jay-Z, Outkast, Waka Flocka, Gucci Mane, Nicki Minaj, 2 Chainz, T.I., Flo Rida, and more.',
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      hometown: 'Orangeburg, South Carolina',
      companies: [
        'Speedy Productions, Inc.',
        'Fastassman Publishing Inc.',
        'Life Imitates Art Inc.',
        'HarveyMillerMusic Inc.',
        'Brick Squad Music LLC',
        'GOAT Systems'
      ],
      distribution: 'Sony Music / The Orchard',
      proAffiliation: 'ASCAP',
      genres: ['Hip-Hop', 'R&B', 'EDM', 'Trap', 'Pop', 'House', 'Classical Fusion'],
      tier: 'GOAT',
      recordsSold: '40,000,000+',
      riaaCertified: true,
      notableCollaborators: [
        'Beyoncé', 'Jay-Z', 'Outkast', 'Young Jeezy', 'Waka Flocka Flame',
        'Gucci Mane', 'Nicki Minaj', '2 Chainz', 'T.I.', 'Flo Rida', 'Drake',
        'Future', 'Migos', 'Kelly Rowland', 'Rich Boy', 'Bun B', 'Big Mike',
        'Andre 3000', 'Big Boi', 'B.G.', 'Juicy J', 'OJ da Juiceman',
        'Murphy Lee', 'Jazze Pha', 'Sleepy Brown', 'Bonecrusher', 'Nelly',
        'Shawty Redd', 'Young Thug', 'French Montana', 'Rocko'
      ],
      filmTV: ['Marvel', 'MTV', 'CBS', 'FOX', 'NBC', 'VH1', 'Judge Joe Brown'],
      socialLinks: {
        twitter: '@WHOISHARVEY',
        linkedin: 'https://www.linkedin.com/in/djspeedy',
        github: 'https://github.com/DJSPEEDYGA'
      },
      phone: '404-769-1865',
      email: 'harvey@goatsystems.com',
      milestones: [
        { year: 2006, event: 'Young Jeezy shoutout on multi-platinum "The Inspiration"' },
        { year: 2007, event: 'Entered EDM world remixing Beyoncé' },
        { year: 2010, event: 'Brick Squad Music LLC collaboration with Waka Flocka' },
        { year: 2017, event: 'ASCAP catalog registration — 333 works' },
        { year: 2025, event: 'GOAT Royalty App launch — Empire Rising' }
      ]
    };

    this.wakaFlocka = {
      id: 'waka-flocka',
      name: 'Waka Flocka Flame',
      realName: 'Juaquin James Malphurs',
      emoji: '🔥',
      bio: 'ATL trap pioneer. Flockaveli. HARD IN DA PAINT. Brick Squad Monopoly. Legend of the South.',
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      label: 'Brick Squad Monopoly / 1017',
      genres: ['Hip-Hop', 'Trap', 'Crunk', 'Southern Rap'],
      tier: 'Legend'
    };

    // ========================================
    // ASCAP WORKS CATALOG — 333 REGISTERED SONGS
    // ========================================
    this.ascapWorks = [
      { title: '01 BETTER PLAN', ascapId: '893701310', iswc: 'T9232335954', regDate: '12/07/2017', writers: [{name:'MILLER, HARVEY L', ipi:'348202968', role:'CA', own:'25%'},{name:'RUSH, RAY', ipi:'538407052', role:'CA', own:'25%'}], publisher: 'FASTASSMAN', pubOwn: '25%' },
      { title: 'GET LOW (FEAT. NICKI MINAJ, TYGA & FLO RIDA)', ascapId: null, iswc: null, regDate: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['Nicki Minaj','Tyga','Flo Rida'], tier: 'Platinum' },
      { title: 'GANGSTA NERD (FEAT WACKA FLOCKA)', ascapId: null, iswc: null, regDate: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['Waka Flocka Flame'], tier: 'Gold' },
      { title: 'BOUT THE DISCO LIFE (FEAT SLEEPY BROWN)', ascapId: null, iswc: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['Sleepy Brown'] },
      { title: 'DO YOU STILL LOVE ME (FEAT SLEEPY BROWN)', ascapId: null, iswc: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['Sleepy Brown'] },
      { title: 'DRINKING PARTNER (FEAT MUPHY LEE)', ascapId: null, iswc: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['Murphy Lee'] },
      { title: 'FU*K & SMOKE (FEAT MURPHY LEE)', ascapId: null, iswc: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['Murphy Lee'] },
      { title: 'GRINDIN FEAT. BONECRUSHER', ascapId: null, iswc: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['Bonecrusher'] },
      { title: 'PARTY (CLEAN) (FEAT MURPHY LEE)', ascapId: null, iswc: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['Murphy Lee'] },
      { title: 'PARTY (EXPLICIT) (FEAT MURPHY LEE)', ascapId: null, iswc: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['Murphy Lee'] },
      { title: 'WILD BOYZ (FEAT. DJ SPEEDY)', ascapId: null, iswc: null, writers: [{name:'MILLER, HARVEY L', role:'CA'}], featuring: ['DJ Speedy'] },
      { title: 'ALL OF ME', ascapId: null, iswc: null, genre: 'R&B/Pop' },
      { title: 'ALL OF ME (HOUSE REMIX)', ascapId: null, iswc: null, genre: 'House' },
      { title: 'ALL OF ME (SINGLE)', ascapId: null, iswc: null, genre: 'Pop' },
      { title: 'BEAUTIFUL LADY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'BEAUTIFUL LADY (RE-MIX)', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'BED OF MONEY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'BETTER PLAN', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'BIG CITY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'BIG DADDY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'BIG ROOM', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'BIG ROOM HOUSE', ascapId: null, iswc: null, genre: 'House' },
      { title: 'BOTTLE SERVICE', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'BRASS IN YOUR FACE', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'BREAK ME DOWN', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'BREAKER BREAKER', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'BRICKS', ascapId: null, iswc: null, genre: 'Trap' },
      { title: 'BROKEN UP', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'BUTTERFLY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'CALIFORNIA CHRISTMAS', ascapId: null, iswc: null, genre: 'Holiday' },
      { title: 'CAPTAIN JACK', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'CHOPPIN THRU THE NIGHT', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'CHRISTMAS TIME IS FINALLY HERE', ascapId: null, iswc: null, genre: 'Holiday' },
      { title: 'CITY LIGHTS', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'CRY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'DANCE WITH ME BABY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'DEAD CAT', ascapId: null, iswc: null, genre: 'Trap' },
      { title: 'DEEP POCKETS', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'DIAMONDS', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'DIRTY WINE', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'DO IT BIG', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'DOWN WITH ME', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'DR FEEL', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'DROP THE BASS ON EM', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'DUCK DANCE', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'ECLIPSE', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'ENJOY THE MUSIC', ascapId: null, iswc: null, genre: 'House' },
      { title: 'ESSENCE', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'ETHEREAL', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'EVERYDAY ALLDAY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'EVERYDAY FEELS LIKE CHRISTMAS', ascapId: null, iswc: null, genre: 'Holiday' },
      { title: 'EVERYDAY IS CHRISTMAS', ascapId: null, iswc: null, genre: 'Holiday' },
      { title: 'F.O.M.F.', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'FALL DOWN', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'FLAIR WALK', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'FLEXINGTON', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'FOREVER AND EVER', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'FOUND MY WAY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'FREAK', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'FUCK WIT ME', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'FUNK HYPNOTIZED', ascapId: null, iswc: null, genre: 'Funk/Hip-Hop' },
      { title: 'GANGSTA NERD (CLEAN)', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'GANGSTA NERD (EXPLICIT)', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'GET BETTER (DOES IT EVER)', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'GET BY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'GET LOW', ascapId: null, iswc: null, genre: 'Hip-Hop/EDM', tier: 'Hit' },
      { title: 'GET LOW (LIKE A LAMBO)', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'GO HARDER', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'GOOD MORNING', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'GOOD NIGHT', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'GOON MARCH', ascapId: null, iswc: null, genre: 'Trap' },
      { title: 'GREAT DAY', ascapId: null, iswc: null, genre: 'Pop' },
      { title: 'GREATER', ascapId: null, iswc: null, genre: 'Inspirational' },
      { title: 'GRINDIN', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'GRITS AND GRAVY', ascapId: null, iswc: null, genre: 'Southern Hip-Hop' },
      { title: 'HEAD 1ST', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'HEAVEN', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'HERE I AM', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'HEROIN MONEY', ascapId: null, iswc: null, genre: 'Trap' },
      { title: 'HIGH AND LOW', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'HOLD YOUR FIRE', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'HOOK ME UP', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'HOT!', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'I AM ALIVE', ascapId: null, iswc: null, genre: 'Inspirational' },
      { title: 'I CAN DO ANYTHING', ascapId: null, iswc: null, genre: 'Inspirational' },
      { title: 'I DO THIS', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'I WANNA JAM', ascapId: null, iswc: null, genre: 'Funk' },
      { title: 'IMA BALLA', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'INGLEWOOD SLIDE', ascapId: null, iswc: null, genre: 'West Coast' },
      { title: 'INNER PEACE', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'INTRO (HARVEY MILLER)', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'INTRODUCING GATOR', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'KINGS & QUEENS', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'LADIES RIDE', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'LIGHT SHOW', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'LIKE A LAMBO', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'LITTLE TRAP DRUMMER BOY', ascapId: null, iswc: null, genre: 'Holiday/Trap' },
      { title: 'LIVE YOUR LIFE', ascapId: null, iswc: null, genre: 'Inspirational' },
      { title: 'LONG WAY TO GO', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'MAKE ME HAPPY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'MEMORIES OF DJ SPEEDY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'MIDDLE FINGAZ', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'MOMMA SAYS HANDS UP', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'MOON', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'MOVE', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'MOVE ALONG', ascapId: null, iswc: null, genre: 'Pop' },
      { title: 'MOVING TO THE CITY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'MR. PRESIDENT', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'MY GIRL MY GUY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'NASCAR FAST CAR', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'NEVER STOP', ascapId: null, iswc: null, genre: 'Inspirational' },
      { title: 'NO MORE', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'NO REGRETS', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'NO WAY OUT', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'NUMBER ONE', ascapId: null, iswc: null, genre: 'Pop' },
      { title: 'OH MY GOD', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'OLD SCHOOL CHEVY', ascapId: null, iswc: null, genre: 'Southern Hip-Hop' },
      { title: 'ON ANOTHER LEVEL', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'ONE LOVE', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'PAPERED UP', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'PARTY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'PARTY MAFIA', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'PICK ME UP', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'PLAY WITH ME', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'POISON', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'POLO', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'RACK IT', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'RAVE ME!', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'RELOAD IT', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'REMINISCING', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'RICH', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'ROCK N ROLL', ascapId: null, iswc: null, genre: 'Rock/Hip-Hop' },
      { title: 'ROCK ON', ascapId: null, iswc: null, genre: 'Rock' },
      { title: 'ROCK TO THE RHYTHM', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'ROLLIN IN MY CADILLAC', ascapId: null, iswc: null, genre: 'Southern Hip-Hop' },
      { title: 'SAMURAI', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'SAY DAMN', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'SCANDALUS', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'SHADOWS', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'SHAKE', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'SHITTIN ONUM', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'SHOCK', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'SLOW AND DJ SPEEDY IT UP', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'SPACESHIP', ascapId: null, iswc: null, genre: 'Hip-Hop/EDM' },
      { title: 'SPANISH EYES', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'STARS', ascapId: null, iswc: null, genre: 'Pop' },
      { title: 'STAY WITH ME', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'STEPPIN OUT', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'STOLEN', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'STREETS IS WATCHIN', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'STRICTLY BUSINESS', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'STRONG', ascapId: null, iswc: null, genre: 'Inspirational' },
      { title: 'STRONGER THAN U KNOW', ascapId: null, iswc: null, genre: 'Inspirational' },
      { title: 'TAKE IT EASY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'TAKE OVER THE NIGHT', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'THE ONE', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'THE RISE OF A CHAMPION', ascapId: null, iswc: null, genre: 'Inspirational' },
      { title: 'THE USUAL SUSPECTS', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'THIS CHRISTMAS DAY', ascapId: null, iswc: null, genre: 'Holiday' },
      { title: 'THIS MEANS WAR', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'TIME OF OUR LIVES', ascapId: null, iswc: null, genre: 'Pop' },
      { title: 'TO LOVE SOMEBODY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'TO THE PARTY', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'TRAP WORK', ascapId: null, iswc: null, genre: 'Trap' },
      { title: 'TURN IT UP', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'TURN ME ON', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'UP AND AWAY', ascapId: null, iswc: null, genre: 'Pop' },
      { title: 'UPPERCUT TO THE JAW', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'WE AMERICANS', ascapId: null, iswc: null, genre: 'Inspirational' },
      { title: 'WEEKEND WARRIORS', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'WHAT WOULD YOU DO', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'WHAT YOU SEE IS WHAT YOU GET', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'WILD', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'WILD OUT', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'WORK DAT TWERK DAT', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'WORK ME OUT (TAKE ME ON THE FLOOR)', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'YEAH', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'YOU A STAR', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'YOU BUCK WE BUCK', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'YOU TAKE MY BREATH AWAY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'AMERIKKA', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'ALIEN', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'ALONE', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'AROUND THE WORLD', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'BAG', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'BAG FULL', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'BATTLE', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'BILLY BOY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'BOUNCY', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'BURGER AND FRIES', ascapId: null, iswc: null, genre: 'Comedy/Hip-Hop' },
      { title: 'CLIPPER', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'COMBO!', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'DRINKING PARTNER PEPSI COLA', ascapId: null, iswc: null, genre: 'Commercial' },
      { title: 'DUKE', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'FASTER', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'GOOD OR BAD', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'SELFISH', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'SHOULD I GO OR STAY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'SICKER', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'SKIPPY', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'SLEEPY DANCE WITH ME', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'SOLAR', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'SPLIT', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'SPRITE HEADZ', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'SUN COMES UP', ascapId: null, iswc: null, genre: 'Pop' },
      { title: 'SUICIDAL DREAM', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'THESE TIMES', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'THIRSTI', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'TITAN', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'TRIED HARDER', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'TURF', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'WATERING HOLE', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'WORLD AROUND', ascapId: null, iswc: null, genre: 'Pop' },
      { title: 'PIZZA', ascapId: null, iswc: null, genre: 'Comedy/Hip-Hop' },
      { title: 'WOBBY PANCAKES', ascapId: null, iswc: null, genre: 'Comedy/Hip-Hop' },
      { title: 'OUTRO (HARVEY MILLER)', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'OUTTA LINE', ascapId: null, iswc: null, genre: 'Hip-Hop' },
      { title: 'PUSH AWAY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'RIGHT ON BABY', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'ROBERTA OH YEAH', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'RUNNIN BACK', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'NIGHT NIGHT', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'SLOW HAND', ascapId: null, iswc: null, genre: 'R&B' },
      { title: 'SMOOTH 70S', ascapId: null, iswc: null, genre: 'Funk/R&B' },
      { title: 'SYNCHROTRON', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'TIME DILATION', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'VELA', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'WAVE PARTICLE', ascapId: null, iswc: null, genre: 'EDM' },
      { title: 'Y-RAY', ascapId: null, iswc: null, genre: 'EDM' },
    ];

    // ========================================
    // WAKA FLOCKA ISRC TRACKS (57 songs)
    // ========================================
    this.wakaISRC = [
      { title: 'Benjamin Flocka Intro', isrcs: ['QZ-9EM-17-00520','QZ-9EM-17-00524','QZ-9EM-17-90501'], artist: 'Waka Flocka Flame' },
      { title: 'My G', isrcs: ['QZ-9EM-17-00526','QZ-9EM-17-00528','QZ-9EM-17-00530','QZ-9EM-17-90503'], artist: 'Waka Flocka Flame', producer: 'Southside' },
      { title: 'Call The Squad For Him', isrcs: ['QZ-9EM-17-00532','QZ-9EM-17-00534','QZ-9EM-17-00536','QZ-9EM-17-90507'], artist: 'Waka Flocka Flame', featuring: ['Rocko'] },
      { title: 'Brick Squad Monopoly', isrcs: ['QZ-9EM-17-00538','QZ-9EM-17-00540','QZ-9EM-17-00542','QZ-9EM-17-90509'], artist: 'Waka Flocka Flame', featuring: ['P Smurf','Mouse'] },
      { title: 'Talkin', isrcs: ['QZ-9EM-17-00544','QZ-9EM-17-00546','QZ-9EM-17-00548','QZ-9EM-17-90511'], artist: 'Waka Flocka Flame' },
      { title: 'Clap', isrcs: ['QZ-9EM-17-00550','QZ-9EM-17-00552','QZ-9EM-17-00554','QZ-9EM-17-90513'], artist: 'Waka Flocka Flame' },
      { title: 'Kill The Parkin Lot', isrcs: ['QZ-9EM-17-00556','QZ-9EM-17-00558','QZ-9EM-17-00560','QZ-9EM-17-90515'], artist: 'Waka Flocka Flame' },
      { title: 'Young Nigga', isrcs: ['QZ-9EM-17-00662','QZ-9EM-17-00664','QZ-9EM-17-00668','QZ-9EM-17-90517'], artist: 'Waka Flocka Flame', featuring: ['Gucci Mane'] },
      { title: 'Spazz Out', isrcs: ['QZ-9EM-17-00670','QZ-9EM-17-00672','QZ-9EM-17-00674','QZ-9EM-17-90519'], artist: 'Waka Flocka Flame', featuring: ['Chill Will','P Smurf'] },
      { title: 'Crowd', isrcs: ['QZ-9EM-17-00678','QZ-9EM-17-00680','QZ-9EM-17-00682','QZ-9EM-17-90521'], artist: 'Waka Flocka Flame', featuring: ['YG Hootie','Lil Capp','P Smurf'] },
      { title: 'Lotto Ticket', isrcs: ['QZ-9EM-17-00684','QZ-9EM-17-00686','QZ-9EM-17-00688','QZ-9EM-17-90523'], artist: 'Waka Flocka Flame', featuring: ['Young Dose','P Smurf','Slim Dunkin','Ice B','YG Hootie','Short Dawg'] },
      { title: 'Cocaine Runners', isrcs: ['QZ-9EM-17-00692','QZ-9EM-17-00694','QZ-9EM-17-00698','QZ-9EM-17-90525'], artist: 'Waka Flocka Flame', featuring: ['Cartel','P Smurf'] },
      { title: 'Pole', isrcs: ['QZ-9EM-17-00704','QZ-9EM-17-00706','QZ-9EM-17-90703'], artist: 'Waka Flocka Flame', featuring: ['YG Hootie','Slim Dunkin'] },
      { title: 'Do It Big', isrcs: ['QZ-9EM-17-00708','QZ-9EM-17-00710','QZ-9EM-17-00712','QZ-9EM-17-90709'], artist: 'Waka Flocka Flame', featuring: ['Uncle Murda','Papoose','Rah Diggs'] },
      { title: 'Nik After Nik', isrcs: ['QZ-9EM-17-00718','QZ-9EM-17-00720','QZ-9EM-17-90711'], artist: 'Waka Flocka Flame', featuring: ['Slim Dunkin'] },
      { title: 'My Homeboys', isrcs: ['QZ-9EM-17-00724','QZ-9EM-17-00726','QZ-9EM-17-00728','QZ-9EM-17-90715'], artist: 'Waka Flocka Flame', featuring: ['YG Hootie','P Smurf','Ice Burgandy'] },
      { title: 'Watch My Power Spread', isrcs: ['QZ-9EM-17-00730','QZ-9EM-17-00732','QZ-9EM-17-00734','QZ-9EM-17-90717'], artist: 'Waka Flocka Flame', featuring: ['Wooh Da Kid'] },
      { title: 'This Is Bricksquad', isrcs: ['QZ-9EM-17-00736','QZ-9EM-17-00738','QZ-9EM-17-00740','QZ-9EM-17-90719'], artist: 'Waka Flocka Flame', featuring: ['YG Hootie','Frenchie','Wooh Da Kid','Ice Burgandy'] },
      { title: 'Ball', isrcs: ['QZ-9EM-17-00742','QZ-9EM-17-00744','QZ-9EM-17-00746','QZ-9EM-17-90721'], artist: 'Waka Flocka Flame', featuring: ['2 Chainz'] },
      { title: 'Win Towers 2 - No Fly Zone', isrcs: ['QZ-9EM-17-00754','QZ-9EM-17-00756','QZ-9EM-17-00758','QZ-9EM-17-90725'], artist: 'Waka Flocka Flame' },
      { title: 'Koolin It', isrcs: ['QZ-9EM-17-00754','QZ-9EM-17-00756','QZ-9EM-17-00758','QZ-9EM-17-90725'], artist: 'Waka Flocka Flame', featuring: ['YG Hootie','Kebo Gotti'] },
      { title: 'Wrong One Ta Try', isrcs: ['QZ-9EM-17-00760','QZ-9EM-17-00762','QZ-9EM-17-00764','QZ-9EM-17-90777'], artist: 'Waka Flocka Flame', featuring: ['French Montana'] },
      { title: 'Atlanta Girl', isrcs: ['QZ-9EM-17-00766','QZ-9EM-17-00768','QZ-9EM-17-00770','QZ-9EM-17-90779'], artist: 'Waka Flocka Flame', featuring: ['Quez'] },
      { title: 'Lightz On', isrcs: ['QZ-9EM-17-00772','QZ-9EM-17-00774','QZ-9EM-17-00778','QZ-9EM-17-90801'], artist: 'Waka Flocka Flame', featuring: ['Gucci Mane'] },
      { title: 'BMW', isrcs: ['QZ-9EM-17-00780','QZ-9EM-17-00782','QZ-9EM-17-00784','QZ-9EM-17-90803'], artist: 'Waka Flocka Flame', featuring: ['D-Bo'] },
      { title: 'Let Me See You Do It', isrcs: ['QZ-9EM-17-00786','QZ-9EM-17-00790','QZ-9EM-17-00792','QZ-9EM-17-90805'], artist: 'Waka Flocka Flame', featuring: ['Wooh Da Kid'] },
      { title: 'Blindside', isrcs: ['QZ-9EM-17-00794','QZ-9EM-17-00796','QZ-9EM-17-00798','QZ-9EM-17-90807'], artist: 'Waka Flocka Flame' },
      { title: 'Band Pop', isrcs: ['QZ-9EM-17-00800','QZ-9EM-17-00802','QZ-9EM-17-00804','QZ-9EM-17-90809'], artist: 'Waka Flocka Flame' },
      { title: 'Flex', isrcs: ['QZ-9EM-17-00806','QZ-9EM-17-00808','QZ-9EM-17-00810','QZ-9EM-17-90811'], artist: 'Waka Flocka Flame', featuring: ['D-Bo','Capp'] },
      { title: 'Hi-Jackin Planez', isrcs: ['QZ-9EM-17-00812','QZ-9EM-17-00814','QZ-9EM-17-00816','QZ-9EM-17-90813'], artist: 'Waka Flocka Flame' },
      { title: 'Drop It Girl', isrcs: ['QZ-9EM-17-00818','QZ-9EM-17-00820','QZ-9EM-17-00822','QZ-9EM-17-90815'], artist: 'Waka Flocka Flame', featuring: ['Capp P','Ceeze Gates'] },
      { title: 'Fresh As F*ck', isrcs: ['QZ-9EM-17-00824','QZ-9EM-17-00826','QZ-9EM-17-00828','QZ-9EM-17-90817'], artist: 'Waka Flocka Flame', featuring: ['Gucci Mane','Rocko'] },
      { title: 'Banned From The Club', isrcs: ['QZ-9EM-17-00830','QZ-9EM-17-00832','QZ-9EM-17-00834','QZ-9EM-17-90819'], artist: 'Waka Flocka Flame', featuring: ['Yung Joey'] },
      { title: 'R.I.P', isrcs: ['QZ-9EM-17-00836','QZ-9EM-17-00838','QZ-9EM-17-00840','QZ-9EM-17-90821'], artist: 'Waka Flocka Flame', featuring: ['Alley Boy','Trouble'] },
      { title: 'Baddest In The Room', isrcs: ['QZ-9EM-17-00842','QZ-9EM-17-00846','QZ-9EM-17-00848','QZ-9EM-17-90823'], artist: 'Waka Flocka Flame' },
      { title: 'No Pressure', isrcs: ['QZ-9EM-17-00850','QZ-9EM-17-00852','QZ-9EM-17-00854','QZ-9EM-17-90825'], artist: 'Waka Flocka Flame' },
      { title: '100s', isrcs: ['QZ-9EM-17-00856','QZ-9EM-17-00858','QZ-9EM-17-00860','QZ-9EM-17-90827'], artist: 'Waka Flocka Flame', featuring: ['YC','Jody Breeze'] },
      { title: 'Double Up Freestyle', isrcs: ['QZ-9EM-17-00862','QZ-9EM-17-00864','QZ-9EM-17-00866','QZ-9EM-17-90829'], artist: 'Waka Flocka Flame', featuring: ['Bezo Dame'] },
      { title: 'Intro', isrcs: ['QZ-9EM-17-00868','QZ-9EM-17-00870','QZ-9EM-17-00872','QZ-9EM-17-90300'], artist: 'Waka Flocka Flame' },
      { title: 'Just A Sample', isrcs: ['QZ-9EM-17-00874','QZ-9EM-17-00876','QZ-9EM-17-00878','QZ-9EM-17-90301'], artist: 'Waka Flocka Flame', featuring: ['Adrian Marcel'] },
      { title: 'Whole Wide World', isrcs: ['QZ-9EM-17-00880','QZ-9EM-17-00882','QZ-9EM-17-00884','QZ-9EM-17-90303'], artist: 'Waka Flocka Flame', featuring: ['Avery Storm'] },
      { title: 'Activist', isrcs: ['QZ-9EM-17-00886','QZ-9EM-17-00888','QZ-9EM-17-00890','QZ-9EM-17-90305'], artist: 'Waka Flocka Flame', featuring: ['Ben G'] },
      { title: 'Where It At', isrcs: ['QZ-9EM-17-00892','QZ-9EM-17-00894','QZ-9EM-17-00896','QZ-9EM-17-90307'], artist: 'Waka Flocka Flame' },
      { title: 'Touchdown', isrcs: ['QZ-9EM-17-00898','QZ-9EM-17-00900','QZ-9EM-17-00902','QZ-9EM-17-90309'], artist: 'Waka Flocka Flame', featuring: ['Kurt CT'] },
      { title: 'Red Ferrari', isrcs: ['QZ-9EM-17-00904','QZ-9EM-17-00906','QZ-9EM-17-00908','QZ-9EM-17-90311'], artist: 'Waka Flocka Flame', featuring: ['Sosay','Chaz Gotti'] },
      { title: "Ain't Shit Changed", isrcs: ['QZ-9EM-17-00910','QZ-9EM-17-00912','QZ-9EM-17-00914','QZ-9EM-17-90315'], artist: 'Waka Flocka Flame' },
      { title: 'Come Around', isrcs: ['QZ-9EM-17-00916','QZ-9EM-17-00918','QZ-9EM-17-00920','QZ-9EM-17-90317'], artist: 'Waka Flocka Flame', featuring: ['Young Thug'] },
      { title: 'Interlude', isrcs: ['QZ-9EM-17-00922','QZ-9EM-17-00924','QZ-9EM-17-00926','QZ-9EM-17-90319'], artist: 'Waka Flocka Flame' },
      { title: 'Smile', isrcs: ['QZ-9EM-17-00928','QZ-9EM-17-00930','QZ-9EM-17-00932','QZ-9EM-17-90321'], artist: 'Waka Flocka Flame' },
      { title: 'Short Fuse', isrcs: ['QZ-9EM-17-00934','QZ-9EM-17-00936','QZ-9EM-17-00938','QZ-9EM-17-90323'], artist: 'Waka Flocka Flame', featuring: ['Eldorado Red','Young Scooter'] },
      { title: 'Judge For You', isrcs: ['QZ-9EM-17-00940','QZ-9EM-17-00942','QZ-9EM-17-00946','QZ-9EM-17-90325'], artist: 'Waka Flocka Flame' },
      { title: '50K Remix', isrcs: ['QZ-9EM-17-00948','QZ-9EM-17-00950','QZ-9EM-17-00952','QZ-9EM-17-90327'], artist: 'Waka Flocka Flame', featuring: ['T.I.'] },
      { title: 'Off With His Head', isrcs: ['QZ-9EM-17-00956','QZ-9EM-17-00958','QZ-9EM-17-00960','QZ-9EM-17-90329'], artist: 'Waka Flocka Flame', featuring: ['Bloody Jay','Wooh Da Kid'] },
      { title: 'Seen A Lot', isrcs: ['QZ-9EM-17-00962','QZ-9EM-17-00964','QZ-9EM-17-00968','QZ-9EM-17-90331'], artist: 'Waka Flocka Flame', featuring: ['Wooh Da Kid','Fetti Gang'] },
      { title: 'Color Blind', isrcs: ['QZ-9EM-17-00978','QZ-9EM-17-00980','QZ-9EM-17-00982','QZ-9EM-17-90335'], artist: 'Waka Flocka Flame' },
      { title: 'That Make Me', isrcs: ['QZ-9EM-17-00978','QZ-9EM-17-00980','QZ-9EM-17-00982','QZ-9EM-17-90335'], artist: 'Waka Flocka Flame', featuring: ['Chaz Gotti'] },
      { title: 'Way To The Top', isrcs: ['QZ-9EM-17-00984','QZ-9EM-17-00986','QZ-9EM-17-00988','QZ-9EM-17-90337'], artist: 'Waka Flocka Flame' },
    ];

    // ========================================
    // PRODUCTION KITS / BEAT CATALOG
    // ========================================
    this.productionKits = [
      { title: 'ANYONE KIT', type: 'Construction Kit', genre: 'Hip-Hop' },
      { title: 'BASIC BOUNCE', type: 'Construction Kit', genre: 'Hip-Hop' },
      { title: 'BE FREE KIT', type: 'Construction Kit', genre: 'R&B' },
      { title: 'COLORS KIT', type: 'Construction Kit', genre: 'Pop' },
      { title: 'CONSTRUCTION KIT', type: 'Construction Kit', genre: 'Hip-Hop' },
      { title: 'FOREVER KIT', type: 'Construction Kit', genre: 'R&B' },
      { title: 'GETAWAY KIT', type: 'Construction Kit', genre: 'R&B' },
      { title: 'GOOD LOVE KIT', type: 'Construction Kit', genre: 'R&B' },
      { title: 'LIKE U KIT', type: 'Construction Kit', genre: 'R&B' },
      { title: 'LONGEST ROAD KIT', type: 'Construction Kit', genre: 'Hip-Hop' },
      { title: 'OCEAN AVE KIT', type: 'Construction Kit', genre: 'Pop' },
      { title: 'SHORELINE KIT', type: 'Construction Kit', genre: 'Pop' },
      { title: 'SUMMER NIGHT KIT', type: 'Construction Kit', genre: 'R&B' },
      { title: 'THE BAY KIT', type: 'Construction Kit', genre: 'West Coast' },
      { title: 'BEN-GOLD-STYLE', type: 'Beat', genre: 'EDM/Trance' },
      { title: 'FARFISA', type: 'Beat', genre: 'House' },
      { title: 'FAST DISTANCE', type: 'Beat', genre: 'Trance' },
      { title: 'MARCATTO', type: 'Beat', genre: 'Classical/Hip-Hop' },
      { title: 'MELBURNIA', type: 'Beat', genre: 'Melbourne Bounce' },
      { title: 'PAPYRUS', type: 'Beat', genre: 'World/Hip-Hop' },
      { title: 'PEDAL TONE', type: 'Beat', genre: 'Classical/EDM' },
      { title: 'PIANO PIANO', type: 'Beat', genre: 'Classical' },
      { title: 'ROKIT', type: 'Beat', genre: 'EDM' },
      { title: 'SOULFUL VINYL 3', type: 'Beat', genre: 'Soul/Hip-Hop' },
      { title: 'JAZZY PAST', type: 'Beat', genre: 'Jazz/Hip-Hop' },
      { title: 'GROOVE ONE', type: 'Beat', genre: 'Funk' },
      { title: 'GROOVIN HIGH', type: 'Beat', genre: 'Jazz' },
      { title: 'SAX 4 ME', type: 'Beat', genre: 'Jazz/R&B' },
      { title: 'DESCENT', type: 'Beat', genre: 'EDM' },
      { title: 'GUITAR', type: 'Beat', genre: 'Acoustic' },
      { title: 'HYSPSTA', type: 'Beat', genre: 'Hip-Hop' },
      { title: 'INTRODUCTION TO RUBENOMICS', type: 'Beat', genre: 'Experimental' },
      { title: 'THE CAULDRON', type: 'Beat', genre: 'Trap' },
      { title: 'UHURU', type: 'Beat', genre: 'Afrobeat' },
      { title: 'XTE', type: 'Beat', genre: 'Electronic' },
    ];

    // ========================================
    // CATALOG STATS
    // ========================================
    this.stats = {
      totalASCAPWorks: 333,
      totalWakaISRCTracks: 57,
      totalFullISRCEntries: 937,
      uniqueFullISRCTitles: 377,
      totalProductionKits: this.productionKits.length,
      totalCollaborators: this.artist.notableCollaborators.length,
      recordsSold: '40,000,000+',
      publisher: 'FASTASSMAN PUBLISHING INC',
      pro: 'ASCAP',
      distributor: 'Sony Music / The Orchard',
      isrcPrefix: 'QZ-9EM-17 / QZ9EM17',
      genres: ['Hip-Hop','R&B','EDM','Trap','Pop','House','Funk','Jazz','Classical','Southern','Crunk','Afrobeat','Trance']
    };
  }

  // ========================
  // API METHODS
  // ========================

  getArtistProfile() {
    return this.artist;
  }

  getWakaProfile() {
    return this.wakaFlocka;
  }

  getPublisher() {
    return this.publisher;
  }

  getCatalogStats() {
    return this.stats;
  }

  getASCAPWorks(page = 1, limit = 50) {
    const start = (page - 1) * limit;
    const works = this.ascapWorks.slice(start, start + limit);
    return {
      works,
      total: this.ascapWorks.length,
      page,
      pages: Math.ceil(this.ascapWorks.length / limit)
    };
  }

  getWakaISRCTracks(page = 1, limit = 50) {
    const start = (page - 1) * limit;
    const tracks = this.wakaISRC.slice(start, start + limit);
    return {
      tracks,
      total: this.wakaISRC.length,
      page,
      pages: Math.ceil(this.wakaISRC.length / limit)
    };
  }

  getProductionKits() {
    return this.productionKits;
  }

  searchCatalog(query) {
    const q = query.toLowerCase();
    const results = {
      ascapWorks: this.ascapWorks.filter(w => w.title.toLowerCase().includes(q)),
      wakaISRC: this.wakaISRC.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.featuring && t.featuring.some(f => f.toLowerCase().includes(q)))
      ),
      kits: this.productionKits.filter(k => k.title.toLowerCase().includes(q))
    };
    results.totalResults = results.ascapWorks.length + results.wakaISRC.length + results.kits.length;
    return results;
  }

  getByGenre(genre) {
    const g = genre.toLowerCase();
    return {
      ascapWorks: this.ascapWorks.filter(w => w.genre && w.genre.toLowerCase().includes(g)),
      kits: this.productionKits.filter(k => k.genre.toLowerCase().includes(g))
    };
  }

  getFeaturedCollabs() {
    const collabs = [];
    this.ascapWorks.forEach(w => {
      if (w.featuring && w.featuring.length > 0) {
        collabs.push({ title: w.title, featuring: w.featuring, source: 'ASCAP' });
      }
    });
    this.wakaISRC.forEach(t => {
      if (t.featuring && t.featuring.length > 0) {
        collabs.push({ title: t.title, featuring: t.featuring, artist: t.artist, source: 'ISRC' });
      }
    });
    return collabs;
  }

  getFullDashboard() {
    return {
      artist: this.artist,
      waka: this.wakaFlocka,
      publisher: this.publisher,
      stats: this.stats,
      featuredWorks: this.ascapWorks.filter(w => w.featuring || w.tier).slice(0, 20),
      recentWaka: this.wakaISRC.slice(0, 10),
      kits: this.productionKits.slice(0, 10),
      topCollaborators: this.artist.notableCollaborators.slice(0, 15)
    };
  }
}

module.exports = new RealCatalog();