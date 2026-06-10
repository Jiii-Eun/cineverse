import { View } from 'react-native';

import { RatingBadge } from '@/components/movie/RatingBadge';

interface MovieCardRatingPinProps {
  rating: number;
}

export function MovieCardRatingPin({ rating }: MovieCardRatingPinProps) {
  return (
    <View
      className="absolute z-[3]"
      style={{ top: 12, left: 12, pointerEvents: 'box-none' }}
    >
      <RatingBadge rating={rating} compact dark />
    </View>
  );
}
