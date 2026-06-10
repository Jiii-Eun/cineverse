import { useQuery } from '@tanstack/react-query';

import { fetchMoviesByFeed } from '@/services/tmdb/movies';
import type { MovieFeedType } from '@/types/movie';

export function useMoviesByFeed(feed: MovieFeedType, page = 1) {
  return useQuery({
    queryKey: ['movies', feed, 'preview', page],
    queryFn: () => fetchMoviesByFeed(feed, page),
  });
}
