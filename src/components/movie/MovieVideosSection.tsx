import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import type { MovieVideo } from '@/types/movie';

interface MovieVideosSectionProps {
  videos: MovieVideo[];
}

export function MovieVideosSection({ videos }: MovieVideosSectionProps) {
  const youtubeVideos = videos.filter(
    (video) => video.site === 'YouTube' && video.type === 'Trailer',
  );

  if (youtubeVideos.length === 0) return null;

  return (
    <View className="gap-3">
      <Text variant="subtitle">예고편</Text>
      {youtubeVideos.slice(0, 4).map((video) => (
        <Pressable
          key={video.id}
          onPress={() =>
            Linking.openURL(`https://www.youtube.com/watch?v=${video.key}`)
          }
          className="flex-row items-center gap-3 rounded-card bg-card p-4 active:opacity-80"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-elevated">
            <Ionicons name="play" size={18} color="#EC4899" />
          </View>
          <View className="flex-1">
            <Text className="font-medium text-foreground">{video.name}</Text>
            <Text variant="caption">YouTube에서 보기</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
