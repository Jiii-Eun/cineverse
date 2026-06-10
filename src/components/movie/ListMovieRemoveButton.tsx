import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

interface ListMovieRemoveButtonProps {
  movieId: number;
  onRemove: (movieId: number) => void;
  disabled?: boolean;
}

export function ListMovieRemoveButton({
  movieId,
  onRemove,
  disabled = false,
}: ListMovieRemoveButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="폴더에서 제거"
      onPress={(event) => {
        event?.stopPropagation?.();
        onRemove(movieId);
      }}
      disabled={disabled}
      className="min-h-[28px] min-w-[28px] items-center justify-center rounded-full bg-black/55 active:opacity-80"
      style={{ cursor: 'pointer' }}
    >
      <Ionicons name="close" size={16} color="#FFFFFF" />
    </Pressable>
  );
}
