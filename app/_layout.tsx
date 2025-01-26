// app/_layout.js or app/layout.js (root layout)
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Define your main stack screen structure */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="Home"  />
      <Stack.Screen name="LoanForm"  />
      <Stack.Screen name="Login" />  {/* Ensure the name matches */}
    </Stack>
  );
}