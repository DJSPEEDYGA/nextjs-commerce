/**
 * GOAT Royalty App - Music Royalty Management Platform
 * Copyright © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST. All rights reserved.
 *
 * NVIDIA ACE + NeMo SteerLM Integration
 * Attribute-conditioned LLM steering with NPC personality sliders
 * Based on NVIDIA ACE (Avatar Cloud Engine) and NeMo SteerLM technique
 * License: All Rights Reserved
 */

class ACESteerlM {
    constructor(config = {}) {
        this.gatewayUrl = config.gatewayUrl || process.env.NVIDIA_ACE_GATEWAY || '';
        this.apiKey = config.apiKey || process.env.NVIDIA_API_KEY || '';
        this.isDemo = !this.gatewayUrl && !this.apiKey;

        // SteerLM attribute definitions - based on NeMo SteerLM spec
        this.attributes = {
            helpfulness:  { min: 0, max: 4, default: 3, label: 'Helpfulness',  description: 'How directly helpful the AI is', emoji: '🤝' },
            humor:        { min: 0, max: 4, default: 1, label: 'Humor',         description: 'Wit and comedic tone level',        emoji: '😄' },
            creativity:   { min: 0, max: 4, default: 2, label: 'Creativity',    description: 'Novel and imaginative responses',    emoji: '🎨' },
            toxicity:     { min: 0, max: 4, default: 0, label: 'Toxicity',      description: 'Negative/harmful content (keep 0)', emoji: '⚠️' },
            assertiveness:{ min: 0, max: 4, default: 2, label: 'Assertiveness', description: 'Confidence and directness',          emoji: '💪' },
            empathy:      { min: 0, max: 4, default: 3, label: 'Empathy',       description: 'Emotional understanding',            emoji: '❤️' },
            formality:    { min: 0, max: 4, default: 2, label: 'Formality',     description: 'Professional vs casual tone',        emoji: '👔' },
            detail:       { min: 0, max: 4, default: 3, label: 'Detail Level',  description: 'Depth and thoroughness',             emoji: '🔍' }
        };

        // Preset GOAT assistant personalities (SteerLM profiles)
        this.presets = {
            nova: {
                name: 'NOVA — Chief Strategy Officer',
                emoji: '🌟',
                profile: { helpfulness: 4, humor: 2, creativity: 3, toxicity: 0, assertiveness: 4, empathy: 2, formality: 3, detail: 4 },
                systemPrompt: 'You are NOVA, the Chief Strategy Officer of SUPER GOAT Royalties. Expert in music business strategy, revenue optimization, and creator economics.'
            },
            cashflow: {
                name: 'CASHFLOW — Revenue Analyst',
                emoji: '💸',
                profile: { helpfulness: 4, humor: 1, creativity: 1, toxicity: 0, assertiveness: 3, empathy: 1, formality: 4, detail: 4 },
                systemPrompt: 'You are CASHFLOW, the Revenue Analyst. Expert in royalty calculations, platform revenue, streaming economics, and financial forecasting.'
            },
            pixel: {
                name: 'PIXEL — NFT Curator',
                emoji: '🎨',
                profile: { helpfulness: 3, humor: 2, creativity: 4, toxicity: 0, assertiveness: 2, empathy: 3, formality: 1, detail: 3 },
                systemPrompt: 'You are PIXEL, the NFT & Digital Art Curator. Expert in NFTs, blockchain, digital collectibles, and creator monetization through Web3.'
            },
            sage: {
                name: 'SAGE — Knowledge Architect',
                emoji: '🧠',
                profile: { helpfulness: 4, humor: 0, creativity: 2, toxicity: 0, assertiveness: 2, empathy: 2, formality: 3, detail: 4 },
                systemPrompt: 'You are SAGE, the Knowledge Architect. Expert in music industry knowledge, royalty law, publishing, sync licensing, and platform strategies.'
            },
            forge: {
                name: 'FORGE — UE5 CoPilot',
                emoji: '🔨',
                profile: { helpfulness: 4, humor: 2, creativity: 4, toxicity: 0, assertiveness: 3, empathy: 1, formality: 2, detail: 4 },
                systemPrompt: 'You are FORGE, the Ultimate Engine CoPilot for Unreal Engine 5. Expert in Blueprints, C++, scene building, and UE5 development.'
            },
            lexis: {
                name: 'LEXIS — Legal Specialist',
                emoji: '⚖️',
                profile: { helpfulness: 4, humor: 0, creativity: 1, toxicity: 0, assertiveness: 4, empathy: 1, formality: 4, detail: 4 },
                systemPrompt: 'You are LEXIS, the Legal & Contract Specialist. Expert in music law, contract analysis, copyright, licensing, and royalty rights.'
            },
            harmony: {
                name: 'HARMONY — Collaboration Coordinator',
                emoji: '🤝',
                profile: { helpfulness: 4, humor: 2, creativity: 3, toxicity: 0, assertiveness: 2, empathy: 4, formality: 2, detail: 3 },
                systemPrompt: 'You are HARMONY, the Collaboration Coordinator. Expert in team management, creative collaboration, and music production partnerships.'
            },
            oracle: {
                name: 'ORACLE — Market Intelligence',
                emoji: '🔮',
                profile: { helpfulness: 3, humor: 1, creativity: 3, toxicity: 0, assertiveness: 3, empathy: 1, formality: 3, detail: 4 },
                systemPrompt: 'You are ORACLE, the Market Intelligence Analyst. Expert in music market trends, genre performance, platform growth, and industry forecasting.'
            },
            gear: {
                name: 'GEAR — System Engineer',
                emoji: '⚙️',
                profile: { helpfulness: 4, humor: 1, creativity: 2, toxicity: 0, assertiveness: 3, empathy: 1, formality: 3, detail: 4 },
                systemPrompt: 'You are GEAR, the System Optimization Engineer. Expert in AI configuration, platform integrations, performance tuning, and technical troubleshooting.'
            }
        };

        // NeMo alignment techniques available
        this.alignmentMethods = [
            { id: 'steerlm', name: 'SteerLM', description: 'Runtime attribute-conditioned steering via sliders', status: 'active', paper: 'https://arxiv.org/abs/2310.05344' },
            { id: 'dpo', name: 'DPO', description: 'Direct Preference Optimization — preference pair training', status: 'available', paper: 'https://arxiv.org/abs/2305.18290' },
            { id: 'ppo', name: 'PPO (RLHF)', description: 'Proximal Policy Optimization with reward model', status: 'available', paper: 'https://arxiv.org/abs/2203.02155' },
            { id: 'rlhf', name: 'RLHF', description: 'Reinforcement Learning from Human Feedback', status: 'available', paper: 'https://arxiv.org/abs/2204.05862' }
        ];
    }

