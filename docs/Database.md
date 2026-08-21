# Enterprise Specification: Local Storage & PostgreSQL Remote Database Design

## 1. Local Device Storage (`react-native-mmkv`)
The app utilizes **`react-native-mmkv`** for fast synchronous key-value persistence on native mobile devices.

```typescript
import { MMKV } from 'react-native-mmkv';

export const mmkvStorage = new MMKV({
  id: 'gri-user-storage',
  encryptionKey: 'gri-android-secure-key',
});
```

---

## 2. Remote Open-Source PostgreSQL Database Schema Architecture

The GRI system uses an open-source **PostgreSQL** database architecture with 3 schema migration scripts:

### A. Core Database Schema (`database/schema.sql`)
- **`core.roles`**: Standard role definitions (`admin`, `student`, `faculty`, `staff`, `other`).
- **`core.permissions`** & **`core.role_permissions`**: Granular action-level permissions.
- **`core.users`**: Identity table with UUID primary keys, bcrypt hashes, MFA support, and soft deletes (`deleted_at`).
- **`core.departments`**, **`core.student_profiles`**, **`core.faculty_profiles`**: Institutional entity profiles.
- **`academic.*`**, **`exam.*`**, **`campus.*`**, **`finance.*`**, **`placement.*`**, **`infra.*`**: Full university ERP schemas.

### B. Stage 2 Schema Extension (`database/schema_v2_extension.sql`)
- **`core.app_config`**: Server-driven version control, maintenance mode, theme tokens.
- **`core.feature_flags`**: Rollout percentage and role-based feature flags.
- **`core.navigation_nodes`**: Server-driven dynamic mobile navigation tree.
- **`content.entities`**: Unified content repository (announcements, circulars, events, documents).
- **`sync.sync_jobs`**: Ingestion pipeline audits and website sync logs.

### C. Auth & Real-Time Broadcast Extension (`database/schema_auth_extension.sql`)
- **User Approval System**: Added `approval_status IN ('approved','pending','rejected','suspended')`, `approved_by`, `approved_at`, `rejection_reason`.
- **`core.staff_profiles`** & **`core.other_profiles`**: Dedicated profiles for non-teaching staff and external/guest users.
- **`core.sessions`**: Active JWT refresh token session tracking & instant revocation.
- **`core.audit_log`**: Immutable audit history of all administrative actions.
- **`infra.notifications`**: Partitioned notification table supporting target audience filters (`all`, `student`, `faculty`, `staff`, `other`).

---

## 3. Online Database Connection Setup

The backend connects to local or online PostgreSQL databases (Supabase, Railway, Neon, AWS RDS) via `asyncpg`:

```env
# Online PostgreSQL / Supabase Connection String
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.supabase.co:5432/postgres
```

The database connection factory in `backend/app/core/database.py` manages an asynchronous connection pool (`AsyncSessionLocal`) with health check pinging (`pool_pre_ping=True`).
