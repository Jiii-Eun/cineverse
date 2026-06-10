import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { RatingBadge } from '@/components/movie/RatingBadge';
import { WatchlistHeart } from '@/components/movie/WatchlistHeart';
import { GradientButton } from '@/components/ui/GradientButton';
import { Text } from '@/components/ui/Text';
import { getBackdropUrl, getPosterUrl } from '@/services/tmdb/client';
import type { Movie } from '@/types/movie';

interface HeroSectionProps {
  movie: Movie;
  runtime?: number | null;
}

export function HeroSection({ movie, runtime }: HeroSectionProps) {
  const router = useRouter();
  const backdropUri =
    getBackdropUrl(movie.backdrop_path, 'w1280') ??
    getPosterUrl(movie.poster_path, 'w780');

  const year = movie.release_date?.slice(0, 4) ?? '';

  return (
    <View className="relative mx-4 mb-6 h-56 overflow-hidden rounded-card md:mx-8 md:h-72">
      {backdropUri ? (
        <Image
          source={{ uri: backdropUri }}
          className="absolute inset-0 h-full w-full"
          contentFit="cover"
        />
      ) : (
        <View className="absolute inset-0 bg-elevated" />
      )}
      <LinearGradient
        colors={['transparent', 'rgba(13,13,18,0.85)', '#0D0D12']}
        className="absolute inset-0"
      />

      <View className="absolute bottom-0 left-0 right-0 p-4">
        <Text variant="title" numberOfLines={2} className="text-xl md:text-2xl">
          {movie.title}
        </Text>
        <View className="mt-2 flex-row items-center gap-3">
          <RatingBadge rating={movie.vote_average} dark />
          {year ? <Text variant="caption">{year}</Text> : null}
          {runtime ? <Text variant="caption">{runtime}분</Text> : null}
        </View>
        <View className="mt-3 flex-row items-center gap-2">
          <GradientButton
            label="상세 보기"
            compact
            className="flex-1"
            icon={<Ionicons name="play" size={16} color="#FFF" />}
            onPress={() => router.push(`/movie/${movie.id}`)}
          />
          <Pressable
            onPress={() => router.push(`/movie/${movie.id}`)}
            className="min-h-[40px] min-w-[40px] items-center justify-center rounded-button bg-elevated"
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <View className="absolute right-3 top-3">
        <WatchlistHeart movieId={movie.id} />
      </View>
    </View>
  );
}
