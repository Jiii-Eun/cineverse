import { useEffect, useState } from 'react';
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
  const queryRating = useUserMovieRating(movieId);
  const [pendingRating, setPendingRating] = useState<number | null | undefined>(
    undefined,
  );
  const { mutate: rate, isPending: isRating } = useRateMovie(movieId);
  const { mutate: removeRating, isPending: isRemoving } =
    useDeleteMovieRating(movieId);

  const displayRating =
    pendingRating !== undefined ? pendingRating : (queryRating ?? null);

  useEffect(() => {
    if (
      pendingRating !== undefined &&
      (queryRating ?? null) === pendingRating
    ) {
      setPendingRating(undefined);
    }
  }, [pendingRating, queryRating]);

  const handleSelect = (value: number) => {
    if (!guardLogin()) return;

    if (displayRating === value) {
      setPendingRating(null);
      removeRating(undefined, {
        onError: () => setPendingRating(undefined),
        onSettled: () => setPendingRating(undefined),
      });
      return;
    }

    setPendingRating(value);
    rate(value, {
      onError: () => setPendingRating(undefined),
      onSettled: () => setPendingRating(undefined),
    });
  };

  const disabled = isRating || isRemoving;

  if (inline) {
    return (
      <View className="items-center gap-1">
        <View className="h-12 w-full items-center justify-center">
          <StarRatingInput
            rating={displayRating}
            onSelect={handleSelect}
            size={24}
            gap={2}
            disabled={disabled}
          />
        </View>
        <Text variant="caption">
          {displayRating
            ? `내 평점 ${formatDisplayRating(displayRating)}`
            : '평점'}
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3 rounded-card bg-card p-4">
      <View className="flex-row items-center justify-between">
        <Text variant="subtitle">내 별점</Text>
        {displayRating ? (
          <Text variant="caption" className="text-rating">
            {formatDisplayRating(displayRating)} / 10
          </Text>
        ) : null}
      </View>
      <View className="items-center">
        <StarRatingInput
          rating={displayRating}
          onSelect={handleSelect}
          size={28}
          gap={4}
          disabled={disabled}
        />
      </View>
      {displayRating ? (
        <Pressable
          onPress={() => {
            if (!guardLogin()) return;
            setPendingRating(null);
            removeRating(undefined, {
              onError: () => setPendingRating(undefined),
              onSettled: () => setPendingRating(undefined),
            });
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
