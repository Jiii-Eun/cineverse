import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchAllFavoriteMovies,
  toggleFavoriteMovie,
} from '@/services/tmdb/account';
import { fetchMovieAccountStates } from '@/services/tmdb/movies';
import { useAuthStore } from '@/stores/authStore';
import type { Movie, MovieAccountStatesResponse, PaginatedMovies } from '@/types/movie';

function favoritesQueryKey(accountId: number | undefined) {
  return ['account', 'favorites', accountId] as const;
}

export function useWatchlist() {
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);

  return useQuery({
    queryKey: favoritesQueryKey(accountId),
    queryFn: () => fetchAllFavoriteMovies(accountId!, sessionId!),
    enabled: Boolean(sessionId && accountId),
  });
}

export function useToggleWatchlist() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);

  return useMutation({
    mutationFn: async ({
      movieId,
      favorite,
    }: {
      movieId: number;
      favorite: boolean;
    }) => {
      if (!sessionId || !accountId) {
        throw new Error('로그인이 필요합니다.');
      }
      return toggleFavoriteMovie(accountId, sessionId, movieId, favorite);
    },
    onMutate: async ({ movieId, favorite }) => {
      const key = favoritesQueryKey(accountId);
      await queryClient.cancelQueries({ queryKey: key });

      const previousFavorites = queryClient.getQueryData<PaginatedMovies>(key);
      const previousAccountStates = queryClient.getQueryData<MovieAccountStatesResponse>(
        ['movies', 'account_states', movieId],
      );

      queryClient.setQueryData<PaginatedMovies>(key, (old) => {
        if (!old) {
          return old;
        }

        if (favorite) {
          if (old.results.some((movie) => movie.id === movieId)) {
            return old;
          }

          const stub: Movie = {
            id: movieId,
            title: '',
            overview: '',
            poster_path: null,
            backdrop_path: null,
            vote_average: 0,
            release_date: '',
            genre_ids: [],
          };

          return {
            ...old,
            results: [stub, ...old.results],
            total_results: old.total_results + 1,
          };
        }

        return {
          ...old,
          results: old.results.filter((movie) => movie.id !== movieId),
          total_results: Math.max(0, old.total_results - 1),
        };
      });

      queryClient.setQueryData<MovieAccountStatesResponse>(
        ['movies', 'account_states', movieId],
        (old) => ({
          id: old?.id ?? movieId,
          favorite,
          watchlist: old?.watchlist ?? false,
          rated: old?.rated ?? {},
        }),
      );

      return { previousFavorites, previousAccountStates };
    },
    onError: (_error, { movieId }, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          favoritesQueryKey(accountId),
          context.previousFavorites,
        );
      }
      if (context?.previousAccountStates) {
        queryClient.setQueryData(
          ['movies', 'account_states', movieId],
          context.previousAccountStates,
        );
      }
    },
    onSettled: (_data, error, { movieId }) => {
      if (error) {
        queryClient.invalidateQueries({ queryKey: ['account', 'favorites'] });
        queryClient.invalidateQueries({
          queryKey: ['movies', 'account_states', movieId],
        });
      }
    },
  });
}

export function useIsInWatchlist(movieId: number) {
  const { data } = useWatchlist();
  return data?.results.some((movie) => movie.id === movieId) ?? false;
}

/** 상세 페이지 등 account_states가 로드된 경우 우선 사용 */
export function useIsInWatchlistResolved(
  movieId: number,
  options?: { preferAccountStates?: boolean },
) {
  const sessionId = useAuthStore((s) => s.sessionId);
  const preferAccountStates = options?.preferAccountStates ?? false;
  const fromList = useIsInWatchlist(movieId);

  const { data: accountStates } = useQuery({
    queryKey: ['movies', 'account_states', movieId],
    queryFn: () => fetchMovieAccountStates(movieId, sessionId!),
    enabled: Boolean(preferAccountStates && sessionId && movieId > 0),
  });

  if (preferAccountStates && accountStates) {
    return accountStates.favorite;
  }

  return fromList;
}
