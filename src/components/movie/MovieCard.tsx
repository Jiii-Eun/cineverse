import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { PosterImage } from '@/components/movie/PosterImage';
import { RatingBadge } from '@/components/movie/RatingBadge';
import { Text } from '@/components/ui/Text';
import type { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
}

function formatDate(date: string) {
  if (!date) return '개봉일 미정';
  return date.replace(/-/g, '.');
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${movie.title} 상세 보기`}
        className="min-h-[44px] flex-1"
      >
        <View className="overflow-hidden rounded-card bg-surface shadow-sm">
          <PosterImage
            posterPath={movie.poster_path}
            title={movie.title}
            className="aspect-[2/3] w-full"
          />
          <View className="gap-2 p-3">
            <Text variant="subtitle" numberOfLines={2} className="text-base">
              {movie.title}
            </Text>
            <RatingBadge rating={movie.vote_average} />
            <Text variant="caption">{formatDate(movie.release_date)}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
