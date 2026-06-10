import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useIsLoggedIn } from '@/stores/authStore';

export default function WatchlistScreen() {
  const isLoggedIn = useIsLoggedIn();
  const { data, isLoading, isError, error, refetch } = useWatchlist();

  if (!isLoggedIn) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <EmptyState message="TMDB 계정으로 로그인하면 찜목록을 확인할 수 있습니다." />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {isLoading ? <LoadingState /> : null}
      {isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      ) : null}
      {!isLoading && !isError && !data?.results.length ? (
        <EmptyState message="찜한 영화가 없습니다. 카드의 하트 아이콘을 눌러 추가하세요." />
      ) : null}
      {data && data.results.length > 0 ? (
        <View className="flex-1">
          <MovieGrid movies={data.results} withTabBarPadding={false} />
        </View>
      ) : null}
    </Screen>
  );
}
