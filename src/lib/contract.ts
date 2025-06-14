import { writeContract, readContract } from 'wagmi/actions';
import { config } from '@/lib/wallet';
import MusicNadGameABI from '@/abi/MusicNadGame.json';

// Updated with NEW deployed contract address
export const MUSICNAD_TOKEN_ADDRESS = '0xeb510c04BAB32b540378211D93E37134db04d04b' as const;

export const TOKEN_REWARDS = {
  perfectMatch: 1,    // 1 token for exact song + singer match
  songOnly: 0.5,      // 0.5 tokens for song name only
  singerOnly: 0.2,    // 0.2 tokens for singer only
};

// NEW: Players submit their game results to earn pending rewards
export async function submitGameResult(
  totalScore: number, 
  genre: string
) {
  try {
    const result = await writeContract(config, {
      address: MUSICNAD_TOKEN_ADDRESS,
      abi: MusicNadGameABI.abi,
      functionName: 'submitGameResult',
      args: [BigInt(totalScore), genre],
    });
    
    return result;
  } catch (error) {
    console.error('Error submitting game result:', error);
    throw error;
  }
}

// NEW: Players claim their pending rewards
export async function claimReward() {
  try {
    const result = await writeContract(config, {
      address: MUSICNAD_TOKEN_ADDRESS,
      abi: MusicNadGameABI.abi,
      functionName: 'claimReward',
      args: [],
    });
    
    return result;
  } catch (error) {
    console.error('Error claiming reward:', error);
    throw error;
  }
}

// Get pending rewards for a player
export async function getPendingRewards(playerAddress: string) {
  try {
    const result = await readContract(config, {
      address: MUSICNAD_TOKEN_ADDRESS,
      abi: MusicNadGameABI.abi,
      functionName: 'getPendingRewards',
      args: [playerAddress],
    }) as bigint;
    
    return result;
  } catch (error) {
    console.error('Error getting pending rewards:', error);
    throw error;
  }
}

// LEGACY: Owner manual reward (kept for special cases)
export async function rewardPlayer(
  playerAddress: string, 
  totalScore: number, 
  genre: string
) {
  try {
    const result = await writeContract(config, {
      address: MUSICNAD_TOKEN_ADDRESS,
      abi: MusicNadGameABI.abi,
      functionName: 'rewardPlayer',
      args: [playerAddress, BigInt(totalScore), genre],
    });
    
    return result;
  } catch (error) {
    console.error('Error sending reward:', error);
    throw error;
  }
}

export async function getPlayerStats(playerAddress: string) {
  try {
    const result = await readContract(config, {
      address: MUSICNAD_TOKEN_ADDRESS,
      abi: MusicNadGameABI.abi,
      functionName: 'getPlayerStats',
      args: [playerAddress],
    }) as [bigint, bigint, string, bigint, bigint];
    
    return {
      totalScore: result[0],
      totalGames: result[1],
      favoriteGenre: result[2],
      monBalance: result[3],
      pendingRewards: result[4]  // NEW: pending rewards
    };
  } catch (error) {
    console.error('Error getting player stats:', error);
    throw error;
  }
}

export async function getGlobalStats() {
  try {
    const result = await readContract(config, {
      address: MUSICNAD_TOKEN_ADDRESS,
      abi: MusicNadGameABI.abi,
      functionName: 'getGlobalStats',
      args: [],
    }) as [bigint, bigint, bigint, bigint];
    
    return {
      totalRewards: result[0],
      totalGames: result[1],
      contractBalance: result[2],
      ownerBalance: result[3]
    };
  } catch (error) {
    console.error('Error getting global stats:', error);
    throw error;
  }
}

// Helper function to format MON token amounts
export function formatTokenAmount(amount: bigint): string {
  return (Number(amount) / 1e18).toFixed(2);
}

// Contract deployment info
export const CONTRACT_INFO = {
  name: 'MusicNadGame',
  symbol: 'MON',
  address: MUSICNAD_TOKEN_ADDRESS,
  network: 'Monad Testnet',
  chainId: 10143,
  deployed: true,
  deployedAt: new Date('2024-06-14'),
  rewardRate: '0.1 MON per point'
}; 