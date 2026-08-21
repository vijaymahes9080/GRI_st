import { create } from 'zustand';
import { storage, storageKeys, getItem, setItem, removeItem, setSecureItem, getSecureItem, removeSecureItem } from '../storage';
import { apiClient } from '../api';

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
  logout: () => Promise<void>;
  updateUser: (partialUser: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = getSecureItem(storageKeys.ACCESS_TOKEN);
  const initialUser = getItem<User>(storageKeys.USER_DATA);

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken && !!initialUser,
    isLoading: false,

    setAuth: async (user, accessToken, refreshToken) => {
      await setSecureItem(storageKeys.ACCESS_TOKEN, accessToken);
      await setSecureItem(storageKeys.REFRESH_TOKEN, refreshToken);
      setItem(storageKeys.USER_DATA, user);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    logout: async () => {
      const refreshToken = getSecureItem(storageKeys.REFRESH_TOKEN);
      if (refreshToken) {
        try {
          await apiClient.post('/auth/logout', { refresh_token: refreshToken });
        } catch (e) {
          console.warn('[AuthStore] Backend logout request notification:', e);
        }
      }

      await removeSecureItem(storageKeys.ACCESS_TOKEN);
      await removeSecureItem(storageKeys.REFRESH_TOKEN);
      removeItem(storageKeys.USER_DATA);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },

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

