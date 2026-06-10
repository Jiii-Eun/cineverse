import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { ContentLayout } from '@/components/layout/ContentLayout';
import { HomeHeader } from '@/components/layout/HomeHeader';
import { Screen } from '@/components/layout/Screen';
import { HeroSection } from '@/components/movie/HeroSection';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { MovieRowHorizontal } from '@/components/movie/MovieRowHorizontal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Text } from '@/components/ui/Text';
import { useGenres } from '@/hooks/useGenres';
import { useMoviesByFeed } from '@/hooks/useMoviesByFeed';
import { useMoviesInfinite } from '@/hooks/useMoviesInfinite';
import { useUiStore } from '@/stores/uiStore';

const ROW_LIMIT = 12;

export default function HomeScreen() {
  useGenres();
  const selectedFeed = useUiStore((s) => s.selectedFeed);
  const selectedGenreId = useUiStore((s) => s.selectedGenreId);

  const { data: trendingData } = useMoviesByFeed('trending');
  const { data: popularData } = useMoviesByFeed('popular');
  const { data: topRatedData } = useMoviesByFeed('top_rated');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMoviesInfinite({ feed: selectedFeed, genreId: selectedGenreId });

  const movies = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  );

  const heroMovie = movies[0];
  const moreMovies = movies.slice(1);

  const recommended = trendingData?.results.slice(0, ROW_LIMIT) ?? [];
  const popular = popularData?.results.slice(0, ROW_LIMIT) ?? [];
  const best = topRatedData?.results.slice(0, ROW_LIMIT) ?? [];

  const hasRows =
    recommended.length > 0 || popular.length > 0 || best.length > 0 || moreMovies.length > 0;

  return (
    <Screen>
      <HomeHeader />
      <ContentLayout>
        {isLoading ? <LoadingState message="영화를 불러오는 중..." /> : null}
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        ) : null}
        {!isLoading && !isError && !hasRows ? <EmptyState /> : null}
        {!isLoading && !isError && hasRows ? (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {heroMovie ? <HeroSection movie={heroMovie} /> : null}
            <MovieRowHorizontal title="추천 영화" movies={recommended} />
            <MovieRowHorizontal title="인기 영화" movies={popular} />
            <MovieRowHorizontal title="베스트 영화" movies={best} />
            {moreMovies.length > 0 ? (
              <View className="flex-1 px-4 pb-2 md:px-8">
                <Text variant="subtitle" className="mb-1">
                  더 보기
                </Text>
                <MovieGrid
                  movies={moreMovies}
                  onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                      fetchNextPage();
                    }
                  }}
                  isFetchingNextPage={isFetchingNextPage}
                  embedded
                />
              </View>
            ) : null}
          </ScrollView>
        ) : null}
      </ContentLayout>
    </Screen>
  );
}
