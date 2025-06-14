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

// Playlist handling with real YouTube video IDs
export const playlistConfig = {
  "Bollywood": [
    { id: "RgKAFK5djSk", title: "Waka Waka - Shakira" },
    { id: "kJQP7kiw5Fk", title: "Despacito - Luis Fonsi" },
    { id: "OPf0YbXqDm0", title: "Uptown Funk - Mark Ronson ft. Bruno Mars" },
    { id: "hT_nvWreIhg", title: "Counting Stars - OneRepublic" },
    { id: "CevxZvSJLk8", title: "Roar - Katy Perry" }
  ],
  "Hip-Hop/Rap": [
    { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up - Rick Astley" },
    { id: "9bZkp7q19f0", title: "Gangnam Style - PSY" },
    { id: "OPf0YbXqDm0", title: "Uptown Funk - Mark Ronson ft. Bruno Mars" },
    { id: "hT_nvWreIhg", title: "Counting Stars - OneRepublic" },
    { id: "CevxZvSJLk8", title: "Roar - Katy Perry" }
  ],
  "Rock/Alternative": [
    { id: "fJ9rUzIMcZQ", title: "Bohemian Rhapsody - Queen" },
    { id: "rY0WxgSXdEE", title: "Sweet Child O' Mine - Guns N' Roses" },
    { id: "tbU3zdAgiX8", title: "How to Save a Life - The Fray" },
    { id: "hT_nvWreIhg", title: "Counting Stars - OneRepublic" },
    { id: "CevxZvSJLk8", title: "Roar - Katy Perry" }
  ],
  "EDM/Electronic": [
    { id: "IcrbM1l_BoI", title: "Wake Me Up - Avicii" },
    { id: "HyHNuVaZJ-k", title: "Animals - Martin Garrix" },
    { id: "OPf0YbXqDm0", title: "Uptown Funk - Mark Ronson ft. Bruno Mars" },
    { id: "hT_nvWreIhg", title: "Counting Stars - OneRepublic" },
    { id: "CevxZvSJLk8", title: "Roar - Katy Perry" }
  ],
  "Sufi/Devotional": [
    { id: "dQw4w9WgXcQ", title: "Never Gonna Give You Up - Rick Astley" },
    { id: "kJQP7kiw5Fk", title: "Despacito - Luis Fonsi" },
    { id: "OPf0YbXqDm0", title: "Uptown Funk - Mark Ronson ft. Bruno Mars" },
    { id: "hT_nvWreIhg", title: "Counting Stars - OneRepublic" },
    { id: "CevxZvSJLk8", title: "Roar - Katy Perry" }
  ]
};

// Track which songs have been used in current game session
let usedSongs: Set<string> = new Set();

export function getRandomVideoId(genre: string): { videoId: string, title: string } {
  const genreKey = genre as keyof typeof playlistConfig;
  const songs = playlistConfig[genreKey] || playlistConfig["Bollywood"]; // fallback
  
  // Get unused songs first
  const availableSongs = songs.filter(song => !usedSongs.has(`${genre}-${song.id}`));
  
  // If all songs used, reset the set
  if (availableSongs.length === 0) {
    usedSongs.clear();
    return { videoId: songs[0].id, title: songs[0].title };
  }
  
  // Pick random unused song
  const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
  usedSongs.add(`${genre}-${randomSong.id}`);
  
  return { videoId: randomSong.id, title: randomSong.title };
}

// Reset used songs when starting new game
export function resetSongSelection() {
  usedSongs.clear();
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