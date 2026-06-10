import { Image } from 'expo-image';
import { ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { horizontalTouchScrollStyle } from '@/constants/scroll';
import { getBackdropUrl, getPosterUrl } from '@/services/tmdb/client';
import type { MovieImage } from '@/types/movie';

interface MovieImagesSectionProps {
  backdrops: MovieImage[];
  posters: MovieImage[];
}

export function MovieImagesSection({ backdrops, posters }: MovieImagesSectionProps) {
  const images = [
    ...backdrops.slice(0, 8).map((image) => ({
      key: `backdrop-${image.file_path}`,
      uri: getBackdropUrl(image.file_path, 'w780'),
      width: 200,
      height: 112,
    })),
    ...posters.slice(0, 6).map((image) => ({
      key: `poster-${image.file_path}`,
      uri: getPosterUrl(image.file_path, 'w342'),
      width: 100,
      height: 150,
    })),
  ].filter((image) => image.uri);

  if (images.length === 0) return null;

  return (
    <View className="gap-3">
      <Text variant="subtitle">이미지</Text>
      <ScrollView
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        style={horizontalTouchScrollStyle}
        contentContainerClassName="gap-3"
      >
        {images.map((image) => (
          <Image
            key={image.key}
            source={{ uri: image.uri! }}
            style={{ width: image.width, height: image.height }}
            className="rounded-card bg-elevated"
            contentFit="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
}
