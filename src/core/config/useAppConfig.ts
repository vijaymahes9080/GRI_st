import { useQuery } from '@tanstack/react-query';
import { getItem, setItem, storageKeys } from '../storage';
import { AppServerConfig, AppServerConfigSchema, FeatureFlagsMap, NavigationNode } from '../types/config';
import { api } from '../api/client';

export const DEFAULT_APP_CONFIG: AppServerConfig = {
  appVersion: '1.0.0',
  minimumVersion: '1.0.0',
  recommendedVersion: '1.0.0',
  maintenanceMode: false,
  maintenanceMessage: 'GRI Services are undergoing scheduled maintenance. Please check back shortly.',
  features: {
    admissions: true,
    admissions_2026: true,
    examinations: true,
    results: true,
    departments: true,
    faculty: true,
    news: true,
    events: true,
    downloads: true,
    library: true,
    student_services: true,
    grievance: true,
    placement: true,
    hostel: true,
    transport: true,
    uba_extension: true,
    kvk_advisories: true,
    statutory_governance: true,
    research_rdc: true,
    flagship_schemes: true,
  },
  navigation: [
    { id: 'home', title: 'Home', icon: 'home', route: '/(tabs)/home', order: 1, enabled: true },
    { id: 'academics', title: 'Academics', icon: 'book-open', route: '/(tabs)/academics', featureFlagKey: 'departments', order: 2, enabled: true },
    { id: 'services', title: 'Services', icon: 'layers', route: '/(tabs)/services', featureFlagKey: 'student_services', order: 3, enabled: true },
    { id: 'discover', title: 'Discover', icon: 'compass', route: '/(tabs)/discover', order: 4, enabled: true },
    { id: 'ai_chat', title: 'AI Assistant', icon: 'bot', route: '/(tabs)/ai_chat', order: 5, enabled: true },
    { id: 'profile', title: 'Profile', icon: 'user', route: '/(tabs)/profile', order: 6, enabled: true },
  ],
  theme: {
    primaryColor: '#518214',
    secondaryColor: '#911C03',
    accentColor: '#F16236',
    surfaceColor: '#FFFFFF',
    darkSurfaceColor: '#121212',
  },
};

const fetchRemoteConfig = async (): Promise<AppServerConfig> => {
  try {
    const response = await api.get('/app/config');
    const parsed = AppServerConfigSchema.safeParse(response.data?.data || response.data);
    if (parsed.success) {
      setItem(storageKeys.APP_CONFIG, parsed.data);
      return parsed.data;
    }
  } catch {
    console.warn('[RemoteConfig] API fetch failed, loading local MMKV cache or fallback defaults.');
  }

  const cached = getItem<AppServerConfig>(storageKeys.APP_CONFIG);
  if (cached) {
    return cached;
  }
  return DEFAULT_APP_CONFIG;
};

export const useAppConfig = () => {
  const { data: config = DEFAULT_APP_CONFIG, isLoading, refetch, isError } = useQuery<AppServerConfig>({
    queryKey: ['app-server-config'],
    queryFn: fetchRemoteConfig,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    initialData: getItem<AppServerConfig>(storageKeys.APP_CONFIG) || DEFAULT_APP_CONFIG,
  });

  const isFeatureEnabled = (flagKey: keyof FeatureFlagsMap | string): boolean => {
    if (!config?.features) return true;
    const value = config.features[flagKey as keyof FeatureFlagsMap];
    return value !== undefined ? Boolean(value) : true;
  };

  return {
    config,
    features: config.features,
    navigation: config.navigation.filter((n: NavigationNode) => n.enabled !== false && (!n.featureFlagKey || isFeatureEnabled(n.featureFlagKey))),
    theme: config.theme,
    isFeatureEnabled,
    maintenanceMode: config.maintenanceMode,
    maintenanceMessage: config.maintenanceMessage,
    isLoading,
    isError,
    refetch,
  };
};
