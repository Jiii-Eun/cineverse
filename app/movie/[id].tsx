import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { PosterImage } from '@/components/movie/PosterImage';
import { RatingBadge } from '@/components/movie/RatingBadge';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Text } from '@/components/ui/Text';
import { useMovieDetail } from '@/hooks/useMovieDetail';
import { useUiStore } from '@/stores/uiStore';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const { data: movie, isLoading, isError, error, refetch } = useMovieDetail(movieId);
  const favorites = useUiStore((state) => state.favorites);
  const toggleFavorite = useUiStore((state) => state.toggleFavorite);
  const isFavorite = favorites.includes(movieId);

  if (isLoading) {
    return (
      <Screen>
        <LoadingState message="영화 정보를 불러오는 중..." />
      </Screen>
    );
  }

  if (isError || !movie) {
    return (
      <Screen>
        <ErrorState
          message={error instanceof Error ? error.message : undefined}
          onRetry={() => refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        <View className="gap-6 p-4 md:flex-row md:px-8">
          <PosterImage
            posterPath={movie.poster_path}
            title={movie.title}
            size="w500"
            className="aspect-[2/3] w-full rounded-card md:w-64"
          />
          <View className="flex-1 gap-4">
            <Text variant="title">{movie.title}</Text>
            <RatingBadge rating={movie.vote_average} />
            <Text variant="caption">
              개봉일 {movie.release_date.replace(/-/g, '.')}
            </Text>
            {movie.runtime ? (
              <Text variant="caption">상영 시간 {movie.runtime}분</Text>
            ) : null}
            {movie.genres.length > 0 ? (
              <Text variant="caption">
                장르 {movie.genres.map((g) => g.name).join(', ')}
              </Text>
            ) : null}
            <Button
              label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              variant={isFavorite ? 'outline' : 'primary'}
              onPress={() => toggleFavorite(movie.id)}
            />
          </View>
        </View>
        <View className="px-4 md:px-8">
          <Text variant="subtitle" className="mb-2">
            줄거리
          </Text>
          <Text variant="body" className="leading-6 text-muted">
            {movie.overview || '줄거리 정보가 없습니다.'}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
