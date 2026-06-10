import { useMemo, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ExploreFilters } from '@/components/explore/ExploreFilters';
import { AppHeader } from '@/components/layout/AppHeader';
import { Screen } from '@/components/layout/Screen';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { MovieListItem } from '@/components/movie/MovieListItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Text } from '@/components/ui/Text';
import type { ExploreFilterTab } from '@/constants/exploreFilters';
import { useDiscoverMovies } from '@/hooks/useDiscoverMovies';
import { useGenres } from '@/hooks/useGenres';
import { useSearchMovies } from '@/hooks/useSearchMovies';
import { useUiStore } from '@/stores/uiStore';
import { filterMoviesByExploreFilters } from '@/utils/filterMovies';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [activeTab, setActiveTab] = useState<ExploreFilterTab>('전체');
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedRatingMin, setSelectedRatingMin] = useState<number | null>(null);

  useGenres();
  const genres = useUiStore((s) => s.genres);

  const exploreFilters = useMemo(
    () => ({
      genreId: selectedGenreId,
      year: selectedYear,
      ratingMin: selectedRatingMin,
    }),
    [selectedGenreId, selectedYear, selectedRatingMin],
  );

  const { data: searchData, isLoading: searchLoading, isError: searchError, error, refetch } =
    useSearchMovies(submitted, submitted.length > 0);

  const {
    data: discoverData,
    isLoading: discoverLoading,
    isError: discoverError,
    error: discoverQueryError,
    refetch: refetchDiscover,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscoverMovies(exploreFilters);

  const discoverMovies =
    discoverData?.pages.flatMap((page) => page.results) ?? [];
  const filteredSearchResults = useMemo(
    () => filterMoviesByExploreFilters(searchData?.results ?? [], exploreFilters),
    [exploreFilters, searchData?.results],
  );
  const hasActiveFilters =
    selectedGenreId !== null ||
    selectedYear !== null ||
    selectedRatingMin !== null;
  const isSearchMode = submitted.length > 0;

  const clearAllFilters = () => {
    setSelectedGenreId(null);
    setSelectedYear(null);
    setSelectedRatingMin(null);
  };

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={400}
        onScroll={({ nativeEvent }) => {
          if (isSearchMode) return;

          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isNearBottom =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 240;

          if (isNearBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      >
        <AppHeader title="탐색" subtitle="장르와 키워드로 영화를 찾아보세요" />

        <View className="flex-row items-center gap-2 px-4 py-3 md:px-8">
          <View className="flex-1 flex-row items-center rounded-button bg-elevated px-4">
            <Ionicons name="search" size={18} color="#6B7280" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => setSubmitted(query.trim())}
              placeholder="영화 검색..."
              placeholderTextColor="#6B7280"
              returnKeyType="search"
              className="search-input min-h-[44px] flex-1 px-3 text-base text-foreground outline-none focus:outline-none"
            />
          </View>
          {query.length > 0 ? (
            <Text
              className="text-sm text-primary"
              onPress={() => {
                setQuery('');
                setSubmitted('');
              }}
            >
              취소
            </Text>
          ) : null}
        </View>

        <ExploreFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          filters={exploreFilters}
          genres={genres}
          onGenreChange={setSelectedGenreId}
          onYearChange={setSelectedYear}
          onRatingChange={setSelectedRatingMin}
          onClearAll={clearAllFilters}
        />

        {isSearchMode ? (
          <>
            {searchLoading ? <LoadingState message="검색 중..." /> : null}
            {searchError ? (
              <ErrorState
                message={error instanceof Error ? error.message : undefined}
                onRetry={() => refetch()}
              />
            ) : null}
            {!searchLoading && searchData?.results.length === 0 ? (
              <EmptyState message={`'${submitted}' 검색 결과가 없습니다.`} />
            ) : null}
            {!searchLoading &&
            searchData &&
            searchData.results.length > 0 &&
            filteredSearchResults.length === 0 ? (
              <EmptyState
                message={`'${submitted}' 검색 결과 중 필터에 맞는 영화가 없습니다.`}
              />
            ) : null}
            {filteredSearchResults.length > 0 ? (
              <View className="px-4 pb-8 pt-2 md:px-8">
                <Text variant="subtitle" className="mb-3">
                  {hasActiveFilters ? '필터 적용 검색 결과' : '검색 결과'}
                </Text>
                {filteredSearchResults.map((movie) => (
                  <MovieListItem key={movie.id} movie={movie} />
                ))}
              </View>
            ) : null}
          </>
        ) : (
          <>
            {discoverLoading ? <LoadingState message="영화를 불러오는 중..." /> : null}
            {discoverError ? (
              <ErrorState
                message={
                  discoverQueryError instanceof Error
                    ? discoverQueryError.message
                    : undefined
                }
                onRetry={() => refetchDiscover()}
              />
            ) : null}

            {!discoverLoading && !discoverError ? (
              discoverMovies.length === 0 ? (
                <EmptyState
                  message={
                    hasActiveFilters
                      ? '선택한 필터에 맞는 영화가 없습니다.'
                      : '표시할 영화가 없습니다.'
                  }
                />
              ) : (
                <View className="px-0 pb-8 pt-2">
                  <Text variant="subtitle" className="mb-3 px-4 md:px-8">
                    {hasActiveFilters ? '필터 결과' : '인기 영화'}
                  </Text>
                  <MovieGrid
                    movies={discoverMovies}
                    isFetchingNextPage={isFetchingNextPage}
                    embedded
                  />
                </View>
              )
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
