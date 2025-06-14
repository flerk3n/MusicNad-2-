'use client';

import { genres, genreColors, type Genre } from '@/lib/utils';

interface GenreCardsProps {
  onSelect: (genre: Genre) => void;
}

export const GenreCards = ({ onSelect }: GenreCardsProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Choose Your Music Genre
        </h2>
        <p className="text-gray-300">
          Select a genre to start guessing songs and earn MNAD tokens!
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <button 
            key={genre} 
            onClick={() => onSelect(genre)} 
            className={`
              bg-gradient-to-r ${genreColors[genre]} 
              hover:scale-105 transform transition-all duration-300 
              p-6 rounded-xl shadow-lg text-white font-semibold 
              hover:shadow-2xl hover:shadow-purple-500/25
              flex flex-col items-center justify-center
              min-h-[120px]
              group
            `}
          >
            <div className="text-2xl mb-2 group-hover:animate-bounce">
              {getGenreEmoji(genre)}
            </div>
            <span className="text-center text-sm leading-tight">
              {genre}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

function getGenreEmoji(genre: Genre): string {
  const emojis = {
    'Bollywood': '🎭',
    'Hip-Hop/Rap': '🎤',
    'Rock/Alternative': '🎸',
    'EDM/Electronic': '🎛️',
    'Sufi/Devotional': '🕉️'
  };
  return emojis[genre] || '🎵';
} 