import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00796B',  // Teal blue - finance vibe
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
          height: 80,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="loanreq"
        options={{
          title: 'Apply',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="edit" size={22} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="requser"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="list-ul" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="landing"
        options={{
          title: 'Finance',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="line-chart" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
