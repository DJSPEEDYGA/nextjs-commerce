// © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
// GOAT Connect — Intelligence & OSINT Network
// OSINT Tools · Threat Profiling · Encrypted Comms · Digital Forensics · Counter-Surveillance
'use strict';

class OSINTNetwork {
  constructor() {
    // ==================== OSINT TOOLKIT ====================
    this.osintTools = [
      {
        id: 'maltego', name: 'Maltego', emoji: '🕸️', category: 'Link Analysis',
        description: 'Visual link analysis and data mining tool. Map relationships between people, companies, domains, and infrastructure.',
        capabilities: ['Social network mapping', 'Domain/IP reconnaissance', 'Email to identity linking', 'Corporate structure analysis', 'Dark web monitoring'],
        license: 'Community (Free) / Commercial ($999/yr)', difficulty: 'Intermediate'
      },
      {
        id: 'shodan', name: 'Shodan', emoji: '👁️', category: 'IoT/Infrastructure',
        description: 'Search engine for Internet-connected devices. Find exposed servers, webcams, SCADA systems, and more.',
        capabilities: ['Port scanning', 'Banner grabbing', 'Vulnerability detection', 'Industrial control systems', 'SSL certificate search'],
        license: 'Free (limited) / Member ($49/mo)', difficulty: 'Beginner'
      },
      {
        id: 'spiderfoot', name: 'SpiderFoot', emoji: '🕷️', category: 'Automated OSINT',
        description: 'Automated OSINT collection. 200+ modules for gathering intelligence from public sources.',
        capabilities: ['Email enumeration', 'Subdomain discovery', 'Data breach checking', 'Social media profiling', 'Dark web scanning'],
        license: 'Open Source / HX ($840/yr)', difficulty: 'Beginner'
      },
      {
        id: 'theharvester', name: 'theHarvester', emoji: '🌾', category: 'Email/Domain OSINT',
        description: 'Gather emails, subdomains, hosts, employee names, open ports from different public sources.',
        capabilities: ['Email harvesting', 'Subdomain enumeration', 'Virtual host discovery', 'Search engine dorking', 'API integration'],
        license: 'Open Source (Free)', difficulty: 'Beginner'
      },
      {
        id: 'osintframework', name: 'OSINT Framework', emoji: '🗂️', category: 'Resource Collection',
        description: 'Curated collection of 1000+ OSINT tools and resources organized by category. The ultimate starting point.',
        capabilities: ['Username search', 'Image analysis', 'Geolocation', 'Social media', 'Public records', 'Dark web'],
        license: 'Open Source (Free)', difficulty: 'Beginner'
      },
      {
        id: 'recon-ng', name: 'Recon-ng', emoji: '🔎', category: 'Web Reconnaissance',
        description: 'Full-featured web reconnaissance framework. Modular design similar to Metasploit for OSINT.',
        capabilities: ['Contact harvesting', 'Credential exposure checking', 'Geolocation', 'Social engineering prep', 'Report generation'],
        license: 'Open Source (Free)', difficulty: 'Intermediate'
      },
      {
        id: 'sherlock', name: 'Sherlock', emoji: '🔍', category: 'Username OSINT',
        description: 'Hunt down social media accounts by username across 400+ social networks simultaneously.',
        capabilities: ['Multi-platform username search', '400+ sites supported', 'Tor support', 'CSV/JSON export', 'Proxy support'],
        license: 'Open Source (Free)', difficulty: 'Beginner'
      },
      {
        id: 'ghunt', name: 'GHunt', emoji: '🔦', category: 'Google OSINT',
        description: 'Investigate Google accounts. Extract information from Google services using email addresses.',
        capabilities: ['Google account analysis', 'Maps reviews', 'YouTube activity', 'Google Photos', 'Calendar events'],
        license: 'Open Source (Free)', difficulty: 'Intermediate'
      }
    ];

    // ==================== THREAT PROFILING ====================
    this.threatProfiles = [
      {
        type: 'Nation-State Actor', emoji: '🏛️', dangerLevel: 10,
        indicators: ['Custom malware', 'Zero-day exploits', 'Long dwell time (months-years)', 'Targeted spear phishing', 'Supply chain compromise'],
        motivation: 'Espionage, sabotage, strategic advantage',
        defense: 'Zero-trust architecture, air-gapped networks, threat hunting, incident response team'
      },
      {
        type: 'Organized Cybercrime', emoji: '💰', dangerLevel: 8,
        indicators: ['Ransomware deployment', 'Credential marketplaces', 'Business email compromise', 'Cryptojacking', 'Data exfiltration for sale'],
        motivation: 'Financial gain, ransom payments, data sale',
        defense: 'Email security, endpoint detection, backup strategy, employee training'
      },
      {
        type: 'Hacktivist', emoji: '✊', dangerLevel: 5,
        indicators: ['DDoS attacks', 'Website defacement', 'Data leaks for publicity', 'Social media campaigns', 'Public manifestos'],
        motivation: 'Political/social change, embarrassment, awareness',
        defense: 'DDoS mitigation, web application firewall, public relations preparedness'
      },
      {
        type: 'Insider Threat', emoji: '🕵️', dangerLevel: 9,
        indicators: ['Unusual data access patterns', 'After-hours activity', 'USB device usage', 'Resignation + large downloads', 'Privilege escalation attempts'],
        motivation: 'Revenge, financial gain, coercion, ideology',
        defense: 'DLP solutions, UEBA, access reviews, exit procedures, monitoring'
      },
      {
        type: 'Script Kiddie', emoji: '👶', dangerLevel: 3,
        indicators: ['Known exploits only', 'Automated scanning tools', 'No persistence', 'Noisy attacks', 'Public tools/scripts'],
        motivation: 'Curiosity, bragging rights, learning',
        defense: 'Basic patching, firewall rules, IDS/IPS'
      }
    ];

    // ==================== ENCRYPTED COMMUNICATIONS ====================
    this.encryptedComms = [
      {
        name: 'Signal', emoji: '📱', rating: 10,
        encryption: 'Signal Protocol (Double Ratchet)',
        features: ['E2E encrypted messages', 'Disappearing messages', 'Screen security', 'Sealed sender', 'No metadata storage'],
        platforms: ['iOS', 'Android', 'Desktop'],
        verdict: '🏆 Gold standard for secure messaging'
      },
      {
        name: 'ProtonMail', emoji: '📧', rating: 9,
        encryption: 'PGP + AES-256',
        features: ['E2E encrypted email', 'Zero-access encryption', 'Self-destructing emails', 'Swiss privacy laws', 'Tor support'],
        platforms: ['Web', 'iOS', 'Android'],
        verdict: '✅ Best for secure email'
      },
      {
        name: 'Tor Network', emoji: '🧅', rating: 8,
        encryption: 'Onion routing (3 layers)',
        features: ['Anonymous browsing', 'Censorship circumvention', '.onion hidden services', 'Traffic obfuscation', 'No single point of failure'],
        platforms: ['Desktop', 'Android (Orbot)'],
        verdict: '✅ Best for anonymous browsing'
      },
      {
        name: 'WireGuard VPN', emoji: '🔒', rating: 9,
        encryption: 'ChaCha20-Poly1305 + Curve25519',
        features: ['Modern VPN protocol', '4000 lines of code', 'Kernel-level speed', 'Roaming support', 'Minimal attack surface'],
        platforms: ['All platforms'],
        verdict: '✅ Best modern VPN protocol'
      },
      {
        name: 'Matrix/Element', emoji: '💬', rating: 8,
        encryption: 'Olm/Megolm (Signal-based)',
        features: ['Decentralized messaging', 'Self-hosted option', 'Bridging to other platforms', 'E2E encrypted rooms', 'Voice/video calls'],
        platforms: ['Web', 'Desktop', 'Mobile'],
        verdict: '✅ Best decentralized option'
      },
      {
        name: 'Tails OS', emoji: '💿', rating: 10,
        encryption: 'Full disk + Tor routing',
        features: ['Amnesic live OS', 'Routes all traffic through Tor', 'No persistent storage', 'Built-in encryption tools', 'USB bootable'],
        platforms: ['USB Live Boot'],
        verdict: '🏆 Maximum anonymity OS'
      }
    ];

    // ==================== SOCIAL ENGINEERING ====================
    this.socialEngineering = {
      techniques: [
        { name: 'Pretexting', emoji: '🎭', description: 'Creating a fabricated scenario to engage a victim. Impersonating IT support, executives, or vendors.', defense: 'Verify identity through callback. Never share credentials over phone.' },
        { name: 'Phishing', emoji: '🎣', description: 'Sending fraudulent communications that appear to come from a reputable source. Email, SMS (smishing), voice (vishing).', defense: 'Check sender address, hover over links, use email authentication (DMARC/DKIM/SPF).' },
        { name: 'Baiting', emoji: '🪤', description: 'Offering something enticing to the victim. Infected USB drives, free software downloads, fake job offers.', defense: 'Never plug in unknown USB devices. Only download from official sources.' },
        { name: 'Tailgating', emoji: '🚶', description: 'Physically following an authorized person through a secure door. "I forgot my badge" technique.', defense: 'Badge everyone. Challenge unknown individuals. Use mantraps.' },
        { name: 'Quid Pro Quo', emoji: '🤝', description: 'Offering a service in exchange for information. "I\'m from IT, give me your password and I\'ll fix your computer."', defense: 'IT will never ask for your password. Verify through official channels.' },
        { name: 'Watering Hole', emoji: '💧', description: 'Compromising a website that the target group frequently visits. Infecting industry forums or news sites.', defense: 'Keep browsers updated. Use script blockers. Network segmentation.' }
      ],
      stats: {
        attacksUsingPhishing: '91%',
        avgTimeToClick: '82 seconds',
        costPerBreach: '$4.88M (2024)',
        employeesFailing: '32%',
        aiPhishingSuccess: '98% more convincing'
      }
    };

    // ==================== PRIVACY TOOLS ====================
    this.privacyTools = [
      { name: 'Password Manager', emoji: '🔑', recommendation: 'Bitwarden / 1Password', description: 'Never reuse passwords. Generate 20+ char unique passwords for every account. Enable MFA on the vault.' },
      { name: 'MFA Everywhere', emoji: '📲', recommendation: 'YubiKey / Authy', description: 'Hardware keys > TOTP apps > SMS. SMS 2FA is vulnerable to SIM swapping. Use FIDO2 where possible.' },
      { name: 'Email Aliasing', emoji: '📧', recommendation: 'SimpleLogin / AnonAddy', description: 'Use unique email aliases for every service. If one leaks, disable the alias. Track who sold your data.' },
      { name: 'DNS Filtering', emoji: '🌐', recommendation: 'NextDNS / Pi-hole', description: 'Block trackers, ads, and malware at the DNS level. Protects entire network without client software.' },
      { name: 'Browser Privacy', emoji: '🦊', recommendation: 'Firefox + uBlock Origin', description: 'Brave or Firefox with strict privacy settings. uBlock Origin for ads. HTTPS Everywhere. Disable WebRTC.' },
      { name: 'File Encryption', emoji: '🔐', recommendation: 'Cryptomator / VeraCrypt', description: 'Encrypt sensitive files before cloud storage. Full disk encryption (BitLocker/FileVault/LUKS) on all devices.' }
    ];

    // ==================== COUNTER-SURVEILLANCE ====================
    this.counterSurveillance = [
      {
        threat: 'Camera/Audio Surveillance', emoji: '📷',
        detection: ['RF detector sweep', 'Infrared camera detection', 'Physical inspection of fixtures', 'Non-linear junction detector'],
        countermeasure: 'TSCM (Technical Surveillance Countermeasures) sweep. White noise generators. Faraday bags for devices.'
      },
      {
        threat: 'Phone Tracking', emoji: '📱',
        detection: ['Unexpected battery drain', 'Data usage spikes', 'Strange background noises', 'Warm when idle'],
        countermeasure: 'Faraday bag when not in use. Burner phones for sensitive communications. Airplane mode + WiFi off.'
      },
      {
        threat: 'Digital Surveillance', emoji: '💻',
        detection: ['Unknown processes running', 'Webcam light on unexpectedly', 'Browser redirects', 'New browser extensions'],
        countermeasure: 'EDR software. Regular malware scans. Webcam cover. Network monitoring. Use Tails OS.'
      },
      {
        threat: 'Social Media OSINT', emoji: '📲',
        detection: ['Fake follower accounts', 'Suspicious friend requests', 'Screenshot notifications', 'Location data in posts'],
        countermeasure: 'Private accounts. Disable location services. Limit personal information shared. Regular privacy audit.'
      },
      {
        threat: 'Vehicle Tracking', emoji: '🚗',
        detection: ['GPS tracker sweep (magnetic/OBD)', 'Unusual battery drain', 'RF signal detection'],
        countermeasure: 'Regular vehicle inspection. GPS jammer (legal concerns). OBD port lock. Vary routes.'
      }
    ];

    // ==================== DATA BREACH MONITOR ====================
    this.breachDatabase = [
      { name: 'Yahoo (2013)', emoji: '💀', records: '3 billion', type: 'Accounts', impact: 'CATASTROPHIC', lesson: 'Encrypt everything. Use strong hashing (bcrypt, not MD5).' },
      { name: 'Equifax (2017)', emoji: '💳', records: '147 million', type: 'Financial/SSN', impact: 'CRITICAL', lesson: 'Patch Apache Struts. Segment networks. Monitor for exfiltration.' },
      { name: 'Facebook (2019)', emoji: '📘', records: '533 million', type: 'Personal data', impact: 'HIGH', lesson: 'Minimize data collection. Secure APIs. Regular access audits.' },
      { name: 'SolarWinds (2020)', emoji: '☀️', records: '18,000 orgs', type: 'Supply chain', impact: 'CATASTROPHIC', lesson: 'Verify software supply chain. Code signing. Zero-trust architecture.' },
      { name: 'T-Mobile (2023)', emoji: '📱', records: '37 million', type: 'Customer data', impact: 'HIGH', lesson: 'API security. Rate limiting. Data minimization. Breach disclosure speed.' },
      { name: 'MOVEit (2023)', emoji: '📁', records: '60+ million', type: 'File transfer', impact: 'CRITICAL', lesson: 'Patch immediately. Monitor file transfer tools. Incident response readiness.' }
    ];

    console.log(`📡 OSINT Network loaded: ${this.osintTools.length} tools, ${this.encryptedComms.length} comm channels, ${this.breachDatabase.length} breach records`);
  }

