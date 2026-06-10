import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'logo';
}

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  logo: 'text-xl font-bold tracking-widest text-foreground',
  title: 'text-2xl font-bold text-foreground',
  subtitle: 'text-lg font-semibold text-foreground',
  body: 'text-base text-foreground',
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
