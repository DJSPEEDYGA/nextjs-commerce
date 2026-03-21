class OfficeVault {
  constructor() {
    this.documents = [];
    this.catalogData = {
      djSpeedy: [],
      wakaFlocka: []
    };
    this.metadata = {
      totalDocuments: 0,
      totalSize: '0 MB',
      lastUpdated: new Date().toISOString()
    };
    this.loadVaultData();
  }

  loadVaultData() {
    // Load uploaded catalog files
    this.catalogData.djSpeedy = [
      {
        title: 'FASTASSMAN PUBLISHING INC - ASCAP Works',
        files: [
          'WorksCatalogFASTASSMAN PUBLISHING INC ASCAP 3.pdf',
          'WorksCatalogFASTASSMAN PUBLISHING INC ASCAP 4.pdf',
          'WorksCatalogFASTASSMAN PUBLISHING INC ASCAP.csv'
        ],
        type: 'ASCAP',
        recordCount: 712,
        lastUpdated: '2026-03-20'
      },
      {
        title: 'Speedy Splits Catalog',
        files: ['Speedy Splits - 05_16_19 CATALOG.numbers'],
        type: 'SPLITS',
        recordCount: 156,
        lastUpdated: '2019-05-16'
      },
      {
        title: 'BSM Publishing Metadata',
        files: ['Catalog Metadata_BSM Publishing.xlsx'],
        type: 'METADATA',
        recordCount: 712,
        lastUpdated: '2026-03-20'
      },
      {
        title: 'SoundExchange ISRC Catalog',
        files: ['SOUNDEXCHANGE ISRC CATALOG.xlsx'],
        type: 'ISRC',
        recordCount: 976,
        lastUpdated: '2026-03-20'
      }
    ];

    this.catalogData.wakaFlocka = [
      {
        title: 'Waka Flocka - Merged Song Catalog',
        files: [
          'WAKA - MERGED SONG CATALOG - ASCAP_SX .xlsx',
          'WAKA - MERGED SONG CATALOG - SoundExchange.xlsx',
          'WAKA - MERGED SONG CATALOG - ISRC QZEM1.xlsx',
          'WAKA - MERGED SONG CATALOG - Juaquin Malphurs ASCAP.xlsx',
          'WAKA - MERGED SONG CATALOG - Completed Songs.xlsx',
          'WAKA - MERGED SONG CATALOG - ISRC Codes.xlsx'
        ],
        type: 'MERGED_CATALOG',
        recordCount: 5235,
        lastUpdated: '2026-03-20'
      },
      {
        title: 'Music Reports Publishing Catalog',
        files: [
          'Music Reports publishing_catalog_WAKA.xlsx',
          'Music Reports publishing_catalog_WAKA 2.xlsx'
        ],
        type: 'MUSIC_REPORTS',
        recordCount: 2000,
        lastUpdated: '2026-03-20'
      },
      {
        title: 'SoundExchange Artist Catalog',
        files: ['associated_1000071571_Artist_Catalog_2022-01-17_20-18-17 2.xlsx'],
        type: 'SOUNDEXCHANGE',
        recordCount: 915,
        lastUpdated: '2022-01-17'
      },
      {
        title: 'ISRC Codes - QZ-9EM-17',
        files: [
          'ISRC - QZEM1.xlsx',
          'iSRC Codes - QZ-9EM-17.xlsx'
        ],
        type: 'ISRC',
        recordCount: 944,
        lastUpdated: '2026-03-20'
      },
      {
        title: 'MLC Royalty Catalog',
        files: ['MLC_Royalty_Catalog.xlsx'],
        type: 'MLC',
        recordCount: 6,
        lastUpdated: '2026-03-20'
      }
    ];

    this.documents = [
      {
        id: 'doc1',
        title: 'MASTER PDF OF GOAT APP',
        files: ['MASTER PDF OF GOAT APP.pdf', 'MASTER PDF OF GOAT APP 2.pdf'],
        type: 'APP_DOCUMENTATION',
        category: 'Technical',
        size: '2.4 MB',
        uploaded: '2026-03-20'
      },
      {
        id: 'doc2',
        title: 'GOAT App Assets',
        files: [
          'Superhero Goat (1).png',
          '20250416_1815_Musical Superhero Adventure_remix_01js0mxpqdeenazwn79gs0fx1r.png',
          '20250415_1802_Superhero Street Style_remix_01jry1smf4egcbdf6dz7d4bc1a.png',
          '20250416_1810_Gangster Nerd Adventures_simple_compose_01js0mq5xneznr7nh5d3xtg3v7 (1).mp4'
        ],
        type: 'ASSETS',
        category: 'Media',
        size: '15.8 MB',
        uploaded: '2026-04-15'
      }
    ];

    this.metadata.totalDocuments = this.documents.length + 
      this.catalogData.djSpeedy.length + 
      this.catalogData.wakaFlocka.length;
    this.metadata.totalSize = '18.2 MB';
  }

  getAllDocuments() {
    return {
      success: true,
      documents: this.documents,
      catalogData: this.catalogData,
      metadata: this.metadata
    };
  }

  getDJSpeedyCatalog() {
    return {
      success: true,
      artist: 'DJ Speedy',
      catalog: this.catalogData.djSpeedy,
      totalRecords: this.catalogData.djSpeedy.reduce((sum, cat) => sum + cat.recordCount, 0)
    };
  }

  getWakaFlockaCatalog() {
    return {
      success: true,
      artist: 'Waka Flocka Flame',
      catalog: this.catalogData.wakaFlocka,
      totalRecords: this.catalogData.wakaFlocka.reduce((sum, cat) => sum + cat.recordCount, 0)
    };
  }

  getDocumentById(id) {
    return this.documents.find(doc => doc.id === id);
  }

  searchDocuments(query) {
    const q = query.toLowerCase();
    const results = {
      documents: this.documents.filter(doc => 
        doc.title.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q)
      ),
      djSpeedy: this.catalogData.djSpeedy.filter(cat => 
        cat.title.toLowerCase().includes(q) ||
        cat.type.toLowerCase().includes(q)
      ),
      wakaFlocka: this.catalogData.wakaFlocka.filter(cat => 
        cat.title.toLowerCase().includes(q) ||
        cat.type.toLowerCase().includes(q)
      )
    };
    return {
      success: true,
      query: query,
      results: results,
      totalMatches: results.documents.length + results.djSpeedy.length + results.wakaFlocka.length
    };
  }

  addDocument(doc) {
    doc.id = `doc${Date.now()}`;
    doc.uploaded = new Date().toISOString();
    this.documents.push(doc);
    this.metadata.totalDocuments++;
    return { success: true, document: doc };
  }

  getVaultStats() {
    return {
      success: true,
      stats: {
        totalDocuments: this.documents.length,
        djSpeedyCatalogs: this.catalogData.djSpeedy.length,
        wakaFlockaCatalogs: this.catalogData.wakaFlocka.length,
        totalRecords: 
          this.catalogData.djSpeedy.reduce((sum, cat) => sum + cat.recordCount, 0) +
          this.catalogData.wakaFlocka.reduce((sum, cat) => sum + cat.recordCount, 0),
        totalSize: this.metadata.totalSize,
        categories: {
          ASCAP: this.catalogData.djSpeedy.filter(c => c.type === 'ASCAP').length,
          ISRC: this.catalogData.djSpeedy.filter(c => c.type === 'ISRC').length +
                this.catalogData.wakaFlocka.filter(c => c.type === 'ISRC').length,
          SOUNDEXCHANGE: this.catalogData.wakaFlocka.filter(c => c.type === 'SOUNDEXCHANGE').length,
          MLC: this.catalogData.wakaFlocka.filter(c => c.type === 'MLC').length
        }
      }
    };
  }
}

module.exports = new OfficeVault();