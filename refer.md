# GRI UNIVERSITY SUPER-APP — COMPLETE MOBILE APPLICATION TRANSFORMATION

## PROJECT TITLE

**GRI One — Gandhigram Rural Institute Unified Digital University Application**

Build a complete, production-ready **mobile-first university application** for:

**The Gandhigram Rural Institute (Deemed to be University)**
Official reference website: **https://ruraluniv.ac.in/**

IMPORTANT:

Do NOT build only the Student Portal.

Do NOT simply wrap the existing website inside a WebView.

Do NOT create a basic website-to-mobile conversion.

Instead, transform the **entire university digital ecosystem** represented by the official GRI website and its connected portals into a modern, unified, scalable, secure and adaptive mobile application.

The application should behave like a complete **University Super-App**.

---

# 1. PRIMARY OBJECTIVE

Create one unified application that brings together:

* Official university website information
* Student services
* Academic services
* Admissions
* Examination
* Results
* Fees and payments
* Attendance
* Learning Management System
* Research scholar services
* Hostel services
* Faculty services
* Department services
* Administration services
* Library
* Infrastructure
* Campus services
* Events
* News
* Circulars
* Notifications
* Careers
* Alumni
* Placements
* Grievances
* Scholarships
* Certificates
* Documents
* University contacts
* Emergency information
* AI university assistant
* Personalized dashboards

The final application must feel like a single coherent product instead of multiple disconnected portals.

---

# 2. OFFICIAL SOURCE-FIRST REQUIREMENT

Use the official GRI website as the primary source of truth:

https://ruraluniv.ac.in/

Study the complete website structure before implementation.

Do not assume that only the visible homepage is required.

Inspect and map:

* Homepage
* About GRI
* Governance
* Administration
* Academics
* Admissions
* Examination
* Facilities
* Infrastructure
* Alumni
* E-News
* Student Corner
* Circulars
* Events
* Tenders
* Careers
* Library
* Departments
* Centres
* Notifications
* Announcements
* Academic information
* Admission information
* Student services
* Connected portals

Also inspect the connected GRI portals and map their functionality.

Known portal categories include:

* Student Portal
* Research Scholar Portal
* Hostel Portal
* Learning Management System
* Attendance Portal
* Pensioner Portal
* G-Track/File Tracking
* Department Portal
* Ph.D. Evaluation Portal

Do not hard-code only today's content.

Design the architecture so that future university pages, departments, programmes, services and portals can be added without rebuilding the application.

---

# 3. IMPORTANT PRODUCT PRINCIPLE

The application must have TWO layers:

## Layer A — PUBLIC UNIVERSITY

Available without login.

Include:

* University home
* About
* Vision and mission
* Administration
* Governance
* Academics
* Departments
* Programmes
* Admissions
* Notifications
* Circulars
* Events
* News
* Careers
* Tenders
* Infrastructure
* Facilities
* Library
* Alumni
* Contact
* Campus information
* Important links
* Emergency contacts

## Layer B — AUTHENTICATED UNIVERSITY SERVICES

Available according to user role.

Roles:

1. Student
2. Faculty
3. Research Scholar
4. Department Administrator
5. Examination Staff
6. Hostel Staff
7. Finance Staff
8. University Administrator
9. Librarian
10. Placement Officer
11. Alumni
12. Pensioner
13. System Administrator

Each role must receive a different dashboard and permissions.

---

# 4. MOBILE APPLICATION INFORMATION ARCHITECTURE

Use a modern bottom-navigation architecture.

Recommended primary navigation:

### Home

University overview and personalized information.

### Academics

Courses, timetable, attendance, LMS, examinations, results.

### Services

Fees, certificates, grievances, hostel, library, documents, applications.

### Discover

News, events, departments, programmes, campus, infrastructure, alumni.

### Profile

User identity, settings, security, notifications and account information.

Do not expose every feature directly in bottom navigation.

Use:

* Dashboard cards
* Search
* Categories
* Quick actions
* Role-based modules
* Contextual shortcuts

---

# 5. PUBLIC HOME SCREEN

Create a premium university home screen.

Sections:

### Header

* GRI logo
* University name
* Search
* Notification icon
* Language selector

### Hero section

Display:

* University identity
* Important announcements
* Admission highlights
* Events

Use a dynamic carousel.

### Quick Actions

