export interface Track {
  id: string;
  title: string;
  artist: string | any[]; // API can return string or array
  album?: string;
  duration?: number; // Optional now as search might not return it consistently or in same format
  coverUrl: string; // mapped from image
  previewUrl?: string; // This is the main audio source now
  audioUrl?: string; // Legacy support
  downloadUrl?: { link: string, quality: string }[]; // Fallback
  lyrics?: string[];
}

export interface Playlist {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  description?: string;
  coverUrl?: string;
  tracks: Track[];
  songs?: any[]; // Local structure
  createdAt?: string;
  createdBy?: string;
  isPublic?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  playlists: Playlist[];
  likedTracks: string[];
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
}
