import { create } from 'zustand';
import { TonTokens, type TonToken, type TonTokensType } from '../config/tonTokenConfig';

interface TonTokenStoreState {
  tokens: TonTokensType;
  getToken: (symbol: string) => TonToken | undefined;
  setReceiverAddress: (symbol: string, address: string) => void;
}

export const useTonTokenStore = create<TonTokenStoreState>((set, get) => ({
  tokens: TonTokens,
  getToken: (symbol: string) => get().tokens[symbol],
  setReceiverAddress: (symbol: string, address: string) =>
    set(state => ({
      tokens: {
        ...state.tokens,
        [symbol]: {
          ...state.tokens[symbol],
          reciverAddress: address,
        },
      },
    })),
}));
