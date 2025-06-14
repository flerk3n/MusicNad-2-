import stringSimilarity from 'string-similarity';

export function calculateScore(guess: string, songTitle: string): number {
  const g = guess.toLowerCase().trim();
  const title = songTitle.toLowerCase().trim();
  
  // Extract song name and artist from YouTube title
  // Common formats: "Song - Artist", "Artist - Song", "Song (Artist)"
  let songPart = '';
  let artistPart = '';
  
  if (title.includes(' - ')) {
    [songPart, artistPart] = title.split(' - ').map(s => s.trim());
  } else if (title.includes(' by ')) {
    [songPart, artistPart] = title.split(' by ').map(s => s.trim());
  } else {
    songPart = title; // fallback to full title
  }
  
  let score = 0;
  
  // Check song name similarity
  const songSimilarity = stringSimilarity.compareTwoStrings(g, songPart);
  if (songSimilarity >= 0.7) score += 5;
  else if (songSimilarity >= 0.5) score += 3;
  
  // Check artist name similarity
  if (artistPart) {
    const artistSimilarity = stringSimilarity.compareTwoStrings(g, artistPart);
    if (artistSimilarity >= 0.7) score += 2;
    else if (artistSimilarity >= 0.5) score += 1;
  }
  
  // Check combined similarity
  const combinedSimilarity = stringSimilarity.compareTwoStrings(g, title);
  if (combinedSimilarity >= 0.6) score += 10; // perfect match bonus
  
  return Math.min(score, 10); // cap at 10 points per song
}

// Playlist handling
export const playlistConfig = {
  "Bollywood": "PLAYLIST_URL_TO_BE_PROVIDED",
  "Hip-Hop/Rap": "PLAYLIST_URL_TO_BE_PROVIDED",
  "Rock/Alternative": "PLAYLIST_URL_TO_BE_PROVIDED", 
  "EDM/Electronic": "PLAYLIST_URL_TO_BE_PROVIDED",
  "Sufi/Devotional": "PLAYLIST_URL_TO_BE_PROVIDED"
};

export function extractPlaylistId(playlistUrl: string): string {
  const match = playlistUrl.match(/[&?]list=([^&]+)/);
  return match ? match[1] : '';
}

// For now, return sample video IDs for testing
export function getRandomVideoId(playlistId: string): string {
  // Sample video IDs for testing (will be replaced with actual playlist fetching)
  const sampleVideos = [
    'dQw4w9WgXcQ', // Never Gonna Give You Up
    '9bZkp7q19f0', // Gangnam Style  
    'kJQP7kiw5Fk', // Despacito
    'RgKAFK5djSk', // Waka Waka
    'hT_nvWreIhg'  // Counting Stars
  ];
  
  return sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
}

// Game state management
export interface GameState {
  currentGenre: string;
  currentSong: number;
  totalScore: number;
  isPlaying: boolean;
  gamePhase: 'wallet-connect' | 'genre-select' | 'countdown' | 'playing' | 'guessing' | 'results' | 'final-results';
  songsPlayed: number;
  maxSongs: number;
  currentVideoId: string;
  currentSongTitle: string;
}

export const initialGameState: GameState = {
  currentGenre: '',
  currentSong: 0,
  totalScore: 0,
  isPlaying: false,
  gamePhase: 'wallet-connect',
  songsPlayed: 0,
  maxSongs: 5,
  currentVideoId: '',
  currentSongTitle: ''
};

export const TOKEN_REWARDS = {
  perfectMatch: 1,    // 1 token for exact song + singer match
  songOnly: 0.5,      // 0.5 tokens for song name only
  singerOnly: 0.2,    // 0.2 tokens for singer only
};

// Genre colors for UI
export const genreColors = {
  'Bollywood': 'from-orange-400 to-pink-500',
  'Hip-Hop/Rap': 'from-gray-800 to-yellow-400', 
  'Rock/Alternative': 'from-red-600 to-gray-800',
  'EDM/Electronic': 'from-blue-400 to-purple-500',
  'Sufi/Devotional': 'from-green-400 to-purple-600'
} as const;

export const genres = [
  'Bollywood',
  'Hip-Hop/Rap', 
  'Rock/Alternative',
  'EDM/Electronic',
  'Sufi/Devotional'
] as const;

export type Genre = typeof genres[number]; 