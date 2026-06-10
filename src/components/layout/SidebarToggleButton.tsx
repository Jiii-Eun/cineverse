import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, type PressableProps } from 'react-native';

interface SidebarToggleButtonProps extends Omit<PressableProps, 'children'> {
  accessibilityLabel: string;
  className?: string;
  /** aside 닫기: 패널 아이콘 / aside 열기: → */
  variant?: 'collapse' | 'expand';
}

export function SidebarToggleButton({
  accessibilityLabel,
  className = '',
  variant = 'collapse',
  ...props
}: SidebarToggleButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`min-h-[40px] min-w-[40px] items-center justify-center rounded-button border border-white/10 bg-surface active:opacity-80 ${className}`}
      {...props}
    >
      {variant === 'expand' ? (
        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
      ) : (
        <MaterialCommunityIcons
          name="page-layout-sidebar-left"
          size={20}
          color="#FFFFFF"
        />
      )}
    </Pressable>
  );
}
