import type {
  AccountListsResponse,
  ListDetailResponse,
  ListItemStatusResponse,
  MovieListSummary,
} from '@/types/movie';

import { tmdbDelete, tmdbFetch, tmdbPost } from './client';

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
): Promise<ListDetailResponse & { page: number; total_pages: number }> {
  return tmdbFetch<ListDetailResponse & { page: number; total_pages: number }>({
    path: `/list/${listId}`,
    params: { page },
    sessionId,
  });
}

export async function fetchAllListItems(
  listId: number,
  sessionId: string,
): Promise<ListDetailResponse> {
  const firstPage = await fetchListDetail(listId, sessionId, 1);

  if (firstPage.total_pages <= 1) {
    return {
      id: firstPage.id,
      name: firstPage.name,
      description: firstPage.description,
      items: firstPage.items,
    };
  }

  const otherPages = await Promise.all(
    Array.from({ length: firstPage.total_pages - 1 }, (_, index) =>
      fetchListDetail(listId, sessionId, index + 2),
    ),
  );

  return {
    id: firstPage.id,
    name: firstPage.name,
    description: firstPage.description,
    items: [
      ...firstPage.items,
      ...otherPages.flatMap((page) => page.items),
    ],
  };
}

export async function fetchListDetailWithRecovery(
  listId: number,
  sessionId: string,
  accountId: number,
): Promise<ListDetailResponse> {
  try {
    return await fetchAllListItems(listId, sessionId);
  } catch (error) {
    const is404 =
      error instanceof Error && error.message.includes('404');
    if (!is404) {
      throw error;
    }

    const lists = await fetchAllAccountLists(accountId, sessionId);
    const summary = lists.results.find((list) => list.id === listId);
    if (!summary) {
      throw new Error(
        '폴더를 찾을 수 없습니다. 삭제되었거나 접근 권한이 없습니다.',
      );
    }

    await updateList(
      listId,
      sessionId,
      summary.name,
      summary.description ?? '',
    );
    return fetchAllListItems(listId, sessionId);
  }
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
): Promise<{ success: boolean; status_code?: number; status_message?: string }> {
  const result = await tmdbPost<{
    success?: boolean;
    status_code?: number;
    status_message?: string;
  }>({ path: `/list/${listId}`, sessionId }, {
    name,
    description,
    language: listLanguage(),
    public: true,
  });

  const successCodes = new Set([1, 12]);
  if (
    result.status_code != null &&
    !successCodes.has(result.status_code)
  ) {
    throw new Error(result.status_message ?? '폴더 설명 수정에 실패했습니다.');
  }

  if (result.success === false) {
    throw new Error(result.status_message ?? '폴더 설명 수정에 실패했습니다.');
  }

  return {
    success: result.success ?? true,
    status_code: result.status_code,
    status_message: result.status_message,
  };
}

/** DELETE https://api.themoviedb.org/3/list/{list_id}?session_id=... */
export async function deleteList(listId: number, sessionId: string) {
  if (!Number.isFinite(listId) || listId <= 0) {
    throw new Error('유효하지 않은 폴더 ID입니다.');
  }
  if (!sessionId) {
    throw new Error('로그인이 필요합니다.');
  }

  const result = await tmdbDelete<{
    status_code?: number;
    status_message?: string;
  }>({
    path: `/list/${listId}`,
    sessionId,
  });

  // TMDB: 1=Success, 12=Updated, 13=Deleted
  const successCodes = new Set([1, 12, 13]);
  if (
    result.status_code != null &&
    !successCodes.has(result.status_code)
  ) {
    throw new Error(result.status_message ?? '폴더 삭제에 실패했습니다.');
  }

  return result;
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

/** POST https://api.themoviedb.org/3/list/{list_id}/clear?session_id=...&confirm=true */
export async function clearList(listId: number, sessionId: string) {
  if (!Number.isFinite(listId) || listId <= 0) {
    throw new Error('유효하지 않은 폴더 ID입니다.');
  }
  if (!sessionId) {
    throw new Error('로그인이 필요합니다.');
  }

  const result = await tmdbPost<{
    success?: boolean;
    status_code?: number;
    status_message?: string;
  }>(
    { path: `/list/${listId}/clear`, sessionId, params: { confirm: true } },
    {},
  );

  const successCodes = new Set([1, 12]);
  if (
    result.status_code != null &&
    !successCodes.has(result.status_code)
  ) {
    throw new Error(result.status_message ?? '모두 삭제하지 못했습니다.');
  }

  if (result.success === false) {
    throw new Error(result.status_message ?? '모두 삭제하지 못했습니다.');
  }

  return result;
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
