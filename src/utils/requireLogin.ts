import { showLoginRequiredToast } from '@/stores/toastStore';
import { useAuthStore } from '@/stores/authStore';

export function isUserLoggedIn() {
  const { sessionId, account } = useAuthStore.getState();
  return Boolean(sessionId && account);
}

export function guardLogin(): boolean {
  if (isUserLoggedIn()) return true;
  showLoginRequiredToast();
  return false;
}
