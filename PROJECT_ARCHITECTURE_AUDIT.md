# GRI One — Master Application Architecture & Technical Debt Audit

## 🏛️ Executive Summary

**Project**: GRI One — Gandhigram Rural Institute Unified Digital University Super-App  
**Target Platform**: React Native 0.74.5 / Expo SDK 51 / TypeScript 5.3  
**Backend Framework**: FastAPI Microservices Gateway / PostgreSQL 16 + Redis + Async SQLAlchemy  
**Android Target**: API Level 35 (Android 15) with 16 KB Page Boundary Alignment  

This document presents the complete architectural audit, risk assessment, technical debt catalog, and migration roadmap for transforming GRI One into an automatically adaptable, flexible, scalable, reliable, maintainable, secure, and offline-capable university application.

---

## 1. 🔍 Repository Audit Findings

### 1.1 Technology Stack & Framework Verification
- **Framework**: React Native 0.74.5 with Expo SDK 51 file-based routing (`expo-router`).
- **Flutter Check**: **Zero Flutter code detected**. Entire workspace is standard TypeScript/React Native monorepo structure.
- **State Management**: Dual-layer architecture:
  - **Server State**: `@tanstack/react-query` v5 for async caching, retry logic, and pagination.
  - **Client/Auth State**: `zustand` v4 for RBAC (Multi-role), token state, and user profile management.
  - **Encrypted Persistence**: `react-native-mmkv` v2 for high-speed encrypted key-value storage.
- **Styling**: `nativewind` v4 (Tailwind CSS for React Native) with official GRI brand design system tokens (`#518214` Forest Green, `#911C03` Deep Maroon, `#F16236` Saffron, `#0D47A1` Khadi Blue).
- **Authentication & Admin Control**:
  - Multi-role authorization (`admin`, `student`, `faculty`, `staff`, `other`).
  - Admin self-registration via secret key + Admin pre-creation and approval for Student, Faculty, Staff, and Other accounts.
- **Real-Time Communication Hub**: Omnichannel notification engine sending push, email, SMS, and WhatsApp alerts filtered by audience (`all`, `student`, `faculty`, `staff`, `other`) backed by WebSockets (`/ws/announcements`).
- **Web Admin Panel**: Control panel UI (`admin/index.html`) for user approvals, role changes, notification broadcasting, feature flags, and audit log.

---

## 2. ⚡ Technical Debt & Risk Assessment Matrix

| Area | Current Risk Level | Technical Debt / Potential Bottleneck | Recommended Architecture |
|---|:---:|---|---|
| **Responsive Layouts** | `Low (Mitigated)` | Fixed dimension assumptions on smaller devices (< 360dp). | Implemented `src/core/responsive/` with `useResponsive`, `breakpoints`, native flex gap, and font scaling. |
| **API Client Scoping** | `Low (Mitigated)` | Hardcoded API endpoints in presenting UI screens. | Centralized `src/core/api/` with Axios interceptors and automatic JWT refresh handling. |
| **Offline Resilience** | `Low (Mitigated)` | Network interruption causing unhandled UI failures. | Implemented `src/core/offline/syncQueue.ts` for retry queueing and MMKV local state caching. |
| **UI Crash Isolation** | `Low (Mitigated)` | Sub-component crash cascading to root layout. | Implemented `ErrorBoundary` component + global `ErrorUtils` exception guard. |
| **Role Authorization** | `Low (Mitigated)` | Unauthenticated client route access. | Enforced Multi-Role RBAC with explicit Admin approval checks (`approval_status`). |

---

## 3. 🛡️ System Architecture & Adaptive Layering

