import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WagmiProvider } from 'wagmi'
import { config } from './config/evm.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import VantaBackground from './utils/vanta.tsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { SolanaProvider } from './provider/solProvider.tsx'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl={`${window.location.origin}/tonconnect-manifest.json`}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
        <SolanaProvider>
          <VantaBackground/>
          <App />
        </SolanaProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </TonConnectUIProvider>
  </StrictMode>,
)
