import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { MovieListSummary } from '@/types/movie';

interface FolderListCardProps {
  list: MovieListSummary;
  isDeleting: boolean;
  onDelete: (listId: number) => void;
}

export function FolderListCard({
  list,
  isDeleting,
  onDelete,
}: FolderListCardProps) {
  const router = useRouter();

  return (
    <View className="rounded-card border border-primary/10 bg-surface p-4">
      <View className="flex-row items-center gap-3">
        <Pressable
          className="min-w-0 flex-1"
          onPress={() => router.push(`/list/${list.id}`)}
          accessibilityRole="link"
          accessibilityLabel={`${list.name} 폴더 열기`}
        >
          <View className="flex-row items-center gap-2">
            <Text variant="subtitle" className="shrink">
              {list.name}
            </Text>
            <Text variant="caption" className="shrink-0">
              {list.item_count}편
            </Text>
          </View>
          <Text variant="caption" className="mt-1">
            {list.description?.trim() || '설명 없음'}
          </Text>
        </Pressable>
        <Button
          label="삭제"
          variant="destructive"
          size="compact"
          onPress={() => onDelete(list.id)}
          disabled={isDeleting}
        />
      </View>
    </View>
  );
}
