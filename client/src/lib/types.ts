export type BusinessType = 'coffee_shop' | 'clinic' | 'gym' | 'grocery';
export type Priority = 'high_foot_traffic' | 'low_competition' | 'family_area' | 'premium_demographic' | 'accessibility';

export interface FactorScore {
  score: number;
  label: string;
  weight: number;
  preciselySource: string;
  fromPrecisely: boolean;
}

export interface ScoreBreakdown {
  addressQuality: FactorScore;
  demographicFit: FactorScore;
  competitionDensity: FactorScore;
  accessibility: FactorScore;
  commercialSuitability: FactorScore;
}

export interface AlternativeLocation {
  address: string;
  lat: number;
  lng: number;
  score: number;
  delta: number;
  distanceKm: number;
  direction: string;
  reasons: string[];
}

export interface EvaluateRequest {
  address: string;
  businessType: BusinessType;
  priorities: Priority[];
}

export interface EvaluateResponse {
  address: {
    raw: string;
    normalized: string;
    lat: number;
    lng: number;
    confidence: number;
    confidenceLabel: 'High' | 'Medium' | 'Low';
    fromPrecisely: boolean;
  };
  businessType: BusinessType;
  businessLabel: string;
  score: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  nearbyCompetitorCount: number;
  decision: string;
  breakdown: ScoreBreakdown;
  strengths: string[];
  concerns: string[];
  summary: string;
  alternatives: AlternativeLocation[];
}
