import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/layout/Screen';
import { GradientButton } from '@/components/ui/GradientButton';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAuthStore, useIsLoggedIn } from '@/stores/authStore';
import { useWatchlist } from '@/hooks/useWatchlist';

export default function ProfileScreen() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const account = useAuthStore((s) => s.account);
  const logout = useAuthStore((s) => s.logout);
  const { data: watchlist } = useWatchlist();

  if (!isLoggedIn) {
    return (
      <Screen className="justify-center px-6">
        <View className="items-center gap-4 rounded-card bg-card p-8">
          <Text variant="title">프로필</Text>
          <Text variant="caption" className="text-center">
            로그인하면 찜 목록과 활동 정보를 확인할 수 있습니다.
          </Text>
          <GradientButton
            label="로그인"
            onPress={() => router.push('/login')}
            className="w-full"
          />
        </View>
      </Screen>
    );
  }

  const watchedCount = watchlist?.results.length ?? 0;

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 p-4 pb-8 md:px-8"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="overflow-hidden rounded-card"
        >
          <View className="p-6">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Text className="text-2xl font-bold text-foreground">
                {account?.username?.[0]?.toUpperCase() ?? 'U'}
              </Text>
            </View>
            <Text variant="title">{account?.username}</Text>
            <Text variant="caption" className="mt-1 text-white/70">
              {account?.name || 'TMDB 회원'}
            </Text>
          </View>
        </LinearGradient>

        <View className="flex-row gap-3">
          {[
            { label: '찜한 영화', value: String(watchedCount) },
            { label: '평균 평점', value: '—' },
            { label: '목록', value: '—' },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 items-center rounded-card bg-card p-4"
            >
              <Text className="text-xl font-bold text-primary">{stat.value}</Text>
              <Text variant="caption" className="mt-1 text-center">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <View className="rounded-card bg-card p-4">
          <Text variant="subtitle" className="mb-3">
            선호 장르
          </Text>
          <Text variant="caption">
            시청 기록이 쌓이면 장르 분포가 표시됩니다.
          </Text>
        </View>

        <Button label="로그아웃" variant="outline" onPress={() => logout()} />
      </ScrollView>
    </Screen>
  );
}
