import { useRouter } from 'expo-router';
import { Platform, Pressable } from 'react-native';

import { Text } from '@/components/ui/Text';

interface LogoHomeLinkProps {
  className?: string;
}

export function LogoHomeLink({ className = '' }: LogoHomeLinkProps) {
  const router = useRouter();

  if (Platform.OS === 'web') {
    return (
      <Pressable onPress={() => router.push('/')} className={className}>
        <h1 className="m-0 block cursor-pointer bg-transparent text-lg font-bold tracking-wider text-foreground md:text-xl md:tracking-widest">
          CINEVERSE
        </h1>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push('/')}
      className={`items-center ${className}`}
      accessibilityRole="header"
      accessibilityLabel="CINEVERSE 홈으로 이동"
    >
      <Text variant="logo">CINEVERSE</Text>
    </Pressable>
  );
}