Examples:

* Admissions
* Results
* Examination
* Student Portal
* LMS
* Fees
* Attendance
* Library
* Notifications
* Contact

### Latest Updates

Categories:

* News
* Circulars
* Events
* Careers
* Tenders

### Academic Discovery

Show:

* UG programmes
* PG programmes
* Ph.D.
* Diploma programmes
* Certificate programmes
* Centres
* Departments

### Campus

Show:

* Infrastructure
* Hostels
* Library
* Laboratories
* Sports
* Campus facilities

### Footer

Include:

* Official contact
* Address
* Important links
* Social links
* Policies
* Accessibility
* Privacy
* Terms

---

# 6. GLOBAL SEARCH

Implement university-wide search.

Search across:

* Pages
* Departments
* Courses
* Programmes
* Faculty
* Notifications
* Circulars
* Events
* Documents
* Services
* FAQs
* Contacts

Provide:

* Search suggestions
* Recent searches
* Filters
* Category filters
* Date filters
* Voice search readiness

The search architecture must be scalable.

---

# 7. STUDENT APPLICATION

The Student module must completely replace the existing student portal experience with a mobile-native experience.

Current student functionality should be represented, including:

* Profile
* Semester fees
* Supplementary fees
* CFA marks
* Payment history
* Results
* Grievances
* Downloads
* Useful links
* SC/ST grievances
* Feedback

Expand it into a complete student ecosystem.

---

# 8. STUDENT DASHBOARD

Display:

* Student name
* Photo
* Registration number
* Programme
* Department
* Current semester
* Academic year

Dashboard cards:

* Attendance
* Current GPA/CGPA
* Results
* Fees
* Timetable
* Exams
* Assignments
* LMS
* Notifications
* Events
* Hostel
* Library
* Certificates
* Grievances

Use data-driven cards.

If a service has no data, show a meaningful empty state instead of broken UI.

---

# 9. DIGITAL STUDENT ID

Create a digital student identity.

Include:

* Student photograph
* Name
* Registration number
* Programme
* Department
* Academic year
* Validity
* QR code
* University branding

QR code should be designed for future verification.

Support:

* Digital ID
* QR verification
* Offline cached identity
* Secure token-based validation

---

# 10. ACADEMICS MODULE

Create a complete academic management experience.

Features:

* Programme
* Department
* Semester
* Subjects
* Credits
* Course teachers
* Timetable
* Academic calendar
* Course materials
* Assignments
* Internal assessment
* CFA
* Attendance
* Results
* Academic progress

Provide semester-wise academic history.

---

# 11. ATTENDANCE

Create mobile attendance dashboard.

Display:

* Overall attendance
* Subject-wise attendance
* Monthly attendance
* Semester attendance
* Attendance percentage
* Classes attended
* Classes missed
* Attendance warnings

Visualize using:

* Progress indicators
* Charts
* Calendar
* Subject cards

Add configurable attendance threshold notifications.

Example:

"Attendance below configured university threshold."

Do not hard-code a threshold if the backend can provide it.

---

# 12. EXAMINATION MODULE

Include:

* Examination notifications
* Exam registration
* Exam timetable
* Hall ticket
* Examination fees
* Internal marks
* CFA marks
* Semester results
* Supplementary examination
* Revaluation
* Results history

Provide downloadable documents.

---

# 13. RESULTS

Create a complete result experience.

Display:

* Semester
* Subject
* Grade
* Grade point
* Credits
* Result status
* SGPA
* CGPA

Provide:

* Semester comparison
* Academic progress
* Download result
* Share/verify result where authorized

---

# 14. FEES AND PAYMENTS

Create a secure fee management module.

Categories:

* Semester fee
* Examination fee
* Supplementary fee
* Hostel fee
* Mess fee
* Other university fees

Display:

* Pending amount
* Paid amount
* Payment history
* Receipts
* Due dates

Payment architecture:

* Secure payment gateway
* Server-side verification
* Transaction ID
* Payment status
* Receipt generation
* Retry failed payment

Never store raw card information.

---

# 15. LMS

Integrate the university Learning Management System.

Features:

* Courses
* Course materials
* Video lectures
* PDFs
* Assignments
* Submission
* Quizzes
* Announcements
* Course progress

If the existing LMS provides APIs, integrate through APIs.

