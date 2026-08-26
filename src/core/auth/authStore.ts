import { create } from 'zustand';
import { storageKeys, getItem, setItem, setSecureItem, getSecureItem, clearAllSensitiveStorage } from '../storage';
import { apiClient } from '../api';
import { queryClient } from '../api/queryClient';

export type UserRole =
  | 'STUDENT'
  | 'FACULTY'
  | 'RESEARCH_SCHOLAR'
  | 'DEPARTMENT_ADMIN'
  | 'EXAM_STAFF'
  | 'HOSTEL_STAFF'
  | 'FINANCE_STAFF'
  | 'UNIVERSITY_ADMIN'
  | 'LIBRARIAN'
  | 'PLACEMENT_OFFICER'
  | 'ALUMNI'
  | 'PENSIONER'
  | 'SYSTEM_ADMIN'
  | 'WARDEN'
  | 'PARENT'
  | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  rollNumber?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  doLogout: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (partialUser: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken = getSecureItem(storageKeys.ACCESS_TOKEN);
  const initialUser = getItem<User>(storageKeys.USER_DATA);

  const performLogout = async () => {
    const refreshToken = getSecureItem(storageKeys.REFRESH_TOKEN);
    const accessToken = getSecureItem(storageKeys.ACCESS_TOKEN) || get().token;

    // 1. Notify backend logout endpoint to invalidate tokens
    if (refreshToken || accessToken) {
      try {
        await apiClient.post('/auth/logout', { 
          refresh_token: refreshToken,
          access_token: accessToken 
        });
      } catch (e) {
        console.warn('[AuthStore] Backend logout request notification:', e);
      }
    }

    // 2. Clear default Authorization headers from API Client
    try {
      if (apiClient.defaults.headers && apiClient.defaults.headers.common) {
        delete apiClient.defaults.headers.common['Authorization'];
      }
    } catch {}

    // 3. Purge all sensitive storage (Keystore/KeyChain, MMKV, Web localStorage & sessionStorage)
    await clearAllSensitiveStorage();

    // 4. Clear React Query Cache to ensure no private data remains visible
    try {
      queryClient.clear();
    } catch (e) {
      console.warn('[AuthStore] Failed to clear query client cache:', e);
    }

    // 5. Reset in-memory state completely
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken && !!initialUser,
    isLoading: false,

    setAuth: async (user, accessToken, refreshToken) => {
      await setSecureItem(storageKeys.ACCESS_TOKEN, accessToken);
      await setSecureItem(storageKeys.REFRESH_TOKEN, refreshToken);
      setItem(storageKeys.USER_DATA, user);

      // Set API client authorization header
      if (apiClient.defaults.headers && apiClient.defaults.headers.common) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    doLogout: performLogout,
    logout: performLogout,

    updateUser: (partialUser) => {
      set((state) => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...partialUser };
        setItem(storageKeys.USER_DATA, updatedUser);
        return { user: updatedUser };
      });
    },
  };
});

