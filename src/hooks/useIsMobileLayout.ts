import { useWindowDimensions } from 'react-native';

import { TABLET_BREAKPOINT } from '@/constants/layout';

export function useIsMobileLayout() {
  const { width } = useWindowDimensions();
  return width < TABLET_BREAKPOINT;
}
