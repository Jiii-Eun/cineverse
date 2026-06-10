import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CONTENT_BOTTOM_GAP,
  getTabBarTotalHeight,
} from '@/constants/layout';

export function useContentBottomPadding(withTabBar = true) {
  const insets = useSafeAreaInsets();

  if (!withTabBar) {
    return insets.bottom + CONTENT_BOTTOM_GAP;
  }

  return getTabBarTotalHeight(insets.bottom) + CONTENT_BOTTOM_GAP;
}
