/**
 * SUPER GOAT Royalties — Blueprint Analyzer
 * ==========================================
 * Standalone Blueprint analysis tool — companion to the
 * Ultimate Engine CoPilot. Analyzes UE5 Blueprints for:
 *  - Performance anti-patterns
 *  - Architecture quality
 *  - Best practice compliance
 *  - SUPER GOAT integration opportunities
 */

class BlueprintAnalyzer {
  constructor(config = {}) {
    this.demoMode = config.demoMode !== undefined ? config.demoMode : true;

    // Known anti-patterns to detect
    this.antiPatterns = [
      {
        id: 'tick-getactor',
        name: 'Get Actor of Class in Tick',
        severity: 'critical',
        description: 'Searching for actors every frame is O(n) and extremely expensive.',
        fix: 'Cache the reference in BeginPlay, check validity before use.'
      },
      {
        id: 'tick-cast',
        name: 'Cast in Event Tick',
        severity: 'high',
        description: 'Repeated Cast operations in Tick can cause significant overhead.',
        fix: 'Cache the cast result in a typed variable during BeginPlay.'
      },
      {
        id: 'polling',
        name: 'Polling via Tick (IsActorBeingDestroyed, etc.)',
        severity: 'medium',
        description: 'Polling state every frame wastes CPU.',
        fix: 'Use Event Dispatchers or OnDestroyed/OnEndPlay delegates instead.'
      },
      {
        id: 'branch-spam',
        name: 'Excessive Branch Chains',
        severity: 'low',
        description: 'Long chains of Branch nodes are hard to read and maintain.',
        fix: 'Use Switch on Enum or Macro Libraries to consolidate logic.'
      },
      {
        id: 'magic-numbers',
        name: 'Magic Numbers',
        severity: 'low',
        description: 'Hardcoded values (e.g., 1.5, 200, 0.016) make iteration slow.',
        fix: 'Use named variables or expose as EditAnywhere properties.'
      },
      {
        id: 'direct-reference',
        name: 'Direct Cross-Blueprint References',
        severity: 'medium',
        description: 'Hard references between unrelated Blueprints cause load-time spikes.',
        fix: 'Use Blueprint Interfaces, Event Dispatchers, or soft object references.'
      },
      {
        id: 'no-null-check',
        name: 'Missing IsValid Check',
        severity: 'high',
        description: 'Using references without IsValid? can cause fatal crashes.',
        fix: 'Always pipe object pins through IsValid? before calling functions.'
      }
    ];

    // Score weights
    this.weights = {
      critical: 30,
      high: 15,
      medium: 8,
      low: 3
    };
  }

  /**
   * Analyze a Blueprint description or code snippet
   */
  analyze(input, options = {}) {
    if (!input || typeof input !== 'string') {
      return { error: 'No input provided' };
    }

    const detectedIssues = this._detectIssues(input);
    const score = this._calculateScore(detectedIssues);
    const integrationOpps = this._findIntegrationOpportunities(input);
    const recommendations = this._generateRecommendations(detectedIssues, input);

    return {
      success: true,
      score,
      grade: this._getGrade(score),
      issues: detectedIssues,
      issueCount: detectedIssues.length,
      integrationOpportunities: integrationOpps,
      recommendations,
      summary: this._generateSummary(score, detectedIssues),
      demo: this.demoMode
    };
  }

  _detectIssues(input) {
    const found = [];
    const lower = input.toLowerCase();

    if (lower.includes('tick') && (lower.includes('get actor of class') || lower.includes('getactor'))) {
      found.push({ ...this.antiPatterns[0], line: 'Event Tick → Get Actor of Class' });
    }
    if (lower.includes('tick') && lower.includes('cast to')) {
      found.push({ ...this.antiPatterns[1], line: 'Event Tick → Cast To ...' });
    }
    if (lower.includes('tick') && lower.includes('is actor being destroyed')) {
      found.push({ ...this.antiPatterns[2], line: 'Event Tick → Is Actor Being Destroyed' });
    }
    if ((lower.match(/branch/g) || []).length > 5) {
      found.push({ ...this.antiPatterns[3], line: 'Multiple Branch chains detected' });
    }
    if (/\b0\.\d+\b|\b\d{3,}\b/.test(input)) {
      found.push({ ...this.antiPatterns[4], line: 'Hardcoded numeric values detected' });
    }
    if (!lower.includes('isvalid') && !lower.includes('is valid') && lower.includes('getcomponent')) {
      found.push({ ...this.antiPatterns[6], line: 'GetComponent without IsValid? check' });
    }

    return found;
  }

