import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarButton } from '@/components/layout/TabBarButton';
import {
  TAB_BAR_VERTICAL_PADDING,
  getTabBarTotalHeight,
} from '@/constants/layout';

const TAB_ACTIVE = '#8B5CF6';
const TAB_INACTIVE = '#6B7280';
const TAB_ICON_SIZE = 22;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const safeBottom = Platform.OS === 'web' ? 0 : insets.bottom;
  const tabBarHeight = getTabBarTotalHeight(insets.bottom);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TAB_ACTIVE,
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarStyle: {
          backgroundColor: '#0D0D12',
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: tabBarHeight,
          paddingTop: TAB_BAR_VERTICAL_PADDING,
          paddingBottom: TAB_BAR_VERTICAL_PADDING + safeBottom,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          lineHeight: 14,
          marginTop: 2,
          marginBottom: 0,
          includeFontPadding: false,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '탐색',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: '즐겨찾기',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
