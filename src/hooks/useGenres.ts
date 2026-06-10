import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { fetchGenreList } from '@/services/tmdb/movies';
import { useUiStore } from '@/stores/uiStore';

export function useGenres() {
  const setGenres = useUiStore((s) => s.setGenres);
  const query = useQuery({
    queryKey: ['genres', 'movie'],
    queryFn: fetchGenreList,
    staleTime: 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data?.genres) {
      setGenres(query.data.genres);
    }
  }, [query.data?.genres, setGenres]);

  return query;
}