Do not duplicate LMS data unnecessarily.

---

# 16. RESEARCH SCHOLAR MODULE

Create a dedicated research dashboard.

Features:

* Scholar profile
* Research programme
* Supervisor
* Coursework
* Examination fees
* Supplementary fees
* Research progress
* Publications
* Conferences
* Thesis/dissertation
* Research notifications
* Viva information
* Research documents
* Fellowship information

Support future research-management integrations.

---

# 17. HOSTEL MODULE

Create complete hostel functionality.

Features:

* Hostel admission
* Hostel application
* Room allocation
* Hostel details
* Mess fees
* Hostel fees
* Payment status
* Hostel rules
* Notices
* Complaints
* Leave requests
* Hostel notifications

Support both:

* Boys hostel
* Girls hostel

Use configurable hostel structures.

---

# 18. FACULTY MODULE

Create faculty dashboard.

Features:

* Faculty profile
* Timetable
* Assigned courses
* Student lists
* Attendance marking
* Attendance reports
* Internal marks
* CFA
* Assignments
* LMS
* Announcements
* Academic calendar
* Leave
* Research
* Publications
* Department communication

Attendance functionality must support secure role-based authorization.

---

# 19. DEPARTMENT MODULE

Every department should have a configurable profile.

Department page:

* Department name
* About
* Vision
* Mission
* Programmes
* Faculty
* Courses
* Research
* Publications
* Laboratories
* Events
* News
* Notices
* Contact
* Downloads

Do NOT hard-code departments individually.

Create a reusable Department schema.

---

# 20. ADMINISTRATION MODULE

University administrators need:

* Dashboard
* User management
* Departments
* Programmes
* Notifications
* Circulars
* Events
* Admissions
* Examination
* Fees
* Reports
* Grievances
* Content management
* Audit logs
* System health

Use granular RBAC.

---

# 21. ADMISSIONS

Build a complete admission experience.

Current GRI admission functionality includes online application workflows and programme selection.

The app must support:

* Admission notifications
* Programme discovery
* Eligibility
* Prospectus
* Application
* Registration
* Document upload
* Application tracking
* Payment
* Application status
* Merit/selection information
* Admission confirmation

Application forms must be dynamically configurable.

Do not hard-code fields for only one academic year.

Support:

* UG
* PG
* Ph.D.
* Diploma
* Certificate
* Other future programmes

---

# 22. DOCUMENT MANAGEMENT

Create a central document area.

Documents can include:

* Hall tickets
* Fee receipts
* Results
* Certificates
* Admission documents
* Circulars
* Prospectus
* Forms
* Academic documents

Features:

* Download
* Preview
* Share
* Search
* Filter
* Secure access

Use signed URLs or secure document APIs.

---

# 23. GRIEVANCE SYSTEM

Build a complete grievance platform.

Users can:

* Create grievance
* Select category
* Add description
* Attach documents/images
* Track status
* View responses
* Reopen where permitted
* Give feedback

Statuses:

* Submitted
* Received
* Under Review
* Assigned
* In Progress
* Resolved
* Closed

Add department-level routing.

---

# 24. NOTIFICATION ENGINE

Build centralized notifications.

Categories:

* Academic
* Examination
* Fees
* Admission
* Hostel
* LMS
* Department
* Research
* Events
* Emergency
* General

Support:

* Push notifications
* In-app notifications
* Email integration
* Deep links
* Read/unread
* Notification preferences

Admins must be able to schedule notifications.

---

# 25. NEWS / CIRCULARS / EVENTS

Create separate content modules.

### News

* Title
* Image
* Description
* Date
* Category
* Related links

### Circulars

* Title
* Date
* Department
* PDF
* Priority

### Events

* Event title
* Date
* Time
* Venue
* Description
* Registration
* Organizer

Allow admin content management.

---

# 26. LIBRARY

Create a library module.

Potential features:

* Search catalogue
* Books
* Journals
* E-resources
* Digital library links
* Borrowed books
* Due dates
* Fines
* Library notifications
* Research resources

Integrate existing library systems where APIs are available.

---

# 27. CAMPUS / INFRASTRUCTURE

Create a campus discovery module.

Include:

* Campus map
* Academic buildings
* Departments
* Hostels
* Library
* Laboratories
* Administrative buildings
* Food facilities
* Sports
* Health facilities
* Important locations

