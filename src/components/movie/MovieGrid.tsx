import { FlatList, useWindowDimensions, View } from 'react-native';

import { MovieCard } from '@/components/movie/MovieCard';
import type { Movie } from '@/types/movie';

interface MovieGridProps {
  movies: Movie[];
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
}

function getNumColumns(width: number) {
  if (width >= 1024) return 5;
  if (width >= 768) return 4;
  if (width >= 480) return 3;
  return 2;
}

export function MovieGrid({
  movies,
  onEndReached,
  isFetchingNextPage,
}: MovieGridProps) {
  const { width } = useWindowDimensions();
  const numColumns = getNumColumns(width);

  return (
    <FlatList
      key={numColumns}
      data={movies}
      keyExtractor={(item) => String(item.id)}
      numColumns={numColumns}
      contentContainerClassName="gap-4 p-4 md:px-8"
      columnWrapperClassName="gap-4"
      renderItem={({ item }) => (
        <View className="flex-1">
          <MovieCard movie={item} />
        </View>
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <View className="h-6" />
          </View>
        ) : null
      }
    />
  );
}
