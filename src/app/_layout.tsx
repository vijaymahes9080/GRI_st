import '../global.css';
import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useAuthStore } from '../core/auth/authStore';
import { OfflineNotice } from '../core/offline/OfflineNotice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function GlobalAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const rootSegment = segments[0];
    const isPublicRoute = rootSegment === 'auth' || rootSegment === 'index' || segments.length === 0;

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  React.useEffect(() => {
    // Global React Native Exception Guard
    const defaultHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      console.warn('[GlobalErrorGuard] Suppressed fatal crash:', error);
      if (!isFatal && defaultHandler) {
        defaultHandler(error, isFatal);
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ErrorBoundary fallbackTitle="GRI University Service Recovered">
          <GlobalAuthGuard>
            <OfflineNotice />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </GlobalAuthGuard>
        </ErrorBoundary>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

