import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  rememberedEmail: string | null;
  setAuth: (user: User, token: string, refreshToken: string, rememberEmail?: string) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
  setRememberedEmail: (email: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      rememberedEmail: null,
      setAuth: (user, token, refreshToken, rememberEmail) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          rememberedEmail: rememberEmail || null,
        }),
      clearAuth: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      setRememberedEmail: (email) =>
        set({
          rememberedEmail: email,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