  // ==================== API METHODS ====================
  getOSINTTools(filters = {}) {
    let tools = [...this.osintTools];
    if (filters.category) tools = tools.filter(t => t.category.toLowerCase().includes(filters.category.toLowerCase()));
    if (filters.q) {
      const q = filters.q.toLowerCase();
      tools = tools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return { success: true, tools, total: tools.length };
  }

  getThreatProfiles() { return { success: true, profiles: this.threatProfiles, total: this.threatProfiles.length }; }

  getEncryptedComms() { return { success: true, comms: this.encryptedComms, total: this.encryptedComms.length }; }

  getSocialEngineering() { return { success: true, socialEng: this.socialEngineering }; }

  getPrivacyTools() { return { success: true, tools: this.privacyTools, total: this.privacyTools.length }; }

  getCounterSurveillance() { return { success: true, measures: this.counterSurveillance, total: this.counterSurveillance.length }; }

  getBreachDatabase() { return { success: true, breaches: this.breachDatabase, total: this.breachDatabase.length }; }

  getStats() {
    return {
      success: true,
      osintTools: this.osintTools.length,
      threatProfiles: this.threatProfiles.length,
      encryptedComms: this.encryptedComms.length,
      socialEngTechniques: this.socialEngineering.techniques.length,
      privacyTools: this.privacyTools.length,
      counterSurveillance: this.counterSurveillance.length,
      breachRecords: this.breachDatabase.length
    };
  }
}

module.exports = new OSINTNetwork();