Make the map architecture replaceable so Google Maps/OpenStreetMap/Mapbox can be integrated later.

---

# 28. CAMPUS NAVIGATION

Add:

* Search location
* Directions
* Building details
* Walking route
* Accessibility information
* Emergency locations

Future-ready architecture:

* Indoor navigation
* QR-based location
* BLE beacons
* AR navigation

---

# 29. PLACEMENT MODULE

Create a complete placement ecosystem.

Features:

* Placement announcements
* Companies
* Job openings
* Eligibility
* Application
* Application status
* Aptitude preparation
* Interview preparation
* Placement calendar
* Selected students
* Placement statistics

Future-ready:

* AI resume analysis
* Job matching
* Skill-gap analysis
* Mock interviews

---

# 30. ALUMNI MODULE

Features:

* Alumni registration
* Alumni profile
* Batch
* Department
* Profession
* Networking
* Events
* Contributions
* Mentoring
* Jobs
* Alumni announcements

Add privacy controls.

---

# 31. CAREERS

Create public careers section.

Include:

* Job notifications
* Recruitment
* Eligibility
* Application
* Deadlines
* Documents
* Results
* Interview information

---

# 32. SCHOLARSHIPS

Create scholarship discovery and tracking.

Features:

* Scholarship list
* Eligibility
* Deadline
* Application link
* Required documents
* Status
* Notifications

Support government and university scholarships.

---

# 33. AI UNIVERSITY ASSISTANT

Build an AI assistant specifically for GRI.

Name:

**GRI AI Assistant**

Capabilities:

* Answer university questions
* Explain regulations
* Find departments
* Find programmes
* Explain admission process
* Find examination information
* Find notices
* Search university documents
* Answer student-service questions
* Guide users through application features

Architecture:

LLM
+
RAG
+
Document ingestion
+
Vector database
+
Metadata filtering
+
Permission-aware retrieval

IMPORTANT:

The AI must NOT invent university policies.

For policy/regulation questions:

* Retrieve official source
* Cite source
* Show document/date when possible
* State uncertainty when source is unavailable

---

# 34. AI RAG DATA PIPELINE

Create ingestion pipeline:

Official website
↓
Crawler/API connector
↓
HTML/PDF/document extraction
↓
Cleaning
↓
Chunking
↓
Metadata
↓
Embeddings
↓
Vector database
↓
Retriever
↓
Reranker
↓
LLM
↓
Grounded answer

Metadata should include:

* Source URL
* Page title
* Department
* Category
* Publication date
* Updated date
* Document type
* Academic year
* Language
* Access level

---

# 35. MULTI-LANGUAGE

Support:

* English
* Tamil

Design for future languages.

Do not duplicate application logic for each language.

Use localization files.

---

# 36. ACCESSIBILITY

Target modern accessibility standards.

Include:

* Large text support
* Screen reader support
* High contrast
* Accessible buttons
* Proper labels
* Keyboard support where applicable
* Semantic navigation
* Reduced motion option

---

# 37. OFFLINE-FIRST CAPABILITIES

The app should continue working when connectivity is weak.

Cache:

* Profile
* Digital ID
* Timetable
* Recent notifications
* Recent results
* Important documents
* University information

Clearly distinguish:

ONLINE DATA

from

CACHED DATA.

Never present stale sensitive data as live data.

---

# 38. SECURITY

Implement production-grade security.

Authentication:

* JWT or secure session architecture
* Refresh tokens
* Secure token storage
* MFA-ready
* Password reset
* Device/session management

Authorization:

RBAC
+
Permission-based access.

Security requirements:

* HTTPS
* API validation
* Input sanitization
* Rate limiting
* CSRF protection where applicable
* Secure file upload
* Malware scanning architecture
* SQL/NoSQL injection protection
* Audit logs
* Session expiration
* Device logout
* Encryption for sensitive data

Never store passwords in plaintext.

---

# 39. PRIVACY

Follow privacy-by-design principles.

Collect only necessary information.

Provide:

* Privacy policy
* Data usage explanation
* Account controls
* Notification controls
* Logout all devices
* Data access controls

Sensitive academic information must never be exposed through public APIs.

---

# 40. API ARCHITECTURE

Create a clean backend API architecture.

Recommended:

REST API initially.

Future-ready:

GraphQL gateway if required.

