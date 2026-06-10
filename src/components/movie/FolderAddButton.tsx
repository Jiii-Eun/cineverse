import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ListPickerModal } from '@/components/movie/ListPickerModal';
import { Text } from '@/components/ui/Text';
import { useAccountLists, useIsMovieInAnyList } from '@/hooks/useAccountLists';
import { useToastStore } from '@/stores/toastStore';
import { guardLogin } from '@/utils/requireLogin';

interface FolderAddButtonProps {
  movieId: number;
  inline?: boolean;
  hero?: boolean;
}

export function FolderAddButton({
  movieId,
  inline = false,
  hero = false,
}: FolderAddButtonProps) {
  const [visible, setVisible] = useState(false);
  const { data: lists } = useAccountLists();
  const trackListStatus = hero || inline || visible;
  const { data: isInAnyList = false } = useIsMovieInAnyList(movieId, {
    enabled: trackListStatus,
  });
  const showToast = useToastStore((s) => s.show);

  const handlePress = () => {
    if (!guardLogin()) return;

    if (!lists?.results.length) {
      showToast('만든 폴더가 없습니다. 폴더 탭에서 먼저 만들어주세요.');
      return;
    }

    setVisible(true);
  };

  const iconColor = isInAnyList ? '#8B5CF6' : '#FFFFFF';

  const icon = (
    <Ionicons
      name={isInAnyList ? 'bookmark' : 'bookmark-outline'}
      size={inline || hero ? 22 : 18}
      color={iconColor}
    />
  );

  if (hero) {
    return (
      <>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="보관"
          onPress={handlePress}
          className="min-h-[40px] min-w-[40px] items-center justify-center rounded-button bg-elevated"
        >
          {icon}
        </Pressable>

        {visible ? (
          <ListPickerModal
            visible={visible}
            movieId={movieId}
            onClose={() => setVisible(false)}
            onSuccess={(message) => showToast(message)}
            onError={(message) => showToast(message)}
          />
        ) : null}
      </>
    );
  }

  if (inline) {
    return (
      <>
        <View className="items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="보관"
            onPress={handlePress}
            className="h-12 w-12 items-center justify-center rounded-full bg-elevated"
          >
            {icon}
          </Pressable>
          <Text variant="caption">보관</Text>
        </View>

        {visible ? (
          <ListPickerModal
            visible={visible}
            movieId={movieId}
            onClose={() => setVisible(false)}
            onSuccess={(message) => showToast(message)}
            onError={(message) => showToast(message)}
          />
        ) : null}
      </>
    );
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="보관"
        onPress={handlePress}
        className="min-h-[36px] min-w-[36px] items-center justify-center rounded-full bg-black/50"
      >
        {icon}
      </Pressable>

      {visible ? (
        <ListPickerModal
          visible={visible}
          movieId={movieId}
          onClose={() => setVisible(false)}
          onSuccess={(message) => showToast(message)}
          onError={(message) => showToast(message)}
        />
      ) : null}
    </>
  );
}
