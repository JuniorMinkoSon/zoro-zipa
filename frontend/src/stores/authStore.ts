import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => {
    localStorage.setItem('zoro_token', `demo-token-${user.id}`);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('zoro_token');
    set({ user: null, isAuthenticated: false });
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
