/**
 * GOAT Royalty - Music Production Types
 * Core type definitions for music production and distribution
 */

// Audio Project
export interface AudioProject {
  id: string;
  userId: string;
  name: string;
  description?: string;
  bpm: number;
  timeSignature: { numerator: number; denominator: number };
  key: MusicalKey;
  genre: MusicGenre[];
  tracks: AudioTrack[];
  masterTrack: MasterTrack;
  duration: number; // in seconds
  sampleRate: number; // 44100, 48000, 96000
  bitDepth: number; // 16, 24, 32
  status: 'draft' | 'in-progress' | 'mixing' | 'mastering' | 'completed';
  collaborators: string[]; // user IDs
  version: number;
  createdAt: Date;
  updatedAt: Date;
  lastSaved: Date;
}

export type MusicalKey = 
  | 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
  | 'Cm' | 'C#m' | 'Dm' | 'D#m' | 'Em' | 'Fm' | 'F#m' | 'Gm' | 'G#m' | 'Am' | 'A#m' | 'Bm';

export type MusicGenre =
  | 'pop' | 'rock' | 'hip-hop' | 'electronic' | 'jazz' | 'classical'
  | 'r&b' | 'country' | 'metal' | 'indie' | 'folk' | 'blues'
  | 'reggae' | 'latin' | 'world' | 'experimental' | 'ambient';

// Audio Track
export interface AudioTrack {
  id: string;
  projectId: string;
  name: string;
  type: TrackType;
  color: string;
  volume: number; // 0-1
  pan: number; // -1 to 1
  mute: boolean;
  solo: boolean;
  armed: boolean; // for recording
  clips: AudioClip[];
  effects: AudioEffect[];
  sends: Send[];
  automation: Automation[];
  inputDevice?: string;
  outputDevice?: string;
  order: number;
}

export type TrackType = 
  | 'audio' | 'midi' | 'instrument' | 'bus' | 'aux' | 'master';

// Audio Clip
export interface AudioClip {
  id: string;
  trackId: string;
  name: string;
  audioUrl?: string; // for audio clips
  midiData?: MIDIData; // for MIDI clips
  startTime: number; // in seconds
  duration: number;
  offset: number; // trim start
  fadeIn: number;
  fadeOut: number;
  gain: number;
  pitch: number; // semitones
  timeStretch: number; // 0.5 to 2.0
  reverse: boolean;
  color: string;
}

// MIDI Data
export interface MIDIData {
  notes: MIDINote[];
  controlChanges: MIDIControlChange[];
  programChanges: MIDIProgramChange[];
}

export interface MIDINote {
  pitch: number; // 0-127
  velocity: number; // 0-127
  startTime: number; // in beats
  duration: number; // in beats
  channel: number; // 0-15
}

export interface MIDIControlChange {
  controller: number; // 0-127
  value: number; // 0-127
  time: number;
  channel: number;
}

export interface MIDIProgramChange {
  program: number; // 0-127
  time: number;
  channel: number;
}

// Audio Effects
export interface AudioEffect {
  id: string;
  type: EffectType;
  name: string;
  enabled: boolean;
  parameters: Record<string, number>;
  preset?: string;
  order: number;
}

export type EffectType =
  | 'eq' | 'compressor' | 'limiter' | 'gate' | 'expander'
  | 'reverb' | 'delay' | 'chorus' | 'flanger' | 'phaser'
  | 'distortion' | 'saturation' | 'bitcrusher'
  | 'filter' | 'auto-filter' | 'auto-pan'
  | 'tremolo' | 'vibrato' | 'pitch-shift'
  | 'vocoder' | 'harmonizer' | 'de-esser';

// Master Track
export interface MasterTrack {
  volume: number;
  effects: AudioEffect[];
  limiter: LimiterSettings;
  loudness: LoudnessSettings;
}

export interface LimiterSettings {
  enabled: boolean;
  threshold: number; // dB
  ceiling: number; // dB
  release: number; // ms
}

export interface LoudnessSettings {
  targetLUFS: number; // -14 for streaming, -16 for broadcast
  truePeak: number; // dBTP
  normalize: boolean;
}

