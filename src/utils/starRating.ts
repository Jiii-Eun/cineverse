import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export const STAR_COUNT = 5;

/** TMDB 평점 1~10, 별 반칸 = 1점 */
export function formatDisplayRating(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function getStarIconName(
  rating: number,
  starIndex: number,
): ComponentProps<typeof Ionicons>['name'] {
  const full = starIndex * 2;
  const half = starIndex * 2 - 1;
  if (rating >= full) return 'star';
  if (rating >= half) return 'star-half';
  return 'star-outline';
}

export function getHalfStarValue(starIndex: number, isRightHalf: boolean) {
  return starIndex * 2 - (isRightHalf ? 0 : 1);
}
