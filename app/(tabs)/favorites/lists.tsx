import { useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { FolderListCard } from '@/components/movie/FolderListCard';
import { Screen } from '@/components/layout/Screen';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Button } from '@/components/ui/Button';
import {
  useAccountLists,
  useCreateList,
  useDeleteList,
} from '@/hooks/useAccountLists';
import { useIsLoggedIn } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';

const INPUT_CLASS =
  'min-h-[44px] rounded-button border border-primary/20 px-4';
const INPUT_TEXT_STYLE = { color: '#FFFFFF' } as const;

export default function CustomListsScreen() {
  const isLoggedIn = useIsLoggedIn();
  const showToast = useToastStore((s) => s.show);
  const { data, isLoading, isError, error, refetch } = useAccountLists();
  const createList = useCreateList();
  const deleteList = useDeleteList();
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const resetCreateForm = () => {
    setNewListName('');
    setNewListDescription('');
    setShowForm(false);
  };

  const handleCreate = async () => {
    const name = newListName.trim();
    if (!name) return;
    try {
      await createList.mutateAsync({
        name,
        description: newListDescription.trim(),
      });
      resetCreateForm();
      showToast('폴더가 생성되었습니다.');
    } catch (e) {
      showToast(e instanceof Error ? e.message : '폴더 생성에 실패했습니다.');
    }
  };

  const handleDeletePress = (listId: number, listName: string) => {
    setDeleteTarget({ id: listId, name: listName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteList.mutateAsync(deleteTarget.id);
      showToast('폴더가 삭제되었습니다.');
      setDeleteTarget(null);
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : '폴더 삭제에 실패했습니다.',
      );
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
              style={INPUT_TEXT_STYLE}
            />
            <TextInput
              value={newListDescription}
              onChangeText={setNewListDescription}
              placeholder="폴더 설명"
              placeholderTextColor="#6B7280"
              multiline
              className={`${INPUT_CLASS} min-h-[72px] py-3`}
              style={INPUT_TEXT_STYLE}
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
            isDeleting={deleteList.isPending}
            onDelete={(listId) => handleDeletePress(listId, list.name)}
          />
        ))}
      </ScrollView>

      <ConfirmModal
        visible={deleteTarget != null}
        title="폴더 삭제"
        message={
          deleteTarget
            ? `"${deleteTarget.name}" 폴더를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`
            : ''
        }
        confirmLabel="삭제"
        destructive
        loading={deleteList.isPending}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
        onCancel={() => {
          if (!deleteList.isPending) {
            setDeleteTarget(null);
          }
        }}
      />
    </Screen>
  );
}
