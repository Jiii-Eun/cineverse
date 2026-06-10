import type { ExploreFilterValues } from '@/components/explore/ExploreFilters';
import type { Movie } from '@/types/movie';

export function filterMoviesByExploreFilters(
  movies: Movie[],
  filters: ExploreFilterValues,
): Movie[] {
  return movies.filter((movie) => {
    if (filters.genreId && !movie.genre_ids.includes(filters.genreId)) {
      return false;
    }

    if (filters.year) {
      const releaseYear = movie.release_date?.slice(0, 4);
      if (releaseYear !== String(filters.year)) {
        return false;
      }
    }

    if (filters.ratingMin != null && movie.vote_average < filters.ratingMin) {
      return false;
    }

    return true;
  });
}
