import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useRatedMovies } from '@/hooks/useRatedMovies';
import { useIsLoggedIn } from '@/stores/authStore';

export default function RatedMoviesScreen() {
  const isLoggedIn = useIsLoggedIn();
  const { data, isLoading, isError, error, refetch } = useRatedMovies();

  if (!isLoggedIn) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <EmptyState message="로그인하면 리뷰한 영화를 확인할 수 있습니다." />
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
        <EmptyState message="아직 별점을 남긴 영화가 없습니다." />
      ) : null}
      {data && data.results.length > 0 ? (
        <View className="min-h-0 flex-1">
          <MovieGrid movies={data.results} withTabBarPadding={false} />
        </View>
      ) : null}
    </Screen>
  );
}
