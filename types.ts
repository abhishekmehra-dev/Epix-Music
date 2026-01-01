export interface Song {
  title: string;
  artist: string;
  album?: string;
}

export interface MoodResult {
  mood: string;
  associatedMoods: string[];
  playlist: Song[];
}

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
