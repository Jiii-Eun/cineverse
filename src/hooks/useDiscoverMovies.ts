import { useInfiniteQuery } from '@tanstack/react-query';

import {
  fetchDiscoverMovies,
  type DiscoverMovieParams,
} from '@/services/tmdb/movies';

export function useDiscoverMovies(filters: DiscoverMovieParams) {
  return useInfiniteQuery({
    queryKey: [
      'movies',
      'discover',
      {
        genreId: filters.genreId ?? null,
        year: filters.year ?? null,
        ratingMin: filters.ratingMin ?? null,
      },
    ],
    queryFn: ({ pageParam }) =>
      fetchDiscoverMovies({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
