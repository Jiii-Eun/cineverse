import type {
  AccountListsResponse,
  ListDetailResponse,
  ListItemStatusResponse,
  MovieListSummary,
} from '@/types/movie';

import { tmdbFetch, tmdbPost } from './client';

export async function fetchAccountLists(
  accountId: number,
  sessionId: string,
  page = 1,
): Promise<AccountListsResponse> {
  return tmdbFetch<AccountListsResponse>({
    path: `/account/${accountId}/lists`,
    params: { page },
    sessionId,
  });
}

export async function fetchAllAccountLists(
  accountId: number,
  sessionId: string,
): Promise<AccountListsResponse> {
  const firstPage = await fetchAccountLists(accountId, sessionId, 1);

  if (firstPage.total_pages <= 1) {
    return firstPage;
  }

  const otherPages = await Promise.all(
    Array.from({ length: firstPage.total_pages - 1 }, (_, index) =>
      fetchAccountLists(accountId, sessionId, index + 2),
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

export async function fetchListDetail(
  listId: number,
  sessionId: string,
  page = 1,
): Promise<ListDetailResponse> {
  return tmdbFetch<ListDetailResponse>({
    path: `/list/${listId}`,
    params: { page },
    sessionId,
  });
}

const listLanguage = () =>
  process.env.EXPO_PUBLIC_TMDB_LANGUAGE ?? 'ko-KR';

export async function createList(
  sessionId: string,
  name: string,
  description = '',
): Promise<{ success: boolean; list_id: number }> {
  return tmdbPost<{ success: boolean; list_id: number }>(
    { path: '/list', sessionId },
    { name, description, language: listLanguage(), public: true },
  );
}

export async function updateList(
  listId: number,
  sessionId: string,
  name: string,
  description = '',
): Promise<{ success: boolean }> {
  return tmdbPost<{ success: boolean }>(
    { path: `/list/${listId}`, sessionId },
    { name, description, language: listLanguage(), public: true },
  );
}

export async function checkListItemStatus(
  listId: number,
  sessionId: string,
  movieId: number,
): Promise<ListItemStatusResponse> {
  return tmdbFetch<ListItemStatusResponse>({
    path: `/list/${listId}/item_status`,
    params: { movie_id: movieId },
    sessionId,
  });
}

export async function addMovieToList(
  listId: number,
  sessionId: string,
  movieId: number,
) {
  return tmdbPost<{ success: boolean; status_message?: string }>(
    { path: `/list/${listId}/add_item`, sessionId },
    { media_id: movieId },
  );
}

export async function removeMovieFromList(
  listId: number,
  sessionId: string,
  movieId: number,
) {
  return tmdbPost<{ success: boolean }>(
    { path: `/list/${listId}/remove_item`, sessionId },
    { media_id: movieId },
  );
}

export async function clearList(listId: number, sessionId: string) {
  return tmdbPost<{ success: boolean }>(
    { path: `/list/${listId}/clear`, sessionId },
    {},
  );
}

export async function addMovieToListWithCheck(
  listId: number,
  sessionId: string,
  movieId: number,
): Promise<{ added: boolean; alreadyExists: boolean }> {
  const status = await checkListItemStatus(listId, sessionId, movieId);

  if (status.item_present) {
    return { added: false, alreadyExists: true };
  }

  await addMovieToList(listId, sessionId, movieId);
  return { added: true, alreadyExists: false };
}

export async function moveMovieToList(
  fromListId: number,
  toListId: number,
  sessionId: string,
  movieId: number,
) {
  const targetStatus = await checkListItemStatus(toListId, sessionId, movieId);

  if (targetStatus.item_present) {
    return { moved: false, alreadyExists: true };
  }

  await removeMovieFromList(fromListId, sessionId, movieId);
  await addMovieToList(toListId, sessionId, movieId);
  return { moved: true, alreadyExists: false };
}

export type { MovieListSummary };
