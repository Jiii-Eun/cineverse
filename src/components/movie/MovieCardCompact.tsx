import { useRouter } from 'expo-router';
import { Platform, Pressable, View } from 'react-native';

import { MovieCardHoverContent } from '@/components/movie/MovieCardHoverContent';
import { MovieCardMetaOverlay } from '@/components/movie/MovieCardMetaOverlay';
import { PosterFrame } from '@/components/movie/PosterFrame';
import { PosterImage } from '@/components/movie/PosterImage';
import { MovieCardRatingPin } from '@/components/movie/MovieCardRatingPin';
import { MovieCardTopActions } from '@/components/movie/MovieCardTopActions';
import { MOVIE_CARD_COMPACT_WIDTH } from '@/constants/layout';
import { useGenreName } from '@/stores/uiStore';
import type { Movie } from '@/types/movie';

interface MovieCardCompactProps {
  movie: Movie;
  width?: number;
}

export function MovieCardCompact({
  movie,
  width = MOVIE_CARD_COMPACT_WIDTH,
}: MovieCardCompactProps) {
  const router = useRouter();
  const genreNames = useGenreName(movie.genre_ids);
  const goToDetail = () => router.push(`/movie/${movie.id}`);

  return (
    <View
      style={{ width }}
      className="movie-card-root px-1 py-2 web:overflow-visible"
    >
      <View className="movie-card-surface overflow-hidden rounded-card bg-card web:origin-center web:hover:z-10 web:hover:scale-105">
        <PosterFrame>
          <PosterImage
            posterPath={movie.poster_path}
            title={movie.title}
            className="absolute inset-0 h-full w-full"
          />
          <Pressable
            onPress={goToDetail}
            accessibilityRole="button"
            accessibilityLabel={`${movie.title} 상세 보기`}
            className="absolute inset-0 z-0"
          />
          {Platform.OS !== 'web' ? (
            <MovieCardTopActions movieId={movie.id} variant="poster" />
          ) : null}
          <MovieCardMetaOverlay compact movieId={movie.id}>
            <MovieCardHoverContent
              movie={movie}
              genreNames={genreNames}
              compact
              onReadMore={goToDetail}
            />
          </MovieCardMetaOverlay>
          <MovieCardRatingPin rating={movie.vote_average} />
        </PosterFrame>
      </View>
    </View>
  );
}
