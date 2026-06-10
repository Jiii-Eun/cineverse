import { ActivityIndicator, View } from 'react-native';

import { Text } from '@/components/ui/Text';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = '불러오는 중...' }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 py-12">
      <ActivityIndicator size="large" color="#8B5CF6" />
      <Text variant="caption">{message}</Text>
    </View>
  );
}
