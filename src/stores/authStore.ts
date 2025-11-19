import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any; 
  setToken: (token: string) => void;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
}));
