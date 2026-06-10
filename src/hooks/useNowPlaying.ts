import { useQuery } from '@tanstack/react-query';

import { fetchNowPlaying } from '@/services/tmdb';

interface UseNowPlayingParams {
  page?: number;
}

export function useNowPlaying({ page = 1 }: UseNowPlayingParams = {}) {
  return useQuery({
    queryKey: ['movies', 'nowPlaying', { page }],
    queryFn: () => fetchNowPlaying({ page }),
  });
}
