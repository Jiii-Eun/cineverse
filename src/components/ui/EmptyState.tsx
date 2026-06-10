import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = '표시할 영화가 없습니다.',
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Text variant="subtitle">목록이 비어 있습니다</Text>
      <Text variant="caption" className="mt-2 text-center">
        {message}
      </Text>
    </View>
  );
}
