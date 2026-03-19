/**
 * SUPER GOAT Royalties — Sandbox Manager
 * ========================================
 * Manages OpenShell sandbox lifecycle for each AI assistant.
 * Each of the 9 SUPER GOAT assistants can run in its own
 * isolated sandbox with custom policies and inference routing.
 * 
 * Sandbox-to-Agent mapping:
 *  NOVA       → nova-dashboard        (strategy sandbox)
 *  CASHFLOW   → cashflow-revenue      (financial sandbox, extra isolation)
 *  PIXEL      → pixel-nft             (creative sandbox, GPU access)
 *  SAGE       → sage-knowledge        (knowledge sandbox, RAG-focused)
 *  CONDUCTOR  → conductor-orchestrator (orchestrator sandbox, inter-sandbox comms)
 *  LEXIS      → lexis-legal           (legal sandbox, maximum isolation)
 *  HARMONY    → harmony-collaboration (team sandbox, external API access)
 *  ORACLE     → oracle-market         (market sandbox, data API access)
 *  GEAR       → gear-system           (system sandbox, config access)
 */

class SandboxManager {
  constructor(openshellClient) {
    this.openshell = openshellClient;
    this.agentSandboxMap = new Map();

    // Define sandbox profiles per assistant
    this.sandboxProfiles = {
      nova: {
        name: 'nova-dashboard',
        policy: 'super-goat-standard',
        resources: { cpu: '0.5 cores', memory: '512 MB', gpu: 'shared' },
        network: { allow: ['api.spotify.com', 'api.apple.com', 'api.soundcloud.com', 'inference.local'] },
        filesystem: { readonly: ['/data/revenue', '/data/market'], writable: ['/tmp', '/workspace'] },
        inference: { model: 'nvidia/nemotron-3-nano-30b-a3b', provider: 'nvidia-prod' }
      },
      cashflow: {
        name: 'cashflow-revenue',
        policy: 'super-goat-financial',
        resources: { cpu: '1.0 cores', memory: '1 GB', gpu: 'dedicated' },
        network: { allow: ['api.stripe.com', 'api.paypal.com', 'api.wise.com', 'inference.local'] },
        filesystem: { readonly: ['/data/revenue', '/data/contracts'], writable: ['/tmp'] },
        inference: { model: 'deepseek/deepseek-r1', provider: 'openrouter' }
      },
      pixel: {
        name: 'pixel-nft',
        policy: 'super-goat-creative',
        resources: { cpu: '2.0 cores', memory: '2 GB', gpu: 'dedicated' },
        network: { allow: ['api.opensea.io', 'ipfs.io', 'arweave.net', 'inference.local'] },
        filesystem: { readonly: ['/data/nfts'], writable: ['/tmp', '/workspace/art', '/workspace/renders'] },
        inference: { model: 'openai/gpt-4o', provider: 'openrouter' }
      },
      sage: {
        name: 'sage-knowledge',
        policy: 'super-goat-knowledge',
        resources: { cpu: '1.0 cores', memory: '2 GB', gpu: 'shared' },
        network: { allow: ['inference.local'] },
        filesystem: { readonly: ['/data/knowledge-base', '/data/embeddings'], writable: ['/tmp'] },
        inference: { model: 'nvidia/nemotron-3-nano-30b-a3b', provider: 'nvidia-prod' }
      },
      conductor: {
        name: 'conductor-orchestrator',
        policy: 'super-goat-orchestrator',
        resources: { cpu: '2.0 cores', memory: '4 GB', gpu: 'dedicated' },
        network: { allow: ['inference.local', 'sandbox-*.local'] },
        filesystem: { readonly: ['/data'], writable: ['/tmp', '/workspace', '/var/run/sandboxes'] },
        inference: { model: 'anthropic/claude-sonnet-4', provider: 'openrouter' }
      },
      lexis: {
        name: 'lexis-legal',
        policy: 'super-goat-legal',
        resources: { cpu: '1.0 cores', memory: '1 GB', gpu: 'shared' },
        network: { allow: ['inference.local'] },
        filesystem: { readonly: ['/data/contracts'], writable: ['/tmp'] },
        inference: { model: 'anthropic/claude-sonnet-4', provider: 'openrouter' }
      },
      harmony: {
        name: 'harmony-collaboration',
        policy: 'super-goat-team',
        resources: { cpu: '0.5 cores', memory: '512 MB', gpu: 'none' },
        network: { allow: ['api.slack.com', 'api.discord.com', 'api.notion.so', 'inference.local'] },
        filesystem: { readonly: ['/data/team'], writable: ['/tmp', '/workspace/collab'] },
        inference: { model: 'openai/gpt-4o-mini', provider: 'openrouter' }
      },
      oracle: {
        name: 'oracle-market',
        policy: 'super-goat-market',
        resources: { cpu: '1.5 cores', memory: '2 GB', gpu: 'shared' },
        network: { allow: ['api.spotify.com', 'api.soundcharts.com', 'api.chartmetric.com', 'inference.local'] },
        filesystem: { readonly: ['/data/market'], writable: ['/tmp'] },
        inference: { model: 'deepseek/deepseek-r1', provider: 'openrouter' }
      },
      gear: {
        name: 'gear-system',
        policy: 'super-goat-system',
        resources: { cpu: '0.5 cores', memory: '256 MB', gpu: 'none' },
        network: { allow: ['inference.local'] },
        filesystem: { readonly: ['/etc/openshell', '/data/config'], writable: ['/tmp', '/var/log'] },
        inference: { model: 'nvidia/nemotron-3-nano-30b-a3b', provider: 'nvidia-prod' }
      }
    };
  }

