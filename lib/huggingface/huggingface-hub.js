const https = require('https');

/**
 * HuggingFace Hub Client - NO API KEY REQUIRED
 * Uses public Hugging Face API for models and datasets
 * Free access to 800K+ models and 200K+ datasets
 */
class HuggingFaceHub {
  constructor() {
    this.baseUrl = 'huggingface.co';
    this.apiPrefix = '/api';
    this.cache = new Map();
    this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    
    // GOAT Curated Collections
    this.curatedCollections = {
      music: {
        name: '🎵 Music AI',
        description: 'Text-to-music, audio generation, music mixing',
        models: [
          'facebook/musicgen-large',
          'facebook/musicgen-melody',
          'meta/musicgen-large',
          'stabilityai/stable-audio-open-1.0',
          'openai/whisper-large-v3-turbo',
          'openai/whisper-large-v3'
        ]
      },
      llm: {
        name: '🧠 LLMs & Chat',
        description: 'Chatbots, text generation, instruction following',
        models: [
          'meta-llama/Llama-3.3-70B-Instruct',
          'mistralai/Mistral-7B-Instruct-v0.3',
          'Qwen/Qwen2.5-72B-Instruct',
          'google/gemma-2-27b-it',
          'microsoft/DialoGPT-large',
          'facebook/blenderbot-400M-distill'
        ]
      },
      image: {
        name: '🖼️ Image AI',
        description: 'Text-to-image, image editing, style transfer',
        models: [
          'stabilityai/stable-diffusion-xl-base-1.0',
          'black-forest-labs/FLUX.1-dev',
          'black-forest-labs/FLUX.1-schnell',
          'midjourney/stable-diffusion-v1-5',
          'runwayml/stable-diffusion-v1-5',
          'deep-floyd/IF-I-XL-v1.0'
        ]
      },
      security: {
        name: '🛡️ Security & Safety',
        description: 'Hate speech detection, content moderation, NSFW detection',
        models: [
          'facebook/roberta-hate-speech-dynabench-r4',
          'unitary/toxic-bert',
          'microsoft/deberta-v3-base-tasksource-nli',
          'Elron/stock-distilbert-nli',
          'nlp-with-badgers/bert-finetuned-toxic-comments',
          'Hate-speech-CNERG/deepfakes-SD'
        ]
      },
      coding: {
        name: '💻 Coding & Development',
        description: 'Code generation, code completion, bug detection',
        models: [
          'Qwen/Qwen2.5-Coder-32B-Instruct',
          'bigcode/starcoder2-15b',
          'deepseek-ai/deepseek-coder-6.7b-base',
          'microsoft/CodeGPT-small-py',
          'google/flan-t5-large',
          'Salesforce/codegen-16B-mono'
        ]
      },
      video: {
        name: '🎬 Video AI',
        description: 'Text-to-video, video generation, video editing',
        models: [
          'stabilityai/stable-video-diffusion-img2vid-xt',
          'zeroscope/v2-xl',
          'damo-vilab/i2vgen-xl',
          'cerspense/zeroscope_v2_576w',
          'modelscope/damo-text-to-video-synthesis',
          'ByteDance/AnimateDiff-Lightning'
        ]
      }
    };
    
    // Task categories for filtering
    this.taskCategories = [
      'text-generation', 'text2text-generation', 'text-classification',
      'token-classification', 'question-answering', 'fill-mask',
      'summarization', 'translation', 'feature-extraction',
      'text-to-image', 'image-to-text', 'image-classification',
      'image-segmentation', 'object-detection', 'audio-classification',
      'automatic-speech-recognition', 'text-to-speech', 'audio-to-audio',
      'image-to-image', 'zero-shot-image-classification', 'video-classification'
    ];
  }

