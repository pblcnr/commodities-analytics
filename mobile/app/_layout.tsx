import { ThemeProvider } from '../src/theme/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="create-alert" options={{ presentation: 'modal', title: 'Novo Alerta' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
