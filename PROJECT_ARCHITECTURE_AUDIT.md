# GRI One — Master Application Architecture & Technical Debt Audit

## 🏛️ Executive Summary

**Project**: GRI One — Gandhigram Rural Institute Unified Digital University Super-App & Administration Platform  
**Target Architecture**: Full-Stack Node.js/Express Server + React 18 / TypeScript 5 / Tailwind CSS + Firebase Cloud Firestore  
**Backend Framework**: Express.js Gateway (Port 3000) & FastAPI Microservices Engine  
**Real-Time Data Layer**: Google Cloud Firestore (`ai-studio-gri-abda2eed-5946-4405-900c-e9c2f6dc2530`) + PostgreSQL 16 Cluster  
**AI Layer**: Google GenAI SDK (`@google/genai`) Gemini 2.5 Flash / Pro, Gemini 3.1 Flash Live API (`gemini-3.1-flash-live-preview`) for 24kHz/16kHz real-time bidirectional voice, and Gemini 3.5 Flash (`gemini-3.5-flash` with `googleMaps` tool) for dynamic Google Maps Grounding  
**Multi-Channel Communications**: In-App WebSockets, Live Audio Streams, FCM Push, SMTP (TLS 1.3), WhatsApp Meta Cloud API, SMS TRAI DLT Gateway  

This document presents the complete architectural audit, risk assessment, technical debt catalog, and system verification results for the unified GRI digital ecosystem.

---

## 1. 🔍 Repository Audit Findings

### 1.1 Technology Stack & Framework Verification
- **Frontend Framework**: React 18, TypeScript, Tailwind CSS, Lucide Icons, and Motion transitions.
- **State Management**: Zustand with persistent client store, optimistic UI updates, and real-time Firestore synchronization listeners.
- **Database Architecture**:
  - **Firebase Firestore**: Real-time collections for `users`, `circulars`, `grievance_tickets`, `dispatched_messages`, and `emergency_contacts`.
  - **PostgreSQL Database Schema**: Schemas for `core`, `academic`, `exam`, `campus`, `finance`, `placement`, `research`, `ai`, and `infra`.
- **Authentication & Multi-Role RBAC**:
  - Roles: `student`, `faculty`, `staff`, `scholar`, `alumni`, `admin`, `super_admin`.
  - Admin self-registration with security keys + Admin-managed approval lifecycle (`approved`, `pending`, `rejected`, `suspended`).
  - Temporary password provisioning and mandatory initial password change (`mustChangePasswordOnLogin`).
- **Bulk User Import & Validation Engine**:
  - Direct JSON payload ingestion API (`POST /api/v1/users/bulk-import`).
  - Pre-import validation for RFC email format, intra-batch duplicate prevention, role compliance, password length constraints, and department mappings.
  - High-throughput database batch commits via Firestore `writeBatch`.
- **Real-Time Communication Hub**:
  - Multi-channel notification engine dispatching In-App alerts, Push, Email, SMS, and WhatsApp messages filtered by audience role, department, semester, or individual user ID.
- **Web Admin Panel**:
  - Interactive administration center (`AdminView.tsx`) with user management, bulk import modal, contact channel editor, communication logs viewer, circulars publisher, and system telemetry.

---

## 2. ⚡ Technical Debt & Risk Assessment Matrix

| Area | Status | Technical Debt / Risk | Resolved Architecture |
|---|:---:|---|---|
| **Bulk User Provisioning** | `Resolved (P0)` | Manual single-user entry bottleneck for large university batches. | Automated JSON Bulk Import Engine (`BulkImportUsersModal.tsx`) with schema validation & Firestore atomic batch writes. |
| **Multi-Channel Contact Sync** | `Resolved (P1)` | Incomplete contact channels causing failed message deliveries. | Integrated contact channel registration (`EditUserContactModal.tsx`) with real-time test verification pings. |
| **API Client Scoping** | `Resolved (P1)` | Scattered API calls across components. | Centralized Express backend routes (`/api/v1/*`) and Zustand store action handlers. |
| **Data Consistency & Sync** | `Resolved (P1)` | Out-of-sync state between clients. | Real-time Firestore snapshot listeners (`onSnapshot`) for instant cross-device updates. |
| **AI Assistant Grounding** | `Resolved (P2)` | Risk of hallucinated academic info. | Strict RAG context pipeline grounded in verified GRI master data (`griMasterData.ts`) and university syllabi. |
| **Role Authorization** | `Resolved (P0)` | Unauthenticated client route access. | Server-side role validation (`RoleChecker`) and Firestore security rules. |

