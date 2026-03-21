/**
 * Waka Flocka Flames Rap Dictionary
 * Comprehensive hip-hop and trap slang with definitions, examples, and references
 */

class WakaFlamesDictionary {
  constructor() {
    // Main dictionary with terms, definitions, examples, and categories
    this.terms = [
      // ==================== TRAP MUSIC TERMS ====================
      {
        term: "Trap",
        definition: "A style of hip-hop music originating in Atlanta, characterized by rolling hi-hats, 808 bass, and lyrics about drug dealing and street life",
        examples: [
          "Running through the 6 with my woes",
          "Trap house jumping like it's gymnastics"
        ],
        category: "Trap Music",
        wakaReference: "Waka Flocka is one of the pioneers of trap music, popularizing the sound nationwide"
      },
      {
        term: "Brick Squad",
        definition: "Waka Flocka's record label and crew, representing his team and brand",
        examples: [
          "Brick Squad monopoly, yeah we run this city",
          "Brick Squad in the building"
        ],
        category: "Waka Flocka",
        wakaReference: "Brick Squad Monopoly is Waka's label that launched his career and many other Atlanta artists"
      },
      {
        term: "Flocka",
        definition: "Nickname and brand name derived from Waka Flocka Flame",
        examples: [
          "Waka Flocka Flame",
          "Flockaveli"
        ],
        category: "Waka Flocka",
        wakaReference: "His stage name pays homage to Tupac's 'Makaveli' and 'Flocka' meaning 'one who is crazy' in Jamaican patois"
      },
      {
        term: "O Let's Do It",
        definition: "Waka's breakout hit that became an anthem in 2010",
        examples: [
          "O let's do it, o let's do it",
          "Real talk I don't need to prove it"
        ],
        category: "Waka Flocka",
        wakaReference: "This single catapulted Waka to stardom and established the Atlanta trap sound nationally"
      },
      {
        term: "No Hands",
        definition: "One of Waka's biggest hits featuring Roscoe Dash and Wale",
        examples: [
          "Girl the way you're movin' got me in a trance",
          "No hands, you can do it with no hands"
        ],
        category: "Waka Flocka",
        wakaReference: "This anthem reached #13 on Billboard Hot 100 and became a club staple"
      },
      
      // ==================== STREET & DRUG TERMS ====================
      {
        term: "Bando",
        definition: "Abandoned house used for drug dealing and storage (short for 'abandoned')",
        examples: [
          "Riding round in a bando",
          "Trap house, bando, what's the difference?"
        ],
        category: "Street Slang",
        wakaReference: "Frequently mentioned in trap music as the location of operations"
      },
      {
        term: "Plug",
        definition: "A supplier or connection for drugs or other illicit goods",
        examples: [
          "I got the plug on everything",
          "My plug is the real deal"
        ],
        category: "Street Slang",
        wakaReference: "Essential term in trap culture for maintaining supply chains"
      },
      {
        term: "Serving",
        definition: "Selling drugs or being active in the drug trade",
        examples: [
          "I've been serving since I was 16",
          "They know I'm serving on the block"
        ],
        category: "Street Slang",
        wakaReference: "Common theme in Waka's music discussing his past"
      },
      {
        term: "Work",
        definition: "Drugs, cocaine, or any product being sold",
        examples: [
          "Moving work through the city",
          "Got that work coming in"
        ],
        category: "Street Slang",
        wakaReference: "Central term in trap music about the business"
      },
      {
        term: "Whip",
        definition: "Car, usually an expensive or modified vehicle",
        examples: [
          "Pulling up in a foreign whip",
          "My whip cost more than your house"
        ],
        category: "Vehicle Slang",
        wakaReference: "Waka often references luxury cars in his lyrics"
      },
      
      // ==================== MONEY & SUCCESS TERMS ====================
      {
        term: "Bread",
        definition: "Money, especially a significant amount",
        examples: [
          "I'm stacking bread",
          "Got that long bread"
        ],
        category: "Money Slang",
        wakaReference: "Used frequently when discussing success and wealth"
      },
      {
        term: "Stack",
        definition: "$1,000 or a pile of money",
        examples: [
          "Making stacks on stacks",
          "Got a stack in my pocket"
        ],
        category: "Money Slang",
        wakaReference: "Common measurement of wealth in hip-hop"
      },
      {
        term: "Bands",
        definition: "$1,000 bills or large amounts of money",
        examples: [
          "Making bands and bands",
          "Counting up these bands"
        ],
        category: "Money Slang",
        wakaReference: "Popularized in trap music as a symbol of success"
      },
      {
        term: "Balling",
        definition: "Living lavishly, being wealthy and successful",
        examples: [
          "I'm balling out of control",
          "Balling like an athlete"
        ],
        category: "Money Slang",
        wakaReference: "Waka represents the baller lifestyle in his music"
      },
      {
        term: "Flex",
        definition: "To show off wealth, status, or accomplishments",
        examples: [
          "Flexing on them",
          "It's not a flex, it's facts"
        ],
        category: "Money Slang",
        wakaReference: "Trap artists frequently flex their success"
      },
      
      // ==================== RELATIONSHIP TERMS ====================
      {
        term: "Thot",
        definition: "That Hoe Over There - derogatory term for promiscuous women",
        examples: [
          "She's a thot",
          "No thots allowed"
        ],
        category: "Relationship Slang",
        wakaReference: "Controversial term popularized in trap music"
      },
      {
        term: "Bae",
        definition: "Before Anyone Else - term for significant other",
        examples: [
          "My bae is the realest",
          "She's my bae"
        ],
        category: "Relationship Slang",
        wakaReference: "Affectionate term used in modern hip-hop"
      },
      {
        term: "Side Chick",
        definition: "A woman who is not the main girlfriend but has a relationship with a man",
        examples: [
          "Don't let your side chick know",
          "Main chick vs side chick"
        ],
        category: "Relationship Slang",
        wakaReference: "Common theme in trap music about relationships"
      },
      {
        term: "Main",
        definition: "Primary partner or girlfriend",
        examples: [
          "She's my main",
          "Main chick only"
        ],
        category: "Relationship Slang",
        wakaReference: "Term used to distinguish primary relationships"
      },
      
      // ==================== ATTITUDE & BEHAVIOR TERMS ====================
      {
        term: "Turnt",
        definition: "Extremely excited, wild, or intoxicated",
        examples: [
          "We turnt up tonight",
          "Getting turnt in the club"
        ],
        category: "Behavior Slang",
        wakaReference: "Waka Flocka epitomizes the turnt lifestyle"
      },
      {
        term: "Lit",
        definition: "Exciting, excellent, or intoxicated",
        examples: [
          "This party is lit",
          "Everything is lit"
        ],
        category: "Behavior Slang",
        wakaReference: "Essential term in modern hip-hop vocabulary"
      },
      {
        term: "Savage",
        definition: "Fierce, ruthless, or extremely impressive",
        examples: [
          "She's a savage",
          "Savage mode activated"
        ],
        category: "Behavior Slang",
        wakaReference: "Waka embodies the savage attitude in his music"
      },
      {
        term: "Go Hard",
        definition: "To give maximum effort or be extremely impressive",
        examples: [
          "We go hard every day",
          "Go hard or go home"
        ],
        category: "Behavior Slang",
        wakaReference: "Waka's motto and approach to music"
      },
      {
        term: "Goon",
        definition: "A tough, aggressive person or henchman",
        examples: [
          "My goons will handle it",
          "Goon squad"
        ],
        category: "Behavior Slang",
        wakaReference: "Term for loyal crew members"
      },
      
      // ==================== ADJECTIVES & DESCRIPTORS ====================
      {
        term: "Dope",
        definition: "Excellent, cool, or impressive",
        examples: [
          "That's dope",
          "Everything we do is dope"
        ],
        category: "Adjectives",
        wakaReference: "Classic hip-hop term for quality"
      },
      {
        term: "Fresh",
        definition: "New, stylish, or clean appearance",
        examples: [
          "I'm looking fresh",
          "Fresh kicks"
        ],
        category: "Adjectives",
        wakaReference: "Important in hip-hop fashion and style"
      },
      {
        term: "Ice",
        definition: "Jewelry, especially diamonds",
        examples: [
          "Ice on my wrist",
          "All this ice"
        ],
        category: "Fashion Slang",
        wakaReference: "Rappers frequently display ice as status symbols"
      },
      {
        term: "Drip",
        definition: "Style, fashion sense, or appearance",
        examples: [
          "Got that drip",
          "Drip check"
        ],
        category: "Fashion Slang",
        wakaReference: "Modern term for fashion and swag"
      },
      {
        term: "Swag",
        definition: "Confidence, style, or cool demeanor",
        examples: [
          "Swag on a hundred thousand trillion",
          "Too much swag"
        ],
        category: "Fashion Slang",
        wakaReference: "Waka is known for his swag and confidence"
      },
      
      // ==================== ATLANTA SPECIFIC TERMS ====================
      {
        term: "Zone 1",
        definition: "West Atlanta, specifically Bankhead area",
        examples: [
          "Representing Zone 1",
          "Zone 1 to Zone 6"
        ],
        category: "Atlanta Zones",
        wakaReference: "Atlanta is divided into 6 zones, each with unique character"
      },
      {
        term: "Zone 3",
        definition: "Southeast Atlanta, Waka Flocka's home zone",
        examples: [
          "Zone 3 stand up",
          "From Zone 3 to the world"
        ],
        category: "Atlanta Zones",
        wakaReference: "Waka Flocka represents Zone 3 (Riverdale/Forest Park area)"
      },
      {
        term: "Zone 6",
        definition: "East Atlanta, home of Gucci Mane and Future",
        examples: [
          "Zone 6 what it do",
          "Zone 6 to the death"
        ],
        category: "Atlanta Zones",
        wakaReference: "Most famous zone in trap music history"
      },
      {
        term: "Bankhead",
        definition: "Historic Atlanta neighborhood and highway",
        examples: [
          "Bankhead bouncing",
          "Straight out of Bankhead"
        ],
        category: "Atlanta",
        wakaReference: "Legendary area that birthed many Atlanta rappers"
      },
      {
        term: "The A",
        definition: "Nickname for Atlanta, Georgia",
        examples: [
          "Welcome to the A",
          "Rep the A"
        ],
        category: "Atlanta",
        wakaReference: "Atlanta is the capital of trap music"
      },
      
      // ==================== WAKA SPECIFIC TRACKS ====================
      {
        term: "Flockaveli",
        definition: "Waka Flocka's debut album (2010), a trap masterpiece",
        examples: [
          "Flockaveli the classic",
          "Bang bang pow pow, Flockaveli"
        ],
        category: "Waka Albums",
        wakaReference: "This album defined the trap sound and went gold"
      },
      {
        term: "Hard in da Paint",
        definition: "One of Waka's most aggressive and influential tracks",
        examples: [
          "I go hard in the paint",
          "Hard in da paint, nigga"
        ],
        category: "Waka Tracks",
        wakaReference: "Anthem for going hard and giving maximum effort"
      },
      {
        term: "Grove St. Party",
        definition: "Hit featuring Kebo Gotti, sampled by countless artists",
        examples: [
          "Grove Street Party",
          "Pull up in the Phantom, yeah we party"
        ],
        category: "Waka Tracks",
        wakaReference: "Club anthem that defined the party scene"
      },
      
      // ==================== MODERN TRAP TERMS ====================
      {
        term: "Flexing",
        definition: "Showing off or displaying wealth and success",
        examples: [
          "Flexing on Instagram",
          "No flexing zone"
        ],
        category: "Modern Trap",
        wakaReference: "Waka was one of the original flexers"
      },
      {
        term: "No Flex Zone",
        definition: "An area or situation where showing off is not allowed or unnecessary",
        examples: [
          "This a no flex zone",
          "Rae Sremmurd - No Flex Zone"
        ],
        category: "Modern Trap",
        wakaReference: "Popular phrase in modern hip-hop culture"
      },
      {
        term: "Running Man",
        definition: "Dance move popularized in trap music",
        examples: [
          "Do the Running Man",
          "Running Man challenge"
        ],
        category: "Dance",
        wakaReference: "Trap music always has accompanying dance crazes"
      },
      {
        term: "Dab",
        definition: "A dance move and gesture popularized in hip-hop",
        examples: [
          "Hit the dab",
          "Dab on them haters"
        ],
        category: "Dance",
        wakaReference: "Migos popularized this, but it spread through trap culture"
      },
      
      // ==================== PRODUCTION TERMS ====================
      {
        term: "808",
        definition: "Roland TR-808 drum machine bass sound, essential to trap music",
        examples: [
          "That 808 hitting hard",
          "808s and Heartbreak"
        ],
        category: "Production",
        wakaReference: "The foundation of trap music's signature sound"
      },
      {
        term: "Hi-Hats",
        definition: "Cymbals in drum kits, trap uses rapid, rolling hi-hats",
        examples: [
          "Rolling hi-hats",
          "Trap hi-hats"
        ],
        category: "Production",
        wakaReference: "The rapid hi-hat pattern is signature trap sound"
      },
      {
        term: "Snare",
        definition: "Sharp drum sound that provides the backbone of beats",
        examples: [
          "That snare is crazy",
          "Heavy snare"
        ],
        category: "Production",
        wakaReference: "Trap snares are known for being sharp and aggressive"
      },
      {
        term: "Lex Luger",
        definition: "Legendary producer who created the trap sound with Waka Flocka",
        examples: [
          "Lex Luger beat",
          "Lex Luger sound"
        ],
        category: "Production",
        wakaReference: "Lex Luger produced most of Flockaveli and defined trap production"
      },
      
      // ==================== LIFESTYLE TERMS ====================
      {
        term: "Ratchet",
        definition: "Ghetto, messy, or wild behavior/appearance",
        examples: [
          "She's ratchet",
          "Ratchet behavior"
        ],
        category: "Lifestyle",
        wakaReference: "Term embraced by trap culture"
      },
      {
        term: "Twerk",
        definition: "Dance move involving hip thrusts and booty shaking",
        examples: [
          "Twerk team",
          "Twerk it"
        ],
        category: "Lifestyle",
        wakaReference: "Essential part of trap music and club culture"
      },
      {
        term: "Ride or Die",
        definition: "Loyally sticking with someone through anything",
        examples: [
          "She's my ride or die",
          "Ride or die chick"
        ],
        category: "Lifestyle",
        wakaReference: "Important concept in street culture and relationships"
      },
      {
        term: "Hustle",
        definition: "Working hard, grinding, or making money by any means",
        examples: [
          "Hustle hard",
          "On my hustle"
        ],
        category: "Lifestyle",
        wakaReference: "Central theme in Waka's music and personal story"
      },
      
      // ==================== NEGATIVE TERMS ====================
      {
        term: "Hater",
        definition: "Someone who dislikes or tries to bring down others' success",
        examples: [
          "Ignore the haters",
          "Haters gonna hate"
        ],
        category: "Negative Terms",
        wakaReference: "Trap artists frequently address haters in their music"
      },
      {
        term: "Snake",
        definition: "Traitor or untrustworthy person",
        examples: [
          "Don't trust these snakes",
          "Snake in the grass"
        ],
        category: "Negative Terms",
        wakaReference: "Warning about fake friends is common in trap music"
      },
      {
        term: "Op",
        definition: "Opposition, enemy, or rival",
        examples: [
          "Fuck the opps",
          "Opps watching"
        ],
        category: "Negative Terms",
        wakaReference: "Short for opposition, used in Chicago drill and trap"
      },
      {
        term: "Fake",
        definition: "Inauthentic or pretending to be something you're not",
        examples: [
          "Stay away from fakes",
          "Real recognize real"
        ],
        category: "Negative Terms",
        wakaReference: "Authenticity is highly valued in trap culture"
      },
      
      // ==================== POSITIVE TERMS ====================
      {
        term: "Real",
        definition: "Authentic, genuine, or true to oneself",
        examples: [
          "Stay real",
          "Real recognize real"
        ],
        category: "Positive Terms",
        wakaReference: "Being real is the ultimate compliment in trap culture"
      },
      {
        term: "Boss",
        definition: "Leader, someone in charge, or successful person",
        examples: [
          "I'm the boss",
          "Boss moves only"
        ],
        category: "Positive Terms",
        wakaReference: "Waka is often referred to as a boss in the industry"
      },
      {
        term: "King",
        definition: "Ruler or person at the top of their game",
        examples: [
          "Trap king",
          "King of the A"
        ],
        category: "Positive Terms",
        wakaReference: "Waka is considered one of the kings of trap music"
      },
      {
        term: "Legend",
        definition: "Someone who has achieved legendary status",
        examples: [
          "Waka is a legend",
          "Living legend"
        ],
        category: "Positive Terms",
        wakaReference: "Waka Flocka has legendary status in hip-hop"
      }
    ];
    
    // Categories for filtering
    this.categories = [
      "Waka Flocka", "Trap Music", "Street Slang", "Money Slang",
      "Relationship Slang", "Behavior Slang", "Adjectives", "Fashion Slang",
      "Atlanta Zones", "Atlanta", "Waka Albums", "Waka Tracks",
      "Modern Trap", "Dance", "Production", "Lifestyle",
      "Negative Terms", "Positive Terms", "Vehicle Slang"
    ];
    
    // Statistics
    this.stats = {
      totalTerms: this.terms.length,
      totalCategories: this.categories.length,
      wakaSpecificTerms: this.terms.filter(t => t.category === "Waka Flocka" || 
                                                      t.category === "Waka Albums" || 
                                                      t.category === "Waka Tracks").length,
      trapTerms: this.terms.filter(t => t.category === "Trap Music").length
    };
  }

