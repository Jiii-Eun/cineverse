import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { getSignupUrl } from '@/services/tmdb/auth';
import { useAuthStore, useIsLoggedIn } from '@/stores/authStore';
import {
  AUTH_RETURN_TOAST,
  SIGNUP_RETURN_TOAST,
  useToastStore,
} from '@/stores/toastStore';

export function HeaderAuthActions() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const isLoading = useAuthStore((s) => s.isLoading);
  const showToast = useToastStore((s) => s.show);

  const handleLoginPress = () => {
    showToast(AUTH_RETURN_TOAST);
    router.push('/login');
  };

  const handleSignupPress = () => {
    showToast(SIGNUP_RETURN_TOAST);
    void Linking.openURL(getSignupUrl());
  };

  if (isLoggedIn) {
    return (
      <Pressable
        onPress={() => router.push('/profile')}
        className="h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/80 bg-transparent"
        accessibilityRole="button"
        accessibilityLabel="프로필"
      >
        <View className="h-full w-full items-center justify-center">
          <Ionicons name="person-outline" size={22} color="#FFFFFF" />
        </View>
      </Pressable>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      <Button
        label="로그인"
        size="compact"
        onPress={handleLoginPress}
        disabled={isLoading}
      />
      <Button
        label="회원가입"
        variant="outline"
        size="compact"
        onPress={handleSignupPress}
        disabled={isLoading}
      />
    </View>
  );
}
