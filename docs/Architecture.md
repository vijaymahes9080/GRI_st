# Enterprise Specification: System Architecture (React Native)

## 1. Architectural Philosophy
The GRI React Native Platform follows a **Feature-First Domain-Driven Architecture**. The code is organized into isolated feature domains in `src/features/` with clear architectural layers, avoiding monolithic state or tangled dependencies.

---

## 2. Layered Architecture Breakdown

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                            │
│           React Components · NativeWind Tailwind · Reanimated           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Uses / Renders
┌────────────────────────────────────▼────────────────────────────────────┐
│                              STATE & QUERY LAYER                        │
│           Zustand Stores (Global UI/Auth) · TanStack Query (Async APIs) │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ Invokes
┌────────────────────────────────────▼────────────────────────────────────┐
│                               SERVICE LAYER                             │
│        Axios API Client · MMKV Storage · Native Android Modules         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Presentation Layer
- Built with **NativeWind v4** (Tailwind CSS for React Native) and **Material Design 3** primitives.
- Animates UI components smoothly at 60 FPS via **React Native Reanimated v3**.
- Employs **@shopify/flash-list** for high-performance list rendering.

### State & Query Layer
- **Zustand**: Manages lightweight client-side state (theme, auth session, filter state).
- **TanStack Query v5**: Manages asynchronous server data, automatic background polling, Stale-While-Revalidate caching, and offline retry logic.

### Service Layer
- **Axios**: Standardized HTTP client with request/response interceptors for OAuth2 JWT refresh.
- **MMKV**: Fast native key-value storage for local session data.
- **Server-Driven Dynamic Engine**: Dynamic App Config hook (`useAppConfig`) & menu renderer (`DynamicMenu`) consuming `/api/v1/app/config`.
- **GRI Data Ingestion Engine**: Background ingestion adapters (`NewsAdapter`, `EventsAdapter`, `DepartmentsAdapter`, `AdmissionsAdapter`, `ExaminationAdapter`) with SHA256 checksum change detection.

