/**
 * GOAT Royalty - AI Fashion Studio Types
 * Core type definitions for fashion and styling features
 */

// User Measurements
export interface UserMeasurements {
  id: string;
  userId: string;
  height: number; // in cm
  weight: number; // in kg
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
  shoulderWidth: number;
  armLength: number;
  neckCircumference: number;
  shoeSize: number;
  preferredFit: 'slim' | 'regular' | 'relaxed' | 'oversized';
  bodyType: 'rectangle' | 'triangle' | 'inverted-triangle' | 'hourglass' | 'oval';
  createdAt: Date;
  updatedAt: Date;
}

// Style Preferences
export interface StylePreferences {
  id: string;
  userId: string;
  favoriteColors: string[];
  avoidColors: string[];
  preferredStyles: StyleCategory[];
  occasions: Occasion[];
  budget: BudgetRange;
  brands: string[];
  sustainabilityPreference: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export type StyleCategory = 
  | 'casual'
  | 'formal'
  | 'business'
  | 'streetwear'
  | 'athletic'
  | 'bohemian'
  | 'minimalist'
  | 'vintage'
  | 'avant-garde'
  | 'preppy'
  | 'grunge'
  | 'romantic';

export type Occasion = 
  | 'everyday'
  | 'work'
  | 'date-night'
  | 'party'
  | 'wedding'
  | 'gym'
  | 'travel'
  | 'formal-event'
  | 'casual-outing';

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

// Virtual Wardrobe
export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: ClothingCategory;
  subcategory: string;
  brand?: string;
  color: string[];
  pattern?: string;
  material: string[];
  season: Season[];
  occasion: Occasion[];
  imageUrl: string;
  purchaseDate?: Date;
  price?: number;
  size: string;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'worn';
  tags: string[];
  timesWorn: number;
  lastWorn?: Date;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ClothingCategory = 
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'bags'
  | 'jewelry'
  | 'activewear'
  | 'swimwear'
  | 'intimates'
  | 'sleepwear';

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';

// Outfit
export interface Outfit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  items: string[]; // WardrobeItem IDs
  occasion: Occasion;
  season: Season;
  imageUrl?: string;
  rating?: number;
  timesWorn: number;
  lastWorn?: Date;
  favorite: boolean;
  aiGenerated: boolean;
  styleScore?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// AI Recommendations
export interface OutfitRecommendation {
  id: string;
  userId: string;
  outfit: Outfit;
  reason: string;
  confidence: number; // 0-1
  weatherContext?: WeatherContext;
  eventContext?: string;
  styleMatch: number; // 0-1
  trendScore: number; // 0-1
  createdAt: Date;
}

export interface WeatherContext {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  humidity: number;
  location: string;
}

// Virtual Try-On
export interface VirtualTryOnSession {
  id: string;
  userId: string;
  userPhotoUrl: string;
  garmentId: string;
  garmentImageUrl: string;
  resultImageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingTime?: number;
  bodyPoseData?: BodyPoseData;
  createdAt: Date;
  completedAt?: Date;
}

export interface BodyPoseData {
  keypoints: Keypoint[];
  boundingBox: BoundingBox;
  confidence: number;
}

export interface Keypoint {
  name: string;
  x: number;
  y: number;
  confidence: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 3D Fashion Design
export interface FashionDesign {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: ClothingCategory;
  modelUrl: string; // 3D model file (glTF)
  thumbnailUrl: string;
  materials: Material[];
  patterns: Pattern[];
  colors: ColorPalette;
  measurements: DesignMeasurements;
  tags: string[];
  isPublic: boolean;
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id: string;
  name: string;
  type: 'fabric' | 'leather' | 'synthetic' | 'metal' | 'other';
  texture?: string;
  properties: {
    roughness: number;
    metalness: number;
    opacity: number;
  };
}

export interface Pattern {
  id: string;
  name: string;
  type: 'solid' | 'striped' | 'checkered' | 'floral' | 'geometric' | 'abstract';
  imageUrl?: string;
  scale: number;
}

export interface ColorPalette {
  primary: string;
  secondary?: string;
  accent?: string;
  additional?: string[];
}

export interface DesignMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  length?: number;
  sleeveLength?: number;
  inseam?: number;
  custom?: Record<string, number>;
}

// Style DNA Analysis
export interface StyleDNA {
  id: string;
  userId: string;
  dominantStyles: StyleCategory[];
  colorProfile: ColorProfile;
  bodyTypeAnalysis: BodyTypeAnalysis;
  personalityTraits: string[];
  fashionInfluences: string[];
  confidenceScore: number;
  lastAnalyzed: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColorProfile {
  seasonalPalette: 'spring' | 'summer' | 'autumn' | 'winter';
  bestColors: string[];
  neutralColors: string[];
  accentColors: string[];
  avoidColors: string[];
}

export interface BodyTypeAnalysis {
  bodyType: UserMeasurements['bodyType'];
  proportions: {
    shoulderToWaist: number;
    waistToHip: number;
    torsoToLeg: number;
  };
  recommendations: {
    silhouettes: string[];
    necklines: string[];
    sleeves: string[];
    hemlines: string[];
  };
}

// Trend Analysis
export interface FashionTrend {
  id: string;
  name: string;
  description: string;
  category: StyleCategory;
  season: Season;
  year: number;
  popularity: number; // 0-100
  keywords: string[];
  imageUrls: string[];
  influencers: string[];
  brands: string[];
  priceRange: BudgetRange;
  createdAt: Date;
}

// Shopping Integration
export interface ShoppingItem {
  id: string;
  name: string;
  brand: string;
  category: ClothingCategory;
  price: number;
  currency: string;
  imageUrl: string;
  productUrl: string;
  sizes: string[];
  colors: string[];
  description: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  sustainable?: boolean;
  tags: string[];
}

export interface ShoppingRecommendation {
  id: string;
  userId: string;
  items: ShoppingItem[];
  reason: string;
  matchScore: number;
  priceMatch: boolean;
  styleMatch: boolean;
  occasionMatch: boolean;
  createdAt: Date;
}

// API Response Types
export interface FashionAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}