import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { HeaderAuthActions } from '@/components/auth/HeaderAuthActions';
import { LogoHomeLink } from '@/components/layout/LogoHomeLink';
import { APP_HEADER_HEIGHT } from '@/constants/layout';
import { useIsMobileLayout } from '@/hooks/useIsMobileLayout';
import { useUiStore } from '@/stores/uiStore';

export function HomeHeader() {
  const router = useRouter();
  const isMobile = useIsMobileLayout();
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);

  const searchButton = (
    <Pressable
      onPress={() => router.push('/search')}
      className="min-h-[44px] min-w-[44px] items-center justify-center"
      accessibilityLabel="검색"
    >
      <Ionicons name="search-outline" size={22} color="#FFFFFF" />
    </Pressable>
  );

  if (!isMobile) {
    return (
      <View
        className="flex-row items-center justify-between bg-background px-4 py-3 md:px-6"
        style={{ minHeight: APP_HEADER_HEIGHT }}
      >
        <LogoHomeLink />
        <View className="flex-row items-center gap-1">
          {searchButton}
          <HeaderAuthActions />
        </View>
      </View>
    );
  }

  return (
    <View className="bg-background px-4 pb-2 pt-3 md:px-6">
      <View className="mb-2 w-full items-center">
        <LogoHomeLink className="w-full items-center" />
      </View>
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => setMobileMenuOpen(true)}
          className="min-h-[44px] min-w-[44px] items-center justify-center"
          accessibilityLabel="메뉴 열기"
        >
          <Ionicons name="menu" size={24} color="#FFFFFF" />
        </Pressable>
        <View className="flex-row items-center gap-1">
          {searchButton}
          <HeaderAuthActions />
        </View>
      </View>
    </View>
  );
}
