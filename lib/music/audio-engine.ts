/**
 * GOAT Royalty - Audio Engine
 * Core audio processing engine using Web Audio API
 */

import type {
  AudioProject,
  AudioTrack,
  AudioClip,
  AudioEffect,
  Automation
} from './types';

export class AudioEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private analyser: AnalyserNode;
  private tracks: Map<string, TrackNode>;
  private isPlaying: boolean = false;
  private currentTime: number = 0;
  private bpm: number = 120;
  private sampleRate: number = 44100;

  constructor() {
    this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
    this.masterGain = this.audioContext.createGain();
    this.analyser = this.audioContext.createAnalyser();
    this.tracks = new Map();

    // Connect master chain
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    // Configure analyser
    this.analyser.fftSize = 2048;
  }

  /**
   * Load an audio project
   */
  async loadProject(project: AudioProject): Promise<void> {
    this.bpm = project.bpm;
    this.sampleRate = project.sampleRate;

    // Clear existing tracks
    this.tracks.clear();

    // Load all tracks
    for (const track of project.tracks) {
      await this.addTrack(track);
    }

    // Set master volume
    this.masterGain.gain.value = project.masterTrack.volume;
  }

  /**
   * Add a track to the engine
   */
  async addTrack(track: AudioTrack): Promise<void> {
    const trackNode = new TrackNode(this.audioContext, track);
    await trackNode.initialize();
    trackNode.connect(this.masterGain);
    this.tracks.set(track.id, trackNode);
  }

  /**
   * Play the project
   */
  play(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    const startTime = this.audioContext.currentTime;

    // Schedule all clips
    this.tracks.forEach(track => {
      track.play(startTime, this.currentTime);
    });
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    this.tracks.forEach(track => track.stop());
  }

  /**
   * Stop playback and reset position
   */
  stop(): void {
    this.pause();
    this.currentTime = 0;
  }

  /**
   * Seek to a specific time
   */
  seek(time: number): void {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) this.pause();

    this.currentTime = time;

    if (wasPlaying) this.play();
  }

  /**
   * Record audio from input device
   */
  async startRecording(trackId: string, deviceId?: string): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: deviceId ? { deviceId: { exact: deviceId } } : true
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const track = this.tracks.get(trackId);

    if (track) {
      track.startRecording(stream);
    }

    return stream;
  }

  /**
   * Stop recording
   */
  stopRecording(trackId: string): Blob | null {
    const track = this.tracks.get(trackId);
    return track ? track.stopRecording() : null;
  }

  /**
   * Export project to audio file
   */
  async exportAudio(
    format: 'wav' | 'mp3' | 'flac',
    quality: 'lossy' | 'lossless' = 'lossless'
  ): Promise<Blob> {
    // Create offline context for rendering
    const offlineContext = new OfflineAudioContext(
      2, // stereo
      this.audioContext.sampleRate * this.getDuration(),
      this.audioContext.sampleRate
    );

    // Render all tracks
    const offlineMaster = offlineContext.createGain();
    offlineMaster.connect(offlineContext.destination);

    // TODO: Render each track and mix down
    const renderedBuffer = await offlineContext.startRendering();

    // Convert to desired format
    return this.bufferToBlob(renderedBuffer, format, quality);
  }

  /**
   * Get current playback time
   */
  getCurrentTime(): number {
    return this.currentTime;
  }

  /**
   * Get project duration
   */
  getDuration(): number {
    let maxDuration = 0;
    this.tracks.forEach(track => {
      const trackDuration = track.getDuration();
      if (trackDuration > maxDuration) {
        maxDuration = trackDuration;
      }
    });
    return maxDuration;
  }

  /**
   * Get audio levels for visualization
   */
  getAudioLevels(): { left: number; right: number } {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);

    // Calculate RMS
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128;
      sum += normalized * normalized;
    }
    const rms = Math.sqrt(sum / dataArray.length);

    return { left: rms, right: rms }; // Simplified stereo
  }

  /**
   * Get frequency spectrum data
   */
  getFrequencyData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Apply effect to track
   */
  applyEffect(trackId: string, effect: AudioEffect): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.addEffect(effect);
    }
  }

  /**
   * Remove effect from track
   */
  removeEffect(trackId: string, effectId: string): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.removeEffect(effectId);
    }
  }

  /**
   * Update effect parameters
   */
  updateEffect(trackId: string, effectId: string, parameters: Record<string, number>): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.updateEffect(effectId, parameters);
    }
  }

  /**
   * Set track volume
   */
  setTrackVolume(trackId: string, volume: number): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.setVolume(volume);
    }
  }

  /**
   * Set track pan
   */
  setTrackPan(trackId: string, pan: number): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.setPan(pan);
    }
  }

  /**
   * Mute/unmute track
   */
  setTrackMute(trackId: string, mute: boolean): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.setMute(mute);
    }
  }

  /**
   * Solo/unsolo track
   */
  setTrackSolo(trackId: string, solo: boolean): void {
    const track = this.tracks.get(trackId);
    if (track) {
      track.setSolo(solo);
    }

    // Mute all other tracks if solo is enabled
    if (solo) {
      this.tracks.forEach((t, id) => {
        if (id !== trackId) {
          t.setMute(true);
        }
      });
    } else {
      // Unmute all tracks
      this.tracks.forEach(t => t.setMute(false));
    }
  }

  /**
   * Convert audio buffer to blob
   */
  private bufferToBlob(
    buffer: AudioBuffer,
    format: string,
    quality: string
  ): Blob {
    // This is a simplified version
    // In production, use a library like lamejs for MP3 encoding
    const wav = this.bufferToWav(buffer);
    return new Blob([wav], { type: 'audio/wav' });
  }

  /**
   * Convert audio buffer to WAV format
   */
  private bufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const length = buffer.length * buffer.numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);

    // Write WAV header
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    this.writeString(view, 8, 'WAVE');
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    this.writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // Write audio data
    const offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i];
        const int16 = Math.max(-1, Math.min(1, sample)) * 0x7fff;
        view.setInt16(offset + (i * buffer.numberOfChannels + channel) * 2, int16, true);
      }
    }

    return arrayBuffer;
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.stop();
    this.tracks.forEach(track => track.dispose());
    this.tracks.clear();
    this.audioContext.close();
  }
}