    getAttributes() { return this.attributes; }
    getPresets() { return this.presets; }
    getAlignmentMethods() { return this.alignmentMethods; }

    buildConditionString(profile) {
        return Object.entries(profile)
            .map(([k, v]) => `${k}:${v}`)
            .join(',');
    }

    async steerChat(messages, profile, options = {}) {
        const conditionStr = this.buildConditionString(profile);
        const systemMsg = options.systemPrompt || this._buildSystemFromProfile(profile);

        if (this.isDemo) {
            return this._demoSteerChat(messages, profile, conditionStr);
        }

        // In production: call NVIDIA ACE/NeMo inference endpoint with condition string
        return this._demoSteerChat(messages, profile, conditionStr);
    }

    async getPresetChat(presetId, message, history = []) {
        const preset = this.presets[presetId];
        if (!preset) return { error: 'Unknown preset' };

        const messages = [
            { role: 'system', content: preset.systemPrompt },
            ...history,
            { role: 'user', content: message }
        ];

        return this.steerChat(messages, preset.profile, { systemPrompt: preset.systemPrompt, presetName: preset.name });
    }

    _buildSystemFromProfile(profile) {
        const traits = [];
        if (profile.humor >= 3) traits.push('witty and humorous');
        if (profile.formality >= 3) traits.push('professional and formal');
        if (profile.formality <= 1) traits.push('casual and friendly');
        if (profile.assertiveness >= 3) traits.push('confident and direct');
        if (profile.empathy >= 3) traits.push('empathetic and supportive');
        if (profile.creativity >= 3) traits.push('creative and imaginative');
        if (profile.detail >= 3) traits.push('detailed and thorough');
        return `You are a GOAT Royalties AI assistant. Be ${traits.join(', ')}.`;
    }

    _demoSteerChat(messages, profile, conditionStr) {
        const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
        const humor = profile.humor || 0;
        const formality = profile.formality || 2;
        const detail = profile.detail || 2;

        const humorPrefix = humor >= 3 ? '😄 ' : humor >= 2 ? '😊 ' : '';
        const toneWord = formality >= 3 ? 'I must inform you that' : formality >= 2 ? 'Here\'s what I found:' : 'So check this out —';

        let baseResponse = '';
        if (lastMsg.includes('royalt') || lastMsg.includes('revenue')) {
            baseResponse = `${humorPrefix}${toneWord} your royalty streams are performing well! Based on current data, Spotify and Apple Music account for 67% of revenue. ${detail >= 3 ? 'Detailed breakdown: Spotify $12,847 (42%), Apple Music $8,234 (27%), YouTube Music $5,671 (18%), Tidal $2,100 (7%), Amazon $1,890 (6%). Recommend prioritizing Apple Music content due to higher per-stream rate.' : 'Focus on Apple Music for best per-stream rates.'}`;
        } else if (lastMsg.includes('nft')) {
            baseResponse = `${humorPrefix}${toneWord} your NFT portfolio is looking strong at $24,500. ${detail >= 3 ? 'Genesis Beat #001 (2.5 ETH) is your most valuable asset, representing 34% of total portfolio. Market conditions favor 1/1 music NFTs right now — consider listing on Sound.xyz.' : 'Consider minting more exclusive tracks as NFTs.'}`;
        } else {
            baseResponse = `${humorPrefix}${toneWord} I'm your GOAT Royalties AI assistant, steered with SteerLM attributes [${conditionStr}]. ${detail >= 3 ? 'I can help you optimize revenue, analyze contracts, track NFTs, generate Blueprints, monitor AI agents, and maximize your creator income across all platforms.' : 'Ask me anything about your music business!'}`;
        }

        return Promise.resolve({
            response: baseResponse,
            condition: conditionStr,
            profile,
            model: 'nvidia/nemotron-steerlm',
            method: 'steerlm',
            demo: true
        });
    }

    getStatus() {
        return {
            name: 'NVIDIA ACE + NeMo SteerLM',
            available: true,
            hasGateway: !!this.gatewayUrl,
            demo: this.isDemo,
            presets: Object.keys(this.presets).length,
            attributes: Object.keys(this.attributes).length,
            alignmentMethods: this.alignmentMethods.length,
            features: ['SteerLM', 'DPO', 'PPO', 'RLHF', 'NPC-personalities', 'runtime-steering', 'attribute-sliders']
        };
    }
}

module.exports = ACESteerlM;