import { FlatList, Platform, useWindowDimensions, View } from 'react-native';

import { MovieCard } from '@/components/movie/MovieCard';
import { TABLET_BREAKPOINT } from '@/constants/layout';
import { useContentBottomPadding } from '@/hooks/useContentBottomPadding';
import type { Movie } from '@/types/movie';

interface MovieGridProps {
  movies: Movie[];
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
  ListHeaderComponent?: React.ReactElement | null;
  embedded?: boolean;
  withTabBarPadding?: boolean;
}

const GRID_GAP = 12;

function getNumColumns(width: number) {
  if (width >= TABLET_BREAKPOINT) return 4;
  return 2;
}

function useGridMetrics(width: number, horizontalPadding: number, numColumns: number) {
  const itemWidth =
    (width - horizontalPadding * 2 - GRID_GAP * (numColumns - 1)) / numColumns;
  return { itemWidth, numColumns };
}

function WebGrid({
  movies,
  horizontalPadding,
}: {
  movies: Movie[];
  horizontalPadding: number;
}) {
  return (
    <View className="movie-grid" style={{ paddingHorizontal: horizontalPadding }}>
      {movies.map((movie) => (
        <View key={movie.id} style={{ alignSelf: 'flex-start', minWidth: 0 }}>
          <MovieCard movie={movie} />
        </View>
      ))}
    </View>
  );
}

function NativeGrid({
  movies,
  itemWidth,
  numColumns,
  horizontalPadding,
}: {
  movies: Movie[];
  itemWidth: number;
  numColumns: number;
  horizontalPadding: number;
}) {
  return (
    <View
      className="flex-row flex-wrap"
      style={{ gap: GRID_GAP, paddingHorizontal: horizontalPadding }}
    >
      {movies.map((movie) => (
        <View key={movie.id} style={{ width: itemWidth }}>
          <MovieCard movie={movie} />
        </View>
      ))}
    </View>
  );
}

export function MovieGrid({
  movies,
  onEndReached,
  isFetchingNextPage,
  ListHeaderComponent,
  embedded = false,
  withTabBarPadding = true,
}: MovieGridProps) {
  const { width } = useWindowDimensions();
  const numColumns = getNumColumns(width);
  const contentBottomPadding = useContentBottomPadding(withTabBarPadding);
  const bottomPadding = embedded ? 24 : contentBottomPadding;
  const horizontalPadding = embedded ? 4 : 16;
  const { itemWidth } = useGridMetrics(width, horizontalPadding, numColumns);

  const gridContent =
    Platform.OS === 'web' ? (
      <WebGrid movies={movies} horizontalPadding={horizontalPadding} />
    ) : (
      <NativeGrid
        movies={movies}
        itemWidth={itemWidth}
        numColumns={numColumns}
        horizontalPadding={horizontalPadding}
      />
    );

  const footer = isFetchingNextPage ? (
    <View className="py-4">
      <View className="h-6" />
    </View>
  ) : null;

  if (embedded) {
    return (
      <View className="web:overflow-visible">
        {ListHeaderComponent}
        {gridContent}
        {footer}
      </View>
    );
  }

  return (
    <FlatList
      data={[{ key: 'grid' }]}
      keyExtractor={(item) => item.key}
      key={numColumns}
      scrollEnabled
      showsVerticalScrollIndicator={false}
      className="web:overflow-visible"
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={{ paddingBottom: bottomPadding, paddingTop: 4 }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      renderItem={() => gridContent}
      ListFooterComponent={footer}
    />
  );
}
