/**
 * SUPER GOAT ROYALTIES - RAG (Retrieval Augmented Generation) System
 * Advanced knowledge retrieval and generation for enhanced AI responses
 */

const nvidiaClient = require('../nvidia/nvidia-nim-client');
const NodeCache = require('node-cache');

class RAGSystem {
    constructor() {
        this.knowledgeBase = new Map();
        this.documentStore = new Map();
        this.cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache
        this.chunkSize = 1000;
        this.chunkOverlap = 200;
    }

    /**
     * Add document to knowledge base
     */
    async addDocument(id, content, metadata = {}) {
        try {
            const chunks = this.chunkText(content);
            
            for (let i = 0; i < chunks.length; i++) {
                const chunkId = `${id}-chunk-${i}`;
                const embedding = await nvidiaClient.generateEmbedding(chunks[i]);
                
                this.knowledgeBase.set(chunkId, {
                    content: chunks[i],
                    embedding: embedding,
                    metadata: {
                        ...metadata,
                        chunkIndex: i,
                        totalChunks: chunks.length
                    }
                });
            }
            
            this.documentStore.set(id, {
                content,
                metadata,
                chunks: chunks.length,
                timestamp: Date.now()
            });

            return { success: true, chunks: chunks.length };
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
    }

    /**
     * Chunk text for embedding
     */
    chunkText(text) {
        const chunks = [];
        let start = 0;

        while (start < text.length) {
            let end = start + this.chunkSize;
            
            // Try to break at sentence boundary
            if (end < text.length) {
                const sentenceBreak = text.lastIndexOf('.', end);
                if (sentenceBreak > start + this.chunkSize * 0.5) {
                    end = sentenceBreak + 1;
                }
            }

            chunks.push(text.slice(start, end));
            start = end - this.chunkOverlap;
        }

        return chunks;
    }

    /**
     * Retrieve relevant documents
     */
    async retrieve(query, topK = 5) {
        try {
            // Check cache
            const cacheKey = `retrieve:${query}`;
            const cached = this.cache.get(cacheKey);
            if (cached) return cached;

            // Generate query embedding
            const queryEmbedding = await nvidiaClient.generateEmbedding(query);

            // Calculate similarities
            const similarities = [];
            
            for (const [id, doc] of this.knowledgeBase) {
                const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
                similarities.push({
                    id,
                    similarity,
                    content: doc.content,
                    metadata: doc.metadata
                });
            }

            // Sort by similarity and get top K
            const results = similarities
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, topK);

            // Cache results
            this.cache.set(cacheKey, results);

            return results;
        } catch (error) {
            console.error('Error retrieving documents:', error);
            throw error;
        }
    }

    /**
     * Generate response with context
     */
    async generateResponse(query, model = 'llama2-70b') {
        try {
            // Retrieve relevant context
            const context = await this.retrieve(query, 3);
            
            if (context.length === 0) {
                return await nvidiaClient.generateText(query, model);
            }

            // Build context-enhanced prompt
            const contextText = context.map(doc => 
                `Document: ${doc.metadata.title || 'Unknown'}\n${doc.content}`
            ).join('\n\n');

            const enhancedPrompt = `Context:\n${contextText}\n\nQuestion: ${query}\n\nBased on the context provided, answer the question comprehensively.`;

            return await nvidiaClient.generateText(enhancedPrompt, model, {
                temperature: 0.6,
                maxTokens: 2000
            });
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }

    /**
     * Calculate cosine similarity
     */
    cosineSimilarity(vec1, vec2) {
        if (vec1.length !== vec2.length) {
            throw new Error('Vector dimensions must match');
        }

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    /**
     * Add music industry knowledge
     */
    async initializeIndustryKnowledge() {
        const knowledgeDocuments = [
            {
                id: 'royalty-distribution',
                content: `Royalty distribution in the music industry follows complex structures. Streaming platforms typically pay out 70% of revenue to rights holders, with the split determined by ownership percentages. Mechanical royalties go to songwriters and publishers (9.1 cents per song in the US), while performance royalties are collected by PROs like ASCAP, BMI, and SESAC.`,
                metadata: { title: 'Royalty Distribution', category: 'legal' }
            },
            {
                id: 'nft-monetization',
                content: `NFT monetization in music allows artists to sell digital assets directly to fans. Smart contracts can automatically distribute royalties on secondary sales, with typical rates ranging from 5-15%. Popular blockchains for music NFTs include Ethereum, Polygon, and Solana due to lower gas fees and faster transaction times.`,
                metadata: { title: 'NFT Monetization', category: 'blockchain' }
            },
            {
                id: 'platform-strategies',
                content: `Platform-specific strategies are crucial for maximum revenue. Spotify requires playlist placement for significant streams, with editorial playlists driving 20-30% of total listens. TikTok has emerged as a major discovery platform, with viral trends often leading to Spotify chart positions. YouTube monetization requires 1000 subscribers and 4000 watch hours for ad revenue.`,
                metadata: { title: 'Platform Strategies', category: 'marketing' }
            },
            {
                id: 'contract-negotiations',
                content: `Contract negotiations should focus on ownership percentages, advance terms, and royalty splits. Standard deals range from 50/50 to 80/20 artist-to-label splits. Key terms include territory, duration, mechanical royalties, performance royalties, and digital distribution rights. Independent artists should maintain ownership whenever possible.`,
                metadata: { title: 'Contract Negotiations', category: 'legal' }
            },
            {
                id: 'revenue-optimization',
                content: `Revenue optimization requires multi-platform strategy. Distribute to all major streaming platforms (Spotify, Apple Music, YouTube Music, Amazon Music, Tidal) for maximum reach. Sync licensing opportunities can generate substantial revenue, with placements paying from $500 to $50,000 depending on usage. Merchandise and touring remain significant revenue streams beyond streaming.`,
                metadata: { title: 'Revenue Optimization', category: 'business' }
            }
        ];

        for (const doc of knowledgeDocuments) {
            await this.addDocument(doc.id, doc.content, doc.metadata);
        }

        console.log('Industry knowledge initialized successfully');
    }

    /**
     * Clear all knowledge
     */
    clearKnowledge() {
        this.knowledgeBase.clear();
        this.documentStore.clear();
        this.cache.flushAll();
    }

    /**
     * Get knowledge base stats
     */
    getStats() {
        return {
            totalChunks: this.knowledgeBase.size,
            totalDocuments: this.documentStore.size,
            cacheSize: this.cache.keys().length
        };
    }
}

module.exports = new RAGSystem();