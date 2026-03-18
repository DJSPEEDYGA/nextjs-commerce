/**
 * SUPER GOAT ROYALTIES - AI Configuration
 * Integration with 215 NVIDIA LLM Tools, Google AI Studio, Lightning AI, and Custom Models
 * Updated: Lightning AI Model Hub with 14 production models
 */

// Auto-detect demo mode when no API keys are configured
const isDemoMode = !process.env.NVIDIA_API_KEY && !process.env.LIGHTNING_API_KEY;

if (isDemoMode) {
    console.log('🎮 Running in DEMO MODE - AI features use simulated responses');
    console.log('   Set NVIDIA_API_KEY or LIGHTNING_API_KEY in .env to enable live AI');
}

module.exports = {
    // Demo Mode Flag
    demoMode: isDemoMode,

    // ==========================================
    // LIGHTNING AI - Model API Hub (14 Models)
    // ==========================================
    lightning: {
        baseUrl: process.env.LIGHTNING_API_URL || 'https://api.lightning.ai/v1',
        apiKey: process.env.LIGHTNING_API_KEY,
        models: {
            // ---- Lightning AI Native Models ----
            'gpt-oss-20b': {
                id: 'lightning-ai/gpt-oss-20b',
                name: 'GPT OSS 20B',
                provider: 'Lightning AI',
                costInput: 0.05,
                costOutput: 0.20,
                lightningCostInput: 0.01,
                lightningCostOutput: 0.05,
                latency: 3.04,
                throughput: 6.43,
                contextLength: 128000,
                type: 'text',
                description: 'Lightweight open-source GPT model, fast and cost-effective for general tasks',
                tags: ['fast', 'budget', 'general']
            },
            'gpt-oss-120b': {
                id: 'lightning-ai/gpt-oss-120b',
                name: 'GPT OSS 120B',
                provider: 'Lightning AI',
                costInput: 0.10,
                costOutput: 0.40,
                lightningCostInput: 0.02,
                lightningCostOutput: 0.10,
                latency: 0.90,
                throughput: 177.56,
                contextLength: 128000,
                type: 'text',
                description: 'High-throughput open-source GPT model for demanding workloads',
                tags: ['high-throughput', 'powerful', 'general']
            },
            'llama-3.3-70b': {
                id: 'lightning-ai/llama-3.3-70b',
                name: 'Llama 3.3 70B',
                provider: 'Lightning AI',
                costInput: 0.30,
                costOutput: 0.30,
                lightningCostInput: 0.07,
                lightningCostOutput: 0.07,
                latency: 0.83,
                throughput: 60.23,
                contextLength: 128000,
                type: 'text',
                description: 'Meta\'s latest Llama model, excellent balance of quality and speed',
                tags: ['balanced', 'meta', 'popular']
            },
            'deepseek-v3.1': {
                id: 'lightning-ai/deepseek-v3.1',
                name: 'DeepSeek V3.1',
                provider: 'Lightning AI',
                costInput: 0.32,
                costOutput: 1.10,
                lightningCostInput: 0.08,
                lightningCostOutput: 0.28,
                latency: 0.65,
                throughput: 90.23,
                contextLength: 164000,
                type: 'text',
                description: 'DeepSeek\'s advanced reasoning model with extended context',
                tags: ['reasoning', 'deepseek', 'extended-context']
            },
            'nemotron-3-super-120b': {
                id: 'lightning-ai/nvidia-nemotron-3-super-120b',
                name: 'NVIDIA Nemotron 3 Super 120B',
                provider: 'Lightning AI',
                costInput: 1.40,
                costOutput: 3.00,
                lightningCostInput: 0.35,
                lightningCostOutput: 0.75,
                latency: 1.06,
                throughput: 376.15,
                contextLength: 256000,
                type: 'text',
                description: 'NVIDIA\'s flagship model with massive context and highest throughput',
                tags: ['premium', 'nvidia', 'highest-throughput', 'large-context']
            },
            'minimax-m2.5': {
                id: 'lightning-ai/minimax-m2.5',
                name: 'MiniMax M2.5',
                provider: 'Lightning AI',
                costInput: 1.00,
                costOutput: 4.80,
                lightningCostInput: 0.25,
                lightningCostOutput: 1.20,
                latency: 0.85,
                throughput: 108.49,
                contextLength: 196000,
                type: 'text',
                description: 'MiniMax\'s powerful model with 196K context window',
                tags: ['large-context', 'minimax', 'powerful']
            },
            'kimi-k2.5': {
                id: 'lightning-ai/kimi-k2.5',
                name: 'Kimi K2.5',
                provider: 'Lightning AI',
                costInput: 2.32,
                costOutput: 12.00,
                lightningCostInput: 0.58,
                lightningCostOutput: 3.00,
                latency: 0.63,
                throughput: 280.46,
                contextLength: 256000,
                type: 'text',
                description: 'Kimi\'s ultra-high throughput model with 256K context',
                tags: ['ultra-throughput', 'kimi', 'large-context']
            },
            'glm-5': {
                id: 'lightning-ai/glm-5',
                name: 'GLM-5',
                provider: 'Lightning AI',
                costInput: 3.60,
                costOutput: 12.80,
                lightningCostInput: 0.90,
                lightningCostOutput: 3.20,
                latency: 4.86,
                throughput: 54.95,
                contextLength: 200000,
                type: 'text',
                description: 'GLM\'s advanced model with strong multilingual capabilities',
                tags: ['multilingual', 'glm', 'large-context']
            },

            // ---- OpenAI Models (via Lightning AI) ----
            'gpt-5-nano': {
                id: 'openai/gpt-5-nano',
                name: 'GPT 5 nano',
                provider: 'OpenAI',
                costInput: 0.05,
                costOutput: 0.40,
                latency: 2.42,
                throughput: 107.33,
                contextLength: 400000,
                type: 'text',
                description: 'OpenAI\'s smallest GPT-5 model with massive 400K context',
                tags: ['openai', 'gpt-5', 'massive-context', 'budget']
            },
            'gpt-5-mini': {
                id: 'openai/gpt-5-mini',
                name: 'GPT 5 mini',
                provider: 'OpenAI',
                costInput: 0.25,
                costOutput: 2.00,
                latency: 35.39,
                throughput: 3.23,
                contextLength: 400000,
                type: 'text',
                description: 'OpenAI\'s mid-tier GPT-5 model for complex reasoning tasks',
                tags: ['openai', 'gpt-5', 'reasoning', 'massive-context']
            },
            'gpt-3.5-turbo': {
                id: 'openai/gpt-3.5-turbo',
                name: 'GPT 3.5 Turbo',
                provider: 'OpenAI',
                costInput: 0.50,
                costOutput: 1.50,
                latency: 1.15,
                throughput: 88.68,
                contextLength: 16000,
                type: 'text',
                description: 'Classic GPT 3.5 Turbo, fast and reliable for standard tasks',
                tags: ['openai', 'classic', 'fast', 'reliable']
            },

            // ---- Google Models (via Lightning AI) ----
            'gemini-2.5-flash-lite': {
                id: 'google/gemini-2.5-flash-lite',
                name: 'Gemini 2.5 Flash Lite',
                provider: 'Google',
                costInput: 0.10,
                costOutput: 0.40,
                latency: 4.80,
                throughput: 7.61,
                contextLength: 1000000,
                type: 'text',
                description: 'Google\'s lightweight Gemini model with 1M token context',
                tags: ['google', 'gemini', 'million-context', 'budget']
            },
            'gemini-3-flash': {
                id: 'google/gemini-3-flash',
                name: 'Gemini 3 Flash',
                provider: 'Google',
                costInput: 0.50,
                costOutput: 1.00,
                latency: 1.66,
                throughput: 159.34,
                contextLength: 1000000,
                type: 'text',
                description: 'Google\'s next-gen Gemini 3 Flash with incredible throughput and 1M context',
                tags: ['google', 'gemini-3', 'million-context', 'high-throughput']
            },
            'gemini-2.5-flash': {
                id: 'google/gemini-2.5-flash',
                name: 'Gemini 2.5 Flash',
                provider: 'Google',
                costInput: 0.30,
                costOutput: 2.50,
                latency: 5.42,
                throughput: 20.31,
                contextLength: 1000000,
                type: 'text',
                description: 'Google\'s premium Gemini 2.5 Flash with advanced reasoning and 1M context',
                tags: ['google', 'gemini', 'million-context', 'reasoning']
            }
        }
    },

    // NVIDIA NIM Integration
    nvidia: {
        baseUrl: process.env.NVIDIA_NIM_URL || 'https://integrate.api.nvidia.com/v1',
        apiKey: process.env.NVIDIA_API_KEY,
        models: {
            // Llama Models
            'llama2-70b': 'meta/llama-2-70b-chat',
            'llama2-13b': 'meta/llama-2-13b-chat',
            'mixtral-8x7b': 'mistralai/mixtral-8x7b-instruct-v0.1',
            'nemotron-70b': 'nvidia/nemotron-4-340b-instruct',
            'phi-3': 'microsoft/phi-3-mini-128k-instruct',
            
            // Code Generation Models
            'codellama-34b': 'codellama/codellama-34b-instruct',
            'starcoder2': 'bigcode/starcoder2-15b',
            
            // Multimodal Models
            'nemo-multimodal': 'nvidia/nemotron-4-340b-multimodal',
            
            // Embedding Models
            'nv-embedqa': 'nvidia/nv-embedqa-e5-v5'
        }
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

    // Agent Configuration
    agents: {
        royaltyTracker: {
            model: 'mixtral-8x7b',
            tools: ['revenue-analyzer', 'platform-integrator', 'prediction-engine']
        },
        contentAdvisor: {
            model: 'llama2-70b',
            tools: ['market-analyzer', 'trend-detector', 'recommender']
        },
        contractAnalyst: {
            model: 'nemotron-70b',
            tools: ['legal-analyzer', 'compliance-checker', 'risk-assessor']
        },
        marketingAgent: {
            model: 'phi-3',
            tools: ['campaign-generator', 'seo-optimizer', 'content-creator']
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