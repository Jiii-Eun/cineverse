import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'logo';
}

const variantClasses: Record<NonNullable<TextProps['variant']>, string> = {
  logo: 'text-lg font-bold tracking-wider text-foreground md:text-xl md:tracking-widest',
  title: 'text-xl font-bold text-foreground md:text-2xl',
  subtitle: 'text-base font-semibold text-foreground md:text-lg',
  body: 'text-sm text-foreground md:text-base',
  caption: 'text-xs text-muted md:text-sm',
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