API domains:

/auth
/users
/students
/faculty
/scholars
/departments
/programmes
/academics
/courses
/attendance
/examinations
/results
/fees
/payments
/lms
/hostel
/library
/admissions
/grievances
/notifications
/news
/events
/circulars
/careers
/alumni
/placements
/documents
/search
/ai

Version APIs:

/api/v1/...

Never couple mobile UI directly to database.

---

# 41. RECOMMENDED TECH STACK

## Mobile

Use:

**React Native + Expo**

with:

* TypeScript
* Expo Router
* React Query/TanStack Query
* Zustand
* React Hook Form
* Zod
* NativeWind/Tailwind
* React Native Reanimated
* React Native Gesture Handler
* Expo SecureStore
* Expo Notifications
* Expo FileSystem
* Expo Camera
* Expo Location

Do NOT use Flutter.

Do NOT leave old Flutter code in the project.

If an existing Flutter application exists, migrate the functionality and data model to React Native instead of maintaining two mobile frameworks.

---

# 42. BACKEND

Recommended:

**FastAPI / Python**

or a modular Node.js backend if existing infrastructure requires it.

Use:

* PostgreSQL
* Redis
* Object storage
* Background workers
* REST APIs
* WebSocket where required

Architecture:

Mobile App
↓
API Gateway
↓
Authentication
↓
Backend Services
↓
PostgreSQL / Redis / Object Storage
↓
External University Systems

---

# 43. DATABASE

Use PostgreSQL.

Core entities:

User
Role
Permission
Student
Faculty
ResearchScholar
Department
Programme
Course
Semester
Subject
Attendance
Mark
Result
Fee
Payment
Admission
Application
Hostel
Room
LibraryItem
BookTransaction
Notification
News
Circular
Event
Grievance
Document
Placement
Company
Alumni
Research
Publication
Scholarship
AuditLog

Use UUIDs where appropriate.

Create proper indexes.

Use foreign-key relationships.

Avoid duplicated data.

---

# 44. INTEGRATION ARCHITECTURE

IMPORTANT:

The existing GRI systems may be separate legacy applications.

Do NOT attempt to directly rewrite every legacy database immediately.

Create an integration layer.

Architecture:

GRI Mobile App
↓
GRI API Gateway
↓
Integration Services
↓
Existing GRI Portals / Databases / APIs

Where APIs exist:

Use APIs.

Where APIs do not exist:

Create a secure adapter/service.

Where direct database integration is unavoidable:

Use read-only or tightly controlled service accounts.

Never expose legacy databases directly to the mobile application.

---

# 45. CMS

Create an administration CMS.

Authorized staff should be able to manage:

* News
* Circulars
* Events
* Announcements
* Departments
* Programmes
* Documents
* Admission information
* Important links

Content should be data-driven.

Do not hard-code university content into React Native screens.

---

# 46. DESIGN SYSTEM

Create a reusable GRI design system.

Components:

* Button
* Input
* Search
* Card
* List
* Avatar
* Badge
* Chip
* Modal
* Bottom sheet
* Tabs
* Accordion
* Calendar
* Progress
* Chart
* Empty state
* Error state
* Skeleton loader
* Toast
* Dialog
* Document viewer

Define:

* Typography
* Spacing
* Radius
* Elevation
* Iconography
* Motion
* Light theme
* Dark theme

Use GRI branding while modernizing the visual language.

Do not simply copy the old website's visual design.

---

# 47. RESPONSIVE / ADAPTIVE REQUIREMENT

The application must automatically adapt to:

* Small Android phones
* Large Android phones
* iPhones
* Tablets
* Foldable devices
* Different screen densities
* Portrait
* Landscape

Use responsive layout primitives.

Never rely on fixed pixel positions.

---

# 48. PERFORMANCE

Target:

* Fast startup
* Lazy loading
* Code splitting
* Image optimization
* Pagination
* Query caching
* Offline caching
* Skeleton loading
* Optimized API calls

Do not load the entire university database on application startup.

---

# 49. ERROR HANDLING

Every feature must handle:

* No internet
* API timeout
* Server error
* Unauthorized access
* Expired session
* Empty data
* Invalid input
* Payment failure
* Upload failure
* Download failure

Never show raw exceptions to users.

Create human-readable error states.

---

# 50. ADAPTIVE ARCHITECTURE

