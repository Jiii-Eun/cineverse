import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchMoviesByFeed } from '@/services/tmdb/movies';
import type { MovieFeedType } from '@/types/movie';

interface UseMoviesInfiniteParams {
  feed: MovieFeedType;
  genreId?: number | null;
}

export function useMoviesInfinite({ feed, genreId }: UseMoviesInfiniteParams) {
  return useInfiniteQuery({
    queryKey: ['movies', feed, { genreId: genreId ?? null }],
    queryFn: ({ pageParam }) =>
      fetchMoviesByFeed(feed, pageParam, genreId ?? undefined),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