/**
 * Track Node - Represents a single audio track
 */
class TrackNode {
  private context: AudioContext;
  private track: AudioTrack;
  private gainNode: GainNode;
  private panNode: StereoPannerNode;
  private effectNodes: Map<string, AudioNode>;
  private clips: Map<string, AudioBufferSourceNode>;
  private mediaRecorder?: MediaRecorder;
  private recordedChunks: Blob[] = [];

  constructor(context: AudioContext, track: AudioTrack) {
    this.context = context;
    this.track = track;
    this.gainNode = context.createGain();
    this.panNode = context.createStereoPanner();
    this.effectNodes = new Map();
    this.clips = new Map();

    // Set initial values
    this.gainNode.gain.value = track.volume;
    this.panNode.pan.value = track.pan;

    // Connect nodes
    this.panNode.connect(this.gainNode);
  }

  async initialize(): Promise<void> {
    // Load all clips
    for (const clip of this.track.clips) {
      if (clip.audioUrl) {
        await this.loadClip(clip);
      }
    }

    // Initialize effects
    for (const effect of this.track.effects) {
      this.addEffect(effect);
    }
  }

  private async loadClip(clip: AudioClip): Promise<void> {
    try {
      const response = await fetch(clip.audioUrl!);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      // Store for later playback
    } catch (error) {
      console.error('Failed to load clip:', error);
    }
  }

  play(startTime: number, offset: number): void {
    // Schedule all clips
    this.track.clips.forEach(clip => {
      if (clip.audioUrl) {
        this.playClip(clip, startTime, offset);
      }
    });
  }

  private playClip(clip: AudioClip, startTime: number, offset: number): void {
    // Create buffer source
    const source = this.context.createBufferSource();
    // TODO: Set buffer from loaded clip
    
    // Apply clip settings
    source.playbackRate.value = clip.timeStretch;
    
    // Connect to track chain
    source.connect(this.getInputNode());
    
    // Schedule playback
    const clipStartTime = startTime + clip.startTime - offset;
    if (clipStartTime >= startTime) {
      source.start(clipStartTime, clip.offset, clip.duration);
      this.clips.set(clip.id, source);
    }
  }

