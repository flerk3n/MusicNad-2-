import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { injected } from 'wagmi/connectors';

// Define Monad Testnet chain
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com',
    },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
  ssr: true,
  syncConnectedChain: true,
}); 