# GRI Mobile App — Complete Product Blueprint

I treated the current GRI website and its connected portals as the **source of truth**, rather than inventing university functions that are not represented there. The current public navigation is organized around **About GRI, Governance, Administration, Academics, Admissions, Examination, Facilities, Infrastructure, Alumni and E-News**. ([Gandhigram Rural Institute](https://ruraluniv.ac.in/))

The connected ecosystem also contains a **Student Portal, Department Portal, Scholar Portal and e-SANAD**, so these should be represented as authenticated/application modules rather than flattened into ordinary public pages. ([Rural University Portal](https://www.portal.ruraluniv.ac.in/))

---

# 1. Complete Application Sitemap

## Level 0 — Application

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

# 2. Home Module — Screens

The home screen should convert the website's information-heavy structure into a mobile dashboard.

### Screens

```text
H01  Splash Screen
H02  Welcome / First Launch
H03  Home
H04  Global Search
H05  Search Results
H06  Notifications
H07  Important Announcements
H08  Announcement Details
H09  Events
H10  Event Details
H11  Latest News
H12  News Details
H13  Downloads
H14  Document Viewer
H15  Contact GRI
H16  Campus Information
```

### Home flow

```text
Splash
  ↓
Home
  ├── Search
  ├── Announcement
  ├── Event
  ├── News
  ├── Admission
  ├── Examination
  ├── Academic
  └── Portal
```

---

# 3. About GRI

This should mirror the institutional information exposed by the website.

```text
ABOUT GRI
│
├── A01 About GRI Home
├── A02 History
├── A03 Vision & Mission
├── A04 Objectives
├── A05 Institutional Profile
├── A06 Organisational Information
├── A07 Important Documents
├── A08 Annual Reports
├── A09 Mandatory Disclosures
├── A10 NAAC
├── A11 NIRF
├── A12 Regulations
├── A13 Code of Conduct
├── A14 Staff List
└── A15 Working Hours
```

The current academic/public material explicitly exposes regulations, UGC regulations, CCS rules, teaching/non-teaching/student codes of conduct, downloads, working hours and staff lists. ([Gandhigram Rural Institute](https://www.ruraluniv.ac.in/academics?content=CBCSsystem))

---

# 4. Governance Module

The website currently identifies **Governance System, Board of Management, Planning Board, Finance Committee and Academic Council**. ([Gandhigram Rural Institute](https://ruraluniv.ac.in/Governance?content=System))

```text
GOVERNANCE
│
├── G01 Governance Home
├── G02 Governance System
├── G03 GRI Society
├── G04 Board of Management
├── G05 Planning & Monitoring Board
├── G06 Finance Committee
├── G07 Academic Council
├── G08 Academic Council Members
├── G09 Committee Information
└── G10 Governance Documents
```

### Flow

```text
Governance
    │
    ├── GRI Society
    │
    ├── Board of Management
    │
    ├── Planning Board
    │
    ├── Finance Committee
    │
    └── Academic Council
             ↓
        Members / Details
```

---

# 5. Administration Module

The administration section currently includes **Chancellor, Vice-Chancellor, Registrar, Controller of Examinations, Finance Officer, Chief Vigilance Officer, Deans, Heads of Departments and administrative officers**. ([Gandhigram Rural Institute](https://www.ruraluniv.ac.in/administration?content=coe))

```text
ADMINISTRATION
│
├── AD01 Administration Home
├── AD02 Chancellor
├── AD03 Vice-Chancellor
├── AD04 Registrar
├── AD05 Controller of Examinations
├── AD06 Finance Officer
├── AD07 Chief Vigilance Officer
├── AD08 Deans
├── AD09 Heads of Departments
├── AD10 Administrative Officers
├── AD11 Offices
├── AD12 Staff List
└── AD13 Contact Directory
```

### Officer detail screen

```text
Officer
│
├── Photograph
├── Name
├── Designation
├── Department / Office
├── Profile
├── Contact
└── Related Documents
```

---

# 6. Academics Module

The current Academics area explicitly includes **CBCS System, Programme, Faculty, Research and Student's Handbook**. ([Gandhigram Rural Institute](https://www.ruraluniv.ac.in/academics?content=CBCSsystem))

```text
ACADEMICS
│
├── AC01 Academics Home
│
├── AC02 Programmes
│   ├── UG
│   ├── PG
│   ├── Integrated
│   ├── Diploma
│   ├── PG Diploma
│   ├── B.Voc.
│   └── Ph.D.
│
├── AC03 Schools
│
├── AC04 Departments
│
├── AC05 Centres
│
├── AC06 Faculty
│
├── AC07 CBCS
│   ├── 2024
│   ├── 2021
│   ├── 2018
│   ├── 2015
│   └── 2008
│
├── AC08 Research
│
├── AC09 Student Handbook
│
├── AC10 Academic Calendar
│
├── AC11 Syllabus
│
├── AC12 Regulations
│
└── AC13 Academic Collaborations
```

The site currently exposes multiple CBCS versions, confirming that this needs to be a versioned document/data structure rather than one static page.

---

# 7. School → Department → Programme Flow

This is one of the most important navigation trees.

```text
Schools
   ↓
School Detail
   ↓
Departments
   ↓
Department Detail
   ↓
┌──────────────────────────────┐
│ Profile                      │
│ Faculty                      │
│ Programmes                   │
│ Research                     │
│ Facilities / Special Areas   │
│ Video Tour                   │
└──────────────────────────────┘
   ↓
Programme
   ↓
Programme Details
   ↓
Syllabus / Curriculum
```

This directly matches the structure visible in individual GRI department pages, where departments expose **Profile, Faculty, Programmes, Research and sometimes Video Tour / specialised facilities**.

---

# 8. Department Screen Template

Every department should use the same React Native component structure.

```text
Department Home
│
├── Header
│   ├── Department Name
│   └── School Name
│
├── Overview
│
├── Profile
│
├── Faculty
│
├── Programmes
│
├── Research
│
├── Facilities
│
├── Video Tour
│
└── Contact
```

This makes the app scalable when new departments are added.

---

# 9. Admissions Module

The current admissions content includes prospectus, regulations, D.Sc./D.Litt. application information, refund policy and hostel fee/policy information.

The current 2026–27 prospectus also describes multiple programme categories and admission procedures.

```text
ADMISSIONS
│
├── ADM01 Admissions Home
├── ADM02 Programmes
├── ADM03 UG Admissions
├── ADM04 PG Admissions
├── ADM05 Integrated Programmes
├── ADM06 Diploma / B.Voc.
├── ADM07 PG Diploma
├── ADM08 Ph.D.
├── ADM09 D.Sc. / D.Litt.
├── ADM10 Eligibility
├── ADM11 Admission Procedure
├── ADM12 Application Information
├── ADM13 Prospectus
├── ADM14 Fee Structure
├── ADM15 Refund Policy
├── ADM16 Hostel Fee
├── ADM17 Admission Notifications
├── ADM18 Important Dates
└── ADM19 Admission Documents
```

---

# 10. Examination Module

The live examination section currently contains **Examination System, ESE timetable, transcript application, duplicate certificate application, Ph.D. compliance certification, Ph.D. tracking and e-SANAD items**.

```text
EXAMINATION
│
├── EX01 Examination Home
├── EX02 Examination System
├── EX03 Examination Timetable
├── EX04 UG Timetable
├── EX05 PG Timetable
├── EX06 B.Voc. Timetable
├── EX07 Examination Notifications
├── EX08 Transcript Application
├── EX09 Duplicate Certificate
├── EX10 Ph.D. Compliance Certificate
├── EX11 Ph.D. Tracking
├── EX12 e-SANAD
├── EX13 e-SANAD Registration
└── EX14 Examination Documents
```

---

# 11. e-SANAD Flow

The existing e-SANAD form collects register number, name, DOB, gender, programme, school/department/centre, passing year, certificate type, communication address, email and mobile number.

```text
e-SANAD
   ↓
Registration Form
   │
   ├── Register Number
   ├── Name
   ├── DOB
   ├── Gender
   ├── Programme
   ├── School / Department / Centre
   ├── Passing Year
   ├── Certificate Type
   ├── Address
   ├── Email
   └── Mobile
          ↓
       Submit
          ↓
    Verification / Status
```

---

# 12. Facilities Module

```text
FACILITIES
│
├── Library
├── Computer Centre
├── Internet Browsing Centre
├── E-Content Development
├── Physical Education & Yoga
├── Nanoscience & Nanotechnology
├── Instrument Facility
├── XRD Facility
├── UBA / Seaweed Startup Facility
├── Museum
├── Audio Visual Centre
├── Lecture Capturing
├── Central Instrumentation Centre
├── Animal House
├── Business Lab
├── Art Gallery
├── Research Facilities
└── Theatre
```

---

# 13. Infrastructure Module

```text
INFRASTRUCTURE
│
├── Hostels
├── Guest House
├── Health Centre
├── Canteen
├── Bank
├── Day Care Centre
├── Working Women's Hostel
├── Examination Hall
├── Placement Bureau
├── Language Laboratory
├── Yoga Centre
├── Entrepreneurship Centre
├── Wi-Fi Campus
├── Post Office
├── Cooperative Store
├── KVK
├── NET Coaching Centre
├── Entry-to-Services Coaching
├── HEPSN
├── Guidance & Counselling
├── International Relations
└── Culture & Arts
```

---

# 14. Research Module

```text
RESEARCH
│
├── Home
├── Policy
├── Facilities
├── Committees
├── MoUs
├── Projects
├── Patents
├── Ph.D. Scholars
├── Publications
└── Climate Action Unit
```

---

# 15. E-News Module

```text
E-NEWS
│
├── Latest
├── Circulars
├── Announcements
├── Events
├── Careers
├── Tenders
├── News
└── Archive
    ├── 2026
    ├── 2025
    ├── 2024
    ├── 2023
    └── ...
```

---

# 16. Alumni Module

```text
ALUMNI
│
├── AL01 Alumni Home
├── AL02 About Alumni Cell
├── AL03 Alumni Registration
├── AL04 Alumni Login
├── AL05 Alumni Profile
├── AL06 Alumni Network
├── AL07 Distinguished Alumni
├── AL08 Alumni Awards
├── AL09 Alumni Events
├── AL10 Reunions
├── AL11 Gallery
├── AL12 Alumni Contributions
├── AL13 RaiseGRI
└── AL14 Contact Alumni Cell
```

---

# 17. Student Portal

```text
STUDENT
│
├── ST01 Login
├── ST02 Forgot Password
├── ST03 Dashboard
├── ST04 Profile
├── ST05 Academic Details
├── ST06 Courses
├── ST07 Attendance
├── ST08 Timetable
├── ST09 Internal Marks
├── ST10 Examination
├── ST11 Results
├── ST12 Fees
├── ST13 Notifications
├── ST14 Documents
└── ST15 Logout
```

---

# 18. Scholar Portal

```text
SCHOLAR
│
├── Login
├── Forgot Password
├── Dashboard
├── Profile
├── Ph.D. Tracking
├── Research Information
├── Documents
└── Logout
```

---

# 19. Department Portal

```text
DEPARTMENT PORTAL
│
├── Login
├── Dashboard
│
├── Department
│   ├── Profile
│   ├── Faculty
│   └── Programmes
│
├── Students
│
├── Courses
│
├── Research
│
├── Notifications
│
└── Documents
```

---

# 20. Recommended Bottom Navigation

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

---

# 21. Logical Screen Summary (~220+ Routes)

| Module | Logical Screens / Templates |
| --- | ---: |
| Home / Search / Notifications | 16 |
| About GRI | 15 |
| Governance | 10 |
| Administration | 13 |
| Academics & Schools | 13 |
| Departments | 7 Reusable Templates |
| Admissions | 19 |
| Examination | 14 |
| Facilities | 17 Reusable Detail Views |
| Infrastructure | 20 Reusable Detail Views |
| Research | 10 |
| E-News Archives | 8 |
| Alumni Cell | 14 |
| Authentication | 10 |
| Student Portal | 15 |
| Scholar Portal | 8 |
| Department Portal | 9 |
| **Total Logical Routes** | **~220+** |
