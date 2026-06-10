import { Platform } from 'react-native';

/** TabBarIcon 래퍼(28) + 라벨 margin(2) + lineHeight(14) — app/(tabs)/_layout.tsx 와 동기화 */
export const TAB_BAR_ITEM_CONTENT_HEIGHT = 44;

/** @deprecated TAB_BAR_ITEM_CONTENT_HEIGHT 사용 */
export const TAB_BAR_CONTENT_HEIGHT = TAB_BAR_ITEM_CONTENT_HEIGHT;

/** tabBarStyle paddingTop / paddingBottom (웹·네이티브 동일 값) */
export const TAB_BAR_VERTICAL_PADDING = 12;

export function getTabBarTotalHeight(bottomInset = 0) {
  const safeBottom = Platform.OS === 'web' ? 0 : bottomInset;
  return (
    TAB_BAR_ITEM_CONTENT_HEIGHT + TAB_BAR_VERTICAL_PADDING * 2 + safeBottom
  );
}

/** @deprecated TAB_BAR_CONTENT_HEIGHT + safe area bottom 과 동기화 필요 */
export const TAB_BAR_HEIGHT = TAB_BAR_CONTENT_HEIGHT;

/** HomeHeader / AppHeader / Stack nav 공통 높이 */
export const APP_HEADER_HEIGHT = 68;

export const CONTENT_BOTTOM_GAP = 16;

export const MOBILE_DRAWER_WIDTH = 260;

export const MOBILE_DRAWER_OPEN_DURATION = 280;
export const MOBILE_DRAWER_CLOSE_DURATION = 150;

export const DESKTOP_ASIDE_OPEN_DURATION = 280;
export const DESKTOP_ASIDE_CLOSE_DURATION = 150;

/** md 이상 aside 너비 */
export const DESKTOP_SIDEBAR_WIDTH = 160;

export const TABLET_BREAKPOINT = 768;

/** lg — PC 그리드 4열 */
export const DESKTOP_BREAKPOINT = 1024;

/** 3열 진입 / 2열 이탈 (사이 여유 → 리사이즈 중 깜빡임 방지) */
export const GRID_TABLET_ENTER_WIDTH = 520;
export const GRID_TABLET_EXIT_WIDTH = 440;

/** 4열 진입 / 3열 이탈 */
export const GRID_DESKTOP_ENTER_WIDTH = 1000;
export const GRID_DESKTOP_EXIT_WIDTH = 900;

export function getInitialMovieGridColumns(viewportWidth: number) {
  if (viewportWidth >= DESKTOP_BREAKPOINT) return 4;
  if (viewportWidth >= TABLET_BREAKPOINT) return 3;
  return 2;
}

/**
 * 모바일 2열 · 태블릿 3열 · PC 4열
 * 히스테리시스 적용 — 임계값 근처에서 열 수가 왔다갔다 하지 않음
 */
export function resolveMovieGridColumns(
  containerWidth: number,
  prevColumns: number,
) {
  if (containerWidth <= 0) return Math.max(2, prevColumns);

  if (prevColumns >= 4) {
    if (containerWidth >= GRID_DESKTOP_EXIT_WIDTH) return 4;
    if (containerWidth >= GRID_TABLET_EXIT_WIDTH) return 3;
    return 2;
  }

  if (prevColumns === 3) {
    if (containerWidth >= GRID_DESKTOP_ENTER_WIDTH) return 4;
    if (containerWidth >= GRID_TABLET_EXIT_WIDTH) return 3;
    return 2;
  }

  if (containerWidth >= GRID_DESKTOP_ENTER_WIDTH) return 4;
  if (containerWidth >= GRID_TABLET_ENTER_WIDTH) return 3;
  return 2;
}

/** 가로 스크롤 행 compact 카드 너비 */
export const MOVIE_CARD_COMPACT_WIDTH = 188;
