import type { SearchKeywordResponse, SearchMovieResponse } from '@/types/movie';

import { isPaginatedMovies, tmdbFetch } from './client';

export async function searchMovies(
  query: string,
  page = 1,
): Promise<SearchMovieResponse> {
  return tmdbFetch<SearchMovieResponse>(
    {
      path: '/search/movie',
      params: { query, page, include_adult: false },
    },
    isPaginatedMovies,
  );
}

export async function searchKeywords(
  query: string,
  page = 1,
): Promise<SearchKeywordResponse> {
  return tmdbFetch<SearchKeywordResponse>({
    path: '/search/keyword',
    params: { query, page },
  });
}