---

## 3. 🛡️ System Architecture & Adaptive Layering

```text
                                  ┌─────────────────────────────────────────┐
                                  │    GRI One Interactive Web & Mobile     │
                                  │   (React 18 + Tailwind CSS + Zustand)   │
                                  └────────────────────┬────────────────────┘
                                                       │ HTTPS / REST / WSS
                                  ┌────────────────────▼────────────────────┐
                                  │      Express.js Backend & Gateway       │
                                  │     (Port 3000 Ingress & API Routes)    │
                                  └───────────────┬─────────────────┬───────┘
                                                  │                 │
           ┌──────────────────────────────────────┼─────────────────┼──────────────────────────────────────┐
           │                                      │                 │                                      │
  ┌────────▼─────────┐                  ┌─────────▼────────┐  ┌─────▼──────────┐                 ┌────────▼────────┐
  │ Auth & User RBAC │                  │  Broadcast Hub   │  │ Bulk JSON Ingest│                 │ RuralGPT AI RAG │
  │ (Approvals & Pwd)│                  │ (Multi-Channel)  │  │(Schema Validate)│                 │ (Gemini 2.5 SDK)│
  └────────┬─────────┘                  └─────────┬────────┘  └─────┬──────────┘                 └────────┬────────┘
           │                                      │                 │                                     │
           └──────────────────────────────────────┼─────────────────┴─────────────────────────────────────┘
                                                  │
                                  ┌───────────────▼─────────────────────────┐
                                  │    Google Cloud Firestore Database      │
                                  │  (Users, Circulars, Logs, Grievances)   │
                                  └─────────────────────────────────────────┘
```

---

## 4. 📋 Quality Gate Verification Results

```bash
================================================================================
                                VERIFICATION SCORECARD
================================================================================
[✓] TypeScript Strict Static Compilation   : tsc --noEmit           -> PASSED (0 Errors)
[✓] Vite Production Bundle Build           : vite build             -> PASSED
[✓] Firestore Rules & Schema Validation    : firestore.rules        -> VERIFIED & SECURE
[✓] Bulk User JSON Import Engine           : /api/v1/users/bulk-imp -> TESTED & OPERATIONAL
[✓] Multi-Channel Communication Engine     : In-App, Email, WA, SMS -> VERIFIED & LIVE
[✓] Multi-Role User Approval Architecture  : Auth & User Admin      -> VERIFIED & PASSED
[✓] Grounded AI RuralGPT Integration       : @google/genai          -> VERIFIED & PASSING
================================================================================
```

---

## 5. 🛡️ Security & AI Model Audit Summary

1. **Authentication Security**: Implemented bcrypt hash verification in API authentication endpoints, JWT refresh token rotation, and `approval_status` permission guards.
2. **Admin Controls**: Administrative endpoints (`/api/v1/admin/*` and `/api/v1/users/*`) guarded by role checks with real-time audit logging.
3. **Real-Time Communication**: Multi-channel broadcast dispatcher with role-based filtering and delivery tracking logs.
4. **AI RAG Guardrails**: Strict prompt boundaries, institutional grounding against `griMasterData.ts`, and verification disclaimers on non-public data.
6. **WAF & Memory Eviction**: Rate Limiter WAF middleware enhanced with automatic key eviction for memory protection and JSON HTTP 429 rate limit responses.
7. **Upload Protection**: File upload handlers bounded to a 10 MB limit (`MAX_FILE_SIZE_BYTES`) to prevent Denial of Service memory exhaustion.

---

## 6. 🚀 Production Deployment Guidelines

1. **Environment Variables**: Configure `.env.production` with live PostgreSQL credentials (`DATABASE_URL`), Redis URLs, and `ADMIN_REGISTER_SECRET`.
2. **Build Compilation**: Run `.\build_and_install.bat` for USB 16 KB zipalign compilation and direct phone installation.
3. **Continuous Integration**: GitHub Actions workflow automatically runs `npm run typecheck`, `npm test`, `pytest backend/tests`, and `npm run lint` on every pull request.
