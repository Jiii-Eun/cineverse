import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = '데이터를 불러오지 못했습니다.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-6 py-12">
      <Text variant="subtitle">오류가 발생했습니다</Text>
      <Text variant="caption" className="text-center">
        {message}
      </Text>
      {onRetry ? <Button label="다시 시도" onPress={onRetry} /> : null}
    </View>
  );
}
