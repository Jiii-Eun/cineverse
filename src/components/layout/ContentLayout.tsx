import { type ReactNode, useEffect, useState } from 'react';
import { Modal, Pressable, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CategoryAside } from '@/components/layout/CategoryAside';
import { CategorySidebar } from '@/components/layout/CategorySidebar';
import { SidebarToggleButton } from '@/components/layout/SidebarToggleButton';
import {
  DESKTOP_ASIDE_CLOSE_DURATION,
  DESKTOP_ASIDE_OPEN_DURATION,
  DESKTOP_SIDEBAR_WIDTH,
  MOBILE_DRAWER_CLOSE_DURATION,
  MOBILE_DRAWER_OPEN_DURATION,
  MOBILE_DRAWER_WIDTH,
  TABLET_BREAKPOINT,
} from '@/constants/layout';
import { useGenres } from '@/hooks/useGenres';
import { useUiStore } from '@/stores/uiStore';

interface ContentLayoutProps {
  children: ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= TABLET_BREAKPOINT;
  const { data } = useGenres();

  const selectedFeed = useUiStore((s) => s.selectedFeed);
  const selectedGenreId = useUiStore((s) => s.selectedGenreId);
  const mobileMenuOpen = useUiStore((s) => s.mobileMenuOpen);
  const desktopAsideOpen = useUiStore((s) => s.desktopAsideOpen);
  const setSelectedFeed = useUiStore((s) => s.setSelectedFeed);
  const setSelectedGenreId = useUiStore((s) => s.setSelectedGenreId);
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);
  const setDesktopAsideOpen = useUiStore((s) => s.setDesktopAsideOpen);

  const [drawerMounted, setDrawerMounted] = useState(false);

  const genres = data?.genres ?? [];
  const translateX = useSharedValue(-MOBILE_DRAWER_WIDTH);
  const backdropOpacity = useSharedValue(0);
  const asideWidth = useSharedValue(
    desktopAsideOpen ? DESKTOP_SIDEBAR_WIDTH : 0,
  );

  const closeDrawer = () => setMobileMenuOpen(false);
  const closeDesktopAside = () => setDesktopAsideOpen(false);
  const openDesktopAside = () => setDesktopAsideOpen(true);

  useEffect(() => {
    if (isDesktop) {
      setDrawerMounted(false);
      return;
    }

    if (mobileMenuOpen) {
      setDrawerMounted(true);
      translateX.value = -MOBILE_DRAWER_WIDTH;
      backdropOpacity.value = 0;
      translateX.value = withTiming(0, {
        duration: MOBILE_DRAWER_OPEN_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      backdropOpacity.value = withTiming(1, {
        duration: MOBILE_DRAWER_OPEN_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    if (!drawerMounted) return;

    translateX.value = withTiming(
      -MOBILE_DRAWER_WIDTH,
      {
        duration: MOBILE_DRAWER_CLOSE_DURATION,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setDrawerMounted)(false);
        }
      },
    );
    backdropOpacity.value = withTiming(0, {
      duration: MOBILE_DRAWER_CLOSE_DURATION,
      easing: Easing.in(Easing.cubic),
    });
  }, [
    mobileMenuOpen,
    isDesktop,
    drawerMounted,
    translateX,
    backdropOpacity,
  ]);

  useEffect(() => {
    if (!isDesktop) {
      asideWidth.value = 0;
      return;
    }

    asideWidth.value = withTiming(
      desktopAsideOpen ? DESKTOP_SIDEBAR_WIDTH : 0,
      {
        duration: desktopAsideOpen
          ? DESKTOP_ASIDE_OPEN_DURATION
          : DESKTOP_ASIDE_CLOSE_DURATION,
        easing: desktopAsideOpen
          ? Easing.out(Easing.cubic)
          : Easing.in(Easing.cubic),
      },
    );
  }, [desktopAsideOpen, isDesktop, asideWidth]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const asideHostStyle = useAnimatedStyle(() => ({
    width: asideWidth.value,
    overflow: 'hidden',
  }));

  const sidebar = (
    <CategorySidebar
      genres={genres}
      selectedFeed={selectedFeed}
      selectedGenreId={selectedGenreId}
      onSelectFeed={(feed) => {
        setSelectedFeed(feed);
        closeDrawer();
      }}
      onSelectGenre={(id) => {
        setSelectedGenreId(id);
        closeDrawer();
      }}
      compact={isDesktop}
    />
  );

  return (
    <View className="relative min-h-0 flex-1 flex-row">
      {isDesktop ? (
        <Animated.View
          className="aside-panel-host min-h-0 self-stretch"
          style={asideHostStyle}
        >
          <CategoryAside onClose={closeDesktopAside}>{sidebar}</CategoryAside>
        </Animated.View>
      ) : null}

      <View className="relative min-w-0 flex-1">
        {isDesktop && !desktopAsideOpen ? (
          <SidebarToggleButton
            accessibilityLabel="카테고리 열기"
            variant="expand"
            onPress={openDesktopAside}
            className="absolute left-3 top-3 z-20"
          />
        ) : null}
        {children}
      </View>

      {!isDesktop ? (
        <Modal
          visible={drawerMounted}
          transparent
          animationType="none"
          onRequestClose={closeDrawer}
        >
          <View className="flex-1">
            <Animated.View
              style={[
                backdropStyle,
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
              ]}
            >
              <Pressable
                className="flex-1 bg-black/70"
                onPress={closeDrawer}
                accessibilityLabel="메뉴 닫기"
              />
            </Animated.View>

            <Animated.View
              style={[
                drawerStyle,
                {
                  width: MOBILE_DRAWER_WIDTH,
                  height: '100%',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  zIndex: 2,
                },
              ]}
            >
              <View className="aside-panel h-full min-h-0 flex-col border-r border-white/5 bg-surface">
                <View className="aside-panel-scroll min-h-0 flex-1">{sidebar}</View>
              </View>
            </Animated.View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
