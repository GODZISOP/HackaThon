import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = 'LAST_ROUTE';

export default function Layout() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const restoreState = async () => {
      try {
        const lastRoute = await AsyncStorage.getItem(PERSISTENCE_KEY);

        if (lastRoute && lastRoute !== 'index') {
          setInitialRoute(lastRoute); // Set the initial route if it exists
        } else {
          setInitialRoute('Home'); // Fallback to the 'Home' screen
        }
      } catch (error) {
        console.warn('Error restoring navigation state:', error);
        setInitialRoute('Home'); // Fallback to 'Home' in case of error
      } finally {
        setIsReady(true); // Once data is fetched, set the state to ready
      }
    };

    restoreState();
  }, []);

  useEffect(() => {
    if (isReady && initialRoute) {
      // Ensure the initialRoute is prefixed with `/` for correct path
      router.replace(`/${initialRoute}`); // Now path starts with `/`
    }
  }, [isReady, initialRoute, router]);

  if (!isReady) {
    return null; // Optionally show a loading screen while waiting for state to be restored
  }

  return (
    <Stack>
      <Stack.Screen name="Home" />
      <Stack.Screen name="LoanForm" />
      <Stack.Screen name="Login" />
      {/* Your other screens */}
    </Stack>
  );
}
