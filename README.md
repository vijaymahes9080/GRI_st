# GRI Mobile App & Web Administration System

Official 100% Native Mobile Application and Admin Control System for **The Gandhigram Rural Institute (Deemed to be University)**, Gandhigram, Dindigul, Tamil Nadu, India.

---

## 🏛️ Application Architecture & Key Features

This application is built as a **pure native mobile application** using React Native, Expo Router, NativeWind (Tailwind CSS), Lucide Icons, FastAPI Backend, and PostgreSQL database.

### 📱 5-Tab Navigation Structure
- **Home (`src/app/(tabs)/index.tsx`)**: Main University Dashboard with announcements, quick action tiles, stats, and press releases.
- **Explore (`src/app/(tabs)/discover.tsx`)**: Complete Category Directory for About, Governance, Administration, Academics, Admissions, Facilities, Infrastructure, Research, E-News, Alumni.
- **Services (`src/app/(tabs)/services.tsx`)**: Examination System, ESE Timetable Query Tool, e-SANAD, Ph.D. Tracker, Sub-Portals Hub, Downloads.
- **Alerts (`src/app/(tabs)/alerts.tsx`)**: Filterable Circulars, Exam Notices, Admission Deadlines, Tenders, Careers.
- **Profile (`src/app/(tabs)/profile.tsx`)**: Authenticated Portal Switcher for Student, Scholar, Faculty, Staff, and Alumni portals.

---

## 🔑 Authentication, Admin Permission & Multi-Role System

A complete **Multi-Role Authentication & Permission Engine** is built into the backend (`/api/v1/auth` & `/api/v1/admin`):

- **Admin Role**: Self-registers using an administrative secret key + full access to all system modules, user approvals, and real-time broadcasts.
- **Student, Faculty, Staff, and Other Roles**: Accounts are created and pre-approved directly by the Admin. Users can only log in once approved by the Admin.
- **Approval Workflow**: Users have `approval_status IN ('approved', 'pending', 'rejected', 'suspended')`. Unapproved logins are rejected with detailed status responses.

---

## 📣 Real-Time Omnichannel Notification Broadcasting

The **Admin Control Panel** ([`admin/index.html`](file:///d:/current%20project/GRI/admin/index.html)) provides a real-time notification broadcast hub:
- **Target Audience Filter**: Broadcast to **All Users**, **Students Only**, **Faculty Only**, **Staff Only**, or **Others**.
- **Dispatch Channels**: In-App Push Notifications (via WebSockets `/ws/announcements` & FCM), Email Alerts, SMS Text Messages, WhatsApp Business.
- **Live Audit & History**: Stored permanently in PostgreSQL database table `infra.notifications`.

---

## 💾 Open-Source PostgreSQL Online Database Architecture

- **PostgreSQL Database Schema**:
  - `database/schema.sql` — Core institutional schemas (`core`, `academic`, `exam`, `campus`, `finance`, `placement`, `research`, `ai`, `infra`).
  - `database/schema_v2_extension.sql` — Server-Driven Remote Config, Feature Flags, Navigation Nodes, Unified Content.
  - `database/schema_auth_extension.sql` — Approval Status, Seed Roles (`admin`, `student`, `faculty`, `staff`, `other`), `sessions`, `audit_log`, `staff_profiles`.
- **Async Database Connection**: SQLAlchemy 2.0 + `asyncpg` driver supporting Supabase, Railway, Neon, or self-hosted open-source PostgreSQL.

---

## 🧪 Verified Test Suite & Quality Status

The backend includes a comprehensive automated test suite verified with `pytest`:
```bash
python -m pytest backend/tests/
# Result: 37 passed in 8.35s (100% passing)
```

---

## 📂 Dedicated Route Modules Structure

Over 100 dedicated page route screens are implemented under `src/app/`:

```text
src/app/
├── (tabs)/                 # 5-Tab Bottom Navigation Bar
├── about/                  # About GRI (History, Vision, NAAC 'A', Regulations, Profile, Staff)
├── governance/             # Governance (BoM, Society, Academic Council, Finance Committee)
├── administration/         # Administration (Chancellor, VC, Registrar, CoE, FO, CVO, Deans)
├── academics/              # Academics (7 Schools, 30+ Departments, CBCS, Department Detail Template)
├── admissions/             # Admissions (UG, PG, Ph.D., Fee Refund Policy, Hostel Fee, Prospectus)
├── examination/            # Examinations (ESE Timetable Tool, Transcripts, Ph.D. Tracker, e-SANAD)
├── facilities/             # Facilities (Central Library & OPAC, Computer Centre & NKN, Labs)
├── infrastructure/         # Infrastructure (Hostels, Guest House, Health Centre, Canteen)
├── research/               # Research (RDC Policy, Patents, Projects, Scholars)
├── alumni/                 # Alumni Association (Registration, Reunions, RaiseGRI Fund)
├── enews/                  # E-News & Press Releases (Circulars, Tenders, Archives)
├── auth/                   # Authenticated Portals (Student, Scholar, Dept Login)
├── navigation.tsx          # Master Directory Screen with Search
└── search/                 # Global Search Engine across 220+ topics
```

---

## 🛠️ Build & USB Deployment (16KB Page-Aligned Standalone APK)

The application is configured to build an **offline standalone APK** with pre-bundled Hermes JavaScript assets and 16KB page alignment.

### Execution Command:
```cmd
build_and_install.bat
```

---

## 📄 Documentation Files

- [GRI_REALTIME_COMMUNICATION_PLATFORM.md](file:///d:/current%20project/GRI/docs/GRI_REALTIME_COMMUNICATION_PLATFORM.md): Real-Time Communication Platform, 5 Open-Source Channels, Target Engine & Approval Workflow Documentation.
- [GRI_PRODUCT_BLUEPRINT.md](file:///d:/current%20project/GRI/GRI_PRODUCT_BLUEPRINT.md): 64-Section Complete Product Blueprint and Navigation Sitemap.
- [PROJECT_ARCHITECTURE_AUDIT.md](file:///d:/current%20project/GRI/PROJECT_ARCHITECTURE_AUDIT.md): Project Architecture and System Audit.
- [docs/Authentication.md](file:///d:/current%20project/GRI/docs/Authentication.md): Comprehensive Authentication & Admin Permission Documentation.
- [docs/Database.md](file:///d:/current%20project/GRI/docs/Database.md): PostgreSQL Database Schema & Migration Guide.
- [docs/notifications_architecture.md](file:///d:/current%20project/GRI/docs/notifications_architecture.md): Real-Time Broadcast Notification System Guide.
