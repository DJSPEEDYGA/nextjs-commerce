/**
 * SUPER GOAT ROYALTIES - AI Configuration
 * =========================================
 * Multi-provider AI integration:
 *  - NVIDIA NIM (native GPU inference)
 *  - OpenRouter (653+ models from all providers)
 *  - NVIDIA OpenShell (sandboxed agent execution)
 *  - Lightning AI (optimized model APIs)
 *  - Hugging Face (open-source models)
 *  - Google AI Studio
 */

// Auto-detect demo mode when no API keys are configured
const hasNvidiaKey = !!process.env.NVIDIA_API_KEY;
const hasOpenRouterKey = !!process.env.OPENROUTER_API_KEY;
const hasLightningKey = !!process.env.LIGHTNING_API_KEY;
const hasHuggingFaceKey = !!process.env.HUGGINGFACE_API_KEY;
const hasGoogleKey = !!process.env.GOOGLE_AI_STUDIO_KEY;
const hasOpenShellGateway = !!process.env.OPENSHELL_GATEWAY_URL;

const hasAnyProvider = hasNvidiaKey || hasOpenRouterKey || hasLightningKey || hasHuggingFaceKey || hasGoogleKey;
const isDemoMode = !hasAnyProvider;

if (isDemoMode) {
    console.log('🎮 Running in DEMO MODE - AI features use simulated responses');
    console.log('   Configure any provider in .env to enable live AI:');
    console.log('   • NVIDIA_API_KEY      → NVIDIA NIM inference');
    console.log('   • OPENROUTER_API_KEY   → 653+ models (OpenAI, Anthropic, Google, Meta, etc.)');
    console.log('   • LIGHTNING_API_KEY    → Lightning AI model APIs');
    console.log('   • HUGGINGFACE_API_KEY  → Hugging Face inference');
    console.log('   • OPENSHELL_GATEWAY_URL → NVIDIA OpenShell sandboxed agents');
} else {
    const active = [];
    if (hasNvidiaKey) active.push('NVIDIA NIM');
    if (hasOpenRouterKey) active.push('OpenRouter');
    if (hasLightningKey) active.push('Lightning AI');
    if (hasHuggingFaceKey) active.push('Hugging Face');
    if (hasGoogleKey) active.push('Google AI');
    if (hasOpenShellGateway) active.push('OpenShell');
    console.log(`🚀 Live AI providers: ${active.join(', ')}`);
}