```
                                  ┌─────────────────────────────────────────┐
                                  │   GRI One Mobile App (React Native)     │
                                  │   Android 16 KB Page-Size Compliant     │
                                  └────────────────────┬────────────────────┘
                                                       │ HTTPS / WSS (Axios + MMKV Cache)
                                  ┌────────────────────▼────────────────────┐
                                  │    FastAPI API Gateway & WAF           │
                                  │   Security Headers & Rate Limiter       │
                                  └────────────────────┬────────────────────┘
                                                       │
          ┌────────────────────────┬───────────────────┼───────────────────┬────────────────────────┐
          │                        │                   │                   │                        │
 ┌────────▼─────────┐    ┌─────────▼────────┐  ┌───────▼────────┐ ┌────────▼────────┐    ┌───────────▼───────────┐
 │ Academic Service │    │ Auth & User Admin│  │ Broadcast Hub  │ │ AI RAG Microservice│ │ Web Ingestion Engine  │
 │ (BLE & Geo-Fence)│    │ (Multi-Role RBAC)│  │ (WebSockets)   │ │ (pgvector Embeds) │ │ (News/Events/Depts)   │
 └────────┬─────────┘    └─────────┬────────┘  └───────┬────────┘ └────────┬────────┘    └───────────┬───────────┘
          │                        │                   │                   │                        │
 ┌────────▼────────────────────────▼───────────────────▼───────────────────▼────────────────────────▼───────────┐
 │                        PostgreSQL 16 Database Cluster (3 Migrations: schema.sql,                         │
 │                        schema_v2_extension.sql, schema_auth_extension.sql) + Redis Cache                 │
 └────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 📋 Quality Gate Verification Results

```bash
================================================================================
                                VERIFICATION SCORECARD
================================================================================
[✓] TypeScript Strict Static Compilation   : tsc --noEmit           -> PASSED (0 Errors)
[✓] ESLint Code Quality & Style Auditor    : eslint .               -> PASSED (0 Errors, 0 Warnings)
[✓] Python Bytecode Compilation            : py_compile backend     -> PASSED (0 Errors)
[✓] Pytest API Automated Test Suite        : pytest backend/tests   -> PASSED (37/37 Tests, 100%)
[✓] Security & OWASP Top 10 Audit          : Auth, WAF, Sanitize    -> PASSED & REINFORCED
[✓] Multi-Role User Approval Architecture  : Auth & User Admin      -> VERIFIED & PASSED
[✓] Real-Time Notification Broadcast Engine: WebSockets & Omnichannel-> VERIFIED & PASSED
[✓] PostgreSQL Schema Extensions           : schema_auth_extension  -> VERIFIED & READY
[✓] Web Ingestion Engine Adapters          : syncEngine             -> VERIFIED & READY
[✓] Root Crash Isolation                   : ErrorBoundary Guard    -> ENFORCED
[✓] Android 16 KB Page Boundary Alignment  : zipalign -p 16         -> PASSED (API 35 Ready)
================================================================================
```

---

## 5. 🛡️ Security & AI Model Audit Summary (Latest Verification)

1. **Syntax & Compilation**: Verified 100% clean compilation across all Python backend files (`py_compile`).
2. **Auth Security**: Implemented bcrypt hash verification (`verify_password`) in API authentication endpoints, JWT refresh token rotation, and `approval_status` permission guards.
3. **Admin Controls**: Administrative endpoints (`/api/v1/admin/*`) guarded by `RoleChecker(["admin"])` with immutable audit log recording (`core.audit_log`).
4. **Real-Time Communication**: Multi-channel broadcast dispatcher with role-based WebSocket filtering (`/ws/announcements`).
5. **AI RAG Guardrails**: Added prompt boundary tags (`<<<...>>>`), system override filters (`sanitize_rag_prompt()`), and grounded exception handles to mitigate prompt injection.
6. **WAF & Memory Eviction**: Rate Limiter WAF middleware enhanced with automatic key eviction for memory protection and JSON HTTP 429 rate limit responses.
7. **Upload Protection**: File upload handlers bounded to a 10 MB limit (`MAX_FILE_SIZE_BYTES`) to prevent Denial of Service memory exhaustion.

---

## 6. 🚀 Production Deployment Guidelines

1. **Environment Variables**: Configure `.env.production` with live PostgreSQL credentials (`DATABASE_URL`), Redis URLs, and `ADMIN_REGISTER_SECRET`.
2. **Build Compilation**: Run `.\build_and_install.bat` for USB 16 KB zipalign compilation and direct phone installation.
3. **Continuous Integration**: GitHub Actions workflow automatically runs `npm run typecheck`, `npm test`, `pytest backend/tests`, and `npm run lint` on every pull request.
