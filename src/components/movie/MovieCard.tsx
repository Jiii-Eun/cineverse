import { useRouter } from 'expo-router';
import { Platform, Pressable, View } from 'react-native';

import { MovieCardHoverContent } from '@/components/movie/MovieCardHoverContent';
import { ListMovieRemoveButton } from '@/components/movie/ListMovieRemoveButton';
import { MovieCardMetaOverlay } from '@/components/movie/MovieCardMetaOverlay';
import { PosterFrame } from '@/components/movie/PosterFrame';
import { PosterImage } from '@/components/movie/PosterImage';
import { MovieCardRatingPin } from '@/components/movie/MovieCardRatingPin';
import { MovieCardTopActions } from '@/components/movie/MovieCardTopActions';
import { useGenreName } from '@/stores/uiStore';
import type { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  listId?: number;
  onRemoveFromList?: (movieId: number) => void;
  isRemovingFromList?: boolean;
}

export function MovieCard({
  movie,
  listId,
  onRemoveFromList,
  isRemovingFromList = false,
}: MovieCardProps) {
  const router = useRouter();
  const genreNames = useGenreName(movie.genre_ids);

  const goToDetail = () => router.push(`/movie/${movie.id}`);

  return (
    <View className="movie-card-root w-full px-1 py-2 web:overflow-visible">
      <View className="movie-card-surface overflow-hidden rounded-card bg-card web:origin-center web:hover:z-10 web:hover:scale-[1.03]">
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
          <MovieCardMetaOverlay
            movieId={movie.id}
            topRightAction={
              listId != null && onRemoveFromList ? (
                <ListMovieRemoveButton
                  movieId={movie.id}
                  onRemove={onRemoveFromList}
                  disabled={isRemovingFromList}
                />
              ) : undefined
            }
          >
            <MovieCardHoverContent
              movie={movie}
              genreNames={genreNames}
              onReadMore={goToDetail}
            />
          </MovieCardMetaOverlay>
          <MovieCardRatingPin rating={movie.vote_average} />
        </PosterFrame>
      </View>
    </View>
  );
}
