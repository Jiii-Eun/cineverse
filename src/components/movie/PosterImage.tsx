import { Image } from 'expo-image';
import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { getPosterUrl } from '@/services/tmdb';

interface PosterImageProps {
  posterPath: string | null;
  title: string;
  size?: 'w342' | 'w500' | 'w780';
  className?: string;
}

export function PosterImage({
  posterPath,
  title,
  size = 'w342',
  className = '',
}: PosterImageProps) {
  const uri = getPosterUrl(posterPath, size);

  if (!uri) {
    return (
      <View
        className={`items-center justify-center bg-elevated ${className}`}
        accessibilityLabel={`${title} 포스터 없음`}
      >
        <Text variant="caption" className="px-2 text-center">
          이미지 없음
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      className={className}
      contentFit="cover"
      accessibilityLabel={`${title} 포스터`}
      transition={200}
    />
  );
}
