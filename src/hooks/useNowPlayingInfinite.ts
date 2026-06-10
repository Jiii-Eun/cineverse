import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchNowPlaying } from '@/services/tmdb';

export function useNowPlayingInfinite() {
  return useInfiniteQuery({
    queryKey: ['movies', 'nowPlaying', 'infinite'],
    queryFn: ({ pageParam }) => fetchNowPlaying({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
}
