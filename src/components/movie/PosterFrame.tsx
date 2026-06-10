import { type ReactNode } from 'react';
import { View } from 'react-native';

interface PosterFrameProps {
  children: ReactNode;
  className?: string;
}

/** 포스터 영역 width:height = 2:3 */
export function PosterFrame({ children, className = '' }: PosterFrameProps) {
  return (
    <View
      className={`relative w-full shrink-0 overflow-hidden ${className}`}
      style={{ aspectRatio: 2 / 3, width: '100%' }}
    >
      {children}
    </View>
  );
}
