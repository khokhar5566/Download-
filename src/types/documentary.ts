export interface Scene {
  id: number;
  titleUrdu: string;
  titleEnglish: string;
  urduScript: string;
  englishTranslation: string;
  visualCue: string;
  soundEffect: string;
  estimatedDurationSec: number;
  audioBase64?: string;
  isGeneratingAudio?: boolean;
  audioError?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  description: string;
  recommendedFor: string;
}

export interface SearchSource {
  title: string;
  uri: string;
}

export interface GroundedResult {
  query: string;
  result: string;
  sources: SearchSource[];
  timestamp: string;
}

export interface ImageAnalysisResult {
  imageUrl: string;
  analysis: string;
  timestamp: string;
}
