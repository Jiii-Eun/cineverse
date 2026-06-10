import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addMovieToListWithCheck,
  clearList,
  createList,
  deleteList as deleteListApi,
  fetchAllAccountLists,
  fetchAllListItems,
  fetchListDetailWithRecovery,
  moveMovieToList,
  removeMovieFromList,
} from '@/services/tmdb/lists';
import { useAuthStore } from '@/stores/authStore';
import type { AccountListsResponse, ListDetailResponse } from '@/types/movie';

function moviesInListsIndexKey(accountId?: number) {
  return ['account', 'movies_in_lists_index', accountId] as const;
}

function invalidateMoviesInListsIndex(
  queryClient: ReturnType<typeof useQueryClient>,
  accountId?: number,
) {
  queryClient.invalidateQueries({
    queryKey: moviesInListsIndexKey(accountId),
  });
}

export function useMoviesInListsIndex(enabled = true) {
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);
  const { data: lists } = useAccountLists();

  return useQuery({
    queryKey: [
      ...moviesInListsIndexKey(accountId),
      lists?.results.map((list) => list.id).join(',') ?? '',
    ] as const,
    queryFn: async () => {
      if (!lists?.results.length || !sessionId) {
        return new Set<number>();
      }

      const details = await Promise.all(
        lists.results.map((list) => fetchAllListItems(list.id, sessionId)),
      );

      const movieIds = new Set<number>();
      for (const detail of details) {
        for (const movie of detail.items) {
          movieIds.add(movie.id);
        }
      }

      return movieIds;
    },
    enabled: Boolean(
      enabled && sessionId && accountId && lists !== undefined,
    ),
    staleTime: 30_000,
  });
}

export function useIsMovieInAnyList(movieId: number, options?: { enabled?: boolean }) {
  const { data: index, isLoading } = useMoviesInListsIndex(options?.enabled ?? true);

  return {
    data: index?.has(movieId) ?? false,
    isLoading,
  };
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
  const accountId = useAuthStore((s) => s.account?.id);
  const isValidListId = Number.isFinite(listId) && listId > 0;

  return useQuery({
    queryKey: ['list', listId],
    queryFn: () =>
      fetchListDetailWithRecovery(listId, sessionId!, accountId!),
    enabled: Boolean(sessionId && accountId && isValidListId),
  });
}

interface ListFormInput {
  name: string;
  description?: string;
}

export function useCreateList() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);

  return useMutation({
    mutationFn: ({ name, description = '' }: ListFormInput) => {
      if (!sessionId) throw new Error('로그인이 필요합니다.');
      return createList(sessionId, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account', 'lists'] });
      invalidateMoviesInListsIndex(queryClient, accountId);
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  const accountId = useAuthStore((s) => s.account?.id);

  return useMutation({
    mutationFn: (listId: number) => {
      const sessionId = useAuthStore.getState().sessionId;
      if (!sessionId) throw new Error('로그인이 필요합니다.');
      return deleteListApi(listId, sessionId);
    },
    onSuccess: (_, listId) => {
      const key = ['account', 'lists', accountId] as const;

      queryClient.setQueryData<AccountListsResponse>(key, (old) => {
        if (!old) return old;

        return {
          ...old,
          results: old.results.filter((list) => list.id !== listId),
          total_results: Math.max(0, old.total_results - 1),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['account', 'lists'] });
      queryClient.removeQueries({ queryKey: ['list', listId] });
      invalidateMoviesInListsIndex(queryClient, accountId);
    },
  });
}

export function useAddToList() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);

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
      queryClient.setQueryData<Set<number>>(
        moviesInListsIndexKey(accountId),
        (old) => {
          const next = new Set(old ?? []);
          next.add(movieId);
          return next;
        },
      );
      queryClient.invalidateQueries({ queryKey: ['list', listId] });
      queryClient.invalidateQueries({ queryKey: ['account', 'lists'] });
    },
  });
}

export function useMoveToList() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);

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
    onSuccess: (_, { fromListId, toListId }) => {
      queryClient.invalidateQueries({ queryKey: ['list', fromListId] });
      queryClient.invalidateQueries({ queryKey: ['list', toListId] });
      invalidateMoviesInListsIndex(queryClient, accountId);
    },
  });
}

export function useRemoveFromList() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);

  return useMutation({
    mutationFn: ({
      listId,
      movieId,
    }: {
      listId: number;
      movieId: number;
    }) => {
      if (!sessionId) throw new Error('로그인이 필요합니다.');
      return removeMovieFromList(listId, sessionId, movieId);
    },
    onMutate: async ({ listId, movieId }) => {
      const key = ['list', listId] as const;
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<ListDetailResponse>(key);

      queryClient.setQueryData<ListDetailResponse>(key, (old) => {
        if (!old) return old;

        return {
          ...old,
          items: old.items.filter((movie) => movie.id !== movieId),
        };
      });

      if (accountId) {
        const listsKey = ['account', 'lists', accountId] as const;
        queryClient.setQueryData<AccountListsResponse>(listsKey, (old) => {
          if (!old) return old;

          return {
            ...old,
            results: old.results.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    item_count: Math.max(0, list.item_count - 1),
                  }
                : list,
            ),
          };
        });
      }

      return { previous, listId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['list', context.listId], context.previous);
      }
      queryClient.invalidateQueries({ queryKey: ['account', 'lists'] });
    },
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ['list', listId] });
      queryClient.invalidateQueries({ queryKey: ['account', 'lists'] });
      invalidateMoviesInListsIndex(queryClient, accountId);
    },
  });
}

export function useClearList() {
  const queryClient = useQueryClient();
  const accountId = useAuthStore((s) => s.account?.id);

  return useMutation({
    mutationFn: (listId: number) => {
      const sessionId = useAuthStore.getState().sessionId;
      if (!sessionId) throw new Error('로그인이 필요합니다.');
      return clearList(listId, sessionId);
    },
    onSuccess: (_, listId) => {
      const key = ['list', listId] as const;

      queryClient.setQueryData<ListDetailResponse>(key, (old) => {
        if (!old) return old;
        return { ...old, items: [] };
      });

      if (accountId) {
        const listsKey = ['account', 'lists', accountId] as const;
        queryClient.setQueryData<AccountListsResponse>(listsKey, (old) => {
          if (!old) return old;

          return {
            ...old,
            results: old.results.map((list) =>
              list.id === listId ? { ...list, item_count: 0 } : list,
            ),
          };
        });
      }

      queryClient.invalidateQueries({ queryKey: ['list', listId] });
      queryClient.invalidateQueries({ queryKey: ['account', 'lists'] });
      invalidateMoviesInListsIndex(queryClient, accountId);
    },
  });
}
