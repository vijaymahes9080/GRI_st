# Enterprise Specification: Folder Structure (React Native)

## 1. Directory Hierarchy Overview
The project source is structured under `src/` with clear domain boundaries:

```
src/
├── app/                            # Expo Router file-based route handlers
│   ├── _layout.tsx                 # Root layout & providers
│   ├── index.tsx                   # Welcome / Splash screen
│   ├── (auth)/                     # Auth stack routes (login, forgot-password)
│   └── (tabs)/                     # Tab bar navigation shell
│       ├── _layout.tsx             # Bottom tab bar layout
│       ├── home.tsx                # Dashboard
│       ├── academics.tsx           # Timetable & Attendance
│       ├── hostel.tsx              # Outpass & Mess
│       ├── ai_chat.tsx             # AI RAG Knowledge Bot
│       └── profile.tsx             # Profile & Settings
├── core/                           # System-wide infrastructure
│   ├── api/                        # Axios client & endpoints
│   ├── storage/                    # MMKV instance & helpers
│   ├── auth/                       # Zustand auth store & biometrics
│   ├── theme/                      # NativeWind colors & tokens
│   └── telemetry/                  # Sentry & analytics hooks
├── features/                       # Independent feature domain modules
│   ├── academics/
│   │   ├── api/                    # TanStack Query hooks & API functions
│   │   ├── components/             # Feature-specific UI widgets
│   │   ├── types/                  # Zod schemas & TypeScript types
│   │   └── index.ts                # Public export barrel
│   ├── examinations/
│   ├── finance/
│   ├── library/
│   ├── hostel/
│   ├── placement/
│   ├── ai_assistant/
│   ├── outreach/
│   ├── transport/
│   └── complaints/
└── components/                     # Reusable UI primitives (Button, Card, Input)
```
