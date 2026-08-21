# Enterprise Specification: Navigation & Routing (Expo Router)

## 1. Declarative Routing Engine (Expo Router v3)
The app standardizes on **Expo Router**, providing file-based typed routes with dynamic stack/tab shells and deep linking support.

---

## 2. Directory Route Hierarchy Layout

```
src/app/
├── _layout.tsx                     # Global Root Layout (QueryClient + SafeArea)
├── index.tsx                       # Initial Welcome / Auth Check
├── (auth)/                         # Auth Stack
│   ├── login.tsx                   # Login Screen
│   └── forgot-password.tsx        # Password Recovery
└── (tabs)/                         # Main App Shell
    ├── _layout.tsx                 # Bottom Tab Bar Navigation
    ├── home.tsx                    # Student / Staff Dashboard
    ├── academics.tsx               # Timetable & Attendance
    ├── hostel.tsx                  # Outpass & Mess Management
    ├── ai_chat.tsx                 # RAG AI Assistant
    └── profile.tsx                 # Profile & Settings
```

---

## 3. Deep Link Rules & Android Scheme Setup
- **Android Scheme**: `gri://app/<feature>/<id>`
- **Web Domain Intent**: `https://app.ruraluniv.ac.in/<feature>/<id>`

### Mappings:
- `gri://app/hallticket/sem4` ➔ Opens Hall Ticket Screen for Semester 4.
- `gri://app/outpass/request/8841` ➔ Opens Outpass Approval Details.