  /**
   * Make HTTP request to Hugging Face API
   */
  async _request(endpoint) {
    // Check cache
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseUrl,
        path: this.apiPrefix + endpoint,
        method: 'GET',
        headers: {
          'User-Agent': 'GOAT-Royalty-App/5.1.0'
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200 || res.statusCode === 304) {
              const parsed = JSON.parse(data);
              
              // Cache successful responses
              this.cache.set(cacheKey, {
                data: parsed,
                timestamp: Date.now()
              });
              
              resolve(parsed);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          } catch (e) {
            reject(new Error(`Parse error: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(15000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      req.end();
    });
  }

  /**
   * Get models with optional filters
   */
  async getModels({ search, filter, sort, limit = 20, author } = {}) {
    let endpoint = '/models';
    const params = [];
    
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (filter) params.push(`filter=${encodeURIComponent(filter)}`);
    if (sort) params.push(`sort=${encodeURIComponent(sort)}`);
    if (limit) params.push(`limit=${limit}`);
    if (author) params.push(`author=${encodeURIComponent(author)}`);
    
    if (params.length > 0) {
      endpoint += '?' + params.join('&');
    }

    return this._request(endpoint);
  }

  /**
   * Get datasets with optional filters
   */
  async getDatasets({ search, author, sort, limit = 20 } = {}) {
    let endpoint = '/datasets';
    const params = [];
    
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (author) params.push(`author=${encodeURIComponent(author)}`);
    if (sort) params.push(`sort=${encodeURIComponent(sort)}`);
    if (limit) params.push(`limit=${limit}`);
    
    if (params.length > 0) {
      endpoint += '?' + params.join('&');
    }

    return this._request(endpoint);
  }

  /**
   * Get specific model details
   */
  async getModel(author, model) {
    return this._request(`/models/${author}/${model}`);
  }

  /**
   * Get model files
   */
  async getModelFiles(author, model) {
    return this._request(`/models/${author}/${model}/tree/main`);
  }

  /**
   * Search both models and datasets
   */
  async search(query, type = 'model') {
    if (type === 'model') {
      return this.getModels({ search: query, limit: 50 });
    } else {
      return this.getDatasets({ search: query, limit: 50 });
    }
  }

  /**
   * Get trending models
   */
  async getTrendingModels(limit = 20) {
    return this.getModels({ sort: 'trendingScore', limit });
  }

  /**
   * Get most downloaded models
   */
  async getMostDownloadedModels(limit = 20) {
    return this.getModels({ sort: 'downloads', limit });
  }

  /**
   * Get trending datasets
   */
  async getTrendingDatasets(limit = 20) {
    return this.getDatasets({ sort: 'trendingScore', limit });
  }

  /**
   * Get models by task
   */
  async getModelsByTask(task, limit = 20) {
    return this.getModels({ filter: task, limit });
  }

  /**
   * Get GOAT curated collection
   */
  async getCollection(collectionId) {
    const collection = this.curatedCollections[collectionId];
    if (!collection) {
      throw new Error(`Collection ${collectionId} not found`);
    }

    // Fetch model details for each model in collection
    const models = await Promise.all(
      collection.models.map(async (modelId) => {
        try {
          const [author, model] = modelId.split('/');
          return await this.getModel(author, model);
        } catch (e) {
          console.error(`Error fetching ${modelId}:`, e.message);
          return null;
        }
      })
    );

    return {
      id: collectionId,
      name: collection.name,
      description: collection.description,
      models: models.filter(m => m !== null)
    };
  }

  /**
   * Get download information
   */
  getDownloadInfo(type, author, id) {
    const fullId = `${author}/${id}`;
    const baseUrl = `https://huggingface.co/${fullId}`;
    
    return {
      id: fullId,
      type: type,
      url: baseUrl,
      downloadMethods: [
        {
          method: 'Git Clone',
          command: `git clone ${baseUrl}`,
          description: 'Clone entire repository with Git'
        },
        {
          method: 'Hugging Face CLI',
          command: `pip install huggingface_hub\nhuggingface-cli download ${fullId}`,
          description: 'Download with HF CLI (partial files supported)'
        },
        {
          method: 'Python (Transformers)',
          command: `from transformers import AutoModel, AutoTokenizer\n\nmodel = AutoModel.from_pretrained("${fullId}")\ntokenizer = AutoTokenizer.from_pretrained("${fullId}")`,
          description: 'Load directly in Python with Transformers library'
        },
        {
          method: 'Python (Datasets)',
          command: `from datasets import load_dataset\n\ndataset = load_dataset("${fullId}")`,
          description: 'Load datasets with Datasets library'
        },
        {
          method: 'Direct Download',
          url: `${baseUrl}/resolve/main/`,
          description: 'Download individual files from browser'
        }
      ],
      noApiRequired: true,
      noLoginRequired: true
    };
  }

  /**
   * Get API info
   */
  getInfo() {
    return {
      name: 'Hugging Face Hub Integration',
      version: '1.0.0',
      status: 'active',
      features: {
        models: '800K+ models',
        datasets: '200K+ datasets',
        apiAuth: 'None required (public API)',
        downloadMethods: 5,
        curatedCollections: Object.keys(this.curatedCollections).length,
        taskCategories: this.taskCategories.length
      },
      endpoints: [
        'GET /api/hf/info',
        'GET /api/hf/models',
        'GET /api/hf/models/trending',
        'GET /api/hf/models/most-downloaded',
        'GET /api/hf/models/task/:task',
        'GET /api/hf/model/:author/:model',
        'GET /api/hf/model/:author/:model/files',
        'GET /api/hf/datasets',
        'GET /api/hf/datasets/trending',
        'GET /api/hf/search',
        'GET /api/hf/collections',
        'GET /api/hf/collection/:id',
        'GET /api/hf/download/:type/:author/:id',
        'GET /api/hf/tasks'
      ]
    };
  }

  /**
   * Get dashboard data
   */
  async getDashboard() {
    const [trendingModels, topDownloads, trendingDatasets, collections] = await Promise.all([
      this.getTrendingModels(10),
      this.getMostDownloadedModels(10),
      this.getTrendingDatasets(10),
      Promise.all(
        Object.keys(this.curatedCollections).map(id => this.getCollection(id))
      )
    ]);

    return {
      stats: {
        totalCollections: Object.keys(this.curatedCollections).length,
        totalTaskCategories: this.taskCategories.length,
        trendingModelsCount: trendingModels.length,
        topDownloadsCount: topDownloads.length,
        trendingDatasetsCount: trendingDatasets.length
      },
      trendingModels: trendingModels,
      topDownloads: topDownloads,
      trendingDatasets: trendingDatasets,
      collections: collections.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        modelCount: c.models.length
      }))
    };
  }
}

module.exports = HuggingFaceHub;