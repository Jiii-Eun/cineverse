import { Image } from 'expo-image';
import { ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { horizontalTouchScrollStyle } from '@/constants/scroll';
import { getProfileUrl } from '@/services/tmdb/client';
import type { CastMember } from '@/types/movie';

interface MovieCastSectionProps {
  cast: CastMember[];
}

export function MovieCastSection({ cast }: MovieCastSectionProps) {
  const topCast = cast.slice(0, 15);
  if (topCast.length === 0) return null;

  return (
    <View className="gap-3">
      <Text variant="subtitle">출연</Text>
      <ScrollView
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        style={horizontalTouchScrollStyle}
        contentContainerClassName="gap-3"
      >
        {topCast.map((person) => {
          const uri = getProfileUrl(person.profile_path, 'w185');
          return (
            <View key={person.id} className="w-24 items-center gap-2">
              {uri ? (
                <Image
                  source={{ uri }}
                  className="h-24 w-24 rounded-full bg-elevated"
                  contentFit="cover"
                />
              ) : (
                <View className="h-24 w-24 items-center justify-center rounded-full bg-elevated">
                  <Text variant="caption" className="text-center text-[10px]">
                    {person.name.slice(0, 2)}
                  </Text>
                </View>
              )}
              <Text
                numberOfLines={2}
                className="text-center text-xs font-medium text-foreground"
              >
                {person.name}
              </Text>
              <Text numberOfLines={2} className="text-center text-[10px] text-muted">
                {person.character}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
