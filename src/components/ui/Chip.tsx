import { Pressable } from 'react-native';

import { Text } from '@/components/ui/Text';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function Chip({ label, active = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[36px] items-center justify-center rounded-chip px-4 py-1.5 ${
        active ? 'bg-primary' : 'bg-elevated'
      }`}
    >
      <Text
        className={`text-sm font-medium ${active ? 'text-foreground' : 'text-muted'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
