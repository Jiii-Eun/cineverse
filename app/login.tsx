import * as Linking from "expo-linking";
import { View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { GradientButton } from "@/components/ui/GradientButton";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { getSignupUrl } from "@/services/tmdb/auth";
import { useTmdbLogin } from "@/hooks/useTmdbLogin";
import { useAuthStore } from "@/stores/authStore";
import {
  AUTH_RETURN_TOAST,
  SIGNUP_RETURN_TOAST,
  useToastStore,
} from "@/stores/toastStore";

export default function LoginScreen() {
  const startLogin = useTmdbLogin();
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const showToast = useToastStore((s) => s.show);

  const handleLogin = () => {
    showToast(AUTH_RETURN_TOAST);
    void startLogin();
  };

  const handleSignup = () => {
    showToast(SIGNUP_RETURN_TOAST);
    void Linking.openURL(getSignupUrl());
  };

  return (
    <Screen className="justify-center px-6">
      <View className="gap-6 rounded-card bg-card p-6">
        <Text variant="title">로그인</Text>
        <Text variant="body" className="text-muted">
          TMDB 계정으로 로그인하면 찜목록, 커스텀 목록 등 계정 기능을 이용할 수
          있습니다.
        </Text>
        <Text variant="caption" className="text-muted">
          TMDB에서 로그인·승인 후 이 페이지로 돌아와 확인해주세요.
        </Text>
        {error ? (
          <Text variant="caption" className="text-accent">
            {error}
          </Text>
        ) : null}
        <GradientButton
          label="TMDB로 로그인"
          onPress={handleLogin}
          disabled={isLoading}
        />
        <Button
          label="TMDB 회원가입"
          variant="outline"
          onPress={handleSignup}
        />
      </View>
    </Screen>
  );
}
