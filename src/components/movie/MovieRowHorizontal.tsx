import { Platform, ScrollView, View } from 'react-native';

import { MovieCardCompact } from '@/components/movie/MovieCardCompact';
import { Text } from '@/components/ui/Text';
import { horizontalTouchScrollStyle } from '@/constants/scroll';
import { useDragScroll } from '@/hooks/useDragScroll';
import type { Movie } from '@/types/movie';

interface MovieRowHorizontalProps {
  title: string;
  movies: Movie[];
}

export function MovieRowHorizontal({ title, movies }: MovieRowHorizontalProps) {
  const { scrollRef, onScroll, webDragProps } = useDragScroll();

  if (movies.length === 0) return null;

  return (
    <View className="mb-6">
      <Text variant="subtitle" className="mb-3 px-4 md:px-8">
        {title}
      </Text>
      <View className="mx-4 overflow-hidden md:mx-8">
        <View
          className="movie-row-scroll-host w-full max-w-full overflow-hidden web:select-none web:cursor-grab web:active:cursor-grabbing"
          {...(Platform.OS === 'web' ? webDragProps : {})}
        >
          <ScrollView
            ref={scrollRef}
            horizontal
            nestedScrollEnabled
            directionalLockEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            className="movie-row-scroll w-full max-w-full"
            style={horizontalTouchScrollStyle}
            contentContainerClassName="gap-2 py-2"
          >
            {movies.map((movie) => (
              <MovieCardCompact key={movie.id} movie={movie} />
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
