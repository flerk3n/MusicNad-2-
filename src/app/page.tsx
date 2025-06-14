'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Header } from '@/components/Header';
import { GenreCards } from '@/components/GenreCards';
import { CDPlayer } from '@/components/CDPlayer';
import { GuessBox } from '@/components/GuessBox';
import { 
  GameState, 
  initialGameState, 
  calculateScore, 
  getRandomVideoId,
  type Genre 
} from '@/lib/utils';

export default function Home() {
  const { isConnected } = useAccount();
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [countdown, setCountdown] = useState(0);
  const [lastGuessScore, setLastGuessScore] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update game phase based on wallet connection
  useEffect(() => {
    if (!mounted) return;
    
    if (!isConnected && gameState.gamePhase !== 'wallet-connect') {
      setGameState(initialGameState);
    } else if (isConnected && gameState.gamePhase === 'wallet-connect') {
      setGameState(prev => ({ ...prev, gamePhase: 'genre-select' }));
    }
  }, [isConnected, gameState.gamePhase, mounted]);

  // Countdown logic
  useEffect(() => {
    if (!mounted) return;
    
    if (gameState.gamePhase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState.gamePhase === 'countdown' && countdown === 0) {
      startPlaying();
    }
  }, [countdown, gameState.gamePhase, mounted]);

  const handleGenreSelect = (genre: Genre) => {
    const videoId = getRandomVideoId('');
    setGameState(prev => ({
      ...prev,
      currentGenre: genre,
      gamePhase: 'countdown',
      songsPlayed: 1,
      currentVideoId: videoId,
      currentSongTitle: `Sample Song ${Math.floor(Math.random() * 100)}`,
    }));
    setCountdown(3);
  };

  const startPlaying = () => {
    setGameState(prev => ({
      ...prev,
      gamePhase: 'playing',
      isPlaying: true
    }));
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        gamePhase: 'guessing'
      }));
    }, 5000);
  };

  const handleGuess = (guess: string) => {
    const score = calculateScore(guess, gameState.currentSongTitle);
    setLastGuessScore(score);
    
    setGameState(prev => ({
      ...prev,
      totalScore: prev.totalScore + score,
      gamePhase: 'results'
    }));

    setTimeout(() => {
      if (gameState.songsPlayed >= gameState.maxSongs) {
        setGameState(prev => ({
          ...prev,
          gamePhase: 'final-results',
          isPlaying: false
        }));
      } else {
        const nextVideoId = getRandomVideoId('');
        setGameState(prev => ({
          ...prev,
          currentVideoId: nextVideoId,
          currentSongTitle: `Sample Song ${Math.floor(Math.random() * 100)}`,
          songsPlayed: prev.songsPlayed + 1,
          gamePhase: 'countdown'
        }));
        setCountdown(3);
      }
    }, 3000);
  };

  const resetGame = () => {
    setGameState({ ...initialGameState, gamePhase: 'genre-select' });
    setLastGuessScore(0);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const renderGameContent = () => {
    switch (gameState.gamePhase) {
      case 'wallet-connect':
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎵</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome to MusicNad
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              The Web3 Song Guessing Game
            </p>
            <p className="text-gray-400 mb-8">
              Connect your wallet to start playing and earn MNAD tokens!
            </p>
            <div className="max-w-md mx-auto p-6 bg-gray-800/30 rounded-xl border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">How to Play:</h3>
              <ul className="text-sm text-gray-300 space-y-2 text-left">
                <li>• Connect your MetaMask wallet</li>
                <li>• Choose a music genre</li>
                <li>• Listen to 5 songs and guess their names</li>
                <li>• Earn MNAD tokens based on your score</li>
                <li>• Typos are forgiven - we use smart matching!</li>
              </ul>
            </div>
          </div>
        );

      case 'genre-select':
        return <GenreCards onSelect={handleGenreSelect} />;

      case 'countdown':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-8 text-gray-300">
              Get Ready for {gameState.currentGenre}!
            </h2>
            <div className="text-8xl font-bold text-purple-400 animate-pulse mb-4">
              {countdown}
            </div>
            <p className="text-gray-400">
              Song {gameState.songsPlayed} of {gameState.maxSongs}
            </p>
          </div>
        );

      case 'playing':
      case 'guessing':
        return (
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                {gameState.currentGenre} - Song {gameState.songsPlayed}/{gameState.maxSongs}
              </h2>
              <p className="text-gray-400">
                Current Score: {gameState.totalScore} points
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
              <CDPlayer 
                videoId={gameState.currentVideoId}
                genre={gameState.currentGenre as Genre}
                isPlaying={gameState.isPlaying}
              />
              
              {gameState.gamePhase === 'guessing' && (
                <GuessBox 
                  onGuess={handleGuess}
                  isActive={true}
                  currentSong={gameState.songsPlayed}
                  totalSongs={gameState.maxSongs}
                />
              )}
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">
              {lastGuessScore >= 8 ? '🎉' : lastGuessScore >= 5 ? '👏' : '🤔'}
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {lastGuessScore >= 8 ? 'Excellent!' : lastGuessScore >= 5 ? 'Good Job!' : 'Nice Try!'}
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              You scored {lastGuessScore} points this round
            </p>
            <p className="text-gray-400">
              Moving to next song...
            </p>
          </div>
        );

      case 'final-results':
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Game Complete!
            </h2>
            <div className="max-w-md mx-auto bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <p className="text-2xl font-semibold mb-4">
                Final Score: {gameState.totalScore}/50
              </p>
              <p className="text-gray-300 mb-6">
                Genre: {gameState.currentGenre}
              </p>
              <p className="text-sm text-gray-400 mb-6">
                🎯 Tokens will be sent to your wallet based on your score
              </p>
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderGameContent()}
      </main>
      
      {/* Background Music Visualization */}
      <div className="fixed bottom-4 right-4 pointer-events-none">
        {gameState.isPlaying && (
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 40 + 20}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
