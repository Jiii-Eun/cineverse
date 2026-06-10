import { Slot, usePathname, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppHeader } from '@/components/layout/AppHeader';
import { Text } from '@/components/ui/Text';
import { useIsLoggedIn } from '@/stores/authStore';

const SUB_TABS = [
  { href: '/favorites/watchlist', label: '찜목록' },
  { href: '/favorites/lists', label: '폴더' },
  { href: '/favorites/rated', label: '리뷰한 영화' },
] as const;

function getHeader(pathname: string, isLoggedIn: boolean) {
  if (pathname.includes('/favorites/watchlist')) {
    return {
      title: '찜목록',
      subtitle: isLoggedIn
        ? '보고 싶은 영화를 하트로 모아보세요'
        : '로그인 후 이용할 수 있습니다',
    };
  }
  if (pathname.includes('/favorites/rated')) {
    return {
      title: '리뷰한 영화',
      subtitle: isLoggedIn
        ? '별점을 남긴 영화 목록입니다'
        : '로그인 후 이용할 수 있습니다',
    };
  }
  return {
    title: '폴더',
    subtitle: isLoggedIn
      ? '나만의 영화 폴더를 만들고 관리하세요'
      : '로그인 후 이용할 수 있습니다',
  };
}

export default function FavoritesLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const { title, subtitle } = getHeader(pathname, isLoggedIn);

  return (
    <View className="flex-1 bg-background">
      <AppHeader title={title} subtitle={subtitle} />

      <View className="flex-row border-b border-white/5 bg-surface">
        {SUB_TABS.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Pressable
              key={tab.href}
              onPress={() => router.push(tab.href)}
              className={`min-h-[44px] flex-1 items-center justify-center border-b-2 px-2 py-3 ${
                active ? 'border-primary' : 'border-transparent'
              }`}
            >
              <Text
                className={
                  active ? 'font-semibold text-primary' : 'text-muted'
                }
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Slot />
    </View>
  );
}
