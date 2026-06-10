import { useState } from 'react';
import { View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { ListFolderHeaderTitle } from '@/components/layout/ListFolderHeaderTitle';
import { Screen } from '@/components/layout/Screen';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Text } from '@/components/ui/Text';
import {
  useAccountLists,
  useClearList,
  useListDetail,
  useRemoveFromList,
} from '@/hooks/useAccountLists';
import { useToastStore } from '@/stores/toastStore';

function parseListId(id: string | string[] | undefined): number {
  const raw = Array.isArray(id) ? id[0] : id;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const listId = parseListId(id);
  const showToast = useToastStore((s) => s.show);
  const { data, isLoading, isError, error, refetch } = useListDetail(listId);
  const { data: accountLists } = useAccountLists();
  const removeFromList = useRemoveFromList();
  const clearList = useClearList();
  const listSummary = accountLists?.results.find((list) => list.id === listId);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const listName = data?.name ?? listSummary?.name;
  const itemCount = data?.items.length ?? listSummary?.item_count;

  const headerOptions = {
    headerTitle: () => (
      <ListFolderHeaderTitle name={listName} itemCount={itemCount} />
    ),
  };

  const handleRemoveFromList = (movieId: number) => {
    removeFromList.mutate(
      { listId, movieId },
      {
        onSuccess: () => showToast('폴더에서 제거했습니다.'),
        onError: (e) =>
          showToast(
            e instanceof Error ? e.message : '폴더에서 제거하지 못했습니다.',
          ),
      },
    );
  };

  const handleConfirmClearAll = () => {
    clearList.mutate(listId, {
      onSuccess: () => {
        showToast('폴더의 영화를 모두 제거했습니다.');
        setShowClearConfirm(false);
      },
      onError: (e) =>
        showToast(
          e instanceof Error ? e.message : '모두 삭제하지 못했습니다.',
        ),
    });
  };

  if (!Number.isFinite(listId) || listId <= 0) {
    return (
      <Screen>
        <Stack.Screen options={{ headerTitle: '' }} />
        <ErrorState message="유효하지 않은 폴더 주소입니다." />
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <Stack.Screen options={headerOptions} />
        <LoadingState message="목록을 불러오는 중..." />
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen>
        <Stack.Screen options={headerOptions} />
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : '폴더 정보를 불러오지 못했습니다. 로그인 상태를 확인해 주세요.'
          }
          onRetry={() => refetch()}
        />
        {listSummary?.description ? (
          <View className="border-t border-primary/10 px-4 py-4 md:px-8">
            <Text variant="caption" className="text-muted">
              {listSummary.description}
            </Text>
          </View>
        ) : null}
      </Screen>
    );
  }

  const listToolbar =
    data.items.length > 0 ? (
      <View className="flex-row justify-end px-4 py-2 md:px-8">
        <Button
          label="모두 삭제"
          variant="destructive"
          size="compact"
          onPress={() => setShowClearConfirm(true)}
          disabled={clearList.isPending}
        />
      </View>
    ) : null;

  return (
    <Screen>
      <Stack.Screen options={headerOptions} />
      {data.items.length === 0 ? (
        <EmptyState message="이 목록에 영화가 없습니다." />
      ) : (
        <View className="min-h-0 flex-1">
          <MovieGrid
            movies={data.items}
            withTabBarPadding={false}
            listId={listId}
            onRemoveFromList={handleRemoveFromList}
            isRemovingFromList={removeFromList.isPending}
            ListHeaderComponent={listToolbar}
          />
        </View>
      )}

      <ConfirmModal
        visible={showClearConfirm}
        title="모두 삭제"
        message="이 폴더에 담긴 영화를 모두 제거할까요?"
        confirmLabel="모두 삭제"
        destructive
        loading={clearList.isPending}
        onConfirm={handleConfirmClearAll}
        onCancel={() => {
          if (!clearList.isPending) {
            setShowClearConfirm(false);
          }
        }}
      />
    </Screen>
  );
}
