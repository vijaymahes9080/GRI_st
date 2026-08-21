# GRI Production Real-Time Communication Platform & Omnichannel Broadcast Engine

## 🏛️ Executive Summary

The **GRI Real-Time Communication Platform** is a production-ready university communication system integrated into the GRI mobile app and FastAPI backend. It enables authorized **Admins to create, edit, approve, publish, schedule, and broadcast official university content and real-time notifications across 5 delivery channels** (In-App WebSockets, Push, Email, WhatsApp, and SMS) to targeted recipient groups with real-time delivery tracking, read receipts, dynamic CMS management, and immutable audit logs.

---

## 1. 🔄 Core Communication Workflow

```text
                               ┌──────────────────────────┐
                               │       ADMIN LOGIN        │
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │     ADMIN DASHBOARD      │
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │   NOTIFICATION COMPOSER  │
                               │  Title, Body, Priority,  │
                               │   Category, Attachment,  │
                               │   Target Filter, Channels│
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │    APPROVAL WORKFLOW     │
                               │ DRAFT → PENDING_APPROVAL │
                               │   → APPROVED / REJECTED  │
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │   NOTIFICATION ENGINE    │
                               │  Target Audience Engine  │
                               └────────────┬─────────────┘
                                            │
                 ┌──────────────────────────┼──────────────────────────┐
                 ▼                          ▼                          ▼
       ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
       │ In-App WebSockets│       │ Push (FCM/Expo)  │       │  Email (SMTP)    │
       └─────────┬────────┘       └─────────┬────────┘       └─────────┬────────┘
                 │                          │                          │
                 └──────────────────────────┼──────────────────────────┘
                                            ▼
                               ┌──────────────────────────┐
                               │  WhatsApp & SMS Gateway  │
                               └────────────┬─────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │    REGISTERED USERS      │
                               │  Real-Time Reception &   │
                               │   Read/Unread Tracking   │
                               └──────────────────────────┘
```

---

## 2. 👥 User Registration & Channel Availability

End users can register via Phone Number, Email, WhatsApp Number, Name, University ID, Role, Department, Programme, and Year. Channel availability and per-user notification preference toggles are tracked independently:

- **Phone Number**: SMS alert delivery.
- **WhatsApp Number**: WhatsApp Business API template messages.
- **Email Address**: Branded HTML institutional emails.
- **Push Tokens**: FCM / Expo push notifications.
- **User Preferences**: Toggles for Push, Email, WhatsApp, SMS, Emergency, Academic, Placement, and Event alerts.

---

## 3. 🎯 Target Audience Engine (`target_engine.py`)

Admins can target specific groups rather than broadcasting to all users:

- **Target Filters**:
  - `all`: All active registered users
  - `role`: Filter by `student`, `faculty`, `staff`, `other`
  - `department`: Target specific department ID
  - `programme`: Target specific degree programme
  - `year`: Target specific study year (e.g. 1st year, Final year)
  - `batch`: Target specific entry batch
  - `user`: Target individual User ID or Register Number
  - `hostel`: Hostel residents
  - `placement`: Placement drive applicants
- **Recipient Estimator**: `/api/v1/admin/notifications/estimate-recipients` calculates recipient counts before sending.

---

## 4. ⚡ 5 Open-Source Delivery Channels (`providers.py`)

1. **In-App Real-Time WebSockets (`RealtimeProvider`)**: Instant notification payload broadcast over `/ws/announcements` so connected mobile apps show incoming alert banners without refreshing.
2. **Push Notifications (`PushProvider`)**: FCM / Expo push notifications with deep-linking payload.
3. **Email Notifications (`EmailProvider`)**: Open-source SMTP wrapper producing responsive HTML emails with GRI brand colors (`#518214` Forest Green) and action links.
4. **WhatsApp Business Gateway (`WhatsAppProvider`)**: Formatted WhatsApp message dispatcher with template support.
5. **SMS Gateway (`SmsProvider`)**: Open-source REST HTTP Gateway / Gammu / Kannel standard for 140-character short text alerts.

> **Channel Failure Isolation**: Delivery failure in one channel (e.g., WhatsApp API timeout) will not abort Push, Email, SMS, or In-App delivery.

---

## 5. 🛡️ Notification Approval Workflow (`approval_workflow.py`)

