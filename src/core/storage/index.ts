// Web-compatible storage implementation using localStorage
export const storageKeys = {
  ACCESS_TOKEN: 'jwt_access_token',
  REFRESH_TOKEN: 'jwt_refresh_token',
  USER_DATA: 'user_data',
  USER_SESSION: 'user_session',
  THEME_MODE: 'theme_mode',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  APP_CONFIG: 'server_app_config',
  FEATURE_FLAGS: 'server_feature_flags',
  PRIVATE_CACHE: 'private_cache',
  AUTH_SESSION: 'auth_session',
} as const;

const isWeb = typeof window !== 'undefined' && window.localStorage;

export const setSecureItem = async (key: string, value: string): Promise<void> => {
  if (isWeb) {
    window.localStorage.setItem(key, value);
  }
};

export const getSecureItem = (key: string): string | null => {
  if (isWeb) {
    return window.localStorage.getItem(key);
  }
  return null;
};

export const removeSecureItem = async (key: string): Promise<void> => {
  if (isWeb) {
    window.localStorage.removeItem(key);
  }
};

export const getItem = <T>(key: string): T | null => {
  if (!isWeb) return null;
  const value = window.localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

export const setItem = (key: string, value: any): void => {
  if (!isWeb) return;
  if (typeof value === 'string') {
    window.localStorage.setItem(key, value);
  } else {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeItem = (key: string): void => {
  if (isWeb) {
    window.localStorage.removeItem(key);
  }
};

export const clearAllSensitiveStorage = async (): Promise<void> => {
  if (isWeb) {
    Object.values(storageKeys).forEach(key => {
      window.localStorage.removeItem(key);
    });
    const extraSensitiveKeys = [
      'gri_auth_session',
      'gri_user_profile',
      'temp_credentials',
    ];
    extraSensitiveKeys.forEach((k) => {
      window.localStorage.removeItem(k);
    });
    window.sessionStorage?.clear();
  }
};

export const clearStorage = async (): Promise<void> => {
  if (isWeb) {
    window.localStorage.clear();
    await clearAllSensitiveStorage();
  }
};

