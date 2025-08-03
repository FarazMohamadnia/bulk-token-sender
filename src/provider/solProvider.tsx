import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import "@solana/wallet-adapter-react-ui/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const network = "mainnet-beta";
const endpoint = clusterApiUrl(network);
const wallets = [
  new PhantomWalletAdapter(),
  new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      relayUrl: "wss://relay.walletconnect.com",
      projectId: "6d5b04db69876645259a00caa7e5923c",
      metadata: {
        name: "DiceManiacs",
        description: "Connect To DiceManiacs App",
        url: "https://dicemaniacs.com/",
        icons: ["https://dicemaniacs.com/dice.svg"],
      },
    },
  }),
];

export const SolanaProvider = ({ children }: any) => {
  return (
    <WalletProvider wallets={wallets} autoConnect>
       <ConnectionProvider endpoint={endpoint}>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WalletModalProvider>
       </ConnectionProvider>
    </WalletProvider>
  );
};