  _calculateScore(issues) {
    let penalty = 0;
    issues.forEach(issue => { penalty += this.weights[issue.severity] || 0; });
    return Math.max(0, 100 - penalty);
  }

  _getGrade(score) {
    if (score >= 90) return { grade: 'A', label: 'Excellent', color: '#2ecc71' };
    if (score >= 80) return { grade: 'B', label: 'Good', color: '#27ae60' };
    if (score >= 70) return { grade: 'C', label: 'Fair', color: '#f1c40f' };
    if (score >= 60) return { grade: 'D', label: 'Needs Work', color: '#e67e22' };
    return { grade: 'F', label: 'Critical Issues', color: '#e74c3c' };
  }

  _findIntegrationOpportunities(input) {
    const opps = [];
    const lower = input.toLowerCase();

    if (lower.includes('actor') || lower.includes('player')) {
      opps.push({
        type: 'Revenue Events',
        description: 'Trigger in-game rewards when streaming milestones are hit',
        endpoint: '/api/revenue/predictions'
      });
    }
    if (lower.includes('ui') || lower.includes('widget') || lower.includes('hud')) {
      opps.push({
        type: 'Live Stats HUD',
        description: 'Display real-time streaming stats and royalty earnings in-game',
        endpoint: '/api/dashboard'
      });
    }
    if (lower.includes('spawn') || lower.includes('visual') || lower.includes('effect')) {
      opps.push({
        type: 'NFT-Unlocked Effects',
        description: 'Unlock visual effects based on NFT ownership via portfolio API',
        endpoint: '/api/nft/portfolio'
      });
    }
    if (lower.includes('music') || lower.includes('audio') || lower.includes('sound')) {
      opps.push({
        type: 'Music Catalog Integration',
        description: 'Load and play catalog tracks directly from the creator platform',
        endpoint: '/api/collaboration/status'
      });
    }

    return opps;
  }

  _generateRecommendations(issues, input) {
    const recs = issues.map(i => ({
      priority: i.severity,
      action: i.fix,
      context: i.line
    }));

    // Always add a positive recommendation
    recs.push({
      priority: 'info',
      action: 'Consider integrating SUPER GOAT Royalties API for live creator data in your UE5 experience',
      context: 'HTTP Request node → JSON parsing → Live revenue/NFT data'
    });

    return recs;
  }

  _generateSummary(score, issues) {
    const critical = issues.filter(i => i.severity === 'critical').length;
    const high = issues.filter(i => i.severity === 'high').length;

    if (critical > 0) {
      return `⚠️ ${critical} critical performance issue${critical > 1 ? 's' : ''} detected. Address these first to prevent FPS drops and crashes.`;
    }
    if (high > 0) {
      return `🔶 ${high} high-priority issue${high > 1 ? 's' : ''} found. Good overall structure but needs optimization.`;
    }
    if (score >= 85) {
      return `✅ Clean Blueprint with a score of ${score}/100. Minor style improvements available.`;
    }
    return `📋 Blueprint scored ${score}/100. ${issues.length} improvement${issues.length !== 1 ? 's' : ''} recommended.`;
  }

  /**
   * Get quick tips for common UE5 patterns
   */
  getQuickTips() {
    return [
      { category: 'Performance', tip: 'Use Set Timer by Function Name instead of Tick for periodic operations', impact: 'high' },
      { category: 'Performance', tip: 'Enable Nanite on all complex static meshes to auto-manage LODs', impact: 'high' },
      { category: 'Architecture', tip: 'Use Blueprint Interfaces instead of direct references for cross-BP communication', impact: 'medium' },
      { category: 'Architecture', tip: 'Store frequently-accessed actors in Game Instance for global access without searches', impact: 'medium' },
      { category: 'Audio', tip: 'Use Sound Cues with Random nodes for natural-sounding repeatable effects', impact: 'low' },
      { category: 'UI', tip: 'Use Common UI plugin for console-friendly, controller-navigable menus', impact: 'medium' },
      { category: 'Multiplayer', tip: 'Mark variables as Replicated and use HasAuthority() checks for server logic', impact: 'high' },
      { category: 'GOAT Integration', tip: 'Use HTTP Request blueprint to fetch your live royalty data every 30 seconds', impact: 'medium' }
    ];
  }
}

module.exports = BlueprintAnalyzer;