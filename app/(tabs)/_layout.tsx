import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,  // Hide header (page name)
      }}
    >
      <Tabs.Screen
        name="loanreq"
        options={{
          title: 'Apply',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="file-text" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="cogs" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Logout"
        options={{
          title: 'Logout',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="sign-out" color={color} />,
        }}
      />
    </Tabs>
  );
}
