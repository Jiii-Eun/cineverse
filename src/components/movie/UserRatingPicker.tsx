import { Pressable, View } from 'react-native';

import { StarRatingInput } from '@/components/movie/StarRatingInput';
import { Text } from '@/components/ui/Text';
import {
  useDeleteMovieRating,
  useRateMovie,
  useUserMovieRating,
} from '@/hooks/useMovieRating';
import { formatDisplayRating } from '@/utils/starRating';
import { guardLogin } from '@/utils/requireLogin';

interface UserRatingPickerProps {
  movieId: number;
  inline?: boolean;
}

export function UserRatingPicker({ movieId, inline = false }: UserRatingPickerProps) {
  const userRating = useUserMovieRating(movieId);
  const { mutate: rate, isPending: isRating } = useRateMovie(movieId);
  const { mutate: removeRating, isPending: isRemoving } = useDeleteMovieRating(movieId);

  const handleSelect = (value: number) => {
    if (!guardLogin()) return;

    if (userRating === value) {
      removeRating();
      return;
    }

    rate(value);
  };

  const disabled = isRating || isRemoving;

  if (inline) {
    return (
      <View className="items-center gap-1">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-elevated">
          <StarRatingInput
            rating={userRating}
            onSelect={handleSelect}
            size={8}
            disabled={disabled}
          />
        </View>
        <Text variant="caption">
          {userRating ? `내 평점 ${formatDisplayRating(userRating)}` : '평점'}
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3 rounded-card bg-card p-4">
      <View className="flex-row items-center justify-between">
        <Text variant="subtitle">내 별점</Text>
        {userRating ? (
          <Text variant="caption" className="text-rating">
            {formatDisplayRating(userRating)} / 5
          </Text>
        ) : null}
      </View>
      <View className="items-center">
        <StarRatingInput
          rating={userRating}
          onSelect={handleSelect}
          size={28}
          gap={4}
          disabled={disabled}
        />
      </View>
      {userRating ? (
        <Pressable
          onPress={() => {
            if (!guardLogin()) return;
            removeRating();
          }}
          disabled={disabled}
          className="items-center py-1"
        >
          <Text variant="caption" className="text-accent">
            평점 삭제
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
