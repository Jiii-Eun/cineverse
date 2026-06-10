import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export const STAR_COUNT = 5;

/** TMDB 평점: 0.5~10 (0.5 단위). UI 5점 만점은 value / 2 */
export function tmdbToDisplay(value: number) {
  return value / 2;
}

export function formatDisplayRating(value: number) {
  const display = tmdbToDisplay(value);
  return Number.isInteger(display) ? String(display) : display.toFixed(1);
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
