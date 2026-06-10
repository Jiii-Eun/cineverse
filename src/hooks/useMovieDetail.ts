import { useQuery } from '@tanstack/react-query';

import { fetchMovieDetail } from '@/services/tmdb/movies';

export function useMovieDetail(id: number) {
  return useQuery({
    queryKey: ['movies', 'detail', { id }],
    queryFn: () => fetchMovieDetail(id),
    enabled: id > 0,
  });
}
