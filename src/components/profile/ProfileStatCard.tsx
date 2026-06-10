import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Text } from '@/components/ui/Text';

const LINK_COLOR = '#8B5CF6';

interface ProfileStatCardProps {
  label: string;
  value: string;
  href: '/favorites/watchlist' | '/favorites/rated' | '/favorites/lists';
}

export function ProfileStatCard({ label, value, href }: ProfileStatCardProps) {
  const router = useRouter();

  return (
    <View className="flex-1">
      <View
        className="items-center justify-center rounded-card bg-card"
        style={{ minHeight: 100, paddingVertical: 24, paddingHorizontal: 12 }}
      >
        <Text className="text-xl font-bold text-primary">{value}</Text>
        <Text variant="caption" className="mt-1 text-center">
          {label}
        </Text>
      </View>

      <View
        className="flex-row justify-end"
        style={{ paddingTop: 6, paddingHorizontal: 12 }}
      >
        <Pressable
          onPress={() => router.push(href)}
          accessibilityRole="link"
          accessibilityLabel={`${label} 보러가기`}
          className="active:opacity-80"
          hitSlop={8}
        >
          <Text
            className="font-semibold"
            style={{ color: LINK_COLOR, fontSize: 11 }}
          >
            보러가기{'>'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
