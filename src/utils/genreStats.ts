import type { Movie } from '@/types/movie';

export interface GenreRank {
  genreId: number;
  count: number;
}

export function calculateTopGenres(
  movies: Pick<Movie, 'id' | 'genre_ids'>[],
  limit = 10,
): GenreRank[] {
  const seen = new Set<number>();
  const counts = new Map<number, number>();

  for (const movie of movies) {
    if (seen.has(movie.id)) continue;
    seen.add(movie.id);

    for (const genreId of movie.genre_ids) {
      counts.set(genreId, (counts.get(genreId) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, limit)
    .map(([genreId, count]) => ({ genreId, count }));
}
