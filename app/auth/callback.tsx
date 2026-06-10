import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { Text } from '@/components/ui/Text';
import { requiresManualAuthCallback } from '@/services/tmdb/auth';
import { useAuthStore } from '@/stores/authStore';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const completeLogin = useAuthStore((s) => s.completeLogin);
  const clearError = useAuthStore((s) => s.clearError);
  const error = useAuthStore((s) => s.error);
  const isLoading = useAuthStore((s) => s.isLoading);
  const sessionId = useAuthStore((s) => s.sessionId);
  const pendingRequestToken = useAuthStore((s) => s.pendingRequestToken);
  const manualReturn = requiresManualAuthCallback();
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    return useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (sessionId) {
      router.replace('/');
      return;
    }

    if (!pendingRequestToken && !error) {
      router.replace('/');
    }
  }, [hydrated, sessionId, pendingRequestToken, error, router]);

  useEffect(() => {
    if (!hydrated || !pendingRequestToken) return;
    if (sessionId || manualReturn) return;

    void completeLogin();
  }, [
    hydrated,
    completeLogin,
    manualReturn,
    sessionId,
    pendingRequestToken,
  ]);

  useEffect(() => {
    if (sessionId && !isLoading) {
      router.replace('/');
    }
  }, [sessionId, isLoading, router]);

  const goHome = () => {
    clearError();
    router.replace('/');
  };

  if (!hydrated || sessionId || (!pendingRequestToken && !error)) {
    return (
      <Screen>
        <LoadingState message="이동 중..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-1 justify-center gap-4 px-6">
        {isLoading ? <LoadingState message="로그인 처리 중..." /> : null}

        {!isLoading && manualReturn && !sessionId && pendingRequestToken ? (
          <View className="gap-4 rounded-card bg-card p-6">
            <Text variant="title">TMDB 로그인 승인</Text>
            <Text variant="body" className="text-muted">
              새 탭에서 TMDB 로그인을 승인한 뒤, 이 화면으로 돌아와 아래 버튼을
              눌러주세요.
            </Text>
            <Button label="로그인 완료" onPress={() => completeLogin()} />
          </View>
        ) : null}

        {!isLoading && error ? (
          <View className="items-center gap-4 rounded-card bg-card p-6">
            <Text variant="subtitle">오류가 발생했습니다</Text>
            <Text variant="caption" className="text-center text-muted">
              다시 시도해주세요.
            </Text>
            <Button label="홈으로" onPress={goHome} className="min-w-[140px]" />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