  stop(): void {
    this.clips.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.clips.clear();
  }

  startRecording(stream: MediaStream): void {
    this.mediaRecorder = new MediaRecorder(stream);
    this.recordedChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  stopRecording(): Blob | null {
    if (!this.mediaRecorder) return null;

    this.mediaRecorder.stop();
    return new Blob(this.recordedChunks, { type: 'audio/webm' });
  }

  addEffect(effect: AudioEffect): void {
    const effectNode = this.createEffectNode(effect);
    if (effectNode) {
      this.effectNodes.set(effect.id, effectNode);
      this.reconnectEffectChain();
    }
  }

  removeEffect(effectId: string): void {
    this.effectNodes.delete(effectId);
    this.reconnectEffectChain();
  }

  updateEffect(effectId: string, parameters: Record<string, number>): void {
    const effectNode = this.effectNodes.get(effectId);
    if (effectNode) {
      // Update effect parameters
      // This would be specific to each effect type
    }
  }

  private createEffectNode(effect: AudioEffect): AudioNode | null {
    switch (effect.type) {
      case 'eq':
        return this.createEQ(effect);
      case 'compressor':
        return this.createCompressor(effect);
      case 'reverb':
        return this.createReverb(effect);
      case 'delay':
        return this.createDelay(effect);
      default:
        return null;
    }
  }

  private createEQ(effect: AudioEffect): BiquadFilterNode {
    const filter = this.context.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = effect.parameters.frequency || 1000;
    filter.Q.value = effect.parameters.q || 1;
    filter.gain.value = effect.parameters.gain || 0;
    return filter;
  }

  private createCompressor(effect: AudioEffect): DynamicsCompressorNode {
    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = effect.parameters.threshold || -24;
    compressor.knee.value = effect.parameters.knee || 30;
    compressor.ratio.value = effect.parameters.ratio || 12;
    compressor.attack.value = effect.parameters.attack || 0.003;
    compressor.release.value = effect.parameters.release || 0.25;
    return compressor;
  }

  private createReverb(effect: AudioEffect): ConvolverNode {
    const convolver = this.context.createConvolver();
    // TODO: Load impulse response
    return convolver;
  }

  private createDelay(effect: AudioEffect): DelayNode {
    const delay = this.context.createDelay();
    delay.delayTime.value = effect.parameters.time || 0.5;
    return delay;
  }

  private reconnectEffectChain(): void {
    // Disconnect all
    this.panNode.disconnect();

    // Reconnect with effects in order
    let currentNode: AudioNode = this.panNode;
    const effects = Array.from(this.effectNodes.values());

    for (const effectNode of effects) {
      currentNode.connect(effectNode);
      currentNode = effectNode;
    }

    // Connect to gain
    currentNode.connect(this.gainNode);
  }

  private getInputNode(): AudioNode {
    const effects = Array.from(this.effectNodes.values());
    return effects.length > 0 ? effects[0] : this.panNode;
  }

  connect(destination: AudioNode): void {
    this.gainNode.connect(destination);
  }

  setVolume(volume: number): void {
    this.gainNode.gain.value = volume;
  }

  setPan(pan: number): void {
    this.panNode.pan.value = pan;
  }

  setMute(mute: boolean): void {
    this.gainNode.gain.value = mute ? 0 : this.track.volume;
  }

  setSolo(solo: boolean): void {
    // Handled by AudioEngine
  }

  getDuration(): number {
    let maxEnd = 0;
    this.track.clips.forEach(clip => {
      const end = clip.startTime + clip.duration;
      if (end > maxEnd) maxEnd = end;
    });
    return maxEnd;
  }

  dispose(): void {
    this.stop();
    this.gainNode.disconnect();
    this.panNode.disconnect();
    this.effectNodes.forEach(node => node.disconnect());
  }
}

// Export singleton instance
export const audioEngine = new AudioEngine();