import { http } from 'viem';
import { mainnet, bsc, polygon } from 'viem/chains';
import { createConfig } from '@wagmi/core';
import { walletConnect } from '@wagmi/connectors';

// Configure chains & providers
const chains = [mainnet, bsc, polygon] as const;

// Set up connectors
const connectors = [
  // need : config in deploy
  walletConnect({
    projectId: '78987af81799652a2c0577d6be81bed2',
    metadata: {
      name: 'DiceManiacs',
      description: 'Connect To DiceManiacs App',
      url: window.location.origin,
      icons: [`${window.location.origin}/dice.svg`],
    },

    showQrModal: true,
  }),
];

// Create wagmi config
export const config = createConfig({
  chains,
  connectors,
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http('https://binance.llamarpc.com'),
    [polygon.id]: http('https://polygon-rpc.com'),
  },
});
