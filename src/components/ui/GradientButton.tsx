import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, type PressableProps, View } from 'react-native';

import { Text } from '@/components/ui/Text';

interface GradientButtonProps extends PressableProps {
  label: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

export function GradientButton({
  label,
  icon,
  compact = false,
  className = '',
  disabled,
  ...props
}: GradientButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={`overflow-hidden rounded-button ${disabled ? 'opacity-50' : 'active:opacity-90'} ${className}`}
      {...props}
    >
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minHeight: compact ? 40 : 48,
          paddingHorizontal: compact ? 16 : 24,
          paddingVertical: compact ? 8 : 12,
        }}
      >
        {icon ? <View>{icon}</View> : null}
        <Text className="font-semibold text-foreground">{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}