// Automation
export interface Automation {
  id: string;
  parameter: string; // 'volume', 'pan', 'effect.reverb.mix', etc.
  points: AutomationPoint[];
  mode: 'linear' | 'exponential' | 'logarithmic' | 'step';
}

export interface AutomationPoint {
  time: number; // in seconds
  value: number;
  curve?: number; // for bezier curves
}

// Send (for aux/bus routing)
export interface Send {
  id: string;
  destination: string; // track ID
  amount: number; // 0-1
  preFader: boolean;
}

// Virtual Instruments
export interface VirtualInstrument {
  id: string;
  name: string;
  type: InstrumentType;
  category: string;
  presets: InstrumentPreset[];
  parameters: Record<string, number>;
  polyphony: number;
  midiChannel: number;
}

export type InstrumentType =
  | 'synthesizer' | 'sampler' | 'drum-machine' | 'piano'
  | 'organ' | 'strings' | 'brass' | 'woodwinds'
  | 'guitar' | 'bass' | 'percussion' | 'fx';

export interface InstrumentPreset {
  id: string;
  name: string;
  category: string;
  parameters: Record<string, number>;
  samples?: string[]; // URLs to audio samples
}

// Royalty Management
export interface Track {
  id: string;
  userId: string;
  title: string;
  artists: Artist[];
  album?: string;
  genre: MusicGenre[];
  duration: number;
  isrc?: string; // International Standard Recording Code
  upc?: string; // Universal Product Code
  releaseDate?: Date;
  recordLabel?: string;
  publisher?: string;
  copyright: CopyrightInfo;
  splits: RoyaltySplit[];
  metadata: TrackMetadata;
  audioFiles: AudioFile[];
  status: 'draft' | 'registered' | 'distributed' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface Artist {
  id: string;
  name: string;
  role: 'primary' | 'featured' | 'producer' | 'writer' | 'remixer';
  ipi?: string; // Interested Party Information
  pro?: string; // Performance Rights Organization
}

export interface CopyrightInfo {
  owner: string;
  year: number;
  territory: string; // 'worldwide' or specific countries
  type: 'sound-recording' | 'composition' | 'both';
}

export interface RoyaltySplit {
  id: string;
  userId: string;
  name: string;
  role: 'artist' | 'producer' | 'writer' | 'publisher' | 'label';
  percentage: number; // 0-100
  type: 'master' | 'publishing' | 'performance';
  verified: boolean;
}

export interface TrackMetadata {
  lyrics?: string;
  language?: string;
  explicit: boolean;
  mood?: string[];
  instruments?: string[];
  bpm?: number;
  key?: MusicalKey;
  tags?: string[];
}

export interface AudioFile {
  id: string;
  type: 'master' | 'instrumental' | 'acapella' | 'stems';
  format: 'wav' | 'mp3' | 'flac' | 'aac' | 'ogg';
  quality: 'lossy' | 'lossless' | 'hi-res';
  sampleRate: number;
  bitDepth: number;
  bitrate?: number; // for lossy formats
  fileSize: number; // in bytes
  url: string;
  duration: number;
}

// Distribution
export interface Release {
  id: string;
  userId: string;
  type: 'single' | 'ep' | 'album' | 'compilation';
  title: string;
  artists: Artist[];
  tracks: string[]; // Track IDs
  coverArt: string; // URL
  releaseDate: Date;
  preOrderDate?: Date;
  upc?: string;
  catalogNumber?: string;
  recordLabel?: string;
  genre: MusicGenre[];
  description?: string;
  platforms: DistributionPlatform[];
  status: 'draft' | 'scheduled' | 'submitted' | 'live' | 'taken-down';
  analytics: ReleaseAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface DistributionPlatform {
  name: string;
  enabled: boolean;
  status: 'pending' | 'processing' | 'live' | 'rejected' | 'taken-down';
  url?: string;
  submittedAt?: Date;
  liveAt?: Date;
}

export interface ReleaseAnalytics {
  totalStreams: number;
  totalDownloads: number;
  totalRevenue: number;
  streamsByPlatform: Record<string, number>;
  streamsByCountry: Record<string, number>;
  listeners: number;
  saves: number;
  playlistAdds: number;
  demographics: Demographics;
}

export interface Demographics {
  ageGroups: Record<string, number>;
  gender: Record<string, number>;
  topCities: Array<{ city: string; country: string; listeners: number }>;
}

// Royalty Tracking
export interface RoyaltyStatement {
  id: string;
  userId: string;
  period: { start: Date; end: Date };
  tracks: RoyaltyTrackData[];
  totalStreams: number;
  totalRevenue: number;
  platformBreakdown: PlatformRoyalty[];
  territoryBreakdown: TerritoryRoyalty[];
  paymentStatus: 'pending' | 'processing' | 'paid';
  paymentDate?: Date;
  paymentMethod?: string;
  createdAt: Date;
}

export interface RoyaltyTrackData {
  trackId: string;
  title: string;
  streams: number;
  revenue: number;
  yourShare: number;
  splitPercentage: number;
}

export interface PlatformRoyalty {
  platform: string;
  streams: number;
  revenue: number;
  rate: number; // per stream
}

export interface TerritoryRoyalty {
  country: string;
  streams: number;
  revenue: number;
}

// AI Mastering
export interface MasteringJob {
  id: string;
  userId: string;
  trackId: string;
  inputFileUrl: string;
  outputFileUrl?: string;
  settings: MasteringSettings;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  processingTime?: number; // in seconds
  referenceTrack?: string; // URL for reference matching
  createdAt: Date;
  completedAt?: Date;
}

export interface MasteringSettings {
  genre: MusicGenre;
  targetLoudness: number; // LUFS
  targetPeak: number; // dBTP
  enhanceBass: boolean;
  enhanceClarity: boolean;
  addWarmth: boolean;
  stereoWidth: number; // 0-100
  preset?: 'streaming' | 'cd' | 'vinyl' | 'mastering' | 'custom';
}

// Stem Separation
export interface StemSeparationJob {
  id: string;
  userId: string;
  inputFileUrl: string;
  stems: StemFile[];
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  processingTime?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface StemFile {
  type: 'vocals' | 'drums' | 'bass' | 'other' | 'piano' | 'guitar';
  url: string;
  duration: number;
  fileSize: number;
}

// Sample Library
export interface Sample {
  id: string;
  name: string;
  category: SampleCategory;
  subcategory: string;
  tags: string[];
  bpm?: number;
  key?: MusicalKey;
  duration: number;
  format: 'wav' | 'mp3' | 'flac';
  sampleRate: number;
  bitDepth: number;
  fileSize: number;
  url: string;
  waveformUrl: string;
  previewUrl: string;
  license: SampleLicense;
  price?: number;
  downloads: number;
  rating: number;
  createdBy: string;
  createdAt: Date;
}

export type SampleCategory =
  | 'drums' | 'percussion' | 'bass' | 'synth' | 'keys'
  | 'guitar' | 'vocals' | 'fx' | 'loops' | 'one-shots';

export interface SampleLicense {
  type: 'royalty-free' | 'creative-commons' | 'commercial' | 'exclusive';
  attribution: boolean;
  commercial: boolean;
  modifications: boolean;
  redistribution: boolean;
}

// Collaboration
export interface CollaborationSession {
  id: string;
  projectId: string;
  participants: Participant[];
  status: 'active' | 'paused' | 'ended';
  startedAt: Date;
  endedAt?: Date;
  changes: Change[];
}

export interface Participant {
  userId: string;
  name: string;
  role: 'owner' | 'collaborator' | 'viewer';
  permissions: Permission[];
  online: boolean;
  cursor?: { x: number; y: number };
  selection?: string; // selected element ID
}

export type Permission =
  | 'edit-tracks' | 'add-tracks' | 'delete-tracks'
  | 'edit-effects' | 'edit-automation'
  | 'export' | 'invite-others';

export interface Change {
  id: string;
  userId: string;
  type: 'add' | 'edit' | 'delete';
  target: string; // track ID, clip ID, etc.
  data: any;
  timestamp: Date;
}

// API Response Types
export interface MusicAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedMusicResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}