import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide the header by default for all screens
        contentStyle: {
          // Ensure content fills the screen properly without header
          flex: 1,
        },
        // Keep these settings for any screen where you might want to show the header later
        headerStyle: {
          backgroundColor: 'lightgreen',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="home" />
      <Stack.Screen name="login" />
      
      {/* If you need to show header on any specific screen, you can override it like this: */}
      {/* <Stack.Screen 
           name="specificScreen" 
           options={{ 
             headerShown: true 
           }} 
         /> 
      */}
    </Stack>
  );
}