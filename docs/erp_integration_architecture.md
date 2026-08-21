# Enterprise ERP Integration Middleware Architecture
## Interfacing Legacy GRI ERP Systems (Samarth@GRI & GRIIMS1) with Flutter Mobile App
**Author**: Senior Enterprise Architect (Vijay Mahes)  
**Version**: 1.0.0  

---

## 1. System Integration Overview

The **GRI ERP Middleware** acts as a high-performance adapter layer between legacy university ERP systems (**Samarth@GRI** and **GRIIMS1**) and the Flutter mobile/web clients. It provides bidirectional synchronization, offline outbox processing, automatic conflict resolution, real-time webhook listeners, and Redis query caching.

```mermaid
flowchart LR
    Client[Flutter App] --> Gateway[FastAPI API Gateway]
    
    subgraph Middleware Layer
        Gateway --> Cache[Redis Cache]
        Gateway --> SyncEngine[ERP Sync & Conflict Engine]
        SyncEngine --> Outbox[PostgreSQL Outbox Queue]
    end

    subgraph Legacy ERP Domain
        SyncEngine --> SamarthAdapter[Samarth@GRI REST Adapter]
        SyncEngine --> GRIIMSAdapter[GRIIMS1 SOAP / DB Adapter]
    end

    SamarthERP[(Samarth ERP DB)] <--> SamarthAdapter
    GRIIMSERP[(GRIIMS1 Legacy DB)] <--> GRIIMSAdapter
    
    SamarthERP -. Real-time Webhooks .-> Gateway
```

---

## 2. Bidirectional Sync & Domain Adapters

| ERP Domain | Legacy System | Sync Direction | Frequency | Conflict Strategy |
|---|---|---|---|---|
| **Student Profiles** | Samarth@GRI | ERP → Mobile App | Hourly / On-demand | ERP Wins (Source of Truth) |
| **Classroom Attendance** | GRI Attendance Portal | Mobile App ⇄ ERP | Real-time | Latest Timestamp Wins |
| **Exam Marks & Grades** | GRIIMS1 | ERP → Mobile App | Daily during exams | ERP Wins (Signed Grade Sheet) |
| **Fee Payment Receipts** | Samarth Financials | Mobile App ⇄ ERP | Instant Webhook | Dual-Commit Verification |
| **Hostel Out-Passes** | Mobile App | Mobile App ⇄ ERP | Real-time Webhook | Warden Signed Digital Pass |
| **Library OPAC** | Central Library DB | Mobile App ⇄ ERP | Real-time | Item Status Lock |

---

## 3. Offline Outbox Queue & Conflict Resolution

1. **Offline Queuing**: When the Flutter app is offline, write operations (e.g. out-pass applications or survey logs) are persisted locally in `Drift SQLite`.
2. **Reconciliation**: Upon network recovery, queued events are dispatched to `/api/v1/erp/sync`.
3. **Conflict Resolution Matrix**:
   - **Financial/Grade Records**: Authoritative ERP record supersedes mobile state (`Server-Wins`).
   - **Attendance/Outreach Logs**: `Vector Clock` timestamp reconciliation with audit log override.
   - **Error Circuit Breaker**: Failed ERP API requests retry using **exponential backoff** with max 5 retries before alerting admin via Sentry.

---
*End of GRI ERP Integration Architecture Specification.*
