/**
 * 🐐 GOAT TALKER v1.0
 * Text-to-Speech System with Multiple GOAT Personalities
 * Makes the GOAT speak with different moods and voices!
 */

class GoatTalker {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.personalities = {
      djSpeedy: {
        name: "DJ Speedy (The OG)",
        mood: "confident",
        pitch: 0.9,
        rate: 1.1,
        phrases: [
          "Let's get it! 🐐",
          "Straight outta Atlanta!",
          "Brick Squad stand up!",
          "Making royalty moves!",
          "Built different!"
        ]
      },
      hypeMan: {
        name: "Hype GOAT",
        mood: "excited",
        pitch: 1.2,
        rate: 1.4,
        phrases: [
          "LETS GOOOO!",
          "GOAT MODE ACTIVATED!",
          "SHOUTOUT TO THE GOAT!",
          "WE LIVE! WE LIVE!",
          "DAB ON 'EM!"
        ]
      },
      chillGoat: {
        name: "Chill GOAT",
        mood: "relaxed",
        pitch: 0.8,
        rate: 0.9,
        phrases: [
          "Take it easy, fam.",
          "Vibes on point.",
          "Smooth like butter.",
          "Just chilling.",
          "Peace and love."
        ]
      },
      hackerGoat: {
        name: "Hacker GOAT",
        mood: "technical",
        pitch: 1.0,
        rate: 1.2,
        phrases: [
          "Analyzing... Complete.",
          "System secure. 🐐",
          "Code compiled successfully.",
          "Deploying to mainnet.",
          "Access granted."
        ]
      },
      mogulGoat: {
        name: "Mogul GOAT",
        mood: "sophisticated",
        pitch: 1.1,
        rate: 1.0,
        phrases: [
          "The empire expands.",
          "Quality over everything.",
          "Building generational wealth.",
          "Excellence is the standard.",
          "Only the best."
        ]
      }
    };
    this.currentPersonality = 'djSpeedy';
    this.isSpeaking = false;
  }

  /**
   * Initialize voices
   */
  async initVoices() {
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synth.getVoices();
        resolve(this.voices);
      };
      
      if (this.synth.getVoices().length > 0) {
        loadVoices();
      } else {
        this.synth.onvoiceschanged = loadVoices;
      }
    });
  }

  /**
   * Select voice by name or type
   */
  selectVoice(voiceType = 'default') {
    const voiceMap = {
      default: null,
      male: this.voices?.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david')),
      female: this.voices?.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha')),
      deep: this.voices?.find(v => v.name.toLowerCase().includes('deep') || v.name.toLowerCase().includes('alex')),
      energetic: this.voices?.find(v => v.name.toLowerCase().includes('junior') || v.name.toLowerCase().includes('daniel'))
    };
    this.voice = voiceMap[voiceType] || null;
    return this.voice?.name || 'Default';
  }

  /**
   * Set GOAT personality
   */
  setPersonality(personality) {
    if (this.personalities[personality]) {
      this.currentPersonality = personality;
      return `🐐 Switched to ${this.personalities[personality].name}`;
    }
    return '❌ Personality not found';
  }

  /**
   * Get available personalities
   */
  getPersonalities() {
    return Object.keys(this.personalities).map(key => ({
      id: key,
      ...this.personalities[key]
    }));
  }

  /**
   * Speak text with current personality
   */
  speak(text, options = {}) {
    // Cancel any ongoing speech
    if (this.isSpeaking) {
      this.synth.cancel();
    }

    const personality = this.personalities[this.currentPersonality];
    const utterance = new SpeechSynthesisUtterance(text);

    // Apply personality settings
    utterance.pitch = options.pitch || personality.pitch;
    utterance.rate = options.rate || personality.rate;
    utterance.volume = options.volume || 1;

    // Set voice if specified
    if (this.voice) {
      utterance.voice = this.voice;
    }

    // Speaking state
    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (options.onError) options.onError(e);
    };

    this.synth.speak(utterance);
    return utterance;
  }

  /**
   * Speak a random phrase from current personality
   */
  speakRandomPhrase() {
    const personality = this.personalities[this.currentPersonality];
    const randomPhrase = personality.phrases[Math.floor(Math.random() * personality.phrases.length)];
    return this.speak(randomPhrase);
  }

  /**
   * Stop speaking
   */
  stop() {
    this.synth.cancel();
    this.isSpeaking = false;
  }

  /**
   * Pause speaking
   */
  pause() {
    this.synth.pause();
  }

  /**
   * Resume speaking
   */
  resume() {
    this.synth.resume();
  }

  /**
   * Get speaking state
   */
  getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.synth.paused,
      currentPersonality: this.currentPersonality,
      personalityName: this.personalities[this.currentPersonality].name,
      voice: this.voice?.name || 'Default'
    };
  }

  /**
   * Speak greeting based on time of day
   */
  speakGreeting() {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour < 12) {
      greeting = "Good morning! Let's get it today! 🐐";
    } else if (hour < 18) {
      greeting = "Good afternoon! Making moves! 🐐";
    } else {
      greeting = "What's good! Evening vibes! 🐐";
    }

    const personality = this.personalities[this.currentPersonality];
    return this.speak(greeting);
  }

  /**
   * Speak notification
   */
  speakNotification(type, message) {
    const prefixMap = {
      success: "✅ ",
      error: "❌ ",
      warning: "⚠️ ",
      info: "ℹ️ ",
      music: "🎵 ",
      money: "💰 ",
      alert: "🚨 "
    };

    const prefix = prefixMap[type] || '';
    return this.speak(`${prefix}${message}`);
  }

  /**
   * Speak royalty payment notification
   */
  speakRoyalty(amount, source) {
    const personality = this.personalities[this.currentPersonality];
    const messages = [
      `🐐 Cha-ching! ${amount} in royalties from ${source}!`,
      `💰 Another ${amount} deposit from ${source}!`,
      `📈 ${amount} landed! ${source} paying up!`
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    return this.speak(randomMsg);
  }

  /**
   * Rapping mode - speak in rhythm
   */
  speakRap(lyrics, bpm = 90) {
    const words = lyrics.split(' ');
    const interval = 60000 / bpm / 2; // Half-beat per word

    let i = 0;
    const rapInterval = setInterval(() => {
      if (i >= words.length) {
        clearInterval(rapInterval);
        return;
      }

      if (words[i].trim()) {
        this.speak(words[i], { rate: 1.5 });
      }
      i++;
    }, interval);

    return rapInterval;
  }

  /**
   * Announce feature activation
   */
  announceFeature(featureName, description) {
    const messages = [
      `🐐 ${featureName} is now active! ${description}`,
      `Boom! ${featureName} just dropped! ${description}`,
      `🚀 ${featureName} enabled! ${description}`
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    return this.speak(randomMsg);
  }

  /**
   * Export configuration
   */
  exportConfig() {
    return {
      currentPersonality: this.currentPersonality,
      voice: this.voice?.name || null,
      personalities: this.personalities
    };
  }

  /**
   * Import configuration
   */
  importConfig(config) {
    if (config.currentPersonality && this.personalities[config.currentPersonality]) {
      this.currentPersonality = config.currentPersonality;
    }
    if (config.voice) {
      const voice = this.voices?.find(v => v.name === config.voice);
      if (voice) {
        this.voice = voice;
      }
    }
    return true;
  }
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoatTalker;
}