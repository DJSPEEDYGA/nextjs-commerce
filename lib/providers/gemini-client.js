/**
 * GOAT Royalty App - Music Royalty Management Platform
 * Copyright © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST. All rights reserved.
 *
 * Google Gemini AI Provider Client
 * Supports Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash
 * License: All Rights Reserved
 */

const https = require('https');

class GeminiClient {
    constructor(config = {}) {
        this.apiKey = config.apiKey || process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY || '';
        this.baseUrl = 'generativelanguage.googleapis.com';
        this.defaultModel = config.model || 'gemini-2.0-flash';
        this.isDemo = !this.apiKey;

        this.models = [
            { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', context: 1000000, free: true, tier: 'free', description: 'Fastest multimodal model with 1M context' },
            { id: 'gemini-2.0-flash-thinking', name: 'Gemini 2.0 Flash Thinking', context: 32768, free: true, tier: 'free', description: 'Advanced reasoning with visible thought process' },
            { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', context: 2000000, free: false, tier: 'pro', description: 'Most capable model with 2M context window' },
            { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', context: 1000000, free: true, tier: 'free', description: 'Fast & efficient with 1M context' },
            { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B', context: 1000000, free: true, tier: 'free', description: 'Lightweight, high-volume tasks' }
        ];

        this.demoResponses = {
            royalty: `🎵 **Gemini AI Royalty Analysis** (Demo Mode)\n\nBased on your current streaming data across Spotify, Apple Music, and YouTube Music, here's my analysis:\n\n**Revenue Optimization:**\n• Your Spotify per-stream rate ($0.004) is 23% below industry average — consider exclusive content windows\n• Apple Music pays 2x Spotify rates for the same streams — increase Apple-first releases\n• YouTube Content ID claims are adding $847/month in passive income\n\n**Growth Opportunities:**\n• TikTok sound licensing: Your catalog has 3 viral-ready tracks based on BPM/energy analysis\n• Tidal Hi-Fi pays $0.013/stream — pitch for editorial playlist inclusion\n• MLC mechanical royalties may be unclaimed — check at MLC.com\n\n**AI Prediction (90-day):** $18,400 projected revenue (+34% QoQ) 🚀`,
            nft: `🖼️ **Gemini NFT Market Intelligence** (Demo Mode)\n\nAnalyzing your NFT portfolio with multimodal AI...\n\n**Portfolio Status:** $24,500 total value (+12.3% this month)\n\n**Market Signals:**\n• Music NFTs on Ethereum: floor price trending +8% this week\n• Your Genesis Beat #001 (2.5 ETH) is undervalued by ~40% vs comparable 1/1 music NFTs\n• Polygon gas fees are lowest since Q3 2023 — ideal minting window\n\n**Recommendation:** List 2 tracks as fractional royalty NFTs (10% each) on Sound.xyz — current demand is high for music with your genre profile.`,
            default: `🤖 **Gemini 2.0 Flash** (Demo Mode)\n\nI'm Google's most capable free AI model with 1M token context! I can help you:\n\n• **Royalty Analytics**: Deep analysis of your streaming revenue across all platforms\n• **Contract Review**: AI-powered contract analysis with legal flag detection\n• **Market Trends**: Real-time music industry intelligence and predictions\n• **NFT Strategy**: Portfolio optimization and minting recommendations\n• **UE5 Development**: Blueprint generation and Unreal Engine guidance\n\nAdd your GOOGLE_AI_KEY to .env to unlock live Gemini responses with Google Search grounding! 🔑`
        };
    }

    getModels() {
        return this.models;
    }

    async chat(messages, options = {}) {
        if (this.isDemo) {
            return this._demoChat(messages, options);
        }

        const model = options.model || this.defaultModel;
        const contents = this._formatMessages(messages);

        const payload = JSON.stringify({
            contents,
            generationConfig: {
                temperature: options.temperature || 0.7,
                maxOutputTokens: options.maxTokens || 2048,
                topP: 0.95
            },
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
            ]
        });

        return new Promise((resolve, reject) => {
            const path = `/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
            const reqOptions = {
                hostname: this.baseUrl,
                path,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
            };

            const req = https.request(reqOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.candidates?.[0]?.content?.parts?.[0]?.text) {
                            resolve({
                                content: parsed.candidates[0].content.parts[0].text,
                                model,
                                provider: 'google',
                                usage: parsed.usageMetadata || {}
                            });
                        } else {
                            reject(new Error(parsed.error?.message || 'Gemini API error'));
                        }
                    } catch (e) { reject(e); }
                });
            });
            req.on('error', reject);
            req.write(payload);
            req.end();
        });
    }

    _formatMessages(messages) {
        const contents = [];
        let systemPrompt = '';

        for (const msg of messages) {
            if (msg.role === 'system') {
                systemPrompt = msg.content;
                continue;
            }
            const role = msg.role === 'assistant' ? 'model' : 'user';
            let text = msg.content;
            if (msg.role === 'user' && systemPrompt && contents.length === 0) {
                text = `${systemPrompt}\n\n${text}`;
                systemPrompt = '';
            }
            contents.push({ role, parts: [{ text }] });
        }
        return contents;
    }

    _demoChat(messages, options = {}) {
        const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
        let response = this.demoResponses.default;
        if (lastMsg.includes('royalt') || lastMsg.includes('revenue') || lastMsg.includes('stream')) {
            response = this.demoResponses.royalty;
        } else if (lastMsg.includes('nft') || lastMsg.includes('mint') || lastMsg.includes('blockchain')) {
            response = this.demoResponses.nft;
        }

        return Promise.resolve({
            content: response,
            model: options.model || this.defaultModel,
            provider: 'google',
            demo: true,
            usage: { promptTokenCount: 50, candidatesTokenCount: 200 }
        });
    }

    getStatus() {
        return {
            name: 'Google Gemini',
            available: true,
            hasApiKey: !!this.apiKey,
            demo: this.isDemo,
            models: this.models.length,
            freeModels: this.models.filter(m => m.free).length,
            defaultModel: this.defaultModel,
            features: ['multimodal', 'code', 'reasoning', 'search-grounding', '1M-context']
        };
    }
}

module.exports = GeminiClient;