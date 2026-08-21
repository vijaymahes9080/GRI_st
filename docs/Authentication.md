# Enterprise Specification: Multi-Role Authentication, Admin Permissions & Tokens

## 1. Multi-Role Account Hierarchy & Permissions

The GRI Authentication & Authorization System strictly separates user roles and privileges:

| Role | Creation Method | Login Permission | Privileges |
|---|---|---|---|
| **`admin`** | Self-registration (`/auth/admin/register` + secret key) | Immediately Approved | Full system access, account creation, user approval/rejection/suspension, broadcast notifications |
| **`student`** | Created by Admin (`/admin/users/create`) | Admin Approved | Access to student portal, courses, attendance, exam timetable, marks, notifications |
| **`faculty`** | Created by Admin (`/admin/users/create`) | Admin Approved | Access to faculty portal, course management, attendance posting, student marks |
| **`staff`** | Created by Admin (`/admin/users/create`) | Admin Approved | Access to administrative modules, department services, departmental circulars |
| **`other`** | Created by Admin (`/admin/users/create`) | Admin Approved | Access to guest/external sub-portals, alumni network, event registrations |

---

## 2. Admin Approval & Account Control Workflows

1. **Account Creation**:
   Admin creates student, faculty, staff, or other accounts via the Admin Control Panel or `POST /api/v1/admin/users/create`.
2. **Approval Status Engine**:
   Every account tracks `approval_status`:
   - `approved`: User can log into the Mobile App or Portal.
   - `pending`: User cannot log in until Admin grants access (`403 Account pending approval`).
   - `rejected`: Access denied with reason (`403 Access rejected: {reason}`).
   - `suspended`: Access temporarily blocked by Admin (`403 Account suspended`).
3. **Session Revocation**:
   Active refresh tokens are saved in `core.sessions`. When Admin suspends or revokes a user, their refresh token is immediately invalidated.

---

## 3. OAuth2 / JWT Lifecycle

- **Access Token**: Short-lived JWT (60 min expiration) containing `{ sub: user_id, email: string, role: string }`.
- **Refresh Token**: Long-lived JWT (7 days expiration) with DB session tracking in `core.sessions`. Accepts both `refresh_token` and `refreshToken`.
- **RBAC Dependency**: `RoleChecker(["admin", "staff"])` enforces role authorization at the endpoint level.

---

## 4. Mobile Axios Auto-Refresh Token Interceptor

```typescript
import axios from 'axios';
import { mmkvStorage } from '@core/storage';

export const setupAuthInterceptor = (instance: typeof axios) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = mmkvStorage.getString('jwt_refresh_token');
        if (refreshToken) {
          try {
            const res = await axios.post('/api/v1/auth/refresh', { refresh_token: refreshToken });
            const newAccessToken = res.data.access_token;
            mmkvStorage.set('jwt_access_token', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(originalRequest);
          } catch (refreshErr) {
            mmkvStorage.delete('jwt_access_token');
            mmkvStorage.delete('jwt_refresh_token');
          }
        }
      }
      return Promise.reject(error);
    }
  );
};
```
