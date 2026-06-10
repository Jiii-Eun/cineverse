import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useTmdbLogin } from '@/hooks/useTmdbLogin';
import { getSignupUrl } from '@/services/tmdb/auth';
import { useAuthStore, useIsLoggedIn } from '@/stores/authStore';

export function HeaderAuthActions() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const isLoading = useAuthStore((s) => s.isLoading);
  const startLogin = useTmdbLogin();

  if (isLoggedIn) {
    return (
      <Pressable
        onPress={() => router.push('/profile')}
        className="min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full bg-primary"
        accessibilityRole="button"
        accessibilityLabel="프로필"
      >
        <Ionicons name="person-outline" size={22} color="#FFFFFF" />
      </Pressable>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      <Button
        label="로그인"
        size="compact"
        onPress={() => startLogin()}
        disabled={isLoading}
      />
      <Button
        label="회원가입"
        variant="outline"
        size="compact"
        onPress={() => Linking.openURL(getSignupUrl())}
        disabled={isLoading}
      />
    </View>
  );
}
