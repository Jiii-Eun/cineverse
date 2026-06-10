import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteMovieRating,
  fetchMovieAccountStates,
  rateMovie,
} from '@/services/tmdb/movies';
import { useAuthStore } from '@/stores/authStore';
import type { MovieAccountStatesResponse } from '@/types/movie';

function accountStatesKey(movieId: number) {
  return ['movies', 'account_states', movieId] as const;
}

export function useMovieAccountStates(movieId: number) {
  const sessionId = useAuthStore((s) => s.sessionId);

  return useQuery({
    queryKey: accountStatesKey(movieId),
    queryFn: () => fetchMovieAccountStates(movieId, sessionId!),
    enabled: Boolean(sessionId && movieId > 0),
  });
}

function getRatedValue(states?: MovieAccountStatesResponse) {
  if (!states?.rated || !('value' in states.rated)) {
    return null;
  }
  return states.rated.value;
}

export function useUserMovieRating(movieId: number) {
  const { data } = useMovieAccountStates(movieId);
  return getRatedValue(data);
}

export function useRateMovie(movieId: number) {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);

  return useMutation({
    mutationFn: async (value: number) => {
      if (!sessionId) {
        throw new Error('로그인이 필요합니다.');
      }
      return rateMovie(movieId, sessionId, value);
    },
    onMutate: async (value) => {
      const key = accountStatesKey(movieId);
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<MovieAccountStatesResponse>(key);

      queryClient.setQueryData<MovieAccountStatesResponse>(key, (old) => ({
        id: old?.id ?? movieId,
        favorite: old?.favorite ?? false,
        watchlist: old?.watchlist ?? false,
        rated: { value },
      }));

      return { previous };
    },
    onError: (_error, _value, context) => {
      if (context?.previous) {
        queryClient.setQueryData(accountStatesKey(movieId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: accountStatesKey(movieId) });
    },
  });
}

export function useDeleteMovieRating(movieId: number) {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);

  return useMutation({
    mutationFn: async () => {
      if (!sessionId) {
        throw new Error('로그인이 필요합니다.');
      }
      return deleteMovieRating(movieId, sessionId);
    },
    onMutate: async () => {
      const key = accountStatesKey(movieId);
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<MovieAccountStatesResponse>(key);

      queryClient.setQueryData<MovieAccountStatesResponse>(key, (old) => ({
        id: old?.id ?? movieId,
        favorite: old?.favorite ?? false,
        watchlist: old?.watchlist ?? false,
        rated: {},
      }));

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(accountStatesKey(movieId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: accountStatesKey(movieId) });
    },
  });
}
