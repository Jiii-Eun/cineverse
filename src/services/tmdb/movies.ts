import type {
  GenreListResponse,
  MovieAccountStatesResponse,
  MovieCreditsResponse,
  MovieDetail,
  MovieFeedType,
  MovieImagesResponse,
  MovieKeywordsResponse,
  MovieReviewsResponse,
  MovieVideosResponse,
  PaginatedMovies,
} from '@/types/movie';

import { buildUrl, isPaginatedMovies, tmdbDelete, tmdbFetch, tmdbPost } from './client';

function isMovieDetail(data: unknown): data is MovieDetail {
  if (typeof data !== 'object' || data === null) return false;
  const record = data as Record<string, unknown>;
  return typeof record.id === 'number' && typeof record.title === 'string';
}

export interface DiscoverMovieParams {
  page?: number;
  genreId?: number | null;
  year?: number | null;
  ratingMin?: number | null;
}

export async function fetchDiscoverMovies({
  page = 1,
  genreId,
  year,
  ratingMin,
}: DiscoverMovieParams): Promise<PaginatedMovies> {
  const params: Record<string, string | number> = {
    page,
    sort_by: 'popularity.desc',
    region: process.env.EXPO_PUBLIC_TMDB_REGION ?? 'KR',
  };

  if (genreId) params.with_genres = genreId;
  if (year) params.primary_release_year = year;
  if (ratingMin) params['vote_average.gte'] = ratingMin;

  return tmdbFetch<PaginatedMovies>(
    { path: '/discover/movie', params },
    isPaginatedMovies,
  );
}

export async function fetchMoviesByFeed(
  feed: MovieFeedType,
  page = 1,
  genreId?: number,
): Promise<PaginatedMovies> {
  if (genreId) {
    return fetchDiscoverMovies({ page, genreId });
  }

  const pathMap: Record<MovieFeedType, string> = {
    now_playing: '/movie/now_playing',
    popular: '/movie/popular',
    top_rated: '/movie/top_rated',
    upcoming: '/movie/upcoming',
    trending: '/trending/movie/day',
  };

  const params: Record<string, string | number> = { page };
  if (feed === 'now_playing') {
    params.region = process.env.EXPO_PUBLIC_TMDB_REGION ?? 'KR';
  }

  return tmdbFetch<PaginatedMovies>(
    { path: pathMap[feed], params },
    isPaginatedMovies,
  );
}

export async function fetchNowPlaying(page = 1) {
  return fetchMoviesByFeed('now_playing', page);
}

export async function fetchMovieDetail(id: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(
    { path: `/movie/${id}` },
    isMovieDetail,
  );
}

export async function fetchGenreList(): Promise<GenreListResponse> {
  return tmdbFetch<GenreListResponse>({ path: '/genre/movie/list' });
}

export async function fetchMovieKeywords(
  movieId: number,
): Promise<MovieKeywordsResponse> {
  return tmdbFetch<MovieKeywordsResponse>({
    path: `/movie/${movieId}/keywords`,
  });
}

export async function fetchMovieCredits(
  movieId: number,
): Promise<MovieCreditsResponse> {
  return tmdbFetch<MovieCreditsResponse>({
    path: `/movie/${movieId}/credits`,
  });
}

export async function fetchMovieReviews(
  movieId: number,
  page = 1,
): Promise<MovieReviewsResponse> {
  return tmdbFetch<MovieReviewsResponse>({
    path: `/movie/${movieId}/reviews`,
    params: { page },
  });
}

export async function fetchMovieVideos(
  movieId: number,
): Promise<MovieVideosResponse> {
  return tmdbFetch<MovieVideosResponse>({
    path: `/movie/${movieId}/videos`,
  });
}

export async function fetchMovieImages(
  movieId: number,
): Promise<MovieImagesResponse> {
  return tmdbFetch<MovieImagesResponse>({
    path: `/movie/${movieId}/images`,
  });
}

export async function fetchMovieAccountStates(
  movieId: number,
  sessionId: string,
): Promise<MovieAccountStatesResponse> {
  return tmdbFetch<MovieAccountStatesResponse>({
    path: `/movie/${movieId}/account_states`,
    sessionId,
  });
}

export async function rateMovie(
  movieId: number,
  sessionId: string,
  value: number,
) {
  return tmdbPost<{ status_code: number; status_message: string }>(
    { path: `/movie/${movieId}/rating`, sessionId },
    { value },
  );
}

export async function deleteMovieRating(movieId: number, sessionId: string) {
  return tmdbDelete<{ status_code: number; status_message: string }>(
    { path: `/movie/${movieId}/rating`, sessionId },
    {},
  );
}

export { buildUrl, getPosterUrl } from './client';
