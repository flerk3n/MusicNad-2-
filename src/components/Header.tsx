'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export const Header = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="p-4 bg-gray-800/50 backdrop-blur-sm text-white text-sm flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="text-2xl">🎵</div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          MusicNad
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-green-400">●</span>
            <span>Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
            <button 
              onClick={() => disconnect()} 
              className="ml-2 text-red-400 hover:text-red-300 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={() => connect({ connector: connectors[0] })}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}; 