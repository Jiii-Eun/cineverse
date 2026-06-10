import { Platform, type ViewStyle } from 'react-native';

export const horizontalTouchScrollStyle: ViewStyle | undefined =
  Platform.OS === 'web'
    ? ({
        width: '100%',
        maxWidth: '100%',
        touchAction: 'pan-x',
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch',
      } as ViewStyle)
    : undefined;
