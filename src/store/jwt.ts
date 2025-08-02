import { create } from "zustand";

interface JWTState {
  jwtToken: string | null;
  setJWTToken: (token: string | null) => void;
  getJWTToken: () => string | null;
  clearJWTToken: () => void;
}

export const useJWTStore = create<JWTState>((set, get) => ({
  jwtToken: null,
  setJWTToken: (token) => set({ jwtToken: token }),
  getJWTToken: () => get().jwtToken,
  clearJWTToken: () => set({ jwtToken: null }),
}));
