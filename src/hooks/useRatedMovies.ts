import { useQuery } from '@tanstack/react-query';

import { fetchAllRatedMovies } from '@/services/tmdb/account';
import { useAuthStore } from '@/stores/authStore';

function ratedMoviesQueryKey(accountId: number | undefined) {
  return ['account', 'rated_movies', accountId] as const;
}

export function useRatedMovies() {
  const sessionId = useAuthStore((s) => s.sessionId);
  const accountId = useAuthStore((s) => s.account?.id);

  return useQuery({
    queryKey: ratedMoviesQueryKey(accountId),
    queryFn: () => fetchAllRatedMovies(accountId!, sessionId!),
    enabled: Boolean(sessionId && accountId),
    staleTime: 30_000,
  });
}

export function calculateAverageRating(
  ratings: number[],
): number | null {
  if (!ratings.length) return null;
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return sum / ratings.length;
}
