import { useRouter } from 'expo-router';

import { requiresManualAuthCallback } from '@/services/tmdb/auth';
import { useAuthStore } from '@/stores/authStore';

export function useTmdbLogin() {
  const router = useRouter();
  const startLogin = useAuthStore((s) => s.startLogin);

  return async () => {
    await startLogin();

    if (requiresManualAuthCallback()) {
      router.push('/auth/callback');
    }
  };
}
