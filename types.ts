
export interface Song {
  title: string;
  artist: string;
}

export interface ScanResult {
  detectedMood: string;
  suggestedSongs: Song[];
  associatedMoods: string[];
}

export type AppState = 'IDLE' | 'SCANNING' | 'LOADING' | 'RESULTS' | 'ERROR';
