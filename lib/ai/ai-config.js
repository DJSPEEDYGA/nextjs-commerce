/**
 * SUPER GOAT ROYALTIES - AI Configuration
 * Integration with 215 NVIDIA LLM Tools, Google AI Studio, and Custom Models
 */

// Auto-detect demo mode when no API keys are configured.
// DEMO_MODE env var can explicitly override: set DEMO_MODE=false to force live
// mode even during local testing, or DEMO_MODE=true to force demo mode.
let isDemoMode;
if (process.env.DEMO_MODE !== undefined && process.env.DEMO_MODE !== '') {
    isDemoMode = process.env.DEMO_MODE !== 'false';
} else {
    isDemoMode = !process.env.NVIDIA_API_KEY;
}

if (isDemoMode) {
    console.log('🎮 Running in DEMO MODE - AI features use simulated responses');
    console.log('   Set NVIDIA_API_KEY in .env (and DEMO_MODE=false) to enable live AI');
} else {
    console.log('🚀 Running in LIVE MODE - AI features use real NVIDIA NIM API');
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key-here') {
        console.warn('⚠  WARNING: JWT_SECRET is not set to a secure value. Update .env for production.');
    }
    if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY === 'your-encryption-key-here') {
        console.warn('⚠  WARNING: ENCRYPTION_KEY is not set to a secure value. Update .env for production.');
    }
}

module.exports = {
    // Demo Mode Flag
    demoMode: isDemoMode,

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