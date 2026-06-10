import { Pressable, type PressableProps } from 'react-native';

import { Text } from '@/components/ui/Text';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'outline';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary active:opacity-80',
  outline: 'border border-primary bg-transparent active:opacity-80',
};

const labelClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'text-white',
  outline: 'text-primary',
};

export function Button({
  label,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={`min-h-[44px] items-center justify-center rounded-button px-4 py-3 ${variantClasses[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
      {...props}
    >
      <Text className={`font-semibold ${labelClasses[variant]}`}>{label}</Text>
    </Pressable>
  );
}
