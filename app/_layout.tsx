import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { queryClient } from '@/lib/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: true,
            headerTitle: '영화 상세',
            headerTintColor: '#1E3A5F',
            headerStyle: { backgroundColor: '#F8F6F3' },
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
