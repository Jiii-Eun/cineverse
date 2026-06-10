import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

interface ListFolderHeaderTitleProps {
  name?: string;
  itemCount?: number;
}

export function ListFolderHeaderTitle({
  name,
  itemCount,
}: ListFolderHeaderTitleProps) {
  if (!name) {
    return null;
  }

  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-base font-semibold text-foreground">{name}</Text>
      {itemCount !== undefined ? (
        <Text
          variant="caption"
          className="shrink-0"
          style={{ fontSize: 11 }}
        >
          {itemCount}편
        </Text>
      ) : null}
    </View>
  );
}
