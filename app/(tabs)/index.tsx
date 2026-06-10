import { useMemo } from 'react';
import { View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { Screen } from '@/components/layout/Screen';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useNowPlayingInfinite } from '@/hooks/useNowPlayingInfinite';

export default function HomeScreen() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNowPlayingInfinite();

  const movies = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  );

  return (
    <Screen>
      <AppHeader
        title="시네마 라운지"
        subtitle="지금 상영 중인 영화를 만나보세요"
      />
      {isLoading ? <LoadingState message="상영작을 불러오는 중..." /> : null}
      {isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      ) : null}
      {!isLoading && !isError && movies.length === 0 ? <EmptyState /> : null}
      {!isLoading && !isError && movies.length > 0 ? (
        <View className="flex-1">
          <MovieGrid
            movies={movies}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            isFetchingNextPage={isFetchingNextPage}
          />
        </View>
      ) : null}
    </Screen>
  );
}
