# Enterprise Specification: Multi-Role Authentication, Admin Permissions & Tokens

## 1. Multi-Role Account Hierarchy & Permissions

The GRI Authentication & Authorization System strictly separates user roles, credentials, and access privileges across mobile and web interfaces:

| Role | Creation / Provisioning Method | Login Permission | Privileges |
|---|---|---|---|
| **`super_admin` / `admin`** | Master provisioning / Secret key registration | Immediately Approved | Full system access, bulk user ingestion, user approval/suspension, circular publishing, multi-channel broadcasts |
| **`student`** | Bulk JSON Import or Admin Creation | Admin Approved | Access to student portal, courses, attendance, exam hall ticket, CIA marks, circulars |
| **`faculty`** | Bulk JSON Import or Admin Creation | Admin Approved | Access to faculty portal, course syllabi, attendance management, student evaluations |
| **`staff`** | Bulk JSON Import or Admin Creation | Admin Approved | Access to administrative modules, department workflows, circular distribution |
| **`scholar`** | Bulk JSON Import or Admin Creation | Admin Approved | Access to Ph.D. progress tracker, fellowship records, research publications |
| **`alumni`** | Self-Registration or Admin Creation | Admin Approved | Access to alumni directory, reunions, RaiseGRI fund, mentorship network |

---

## 2. Admin Approval & Account Control Workflows

1. **Individual & Bulk User Creation**:
   - Single User creation via `POST /api/v1/admin/users/create`.
   - High-throughput batch creation via `POST /api/v1/users/bulk-import` with automated schema validation and Firestore atomic batch commits.
2. **Approval Status Engine**:
   Every account tracks `approval_status`:
   - `approved`: User can log into the Mobile App or Portal.
   - `pending`: User cannot log in until Admin grants access (`403 Account pending approval`).
   - `rejected`: Access denied with reason (`403 Access rejected: {reason}`).
   - `suspended`: Access temporarily blocked by Admin (`403 Account suspended`).
3. **Password Security & Lifecycle Management**:
   - Newly created or imported users receive a temporary password (`tempPassword` e.g., `GRI@Admin2026`).
   - The security flag `mustChangePasswordOnLogin: true` forces users to define a private password upon first authentication.
   - Users can update their password at any time via Profile (`updateUserPassword`), resetting `passwordStatus` to `'user_custom'` and updating `passwordUpdatedAt`.

---

## 3. Contact Channels & Notification Verification

User accounts store multi-channel communication endpoints verified independently:
- **`phone`**: Primary mobile number for SMS circular alerts.
- **`whatsappAlertsEnabled`**: Flag and number for Meta Cloud WhatsApp announcements.
- **`email` / `alternateEmail`**: Institutional and personal emails for official circulars and password recovery.
- **Verification Engine**: `POST /api/v1/users/verify-channel` dispatches OTP verification pings across SMS, WhatsApp, and Email.

---

## 4. OAuth2 / JWT & Firebase Auth Lifecycle

- **Firebase Authentication**: Seamless client-side token acquisition and session state synchronization (`onAuthStateChanged`).
- **Access Token**: Short-lived JWT (60 min expiration) containing `{ sub: user_id, email: string, role: string }`.
- **Refresh Token**: Long-lived JWT (7 days expiration) with DB session tracking in `core.sessions`.
- **Firestore Security Rules**: Role-based Firestore security policies enforcing write restrictions to administrators.
