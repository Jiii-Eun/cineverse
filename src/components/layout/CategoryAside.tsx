import { MaterialIcons } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { DESKTOP_SIDEBAR_WIDTH } from '@/constants/layout';

interface CategoryAsideProps {
  children: ReactNode;
  onClose?: () => void;
}

const asideStyle = {
  width: DESKTOP_SIDEBAR_WIDTH,
  height: '100%' as const,
};

export function CategoryAside({ children, onClose }: CategoryAsideProps) {
  const content = (
    <View
      style={[asideStyle, { minHeight: 0 }]}
      className="aside-panel h-full min-h-0 flex-col border-r border-white/5 bg-surface"
    >
      {onClose ? (
        <View className="shrink-0 flex-row justify-end px-2 pb-1 pt-2">
          <Pressable
            onPress={onClose}
            className="min-h-[36px] min-w-[36px] items-center justify-center rounded-button active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="카테고리 닫기"
          >
            <MaterialIcons name="view-sidebar" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : null}
      <View className="aside-panel-scroll min-h-0 flex-1">{children}</View>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <View
        // @ts-expect-error RN Web semantic element
        accessibilityRole="complementary"
        style={asideStyle}
      >
        {content}
      </View>
    );
  }

  return content;
}
