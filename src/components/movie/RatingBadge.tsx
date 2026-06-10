import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

interface RatingBadgeProps {
  rating: number;
  compact?: boolean;
  dark?: boolean;
}

export function RatingBadge({
  rating,
  compact = false,
  dark = false,
}: RatingBadgeProps) {
  return (
    <View
      className={`flex-row items-center self-start rounded-chip ${
        dark ? 'bg-black/50 px-2 py-1' : 'bg-rating/15 px-2 py-0.5'
      } ${compact ? 'px-1.5' : ''}`}
    >
      <Text
        className={`font-semibold text-rating ${compact ? 'text-xs' : 'text-sm'}`}
      >
        ★ {rating.toFixed(1)}
      </Text>
    </View>
  );
}
