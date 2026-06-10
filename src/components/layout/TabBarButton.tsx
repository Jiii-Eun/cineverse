import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

type TabBarButtonProps = PressableProps & {
  href?: string;
  style?: StyleProp<ViewStyle>;
};

export function TabBarButton({ style, ...props }: TabBarButtonProps) {
  return (
    <Pressable
      {...props}
      style={(state) => {
        const base =
          typeof style === 'function' ? style(state) : style;
        const flat = StyleSheet.flatten(base) ?? {};

        return [
          flat,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
          },
        ];
      }}
    />
  );
}
