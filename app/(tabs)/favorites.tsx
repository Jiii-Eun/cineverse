import { View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { useUiStore } from '@/stores/uiStore';

export default function FavoritesScreen() {
  const favorites = useUiStore((state) => state.favorites);

  return (
    <Screen>
      <AppHeader
        title="즐겨찾기"
        subtitle="마음에 드는 영화를 모아보세요"
      />
      {favorites.length === 0 ? (
        <EmptyState message="영화 상세에서 즐겨찾기를 추가해보세요." />
      ) : (
        <View className="flex-1 px-4 py-6 md:px-8">
          <Text variant="body">
            저장된 영화 {favorites.length}편 (상세 화면에서 추가 가능)
          </Text>
        </View>
      )}
    </Screen>
  );
}
