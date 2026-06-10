import { useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { FolderListCard } from '@/components/movie/FolderListCard';
import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Button } from '@/components/ui/Button';
import {
  useAccountLists,
  useCreateList,
  useUpdateList,
} from '@/hooks/useAccountLists';
import { useIsLoggedIn } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';

const INPUT_CLASS =
  'min-h-[44px] rounded-button border border-primary/20 px-4 text-primary';

export default function CustomListsScreen() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const showToast = useToastStore((s) => s.show);
  const { data, isLoading, isError, error, refetch } = useAccountLists();
  const createList = useCreateList();
  const updateList = useUpdateList();
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const resetCreateForm = () => {
    setNewListName('');
    setNewListDescription('');
    setShowForm(false);
  };

  const handleCreate = async () => {
    const name = newListName.trim();
    if (!name) return;
    try {
      const result = await createList.mutateAsync({
        name,
        description: newListDescription.trim(),
      });
      resetCreateForm();
      Alert.alert('완료', '폴더가 생성되었습니다.');
      router.push(`/list/${result.list_id}`);
    } catch (e) {
      Alert.alert('오류', e instanceof Error ? e.message : '폴더 생성 실패');
    }
  };

  const handleSaveEdit = async ({
    listId,
    name,
    description,
  }: {
    listId: number;
    name: string;
    description: string;
  }) => {
    try {
      await updateList.mutateAsync({ listId, name, description });
      showToast('폴더 정보가 수정되었습니다.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : '폴더 수정에 실패했습니다.');
      throw e;
    }
  };

  if (!isLoggedIn) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <EmptyState message="로그인 후 나만의 영화 폴더를 만들 수 있습니다." />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1 px-4 py-4 md:px-8"
        contentContainerClassName="gap-3 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {!showForm ? (
          <Button
            label="+ 목록 추가"
            variant="primary"
            onPress={() => setShowForm(true)}
          />
        ) : null}
        {showForm ? (
          <View className="gap-3 rounded-card border border-primary/10 bg-surface p-4">
            <TextInput
              value={newListName}
              onChangeText={setNewListName}
              placeholder="폴더명"
              placeholderTextColor="#6B7280"
              className={INPUT_CLASS}
            />
            <TextInput
              value={newListDescription}
              onChangeText={setNewListDescription}
              placeholder="폴더 설명"
              placeholderTextColor="#6B7280"
              multiline
              className={`${INPUT_CLASS} min-h-[72px] py-3`}
            />
            <View className="flex-row items-center gap-3">
              <Button
                label="만들기"
                className="flex-1"
                onPress={handleCreate}
                disabled={createList.isPending || !newListName.trim()}
              />
              <Button label="취소" variant="outline" onPress={resetCreateForm} />
            </View>
          </View>
        ) : null}

        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        ) : null}
        {!isLoading && !isError && !data?.results.length ? (
          <EmptyState message="아직 만든 폴더가 없습니다." />
        ) : null}
        {data?.results.map((list) => (
          <FolderListCard
            key={list.id}
            list={list}
            isSaving={updateList.isPending}
            onSave={handleSaveEdit}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}
