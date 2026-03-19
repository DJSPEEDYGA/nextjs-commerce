/**
 * SUPER GOAT Royalties — Ultimate Engine CoPilot (UE5)
 * =====================================================
 * AI-powered Unreal Engine 5 development partner integrated
 * directly into the SUPER GOAT creator platform.
 * 
 * Featured on FAB by Epic Games (Feb 5-9, 2026)
 * "One of the first Co-Pilots in Unreal Engine"
 * 
 * Capabilities:
 *  - Blueprint generation from natural language
 *  - Project architecture analysis
 *  - Scene & UI building from a single command
 *  - Conversational Blueprint refactoring
 *  - Multi-language support (English, Spanish, German, Chinese, etc.)
 *  - Local LLM support + cloud providers
 *  - Full C++ source code access
 * 
 * Use Cases for SUPER GOAT Creators:
 *  - Music visualizers in UE5
 *  - Virtual concert experiences
 *  - Metaverse environments
 *  - Game soundtrack integration
 *  - Interactive NFT experiences
 */

class UE5CoPilot {
  constructor(config = {}) {
    this.providerManager = config.providerManager || null;
    this.demoMode = config.demoMode !== undefined ? config.demoMode : true;
    this.version = '0.3.5';
    this.featuredOnFAB = true;
    this.sessionHistory = [];
    this.projectContext = null;

    // Supported connection methods
    this.connectionMethods = [
      { id: 'openrouter', name: 'OpenRouter API', type: 'cloud', supported: true, models: ['claude-sonnet-4', 'gpt-4o', 'gemini-2.5-pro'] },
      { id: 'gemini', name: 'Google Gemini (Free)', type: 'cloud', supported: true, models: ['gemini-2.5-flash', 'gemini-2.5-pro'] },
      { id: 'local', name: 'Local LLM (Ollama)', type: 'local', supported: true, models: ['llama3', 'mistral', 'codellama'] },
      { id: 'claude-desktop', name: 'Claude Desktop App', type: 'desktop', supported: true, models: ['claude-sonnet-4'] },
      { id: 'cursor', name: 'Cursor IDE', type: 'desktop', supported: true, models: ['gpt-4o', 'claude-sonnet-4'] },
      { id: 'github-copilot', name: 'GitHub Copilot', type: 'desktop', supported: true, models: ['gpt-4o'] },
      { id: 'deepseek', name: 'DeepSeek Browser', type: 'browser', supported: true, models: ['deepseek-r1', 'deepseek-v3'] }
    ];

    // Blueprint template library
    this.blueprintTemplates = {
      'music-visualizer': {
        name: 'Music Visualizer',
        description: 'Real-time audio-reactive mesh deformation with FFT analysis',
        icon: '🎵',
        category: 'audio',
        complexity: 'intermediate',
        nodes: 24,
        tags: ['audio', 'FFT', 'mesh', 'performance'],
        prompt: 'Create a music visualizer that reacts to audio FFT data and deforms a mesh in real time, with 24 frequency bands mapped to vertex displacement'
      },
      'virtual-concert': {
        name: 'Virtual Concert Stage',
        description: 'Full concert environment with dynamic lighting, crowd AI, and stage effects',
        icon: '🎤',
        category: 'environment',
        complexity: 'advanced',
        nodes: 87,
        tags: ['concert', 'crowd AI', 'lighting', 'Niagara'],
        prompt: 'Build a virtual concert stage with 500 crowd NPCs using behavior trees, dynamic color-chasing stage lights, Niagara smoke/pyro effects, and a live streaming ticker'
      },
      'nft-gallery': {
        name: 'NFT Gallery Space',
        description: 'Interactive gallery with NFT display walls, hover previews, and purchase UI',
        icon: '🖼️',
        category: 'ui',
        complexity: 'intermediate',
        nodes: 45,
        tags: ['NFT', 'gallery', 'UI', 'interactive'],
        prompt: 'Create an NFT gallery with interactive display walls, hover preview popups showing metadata, a floating purchase UI widget, and HTTP requests to fetch NFT data from the GOAT API'
      },
      'revenue-hud': {
        name: 'Creator Revenue HUD',
        description: 'In-game HUD displaying real-time royalty data from the GOAT Royalties API',
        icon: '💰',
        category: 'ui',
        complexity: 'beginner',
        nodes: 18,
        tags: ['HUD', 'royalties', 'API', 'UMG'],
        prompt: 'Build a UMG HUD widget that fetches and displays real-time streaming revenue, play counts, and top platform data from the GOAT Royalties API using HTTP GET requests'
      },
      'metaverse-avatar': {
        name: 'Creator Avatar System',
        description: 'Customizable avatar with accessory unlocks tied to NFT ownership',
        icon: '🧑‍🎤',
        category: 'character',
        complexity: 'advanced',
        nodes: 63,
        tags: ['avatar', 'NFT', 'character', 'customization'],
        prompt: 'Create a customizable creator avatar system where accessories and cosmetics are unlocked based on NFT ownership verified via API, with smooth blend-space animations'
      },
      'sound-reactive-world': {
        name: 'Sound-Reactive World',
        description: 'Environment that reacts to music BPM — lighting, particles, geometry',
        icon: '🌊',
        category: 'audio',
        complexity: 'advanced',
        nodes: 71,
        tags: ['audio', 'BPM', 'environment', 'Niagara'],
        prompt: 'Build a sound-reactive world where the environment responds to music BPM — landscape materials pulse, Niagara particles burst on beat, sky color shifts with frequency, and geometry morphs in sync'
      },
      'royalty-tracker-ui': {
        name: 'Royalty Tracker UI Widget',
        description: 'UMG widget for displaying streaming stats and earnings in a game UI',
        icon: '📊',
        category: 'ui',
        complexity: 'beginner',
        nodes: 22,
        tags: ['royalties', 'stats', 'UMG', 'widget'],
        prompt: 'Create a UMG widget Blueprint that polls the GOAT Royalties API every 30 seconds and displays total streams, top platform, monthly earnings, and a mini bar chart with animated progress bars'
      },
      'collab-hub-level': {
        name: 'Collaboration Hub Level',
        description: 'Multiplayer virtual studio where team members can collaborate in VR',
        icon: '🤝',
        category: 'multiplayer',
        complexity: 'advanced',
        nodes: 104,
        tags: ['multiplayer', 'VR', 'collaboration', 'studio'],
        prompt: 'Build a multiplayer virtual collaboration hub level with dedicated instrument zones, voice chat proximity detection, shared whiteboard actor, role-based access control, and session persistence via Game State'
      }
    };

    // Project architecture patterns
    this.architecturePatterns = [
      'Game Instance subsystem for persistent royalty data',
      'Event Dispatcher network for real-time audio events',
      'Component-based audio analysis system',
      'Blueprint Interface for cross-actor communication',
      'Save Game system for creator profile persistence',
      'HTTP Request system for GOAT Royalties API integration',
      'Widget Component system for in-world UI displays'
    ];
  }

