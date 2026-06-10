import { config } from '@/constants/config';
import type { MovieDetail, NowPlayingResponse } from '@/types/movie';

interface FetchNowPlayingParams {
  page?: number;
}

function buildUrl(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${config.tmdb.baseUrl}${path}`);
  url.searchParams.set('api_key', config.tmdb.apiKey);
  url.searchParams.set('language', config.tmdb.language);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

function isNowPlayingResponse(data: unknown): data is NowPlayingResponse {
  if (typeof data !== 'object' || data === null) return false;
  const record = data as Record<string, unknown>;
  return Array.isArray(record.results) && typeof record.page === 'number';
}

function isMovieDetail(data: unknown): data is MovieDetail {
  if (typeof data !== 'object' || data === null) return false;
  const record = data as Record<string, unknown>;
  return typeof record.id === 'number' && typeof record.title === 'string';
}

async function fetchJson<T>(
  url: string,
  guard: (data: unknown) => data is T,
): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB API 오류: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!guard(data)) {
    throw new Error('TMDB API 응답 형식이 올바르지 않습니다.');
  }

  return data;
}

export async function fetchNowPlaying({
  page = 1,
}: FetchNowPlayingParams = {}): Promise<NowPlayingResponse> {
  const url = buildUrl('/movie/now_playing', {
    page,
    region: config.tmdb.region,
  });

  return fetchJson(url, isNowPlayingResponse);
}

export async function fetchMovieDetail(id: number): Promise<MovieDetail> {
  const url = buildUrl(`/movie/${id}`);
  return fetchJson(url, isMovieDetail);
}

export function getPosterUrl(
  posterPath: string | null,
  size: 'w342' | 'w500' | 'w780' = 'w342',
): string | null {
  if (!posterPath) return null;
  return `${config.tmdb.imageBaseUrl}/${size}${posterPath}`;
}
