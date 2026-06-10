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
        <h1 className="m-0 cursor-pointer bg-transparent text-xl font-bold tracking-widest text-foreground">
          CINEVERSE
        </h1>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => router.push('/')}
      className={className}
      accessibilityRole="header"
      accessibilityLabel="CINEVERSE 홈으로 이동"
    >
      <Text variant="logo">CINEVERSE</Text>
    </Pressable>
  );
}
