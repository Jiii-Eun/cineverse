import { useQuery } from '@tanstack/react-query';

import { searchMovies } from '@/services/tmdb/search';

export function useSearchMovies(query: string, enabled = true) {
  return useQuery({
    queryKey: ['search', 'movie', { query }],
    queryFn: () => searchMovies(query),
    enabled: enabled && query.trim().length > 0,
  });
}
