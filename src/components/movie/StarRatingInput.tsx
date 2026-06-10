import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import {
  formatDisplayRating,
  getHalfStarValue,
  getStarIconName,
  STAR_COUNT,
} from '@/utils/starRating';

interface StarRatingInputProps {
  rating: number | null;
  onSelect: (tmdbValue: number) => void;
  size: number;
  gap?: number;
  disabled?: boolean;
}

export function StarRatingInput({
  rating,
  onSelect,
  size,
  gap = 0,
  disabled = false,
}: StarRatingInputProps) {
  const current = rating ?? 0;

  return (
    <View className="flex-row items-center" style={{ gap }}>
      {Array.from({ length: STAR_COUNT }, (_, index) => {
        const starIndex = index + 1;
        const iconName = getStarIconName(current, starIndex);

        return (
          <View
            key={starIndex}
            style={{ width: size, height: size, position: 'relative' }}
          >
            <View className="absolute inset-0 flex-row" style={{ zIndex: 1 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${formatDisplayRating(getHalfStarValue(starIndex, false))}점`}
                disabled={disabled}
                onPress={() => onSelect(getHalfStarValue(starIndex, false))}
                style={{ flex: 1 }}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${formatDisplayRating(getHalfStarValue(starIndex, true))}점`}
                disabled={disabled}
                onPress={() => onSelect(getHalfStarValue(starIndex, true))}
                style={{ flex: 1 }}
              />
            </View>
            <Ionicons
              name={iconName}
              size={size}
              color={iconName === 'star-outline' ? '#6B7280' : '#FBBF24'}
              style={{ position: 'absolute', left: 0, top: 0 }}
              pointerEvents="none"
            />
          </View>
        );
      })}
    </View>
  );
}
