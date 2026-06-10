import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Text } from '@/components/ui/Text';
import { useAccountLists, useListDetail } from '@/hooks/useAccountLists';

function parseListId(id: string | string[] | undefined): number {
  const raw = Array.isArray(id) ? id[0] : id;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const listId = parseListId(id);
  const { data, isLoading, isError, error, refetch } = useListDetail(listId);
  const { data: accountLists } = useAccountLists();
  const listSummary = accountLists?.results.find((list) => list.id === listId);

  if (!Number.isFinite(listId) || listId <= 0) {
    return (
      <Screen>
        <ErrorState message="유효하지 않은 폴더 주소입니다." />
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <LoadingState message="목록을 불러오는 중..." />
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen>
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : '폴더 정보를 불러오지 못했습니다. 로그인 상태를 확인해 주세요.'
          }
          onRetry={() => refetch()}
        />
        {listSummary ? (
          <View className="border-t border-primary/10 px-4 py-4 md:px-8">
            <Text variant="subtitle">{listSummary.name}</Text>
            <Text variant="caption" className="mt-1 text-muted">
              {listSummary.description || '설명 없음'} · {listSummary.item_count}편
            </Text>
          </View>
        ) : null}
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="border-b border-primary/10 bg-surface px-4 py-5 md:px-8">
        <Text variant="title">{data.name}</Text>
        <Text variant="caption" className="mt-1">
          {data.description || '설명 없음'} · {data.items.length}편
        </Text>
      </View>
      {data.items.length === 0 ? (
        <EmptyState message="이 목록에 영화가 없습니다." />
      ) : (
        <View className="flex-1">
          <MovieGrid movies={data.items} withTabBarPadding={false} />
        </View>
      )}
    </Screen>
  );
}