  /**
   * Get all terms
   */
  getAllTerms() {
    return this.terms;
  }

  /**
   * Search for terms by query
   */
  searchTerms(query) {
    const lowerQuery = query.toLowerCase();
    return this.terms.filter(term => 
      term.term.toLowerCase().includes(lowerQuery) ||
      term.definition.toLowerCase().includes(lowerQuery) ||
      term.examples.some(ex => ex.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get terms by category
   */
  getTermsByCategory(category) {
    return this.terms.filter(term => term.category === category);
  }

  /**
   * Get a random term
   */
  getRandomTerm() {
    return this.terms[Math.floor(Math.random() * this.terms.length)];
  }

  /**
   * Get Waka Flocka specific terms
   */
  getWakaTerms() {
    return this.terms.filter(term => 
      term.category === "Waka Flocka" || 
      term.category === "Waka Albums" || 
      term.category === "Waka Tracks"
    );
  }

  /**
   * Get trap music terms
   */
  getTrapTerms() {
    return this.terms.filter(term => 
      term.category === "Trap Music" || 
      term.category === "Production" ||
      term.category === "Modern Trap"
    );
  }

  /**
   * Get all categories
   */
  getCategories() {
    return this.categories;
  }

  /**
   * Get dictionary info and stats
   */
  getInfo() {
    return {
      name: "Waka Flocka Flames Rap Dictionary",
      version: "1.0.0",
      description: "Comprehensive hip-hop and trap slang dictionary with Waka Flocka references",
      stats: this.stats,
      features: [
        "50+ defined terms",
        "Multiple categories for filtering",
        "Waka Flocka specific references",
        "Example sentences for context",
        "Trap music terminology",
        "Atlanta zone information"
      ]
    };
  }

  /**
   * Get term of the day
   */
  getTermOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    return this.terms[dayOfYear % this.terms.length];
  }
}

module.exports = WakaFlamesDictionary;