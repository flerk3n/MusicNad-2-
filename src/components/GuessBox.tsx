'use client';

import { useState } from 'react';

interface GuessBoxProps {
  onGuess: (guess: string) => void;
  isActive: boolean;
  currentSong: number;
  totalSongs: number;
}

export const GuessBox = ({ onGuess, isActive, currentSong, totalSongs }: GuessBoxProps) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (input.trim() && !isSubmitting) {
      setIsSubmitting(true);
      onGuess(input.trim());
      setInput('');
      // Small delay to prevent rapid submissions
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Song Progress</span>
          <span className="text-sm text-gray-400">{currentSong}/{totalSongs}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentSong / totalSongs) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              What's This Song? 🎵
            </h3>
            <p className="text-gray-400 text-sm">
              Enter the song name, artist, or both
            </p>
          </div>

          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your guess here..."
              className={`
                w-full px-4 py-3 text-lg bg-gray-700/50 border-2 rounded-lg 
                focus:border-purple-500 focus:outline-none transition-all
                text-white placeholder-gray-400
                ${!isActive ? 'opacity-50 cursor-not-allowed' : ''}
                ${isSubmitting ? 'animate-pulse' : ''}
              `}
              disabled={!isActive || isSubmitting}
              maxLength={100}
            />
            
            {input.length > 0 && (
              <div className="absolute right-3 top-3 text-gray-400 text-sm">
                {input.length}/100
              </div>
            )}
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={!isActive || !input.trim() || isSubmitting}
            className={`
              w-full py-3 rounded-lg font-semibold text-lg transition-all transform
              ${(!isActive || !input.trim() || isSubmitting) 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105 active:scale-95'
              }
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Submitting...
              </div>
            ) : (
              'Submit Guess'
            )}
          </button>
        </div>
        
        {/* Helpful Tips */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm flex items-center gap-2">
            <span>💡</span>
            <span>Don't worry about typos - our smart matching will understand!</span>
          </p>
        </div>
      </div>
    </div>
  );
}; 