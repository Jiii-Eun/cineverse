import { Platform, Pressable, View, type TextStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { Movie } from '@/types/movie';

interface MovieCardHoverContentProps {
  movie: Movie;
  genreNames: string | null;
  compact?: boolean;
  onReadMore: () => void;
}

function formatDate(date: string) {
  if (!date) return '개봉일 미정';
  return date.replace(/-/g, '.');
}

export function MovieCardHoverContent({
  movie,
  genreNames,
  compact = false,
  onReadMore,
}: MovieCardHoverContentProps) {
  const overview = movie.overview?.trim() ?? '';
  const maxLines = compact ? 2 : 3;
  const clampClass = compact
    ? 'movie-card-overview-clamp-2'
    : 'movie-card-overview-clamp-3';

  const showOverviewText = overview.length > (compact ? 28 : 42);

  const titleClass = compact
    ? 'text-center text-[11px] font-semibold leading-4 text-white'
    : 'text-center text-sm font-semibold leading-5 text-white';
  const metaClass = compact
    ? 'text-center text-[10px] leading-4 text-white/90'
    : 'text-center text-xs leading-4 text-white/90';
  const overviewClass = compact
    ? 'w-full text-center text-[10px] leading-4 text-white/90'
    : 'w-full text-center text-xs leading-4 text-white/90';
  const readMoreClass = compact
    ? 'text-center text-[10px] leading-4 font-semibold text-primary'
    : 'text-center text-xs leading-4 font-semibold text-primary';

  const webClampStyle: TextStyle | undefined =
    Platform.OS === 'web'
      ? ({
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: maxLines,
          overflow: 'hidden',
          maxHeight: compact ? 32 : 48,
        } as unknown as TextStyle)
      : undefined;

  const containerGap = compact ? 6 : 8;

  return (
    <View
      className={`w-full items-center justify-center ${
        compact ? 'px-2' : 'px-3'
      }`}
      style={{ gap: containerGap }}
    >
      <Text className={titleClass} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text className={metaClass} numberOfLines={1}>
        {formatDate(movie.release_date)}
      </Text>
      {genreNames ? (
        <Text className={metaClass} numberOfLines={1}>
          {genreNames}
        </Text>
      ) : null}

      <View className="w-full items-center" style={{ gap: compact ? 4 : 6 }}>
        {showOverviewText ? (
          <Text
            className={`${overviewClass} ${clampClass}`}
            style={webClampStyle}
            numberOfLines={maxLines}
            ellipsizeMode="tail"
          >
            {overview}
          </Text>
        ) : null}

        <Pressable
          onPress={onReadMore}
          accessibilityRole="link"
          accessibilityLabel={`${movie.title} 상세 보기`}
          className="movie-card-read-more min-h-[24px] justify-center px-2"
        >
          <Text className={readMoreClass} style={{ color: '#8B5CF6' }}>
            더 보기
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
