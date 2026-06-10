import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable } from 'react-native';

import {
  useIsInWatchlistResolved,
  useToggleWatchlist,
} from '@/hooks/useWatchlist';
import { useToastStore } from '@/stores/toastStore';
import { guardLogin } from '@/utils/requireLogin';

interface WatchlistHeartProps {
  movieId: number;
  inline?: boolean;
  pinned?: boolean;
}

export function WatchlistHeart({
  movieId,
  inline = false,
  pinned = false,
}: WatchlistHeartProps) {
  const serverFavorite = useIsInWatchlistResolved(movieId, {
    preferAccountStates: inline,
  });
  const { mutate, isPending } = useToggleWatchlist();
  const showToast = useToastStore((s) => s.show);
  const [optimisticFavorite, setOptimisticFavorite] = useState<boolean | null>(null);

  const isFavorite = optimisticFavorite ?? serverFavorite;

  const handlePress = () => {
    if (!guardLogin() || isPending) return;

    const nextFavorite = !isFavorite;
    setOptimisticFavorite(nextFavorite);

    mutate(
      { movieId, favorite: nextFavorite },
      {
        onSuccess: () => {
          setOptimisticFavorite(null);
        },
        onError: (error) => {
          setOptimisticFavorite(null);
          showToast(
            error instanceof Error ? error.message : '찜하기 처리에 실패했습니다.',
          );
        },
      },
    );
  };

  const iconColor = isFavorite ? '#EC4899' : '#FFFFFF';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? '찜 해제' : '찜하기'}
      onPress={handlePress}
      disabled={isPending}
      className={
        inline
          ? 'items-center justify-center'
          : pinned
            ? 'min-h-[36px] min-w-[36px] items-center justify-center rounded-full bg-black/50'
            : 'absolute right-2 top-2 z-10 min-h-[36px] min-w-[36px] items-center justify-center rounded-full bg-black/50'
      }
    >
      <Ionicons
        name={isFavorite ? 'heart' : 'heart-outline'}
        size={inline ? 22 : 18}
        color={iconColor}
      />
    </Pressable>
  );
}
