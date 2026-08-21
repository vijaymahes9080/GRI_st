# Enterprise Specification: Project Overview (React Native Android)

## 1. Executive Summary
The **Gandhigram Rural Institute (GRI)** digital platform is a flagship enterprise mobile ecosystem specifically engineered for **Android devices** (targeting Android 14 / API 34+). 

Built using **React Native**, **TypeScript**, **Expo Router**, **Zustand**, and **TanStack Query**, the platform delivers a fast, mobile-first experience replacing legacy university web pages with native mobile features.

---

## 2. Core Stakeholders & Role Personas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   GRI Android Mobile Platform Users                     │
└───────┬──────────────┬──────────────┬──────────────┬──────────────┬─────┘
        │              │              │              │              │
 ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
 │   Student   │ │  Faculty  │ │   Parent    │ │   Admin   │ │  Alumni   │
 └─────────────┘ └───────────┘ └─────────────┘ └───────────┘ └───────────┘
```

| Persona | Core Capabilities & User Goals |
|---|---|
| **Student** | View timetable, track attendance, download hall tickets, pay fees, view results, access library OPAC, request out-passes, interact with AI assistant |
| **Faculty** | Mark geo-fenced BLE attendance, upload course materials, submit internal marks, approve student out-passes, record research publications |
| **Parent** | Monitor student attendance, track fee payment receipts, approve digital out-pass requests, receive critical exam alerts |
| **Admin** | University-wide announcements, grievance escalation monitoring, user management, audit logging |
| **Alumni** | Networking portal, placement mentorship, donation receipts, campus event invites |

---

## 3. Core Android Capabilities & Native Features
- **BLE Geo-Fenced Attendance**: Scans Bluetooth beacons via Android native Location & Bluetooth Manager permissions.
- **Android Biometric Auth**: Instant app unlock via `expo-biometrics` (Android Fingerprint / Face Unlock).
- **Push Notifications**: Firebase Cloud Messaging (FCM) integration with Android `POST_NOTIFICATIONS` channel management.
- **High-Performance Storage**: Synchronous `react-native-mmkv` key-value caching backed by Android Keystore encryption.
- **Offline Mode**: Automatic TanStack Query cache persistence for offline timetable and ID card access.
