import { useCallback, useRef } from 'react';
import { Platform, type ScrollView } from 'react-native';

export function useDragScroll() {
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(0);
  const drag = useRef({ active: false, startX: 0, startScrollX: 0 });

  const onScroll = useCallback((event: { nativeEvent: { contentOffset: { x: number } } }) => {
    scrollX.current = event.nativeEvent.contentOffset.x;
  }, []);

  const webDragProps =
    Platform.OS === 'web'
      ? {
          onMouseDown: (event: { nativeEvent: { pageX: number } }) => {
            drag.current = {
              active: true,
              startX: event.nativeEvent.pageX,
              startScrollX: scrollX.current,
            };
          },
          onMouseMove: (event: { nativeEvent: { pageX: number } }) => {
            if (!drag.current.active) return;
            const delta = drag.current.startX - event.nativeEvent.pageX;
            scrollRef.current?.scrollTo({
              x: drag.current.startScrollX + delta,
              animated: false,
            });
          },
          onMouseUp: () => {
            drag.current.active = false;
          },
          onMouseLeave: () => {
            drag.current.active = false;
          },
        }
      : {};

  return { scrollRef, onScroll, webDragProps };
}
