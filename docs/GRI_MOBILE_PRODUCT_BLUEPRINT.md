# GRI Mobile App — Master Product Blueprint

Source of Truth: Official Gandhigram Rural Institute Website ([ruraluniv.ac.in](https://ruraluniv.ac.in/)) and connected university portals.

---

## 1. Complete Application Sitemap

```text
GRI MOBILE
│
├── PUBLIC
│   ├── Home
│   ├── About GRI
│   ├── Governance
│   ├── Administration
│   ├── Academics
│   ├── Admissions
│   ├── Examination
│   ├── Facilities
│   ├── Infrastructure
│   ├── Alumni
│   ├── E-News
│   ├── Search
│   ├── Downloads
│   └── Contact
│
├── AUTHENTICATION
│   ├── Student Login
│   ├── Student Forgot Password
│   ├── Department Login
│   ├── Scholar Login
│   └── Alumni Login
│
├── STUDENT
│   ├── Dashboard
│   ├── Profile
│   ├── Academic
│   ├── Courses
│   ├── Timetable
│   ├── Attendance
│   ├── Examination
│   ├── Results
│   ├── Fees
│   ├── Notifications
│   ├── Documents
│   └── Logout
│
├── SCHOLAR
│   ├── Dashboard
│   ├── Profile
│   ├── Ph.D. Tracking
│   ├── Research
│   ├── Documents
│   └── Logout
│
├── DEPARTMENT
│   ├── Dashboard
│   ├── Faculty
│   ├── Students
│   ├── Programmes
│   ├── Courses
│   ├── Research
│   ├── Notifications
│   └── Logout
│
└── ALUMNI
    ├── Alumni Home
    ├── Register / Login
    ├── Profile
    ├── Alumni Events
    ├── Distinguished Alumni
    ├── Contributions
    ├── Gallery
    └── Logout
```

---

## 2. Recommended 5-Tab Mobile Navigation Layout

```text
┌─────────────────────────────────────────────┐
│                 GRI MOBILE                  │
├─────────────────────────────────────────────┤
│                                             │
│                SCREEN CONTENT               │
│                                             │
├─────────────────────────────────────────────┤
│ Home │ Explore │ Services │ Alerts │ Profile│
└─────────────────────────────────────────────┘
```

* **Home**: Live website sync banner, search, announcements, highlights.
* **Explore**: About GRI, Academics, Admissions, Governance, Administration, Facilities, Infrastructure, Alumni.
* **Services**: Examination, Student Portal, Scholar Portal, Department Portal, e-SANAD, Downloads.
* **Alerts**: Circulars, Examination Notifications, Admission Notifications, Events, Tenders, Careers.
* **Profile**: Guest → Login Gateway | Authenticated → Student / Scholar / Department / Alumni Profile.

---

## 3. Core Database Architecture

```text
GRI DATABASE
│
├── Identity (users, roles, sessions, tokens)
├── Public Content (news, announcements, circulars, tenders, careers)
├── Academic (schools, departments, programmes, courses, faculty, cbcs)
├── Admissions (cycles, eligibility, prospectus, fee_structures, refund_policy)
├── Examination (timetables, transcripts, duplicate_certs, esanad, phd_tracking)
├── Student (profiles, enrolments, attendance, internal_marks, results, fees)
├── Research (projects, publications, patents, scholars, mous)
├── Facilities & Infrastructure (library, labs, hostels, health, security)
└── Notifications & Documents (device_tokens, pdf_archive, checksums)
```

---

## 4. REST API Gateway Structure (`/api/v1`)

* **Public**: `/api/v1/home`, `/api/v1/news`, `/api/v1/events`, `/api/v1/circulars`, `/api/v1/tenders`, `/api/v1/careers`
* **Institutional**: `/api/v1/about`, `/api/v1/governance`, `/api/v1/administration`, `/api/v1/academics`, `/api/v1/admissions`, `/api/v1/examinations`, `/api/v1/facilities`, `/api/v1/infrastructure`, `/api/v1/research`, `/api/v1/alumni`
* **Auth & Portals**: `/api/v1/auth/login`, `/api/v1/student/*`, `/api/v1/scholar/*`, `/api/v1/department/*`
