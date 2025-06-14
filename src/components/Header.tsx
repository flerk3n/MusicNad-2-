'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <div className="p-4 bg-gray-800/50 backdrop-blur-sm text-white text-sm flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="text-2xl">🎵</div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          MusicNad
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <ConnectButton />
      </div>
    </div>
  );
}; 