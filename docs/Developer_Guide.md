# Enterprise Specification: GRI One Developer & Engineering Guide

Official Reference: **[The Gandhigram Rural Institute (Deemed to be University)](https://ruraluniv.ac.in/)**  
Ecosystem: Full-Stack React 18 Web Portal + Native Android Client + Express Server + Firebase Firestore + Google GenAI SDK.

---

## 1. Environment & Prerequisites
- **Node.js**: `v20.x LTS` or higher
- **Package Manager**: `npm`
- **Database & Persistence**: Google Cloud Firestore (`ai-studio-gri-abda2eed-5946-4405-900c-e9c2f6dc2530`)
- **AI & Grounding SDK**: Google GenAI SDK (`@google/genai`) with Gemini 2.5 Flash / Pro, Gemini 3.1 Flash Live (PCM Audio), and Gemini 3.5 Flash (Google Maps Grounding)
- **Port Ingress**: Dev server binds to `0.0.0.0:3000`

---

## 2. Quickstart & Command Reference

```bash
# 1. Install project dependencies
npm install

# 2. Start Full-Stack Dev Server (Express + Vite on Port 3000)
npm run dev

# 3. Production Build & Server Bundle
npm run build

# 4. Launch Production CommonJS Server
npm start

# 5. Type-Check and Linter
npm run lint
```

---

## 3. Key Architecture & Modules

### 3.1 Web & Desktop Interface (`src/components/web/`)
- `Navbar.tsx`: Top utility bar, official bilingual motto, search trigger, view switcher, and official university emblem (`GRIEmblem.tsx`).
- `HomeView.tsx`: Hero banner with campus heritage photo overlay, live notices ticker, metric counters, portal tiles, campus landmark gallery (`griMediaAssets.ts`), and leadership profiles.
- `ExploreView.tsx` & `DepartmentModal.tsx`: Searchable 7 Schools, 28+ Academic Departments, degree programmes, seat intake, and fees.
- `ServicesView.tsx` & `ExamHallTicketModal.tsx`: Controller of Examinations portal, interactive hall ticket generator with QR verification, CIA internal marks, and e-Sanad.
- `AlertsView.tsx`: Real-time filterable official notices, exam updates, admission deadlines, and tender downloads.
- `AdminView.tsx`: User management, bulk JSON import, channel test verification, communication dispatch logs, and circulars management.

### 3.2 Notification & Template Management (`src/components/admin/`)
- `ManageTemplatesModal.tsx`: Full CRUD administrative modal for viewing, creating, editing, and deleting announcement templates.
- `TemplateSelectorModal.tsx`: Modal for choosing pre-composed templates when creating announcements or dispatching communications.
- `BulkImportUsersModal.tsx`: High-performance JSON user ingestion engine with atomic Firestore batch writes.

### 3.3 AI & Geolocation Grounding (`src/components/common/`)
- `LiveVoiceConversationModal.tsx`: Real-time bidirectional PCM audio conversation using `gemini-3.1-flash-live-preview`.
- `CampusMapsExplorerModal.tsx`: Geolocation campus navigation grounded with Google Maps Platform and Gemini 3.5 Flash.
- `GRIEmblem.tsx`: Scalable SVG vector seal of the university.

---

## 4. Visual Media & Image Asset Standards
- All `<img>` tags must include `referrerPolicy="no-referrer"`.
- Official media assets must be catalogued with captions and categories in `src/core/data/griMediaAssets.ts`.
- Emblems and official insignia must use `GRIEmblem.tsx` for crisp rendering across all screen densities.

