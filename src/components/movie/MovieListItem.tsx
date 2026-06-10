import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { PosterImage } from '@/components/movie/PosterImage';
import { RatingBadge } from '@/components/movie/RatingBadge';
import { Text } from '@/components/ui/Text';
import { useGenreName } from '@/stores/uiStore';
import type { Movie } from '@/types/movie';

interface MovieListItemProps {
  movie: Movie;
}

export function MovieListItem({ movie }: MovieListItemProps) {
  const router = useRouter();
  const genreNames = useGenreName(movie.genre_ids);
  const year = movie.release_date?.slice(0, 4) ?? '';

  return (
    <Pressable
      onPress={() => router.push(`/movie/${movie.id}`)}
      className="min-h-[44px] flex-row gap-3 border-b border-white/5 py-3 web:hover:bg-elevated/50"
    >
      <View className="w-[60px] overflow-hidden rounded-lg" style={{ aspectRatio: 2 / 3 }}>
        <PosterImage
          posterPath={movie.poster_path}
          title={movie.title}
          className="h-full w-full"
        />
      </View>
      <View className="flex-1 justify-center gap-1">
        <Text variant="body" numberOfLines={1} className="font-semibold">
          {movie.title}
        </Text>
        <View className="flex-row flex-wrap items-center gap-2">
          {year ? <Text variant="caption">{year}</Text> : null}
          {movie.runtime ? (
            <Text variant="caption">{movie.runtime}분</Text>
          ) : null}
          <RatingBadge rating={movie.vote_average} compact />
        </View>
        {genreNames ? (
          <Text variant="caption" numberOfLines={1}>
            {genreNames}
          </Text>
        ) : null}
      </View>
      <View className="items-center justify-center">
        <Ionicons name="chevron-forward" size={18} color="#6B7280" />
      </View>
    </Pressable>
  );
}