  /**
   * Initialize sandboxes for all agents
   */
  async initializeAll() {
    const results = [];
    for (const [agentId, profile] of Object.entries(this.sandboxProfiles)) {
      try {
        const sandbox = await this.openshell.getSandboxByAgent(agentId.toUpperCase());
        if (sandbox) {
          this.agentSandboxMap.set(agentId, sandbox.id);
          results.push({ agent: agentId, status: 'found', sandboxId: sandbox.id });
        } else {
          results.push({ agent: agentId, status: 'not-deployed', profile: profile.name });
        }
      } catch (error) {
        results.push({ agent: agentId, status: 'error', message: error.message });
      }
    }
    return results;
  }

  /**
   * Get sandbox status for a specific agent
   */
  async getAgentSandbox(agentId) {
    const id = agentId.toLowerCase();
    const profile = this.sandboxProfiles[id];
    if (!profile) return null;

    const sandbox = await this.openshell.getSandboxByAgent(agentId.toUpperCase());
    return {
      agent: agentId,
      profile,
      sandbox: sandbox || null,
      deployed: !!sandbox,
      status: sandbox?.status || 'not-deployed'
    };
  }

  /**
   * Deploy a sandbox for a specific agent
   */
  async deployAgent(agentId) {
    const id = agentId.toLowerCase();
    const profile = this.sandboxProfiles[id];
    if (!profile) throw new Error(`No sandbox profile for agent "${agentId}"`);

    const sandbox = await this.openshell.createSandbox({
      agent: agentId.toUpperCase(),
      name: profile.name,
      policy: profile.policy,
      resources: profile.resources,
      inference: profile.inference
    });

    this.agentSandboxMap.set(id, sandbox.id);
    return sandbox;
  }

  /**
   * Get full dashboard data — all agents with sandbox status
   */
  async getDashboard() {
    const agents = [];
    for (const [agentId, profile] of Object.entries(this.sandboxProfiles)) {
      const sandbox = await this.openshell.getSandboxByAgent(agentId.toUpperCase());
      agents.push({
        id: agentId,
        name: agentId.toUpperCase(),
        sandboxName: profile.name,
        policy: profile.policy,
        resources: profile.resources,
        inferenceModel: profile.inference.model,
        inferenceProvider: profile.inference.provider,
        networkAllowed: profile.network.allow,
        status: sandbox?.status || 'not-deployed',
        uptime: sandbox?.uptime || null,
        blockedRequests: (sandbox?.network?.blocked || 0) + (sandbox?.filesystem?.blocked || 0)
      });
    }

    const security = await this.openshell.getSecurityMetrics();
    return { agents, security };
  }

  /**
   * Get all sandbox profiles (for UI)
   */
  getProfiles() {
    return Object.entries(this.sandboxProfiles).map(([id, profile]) => ({
      agentId: id,
      agentName: id.toUpperCase(),
      ...profile
    }));
  }
}

module.exports = SandboxManager;