import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

interface RatingBadgeProps {
  rating: number;
}

export function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <View className="self-start rounded-full bg-accent/10 px-2 py-0.5">
      <Text variant="caption" className="font-semibold text-accent">
        ★ {rating.toFixed(1)}
      </Text>
    </View>
  );
}
