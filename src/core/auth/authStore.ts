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
  designation?: string;
  semester?: string;
  program?: string;
  supervisor?: string;
}

export const DEMO_PROFILES: Record<string, User> = {
  STUDENT: {
    id: 'usr_student_01',
    fullName: 'Vijay Kumar S.',
    username: '21BCA042',
    email: 'vijay.21bca042@ruraluniv.ac.in',
    role: 'STUDENT',
    department: 'Dept. of Computer Science & Applications',
    rollNumber: '21BCA042',
    program: 'BCA (Hons) Computer Applications',
    semester: 'Semester VI',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  FACULTY: {
    id: 'usr_faculty_01',
    fullName: 'Dr. K. Arumugam',
    username: 'fac_cs_1048',
    email: 'k.arumugam@ruraluniv.ac.in',
    role: 'FACULTY',
    department: 'Dept. of Computer Science & Applications',
    designation: 'Associate Professor & Head i/c',
    rollNumber: 'EMP-FAC-1048',
    program: 'School of Mathematics & Computer Sciences',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  RESEARCH_SCHOLAR: {
    id: 'usr_scholar_01',
    fullName: 'Ms. S. Meenakshi',
    username: 'phd_rd_2023',
    email: 'meenakshi.phd@ruraluniv.ac.in',
    role: 'RESEARCH_SCHOLAR',
    department: 'Dept. of Rural Development & Agriculture',
    designation: 'Senior Research Fellow (SRF - UGC)',
    rollNumber: '23PHDRD009',
    program: 'Ph.D. in Rural Development',
    supervisor: 'Dr. R. Subburaman (Professor)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  ADMIN: {
    id: 'usr_admin_01',
    fullName: 'Dr. R. Manickam',
    username: 'admin_registrar',
    email: 'registrar@ruraluniv.ac.in',
    role: 'UNIVERSITY_ADMIN',
    department: 'Office of the Registrar & Administration',
    designation: 'Registrar & Chief Administrative Officer',
    rollNumber: 'ADM-REG-001',
    program: 'Gandhigram Rural Institute Central Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
};

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
  switchDemoRole: (roleKey: 'STUDENT' | 'FACULTY' | 'RESEARCH_SCHOLAR' | 'ADMIN' | 'GUEST') => void;
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

    switchDemoRole: (roleKey) => {
      if (roleKey === 'GUEST') {
        performLogout();
        return;
      }
      const profile = DEMO_PROFILES[roleKey];
      if (profile) {
        setItem(storageKeys.USER_DATA, profile);
        setSecureItem(storageKeys.ACCESS_TOKEN, `token_${roleKey.toLowerCase()}_mock`);
        setSecureItem(storageKeys.REFRESH_TOKEN, `refresh_${roleKey.toLowerCase()}_mock`);
        set({
          user: profile,
          token: `token_${roleKey.toLowerCase()}_mock`,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    },
  };
});