Administrative actions follow strict state transitions:
- `DRAFT`: Content creator drafting alert
- `SUBMITTED`: Submitted for approval
- `PENDING_APPROVAL`: Queued for Admin review
- `APPROVED`: Admin approved; queued for immediate/scheduled broadcast
- `REJECTED`: Rejected with mandatory feedback reason
- `SENT`: Successfully dispatched to recipients

Every transition is recorded in `core.audit_log` with actor ID, timestamp, and metadata.

---

## 6. 💾 Database Schema (`schema_notifications_cms.sql`)

- `core.users`: Extended with `whatsapp_number`, `university_id`, `department_id`, `programme`, `batch_year`, `current_year`.
- `infra.official_notifications`: Primary notification record, status, targeting filter JSON, channels array.
- `infra.notification_recipients`: Per-user delivery and read status (`unread`, `read`, `read_at`).
- `infra.notification_channels`: Channel-level delivery stats (`sent_count`, `delivered_count`, `failed_count`).
- `infra.notification_preferences`: Per-user channel toggles.
- `infra.cms_content`: Dynamic CMS items (announcements, news, events, circulars, banners, downloads).

---

## 7. 📱 React Native Mobile Screens

- **Auth Registration** ([`src/app/auth/register.tsx`](file:///d:/current%20project/GRI/src/app/auth/register.tsx)): Phone, Email, WhatsApp, University ID, Role, Department, Programme, Year.
- **Alerts Inbox** ([`src/app/(tabs)/alerts.tsx`](file:///d:/current%20project/GRI/src/app/(tabs)/alerts.tsx)): Real-time WebSockets connection, unread badge counter, tab filters (`All`, `Unread`, `Circulars`, `Events`), pull-to-refresh, MMKV offline caching.
- **Notification Detail** ([`src/app/notifications/[id].tsx`](file:///d:/current%20project/GRI/src/app/notifications/[id].tsx)): Renders title, message, category, priority, deep-linking button, attachment links.
- **User Profile Preferences** ([`src/app/(tabs)/profile.tsx`](file:///d:/current%20project/GRI/src/app/(tabs)/profile.tsx)): Push, Email, WhatsApp, SMS, Emergency toggles.
- **Offline & Network Intimation System** ([`src/core/offline/OfflineNotice.tsx`](file:///d:/current%20project/GRI/src/core/offline/OfflineNotice.tsx)):
  - Top alert banner notifying the user when offline (`📡 Offline Mode Active — Viewing cached data`).
  - Automatic background health pinging to detect internet reconnects.
  - Automatic queue processing ([`syncQueue.ts`](file:///d:/current%20project/GRI/src/core/offline/syncQueue.ts)) flushing pending offline requests when internet returns.
- **Admin Mobile Management**:
  - Dashboard ([`src/app/admin/dashboard.tsx`](file:///d:/current%20project/GRI/src/app/admin/dashboard.tsx))
  - Composer ([`src/app/admin/composer.tsx`](file:///d:/current%20project/GRI/src/app/admin/composer.tsx))
  - Approval Queue ([`src/app/admin/approval_queue.tsx`](file:///d:/current%20project/GRI/src/app/admin/approval_queue.tsx))

---

## 8. 💻 Web Admin Control Panel (`admin/index.html`)

Access the Admin Web Panel by opening [`admin/index.html`](file:///d:/current%20project/GRI/admin/index.html) in any browser. It provides:
- Live KPI Counters (Total Users, Active Users, Pending Approval, Delivery Rate %, Failed Rate %)
- Audience Filter Builder & Recipient Estimator
- Multi-Channel Delivery Selectors (In-App, Push, Email, WhatsApp, SMS)
- Approval Queue & Action Modals
- CMS Content Management (Announcements, News, Events, Banners)
- Immutable Audit Log explorer

---

## 9. 🧪 Verification & Testing

Verify system code quality and test execution:

```bash
# TypeScript Type Checking
npx tsc --noEmit

# Pytest Test Suite Execution
$env:PYTHONPATH="."; python -m pytest backend/tests
```

**Verification Results**:
- `tsc --noEmit`: PASSED (0 Errors)
- `pytest`: PASSED (40/40 Tests, 100% Pass Rate)
