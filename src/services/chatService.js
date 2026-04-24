/**
 * Chat Service - OpenAI Integration (Optional)
 * Provides AI chat capabilities for the GOAT Royalty App
 */

let OpenAI = null;
try {
  OpenAI = require('openai');
} catch (e) {
  console.log('OpenAI module not available, using local models only');
}

class ChatService {
  constructor() {
    this.client = null;
    this.isConfigured = false;
    
    // Try to initialize OpenAI if API key exists
    if (OpenAI && process.env.OPENAI_API_KEY) {
      try {
        this.client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        this.isConfigured = true;
        console.log('✅ OpenAI client initialized');
      } catch (error) {
        console.warn('⚠️ OpenAI initialization failed:', error.message);
      }
    } else {
      console.log('ℹ️ OpenAI not configured - using local Ollama models');
    }
    
    this.systemPrompt = `You are an AI assistant integrated into the GOAT Royalty Management System. 
You help users with:
- Royalty calculations and analysis
- Payment processing questions
- Artist management
- Report generation
- Contract analysis
- Revenue forecasting
- Hosting management (via Hostinger API)
- General platform navigation and support

You have access to the platform's data and can provide specific, actionable advice.
Be professional, helpful, and concise in your responses.`;
  }

  /**
   * Check if service is available
   */
  isAvailable() {
    return this.isConfigured;
  }

  /**
   * Send a chat message and get AI response
   */
  async chat(message, context = {}) {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'AI chat is not configured. Set OPENAI_API_KEY environment variable or use local Ollama models.',
        fallback: true
      };
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 1000
      });

      return {
        success: true,
        message: response.choices[0].message.content
      };
    } catch (error) {
      console.error('Chat error:', error);
      return {
        success: false,
        message: 'Error communicating with AI service',
        error: error.message
      };
    }
  }
}

module.exports = ChatService;
