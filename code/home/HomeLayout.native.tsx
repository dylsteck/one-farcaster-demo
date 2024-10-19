import { Tabs } from 'one';
import { HomeIcons } from './HomeIcons';
import { useTheme } from 'tamagui';

export function HomeLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.accentColor.val,
        tabBarInactiveTintColor: theme.gray9.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcons.Home size={20} color={color} />,
        }}
      />

    <Tabs.Screen
        name="trending"
        options={{
          title: 'Trending',
          tabBarButton: () => null,
          tabBarIcon: ({ color }) => <HomeIcons.Trending size={20} color={color} />,
        }}
      />

    <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <HomeIcons.Explore size={20} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <HomeIcons.User size={20} color={color} />,
        }}
      />

       <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarButton: () => null,
          tabBarIcon: ({ color }) => <HomeIcons.Search size={20} color={color} />,
        }}
      />

    </Tabs>
  );
}