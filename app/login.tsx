import * as Linking from "expo-linking";
import { View } from "react-native";

import { Screen } from "@/components/layout/Screen";
import { GradientButton } from "@/components/ui/GradientButton";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { getSignupUrl } from "@/services/tmdb/auth";
import { useTmdbLogin } from "@/hooks/useTmdbLogin";
import { useAuthStore } from "@/stores/authStore";

export default function LoginScreen() {
  const startLogin = useTmdbLogin();
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  return (
    <Screen className="justify-center px-6">
      <View className="gap-6 rounded-card bg-card p-6">
        <Text variant="title">로그인</Text>
        <Text variant="body" className="text-muted">
          TMDB 계정으로 로그인하면 찜목록, 커스텀 목록 등 계정 기능을 이용할 수
          있습니다.
        </Text>
        {error ? (
          <Text variant="caption" className="text-accent">
            {error}
          </Text>
        ) : null}
        <GradientButton
          label="TMDB로 로그인"
          onPress={() => startLogin()}
          disabled={isLoading}
        />
        <Button
          label="TMDB 회원가입"
          variant="outline"
          onPress={() => Linking.openURL(getSignupUrl())}
        />
      </View>
    </Screen>
  );
}