The system must be:

### Adaptable

University can change rules, departments, programmes and academic years without application rewrites.

### Flexible

New modules can be added as plugins.

### Scalable

Architecture must support increasing students, faculty and traffic.

### Reliable

Critical services must support retries, monitoring and graceful degradation.

### Maintainable

Separate UI, domain logic, API and data layers.

### Extensible

Future modules should be installable without rewriting the core application.

---

# 51. PLUGIN ARCHITECTURE

Create module registry architecture.

Example:

modules/

student
faculty
research
hostel
library
placements
alumni
admissions
examination
lms
attendance

Each module should define:

* Routes
* Permissions
* API services
* Screens
* Navigation
* Notifications

This allows future GRI modules to be added independently.

---

# 52. FEATURE FLAGS

Implement feature flags.

Examples:

ENABLE_HOSTEL
ENABLE_ALUMNI
ENABLE_PLACEMENT
ENABLE_AI
ENABLE_LIBRARY
ENABLE_RESEARCH
ENABLE_ONLINE_PAYMENT

Administrators can enable/disable modules without rebuilding the mobile application where practical.

---

# 53. ACADEMIC YEAR CONFIGURATION

Do NOT hard-code:

2025-26
2026-27
etc.

Create:

AcademicYear
Semester
AdmissionCycle
ExaminationCycle

The system must support future years automatically.

---

# 54. DATA SYNCHRONIZATION

Build synchronization services.

Example:

Legacy Portal
↓
Integration Adapter
↓
Normalization
↓
GRI Unified Data Model
↓
API
↓
Mobile App

Handle:

* Sync timestamps
* Conflicts
* Retry
* Failure queues
* Data freshness
* Audit records

---

# 55. ADMIN ANALYTICS

Create administrator dashboards.

Metrics:

* Active users
* App users
* Attendance statistics
* Fee collection
* Admission applications
* Exam participation
* Grievances
* Hostel occupancy
* LMS activity
* Placement activity

Use charts and filters.

Do not expose sensitive student analytics to unauthorized roles.

---

# 56. MONITORING

Production architecture should include:

* Application logs
* API logs
* Error tracking
* Performance monitoring
* Database monitoring
* Uptime monitoring
* Security alerts

Create health endpoints.

Example:

/health
/readiness
/liveness

---

# 57. TESTING

Implement:

### Unit tests

Business logic.

### Integration tests

API + database.

### Component tests

Mobile UI.

### End-to-end tests

Critical flows:

* Login
* Student dashboard
* Attendance
* Results
* Fee payment
* Admission
* Grievance
* Document download

### Security testing

Authentication
Authorization
Input validation
File upload
API security

---

# 58. CRITICAL USER FLOWS

Fully test:

## Student

Login
→ Dashboard
→ Attendance
→ Results
→ Fees
→ Payment
→ Receipt

## Admission

Programme
→ Eligibility
→ Registration
→ Application
→ Documents
→ Payment
→ Status

## Faculty

Login
→ Course
→ Student list
→ Attendance
→ Submit
→ Confirmation

## Research Scholar

Login
→ Profile
→ Coursework
→ Fees
→ Research information
→ Documents

## Hostel

Login
→ Hostel
→ Room
→ Fees
→ Mess
→ Complaint

## Grievance

Create
→ Submit
→ Track
→ Response
→ Resolve

---

# 59. DEEP LINKING

Implement deep links.

Examples:

gri://student/results
gri://student/attendance
gri://admission/application
gri://notification/123

Also support universal/app links where possible.

Notifications should open the relevant screen directly.

---

# 60. PUSH NOTIFICATION EXAMPLES

When:

* New circular published
* Exam timetable released
* Result published
* Fee due
* Admission deadline approaching
* Hostel notice published
* Grievance updated
* Placement opportunity published

The notification should deep-link to the correct screen.

---

# 61. DO NOT FAKE LIVE DATA

During development:

Use clearly labelled mock data.

Example:

"Demo Data"

Never make fake data appear to be official university data.

Create mock repositories that can later be replaced by real APIs.

---

# 62. WEBSITE CONTENT MIGRATION

Do not manually copy a few pages and call the project complete.

Create a content extraction/migration plan.

For every official website section:

