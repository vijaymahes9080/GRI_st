import { MMKV } from 'react-native-mmkv';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const configuredKey: string | undefined =
  (Constants.expoConfig?.extra?.mmkvEncryptionKey as string | undefined) ||
  process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY;

const encryptionKey: string | undefined = __DEV__
  ? configuredKey || Constants.installationId
  : configuredKey;

export const storage = new MMKV({
  id: 'gri-app-storage',
  ...(encryptionKey ? { encryptionKey } : {}),
});

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

// Hardware-Backed Secure KeyStore / KeyChain Storage Helpers
export const setSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    storage.set(key, value);
  }
};

export const getSecureItem = (key: string): string | null => {
  try {
    return SecureStore.getItem(key) || storage.getString(key) || null;
  } catch {
    return storage.getString(key) || null;
  }
};

export const removeSecureItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {}
  storage.delete(key);
};

export const getItem = <T>(key: string): T | null => {
  const value = storage.getString(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

export const setItem = (key: string, value: any): void => {
  if (typeof value === 'string') {
    storage.set(key, value);
  } else {
    storage.set(key, JSON.stringify(value));
  }
};

export const removeItem = (key: string): void => {
  storage.delete(key);
};

/**
 * Completely purges all sensitive credentials, cached state, and session tokens
 * from hardware Keystore/KeyChain, MMKV memory, and web browser storage.
 */
export const clearAllSensitiveStorage = async (): Promise<void> => {
  try {
    // 1. Remove all secure items
    await removeSecureItem(storageKeys.ACCESS_TOKEN);
    await removeSecureItem(storageKeys.REFRESH_TOKEN);
    await removeSecureItem(storageKeys.USER_DATA);
    await removeSecureItem(storageKeys.USER_SESSION);
    await removeSecureItem(storageKeys.PRIVATE_CACHE);
    await removeSecureItem(storageKeys.AUTH_SESSION);

    // 2. Clear MMKV storage
    storage.delete(storageKeys.ACCESS_TOKEN);
    storage.delete(storageKeys.REFRESH_TOKEN);
    storage.delete(storageKeys.USER_DATA);
    storage.delete(storageKeys.USER_SESSION);
    storage.delete(storageKeys.PRIVATE_CACHE);
    storage.delete(storageKeys.AUTH_SESSION);

    // 3. Clear web browser localStorage and sessionStorage if in web runtime
    if (typeof window !== 'undefined') {
      try {
        const sensitiveKeys = [
          'jwt_access_token',
          'jwt_refresh_token',
          'user_data',
          'auth_session',
          'gri_auth_session',
          'gri_user_profile',
          'private_cache',
          'temp_credentials',
        ];
        sensitiveKeys.forEach((k) => {
          window.localStorage?.removeItem(k);
        });
        window.sessionStorage?.clear();
      } catch (webErr) {
        console.warn('[Storage] Web storage purge warning:', webErr);
      }
    }
  } catch (err) {
    console.warn('[Storage] clearAllSensitiveStorage caught error:', err);
  }
};

export const clearStorage = async (): Promise<void> => {
  try {
    storage.clearAll();
    await clearAllSensitiveStorage();
  } catch (err) {
    console.warn('[Storage] clearStorage error:', err);
  }
};

