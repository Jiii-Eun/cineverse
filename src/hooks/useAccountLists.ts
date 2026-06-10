import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addMovieToListWithCheck,
  checkListItemStatus,
  createList,
  fetchAllAccountLists,
  fetchListDetail,
  moveMovieToList,
  updateList,
} from '@/services/tmdb/lists';
import { useAuthStore } from '@/stores/authStore';
import type { AccountListsResponse } from '@/types/movie';

function movieInAnyListKey(movieId: number, accountId?: number) {
  return ['movie', movieId, 'in_any_list', accountId] as const;
}

export function useAccountLists() {
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);

  return useQuery({
    queryKey: ['account', 'lists', accountId],
    queryFn: () => fetchAllAccountLists(accountId!, sessionId!),
    enabled: Boolean(sessionId && accountId),
    staleTime: 30_000,
  });
}

export function useListDetail(listId: number) {
  const sessionId = useAuthStore((s) => s.sessionId);
  const isValidListId = Number.isFinite(listId) && listId > 0;

  return useQuery({
    queryKey: ['list', listId],
    queryFn: () => fetchListDetail(listId, sessionId!),
    enabled: Boolean(sessionId && isValidListId),
  });
}

export function useIsMovieInAnyList(movieId: number) {
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);
  const { data: lists } = useAccountLists();

  return useQuery({
    queryKey: movieInAnyListKey(movieId, accountId),
    queryFn: async () => {
      if (!lists?.results.length) {
        return false;
      }

      const statuses = await Promise.all(
        lists.results.map((list) =>
          checkListItemStatus(list.id, sessionId!, movieId),
        ),
      );

      return statuses.some((status) => status.item_present);
    },
    enabled: Boolean(sessionId && accountId && movieId > 0 && lists !== undefined),
    staleTime: 30_000,
  });
}

interface ListFormInput {
  name: string;
  description?: string;
}

export function useCreateList() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);

  return useMutation({
    mutationFn: ({ name, description = '' }: ListFormInput) => {
      if (!sessionId) throw new Error('로그인이 필요합니다.');
      return createList(sessionId, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'lists'] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);

  return useMutation({
    mutationFn: ({
      listId,
      name,
      description = '',
    }: ListFormInput & { listId: number }) => {
      if (!sessionId) throw new Error('로그인이 필요합니다.');
      return updateList(listId, sessionId, name, description);
    },
    onMutate: async ({ listId, name, description = '' }) => {
      const key = ['account', 'lists', accountId] as const;
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<AccountListsResponse>(key);

      queryClient.setQueryData<AccountListsResponse>(key, (old) => {
        if (!old) return old;

        return {
          ...old,
          results: old.results.map((list) =>
            list.id === listId ? { ...list, name, description } : list,
          ),
        };
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ['account', 'lists', accountId],
          context.previous,
        );
      }
    },
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ['account', 'lists'] });
      queryClient.invalidateQueries({ queryKey: ['list', listId] });
    },
  });
}

export function useAddToList() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);

  return useMutation({
    mutationFn: async ({
      listId,
      movieId,
    }: {
      listId: number;
      movieId: number;
    }) => {
      if (!sessionId) throw new Error('로그인이 필요합니다.');
      return addMovieToListWithCheck(listId, sessionId, movieId);
    },
    onSuccess: (_, { listId, movieId }) => {
      queryClient.invalidateQueries({ queryKey: ['list', listId] });
      queryClient.invalidateQueries({ queryKey: ['account', 'lists'] });
      queryClient.invalidateQueries({ queryKey: ['movie', movieId, 'in_any_list'] });
    },
  });
}

export function useMoveToList() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);

  return useMutation({
    mutationFn: async ({
      fromListId,
      toListId,
      movieId,
    }: {
      fromListId: number;
      toListId: number;
      movieId: number;
    }) => {
      if (!sessionId) throw new Error('로그인이 필요합니다.');
      return moveMovieToList(fromListId, toListId, sessionId, movieId);
    },
    onSuccess: (_, { fromListId, toListId, movieId }) => {
      queryClient.invalidateQueries({ queryKey: ['list', fromListId] });
      queryClient.invalidateQueries({ queryKey: ['list', toListId] });
      queryClient.invalidateQueries({ queryKey: ['movie', movieId, 'in_any_list'] });
    },
  });
}