1. Identify URL
2. Identify content type
3. Identify data fields
4. Identify update frequency
5. Identify access requirements
6. Map to mobile screen
7. Map to backend entity
8. Determine API/integration strategy

Create a source-to-module mapping document.

---

# 63. WEBSITE → APP MAPPING

Create this mapping:

Official Website
→ Mobile App

Homepage
→ University Home

About
→ About GRI

Governance
→ Governance

Administration
→ Administration

Academics
→ Academics

Admissions
→ Admissions

Examination
→ Examination

Facilities
→ Campus & Facilities

Infrastructure
→ Campus

Alumni
→ Alumni

E-News
→ News

Student Corner
→ Student Services

Student Portal
→ Student App

Research Scholar Portal
→ Research Module

Hostel Portal
→ Hostel Module

LMS
→ Learning Module

Attendance Portal
→ Faculty Attendance

G-Track
→ Administrative Tracking

Department Portal
→ Department Services

Ph.D Evaluation
→ Examination/Research Administration

---

# 64. SECURITY OF PORTAL INTEGRATION

Never bypass university authentication.

If an existing portal has:

* Username
* Password
* Captcha
* Session
* OTP
* MFA

Respect its security model.

Do not scrape authenticated pages in the mobile application.

Prefer official APIs or approved integration services.

---

# 65. PROJECT STRUCTURE

Create a professional monorepo:

apps/
mobile/
admin/

services/
api/
ai/
ingestion/
notifications/
integration/

packages/
ui/
types/
config/
api-client/
auth/
validation/

infra/
docker/
database/
nginx/
monitoring/

docs/
architecture/
api/
database/
integrations/
security/
deployment/

---

# 66. MOBILE STRUCTURE

Use:

app/
_layout.tsx
index.tsx

(public)/
(auth)/
(student)/
(faculty)/
(research)/
(hostel)/
(admin)/
(alumni)/

components/
features/
hooks/
services/
store/
lib/
utils/
constants/
assets/
locales/

Keep feature-specific logic inside feature modules.

---

# 67. DEVELOPMENT PHASES

## PHASE 0 — RESEARCH

Analyze the entire official website and portal ecosystem.

Deliver:

* Website map
* Portal map
* Feature inventory
* Role inventory
* Data inventory
* Integration inventory

Do not code yet.

---

## PHASE 1 — ARCHITECTURE

Create:

* System architecture
* Database architecture
* API architecture
* Authentication architecture
* RBAC
* Integration architecture
* AI architecture

---

## PHASE 2 — DESIGN SYSTEM

Create:

* Design tokens
* Navigation
* Components
* Typography
* Cards
* Forms
* Dashboards
* Dark mode
* Accessibility

---

## PHASE 3 — PUBLIC APPLICATION

Build:

* Home
* About
* Governance
* Administration
* Academics
* Departments
* Admissions
* Examination
* Facilities
* Infrastructure
* News
* Circulars
* Events
* Careers
* Alumni
* Contact

---

## PHASE 4 — AUTHENTICATION

Implement:

* Login
* Logout
* Forgot password
* Session management
* Role detection
* Secure token storage
* RBAC

---

## PHASE 5 — STUDENT

Build complete Student Super-App.

---

## PHASE 6 — FACULTY

Build complete Faculty module.

---

## PHASE 7 — RESEARCH

Build Research Scholar module.

---

## PHASE 8 — HOSTEL

Build Hostel module.

---

## PHASE 9 — ACADEMICS + LMS + EXAMINATION

Integrate academic services.

---

## PHASE 10 — ADMINISTRATION

Build CMS and admin dashboard.

---

## PHASE 11 — AI

Implement GRI AI Assistant + RAG.

---

## PHASE 12 — INTEGRATIONS

Connect official systems through APIs/adapters.

---

## PHASE 13 — SECURITY

Perform security audit.

---

## PHASE 14 — TESTING

Perform complete QA.

---

## PHASE 15 — DEPLOYMENT

Prepare:

* Android
* iOS
* Backend
* Database
* Admin panel
* Monitoring
* CI/CD

---

# 68. CI/CD

Create:

GitHub repository
→ Pull Request
→ Automated tests
→ Lint
→ Type checking
→ Security scan
→ Build
→ Staging
→ Approval
→ Production

Use environment separation:

.env.development
.env.staging
.env.production

Never commit secrets.

---

# 69. ENVIRONMENT CONFIGURATION

