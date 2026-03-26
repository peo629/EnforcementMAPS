import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/shared/infra/auth-context';
import { usePushNotifications } from '@/shared/hooks/usePushNotifications';

// Keep native splash screen visible while auth state is being restored.
SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

// ─── App Navigator ────────────────────────────────────────────────────────────
// Uses useEffect + router.replace instead of Stack.Protected because
// Stack.Protected has known reliability issues in expo-router 6 (missing
// fallback redirects, no screen refresh on sign-in/out). See expo/expo#37305.
//
// The `if (loading) return` guard prevents the "navigate before mounting Root
// Layout" error that affected the earlier AuthGate implementation, since
// navigation is deferred until both the navigator is mounted AND auth state
// is fully resolved.
function AppNavigator() {
  const { token, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  usePushNotifications(!!token);

  useEffect(() => {
    if (loading) return; // Wait for auth state to be determined

    // Hide native splash screen now that we know whether user is logged in.
    SplashScreen.hideAsync().catch(() => {});

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!token && !inAuthGroup) {
      router.replace('/login');
    } else if (token && inAuthGroup) {
      router.replace('/');
    }
  }, [token, loading, segments, router]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Patrol' }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}
