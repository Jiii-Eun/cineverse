import { type ReactNode } from 'react';
import { Platform, View } from 'react-native';

import { MovieCardTopActions } from '@/components/movie/MovieCardTopActions';

interface MovieCardMetaOverlayProps {
  children: ReactNode;
  compact?: boolean;
  movieId?: number;
}

export function MovieCardMetaOverlay({
  children,
  compact = false,
  movieId,
}: MovieCardMetaOverlayProps) {
  return (
    <View
      className={`movie-card-overlay absolute inset-0 z-[1] overflow-hidden bg-black/85 ${
        compact ? 'px-2 py-3' : 'px-3 py-4'
      }`}
      style={
        Platform.OS !== 'web'
          ? {
              opacity: 0,
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
            }
          : {
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }
      }
    >
      <View className="min-h-0 w-full flex-1 items-center justify-center">
        {children}
      </View>
      {movieId != null ? (
        <View
          className="movie-card-hover-actions"
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 10,
            pointerEvents: 'box-none',
          }}
        >
          <MovieCardTopActions movieId={movieId} variant="hover" />
        </View>
      ) : null}
    </View>
  );
}
