export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  runtime?: number | null;
}

export interface PaginatedMovies {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface RatedMovie extends Movie {
  rating: number;
}

export interface PaginatedRatedMovies {
  page: number;
  results: RatedMovie[];
  total_pages: number;
  total_results: number;
}

export type NowPlayingResponse = PaginatedMovies;

export interface Genre {
  id: number;
  name: string;
}

export interface GenreListResponse {
  genres: Genre[];
}

export interface MovieDetail extends Movie {
  runtime: number | null;
  genres: Genre[];
  status: string;
  tagline?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCreditsResponse {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface MovieReview {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
}

export interface MovieReviewsResponse {
  id: number;
  page: number;
  results: MovieReview[];
  total_pages: number;
  total_results: number;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieVideosResponse {
  id: number;
  results: MovieVideo[];
}

export interface MovieImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
}

export interface MovieImagesResponse {
  id: number;
  backdrops: MovieImage[];
  posters: MovieImage[];
}

export interface MovieAccountStatesResponse {
  id: number;
  favorite: boolean;
  watchlist: boolean;
  rated: { value: number } | Record<string, never>;
}

export interface MovieKeywordsResponse {
  id: number;
  keywords: { id: number; name: string }[];
}

export interface Account {
  id: number;
  username: string;
  name: string;
}

export interface RequestTokenResponse {
  success: boolean;
  expires_at: string;
  request_token: string;
}

export interface SessionResponse {
  success: boolean;
  session_id: string;
}

export interface MovieListSummary {
  id: number;
  name: string;
  description: string;
  item_count: number;
  poster_path: string | null;
}

export interface AccountListsResponse {
  page: number;
  results: MovieListSummary[];
  total_pages: number;
  total_results: number;
}

export interface ListDetailResponse {
  id: number;
  name: string;
  description: string;
  items: Movie[];
}

export interface ListItemStatusResponse {
  id: number;
  item_present: boolean;
}

export interface SearchMovieResponse extends PaginatedMovies {}

export interface SearchKeywordResponse {
  page: number;
  results: { id: number; name: string }[];
  total_pages: number;
  total_results: number;
}

export type MovieFeedType =
  | 'now_playing'
  | 'popular'
  | 'top_rated'
  | 'upcoming'
  | 'trending';
