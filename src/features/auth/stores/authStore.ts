import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { User } from '@/shared/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

/**
 * Store Zustand para gerenciar estado de autenticação
 * Persiste dados no localStorage
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,

        /**
         * Define o usuário atual
         */
        setUser: (user) =>
          set({
            user,
            isAuthenticated: !!user,
          }),

        /**
         * Define o token de autenticação
         */
        setToken: (token) =>
          set({
            token,
            isAuthenticated: !!token,
          }),

        /**
         * Realiza logout limpando os dados
         */
        logout: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: 'lcp-auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'AuthStore',
    }
  )
);
