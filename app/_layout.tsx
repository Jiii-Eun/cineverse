import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { HeaderAuthActions } from '@/components/auth/HeaderAuthActions';
import { ToastHost } from '@/components/ui/ToastHost';
import { APP_HEADER_HEIGHT } from '@/constants/layout';
import { queryClient } from '@/lib/queryClient';
import { View } from 'react-native';

const DARK_HEADER = {
  headerTintColor: '#FFFFFF',
  headerStyle: {
    backgroundColor: '#0D0D12',
    height: APP_HEADER_HEIGHT,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    borderBottomWidth: 1,
  },
  headerTitleStyle: { color: '#FFFFFF' },
  headerRight: () => (
    <View className="mr-4 md:mr-6">
      <HeaderAuthActions />
    </View>
  ),
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <View className="flex-1">
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D0D12' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            ...DARK_HEADER,
          }}
        />
        <Stack.Screen
          name="list/[id]"
          options={{
            headerShown: true,
            headerTitle: '폴더',
            ...DARK_HEADER,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            headerShown: true,
            headerTitle: '로그인',
            presentation: 'modal',
            ...DARK_HEADER,
            headerRight: undefined,
          }}
        />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
      </Stack>
      <ToastHost />
      </View>
    </QueryClientProvider>
  );
}
