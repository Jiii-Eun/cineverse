import { View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useToastStore } from '@/stores/toastStore';

export function ToastHost() {
  const visible = useToastStore((s) => s.visible);
  const message = useToastStore((s) => s.message);

  if (!visible || !message) return null;

  return (
    <View
      className="absolute bottom-24 left-4 right-4 z-50 items-center md:bottom-8"
      style={{ pointerEvents: 'none' }}
    >
      <View className="max-w-md rounded-button border border-white/10 bg-surface px-4 py-3 shadow-lg">
        <Text className="text-center text-sm font-medium text-foreground">
          {message}
        </Text>
      </View>
    </View>
  );
}
