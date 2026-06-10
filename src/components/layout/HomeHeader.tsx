import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, View, useWindowDimensions } from 'react-native';

import { HeaderAuthActions } from '@/components/auth/HeaderAuthActions';
import { LogoHomeLink } from '@/components/layout/LogoHomeLink';
import { TABLET_BREAKPOINT, APP_HEADER_HEIGHT } from '@/constants/layout';
import { useUiStore } from '@/stores/uiStore';

export function HomeHeader() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < TABLET_BREAKPOINT;
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);

  const icons = (
    <View className="flex-row items-center gap-1">
      <Pressable
        onPress={() => router.push('/search')}
        className="min-h-[44px] min-w-[44px] items-center justify-center"
        accessibilityLabel="검색"
      >
        <Ionicons name="search-outline" size={22} color="#FFFFFF" />
      </Pressable>
      <HeaderAuthActions />
    </View>
  );

  const headerClass =
    'flex-row items-center bg-background px-4 py-3 md:px-6';

  if (!isMobile) {
    return (
      <View
        className={`${headerClass} justify-between`}
        style={{ minHeight: APP_HEADER_HEIGHT }}
      >
        <LogoHomeLink />
        {icons}
      </View>
    );
  }

  return (
    <View className={headerClass} style={{ minHeight: APP_HEADER_HEIGHT }}>
      <Pressable
        onPress={() => setMobileMenuOpen(true)}
        className="min-h-[44px] min-w-[44px] items-center justify-center"
        accessibilityLabel="메뉴 열기"
      >
        <Ionicons name="menu" size={24} color="#FFFFFF" />
      </Pressable>
      <LogoHomeLink className="flex-1 text-center" />
      {icons}
    </View>
  );
}
