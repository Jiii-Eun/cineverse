import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CONTENT_BOTTOM_GAP, TAB_BAR_HEIGHT } from '@/constants/layout';

export function useContentBottomPadding(withTabBar = true) {
  const insets = useSafeAreaInsets();
  const tabBar = withTabBar ? TAB_BAR_HEIGHT : 0;
  return tabBar + insets.bottom + CONTENT_BOTTOM_GAP;
}
