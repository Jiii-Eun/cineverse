import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import type { MovieListSummary } from '@/types/movie';

const INPUT_CLASS =
  'min-h-[44px] rounded-button border border-primary/20 px-4 text-primary';

interface FolderListCardProps {
  list: MovieListSummary;
  isSaving: boolean;
  onSave: (input: {
    listId: number;
    name: string;
    description: string;
  }) => Promise<void>;
}

export function FolderListCard({ list, isSaving, onSave }: FolderListCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(list.name);
  const [editDescription, setEditDescription] = useState(list.description ?? '');

  useEffect(() => {
    if (!isEditing) {
      setEditName(list.name);
      setEditDescription(list.description ?? '');
    }
  }, [isEditing, list.description, list.name]);

  const startEdit = () => {
    setEditName(list.name);
    setEditDescription(list.description ?? '');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditName(list.name);
    setEditDescription(list.description ?? '');
    setIsEditing(false);
  };

  const handleSave = async () => {
    const name = editName.trim();
    if (!name || isSaving) return;

    await onSave({
      listId: list.id,
      name,
      description: editDescription.trim(),
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View className="gap-3 rounded-card border border-primary/10 bg-surface p-4">
        <TextInput
          value={editName}
          onChangeText={setEditName}
          placeholder="폴더명"
          placeholderTextColor="#6B7280"
          className={INPUT_CLASS}
        />
        <TextInput
          value={editDescription}
          onChangeText={setEditDescription}
          placeholder="폴더 설명"
          placeholderTextColor="#6B7280"
          multiline
          className={`${INPUT_CLASS} min-h-[72px] py-3`}
        />
        <View className="flex-row items-center gap-3">
          <Button
            label="저장"
            className="flex-1"
            onPress={() => {
              void handleSave();
            }}
            disabled={isSaving || !editName.trim()}
          />
          <Button label="취소" variant="outline" onPress={cancelEdit} />
        </View>
      </View>
    );
  }

  return (
    <View className="rounded-card border border-primary/10 bg-surface p-4">
      <View className="flex-row items-center gap-3">
        <Pressable
          className="min-w-0 flex-1"
          onPress={() => router.push(`/list/${list.id}`)}
          accessibilityRole="link"
          accessibilityLabel={`${list.name} 폴더 열기`}
        >
          <View className="flex-row items-center gap-2">
            <Text variant="subtitle" className="shrink">
              {list.name}
            </Text>
            <Text variant="caption" className="shrink-0">
              {list.item_count}편
            </Text>
          </View>
          <Text variant="caption" className="mt-1">
            {list.description?.trim() || '설명 없음'}
          </Text>
        </Pressable>
        <Button label="편집" variant="outline" size="compact" onPress={startEdit} />
      </View>
    </View>
  );
}
