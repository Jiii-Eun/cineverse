import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  createRequestToken,
  createSession,
  deleteSession,
  fetchAccount,
  openTmdbAuth,
} from '@/services/tmdb/auth';
import type { Account } from '@/types/movie';

interface AuthState {
  sessionId: string | null;
  account: Account | null;
  pendingRequestToken: string | null;
  isLoading: boolean;
  error: string | null;
  startLogin: () => Promise<void>;
  completeLogin: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      account: null,
      pendingRequestToken: null,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      startLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const { request_token } = await createRequestToken();
          set({ pendingRequestToken: request_token });
          await openTmdbAuth(request_token);
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : '로그인을 시작할 수 없습니다.',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      completeLogin: async () => {
        const { pendingRequestToken } = get();
        if (!pendingRequestToken) return;

        set({ isLoading: true, error: null });
        try {
          const { session_id } = await createSession(pendingRequestToken);
          const account = await fetchAccount(session_id);
          set({
            sessionId: session_id,
            account,
            pendingRequestToken: null,
          });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : '로그인에 실패했습니다.',
            pendingRequestToken: null,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const { sessionId } = get();
        set({ isLoading: true, error: null });
        try {
          if (sessionId) {
            await deleteSession(sessionId);
          }
          set({ sessionId: null, account: null, pendingRequestToken: null });
        } catch (e) {
          set({
            error: e instanceof Error ? e.message : '로그아웃에 실패했습니다.',
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cineverse-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        account: state.account,
      }),
    },
  ),
);

export function useIsLoggedIn() {
  return useAuthStore((s) => Boolean(s.sessionId && s.account));
}
