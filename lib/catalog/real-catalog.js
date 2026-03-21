/***********************************************************************
 * GOAT CONNECT — REAL CATALOG ENGINE v2.0 (EXPANDED)
 * =====================================================================
 * FASTASSMAN PUBLISHING INC (ASCAP) × BRICK SQUAD MONOPOLY PUBLISHING
 * Harvey Lee Miller Jr. (DJ Speedy) × Waka Flocka Flame (Juaquin Malphurs)
 * 
 * 3,077 UNIQUE SONGS — Cross-referenced from 10 data sources:
 *   • ASCAP Fastassman Publishing (333 works)
 *   • ASCAP Waka/Juaquin Malphurs (838 works)
 *   • BSM Publishing Metadata (503 works)
 *   • Music Reports / Waka Publishing (503 works)
 *   • SoundExchange ISRC Catalog (748 tracks)
 *   • SoundExchange Artist Catalog (700 tracks)
 *   • ISRC QZEM1 Registry (368 tracks)
 *   • Harvey L Miller Writers Catalog (1,605 works)
 *   • MLC Royalty Catalog (mechanical rights)
 *   • iSRC Codes QZ-9EM-17 (57 Waka tracks)
 *
 * 1,737 ISRC codes | 1,151 ISWC codes | 596 featured collabs
 * 13 albums | 8 labels | 1,050+ unique writers
 * 40+ MILLION records sold (RIAA confirmed)
 * 
 * © GOAT Systems — Zero Cloud. Zero Tracking. All Rights Reserved.
 ***********************************************************************/

const path = require('path');
const fs = require('fs');

