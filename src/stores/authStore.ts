import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any; 
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));