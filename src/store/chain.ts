import { create } from "zustand";

interface ChainState {
  chain: string | number | null;
  setChain: (chain: string | number | null) => void;
  getChain: () => string | number | null;
}

export const useChainStore = create<ChainState>((set, get) => ({
  chain: null, // default chain
  setChain: (chain: string | number | null) => set({ chain }),
  getChain: () => get().chain,
}));
