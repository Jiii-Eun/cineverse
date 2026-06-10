import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <View className="border-b border-primary/10 bg-surface px-4 py-5 md:px-8">
      <Text variant="title">{title}</Text>
      {subtitle ? (
        <Text variant="caption" className="mt-1">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
