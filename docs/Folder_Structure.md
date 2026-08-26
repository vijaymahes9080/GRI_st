# Enterprise Specification: Project Folder & Architecture Structure

Official University Source: **[The Gandhigram Rural Institute (Deemed to be University)](https://ruraluniv.ac.in/)**

---

## 1. Unified Directory Hierarchy

```text
/
├── src/
│   ├── app/                              # Dedicated Mobile View Route Modules
│   │   ├── (tabs)/                       # 5-Tab Navigation Shell (Home, Explore, Services, Alerts, Profile)
│   │   ├── about/                        # Vision, History, Genesis 1956, NAAC A++
│   │   ├── governance/                   # BoM, Society, Academic Council, Finance Committee
│   │   ├── administration/               # Chancellor, VC, Registrar, CoE, Deans
│   │   ├── academics/                    # 7 Schools, 28+ Departments, CBCS Details
│   │   ├── admissions/                   # UG/PG/Ph.D. Policies, Fees, Deadlines
│   │   ├── examination/                  # ESE Timetables, Hall Tickets, e-Sanad
│   │   ├── facilities/                   # Central Library, Computer Centre, Laboratories
│   │   ├── infrastructure/               # Hostels, Health Centre, Canteen, Guest House
│   │   ├── research/                     # RDC, Funded Projects, Patents, Publications
│   │   └── alumni/                       # Alumni Association, Reunions, Mentorship
│   │
│   ├── components/
│   │   ├── admin/                        # Web Admin Control Center Components
│   │   │   ├── CircularsManager.tsx      # Official Notice Publisher & Template Trigger
│   │   │   ├── CommunicationLogsView.tsx # Omnichannel Dispatch Gateway & Delivery Tracking
│   │   │   ├── ManageTemplatesModal.tsx  # Full CRUD Modal for Notification Templates
│   │   │   ├── TemplateSelectorModal.tsx # Pre-composed Announcement Template Picker
│   │   │   ├── BulkImportUsersModal.tsx  # High-throughput JSON User Batch Ingestion Engine
│   │   │   ├── EditUserContactModal.tsx  # Phone, WhatsApp & Email Channel Editor
│   │   │   ├── UserApprovalModal.tsx     # Student & Staff Registration Review Modal
│   │   │   └── UsersTable.tsx            # Multi-Role User Management Directory
│   │   │
│   │   ├── common/                       # Shared Common Components & Modals
│   │   │   ├── GRIEmblem.tsx             # Official Scalable Vector University Seal / Crest
│   │   │   ├── LiveVoiceConversationModal.tsx # Gemini 3.1 Flash Live Bidirectional Audio
│   │   │   └── CampusMapsExplorerModal.tsx    # Google Maps Platform Geolocation Grounding
│   │   │
│   │   └── web/                          # Responsive Web Portal Screen Views
│   │       ├── Navbar.tsx                # Sticky Navigation with Emblem & View Switcher
│   │       ├── HomeView.tsx              # Portal Home, Hero Banner, Metric Counters & Landmark Gallery
│   │       ├── ExploreView.tsx           # Searchable 7 Schools, 28+ Departments Directory
│   │       ├── DepartmentModal.tsx       # Department Details, Intake, Fees & Faculty Head
│   │       ├── ServicesView.tsx          # CoE Portal, ESE Timetables & e-Sanad Verification
│   │       ├── ExamHallTicketModal.tsx   # Interactive Hall Ticket Generator with QR Stamp
│   │       ├── AlertsView.tsx            # Real-time Filterable University Circulars
│   │       ├── AdminView.tsx             # Web Admin Center with User Management & Logs
│   │       ├── ProfileView.tsx           # Multi-Role Portal Switcher & ID Card
│   │       ├── AiChatView.tsx            # Grounded GRI RuralGPT Chat Assistant
│   │       ├── QuickSearchModal.tsx      # Universal Portal Search (Cmd/Ctrl + K)
│   │       └── MobileSimulator.tsx       # Interactive Mobile Frame Simulator
│   │
│   ├── core/
│   │   ├── data/
│   │   │   ├── griMasterData.ts          # Complete Master Data (7 Schools, 28+ Depts, Notices)
│   │   │   └── griMediaAssets.ts         # Verified Campus Photography, Labs & Leadership Assets
│   │   ├── firebase/
│   │   │   ├── config.ts                 # Firebase Client SDK Initialization & Firestore Instance
│   │   │   ├── firestoreSync.ts          # Real-time Firestore Listeners (Snapshot sync)
│   │   │   └── firestoreBatch.ts         # Atomic Batch Insertion Engine for Bulk Users
│   │   ├── store/
│   │   │   └── appStore.ts               # Central Zustand Store with Optimistic Updates
│   │   └── types.ts                      # System-wide TypeScript Interfaces & Enums
│   │
│   ├── App.tsx                           # Master Application Router & Layout Orchestrator
│   ├── main.tsx                          # React 18 DOM Entry Point
│   └── index.css                         # Tailwind CSS Global Imports & Root Variables
│
├── server.ts                             # Express.js Backend Server (Port 3000 Ingress & API Endpoints)
├── firestore.rules                       # Google Cloud Firestore Security Rules
├── metadata.json                         # Platform Application Manifest & Permissions
└── docs/                                 # Complete Engineering & Architecture Specifications
```
