'use client';

import { genreColors, type Genre } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface CDPlayerProps {
  videoId: string;
  genre: Genre;
  isPlaying: boolean;
  onSongEnd?: () => void;
}

export const CDPlayer = ({ videoId, genre, isPlaying, onSongEnd }: CDPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    // Optional: Add YouTube API integration for better control
    if (onSongEnd) {
      const timer = setTimeout(() => {
        onSongEnd();
      }, 60000); // 1 minute per song for demo
      
      return () => clearTimeout(timer);
    }
  }, [videoId, onSongEnd]);

  return (
    <div className="flex flex-col items-center">
      {/* Hidden YouTube iframe for audio only */}
      <iframe
        ref={iframeRef}
        id="youtube-audio"
        width="0"
        height="0"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&start=30&rel=0&showinfo=0`}
        allow="autoplay"
        style={{ display: 'none' }}
        title="YouTube Audio Player"
      />
      
      {/* Rotating CD Disc Visual */}
      <div className="relative w-64 h-64 mb-4">
        <div className={`
          w-full h-full rounded-full bg-gradient-to-r ${genreColors[genre]} 
          shadow-2xl ${isPlaying ? 'animate-spin-slow' : ''} cd-disc
          border-4 border-white/10
        `}>
          {/* CD Center Hole */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full shadow-inner border-2 border-gray-600"></div>
          
          {/* CD Reflection Lines */}
          <div className="absolute inset-4 rounded-full border-2 border-white/20"></div>
          <div className="absolute inset-8 rounded-full border border-white/10"></div>
          <div className="absolute inset-12 rounded-full border border-white/10"></div>
          
          {/* Genre Label */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-white/80 text-xs font-semibold">
            {genre}
          </div>
          
          {/* Record Label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/60 text-[8px] font-bold tracking-widest">
            MNAD
          </div>
        </div>
        
        {/* Floating Music Notes */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-8 text-white/60 text-xl animate-bounce">♪</div>
            <div className="absolute top-12 right-6 text-white/60 text-lg animate-bounce delay-200">♫</div>
            <div className="absolute bottom-8 left-12 text-white/60 text-xl animate-bounce delay-400">♪</div>
            <div className="absolute bottom-12 right-10 text-white/60 text-lg animate-bounce delay-600">♫</div>
          </div>
        )}
        
        {/* Stylus/Needle */}
        <div className={`
          absolute top-8 right-8 w-16 h-1 bg-gradient-to-r from-gray-600 to-gray-400 
          rounded-full shadow-lg transform origin-right 
          ${isPlaying ? 'rotate-45' : 'rotate-12'}
          transition-transform duration-1000
        `}>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </div>
      
      {/* Song Status */}
      <div className="text-center">
        <p className="text-white/80 text-lg font-semibold mb-2">
          {isPlaying ? "🎵 Now Playing..." : "⏸️ Ready to Play"}
        </p>
        <div className="text-sm text-gray-400">
          {isPlaying ? "Listen carefully and guess the song!" : "Press play to start"}
        </div>
      </div>
    </div>
  );
}; 