Create:

API_BASE_URL
AUTH_SERVICE_URL
AI_SERVICE_URL
STORAGE_URL
MAP_PROVIDER
PUSH_NOTIFICATION_CONFIG

All environment-dependent values must be configurable.

---

# 70. DATABASE MIGRATIONS

Use migration tooling.

Never manually alter production schemas.

Provide:

* Initial schema
* Seed data
* Migration scripts
* Rollback strategy

---

# 71. BACKUP AND DISASTER RECOVERY

Implement:

* Automated database backup
* Backup verification
* Recovery procedure
* Object-storage backup
* Disaster recovery documentation

Critical university data must not depend on a single machine.

---

# 72. API DOCUMENTATION

Generate:

OpenAPI documentation.

For every endpoint document:

* Request
* Response
* Authentication
* Permissions
* Errors
* Example

---

# 73. FINAL QUALITY STANDARD

The application must NOT look like:

* A website inside an app
* A WebView
* A basic college project
* A static prototype
* A collection of unrelated screens

It must look like:

**A professional modern university digital platform.**

Think:

University Super-App
+
ERP
+
LMS
+
Student Portal
+
Research Portal
+
Campus App
+
Digital Identity
+
AI Assistant

in one ecosystem.

---

# 74. AUTOMATIC ADAPTABILITY REQUIREMENT

The application must automatically adapt to changes in:

* Academic year
* Departments
* Programmes
* Semesters
* University rules
* Notifications
* Portal modules
* User roles
* Content
* API availability
* Feature flags

Avoid hard-coded business rules.

Use:

configuration
+
backend-driven data
+
feature flags
+
role permissions
+
dynamic forms
+
dynamic navigation

---

# 75. FINAL ACCEPTANCE CRITERIA

The project is NOT complete until:

[ ] Entire official website has been mapped

[ ] All major website sections have mobile equivalents

[ ] All relevant portals have been mapped

[ ] Student Portal has been transformed into native mobile UX

[ ] Research Scholar Portal integrated

[ ] Hostel Portal integrated

[ ] LMS integrated

[ ] Attendance integrated

[ ] Department services integrated

[ ] Administration functions implemented

[ ] Admissions implemented

[ ] Examination implemented

[ ] Results implemented

[ ] Fees implemented

[ ] Grievances implemented

[ ] Notifications implemented

[ ] News implemented

[ ] Events implemented

[ ] Careers implemented

[ ] Alumni implemented

[ ] Library implemented

[ ] Campus/infrastructure implemented

[ ] Digital student ID implemented

[ ] AI assistant implemented

[ ] RAG implemented

[ ] RBAC implemented

[ ] Security implemented

[ ] Offline support implemented

[ ] Tamil + English implemented

[ ] Accessibility implemented

[ ] Admin CMS implemented

[ ] Analytics implemented

[ ] Monitoring implemented

[ ] Automated tests implemented

[ ] CI/CD implemented

[ ] Production deployment documented

---

# 76. MOST IMPORTANT INSTRUCTION TO ANTIGRAVITY

Before changing or generating code:

1. Inspect the existing project.
2. Identify whether Flutter, React Native, web, backend or static Markdown files already exist.
3. Preserve useful existing data and business requirements.
4. Remove obsolete Flutter implementation if React Native is the target.
5. Do not blindly overwrite existing working functionality.
6. Create a migration plan.
7. Build incrementally.
8. Run tests after each major module.
9. Verify every route.
10. Verify every API.
11. Verify authentication.
12. Verify permissions.
13. Verify responsive layouts.
14. Verify offline behavior.
15. Verify error handling.

If a feature cannot yet connect to a real GRI backend, create a clean API abstraction and mock implementation.

Never hard-code fake production data into the final architecture.

---

# 77. FINAL COMMAND

BUILD THIS AS A REAL PRODUCTION-READY UNIVERSITY APPLICATION.

Do not stop after creating screens.

Implement:

**Research → Architecture → UI/UX → Database → APIs → Authentication → RBAC → Integrations → Mobile App → Admin → AI → Testing → Security → Deployment.**

The final result must be a scalable:

# "GRI ONE — UNIFIED UNIVERSITY SUPER-APP"

that converts the complete GRI digital ecosystem into a modern mobile-first platform rather than merely converting the existing Student Portal.
