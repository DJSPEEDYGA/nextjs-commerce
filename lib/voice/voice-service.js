/**
 * Voice/Speech Recognition and Synthesis Service
 * Handles speech-to-text, text-to-speech, and voice commands
 */

const axios = require('axios');

class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis || null;
    this.voices = [];
    this.isListening = false;
  }

  /**
   * Initialize voice recognition (Web Speech API)
   */
  initRecognition() {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser && 'webkitSpeechRecognition' in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      return true;
    }
    return false;
  }

  /**
   * Start listening for voice input
   */
  startListening(onResult, onError, onEnd) {
    if (!this.initRecognition()) {
      throw new Error('Speech recognition not supported in this browser');
    }

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      onResult({
        final: finalTranscript,
        interim: interimTranscript,
        confidence: event.results[event.results.length - 1][0].confidence
      });
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    this.recognition.start();
    this.isListening = true;
    return true;
  }

  /**
   * Stop listening for voice input
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Initialize available voices
   */
  initVoices() {
    if (typeof window !== 'undefined' && this.synthesis) {
      this.voices = this.synthesis.getVoices();
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices();
      };
    }
    return this.voices;
  }

  /**
   * Speak text using text-to-speech
   */
  speak(text, options = {}) {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported in this browser');
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice
    if (options.voice) {
      utterance.voice = options.voice;
    }
    
    // Configure options
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.lang = options.lang || 'en-US';

    // Event handlers
    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    this.synthesis.speak(utterance);
    return utterance;
  }

  /**
   * Stop speaking
   */
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  /**
   * Get available voices
   */
  getVoices() {
    return this.voices;
  }

  /**
   * Voice command patterns
   */
  static getCommandPatterns() {
    return {
      navigation: [
        { pattern: /go to dashboard/i, action: 'dashboard' },
        { pattern: /go to music/i, action: 'music' },
        { pattern: /go to ai/i, action: 'ai' },
        { pattern: /go to creative/i, action: 'creative' },
        { pattern: /go to security/i, action: 'security' }
      ],
      actions: [
        { pattern: /generate script/i, action: 'generateScript' },
        { pattern: /search catalog/i, action: 'searchCatalog' },
        { pattern: /show revenue/i, action: 'showRevenue' },
        { pattern: /analyze/i, action: 'analyze' }
      ],
      system: [
        { pattern: /stop listening/i, action: 'stop' },
        { pattern: /start listening/i, action: 'start' },
        { pattern: /speak/i, action: 'speak' }
      ]
    };
  }

  /**
   * Parse voice command
   */
  parseCommand(text) {
    const patterns = VoiceService.getCommandPatterns();
    const lowerText = text.toLowerCase().trim();

    for (const category in patterns) {
      for (const item of patterns[category]) {
        // Check if pattern exists and is a RegExp
        if (item.pattern && item.pattern instanceof RegExp && item.pattern.test(lowerText)) {
          return {
            category,
            action: item.action,
            originalText: text,
            confidence: 0.9
          };
        }
      }
    }

    return null;
  }

  /**
   * AI-powered speech enhancement (using external API)
   */
  async enhanceTranscript(transcript, apiKey) {
    try {
      if (!apiKey) {
        // Mock enhancement without API
        return {
          enhanced: transcript,
          corrections: [],
          confidence: 0.85
        };
      }

      // Use OpenAI or similar API for enhancement
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a speech recognition enhancement system. Correct grammar, punctuation, and capitalization in the transcript.'
            },
            {
              role: 'user',
              content: transcript
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        enhanced: response.data.choices[0].message.content,
        corrections: [],
        confidence: 0.95
      };
    } catch (error) {
      console.error('Speech enhancement error:', error.message);
      return {
        enhanced: transcript,
        corrections: [],
        confidence: 0.75
      };
    }
  }

  /**
   * Get voice service status
   */
  getStatus() {
    const isBrowser = typeof window !== 'undefined';
    return {
      recognitionSupported: isBrowser && this.initRecognition(),
      synthesisSupported: isBrowser && !!this.synthesis,
      isListening: this.isListening,
      availableVoices: this.voices.length,
      browserSupport: {
        webkitSpeechRecognition: isBrowser && 'webkitSpeechRecognition' in window,
        speechSynthesis: isBrowser && 'speechSynthesis' in window
      }
    };
  }
}

module.exports = {
  VoiceService,
  getStatus: () => {
    const service = new VoiceService();
    return service.getStatus();
  },
  getCommandPatterns: () => VoiceService.getCommandPatterns(),
  parseCommand: (text) => {
    const service = new VoiceService();
    return service.parseCommand(text);
  },
  enhanceTranscript: async (transcript, apiKey) => {
    return VoiceService.enhanceTranscript(transcript, apiKey);
  }
};