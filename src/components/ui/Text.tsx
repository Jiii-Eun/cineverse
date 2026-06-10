import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
}

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  title: 'text-2xl font-bold text-primary',
  subtitle: 'text-lg font-semibold text-primary',
  body: 'text-base text-primary',
  caption: 'text-sm text-muted',
};

export function Text({
  variant = 'body',
  className = '',
  ...props
}: TextProps) {
  return (
    <RNText className={`${variantClasses[variant]} ${className}`} {...props} />
  );
}
