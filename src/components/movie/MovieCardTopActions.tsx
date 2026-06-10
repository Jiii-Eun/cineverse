import { View } from 'react-native';

import { FolderAddButton } from '@/components/movie/FolderAddButton';
import { WatchlistHeart } from '@/components/movie/WatchlistHeart';

interface MovieCardTopActionsProps {
  movieId: number;
  /** 웹은 hover 오버레이 안, 네이티브는 포스터 우하단 */
  variant?: 'hover' | 'poster';
}

export function MovieCardTopActions({
  movieId,
  variant = 'hover',
}: MovieCardTopActionsProps) {
  const isPoster = variant === 'poster';

  return (
    <View
      className={`movie-card-actions flex-row items-center gap-1${
        isPoster ? ' movie-card-actions--poster' : ''
      }`}
      style={
        isPoster
          ? {
              position: 'absolute',
              bottom: 12,
              right: 12,
              zIndex: 1,
              pointerEvents: 'box-none',
            }
          : { pointerEvents: 'box-none' }
      }
    >
      <WatchlistHeart movieId={movieId} pinned />
      <FolderAddButton movieId={movieId} />
    </View>
  );
}
