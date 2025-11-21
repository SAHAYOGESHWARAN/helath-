import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any; 
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
  setLoading: (isLoading: boolean) => void;
}

// Initialize state from storage to prevent flash of loading state
const storedToken = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('novopath-token') : null;
let storedUser = null;
try {
    const userStr = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('novopath-user') : null;
    if (userStr) storedUser = JSON.parse(userStr);
} catch (e) {
    console.error('Failed to parse stored user', e);
}

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser,
  isLoading: !!storedToken, // Only start loading if there is a token to verify
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));
