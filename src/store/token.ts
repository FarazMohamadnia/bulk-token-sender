import { create } from "zustand";

interface TokenState {
  selectedToken: {
    label: string;
    value: string;
    address: string;
    decimals: number;
  } | null;
  setSelectedToken: (
    token: {
      label: string;
      value: string;
      address: string;
      decimals: number;
    } | null
  ) => void;
  getSelectedToken: () => {
    label?: string;
    value?: string;
    address: string;
    decimals: number;
  } | null;
  clearSelectedToken: () => void;
}

export const useTokenStore = create<TokenState>((set, get) => ({
  selectedToken: null,
  setSelectedToken: (token) => set({ selectedToken: token }),
  getSelectedToken: () => get().selectedToken,
  clearSelectedToken: () => set({ selectedToken: null }),
}));