class RealCatalog {
  constructor() {
    this.version = '2.0.0';
    
    // Load master data
    const dataPath = path.join(__dirname, 'master-data.json');
    this.masterData = {};
    try {
      this.masterData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch(e) {
      console.error('⚠️ Could not load master catalog data:', e.message);
    }

    // Build indexes
    this._buildIndexes();

    // ========================================
    // PUBLISHER PROFILES
    // ========================================
    this.publishers = {
      fastassman: {
        name: 'FASTASSMAN PUBLISHING INC',
        partyId: '60881',
        pro: 'ASCAP',
        ipiNumber: '348585814',
        adminPublisher: 'ROYNET MUSIC',
        adminIPI: '339668123'
      },
      bsm: {
        name: 'BRICK SQUAD MONOPOLY PUBLISHING',
        publisherId: '390547347',
        pro: 'ASCAP',
        contact: 'CRYSTAL@BSMMUSIC.COM',
        address: '339 MORGAN PL SE ATLANTA, GA 30317',
        territory: 'WORLDWIDE'
      }
    };

    // ========================================
    // ARTIST PROFILES
    // ========================================
    this.artist = {
      id: 'dj-speedy',
      name: 'DJ Speedy',
      realName: 'Harvey Lee Miller Jr.',
      aliases: ['DJ Speedy', 'Harvey Miller', 'FASTASSMAN', 'Speedy Productions', 'HARVEY L MILLER'],
      ipiNumber: '348202968',
      emoji: '🎧',
      bio: 'Multi-Platinum Super Producing Composer with 40+ million records sold (RIAA confirmed). World-renowned veteran DJ in Hip Hop and EDM. Classical music trained, Atlanta-based pioneer. Producer credits include Beyoncé, Jay-Z, Outkast, Waka Flocka, Gucci Mane, Nicki Minaj, 2 Chainz, T.I., Flo Rida, and more. Film/TV compositions for Marvel, MTV, CBS, FOX, NBC, VH1.',
      city: 'Atlanta', state: 'GA', country: 'USA',
      hometown: 'Orangeburg, South Carolina',
      companies: [
        'Speedy Productions, Inc.', 'Fastassman Publishing Inc.',
        'Life Imitates Art Inc.', 'HarveyMillerMusic Inc.',
        'Brick Squad Music LLC', 'GOAT Systems'
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
        'Shawty Redd', 'Young Thug', 'French Montana', 'Rocko', 'Killer Mike'
      ],
      filmTV: ['Marvel', 'MTV', 'CBS', 'FOX', 'NBC', 'VH1', 'Judge Joe Brown'],
      socialLinks: {
        twitter: '@WHOISHARVEY',
        linkedin: 'https://www.linkedin.com/in/djspeedy',
        github: 'https://github.com/DJSPEEDYGA'
      }
    };

    this.wakaFlocka = {
      id: 'waka-flocka',
      name: 'Waka Flocka Flame',
      realName: 'Juaquin James Malphurs',
      ipiNumber: '574736122',
      emoji: '🔥',
      bio: 'ATL trap pioneer. Flockaveli. HARD IN DA PAINT. No Hands. Brick Squad Monopoly. Over 900 registered works across ASCAP and SoundExchange.',
      city: 'Atlanta', state: 'GA', country: 'USA',
      labels: ['Brick Squad Monopoly / 1017', 'RBC Records', 'Bricksquad Monopoly Money'],
      registrant: '36 BRICKHOUSE PERFORMANCE, INC.',
      payeeId: '1000071571',
      genres: ['Hip-Hop', 'Trap', 'Crunk', 'Southern Rap'],
      tier: 'Legend',
      albums: [
        'Flockaveli', 'DuFlocka Rant 2', 'Brick Factory 2', 'Twin Towers 1',
        'LeBron Flocka James 1', 'LeBron Flocka James 3', 'LeBron Flocka James 4',
        'Mollywood', 'Waka Flocka Myers 3', 'Waka Flocka Myers 9',
        'Salute Me or Shoot Me 2', 'Brick Squad Boyz', 'Married to da Trap Vol. 1'
      ]
    };

    // ========================================
    // CATALOG STATS
    // ========================================
    this.stats = {
      totalUniqueSongs: Object.keys(this.masterData).length,
      songsWithISRC: this._songsWithField('isrcs'),
      songsWithISWC: this._songsWithField('iswcs'),
      crossReferencedSongs: this._multiSourceSongs(),
      totalISRCs: this._totalField('isrcs'),
      totalISWCs: this._totalField('iswcs'),
      featuredCollabs: this._featuredCount(),
      totalAlbums: 13,
      totalLabels: 8,
      recordsSold: '40,000,000+',
      publishers: ['FASTASSMAN PUBLISHING INC', 'BRICK SQUAD MONOPOLY PUBLISHING'],
      pro: 'ASCAP',
      distributor: 'Sony Music / The Orchard',
      isrcPrefixes: ['QZ-9EM-17', 'QZ9EM17', 'USCRP', 'USA37', 'QM6N2', 'USWB1', 'USUYG', 'QMRSZ'],
      dataSources: [
        'ASCAP Fastassman Publishing',
        'ASCAP Waka/Juaquin Malphurs',
        'BSM Publishing Metadata',
        'Music Reports / Waka Publishing',
        'SoundExchange ISRC Catalog',
        'SoundExchange Artist Catalog',
        'ISRC QZEM1 Registry',
        'Harvey L Miller Writers Catalog',
        'MLC Royalty Catalog',
        'iSRC Codes QZ-9EM-17'
      ],
      genres: ['Hip-Hop','R&B','EDM','Trap','Pop','House','Funk','Jazz','Classical','Southern','Crunk','Afrobeat','Trance']
    };
  }

  // ========================
  // INDEX BUILDERS
  // ========================

  _buildIndexes() {
    this._bySource = {};
    this._byAlbum = {};
    this._featured = [];
    
    for (const [key, song] of Object.entries(this.masterData)) {
      // Index by source
      for (const src of song.sources || []) {
        if (!this._bySource[src]) this._bySource[src] = [];
        this._bySource[src].push(song);
      }
      // Index by album
      for (const alb of song.albums || []) {
        if (!this._byAlbum[alb]) this._byAlbum[alb] = [];
        this._byAlbum[alb].push(song);
      }
      // Featured collabs
      if (song.title && song.title.toUpperCase().includes('FEAT')) {
        this._featured.push(song);
      }
    }
  }

  _songsWithField(field) {
    return Object.values(this.masterData).filter(s => s[field] && s[field].length > 0).length;
  }

  _totalField(field) {
    return Object.values(this.masterData).reduce((sum, s) => sum + (s[field] ? s[field].length : 0), 0);
  }

  _multiSourceSongs() {
    return Object.values(this.masterData).filter(s => s.sources && s.sources.length > 1).length;
  }

  _featuredCount() {
    return Object.values(this.masterData).filter(s => s.title && s.title.toUpperCase().includes('FEAT')).length;
  }

  // ========================
  // API METHODS
  // ========================

  getArtistProfile() { return this.artist; }
  getWakaProfile() { return this.wakaFlocka; }
  getPublishers() { return this.publishers; }
  getCatalogStats() { return this.stats; }

  getAllSongs(page = 1, limit = 50, sortBy = 'title') {
    let songs = Object.values(this.masterData);
    if (sortBy === 'title') songs.sort((a,b) => (a.title||'').localeCompare(b.title||''));
    else if (sortBy === 'sources') songs.sort((a,b) => (b.sources||[]).length - (a.sources||[]).length);
    else if (sortBy === 'isrcs') songs.sort((a,b) => (b.isrcs||[]).length - (a.isrcs||[]).length);
    const start = (page - 1) * limit;
    return {
      songs: songs.slice(start, start + limit),
      total: songs.length,
      page, pages: Math.ceil(songs.length / limit)
    };
  }

  getSongsBySource(source, page = 1, limit = 50) {
    const songs = this._bySource[source] || [];
    const start = (page - 1) * limit;
    return {
      songs: songs.slice(start, start + limit),
      total: songs.length, page,
      pages: Math.ceil(songs.length / limit)
    };
  }

  getSongsByAlbum(album) {
    return this._byAlbum[album] || [];
  }

  getAlbums() {
    return Object.keys(this._byAlbum).map(name => ({
      name, trackCount: this._byAlbum[name].length
    }));
  }

  getFeaturedCollabs(page = 1, limit = 50) {
    const start = (page - 1) * limit;
    return {
      songs: this._featured.slice(start, start + limit),
      total: this._featured.length, page,
      pages: Math.ceil(this._featured.length / limit)
    };
  }

  searchCatalog(query) {
    if (!query || query.length < 2) return { songs: [], total: 0 };
    const q = query.toLowerCase();
    const results = Object.values(this.masterData).filter(s => {
      if (s.title && s.title.toLowerCase().includes(q)) return true;
      if (s.writers && s.writers.some(w => w.toLowerCase().includes(q))) return true;
      if (s.albums && s.albums.some(a => a.toLowerCase().includes(q))) return true;
      if (s.isrcs && s.isrcs.some(i => i.toLowerCase().includes(q))) return true;
      if (s.labels && s.labels.some(l => l.toLowerCase().includes(q))) return true;
      return false;
    });
    return { songs: results.slice(0, 100), total: results.length };
  }

  getTopCrossReferenced(limit = 50) {
    return Object.values(this.masterData)
      .filter(s => s.sources.length > 1)
      .sort((a,b) => b.sources.length - a.sources.length)
      .slice(0, limit);
  }

  getSources() {
    const sources = {};
    for (const [src, songs] of Object.entries(this._bySource)) {
      sources[src] = songs.length;
    }
    return sources;
  }

  getFullDashboard() {
    const topFeatured = this._featured
      .sort((a,b) => (b.sources||[]).length - (a.sources||[]).length)
      .slice(0, 20);
    
    const topCrossRef = this.getTopCrossReferenced(10);

    return {
      artist: this.artist,
      waka: this.wakaFlocka,
      publishers: this.publishers,
      stats: this.stats,
      featuredWorks: topFeatured,
      topCrossReferenced: topCrossRef,
      albums: this.getAlbums(),
      sources: this.getSources(),
      topCollaborators: this.artist.notableCollaborators
    };
  }
}

module.exports = new RealCatalog();