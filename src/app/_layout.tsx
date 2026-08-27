import '../global.css';
import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useAuthStore } from '../core/auth/authStore';
import { OfflineNotice } from '../core/offline/OfflineNotice';
import { AccessRestricted } from '../components/common/AccessRestricted';
import { queryClient } from '../core/api/queryClient';
import { hasPermission, AppPermission } from '../core/auth/permissions';
import { ThemeProvider } from '../core/theme/ThemeContext';

function GlobalAuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const rootSegment = segments[0];
  const currentTab = segments[1];
  
  // Mapping of mobile tab names to permissions
  const tabPermissionMap: Record<string, AppPermission> = {
    'admin': 'tab.admin.view',
    'profile': 'tab.profile.view',
    'academics': 'tab.academics.view',
    'examinations': 'tab.examinations.view',
    'hostel': 'tab.hostel.view'
  };

  const requiredPermission = (rootSegment === '(tabs)' && currentTab) 
    ? tabPermissionMap[currentTab] 
    : undefined;

  const isPublicRoute = (() => {
    if (rootSegment === 'auth' || rootSegment === 'index' || !rootSegment) return true;
    if (rootSegment === '(tabs)' && !requiredPermission) return true;
    return false;
  })();

  const isAuthorized = isAuthenticated && (!requiredPermission || hasPermission(user?.role, requiredPermission));

  if (!isAuthorized && !isPublicRoute) {
    const isGuest = !isAuthenticated;
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-slate-950 p-4 min-h-screen">
        <AccessRestricted
          title={isGuest ? "Authentication Required" : "Access Denied"}
          message={isGuest 
            ? "You must be signed in with your institutional credentials to access this section of the mobile portal." 
            : "Your current role does not have permission to access this section."}
          resourceName="Protected Route"
          primaryActionText={isGuest ? "Sign In" : "Return to Home"}
          onPrimaryAction={() => isGuest ? router.push('/auth/login') : router.replace('/')}
          secondaryActionText="Go to Home"
          onSecondaryAction={() => router.replace('/')}
        />
      </div>
    );
  }

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
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ErrorBoundary fallbackTitle="GRI University Service Recovered">
            <GlobalAuthGuard>
              <OfflineNotice />
              <Stack 
                screenOptions={{ 
                  headerShown: false,
                  animation: 'slide_from_right',
                  presentation: 'card',
                  gestureEnabled: true,
                  gestureDirection: 'horizontal'
                }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="auth" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
              </Stack>
            </GlobalAuthGuard>
          </ErrorBoundary>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
