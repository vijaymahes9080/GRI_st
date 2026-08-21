# Enterprise Specification: State Management (Zustand + TanStack Query)

## 1. State Separation Philosophy

- **Client State (Zustand)**: Local UI state, authentication tokens, active theme (dark/light), temporary filter controls.
- **Server State (TanStack Query v5)**: Asynchronous API responses, caching, background polling, and optimistic updates.

---

## 2. Zustand Auth Store Example (`src/core/auth/authStore.ts`)

```typescript
import { create } from 'zustand';
import { mmkvStorage } from '@core/storage';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { id: string; name: string; role: string } | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!mmkvStorage.getString('jwt_access_token'),
  token: mmkvStorage.getString('jwt_access_token') || null,
  user: null,
  setAuth: (token, user) => {
    mmkvStorage.set('jwt_access_token', token);
    set({ isAuthenticated: true, token, user });
  },
  logout: () => {
    mmkvStorage.delete('jwt_access_token');
    set({ isAuthenticated: false, token: null, user: null });
  },
}));
```

---

## 3. TanStack Query Hook Example (`useTimetable`)

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@core/api';

export const useTimetable = () => {
  return useQuery({
    queryKey: ['academics', 'timetable'],
    queryFn: async () => {
      const response = await apiClient.get('/academics/timetable');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
```