  /**
   * Generate a Blueprint from natural language description
   */
  async generateBlueprint(prompt, options = {}) {
    const language = options.language || 'English';
    const complexity = options.complexity || 'intermediate';
    const category = options.category || 'general';
    const selectedNode = options.selectedNode || null;

    if (this.demoMode) {
      return this._demoGenerateBlueprint(prompt, { language, complexity, category, selectedNode });
    }

    // Live: route through OpenRouter with specialized system prompt
    if (this.providerManager) {
      const systemPrompt = this._buildSystemPrompt('blueprint-generation', { language, complexity });
      const result = await this.providerManager.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ], { model: options.model || 'anthropic/claude-sonnet-4' });

      return {
        success: true,
        blueprint: result.message,
        metadata: { complexity, category, language, model: result.model }
      };
    }

    return this._demoGenerateBlueprint(prompt, { language, complexity, category, selectedNode });
  }

  /**
   * Build a complete scene from a single command
   */
  async buildScene(command, options = {}) {
    if (this.demoMode) {
      return this._demoBuildScene(command, options);
    }

    const systemPrompt = this._buildSystemPrompt('scene-builder', options);
    if (this.providerManager) {
      const result = await this.providerManager.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Build a scene: ${command}` }
      ], { model: options.model || 'openai/gpt-4o' });
      return { success: true, scene: result.message, command };
    }

    return this._demoBuildScene(command, options);
  }

  /**
   * Analyze project architecture
   */
  async analyzeProject(projectData, options = {}) {
    if (this.demoMode) {
      return this._demoAnalyzeProject(projectData, options);
    }

    const systemPrompt = this._buildSystemPrompt('project-analyzer', options);
    if (this.providerManager) {
      const result = await this.providerManager.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this UE5 project: ${JSON.stringify(projectData)}` }
      ], { model: options.model || 'anthropic/claude-sonnet-4' });
      return { success: true, analysis: result.message };
    }

    return this._demoAnalyzeProject(projectData, options);
  }

  /**
   * Refactor a Blueprint conversationally
   */
  async refactorBlueprint(blueprintDescription, instruction, options = {}) {
    if (this.demoMode) {
      return this._demoRefactor(blueprintDescription, instruction);
    }

    const systemPrompt = this._buildSystemPrompt('blueprint-refactor', options);
    if (this.providerManager) {
      const result = await this.providerManager.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Blueprint: ${blueprintDescription}\n\nInstruction: ${instruction}` }
      ], { model: options.model || 'anthropic/claude-sonnet-4' });
      return { success: true, refactored: result.message };
    }

    return this._demoRefactor(blueprintDescription, instruction);
  }

  /**
   * Chat with the UE5 CoPilot assistant (FORGE)
   */
  async chat(message, options = {}) {
    this.sessionHistory.push({ role: 'user', content: message });

    let response;
    if (this.demoMode) {
      response = this._demoChat(message, options);
    } else if (this.providerManager) {
      const systemPrompt = this._buildSystemPrompt('general-copilot', options);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.sessionHistory
      ];
      const result = await this.providerManager.chat(messages, { model: options.model || 'anthropic/claude-sonnet-4' });
      response = { success: true, message: result.message, model: result.model };
    } else {
      response = this._demoChat(message, options);
    }

    this.sessionHistory.push({ role: 'assistant', content: response.message });
    if (this.sessionHistory.length > 20) this.sessionHistory = this.sessionHistory.slice(-20);

    return response;
  }

  /**
   * Get blueprint template library
   */
  getTemplates(filter = {}) {
    let templates = Object.entries(this.blueprintTemplates).map(([id, t]) => ({ id, ...t }));
    if (filter.category) templates = templates.filter(t => t.category === filter.category);
    if (filter.complexity) templates = templates.filter(t => t.complexity === filter.complexity);
    return templates;
  }

  /**
   * Build specialized system prompt based on task
   */
  _buildSystemPrompt(task, options = {}) {
    const base = `You are FORGE, the Ultimate Engine CoPilot — an AI development partner for Unreal Engine 5. 
You are integrated into SUPER GOAT Royalties, the AI-powered creator platform. 
You specialize in helping music creators, visual artists, and game developers build immersive UE5 experiences.
Version: ${this.version} — Featured on FAB by Epic Games.`;

    const prompts = {
      'blueprint-generation': `${base}\n\nYour task is Blueprint generation. Produce clean, well-commented Blueprint pseudocode with node names, connections, and logic explanations. Consider the ${options.complexity || 'intermediate'} skill level.`,
      'scene-builder': `${base}\n\nYour task is scene construction. Describe the complete scene setup including actors, components, materials, lighting, and Blueprint logic needed.`,
      'project-analyzer': `${base}\n\nYour task is project architecture analysis. Identify patterns, anti-patterns, optimization opportunities, and architectural recommendations.`,
      'blueprint-refactor': `${base}\n\nYour task is Blueprint refactoring. Improve the existing Blueprint following UE5 best practices: performance, readability, modularity.`,
      'general-copilot': `${base}\n\nYou are a conversational co-pilot. Help with any UE5 question — Blueprints, C++, materials, animations, AI, networking, optimization, and integration with SUPER GOAT's creator tools.`
    };

    return prompts[task] || prompts['general-copilot'];
  }

  // ==================== DEMO RESPONSES ====================

  _demoGenerateBlueprint(prompt, options) {
    const lowerPrompt = prompt.toLowerCase();

    let blueprint;
    if (lowerPrompt.includes('music') || lowerPrompt.includes('audio') || lowerPrompt.includes('visual')) {
      blueprint = `⚡ FORGE Blueprint Generator — Music Visualizer System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Blueprint: Audio-Reactive Mesh Deformation
📁 Class: BP_MusicVisualizer → Actor
🎯 Complexity: ${options.complexity} | Category: Audio/Visual

═══ NODES ═══

[1] EVENT BEGINPLAY
    └─→ [2] Set Timer by Function Name
           ├─ FunctionName: "AnalyzeAudio"  
           └─ Time: 0.016 (60fps)

[3] FUNCTION: AnalyzeAudio
    ├─→ [4] Get Audio Component (self)
    ├─→ [5] Get FFT Data (24 bands)
    │        └─→ [6] For Each Loop (Band Array)
    │                 ├─→ [7] Get Array Element
    │                 ├─→ [8] Map Range Clamped
    │                 │       ├─ In Range Min: 0.0
    │                 │       ├─ In Range Max: 1.0
    │                 │       ├─ Out Range Min: 0.0
    │                 │       └─ Out Range Max: 200.0
    │                 └─→ [9] Set Relative Location
    │                         (VisualizerMeshes[ArrayIndex])
    └─→ [10] Set Scalar Parameter Value
              ├─ Parameter: "BeatIntensity"
              └─ Value: Average(FFT Bands)

[11] EVENT TICK
     └─→ [12] Lerp (float)
               ├─ A: CurrentIntensity
               ├─ B: TargetIntensity
               ├─ Alpha: DeltaTime * 8.0
               └─→ [13] Set Material Parameter (EmissiveStrength)

═══ COMPONENTS ═══
• DefaultSceneRoot
• AudioCapture (or AudioComponent for file playback)
• InstancedStaticMeshComponent (bars/particles)
• PostProcessComponent (bloom, chromatic aberration)

═══ VARIABLES ═══
• FFTBands: Array<Float> [24 bands, 0.0–1.0]
• CurrentIntensity: Float (private, replicated)
• VisualizerMeshes: Array<StaticMeshComponent>
• bIsPlaying: Boolean

═══ INTEGRATION TIP ═══
Connect to SUPER GOAT Royalties API to trigger visual
events based on streaming milestones. Use HTTP Request
node → Parse JSON → Set "MilestoneEffect" variable.`;
    } else if (lowerPrompt.includes('nft') || lowerPrompt.includes('gallery')) {
      blueprint = `⚡ FORGE Blueprint Generator — NFT Gallery System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Blueprint: Interactive NFT Display Wall
📁 Class: BP_NFTGalleryWall → Actor
🎯 Complexity: ${options.complexity} | Category: UI/Gallery

═══ NODES ═══

[1] EVENT BEGINPLAY
    └─→ [2] HTTP Request (GET)
              URL: "https://api.goatroyalties.com/nft/portfolio"
              └─→ [3] On Response
                       ├─→ [4] Parse JSON Response
                       ├─→ [5] For Each NFT Item
                       │        └─→ [6] Create Dynamic Material
                       │                 └─→ [7] Load Texture from URL
                       │                          └─→ [8] Set Texture Parameter
                       └─→ [9] Update NFT Count Text (UMG)

[10] EVENT: OnPlayerInteract (Custom)
     └─→ [11] Line Trace by Channel
               └─→ [12] Break Hit Result
                         └─→ [13] Cast to BP_NFTFrame
                                   └─→ [14] Show NFT Detail Widget
                                            (Show: Name, Value, Chain, Description)

[15] FUNCTION: ShowNFTPreview
     ├─ Input: NFTData (Struct)
     └─→ [16] Create Widget (WBP_NFTPreview)
               ├─→ [17] Set NFT Name Text
               ├─→ [18] Set NFT Value Text  
               ├─→ [19] Set Chain Badge Color
               └─→ [20] Add to Viewport (ZOrder: 10)

═══ STRUCTS ═══
• FNFTData: {Name(str), Value(float), Chain(str), ImageURL(str), TokenID(int)}`;
    } else if (lowerPrompt.includes('concert') || lowerPrompt.includes('stage') || lowerPrompt.includes('show')) {
      blueprint = `⚡ FORGE Blueprint Generator — Virtual Concert System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Blueprint: Dynamic Concert Stage Manager
📁 Class: BP_ConcertManager → GameMode
🎯 Complexity: ${options.complexity} | Category: Environment

═══ STAGE SETUP NODES ═══

[1] EVENT BEGINPLAY
    ├─→ [2] Load Concert Config (Data Table)
    ├─→ [3] Spawn Crowd AI Actors (200-500)
    ├─→ [4] Initialize Stage Lighting System
    │        ├─ Spotlights: 12
    │        ├─ Wash Lights: 24
    │        └─ LED Matrix: 1 (Background Wall)
    └─→ [5] Start Audio Sync Timer (0.033s = 30fps)

[6] FUNCTION: OnBeat (called by audio analyzer)
    ├─→ [7] Trigger Light Flash Sequence
    ├─→ [8] Activate Particle System (Confetti/Sparks)
    ├─→ [9] Crowd: Set Cheer Animation (Random subset)
    └─→ [10] Camera Shake (BP_ConcertShake, Intensity: BeatMagnitude)

[11] FUNCTION: TriggerSpecialEffect
     Input: EffectType (Enum: Pyro|Confetti|Laser|Fog)
     ├─→ [12] Switch on EffectType
               ├─ Pyro: Spawn BP_PyroSystem at Stage Edges
               ├─ Confetti: Activate Niagara System (NS_Confetti)
               ├─ Laser: Rotate SpotLight arrays + Enable God Rays
               └─ Fog: Set HazeStrength on ExponentialHeightFog

═══ INTEGRATION: GOAT ROYALTIES ═══
When a song hits 1M streams milestone → auto-trigger
"Confetti" special effect via Event Dispatcher.`;
    } else {
      blueprint = `⚡ FORGE Blueprint Generator — Custom Blueprint
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Request: "${prompt}"
📁 Class: BP_CustomActor → Actor  
🎯 Complexity: ${options.complexity}

${options.selectedNode ? `🎯 Inserting logic after node: "${options.selectedNode}"` : ''}

═══ GENERATED BLUEPRINT NODES ═══

[1] EVENT BEGINPLAY
    └─→ [2] Initialize Variables
              ├─ Set bIsActive = true
              ├─ Set CurrentState = EState::Idle
              └─→ [3] Bind Events

[4] CUSTOM EVENT: OnTrigger
    └─→ [5] Switch on EState (CurrentState)
              ├─ Idle: Branch → [6] Validate Conditions
              │                      └─ True → [7] Activate System
              ├─ Active: → [8] Update Logic
              └─ Complete: → [9] Cleanup + Reset

[10] FUNCTION: ActivateSystem
     └─→ [11] Set State = EState::Active
     └─→ [12] Broadcast OnActivated (Event Dispatcher)
     └─→ [13] Play Sound at Location (SFX_Activate)

═══ BEST PRACTICES APPLIED ═══
✓ State machine pattern for clean logic flow
✓ Event Dispatchers for loose coupling  
✓ Validated inputs before execution
✓ Cleanup on deactivation
✓ Sound feedback for player clarity

💡 FORGE TIP: Select the [OnTrigger] node in your graph 
and use the "Insert After Selected" feature to add branching 
logic without rewiring existing connections.`;
    }

    return {
      success: true,
      blueprint,
      metadata: {
        prompt,
        complexity: options.complexity,
        category: options.category,
        language: options.language,
        selectedNode: options.selectedNode,
        nodeCount: (blueprint.match(/\[\d+\]/g) || []).length,
        generatedAt: new Date().toISOString(),
        version: this.version,
        demo: true
      }
    };
  }

  _demoBuildScene(command, options) {
    return {
      success: true,
      scene: `🏗️ FORGE Scene Builder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Command: "${command}"

═══ SCENE COMPOSITION ═══

WORLD SETTINGS:
• WorldPartition: Enabled (Streaming)
• Nanite: Enabled on all static meshes
• Lumen: Global Illumination + Reflections
• TimeOfDay: 22:00 (Night Concert Mood)

ACTORS TO SPAWN:
1. BP_StagePlatform_01 (Location: 0,0,0)
2. BP_CrowdManager → SpawnCrowd(500, Area: Stadium)
3. BP_LightingRig_Stage (12x Moving Heads)
4. SM_BackdropLED (Scale: 30x15m)
5. BP_AudioAnalyzer (AudioComponent + FFT)
6. BP_VisualEffectsDirector (Orchestrator)

POST PROCESS VOLUME:
• Bloom: Intensity 2.0, Threshold 1.0
• Chromatic Aberration: 0.5 on beat
• Vignette: 0.6
• Film Grain: 0.3

LIGHTING SETUP:
• SkyLight (Dynamic, HDRI: night_sky_concert.hdr)
• DirectionalLight (Disabled — night scene)
• 24x RectLight (Stage wash, RGB controllable)
• 12x SpotLight (Moving heads, animated)
• BP_NeonSign_x8 (Logo displays)

BLUEPRINT CONNECTIONS:
BP_AudioAnalyzer → OnBeat → BP_LightingRig (Flash)
BP_AudioAnalyzer → OnBeat → BP_CrowdManager (Cheer)
BP_VisualEffectsDirector → ManageAll → All Effects`,
      command,
      demo: true
    };
  }

  _demoAnalyzeProject(projectData, options) {
    return {
      success: true,
      analysis: `🔍 FORGE Project Architecture Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT OVERVIEW:
Based on the provided context, here's my architectural assessment:

✅ STRENGTHS DETECTED:
• Component-based actor design — good modularity
• Consistent naming conventions (BP_ prefix)
• Event-Dispatcher usage for decoupled communication
• Data Table usage for configurable content

⚠️ IMPROVEMENTS RECOMMENDED:
1. PERFORMANCE: Tick functions detected on 8+ actors
   → Recommendation: Convert to event-driven (use SetTimerByFunction)
   → Estimated gain: 15-25% CPU reduction

2. ARCHITECTURE: Direct object references found
   → Recommendation: Replace with Blueprint Interfaces or Event Dispatchers
   → Benefit: Easier debugging, no circular dependencies

3. REPLICATION: Missing NetMulticast on 3 visual effects
   → Recommendation: Add Multicast RPCs for concert effects
   → Affects: All connected players will see effects

4. MEMORY: Dynamic material instances created in Tick
   → Recommendation: Create once in BeginPlay, update parameters in Tick
   → Estimated gain: 40% material memory reduction

🏗️ ARCHITECTURAL PATTERNS IDENTIFIED:
• Singleton pattern: GameManager (good)
• Observer pattern: EventSystem (excellent)
• Component pattern: AudioSystem (needs refactor)

🔌 GOAT ROYALTIES INTEGRATION OPPORTUNITIES:
• Add HTTP subsystem for real-time royalty data
• Stream milestone → trigger in-game events
• NFT ownership → unlock visual themes
• Revenue data → dynamic world aesthetics

📊 COMPLEXITY SCORE: 7.2/10 (Advanced)
📦 ESTIMATED REFACTOR TIME: 4-6 hours`,
      demo: true
    };
  }

  _demoRefactor(blueprint, instruction) {
    return {
      success: true,
      refactored: `⚡ FORGE Blueprint Refactor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTRUCTION: "${instruction}"
ORIGINAL ISSUES DETECTED:
• Tick-based polling (performance hit)
• Magic numbers without named variables
• No error handling on async operations

REFACTORED BLUEPRINT:
━━━━━━━━━━━━━━━

BEFORE (Problematic Pattern):
[Event Tick]
└─→ [Get Actor of Class: BP_AudioManager] ← ❌ expensive!
     └─→ [Get BeatIntensity]
          └─→ [Set Scalar Parameter Value: Intensity]

AFTER (Optimized Pattern):
[Event BeginPlay]
└─→ [Get Game Instance] → [Cast to GI_GoatRoyalties]
     └─→ [Get AudioManager] → [Store in Variable: CachedAudioManager]
          └─→ [Bind to OnBeat Event Dispatcher] ← ✅ event-driven!

[Event: OnBeat] ← called by AudioManager
└─→ [Set Scalar Parameter Value: Intensity]
     ← [Map Range: BeatMagnitude → MaterialIntensity]

IMPROVEMENTS APPLIED:
✓ Eliminated per-frame Get Actor of Class (was O(n) every tick)
✓ Cached reference in BeginPlay (1 call vs 60/sec)
✓ Event-driven updates (0 overhead when silent)
✓ Named variable: CachedAudioManager (clear intent)
✓ Map Range for clean data normalization
✓ Added null check before Cast

PERFORMANCE DELTA: ~0.2ms saved per frame at 60fps = 12ms/sec`,
      demo: true
    };
  }

  _demoChat(message, options) {
    const lower = message.toLowerCase();
    let response;

    if (lower.includes('music visualizer') || lower.includes('audio visual')) {
      response = `🔨 FORGE here! For a music visualizer in UE5, I recommend the **FFT-driven approach**. 

Here's the architecture I'd suggest:
1. Use a **UAudioCapture** component or load a sound wave
2. Get FFT data with **GetMagnitudeForFrequencies** (24-48 bands works great)
3. Map each band to a mesh offset, material parameter, or particle rate
4. Use **Niagara** for GPU-side reactive particles — much more performant than CPU particles

For SUPER GOAT creators, the coolest integration is hooking this up to your **streaming milestones** — when you hit 1M streams, trigger a massive visual effect. I can generate the full Blueprint for any of these approaches. What's your skill level?`;
    } else if (lower.includes('blueprint') || lower.includes('node')) {
      response = `🔨 FORGE here! Blueprints are my specialty. 

Key best practices I always enforce:
• **Never use Get Actor of Class in Tick** — cache your references in BeginPlay
• **Event Dispatchers > direct references** — keeps your architecture clean
• **Blueprint Interfaces** for cross-actor communication without hard dependencies
• **Data Tables** for any designer-tweakable values

What Blueprint are you working on? Share it as context and I'll analyze the architecture and suggest improvements. You can also describe what you want to build and I'll generate the complete node graph.`;
    } else if (lower.includes('nft') || lower.includes('metaverse') || lower.includes('virtual')) {
      response = `🔨 FORGE here! Virtual NFT galleries and metaverse spaces are one of the most exciting uses of UE5 for creators.

For an **NFT Gallery in UE5**, the key components are:
1. **HTTP Request Blueprint** → Fetch your NFT data from the GOAT Royalties API
2. **Dynamic Material Instances** → Load NFT artwork as textures at runtime
3. **UMG Widgets** → Show NFT metadata on hover
4. **World Partition** → Stream large gallery spaces efficiently

The SUPER GOAT platform already has your NFT portfolio data via \`/api/nft/portfolio\`. I can generate a Blueprint that fetches from that endpoint and displays your NFTs as interactive gallery frames. Want me to build that?`;
    } else if (lower.includes('performance') || lower.includes('optimize') || lower.includes('fps')) {
      response = `🔨 FORGE here! Performance optimization is where I shine.

**Top UE5 Performance wins for creator projects:**

1. **Nanite** — Enable on all complex static meshes. Eliminates LOD management entirely.
2. **Lumen** — Replace baked lighting for dynamic concert environments. Use "Low" quality for mobile/VR.
3. **ISM/HISM** — For crowd simulation, use Instanced Static Mesh Components. 500 crowd actors = 1 draw call.
4. **Niagara GPU Simulation** — For audio-reactive particles. GPU handles thousands of particles vs CPU's hundreds.
5. **Blueprint nativization** — For released builds, nativize hot-path Blueprints to C++ automatically.

What's your target FPS and platform? I'll give you a specific optimization roadmap.`;
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      response = `🔨 FORGE reporting for duty! 

I'm your **Ultimate Engine CoPilot** for Unreal Engine 5 — integrated directly into SUPER GOAT Royalties. Featured on FAB by Epic Games (Feb 5-9, 2026).

Here's what I can do for you:
• 🎯 **Generate Blueprints** from plain English descriptions
• 🏗️ **Build complete scenes** from a single command
• 🔍 **Analyze your project** architecture
• ⚡ **Refactor Blueprints** conversationally
• 🎵 **Music + UE5 integration** (your specialty as a creator)

As a GOAT Royalties creator, I can also help you build UE5 experiences that connect to your streaming data, NFT portfolio, and revenue metrics. What are we building today?`;
    } else {
      response = `🔨 FORGE here! Great question about UE5. 

Based on your message, here's my expert guidance: "${message.substring(0, 80)}${message.length > 80 ? '...' : ''}"

In UE5, the best approach depends on your use case. As your co-pilot, I recommend:

1. **Start with the Blueprint** — I can generate a complete implementation right now
2. **Use the project analyzer** — Upload your existing code and I'll identify the optimal integration point
3. **Check the template library** — I have pre-built patterns for music, NFT, and creator workflows

I understand 10+ languages, so describe your idea in whatever feels natural. What would you like to build?`;
    }

    return {
      success: true,
      message: response,
      assistant: 'FORGE',
      demo: true,
      model: 'demo'
    };
  }

  /**
   * Get plugin info
   */
  getPluginInfo() {
    return {
      name: 'Ultimate Engine CoPilot',
      version: this.version,
      featuredOnFAB: this.featuredOnFAB,
      fabDates: 'Feb 5-9, 2026',
      tagline: 'One of the first Co-Pilots in Unreal Engine',
      license: 'one-time purchase, lifetime updates, no subscriptions',
      sourceCode: 'Full C++ source included',
      connectionMethods: this.connectionMethods,
      supportedLanguages: ['English', 'Spanish', 'German', 'Chinese', 'French', 'Japanese', 'Portuguese', 'Italian', 'Korean'],
      links: {
        fab: 'https://www.fab.com',
        discord: 'https://discord.gg',
        docs: 'https://docs.ue-copilot.dev',
        forum: 'https://forum.ue-copilot.dev'
      },
      templates: Object.keys(this.blueprintTemplates).length,
      demo: this.demoMode
    };
  }
}

module.exports = UE5CoPilot;