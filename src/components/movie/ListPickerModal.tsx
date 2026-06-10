import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAccountLists, useAddToList, useMoveToList } from '@/hooks/useAccountLists';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import {
  MOBILE_DRAWER_CLOSE_DURATION,
  MOBILE_DRAWER_OPEN_DURATION,
} from '@/constants/layout';

interface ListPickerModalProps {
  visible: boolean;
  movieId: number;
  fromListId?: number;
  onClose: () => void;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

const SHEET_HIDDEN_OFFSET = 420;
const LIST_MAX_HEIGHT = 320;
const DISMISS_DRAG_THRESHOLD = 96;
const DISMISS_VELOCITY = 900;

export function ListPickerModal({
  visible,
  movieId,
  fromListId,
  onClose,
  onSuccess,
  onError,
}: ListPickerModalProps) {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, error, refetch } = useAccountLists();
  const addToList = useAddToList();
  const moveToList = useMoveToList();
  const [mounted, setMounted] = useState(visible);
  const translateY = useSharedValue(SHEET_HIDDEN_OFFSET);
  const backdropOpacity = useSharedValue(0);
  const dragStartY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      void refetch();
    }
  }, [visible, refetch]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateY.value = SHEET_HIDDEN_OFFSET;
      backdropOpacity.value = 0;
      translateY.value = withTiming(0, {
        duration: MOBILE_DRAWER_OPEN_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      backdropOpacity.value = withTiming(1, {
        duration: MOBILE_DRAWER_OPEN_DURATION,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    if (!mounted) return;

    translateY.value = withTiming(
      SHEET_HIDDEN_OFFSET,
      {
        duration: MOBILE_DRAWER_CLOSE_DURATION,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
        }
      },
    );
    backdropOpacity.value = withTiming(0, {
      duration: MOBILE_DRAWER_CLOSE_DURATION,
      easing: Easing.in(Easing.cubic),
    });
  }, [visible, mounted, translateY, backdropOpacity]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY(4)
        .failOffsetX([-24, 24])
        .onStart(() => {
          dragStartY.value = translateY.value;
        })
        .onUpdate((event) => {
          const nextY = dragStartY.value + event.translationY;
          translateY.value = Math.max(0, nextY);
          backdropOpacity.value = Math.max(
            0,
            1 - translateY.value / SHEET_HIDDEN_OFFSET,
          );
        })
        .onEnd((event) => {
          const shouldDismiss =
            translateY.value > DISMISS_DRAG_THRESHOLD ||
            event.velocityY > DISMISS_VELOCITY;

          if (shouldDismiss) {
            translateY.value = withTiming(
              SHEET_HIDDEN_OFFSET,
              {
                duration: MOBILE_DRAWER_CLOSE_DURATION,
                easing: Easing.in(Easing.cubic),
              },
              (finished) => {
                if (finished) {
                  runOnJS(onClose)();
                }
              },
            );
            backdropOpacity.value = withTiming(0, {
              duration: MOBILE_DRAWER_CLOSE_DURATION,
              easing: Easing.in(Easing.cubic),
            });
            return;
          }

          translateY.value = withTiming(0, {
            duration: MOBILE_DRAWER_OPEN_DURATION,
            easing: Easing.out(Easing.cubic),
          });
          backdropOpacity.value = withTiming(1, {
            duration: MOBILE_DRAWER_OPEN_DURATION,
            easing: Easing.out(Easing.cubic),
          });
        }),
    [backdropOpacity, dragStartY, onClose, translateY],
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleSelect = async (listId: number) => {
    try {
      if (fromListId) {
        const result = await moveToList.mutateAsync({
          fromListId,
          toListId: listId,
          movieId,
        });
        if (result.alreadyExists) {
          onSuccess?.('이미 해당 폴더에 추가된 영화입니다.');
        } else {
          onSuccess?.('폴더로 이동했습니다.');
        }
      } else {
        const result = await addToList.mutateAsync({ listId, movieId });
        if (result.alreadyExists) {
          onSuccess?.('이미 해당 폴더에 추가된 영화입니다.');
        } else {
          onSuccess?.('폴더에 추가했습니다.');
        }
      }
      onClose();
    } catch (e) {
      onError?.(e instanceof Error ? e.message : '처리에 실패했습니다.');
    }
  };

  const lists = data?.results ?? [];
  const isBusy = addToList.isPending || moveToList.isPending;

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.overlay}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            backdropStyle,
            { backgroundColor: 'rgba(0,0,0,0.4)', pointerEvents: 'none' },
          ]}
        />

        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View
            className="w-full gap-3 rounded-t-card bg-surface px-4 pt-2"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <GestureDetector gesture={panGesture}>
              <View className="cursor-grab pb-3 pt-2 active:cursor-grabbing">
                <View className="mb-3 h-1 w-10 self-center rounded-full bg-muted/40" />
                <Text variant="subtitle">폴더 선택</Text>
              </View>
            </GestureDetector>

            {isLoading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="small" color="#8B5CF6" />
                <Text variant="caption" className="mt-2">
                  폴더 불러오는 중...
                </Text>
              </View>
            ) : null}

            {isError ? (
              <View className="mb-4 gap-3">
                <Text variant="caption" className="text-center text-muted">
                  {error instanceof Error
                    ? error.message
                    : '폴더 목록을 불러오지 못했습니다.'}
                </Text>
                <Button label="다시 시도" variant="outline" onPress={() => refetch()} />
              </View>
            ) : null}

            {!isLoading && !isError && lists.length === 0 ? (
              <Text variant="caption" className="mb-4 text-center text-muted">
                만든 폴더가 없습니다. 폴더 탭에서 먼저 만들어주세요.
              </Text>
            ) : null}

            {!isLoading && !isError && lists.length > 0 ? (
              <ScrollView
                style={{ maxHeight: LIST_MAX_HEIGHT }}
                contentContainerStyle={{ gap: 8 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {lists.map((list) => (
                  <Pressable
                    key={list.id}
                    onPress={() => handleSelect(list.id)}
                    disabled={isBusy}
                    className="min-h-[52px] flex-row items-center justify-between rounded-button border border-primary/15 bg-elevated px-4 py-3 web:hover:border-primary/40"
                  >
                    <Text variant="body" className="mr-3 shrink font-semibold">
                      {list.name}
                    </Text>
                    <Text variant="caption" className="shrink-0">
                      {list.item_count}편
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}

            <Button label="닫기" variant="outline" onPress={onClose} />
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
  },
});
