# GRI One — Gandhigram Rural Institute Unified Digital University Ecosystem

Official production-grade University Super-App, Real-Time Web Administration Platform, and AI Assistant for **The Gandhigram Rural Institute (Deemed to be University)**, Gandhigram, Dindigul, Tamil Nadu, India.  
Reference Official Website: **[https://ruraluniv.ac.in/](https://ruraluniv.ac.in/)**

---

## 🏛️ Application Architecture & Key Capabilities

The system transforms the entire official GRI website hierarchy and academic services into an omni-platform application featuring a **mobile-first React 18/Tailwind CSS interactive client**, **Express & FastAPI backend gateways**, **Firebase Firestore real-time synchronization**, and **Gemini 2.5 AI assistance**.

### 📱 5-Tab Navigation Structure
- **Home (`HomeView.tsx` / `(tabs)/index.tsx`)**: Live institutional notifications banner, quick academic service cards, VC message, emergency contacts, statistics counters, and press releases.
- **Explore (`ExploreView.tsx` / `(tabs)/discover.tsx`)**: Complete Category Directory for About GRI, Governance, Administration, Academics (7 Schools, 28+ Departments), Admissions, Facilities, Research, and Alumni.
- **Services (`ServicesView.tsx` / `(tabs)/services.tsx`)**: Controller of Examinations (CoE) Portal, ESE Timetable, Interactive Hall Ticket Generator with QR Verification, CIA Marks, e-Sanad Certificate Verification, and Grievance redressal.
- **Alerts (`AlertsView.tsx` / `(tabs)/alerts.tsx`)**: Real-time filterable Circulars, Exam Notices, Admission Deadlines, Tenders, and Recruitment with category search.
- **Profile (`ProfileView.tsx` / `(tabs)/profile.tsx`)**: Role-based Multi-Portal Switcher (Student, Faculty, Staff, Scholar, Alumni, Admin) with password security and contact channel preferences.

---

## 🔑 Authentication, Multi-Role RBAC & Bulk User Provisioning

A robust **Role-Based Access Control (RBAC)** architecture is deployed with server-side validation and Firestore synchronization:

- **Roles Supported**: `student`, `faculty`, `staff`, `scholar`, `alumni`, `admin`, `super_admin`.
- **Bulk JSON User Import Engine**: 
  - Administrative bulk ingestion endpoint (`POST /api/v1/users/bulk-import`).
  - Pre-import schema validation, role verification, email duplicate checking, and password constraints (min. 6 characters).
  - High-performance batch insertion into Firestore (`batchInsertUsersToFirestore`) using atomic write batches.
- **Contact Channel Verification**:
  - Independent phone, WhatsApp, and email registration (`POST /api/v1/users/register-contacts`).
  - Single and bulk test channel verification dispatch (`POST /api/v1/users/verify-channel`).
- **Security & Password Policies**: Temporary password allocation, mandatory password reset flags (`mustChangePasswordOnLogin`), and Firestore security rules.

---

## 📣 Real-Time Omnichannel Communication Engine

The **Admin Control Center** provides an integrated communication dispatch hub:
- **Target Channels**: In-App Real-Time Alerts, Push Notifications (FCM), Branded Email (SMTP/TLS 1.3), WhatsApp Business (Meta Cloud API), and SMS (TRAI DLT compliant).
- **Target Filters**: Audience filtering by role (`all`, `student`, `faculty`, `staff`, `scholar`, `alumni`), department, programme, semester, or individual user ID.
- **Live Delivery Logs**: Full dispatch tracking with gateway IDs, latency metrics, and real-time status updates in `CommunicationLogsView`.

---

## 🤖 GRI RuralGPT — Grounded University AI Assistant & Live Voice

Integrated **Google GenAI (`@google/genai`)** powered AI Assistant:
- **Real-Time Live Voice Conversations (`gemini-3.1-flash-live-preview`)**:
  - Direct low-latency bidirectional PCM audio streaming (16kHz microphone capture, 24kHz audio synthesis) over WebSocket (`/live`).
  - Zephyr voice persona with user-interrupt detection, audio visualizer orb, and live transcript streaming.
- **Dynamic Google Maps Grounding (`gemini-3.5-flash`)**:
  - Grounded geolocation navigation with the `googleMaps` tool configuration.
  - Interactive place cards, direct Google Maps navigation links, verified addresses, and snippet reviews for campus buildings, libraries, hostels, KVK farm, and nearest railway transit (Ambathurai).
- **Institutional Multi-Turn Grounding**: Trained on GRI history, Gandhian philosophy (Nai Talim, Shanti Sena), admission guidelines, CBCS regulations, and hostel mess systems.
- **Strict Guardrails**: Grounded answers with source citations; clear verification notices for unverified or private data.

---

## 📂 Project Directory Structure

```text
/
├── src/
│   ├── app/                      # Dedicated Mobile Screen Routes
│   │   ├── (tabs)/               # 5-Tab Navigation (Home, Explore, Services, Alerts, Profile)
│   │   ├── about/                # Vision, History, NAAC 'A', Authorities
│   │   ├── governance/           # BoM, Society, Academic Council, Finance Committee
│   │   ├── administration/       # Chancellor, VC, Registrar, CoE, Deans
│   │   ├── academics/            # 7 Schools, 28+ Departments, CBCS Details
│   │   ├── admissions/           # UG/PG/Ph.D. Policies, Fees, Deadlines
│   │   ├── examination/          # ESE Timetables, Hall Tickets, e-Sanad
│   │   ├── facilities/           # Central Library, Computer Centre, Laboratories
│   │   ├── infrastructure/       # Hostels, Health Centre, Canteen, Guest House
│   │   ├── research/             # RDC, Funded Projects, Patents, Publications
│   │   └── alumni/               # Alumni Association, Reunions, Mentorship
│   ├── components/
│   │   ├── admin/                # Admin Panel, Bulk Import Modal, Logs, User Modals
│   │   ├── web/                  # Web Views (Home, Explore, Services, Alerts, Admin, Profile)
│   │   └── AIChatModal.tsx       # Grounded RuralGPT Assistant Modal
│   ├── core/
│   │   ├── firebase/             # Firestore real-time listeners & batch operations
│   │   ├── store/                # Zustand State Stores with Optimistic Updates
│   │   ├── data/                 # Unified Master Institutional Data (28+ Departments)
│   │   └── types.ts              # System-wide TypeScript Interfaces & Role Definitions
│   ├── App.tsx                   # Top-level Application Layout & Navigation Router
│   └── main.tsx                  # Client Entry Point
├── server.ts                     # Express Backend Server (Port 3000) & API Routes
├── docs/                         # Comprehensive Engineering Specifications
└── firestore.rules               # Cloud Firestore Security Rules
```

---

## 📄 Engineering Documentation References

- **[GRI_PRODUCT_BLUEPRINT.md](GRI_PRODUCT_BLUEPRINT.md)**: 64-Section Complete Product Blueprint & Navigation Sitemap.
- **[PROJECT_ARCHITECTURE_AUDIT.md](PROJECT_ARCHITECTURE_AUDIT.md)**: Comprehensive Architecture, Risk Matrix & Verification Scorecard.
- **[docs/Authentication.md](docs/Authentication.md)**: Multi-Role RBAC, Token Lifecycle & Admin Control Workflows.
- **[docs/GRI_REALTIME_COMMUNICATION_PLATFORM.md](docs/GRI_REALTIME_COMMUNICATION_PLATFORM.md)**: Multi-Channel Broadcast Platform & Gateway Engine.
- **[docs/API_Standards.md](docs/API_Standards.md)**: REST API Specifications & Error Handling Conventions.
- **[docs/Database.md](docs/Database.md)**: Firestore & PostgreSQL Data Models, Normalization & Security Rules.
- [docs/Database.md](file:///d:/current%20project/GRI/docs/Database.md): PostgreSQL Database Schema & Migration Guide.
- [docs/notifications_architecture.md](file:///d:/current%20project/GRI/docs/notifications_architecture.md): Real-Time Broadcast Notification System Guide.
