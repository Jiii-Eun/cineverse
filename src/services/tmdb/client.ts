import { config } from '@/constants/config';

interface BuildUrlOptions {
  path: string;
  params?: Record<string, string | number | boolean | undefined>;
  sessionId?: string;
}

async function readTmdbErrorMessage(response: Response): Promise<string> {
  const base = `TMDB API 오류: ${response.status}`;
  try {
    const body = (await response.json()) as { status_message?: string };
    if (body.status_message) {
      return `${base} (${body.status_message})`;
    }
  } catch {
    // ignore JSON parse errors
  }
  return base;
}

export async function tmdbFetch<T>(
  options: BuildUrlOptions,
  guard?: (data: unknown) => data is T,
): Promise<T> {
  const url = buildUrl(options);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(await readTmdbErrorMessage(response));
  }

  const data: unknown = await response.json();

  if (guard && !guard(data)) {
    throw new Error('TMDB API 응답 형식이 올바르지 않습니다.');
  }

  return data as T;
}

export async function tmdbPost<T>(
  options: BuildUrlOptions,
  body: Record<string, unknown>,
): Promise<T> {
  const url = buildUrl(options);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await readTmdbErrorMessage(response));
  }

  return (await response.json()) as T;
}

export async function tmdbDelete<T>(
  options: BuildUrlOptions,
  body?: Record<string, unknown>,
): Promise<T> {
  const url = buildUrl(options);
  const hasBody = body !== undefined && Object.keys(body).length > 0;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await readTmdbErrorMessage(response));
  }

  const text = await response.text();
  if (!text) {
    return { success: true } as T;
  }

  return JSON.parse(text) as T;
}

export function buildUrl({
  path,
  params = {},
  sessionId,
}: BuildUrlOptions): string {
  const url = new URL(`${config.tmdb.baseUrl}${path}`);
  url.searchParams.set('api_key', config.tmdb.apiKey);
  url.searchParams.set('language', config.tmdb.language);

  if (sessionId) {
    url.searchParams.set('session_id', sessionId);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function getPosterUrl(
  posterPath: string | null,
  size: 'w342' | 'w500' | 'w780' = 'w342',
): string | null {
  if (!posterPath) return null;
  return `${config.tmdb.imageBaseUrl}/${size}${posterPath}`;
}

export function getBackdropUrl(
  backdropPath: string | null,
  size: 'w780' | 'w1280' | 'original' = 'w1280',
): string | null {
  if (!backdropPath) return null;
  return `${config.tmdb.imageBaseUrl}/${size}${backdropPath}`;
}

export function getProfileUrl(
  profilePath: string | null,
  size: 'w45' | 'w185' | 'h632' = 'w185',
): string | null {
  if (!profilePath) return null;
  return `${config.tmdb.imageBaseUrl}/${size}${profilePath}`;
}

export function isPaginatedMovies(
  data: unknown,
): data is import('@/types/movie').PaginatedMovies {
  if (typeof data !== 'object' || data === null) return false;
  const record = data as Record<string, unknown>;
  return Array.isArray(record.results) && typeof record.page === 'number';
}
