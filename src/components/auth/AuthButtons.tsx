import * as Linking from 'expo-linking';
import { View } from 'react-native';

import { useTmdbLogin } from '@/hooks/useTmdbLogin';
import { getSignupUrl } from '@/services/tmdb/auth';
import { useAuthStore, useIsLoggedIn } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

export function AuthButtons() {
  const isLoggedIn = useIsLoggedIn();
  const account = useAuthStore((s) => s.account);
  const isLoading = useAuthStore((s) => s.isLoading);
  const startLogin = useTmdbLogin();
  const logout = useAuthStore((s) => s.logout);

  if (isLoggedIn && account) {
    return (
      <View className="flex-row items-center gap-3">
        <Text variant="caption">안녕하세요, {account.username}님</Text>
        <Button
          label="로그아웃"
          variant="outline"
          size="compact"
          onPress={() => logout()}
          disabled={isLoading}
        />
      </View>
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
      />
    </View>
  );
}