module.exports = {
    // Mode Detection
    demoMode: isDemoMode,
    activeProviders: {
        nvidia: hasNvidiaKey,
        openrouter: hasOpenRouterKey,
        lightning: hasLightningKey,
        huggingface: hasHuggingFaceKey,
        googleAI: hasGoogleKey,
        openshell: hasOpenShellGateway
    },

    // NVIDIA NIM Integration
    nvidia: {
        baseUrl: process.env.NVIDIA_NIM_URL || 'https://integrate.api.nvidia.com/v1',
        apiKey: process.env.NVIDIA_API_KEY,
        models: {
            'llama2-70b': 'meta/llama-2-70b-chat',
            'llama2-13b': 'meta/llama-2-13b-chat',
            'mixtral-8x7b': 'mistralai/mixtral-8x7b-instruct-v0.1',
            'nemotron-70b': 'nvidia/nemotron-4-340b-instruct',
            'nemotron-nano-30b': 'nvidia/nemotron-3-nano-30b-a3b',
            'phi-3': 'microsoft/phi-3-mini-128k-instruct',
            'codellama-34b': 'codellama/codellama-34b-instruct',
            'starcoder2': 'bigcode/starcoder2-15b',
            'nemo-multimodal': 'nvidia/nemotron-4-340b-multimodal',
            'nv-embedqa': 'nvidia/nv-embedqa-e5-v5'
        }
    },

    // OpenRouter Multi-Model Gateway
    openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
        defaultModel: process.env.OPENROUTER_DEFAULT_MODEL || 'openai/gpt-4o-mini',
        // Featured models for quick selection in the UI
        featuredModels: [
            { id: 'openai/gpt-4o', name: 'GPT-4o', tier: 'flagship' },
            { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', tier: 'flagship' },
            { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro', tier: 'flagship' },
            { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', tier: 'flagship' },
            { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', tier: 'reasoning' },
            { id: 'qwen/qwen3-235b-a22b', name: 'Qwen3 235B', tier: 'flagship' },
            { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', tier: 'efficient' },
            { id: 'anthropic/claude-haiku-3.5', name: 'Claude 3.5 Haiku', tier: 'efficient' },
            { id: 'google/gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash', tier: 'efficient' }
        ]
    },

    // NVIDIA OpenShell — Sandboxed Agent Execution
    openshell: {
        gatewayUrl: process.env.OPENSHELL_GATEWAY_URL || null,
        inferenceEndpoint: 'https://inference.local/v1',
        defaultModel: process.env.OPENSHELL_MODEL || 'nvidia/nemotron-3-nano-30b-a3b',
        gpu: process.env.OPENSHELL_GPU === 'true',
        policyFile: process.env.OPENSHELL_POLICY || 'openshell-policy.yaml',
        sandbox: {
            defaultImage: 'base',
            maxSandboxes: parseInt(process.env.OPENSHELL_MAX_SANDBOXES || '9'),
            timeout: parseInt(process.env.OPENSHELL_SANDBOX_TIMEOUT || '3600')
        }
    },

    // Lightning AI Model APIs
    lightning: {
        apiKey: process.env.LIGHTNING_API_KEY,
        baseUrl: process.env.LIGHTNING_BASE_URL || 'https://api.lightning.ai/v1',
        workspace: process.env.LIGHTNING_WORKSPACE || '',
        models: [
            'deepseek/deepseek-r1',
            'meta-llama/llama-4-maverick',
            'nvidia/nemotron-ultra-253b-v1',
            'google/gemma-3-27b-it'
        ]
    },

    // Hugging Face
    huggingface: {
        apiKey: process.env.HUGGINGFACE_API_KEY,
        baseUrl: process.env.HUGGINGFACE_BASE_URL || 'https://api-inference.huggingface.co',
        embeddingModels: [
            'sentence-transformers/all-MiniLM-L6-v2',
            'BAAI/bge-large-en-v1.5',
            'nomic-ai/nomic-embed-text-v1.5'
        ],
        generationModels: [
            'Qwen/Qwen3-235B-A22B',
            'meta-llama/Llama-4-Maverick-17B-128E-Instruct',
            'mistralai/Mistral-Large-Instruct-2411'
        ]
    },

    // Google AI Studio Integration
    googleAI: {
        apiKey: process.env.GOOGLE_AI_STUDIO_KEY,
        models: {
            'gemini-pro': 'gemini-pro',
            'gemini-pro-vision': 'gemini-pro-vision',
            'gemini-ultra': 'gemini-ultra'
        }
    },

    // LangChain Configuration
    langchain: {
        temperature: 0.7,
        maxTokens: 2000,
        model: 'llama2-70b',
        enableStreaming: true
    },

    // RAG Configuration
    rag: {
        chunkSize: 1000,
        chunkOverlap: 200,
        maxRetrievalDocuments: 5,
        embeddingModel: 'nv-embedqa'
    },

    // Agent Configuration (now with OpenShell sandbox support)
    agents: {
        royaltyTracker: {
            model: 'mixtral-8x7b',
            tools: ['revenue-analyzer', 'platform-integrator', 'prediction-engine'],
            sandbox: 'royalty-tracker-sandbox'
        },
        contentAdvisor: {
            model: 'llama2-70b',
            tools: ['market-analyzer', 'trend-detector', 'recommender'],
            sandbox: 'content-advisor-sandbox'
        },
        contractAnalyst: {
            model: 'nemotron-70b',
            tools: ['legal-analyzer', 'compliance-checker', 'risk-assessor'],
            sandbox: 'contract-analyst-sandbox'
        },
        marketingAgent: {
            model: 'phi-3',
            tools: ['campaign-generator', 'seo-optimizer', 'content-creator'],
            sandbox: 'marketing-agent-sandbox'
        }
    },

    // Autonomous Features
    autonomous: {
        enabled: true,
        decisionConfidence: 0.85,
        autoOptimization: true,
        selfLearning: true
    }
};