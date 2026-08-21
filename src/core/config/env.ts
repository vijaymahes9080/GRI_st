import Constants from 'expo-constants';

export interface FreeCloudStackConfig {
  githubRepoUrl: string;
  railwayBackendUrl: string;
  cloudflareCdnUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  firebaseFcmSenderId: string;
  vercelAdminPortalUrl: string;
  uptimeKumaHealthUrl: string;
}

export interface AppEnvConfig {
  apiUrl: string;
  wsUrl: string;
  universityWebsiteUrl: string;
  enableAnalytics: boolean;
  enableSentry: boolean;
  environment: 'development' | 'staging' | 'production';
  cloudStack: FreeCloudStackConfig;
}

const getEnvConfig = (): AppEnvConfig => {
  const isDev = __DEV__;
  
  // Local network fallback for Expo Go / ADB USB debugging
  const devHost = Constants.expoConfig?.hostUri?.split(':')[0] || '192.168.1.15';

  const cloudStack: FreeCloudStackConfig = {
    githubRepoUrl: 'https://github.com/vijaymahes9080/GRI',
    railwayBackendUrl: process.env.EXPO_PUBLIC_RAILWAY_URL || 'https://api.ruraluniv-app.railway.app',
    cloudflareCdnUrl: 'https://cdn.ruraluniv.ac.in',
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://gri-university.supabase.co',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
    firebaseFcmSenderId: '109823489123',
    vercelAdminPortalUrl: 'https://admin.ruraluniv.ac.in',
    uptimeKumaHealthUrl: 'https://api.ruraluniv-app.railway.app/health',
  };

  if (isDev) {
    return {
      apiUrl: `http://${devHost}:8000/api/v1`,
      wsUrl: `ws://${devHost}:8000/ws/announcements`,
      universityWebsiteUrl: 'https://ruraluniv.ac.in',
      enableAnalytics: false,
      enableSentry: false,
      environment: 'development',
      cloudStack,
    };
  }

  return {
    apiUrl: `${cloudStack.railwayBackendUrl}/api/v1`,
    wsUrl: `wss://api.ruraluniv-app.railway.app/ws/announcements`,
    universityWebsiteUrl: 'https://ruraluniv.ac.in',
    enableAnalytics: true,
    enableSentry: true,
    environment: 'production',
    cloudStack,
  };
};

export const ENV = getEnvConfig();
