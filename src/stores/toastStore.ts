import { create } from 'zustand';

interface ToastState {
  message: string | null;
  visible: boolean;
  show: (message: string) => void;
  hide: () => void;
}

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const LOGIN_REQUIRED_TOAST = '로그인 후 이용가능합니다';

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  visible: false,
  show: (message) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message, visible: true });
    hideTimer = setTimeout(() => {
      set({ visible: false, message: null });
    }, 2500);
  },
  hide: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ visible: false, message: null });
  },
}));

export function showLoginRequiredToast() {
  useToastStore.getState().show(LOGIN_REQUIRED_TOAST);
}
