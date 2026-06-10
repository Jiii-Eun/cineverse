import { useMemo } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/layout/Screen';
import { GradientButton } from '@/components/ui/GradientButton';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useAccountLists } from '@/hooks/useAccountLists';
import { useGenres } from '@/hooks/useGenres';
import {
  calculateAverageRating,
  useRatedMovies,
} from '@/hooks/useRatedMovies';
import { useAuthStore, useIsLoggedIn } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { useWatchlist } from '@/hooks/useWatchlist';
import { formatDisplayRating } from '@/utils/starRating';
import { calculateTopGenres } from '@/utils/genreStats';
import { PreferredGenresCard } from '@/components/profile/PreferredGenresCard';
import { ProfileStatCard } from '@/components/profile/ProfileStatCard';

export default function ProfileScreen() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const account = useAuthStore((s) => s.account);
  const logout = useAuthStore((s) => s.logout);
  const { data: watchlist } = useWatchlist();
  const { data: ratedMovies } = useRatedMovies();
  const { data: accountLists } = useAccountLists();
  useGenres();
  const genres = useUiStore((s) => s.genres);

  const watchedCount = watchlist?.results.length ?? 0;

  const averageRating = useMemo(() => {
    const ratings =
      ratedMovies?.results
        .map((movie) => movie.rating)
        .filter((rating) => rating > 0) ?? [];
    const average = calculateAverageRating(ratings);
    return average != null ? formatDisplayRating(average) : '—';
  }, [ratedMovies]);

  const folderCount = accountLists?.results.length ?? 0;

  const folderMovieCount = useMemo(
    () =>
      accountLists?.results.reduce(
        (total, list) => total + list.item_count,
        0,
      ) ?? 0,
    [accountLists],
  );

  const topGenres = useMemo(() => {
    const movies = [
      ...(watchlist?.results ?? []),
      ...(ratedMovies?.results ?? []),
    ];
    return calculateTopGenres(movies, 10);
  }, [watchlist, ratedMovies]);

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
          <ProfileStatCard
            label="찜한 영화"
            value={String(watchedCount)}
            href="/favorites/watchlist"
          />
          <ProfileStatCard
            label="평균 평점"
            value={averageRating}
            href="/favorites/rated"
          />
          <ProfileStatCard
            label="파일 / 보관한 영화"
            value={`${folderCount} / ${folderMovieCount}`}
            href="/favorites/lists"
          />
        </View>

        <PreferredGenresCard topGenres={topGenres} genres={genres} />

        <Button label="로그아웃" variant="outline" onPress={() => logout()} />
      </ScrollView>
    </Screen>
  );
}
