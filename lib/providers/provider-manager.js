/**
 * SUPER GOAT Royalties — Unified Provider Manager
 * =================================================
 * Orchestrates all AI providers from a single interface:
 *  - NVIDIA NIM (native integration)
 *  - OpenRouter (653+ models)
 *  - NVIDIA OpenShell (sandboxed agent execution)
 *  - Lightning AI (model APIs)
 * 
 * Features:
 *  - Auto-detection of available providers
 *  - Intelligent model routing
 *  - Fallback chains
 *  - Cost aggregation
 *  - Demo mode for all providers
 */

const OpenRouterClient = require('./openrouter-client');
const GeminiClient = require('./gemini-client');

class ProviderManager {
  constructor(config = {}) {
    this.providers = {};
    this.activeProvider = null;
    this.fallbackChain = [];
    this.totalCost = 0;
    this.totalRequests = 0;

    // Initialize providers based on available credentials
    this._initProviders(config);
  }

  /**
   * Initialize all available providers
   */
  _initProviders(config = {}) {
    // 1. NVIDIA NIM — native integration (already exists in the app)
    const nvidiaNimKey = config.nvidiaApiKey || process.env.NVIDIA_API_KEY;
    this.providers.nvidia = {
      id: 'nvidia',
      name: 'NVIDIA NIM',
      emoji: '💚',
      status: nvidiaNimKey ? 'active' : 'demo',
      apiKey: nvidiaNimKey,
      description: 'NVIDIA\'s inference microservices for GPU-optimized AI models',
      models: ['nvidia/nemotron-3-nano-30b-a3b', 'nvidia/llama-3.1-nemotron-70b-instruct'],
      features: ['inference', 'embeddings', 'fine-tuning'],
      website: 'https://build.nvidia.com'
    };

    // 2. OpenRouter — multi-model gateway
    const openRouterKey = config.openRouterApiKey || process.env.OPENROUTER_API_KEY;
    this.providers.openrouter = {
      id: 'openrouter',
      name: 'OpenRouter',
      emoji: '🌐',
      status: openRouterKey ? 'active' : 'demo',
      apiKey: openRouterKey,
      client: new OpenRouterClient({ apiKey: openRouterKey }),
      description: 'Unified gateway to 653+ AI models from all major providers',
      models: ['openai/gpt-4o', 'anthropic/claude-sonnet-4', 'google/gemini-2.5-pro-preview', 'meta-llama/llama-4-maverick'],
      features: ['chat', 'completions', 'tools', 'vision', 'streaming'],
      website: 'https://openrouter.ai'
    };

    // 3. NVIDIA OpenShell — sandboxed agent execution
    const openShellGateway = config.openShellGateway || process.env.OPENSHELL_GATEWAY_URL;
    this.providers.openshell = {
      id: 'openshell',
      name: 'NVIDIA OpenShell',
      emoji: '🐚',
      status: openShellGateway ? 'active' : 'demo',
      gatewayUrl: openShellGateway,
      description: 'Sandboxed runtime for autonomous AI agents with kernel-level isolation',
      models: [],
      features: ['sandboxes', 'agent-execution', 'policy-enforcement', 'inference-routing', 'gpu-passthrough'],
      website: 'https://docs.nvidia.com/openshell'
    };

    // 4. Lightning AI — model APIs
    const lightningKey = config.lightningApiKey || process.env.LIGHTNING_API_KEY;
    this.providers.lightning = {
      id: 'lightning',
      name: 'Lightning AI',
      emoji: '⚡',
      status: lightningKey ? 'active' : 'demo',
      apiKey: lightningKey,
      description: 'Lightning-fast model APIs with optimized serving infrastructure',
      models: ['deepseek/deepseek-r1', 'meta-llama/llama-4-maverick', 'nvidia/nemotron-ultra-253b-v1'],
      features: ['inference', 'fine-tuning', 'deployment', 'studios'],
      website: 'https://lightning.ai'
    };

    // 5. Hugging Face — open model hub
    const hfKey = config.huggingFaceApiKey || process.env.HUGGINGFACE_API_KEY;
    this.providers.huggingface = {
      id: 'huggingface',
      name: 'Hugging Face',
      emoji: '🤗',
      status: hfKey ? 'active' : 'demo',
      apiKey: hfKey,
      description: 'Open-source model hub with 1M+ models, datasets, and Spaces',
      models: ['sentence-transformers/all-MiniLM-L6-v2', 'BAAI/bge-large-en-v1.5', 'Qwen/Qwen3-235B-A22B'],
      features: ['inference', 'embeddings', 'spaces', 'datasets', 'fine-tuning'],
      website: 'https://huggingface.co'
    };

    // 6. Google Gemini — free multimodal AI with 1M context
    const geminiKey = config.googleAiKey || process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY;
    this.providers.gemini = {
      id: 'gemini',
      name: 'Google Gemini',
      emoji: '✨',
      status: geminiKey ? 'active' : 'demo',
      apiKey: geminiKey,
      client: new GeminiClient({ apiKey: geminiKey }),
      description: 'Google Gemini AI — free 2.0 Flash with 1M context window, multimodal',
      models: ['gemini-2.0-flash', 'gemini-2.0-flash-thinking', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'],
      features: ['chat', 'vision', 'audio', 'code', 'multimodal', 'grounding', 'free-tier'],
      website: 'https://ai.google.dev'
    };

    // Set active provider (prefer live providers, then Gemini free, then OpenRouter)
    const liveProviders = Object.values(this.providers).filter(p => p.status === 'active');
    if (liveProviders.length > 0) {
      this.activeProvider = liveProviders[0].id;
    } else {
      this.activeProvider = 'gemini'; // Best demo — free tier with real API key option
    }

    // Build fallback chain
    this.fallbackChain = ['gemini', 'openrouter', 'nvidia', 'lightning', 'huggingface'];
  }

  /**
   * Get all providers with their status
   */
  getAllProviders() {
    return Object.values(this.providers).map(p => ({
      id: p.id,
      name: p.name,
      emoji: p.emoji,
      status: p.status,
      description: p.description,
      features: p.features,
      website: p.website,
      modelCount: p.models?.length || 0,
      isActive: p.id === this.activeProvider
    }));
  }

  /**
   * Get a specific provider
   */
  getProvider(providerId) {
    return this.providers[providerId] || null;
  }

  /**
   * Set the active provider
   */
  setActiveProvider(providerId) {
    if (!this.providers[providerId]) {
      throw new Error(`Provider "${providerId}" not found`);
    }
    this.activeProvider = providerId;
    return { success: true, activeProvider: providerId };
  }

  /**
   * Get model catalog — aggregated from all providers
   */
  async getModelCatalog(options = {}) {
    const openRouterModels = await this.providers.openrouter.client.getModels(options);

    // Add provider source tags
    const catalog = openRouterModels.map(m => ({
      ...m,
      source: 'openrouter',
      provider: m.provider || m.id.split('/')[0]
    }));

    return {
      models: catalog,
      total: catalog.length,
      sources: {
        openrouter: catalog.length,
        nvidia: this.providers.nvidia.models.length,
        lightning: this.providers.lightning.models.length,
        huggingface: this.providers.huggingface.models.length
      }
    };
  }

  /**
   * Chat completion — route to best available provider
   */
  async chat(messages, options = {}) {
    const provider = options.provider || this.activeProvider;
    this.totalRequests++;

    // Route to Gemini for gemini-* models or explicit gemini provider
    if (provider === 'gemini' || options.model?.startsWith('gemini')) {
      const result = await this.providers.gemini.client.chat(messages, options);
      this.totalCost += result.cost || 0;
      return { ...result, routedTo: 'gemini' };
    }

    // Route to OpenRouter for multi-model access (slash-prefixed model IDs)
    if (provider === 'openrouter' || options.model?.includes('/')) {
      const result = await this.providers.openrouter.client.chat(messages, options);
      this.totalCost += result.cost || 0;
      return { ...result, routedTo: 'openrouter' };
    }

    // Default: try Gemini first (free), then OpenRouter
    try {
      const result = await this.providers.gemini.client.chat(messages, options);
      this.totalCost += result.cost || 0;
      return { ...result, routedTo: 'gemini' };
    } catch (e) {
      const result = await this.providers.openrouter.client.chat(messages, options);
      this.totalCost += result.cost || 0;
      return { ...result, routedTo: 'openrouter' };
    }
  }

  /**
   * Get aggregated stats across all providers
   */
  getStats() {
    const openRouterStats = this.providers.openrouter.client.getStats();
    const geminiStatus    = this.providers.gemini.client.getStatus();

    return {
      activeProvider: this.activeProvider,
      totalProviders: Object.keys(this.providers).length,
      liveProviders: Object.values(this.providers).filter(p => p.status === 'active').length,
      demoProviders: Object.values(this.providers).filter(p => p.status === 'demo').length,
      totalCost: this.totalCost,
      totalRequests: this.totalRequests,
      openRouter: openRouterStats,
      gemini: geminiStatus,
      providers: Object.fromEntries(
        Object.entries(this.providers).map(([k, v]) => [k, {
          status: v.status,
          features: v.features
        }])
      )
    };
  }

  /**
   * Health check across all providers
   */
  async healthCheck() {
    const checks = {};
    for (const [id, provider] of Object.entries(this.providers)) {
      checks[id] = {
        name: provider.name,
        emoji: provider.emoji,
        status: provider.status,
        configured: provider.status === 'active',
        features: provider.features
      };
    }
    return checks;
  }
}

module.exports = ProviderManager;