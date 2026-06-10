import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { MovieCastSection } from '@/components/movie/MovieCastSection';
import { MovieImagesSection } from '@/components/movie/MovieImagesSection';
import { MovieReviewsSection } from '@/components/movie/MovieReviewsSection';
import { MovieVideosSection } from '@/components/movie/MovieVideosSection';
import { FolderAddButton } from '@/components/movie/FolderAddButton';
import { RatingBadge } from '@/components/movie/RatingBadge';
import { UserRatingPicker } from '@/components/movie/UserRatingPicker';
import { WatchlistHeart } from '@/components/movie/WatchlistHeart';
import { Screen } from '@/components/layout/Screen';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Text } from '@/components/ui/Text';
import { useMovieDetail } from '@/hooks/useMovieDetail';
import { useMovieAccountStates } from '@/hooks/useMovieRating';
import {
  fetchMovieCredits,
  fetchMovieImages,
  fetchMovieKeywords,
  fetchMovieReviews,
  fetchMovieVideos,
} from '@/services/tmdb/movies';
import { getBackdropUrl, getPosterUrl } from '@/services/tmdb/client';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const { data: movie, isLoading, isError, error, refetch } = useMovieDetail(movieId);

  useMovieAccountStates(movieId);

  const { data: keywords } = useQuery({
    queryKey: ['movie', movieId, 'keywords'],
    queryFn: () => fetchMovieKeywords(movieId),
    enabled: movieId > 0,
  });

  const { data: credits } = useQuery({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: () => fetchMovieCredits(movieId),
    enabled: movieId > 0,
  });

  const { data: reviews } = useQuery({
    queryKey: ['movie', movieId, 'reviews'],
    queryFn: () => fetchMovieReviews(movieId),
    enabled: movieId > 0,
  });

  const { data: videos } = useQuery({
    queryKey: ['movie', movieId, 'videos'],
    queryFn: () => fetchMovieVideos(movieId),
    enabled: movieId > 0,
  });

  const { data: images } = useQuery({
    queryKey: ['movie', movieId, 'images'],
    queryFn: () => fetchMovieImages(movieId),
    enabled: movieId > 0,
  });

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

  const backdropUri =
    getBackdropUrl(movie.backdrop_path, 'w1280') ??
    getPosterUrl(movie.poster_path, 'w780');
  const releaseDate = movie.release_date
    ? movie.release_date.replace(/-/g, '.')
    : '미정';
  const genreText =
    movie.genres.length > 0
      ? movie.genres.map((genre) => genre.name).join(', ')
      : '정보 없음';

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="relative h-80 md:h-[26rem]">
          {backdropUri ? (
            <Image
              source={{ uri: backdropUri }}
              className="h-full w-full"
              contentFit="cover"
            />
          ) : (
            <View className="h-full w-full bg-elevated" />
          )}
          <LinearGradient
            colors={[
              'rgba(13,13,18,0)',
              'rgba(13,13,18,0.55)',
              'rgba(13,13,18,0.92)',
              '#0D0D12',
            ]}
            locations={[0, 0.32, 0.68, 1]}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: 72,
              paddingBottom: 20,
              zIndex: 1,
            }}
          >
            <View className="px-4 md:px-8">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-2">
                  <Text variant="title">{movie.title}</Text>
                  <Text variant="body" className="text-muted">
                    개봉일: {releaseDate}
                  </Text>
                  <Text variant="body" className="text-muted">
                    상영시간: {movie.runtime ? `${movie.runtime}분` : '정보 없음'}
                  </Text>
                  <Text variant="body" className="text-muted">
                    장르: {genreText}
                  </Text>
                </View>
                <RatingBadge rating={movie.vote_average} dark />
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="gap-6 px-4 md:px-8">
          <View className="flex-row items-end justify-center gap-6 py-2">
            <View className="items-center gap-1">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-elevated">
                <WatchlistHeart movieId={movie.id} inline />
              </View>
              <Text variant="caption">찜</Text>
            </View>
            <FolderAddButton movieId={movie.id} inline />
            <UserRatingPicker movieId={movie.id} inline />
          </View>

          <View>
            <Text variant="subtitle" className="mb-2">
              줄거리
            </Text>
            <Text variant="body" className="leading-6 text-muted">
              {movie.overview || '줄거리 정보가 없습니다.'}
            </Text>
          </View>

          {credits?.cast.length ? (
            <MovieCastSection cast={credits.cast} />
          ) : null}

          {videos?.results.length ? (
            <MovieVideosSection videos={videos.results} />
          ) : null}

          {images ? (
            <MovieImagesSection
              backdrops={images.backdrops}
              posters={images.posters}
            />
          ) : null}

          {reviews?.results.length ? (
            <MovieReviewsSection reviews={reviews.results} />
          ) : null}

          {keywords?.keywords.length ? (
            <View>
              <Text variant="subtitle" className="mb-2">
                키워드
              </Text>
              <Text variant="caption">
                {keywords.keywords.map((keyword) => keyword.name).join(', ')}
              </Text>
            </View>
          ) : null}

          {credits?.crew.length ? (
            <View className="gap-2">
              <Text variant="subtitle">제작</Text>
              {credits.crew
                .filter((person) =>
                  ['Director', 'Screenplay', 'Writer', 'Producer'].includes(person.job),
                )
                .slice(0, 6)
                .map((person) => (
                  <Text key={`${person.id}-${person.job}`} variant="caption">
                    {person.name} · {person.job}
                  </Text>
                ))}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
