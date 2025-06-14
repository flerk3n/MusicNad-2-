import { writeContract, readContract } from 'wagmi/actions';
import { config } from '@/lib/wallet';
import MusicNadTokenABI from '@/abi/MusicNadToken.json';

// This will be updated after deployment
export const MUSICNAD_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

export const TOKEN_REWARDS = {
  perfectMatch: 1,    // 1 token for exact song + singer match
  songOnly: 0.5,      // 0.5 tokens for song name only
  singerOnly: 0.2,    // 0.2 tokens for singer only
};

export async function rewardPlayer(
  playerAddress: string, 
  totalScore: number, 
  genre: string
) {
  try {
    if (MUSICNAD_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
      throw new Error('Contract not deployed yet. Please deploy the contract first.');
    }

    const result = await writeContract(config, {
      address: MUSICNAD_TOKEN_ADDRESS,
      abi: MusicNadTokenABI.abi,
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
    if (MUSICNAD_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return {
        totalScore: 0n,
        totalGames: 0n,
        favoriteGenre: '',
        tokenBalance: 0n
      };
    }

    const result = await readContract(config, {
      address: MUSICNAD_TOKEN_ADDRESS,
      abi: MusicNadTokenABI.abi,
      functionName: 'getPlayerStats',
      args: [playerAddress],
    });
    
    return {
      totalScore: result[0] as bigint,
      totalGames: result[1] as bigint,
      favoriteGenre: result[2] as string,
      tokenBalance: result[3] as bigint
    };
  } catch (error) {
    console.error('Error getting player stats:', error);
    throw error;
  }
}

export async function getGlobalStats() {
  try {
    if (MUSICNAD_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return {
        totalRewards: 0n,
        totalGames: 0n,
        totalSupply: 0n,
        remainingSupply: 0n
      };
    }

    const result = await readContract(config, {
      address: MUSICNAD_TOKEN_ADDRESS,
      abi: MusicNadTokenABI.abi,
      functionName: 'getGlobalStats',
      args: [],
    });
    
    return {
      totalRewards: result[0] as bigint,
      totalGames: result[1] as bigint,
      totalSupply: result[2] as bigint,
      remainingSupply: result[3] as bigint
    };
  } catch (error) {
    console.error('Error getting global stats:', error);
    throw error;
  }
}

// Helper function to format token amounts
export function formatTokenAmount(amount: bigint): string {
  return (Number(amount) / 1e18).toFixed(2);
}

// Contract deployment info
export const CONTRACT_INFO = {
  name: 'MusicNadToken',
  symbol: 'MNAD',
  address: MUSICNAD_TOKEN_ADDRESS,
  network: 'Monad Testnet',
  chainId: 10143,
  deployed: false, // Will be updated after deployment
}; 