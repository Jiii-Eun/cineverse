import { Modal, Pressable, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
      >
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={onCancel}
          accessibilityLabel="닫기"
        />

        <View
          className="rounded-card border border-primary/10 bg-surface"
          style={{
            width: '100%',
            maxWidth: 300,
            paddingHorizontal: 20,
            paddingVertical: 20,
            zIndex: 2,
            pointerEvents: 'box-none',
          }}
        >
          <Text variant="subtitle">{title}</Text>
          <Text variant="caption" className="mt-2">
            {message}
          </Text>
          <View className="mt-4 flex-row gap-2" style={{ pointerEvents: 'auto' }}>
            <Button
              label={cancelLabel}
              variant="outline"
              className="flex-1"
              onPress={onCancel}
              disabled={loading}
            />
            <Button
              label={confirmLabel}
              variant={destructive ? 'destructive' : 'primary'}
              className="flex-1"
              onPress={onConfirm}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
