import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E3A5F',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'rgba(30, 58, 95, 0.1)',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '상영 중',
          tabBarLabel: '상영 중',
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: '즐겨찾기',
          tabBarLabel: '즐겨찾기',
        }}
      />
    </Tabs>
  );
}
