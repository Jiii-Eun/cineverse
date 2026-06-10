import type { PaginatedMovies } from '@/types/movie';

import { isPaginatedMovies, tmdbFetch, tmdbPost } from './client';

export async function fetchWatchlist(
  accountId: number,
  sessionId: string,
  page = 1,
): Promise<PaginatedMovies> {
  return tmdbFetch<PaginatedMovies>(
    {
      path: `/account/${accountId}/watchlist`,
      params: { page },
      sessionId,
    },
    isPaginatedMovies,
  );
}

export async function fetchFavoriteMovies(
  accountId: number,
  sessionId: string,
  page = 1,
): Promise<PaginatedMovies> {
  return tmdbFetch<PaginatedMovies>(
    {
      path: `/account/${accountId}/favorite/movies`,
      params: { page },
      sessionId,
    },
    isPaginatedMovies,
  );
}

export async function fetchAllFavoriteMovies(
  accountId: number,
  sessionId: string,
): Promise<PaginatedMovies> {
  const firstPage = await fetchFavoriteMovies(accountId, sessionId, 1);

  if (firstPage.total_pages <= 1) {
    return firstPage;
  }

  const otherPages = await Promise.all(
    Array.from({ length: firstPage.total_pages - 1 }, (_, index) =>
      fetchFavoriteMovies(accountId, sessionId, index + 2),
    ),
  );

  return {
    ...firstPage,
    results: [
      ...firstPage.results,
      ...otherPages.flatMap((page) => page.results),
    ],
  };
}

export async function toggleWatchlist(
  accountId: number,
  sessionId: string,
  movieId: number,
  watchlist: boolean,
) {
  return tmdbPost<{ success: boolean }>(
    {
      path: `/account/${accountId}/watchlist`,
      sessionId,
    },
    {
      media_type: 'movie',
      media_id: movieId,
      watchlist,
    },
  );
}

export async function toggleFavoriteMovie(
  accountId: number,
  sessionId: string,
  movieId: number,
  favorite: boolean,
) {
  return tmdbPost<{ success: boolean }>(
    {
      path: `/account/${accountId}/favorite`,
      sessionId,
    },
    {
      media_type: 'movie',
      media_id: movieId,
      favorite,
    },
  );
}
