import { View } from 'react-native';

import { HeaderAuthActions } from '@/components/auth/HeaderAuthActions';
import { Text } from '@/components/ui/Text';
import { APP_HEADER_HEIGHT } from '@/constants/layout';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <View
      className="border-b border-white/5 bg-background px-4 py-3 md:px-6"
      style={{ minHeight: APP_HEADER_HEIGHT }}
    >
      <View className="min-h-[44px] flex-row items-center justify-between gap-4">
        <View className="min-w-0 flex-1 flex-row items-center gap-2 md:gap-3">
          <Text variant="title">{title}</Text>
          {subtitle ? (
            <Text variant="caption" className="shrink text-muted">
              {subtitle}
            </Text>
          ) : null}
        </View>
        <HeaderAuthActions />
      </View>
    </View>
  );
}
