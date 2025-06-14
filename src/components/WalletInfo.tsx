'use client';

import { useAccount, useBalance } from 'wagmi';
import { monadTestnet } from '@/lib/wallet';

export const WalletInfo = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: monadTestnet.id,
  });

  if (!isConnected) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center">
        <div className="text-4xl mb-4">🔗</div>
        <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-300">
          Connect your wallet to interact with MusicNad on Monad Testnet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <h2 className="text-xl font-semibold text-white">Wallet Connected</h2>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Address:</span>
          <span className="text-white font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Network:</span>
          <span className="text-white">{chain?.name || 'Unknown'}</span>
        </div>
        
        {balance && (
          <div className="flex justify-between">
            <span className="text-gray-400">Balance:</span>
            <span className="text-white">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}; 